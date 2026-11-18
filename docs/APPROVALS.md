# Unresolved content, clinical and legal approvals

Nothing on this site should go live until the items marked **Blocker** are
resolved. This list is an editorial checklist, not legal advice.

## 1. Clinical review (Blocker)
- [ ] A qualified, registered medical practitioner reviews **every treatment page** in `src/content/treatments.ts` (all 33 are marked `review: "pending"`), including risks, suitability and aftercare wording.
- [ ] Clinician reviews the **six 3D educational modules** and their step text (`src/content/education.ts`): skin anatomy, laser hair reduction, pigmentation, acne & scarring, collagen, hair cycle.
- [ ] Clinician reviews the **six articles** (`src/content/articles.ts`); add an approved reviewer name and credentials to each (`reviewer` field) — currently shown as "Clinical review pending".
- [ ] Confirm each listed treatment is **actually offered**, by whom, and within that practitioner's legal scope.

## 2. Services held back (not rendered)
The compliance screening flagged these for high-priority scope review. They exist in data with `published: false`:
- [ ] Hair Transplant — surgeon qualifications, facility registration, consent protocol.
- [ ] Stem Cell Therapy — exact intervention, evidence and regulatory status.
- [ ] Black Doll Therapy — clinic to supply a clinical definition.
- [ ] Breast Augmentation, Liposuction, Rhinoplasty — surgical provider, facility, and whether performed at this address.

To publish one: write full content and set `published: true`.

## 3. Facts to verify (Blocker)
- [ ] **Phone numbers**: both +91 89202 19690 and +91 88828 33050 appear on different pages of the old site. Confirm which are current (`src/content/site.ts`).
- [ ] **WhatsApp number**: assumed to be +91 89202 19690.
- [ ] **Email** luxecliniqueaesthetics@gmail.com is active and monitored.
- [ ] **Opening hours**: not in the source content; the site currently says "Please call to confirm opening hours."
- [ ] **Address and directions** (Preet Vihar Metro Gate No. 3, Mother Dairy landmark omitted pending verification).
- [ ] Registered legal entity name and any registrations required on the website.

## 4. People & credentials
- [ ] Clinician profiles (About page) are placeholders. Supply names, qualifications and medical council registration numbers to publish. The shoot plan names Dr. Ritika Dhingra; not published because credentials were not supplied.
- [ ] Written consent for any staff photographs.

## 5. Advertising & ethics compliance (Blocker)
- [ ] Review against the **NMC Guidelines on Ethical Advertising and Public Communication (6 October 2026)** and the Indian Medical Council (Professional Conduct, Etiquette and Ethics) Regulations, 2002 as amended.
- [ ] **Testimonials and star ratings removed** from the old homepage pending review; none are used.
- [ ] **No before/after images** are used; the gallery shows clinic photos and labelled educational renders only.
- [ ] Brand names (Profhilo®, Cosmelan®, MD Codes™, ZO Skin Health, Obagi, Heliocare): confirm stock and naming compliance; disclose any commercial relationship for products sold.
- [ ] CTA wording: the brief requested "Book a Consultation". The compliance sheet prefers neutral wording ("Appointment information"). Counsel to decide.
- [ ] Hero headline "Advanced Treatments. Informed Skin Decisions." (from the brief) — confirm "Advanced" is acceptable.

## 6. Privacy & data (Blocker before connecting the form)
- [ ] Draft privacy notice, terms and medical disclaimer (`/legal/*`) reviewed by Indian counsel, including DPDP Act 2023 obligations; fill bracketed placeholders (provider, retention period, grievance officer).
- [ ] Choose and configure the enquiry destination (`ENQUIRY_WEBHOOK_URL`). Until set, production honestly reports that online enquiries are not connected and offers phone/WhatsApp/email.
- [ ] Confirm data-processing terms with the chosen provider; replace the in-memory rate limiter with a shared store if deploying to multiple instances.

## 7. AI-generated imagery
- [ ] Generate images from `docs/AI_IMAGE_PROMPTS.md` and review each for natural hands and skin, no text/logos, and no before/after or results implication.
- [ ] Keep the automatic **"Illustrative image"** label (shown for every AI slot). Never use AI images for the team, rooms, products or entrance.
- [ ] Confirm current NMC guidance permits illustrative AI imagery in clinic communications.
- The earlier stills from the clinic's own videos were removed at the owner's request (archived in `.archive/clinic-stills/`, not published).

## 8. Assets
- [ ] Commission clinic photography per `docs/ASSET_MANIFEST.md`.
- [ ] Optional: commission a realistic GLB of the hero treatment scene (set `NEXT_PUBLIC_HERO_GLB`).
- [ ] Supply an SVG master of the logo.

## Clinic photographs from Google Business Profile

- [x] Confirmed by the clinic (2026-11-01): it owns the four clinic photos
  taken from its Google Business Profile: reception, treatment room,
  consultation room. One appears under a visitor's name on Google Maps.
- [x] Reception signage shows "Dr. Ritika Dhingra's LUXE Skin Clinique" — confirmed
  (2026-11-01) the name may appear on the site.

## About page — founder profile

- [ ] Confirm the founder copy on the About page (name: Dr. Ritika Dhingra; approach text).
- [ ] Add qualifications and medical council registration number once supplied; the page
  currently says these are shared on request and at consultation.
