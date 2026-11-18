import { Link } from "@tanstack/react-router";
import { Fragment, useState, useEffect } from "react";
import spLogo from "@/assets/sp-logo.svg";
import ThemeSelector, { ThemeMenu } from "./ThemeSelector";
import { useThemeControl } from "@/lib/theme-context";

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
  // True only on `/`, which renders dark whatever the visitor chose.
  const { forcedDark } = useThemeControl();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Escape closes the overlay. The listener is only attached while it is open,
  // so Escape keeps whatever meaning it has elsewhere on the page the rest of
  // the time — the /innovations product panel binds its own.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      {/* Cinematic backdrop fade — tightens on scroll */}
      <div
        aria-hidden
        className={`pointer-events-none fixed top-0 left-0 right-0 z-40 nav-backdrop transition-[height] duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] ${
          scrolled ? "h-16 md:h-[60px]" : "h-24 md:h-28"
        }`}
        style={{
          background: scrolled ? "var(--nav-veil-scrolled)" : "var(--nav-veil)",
          WebkitBackdropFilter: "blur(12px)",
          backdropFilter: "blur(12px)",
          maskImage: "linear-gradient(180deg, #000 0%, #000 70%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(180deg, #000 0%, #000 70%, transparent 100%)",
          transition: "height 0.5s cubic-bezier(0.19,1,0.22,1), background 0.5s cubic-bezier(0.19,1,0.22,1)",
        }}
      />
      <header
        className={`fixed top-0 left-0 right-0 z-50 px-5 md:px-10 flex items-center justify-between gap-x-4 pointer-events-none transition-[padding-top,padding-bottom] duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] ${
          scrolled ? "py-2 md:py-3.5" : "py-4 md:py-6"
        }`}
      >
        <Link to="/" className="group flex shrink-0 items-center gap-3 pointer-events-auto" aria-label="Sushanth Paatnaik, Home">
          <img
            src={spLogo}
            alt=""
            aria-hidden
            width={28}
            height={28}
            className={`select-none transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] opacity-90 group-hover:opacity-100 ${
              scrolled ? "h-6 w-6 md:h-7 md:w-7" : "h-7 w-7 md:h-8 md:w-8"
            }`}
            style={{ filter: "var(--logo-glow)" }}
            draggable={false}
          />
          <span
            className={`uppercase font-medium leading-none whitespace-nowrap transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] ${
              scrolled
                ? "text-[10px] md:text-[11px] tracking-[0.14em] md:tracking-[0.26em]"
                : "text-[10px] md:text-sm tracking-[0.16em] md:tracking-[0.3em]"
            }`}
          >
            Sushanth Paatnaik
          </span>
        </Link>

        {/* The link row starts at xl, not lg. Nine links, the wordmark and
            Contact need about 1150px in the system face on a Mac and 1300 to
            1340 in Inter, which this stack asks for first. From 1024 to 1279
            they did not fit in either: the wordmark's text ran 32px into
            "About" at 1024 and the last links sat under the Contact button,
            on every route. Below xl the links are in the drawer, which
            already carried them for phones.

            At xl the row can still be short of room where the face is wide.
            In Inter at 1280, top of the page, it was 16px over on the
            homepage and 60px over on an internal page: "PAATNAIKBOUT" on one
            side, "Engage" under the theme control on the other. So the space
            between links is a spacer that can give — 24px wherever there is
            room, which is every width in the Mac's face and from about 1375
            in Inter, down to 10px where there is not — and the header's own
            gap keeps 16px between the three groups. The links never shrink.
            With room to spare this is gap-x-6 to the pixel: 0 pixels differ
            from the build before it at 1440 and 1920.

            The wordmark and the button cluster are shrink-0 for the same
            reason. Left to the default they do shrink: the logo is an img
            with a percentage max-width, which makes its minimum contribution
            zero, so the wordmark's box gave up 20px and its text ran out of
            it into the gap that had just been made.

            On the homepage the links are 90% of muted, not 70%. Over the
            film they measured 3.2:1 on every chapter, against 4.5 for text
            this size; at 90% they measure 4.7 to 4.8. Other routes keep 70%:
            their grounds are the theme's and that level is part of the
            approved design there. */}
        <nav
          className={`hidden xl:flex min-w-0 items-center text-[10px] uppercase tracking-[0.28em] pointer-events-auto ${
            forcedDark ? "text-muted-foreground/90" : "text-muted-foreground/70"
          }`}
        >
          {navLinks.map((l, i) => (
            <Fragment key={l.to}>
              {i > 0 && <span aria-hidden className="w-6 min-w-2.5 shrink" />}
              <Link
                to={l.to}
                className="shrink-0 inline-flex min-h-6 items-center whitespace-nowrap hover:text-foreground transition-colors duration-300 relative after:absolute after:bottom-[-3px] after:left-0 after:h-px after:w-0 after:bg-foreground/30 after:transition-all after:duration-500 hover:after:w-full"
                activeProps={{ className: "text-foreground after:!w-full after:!bg-primary/60" }}
              >
                {l.label}
              </Link>
            </Fragment>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-3 pointer-events-auto">
          {/* The theme control lives with the other utilities rather than in
              the link row: it is a setting, not a destination. Hidden below
              xl, where the drawer carries it instead — the header row at 390
              is already the wordmark plus a 44px trigger.

              Absent on the homepage. The homepage is approved as it stands
              and always renders dark, so a control there would offer a
              setting that route ignores — and it is the one page whose
              header was asked to stay exactly as it is. Measured: with the
              control present, 3,710 of the 3,881 pixels that differed from
              the deployed build were in the homepage header. Without it the
              header is byte-identical again. */}
          {!forcedDark && (
            <div className="hidden xl:block">
              <ThemeMenu />
            </div>
          )}
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
            className="xl:hidden inline-flex h-11 w-11 items-center justify-center rounded-full border border-foreground/15 text-foreground/80 hover:text-foreground hover:border-foreground/35 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
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
        className={`fixed inset-0 z-[45] xl:hidden transition-opacity duration-500 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        style={{
          background: "var(--nav-drawer)",
          WebkitBackdropFilter: "blur(14px)",
          backdropFilter: "blur(14px)",
        }}
        onClick={() => setOpen(false)}
      >
        {/* Centred by auto margins on the first and last child, not by
            justify-center. Where the list fits the two are the same thing,
            to the pixel. Where it does not, justify-center overflows equally
            above and below, and a scroll container cannot scroll to what is
            above its start: on a phone held sideways "About" sat 75px above
            the top of the screen and could not be reached, and on a 320x568
            phone the first link lay under the wordmark. Auto margins fall to
            zero when there is no room, so the list starts under the header
            and everything past the foot is a scroll away.

            The mask is for that scrolled state only. The header's wordmark
            and buttons are painted above this layer with nothing behind
            them, so a link scrolled up would run through the wordmark; it
            fades out across the 36px under the header instead. Where the
            list fits, nothing is ever painted in that band — it is this
            element's own top padding — and the mask changes no pixel. */}
        <nav
          onClick={(e) => e.stopPropagation()}
          className="flex h-full w-full flex-col items-start gap-4 sm:gap-5 px-8 sm:px-12 pt-24 pb-10 overflow-y-auto [&>:first-child]:mt-auto [&>:last-child]:mb-auto"
          style={{
            maskImage: "linear-gradient(180deg, transparent 0, transparent 3.75rem, #000 6rem)",
            WebkitMaskImage:
              "linear-gradient(180deg, transparent 0, transparent 3.75rem, #000 6rem)",
          }}
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
          {/* Below the destinations and separated by a rule, so the drawer
              still reads as a list of places with a setting at the end.
              Omitted on the homepage for the same reason as the header. */}
          {!forcedDark && (
            <div className="mt-8 w-full border-t border-foreground/[0.10] pt-6">
              <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.32em] text-muted-foreground/60">
                Theme
              </p>
              <ThemeSelector size="lg" />
            </div>
          )}
        </nav>
      </div>
    </>
  );
}
