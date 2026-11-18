/**
 * Visual asset manifest. Each entry is a slot in the site. Drop a file named
 * `<id>.webp` (or .jpg/.png/.avif) into /public/images and it is used
 * automatically at build time; until then an editorial beauty art plate renders.
 *
 * Sources
 *  • "illustrative" — licensed stock photography (Unsplash / Pexels licences, see
 *    docs/IMAGE_CREDITS.md), 3D renders, or AI imagery (docs/AI_IMAGE_PROMPTS.md).
 *    Shown with a small "Illustrative image" label and never presented as the
 *    clinic's own clients, staff, results or premises.
 *  • "clinic-photo" — must be a genuine photograph of the clinic, its staff or
 *    its products (AI imagery would misrepresent the business here).
 */
export type AssetSource = "clinic-photo" | "illustrative" | "educational-render";

export interface AssetSlot {
  id: string;
  location: string;
  subject: string;
  alt: string;
  source: AssetSource;
  crops: { desktop: string; mobile: string };
  motif: "laser" | "skin" | "face" | "hair" | "room" | "consult" | "product" | "map" | "drop";
}

const AI_45 = { desktop: "4:5, 1600×2000", mobile: "4:5, 1600×2000" };

export const assets: AssetSlot[] = [
  /* ── AI-generated (illustrative) ── */
  { id: "home-hero", location: "Home · hero (arch frame)", subject: "Editorial beauty portrait — serene South Asian woman, eyes closed, dewy skin, blush backdrop (prompt H1).", alt: "Illustrative beauty portrait of a woman with glowing skin in soft light", source: "illustrative", crops: AI_45, motif: "face" },
  { id: "home-accent", location: "Home · hero floating card", subject: "Hydrating facial treatment: relaxed client in a headband, skin device applied to the forehead (Pexels stock photo).", alt: "Illustrative image of a hydrating facial treatment with a skin device, client relaxed with eyes closed", source: "illustrative", crops: AI_45, motif: "skin" },
  { id: "home-editorial", location: "Home · philosophy (arch frame)", subject: "Hands applying serum to the cheek, soft window light (prompt H2).", alt: "Illustrative image of hands gently applying serum to the cheek", source: "illustrative", crops: AI_45, motif: "face" },
  { id: "home-consultation", location: "Home · your journey", subject: "Consultation in a bright clinic: client and practitioner talking it through (Pexels stock photo).", alt: "Illustrative image of a relaxed consultation between a client and a practitioner", source: "illustrative", crops: AI_45, motif: "consult" },
  { id: "cat-skin", location: "Treatments · Facials & glow", subject: "Facial treatment: relaxed client in a towel turban, practitioner using an ultrasonic skin spatula (Pexels stock photo).", alt: "Illustrative image of a relaxing facial with an ultrasonic skin device", source: "illustrative", crops: AI_45, motif: "skin" },
  { id: "cat-injectables", location: "Treatments · Lips, lines & contours", subject: "Lip-enhancement treatment: client with eyes closed, gloved practitioner at the lip line (Pexels stock photo).", alt: "Illustrative image of a lip-enhancement treatment, client relaxed with eyes closed", source: "illustrative", crops: AI_45, motif: "face" },
  { id: "cat-laser", location: "Treatments · Laser & light", subject: "Laser hair-reduction session on the upper arm, client in protective eyewear (Pexels stock photo).", alt: "Illustrative image of a laser hair-reduction session on a client's arm, with protective eyewear", source: "illustrative", crops: AI_45, motif: "laser" },
  { id: "cat-pigmentation", location: "Treatments · Tone & radiance", subject: "Sunlit close-up of skin with natural freckles and uneven tone (Pexels stock photo).", alt: "Illustrative close-up of sunlit skin with natural freckles", source: "illustrative", crops: AI_45, motif: "drop" },
  { id: "cat-hair", location: "Treatments · Hair & scalp", subject: "Scalp and hair-density check with a lighted magnifier (Pexels stock photo).", alt: "Illustrative image of a scalp examination with a lighted magnifier", source: "illustrative", crops: AI_45, motif: "hair" },
  { id: "cat-dermatology", location: "Treatments · Skin health", subject: "Skin check: clinician viewing a magnified skin image on a tablet (Pexels stock photo).", alt: "Illustrative image of a clinician reviewing a magnified skin image on a tablet", source: "illustrative", crops: AI_45, motif: "skin" },
  { id: "cat-procedures", location: "Treatments · Finishing touches", subject: "Eyebrow permanent-makeup (microblading) mapping, close-up (Pexels stock photo).", alt: "Illustrative close-up of eyebrow permanent-makeup mapping", source: "illustrative", crops: AI_45, motif: "product" },
  { id: "patient-info", location: "Patient information", subject: "Consultation notes and face-mapping charts on a desk (Pexels stock photo).", alt: "Illustrative image of consultation notes and face-mapping charts", source: "illustrative", crops: AI_45, motif: "consult" },

  /* ── Genuine clinic photography only ── */
  { id: "home-clinic-interior", location: "Home · the space", subject: "Reception with walnut panelling, LUXE signage and lounge chair (supplied by the clinic, 2026-11-03).", alt: "The reception and waiting area at The LUXE Clinique", source: "clinic-photo", crops: { desktop: "4:5, 1200×1500", mobile: "4:3, 900×675" }, motif: "room" },
  { id: "clinic-consult-room", location: "Gallery · consultation room", subject: "Consultation room with marble desk and LUXE signage (supplied by the clinic, 2026-11-03).", alt: "The consultation room at The LUXE Clinique", source: "clinic-photo", crops: { desktop: "3:2, 1500×1000", mobile: "4:3, 900×675" }, motif: "consult" },
  { id: "gallery-art", location: "Gallery · page header (arch)", subject: "Original 3D brand composition: the LUXE emblem tile, wordmark plaque and Skin · Hair · Laser · Wellness tags on a pearl plinth (three.js render using the clinic logo).", alt: "3D brand artwork: The LUXE Clinique emblem and wordmark with Skin, Hair, Laser and Wellness", source: "clinic-photo", crops: AI_45, motif: "face" },
  { id: "about-hero", location: "About · page header (arch)", subject: "The welcoming reception with LUXE signage, portrait crop (supplied by the clinic, 2026-11-03).", alt: "The calm, welcoming reception at The LUXE Clinique in Preet Vihar", source: "clinic-photo", crops: AI_45, motif: "face" },
  { id: "about-team", location: "About · the people", subject: "Portrait of the founder, Dr. Ritika Dhingra (supplied by the clinic, 2026-11-02).", alt: "Dr. Ritika Dhingra, founder of The LUXE Clinique", source: "clinic-photo", crops: { desktop: "4:5, 1200×1500", mobile: "1:1, 900×900" }, motif: "face" },
  { id: "about-room", location: "About · the space", subject: "Treatment room with the clinic's branding, hydra-facial and laser devices (supplied by the clinic, 2026-11-03).", alt: "A treatment room at The LUXE Clinique with treatment bed, hydra-facial unit and laser device", source: "clinic-photo", crops: { desktop: "16:9, 1920×1080", mobile: "4:3, 900×675" }, motif: "room" },
  { id: "products", location: "About · products", subject: "REAL PHOTO ONLY: the clinic's stocked skincare (ZO Skin Health, Obagi, Heliocare).", alt: "Skincare and sun-protection products available at the clinic", source: "clinic-photo", crops: { desktop: "3:2, 1500×1000", mobile: "1:1, 900×900" }, motif: "product" },
  { id: "contact-exterior", location: "Contact · find us", subject: "Reception with walnut panelling and LUXE signage (supplied by the clinic, 2026-11-03). Replace with an entrance photo when available.", alt: "Reception at The LUXE Clinique, 103 New Rajdhani Enclave, Preet Vihar", source: "clinic-photo", crops: { desktop: "3:2, 1500×1000", mobile: "4:3, 900×675" }, motif: "map" },
];

export const assetById = (id: string) => assets.find((a) => a.id === id);
export const isIllustrative = (id: string) => assetById(id)?.source === "illustrative";

export const categoryImage: Record<string, string> = {
  laser: "cat-laser",
  injectables: "cat-injectables",
  skin: "cat-skin",
  pigmentation: "cat-pigmentation",
  hair: "cat-hair",
  dermatology: "cat-dermatology",
  procedures: "cat-procedures",
};
