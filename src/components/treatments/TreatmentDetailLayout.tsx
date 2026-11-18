import Link from "next/link";
import { AlertTriangle, ArrowRight, CalendarClock, CheckCircle2, ClipboardCheck, Clock, HeartPulse, Info, Layers, MapPin, Sparkles, UserCheck } from "lucide-react";
import type { ReactNode } from "react";
import Educational3DModule from "@/components/education/Educational3DModule";
import ArtPlate from "@/components/media/ArtPlate";
import ParallaxImage from "@/components/motion/ParallaxImage";
import IllustrativeTag from "@/components/media/IllustrativeTag";
import LaserTreatmentHero3D from "@/components/three/LaserTreatmentHero3D";
import { AnimatedSection, MaskReveal, Reveal } from "@/components/motion/AnimatedSection";
import Accordion from "@/components/ui/Accordion";
import GlassTreatmentCard from "@/components/ui/GlassTreatmentCard";
import { Breadcrumbs, ConsultationCTA, ReviewNotice } from "@/components/ui/blocks";
import { StaggerHeadline } from "@/components/motion/AnimatedSection";
import { categories, concernLabels, type Treatment } from "@/content/treatments";
import { founderPublished, site } from "@/content/site";
import type { Article } from "@/content/articles";
import { BookOpen, IndianRupee } from "lucide-react";
import type { TreatmentCardData } from "@/components/ui/GlassTreatmentCard";
import type { AssetSlot } from "@/content/assets";

const toc = [
  ["overview", "Overview"],
  ["how-it-works", "How it works"],
  ["suitability", "Suitability"],
  ["preparation", "Preparation"],
  ["risks", "Risks & side effects"],
  ["recovery", "Recovery & aftercare"],
  ["faqs", "FAQs"],
] as const;

