# Copy queue — original copy for George's review (M1)

Brand rule (audit D3): structure/ids/slugs/prices are reference-parity; ALL prose
is original Lena copy. The items below were generated deterministically at import
(scripts/import-reference.mts) and are ready for George's voice pass via the CMS.
Nothing here copies the reference's marketing text.

## Generated original copy (review priority order)
1. 32 course descriptions + short_descriptions (template: title/category/counts).
   Flagship courses to rewrite first: content-creation-school-2026 (36467),
   digital-skills-fasttrack, copywriting-crash-course, visibility-course.
2. 22 blog post bodies (3-section original explainer per post) + excerpts.
3. 10 book descriptions + 2 preview chapters each (full manuscripts pending U1/U2).
4. 5 community space descriptions (debranded reference factual taglines).
5. 3 membership tier descriptions (conservative standard, D7/U3).
6. Webinar / appointment service / lead magnet / program descriptions.
7. Lesson content: ALL media slots pending (U1) — video/audio/pdf/download files,
   text bodies, quiz questions. Assignment prompts are original generic templates.

## Known placeholders needing George's input
- brand.json whatsapp: +260000000000 (PLACEHOLDER).
- brand.json social links: empty.
- Book 50150 identity (U2): draft slot 'featured-book-50150'.
- Membership tier prices (U3): $29/mo, $290/yr, ZMW 550/5500 — conservative defaults.
- Appointment service price: 0 (free intro call) — reference price unknown (U6).
- Certificate design: original Lena design in M5 (reference design not captured, U8).

## Debranding applied at import
- /savvy\s*pro/gi → "Lena" in every imported title/name/label.
- Reference marketing prose: NOT imported (replaced by generators above).
- Reference image URLs: NOT imported into content (media slots empty; M9 brand scan
  enforces zero reference CDN references in the rendered site).
