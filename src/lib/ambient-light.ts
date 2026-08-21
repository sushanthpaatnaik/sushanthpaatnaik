/**
 * Ambient light as an *enhancement* to Auto — never as its foundation.
 *
 * ## What the platform actually offers
 *
 * Two mechanisms have ever existed, and neither is generally available:
 *
 *   `AmbientLightSensor`   Generic Sensor API. Implemented in Chromium but
 *                          gated behind #enable-generic-sensor-extra-classes,
 *                          so `'AmbientLightSensor' in window` is false in a
 *                          stock browser. Requires a secure context, a
 *                          permissions-policy grant, and the
 *                          'ambient-light-sensor' permission. Never shipped
 *                          in Safari or Firefox.
 *
 *   `ondevicelight`        The old event. Firefox shipped it, then removed
 *                          it in 62. Effectively extinct; detected anyway
 *                          because detection is three lines.
 *
 * So on every browser this site is actually used in, this module reports
 * "unsupported" and Auto resolves from the system preference. That is the
 * expected outcome, not a failure, and nothing here is allowed to throw or
 * log on the way to it.
 *
 * ## Why it is not the top of the priority list
 *
 * Someone who sets their OS to dark at noon has answered the question. If a
 * bright room could override that, the site would fight a deliberate choice
 * with a guess from a sensor the user cannot see. So ambient light is
 * consulted only when the system expresses no preference at all — which is
 * exactly the case the sensor is useful for.
 *
 * ## Privacy
 *
 * Readings stay in this module. Nothing is stored, nothing is sent, no
 * history is kept, and the only thing that escapes is one of two words.
 */

export type AmbientState = "light" | "dark";

/**
 * Hysteresis, not a threshold. A single cut point makes the theme flip back
 * and forth whenever the room sits near it — a hand moving over a laptop is
 * enough. Between the two the current state is held.
 *
 * Roughly: a lit office is 300-500 lux, a living room in the evening is
 * 50-150, a dark room is under 10. BRIGHT is set above a dim domestic room
 * so a lamp on a desk at night does not read as daylight.
 */
const BRIGHT_LUX = 120;
const DARK_LUX = 40;

/** A reading has to persist before it is believed. */
const STABLE_MS = 4000;

type Listener = (state: AmbientState) => void;

interface Handle {
  stop: () => void;
}

/** Is there anything to try at all? Cheap, synchronous, never throws. */
export function ambientLightAvailable(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return "AmbientLightSensor" in window || "ondevicelight" in window;
  } catch {
    return false;
  }
}

/**
 * Start watching, if we can. Resolves to a handle, or null when the API is
 * missing, the permission is denied, the hardware is absent, or construction
 * throws for any other reason — all of which are ordinary outcomes here.
 *
 * `onState` fires only on a *change* that has been stable for STABLE_MS.
 */
export async function watchAmbientLight(onState: Listener): Promise<Handle | null> {
  if (!ambientLightAvailable()) return null;

  let settled: AmbientState | null = null;
  let candidate: AmbientState | null = null;
  let since = 0;

  // A reading is turned into a state only when it is clearly one or the
  // other; the band between is silence, which is what holds the theme still.
  const feed = (lux: number) => {
    if (typeof lux !== "number" || !Number.isFinite(lux) || lux < 0) return;
    const next: AmbientState | null =
      lux >= BRIGHT_LUX ? "light" : lux <= DARK_LUX ? "dark" : null;
    if (next === null || next === settled) {
      candidate = null;
      return;
    }
    const now = performance.now();
    if (candidate !== next) {
      candidate = next;
      since = now;
      return;
    }
    if (now - since < STABLE_MS) return;
    settled = next;
    candidate = null;
    onState(next);
  };

  // ── Generic Sensor API ────────────────────────────────────────────────
  const Ctor = (window as unknown as { AmbientLightSensor?: new (o?: { frequency?: number }) => EventTarget & { illuminance?: number; start(): void; stop(): void } }).AmbientLightSensor;
  if (Ctor) {
    try {
      // Ask first. Constructing without the grant throws a SecurityError,
      // and on some builds prompts — which is not acceptable for a colour.
      const perms = navigator.permissions as
        | { query(d: { name: string }): Promise<{ state: string }> }
        | undefined;
      if (perms?.query) {
        const status = await perms.query({ name: "ambient-light-sensor" }).catch(() => null);
        if (!status || status.state !== "granted") return null;
      } else {
        return null;
      }

      // 1 Hz. The debounce does the smoothing; a faster feed only costs power.
      const sensor = new Ctor({ frequency: 1 });
      let dead = false;
      sensor.addEventListener("reading", () => {
        if (!dead) feed(sensor.illuminance ?? NaN);
      });
      sensor.addEventListener("error", () => {
        dead = true;
        try { sensor.stop(); } catch { /* already gone */ }
      });
      sensor.start();
      return {
        stop() {
          dead = true;
          try { sensor.stop(); } catch { /* already gone */ }
        },
      };
    } catch {
      return null;
    }
  }

  // ── The old event, for the vanishingly small chance it is still there ──
  try {
    const handler = (e: Event) => feed((e as Event & { value?: number }).value ?? NaN);
    window.addEventListener("devicelight", handler);
    return { stop: () => window.removeEventListener("devicelight", handler) };
  } catch {
    return null;
  }
}
