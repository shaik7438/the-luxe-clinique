import Image from "next/image";
import Link from "next/link";
import { slotImage } from "@/lib/images";
import { ArrowRight, Box } from "lucide-react";
import { InteractiveSkinModel } from "@/components/education/named-modules";
import ModuleVideo from "@/components/education/ModuleVideo";
import { moduleVideos, realModuleVideos } from "@/components/education/module-videos";
import SkinIllustration from "@/components/education/SkinIllustration";
import { AnimatedSection, Reveal } from "@/components/motion/AnimatedSection";
import { ConsultationCTA, PageHero, SectionHeading } from "@/components/ui/blocks";
import { articles } from "@/content/articles";
import { modules } from "@/content/education";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "The Journal — Beauty & Treatment Guides",
  description: "Balanced educational guides and interactive 3D models explaining skin anatomy, laser hair reduction, pigmentation, acne, collagen and hair growth.",
  path: "/learn",
});

/** Real treatment clips (in /public/videos) for guides without a 3D module. */
const clips: Record<string, { id: string; label: string }> = {
  "understanding-chin-and-profile": { id: "chin-profile", label: "Video: a practitioner maps the cheek and jawline during a facial profile assessment" },
  "questions-to-ask-at-a-consultation": { id: "consultation", label: "Video: a practitioner talks a client through her skin during a consultation" },
};

/** Cover images for guides without a 3D module. */
const covers: Record<string, { src: string; alt: string }> = {
};

export default function LearnPage() {
  return (
    <>
      <PageHero
        image={slotImage("cat-pigmentation")}
        eyebrow="Skin & treatment guides"
        eyebrowInH1
        title="Beauty,"
        accent="explained"
        intro="Honest guides to popular treatments and interactive 3D models of your skin — including what to expect, limitations and risks. Always followed by a personal consultation."
        crumbs={[{ href: "/learn", label: "Journal" }]}
      />

      <section className="container-luxe pb-16" aria-label="Skin anatomy explorer">
        <InteractiveSkinModel />
      </section>

      <section className="section !pt-4 container-luxe" aria-labelledby="guides-title">
        <SectionHeading id="guides-title" eyebrow="Guides" title="Guides & *stories*" />
        <AnimatedSection as="ul" className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((a) => (
            <Reveal as="li" key={a.slug}>
              <Link href={`/learn/${a.slug}`} className="glass glass-sheen group flex h-full flex-col overflow-hidden transition-transform duration-500 hover:-translate-y-1">
                <div className="relative aspect-[16/9] overflow-hidden bg-gradient-to-b from-[#FBF6F4] to-[#F1E6E3]">
                  {a.module && moduleVideos.has(a.module) ? (
                    <ModuleVideo id={a.module} label={`${realModuleVideos.has(a.module) ? "Video" : "3D animation"}: ${modules[a.module].title}`} className="transition-transform duration-[1.2s] group-hover:scale-105" />
                  ) : a.module ? (
                    <SkinIllustration state={modules[a.module].steps[Math.min(1, modules[a.module].steps.length - 1)].state} title="" className="h-full w-full scale-[1.06] transition-transform duration-[1.2s] group-hover:scale-110" />
                  ) : clips[a.slug] ? (
                    <ModuleVideo id={clips[a.slug].id} label={clips[a.slug].label} className="transition-transform duration-[1.2s] group-hover:scale-105" />
                  ) : covers[a.slug] ? (
                    <Image src={covers[a.slug].src} alt={covers[a.slug].alt} fill sizes="(min-width:1024px) 33vw, (min-width:768px) 50vw, 100vw" className="object-cover transition-transform duration-[1.2s] group-hover:scale-105" />
                  ) : (
                    <div className="grid h-full place-items-center font-display text-5xl text-burgundy/30">?</div>
                  )}
                  {(a.module || clips[a.slug]) && (
                    <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-burgundy/90 px-2.5 py-1 text-[11px] font-semibold text-white">
                      {a.module && !realModuleVideos.has(a.module) ? <><Box size={12} aria-hidden /> 3D video</> : <>Video</>}
                    </span>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-display text-[1.3rem] leading-snug text-charcoal">{a.title}</h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-muted">{a.description}</p>
                  <span className="mt-auto flex items-center gap-1.5 pt-5 text-[13.5px] font-semibold text-burgundy">
                    Read guide <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" aria-hidden />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </AnimatedSection>
      </section>

      <section className="section !pt-0 container-luxe" aria-labelledby="modules-title">
        <SectionHeading id="modules-title" eyebrow="3D guides" title="Explore your skin in *3D*" intro="Each module is also embedded in the related treatment pages." />
        <ul className="mt-8 flex flex-wrap gap-2">
          {Object.values(modules).map((m) => (
            <li key={m.id}>
              <Link href={`/learn/models/${m.id}`} className="glass flex items-center gap-2 !rounded-full px-4 py-2.5 text-[14px] font-medium text-charcoal hover:text-burgundy">
                <Box size={15} className="text-burgundy" aria-hidden /> {m.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <ConsultationCTA />
    </>
  );
}
