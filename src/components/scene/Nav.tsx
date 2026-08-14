import { Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import spLogo from "@/assets/sp-logo.svg";

const navLinks = [
  { to: "/about", label: "About" },
  { to: "/early-works", label: "Early Works" },
  { to: "/innovations", label: "Innovations" },
  { to: "/ventures", label: "Ventures" },
  { to: "/recognitions", label: "Recognitions" },
  { to: "/voices", label: "Voices" },
  { to: "/essays", label: "Essays" },
  { to: "/news", label: "News" },
  { to: "/engage", label: "Engage" },
] as const;

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Cinematic backdrop fade — tightens on scroll */}
      <div
        aria-hidden
        className={`pointer-events-none fixed top-0 left-0 right-0 z-40 nav-backdrop transition-[height] duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] ${
          scrolled ? "h-16 md:h-[60px]" : "h-24 md:h-28"
        }`}
        style={{
          background: scrolled
            ? "linear-gradient(180deg, oklch(0.04 0.005 260 / 0.94) 0%, oklch(0.04 0.005 260 / 0.88) 75%, transparent 100%)"
            : "linear-gradient(180deg, oklch(0.04 0.005 260 / 0.85) 0%, oklch(0.04 0.005 260 / 0.55) 55%, transparent 100%)",
          WebkitBackdropFilter: "blur(12px)",
          backdropFilter: "blur(12px)",
          maskImage: "linear-gradient(180deg, #000 0%, #000 70%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(180deg, #000 0%, #000 70%, transparent 100%)",
          transition: "height 0.5s cubic-bezier(0.19,1,0.22,1), background 0.5s cubic-bezier(0.19,1,0.22,1)",
        }}
      />
      <header
        className={`fixed top-0 left-0 right-0 z-50 px-5 md:px-10 flex items-center justify-between pointer-events-none transition-[padding-top,padding-bottom] duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] ${
          scrolled ? "py-2 md:py-3.5" : "py-4 md:py-6"
        }`}
      >
        <Link to="/" className="group flex items-center gap-3 pointer-events-auto" aria-label="Sushanth Paatnaik — Home">
          <img
            src={spLogo}
            alt=""
            aria-hidden
            width={28}
            height={28}
            className={`select-none transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] opacity-90 group-hover:opacity-100 [filter:drop-shadow(0_0_14px_oklch(0.7_0.06_232/0.28))] ${
              scrolled ? "h-6 w-6 md:h-7 md:w-7" : "h-7 w-7 md:h-8 md:w-8"
            }`}
            draggable={false}
          />
          <span
            className={`uppercase font-medium leading-none whitespace-nowrap transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] ${
              scrolled
                ? "text-[9px] md:text-[11px] tracking-[0.14em] md:tracking-[0.26em]"
                : "text-[10px] md:text-sm tracking-[0.16em] md:tracking-[0.3em]"
            }`}
          >
            Sushanth Paatnaik
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-x-5 xl:gap-x-6 text-[10px] uppercase tracking-[0.26em] xl:tracking-[0.28em] text-muted-foreground/70 pointer-events-auto">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="whitespace-nowrap hover:text-foreground transition-colors duration-300 relative after:absolute after:bottom-[-3px] after:left-0 after:h-px after:w-0 after:bg-foreground/30 after:transition-all after:duration-500 hover:after:w-full"
              activeProps={{ className: "text-foreground after:!w-full after:!bg-primary/60" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3 pointer-events-auto">
          {/* Wrapper div hides at mobile widths — prevents .btn-cinematic's
              display:inline-flex from overriding Tailwind's hidden utility */}
          <div className="hidden sm:block">
            <Link to="/contact" className="btn-cinematic btn-cinematic-sm">
              Contact
            </Link>
          </div>
          {/* Mobile trigger — 44px minimum touch target per WCAG */}
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="lg:hidden inline-flex h-11 w-11 items-center justify-center rounded-full border border-foreground/15 text-foreground/80 hover:text-foreground hover:border-foreground/35 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
          >
            <span className="sr-only">Menu</span>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
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

      {/* Mobile overlay — opacity-only transition, no backdrop-filter animation */}
      <div
        className={`fixed inset-0 z-[45] lg:hidden transition-opacity duration-500 ${
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
          className="flex h-full w-full flex-col items-start justify-center gap-4 sm:gap-5 px-8 sm:px-12 pt-24 pb-10 overflow-y-auto"
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
