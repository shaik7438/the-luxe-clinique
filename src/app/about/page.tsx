import Link from "next/link";
import { slotImage } from "@/lib/images";
import { Flower2, MapPin, Sparkles, HeartHandshake } from "lucide-react";
import ClinicImage from "@/components/media/ClinicImage";
import MapEmbed from "@/components/media/MapEmbed";
import { AnimatedSection, MaskReveal, Reveal } from "@/components/motion/AnimatedSection";
import { ConsultationCTA, PageHero, SectionHeading } from "@/components/ui/blocks";
import { founderPublished, site } from "@/content/site";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "About Our Skin Clinic in Preet Vihar, East Delhi",
  description: "About The LUXE Clinique in Preet Vihar, New Delhi: our consultation-first approach, patient education, services and location.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <PageHero
        image={slotImage("about-hero")}
        eyebrow="About our skin clinic · Preet Vihar, East Delhi"
        eyebrowInH1
        title="Our story,"
        accent="and our care"
        intro="The LUXE Clinique is a beauty and aesthetics destination in Preet Vihar, New Delhi — a calm, welcoming space for skin, hair and laser care, where every plan begins with listening."
        crumbs={[{ href: "/about", label: "About" }]}
      />

      <section className="container-luxe pb-16" aria-labelledby="team">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          <div className="order-2 lg:order-1 lg:col-span-7">
            <SectionHeading id="team" eyebrow="Clinicians" title="The people behind *LUXE*" />
            <div className="glass mt-8 p-6 sm:p-8">
              <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-rose-ink">Founder</p>
              <h3 className="font-display mt-2 text-[1.9rem] leading-tight text-charcoal">
                {founderPublished ? <Link href={`/about/${site.founder.slug}`} className="hover:text-burgundy">{site.founder.name}</Link> : site.founder.name}
              </h3>
              {founderPublished && <p className="mt-1 text-[14.5px] text-charcoal">{site.founder.qualifications} · {site.founder.registration}</p>}
              <p className="mt-4 text-[15.5px] leading-relaxed text-muted">
                The LUXE Clinique was founded by Dr. Ritika Dhingra with a simple belief: good aesthetic care starts with listening. Every consultation is unhurried — your concerns, your skin and your expectations come first, and every option is explained honestly, including its limitations, risks and aftercare.
              </p>
              <p className="mt-3 text-[15.5px] leading-relaxed text-muted">
                Treatment plans are personal, never one-size-fits-all, with a natural, subtle approach that respects your features.
              </p>
              <ul className="mt-6 grid gap-3 sm:grid-cols-3">
                {["Consultation first", "Honest, balanced advice", "A natural, subtle approach"].map((v) => (
                  <li key={v} className="rounded-2xl border border-burgundy/15 bg-white/60 px-4 py-3 text-[14px] font-medium text-charcoal">
                    {v}
                  </li>
                ))}
              </ul>
              {founderPublished ? (
                <Link href={`/about/${site.founder.slug}`} className="mt-6 inline-block text-[14px] font-semibold text-burgundy hover:underline">
                  Read {site.founder.name}&rsquo;s full profile
                </Link>
              ) : (
                <p className="mt-6 text-[13.5px] leading-relaxed text-muted">
                  Qualifications and medical council registration details are shared on request and at your consultation.
                </p>
              )}
            </div>
          </div>
          <MaskReveal className="order-1 lg:order-2 lg:col-span-5">
            <ClinicImage id="about-team" className="aspect-square w-full rounded-[28px]" />
          </MaskReveal>
        </div>
      </section>

      <section className="container-luxe pb-10" aria-labelledby="approach">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          <MaskReveal className="lg:col-span-5">
            <ClinicImage id="about-room" className="aspect-[4/5] w-full rounded-[28px]" priority />
          </MaskReveal>
          <div className="lg:col-span-7">
            <SectionHeading
              id="approach"
              eyebrow="Our approach"
              title="Listen first, then *tailor*"
              intro="A clinician assesses each person's concerns and discusses suitable options, benefits, risks, alternatives and aftercare. Treatment plans are personalised to individual skin needs, with emphasis on evidence-based care, comfort and safety."
            />
            <AnimatedSection as="ul" className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                { icon: Flower2, t: "Personal consultation", b: "Every plan starts with understanding your skin, goals and history." },
                { icon: Sparkles, t: "Clear, honest advice", b: "Plain-language explanations — what to expect, and what not to." },
                { icon: HeartHandshake, t: "Care that continues", b: "Aftercare guidance and follow-up, always within reach." },
              ].map(({ icon: Icon, t, b }) => (
                <Reveal as="li" key={t} className="glass p-5">
                  <Icon size={20} className="text-burgundy" aria-hidden />
                  <h3 className="mt-3 font-semibold">{t}</h3>
                  <p className="mt-1 text-[14px] leading-relaxed text-muted">{b}</p>
                </Reveal>
              ))}
            </AnimatedSection>
          </div>
        </div>
      </section>

      <section className="section !pt-0 container-luxe" aria-labelledby="where">
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <p className="eyebrow">Location</p>
            <h2 id="where" className="display-xl mt-4 text-[2.4rem]">Visit us in <span className="accent">Preet Vihar</span></h2>
            <p className="mt-4 flex gap-2 text-[15.5px] text-charcoal">
              <MapPin size={18} className="mt-1 shrink-0 text-burgundy" aria-hidden />
              {site.address.line1}, {site.address.locality}, {site.address.city} {site.address.postalCode}
            </p>
            <p className="mt-3 text-[15px] leading-relaxed text-muted">{site.directions}</p>
            <Link href="/contact" className="btn btn-glass mt-6">Contact & directions</Link>
          </div>
          <MapEmbed className="aspect-[3/2] w-full" />
        </div>
      </section>

      <ConsultationCTA />
    </>
  );
}
