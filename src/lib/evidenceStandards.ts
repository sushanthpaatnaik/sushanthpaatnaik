/**
 * Shared vocabulary for how development stage and evidence status are
 * graded across the Innovations catalogue. Single source of truth for
 * both the Innovations page (which applies these labels) and the
 * Evidence & Development-Stage Standards page (which explains them) —
 * so the explanation can never drift from what's actually shown.
 */

export type Stage = "Commercial" | "Pilot" | "R&D";

export const stageMeta: Record<Stage, { label: string; sub: string; tone: string }> = {
  Commercial: { label: "Field-Deployed", sub: "Manufacturing · Market", tone: "Stage I" },
  Pilot: { label: "Plant & Field Pilots", sub: "Validation · Scale-up", tone: "Stage II" },
  "R&D": { label: "R&D · Bench", sub: "Formulation · Prototyping", tone: "Stage III" },
};

export const stageExplainer: Record<Stage, string> = {
  Commercial: "In active manufacturing, sold, or deployed in the field.",
  Pilot: "Undergoing plant-scale or field trials ahead of commercial rollout.",
  "R&D": "Laboratory bench stage — formulation and prototyping, not yet field- or plant-tested.",
};

/**
 * Evidence-label groups — every distinct `status` string used across the
 * 25-item catalogue, grouped by what kind of claim it makes. Each `example`
 * is a verbatim status string that actually appears on an Innovations card;
 * nothing here is invented vocabulary the site doesn't otherwise use.
 */
export type EvidenceGroup = {
  heading: string;
  examples: string[];
  explainer: string;
  stage: Stage;
};

export const evidenceGroups: EvidenceGroup[] = [
  {
    heading: "Patent-associated",
    examples: [
      "Patent · Field-deployed",
      "Patent · Retail",
      "Patent · Industrial",
      "Patent · Cell trials",
      "Patent · Fleet trial",
    ],
    explainer:
      "A patent filing exists for the underlying technology. The word after · describes where the product itself currently stands — already in field deployment, sold at retail, running on an industrial line, or in cell/fleet trials — not the patent's own grant status. Per-technology filing stage (filed, pending, or granted) is tracked internally; ask via Engage for specifics on a given technology.",
    stage: "Commercial",
  },
  {
    heading: "Pilot validation",
    examples: [
      "Plant pilot",
      "Field pilot",
      "Industrial pilot",
      "Membrane trial",
      "Prototype field-trial",
      "Composite pilot",
      "Stack pilot",
    ],
    explainer:
      "The technology has moved beyond the lab bench into a live pilot — at a partner's plant, in the field, on an industrial line, or as a working membrane, prototype, or stack under real operating conditions — but has not yet reached full commercial deployment.",
    stage: "Pilot",
  },
  {
    heading: "Novelty claim",
    examples: ["World-first system"],
    explainer:
      "Describes technical novelty — a first-of-its-kind system — not maturity. Read it alongside the item's own Stage label: a “world-first” can still be at Pilot, not yet Commercial.",
    stage: "Pilot",
  },
  {
    heading: "R&D / bench",
    examples: ["R&D · Bench", "R&D · Compound"],
    explainer:
      "Still at laboratory bench stage: formulation, synthesis, or compound development. Not yet validated in a pilot, plant, or field setting.",
    stage: "R&D",
  },
];
