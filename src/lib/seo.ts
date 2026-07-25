/**
 * Shared structured-data helpers. Every route's JSON-LD is built from data
 * the route already declares (title, description, URL) — nothing here
 * invents facts. Multiple JSON-LD <script> blocks per page are valid;
 * these are additive to the site-wide Person schema in __root.tsx, not a
 * replacement for it.
 */

export const SITE_URL = "https://sushanthpaatnaik.com";
export const SITE_NAME = "Sushanth Paatnaik";

export function ldJsonScript(data: Record<string, unknown>) {
  return { type: "application/ld+json" as const, children: JSON.stringify(data) };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

export function webPageSchema({
  type = "WebPage",
  name,
  description,
  path,
}: {
  type?: "WebPage" | "CollectionPage" | "ContactPage" | "WebSite";
  name: string;
  description: string;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": type,
    name,
    description,
    url: `${SITE_URL}${path}`,
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
  };
}
