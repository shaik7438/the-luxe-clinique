import type { NextConfig } from "next";

/**
 * Content-Security-Policy (production only — dev needs eval for fast refresh).
 * 'unsafe-inline' is required for Next.js inline bootstrap scripts and style props without nonces.
 */
const csp = [
  "default-src 'self'",
  // Google Analytics 4 (gtag.js) — needs these hosts for the script, beacons and pixels.
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://*.google-analytics.com https://*.googletagmanager.com",
  "font-src 'self' data:",
  "media-src 'self'",
  "connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com",
  "worker-src 'self' blob:",
  "frame-src https://www.google.com https://maps.google.com",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    // Slot photos carry a ?v=<content hash> (src/lib/images.ts) so replaced photos are never served from cache.
    localPatterns: [{ pathname: "/images/**" }, { pathname: "/brand/**" }],
  },
  async headers() {
    if (process.env.NODE_ENV !== "production") return [];
    return [{ source: "/(.*)", headers: [{ key: "Content-Security-Policy", value: csp }] }];
  },
  async redirects() {
    // Preserve the most important legacy WordPress URLs from the current site.
    return [
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/about-us/index.html", destination: "/about", permanent: true },
      { source: "/our-gallery/index.html", destination: "/gallery", permanent: true },
      { source: "/blog/index.html", destination: "/learn", permanent: true },
      { source: "/contact-us/index.html", destination: "/contact", permanent: true },
      { source: "/book-a-visit/index.html", destination: "/contact#enquiry", permanent: true },
      { source: "/privacy-policy/index.html", destination: "/legal/privacy", permanent: true },
      { source: "/treatments/advanced-skincare/index.html", destination: "/treatments/advanced-skincare", permanent: true },
      { source: "/treatments/botox-anti-wrinkle-treatment/index.html", destination: "/treatments/anti-wrinkle-injections", permanent: true },
      { source: "/treatments/dermal-fillers/index.html", destination: "/treatments/dermal-fillers", permanent: true },
      { source: "/treatments/lip-enhancement/index.html", destination: "/treatments/lip-fillers", permanent: true },
      { source: "/treatments/jawline-slimming/index.html", destination: "/treatments/jawline-slimming", permanent: true },
      { source: "/treatments/facial-contouring-profile/index.html", destination: "/treatments/jawline-contouring", permanent: true },
      { source: "/treatments/excessive-sweating-hyperhidrosis/index.html", destination: "/treatments/hyperhidrosis", permanent: true },
      { source: "/treatments/skin-revitalisation-skin-boosters/index.html", destination: "/treatments/skin-boosters", permanent: true },
      { source: "/conditions/acne-and-acne-scarring/index.html", destination: "/treatments/acne-and-acne-scars", permanent: true },
      { source: "/conditions/pigmentation/index.html", destination: "/learn/understanding-pigmentation", permanent: true },
      { source: "/2025/01/23/what-are-dermal-fillers-1/index.html", destination: "/learn/what-are-dermal-fillers", permanent: true },
      { source: "/2025/02/25/are-facial-aesthetic-treatments-suitable-for-people-with-sensitive-skin-1/index.html", destination: "/learn/sensitive-skin-and-aesthetic-treatments", permanent: true },
      { source: "/2024/12/19/how-to-improve-the-shape-of-your-chin-2/index.html", destination: "/learn/understanding-chin-and-profile", permanent: true },
    ];
  },
};

export default nextConfig;
