import { Suspense } from "react";
import { slotImage } from "@/lib/images";
import { Clock, Mail, MapPin, MessageCircle, Navigation, Phone } from "lucide-react";
import AppointmentForm from "@/components/forms/AppointmentForm";
import MapEmbed from "@/components/media/MapEmbed";
import { PageHero } from "@/components/ui/blocks";
import Link from "next/link";
import { hoursText, site } from "@/content/site";
import { publishedTreatments } from "@/content/treatments";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Book a Consultation in Preet Vihar, East Delhi",
  description: "Contact The LUXE Clinique at 103, New Rajdhani Enclave, Preet Vihar, East Delhi 110092 — phone, email, directions and an appointment enquiry form.",
  path: "/contact",
});

export default function ContactPage() {
  const options = [...publishedTreatments].sort((a, b) => a.name.localeCompare(b.name)).map((t) => ({ value: t.slug, label: t.name }));
  return (
    <>
      <PageHero
        image={slotImage("home-editorial")}
        eyebrow="Book a consultation · Preet Vihar, East Delhi"
        eyebrowInH1
        title="Book your"
        accent="consultation"
        intro="Send an appointment enquiry, call, or message the clinic. Your consultation is the place to discuss your concerns and options."
        crumbs={[{ href: "/contact", label: "Contact" }]}
      />
      <section className="container-luxe pb-20">
        <div className="grid gap-10 lg:grid-cols-12">
          <div id="enquiry" className="scroll-mt-28 lg:col-span-7">
            <h2 className="font-display text-[1.9rem]">Appointment enquiry</h2>
            <p className="mt-2 text-[15px] text-muted">The clinic will contact you to arrange a suitable time.</p>
            <p className="mt-2 text-[14px] text-muted">
              Before your visit, see{" "}
              <Link href="/patient-information" className="font-semibold text-burgundy hover:underline">what to expect at your consultation</Link> and{" "}
              <Link href="/learn/questions-to-ask-at-a-consultation" className="font-semibold text-burgundy hover:underline">questions worth asking</Link>.
            </p>
            <div className="mt-6">
              <Suspense fallback={<div className="glass h-96 animate-pulse" />}>
                <AppointmentForm treatmentOptions={options} />
              </Suspense>
            </div>
          </div>

          <aside className="space-y-5 lg:col-span-5" aria-label="Clinic contact details">
            <div className="glass glass-sheen p-6">
              <h2 className="font-display text-[1.5rem]">The LUXE Clinique</h2>
              <ul className="mt-5 space-y-4 text-[15px]">
                <li className="flex gap-3">
                  <MapPin size={20} className="mt-0.5 shrink-0 text-burgundy" aria-hidden />
                  <address className="not-italic">
                    {site.address.line1}
                    <br />
                    {site.address.locality}, {site.address.city} {site.address.postalCode}
                  </address>
                </li>
                {site.phones.map((p) => (
                  <li key={p.tel} className="flex gap-3">
                    <Phone size={20} className="mt-0.5 shrink-0 text-burgundy" aria-hidden />
                    <a href={`tel:${p.tel}`} className="font-medium hover:text-burgundy">{p.display}</a>
                  </li>
                ))}
                <li className="flex gap-3">
                  <Mail size={20} className="mt-0.5 shrink-0 text-burgundy" aria-hidden />
                  <a href={`mailto:${site.email}`} className="break-all font-medium hover:text-burgundy">{site.email}</a>
                </li>
                <li className="flex gap-3">
                  <Clock size={20} className="mt-0.5 shrink-0 text-burgundy" aria-hidden />
                  <span className="text-muted">{hoursText ?? "Please call to confirm opening hours."}</span>
                </li>
              </ul>
              <div className="mt-6 grid gap-2 sm:grid-cols-2">
                <a href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noopener noreferrer" className="btn btn-glass">
                  <MessageCircle size={16} aria-hidden /> WhatsApp
                </a>
                <a href={site.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-glass">
                  <Navigation size={16} aria-hidden /> Open in Maps
                </a>
              </div>
            </div>
            <div className="glass overflow-hidden">
              <MapEmbed className="aspect-[3/2] w-full !rounded-none !border-0 !shadow-none" />
              <div className="p-6">
                <h3 className="font-semibold">Getting here</h3>
                <p className="mt-2 text-[14.5px] leading-relaxed text-muted">{site.directions}</p>
                <h3 className="mt-5 font-semibold">Patients visit us from</h3>
                <ul className="mt-2 flex flex-wrap gap-1.5">
                  {["Preet Vihar", ...site.nearbyAreas].map((a) => (
                    <li key={a} className="rounded-full border border-line bg-white/70 px-2.5 py-1 text-[12.5px] text-charcoal">{a}</li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
