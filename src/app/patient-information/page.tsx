import Link from "next/link";
import { slotImage } from "@/lib/images";
import { AlertCircle, CheckCircle2, FileText, HelpCircle } from "lucide-react";
import ConsultationProcess from "@/components/home/ConsultationProcess";
import ClinicImage from "@/components/media/ClinicImage";
import { AnimatedSection, MaskReveal, Reveal } from "@/components/motion/AnimatedSection";
import { ConsultationCTA, PageHero, ReviewNotice, SectionHeading } from "@/components/ui/blocks";
import { articles } from "@/content/articles";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Patient Information & Consultation Guide",
  description: "What to expect at a consultation at The LUXE Clinique, questions to ask, how to prepare, and the risks and limitations to consider before any treatment.",
  path: "/patient-information",
});

const questions = articles.find((a) => a.slug === "questions-to-ask-at-a-consultation")!;

export default function PatientInformationPage() {
  return (
    <>
      <PageHero
        image={slotImage("patient-info")}
        eyebrow="Patient information & consultation guide"
        eyebrowInH1
        title="Your journey,"
        accent="step by step"
        intro="Clear information about the consultation process, preparation, and the risks and limitations of treatment — so you can decide what's right for you."
        crumbs={[{ href: "/patient-information", label: "Patient information" }]}
      />

      <section className="container-luxe pb-10" aria-labelledby="process">
        <SectionHeading id="process" eyebrow="Consultation process" title="What happens at your *consultation*" />
        <ConsultationProcess />
      </section>

      <section className="section container-luxe" aria-labelledby="ask">
        <div className="grid items-start gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading id="ask" eyebrow="Questions to ask" title="Questions worth *asking*" intro="It's reasonable to ask about anything that matters to you. These are a good starting point." />
            <MaskReveal className="mt-8 hidden lg:block">
              <ClinicImage id="patient-info" className="aspect-[4/3] w-full rounded-[28px]" />
            </MaskReveal>
          </div>
          <AnimatedSection as="div" className="grid gap-4 lg:col-span-7">
            {questions.sections
              .filter((s) => s.list)
              .map((s) => (
                <Reveal key={s.heading} className="glass p-6">
                  <h3 className="flex items-center gap-2 font-semibold text-charcoal">
                    <HelpCircle size={18} className="text-burgundy" aria-hidden /> {s.heading}
                  </h3>
                  <ul className="prose-luxe mt-2">
                    {s.list!.map((q) => (
                      <li key={q}>{q}</li>
                    ))}
                  </ul>
                </Reveal>
              ))}
          </AnimatedSection>
        </div>
      </section>

      <section className="section !pt-0 container-luxe" aria-labelledby="informed">
        <div className="grid gap-6 lg:grid-cols-3">
          <InfoCard id="informed" icon={CheckCircle2} title="Informed decision-making">
            <li>You should understand what a treatment involves, its expected benefits and its limitations.</li>
            <li>Alternatives — including no treatment — should be discussed.</li>
            <li>You can take written information home and decide later. There is no obligation to proceed.</li>
            <li>Consent can be withdrawn at any time before treatment.</li>
          </InfoCard>
          <InfoCard icon={FileText} title="General preparation">
            <li>Bring a list of medicines, supplements and allergies.</li>
            <li>Mention pregnancy, breastfeeding, or plans to conceive.</li>
            <li>Note previous skin, laser or injectable treatments, and any reactions.</li>
            <li>Bring the skincare products you currently use, or photos of their labels.</li>
            <li>Follow any treatment-specific instructions you are given.</li>
          </InfoCard>
          <InfoCard icon={AlertCircle} title="Risks and limitations">
            <li>Every procedure carries risks, which vary by treatment and by person.</li>
            <li>Results are never guaranteed, and many effects are gradual or temporary.</li>
            <li>Some people are not suitable for a treatment, and may be advised against it.</li>
            <li>Seek prompt advice for unexpected pain, skin colour change, fever or changes in vision after treatment.</li>
          </InfoCard>
        </div>
        <ReviewNotice className="mt-10" />
        <p className="mt-6 text-[14px] text-muted">
          Read more: <Link href="/learn/questions-to-ask-at-a-consultation" className="font-semibold text-burgundy hover:underline">Questions to ask at an aesthetic consultation</Link> ·{" "}
          <Link href="/legal/medical-disclaimer" className="font-semibold text-burgundy hover:underline">Medical disclaimer</Link>
        </p>
      </section>

      <ConsultationCTA />
    </>
  );
}

function InfoCard({ id, icon: Icon, title, children }: { id?: string; icon: typeof CheckCircle2; title: string; children: React.ReactNode }) {
  return (
    <AnimatedSection as="div" className="glass glass-sheen p-6">
      <Reveal>
        <Icon size={22} className="text-burgundy" aria-hidden />
        <h2 id={id} className="font-display mt-3 text-[1.45rem] text-charcoal">{title}</h2>
      </Reveal>
      <Reveal>
        <ul className="prose-luxe mt-2 text-[15px]">{children}</ul>
      </Reveal>
    </AnimatedSection>
  );
}
