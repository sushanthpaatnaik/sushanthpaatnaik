import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import CinematicPageShell, {
  EditorialSection,
} from "@/components/scene/CinematicPageShell";
import backdrop from "@/assets/story-07-future.jpg";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => ({
    meta: [
      { title: "Contact — Sushanth Paatnaik" },
      {
        name: "description",
        content:
          "Direct line to Sushanth Paatnaik. Selective access for partnerships, capital, research collaboration, advisory, and press — read and triaged personally.",
      },
      { property: "og:title", content: "Contact — Sushanth Paatnaik" },
      {
        property: "og:description",
        content:
          "A founder-access interface. Direct, restrained, and personally triaged.",
      },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
});

const socials = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/sushanthpaatnaik/" },
  { label: "Twitter / X", href: "https://x.com/sushantinthinks" },
  { label: "YouTube", href: "https://www.youtube.com/@Susantinventions" },
  { label: "Instagram", href: "https://www.instagram.com/sushanthpaatnaik/" },
  { label: "Facebook", href: "https://www.facebook.com/sushanthpaatnaik" },
];

const intents = [
  { id: "partnership", label: "Industrial partnership" },
  { id: "capital", label: "Capital co-architecture" },
  { id: "research", label: "Research collaboration" },
  { id: "advisory", label: "Advisory · Board" },
  { id: "editorial", label: "Editorial · Speaking" },
] as const;

type IntentId = (typeof intents)[number]["id"];

/* ---------- Premium founder access form ---------- */

