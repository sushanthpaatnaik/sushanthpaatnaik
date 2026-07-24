import { createFileRoute } from "@tanstack/react-router";

/**
 * TEMPORARY diagnostic route — bare page, zero providers/overlays/animation,
 * to isolate whether a production scroll-freeze report is caused by
 * page-level code (Loader/Lenis/overlays) or something above it in the
 * render tree (root shell, CDN/edge script injection, browser-specific).
 * Remove once the live scroll issue is confirmed resolved.
 */
export const Route = createFileRoute("/scroll-test")({
  component: ScrollTestPage,
});

function ScrollTestPage() {
  return (
    <main style={{ minHeight: "400vh", padding: "40px", background: "#111", color: "#fff" }}>
      <h1>Scroll Test</h1>
      <p>Top</p>
      <div style={{ marginTop: "300vh" }}>
        <p>Bottom</p>
      </div>
    </main>
  );
}
