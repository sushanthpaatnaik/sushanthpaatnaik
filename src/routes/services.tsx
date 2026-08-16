import { createFileRoute, Navigate } from "@tanstack/react-router";

/**
 * The standalone Services page has been merged into Engage.
 * This route now permanently redirects to /engage so existing links,
 * shares, and bookmarks continue to resolve.
 */
export const Route = createFileRoute("/services")({
  component: ServicesRedirect,
  head: () => ({
    meta: [
      { title: "Engage — Sushanth Paatnaik" },
      {
        name: "description",
        content:
          "The Services desk has been merged into Engage — a single destination for collaboration, advisory, research, speaking, and partnerships.",
      },
      { name: "robots", content: "noindex" },
    ],
    // Absolute, like every other route. A relative canonical is spec-valid and
    // Google resolves it, but this is the one page whose whole job is telling
    // crawlers "the real URL is elsewhere" — the least useful place to rely on
    // a resolver behaving well.
    links: [{ rel: "canonical", href: "https://sushanthpaatnaik.com/engage" }],
  }),
});

function ServicesRedirect() {
  return <Navigate to="/engage" replace />;
}
