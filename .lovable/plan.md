## Migration Audit & Content Transfer Plan

This is a large, multi-phase migration. Before I execute, I want to confirm scope so I don't spend hours pulling content you don't actually need re-pulled.

### What I'll do

**Phase A — Audit (read-only)**
1. Crawl all 12 pages of the old site (`preview--pixel-reimagined-57.lovable.app`) via Firecrawl / fetch_website.
2. Extract for each page: copy, statistics, founder statements, venture details, innovations, awards, patents, press mentions, testimonials, image URLs, video URLs, outbound links.
3. Audit current new-site routes (`/`, `/about`, `/recognitions`, `/innovations`, `/ventures`, `/early-works`, `/essays`, `/news`, `/contact`, `/engage`) to map what's already migrated vs. missing.
4. Produce a gap report (markdown) — what exists, what's missing, what needs rewriting.

**Phase B — Content restructure into 7 cinematic chapters**
Rewrite the home `ScrollSections` flow to follow:
```
01 — Spark           (origin, early inventor)
02 — Recognition     (6× Presidential awards, press)
03 — Carbon Intelligence  (graphene, patents, R&D)
04 — Industrial Applications  (products, deployments)
05 — Venture Builder (Monoatom, Grafillium, SPI, InThinks, Starunico, Magppie)
06 — India → World   (global positioning)
07 — Future          (essays, philosophy)
```
Each chapter: short editorial copy on home, deep content lives on dedicated route pages.

**Phase C — Image transfer**
- Download every meaningful image from old site (recognitions logos, venture/innovation visuals, archival inventor photos, lab/industrial imagery).
- Re-process via `imagegen--edit_image` where needed to fit the dark cinematic atmospheric language (no bright legacy aesthetic).
- Store under `src/assets/{chapter}/` and wire as synchronized scroll backdrops per chapter.

**Phase D — Detail page upgrades**
Push migrated copy into the existing detail routes (`/about`, `/recognitions`, `/innovations`, `/ventures`, `/early-works`, `/essays`, `/news`, `/contact`) using `CinematicPageShell` + `EditorialList`/`EditorialSection`. Keep nav concise, each item a real route.

**Phase E — QC**
- Verify routes build, no broken imports.
- Browser screenshot every route to check cinematic continuity, no dead-black regions, image fit.

### Realistic scope warning

This is genuinely 1–3 hours of agent work and will touch 30–60 files plus generate/transform ~20–40 images. I want to flag two decisions before starting:

1. **Image strategy** — for each old-site image, do you want me to:
   - (a) Transfer raw + apply a unified dark cinematic overlay in CSS only (fast, ~30 min), or
   - (b) Re-edit each via AI to match the atmospheric language (slow, ~1–2 hrs, higher quality)?

2. **Content fidelity** — for founder statements, awards, venture descriptions: copy old text verbatim, or rewrite into more editorial/cinematic prose?

3. **Order of execution** — should I deliver in batches (Audit → ship, then Restructure → ship, then Images → ship) so you can review between phases, or do the whole thing in one pass?

Once you answer those three, I'll execute end-to-end without further check-ins.