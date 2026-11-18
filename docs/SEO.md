# SEO: how it is built

Live site: **https://www.luxeclinique.com** · Sitemap: https://www.luxeclinique.com/sitemap.xml

Everything below is plain Next.js App Router code. There is no SEO plugin; each file is listed with what it does.

## 1. Site-wide settings

| File | What it does |
|---|---|
| `src/content/site.ts` | The single source for the clinic's name, address, phone, email, map link, map coordinates and opening hours. These match the Google Business Profile exactly (name, address, phone consistency). The site address comes from `NEXT_PUBLIC_SITE_URL`. |
| `src/app/layout.tsx` | Default title and title template (`%s \| The LUXE Clinique`), description, `metadataBase`, Open Graph and Twitter defaults, `robots` / `googleBot` rules (large image previews), optional Google Search Console verification, and the clinic structured data on every page. |
| `src/lib/seo.ts` | Helpers used by every page: `pageMeta()` (title, description, canonical, Open Graph, Twitter), `clinicJsonLd()`, `breadcrumbJsonLd()`, `treatmentJsonLd()` and `JsonLd()` (safe JSON-LD output). |
| `src/app/sitemap.ts` | `/sitemap.xml`: 10 main pages, 34 treatments, the journal articles and the educational models (56 URLs). |
| `src/app/robots.ts` | `/robots.txt`: allows everything except `/api/`, and points to the sitemap. |
| `src/app/manifest.ts` | `/manifest.webmanifest`: app name, colours and icons. |
| `src/app/icon.png`, `src/app/apple-icon.png` | Browser and home-screen icons. |

## 2. Structured data (JSON-LD)

| Where | Schema types |
|---|---|
| Every page (`layout.tsx`) | `MedicalClinic` + `MedicalBusiness` + `HealthAndBeautyBusiness` (address, geo, map, opening hours, areas served, all 34 services, founder), and `WebSite` |
| Treatment pages (`src/app/treatments/[slug]/page.tsx`) | `MedicalWebPage` about a `MedicalProcedure` (how it's done, preparation, aftercare, risks), `BreadcrumbList` and `FAQPage` |
| Journal articles (`src/app/learn/[slug]/page.tsx`) | `MedicalWebPage` / `Article` and `BreadcrumbList` |

Check any page with Google's Rich Results Test: https://search.google.com/test/rich-results

## 3. Page titles and descriptions

Each page sets its own title and description with `pageMeta()`:

| Page | File | Title |
|---|---|---|
| Home | `src/app/page.tsx` | The LUXE Clinique \| Skin, Hair & Laser Clinic in Preet Vihar, Delhi |
| Treatments | `src/app/treatments/page.tsx` | Treatments |
| Each treatment | `src/app/treatments/[slug]/page.tsx` | `<Treatment> in Preet Vihar, Delhi` (description includes the location; trimmed to 160 characters) |
| Journal | `src/app/learn/page.tsx` | The Journal — Beauty & Treatment Guides |
| Journal article | `src/app/learn/[slug]/page.tsx` | the article title (type `article`) |
| 3D model pages | `src/app/learn/models/[id]/page.tsx` | the model name |
| About | `src/app/about/page.tsx` | About the Clinic |
| Gallery | `src/app/gallery/page.tsx` | Gallery — Clinic & Mood |
| Contact | `src/app/contact/page.tsx` | Contact & Appointments |
| Patient information | `src/app/patient-information/page.tsx` | Patient Information & Consultation Guide |
| Legal pages | `src/app/legal/*/page.tsx` | Privacy, Terms, Medical disclaimer |

Every page outputs exactly one `<h1>`, a canonical link, `og:image` and a description.

## 4. Social preview images

- `public/og/default.jpg` and `public/og/treatments/<slug>.jpg` (1200×630).
- Rebuild them after changing a treatment photo or name: `node scripts/generate-og-images.js`

## 5. Domain, redirects and headers

| File | What it does |
|---|---|
| `vercel.json` | Redirects `luxeclinique.com` and the old `luxecliniqueaesthetics.com` to `https://www.luxeclinique.com` (permanent 308), so search engines see one address. Also sets security headers (HSTS, nosniff, frame options, referrer policy) and long caching for images, videos and brand files. |
| `next.config.ts` | Content Security Policy in production. |

## 6. Environment variables (Vercel → Settings → Environment Variables)

| Name | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://www.luxeclinique.com`, used for canonicals, the sitemap, Open Graph URLs and structured data |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Optional: Search Console HTML-tag code (the `content=` value). Redeploy after setting it. |

## 7. Off-site (Google Business Profile, Search Console)

See `docs/GOOGLE_BUSINESS_PROFILE.md` for the listing name, categories, description, services, posts, Q&A and reviews. After going live:

1. Add `https://www.luxeclinique.com` to Google Search Console and verify it.
2. Submit `sitemap.xml`.
3. Set the Google Business Profile website link to `https://www.luxeclinique.com`.
4. Keep the name, address and phone identical on every directory (Justdial, Practo, Facebook, Instagram).

## 8. Quick check

`node scripts/seo-check.js https://www.luxeclinique.com` prints the title, description, canonical, `og:image`, H1 count and schema types of the key pages, and flags anything missing.


## 6. Switches added by the November 2026 SEO audit
Changes from the November 2026 SEO audit. Most of these features stay hidden until the clinic supplies verified details, so nothing unconfirmed is ever published.

### Turn on analytics
1. Create a GA4 property and copy the measurement ID (`G-…`).
2. In Vercel, set `NEXT_PUBLIC_GA_MEASUREMENT_ID`, then redeploy.
3. In GA4 → Admin → Events, mark `generate_lead`, `phone_call` and `whatsapp_click` as key events.
   Also tracked: `email_click`, `book_consultation_click` (with `treatment`) and `get_directions`.

### Switches in `src/content/site.ts`
| Field | What it unlocks |
|---|---|
| `founder.qualifications` + `founder.registration` | The `/about/dr-ritika-dhingra` profile page (Physician schema), a link from About, and "Medically reviewed by" lines on approved treatment pages. Both must be filled. |
| `founder.experience`, `memberships`, `sameAs` | Extra profile details and schema links. |
| `closedDays` | Adds "Monday: closed" (etc.) to the hours in the footer and on Contact. |
| `social.*` | Footer links and schema `sameAs` (Instagram, Facebook, YouTube, Practo, Justdial). |
| `nearbyAreas` | The "Patients visit us from" list on Contact (with Preet Vihar) and schema `areaServed`. |

### Switches per treatment in `src/content/treatments.ts`
| Field | Effect |
|---|---|
| `review: "approved"` + `reviewedOn: "YYYY-MM-DD"` | Shows the reviewer line and adds `reviewedBy` / `lastReviewed` to the page schema (needs the founder fields above). |
| `seoName` | The search term used in the `<title>` and meta description (e.g. "Laser Hair Removal"). |
| `aka` | "Also known as …" under the heading, plus schema `alternateName`. |
| `price: { from, per?, note? }` | "From ₹…" in the hero facts and a "… cost in Delhi" section. Check NMC advertising rules before publishing prices. |

### Articles (`src/content/articles.ts`)
Set `reviewer: { name, credentials }` once a clinician signs off an article; the byline and `reviewedBy` schema update automatically.

### Duplicate topics
The laser and pigmentation 3D guides cover the same topics as two articles, so they point their canonical URL at the article and are left out of the sitemap (`articleForModule`).
