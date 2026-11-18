# AI image prompt pack — The LUXE Clinique

Generate each image below in **ChatGPT (GPT-image)**, **Google Gemini / Imagen**, **Midjourney** or **Adobe Firefly**. Then save it into `public/images/` with the **exact file name** shown (`.webp`, `.jpg` or `.png` all work).

Rebuild or restart the site (`npm run build && npm start`, or just refresh while `npm run dev` runs) and each image replaces its line-art placeholder automatically. The site labels every AI image **"Illustrative image"**, so it is never mistaken for a real client, result or the clinic's own staff.

---

## 1. How to use these prompts

1. Copy the **Shared style** block and paste it at the *end* of every prompt.
2. Set the aspect ratio shown. In Midjourney add `--ar 4:5 --style raw --v 7`; in ChatGPT or Gemini write "portrait 4:5" (or "landscape 3:2").
3. Generate 3–4 options and keep the most natural one: real skin texture, relaxed expression, no plastic look.
4. Export at least **1600 px on the long edge**. Larger is fine; the site resizes automatically.

### Shared style (append to every prompt)

> Editorial luxury beauty photography, shot on a medium-format camera with an 85 mm lens, soft diffused natural window light, a blush pink, ivory and champagne colour palette with subtle deep burgundy accents, natural skin texture with visible pores and no heavy retouching, calm and serene mood, shallow depth of field, clean minimal composition with generous negative space, high-end skincare campaign aesthetic, photorealistic, 8k detail.

### Avoid (negative prompt — Midjourney `--no`, Firefly "exclude", or write "Do not include:")

> text, logos, watermarks, brand names, needles or syringes touching skin, blood, redness, medical gowns, hairnets, blue surgical gloves, hospital equipment, before-and-after layouts, split screens, children, plastic or over-smoothed skin, heavy makeup, harsh flash, cluttered background, extra fingers, distorted hands.

### Rules (compliance)
- No before/after or "results" images, and no images implying a guaranteed outcome.
- Don't make images look like the clinic's own clients, doctors or premises. AI is for mood and illustration only.
- Show adults only, with Indian / South Asian skin tones represented naturally and respectfully.
- Real-only slots (clinic interior, team, rooms, products, entrance) must use genuine photographs. **Do not generate those.**

---

## 2. Homepage

### H1 · Hero — `home-hero.webp` · portrait 4:5
> Close-up editorial beauty portrait of a serene South Asian woman in her late twenties, eyes gently closed, head tilted slightly upward, luminous dewy skin with natural texture and a few soft freckles, dark hair smoothly swept back into a low bun, bare shoulders softly draped in an ivory silk wrap, a single blush-pink peony resting near her collarbone, seamless blush-to-champagne backdrop with a soft circular glow of light behind her head, gentle window light from the left creating a soft highlight on the cheekbone, minimal makeup with a soft rose lip, a thin deep-burgundy satin ribbon curling at the lower edge of the frame. *(+ Shared style)*

### H2 · Philosophy — `home-editorial.webp` · portrait 4:5
> Intimate beauty close-up of a woman's hands with natural nude manicured nails gently pressing a few drops of glowing serum onto her cheek, her face in soft profile with eyes closed and a calm half-smile, warm golden-hour window light, sheer ivory curtain blurred in the background, a glass dropper bottle with a burgundy cap softly out of focus in the foreground. *(+ Shared style)*

### H3 · Your journey — `home-consultation.webp` · landscape 3:2
> A calm, elegant beauty lounge: two women seated on a blush velvet sofa sharing a relaxed conversation over cups of tea, shot from the side so faces are softly turned away or partly out of frame, one holding a small notebook, fresh white and pink flowers on a marble side table, arched ivory wall with a soft burgundy accent, warm natural light. *(+ Shared style)*

---

## 3. Treatment categories (cards, menu and treatment pages)

These appear in 4:5 arch frames and 4:3 cards, so **generate 4:5 with the subject centred**. The site crops gracefully.

