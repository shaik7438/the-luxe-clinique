import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import GlassNavigation from "@/components/layout/GlassNavigation";
import SiteFooter from "@/components/layout/SiteFooter";
import Providers from "@/components/layout/Providers";
import SmoothScroll from "@/components/motion/SmoothScroll";
import IntroCurtain from "@/components/motion/IntroCurtain";
import Cursor from "@/components/motion/Cursor";
import Analytics from "@/components/layout/Analytics";
import { site } from "@/content/site";
import { clinicJsonLd, JsonLd } from "@/lib/seo";
import "./globals.css";

const playfair = Playfair_Display({ subsets: ["latin"], style: ["normal", "italic"], weight: ["400", "500", "600"], variable: "--font-playfair", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} | Beauty & Aesthetic Treatments in Preet Vihar, New Delhi`, template: `%s | ${site.name}` },
  description: site.description,
  applicationName: site.name,
  openGraph: { siteName: site.name, locale: "en_IN", type: "website", images: [{ url: "/og/default.jpg", width: 1200, height: 630, alt: site.name }] },
  twitter: { card: "summary_large_image", images: ["/og/default.jpg"] },
  formatDetection: { telephone: false },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
  // Google Search Console HTML-tag verification (set NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION in Vercel).
  ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ? { verification: { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION } } : {}),
  category: "health",
};

export const viewport: Viewport = {
  themeColor: "#FAF7F5",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${playfair.variable} ${inter.variable}`}>
      <body>
        <a href="#main" className="sr-only-focusable fixed left-3 top-3 z-[100] rounded-full bg-burgundy px-4 py-2 text-sm font-semibold text-white">
          Skip to content
        </a>
        <Providers>
          <SmoothScroll />
          <IntroCurtain />
          <Cursor />
          <GlassNavigation />
          <main id="main">{children}</main>
          <SiteFooter />
        </Providers>
        <Analytics />
        <script type="application/ld+json" dangerouslySetInnerHTML={JsonLd({ data: clinicJsonLd() })} />
      </body>
    </html>
  );
}
