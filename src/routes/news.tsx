import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import CinematicPageShell, {
  EditorialSection,
} from "@/components/scene/CinematicPageShell";
import { StatsStrip } from "@/components/scene/cinematic";
import backdrop from "@/assets/scene-media-wall.jpg";


// Press article images
import globalImg from "@/assets/news/global.webp";
import rediffImg from "@/assets/news/rediff.jpg";
import indiaTodayImg from "@/assets/news/indiatoday.webp";
import deccanImg from "@/assets/news/deccan.webp";
import ispirtImg from "@/assets/news/ispirt.webp";
import werindiaImg from "@/assets/news/werindia.webp";
import telegraphEnablerImg from "@/assets/press/telegraph-enabler.webp";
import nifChairImg from "@/assets/news/nif-chair.webp";
import governanceNowImg from "@/assets/news/governance-now.webp";
import wikipediaImg from "@/assets/news/wikipedia-portrait.jpg";
import thePrintImg from "@/assets/news/theprint-portrait-2.jpg";
import newIndianExpressImg from "@/assets/news/new-indian-express-portrait.jpg";
import inkStageImg from "@/assets/press/inktalks-stage.webp";
import toiBhopalImg from "@/assets/news/toi-bhopal.webp";
import toiFab10Img from "@/assets/news/toi-fab10.jpg";
import businessStandardImg from "@/assets/news/business-standard.webp";
import yourStoryImg from "@/assets/news/yourstory-capattery.jpg";
import goldenBookImg from "@/assets/news/golden-book.jpg";

// Outlet logos
import indiaTodayLogo from "@/assets/outlets/india-today.webp";
import toiLogo from "@/assets/outlets/toi-color.webp";
import businessStandardLogo from "@/assets/outlets/business-standard-color.webp";
import deccanLogo from "@/assets/outlets/deccan.webp";
import telegraphLogo from "@/assets/outlets/telegraph-color.svg";
import globalIndianLogo from "@/assets/outlets/global-indian-color.webp";
import mitTrLogo from "@/assets/outlets/mit-tr-color.webp";
import tedLogo from "@/assets/outlets/ted-color.webp";
import nifLogo from "@/assets/outlets/nif-color.webp";
import governanceNowLogo from "@/assets/outlets/governance-now-color.webp";
import rediffLogo from "@/assets/outlets/rediff-color.svg";
import productNationLogo from "@/assets/outlets/productnation-color.webp";
import yourStoryLogo from "@/assets/outlets/yourstory-color.webp";
import werIndiaLogo from "@/assets/outlets/werindia-color.webp";
import wikipediaLogo from "@/assets/outlets/wikipedia.svg";
import thePrintLogo from "@/assets/outlets/theprint.png";
import newIndianExpressLogo from "@/assets/outlets/new-indian-express.png";
import inkTalksLogo from "@/assets/outlets/inktalks.png";
import deloitteLogo from "@/assets/outlets/deloitte-mark.svg";
import ioclLogo from "@/assets/outlets/iocl.png";

export const Route = createFileRoute("/news")({
  component: NewsPage,
  head: () => ({
    meta: [
      { title: "News & Media — Editorial Archive · Sushanth Paatnaik" },
      {
        name: "description",
        content:
          "Editorial archive across MIT Technology Review, The Global Indian, India Today, Times of India, Business Standard, ThePrint, Rediff, Telegraph, Wikipedia and more — fifteen years of coverage.",
      },
      { property: "og:title", content: "News — Sushanth Paatnaik" },
      {
        property: "og:description",
        content:
          "Selected dispatches from the press, the wires, and the conference circuit.",
      },
      { property: "og:url", content: "/news" },
    ],
    links: [{ rel: "canonical", href: "/news" }],
  }),
});

type PressItem = {
  outlet: string;
  date: string;
  tag: string;
  title: string;
  body: string;
  href: string;
  image: string;
  objectPosition?: string;
};

const featured: PressItem = {
  outlet: "The Global Indian",
  date: "June 11, 2022",
  tag: "★ Lead Story",
  title:
    "Six times President awardee Sushant Pattnaik is making a difference with groundbreaking innovations",
  body: "An exclusive cover story chronicling the journey of a serial innovator from Bhubaneswar — from a breath-controlled wheelchair built at 14 to founding multiple deep-tech ventures.",
  href: "https://www.globalindian.com/story/global-indian-exclusive/six-times-president-awardee-sushant-pattnaiks-ground-breaking-innovations/",
  image: globalImg,
};

