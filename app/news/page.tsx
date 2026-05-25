"use client";

import CinematicPageShell from "@/components/scene/CinematicPageShell";

export default function NewsPage() {
  return (
    <CinematicPageShell
      eyebrow="News - Editorial Archive"
      title={<>Press, media,<br className="hidden md:inline" /> and coverage.</>}
      lead="Editorial archive of coverage across national and international media."
    >
      <div className="not-prose mt-16 text-center">
        <p className="text-foreground/60">News page content coming soon.</p>
      </div>
    </CinematicPageShell>
  );
}
