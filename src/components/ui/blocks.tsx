import Link from "next/link";
import { ArrowRight, ChevronRight, ShieldAlert } from "lucide-react";
import type { ReactNode } from "react";
import { AnimatedSection, Reveal, StaggerHeadline } from "@/components/motion/AnimatedSection";
import { reviewNotice } from "@/content/site";
import FaceLineArt from "@/components/art/FaceLineArt";
import ParallaxImage from "@/components/motion/ParallaxImage";

/** Renders `*word*` segments of a heading as the italic burgundy accent. */
export function Accented({ text }: { text: string }) {
  return (
    <>
      {text.split("*").map((part, i) =>
        i % 2 ? (
          <span key={i} className="accent">
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}

export function PageHero({
  eyebrow,
  title,
  accent,
  intro,
  crumbs,
  children,
  image,
  compactTop = false,
  eyebrowInH1 = false,
}: {
  eyebrow: string;
  title: string;
  /** Optional italic second line, e.g. title "Treatments" + accent "for you". */
  accent?: string;
  intro?: string;
  crumbs?: { href: string; label: string }[];
  children?: ReactNode;
  /** Optional arch image on the right, with parallax reveal. */
  image?: { src: string; alt: string; illustrative: boolean } | null;
  /** Less top padding when another section sits above the hero (it no longer has to clear the navbar). */
  compactTop?: boolean;
  /** Render the eyebrow inside the <h1> so the heading carries a descriptive, keyword-bearing line (hub pages). */
  eyebrowInH1?: boolean;
}) {
  const top = compactTop ? "pt-10 sm:pt-12" : "pt-32 sm:pt-36";
  if (image) {
    return (
      <section className={`luxe-canvas grain relative overflow-clip pb-14 ${top} lg:pb-20`}>
        <div className="pointer-events-none absolute -right-32 -top-24 h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,rgba(242,190,201,0.5),transparent_65%)] blur-2xl" />
        <div className="container-luxe relative grid items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            {crumbs && <Breadcrumbs items={crumbs} />}
            <HeroHeading eyebrow={eyebrow} title={title} accent={accent} eyebrowInH1={eyebrowInH1} className="max-w-3xl text-[2.6rem] text-charcoal sm:text-[3.5rem] lg:text-[4.4rem]" />
            {intro && <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-muted">{intro}</p>}
            {children}
          </div>
          <div className="relative lg:col-span-5">
            <ParallaxImage
              src={image.src}
              alt={image.alt}
              priority
              illustrative={image.illustrative}
              tagClassName="absolute bottom-4 left-1/2 -translate-x-1/2"
              sizes="(min-width: 1024px) 40vw, 90vw"
              className="mx-auto aspect-[4/5] w-full max-w-[420px] rounded-t-full rounded-b-[32px] shadow-[0_40px_90px_rgba(123,23,52,0.18)]"
            />
            <span className="pearl absolute left-2 top-[18%] h-7 w-7 animate-float" aria-hidden />
            <span className="pearl absolute bottom-[12%] right-4 h-5 w-5 animate-float [animation-delay:1.5s]" aria-hidden />
          </div>
        </div>
      </section>
    );
  }
  return (
    <section className={`luxe-canvas grain relative overflow-clip pb-14 ${top} lg:pb-20`}>
      <div className="pointer-events-none absolute -right-32 -top-24 h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,rgba(242,190,201,0.5),transparent_65%)] blur-2xl" />
      <FaceLineArt className="pointer-events-none absolute -right-10 top-16 hidden h-[26rem] w-auto opacity-[0.16] lg:block" animate={false} />
      <div className="container-luxe relative">
        {crumbs && <Breadcrumbs items={crumbs} />}
        <HeroHeading eyebrow={eyebrow} title={title} accent={accent} eyebrowInH1={eyebrowInH1} className="max-w-4xl text-[2.6rem] text-charcoal sm:text-[3.5rem] lg:text-[4.2rem]" />
        {intro && <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-muted">{intro}</p>}
        {children}
      </div>
    </section>
  );
}

/**
 * Eyebrow + display headline. With `eyebrowInH1`, the eyebrow sits inside the <h1>
 * so crawlers read one complete, descriptive heading (e.g. "About our skin clinic ·
 * Preet Vihar, East Delhi — Our story, and philosophy").
 */
function HeroHeading({ eyebrow, title, accent, eyebrowInH1, className }: { eyebrow: string; title: string; accent?: string; eyebrowInH1: boolean; className: string }) {
  const eyebrowInner = (
    <>
      <span className="h-px w-8 bg-burgundy/50" aria-hidden />
      {eyebrow}
    </>
  );
  const headline = (
    <>
      <StaggerHeadline text={title} />
      {accent && (
        <>
          {" "}
          <span className="accent block">
            <StaggerHeadline text={accent} delay={0.25} />
          </span>
        </>
      )}
    </>
  );
  if (eyebrowInH1) {
    return (
      <h1 className="mt-6">
        <span className="eyebrow flex items-center gap-3 leading-normal">{eyebrowInner}</span>
        <span className="sr-only"> — </span>
        <span className={`display-xl mt-5 block ${className}`}>{headline}</span>
      </h1>
    );
  }
  return (
    <>
      <p className="eyebrow mt-6 flex items-center gap-3">{eyebrowInner}</p>
      <h1 className={`display-xl mt-5 ${className}`}>{headline}</h1>
    </>
  );
}

export function Breadcrumbs({ items }: { items: { href: string; label: string }[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1 text-[13px] text-muted">
        <li>
          <Link href="/" className="hover:text-burgundy">Home</Link>
        </li>
        {items.map((c, i) => (
          <li key={c.href} className="flex items-center gap-1">
            <ChevronRight size={14} aria-hidden />
            {i === items.length - 1 ? (
              <span aria-current="page" className="text-charcoal">{c.label}</span>
            ) : (
              <Link href={c.href} className="hover:text-burgundy">{c.label}</Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function SectionHeading({ eyebrow, title, intro, align = "left", id }: { eyebrow: string; title: string; intro?: string; align?: "left" | "center"; id?: string }) {
  return (
    <AnimatedSection as="div" className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <Reveal as="p" className={`eyebrow flex items-center gap-3 ${align === "center" ? "justify-center" : ""}`}>
        <span className="h-px w-8 bg-burgundy/50" />
        {eyebrow}
        {align === "center" && <span className="h-px w-8 bg-burgundy/50" />}
      </Reveal>
      <Reveal>
        <h2 id={id} className="display-xl mt-5 text-[2.3rem] text-charcoal sm:text-[3.1rem]">
          <Accented text={title} />
        </h2>
      </Reveal>
      {intro && <Reveal as="p" className="mt-4 text-[16.5px] leading-relaxed text-muted">{intro}</Reveal>}
    </AnimatedSection>
  );
}

export function ConsultationCTA({ title = "Begin with a *conversation*", body }: { title?: string; body?: string }) {
  return (
    <section className="container-luxe section !pt-0">
      <AnimatedSection as="div" className="glass-burgundy glass-sheen relative overflow-hidden !rounded-[36px] px-6 py-14 sm:px-12 lg:py-20">
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(233,168,183,0.35),transparent_65%)]" />
        <div className="relative grid items-end gap-8 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <Reveal as="p" className="eyebrow !text-[#F3C6D0]">Your LUXE journey</Reveal>
            <Reveal>
              <h2 className="display-xl mt-5 text-[2.4rem] sm:text-[3.2rem] [&_.accent]:!text-[#F6C9D2]">
                <Accented text={title} />
              </h2>
            </Reveal>
            <Reveal as="p" className="mt-5 max-w-xl text-[16px] leading-relaxed text-white/80">
              {body ?? "Every treatment begins with a relaxed consultation: your goals, your skin and the options that suit you — with risks, alternatives and aftercare explained before anything is decided."}
            </Reveal>
          </div>
          <Reveal className="relative flex flex-wrap gap-3 lg:justify-end">
            <Link href="/contact#enquiry" className="btn bg-white text-burgundy hover:-translate-y-0.5">
              Book a Consultation <ArrowRight size={16} aria-hidden />
            </Link>
            <Link href="/patient-information" className="btn border border-white/30 text-white hover:bg-white/10">
              What to expect
            </Link>
          </Reveal>
        </div>
      </AnimatedSection>
    </section>
  );
}

export function ReviewNotice({ className = "" }: { className?: string }) {
  return (
    <aside className={`flex gap-3 rounded-2xl border border-line bg-white/70 p-4 text-[13.5px] leading-relaxed text-muted ${className}`}>
      <ShieldAlert size={18} className="mt-0.5 shrink-0 text-burgundy" aria-hidden />
      <p>{reviewNotice}</p>
    </aside>
  );
}
