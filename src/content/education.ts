import type { ModuleId } from "./treatments";

/** Parameters the procedural skin scene understands. All optional. */
export interface SkinState {
  /** 0–1: separates the three layers vertically for clarity. */
  explode?: number;
  /** Hair colour across follicles. "mixed" shows dark and light side by side. */
  hairTone?: "dark" | "mixed" | "light";
  /** Show the conceptual light-energy sequence. */
  pulse?: boolean;
  /** Show follicles in different growth phases. */
  phases?: boolean;
  /** 0–1 density of melanin in the basal epidermis. */
  melaninEpi?: number;
  /** 0–1 density of deeper (dermal) pigment. */
  melaninDermal?: number;
  /** Acne: blocked follicle opening. */
  plug?: boolean;
  /** Acne: inflammation around a follicle. */
  inflammation?: boolean;
  /** 0–1 depth of an atrophic scar depression on the surface. */
  scar?: number;
  /** 0.25–1 density of dermal collagen fibres. */
  collagen?: number;
  /** Multiplier for sebaceous gland size. */
  glandScale?: number;
}

export type StructureId =
  | "epidermis"
  | "dermis"
  | "subcutis"
  | "follicle"
  | "shaft"
  | "bulb"
  | "sebaceous"
  | "sweat"
  | "vessels"
  | "collagen"
  | "melanin";

export const structures: Record<StructureId, { label: string; body: string }> = {
  epidermis: {
    label: "Epidermis",
    body: "The thin outer layer of skin. It forms a protective barrier and constantly renews itself as new cells move up from its base and are shed from the surface.",
  },
  dermis: {
    label: "Dermis",
    body: "The thicker middle layer. It contains collagen and elastin fibres for strength and flexibility, plus blood vessels, nerves, glands and hair follicles.",
  },
  subcutis: {
    label: "Subcutaneous tissue",
    body: "The deepest layer, made largely of fat cells. It cushions, insulates and connects the skin to the tissues beneath.",
  },
  follicle: {
    label: "Hair follicle",
    body: "A tube-shaped structure in the skin from which a hair grows. Each follicle cycles independently through growth, transition and resting phases.",
  },
  shaft: {
    label: "Hair shaft",
    body: "The visible part of the hair above the skin. Its colour comes from melanin; darker hair contains more of it.",
  },
  bulb: {
    label: "Hair bulb",
    body: "The base of the follicle, where active hair growth happens during the growth (anagen) phase.",
  },
  sebaceous: {
    label: "Sebaceous gland",
    body: "A gland attached to the follicle that produces sebum, an oily substance that lubricates skin and hair. Sebum and follicle blockage are both involved in acne.",
  },
  sweat: {
    label: "Sweat gland",
    body: "A coiled gland deep in the skin that releases sweat through a duct to the surface, helping regulate body temperature.",
  },
  vessels: {
    label: "Blood vessels",
    body: "A network that supplies oxygen and nutrients to the skin and helps regulate temperature. Visible vessels can be a feature of some skin concerns.",
  },
  collagen: {
    label: "Collagen fibres",
    body: "Structural proteins in the dermis that give skin strength and support. Collagen production gradually declines with age and sun exposure.",
  },
  melanin: {
    label: "Melanin",
    body: "The pigment that gives skin and hair their colour. It is produced by melanocytes at the base of the epidermis and helps protect against UV light.",
  },
};

export interface ModuleStep {
  title: string;
  body: string;
  state: SkinState;
  focus?: StructureId;
}

export interface EducationModule {
  id: ModuleId;
  eyebrow: string;
  title: string;
  intro: string;
  structures: StructureId[];
  steps: ModuleStep[];
  /** Text alternative used by screen readers and the static fallback. */
  textAlternative: string;
}

