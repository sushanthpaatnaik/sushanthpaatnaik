"use client";

import CinematicPageShell from "@/components/scene/CinematicPageShell";

export default function VoicesPage() {
  return (
    <CinematicPageShell
      eyebrow="Voices - Testimonials"
      title={<>Words from those<br className="hidden md:inline" /> who have worked alongside.</>}
      lead="Perspectives from collaborators, partners, and colleagues across the journey."
    >
      <div className="not-prose mt-16 text-center">
        <p className="text-foreground/60">Voices page content coming soon.</p>
      </div>
    </CinematicPageShell>
  );
}
