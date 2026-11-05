# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
Two audiences, weighted equally:
- **Hiring side**: recruiters, HR and design leads assessing Anton for a product/UX role. They scan fast: who he is, where he worked, what he shipped, how to get the CV.
- **Freelance clients**: founders and teams looking for a designer for a web or mobile project. They look at the work, judge fit, then make contact.

Both arrive from a link (LinkedIn, Behance, Telegram, a CV) and usually spend a minute or two, often on a phone.

## Product Purpose
Personal portfolio and résumé of Anton Lutsyk, a UX/UI designer and frontend developer (HTML, CSS, React) based in Ukraine. Success is a visitor who understands his range within the first screens and then either downloads the CV or writes to him.

## Positioning
A designer who makes digital products for B2B, SaaS and e-commerce, across web and mobile, and who designs and codes his own concept sites (design and frontend by Anton) (CATE, NORDHAUS, FORME, Verona GT are live on GitHub Pages). The site itself is evidence of craft: a 3D figure of Anton, motion, and a custom design system.

## Operating Context
- Single static page, deployed as static files (GitHub Pages style, `.nojekyll` present).
- Authored in Claude Design: `index.html` is a `.dc.html` document rendered at runtime by `support.js` with React 18 from unpkg; components come from the "Anton Lutsyk" design system in `_ds/`.
- 3D figure (`al-avatar-glb`, three.js from esm.sh) loads `assets/anton.glb`.

## Capabilities and Constraints
- Sections: Intro, Experience (expandable rows), Expertise, Selected work (sticky scroll stage, 4 projects), About, Skills, Education, Contact, Footer.
- Contact paths: email (with copy button), LinkedIn, Telegram, Behance; CV download at `assets/Anton-Lutsyk-CV.pdf`.
- **Binding:** the 3D figure stays as the hero's central element.
- Site language: English.
- Undecided: whether to move off the Claude Design runtime to a prebuilt static bundle.

## Brand Commitments
- Name and logo: "Anton Lutsyk" wordmark (`assets/logo.png` / `logo.webp`).
- Real identity facts: based in Ukraine, available for work, email antonlut737@gmail.com, handles linkedin.com/in/lutsykanton, t.me/antonlutsyk, behance.net/antonlutsyk.

## Evidence on Hand
- Work history: Web Art Work (freelance, Sep 2023 — present), N1 Agency (Sep 2025 — Aug 2026), HebronSoft (practice, Sep 2024 — Jul 2025).
- Education: KPNU named after Ivan Ohienko (Master's, Computer Science, 2019–2025); Hebron Academy of New Technologies (UX/UI certificate, 2024).
- Four live projects with screenshots in `assets/shot-*.webp`; portrait `assets/portrait.jpg`; CV PDF.
- No testimonials, client logos, metrics or awards exist. Do not invent them.

## Product Principles
1. The work leads: projects and experience must be reachable and legible in seconds.
2. Two exits always close at hand: write to Anton, or take the CV.
3. Craft is the proof: the site's own quality argues for hiring him, so no rough edges.
4. Facts only: every claim on the page is something Anton actually did.

## Accessibility & Inclusion
WCAG 2.2 AA as the target; respect `prefers-reduced-motion`; works on phones from 375px.
