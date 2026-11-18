import type { ModuleId } from "./treatments";

export interface Article {
  slug: string;
  title: string;
  description: string;
  module?: ModuleId;
  related: string[];
  updated: string;
  /** Only verified people may be named. Null until the clinic supplies an approved reviewer. */
  reviewer: null | { name: string; credentials: string };
  sections: { heading: string; paragraphs?: string[]; list?: string[] }[];
}

export const articles: Article[] = [
  {
    slug: "how-laser-hair-reduction-works",
    title: "How laser hair reduction works",
    description: "The principle behind laser hair reduction, why results differ between people, and why several sessions are usually needed.",
    module: "laser",
    related: ["laser-hair-reduction"],
    updated: "2026-10-16",
    reviewer: null,
    sections: [
      {
        heading: "The basic principle",
        paragraphs: [
          "Laser hair reduction relies on a principle called selective photothermolysis: light of a particular wavelength is absorbed by a particular target — here, the pigment melanin in the hair — and converted into heat.",
          "When enough heat reaches the hair follicle, it can reduce the follicle's ability to grow a new hair. Surrounding skin is protected by cooling and by settings chosen for the person's skin type.",
        ],
      },
      {
        heading: "Why results vary",
        list: [
          "Hair colour: dark hair contains more melanin and usually responds better than blonde, red, grey or white hair.",
          "Skin type: skin pigment also absorbs light, so settings need to be adjusted for darker skin types to reduce risk.",
          "Hormones: conditions such as PCOS can stimulate new hair growth and may need medical management alongside treatment.",
          "Area treated and hair thickness.",
        ],
      },
      {
        heading: "Why several sessions are needed",
        paragraphs: [
          "Each follicle cycles through phases of growth (anagen), transition (catagen) and rest (telogen). Laser energy affects follicles in the growth phase most effectively, and at any one time only a proportion of follicles are in that phase. Spacing sessions over weeks allows more follicles to be treated during growth.",
        ],
      },
      {
        heading: "Realistic expectations",
        paragraphs: [
          "The aim is a long-term reduction in hair, not guaranteed permanent removal. Some regrowth is common, and maintenance sessions may be suggested. Your clinician will explain likely benefits, risks such as burns or pigment change, and alternatives.",
        ],
      },
    ],
  },
  {
    slug: "understanding-pigmentation",
    title: "Understanding pigmentation",
    description: "What pigmentation is, why it differs between people, and why assessment matters before choosing a treatment.",
    module: "pigment",
    related: ["chemical-peels", "laser-toning", "cosmelan-peel", "photofacial"],
    updated: "2026-10-16",
    reviewer: null,
    sections: [
      {
        heading: "What causes pigmentation?",
        paragraphs: [
          "Skin colour comes from melanin, produced by cells called melanocytes. Sun exposure, hormonal changes, inflammation (for example after acne), some medicines and genetics can all increase melanin in certain areas.",
        ],
      },
      {
        heading: "Common types",
        list: [
          "Sun-related spots (solar lentigines).",
          "Melasma — often symmetrical patches linked with hormones and sun, and prone to recurrence.",
          "Post-inflammatory hyperpigmentation — marks left after acne, injury or irritation.",
          "Other conditions that need medical diagnosis, including changes in moles.",
        ],
      },
      {
        heading: "Why depth matters",
        paragraphs: [
          "Pigment near the surface (epidermal) often responds more readily than pigment deeper in the dermis. Many people have a mixture. Some treatments that generate heat can worsen certain pigmentation, particularly melasma and in darker skin types.",
        ],
      },
      {
        heading: "Sun protection is part of every plan",
        paragraphs: [
          "Daily broad-spectrum sunscreen, shade and protective clothing help reduce recurrence. Your clinician will discuss options such as topical treatments, peels or lasers only after assessing your skin.",
        ],
      },
    ],
  },
  {
    slug: "what-are-dermal-fillers",
    title: "What are dermal fillers?",
    description: "A balanced introduction to hyaluronic acid fillers: what they are, how they are used, their limitations and risks.",
    module: "collagen",
    related: ["dermal-fillers", "lip-fillers", "jawline-contouring"],
    updated: "2026-10-16",
    reviewer: null,
    sections: [
      {
        heading: "What they are",
        paragraphs: [
          "Most dermal fillers are injectable gels made from hyaluronic acid (HA), a sugar molecule that occurs naturally in the body. Different HA products vary in firmness and are chosen for different areas and depths.",
        ],
      },
      {
        heading: "How they are used",
        paragraphs: [
          "Fillers add volume where they are placed. They may be used for areas affected by volume loss, folds, or to change contour. The effect is temporary because HA is gradually broken down by the body.",
        ],
      },
      {
        heading: "Risks to understand",
        list: [
          "Common: swelling, bruising, tenderness and lumps.",
          "Less common: infection, delayed inflammatory reactions and migration.",
          "Rare but serious: blockage of a blood vessel, which can damage skin and very rarely affect vision. Injectors should be trained to recognise and manage this.",
        ],
      },
      {
        heading: "Is it right for you?",
        paragraphs: [
          "A consultation should cover your goals, medical history, facial anatomy, alternatives (including no treatment), costs, risks and aftercare. Sometimes the appropriate advice is not to treat.",
        ],
      },
    ],
  },
  {
    slug: "sensitive-skin-and-aesthetic-treatments",
    title: "Facial aesthetic treatments and sensitive skin",
    description: "What 'sensitive skin' can mean, which factors are assessed, and how treatment choices may be adapted.",
    module: "skin",
    related: ["hydrafacial", "skin-boosters", "rosacea", "eczema"],
    updated: "2026-10-16",
    reviewer: null,
    sections: [
      {
        heading: "Sensitive skin isn't one condition",
        paragraphs: [
          "People describe skin as sensitive when it stings, burns, reddens or reacts easily. It can be linked to a weakened skin barrier, conditions such as rosacea or eczema, allergies, or overuse of active products.",
        ],
      },
      {
        heading: "What a clinician looks at",
        list: [
          "Any underlying diagnosis, such as rosacea, eczema or contact allergy.",
          "Current and recent products, including retinoids and acids.",
          "Previous reactions to treatments or ingredients.",
          "Skin type and history of pigmentation after irritation.",
        ],
      },
      {
        heading: "How plans may be adapted",
        paragraphs: [
          "Options may include treating the underlying condition first, patch testing, gentler settings, longer intervals or choosing a different approach altogether. Not every treatment will be suitable.",
        ],
      },
    ],
  },
  {
    slug: "understanding-chin-and-profile",
    title: "Understanding chin shape and facial profile",
    description: "What shapes the chin and jawline, and the range of non-surgical and surgical options that may be discussed.",
    related: ["jawline-contouring", "dermal-fillers", "jawline-slimming"],
    updated: "2026-10-16",
    reviewer: null,
    sections: [
      {
        heading: "What shapes the chin",
        paragraphs: [
          "Chin and jaw shape reflect bone structure, teeth and bite, muscle (including the masseter), fat distribution and skin. Changes with age can also alter profile.",
        ],
      },
      {
        heading: "Options that may be discussed",
        list: [
          "Hyaluronic acid filler to change projection or definition temporarily.",
          "Botulinum toxin for an enlarged masseter muscle, where width is muscular.",
          "Referral for dental, orthodontic or surgical opinion where bite or bone structure is the main factor.",
        ],
      },
      {
        heading: "Setting expectations",
        paragraphs: [
          "Non-surgical options produce temporary, individual results and carry risks. Assessment helps identify which factor is driving the concern and whether treatment is appropriate.",
        ],
      },
    ],
  },
  {
    slug: "questions-to-ask-at-a-consultation",
    title: "Questions to ask at an aesthetic consultation",
    description: "A practical checklist to help you make an informed decision about any skin or aesthetic treatment.",
    related: [],
    updated: "2026-10-16",
    reviewer: null,
    sections: [
      {
        heading: "About the person treating you",
        list: [
          "What are your qualifications and registration, and who will perform the treatment?",
          "How often do you perform this treatment, and how would you manage a complication?",
        ],
      },
      {
        heading: "About the treatment",
        list: [
          "What is this treatment, and what evidence supports it for my concern?",
          "What results are realistic for me, and how long do they last?",
          "How many sessions might I need, and what is the total cost?",
          "What products or devices will be used, and are they approved for this use?",
        ],
      },
      {
        heading: "About risks and alternatives",
        list: [
          "What are the common and the serious risks?",
          "What are the alternatives, including doing nothing?",
          "What is the recovery time, and what aftercare is needed?",
          "Whom do I contact if I have a concern after treatment?",
        ],
      },
      {
        heading: "Take your time",
        paragraphs: ["You should never feel pressured to decide on the day. It's reasonable to take written information home and return with further questions."],
      },
    ],
  },
];

export const getArticle = (slug: string) => articles.find((a) => a.slug === slug);

/** The article that covers the same topic as a 3D guide (same title), if any — that guide canonicalises to it. */
export const articleForModule = (id: string) => {
  const titles: Record<string, string> = { laser: "how-laser-hair-reduction-works", pigment: "understanding-pigmentation" };
  return titles[id] ? getArticle(titles[id]) : undefined;
};
