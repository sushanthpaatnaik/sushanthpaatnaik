import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";

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
      { rel: "icon", type: "image/png", href: "/favicon.png" },
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "apple-touch-icon", href: "/favicon.png" },
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
            "https://en.wikipedia.org/wiki/Sushanth_Paatnaik",
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
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}
