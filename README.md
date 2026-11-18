# The LUXE Clinique — website

The website for luxeclinique.com: a Next.js site with
interactive 3D medical education, a glass UI system and motion design, built
from the supplied content sheet and NMC compliance screening.

**Stack:** Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 · Framer Motion · React Three Fiber / Three.js / Drei · Lucide.

## Run it

Requires Node.js 20+ (installed: v24 LTS).

```bash
npm install
npm run dev          # http://localhost:3000
```

Production preview:

```bash
npm run build
npm start            # http://localhost:3000
```

Copy `.env.example` to `.env.local` to configure:

- `NEXT_PUBLIC_SITE_URL` — canonical URL for metadata, sitemap and JSON-LD.
- `ENQUIRY_WEBHOOK_URL` — where appointment enquiries are POSTed (CRM, Zapier/Make, email relay). In development without it, enquiries are written to `.data/enquiries.ndjson`. In production without it, the form tells visitors honestly that online enquiries aren't connected and offers phone, WhatsApp and email instead.
- `NEXT_PUBLIC_HERO_GLB` — optional production GLB that replaces the procedural hero scene.

## Deploy

Any Node host works; Vercel is the simplest: import the repo, set the env vars above, deploy. All 56 content pages are statically generated; only `/api/enquiry` runs on the server. Legacy WordPress URLs (e.g. `/about-us/index.html`, `/treatments/botox-anti-wrinkle-treatment/index.html`) redirect permanently to their new pages (`next.config.ts`).

## What's here

| Area | Where |
|---|---|
| Brand tokens, glass system, buttons | `src/app/globals.css` |
| Verified clinic facts | `src/content/site.ts` |
| 33 treatment guides + 6 held for review | `src/content/treatments.ts` |
| 3D module definitions (steps, structures, text alternatives) | `src/content/education.ts` |
| Articles | `src/content/articles.ts` |
| Image slots | `src/content/assets.ts` → `docs/ASSET_MANIFEST.md` |
| Hero scene | `src/components/three/HeroScene.tsx`, wrapper `LaserTreatmentHero3D.tsx` |
| Skin cross-section scene | `src/components/three/SkinScene.tsx` |
| Module UI | `src/components/education/Educational3DModule.tsx` (+ `InteractiveSkinModel`, `LaserEducationScene`) |
| Navigation / footer | `src/components/layout/` |
| Directory and detail template | `src/components/treatments/` |
| Enquiry form and API | `src/components/forms/AppointmentForm.tsx`, `src/app/api/enquiry/route.ts` |

### Pages
`/` · `/treatments` (search, category and concern filters, shareable URLs) · `/treatments/[slug]` ×33 · `/learn` · `/learn/[slug]` ×6 · `/learn/models/[id]` ×6 · `/patient-information` · `/about` · `/gallery` · `/contact` · `/legal/privacy` · `/legal/terms` · `/legal/medical-disclaimer` · `sitemap.xml` · `robots.txt`

## Art direction

The site is styled as a **beauty and aesthetics brand**, not a medical clinic:

- **Colour and type:** blush and champagne washes, Playfair Display headlines with italic burgundy accents (`*word*` in `SectionHeading` titles), and arch-shaped frames.
- **Recurring motifs:** a burgundy treatment-name marquee, and line art of the logo's face profile (`src/components/art/`).

**Homepage hero:** a 3D rose-quartz glass sculpture of that profile on a marble plinth. Around it are floating pearls, serum droplets, a serum bottle, drifting petals and a satin ribbon (`src/components/three/BeautyHeroScene.tsx`). The laser treatment-room scene now appears on the laser hair reduction page.

**Copy:** written in a beauty voice while keeping compliance. There are no outcome promises, and risks and consultation stay prominent.

## Images

Image slots are listed in `docs/ASSET_MANIFEST.md`. AI imagery is generated from `docs/AI_IMAGE_PROMPTS.md`: save each file into `public/images/` with the given name and it appears automatically, labelled "Illustrative image". Until then, beauty line-art plates are shown (and the homepage falls back to the 3D sculpture).

