import { useEffect, useRef, useState } from "react";
import { useThemeControl } from "@/lib/theme-context";
import type { ThemePreference } from "@/lib/theme";

const OPTIONS: { value: ThemePreference; label: string; hint?: string }[] = [
  // Auto is the only one whose behaviour is not obvious from its name, so it
  // is the only one that says anything. Plain language on purpose: what it
  // follows, not which API it follows it with.
  { value: "auto", label: "Auto", hint: "Follows your device and environment where supported" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
];

/**
 * Auto · Light · Dark, as a segmented control.
 *
 * A radiogroup rather than three buttons, because these are one choice with
 * three answers and a screen reader should say "2 of 3" rather than read
 * three unrelated controls. Roving tabindex comes with that: one tab stop for
 * the group, arrow keys between options — which is also why the handler binds
 * arrows explicitly, since native radios are not in play here.
 *
 * Selection is never carried by colour alone. The chosen option gains a
 * bracket, a rule beneath it and aria-checked, so it survives greyscale, a
 * colour-blind reader and a screen reader alike.
 *
 * `size` exists because the drawer version sits among 36px navigation words
 * and the header version sits beside a 24px button; the same control at one
 * size looks like a mistake in one of the two places.
 */
export default function ThemeSelector({ size = "sm" }: { size?: "sm" | "lg" }) {
  const { preference, resolved, forcedDark, choose } = useThemeControl();
  const lg = size === "lg";

  const onKeyDown = (e: React.KeyboardEvent, i: number) => {
    const d = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1
      : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const next = (i + d + OPTIONS.length) % OPTIONS.length;
    choose(OPTIONS[next].value);
    (e.currentTarget.parentElement?.children[next] as HTMLElement | undefined)?.focus();
  };

  return (
    <div
      role="radiogroup"
      aria-label="Colour theme"
      className={`inline-flex items-center rounded-sm border border-foreground/[0.14] bg-background/40 ${
        lg ? "gap-1 p-1" : "gap-0.5 p-0.5"
      }`}
    >
      {OPTIONS.map((o, i) => {
        const on = preference === o.value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={on}
            tabIndex={on ? 0 : -1}
            onClick={() => choose(o.value)}
            onKeyDown={(e) => onKeyDown(e, i)}
            title={o.hint}
            /* 44px tall in the drawer, where it is tapped. In the header it
               is a pointer target beside an equally small Contact link, and
               matching that row matters more than a touch minimum that does
               not apply to the viewport the header row is shown at. */
            className={`relative rounded-[2px] font-mono uppercase transition-colors duration-300 focus:outline-none focus-visible:ring-1 focus-visible:ring-accent/70 ${
              lg
                ? "min-h-11 px-4 text-[11px] tracking-[0.28em]"
                : "min-h-6 px-2 py-1 text-[9.5px] tracking-[0.22em]"
            } ${on ? "text-foreground" : "text-muted-foreground/70 hover:text-foreground/85"}`}
          >
            {/* Non-colour marks for the selected option. Both are decorative
                to a screen reader, which has aria-checked already. */}
            {on && (
              <span aria-hidden className="absolute inset-x-1.5 bottom-0.5 h-px bg-accent/70" />
            )}
            <span aria-hidden className={on ? "opacity-100" : "opacity-0"}>
              ·{" "}
            </span>
            {o.label}
          </button>
        );
      })}
      {/* Auto is the only setting whose result is not written on the control,
          and the homepage is the only route that ignores the setting. Both
          are stated in text rather than left to be inferred from the page. */}
      <span className="sr-only" aria-live="polite">
        {forcedDark
          ? "The homepage is always dark. Your preference applies to the other pages."
          : preference === "auto"
            ? `Auto, currently ${resolved}`
            : `${preference} theme`}
      </span>
    </div>
  );
}

