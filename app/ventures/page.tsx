"use client";

import CinematicPageShell from "@/components/scene/CinematicPageShell";

export default function VenturesPage() {
  return (
    <CinematicPageShell
      eyebrow="Ventures - Five Companies"
      title={<>One stack.<br className="hidden md:inline" /> Five operating companies.</>}
      lead="A vertically integrated ecosystem from atom-scale research to capital and commercialization."
    >
      <div className="not-prose mt-16 text-center">
        <p className="text-foreground/60">Ventures page content coming soon.</p>
      </div>
    </CinematicPageShell>
  );
}