## Motion system

- **Smooth scrolling:** Lenis (`components/motion/SmoothScroll.tsx`). It's off on touch devices and for reduced motion.
- **Intro:** a burgundy curtain with the logo on the first visit of each session (`IntroCurtain`). Every route change gets a page-rise transition and a progress line (`app/template.tsx`).
- **Hero:** an editorial collage. The headline rises letter by letter, the layers shift with mouse depth, the badge rotates, pearls float, and a giant outlined wordmark drifts as you scroll.
- **Treatment ribbon:** speeds up and reverses with scroll velocity.
- **Signature treatments:** the section pins and the cards travel sideways on desktop, with a progress bar; on mobile it becomes a swipeable row.
- **Images:** a clip-path wipe as they appear, then gentle parallax inside the frame (`ParallaxImage`).
- **Your journey:** a sticky image crossfades and slowly zooms as each step scrolls into focus (`ExperienceStory`).
- **Details:** magnetic CTAs, a follower cursor ring that shows labels such as "Discover" and "Explore", and a cinematic statement band.
- **Reduced motion:** every effect respects `prefers-reduced-motion`.

## Images

Photography comes from Unsplash under the free Unsplash licence (see `docs/IMAGE_CREDITS.md`). The Laser & Light image is a custom 3D render. Every stock image shows an "Illustrative image" label. Drop your own files into `public/images/` with the slot names in `docs/ASSET_MANIFEST.md` to replace them.

## 3D: what it is and isn't

- The **hero** is a procedurally modelled treatment room. It includes:
  - anatomical lathe-profiled limbs, sculpted heads and gloved hands;
  - a sheet draped over a body heightfield, with folds and overhang;
  - procedural plaster, microcement, cotton weave, leather grain and skin-pore textures (`src/components/three/textures.ts`);
  - window daylight with sheer curtains, soft shadows, ambient occlusion (N8AO), bloom and vignette on desktop.

  **Motion:** the handpiece glides along the shin in a pulse-and-lift rhythm, and the clinician's arm follows via two-bone IK. Torso and head track the treatment area, the console counts pulses, both figures breathe, and the camera drifts slowly. It is still a stylised render, not photoreal people, and is labelled as such. Drop in a commissioned GLB via `NEXT_PUBLIC_HERO_GLB` for photorealism.
- The skin model uses layered tissue textures (epidermal strata, fibrous dermis, fat septa), red cells flowing in the arteriole with a pulsatile rhythm, and camera framing that eases toward the selected structure. Labels are DOM elements projected from 3D anchors, which avoids drei `<Html>` unmount errors during client-side navigation.
- On phones and small tablets, post-processing and shadows are switched off automatically.
- The **educational modules** share one parametric skin scene driven by step state (layer separation, hair tone, growth phases, melanin depth, comedone, inflammation, scar depth, collagen density). Each has selectable structures, step sequence, rotate/reset controls, keyboard support (← → R), a static SVG fallback, and a text alternative.
- 3D is code-split and lazy-loaded, paused when off-screen, simplified on touch and small screens, wrapped in an error boundary, and respects `prefers-reduced-motion`. Without WebGL, the static illustrations render instead and every CTA still works.

## Tested

Production build: 64 routes, no type errors. A crawl of all 56 sitemap pages found 0 broken internal links, unique titles, exactly one `h1` per page, meta descriptions on all, and alt attributes on all images. At 375px every page has no horizontal overflow. The mobile menu, directory filters, form validation, honest 503 path, honeypot, legacy redirects and 404 all work. No runtime console errors. Not tested: real iOS/Android devices, Safari, and screen-reader passes. Run those before launch.

## Before launch

See **`docs/APPROVALS.md`**: clinical review of all medical content, verification of phone numbers and hours, legal review of drafts, enquiry destination, and photography.
