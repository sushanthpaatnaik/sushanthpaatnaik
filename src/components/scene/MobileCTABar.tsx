import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";

export default function MobileCTABar() {
  const [visible, setVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px), (pointer: coarse)");
    setIsMobile(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!isMobile) return;

    const SHOW_THRESHOLD = 1500;
    // Hide when the closing Future section CTA is scrolled into view (~600px from bottom)
    const HIDE_NEAR_BOTTOM = 650;

    const onScroll = () => {
      const scrollY = window.scrollY;
      const pageH = document.body.scrollHeight;
      const viewH = window.innerHeight;
      const nearBottom = scrollY > pageH - viewH - HIDE_NEAR_BOTTOM;
      setVisible(scrollY > SHOW_THRESHOLD && !nearBottom);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [isMobile]);

  if (!isMobile) return null;

  return (
    <div
      aria-hidden={!visible}
      className={`fixed bottom-0 left-0 right-0 z-[60] transition-all duration-500 ease-out lg:hidden ${
        visible ? "translate-y-0 opacity-100 pointer-events-auto" : "translate-y-full opacity-0 pointer-events-none"
      }`}
    >
      {/* Gradient fade above the bar so it doesn't hard-cut into content */}
      <div
        aria-hidden
        className="pointer-events-none h-10 w-full"
        style={{
          background: "linear-gradient(0deg, oklch(0.04 0.005 260 / 0.85) 0%, transparent 100%)",
        }}
      />
      <div
        style={{
          background: "oklch(0.06 0.006 260 / 0.92)",
          backdropFilter: "blur(12px) saturate(120%)",
          WebkitBackdropFilter: "blur(12px) saturate(120%)",
          borderTop: "1px solid oklch(1 0 0 / 0.08)",
        }}
      >
        <Link
          to="/contact"
          className="flex h-[52px] w-full items-center justify-center gap-3 text-[11px] uppercase tracking-[0.4em] text-foreground/85 hover:text-foreground active:text-foreground transition-colors"
        >
          <span>Begin a conversation</span>
          <span className="text-primary/80 text-[13px]">→</span>
        </Link>
      </div>
    </div>
  );
}
