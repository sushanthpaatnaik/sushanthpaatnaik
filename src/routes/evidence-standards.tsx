import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import CinematicPageShell, { EditorialSection } from "@/components/scene/CinematicPageShell";
import { EvidenceBadge } from "@/components/scene/cinematic";
import { stageMeta, stageExplainer, evidenceGroups, type Stage } from "@/lib/evidenceStandards";
import backdrop from "@/assets/story-03-material.webp";
import { breadcrumbSchema, ldJsonScript, webPageSchema } from "@/lib/seo";

const description =
  "How every claim across the Innovations catalogue is graded — development stage, evidence labels, and patent status explained, so a claim's confidence level is never left to guesswork.";

export const Route = createFileRoute("/evidence-standards")({
  component: EvidenceStandardsPage,
  head: () => ({
    meta: [
      { title: "Evidence & Development-Stage Standards — Sushanth Paatnaik" },
      { name: "description", content: description },
      { property: "og:title", content: "Evidence & Development-Stage Standards — Sushanth Paatnaik" },
      {
        property: "og:description",
        content:
          "A plain-language reference for how development stage and evidence labels are applied across the 25-technology Innovations catalogue.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://sushanthpaatnaik.com/evidence-standards" },
      { property: "og:image", content: "https://sushanthpaatnaik.com/social-preview.webp" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://sushanthpaatnaik.com/social-preview.webp" },
    ],
    links: [{ rel: "canonical", href: "https://sushanthpaatnaik.com/evidence-standards" }],
    scripts: [
      ldJsonScript(
        webPageSchema({ name: "Evidence & Development-Stage Standards", description, path: "/evidence-standards" }),
      ),
      ldJsonScript(
        breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Innovations", path: "/innovations" },
          { name: "Evidence & Development-Stage Standards", path: "/evidence-standards" },
        ]),
      ),
    ],
  }),
});

const stageOrder: Stage[] = ["Commercial", "Pilot", "R&D"];

function StageRow({ stage, index }: { stage: Stage; index: number }) {
  const meta = stageMeta[stage];
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.9, delay: index * 0.07, ease: [0.19, 1, 0.22, 1] }}
      className="border-t border-foreground/[0.08] py-7 first:border-t-0 md:py-8"
    >
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1.5">
        <span className="font-mono text-[10px] uppercase tracking-[0.42em] text-accent/80">{meta.tone}</span>
        <h3 className="font-display text-xl md:text-2xl tracking-[-0.02em] text-foreground/95">{stage}</h3>
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/50">
          {meta.label} · {meta.sub}
        </span>
      </div>
      <p className="mt-3 max-w-2xl text-[14.5px] md:text-[15px] leading-[1.7] text-foreground/70">
        {stageExplainer[stage]}
      </p>
    </motion.div>
  );
}

function EvidenceGroupBlock({ index }: { index: number }) {
  const group = evidenceGroups[index];
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.9, delay: index * 0.06, ease: [0.19, 1, 0.22, 1] }}
      className="border-t border-foreground/[0.08] py-7 first:border-t-0 md:py-8"
    >
      <h3 className="font-display text-lg md:text-xl tracking-[-0.015em] text-foreground/95">{group.heading}</h3>
      <div className="mt-4 flex flex-wrap gap-2">
        {group.examples.map((ex) => (
          <EvidenceBadge key={ex} stage={group.stage} label={ex} />
        ))}
      </div>
      <p className="mt-4 max-w-2xl text-[14.5px] md:text-[15px] leading-[1.7] text-foreground/70">
        {group.explainer}
      </p>
    </motion.div>
  );
}

function EvidenceStandardsPage() {
  return (
    <CinematicPageShell
      eyebrow="Reference · How This Catalogue Is Labelled"
      title={<>Evidence & development-stage<br className="hidden md:inline" /> standards.</>}
      lead="How every claim across the Innovations catalogue is graded — from bench formulation to field deployment — so a label's confidence level is never left to guesswork."
      backdrop={backdrop}
      overlay={0.8}
    >
      <EditorialSection number="01 · Development Stage" heading="Three stages, one honest hierarchy.">
        <p>
          Every technology on the Innovations page carries one of three stage
          labels. Stage describes how far the work has moved from the lab
          bench toward the market — nothing more.
        </p>
        <div className="not-prose mt-2">
          {stageOrder.map((s, i) => (
            <StageRow key={s} stage={s} index={i} />
          ))}
        </div>
        <p className="mt-8 text-[13.5px] leading-[1.7] text-foreground/55">
          These three tiers map loosely, low to high, onto the engineering
          convention of Technology Readiness Level (TRL). No specific numeric
          TRL is assigned to any individual technology on this site — only
          the three-tier band above.
        </p>
      </EditorialSection>

      <EditorialSection number="02 · Evidence Labels" heading="What the status text under each stage means.">
        <p>
          Beside its stage, every technology also carries a short status
          phrase — the founder-authored text shown verbatim on its card. The
          phrases fall into four groups.
        </p>
        <div className="not-prose mt-2">
          {evidenceGroups.map((_, i) => (
            <EvidenceGroupBlock key={evidenceGroups[i].heading} index={i} />
          ))}
        </div>
      </EditorialSection>

      <EditorialSection number="03 · Reading a Claim" heading="Stage first, status second.">
        <p>
          Every numeric or technical claim on the Innovations page is paired
          with both labels. Read the stage first — how far along the
          technology is — and the status second — what specifically has been
          validated, and where. Together they describe the confidence behind
          a number; neither one alone does.
        </p>
        <p>
          For per-technology detail beyond what's shown here — including
          specific patent-filing stage — write in through Engage.
        </p>
      </EditorialSection>

      {/* Page-ending CTA — one clear next step */}
      <div className="not-prose mt-24 mb-4 flex flex-col items-center gap-6 border-t border-foreground/[0.06] pt-20">
        <p className="font-mono text-[10px] uppercase tracking-[0.42em] text-foreground/40">Continue</p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1.0, ease: [0.19, 1, 0.22, 1] }}
        >
          <Link
            to="/innovations"
            className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 md:px-10 md:py-5 bg-[oklch(0.07_0.005_245)] border border-foreground/[0.10] rounded-sm transition-all duration-700 hover:border-foreground/25 hover:bg-[oklch(0.09_0.005_245)]"
          >
            <span className="relative font-mono text-[11px] uppercase tracking-[0.35em] text-foreground/75 group-hover:text-foreground/90 transition-colors duration-700">
              View the Innovations Catalogue
            </span>
            <span className="relative font-mono text-[10px] text-foreground/40 group-hover:text-foreground/60 transition-colors duration-700">→</span>
          </Link>
        </motion.div>
      </div>
    </CinematicPageShell>
  );
}
