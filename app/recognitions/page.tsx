"use client";

import CinematicPageShell from "@/components/scene/CinematicPageShell";

export default function RecognitionsPage() {
  return (
    <CinematicPageShell
      eyebrow="Recognitions - Archive"
      title={<>The record exists.<br className="hidden md:inline" /> The next prototype matters more.</>}
      lead="Six Indian Presidential awards. NIF-India IGNITE. TED-India. MIT Technology Review. India Today."
    >
      <div className="not-prose mt-16 text-center">
        <p className="text-foreground/60">Recognitions page content coming soon.</p>
      </div>
    </CinematicPageShell>
  );
}
