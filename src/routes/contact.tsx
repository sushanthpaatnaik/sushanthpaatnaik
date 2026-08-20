import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import CinematicPageShell, {
  EditorialSection,
} from "@/components/scene/CinematicPageShell";
import { StatsStrip } from "@/components/scene/cinematic";
import backdrop from "@/assets/story-07-future.webp";
import { breadcrumbSchema, ldJsonScript, webPageSchema } from "@/lib/seo";
import { track } from "@/lib/analytics";

const description =
  "Direct line to Sushanth Paatnaik. Selective access for partnerships, capital, research collaboration, advisory, and press — read and triaged personally.";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => ({
    meta: [
      { title: "Contact — Sushanth Paatnaik" },
      { name: "description", content: description },
      { property: "og:title", content: "Contact — Sushanth Paatnaik" },
      {
        property: "og:description",
        content:
          "A founder-access interface. Direct, restrained, and personally triaged.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://sushanthpaatnaik.com/contact" },
      { property: "og:image", content: "https://sushanthpaatnaik.com/social-preview.webp" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://sushanthpaatnaik.com/social-preview.webp" },
    ],
    links: [{ rel: "canonical", href: "https://sushanthpaatnaik.com/contact" }],
    scripts: [
      ldJsonScript(
        webPageSchema({ type: "ContactPage", name: "Contact — Sushanth Paatnaik", description, path: "/contact" }),
      ),
      ldJsonScript(breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Contact", path: "/contact" }])),
    ],
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
  { id: "partnership", label: "Industry Partnerships" },
  { id: "advisory", label: "Strategic Advisory" },
  { id: "speaking", label: "Speaking Engagements" },
  { id: "ventures", label: "Deep-Tech Ventures" },
  { id: "research", label: "Research Collaborations" },
] as const;

type IntentId = (typeof intents)[number]["id"];

/**
 * Web3Forms access key — get a free one at https://web3forms.com (enter the
 * destination inbox, e.g. info@sushanthpaatnaik.com, and copy the key it
 * emails you). This value is public by design and safe to ship in client code.
 *
 * While it's empty, the form gracefully falls back to opening the visitor's
 * mail client (the previous behaviour) so nothing is ever broken. Once set,
 * the form submits in-page and shows a "Message sent" confirmation — no email
 * app required for the visitor.
 */
const WEB3FORMS_ACCESS_KEY = "d97a576d-542a-4f25-bf19-04ef9df0f7f5";

/* ---------- Premium founder access form ---------- */

function AccessForm() {
  const [intent, setIntent] = useState<IntentId>("partnership");
  const [name, setName] = useState("");
  const [org, setOrg] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [context, setContext] = useState("");
  const [focused, setFocused] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

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
      `Phone · ${phone || "—"}`,
      "",
      `Context`,
      context || "—",
    ].join("\n");
    return `mailto:info@sushanthpaatnaik.com?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
  }, [intentLabel, name, org, email, phone, context]);

  const ready = Boolean(name.trim() && email.trim() && context.trim());

  const missingReason = useMemo(() => {
    if (ready) return null;
    const missing: string[] = [];
    if (!name.trim()) missing.push("your name");
    if (!email.trim()) missing.push("your email");
    if (!context.trim()) missing.push("a note in Context");
    if (!missing.length) return null;
    return `Add ${missing.join(", ")} to open the line.`;
  }, [ready, name, email, context]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!ready || status === "sending") return;

    // No key configured yet → keep the old behaviour so the form never breaks.
    if (!WEB3FORMS_ACCESS_KEY) {
      window.location.href = mailto;
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: `[${intentLabel}] — ${name}`,
          from_name: name,
          Intent: intentLabel,
          Name: name,
          Organisation: org || "—",
          Email: email,
          Phone: phone || "—",
          Context: context,
        }),
      });
      const data = await res.json();
      if (data?.success) {
        setStatus("sent");
        track("contact_submit", { intent: intentLabel, outcome: "sent" });
      } else {
        setStatus("error");
        // Tracked too: a form that silently fails is exactly the thing you
        // want to see in the numbers, and without this the funnel would show
        // the failures as people who simply never submitted.
        track("contact_submit", { intent: intentLabel, outcome: "rejected" });
      }
    } catch {
      setStatus("error");
      track("contact_submit", { intent: intentLabel, outcome: "network_error" });
    }
  }

  const fieldClasses = (key: string) => {
    const isActive = focused === key;
    return `w-full bg-transparent border-0 border-b ${
      isActive ? "border-accent/60" : "border-foreground/[0.12]"
    } px-0 py-4 font-display text-[17px] md:text-[19px] tracking-[-0.005em] text-foreground/95 placeholder:text-foreground/25 placeholder:font-display placeholder:italic focus:outline-none focus:ring-0 field-underline transition-colors duration-500`;
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 1.3, ease: [0.19, 1, 0.22, 1] }}
      className="not-prose relative mt-16"
      onSubmit={handleSubmit}
    >
      {/* Console header — paper tape */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-y border-foreground/15 py-3 font-mono text-[10px] uppercase tracking-[0.5em] text-muted-foreground/55">
        <span className="text-accent/80">Access Protocol</span>{" "}
        <span className="hidden md:inline text-muted-foreground/40">
          Form № 01 · Single inbox
        </span>{" "}
        <span className="text-primary/70">Triaged personally</span>
      </div>

      <div className="grid grid-cols-1 gap-x-16 gap-y-14 pt-16 md:pt-20 md:grid-cols-[1fr_2fr]">
        {/* Intent — column 01 */}
        <div>
          <div className="flex items-baseline justify-between gap-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.5em] text-muted-foreground/55">
              01 · Intent
            </p>
            <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-accent/70">
              Select one
            </span>
          </div>
          <p className="mt-2 font-display italic text-[13px] text-foreground/40">
            Choose the nature of your inquiry — one is pre-selected.
          </p>
          <div className="mt-6 flex flex-col" role="radiogroup" aria-label="Intent">
            {intents.map((i) => {
              const active = intent === i.id;
              return (
                <div key={i.id}>
                  <button
                    type="button"
                    onClick={() => setIntent(i.id)}
                    role="radio"
                    aria-checked={active}
                    className={`group grid w-full cursor-pointer grid-cols-[1.25rem_1fr] items-center gap-4 border-t border-foreground/[0.08] py-4 text-left transition-colors duration-500 ${
                      active ? "text-foreground" : "text-foreground/55 hover:text-foreground/90"
                    }`}
                  >
                    {/* Radio-style dot — a clear single-choice affordance */}
                    <span
                      aria-hidden
                      className={`relative flex h-4 w-4 items-center justify-center rounded-full border transition-all duration-300 ${
                        active
                          ? "border-accent"
                          : "border-foreground/30 group-hover:border-foreground/60"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full transition-transform duration-300 ${
                          active
                            ? "scale-100 bg-accent"
                            : "scale-0 bg-foreground/50 group-hover:scale-75"
                        }`}
                      />
                    </span>
                    <span className="font-display text-[17px] md:text-[18px] tracking-[-0.005em]">
                      {i.label}
                    </span>
                  </button>
                </div>
              );
            })}
            <div className="border-t border-foreground/[0.08]" />
          </div>
        </div>

        {/* Fields — column 02 */}
        <div className="flex flex-col gap-12">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
            <div>
              <label htmlFor="contact-name" className="block font-mono text-[10px] uppercase tracking-[0.5em] text-muted-foreground/55">
                02 · Name
              </label>
              <input
                id="contact-name"
                type="text"
                required
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onFocus={() => setFocused("name")}
                onBlur={() => setFocused(null)}
                placeholder="Your full name"
                className={`${fieldClasses("name")} mt-5`}
              />
            </div>
            <div>
              <label htmlFor="contact-org" className="block font-mono text-[10px] uppercase tracking-[0.5em] text-muted-foreground/55">
                03 · Organisation
              </label>
              <input
                id="contact-org"
                type="text"
                autoComplete="organization"
                value={org}
                onChange={(e) => setOrg(e.target.value)}
                onFocus={() => setFocused("org")}
                onBlur={() => setFocused(null)}
                placeholder="Company, fund, lab, or independent"
                className={`${fieldClasses("org")} mt-5`}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
            <div>
              <label htmlFor="contact-email" className="block font-mono text-[10px] uppercase tracking-[0.5em] text-muted-foreground/55">
                04 · Email
              </label>
              <input
                id="contact-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocused("email")}
                onBlur={() => setFocused(null)}
                placeholder="you@domain.com"
                className={`${fieldClasses("email")} mt-5`}
              />
            </div>
            <div>
              <label htmlFor="contact-phone" className="block font-mono text-[10px] uppercase tracking-[0.5em] text-muted-foreground/55">
                05 · Phone <span className="text-muted-foreground/30">· optional</span>
              </label>
              <input
                id="contact-phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                onFocus={() => setFocused("phone")}
                onBlur={() => setFocused(null)}
                placeholder="+91 00000 00000"
                className={`${fieldClasses("phone")} mt-5`}
              />
            </div>
          </div>

          <div>
            <div className="flex items-baseline justify-between">
              <label htmlFor="contact-context" className="font-mono text-[10px] uppercase tracking-[0.5em] text-muted-foreground/55">
                06 · Context
              </label>
              <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-muted-foreground/35">
                {context.length.toString().padStart(3, "0")} / 600
              </span>
            </div>
            <p className="mt-2 font-display italic text-[13px] text-foreground/40">
              One paragraph on what you are building, or considering.
            </p>
            <textarea
              id="contact-context"
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
        </div>
      </div>

      {/* CTA hierarchy */}
      <div className="mt-20 border-t border-foreground/15 pt-10">
        {status === "sent" ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
            className="flex flex-col items-center gap-5 py-8 text-center"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full border border-accent/40 text-accent">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </span>
            <p className="font-display text-[20px] md:text-[24px] tracking-[-0.015em] text-foreground/92">
              Message sent.
            </p>
            <p className="max-w-md font-mono text-[10px] uppercase tracking-[0.4em] text-muted-foreground/55 leading-relaxed">
              Received directly · a reply typically follows within 48 hours.
            </p>
          </motion.div>
        ) : (
          <>
            <div className="flex flex-col-reverse items-stretch gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex flex-col gap-2 font-mono text-[10px] uppercase tracking-[0.5em] text-muted-foreground/45">
                <span>Reply window · 48 hours</span>
                <a
                  href="mailto:info@sushanthpaatnaik.com?subject=Hello"
                  className="inline-flex min-h-6 items-center text-foreground/65 transition-colors hover:text-accent"
                >
                  Or write directly &nbsp;—↗
                </a>
              </div>
              <div className="flex flex-col items-stretch gap-3 sm:items-end">
                <button
                  type="submit"
                  disabled={!ready || status === "sending"}
                  className={`group relative inline-flex items-center justify-center gap-4 overflow-hidden border px-9 py-5 font-mono text-[10px] uppercase tracking-[0.55em] transition-all duration-700 ${
                    ready && status !== "sending"
                      ? "border-foreground/85 bg-foreground/95 text-background hover:border-accent hover:bg-accent"
                      : "cursor-not-allowed border-foreground/35 bg-foreground/[0.04] text-foreground/60"
                  }`}
                >
                  <span className="relative z-10">
                    {status === "sending" ? "Sending…" : "Send message"}
                  </span>
                  {status !== "sending" && (
                    <span className="relative z-10 transition-transform duration-700 group-hover:translate-x-1.5">
                      —→
                    </span>
                  )}
                </button>
                {status === "error" ? (
                  <p className="max-w-[280px] text-right font-mono text-[10px] uppercase tracking-[0.3em] text-[oklch(0.72_0.15_25)]/80 sm:max-w-none">
                    Couldn&apos;t send —{" "}
                    <a href={mailto} className="underline underline-offset-2 hover:text-accent">
                      email directly
                    </a>
                    .
                  </p>
                ) : missingReason ? (
                  <p className="max-w-[280px] text-right font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/45 sm:max-w-none">
                    {missingReason}
                  </p>
                ) : null}
              </div>
            </div>
            <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.45em] text-muted-foreground/40">
              {WEB3FORMS_ACCESS_KEY
                ? "Your message goes straight to the founder's inbox — no email app required. Nothing else is stored on this site."
                : "Submitting opens your mail client with the inquiry pre-composed. Nothing is stored on this site."}
            </p>
          </>
        )}
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
        { v: "01", l: "Personally read" },
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
          Build with<br className="hidden md:inline" /> Sushanth.
        </>
      }
      lead="One inbox. Read personally. Open to industry partnerships, strategic advisory, speaking, deep-tech ventures, and research collaborations — when the work is right."
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
          {/* Trailing {" "} keeps the two sentences apart in the text stream;
              `block` only separates them visually. See the twin on /engage. */}
          Building systems for industrial futures and material intelligence.{" "}
          <span className="block mt-3 text-foreground/55 italic">
            The desk is small on purpose — opened only for work that deserves a multi-year horizon.
          </span>
        </p>
      </motion.div>

      <AccessForm />

      <EditorialSection number="07 · Direct lines" heading="The shortest path.">
        <p>
          <a
            href="mailto:info@sushanthpaatnaik.com?subject=Hello"
            className="inline-flex min-h-6 items-center text-foreground underline-offset-4 hover:underline"
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
                className="inline-flex min-h-6 items-center text-foreground/70 hover:text-accent transition-colors"
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
