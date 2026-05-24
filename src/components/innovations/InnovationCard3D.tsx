import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, type PointerEvent } from "react";
import { archetypeFor } from "./archetypes";
import { ArchetypeScene } from "./archetypes";
import { InnovationView, useInnovationsCanvas } from "./InnovationsCanvas";

export interface InnovationItem {
  title: string;
  stage: "Commercial" | "Pilot" | "R&D";
  metric: string;
  body: string;
  img: string;
  domain: string;
  status: string;
  featured?: boolean;
}

interface Props {
  item: InnovationItem;
  size?: "hero" | "compact";
  onOpen: (item: InnovationItem) => void;
}

/**
 * Cinematic 3D innovation card.
 * - 3D scene rendered through the shared <Canvas>'s <View> portal.
 * - Hover: inertia tilt + glow intensification.
 * - Click: opens immersive modal.
 */
export default function InnovationCard3D({ item, size = "compact", onOpen }: Props) {
  const { enabled } = useInnovationsCanvas();
  const cardRef = useRef<HTMLButtonElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  const { id, accent } = archetypeFor(item.title);

  // Mouse parallax tilt
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [6, -6]), { stiffness: 90, damping: 16 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-8, 8]), { stiffness: 90, damping: 16 });

  function handleMove(e: PointerEvent<HTMLButtonElement>) {
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  }
  function handleLeave() {
    mx.set(0);
    my.set(0);
  }

  const aspect = size === "hero" ? "aspect-[16/10]" : "aspect-[4/3]";

  return (
    <motion.button
      ref={cardRef}
      onClick={() => onOpen(item)}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.9, ease: [0.19, 1, 0.22, 1] }}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 1200 }}
      className={`group relative ${aspect} w-full overflow-hidden rounded-sm border border-foreground/[0.08] bg-[oklch(0.045_0.006_245)] text-left will-change-transform cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent/60`}
      aria-label={`Open ${item.title} immersive view`}
    >
      {/* 3D viewport — top-half framing, leaves bottom for typography */}
      <div
        ref={viewportRef}
        className="absolute inset-0 bottom-[42%]"
        aria-hidden
      >
        {enabled ? (
          <InnovationView trackRef={viewportRef}>
            <ArchetypeScene id={id} accent={accent} seed={item.title.length * 7} />
          </InnovationView>
        ) : (
          <img
            src={item.img}
            alt=""
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover opacity-80"
            style={{ filter: "grayscale(0.3) contrast(1.05) brightness(0.85)" }}
          />
        )}
      </div>

      {/* Ambient accent glow — intensifies on hover */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-50 transition-opacity duration-[1100ms] group-hover:opacity-90"
        style={{
          background: `radial-gradient(60% 50% at 50% 38%, ${accent}22 0%, transparent 70%)`,
        }}
      />

      {/* Cinematic floor gradient */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.03 0.006 245 / 0.18) 0%, transparent 35%, oklch(0.02 0.006 245 / 0.92) 78%, oklch(0.014 0.006 245 / 0.98) 100%)",
        }}
      />

      {/* Hairline grid micro-frame */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-screen"
        style={{
          backgroundImage:
            "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Technical readout — top */}
      <div className="absolute left-3.5 top-3.5 z-10 flex items-center gap-1.5">
        <span className="h-px w-5" style={{ background: `${accent}cc` }} />
        <span
          className="font-mono text-[8.5px] uppercase tracking-[0.34em]"
          style={{ color: `${accent}d0` }}
        >
          {size === "hero" ? "Flagship · 3D" : "Module · 3D"}
        </span>
      </div>
      <div className="absolute right-3.5 top-3.5 z-10 flex items-center gap-2">
        <span className="font-mono text-[8.5px] uppercase tracking-[0.32em] text-foreground/45">
          {item.status}
        </span>
        <span className="h-1 w-1 rounded-full" style={{ background: accent }} />
      </div>

      {/* Typography stack */}
      <div className={`absolute inset-x-0 bottom-0 z-10 ${size === "hero" ? "p-5 md:p-7" : "p-4"}`}>
        <p className="font-mono text-[9px] uppercase tracking-[0.32em] text-foreground/55">
          {item.domain}
        </p>
        <h3
          className={`mt-1.5 font-display tracking-[-0.02em] text-foreground/98 leading-[1.1] ${
            size === "hero" ? "text-2xl md:text-3xl" : "text-base md:text-lg"
          }`}
        >
          {item.title}
        </h3>
        {size === "hero" && (
          <p className="mt-2 max-w-xl text-[13px] md:text-[14px] leading-snug text-foreground/72">
            {item.body}
          </p>
        )}
        <div className="mt-2.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="h-px w-4" style={{ background: `${accent}99` }} />
            <span className="font-mono text-[9.5px] uppercase tracking-[0.26em] text-foreground/68">
              {item.metric}
            </span>
          </div>
          <span
            className="font-mono text-[8.5px] uppercase tracking-[0.34em] opacity-60 transition-opacity duration-700 group-hover:opacity-100"
            style={{ color: accent }}
          >
            Open · ↗
          </span>
        </div>
      </div>

      {/* Border accent on hover */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-sm opacity-0 transition-opacity duration-700 group-hover:opacity-100"
        style={{ boxShadow: `inset 0 0 0 1px ${accent}55, 0 18px 60px -20px ${accent}38` }}
      />
    </motion.button>
  );
}
