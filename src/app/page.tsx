import Link from "next/link";
import { ArrowRight, ArrowUpRight, Flower2, Gem, HeartHandshake, Sparkles } from "lucide-react";
import FaceLineArt from "@/components/art/FaceLineArt";
import HomeHero, { type HeroImg } from "@/components/home/HomeHero";
import TreatmentMarquee from "@/components/home/TreatmentMarquee";
import HorizontalTreatments from "@/components/home/HorizontalTreatments";
import ExperienceStory from "@/components/home/ExperienceStory";
import { InteractiveSkinModel } from "@/components/education/named-modules";
import { AnimatedSection, Reveal } from "@/components/motion/AnimatedSection";
import ParallaxImage from "@/components/motion/ParallaxImage";
import Magnetic from "@/components/motion/Magnetic";
import ArtPlate from "@/components/media/ArtPlate";
import Accordion from "@/components/ui/Accordion";
import { Accented, ConsultationCTA, SectionHeading } from "@/components/ui/blocks";
import { assetById, categoryImage } from "@/content/assets";
import { categories, featuredSlugs, publishedTreatments, type CategoryId } from "@/content/treatments";
import { articles } from "@/content/articles";
import { generalFaqs } from "@/content/faqs";
import { toCard } from "@/lib/cards";
import { resolveImage } from "@/lib/images";
import { pageMeta } from "@/lib/seo";

export const metadata = {
  ...pageMeta({
    title: "Skin, Hair & Laser Clinic in Preet Vihar, East Delhi",
    description:
      "Skin, hair and laser clinic in Preet Vihar, East Delhi: HydraFacial, peels, skin boosters, fillers and laser hair reduction, planned at a consultation.",
    path: "/",
  }),
  title: { absolute: "Skin & Laser Clinic in Preet Vihar, East Delhi | The LUXE Clinique" },
};

/** Resolve a slot to an image (or null) with its alt text and illustrative flag. */
function img(id: string): HeroImg | null {
  const src = resolveImage(id);
  const slot = assetById(id);
  if (!src) return null;
  // Treatment photos ("treatment-<slug>") have no slot entry: describe them by treatment name so no image ships with empty alt text.
  const t = id.startsWith("treatment-") ? publishedTreatments.find((x) => `treatment-${x.slug}` === id) : undefined;
  const alt = slot?.alt || (t ? `${t.name} treatment at The LUXE Clinique` : "Treatment at The LUXE Clinique");
  return { src, alt, illustrative: slot ? slot.source === "illustrative" : true };
}

const pillars = [
  { icon: Sparkles, title: "Tailored to you", body: "No two faces are the same. Every plan is shaped around your skin, features and goals." },
  { icon: Flower2, title: "Unhurried consultations", body: "Time to talk, ask questions and understand your options — including what each can and can't do." },
  { icon: Gem, title: "Modern techniques", body: "Carefully selected treatments and products, chosen for your skin type and concerns." },
  { icon: HeartHandshake, title: "Care that continues", body: "Clear aftercare and follow-up, so you always know who to talk to." },
];

const rituals: { cat: CategoryId; title: string }[] = [
  { cat: "skin", title: "Facials & *Glow*" },
  { cat: "injectables", title: "Lips, Lines & *Contours*" },
  { cat: "laser", title: "Laser & *Light*" },
  { cat: "pigmentation", title: "Tone & *Radiance*" },
  { cat: "hair", title: "Hair & *Scalp*" },
  { cat: "dermatology", title: "Skin *Health*" },
];

const journalImages = ["cat-laser", "cat-pigmentation", "cat-injectables"];

