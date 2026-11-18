# Visual asset manifest — The LUXE Clinique

Source of truth: `src/content/assets.ts`. To fill a slot, save the file as
`public/images/<id>.webp` (or `.jpg`, `.png`, `.avif`) and rebuild — it replaces
the branded art plate automatically. Per-treatment photos can also be added as
`public/images/treatment-<slug>.webp` (e.g. `treatment-laser-hair-reduction.webp`),
which override the category image on cards and treatment pages.

**Art direction — beauty editorial, not clinical.** Soft window light, blush and champagne tones, natural (unretouched) skin texture, fresh flowers, glass and serum props, marble surfaces, generous negative space. Avoid clinical equipment as the hero of any image.

**Art direction — beauty editorial, not clinical.** Soft window light, blush and champagne tones, natural (unretouched) skin texture, fresh flowers, glass and serum props, marble surfaces, generous negative space. Avoid clinical equipment as the hero of any image.

**Art direction — beauty editorial, not clinical.** Soft window light, blush and champagne tones, natural (unretouched) skin texture, fresh flowers, glass and serum props, marble surfaces, generous negative space. Avoid clinical equipment as the hero of any image.

**Rules.** Genuine clinic photography for staff, rooms, equipment and products. Licensed stock or AI-generated imagery only for generic beauty scenes, never presented as the clinic's own staff, patients or results. No patient before/after images or testimonials pending legal review (see `APPROVALS.md`). Export WebP at ~80 quality, max 1920px on the long edge.

## Photography slots

| ID | Location | Subject / shot brief | Alt text | Source | Desktop crop | Mobile crop |
|---|---|---|---|---|---|---|
| home-hero | Home · hero (arch frame) | Editorial beauty portrait — serene South Asian woman, eyes closed, dewy skin, blush backdrop (prompt H1). | Illustrative beauty portrait of a woman with glowing skin in soft light | AI-generated (see AI_IMAGE_PROMPTS.md) | 4:5, 1600×2000 | 4:5, 1600×2000 |
| home-editorial | Home · philosophy (arch frame) | Hands applying serum to the cheek, soft window light (prompt H2). | Illustrative image of hands gently applying serum to the cheek | AI-generated (see AI_IMAGE_PROMPTS.md) | 4:5, 1600×2000 | 4:5, 1600×2000 |
| home-consultation | Home · your journey | Relaxed consultation in a beauty lounge, faces softly out of frame (prompt H3). | Illustrative image of a relaxed beauty consultation over tea | AI-generated (see AI_IMAGE_PROMPTS.md) | 3:2, 1800×1200 | 3:2, 1800×1200 |
| cat-skin | Treatments · Facials & glow | Luxury facial, hydrating mask, towels and petals (prompt C1). | Illustrative image of a relaxing hydrating facial | AI-generated (see AI_IMAGE_PROMPTS.md) | 4:5, 1600×2000 | 4:5, 1600×2000 |
| cat-injectables | Treatments · Lips, lines & contours | Elegant side profile, natural lips and jawline, warm light (prompt C2). | Illustrative side profile of a woman in warm natural light | AI-generated (see AI_IMAGE_PROMPTS.md) | 4:5, 1600×2000 | 4:5, 1600×2000 |
| cat-laser | Treatments · Laser & light | Smooth legs/skin in soft light with a sleek white device beside (prompt C3). | Illustrative image of smooth skin in soft light beside a sleek white device | AI-generated (see AI_IMAGE_PROMPTS.md) | 4:5, 1600×2000 | 4:5, 1600×2000 |
| cat-pigmentation | Treatments · Tone & radiance | Serum dropper above luminous cheek skin, macro (prompt C4). | Illustrative close-up of a serum dropper above glowing skin | AI-generated (see AI_IMAGE_PROMPTS.md) | 4:5, 1600×2000 | 4:5, 1600×2000 |
| cat-hair | Treatments · Hair & scalp | Glossy dark hair in motion, back view (prompt C5). | Illustrative image of glossy dark hair in soft light | AI-generated (see AI_IMAGE_PROMPTS.md) | 4:5, 1600×2000 | 4:5, 1600×2000 |
| cat-dermatology | Treatments · Skin health | Moisturiser on the back of a hand, botanicals (prompt C6). | Illustrative image of moisturiser being smoothed onto the skin | AI-generated (see AI_IMAGE_PROMPTS.md) | 4:5, 1600×2000 | 4:5, 1600×2000 |
| cat-procedures | Treatments · Finishing touches | Brow artistry tools on marble with flowers (prompt C7). | Illustrative still life of brow artistry tools on marble | AI-generated (see AI_IMAGE_PROMPTS.md) | 4:5, 1600×2000 | 4:5, 1600×2000 |
| patient-info | Patient information | Notebook, pen and tea beside flowers on marble (prompt C8). | Illustrative still life of a notebook and tea beside flowers | AI-generated (see AI_IMAGE_PROMPTS.md) | 3:2, 1800×1200 | 3:2, 1800×1200 |
| home-clinic-interior | Home · the space | REAL PHOTO ONLY: the clinic's lounge or suite, styled with flowers, no people. | The softly lit lounge at The LUXE Clinique | Real photo only | 4:5, 1200×1500 | 4:3, 900×675 |
| about-team | About · the people | REAL PHOTO ONLY: verified clinician(s), with consent. | Clinician at The LUXE Clinique (name and registration to be confirmed) | Real photo only | 4:5, 1200×1500 | 1:1, 900×900 |
| about-room | About · the space | REAL PHOTO ONLY: treatment suite with the clinic's own devices. | A softly lit treatment suite at The LUXE Clinique | Real photo only | 16:9, 1920×1080 | 4:3, 900×675 |
| products | About · products | REAL PHOTO ONLY: the clinic's stocked skincare (ZO Skin Health, Obagi, Heliocare). | Skincare and sun-protection products available at the clinic | Real photo only | 3:2, 1500×1000 | 1:1, 900×900 |
| contact-exterior | Contact · find us | REAL PHOTO ONLY: entrance at 103 Rajdhani Enclave with signage. | Entrance to The LUXE Clinique at Rajdhani Enclave, Preet Vihar | Real photo only | 3:2, 1500×1000 | 4:3, 900×675 |

