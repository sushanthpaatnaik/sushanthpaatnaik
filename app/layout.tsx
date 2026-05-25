import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "Sushanth Paatnaik — Deep-Tech Founder & Industrial Futurist",
  description:
    "Sushanth Paatnaik — six-time Indian Presidential awardee, inventor and founder building graphene, nano-materials, and industrial deep-tech ventures from India for the world.",
  authors: [{ name: "Sushanth Paatnaik" }],
  openGraph: {
    siteName: "Sushanth Paatnaik",
    type: "website",
    title: "Sushanth Paatnaik — Deep-Tech Founder & Industrial Futurist",
    description:
      "Inventor, founder, and six-time Indian Presidential awardee engineering graphene, nano-materials, and industrial systems from India for the world.",
    images: [
      "https://storage.googleapis.com/gpt-engineer-file-uploads/ltIXu6wU6aadaSBkdDy2XzqPo5C3/social-images/social-1779549424976-12345.webp",
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sushanth Paatnaik — Deep-Tech Founder & Industrial Futurist",
    description:
      "Graphene, nano-materials, AI, and industrial commercialization — built in India, designed for the world.",
    images: [
      "https://storage.googleapis.com/gpt-engineer-file-uploads/ltIXu6wU6aadaSBkdDy2XzqPo5C3/social-images/social-1779549424976-12345.webp",
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#070708",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} bg-background`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Sushanth Paatnaik",
              jobTitle: "Inventor · Deep-Tech Founder",
              description:
                "Six-time Indian Presidential awardee. Founder of Monoatom Labs, Grafillium, SPI Industries, InThinks and Starunico Capital. CIO at Magppie.",
              birthPlace: "Bhubaneswar, Odisha, India",
              alumniOf: [
                { "@type": "CollegeOrUniversity", name: "IISER Bhopal" },
                { "@type": "CollegeOrUniversity", name: "OCT, Bhopal" },
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
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