const secondary: PressItem = {
  outlet: "Rediff · PTI",
  date: "March 9, 2026",
  tag: "Conference",
  title: "India hosts GraphIN 2026 to explore graphene's potential",
  body: "National coverage of GraphIN 2026 in Kochi — the conference convening industry, academia and government to chart India's graphene future.",
  href: "https://www.rediff.com/news/report/graphin-2026-graphene-conference-opens-in-kochi/20260309.htm",
  image: rediffImg,
};

const coverage: PressItem[] = [
  {
    outlet: "India Today",
    date: "2013",
    tag: "Profile",
    title: "New achiever on the block: At 20, Susant Pattnaik is a serial entrepreneur",
    body: "India Today profiles the youngest serial entrepreneur to be honoured by three Presidents of India, with prototypes spanning assistive tech, robotics and energy.",
    href: "https://www.indiatoday.in/india/north/story/innovator-susant-pattnaik-serial-entrepreneur-155970-2013-03-11",
    image: indiaTodayImg,
  },
  {
    outlet: "Deccan Chronicle",
    date: "2013",
    tag: "Profile",
    title: "Susant Pattnaik: Serial entrepreneur at 20",
    body: "The Sunday Chronicle profiles the breath-operated wheelchair innovator and co-founder of two companies — honoured thrice by the President of India before turning 21.",
    href: "https://www.deccanchronicle.com/131208/commentary-sunday-chronicle/article/susant-pattnaik-serial-entrepreneur-20",
    image: deccanImg,
  },
  {
    outlet: "The Telegraph India",
    date: "2010",
    tag: "Innovation",
    title: "Wonderboy innovates technological marvel — a device that can change lives of disabled people",
    body: "At seventeen, Sushant's breath-sensor apparatus drew national attention as a life-changing assistive technology for the physically challenged.",
    href: "https://www.telegraphindia.com/odisha/wonderboy-innovates-technological-marvel-seventeen-year-old-sushant-pattnaik-s-device-can-change-lives-of-disabled-people/cid/477938",
    image: telegraphEnablerImg,
  },
  {
    outlet: "National Innovation Foundation",
    date: "2010",
    tag: "Innovation",
    title: "Breathing sensor apparatus to assist physically challenged",
    body: "NIF-India recognises the IGNITE awardee whose work has led to ten working prototypes, four companies, an MIT Technology Review feature and a TED India talk.",
    href: "https://nif.org.in/innovation/breathing-sensor-apparatus-to-assist-physically-challenged/398",
    image: nifChairImg,
  },
  {
    outlet: "ProductNation · iSPIRT",
    date: "2014",
    tag: "Profile",
    title: "Susant Pattnaik: Real Life 'Doremon' or an Innovation Champ?",
    body: "A long-form profile by India's product think-tank on the young innovator whose gadgets — once compared to Doraemon's — are now solving real-world problems.",
    href: "https://pn.ispirt.in/susant-pattnaik-real-life-doremon-or-an-innovation-champ/",
    image: ispirtImg,
  },
  {
    outlet: "WeRIndia · Fusion",
    date: "2014",
    tag: "Feature",
    title: "One of the Youngest Inventors of Several Innovative Products",
    body: "An 'Unknown Wizards' feature spotlighting Sushant's portfolio of inventions and the social impact of his assistive and clean-tech innovations.",
    href: "https://fusion.werindia.com/unknown-wizards/susant-pattnaik-one-of-the-youngest-inventors-of-several-innovative-products",
    image: werindiaImg,
  },
  {
    outlet: "Governance Now",
    date: "September 16, 2013",
    tag: "Impact",
    title: "A resolve in every breath: a teen helps special people live anew",
    body: "Governance Now profiles the breath-sensor apparatus at the NIF-organised Delhi exhibition — an innovation enabling paralysed and physically challenged people to perform basic chores independently.",
    href: "https://www.governancenow.com/news/regular-story/resolve-every-breath-bhopal-teen-helps-special-people-live-anew",
    image: governanceNowImg,
  },
  {
    outlet: "Times of India · Bhopal",
    date: "April 13, 2015",
    tag: "Profile",
    title: "Susant stuns with patent run & roti SMS — 21 awards and counting",
    body: "TOI Bhopal chronicles a third-year engineering student already holding 21 awards, multiple patents and inventions ranging from a roti-status SMS device to assistive breath-controlled systems.",
    href: "https://timesofindia.indiatimes.com/city/bhopal/susant-stuns-with-patent-run-roti-sms/articleshow/46903296.cms",
    image: toiBhopalImg,
  },
  {
    outlet: "Wikipedia (Odia)",
    date: "2024",
    tag: "Encyclopedia",
    title: "ସୁଶାନ୍ତ ପଟ୍ଟନାୟକ — Wikipedia biographical entry",
    body: "An encyclopedic entry on the Odia Wikipedia chronicling Sushant Pattnaik's life, innovations and recognitions.",
    href: "https://or.wikipedia.org/wiki/%E0%AC%B8%E0%AD%81%E0%AC%B6%E0%AC%BE%E0%AC%A8%E0%AD%8D%E0%AC%A4_%E0%AC%AA%E0%AC%9F%E0%AD%8D%E0%AC%9F%E0%AC%A8%E0%AC%BE%E0%AD%9F%E0%AC%95",
    image: wikipediaImg,
    objectPosition: "center 18%",
  },
  {
    outlet: "Business Standard · ANI",
    date: "March 21, 2022",
    tag: "Innovation",
    title: "Game-changing innovation in battery charging technology by 6-times President awardee",
    body: "Business Standard reports on Sushant's breakthrough in rapid battery charging — a technology poised to charge a smartphone in seconds and reshape the EV and consumer electronics landscape.",
    href: "https://www.business-standard.com/content/press-releases-ani/game-changing-innovation-in-the-world-of-battery-charging-technology-by-6-times-president-awardee-sushant-pattnaik-122032100710_1.html",
    image: businessStandardImg,
  },
  {
    outlet: "ThePrint · ANI",
    date: "March 21, 2022",
    tag: "Innovation",
    title: "Game-changing innovation in battery charging technology by 6-times President awardee",
    body: "ThePrint syndicates the ANI dispatch on Sushant's nano-material battery breakthrough — promising smartphone charges in seconds and EV refuels in minutes.",
    href: "https://theprint.in/ani-press-releases/game-changing-innovation-in-the-world-of-battery-charging-technology-by-6-times-president-awardee-sushant-pattnaik/881783/",
    image: thePrintImg,
  },
  {
    outlet: "The New Indian Express",
    date: "November 7, 2011",
    tag: "Profile",
    title: "Inspired to help poor techies — the teen innovator with the President's ear",
    body: "The New Indian Express profiles a young Sushant Pattnaik on his determination to channel honours into a foundation that supports under-resourced innovators across India.",
    href: "https://www.newindianexpress.com/education/edex/2011/Nov/07/inspired-to-help-poor-techies-307824.html",
    image: newIndianExpressImg,
  },
  {
    outlet: "YourStory",
    date: "January 1, 2021",
    tag: "Startup",
    title: "Capattery — pioneering graphene-based energy storage from India",
    body: "YourStory's company profile of Capattery, the deep-tech venture co-founded by Sushant Pattnaik, building patent-pending graphene nanomaterials for next-generation Battery Energy Storage Systems.",
    href: "https://yourstory.com/companies/capattery",
    image: yourStoryImg,
  },
  {
    outlet: "INK Talks",
    date: "January 1, 2014",
    tag: "Talk",
    title: "Susant Pattnaik — innovator featured on the INK Talks stage",
    body: "INK Talks features Sushant as a young innovator helping differently-abled individuals through breakthroughs like the Breathing Sensor Apparatus.",
    href: "https://inktalks.com/people/susant-pattnaik/",
    image: inkStageImg,
    objectPosition: "right top",
  },
  {
    outlet: "Times of India · Bhopal",
    date: "May 15, 2014",
    tag: "Profile",
    title: "A wiz kid on an invention spree — heading to FAB10 Barcelona",
    body: "TOI Bhopal profiles Sushant — then a second-year engineering student with a string of patents — selected to be honoured at the FAB10 international conference in Barcelona.",
    href: "https://timesofindia.indiatimes.com/city/bhopal/a-wiz-kid-on-an-invention-spree/articleshow/35132755.cms",
    image: toiFab10Img,
  },
  {
    outlet: "Golden Book of World Records",
    date: "2012",
    tag: "World Record",
    title: "Youngest Inventor and Social Entrepreneur",
    body: "The Golden Book of World Records officially recognises Susant Pattnaik for the world record of 'the Youngest Inventor and Social Entrepreneur' — citing his MIT TR-35 selection at 17 and a string of national and international honours.",
    href: "https://goldenbookofworldrecords.com/youngest-inventor-and-social-interpreneur/",
    image: goldenBookImg,
  },
];

