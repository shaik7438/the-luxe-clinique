import { assetById, categoryImage } from "@/content/assets";
import { categories, type Treatment } from "@/content/treatments";
import type { TreatmentCardData } from "@/components/ui/GlassTreatmentCard";
import { resolveImage } from "./images";

/**
 * Image lookup order: /public/images/treatment-<slug>.* → category slot → art plate.
 * Per-treatment images are AI-generated illustrative images (docs/AI_IMAGE_PROMPTS.md).
 */
export function treatmentImage(t: Treatment) {
  const own = resolveImage(`treatment-${t.slug}`);
  const slot = assetById(categoryImage[t.category])!;
  const src = own ?? resolveImage(slot.id);
  return {
    src,
    alt: own ? `Illustrative image for ${t.name}` : slot.alt,
    motif: slot.motif,
    illustrative: !!src && (own ? true : slot.source === "illustrative"),
  };
}

/** Image for a treatment's own page: its topic photo when there is one, otherwise `treatmentImage`. */
export function treatmentTopicImage(t: Treatment) {
  const src = resolveImage(`treatments/${t.slug}`);
  return src ? { ...treatmentImage(t), src, alt: `Illustrative image for ${t.name}`, illustrative: true } : treatmentImage(t);
}

/**
 * Card for the treatments directory: prefers the treatment's own topic photo
 * (/public/images/treatments/<slug>.*, licensed stock — see docs/IMAGE_CREDITS.md) and falls back to `toCard`.
 */
export function toTopicCard(t: Treatment): TreatmentCardData {
  const card = toCard(t);
  const src = resolveImage(`treatments/${t.slug}`);
  return src ? { ...card, image: src, imageAlt: `Illustrative image for ${t.name}`, illustrative: true } : card;
}

export function toCard(t: Treatment): TreatmentCardData {
  const img = treatmentImage(t);
  return {
    slug: t.slug,
    name: t.name,
    summary: t.summary,
    categoryLabel: categories[t.category].label,
    hasModule: !!t.module,
    image: img.src,
    imageAlt: img.alt,
    motif: img.motif,
    illustrative: img.illustrative,
  };
}
