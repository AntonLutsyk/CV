# Anton Lutsyk — Design System

Personal digital identity for **Anton Lutsyk, UX/UI Designer** (2+ years; web & mobile; B2B, SaaS, e-commerce, mobile products). One surface: the **portfolio / interactive résumé website**. The system is editorial, Swiss-leaning and typographic — typography is the image. Target feeling: *"Independent digital designer with a strong visual point of view."* Not a CV template, not a SaaS landing page.

## Sources
- Brief supplied by the user (palette, fonts, section system, component list, motion list). No codebase, Figma or brand assets were provided.
- Reference direction only (principles extracted, nothing copied): https://yavorovskyiartem.com/ (curly-brace metadata like `{ Digital designer }`, `/` separated nav, `Project: Service: Industry: Year:` index columns, numbered services) and https://jackygrob.com/ (`/ 001` discipline numbering, `/Content` `/Social` footer column labels, Type / Context / Date project metadata).
- **No logo exists.** The wordmark is the name set in Manrope ExtraBold. Do not draw a mark.

## Index
- `styles.css` — entry; `@import`s only.
- `tokens/` — `fonts.css` (Google Fonts import), `colors.css`, `typography.css`, `spacing.css`, `motion.css` (+ keyframes), `base.css` (element defaults, `.al-grid`, `.al-container`, `.al-label`, `.al-serif`).
- `components/components.css` — all component class styles (prefix `al-`).
- `components/` — React primitives (see list). Each has `.jsx`, `.d.ts`, `.prompt.md`; one `*.card.html` per folder.
- `guidelines/` — foundation specimen cards (Colors, Type, Spacing, Brand).
- `ui_kits/portfolio/` — interactive website recreation (Home, Work index, Case study).
- `thumbnail.html`, `SKILL.md`.

