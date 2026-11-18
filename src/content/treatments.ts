/**
 * Treatment content.
 *
 * Source: the treatment menu in the supplied content sheet, rewritten in the
 * neutral, educational register recommended by the clinic's NMC compliance
 * screening sheet. Every entry has `review: "pending"` — no page should be
 * treated as clinically approved until a qualified clinician signs it off
 * (see docs/APPROVALS.md). Items the screening sheet flagged for high-priority
 * scope review are kept here with `published: false` so they never render
 * until the clinic confirms them.
 */

export type CategoryId =
  | "laser"
  | "injectables"
  | "skin"
  | "pigmentation"
  | "hair"
  | "dermatology"
  | "procedures";

export type ConcernId =
  | "unwanted-hair"
  | "pigmentation"
  | "acne"
  | "scarring"
  | "lines"
  | "volume"
  | "texture"
  | "dullness"
  | "hair-thinning"
  | "sweating"
  | "skin-conditions"
  | "skin-lesions"
  | "under-eye";

export type ModuleId = "skin" | "laser" | "pigment" | "acne" | "collagen" | "hair";

export interface FAQ {
  q: string;
  a: string;
}

export interface Treatment {
  slug: string;
  name: string;
  category: CategoryId;
  concerns: ConcernId[];
  summary: string;
  overview: string[];
  intendedFor: string[];
  howItWorks: string[];
  suitability: string[];
  preparation: string[];
  risks: string[];
  recovery: string;
  aftercare: string[];
  sessions?: string;
  faqs: FAQ[];
  module?: ModuleId;
  published: boolean;
  review: "pending" | "approved";
  /** Date (YYYY-MM-DD) the clinician signed the page off. Shown with "Medically reviewed by" once review is "approved". */
  reviewedOn?: string;
  /** The term most patients search for, used in the page <title> and meta description when it differs from `name`. */
  seoName?: string;
  /** Other names patients use, shown under the heading ("Also known as …") so the page matches those searches. */
  aka?: string[];
  /** Optional starting price in INR, shown as "From ₹…" once the clinic approves publishing prices. */
  price?: { from: number; per?: string; note?: string };
  reviewNote?: string;
}

export const categories: Record<CategoryId, { label: string; blurb: string }> = {
  laser: {
    label: "Laser & Light",
    blurb: "Laser hair reduction, toning, resurfacing and lifting technologies, tailored to your skin type.",
  },
  injectables: {
    label: "Injectables & Contouring",
    blurb: "Lips, lines, contours and skin boosters — planned around your features with a qualified injector.",
  },
  skin: {
    label: "Facials & Glow",
    blurb: "Hydra facials, peels and collagen treatments for fresh, well-cared-for skin.",
  },
  pigmentation: {
    label: "Tone & Pigmentation",
    blurb: "Thoughtful plans for uneven tone, chosen after a close look at your skin.",
  },
  hair: {
    label: "Hair & Scalp",
    blurb: "Care for thinning hair and scalp concerns, beginning with understanding the cause.",
  },
  dermatology: {
    label: "Skin Health",
    blurb: "Support for acne, eczema, rosacea and other skin conditions, guided by a clinician.",
  },
  procedures: {
    label: "Finishing Touches",
    blurb: "Permanent makeup, mole and wart care, and other minor procedures — each assessed first.",
  },
};

export const concernLabels: Record<ConcernId, string> = {
  "unwanted-hair": "Unwanted hair",
  pigmentation: "Pigmentation & uneven tone",
  acne: "Acne",
  scarring: "Scars & texture",
  lines: "Lines & wrinkles",
  volume: "Volume & contour",
  texture: "Skin texture & laxity",
  dullness: "Dull or dehydrated skin",
  "hair-thinning": "Hair thinning",
  sweating: "Excessive sweating",
  "skin-conditions": "Skin conditions",
  "skin-lesions": "Moles, warts & lesions",
  "under-eye": "Under-eye concerns",
};

/* ───────── Shared guidance, merged into each page by category ───────── */

const PREP = {
  laser: [
    "Avoid sun exposure, tanning and self-tan for the period your clinician advises before treatment.",
    "Tell the clinic about all medicines, supplements, recent skin treatments and any history of cold sores, keloids or photosensitivity.",
    "Arrive with clean skin, free of make-up, creams and deodorant in the treatment area.",
  ],
  injectables: [
    "Share your full medical history, medicines (including blood thinners and supplements), allergies and previous injectable treatments.",
    "Injectable treatments are generally not offered during pregnancy or breastfeeding.",
    "Avoid scheduling just before an important event, as bruising or swelling can occur.",
  ],
  skin: [
    "Tell the clinic about prescription skincare (for example retinoids), recent peels, laser treatments or waxing.",
    "Your clinician may ask you to pause some active skincare products for a few days beforehand.",
  ],
  medical: [
    "Bring a list of current and past treatments, medicines and any reports or prescriptions you have.",
    "Note when symptoms started, what makes them better or worse, and any family history.",
  ],
  procedure: [
    "Share your medical history, medicines and any tendency to bleed, scar or form keloids.",
    "Every lesion should be examined first; some need assessment or referral before any removal is considered.",
  ],
};

const AFTER = {
  laser: [
    "Use broad-spectrum sunscreen daily and avoid direct sun exposure while the skin recovers.",
    "Avoid hot showers, saunas, swimming and intense exercise for the period advised.",
    "Use only the gentle products your clinician recommends until the skin settles.",
    "Contact the clinic if you notice blistering, crusting, pain or changes in skin colour.",
  ],
  injectables: [
    "Avoid touching, rubbing or massaging the treated area unless instructed.",
    "Avoid strenuous exercise, alcohol and heat exposure for the period advised.",
    "Seek urgent advice for increasing pain, skin colour change, blanching or any change in vision.",
  ],
  skin: [
    "Use gentle cleansing, moisturiser and daily broad-spectrum sunscreen.",
    "Do not pick or peel flaking skin.",
    "Reintroduce active products only when your clinician advises.",
  ],
  medical: [
    "Follow the prescribed plan and attend follow-up reviews so progress can be assessed.",
    "Report side-effects from any medicine or topical treatment promptly.",
  ],
  procedure: [
    "Keep the area clean and follow the wound-care instructions you are given.",
    "Contact the clinic if you notice signs of infection such as increasing redness, warmth, discharge or fever.",
  ],
};

type Base = Omit<Treatment, "preparation" | "aftercare" | "published" | "review"> & {
  preparation?: string[];
  aftercare?: string[];
  published?: boolean;
  /** Set to "approved" (with `reviewedOn`) once a registered clinician has signed this page off. */
  review?: Treatment["review"];
  prepKind: keyof typeof PREP;
};

const make = (t: Base): Treatment => {
  const { prepKind, preparation = [], aftercare = [], published = true, review = "pending", ...rest } = t;
  return {
    ...rest,
    preparation: [...preparation, ...PREP[prepKind]],
    aftercare: [...aftercare, ...AFTER[prepKind]],
    published,
    review,
  };
};

/* ─────────────────────────────── Data ─────────────────────────────── */

