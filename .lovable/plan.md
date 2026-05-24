# Cinematic Refinement Plan

This is a large, multi-section creative pass. To ship it well without breaking the existing cinematic system, I'll execute in 4 focused phases. You can approve all, or pick the phases you want first.

## Phase 1 — Continuous environment + signature motif (homepage)
- Add a persistent **ambient continuity layer** (always-on, ultra-low opacity) that lives behind all chapter atmospheres so transitions never "go dark" between sections. Soft volumetric haze + slow drifting orbital ring as the recurring signature motif.
- Introduce a subtle **orbital lattice glyph** (SVG, ~3% opacity) as the site's recurring identity object — appears in hero, between chapters, and as a faint watermark on Recognitions/Innovations.
- Strengthen hero: low-opacity infrastructure topology grid (masked away from typography), breathing light gradient (8s ease loop), 6–8 micro-drift particles (not the gaming kind — 1px, <8% opacity).
- Fix lower-screen energy collapse: add a bottom atmospheric gradient band per chapter so sections never bleed to pure black at the fold.

## Phase 2 — Index rail ↔ environment coupling + micro-storytelling
- Active rail node gets a soft illumination halo that subtly tints the adjacent atmosphere (CSS variable driven by `useChapterPhase`).
- Add 3–4 **interstitial narrative lines** between major chapters ("Recognition followed the prototypes." / "Research evolved into infrastructure." / "Systems became deployable.") — single-line, centered, tracked-out, fades in/out on scroll.
- Add one **breathing pause section** between Ecosystem and Future: black frame, single italic founder line, generous vertical space.

## Phase 3 — Recognitions as archival timeline + unified image grading
- Restructure Recognitions into a chronological vertical timeline with year anchors, archival spacing rhythm, and era groupings.
- Add a global **`.archive-grade` CSS utility** (contrast +6%, saturation -15%, subtle vignette, faint film grain overlay) and apply to all archive/recognition imagery for a unified museum-grade look.

## Phase 4 — Innovations clarity + climax sequence
- Add metadata chip system to every innovation card: Sector / Application / Tech Category (e.g. "Advanced Materials · Industrial Systems · Infrastructure").
- Build the **signature cinematic sequence**: an orbital recognition timeline in the Future/Recognition climax — slow-rotating orbital ring with recognition years as nodes lighting in sequence as the user scrolls through.

## Technical notes
- All new motion respects `prefers-reduced-motion` and the existing `isLowPower` gate in `src/routes/index.tsx`.
- New atmosphere layers use `contain: strict` + `will-change: opacity` and are driven by the existing `useChapterPhase` motion value — no new scroll listeners.
- No changes to copy, route structure, or section order beyond adding the interstitial narrative lines and the breathing pause.
- No new dependencies.

## Scope I will NOT touch unless you ask
- Section order, navigation structure, or routes.
- Copy on existing sections (only adding new interstitial lines).
- Color tokens in `src/styles.css` (only additive utilities like `.archive-grade`).

---

**Question for you:** Do you want me to execute all 4 phases in this turn, or start with Phase 1 + 2 (the homepage cinematic continuity work) and then do 3 + 4 in a follow-up? Phase 1+2 is the highest-leverage visible change; 3+4 touches other routes.
