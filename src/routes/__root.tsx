import { useEffect, useRef } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { clearGlobalScrollLock } from "../lib/scroll-lock";
import { installEngageTracking } from "../lib/analytics";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { name: "mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
      { name: "apple-mobile-web-app-title", content: "Sushanth Paatnaik" },
      { name: "format-detection", content: "telephone=no" },
      { title: "Sushanth Paatnaik — Deep-Tech Founder & Industrial Futurist" },
      {
        name: "description",
        content:
          "Sushanth Paatnaik — six-time Indian Presidential awardee, inventor and founder building graphene, nano-materials, and industrial deep-tech ventures from India for the world.",
      },
      { name: "author", content: "Sushanth Paatnaik" },
      { name: "theme-color", content: "#070708" },
      { property: "og:site_name", content: "Sushanth Paatnaik" },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "Sushanth Paatnaik — Deep-Tech Founder & Industrial Futurist" },
      {
        property: "og:description",
        content:
          "Inventor, founder, and six-time Indian Presidential awardee engineering graphene, nano-materials, and industrial systems from India for the world.",
      },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Sushanth Paatnaik — Deep-Tech Founder & Industrial Futurist" },
      {
        name: "twitter:description",
        content:
          "Graphene, nano-materials, AI, and industrial commercialization — built in India, designed for the world.",
      },
      { property: "og:image", content: "https://sushanthpaatnaik.com/social-preview.webp" },
      { name: "twitter:image", content: "https://sushanthpaatnaik.com/social-preview.webp" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      // Two grounds on purpose. favicon.svg stays TRANSPARENT and is what
      // Chrome, Firefox and Safari 16+ pick, so a browser tab gets the bare
      // gold mark on whatever its theme is. The raster pair carries the site's
      // own graphite (#0A0A0A) because link-preview thumbnails are JPEG, which
      // has no alpha channel: a transparent icon gets flattened, conventionally
      // onto WHITE, and WhatsApp drew a white tile around the mark on a dark
      // green card. Verified as the cause with a control — spiindustries.co
      // 404s on every icon path and its card shows no icon at all, so WhatsApp
      // does fetch ours and render it.
      //
      // Do not "fix" the raster pair back to transparent without re-checking a
      // real preview card. Transparent is the correct-looking file and the
      // wrong-looking result.
      { rel: "icon", type: "image/png", sizes: "512x512", href: "/favicon.png" },
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "apple-touch-icon", sizes: "512x512", href: "/favicon.png" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          name: "Sushanth Paatnaik",
          url: "https://sushanthpaatnaik.com",
          jobTitle: "Inventor · Deep-Tech Founder",
          description:
            "Six-time Indian Presidential awardee. Founder of Monoatom Labs, Grafillium, SPI Industries, InThinks and Starunico Capital. CIO at Magppie.",
          image: "https://sushanthpaatnaik.com/social-preview.webp",
          birthPlace: "Bhubaneswar, Odisha, India",
          alumniOf: [
            { "@type": "CollegeOrUniversity", name: "IISER Bhopal" },
            { "@type": "CollegeOrUniversity", name: "OCT, Bhopal" },
          ],
          sameAs: [
            "https://www.linkedin.com/in/sushanthpaatnaik/",
            "https://x.com/sushantinthinks",
            "https://www.youtube.com/@Susantinventions",
            "https://www.instagram.com/sushanthpaatnaik/",
            "https://www.facebook.com/sushanthpaatnaik",
            "https://or.wikipedia.org/wiki/%E0%AC%B8%E0%AD%81%E0%AC%B6%E0%AC%BE%E0%AC%A8%E0%AD%8D%E0%AC%A4_%E0%AC%AA%E0%AC%9F%E0%AD%8D%E0%AC%9F%E0%AC%A8%E0%AC%BE%E0%AD%9F%E0%AC%95",
          ],
          knowsAbout: [
            "Graphene",
            "Advanced Materials",
            "Nano-materials",
            "Deep-Tech",
            "Industrial Systems",
            "Climate Technology",
          ],
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
        {/* Plausible — pageviews plus the custom events wired in lib/analytics.
            Cookieless and no personal data, so no consent banner is required.
            ~1 KB, deferred, and on its own domain, so it cannot block render;
            if it fails to load the site is unaffected.

            The stub below is Plausible's documented pattern and is genuinely
            load-bearing: `script.js` is deferred, so it defines window.plausible
            only after the document parses. Any event fired before that — and
            engage_click can fire the moment a visitor clicks the nav — would
            hit an undefined function and be lost. The stub queues them on
            window.plausible.q and the real script drains it on arrival. */}
        <script defer data-domain="sushanthpaatnaik.com" src="https://plausible.io/js/script.js" />
        <script
          dangerouslySetInnerHTML={{
            __html:
              "window.plausible=window.plausible||function(){(window.plausible.q=window.plausible.q||[]).push(arguments)}",
          }}
        />
        {/* Without JavaScript the pages render but read as blank.
            framer-motion serialises every `initial` prop into an inline style,
            so the server HTML ships the copy already faded out — measured 21
            elements on /early-works, 92 on /innovations, 63 on /recognitions,
            26 on the homepage, all at `opacity:0`. The text is genuinely there
            in the document, which is what crawlers read, but nothing ever
            animates it back to 1 because the animation needs JS.

            This only applies when scripts do not run, so it cannot affect the
            cinematic behaviour at all. It has to be `!important` to beat an
            inline style, and the `:not` guard matters: the attribute selector
            matches substrings, so a bare `opacity:0` test would also catch
            `opacity:0.07` and `opacity:0.85` — real decorative values that
            should stay exactly as they are. Excluding `opacity:0.` leaves only
            the true zeros. The transform/filter resets clear the paired
            translateY and blur that come with the same `initial`. */}
        <noscript
          dangerouslySetInnerHTML={{
            __html: `<style>
              [style*="opacity:0"]:not([style*="opacity:0."]) {
                opacity: 1 !important;
                transform: none !important;
                filter: none !important;
              }
            </style>`,
          }}
        />
      </head>
      <body>
        {/* Skip link. The homepage puts a fixed nav and a full-screen
            cinematic stage ahead of the content in tab order; without this a
            keyboard visitor walks the entire header on every page. Visually
            hidden until focused, then it lands in the top-left corner. */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-sm focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:text-foreground focus:outline-none focus:ring-2 focus:ring-accent/70"
        >
          Skip to content
        </a>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  // On every client-side route change, drop any scroll lock an overlay on the
  // previous page may have left on <html>/<body>. The initial mount is skipped
  // so the homepage preloader's first-load lock is never cleared out from under
  // it — only genuine navigations trigger the sweep.
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    clearGlobalScrollLock();
  }, [pathname]);

  // One delegated listener for engage_click, mounted once for the whole app.
  // Seven links point at /engage across the nav and five routes, and the nav
  // builds its own from a list — wiring each would be seven edits an eighth
  // link could silently miss.
  useEffect(() => installEngageTracking(), []);

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}
