/**
 * Verified-from-source facts only. Every value here comes from the supplied
 * content sheet (Luxe_Clinique_Website_Content_One_Sheet.xlsx). Items marked
 * `verify` are flagged in docs/APPROVALS.md and must be confirmed by the
 * clinic before launch.
 */
export const site = {
  name: "The LUXE Clinique",
  shortName: "Luxe Clinique",
  tagline: "Skin · Hair · Laser · Wellness",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.luxeclinique.com",
  description:
    "The LUXE Clinique, Preet Vihar, New Delhi — beauty and aesthetic treatments for skin, hair and laser care, each beginning with a personal consultation.",
  // Matches the Google Business Profile exactly (name/address/phone consistency helps local SEO).
  address: {
    line1: "103, New Rajdhani Enclave, Swasthya Vihar",
    locality: "Preet Vihar",
    city: "New Delhi",
    postalCode: "110092",
    region: "Delhi",
    country: "IN",
  },
  // Primary number matches the Google Business Profile; the second appears in the source sheet — VERIFY.
  phones: [
    { display: "+91 89202 19690", tel: "+918920219690", verify: false },
    { display: "+91 88828 33050", tel: "+918882833050", verify: true },
  ],
  whatsapp: "918920219690", // assumed same as primary — VERIFY
  email: "luxecliniqueaesthetics@gmail.com",
  directions:
    "Near Preet Vihar Metro Station (Gate No. 3). Nearby areas include Laxmi Nagar, Nirman Vihar, IP Extension, Karkardooma and Anand Vihar. Please check the route on Google Maps and call ahead about parking.",
  /** East Delhi neighbourhoods patients commonly visit from (local SEO: page copy, FAQ and schema areaServed). */
  nearbyAreas: ["Laxmi Nagar", "Nirman Vihar", "IP Extension", "Karkardooma", "Anand Vihar", "Krishna Nagar", "Mayur Vihar"],
  // Google Business Profile listing (cid) — used for "Open in Maps" links and schema sameAs/hasMap.
  mapsUrl: "https://maps.google.com/?cid=11787507899364514169",
  geo: { lat: 28.6424224, lng: 77.2928648 },
  plusCode: "J7RV+X4 New Delhi, Delhi",
  /** Opening hours as shown on the Google Business Profile (Nov 2026). Monday's regular hours to be confirmed. */
  hours: "Tue–Sat 10 am – 8 pm · Sun 10 am – 4 pm" as null | string,
  openingHours: [
    { days: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], opens: "10:00", closes: "20:00" },
    { days: ["Sunday"], opens: "10:00", closes: "16:00" },
  ],
  /** Days the clinic is closed, shown as "Monday: closed". Add "Monday" once the clinic confirms it. */
  closedDays: [] as string[],
  /** Official social profiles. Fill in full URLs; they appear in the footer and in schema sameAs (helps Google connect the brand). */
  social: {
    instagram: null as string | null,
    facebook: null as string | null,
    youtube: null as string | null,
    practo: null as string | null,
    justdial: null as string | null,
  },
  /**
   * Founder / medical reviewer. The profile page /about/dr-ritika-dhingra and every "Medically reviewed by" line
   * stay hidden until `qualifications` AND `registration` are filled in with verified details (see docs/APPROVALS.md §4).
   */
  founder: {
    name: "Dr. Ritika Dhingra",
    slug: "dr-ritika-dhingra",
    role: "Founder",
    qualifications: null as string | null, // e.g. "MBBS, MD (Dermatology)"
    registration: null as string | null, // e.g. "Delhi Medical Council Reg. No. 12345"
    experience: null as string | null, // e.g. "12 years in clinical dermatology and aesthetics"
    memberships: [] as string[], // e.g. ["Indian Association of Dermatologists, Venereologists and Leprologists (IADVL)"]
    sameAs: [] as string[], // e.g. LinkedIn, Practo profile URLs
  },
  products: ["ZO Skin Health", "Obagi", "Heliocare"],
  heroModelUrl: process.env.NEXT_PUBLIC_HERO_GLB || "",
};

/** True once the founder's credentials are filled in — unlocks the profile page and reviewer lines. */
export const founderPublished = Boolean(site.founder.qualifications && site.founder.registration);

/** Opening hours line including any confirmed closed days, e.g. "Tue–Sat 10 am – 8 pm · Sun 10 am – 4 pm · Monday: closed". */
export const hoursText = site.hours ? [site.hours, ...site.closedDays.map((d) => `${d}: closed`)].join(" · ") : null;

const socialLabels: Record<string, string> = { instagram: "Instagram", facebook: "Facebook", youtube: "YouTube", practo: "Practo", justdial: "Justdial" };
export const socialLabel = (k: string) => socialLabels[k] ?? k;

export const socialLinks = Object.entries(site.social).filter((e): e is [string, string] => !!e[1]);

export const nav = [
  { href: "/treatments", label: "Treatments" },
  { href: "/learn", label: "Journal" },
  { href: "/patient-information", label: "Patient Information" },
  { href: "/about", label: "About" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
] as const;

export const reviewNotice =
  "Educational information only. It does not replace a consultation, diagnosis or individual medical advice. Suitability, risks and expected results vary between individuals and are discussed with a qualified clinician.";
