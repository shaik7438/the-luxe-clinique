import Link from "next/link";
import { notFound } from "next/navigation";
import Educational3DModule from "@/components/education/Educational3DModule";
import GlassTreatmentCard from "@/components/ui/GlassTreatmentCard";
import { ConsultationCTA, PageHero, ReviewNotice } from "@/components/ui/blocks";
import { articles, getArticle } from "@/content/articles";
import { site } from "@/content/site";
import { getTreatment } from "@/content/treatments";
import { toTopicCard } from "@/lib/cards";
import { breadcrumbJsonLd, JsonLd, pageMeta } from "@/lib/seo";

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = getArticle(slug);
  return a ? pageMeta({ title: a.title, description: a.description, path: `/learn/${a.slug}`, type: "article" }) : {};
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) notFound();
  const related = a.related.map(getTreatment).filter((t): t is NonNullable<typeof t> => !!t).map(toTopicCard);
  const updated = new Date(a.updated).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

  return (
    <>
      <PageHero eyebrow="The journal" title={a.title} intro={a.description} crumbs={[{ href: "/learn", label: "Journal" }, { href: `/learn/${a.slug}`, label: a.title }]}>
        <p className="mt-6 text-[13.5px] text-muted">
          By {site.name} · Last updated {updated}{a.reviewer ? ` · Medically reviewed by ${a.reviewer.name}, ${a.reviewer.credentials}` : ""}
        </p>
      </PageHero>

      <article className="container-luxe pb-16">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <div className="prose-luxe">
              {a.sections.map((s) => (
                <section key={s.heading}>
                  <h2>{s.heading}</h2>
                  {s.paragraphs?.map((p) => <p key={p}>{p}</p>)}
                  {s.list && (
                    <ul>
                      {s.list.map((li) => (
                        <li key={li}>{li}</li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}
            </div>
            <ReviewNotice className="mt-10" />
          </div>
          <aside className="lg:col-span-4">
            <div className="glass sticky top-28 p-6">
              <p className="eyebrow !text-[0.64rem]">Next step</p>
              <p className="font-display mt-2 text-xl leading-snug">Have questions about your own skin?</p>
              <p className="mt-2 text-[14px] text-muted">A consultation is the right place to discuss your situation.</p>
              <Link href="/contact#enquiry" className="btn btn-primary mt-4 w-full">Book a Consultation</Link>
              <Link href="/learn/questions-to-ask-at-a-consultation" className="mt-3 block text-center text-[13.5px] font-semibold text-burgundy hover:underline">
                Questions to ask at a consultation
              </Link>
            </div>
          </aside>
        </div>

        {a.module && (
          <div className="mt-14">
            <Educational3DModule moduleId={a.module} />
          </div>
        )}

        {related.length > 0 && (
          <section className="mt-16" aria-labelledby="rel">
            <h2 id="rel" className="font-display text-[1.9rem]">Related treatments</h2>
            <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <li key={r.slug}>
                  <GlassTreatmentCard t={r} />
                </li>
              ))}
            </ul>
          </section>
        )}
      </article>
      <ConsultationCTA />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={JsonLd({
          data: {
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": ["MedicalWebPage", "Article"],
                headline: a.title,
                description: a.description,
                dateModified: a.updated,
                inLanguage: "en-IN",
                url: `${site.url}/learn/${a.slug}`,
                image: `${site.url}/og/default.jpg`,
                author: { "@id": `${site.url}/#clinic` },
                publisher: { "@id": `${site.url}/#clinic` },
                isPartOf: { "@id": `${site.url}/#website` },
                ...(a.reviewer ? { reviewedBy: { "@type": "Person", name: a.reviewer.name, description: a.reviewer.credentials }, lastReviewed: a.updated } : {}),
              },
              { ...breadcrumbJsonLd([["Journal", "/learn"], [a.title, `/learn/${a.slug}`]]), "@context": undefined },
            ],
          },
        })}
      />
    </>
  );
}