### C1 · Facials & Glow — `cat-skin.webp`
> A woman lying back relaxed with eyes closed receiving a luxurious hydrating facial, a translucent pale-pink gel mask being smoothed across her cheek with a soft fan brush, ivory towel wrapped neatly around her hair, rose petals and a small glass bowl of serum on a marble ledge beside her, soft overhead window light. *(+ Shared style)*

### C2 · Lips, Lines & Contours — `cat-injectables.webp`
> Elegant side-profile portrait of a South Asian woman with a defined natural jawline and softly full natural lips, chin slightly raised, hair tied back, a single pearl earring, warm side light sculpting the cheekbone and jaw, blush backdrop. No needles, no marks. *(+ Shared style)*

### C3 · Laser & Light — `cat-laser.webp`
> Beauty close-up of smooth, even-toned legs of a woman reclining on an ivory chaise, a sleek modern white handheld beauty device with a soft rose-gold ring resting on a folded towel beside her, soft diffused daylight with a gentle halo of light. No beams or lasers visible. *(+ Shared style)*

### C4 · Tone & Radiance — `cat-pigmentation.webp`
> Macro beauty shot of a single golden drop of serum falling from a glass dropper towards luminous, even, natural cheek skin with visible fine texture, soft bokeh of blush light in the background, a refracting highlight in the droplet. *(+ Shared style)*

### C5 · Hair & Scalp — `cat-hair.webp`
> Back view of a woman with long, glossy, healthy dark hair caught mid-swish, strands catching warm rim light, blush-to-champagne background, ivory satin top. *(+ Shared style)*

### C6 · Skin Health — `cat-dermatology.webp`
> Close-up of two hands smoothing a rich ivory moisturiser onto the back of one hand, a few white chamomile flowers and a frosted glass jar with a burgundy lid on a marble surface, soft morning light. *(+ Shared style)*

### C7 · Finishing Touches — `cat-procedures.webp`
> Elegant still life on white marble: fine brow artistry pencils and brushes, a small palette of soft brown pigments, a pink peony and a folded ivory linen napkin, top-down soft daylight, luxurious minimal styling. *(+ Shared style)*

### C8 · Patient information — `patient-info.webp` · landscape 3:2
> Still life on a marble table: an open notebook with a pen, a cup of herbal tea, a small vase of blush roses and a pair of reading glasses, soft window light and gentle shadows, calm and inviting. No readable text. *(+ Shared style)*

---

## 4. Optional — individual treatment images

If present, these override the category image for that treatment's card and page. Generate 4:5, centred.

| File name | Prompt (add the Shared style) |
|---|---|
| `treatment-hydrafacial.webp` | A relaxed woman with eyes closed during a hydrating facial, a sleek translucent facial wand gliding across her cheek, fine mist in the air, ivory towels, blush tones. |
| `treatment-skin-boosters.webp` | Close-up of radiant, plump, naturally textured cheek skin catching soft light, a cluster of tiny glistening hydration droplets on the skin, blush backdrop. |
| `treatment-lip-fillers.webp` | Close-up beauty shot of soft, naturally full lips with a sheer rose balm, relaxed mouth, natural skin texture around the lips, warm light. |
| `treatment-laser-hair-reduction.webp` | Smooth underarm and shoulder of a woman with her arm raised gracefully, ivory silk draped over the shoulder, soft clean light, a sleek white beauty device blurred in the foreground. |
| `treatment-anti-wrinkle-injections.webp` | Serene portrait of a woman in her late thirties with soft natural expression lines, relaxed brow, minimal makeup, warm window light, elegant and ageless mood. |
| `treatment-chemical-peels.webp` | A soft fan brush applying a clear glistening liquid peel across a woman's forehead, eyes closed, ivory headband, small glass bowl on marble, gentle light. |

---

## 5. Checklist

- [ ] File names match exactly (lower-case, hyphens).
- [ ] No text, logos, needles, gloves, hairnets or before/after layouts.
- [ ] Hands and fingers look natural (regenerate if not).
- [ ] Skin looks real, not plastic.
- [ ] Rebuilt the site, and each image shows the "Illustrative image" label.
