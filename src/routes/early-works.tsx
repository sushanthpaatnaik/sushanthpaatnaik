import { createFileRoute, Navigate } from "@tanstack/react-router";

/**
 * Early Works has been merged into Engage.
 * Permanent redirect preserves existing links, shares and bookmarks.
 */
export const Route = createFileRoute("/early-works")({
  component: EarlyWorksRedirect,
  head: () => ({
    meta: [
      { title: "Engage — Sushanth Paatnaik" },
      {
        name: "description",
        content:
          "Early Works has been merged into Engage — a single destination for collaboration, advisory, research, speaking, and partnerships.",
      },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "/engage" }],
  }),
});

function EarlyWorksRedirect() {
  return <Navigate to="/engage" replace />;
}
