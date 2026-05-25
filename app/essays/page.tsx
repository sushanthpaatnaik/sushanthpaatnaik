"use client";

import CinematicPageShell from "@/components/scene/CinematicPageShell";

export default function EssaysPage() {
  return (
    <CinematicPageShell
      eyebrow="Essays - Notes"
      title={<>Notes from<br className="hidden md:inline" /> the workshop.</>}
      lead="Thoughts on invention, industry, and the long arc of building."
    >
      <div className="not-prose mt-16 text-center">
        <p className="text-foreground/60">Essays page content coming soon.</p>
      </div>
    </CinematicPageShell>
  );
}