/** A dot for Auto, a sun for Light, a moon for Dark — 14px, currentColor. */
function ThemeGlyph({ pref }: { pref: ThemePreference }) {
  if (pref === "light") {
    return (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
        <circle cx="7" cy="7" r="2.8" stroke="currentColor" strokeWidth="1.1" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
          <line
            key={a}
            x1={7 + 4.6 * Math.cos((a * Math.PI) / 180)}
            y1={7 + 4.6 * Math.sin((a * Math.PI) / 180)}
            x2={7 + 6 * Math.cos((a * Math.PI) / 180)}
            y2={7 + 6 * Math.sin((a * Math.PI) / 180)}
            stroke="currentColor"
            strokeWidth="1.1"
            strokeLinecap="round"
          />
        ))}
      </svg>
    );
  }
  if (pref === "dark") {
    return (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
        <path
          d="M11.2 8.6A4.8 4.8 0 0 1 5.4 2.8a4.9 4.9 0 1 0 5.8 5.8Z"
          stroke="currentColor"
          strokeWidth="1.1"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.1" />
      <path d="M7 2a5 5 0 0 0 0 10Z" fill="currentColor" opacity="0.75" />
    </svg>
  );
}

/**
 * The header form of the control: a glyph that opens the same three options.
 *
 * The segmented control is 190px wide. The header at 1440 already carries a
 * wordmark, nine navigation links and Contact, and the segmented version
 * overlapped "Engage" — measured, and plain in a screenshot. A 32px trigger
 * fits where the full control does not, and the brief allows either.
 *
 * The menu closes on Escape and on a click outside, and returns focus to the
 * trigger, so a keyboard visitor is never left somewhere they cannot see.
 */
export function ThemeMenu() {
  const { preference, resolved, forcedDark, choose } = useThemeControl();
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      // Stop the nav's own Escape handler from also acting on this key.
      e.stopPropagation();
      setOpen(false);
      trigger.current?.focus();
    };
    const onDown = (e: MouseEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKey, true);
    window.addEventListener("mousedown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey, true);
      window.removeEventListener("mousedown", onDown);
    };
  }, [open]);

  return (
    <div ref={wrap} className="relative">
      <button
        ref={trigger}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Colour theme: ${preference === "auto" ? `auto, currently ${resolved}` : preference}. Change`}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-foreground/15 text-foreground/70 transition-colors duration-300 hover:border-foreground/35 hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
      >
        <ThemeGlyph pref={preference} />
      </button>
      {open && (
        <div
          role="menu"
          aria-label="Colour theme"
          className="absolute right-0 top-10 z-50 min-w-[8.5rem] rounded-sm border border-foreground/[0.12] bg-popover/95 p-1 backdrop-blur-md"
        >
          {OPTIONS.map((o) => {
            const on = preference === o.value;
            return (
              <button
                key={o.value}
                title={o.hint}
                type="button"
                role="menuitemradio"
                aria-checked={on}
                onClick={() => {
                  choose(o.value);
                  setOpen(false);
                  trigger.current?.focus();
                }}
                className={`flex w-full items-center gap-2.5 rounded-[2px] px-2.5 py-2 text-left font-mono text-[10px] uppercase tracking-[0.26em] transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-accent/70 ${
                  on ? "text-foreground" : "text-muted-foreground/75 hover:text-foreground/90"
                }`}
              >
                <ThemeGlyph pref={o.value} />
                {o.label}
                {/* A tick, not a colour, marks the choice. */}
                <span aria-hidden className={`ml-auto text-accent ${on ? "opacity-100" : "opacity-0"}`}>
                  ✓
                </span>
              </button>
            );
          })}
          {forcedDark && (
            <p className="border-t border-foreground/[0.08] px-2.5 pb-1 pt-2 font-mono text-[9px] leading-relaxed tracking-[0.14em] text-muted-foreground/60">
              The homepage stays dark
            </p>
          )}
        </div>
      )}
    </div>
  );
}
