import Image from "next/image";
import Link from "next/link";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { hoursText, reviewNotice, site, socialLabel, socialLinks } from "@/content/site";
import { categories, type CategoryId } from "@/content/treatments";

export default function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative mt-10 border-t border-line bg-gradient-to-b from-ivory to-ivory-deep">
      <div className="container-luxe grid gap-10 py-14 md:grid-cols-12">
        <div className="md:col-span-4">
          <Image src="/brand/luxe-clinique-logo.png" alt={site.name} width={720} height={265} className="logo-blend h-14 w-auto" />
          <p className="mt-4 max-w-sm text-[14px] leading-relaxed text-muted">
            Beauty and aesthetic care for skin, hair and body in Preet Vihar, New Delhi — always beginning with a personal consultation.
          </p>
          <ul className="mt-6 space-y-3 text-[14px]">
            <li className="flex gap-3">
              <MapPin size={18} className="mt-0.5 shrink-0 text-burgundy" aria-hidden />
              <address className="not-italic">
                {site.address.line1}, {site.address.locality}, {site.address.city} {site.address.postalCode}
              </address>
            </li>
            {site.phones.map((p) => (
              <li key={p.tel} className="flex gap-3">
                <Phone size={18} className="mt-0.5 shrink-0 text-burgundy" aria-hidden />
                <a href={`tel:${p.tel}`} className="hover:text-burgundy">
                  {p.display}
                </a>
              </li>
            ))}
            <li className="flex gap-3">
              <MessageCircle size={18} className="mt-0.5 shrink-0 text-burgundy" aria-hidden />
              <a href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noopener noreferrer" className="hover:text-burgundy">
                Message us on WhatsApp
              </a>
            </li>
            {hoursText && (
              <li className="flex gap-3">
                <Clock size={18} className="mt-0.5 shrink-0 text-burgundy" aria-hidden />
                <span>{hoursText}</span>
              </li>
            )}
            <li className="flex gap-3">
              <Mail size={18} className="mt-0.5 shrink-0 text-burgundy" aria-hidden />
              <a href={`mailto:${site.email}`} className="break-all hover:text-burgundy">
                {site.email}
              </a>
            </li>
          </ul>
          {socialLinks.length > 0 && (
            <ul className="mt-5 flex flex-wrap gap-2 text-[13px]" aria-label="Follow the clinic">
              {socialLinks.map(([k, url]) => (
                <li key={k}>
                  <a href={url} target="_blank" rel="noopener noreferrer me" className="rounded-full border border-line bg-white/70 px-3 py-1.5 hover:border-rose hover:text-burgundy">
                    {socialLabel(k)}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <nav aria-label="Treatments" className="md:col-span-3">
          <p className="eyebrow">Treatments</p>
          <ul className="mt-4 space-y-2 text-[14px]">
            {(Object.keys(categories) as CategoryId[]).map((c) => (
              <li key={c}>
                <Link href={`/treatments?category=${c}`} className="text-charcoal hover:text-burgundy">
                  {categories[c].label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Clinic" className="md:col-span-2">
          <p className="eyebrow">Clinic</p>
          <ul className="mt-4 space-y-2 text-[14px]">
            {[
              ["/about", "About"],
              ["/patient-information", "Patient information"],
              ["/learn", "Journal"],
              ["/gallery", "Gallery"],
              ["/contact", "Contact"],
            ].map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="text-charcoal hover:text-burgundy">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Legal" className="md:col-span-3">
          <p className="eyebrow">Legal</p>
          <ul className="mt-4 space-y-2 text-[14px]">
            <li><Link href="/legal/privacy" className="hover:text-burgundy">Privacy notice</Link></li>
            <li><Link href="/legal/terms" className="hover:text-burgundy">Terms of use</Link></li>
            <li><Link href="/legal/medical-disclaimer" className="hover:text-burgundy">Medical disclaimer</Link></li>
          </ul>
          <p className="mt-6 text-[12.5px] leading-relaxed text-muted">
            For a medical emergency, call <a href="tel:112" className="font-semibold text-charcoal underline">112</a> or go to the nearest emergency department. Do not use this website or its forms for urgent concerns.
          </p>
        </nav>
      </div>
      <div className="border-t border-line">
        <div className="container-luxe flex flex-col gap-3 py-6 text-[12.5px] text-muted md:flex-row md:items-center md:justify-between">
          <p>© {year} {site.name}. All rights reserved.</p>
          <p className="max-w-2xl md:text-right">{reviewNotice}</p>
        </div>
      </div>
    </footer>
  );
}
