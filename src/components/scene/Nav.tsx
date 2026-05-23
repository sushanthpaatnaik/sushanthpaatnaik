import { Link } from "@tanstack/react-router";

export default function Nav() {
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
        <Link to="/" className="flex items-center gap-2 pointer-events-auto">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-accent shadow-[0_0_20px_oklch(0.85_0.15_220/0.6)]" />
          <span className="text-[11px] md:text-sm tracking-[0.28em] md:tracking-[0.3em] uppercase font-medium">Sushanth Paatnaik</span>
        </Link>
        <nav className="hidden md:flex items-center gap-7 text-[11px] uppercase tracking-[0.28em] text-muted-foreground/70 pointer-events-auto">
          <a href="/#about" className="hover:text-foreground transition-colors">About</a>
          <a href="/#innovations" className="hover:text-foreground transition-colors">Innovations</a>
          <a href="/#ventures" className="hover:text-foreground transition-colors">Ventures</a>
          <a href="/#engagement" className="hover:text-foreground transition-colors">Engage</a>
          <Link to="/essays" className="hover:text-foreground transition-colors">Essays</Link>
        </nav>
        <a href="mailto:me@sushanthpaatnaik.com?subject=Connect" className="btn-cinematic btn-cinematic-sm pointer-events-auto">
          Connect
        </a>
      </header>
    </>
  );
}
