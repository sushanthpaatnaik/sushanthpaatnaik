"use client";

import CinematicPageShell from "@/components/scene/CinematicPageShell";

export default function InnovationsPage() {
  return (
    <CinematicPageShell
      eyebrow="Innovations - 23 Products"
      title={<>Material intelligence<br className="hidden md:inline" /> at industrial scale.</>}
      lead="23 deep-tech graphene innovations across construction, energy, water, hydrogen, mobility, storage and armour — from commercial to pilot to R&D."
    >
      <div className="not-prose mt-16 text-center">
        <p className="text-foreground/60">Innovations page content coming soon.</p>
      </div>
    </CinematicPageShell>
  );
}