export const modules: Record<ModuleId, EducationModule> = {
  skin: {
    id: "skin",
    eyebrow: "Educational module · Skin anatomy",
    title: "Understanding your skin",
    intro:
      "Explore a simplified cross-section of skin. Select a structure to learn what it does. This is a conceptual model, not to scale.",
    structures: ["epidermis", "dermis", "subcutis", "follicle", "sebaceous", "sweat", "vessels", "collagen", "melanin"],
    steps: [
      {
        title: "Three main layers",
        body: "Skin is built in layers: the epidermis at the surface, the dermis beneath it, and subcutaneous tissue at the base.",
        state: { explode: 0, collagen: 0.8, melaninEpi: 0.4 },
      },
      {
        title: "Separating the layers",
        body: "Pulling the layers apart shows how each one has a different role — protection, structure and cushioning.",
        state: { explode: 1, collagen: 0.8, melaninEpi: 0.4 },
        focus: "dermis",
      },
      {
        title: "Structures within the dermis",
        body: "Hair follicles, oil and sweat glands, blood vessels and collagen all sit within the dermis. Many treatments act on one or more of these.",
        state: { explode: 0, collagen: 0.8, melaninEpi: 0.4 },
        focus: "follicle",
      },
    ],
    textAlternative:
      "A cross-section diagram of skin showing three layers: the thin epidermis on top with pigment cells at its base, the thicker dermis containing hair follicles, sebaceous glands, a coiled sweat gland, blood vessels and wavy collagen fibres, and the fatty subcutaneous layer beneath.",
  },
  laser: {
    id: "laser",
    eyebrow: "Educational module · Laser hair reduction",
    title: "How laser hair reduction works",
    intro:
      "A step-by-step conceptual sequence. It illustrates the general principle — it is not a simulation of any specific device or a prediction of your results.",
    structures: ["shaft", "follicle", "bulb", "melanin", "epidermis"],
    steps: [
      {
        title: "Hair, follicle and pigment",
        body: "Each hair grows from a follicle in the dermis. The pigment melanin gives the hair its colour and is the target for laser energy.",
        state: { hairTone: "dark", collagen: 0.6, melaninEpi: 0.3 },
        focus: "shaft",
      },
      {
        title: "Light is absorbed by pigment",
        body: "Controlled pulses of light pass into the skin. Melanin in the hair absorbs the energy and converts it into heat, which can damage the follicle's ability to regrow hair. Cooling helps protect the surface.",
        state: { hairTone: "dark", pulse: true, collagen: 0.6, melaninEpi: 0.3 },
        focus: "bulb",
      },
      {
        title: "Why hair colour matters",
        body: "Dark hair absorbs more energy than light, grey or red hair. Skin pigment also absorbs energy, which is why settings are matched to skin type and why responses differ between people.",
        state: { hairTone: "mixed", pulse: true, collagen: 0.6, melaninEpi: 0.5 },
        focus: "melanin",
      },
      {
        title: "Why several sessions are needed",
        body: "Follicles cycle through growth (anagen), transition (catagen) and resting (telogen) phases. Only follicles in the growth phase respond well, so sessions are spaced to reach more follicles over time.",
        state: { hairTone: "dark", pulse: true, phases: true, collagen: 0.6, melaninEpi: 0.3 },
        focus: "follicle",
      },
    ],
    textAlternative:
      "Conceptual sequence: a skin cross-section with hair shafts growing from follicles. Light energy enters from above and is absorbed by pigmented hair, warming the hair bulb. Dark hairs absorb more than light hairs. Follicles are shown in different growth phases; only those in the active growth phase respond, which is why multiple sessions are used.",
  },
  pigment: {
    id: "pigment",
    eyebrow: "Educational module · Pigmentation",
    title: "Understanding pigmentation",
    intro:
      "Pigmentation concerns differ in cause and depth. This conceptual model shows why an assessment matters before choosing a treatment. It is not a diagnostic tool.",
    structures: ["melanin", "epidermis", "dermis"],
    steps: [
      {
        title: "Melanin in healthy skin",
        body: "Melanocytes at the base of the epidermis produce melanin, which is passed to surrounding skin cells and helps protect against UV light.",
        state: { melaninEpi: 0.35, collagen: 0.6 },
        focus: "melanin",
      },
      {
        title: "Excess surface pigment",
        body: "Sun exposure, hormones and inflammation can increase melanin in the epidermis. Surface pigment often responds more readily to treatment.",
        state: { melaninEpi: 1, collagen: 0.6 },
        focus: "epidermis",
      },
      {
        title: "Deeper pigment",
        body: "Some pigment sits deeper, in the dermis. Deeper or mixed pigmentation is usually more persistent and needs a cautious approach.",
        state: { melaninEpi: 0.7, melaninDermal: 1, collagen: 0.6 },
        focus: "dermis",
      },
      {
        title: "Why assessment comes first",
        body: "Because causes and depth vary — and some treatments can worsen certain types of pigmentation — a clinician assesses the skin before discussing options. Daily sun protection is part of almost every plan.",
        state: { melaninEpi: 0.7, melaninDermal: 0.6, collagen: 0.6, explode: 0.6 },
      },
    ],
    textAlternative:
      "Conceptual cross-section showing pigment granules: a light scattering of melanin at the base of the epidermis in normal skin, a dense band of surface pigment, and pigment deeper in the dermis. A final view separates the layers to show that pigment depth varies.",
  },
  acne: {
    id: "acne",
    eyebrow: "Educational module · Acne & scarring",
    title: "How acne forms — and why scars differ",
    intro:
      "A simplified view of the follicle and oil gland. It explains general concepts, not your individual skin.",
    structures: ["follicle", "sebaceous", "epidermis", "dermis", "collagen"],
    steps: [
      {
        title: "The follicle and oil gland",
        body: "Each follicle has a sebaceous gland that produces sebum. Normally, sebum flows to the surface along the hair.",
        state: { collagen: 0.8, glandScale: 1 },
        focus: "sebaceous",
      },
      {
        title: "Blocked pore",
        body: "Increased oil and sticky skin cells can block the follicle opening, forming a comedone (blackhead or whitehead).",
        state: { collagen: 0.8, glandScale: 1.5, plug: true },
        focus: "follicle",
      },
      {
        title: "Inflammation",
        body: "Bacteria and trapped sebum can trigger inflammation in and around the follicle, causing red, tender spots. Deeper inflammation carries a higher risk of scarring.",
        state: { collagen: 0.8, glandScale: 1.5, plug: true, inflammation: true },
        focus: "dermis",
      },
      {
        title: "Atrophic scarring",
        body: "When inflammation damages collagen, the surface can heal with a depression. Scar type and depth influence which treatments may help, which is why each person is assessed individually.",
        state: { collagen: 0.45, scar: 1 },
        focus: "collagen",
      },
    ],
    textAlternative:
      "Conceptual cross-section of a follicle and sebaceous gland. In sequence: normal sebum flow, a plug blocking the follicle opening with an enlarged gland, a red zone of inflammation around the follicle, and finally a depressed scar on the surface with reduced collagen beneath.",
  },
  collagen: {
    id: "collagen",
    eyebrow: "Educational module · Skin ageing & collagen",
    title: "Collagen and skin support",
    intro:
      "This model illustrates general skin anatomy. It does not show the effect of any specific treatment, and no treatment reverses ageing.",
    structures: ["collagen", "dermis", "epidermis", "subcutis"],
    steps: [
      {
        title: "A supportive network",
        body: "In the dermis, collagen and elastin fibres form a network that gives skin strength, firmness and recoil.",
        state: { collagen: 1 },
        focus: "collagen",
      },
      {
        title: "Gradual change over time",
        body: "With age and cumulative sun exposure, collagen production slows and fibres become fewer and less organised. The dermis thins, which contributes to fine lines and laxity.",
        state: { collagen: 0.35 },
        focus: "dermis",
      },
      {
        title: "What treatments aim to do",
        body: "Some treatments aim to stimulate the skin's own repair response or to support hydration. Responses are gradual, vary between people, and are discussed realistically at consultation.",
        state: { collagen: 0.65, explode: 0.5 },
      },
    ],
    textAlternative:
      "Conceptual skin cross-section in which the dermis is filled with dense wavy collagen fibres, then fewer, sparser fibres representing age-related change, then a separated view of the layers.",
  },
  hair: {
    id: "hair",
    eyebrow: "Educational module · Hair & scalp",
    title: "The hair growth cycle",
    intro: "A simplified scalp cross-section showing how follicles grow, rest and shed. Conceptual and not to scale.",
    structures: ["follicle", "bulb", "shaft", "sebaceous", "vessels"],
    steps: [
      {
        title: "Follicles and blood supply",
        body: "Each hair grows from a bulb at the base of the follicle, nourished by nearby blood vessels.",
        state: { hairTone: "dark", collagen: 0.6 },
        focus: "bulb",
      },
      {
        title: "Growth, transition and rest",
        body: "Follicles cycle independently: a long growth phase (anagen), a short transition (catagen), and a resting phase (telogen) before the hair sheds and a new one begins.",
        state: { hairTone: "dark", phases: true, collagen: 0.6 },
        focus: "follicle",
      },
      {
        title: "Why diagnosis matters",
        body: "Thinning can result from genetics, hormones, nutrition, stress, medicines or scalp conditions. Identifying the cause guides which options may be appropriate.",
        state: { hairTone: "mixed", phases: true, collagen: 0.6 },
      },
    ],
    textAlternative:
      "Conceptual scalp cross-section with hair follicles, bulbs, sebaceous glands and blood vessels. Follicles are shown in growth, transition and resting phases at different depths.",
  },
};