function AccessForm() {
  const [intent, setIntent] = useState<IntentId>("partnership");
  const [name, setName] = useState("");
  const [org, setOrg] = useState("");
  const [email, setEmail] = useState("");
  const [context, setContext] = useState("");
  const [ask, setAsk] = useState("");
  const [focused, setFocused] = useState<string | null>(null);

  const intentLabel = useMemo(
    () => intents.find((i) => i.id === intent)?.label ?? "Inquiry",
    [intent],
  );

  const mailto = useMemo(() => {
    const subject = `[${intentLabel}] — ${name || "New inquiry"}`;
    const body = [
      `Intent · ${intentLabel}`,
      "",
      `Name · ${name || "—"}`,
      `Organisation · ${org || "—"}`,
      `Email · ${email || "—"}`,
      "",
      `Context`,
      context || "—",
      "",
      `What a conversation would change`,
      ask || "—",
    ].join("\n");
    return `mailto:info@sushanthpaatnaik.com?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
  }, [intentLabel, name, org, email, context, ask]);

  const ready = name.trim() && email.trim() && context.trim().length > 20;

  const fieldClasses = (key: string) => {
    const isActive = focused === key;
    return `w-full bg-transparent border-0 border-b ${
      isActive ? "border-accent/70" : "border-foreground/15"
    } px-0 py-4 text-foreground/90 placeholder:text-foreground/30 focus:outline-none focus:ring-0 transition-colors duration-500`;
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
      className="not-prose relative mt-12 overflow-hidden rounded-sm border border-foreground/[0.08] bg-[oklch(0.05_0.006_245)]/80 backdrop-blur-sm"
      onSubmit={(e) => {
        e.preventDefault();
        if (!ready) return;
        window.location.href = mailto;
      }}
    >
      {/* Soft luminous wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(80% 60% at 15% 0%, oklch(0.42 0.07 240 / 0.10), transparent 60%), radial-gradient(60% 50% at 100% 100%, oklch(0.62 0.10 55 / 0.07), transparent 60%)",
        }}
      />

      <div className="relative p-7 md:p-12">
        {/* Header strip */}
        <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-foreground/[0.08] pb-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-accent/85">
            Access Protocol · Inquiry Form
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-muted-foreground/55">
            Selective · Triaged personally
          </p>
        </div>

        {/* Intent selector */}
        <div className="mt-9">
          <label className="block font-mono text-[10px] uppercase tracking-[0.4em] text-muted-foreground/60">
            01 · Intent
          </label>
          <div className="mt-5 flex flex-wrap gap-2">
            {intents.map((i) => {
              const active = intent === i.id;
              return (
                <button
                  key={i.id}
                  type="button"
                  onClick={() => setIntent(i.id)}
                  className={`group relative inline-flex items-center gap-2 rounded-full border px-4 py-2 font-mono text-[10px] uppercase tracking-[0.28em] transition-all duration-500 ${
                    active
                      ? "border-accent/60 bg-accent/10 text-foreground"
                      : "border-foreground/15 text-foreground/55 hover:border-foreground/35 hover:text-foreground/85"
                  }`}
                >
                  <span
                    className={`h-1 w-1 rounded-full transition-colors duration-500 ${
                      active ? "bg-accent" : "bg-foreground/30"
                    }`}
                  />
                  {i.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Identification */}
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-10">
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-[0.4em] text-muted-foreground/60">
              02 · Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              onFocus={() => setFocused("name")}
              onBlur={() => setFocused(null)}
              placeholder="Your full name"
              className={fieldClasses("name")}
            />
          </div>
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-[0.4em] text-muted-foreground/60">
              03 · Organisation
            </label>
            <input
              type="text"
              value={org}
              onChange={(e) => setOrg(e.target.value)}
              onFocus={() => setFocused("org")}
              onBlur={() => setFocused(null)}
              placeholder="Company, fund, lab, or independent"
              className={fieldClasses("org")}
            />
          </div>
        </div>

        <div className="mt-8 md:mt-10">
          <label className="block font-mono text-[10px] uppercase tracking-[0.4em] text-muted-foreground/60">
            04 · Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => setFocused("email")}
            onBlur={() => setFocused(null)}
            placeholder="you@domain.com"
            className={fieldClasses("email")}
          />
        </div>

        {/* The two paragraphs */}
        <div className="mt-10">
          <div className="flex items-baseline justify-between">
            <label className="font-mono text-[10px] uppercase tracking-[0.4em] text-muted-foreground/60">
              05 · Context — one paragraph
            </label>
            <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground/40">
              {context.length.toString().padStart(3, "0")} / 600
            </span>
          </div>
          <textarea
            required
            maxLength={600}
            rows={4}
            value={context}
            onChange={(e) => setContext(e.target.value)}
            onFocus={() => setFocused("context")}
            onBlur={() => setFocused(null)}
            placeholder="What you are building, or considering."
            className={`${fieldClasses("context")} resize-none leading-[1.7]`}
          />
        </div>

        <div className="mt-10">
          <div className="flex items-baseline justify-between">
            <label className="font-mono text-[10px] uppercase tracking-[0.4em] text-muted-foreground/60">
              06 · Why this conversation — one paragraph
            </label>
            <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground/40">
              {ask.length.toString().padStart(3, "0")} / 400
            </span>
          </div>
          <textarea
            maxLength={400}
            rows={3}
            value={ask}
            onChange={(e) => setAsk(e.target.value)}
            onFocus={() => setFocused("ask")}
            onBlur={() => setFocused(null)}
            placeholder="What a conversation would change."
            className={`${fieldClasses("ask")} resize-none leading-[1.7]`}
          />
        </div>

        {/* CTA hierarchy */}
        <div className="mt-14 flex flex-col-reverse items-stretch gap-4 border-t border-foreground/[0.08] pt-8 sm:flex-row sm:items-center sm:justify-between">
          <a
            href="mailto:info@sushanthpaatnaik.com?subject=Hello"
            className="font-mono text-[10px] uppercase tracking-[0.4em] text-foreground/55 transition-colors hover:text-foreground/90"
          >
            Or write directly →
          </a>
          <button
            type="submit"
            disabled={!ready}
            className={`group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-sm px-7 py-4 font-mono text-[10px] uppercase tracking-[0.4em] transition-all duration-500 ${
              ready
                ? "bg-foreground/95 text-background hover:bg-accent hover:text-background"
                : "cursor-not-allowed bg-foreground/[0.06] text-foreground/35"
            }`}
          >
            <span className="relative z-10">Open the line</span>
            <span className="relative z-10 transition-transform duration-500 group-hover:translate-x-1">
              →
            </span>
          </button>
        </div>

        <p className="mt-6 font-mono text-[9px] uppercase tracking-[0.35em] text-muted-foreground/45">
          Submitting opens your mail client with the inquiry pre-composed. Nothing is stored.
        </p>
      </div>
    </motion.form>
  );
}

function AccessAuthority() {
  const items = [
    { v: "48h", l: "Typical reply" },
    { v: "01", l: "Inbox · personally read" },
    { v: "Selective", l: "Engagement policy" },
    { v: "Global", l: "Operating reach" },
  ];
  return (
    <div className="not-prose mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-sm border border-foreground/[0.08] bg-foreground/[0.06] md:grid-cols-4">
      {items.map((s, i) => (
        <motion.div
          key={s.l}
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1, delay: i * 0.06, ease: [0.19, 1, 0.22, 1] }}
          className="bg-[oklch(0.05_0.006_245)] px-5 py-6 md:px-7 md:py-8"
        >
          <p className="font-display text-xl md:text-2xl tracking-[-0.02em] text-foreground/95">
            {s.v}
          </p>
          <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.34em] text-muted-foreground/60">
            {s.l}
          </p>
        </motion.div>
      ))}
    </div>
  );
}

function ContactPage() {
  return (
    <CinematicPageShell
      eyebrow="Contact · Direct Line · By Appointment"
      title={
        <>
          A short note, read<br className="hidden md:inline" /> by the founder.
        </>
      }
      lead="One inbox. Read personally. Open to collaborations on sustainable technology, R&D consulting, advisory mandates, and deep-tech investments — when the work is right."
      backdrop={backdrop}
      overlay={0.76}
    >
      <AccessAuthority />

      <AccessForm />

      <EditorialSection number="07 · Direct lines" heading="The shortest path.">
        <p>
          <a
            href="mailto:info@sushanthpaatnaik.com?subject=Hello"
            className="text-foreground underline-offset-4 hover:underline"
          >
            info@sushanthpaatnaik.com
          </a>
        </p>
        <p className="text-foreground/65">
          A short, specific note moves faster than a long one. One paragraph on
          context, one on what you are hoping to build.
        </p>
      </EditorialSection>

      <EditorialSection number="08 · Geography" heading="Bhubaneswar · New Delhi · Ahmedabad.">
        <p>
          Work travel across Europe, the Gulf, and Southeast Asia on a
          recurring basis.
        </p>
      </EditorialSection>

      <EditorialSection number="09 · Registry" heading="Find me elsewhere.">
        <ul className="not-prose mt-4 flex flex-wrap gap-x-8 gap-y-3 font-mono text-[11px] uppercase tracking-[0.3em]">
          {socials.map((s) => (
            <li key={s.label}>
              <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/70 hover:text-accent transition-colors"
              >
                {s.label} <span className="opacity-60">↗</span>
              </a>
            </li>
          ))}
        </ul>
      </EditorialSection>

      <EditorialSection number="10 · Signal" heading="What to write about.">
        <p>
          Industrial partnerships in advanced materials. Capital co-architecture
          for deep-tech. Research collaboration in graphene, energy, water, or
          climate systems. Advisory and board work. Editorial, press, and
          speaking.
        </p>
      </EditorialSection>

      <EditorialSection number="11 · Noise" heading="Kept off the desk.">
        <p>
          Generic outreach, mass campaigns, or unsolicited fundraising decks.
          The inbox is small on purpose, so signal can survive.
        </p>
      </EditorialSection>
    </CinematicPageShell>
  );
}
