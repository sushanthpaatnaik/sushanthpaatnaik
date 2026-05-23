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
    links: [{ rel: "canonical", href: "/engage" }],
  }),
});

function ServicesRedirect() {
  return <Navigate to="/engage" replace />;
}
