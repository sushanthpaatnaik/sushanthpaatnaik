import { Link } from "@tanstack/react-router";
import { useState } from "react";
import spLogo from "@/assets/sp-logo.svg";


const navLinks = [
  { to: "/about", label: "About" },
  
  { to: "/recognitions", label: "Recognitions" },
  { to: "/innovations", label: "Innovations" },
  { to: "/ventures", label: "Ventures" },
  { to: "/early-works", label: "Early Works" },
  
  { to: "/voices", label: "Voices" },

  { to: "/news", label: "News" },
  { to: "/engage", label: "Engage" },
] as const;

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Cinematic backdrop fade — prevents content bleed-through under the
          fixed nav on mobile/tablet without breaking the transparent
          editorial feel on desktop. */}
      <div
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 right-0 z-40 h-24 md:h-28"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.04 0.005 260 / 0.85) 0%, oklch(0.04 0.005 260 / 0.55) 55%, transparent 100%)",
          WebkitBackdropFilter: "blur(8px)",
          backdropFilter: "blur(8px)",
          maskImage:
            "linear-gradient(180deg, #000 0%, #000 55%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(180deg, #000 0%, #000 55%, transparent 100%)",
        }}
      />
      <header className="fixed top-0 left-0 right-0 z-50 px-5 md:px-10 py-5 md:py-6 flex items-center justify-between pointer-events-none">
        <Link to="/" className="group flex items-center gap-3 pointer-events-auto" aria-label="Sushanth Paatnaik — Home">
          <img
            src={spLogo}
            alt=""
            aria-hidden
            width={28}
            height={28}
            className="h-7 w-7 md:h-8 md:w-8 select-none transition-[opacity,filter] duration-500 opacity-90 group-hover:opacity-100 [filter:drop-shadow(0_0_14px_oklch(0.7_0.06_232/0.28))]"
            draggable={false}
          />
          <span className="text-[11px] md:text-sm tracking-[0.28em] md:tracking-[0.3em] uppercase font-medium leading-none">
            Sushanth Paatnaik
          </span>
        </Link>

        {/* Desktop / wide tablet nav */}
        <nav className="hidden lg:flex items-center gap-6 text-[10px] uppercase tracking-[0.28em] text-muted-foreground/70 pointer-events-auto">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="hover:text-foreground transition-colors"
              activeProps={{ className: "text-foreground" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3 pointer-events-auto">
          <Link
            to="/contact"
            className="btn-cinematic btn-cinematic-sm hidden sm:inline-flex"
          >
            Contact
          </Link>
          {/* Mobile / tablet trigger */}
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="lg:hidden inline-flex h-9 w-9 items-center justify-center rounded-full border border-foreground/15 text-foreground/80 hover:text-foreground hover:border-foreground/35 transition-colors"
          >
            <span className="sr-only">Menu</span>
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              aria-hidden
            >
              {open ? (
                <>
                  <path d="M2 2 L12 12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                  <path d="M12 2 L2 12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                </>
              ) : (
                <>
                  <path d="M2 4 H12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                  <path d="M2 10 H12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                </>
              )}
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile / tablet cinematic overlay menu */}
      <div
        className={`fixed inset-0 z-[45] lg:hidden transition-[opacity,backdrop-filter] duration-500 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        style={{
          background:
            "radial-gradient(110% 80% at 50% 30%, oklch(0.05 0.006 260 / 0.96), oklch(0.03 0.004 260 / 0.99))",
          WebkitBackdropFilter: "blur(14px)",
          backdropFilter: "blur(14px)",
        }}
        onClick={() => setOpen(false)}
      >
        <nav
          onClick={(e) => e.stopPropagation()}
          className="flex h-full w-full flex-col items-start justify-center gap-5 px-8 sm:px-12 pt-28 pb-12"
        >
          {navLinks.map((l, i) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="font-display text-3xl sm:text-4xl tracking-[-0.02em] text-foreground/85 hover:text-gradient transition-colors"
              style={{ transitionDelay: `${i * 30}ms` }}
            >
              {l.label}
            </Link>
          ))}
          <Link
            to="/contact"
            onClick={() => setOpen(false)}
            className="mt-4 font-display text-3xl sm:text-4xl tracking-[-0.02em] text-primary/90 hover:text-primary transition-colors"
          >
            Contact →
          </Link>
        </nav>
      </div>
    </>
  );
}
