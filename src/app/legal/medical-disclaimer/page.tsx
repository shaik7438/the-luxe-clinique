import LegalPage from "@/components/legal/LegalPage";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({ title: "Medical Disclaimer", description: "Important information about the educational nature of content on The LUXE Clinique website.", path: "/legal/medical-disclaimer" });

export default function Disclaimer() {
  return (
    <LegalPage
      title="Medical disclaimer"
      path="/legal/medical-disclaimer"
      intro="Please read this before relying on any information on this website."
      sections={[
        { h: "Educational information only", p: ["The information on this website is general and educational. It does not replace a consultation, diagnosis or individual medical advice."] },
        { h: "Individual results vary", p: ["No treatment can guarantee a particular result. Benefits, risks, recovery and the number of sessions vary between individuals. Suitability can only be determined after a clinical assessment."] },
        { h: "Risks", p: ["All medical and aesthetic procedures carry risks. Treatment pages summarise common and important risks but are not exhaustive. Your clinician will discuss risks relevant to you before you consent."] },
        { h: "Illustrations and 3D models", p: ["Interactive models and illustrations are conceptual educational artwork, simplified and not to scale. They are not diagnostic tools and do not represent any person's anatomy or outcome."] },
        { h: "Emergencies", p: ["If you experience a medical emergency, call 112 or attend the nearest emergency department. Do not use this website or its forms to seek urgent help."] },
        { h: "Clinical review", p: ["Content is subject to review by a qualified medical professional. Pages are dated and updated as guidance changes."] },
      ]}
    />
  );
}