export const treatments: Treatment[] = [
  /* ═══════ Laser & energy-based ═══════ */
  make({
    slug: "laser-hair-reduction",
    name: "Laser Hair Reduction",
    seoName: "Laser Hair Removal",
    aka: ["laser hair removal", "diode laser hair reduction"],
    category: "laser",
    concerns: ["unwanted-hair"],
    module: "laser",
    prepKind: "laser",
    summary:
      "Uses light energy absorbed by pigment in the hair to reduce hair regrowth over a course of sessions. Results vary with hair colour, skin type and hormonal factors.",
    overview: [
      "Laser hair reduction directs controlled pulses of light at hair follicles. Pigment (melanin) in the hair absorbs the light energy, which is converted to heat and can damage the follicle's ability to regrow hair.",
      "The aim is a long-term reduction in hair, not guaranteed permanent removal. Most people need several sessions, and some need occasional maintenance treatments.",
    ],
    intendedFor: [
      "Unwanted hair on the face or body",
      "People who want an alternative to frequent shaving, waxing or threading",
      "Some cases of ingrown hairs, after assessment",
    ],
    howItWorks: [
      "The device emits light at a wavelength chosen to be absorbed by melanin in the hair shaft and follicle.",
      "Absorbed energy heats the follicle. Surrounding skin is protected with contact cooling and settings matched to your skin type.",
      "Only follicles in the active growth (anagen) phase respond well, which is why treatments are spaced over several weeks.",
      "Dark hair absorbs more energy than light, grey, red or very fine hair, which may respond poorly or not at all.",
    ],
    suitability: [
      "Your skin type, hair colour and hair thickness are assessed to choose the device setting, or to advise that laser may not be suitable.",
      "A patch test may be recommended before a full session.",
      "Hormonal conditions (such as PCOS) can affect results and may need medical assessment alongside treatment.",
      "Not usually performed on tanned skin, over tattoos, or during pregnancy.",
    ],
    preparation: [
      "Shave the area as advised (usually 24 hours before). Do not wax, thread or pluck for several weeks beforehand, because the hair root must be present.",
    ],
    risks: [
      "Temporary redness, swelling and a prickly or warm sensation are common.",
      "Less commonly: blistering, burns, crusting, or temporary darkening or lightening of the skin, particularly with tanned or darker skin types.",
      "Rarely: scarring, or paradoxical increased hair growth in some areas.",
      "Protective eyewear is essential for the patient and the clinician throughout.",
    ],
    recovery: "Most people return to normal activities the same day. Redness usually settles within hours to a few days.",
    sessions:
      "A course of several sessions spaced weeks apart is common; your clinician will advise based on the area and your response.",
    faqs: [
      {
        q: "Is laser hair reduction permanent?",
        a: "It aims for a long-term reduction in hair growth rather than guaranteed permanent removal. Some hair may regrow, often finer and lighter, and maintenance sessions may be needed.",
      },
      {
        q: "Why do I need several sessions?",
        a: "Hair grows in cycles and only follicles in the active growth phase respond well at any one time. Spacing sessions over weeks reaches more follicles in that phase.",
      },
      {
        q: "Does it work on all hair colours?",
        a: "Laser relies on pigment in the hair, so dark hair usually responds best. Blonde, grey, white and red hair often respond poorly. Your clinician will discuss realistic expectations.",
      },
      {
        q: "Does it hurt?",
        a: "Most people describe a brief snapping or warm sensation. Cooling is used to improve comfort, and sensitivity varies by area.",
      },
    ],
  }),
  make({
    slug: "laser-toning",
    name: "Laser Toning",
    category: "laser",
    concerns: ["pigmentation", "dullness"],
    module: "pigment",
    prepKind: "laser",
    summary:
      "Low-energy laser passes, often with a Q-switched or picosecond device, used for some types of pigmentation and uneven tone after assessment.",
    overview: [
      "Laser toning uses low-fluence laser energy delivered in multiple passes. Pigment particles absorb the energy and are broken into smaller fragments that the body can gradually clear.",
      "It is used for selected pigmentation concerns. Because pigmentation has many causes, a diagnosis comes before any laser plan.",
    ],
    intendedFor: ["Some forms of uneven skin tone", "Selected pigmentation concerns, after diagnosis", "Dull-looking skin, as part of a wider plan"],
    howItWorks: [
      "Pigment absorbs short pulses of laser energy and fragments.",
      "Low energy, repeated over a course, aims to limit heat build-up in surrounding skin.",
      "Results depend on the type and depth of pigment; some types, such as melasma, can recur or worsen with heat and need cautious management.",
    ],
    suitability: [
      "Pigmentation is assessed first, sometimes with a magnified or Wood's lamp examination.",
      "Not suitable over active infection, or during some medicines that increase light sensitivity.",
      "Darker skin types need conservative settings because of the risk of pigment changes.",
    ],
    risks: [
      "Temporary redness and mild swelling.",
      "Post-inflammatory hyperpigmentation (darkening) or hypopigmentation (lightening), which may be long-lasting.",
      "Recurrence of pigmentation, particularly with sun exposure or hormonal triggers.",
    ],
    recovery: "Usually minimal downtime; mild redness may last a few hours.",
    sessions: "Usually a course of sessions; the number depends on the condition and response.",
    faqs: [
      {
        q: "Will laser toning remove my pigmentation completely?",
        a: "Not necessarily. Some pigmentation improves, some is resistant, and some recurs. Sun protection and ongoing skincare are part of managing it.",
      },
      {
        q: "Is it suitable for melasma?",
        a: "Melasma is complex and can worsen with heat-based treatments. Any laser approach needs careful assessment and is usually combined with topical treatment and strict sun protection.",
      },
    ],
  }),
  make({
    slug: "photofacial",
    name: "Photofacial (IPL)",
    seoName: "IPL Photofacial",
    aka: ["IPL photofacial", "intense pulsed light"],
    category: "laser",
    concerns: ["pigmentation", "dullness"],
    module: "pigment",
    prepKind: "laser",
    summary:
      "Intense pulsed light (IPL) delivers broad-spectrum light that can target some sun-related pigmentation and visible redness.",
    overview: [
      "A photofacial uses intense pulsed light — a broad spectrum of light filtered for the target — rather than a single-wavelength laser.",
      "It is sometimes used for sun-related brown spots and some visible blood vessels. It is not suitable for every skin type or pigment problem.",
    ],
    intendedFor: ["Some sun-related brown spots", "Visible redness or small vessels, after assessment", "Uneven tone"],
    howItWorks: [
      "Pigment and haemoglobin absorb filtered light and convert it to heat.",
      "Treated pigment may darken temporarily before flaking away over one to two weeks.",
    ],
    suitability: [
      "Generally more cautious, or unsuitable, for darker or tanned skin because of the higher risk of pigment change.",
      "Not used on suspicious or changing moles, which need medical review first.",
    ],
    risks: [
      "Redness, swelling and temporary darkening of spots.",
      "Blistering, burns, or long-lasting pigment changes.",
      "Eye injury without proper eye protection.",
    ],
    recovery: "Mild redness for a few hours to days; treated spots may look darker for a week or two.",
    sessions: "Often a short course; your clinician will advise.",
    faqs: [
      {
        q: "Is IPL the same as a laser?",
        a: "No. IPL uses a broad range of wavelengths, whereas a laser uses a single wavelength. Each has different uses and risks.",
      },
    ],
  }),
  make({
    slug: "co2-laser-resurfacing",
    name: "Fractional CO₂ Laser",
    seoName: "CO2 Laser Resurfacing",
    aka: ["CO2 laser", "fractional CO2 laser for acne scars"],
    category: "laser",
    concerns: ["scarring", "texture", "lines"],
    module: "collagen",
    prepKind: "laser",
    summary:
      "An ablative fractional laser that creates microscopic treatment columns in the skin, used for selected scars and texture concerns. It has more downtime than non-ablative options.",
    overview: [
      "Fractional CO₂ laser removes tiny columns of skin while leaving surrounding skin intact, which supports healing from the untreated areas.",
      "The skin's wound-healing response includes new collagen formation over the following months.",
    ],
    intendedFor: ["Some acne scars", "Uneven skin texture", "Some fine lines", "Selected other scars, after assessment"],
    howItWorks: [
      "Laser energy is absorbed by water in the skin, vaporising microscopic columns.",
      "Healing and remodelling continue for weeks to months after treatment.",
    ],
    suitability: [
      "Downtime and the risk of pigment change must be discussed carefully, particularly for darker skin types.",
      "Not suitable with active infection, recent isotretinoin use (as advised by your clinician), or a tendency to keloid scarring.",
      "Antiviral medicine may be recommended if you have a history of cold sores.",
    ],
    risks: [
      "Redness, swelling, oozing and crusting during healing.",
      "Infection, prolonged redness, acne flare or milia.",
      "Post-inflammatory hyperpigmentation, hypopigmentation or, rarely, scarring.",
    ],
    recovery:
      "Several days of visible healing are typical, with redness that can persist for weeks. Your clinician will describe expected downtime for your settings.",
    sessions: "Sometimes one session, often a course spaced weeks apart.",
    faqs: [
      {
        q: "How long is the downtime?",
        a: "It depends on the depth and density used. Many people need several days away from social activities, and redness can persist for longer.",
      },
    ],
  }),
  make({
    slug: "mnrf",
    name: "Microneedling Radiofrequency (MNRF / Fractional RF)",
    seoName: "MNRF (RF Microneedling)",
    aka: ["RF microneedling", "radiofrequency microneedling"],
    category: "laser",
    concerns: ["scarring", "texture", "lines"],
    module: "collagen",
    prepKind: "laser",
    summary:
      "Fine insulated needles deliver radiofrequency energy into the dermis, combining microneedling with heat to stimulate a remodelling response.",
    overview: [
      "MNRF devices insert very fine needles to a set depth and release radiofrequency energy at the needle tips.",
      "Because energy is delivered beneath the surface, it may be an option for some skin types for which surface lasers carry more pigment risk. Suitability is still individual.",
    ],
    intendedFor: ["Some acne scars", "Enlarged-looking pores and texture", "Mild skin laxity"],
    howItWorks: [
      "Microchannels and controlled heat trigger wound healing.",
      "Collagen remodelling takes place gradually over weeks to months.",
    ],
    suitability: [
      "Not usually performed over active acne, infection, or some metal implants in the area.",
      "Your clinician will review any history of keloids, bleeding problems or pigment changes.",
    ],
    risks: ["Redness, swelling and pinpoint marks.", "Temporary bruising.", "Infection, pigment changes or grid-like marks."],
    recovery: "Redness and swelling typically settle over a few days.",
    sessions: "Usually a course of sessions spaced several weeks apart.",
    faqs: [
      {
        q: "When might I see changes?",
        a: "Remodelling is gradual, so changes, where they occur, are usually assessed over months rather than days.",
      },
    ],
  }),
  make({
    slug: "hifu",
    name: "HIFU (High-Intensity Focused Ultrasound)",
    aka: ["skin tightening with focused ultrasound"],
    category: "laser",
    concerns: ["texture"],
    module: "collagen",
    prepKind: "laser",
    summary:
      "Focused ultrasound energy is delivered to set depths beneath the skin to create small heated points, intended to support tightening in mild laxity.",
    overview: [
      "HIFU focuses ultrasound beneath the skin surface to create small points of heat at specific depths.",
      "It is used for mild to moderate skin laxity in selected people. It is not a substitute for surgery and responses vary.",
    ],
    intendedFor: ["Mild skin laxity of the face, jawline or neck"],
    howItWorks: [
      "Ultrasound is focused to precise depths, creating tiny thermal points while sparing the surface.",
      "The body's healing response may lead to gradual tightening over months.",
    ],
    suitability: [
      "Most suited to mild laxity; significant laxity may not respond meaningfully.",
      "Not used over open wounds, severe active acne or some implants in the treatment area.",
    ],
    risks: [
      "Discomfort during treatment, temporary redness, swelling or tenderness.",
      "Bruising, numbness or tingling, usually temporary.",
      "Rarely, burns, nerve irritation or changes in fat volume.",
    ],
    recovery: "Most people resume normal activities the same day.",
    sessions: "Often a single session, sometimes repeated after a long interval.",
    faqs: [
      {
        q: "Is HIFU a non-surgical facelift?",
        a: "HIFU can help some people with mild laxity, but it does not produce the results of surgery. Your clinician will discuss what is realistic.",
      },
    ],
  }),
  make({
    slug: "tattoo-removal",
    name: "Laser Tattoo Removal",
    aka: ["laser tattoo removal"],
    category: "laser",
    concerns: ["skin-lesions"],
    module: "pigment",
    prepKind: "laser",
    summary:
      "Short-pulse lasers fragment tattoo ink so the body can gradually clear it. Many sessions are usually needed, and complete removal is not always possible.",
    overview: [
      "Tattoo ink particles absorb very short laser pulses and break into smaller fragments, which the immune system removes over the following weeks.",
      "Ink colour, depth, density, age of the tattoo and skin type all affect how much fading is achievable.",
    ],
    intendedFor: ["Fading or removing unwanted tattoos", "Lightening a tattoo before a cover-up"],
    howItWorks: [
      "Different ink colours absorb different wavelengths, so some colours respond better than others.",
      "Sessions are spaced weeks apart so the body can clear fragments.",
    ],
    suitability: ["Some colours (such as green, blue, yellow and white) can be resistant.", "Tanned skin and darker skin types need cautious settings."],
    risks: [
      "Blistering, swelling and crusting.",
      "Lightening or darkening of the skin, textural change or scarring.",
      "Incomplete removal, or ink colour change (for example in cosmetic tattoos).",
    ],
    recovery: "Blisters and crusts usually heal within one to two weeks.",
    sessions: "Usually multiple sessions spaced several weeks apart.",
    faqs: [
      {
        q: "Can every tattoo be completely removed?",
        a: "Not always. Many tattoos fade substantially over a course of treatment, but some ink may remain.",
      },
    ],
  }),

  /* ═══════ Injectables & contouring ═══════ */
  make({
    slug: "anti-wrinkle-injections",
    name: "Anti-Wrinkle Injections (Botulinum Toxin)",
    aka: ["botulinum toxin injections", "wrinkle relaxing injections"],
    category: "injectables",
    concerns: ["lines"],
    module: "collagen",
    prepKind: "injectables",
    summary:
      "A prescription-only medicine injected in small amounts to temporarily relax selected muscles that contribute to expression lines.",
    overview: [
      "Botulinum toxin type A temporarily reduces the activity of the muscles into which it is injected. Expression lines formed by those muscles may soften while the effect lasts.",
      "It is a prescription medicine. Treatment should follow a face-to-face assessment by a suitably qualified medical professional.",
    ],
    intendedFor: ["Forehead lines", "Frown lines between the brows", "Lines at the outer corners of the eyes", "Some other uses, after assessment"],
    howItWorks: [
      "The medicine blocks the nerve signal that tells a muscle to contract.",
      "The effect develops over several days and gradually wears off over months as nerve signalling recovers.",
      "The aim of a careful plan is to reduce selected movement, not to remove all expression.",
    ],
    suitability: [
      "Not offered during pregnancy or breastfeeding, or with some neuromuscular conditions or medicines.",
      "Your expectations, facial anatomy and previous treatments are discussed before any plan is made.",
    ],
    risks: [
      "Pain, bruising, redness or swelling at injection points; headache.",
      "Temporary drooping of the eyelid or brow, asymmetry or an unwanted change in expression.",
      "Rarely, allergic reaction or spread of effect to nearby muscles.",
    ],
    recovery: "Most people return to normal activities immediately, following specific aftercare for the first hours.",
    aftercare: ["Stay upright for the period advised and avoid pressing on treated areas."],
    sessions: "Effects are temporary; repeat treatment, if wanted, is discussed at review.",
    faqs: [
      {
        q: "Will I look frozen?",
        a: "The aim is a measured reduction in selected movement. Dose and placement are planned around your anatomy and preferences, and expression changes are discussed beforehand.",
      },
      {
        q: "How long does it last?",
        a: "The effect is temporary and wears off gradually. Duration varies between people and areas.",
      },
    ],
  }),
  make({
    slug: "dermal-fillers",
    name: "Dermal Fillers",
    category: "injectables",
    concerns: ["volume", "lines"],
    module: "collagen",
    prepKind: "injectables",
    summary:
      "Injectable gels, most commonly hyaluronic acid, placed to address volume loss, contour or certain folds, following facial assessment.",
    overview: [
      "Most dermal fillers are made from hyaluronic acid (HA), a sugar molecule that occurs naturally in the skin. They add volume where they are placed.",
      "Filler treatment involves real risks, including rare vascular complications, so it requires a qualified injector with knowledge of facial anatomy and the ability to manage complications.",
    ],
    intendedFor: ["Volume loss in areas such as the cheeks or temples", "Nose-to-mouth folds", "Chin and jawline profile", "Some other areas, after assessment"],
    howItWorks: [
      "The gel is injected with a fine needle or cannula into planned layers.",
      "HA gels bind water and gradually break down over months; how long they last varies by product and area.",
      "Some techniques (such as MD Codes™, a branded assessment and injection approach) are frameworks for planning placement; they do not change the product's risks.",
    ],
    suitability: [
      "Not offered during pregnancy or breastfeeding, with active skin infection in the area, or with some autoimmune conditions without medical review.",
      "Your proportions and goals are assessed; sometimes the recommendation is not to treat.",
    ],
    risks: [
      "Swelling, bruising, tenderness and lumps.",
      "Infection, delayed inflammatory reactions or filler migration.",
      "Rare but serious: blocked blood vessel (vascular occlusion), which can cause skin damage and, very rarely, vision loss. This is a medical emergency.",
    ],
    recovery: "Swelling and bruising may last several days.",
    sessions: "Usually a single appointment, with a review afterwards.",
    faqs: [
      {
        q: "Can hyaluronic acid filler be dissolved?",
        a: "HA fillers can usually be dissolved with an enzyme called hyaluronidase, which is also used in managing some complications. This has its own risks.",
      },
      {
        q: "How long do fillers last?",
        a: "It varies with product, area and individual metabolism. Your clinician will explain the expected range for the product used.",
      },
    ],
  }),
  make({
    slug: "lip-fillers",
    name: "Lip Enhancement (Lip Fillers)",
    seoName: "Lip Fillers",
    aka: ["lip fillers", "lip enhancement"],
    category: "injectables",
    concerns: ["volume", "lines"],
    module: "collagen",
    prepKind: "injectables",
    summary:
      "Hyaluronic acid filler placed in the lips to address volume, definition, asymmetry or fine lip lines, planned around facial proportions.",
    overview: [
      "Lip treatment uses soft HA fillers. Planning considers the whole face, lip proportions and what is realistic for your anatomy.",
      "The lips have a rich blood supply, so swelling and bruising are common and injector expertise is essential.",
    ],
    intendedFor: ["Thin lips or volume loss", "Lip asymmetry", "Vertical lip lines"],
    howItWorks: ["Small volumes of gel are placed in planned areas of the lip.", "Swelling settles over days, after which the result is reviewed."],
    suitability: ["A history of cold sores may need antiviral cover.", "Not offered during pregnancy or breastfeeding."],
    risks: ["Swelling, bruising, tenderness and asymmetry.", "Lumps or migration.", "Rare vascular occlusion — a medical emergency."],
    recovery: "Swelling is usually most noticeable in the first 48 hours.",
    faqs: [
      {
        q: "Will my lips look overfilled?",
        a: "Volume and shape are planned with you beforehand. Gradual, conservative treatment is often recommended.",
      },
    ],
  }),
  make({
    slug: "jawline-contouring",
    name: "Jawline & Chin Contouring",
    category: "injectables",
    concerns: ["volume"],
    prepKind: "injectables",
    summary:
      "Filler placed along the jawline or chin to change profile or definition in selected people, after assessment of facial proportions.",
    overview: [
      "Contouring uses firmer HA fillers placed along the jaw or chin to alter projection or definition.",
      "Chin and jaw shape are influenced by bone, muscle, fat and skin; fillers address only some of these factors.",
    ],
    intendedFor: ["Chin projection and profile balance", "Jawline definition"],
    howItWorks: ["Filler is placed at planned depths, often close to the bone.", "Results are reviewed once swelling settles."],
    suitability: ["Some profile concerns relate to bite or bone structure and may need dental or surgical opinion instead."],
    risks: ["Swelling, bruising, tenderness, asymmetry and lumps.", "Infection or migration.", "Rare vascular occlusion."],
    recovery: "Swelling and tenderness usually settle within days.",
    faqs: [
      {
        q: "Is this an alternative to chin surgery?",
        a: "For some people it changes profile temporarily. It does not replicate surgery, and a referral may be more appropriate for some concerns.",
      },
    ],
  }),
  make({
    slug: "jawline-slimming",
    name: "Jawline Slimming (Masseter Treatment)",
    aka: ["masseter reduction", "face slimming injections"],
    category: "injectables",
    concerns: ["volume"],
    prepKind: "injectables",
    summary:
      "Botulinum toxin injected into enlarged masseter (chewing) muscles may reduce their bulk over time, which can change the width of the lower face.",
    overview: [
      "The masseter muscles at the angle of the jaw can be enlarged, sometimes linked to clenching or grinding.",
      "Relaxing the muscle with botulinum toxin can reduce its size gradually. Not all lower-face width is muscular.",
    ],
    intendedFor: ["Wide lower face due to masseter enlargement", "Some clenching, as part of a wider plan"],
    howItWorks: ["Reduced muscle activity leads to gradual reduction in muscle bulk over weeks.", "Effects are temporary."],
    suitability: ["Assessment confirms whether width is due to muscle, fat or bone."],
    risks: ["Tenderness, bruising, chewing fatigue.", "Temporary smile asymmetry.", "Rarely, a hollow appearance or bulging muscle."],
    recovery: "Normal activities are usually resumed the same day.",
    faqs: [{ q: "How soon will I see a change?", a: "Changes in muscle bulk, if they occur, develop gradually over weeks." }],
  }),
  make({
    slug: "thread-lift",
    name: "Thread Lift",
    category: "injectables",
    concerns: ["texture"],
    module: "collagen",
    prepKind: "injectables",
    summary:
      "Absorbable threads placed beneath the skin to reposition tissue in selected people with mild laxity. Effects are temporary and vary.",
    overview: [
      "Thread lifts use dissolvable sutures (for example PDO) with barbs or cones, inserted under local anaesthetic.",
      "They may offer a modest, temporary lift for some people. They are not equivalent to surgery.",
    ],
    intendedFor: ["Mild sagging of the mid-face, jowls or brow"],
    howItWorks: ["Threads anchor and lift soft tissue mechanically.", "As threads dissolve, a tissue response forms around them."],
    suitability: ["Best suited to mild laxity; heavy or very thin skin may respond poorly."],
    risks: [
      "Bruising, swelling, pain and dimpling or puckering.",
      "Visible or palpable threads, thread extrusion, asymmetry or infection.",
      "Rarely, nerve or salivary gland injury.",
    ],
    recovery: "Swelling, tightness and tenderness for several days; avoid wide mouth opening and facial massage as advised.",
    faqs: [{ q: "How long does a thread lift last?", a: "Effects are temporary and highly variable. Your clinician will discuss a realistic range." }],
  }),
  make({
    slug: "profhilo",
    name: "Profhilo®",
    category: "injectables",
    concerns: ["dullness", "texture"],
    module: "collagen",
    prepKind: "injectables",
    summary:
      "A branded injectable hyaluronic acid product placed at set points, intended to improve skin hydration and quality rather than add volume.",
    overview: [
      "Profhilo® is a brand of high-concentration hyaluronic acid. It spreads within the skin after injection at standard points.",
      "It is positioned as a skin-quality treatment rather than a volumising filler. Product availability and regulatory status should be confirmed by the clinic.",
    ],
    intendedFor: ["Dehydrated-looking or crepey skin", "Skin quality of the face, neck or hands"],
    howItWorks: ["HA is injected at defined points and disperses through surrounding tissue.", "A course of two sessions a few weeks apart is common."],
    suitability: ["As for other HA injectables, including pregnancy, active infection and allergy history."],
    risks: ["Small raised bumps at injection points for several hours.", "Bruising, redness, tenderness.", "Infection or inflammatory reactions."],
    recovery: "Bumps typically settle within a day.",
    reviewNote: "Brand-name product: confirm the clinic stocks it and that naming it complies with current advertising guidance.",
    faqs: [{ q: "Is Profhilo® a filler?", a: "It is an HA injectable, but it is intended to spread within the skin for hydration rather than to add volume in one area." }],
  }),
  make({
    slug: "skin-boosters",
    name: "Skin Boosters",
    aka: ["injectable skin hydration"],
    category: "injectables",
    concerns: ["dullness", "texture"],
    module: "skin",
    prepKind: "injectables",
    summary:
      "Micro-injections of light hyaluronic acid (sometimes combined with other ingredients) intended to improve skin hydration and texture.",
    overview: [
      "Skin boosters deliver small amounts of light HA across an area of skin using multiple micro-injections or a device.",
      "They aim to improve hydration and fine texture, not to change shape or volume.",
    ],
    intendedFor: ["Dehydrated-looking skin", "Fine texture irregularities", "Skin quality of the face, neck or hands"],
    howItWorks: ["HA attracts and holds water within the skin.", "Usually delivered as a short course of treatments."],
    suitability: ["Not performed over active acne or infection.", "Pregnancy and breastfeeding are generally contraindications."],
    risks: ["Small bumps, redness, bruising and tenderness.", "Infection or inflammatory reaction."],
    recovery: "Visible bumps and redness usually settle within one to two days.",
    sessions: "Often a short course, with maintenance discussed at review.",
    faqs: [{ q: "How are skin boosters different from fillers?", a: "Boosters use lighter gels spread across the skin for hydration; fillers use firmer gels to add volume in specific areas." }],
  }),
  make({
    slug: "hyperhidrosis",
    name: "Excessive Sweating (Hyperhidrosis)",
    seoName: "Hyperhidrosis Treatment",
    aka: ["hyperhidrosis treatment", "underarm sweating treatment"],
    category: "injectables",
    concerns: ["sweating"],
    module: "skin",
    prepKind: "injectables",
    summary:
      "Assessment of excessive sweating and discussion of options, which may include topical treatments and, for some, botulinum toxin injections to reduce sweat gland activity.",
    overview: [
      "Hyperhidrosis is sweating beyond what the body needs for temperature control. It can be primary (often underarms, palms, soles) or secondary to another medical condition or medicine.",
      "Assessment comes first, because secondary causes need medical investigation.",
    ],
    intendedFor: ["Underarm sweating", "Palm or sole sweating, after assessment"],
    howItWorks: [
      "Botulinum toxin blocks the nerve signal to eccrine sweat glands in the treated area.",
      "The effect is temporary and gradually wears off over months.",
    ],
    suitability: ["New, night-time or generalised sweating needs medical evaluation before cosmetic treatment."],
    risks: ["Injection discomfort, bruising.", "Compensatory sweating elsewhere.", "Temporary hand weakness when palms are treated."],
    recovery: "Normal activities usually resume the same day.",
    faqs: [{ q: "Is the effect permanent?", a: "No. Botulinum toxin effects on sweating are temporary, and repeat treatment may be discussed." }],
  }),
  make({
    slug: "under-eye-treatments",
    name: "Under-Eye Treatments",
    seoName: "Under-Eye & Dark Circle Treatments",
    aka: ["dark circles treatment", "under-eye filler"],
    category: "injectables",
    concerns: ["under-eye", "pigmentation", "volume"],
    module: "skin",
    prepKind: "injectables",
    summary:
      "Under-eye concerns have several causes — hollowing, pigmentation, visible vessels, puffiness or skin laxity. Options such as PRP, fillers or peels are considered only after identifying the cause.",
    overview: [
      "Dark circles and hollows can result from anatomy, pigmentation, thin skin with visible vessels, fluid retention or ageing changes.",
      "Because the under-eye area is delicate and close to the eye, treatment choices are conservative and individual.",
    ],
    intendedFor: ["Tear-trough hollowing", "Under-eye pigmentation", "Fine crepey skin"],
    howItWorks: [
      "Under-eye PRP uses platelet-rich plasma prepared from your own blood; evidence for this use is limited and results vary.",
      "Tear-trough filler is an advanced technique with specific risks and is not suitable for everyone, particularly with puffiness or bags.",
      "Pigmentation may be addressed with topical care, gentle peels or other options after diagnosis.",
    ],
    suitability: ["Puffiness or bags often worsen with filler and may need a different approach."],
    risks: [
      "Bruising and swelling are common in this area.",
      "Filler: lumps, a bluish tint (Tyndall effect), prolonged swelling, and rare vascular complications including vision loss.",
      "PRP: bruising, swelling and discomfort.",
    ],
    recovery: "Bruising and swelling may last several days to over a week.",
    faqs: [{ q: "What is the best treatment for dark circles?", a: "There isn't a single best treatment. The right option depends on the cause, which is why assessment comes first." }],
  }),

  /* ═══════ Skin rejuvenation & facials ═══════ */
  make({
    slug: "advanced-skincare",
    name: "Advanced Skincare",
    category: "skin",
    concerns: ["dullness", "texture", "acne", "pigmentation"],
    module: "skin",
    prepKind: "skin",
    summary:
      "An assessment-led skincare plan that may draw on medical facials, skin boosters, chemical peels, laser resurfacing, collagen-induction treatments and home care.",
    overview: [
      "Advanced skincare at the clinic starts with understanding your skin type, concerns, history and routine.",
      "Available skincare procedures and their suitability are discussed during consultation. Options, risks, limitations and aftercare vary from person to person.",
    ],
    intendedFor: ["People wanting a structured, clinician-guided skincare plan", "Combined concerns such as texture, tone and congestion"],
    howItWorks: [
      "A plan may combine in-clinic treatments with home skincare and sun protection.",
      "Progress is reviewed and the plan adjusted over time.",
      `The clinic's product range includes skincare from brands such as ZO Skin Health, Obagi and Heliocare. Products are recommended only where suitable after consultation.`,
    ],
    suitability: ["Not every option suits every skin type; some are deferred during active inflammation, pregnancy or certain medicines."],
    risks: ["Risks depend on the treatments chosen and are explained for each one before you decide."],
    recovery: "Varies with the treatments included.",
    reviewNote: "Commercial relationship with product brands should be disclosed if products are sold by the clinic.",
    faqs: [{ q: "Do I need to buy products from the clinic?", a: "No. Product recommendations, where made, are optional and should be suitable for your skin." }],
  }),
  make({
    slug: "hydrafacial",
    name: "Hydra Facial & Advanced Hydra Facial",
    aka: ["hydra facial", "hydradermabrasion facial"],
    category: "skin",
    concerns: ["dullness", "texture", "acne"],
    module: "skin",
    prepKind: "skin",
    summary:
      "A multi-step medical facial combining cleansing, gentle exfoliation, suction-based extraction and hydrating serums. Advanced versions add targeted boosters.",
    overview: [
      "Hydradermabrasion facials use a handpiece that cleanses, exfoliates and applies serums while vacuum suction helps lift debris from pores.",
      "The effect is typically short-term skin freshness and hydration; regular sessions are often used as maintenance.",
    ],
    intendedFor: ["Congested pores", "Dull or dehydrated-looking skin", "Maintenance alongside other treatments"],
    howItWorks: ["Cleansing and exfoliation, then extraction with suction.", "Hydrating or targeted serums infused at the end."],
    suitability: ["Active rosacea flares, open wounds or some active skin infections may need treatment first."],
    risks: ["Temporary redness or sensitivity.", "Breakouts, or irritation from serum ingredients."],
    recovery: "Usually none; mild redness may last a few hours.",
    faqs: [{ q: "How often can I have one?", a: "Your clinician will suggest an interval based on your skin and goals." }],
  }),
  make({
    slug: "pumpkin-facial",
    name: "Pumpkin Enzyme Facial",
    category: "skin",
    concerns: ["dullness", "texture"],
    module: "skin",
    prepKind: "skin",
    summary:
      "A gentle peel-style facial using pumpkin enzymes (often with mild acids) to exfoliate the outer layer of skin.",
    overview: [
      "Fruit enzymes break down bonds between dead skin cells on the surface, giving gentle exfoliation.",
      "It is a superficial treatment and its effects are usually temporary.",
    ],
    intendedFor: ["Dull-looking skin", "Mild uneven texture"],
    howItWorks: ["Enzymes and acids loosen surface cells, which are then removed."],
    suitability: ["Not suitable for people with allergies to its ingredients, or with active dermatitis."],
    risks: ["Tingling, redness, mild irritation.", "Allergic or irritant reaction."],
    recovery: "Little to no downtime.",
    faqs: [{ q: "Is it suitable for sensitive skin?", a: "Possibly, after assessment and a patch test if needed." }],
  }),
  make({
    slug: "chemical-peels",
    name: "Chemical Peels",
    aka: ["skin peel", "glycolic peel"],
    category: "skin",
    concerns: ["pigmentation", "acne", "texture", "dullness"],
    module: "pigment",
    prepKind: "skin",
    summary:
      "Controlled application of acids (such as glycolic, salicylic, lactic or TCA) to exfoliate skin to a chosen depth for selected concerns.",
    overview: [
      "Peels range from superficial (outer layer only) to medium depth. Deeper peels have greater downtime and risk.",
      "The type and strength are chosen for your skin type and concern; a priming routine may be advised beforehand.",
    ],
    intendedFor: ["Some pigmentation", "Mild acne and congestion", "Uneven texture"],
    howItWorks: ["The acid loosens and removes damaged surface cells.", "Regeneration over the following days produces new surface skin."],
    suitability: ["Recent isotretinoin, active cold sores or open wounds may delay treatment.", "Darker skin types need careful peel selection."],
    risks: ["Stinging, redness, peeling.", "Post-inflammatory hyperpigmentation, infection or, rarely, scarring."],
    recovery: "Superficial peels: little downtime. Deeper peels: visible peeling for several days.",
    sessions: "Often a series of superficial peels spaced weeks apart.",
    faqs: [{ q: "Will my skin peel visibly?", a: "It depends on the peel. Some cause light flaking only; others cause noticeable peeling for days." }],
  }),
  make({
    slug: "collagen-induction-therapy",
    name: "Collagen Induction Therapy (Microneedling)",
    seoName: "Microneedling",
    aka: ["microneedling", "dermaroller treatment"],
    category: "skin",
    concerns: ["scarring", "texture"],
    module: "collagen",
    prepKind: "skin",
    summary:
      "Microneedling creates controlled micro-injuries to stimulate the skin's natural wound-healing and collagen remodelling response.",
    overview: [
      "A device with fine needles creates tiny channels in the skin at a set depth.",
      "Healing involves new collagen formation over weeks to months. Results vary and are usually gradual.",
    ],
    intendedFor: ["Some acne scars", "Uneven texture", "Enlarged-looking pores"],
    howItWorks: ["Micro-injuries trigger repair and remodelling.", "Sometimes combined with topical serums or PRP."],
    suitability: ["Not performed over active acne, infection or with a tendency to keloids."],
    risks: ["Redness, swelling and pinpoint bleeding.", "Infection, pigment changes, or tram-track marks if incorrectly performed."],
    recovery: "Redness for one to three days is typical.",
    sessions: "Usually a course spaced several weeks apart.",
    faqs: [{ q: "Is microneedling the same as MNRF?", a: "No. MNRF adds radiofrequency heat delivered through the needles." }],
  }),
  make({
    slug: "prp-facial",
    name: "PRP Facial",
    category: "skin",
    concerns: ["texture", "dullness"],
    module: "collagen",
    prepKind: "skin",
    summary:
      "Platelet-rich plasma prepared from your own blood applied with microneedling or by injection. Sometimes called a 'vampire facial'. Evidence is still developing.",
    overview: [
      "A small blood sample is spun in a centrifuge to concentrate platelets, which contain growth factors.",
      "PRP is often combined with microneedling. Scientific evidence for cosmetic benefit is limited and results vary.",
    ],
    intendedFor: ["Skin texture and quality, as part of a wider plan"],
    howItWorks: ["Platelet growth factors are thought to support healing and remodelling."],
    suitability: ["Not suitable with some blood disorders, anticoagulants, active infection or cancer treatment."],
    risks: ["Bruising at the blood draw site.", "Redness, swelling and infection risk.", "Results may be minimal."],
    recovery: "Redness for one to three days, similar to microneedling.",
    reviewNote: "Avoid the term 'vampire facial' as a headline — it is a trademarked term in some markets.",
    faqs: [{ q: "Is PRP proven?", a: "Evidence is mixed and still developing. Your clinician should discuss uncertainty and alternatives." }],
  }),

  /* ═══════ Pigmentation ═══════ */
  make({
    slug: "cosmelan-peel",
    name: "Cosmelan® Depigmentation Peel",
    aka: ["melasma peel", "depigmentation peel"],
    category: "pigmentation",
    concerns: ["pigmentation"],
    module: "pigment",
    prepKind: "skin",
    summary:
      "A branded depigmentation mask applied in clinic and followed by a home-care regimen, used for some types of pigmentation after diagnosis.",
    overview: [
      "Cosmelan® combines an in-clinic mask with a structured home-care cream. It works by reducing melanin production and promoting exfoliation.",
      "Pigmentation commonly recurs without ongoing sun protection and maintenance.",
    ],
    intendedFor: ["Some forms of melasma and hyperpigmentation, after diagnosis"],
    howItWorks: ["Ingredients inhibit the enzyme tyrosinase, which is involved in melanin production.", "Exfoliation helps shed pigmented surface cells."],
    suitability: ["Not used in pregnancy or breastfeeding.", "Requires commitment to the home-care routine and strict sun protection."],
    risks: ["Redness, peeling, irritation and sensitivity for days to weeks.", "Uneven lightening or rebound pigmentation."],
    recovery: "Redness and peeling during the first week or two are expected.",
    reviewNote: "Brand-name product: confirm availability and naming compliance.",
    faqs: [{ q: "Will pigmentation come back?", a: "It can. Sun protection and maintenance are key parts of any pigmentation plan." }],
  }),

  /* ═══════ Hair & scalp ═══════ */
  make({
    slug: "prp-hair-therapy",
    name: "PRP Therapy for Hair",
    seoName: "PRP for Hair Loss",
    aka: ["PRP hair treatment", "hair PRP"],
    category: "hair",
    concerns: ["hair-thinning"],
    module: "hair",
    prepKind: "medical",
    summary:
      "Injections of platelet-rich plasma from your own blood into the scalp, sometimes used alongside other treatments for certain types of hair thinning.",
    overview: [
      "Hair thinning has many causes — genetic pattern hair loss, thyroid disorders, iron deficiency, stress, medicines and scalp conditions. Diagnosis comes first, sometimes with blood tests.",
      "PRP is used for some types of pattern hair loss. Evidence suggests benefit for some people, but results are variable and maintenance is usually needed.",
    ],
    intendedFor: ["Some cases of androgenetic (pattern) hair loss, after diagnosis"],
    howItWorks: [
      "Blood is drawn and processed to concentrate platelets.",
      "PRP is injected into the scalp, where growth factors are thought to support follicles in the growth phase.",
    ],
    suitability: ["Not suitable with some blood disorders, anticoagulants or active scalp infection.", "Scarring hair loss needs a different approach."],
    risks: ["Scalp tenderness, bruising, headache.", "Infection (rare).", "No noticeable improvement for some people."],
    recovery: "Normal activities usually resume the same day; avoid washing the scalp for the period advised.",
    aftercare: ["Avoid hair colouring and harsh scalp treatments for the period advised."],
    sessions: "Usually a course of sessions followed by maintenance, if helpful.",
    faqs: [{ q: "Will PRP regrow all my hair?", a: "No treatment can promise this. PRP may help some people with certain types of thinning, and responses vary." }],
  }),
  make({
    slug: "dandruff",
    name: "Dandruff & Seborrhoeic Dermatitis",
    seoName: "Dandruff Treatment",
    aka: ["seborrhoeic dermatitis treatment"],
    category: "hair",
    concerns: ["skin-conditions"],
    module: "hair",
    prepKind: "medical",
    summary:
      "Assessment and management of flaking, itchy scalp, which can be due to dandruff, seborrhoeic dermatitis, psoriasis or other conditions.",
    overview: [
      "Dandruff and seborrhoeic dermatitis are common, relapsing conditions linked to the scalp's natural yeast and skin inflammation.",
      "Other conditions can look similar, so examination guides treatment.",
    ],
    intendedFor: ["Persistent scalp flaking or itching", "Red, scaly patches on the scalp, face or chest"],
    howItWorks: ["Management usually combines medicated shampoos and topical treatments, with prescriptions where needed."],
    suitability: ["Sudden hair loss, pain or scarring needs prompt medical review."],
    risks: ["Irritation from medicated products.", "Recurrence is common; ongoing maintenance may be needed."],
    recovery: "No downtime.",
    faqs: [{ q: "Can dandruff be cured?", a: "It is usually controllable rather than curable. Maintenance helps reduce flares." }],
  }),

  /* ═══════ Medical dermatology ═══════ */
  make({
    slug: "acne-and-acne-scars",
    name: "Acne & Acne Scars",
    seoName: "Acne & Acne Scar Treatment",
    aka: ["acne scar treatment", "pimple marks treatment"],
    category: "dermatology",
    concerns: ["acne", "scarring"],
    module: "acne",
    prepKind: "medical",
    summary:
      "Medical assessment of active acne and acne scarring. Active acne is usually treated first; scar options are considered once acne is controlled.",
    overview: [
      "Acne develops in the hair follicle and its attached sebaceous (oil) gland. Excess oil, blocked pores, bacteria and inflammation all play a part.",
      "Scarring can follow inflammatory acne. Different scar types (such as rolling, boxcar and ice-pick) respond to different treatments.",
    ],
    intendedFor: ["Blackheads, whiteheads and inflamed spots", "Persistent or scarring acne", "Post-acne marks and scars"],
    howItWorks: [
      "Active acne is commonly managed with topical treatments, oral medicines where appropriate, and supportive procedures such as peels.",
      "Scar treatments may include microneedling, MNRF, fractional laser or subcision, often in combination.",
    ],
    suitability: ["Some oral acne medicines require monitoring and are not suitable in pregnancy.", "Procedures are usually timed around medication courses."],
    risks: ["Medicine side-effects (explained when prescribed).", "Procedure-related risks including pigment change, infection and incomplete improvement."],
    recovery: "Depends on the treatments used.",
    faqs: [
      { q: "Can acne scars be removed completely?", a: "Most scar treatments aim for improvement rather than complete removal. Several approaches are often combined over time." },
      { q: "Should I treat scars while I still have active acne?", a: "Usually active acne is controlled first, to prevent new scars and reduce procedure risks." },
    ],
  }),
  make({
    slug: "psoriasis",
    name: "Psoriasis",
    seoName: "Psoriasis Treatment",
    category: "dermatology",
    concerns: ["skin-conditions"],
    module: "skin",
    prepKind: "medical",
    summary:
      "A long-term immune-mediated skin condition causing thickened, scaly patches. Management aims to control flares and improve quality of life.",
    overview: [
      "Psoriasis speeds up skin cell turnover, leading to raised, scaly plaques. It can affect the scalp, nails and joints.",
      "It is not contagious. Treatment depends on severity, location and associated conditions.",
    ],
    intendedFor: ["Diagnosis and management of suspected or known psoriasis"],
    howItWorks: ["Options range from moisturisers and topical medicines to phototherapy and systemic treatments, prescribed after assessment."],
    suitability: ["Joint pain or swelling should be mentioned, as it may need rheumatology input."],
    risks: ["Each medicine has specific risks that are explained before starting."],
    recovery: "Psoriasis is typically long-term and managed rather than cured.",
    faqs: [{ q: "Is psoriasis curable?", a: "There is currently no cure, but many people achieve good control with the right plan." }],
  }),
  make({
    slug: "eczema",
    name: "Eczema (Dermatitis)",
    seoName: "Eczema Treatment",
    aka: ["dermatitis treatment"],
    category: "dermatology",
    concerns: ["skin-conditions"],
    module: "skin",
    prepKind: "medical",
    summary:
      "Assessment and management of itchy, inflamed skin, including atopic and contact dermatitis.",
    overview: [
      "Eczema involves a weakened skin barrier and inflammation, leading to dry, itchy, sometimes cracked skin.",
      "Triggers such as soaps, allergens, sweat and stress can play a role.",
    ],
    intendedFor: ["Persistent itchy or dry patches", "Suspected contact allergy"],
    howItWorks: ["Barrier repair with emollients, trigger avoidance and prescribed anti-inflammatory treatment.", "Patch testing may be suggested for suspected allergy."],
    suitability: ["Infected eczema (weeping, crusting, pain or fever) needs prompt care."],
    risks: ["Topical steroids and other medicines have risks that are explained when prescribed."],
    recovery: "Often a long-term, relapsing condition managed over time.",
    faqs: [{ q: "Will eczema go away?", a: "It may improve or flare over time. Good skin care and treatment plans help control symptoms." }],
  }),
  make({
    slug: "rosacea",
    name: "Rosacea",
    seoName: "Rosacea Treatment",
    category: "dermatology",
    concerns: ["skin-conditions"],
    module: "skin",
    prepKind: "medical",
    summary:
      "A long-term condition causing facial redness, flushing, visible vessels and sometimes acne-like bumps. Management focuses on control and triggers.",
    overview: [
      "Rosacea typically affects the central face and can be triggered by heat, sun, spicy food, alcohol and some skincare.",
      "It can be confused with acne or other conditions, so diagnosis matters.",
    ],
    intendedFor: ["Persistent facial redness or flushing", "Bumps and pustules without blackheads"],
    howItWorks: ["Topical or oral medicines, gentle skincare and trigger management.", "Light-based treatments may be considered for visible vessels."],
    suitability: ["Eye symptoms (grittiness, redness) should be mentioned, as ocular rosacea may need eye care."],
    risks: ["Some facials, peels and heat-based treatments can aggravate rosacea."],
    recovery: "Long-term condition managed over time.",
    faqs: [{ q: "Can I still have facials?", a: "Some gentle treatments may be suitable once rosacea is controlled. Your clinician will advise." }],
  }),
  make({
    slug: "vitiligo",
    name: "Vitiligo",
    seoName: "Vitiligo Treatment",
    category: "dermatology",
    concerns: ["skin-conditions", "pigmentation"],
    module: "pigment",
    prepKind: "medical",
    summary:
      "A condition in which pigment cells are lost, causing white patches. Management is individual and may aim to stabilise and re-pigment some areas.",
    overview: [
      "Vitiligo results from loss of melanocytes, the cells that produce pigment. It is not contagious.",
      "Response to treatment varies by type, location and duration, and some areas respond poorly.",
    ],
    intendedFor: ["Diagnosis of new white patches", "Management of known vitiligo"],
    howItWorks: ["Options may include topical medicines, phototherapy and, for stable disease, selected procedures, decided after assessment."],
    suitability: ["Other conditions can cause light patches, so examination is needed first."],
    risks: ["Each treatment has specific risks, explained before starting."],
    recovery: "Long-term management; re-pigmentation, if it happens, is gradual.",
    faqs: [{ q: "Can vitiligo be cured?", a: "There is no guaranteed cure. Some people regain pigment with treatment; others aim for stability." }],
  }),

  /* ═══════ Minor procedures & other ═══════ */
  make({
    slug: "wart-removal",
    name: "Wart Removal",
    category: "procedures",
    concerns: ["skin-lesions"],
    prepKind: "procedure",
    summary:
      "Assessment and removal of common warts using methods such as cryotherapy, cautery or topical treatment.",
    overview: [
      "Warts are caused by human papillomavirus (HPV). They may resolve on their own but can persist or spread.",
      "Several sessions are sometimes required and recurrence is possible.",
    ],
    intendedFor: ["Common, plantar and flat warts", "Persistent or uncomfortable warts"],
    howItWorks: ["Cryotherapy freezes the wart; electrocautery or radiofrequency removes it; topical treatments may also be used."],
    suitability: ["Genital warts and atypical lesions need specific medical assessment."],
    risks: ["Pain, blistering, scarring, pigment changes and recurrence."],
    recovery: "Healing usually takes one to two weeks.",
    faqs: [{ q: "Will the wart come back?", a: "Recurrence is possible because the virus can persist in surrounding skin." }],
  }),
  make({
    slug: "mole-assessment-removal",
    name: "Mole Assessment & Removal",
    category: "procedures",
    concerns: ["skin-lesions"],
    prepKind: "procedure",
    summary:
      "Every mole is examined before any removal. Suspicious moles need medical evaluation and may require excision with laboratory examination.",
    overview: [
      "Most moles are harmless, but changes in size, shape, colour or symptoms such as bleeding or itching need prompt medical review.",
      "Cosmetic removal is considered only for lesions assessed as benign.",
    ],
    intendedFor: ["Assessment of new or changing moles", "Removal of benign moles for comfort or appearance"],
    howItWorks: ["Methods include shave excision, radiofrequency or surgical excision. Removed tissue may be sent for histopathology."],
    suitability: ["Suspicious lesions are not removed cosmetically (for example by laser) without diagnosis."],
    risks: ["Scarring, pigment change, infection and recurrence."],
    recovery: "Healing typically takes one to three weeks depending on method.",
    faqs: [{ q: "When should I worry about a mole?", a: "See a doctor for any mole that is new, changing, irregular, bleeding or different from your others." }],
  }),
  make({
    slug: "permanent-makeup",
    name: "Permanent Makeup",
    aka: ["microblading", "eyebrow tattoo"],
    category: "procedures",
    concerns: ["volume"],
    prepKind: "procedure",
    summary:
      "Cosmetic tattooing of pigment into the skin, for example for brows or lip colour. It is long-lasting but fades and can change colour over time.",
    overview: [
      "Pigment is implanted into the upper dermis with fine needles.",
      "Results fade over years and may need touch-ups; removal is difficult.",
    ],
    intendedFor: ["Brow definition", "Lip colour or outline"],
    howItWorks: ["Pigment is deposited in the skin in a planned shape and colour, usually over two appointments."],
    suitability: ["Not suitable during pregnancy, with active skin conditions in the area, or with a tendency to keloids."],
    risks: ["Infection, allergic reaction to pigment, unwanted shape or colour, fading or colour shift, and difficulty with removal."],
    recovery: "Swelling, then scabbing or flaking for about one to two weeks.",
    faqs: [{ q: "Is permanent makeup truly permanent?", a: "It is long-lasting but fades and can change colour, so touch-ups may be needed." }],
  }),

  /* ═══════ Held for high-priority scope review (not rendered) ═══════ */
  ...(
    [
      ["hair-transplant", "Hair Transplant", "hair", "Surgical procedure — confirm surgeon qualifications, facility registration and consent protocols."],
      ["stem-cell-therapy", "Stem Cell Therapy", "hair", "Exact intervention, evidence and regulatory status must be confirmed before any mention."],
      ["black-doll-therapy", "Black Doll Therapy", "pigmentation", "Unclear treatment definition — clinic to supply a clinical description."],
      ["breast-augmentation", "Breast Augmentation", "procedures", "Surgical — verify provider, facility and whether performed at this address."],
      ["liposuction", "Liposuction", "procedures", "Surgical — verify provider, facility and whether performed at this address."],
      ["rhinoplasty", "Rhinoplasty", "procedures", "Surgical — verify provider, facility and whether performed at this address."],
    ] as const
  ).map(
    ([slug, name, category, note]): Treatment => ({
      slug,
      name,
      category,
      concerns: [],
      summary: "",
      overview: [],
      intendedFor: [],
      howItWorks: [],
      suitability: [],
      preparation: [],
      risks: [],
      recovery: "",
      aftercare: [],
      faqs: [],
      published: false,
      review: "pending",
      reviewNote: note,
    }),
  ),
];

export const publishedTreatments = treatments.filter((t) => t.published);
export const unpublishedTreatments = treatments.filter((t) => !t.published);

export const getTreatment = (slug: string) => publishedTreatments.find((t) => t.slug === slug);

export const featuredSlugs = [
  "hydrafacial",
  "skin-boosters",
  "lip-fillers",
  "laser-hair-reduction",
  "anti-wrinkle-injections",
  "chemical-peels",
];