const outlets = [
  { name: "India Today", logo: indiaTodayLogo },
  { name: "The Times of India", logo: toiLogo },
  { name: "Business Standard", logo: businessStandardLogo },
  { name: "Deccan Chronicle", logo: deccanLogo },
  { name: "The Telegraph", logo: telegraphLogo },
  { name: "The Global Indian", logo: globalIndianLogo },
  { name: "MIT Technology Review", logo: mitTrLogo },
  { name: "TED India", logo: tedLogo },
  { name: "NIF India", logo: nifLogo },
  { name: "Governance Now", logo: governanceNowLogo },
  { name: "Rediff · PTI", logo: rediffLogo },
  { name: "ProductNation", logo: productNationLogo },
  { name: "YourStory", logo: yourStoryLogo },
  { name: "WeRIndia · Fusion", logo: werIndiaLogo },
  { name: "Wikipedia", logo: wikipediaLogo },
  { name: "ThePrint", logo: thePrintLogo },
  { name: "The New Indian Express", logo: newIndianExpressLogo },
  { name: "INK Talks", logo: inkTalksLogo },
];

const testimonials = [
  {
    quote: "Sushant is an amazing innovator and always innovates with high social impact.",
    author: "Anil K. Gupta",
    role: "Professor, IIM-Ahmedabad · VC, NIF India",
    logo: nifLogo,
  },
  {
    quote: "The best AI live demo ever seen so far. This demo really made my day.",
    author: "P. R. Ramesh",
    role: "Chairman, Deloitte India",
    logo: deloitteLogo,
  },
  {
    quote: "Very effective and innovative solution for underground pipelines.",
    author: "Mr. Joseph",
    role: "IOCL Eastern Zone, India",
    logo: ioclLogo,
  },
  {
    quote: "A very inspiring entrepreneur and great social-revolutionary products.",
    author: "Shradha Sharma",
    role: "Founder & CEO, YourStory",
    logo: yourStoryLogo,
  },
  {
    quote: "A life-changing innovation 'Enabler' for the disabled — highly appreciable.",
    author: "Mr. Srinivas",
    role: "Senior Journalist, MIT TR Magazine",
    logo: mitTrLogo,
  },
];

