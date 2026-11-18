import { Info } from "lucide-react";
import { slotImage } from "@/lib/images";
import ClinicImage from "@/components/media/ClinicImage";
import { AnimatedSection, Reveal } from "@/components/motion/AnimatedSection";
import ParallaxImage from "@/components/motion/ParallaxImage";
import { ConsultationCTA, PageHero, SectionHeading } from "@/components/ui/blocks";
import { assets } from "@/content/assets";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Clinic Gallery — Preet Vihar, East Delhi",
  description: "Photographs of The LUXE Clinique and illustrative imagery that sets the tone of our space and treatments.",
  path: "/gallery",
});

export default function GalleryPage() {
  // contact-exterior repeats the reception photo; gallery-art and about-hero are page headers
  const clinic = assets
    .filter((a) => a.source === "clinic-photo" && !["contact-exterior", "gallery-art", "about-hero"].includes(a.id) && !!slotImage(a.id))
    // the founder's portrait leads the grid
    .sort((a, b) => Number(b.id === "about-team") - Number(a.id === "about-team"));
  const mood = assets
    .filter((a) => a.source === "illustrative" && a.id !== "gallery-art")
    .map((a) => ({ slot: a, img: slotImage(a.id) }))
    .filter((m): m is { slot: (typeof assets)[number]; img: NonNullable<ReturnType<typeof slotImage>> } => !!m.img);

  return (
    <>
      <PageHero
        image={slotImage("gallery-art")}
        eyebrow="Clinic gallery · Preet Vihar, East Delhi"
        eyebrowInH1
        title="Inside"
        accent="the clinic"
        intro="Genuine clinic photography and clearly labelled illustrative imagery. Patient before-and-after images are not shown here."
        crumbs={[{ href: "/gallery", label: "Gallery" }]}
      >
        <nav aria-label="Gallery sections" className="mt-8 flex flex-wrap gap-2">
          <a href="#clinic" className="btn btn-glass !min-h-10 !py-2 text-sm">Clinic</a>
          <a href="#mood" className="btn btn-glass !min-h-10 !py-2 text-sm">Mood</a>
        </nav>
      </PageHero>

      <section id="clinic" className="container-luxe scroll-mt-28 pb-16" aria-labelledby="clinic-h">
        <SectionHeading id="clinic-h" eyebrow="Clinic photography" title="Spaces and facilities" />
        <AnimatedSection as="ul" className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {clinic.map((a) => (
            <Reveal as="li" key={a.id}>
              <figure className="glass group overflow-hidden">
                <ClinicImage id={a.id} className="aspect-[4/3] w-full" sizes="(min-width:1024px) 33vw, 100vw" />
                <figcaption className="p-4 text-[14px] text-charcoal">{a.alt}</figcaption>
              </figure>
            </Reveal>
          ))}
        </AnimatedSection>
        <p className="mt-6 flex gap-2 text-[13.5px] text-muted">
          <Info size={16} className="mt-0.5 shrink-0 text-burgundy" aria-hidden />
          Genuine photographs of our clinic in Preet Vihar, lightly colour-graded. More rooms and our team will be added soon.
        </p>
      </section>

      {mood.length > 0 && (
        <section id="mood" className="container-luxe scroll-mt-28 pb-16" aria-labelledby="mood-h">
          <SectionHeading id="mood-h" eyebrow="Mood & inspiration" title="The feeling of *LUXE*" intro="Illustrative imagery that sets the tone of our space and treatments. These are not clients or results." />
          <div className="mt-10 columns-1 gap-5 sm:columns-2 lg:columns-3 [&>*]:mb-5">
            {mood.map(({ slot, img }, i) => (
              <figure key={slot.id} className="break-inside-avoid">
                <ParallaxImage
                  src={img.src}
                  alt={img.alt}
                  amount={6}
                  illustrative
                  sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                  className={`w-full rounded-[26px] ${["aspect-[4/5]", "aspect-square", "aspect-[3/4]"][i % 3]} ${i % 4 === 1 ? "rounded-t-full" : ""}`}
                />
                <figcaption className="mt-2 px-1 text-[13px] text-muted">{slot.location.split("·").pop()?.trim()}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      <ConsultationCTA />
    </>
  );
}