export default function TreatmentDetailLayout({
  t,
  image,
  related,
  reading = [],
}: {
  t: Treatment;
  image: { src: string | null; alt: string; motif: AssetSlot["motif"]; illustrative?: boolean };
  related: TreatmentCardData[];
  /** Journal articles that discuss this treatment (internal links between guides and treatments). */
  reading?: Pick<Article, "slug" | "title" | "description">[];
}) {
  const reviewed = founderPublished && t.review === "approved";
  return (
    <>
      {/* ── Hero ── */}
      <section className="luxe-canvas grain relative overflow-clip pb-14 pt-32 sm:pt-36">
        <div className="pointer-events-none absolute -right-40 -top-40 h-[34rem] w-[34rem] rounded-full bg-rose/20 blur-3xl" />
        <div className="container-luxe relative grid items-center gap-10 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <Breadcrumbs items={[{ href: "/treatments", label: "Treatments" }, { href: `/treatments/${t.slug}`, label: t.name }]} />
            <p className="eyebrow mt-6 flex items-center gap-3">
              <span className="h-px w-8 bg-burgundy/50" />
              {categories[t.category].label}
            </p>
            <h1 className="display-xl mt-5 text-[2.6rem] text-charcoal sm:text-[3.4rem] lg:text-[4rem]">
              <StaggerHeadline text={t.name} />
            </h1>
            {t.aka && t.aka.length > 0 && (
              <p className="mt-3 text-[14px] text-muted">
                Also known as {t.aka.join(", ")}
              </p>
            )}
            <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-muted">{t.summary}</p>
            {reviewed && (
              <p className="mt-4 text-[13.5px] text-muted">
                Medically reviewed by{" "}
                <Link href={`/about/${site.founder.slug}`} className="font-semibold text-burgundy hover:underline">
                  {site.founder.name}
                </Link>
                , {site.founder.qualifications}
                {t.reviewedOn && ` · Last reviewed ${new Date(t.reviewedOn).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}`}
              </p>
            )}
            <ul className="mt-6 flex flex-wrap gap-2" aria-label="Related concerns">
              {t.concerns.map((c) => (
                <li key={c}>
                  <Link href={`/treatments?concern=${c}`} className="rounded-full border border-line bg-white/70 px-3 py-1.5 text-[13px] text-charcoal hover:border-rose">
                    {concernLabels[c]}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={`/contact?treatment=${t.slug}#enquiry`} className="btn btn-primary">
                Book a Consultation <ArrowRight size={16} aria-hidden />
              </Link>
              {t.module && (
                <a href="#how-it-works" className="btn btn-glass">
                  <Layers size={16} aria-hidden /> View 3D guide
                </a>
              )}
            </div>
          </div>
          <MaskReveal className="relative lg:col-span-6">
            {image.src ? (
              <ParallaxImage
                src={image.src}
                alt={image.alt}
                priority
                illustrative={image.illustrative}
                tagClassName="absolute left-1/2 top-[12%] -translate-x-1/2"
                sizes="(min-width: 1024px) 460px, 90vw"
                className="mx-auto aspect-[4/5] w-full max-w-[460px] rounded-t-full rounded-b-[32px] border border-white/80 shadow-[0_36px_90px_rgba(123,23,52,0.16)]"
              />
            ) : (
              <div className="relative mx-auto aspect-[4/5] w-full max-w-[460px] overflow-hidden rounded-t-full rounded-b-[32px] border border-white/80 shadow-[0_36px_90px_rgba(123,23,52,0.16)]">
                <ArtPlate motif={image.motif} className="h-full w-full" />
              </div>
            )}
            <div className="glass glass-strong absolute bottom-4 left-4 right-4 grid grid-cols-2 gap-3 p-4 sm:left-auto sm:right-[-1rem] sm:w-72">
              <Fact icon={Clock} label="Downtime" value={shorten(t.recovery)} />
              <Fact icon={CalendarClock} label="Sessions" value={t.sessions ? shorten(t.sessions) : "Discussed at consultation"} />
              {t.price && (
                <Fact icon={IndianRupee} label="Cost" value={`From ₹${t.price.from.toLocaleString("en-IN")}${t.price.per ? ` ${t.price.per}` : ""}`} />
              )}
            </div>
          </MaskReveal>
        </div>
      </section>

      {/* ── Body ── */}
      <div className="container-luxe grid gap-10 pb-16 lg:grid-cols-12">
        <aside className="hidden lg:col-span-3 lg:block">
          <nav aria-label="On this page" className="glass sticky top-28 p-5">
            <p className="eyebrow !text-[0.64rem]">On this page</p>
            <ol className="mt-3 space-y-1.5 text-[14px]">
              {toc.map(([id, label]) => (
                <li key={id}>
                  <a href={`#${id}`} className="block rounded-lg px-2 py-1 text-charcoal hover:bg-white hover:text-burgundy">
                    {label}
                  </a>
                </li>
              ))}
            </ol>
            <Link href={`/contact?treatment=${t.slug}#enquiry`} className="btn btn-primary mt-5 w-full !text-[13.5px]">
              Book a Consultation
            </Link>
          </nav>
        </aside>

        <article className="min-w-0 lg:col-span-9">
          <Block id="overview" icon={Info} title="Overview">
            <div className="prose-luxe">
              {t.overview.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <h3 className="mt-8 font-semibold text-charcoal">Concerns it may be considered for</h3>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {t.intendedFor.map((x) => (
                <li key={x} className="flex gap-2.5 rounded-xl bg-white/60 p-3 text-[14.5px]">
                  <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-burgundy" aria-hidden /> {x}
                </li>
              ))}
            </ul>
          </Block>

          <Block id="how-it-works" icon={Sparkles} title="How it works — in general terms">
            <List items={t.howItWorks} />
            {t.slug === "laser-hair-reduction" && (
              <div className="mt-8">
                <p className="eyebrow mb-4">Inside the treatment room</p>
                <LaserTreatmentHero3D />
              </div>
            )}
            {t.module && (
              <div className="mt-8">
                <Educational3DModule moduleId={t.module} headingLevel={3} />
              </div>
            )}
          </Block>

          <Block id="suitability" icon={UserCheck} title="Suitability considerations">
            <List items={t.suitability} />
          </Block>

          <Block id="preparation" icon={ClipboardCheck} title="Preparation">
            <List items={t.preparation} />
          </Block>

          <Block id="risks" icon={AlertTriangle} title="Possible risks and side effects">
            <div className="rounded-2xl border border-burgundy/15 bg-burgundy/[0.04] p-5">
              <List items={t.risks} />
              <p className="mt-4 text-[13.5px] text-muted">
                This is not a complete list. Your clinician will discuss risks relevant to you, and you should receive written information before consenting.
              </p>
            </div>
          </Block>

          <Block id="recovery" icon={HeartPulse} title="Recovery and aftercare">
            <p className="prose-luxe">{t.recovery}</p>
            {t.sessions && <p className="prose-luxe mt-3"><strong className="font-semibold">Sessions: </strong>{t.sessions}</p>}
            <h3 className="mt-6 font-semibold text-charcoal">General aftercare</h3>
            <List items={t.aftercare} />
          </Block>

          {t.price && (
            <Block id="cost" icon={IndianRupee} title={`${t.seoName ?? t.name.split(" (")[0]} cost in Delhi`}>
              <p className="prose-luxe">
                {`From ₹${t.price.from.toLocaleString("en-IN")}${t.price.per ? ` ${t.price.per}` : ""}. `}
                {t.price.note ?? "The final cost depends on the area treated, the number of sessions and the products used, and is confirmed at your consultation."}
              </p>
            </Block>
          )}

          <Block id="faqs" icon={Info} title="Frequently asked questions">
            <Accordion items={t.faqs} />
          </Block>

          <p className="mt-10 flex gap-3 rounded-2xl border border-line bg-white/60 p-4 text-[14.5px] leading-relaxed text-muted">
            <MapPin size={18} className="mt-0.5 shrink-0 text-burgundy" aria-hidden />
            <span>
              {t.name.split(" (")[0]} consultations take place at The LUXE Clinique in Preet Vihar, East Delhi, a short walk from Preet Vihar Metro
              Station. Patients visit from {site.nearbyAreas.slice(0, -1).join(", ")} and {site.nearbyAreas.at(-1)}.{" "}
              <Link href="/contact" className="font-medium text-burgundy underline-offset-4 hover:underline">
                Directions and opening hours
              </Link>
            </span>
          </p>

          <ReviewNotice className="mt-6" />
        </article>
      </div>

      {reading.length > 0 && (
        <section className="container-luxe pb-12" aria-labelledby="reading-title">
          <h2 id="reading-title" className="font-display text-[1.9rem] text-charcoal">
            Further reading
          </h2>
          <ul className="mt-6 grid gap-4 md:grid-cols-2">
            {reading.map((a) => (
              <li key={a.slug}>
                <Link href={`/learn/${a.slug}`} className="glass group flex h-full gap-4 p-5 hover:bg-white/80">
                  <BookOpen size={20} className="mt-1 shrink-0 text-burgundy" aria-hidden />
                  <span>
                    <span className="block font-semibold text-charcoal group-hover:text-burgundy">{a.title}</span>
                    <span className="mt-1 block text-[14px] leading-relaxed text-muted">{a.description}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {related.length > 0 && (
        <section className="container-luxe pb-20" aria-labelledby="related-title">
          <h2 id="related-title" className="font-display text-[1.9rem] text-charcoal">
            Related treatments
          </h2>
          <AnimatedSection as="ul" className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r) => (
              <Reveal as="li" key={r.slug}>
                <GlassTreatmentCard t={r} />
              </Reveal>
            ))}
          </AnimatedSection>
        </section>
      )}

      <ConsultationCTA title={`Considering ${t.name.split(" (")[0].toLowerCase()}?`} />
    </>
  );
}

function Block({ id, icon: Icon, title, children }: { id: string; icon: typeof Info; title: string; children: ReactNode }) {
  return (
    <AnimatedSection id={id} className="scroll-mt-28 border-b border-line py-10 first:pt-2" aria-labelledby={`${id}-h`}>
      <Reveal className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-full bg-burgundy/10 text-burgundy">
          <Icon size={18} aria-hidden />
        </span>
        <h2 id={`${id}-h`} className="font-display text-[1.65rem] leading-tight text-charcoal sm:text-[1.9rem]">
          {title}
        </h2>
      </Reveal>
      <Reveal className="mt-5">{children}</Reveal>
    </AnimatedSection>
  );
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="prose-luxe">
      {items.map((x) => (
        <li key={x}>{x}</li>
      ))}
    </ul>
  );
}

function Fact({ icon: Icon, label, value }: { icon: typeof Info; label: string; value: string }) {
  return (
    <div>
      <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-rose-ink">
        <Icon size={13} aria-hidden /> {label}
      </p>
      <p className="mt-1 text-[13px] leading-snug text-charcoal">{value}</p>
    </div>
  );
}

const shorten = (s: string) => (s.length > 70 ? s.split(/[.;]/)[0] + "." : s);