/* ---------- Editorial primitives ---------- */

function MediaPlate({
  src,
  alt,
  objectPosition,
  className = "",
}: {
  src: string;
  alt: string;
  objectPosition?: string;
  className?: string;
}) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover opacity-70 grayscale-[0.55] contrast-[1.08] brightness-[0.9] transition-all duration-[1200ms] group-hover:opacity-100 group-hover:grayscale-0 group-hover:scale-[1.025]"
        style={{ objectPosition: objectPosition ?? "center" }}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
      <div
        className="pointer-events-none absolute inset-0 mix-blend-overlay opacity-50"
        style={{
          background:
            "radial-gradient(120% 80% at 50% 50%, transparent 45%, oklch(0.02 0 0 / 0.78) 100%)",
        }}
      />
      {/* Archival corner marks */}
      <div className="pointer-events-none absolute left-3 top-3 h-3 w-3 border-l border-t border-foreground/30" />
      <div className="pointer-events-none absolute right-3 top-3 h-3 w-3 border-r border-t border-foreground/30" />
      <div className="pointer-events-none absolute left-3 bottom-3 h-3 w-3 border-l border-b border-foreground/30" />
      <div className="pointer-events-none absolute right-3 bottom-3 h-3 w-3 border-r border-b border-foreground/30" />
    </div>
  );
}

function LeadFeature({ item }: { item: PressItem }) {
  return (
    <motion.a
      href={item.href}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
      className="group not-prose mt-10 block"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-foreground/[0.08] pb-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.45em] text-accent/85">
          Above The Fold · Lead Story
        </p>
        <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-muted-foreground/55">
          {item.outlet} · {item.date}
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-10">
        <MediaPlate
          src={item.image}
          alt={`${item.title} — ${item.outlet}`}
          objectPosition={item.objectPosition}
          className="aspect-[16/9] rounded-sm border border-foreground/[0.08] md:col-span-7"
        />
        <div className="md:col-span-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-primary/75">
            {item.tag}
          </p>
          <h2 className="mt-5 font-display text-[clamp(1.6rem,3.2vw,2.4rem)] leading-[1.05] tracking-[-0.025em] text-foreground/95 transition-colors duration-500 group-hover:text-gradient">
            {item.title}
          </h2>
          <p className="mt-6 font-display italic text-[15px] md:text-[17px] leading-[1.55] text-foreground/80">
            {item.body}
          </p>
          <p className="mt-7 font-mono text-[10px] uppercase tracking-[0.4em] text-foreground/55 transition-colors duration-500 group-hover:text-accent">
            Read the dispatch ↗
          </p>
        </div>
      </div>
    </motion.a>
  );
}