## Components
Namespace: `window.AntonLutsykDesignSystem_0097c3`.
- **navigation/** — `Header`, `Navigation`, `Footer`
- **type/** — `SectionLabel`, `DisplayHeading`, `BodyText`, `Metadata`
- **actions/** — `Button`, `TextLink`
- **lists/** — `ProjectRow`, `ExperienceRow`, `SkillList`, `Stat`
- **media/** — `ImagePreview`, `Marquee`
- **layout/** — `ContactBlock`
- **icon/** — `Icon`

Intentional additions: `Icon` — a thin wrapper that inlines Lucide SVGs so they inherit `currentColor` and a 1.5 stroke (the brief mandates Lucide only).

Starting points: Header, ProjectRow, ContactBlock.

---

## CONTENT FUNDAMENTALS
- **Voice:** first person, singular, quiet confidence. "I design products that feel obvious in hindsight." Never "we", never agency-speak. Address the reader as "you" only in CTAs ("Let's talk").
- **Length:** short. Headlines 2–6 words, split into deliberate lines. Paragraphs 2–4 sentences. If it can be a label, make it a label.
- **Casing:** sentence case for headlines, buttons and links ("All projects", "Download CV"). UPPERCASE only for technical labels/metadata at 11–12px with +0.08em tracking.
- **Technical metadata layer:** `{ ABOUT }` braces for tags; `01 / INTRO` for section openers; `/ 001` for sub-groups; `(06)` for counts; `/Index`, `/Social` for footer columns; `Fig. 01` for captions; `2024 — Now` with spaced em dash for ranges; `©26` as wordmark superscript.
- **Canonical sections:** 01 / Intro · 02 / Experience · 03 / Expertise · 04 / Skills · 05 / Education · 06 / Contact. Selected work sits between Intro and Experience under `{ SELECTED WORK }`.
- **Serif accent:** one word per headline in Instrument Serif italic, usually the emotional or qualifying word: "something *precise.*", "products *with* intent."
- **Disciplines vocabulary:** UX/UI Design, Product Design, Web Design, Mobile App Design, B2B & SaaS, Design Systems, Prototyping, Responsive Design.
- **No emoji. No exclamation marks. No buzzwords** ("passionate", "pixel-perfect", "innovative", "synergy"). No vanity stats — only numbers that are true (2+ years).
- Examples: hero "Anton / Lutsyk" + lead "Independent digital designer with a strong visual point of view — designing B2B, SaaS, e-commerce and mobile products." · CTA "Let's talk" · contact "Let's build something precise." · status "Available for projects".

## VISUAL FOUNDATIONS
- **Colour:** warm off-white paper `#F4F3EF`, near-black ink `#111111`, stone `#6B6B67` secondary text, line `#D8D7D1` hairlines, acid lime `#B8FF3D` accent. ~90% paper/ink, lime ≤2% of any view. Lime is used for: section-number chips, hover sweeps behind text, status dots, active nav dot, button fill on hover, link hover on ink. **Never lime text on paper** (no contrast) — lime always carries ink text or sits on ink.
- **Inverse:** `.al-inverse` scope flips to ink surfaces (footer, mobile menu, occasional marquee band). Lime text is allowed only here.
- **Type:** Manrope 400–800 does everything; display at 800 with very tight tracking (−0.055 to −0.07em) and line-height 0.82–0.95; headings 700. Instrument Serif italic is an accent only (one word, suffixes like "+"). Labels: 12px 600 uppercase +0.08em. Fluid sizes with `clamp()` from 390px to 1760px. Oversized type is allowed to run near the viewport edges; the name in the hero is ~17vw.
- **Grid & layout:** 12 columns, fluid gutter (12–28px) and margin (20–64px). Strong left edge; labels live in cols 1–3, content starts at col 4 or 7 → asymmetric compositions. Full-bleed bands (marquee, footer) alternate with constrained content. Generous vertical rhythm: 96–224px between sections.
- **Backgrounds:** flat paper. No gradients, no textures, no blobs, no glass. The only pattern is a faint 135° hatch for empty image slots.
- **Imagery:** product screens and portraits; neutral/warm colour; portraits may be greyscale until hover (`hover="mono"`). Square corners, no frames, no device-mockup clichés unless real.
- **Borders:** 1px hairlines in `--border` separate rows; a 1px ink rule (`--border-strong`) opens a section or group. Rows are separated by lines, not boxes.
- **Corners:** 0 everywhere. The only round shapes are 6–8px status/indicator dots.
- **Shadows / elevation:** none. Depth comes from type scale and ink/paper inversion.
- **Cards:** there are no cards. Content is rows, columns and figures on the page.
- **Transparency & blur:** not used (except the faint placeholder hatch). Header is solid paper.
- **Motion:** slow, expo-out (`cubic-bezier(.16,1,.3,1)`), 600–1400ms. Masked line rise for headings (90ms stagger); section numbers roll up; images clip-reveal upward then zoom 1.045 on hover; cursor-following 4:3 project preview (lerp 0.14) with centre clip reveal; magnetic buttons (22–32% pull); marquees 40–60s/loop, pause on hover; scroll drift on hero lines (alternating directions); footer wordmark letters rise 40ms apart. No bounces, no springs, no spinning. Respect `prefers-reduced-motion`.
- **Hover:** underline wipes left→right (nav); lime sweeps behind text (links, email); buttons fill lime from the bottom and the arrow turns 45°; project rows nudge right, number chips go lime, siblings dim to `--fg-3`; experience rows draw an ink hairline across the top.
- **Press / focus:** no shrink. Focus is a 1px ink outline offset 3px (lime on ink).
- **Fixed elements:** sticky header only.
- **Mobile (≤900px):** keep the character — giant name still bleeds, labels stack above content, header becomes "Menu +" with a full-screen ink overlay of 44px+ numbered links; project rows show inline 16:10 thumbnails instead of cursor previews.

## ICONOGRAPHY
- **Lucide only**, via `lucide-static@0.469.0` on unpkg (falls back to `@latest`), inlined by `Icon` so stroke = `currentColor`, default stroke-width 1.5 (thin), sizes 14–22px.
- Core set: `arrow-up-right` (default CTA / external), `arrow-right`, `arrow-down` (scroll), `arrow-up` (to top), `arrow-left` (back), `plus` / `x` (menu), `copy` / `check`, `mail`, `download`, `map-pin`.
- Icons are functional, never decorative; never in coloured circles or boxes; never lime on paper.
- No emoji. Unicode used typographically only: `/`, `—`, `©`, `{ }`, `( )`.
- No icon font, no PNG icons, no custom illustrations.

## Fonts
Manrope and Instrument Serif are loaded from Google Fonts (`tokens/fonts.css`). No font binaries are shipped in the project — supply licensed `.woff2` files if self-hosting is required.
