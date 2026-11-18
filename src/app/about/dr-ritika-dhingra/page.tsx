import Link from "next/link";
import { notFound } from "next/navigation";
import { Award, BadgeCheck, GraduationCap, Stethoscope } from "lucide-react";
import ClinicImage from "@/components/media/ClinicImage";
import { MaskReveal } from "@/components/motion/AnimatedSection";
import { ConsultationCTA, PageHero } from "@/components/ui/blocks";
import { founderPublished, site } from "@/content/site";
import { categories, publishedTreatments, type CategoryId } from "@/content/treatments";
import { breadcrumbJsonLd, JsonLd, pageMeta, physicianJsonLd } from "@/lib/seo";

/**
 * Founder profile (E-E-A-T for a medical site). Renders only once verified qualifications and
 * registration are filled in `site.founder`; until then the route returns 404 and is left out of the sitemap.
 */
const f = site.founder;
const path = `/about/${f.slug}`;

export const metadata = founderPublished
  ? pageMeta({
      title: `${f.name} — ${f.qualifications}`,
      description: `${f.name}, ${f.qualifications}, founder of The LUXE Clinique in Preet Vihar, East Delhi. ${f.registration}. Consultation-first skin, hair and laser care.`.slice(0, 160),
      path,
      image: "/og/default.jpg",
      imageAlt: `${f.name}, founder of The LUXE Clinique`,
    })
  : { robots: { index: false } };

export default function FounderPage() {
  if (!founderPublished) notFound();
  const cats = [...new Set(publishedTreatments.map((t) => t.category))] as CategoryId[];
  return (
    <>
      <PageHero
        eyebrow={`Founder · ${site.name}`}
        eyebrowInH1
        title={f.name}
        intro={`${f.qualifications}. ${f.registration}.`}
        crumbs={[{ href: "/about", label: "About" }, { href: path, label: f.name }]}
      />
      <section className="container-luxe pb-16">
        <div className="grid items-start gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="glass p-6 sm:p-8">
              <h2 className="font-display text-[1.9rem] text-charcoal">About {f.name.replace(/^Dr\.?\s*/, "Dr. ")}</h2>
              <p className="mt-4 text-[15.5px] leading-relaxed text-muted">
                {f.name} founded The LUXE Clinique in Preet Vihar with a simple belief: good aesthetic care starts with listening. Every consultation is unhurried — your concerns, your skin and your expectations come first, and every option is explained honestly, including its limitations, risks and aftercare.
              </p>
              <p className="mt-3 text-[15.5px] leading-relaxed text-muted">
                Treatment plans are personal, never one-size-fits-all, with a natural, subtle approach that respects your features.
              </p>
              <dl className="mt-8 grid gap-4 sm:grid-cols-2">
                <Item icon={GraduationCap} label="Qualifications" value={f.qualifications!} />
                <Item icon={BadgeCheck} label="Medical registration" value={f.registration!} />
                {f.experience && <Item icon={Stethoscope} label="Experience" value={f.experience} />}
                {f.memberships.length > 0 && <Item icon={Award} label="Memberships" value={f.memberships.join(" · ")} />}
              </dl>
            </div>
            <div className="mt-8">
              <h2 className="font-display text-[1.6rem] text-charcoal">Areas of care</h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {cats.map((c) => (
                  <li key={c}>
                    <Link href={`/treatments?category=${c}`} className="rounded-full border border-line bg-white/70 px-3 py-1.5 text-[13.5px] text-charcoal hover:border-rose">
                      {categories[c].label}
                    </Link>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-[14.5px] text-muted">
                Treatment pages on this site are reviewed by {f.name}; each page shows its review date.{" "}
                <Link href="/treatments" className="font-semibold text-burgundy hover:underline">Browse all treatments</Link>
              </p>
            </div>
          </div>
          <MaskReveal className="lg:col-span-5">
            <ClinicImage id="about-team" className="aspect-[4/5] w-full rounded-[28px]" />
          </MaskReveal>
        </div>
      </section>
      <ConsultationCTA />
      <script type="application/ld+json" dangerouslySetInnerHTML={JsonLd({ data: physicianJsonLd() })} />
      <script type="application/ld+json" dangerouslySetInnerHTML={JsonLd({ data: breadcrumbJsonLd([["About", "/about"], [f.name, path]]) })} />
    </>
  );
}

function Item({ icon: Icon, label, value }: { icon: typeof Award; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-burgundy/15 bg-white/60 p-4">
      <dt className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-rose-ink">
        <Icon size={14} aria-hidden /> {label}
      </dt>
      <dd className="mt-1.5 text-[14.5px] text-charcoal">{value}</dd>
    </div>
  );
}
