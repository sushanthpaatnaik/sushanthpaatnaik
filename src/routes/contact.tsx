import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import CinematicPageShell, {
  EditorialSection,
} from "@/components/scene/CinematicPageShell";
import { StatsStrip } from "@/components/scene/cinematic";
import backdrop from "@/assets/story-07-future.webp";

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
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://sushanthpaatnaik.com/contact" },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/ltIXu6wU6aadaSBkdDy2XzqPo5C3/social-images/social-1779549424976-12345.webp" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/ltIXu6wU6aadaSBkdDy2XzqPo5C3/social-images/social-1779549424976-12345.webp" },
    ],
    links: [{ rel: "canonical", href: "https://sushanthpaatnaik.com/contact" }],
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
    return `mailto:me@sushanthpaatnaik.com?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
  }, [intentLabel, name, org, email, context, ask]);

  const ready = name.trim() && email.trim() && context.trim().length > 20;

  const fieldClasses = (key: string) => {
    const isActive = focused === key;
    return `w-full bg-transparent border-0 border-b ${
      isActive ? "border-accent/60" : "border-foreground/[0.12]"
    } px-0 py-4 font-display text-[17px] md:text-[19px] tracking-[-0.005em] text-foreground/95 placeholder:text-foreground/25 placeholder:font-display placeholder:italic focus:outline-none focus:ring-0 transition-colors duration-500`;
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 1.3, ease: [0.19, 1, 0.22, 1] }}
      className="not-prose relative mt-16"
      onSubmit={(e) => {
        e.preventDefault();
        if (!ready) return;
        window.location.href = mailto;
      }}
    >
      {/* Console header — paper tape */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-y border-foreground/15 py-3 font-mono text-[10px] uppercase tracking-[0.5em] text-muted-foreground/55">
        <span className="text-accent/80">Access Protocol</span>
        <span className="hidden md:inline text-muted-foreground/40">
          Form № 01 · Single inbox
        </span>
        <span className="text-primary/70">Triaged personally</span>
      </div>

      <div className="grid grid-cols-1 gap-x-16 gap-y-14 pt-16 md:pt-20 md:grid-cols-[1fr_2fr]">
        {/* Intent — column 01 */}
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.5em] text-muted-foreground/55">
            01 · Intent
          </p>
          <ul className="mt-8 flex flex-col">
            {intents.map((i) => {
              const active = intent === i.id;
              return (
                <li key={i.id}>
                  <button
                    type="button"
                    onClick={() => setIntent(i.id)}
                    aria-pressed={active}
                    className={`group grid w-full grid-cols-[1.25rem_1fr] items-baseline gap-4 border-t border-foreground/[0.08] py-4 text-left transition-colors duration-500 ${
                      active ? "text-foreground" : "text-foreground/55 hover:text-foreground/85"
                    }`}
                  >
                    <span
                      aria-hidden
                      className={`relative mt-2 h-px w-3 transition-all duration-500 ${
                        active ? "w-5 bg-accent" : "bg-foreground/25 group-hover:bg-foreground/55"
                      }`}
                    />
                    <span className="font-display text-[17px] md:text-[18px] tracking-[-0.005em]">
                      {i.label}
                    </span>
                  </button>
                </li>
              );
            })}
            <li className="border-t border-foreground/[0.08]" />
          </ul>
        </div>

        {/* Fields — column 02 */}
        <div className="flex flex-col gap-12">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-[0.5em] text-muted-foreground/55">
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
                className={`${fieldClasses("name")} mt-5`}
              />
            </div>
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-[0.5em] text-muted-foreground/55">
                03 · Organisation
              </label>
              <input
                type="text"
                value={org}
                onChange={(e) => setOrg(e.target.value)}
                onFocus={() => setFocused("org")}
                onBlur={() => setFocused(null)}
                placeholder="Company, fund, lab, or independent"
                className={`${fieldClasses("org")} mt-5`}
              />
            </div>
          </div>

          <div>
            <label className="block font-mono text-[10px] uppercase tracking-[0.5em] text-muted-foreground/55">
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
              className={`${fieldClasses("email")} mt-5`}
            />
          </div>

          <div>
            <div className="flex items-baseline justify-between">
              <label className="font-mono text-[10px] uppercase tracking-[0.5em] text-muted-foreground/55">
                05 · Context
              </label>
              <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-muted-foreground/35">
                {context.length.toString().padStart(3, "0")} / 600
              </span>
            </div>
            <p className="mt-2 font-display italic text-[13px] text-foreground/40">
              One paragraph on what you are building, or considering.
            </p>
            <textarea
              required
              maxLength={600}
              rows={4}
              value={context}
              onChange={(e) => setContext(e.target.value)}
              onFocus={() => setFocused("context")}
              onBlur={() => setFocused(null)}
              placeholder="Begin here…"
              className={`${fieldClasses("context")} mt-5 resize-none leading-[1.75]`}
            />
          </div>

          <div>
            <div className="flex items-baseline justify-between">
              <label className="font-mono text-[10px] uppercase tracking-[0.5em] text-muted-foreground/55">
                06 · Why this conversation
              </label>
              <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-muted-foreground/35">
                {ask.length.toString().padStart(3, "0")} / 400
              </span>
            </div>
            <p className="mt-2 font-display italic text-[13px] text-foreground/40">
              One paragraph on what a conversation would change.
            </p>
            <textarea
              maxLength={400}
              rows={3}
              value={ask}
              onChange={(e) => setAsk(e.target.value)}
              onFocus={() => setFocused("ask")}
              onBlur={() => setFocused(null)}
              placeholder="Begin here…"
              className={`${fieldClasses("ask")} mt-5 resize-none leading-[1.75]`}
            />
          </div>
        </div>
      </div>

      {/* CTA hierarchy */}
      <div className="mt-20 border-t border-foreground/15 pt-10">
        <div className="flex flex-col-reverse items-stretch gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-2 font-mono text-[10px] uppercase tracking-[0.5em] text-muted-foreground/45">
            <span>Reply window · 48 hours</span>
            <a
              href="mailto:me@sushanthpaatnaik.com?subject=Hello"
              className="text-foreground/65 transition-colors hover:text-accent"
            >
              Or write directly &nbsp;—↗
            </a>
          </div>
          <button
            type="submit"
            disabled={!ready}
            className={`group relative inline-flex items-center justify-center gap-4 overflow-hidden border px-9 py-5 font-mono text-[10px] uppercase tracking-[0.55em] transition-all duration-700 ${
              ready
                ? "border-foreground/85 bg-foreground/95 text-background hover:border-accent hover:bg-accent"
                : "cursor-not-allowed border-foreground/15 bg-transparent text-foreground/30"
            }`}
          >
            <span className="relative z-10">Open the line</span>
            <span className="relative z-10 transition-transform duration-700 group-hover:translate-x-1.5">
              —→
            </span>
          </button>
        </div>
        <p className="mt-8 font-mono text-[9px] uppercase tracking-[0.45em] text-muted-foreground/40">
          Submitting opens your mail client with the inquiry pre-composed. Nothing is stored on this site.
        </p>
      </div>
    </motion.form>
  );
}

function AccessAuthority() {
  return (
    <StatsStrip
      className="mt-10"
      items={[
        { v: "48h", l: "Typical reply" },
        { v: "01", l: "Inbox · personally read" },
        { v: "Selective", l: "Engagement policy" },
        { v: "Global", l: "Operating reach" },
      ]}
    />
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

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
        className="not-prose mt-20 border-t border-foreground/[0.08] pt-12"
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.5em] text-accent/75">
          Closing Statement
        </p>
        <p className="mt-6 max-w-2xl font-display text-[19px] md:text-[22px] leading-[1.5] tracking-[-0.015em] text-foreground/85">
          Building systems for industrial futures and material intelligence.
          <span className="block mt-3 text-foreground/55 italic">
            The desk is small on purpose — opened only for work that deserves a multi-year horizon.
          </span>
        </p>
      </motion.div>

      <AccessForm />

      <EditorialSection number="07 · Direct lines" heading="The shortest path.">
        <p>
          <a
            href="mailto:me@sushanthpaatnaik.com?subject=Hello"
            className="text-foreground underline-offset-4 hover:underline"
          >
            me@sushanthpaatnaik.com
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