function SecondaryFeature({ item }: { item: PressItem }) {
  return (
    <motion.a
      href={item.href}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 1.15, ease: [0.19, 1, 0.22, 1] }}
      className="group not-prose mt-16 block"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-foreground/[0.08] pb-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.45em] text-accent/70">
          Below The Fold · Featured
        </p>
        <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-muted-foreground/55">
          {item.outlet} · {item.date}
        </p>
      </div>
      <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-10">
        <div className="md:col-span-7 md:order-2">
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-primary/70">
            {item.tag}
          </p>
          <h3 className="mt-5 font-display text-[clamp(1.4rem,2.6vw,2rem)] leading-[1.08] tracking-[-0.02em] text-foreground/95 transition-colors duration-500 group-hover:text-gradient">
            {item.title}
          </h3>
          <p className="mt-5 text-[15px] leading-[1.7] text-foreground/70">
            {item.body}
          </p>
          <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.4em] text-foreground/55 transition-colors duration-500 group-hover:text-accent">
            Continue ↗
          </p>
        </div>
        <MediaPlate
          src={item.image}
          alt={`${item.title} — ${item.outlet}`}
          objectPosition={item.objectPosition}
          className="aspect-[16/10] rounded-sm border border-foreground/[0.08] md:col-span-5 md:order-1"
        />
      </div>
    </motion.a>
  );
}

function IntelligenceStrip() {
  return (
    <StatsStrip
      items={[
        { v: "18", l: "Publications of record" },
        { v: "15", l: "Years of coverage" },
        { v: "16", l: "Archived dispatches" },
        { v: "EN · ଓଡ଼ିଆ", l: "Languages in archive" },
      ]}
    />
  );
}

function ArchiveEntry({ item, index }: { item: PressItem; index: number }) {
  const folio = String(index + 1).padStart(2, "0");
  return (
    <motion.li
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 1, delay: (index % 6) * 0.04, ease: [0.19, 1, 0.22, 1] }}
    >
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative grid grid-cols-[auto_1fr] gap-5 border-t border-foreground/[0.08] py-8 md:grid-cols-[88px_120px_1fr] md:gap-7 md:py-10 transition-colors duration-700 hover:border-foreground/25"
      >
        <span
          aria-hidden
          className="pointer-events-none absolute left-0 top-0 h-px w-0 bg-accent/40 transition-all duration-700 group-hover:w-24"
        />
        {/* Folio + date */}
        <div className="pt-1">
          <p className="font-display text-2xl font-extralight tracking-[-0.02em] text-foreground/30 transition-colors duration-500 group-hover:text-accent/85">
            {folio}
          </p>
          <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.32em] text-muted-foreground/55">
            {item.date}
          </p>
        </div>
        {/* Thumbnail — restrained, only on md+ */}
        <MediaPlate
          src={item.image}
          alt={`${item.title} — ${item.outlet}`}
          objectPosition={item.objectPosition}
          className="hidden aspect-[4/3] rounded-sm border border-foreground/[0.08] md:block"
        />
        {/* Body */}
        <div className="col-span-2 md:col-span-1">
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <span className="font-mono text-[10px] uppercase tracking-[0.36em] text-primary/80">
              {item.outlet}
            </span>
            <span className="font-mono text-[9px] uppercase tracking-[0.32em] text-muted-foreground/55">
              {item.tag}
            </span>
          </div>
          <h3 className="mt-3 font-display text-lg md:text-xl leading-[1.2] tracking-[-0.015em] text-foreground/92 transition-colors duration-500 group-hover:text-gradient">
            {item.title}
          </h3>
          <p className="mt-3 max-w-2xl text-[14px] leading-[1.7] text-foreground/65">
            {item.body}
          </p>
          <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.36em] text-foreground/45 transition-colors duration-500 group-hover:text-accent/90">
            Read ↗
          </p>
        </div>
      </a>
    </motion.li>
  );
}

