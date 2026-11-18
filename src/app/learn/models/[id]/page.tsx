import Link from "next/link";
import { notFound } from "next/navigation";
import Educational3DModule from "@/components/education/Educational3DModule";
import GlassTreatmentCard from "@/components/ui/GlassTreatmentCard";
import { ConsultationCTA, PageHero } from "@/components/ui/blocks";
import { modules } from "@/content/education";
import { publishedTreatments, type ModuleId } from "@/content/treatments";
import { toTopicCard } from "@/lib/cards";
import { articleForModule, articles } from "@/content/articles";
import { site } from "@/content/site";
import { breadcrumbJsonLd, clip, JsonLd, pageMeta } from "@/lib/seo";

export function generateStaticParams() {
  return Object.keys(modules).map((id) => ({ id }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const m = modules[id as ModuleId];
  if (!m) return {};
  const meta = pageMeta({ title: modelTitle(m.title), description: clip(m.intro), path: `/learn/models/${id}` });
  // Same topic as a written article → point search engines at the article so the two pages don't compete.
  const article = articleForModule(id);
  return article ? { ...meta, alternates: { canonical: `/learn/${article.slug}` } } : meta;
}

/** "<topic>: 3D Guide", falling back to the bare topic when that would be too long for search results. */
const modelTitle = (t: string) => (t.length + 10 <= 60 ? `${t}: 3D Guide` : t);

function modelJsonLd(id: string, title: string, intro: string) {
  const url = `${site.url}/learn/models/${id}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["MedicalWebPage", "LearningResource"],
        "@id": `${url}#page`,
        url,
        name: modelTitle(title),
        description: intro,
        inLanguage: "en-IN",
        learningResourceType: "Interactive 3D model",
        isAccessibleForFree: true,
        audience: { "@type": "PeopleAudience", audienceType: "Patients" },
        isPartOf: { "@id": `${site.url}/#website` },
        publisher: { "@id": `${site.url}/#clinic` },
      },
      { ...breadcrumbJsonLd([["Journal", "/learn"], [title, `/learn/models/${id}`]]), "@context": undefined },
    ],
  };
}

export default async function ModelPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const m = modules[id as ModuleId];
  if (!m) notFound();
  const related = publishedTreatments.filter((t) => t.module === m.id).slice(0, 6).map(toTopicCard);
  const guides = articles.filter((a) => a.module === m.id);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={JsonLd({ data: modelJsonLd(id, m.title, m.intro) })} />
      <PageHero eyebrow="Interactive 3D guide" eyebrowInH1 title={m.title} crumbs={[{ href: "/learn", label: "Journal" }, { href: `/learn/models/${id}`, label: m.title }]} />
      <section className="container-luxe pb-16">
        <Educational3DModule moduleId={m.id} />
        {guides.length > 0 && (
          <div className="glass mt-12 p-6">
            <p className="eyebrow !text-[0.64rem]">Read the full guide</p>
            <ul className="mt-3 space-y-3">
              {guides.map((g) => (
                <li key={g.slug}>
                  <Link href={`/learn/${g.slug}`} className="font-display text-[1.35rem] text-burgundy hover:underline">
                    {g.title}
                  </Link>
                  <p className="mt-1 text-[14px] leading-relaxed text-muted">{g.description}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
        {related.length > 0 && (
          <>
            <h2 className="font-display mt-16 text-[1.9rem]">Treatments that use this guide</h2>
            <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <li key={r.slug}>
                  <GlassTreatmentCard t={r} />
                </li>
              ))}
            </ul>
          </>
        )}
        <p className="mt-10 text-[14px] text-muted">
          <Link href="/learn" className="font-semibold text-burgundy hover:underline">← All educational resources</Link>
        </p>
      </section>
      <ConsultationCTA />
    </>
  );
}