export default function Home() {
  const featured = featuredSlugs.map((s) => publishedTreatments.find((t) => t.slug === s)!).filter(Boolean);
  const editorial = img("home-editorial");
  const statement = img("treatment-chemical-peels");

  return (
    <>
      <HomeHero hero={img("home-hero")} accentA={img("home-accent")} accentB={img("treatment-lip-fillers")} />
      <TreatmentMarquee />

      {/* ── Philosophy ── */}
      <section id="introduction" className="section container-luxe scroll-mt-24" aria-labelledby="intro-title">
        <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="relative lg:col-span-5">
            {editorial ? (
              <ParallaxImage src={editorial.src} alt={editorial.alt} illustrative={editorial.illustrative} tagClassName="absolute bottom-4 left-1/2 -translate-x-1/2" className="aspect-[4/5] w-full rounded-t-full rounded-b-[32px] shadow-[0_30px_80px_rgba(123,23,52,0.16)]" cursor="Calm" />
            ) : (
              <ArtPlate motif="face" className="aspect-[4/5] w-full rounded-t-full rounded-b-[32px]" />
            )}
            <div className="glass glass-strong absolute -bottom-6 right-2 max-w-[16rem] p-5 sm:right-[-2rem]">
              <p className="font-display text-[1.25rem] italic leading-snug text-burgundy">A moment of calm</p>
              <p className="mt-2 text-[13px] leading-relaxed text-muted">103, New Rajdhani Enclave, Preet Vihar, East Delhi</p>
            </div>
          </div>
          <div className="lg:col-span-7">
            <SectionHeading
              id="intro-title"
              eyebrow="The LUXE philosophy"
              title="Beauty that feels like *you*"
              intro="The LUXE Clinique is a calm, welcoming space for skin, hair and aesthetic care. We take time to understand you, explain your options honestly, and create a plan that respects your features, your skin and your pace."
            />
            <AnimatedSection as="ul" className="mt-10 grid gap-4 sm:grid-cols-2">
              {pillars.map(({ icon: Icon, title, body }) => (
                <Reveal as="li" key={title} className="glass glass-sheen group p-6 transition-transform duration-500 hover:-translate-y-1">
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-[#F8DDE2] to-[#EFD2D8] text-burgundy transition-transform duration-700 group-hover:rotate-[20deg] group-hover:scale-110">
                    <Icon size={19} strokeWidth={1.6} aria-hidden />
                  </span>
                  <h3 className="font-display mt-4 text-[1.3rem] text-charcoal">{title}</h3>
                  <p className="mt-1.5 text-[14.5px] leading-relaxed text-muted">{body}</p>
                </Reveal>
              ))}
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ── Signature treatments (pinned horizontal scroll) ── */}
      <HorizontalTreatments cards={featured.map(toCard)} />

      {/* ── Explore by ritual ── */}
      <section className="section container-luxe" aria-labelledby="ritual-title">
        <SectionHeading id="ritual-title" eyebrow="The treatment menu" title="Explore by *ritual*" align="center" />
        <AnimatedSection as="ul" className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {rituals.map(({ cat, title }, i) => {
            const slot = assetById(categoryImage[cat])!;
            const src = resolveImage(slot.id);
            return (
              <Reveal as="li" key={cat} className={i % 3 === 1 ? "lg:translate-y-12" : ""}>
                <Link href={`/treatments?category=${cat}`} data-cursor="Explore" className="group relative block overflow-hidden rounded-[30px] shadow-[0_20px_50px_rgba(123,23,52,0.12)]">
                  <div className={`relative aspect-[4/5] w-full overflow-hidden ${i % 2 ? "rounded-t-full" : ""}`}>
                    {src ? (
                      <ParallaxImage src={src} alt={slot.alt} amount={8} illustrative={slot.source === "illustrative"} tagClassName="absolute right-4 top-4" sizes="(min-width:1024px) 33vw, 90vw" className="absolute inset-0 transition-transform duration-[1.4s] ease-out group-hover:scale-[1.06]" />
                    ) : (
                      <ArtPlate motif={slot.motif} className="h-full w-full" />
                    )}
                    <div className="pointer-events-none absolute inset-0 bg-burgundy/0 transition-colors duration-700 group-hover:bg-burgundy/10" />
                  </div>
                  <div className="glass glass-strong absolute inset-x-4 bottom-4 flex items-end justify-between gap-3 p-5 transition-transform duration-700 group-hover:-translate-y-1">
                    <div>
                      <h3 className="font-display text-[1.55rem] leading-tight text-charcoal">
                        <Accented text={title} />
                      </h3>
                      <p className="mt-1 line-clamp-2 text-[13px] leading-snug text-muted">{categories[cat].blurb}</p>
                    </div>
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-burgundy text-white transition-transform duration-500 group-hover:rotate-45">
                      <ArrowUpRight size={18} aria-hidden />
                    </span>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </AnimatedSection>
      </section>

      {/* ── Cinematic statement band ── */}
      {statement && (
        <section className="relative mt-10 h-[80vh] min-h-[520px] overflow-clip" aria-label="Beauty, considered">
          <ParallaxImage src={statement.src} alt={statement.alt} amount={14} illustrative={statement.illustrative} tagClassName="absolute bottom-5 right-5" sizes="100vw" className="absolute inset-0" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(60,10,26,0.78)_0%,rgba(60,10,26,0.45)_45%,rgba(60,10,26,0.05)_100%)]" />
          <div className="container-luxe relative flex h-full flex-col justify-center text-white">
            <AnimatedSection as="div" className="max-w-xl">
              <Reveal as="p" className="eyebrow !text-[#F3C6D0]">Beauty, considered</Reveal>
              <Reveal>
                <h2 className="display-xl mt-5 text-[2.8rem] sm:text-[4.2rem]">
                  Gentle, honest <span className="italic text-[#F6C9D2]">expert care</span>
                </h2>
              </Reveal>
              <Reveal as="p" className="mt-5 max-w-md text-[16.5px] leading-relaxed text-white/85">
                From a first facial to a tailored treatment plan, every step is explained clearly — what to expect, the risks, and the aftercare.
              </Reveal>
              <Reveal className="mt-8">
                <Magnetic>
                  <Link href="/contact#enquiry" className="btn bg-white text-burgundy">
                    Book a Consultation <ArrowRight size={16} aria-hidden />
                  </Link>
                </Magnetic>
              </Reveal>
            </AnimatedSection>
          </div>
        </section>
      )}

      {/* ── The LUXE experience (sticky story) ── */}
      <section className="section champagne-wash relative" aria-labelledby="process-title">
        <FaceLineArt className="pointer-events-none absolute -left-16 top-10 hidden h-[30rem] w-auto opacity-[0.1] lg:block" animate={false} />
        <div className="container-luxe relative">
          <SectionHeading id="process-title" eyebrow="The LUXE experience" title="Your journey, *beautifully simple*" intro="From the first conversation to aftercare, every step is designed to feel calm, clear and personal." />
          <ExperienceStory images={[img("home-consultation"), img("cat-skin"), img("patient-info"), img("treatment-skin-boosters")]} />
        </div>
      </section>

      {/* ── Know your skin (3D) ── */}
      <section className="section container-luxe" aria-label="Interactive skin guide">
        <SectionHeading
          eyebrow="Know your skin"
          title="The science behind *beautiful skin care*"
          intro="Explore the layers of your skin in 3D — the epidermis, collagen-rich dermis, follicles and glands that many treatments work with."
        />
        <div className="mt-10">
          <InteractiveSkinModel headingLevel={3} />
        </div>
      </section>

      {/* ── Journal ── */}
      <section className="section !pt-0 container-luxe" aria-labelledby="learn-title">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading id="learn-title" eyebrow="The journal" title="Beauty, *explained*" intro="Honest guides to popular treatments — what they are, who they suit and what to expect." />
          <Link href="/learn" className="btn btn-glass">
            Read the journal <ArrowRight size={16} aria-hidden />
          </Link>
        </div>
        <AnimatedSection as="ul" className="mt-10 grid gap-6 md:grid-cols-3">
          {articles.slice(0, 3).map((a, i) => {
            const j = img(journalImages[i]);
            return (
              <Reveal as="li" key={a.slug}>
                <Link href={`/learn/${a.slug}`} data-cursor="Read" className="group flex h-full flex-col overflow-hidden rounded-[28px] border border-white/80 bg-white/70 shadow-[0_16px_40px_rgba(123,23,52,0.08)] transition-transform duration-500 hover:-translate-y-1.5">
                  <div className="relative aspect-[16/11] overflow-hidden">
                    {j ? (
                      <ParallaxImage src={j.src} alt={j.alt} amount={6} illustrative={j.illustrative} sizes="(min-width:768px) 33vw, 90vw" className="absolute inset-0 transition-transform duration-[1.4s] group-hover:scale-[1.06]" />
                    ) : (
                      <ArtPlate motif="drop" className="h-full w-full" />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <span className="eyebrow !text-[0.62rem]">Journal</span>
                    <h3 className="font-display mt-3 text-[1.4rem] leading-snug text-charcoal">{a.title}</h3>
                    <p className="mt-2 text-[14px] leading-relaxed text-muted">{a.description}</p>
                    <span className="mt-auto flex items-center gap-1.5 pt-5 text-[13.5px] font-semibold text-burgundy">
                      Read more <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" aria-hidden />
                    </span>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </AnimatedSection>
      </section>

      {/* ── FAQ ── */}
      <section className="section !pt-0 container-luxe" aria-labelledby="faq-title">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHeading id="faq-title" eyebrow="Questions" title="Good to *know*" />
          </div>
          <div className="lg:col-span-8">
            <Accordion items={generalFaqs} defaultOpen={0} />
          </div>
        </div>
      </section>

      <ConsultationCTA />
    </>
  );
}
