import { notFound } from "next/navigation";
import TreatmentDetailLayout from "@/components/treatments/TreatmentDetailLayout";
import { getTreatment, publishedTreatments } from "@/content/treatments";
import { articles } from "@/content/articles";
import { toTopicCard, treatmentTopicImage } from "@/lib/cards";
import { JsonLd, pageMeta, treatmentJsonLd } from "@/lib/seo";

export function generateStaticParams() {
  return publishedTreatments.map((t) => ({ slug: t.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const t = getTreatment(slug);
  if (!t) return {};
  const short = t.seoName ?? t.name.split(" (")[0];
  const description = `${short} at The LUXE Clinique, Preet Vihar, East Delhi. ${t.summary}`;
  // Keep the full title (with " | The LUXE Clinique") near Google's ~60-character display limit.
  const base = `${short} in Preet Vihar, East Delhi`;
  const meta = pageMeta({
    title: base,
    description: description.length > 160 ? `${description.slice(0, 157).replace(/\s+\S*$/, "")}…` : description,
    path: `/treatments/${t.slug}`,
    image: `/og/treatments/${t.slug}.jpg`,
    imageAlt: `${short} at The LUXE Clinique, Preet Vihar`,
  });
  return base.length > 42 ? { ...meta, title: { absolute: base } } : meta;
}

export default async function TreatmentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const t = getTreatment(slug);
  if (!t) notFound();

  const related = publishedTreatments
    .filter((r) => r.slug !== t.slug && (r.category === t.category || r.concerns.some((c) => t.concerns.includes(c))))
    .slice(0, 3)
    .map(toTopicCard);

  const image = treatmentTopicImage(t);
  const reading = articles.filter((a) => a.related.includes(t.slug)).map(({ slug, title, description }) => ({ slug, title, description }));

  return (
    <>
      <TreatmentDetailLayout t={t} image={image} related={related} reading={reading} />
      <script type="application/ld+json" dangerouslySetInnerHTML={JsonLd({ data: treatmentJsonLd(t, image.src) })} />
    </>
  );
}