function NewsPage() {
  return (
    <CinematicPageShell
      eyebrow="News · Media Intelligence · Vol. XV"
      title={
        <>
          The press<br className="hidden md:inline" /> of record.
        </>
      }
      lead="An editorial archive of coverage across fifteen years and eighteen publications — Indian, international, popular press and scientific institutions. Filed chronologically. Read selectively."
      backdrop={backdrop}
      overlay={0.78}
    >
      {/* Intelligence strip */}
      <IntelligenceStrip />

      {/* Masthead */}
      <div className="mt-16 flex flex-wrap items-baseline justify-between gap-3 border-t border-b border-foreground/[0.1] py-4 font-mono text-[10px] uppercase tracking-[0.45em] text-muted-foreground/55">
        <span className="text-primary/80">Press Of Record · MMXXVI</span>
        <span>Curated, Not Complete</span>
        <span>Folio · 01–16</span>
      </div>

      {/* Lead + secondary features */}
      <LeadFeature item={featured} />
      <SecondaryFeature item={secondary} />

      {/* Archive — newspaper register */}
      <EditorialSection number="07 · Archive" heading="Sixteen dispatches of record.">
        <p>
          The press archive in chronological reach — from teenage assistive
          tech in <em>The Telegraph</em> and NIF, to global recognition in
          MIT TR and Wikipedia, to deep-tech reporting on Capattery, GraphIN
          and the battery breakthrough.
        </p>
        <ol className="not-prose mt-12 flex flex-col">
          {coverage.map((item, i) => (
            <ArchiveEntry key={item.href} item={item} index={i} />
          ))}
          <li className="border-t border-foreground/[0.08]" />
        </ol>
      </EditorialSection>

      {/* Mastheads register */}
      <EditorialSection number="08 · Mastheads" heading="Eighteen publications of record.">
        <p>
          The mastheads carrying the work — Indian and international, popular
          press and scientific institutions.
        </p>
        <div className="not-prose mt-12 overflow-hidden rounded-sm border border-foreground/[0.08] bg-[oklch(0.05_0.006_245)]/70">
          <div className="grid grid-cols-2 gap-px bg-foreground/[0.06] sm:grid-cols-3 md:grid-cols-6">
            {outlets.map((o) => (
              <div
                key={o.name}
                className="group flex h-24 items-center justify-center bg-[oklch(0.05_0.006_245)] px-4"
                title={o.name}
              >
                <img
                  src={o.logo}
                  alt={`${o.name} logo`}
                  loading="lazy"
                  className="max-h-9 w-auto max-w-[140px] object-contain opacity-60 saturate-[0.5] brightness-[1.05] mix-blend-screen transition-all duration-700 group-hover:opacity-100 group-hover:saturate-100"
                />
              </div>
            ))}
          </div>
        </div>
      </EditorialSection>

      {/* Voices — broadsheet pull-quotes */}
      <EditorialSection number="09 · Voices" heading="On the work, in their words.">
        <p>
          A short reel of voices from institutions that have seen the work
          firsthand — from NIF and MIT TR to Deloitte, IOCL and YourStory.
        </p>
        <ul className="not-prose mt-12 flex flex-col">
          {testimonials.map((t, i) => (
            <motion.li
              key={t.author}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1.05, delay: i * 0.05, ease: [0.19, 1, 0.22, 1] }}
              className="grid grid-cols-1 gap-6 border-t border-foreground/[0.08] py-10 md:grid-cols-[160px_1fr] md:gap-12 md:py-12"
            >
              <div className="flex h-10 items-center md:h-12">
                <img
                  src={t.logo}
                  alt={`${t.role} logo`}
                  loading="lazy"
                  className="max-h-9 w-auto max-w-[150px] object-contain opacity-65 mix-blend-screen"
                />
              </div>
              <div>
                <blockquote className="font-display italic text-xl md:text-2xl leading-[1.4] tracking-[-0.005em] text-foreground/90">
                  “{t.quote}”
                </blockquote>
                <div className="mt-6 flex items-baseline gap-3">
                  <span className="h-px w-6 bg-accent/50" />
                  <p className="font-display text-[14px] text-foreground/90">{t.author}</p>
                  <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-muted-foreground/55">
                    {t.role}
                  </p>
                </div>
              </div>
            </motion.li>
          ))}
          <li className="border-t border-foreground/[0.08]" />
        </ul>
      </EditorialSection>

      <EditorialSection number="10 · Posture" heading="Curated, not complete.">
        <p>
          The archive is selective. Press is useful when it accelerates the
          work and quiet when it does not. New coverage is added here as it
          stabilises.
        </p>
      </EditorialSection>
    </CinematicPageShell>
  );
}

