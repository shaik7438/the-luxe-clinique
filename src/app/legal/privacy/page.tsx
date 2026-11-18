import LegalPage from "@/components/legal/LegalPage";
import { site } from "@/content/site";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({ title: "Privacy Notice", description: "How The LUXE Clinique collects, uses and protects personal data submitted through this website.", path: "/legal/privacy" });

export default function Privacy() {
  return (
    <LegalPage
      title="Privacy notice"
      path="/legal/privacy"
      intro="How we handle personal data submitted through this website."
      sections={[
        { h: "Who we are", p: [`${site.name}, ${site.address.line1}, ${site.address.locality}, ${site.address.city} ${site.address.postalCode}. Contact: ${site.email}.`] },
        { h: "What we collect", p: ["When you send an appointment enquiry, we collect your name, phone number, and optionally your email address, area of interest, preferred contact time and message.", "Please do not include detailed medical information in the enquiry form."] },
        { h: "Why we use it", p: ["We use your details only to respond to your enquiry and arrange an appointment. We do not sell your data or use it for unrelated marketing without your separate consent."] },
        { h: "Legal basis and consent", p: ["We process enquiry data on the basis of your consent, given when you submit the form. You may withdraw consent at any time by contacting us. This notice should be reviewed against the Digital Personal Data Protection Act, 2023 and applicable rules."] },
        { h: "Storage and retention", p: ["Enquiry data is stored with the clinic's chosen service provider and kept only as long as necessary for the purpose collected, or as required by law. [Clinic to specify provider, location and retention period.]"] },
        { h: "Your rights", p: ["You may request access to, correction of, or erasure of your personal data, and may raise a grievance with the clinic. [Clinic to name a grievance contact.]"] },
        { h: "Cookies and analytics", p: ["This site does not set advertising cookies. If analytics are added, this notice will be updated and consent obtained where required."] },
      ]}
    />
  );
}