## 3D and educational assets (built, in the codebase)

| Asset | File | Type | Used on | Notes |
|---|---|---|---|---|
| Beauty sculpture hero | `src/components/three/BeautyHeroScene.tsx` | Procedural R3F scene: rose-quartz glass profile (logo face), marble plinth, pearls, serum bottle, droplets, petals, satin ribbon | Home hero | Shares its outline with `FaceLineArt` (`src/components/art/`). |
| Laser treatment-room scene | `src/components/three/HeroScene.tsx` | Procedural R3F scene (no external files) | Laser hair reduction page | Stylised "porcelain" figures; patient eye shields, clinician safety glasses, handpiece in skin contact, no visible beam. Labelled "Stylised 3D illustration · not a real patient or clinician". |
| Hero static poster | `src/components/three/HeroPoster.tsx` | Inline SVG | Hero loading/no-WebGL fallback, Gallery | Instant paint; same composition. |
| Skin cross-section (6 modules) | `src/components/three/SkinScene.tsx` + `src/content/education.ts` | Procedural R3F, state-driven | Home, Learn, treatment pages, `/learn/models/*` | Modules: skin, laser, pigment, acne, collagen, hair. |
| Skin illustration | `src/components/education/SkinIllustration.tsx` | State-aware inline SVG | 3D fallback, article cards, Gallery, treatment hero | Mirrors every module step. |
| Optional production hero GLB | `NEXT_PUBLIC_HERO_GLB` | GLB (not supplied) | Home hero | Commission a realistic scene from a 3D artist; Draco/Meshopt-compressed, KTX2 textures, < 3 MB. Loaded via `useGLTF` when set. |
| Logo | `public/brand/luxe-clinique-logo.png`, `luxe-mark.png` | PNG cropped from the supplied JPEG | Nav, footer, favicon | Ask for a vector (SVG) master for sharper rendering. |
