import type { Metadata } from "next";
import { founderPublished, site, socialLinks } from "@/content/site";
import { categories, publishedTreatments, type Treatment } from "@/content/treatments";

const DEFAULT_OG = "/og/default.jpg";

export function pageMeta({
  title,
  description,
  path,
  image = DEFAULT_OG,
  imageAlt = `${site.name}, Preet Vihar, New Delhi`,
  type = "website",
}: {
  title: string;
  description: string;
  path: string;
  /** 1200×630 social preview image (path under /public). */
  image?: string;
  imageAlt?: string;
  type?: "website" | "article";
}): Metadata {
  const images = [{ url: image, width: 1200, height: 630, alt: imageAlt }];
  // Google truncates titles past ~60 characters; drop the " | brand" suffix when it would push the title over.
  const fitsWithBrand = title.length + ` | ${site.name}`.length <= 60;
  return {
    title: fitsWithBrand ? title : { absolute: title },
    description,
    alternates: { canonical: path },
    openGraph: { title: `${title} | ${site.name}`, description, url: path, siteName: site.name, locale: "en_IN", type, images },
    twitter: { card: "summary_large_image", title: `${title} | ${site.name}`, description, images: [image] },
  };
}

/** Shorten text to at most `max` characters at a word boundary, for meta descriptions. */
export function clip(text: string, max = 155) {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[,;:—–-]\s*$/, "")}…`;
}

const abs = (p: string) => (p.startsWith("http") ? p : `${site.url}${p}`);
const clinicId = `${site.url}/#clinic`;
const founderId = `${site.url}/about/${site.founder.slug}#person`;

/** The founder as a Physician — only emitted once verified credentials are filled in (see site.founder). */
export function physicianJsonLd() {
  const f = site.founder;
  return {
    "@context": "https://schema.org",
    "@type": ["Physician", "Person"],
    "@id": founderId,
    name: f.name,
    url: abs(`/about/${f.slug}`),
    image: abs("/images/about-team.webp"),
    jobTitle: f.role,
    ...(f.qualifications ? { hasCredential: f.qualifications.split(/,\s*/).map((name) => ({ "@type": "EducationalOccupationalCredential", name })) } : {}),
    ...(f.registration ? { identifier: f.registration } : {}),
    ...(f.memberships.length ? { memberOf: f.memberships.map((name) => ({ "@type": "Organization", name })) } : {}),
    medicalSpecialty: "Dermatology",
    worksFor: { "@id": clinicId },
    ...(f.sameAs.length ? { sameAs: f.sameAs } : {}),
  };
}

/** The clinic, matching the Google Business Profile (name, address, phone, hours, map). */
export function clinicJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["MedicalClinic", "MedicalBusiness", "HealthAndBeautyBusiness"],
        "@id": clinicId,
        name: site.name,
        alternateName: "The Luxe Clinique – Aesthetic and Skin Clinic in Preet Vihar, New Delhi",
        description: site.description,
        url: site.url,
        logo: abs("/brand/luxe-clinique-logo.png"),
        image: [abs("/og/default.jpg"), abs("/images/home-clinic-interior.webp"), abs("/images/about-room.webp")],
        email: site.email,
        telephone: site.phones[0].tel,
        priceRange: "₹₹",
        currenciesAccepted: "INR",
        address: {
          "@type": "PostalAddress",
          streetAddress: site.address.line1,
          addressLocality: `${site.address.locality}, ${site.address.city}`,
          postalCode: site.address.postalCode,
          addressRegion: site.address.region,
          addressCountry: site.address.country,
        },
        geo: { "@type": "GeoCoordinates", latitude: site.geo.lat, longitude: site.geo.lng },
        hasMap: site.mapsUrl,
        sameAs: [site.mapsUrl, ...socialLinks.map(([, url]) => url)],
        areaServed: ["Preet Vihar", ...site.nearbyAreas, "East Delhi", "New Delhi"].map((name) => ({ "@type": "Place", name })),
        openingHoursSpecification: site.openingHours.map((h) => ({
          "@type": "OpeningHoursSpecification",
          dayOfWeek: h.days.map((d) => `https://schema.org/${d}`),
          opens: h.opens,
          closes: h.closes,
        })),
        medicalSpecialty: ["Dermatology"],
        availableService: publishedTreatments.map((t) => ({
          "@type": "MedicalProcedure",
          name: t.name,
          url: abs(`/treatments/${t.slug}`),
        })),
        founder: founderPublished ? { "@id": founderId } : { "@type": "Person", name: site.founder.name },
      },
      {
        "@type": "WebSite",
        "@id": `${site.url}/#website`,
        url: site.url,
        name: site.name,
        inLanguage: "en-IN",
        publisher: { "@id": clinicId },
      },
    ],
  };
}

/** BreadcrumbList for a page, e.g. [["Treatments", "/treatments"], ["HydraFacial", "/treatments/hydrafacial"]]. */
export function breadcrumbJsonLd(trail: [name: string, path: string][]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [["Home", "/"] as [string, string], ...trail].map(([name, path], i) => ({
      "@type": "ListItem",
      position: i + 1,
      name,
      item: abs(path),
    })),
  };
}

/** Treatment page: MedicalWebPage about a MedicalProcedure, plus its FAQs and breadcrumbs. */
export function treatmentJsonLd(t: Treatment, image: string | null) {
  const url = abs(`/treatments/${t.slug}`);
  const graph: object[] = [
    {
      "@type": "MedicalWebPage",
      "@id": `${url}#page`,
      url,
      name: `${t.seoName ?? t.name} in Preet Vihar, New Delhi`,
      description: t.summary,
      inLanguage: "en-IN",
      isPartOf: { "@id": `${site.url}/#website` },
      publisher: { "@id": clinicId },
      ...(image ? { primaryImageOfPage: abs(image) } : {}),
      about: {
        "@type": "MedicalProcedure",
        name: t.name,
        ...(t.aka?.length ? { alternateName: t.aka } : {}),
        description: t.summary,
        howPerformed: t.howItWorks.join(" "),
        preparation: t.preparation.join(" "),
        followup: t.aftercare.join(" "),
        ...(t.risks.length ? { adverseOutcome: t.risks.map((r) => ({ "@type": "MedicalEntity", name: r })) } : {}),
      },
      ...(founderPublished && t.review === "approved"
        ? { reviewedBy: { "@id": founderId }, ...(t.reviewedOn ? { lastReviewed: t.reviewedOn } : {}) }
        : {}),
      audience: { "@type": "PeopleAudience", audienceType: "Patients" },
      specialty: categories[t.category].label,
    },
    breadcrumbJsonLd([["Treatments", "/treatments"], [t.name, `/treatments/${t.slug}`]]),
  ];
  if (t.faqs.length) {
    graph.push({
      "@type": "FAQPage",
      "@id": `${url}#faq`,
      mainEntity: t.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    });
  }
  return { "@context": "https://schema.org", "@graph": graph.map((g) => ({ ...g, "@context": undefined })) };
}

export function JsonLd({ data }: { data: object }) {
  return { __html: JSON.stringify(data).replace(/</g, "\\u003c") };
}
