import LegalPage from "@/components/legal/LegalPage";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({ title: "Terms of Use", description: "Terms governing use of The LUXE Clinique website.", path: "/legal/terms" });

export default function Terms() {
  return (
    <LegalPage
      title="Terms of use"
      path="/legal/terms"
      intro="The terms that apply when you use this website."
      sections={[
        { h: "Use of this website", p: ["This website provides general information about the clinic and about skin, hair and aesthetic topics. By using it you agree to these terms."] },
        { h: "No medical advice", p: ["Content on this website is educational and is not a substitute for professional medical advice, diagnosis or treatment. See the medical disclaimer."] },
        { h: "Enquiries and appointments", p: ["Submitting an enquiry does not create a doctor–patient relationship, confirm an appointment, or confirm suitability for any treatment."] },
        { h: "Educational illustrations", p: ["3D models and illustrations are conceptual, simplified and not to scale. They do not depict real patients, staff, or results."] },
        { h: "Intellectual property", p: ["The clinic's name, logo and site content are owned by or licensed to the clinic and may not be reused without permission."] },
        { h: "Governing law", p: ["These terms are governed by the laws of India. [Clinic's counsel to confirm jurisdiction.]"] },
      ]}
    />
  );
}
