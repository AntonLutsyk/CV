---
name: Anton Lutsyk
description: Editorial, Swiss-leaning portfolio where typography is the image.
colors:
  paper: "#F4F3EF"
  paper-2: "#ECEBE6"
  paper-3: "#E3E2DC"
  ink: "#111111"
  ink-2: "#2A2A28"
  stone: "#6B6B67"
  stone-2: "#9A9993"
  line: "#D8D7D1"
  acid-lime: "#B8FF3D"
  acid-lime-deep: "#A3EC22"
  night: "#0F0F0E"
  night-2: "#1A1A19"
  night-line: "#2C2C2A"
  night-stone: "#A3A29C"
typography:
  mega:
    fontFamily: "Manrope, system-ui, sans-serif"
    fontSize: "clamp(72px,17vw,300px)"
    fontWeight: 800
    lineHeight: 0.84
    letterSpacing: "-0.065em"
  display:
    fontFamily: "Manrope, system-ui, sans-serif"
    fontSize: "clamp(56px,10.4vw,176px)"
    fontWeight: 800
    lineHeight: 0.9
    letterSpacing: "-0.055em"
  headline:
    fontFamily: "Manrope, system-ui, sans-serif"
    fontSize: "clamp(32px,4.2vw,68px)"
    fontWeight: 800
    lineHeight: 0.95
    letterSpacing: "-0.05em"
  title:
    fontFamily: "Manrope, system-ui, sans-serif"
    fontSize: "clamp(22px,2.2vw,34px)"
    fontWeight: 700
    lineHeight: 1.06
    letterSpacing: "-0.03em"
  body:
    fontFamily: "Manrope, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: "-0.005em"
  label:
    fontFamily: "Manrope, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "0.08em"
rounded:
  none: "0px"
  xs: "2px"
  full: "999px"
spacing:
  "1": "4px"
  "2": "8px"
  "3": "12px"
  "4": "16px"
  "5": "24px"
  "6": "32px"
  "7": "48px"
  "8": "64px"
  "9": "96px"
  "10": "128px"
components:
  status-pill:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.none}"
    padding: "0 12px 0 14px"
    height: "34px"
  status-pill-hover:
    backgroundColor: "{colors.acid-lime}"
    textColor: "{colors.ink}"
  number-chip:
    backgroundColor: "{colors.acid-lime}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "3px 6px"
    typography: "{typography.label}"
---

# Design System: Anton Lutsyk

## Overview

**Creative North Star: "The Typeset Résumé"**

A résumé set like a Swiss poster. Type does the work an image would do elsewhere: oversized ExtraBold Manrope with very tight tracking, a 12-column editorial grid with a strong left edge, and hairlines instead of boxes. The page reads as an independent designer's point of view, not a CV template and not a SaaS landing page.

Colour is almost absent on purpose. Warm paper and near-black ink carry ~90% of every view; acid lime appears in small doses as a signal (status, number chips, hover sweeps). Depth comes from scale and from ink/paper inversion, never from shadow. Motion is slow and expo-out, so things settle rather than bounce.

**Key Characteristics:**
- Typography is the image; display sizes run to the viewport edge.
- Flat paper, 1px hairlines, square corners, no cards.
- Lime as a rare signal, always carrying ink text or sitting on ink.
- Slow, deliberate expo-out motion that respects reduced-motion.
- A 3D figure of Anton is the one illustrative element, in the hero.

## Colors

Paper and ink with one acid accent; dark mode inverts to night and paper.

### Primary
- **Acid Lime** (`acid-lime`): number chips, hover sweeps behind text, status dot, button fill on hover. Hover deepens to `acid-lime-deep`.

### Neutral
- **Warm Paper** (`paper`): page background in light mode. `paper-2` / `paper-3` for placeholders and quiet surfaces.
- **Ink** (`ink`): primary text, ink rules that open a section, focus ring in light mode.
- **Stone** (`stone`): secondary text and metadata. Passes AA on paper.
- **Pale Stone** (`stone-2`): decorative and dimmed states only (the hero year, dimmed sibling rows). Never body copy.
- **Hairline** (`line`): row separators.
- **Night** (`night`, `night-2`, `night-line`, `night-stone`): the dark theme and inverse scope (footer, mobile menu, Verona GT stage).

### Dark theme
Lives in `_ds/.../tokens/colors.css`. It follows `prefers-color-scheme`; `data-theme="light"` or `"dark"` on `<html>` pins it. Semantic tokens (`--bg`, `--fg-1..3`, `--border`, `--focus-ring`) swap to the night palette; `.al-inverse` lifts to `night-2` so the footer and menu still read as a separate band. Hairlines use `--hair` / `--hair-strong` (ink at 8% / 18% in light, paper at 10% / 20% in dark) instead of literal rgba values. Project stages have a `bgDark` tint per project. The 3D figure gets two back rim lights in dark only, so dark clothing separates from the night background.

### Named Rules
**The Two Percent Rule.** Lime covers no more than ~2% of a view. Its rarity is what makes it read as a signal.

**The No Lime On Paper Rule.** Lime is never text on paper. It carries ink text, or sits on ink/night.

## Typography

**Display Font:** Manrope (with system-ui fallback)
**Accent Font:** Instrument Serif italic, one word at most, rarely used on the current page.

**Character:** One grotesque does everything, from 300px display to 11px labels; contrast comes from weight (400→800) and tracking, not from a second family.

### Hierarchy
- **Mega** (800, clamp(72px,17vw,300px), 0.84): the "Let's work together." close.
- **Display** (800, clamp(56px,10.4vw,176px), 0.9): hero word, company names, project names.
- **Headline** (800, clamp(32px,4.2vw,68px), 0.95): "More work", About statement.
- **Title** (700, clamp(22px,2.2vw,34px), 1.06): education entries, sub-heads.
- **Body** (400–500, 15–17px, 1.5–1.6): descriptions, bullets; max 60–65ch.
- **Label** (600, 12px, +0.08em, uppercase): metadata, section labels, dt terms.

### Named Rules
**The Tracking Floor Rule.** Display tracking sits between -0.05em and -0.065em; body never goes below -0.005em.

## Layout

12-column grid, fluid gutter (12–28px) and margin (20–64px), max width 1760px. Labels live in the left columns and content starts at column 3–6, so compositions are asymmetric with a hard left edge. Sections are separated by 96–224px of vertical space and opened by a section label with an ink rule. Breakpoints in practice: ≤760px (mobile, single column, labels stack), ≤1100px (tablet), >900px shows the header status pill. Selected work is a sticky stage that advances one project per ~85vh of scroll.

## Elevation & Depth

Flat. There are no shadows anywhere; depth comes from type scale, hairlines and the ink/paper inversion of the footer, menu and dark project stage.

**The Flat Page Rule.** No box-shadow, gradient, blur or glass. If something needs to stand forward, it gets bigger or inverts.

## Shapes

Square corners everywhere (0px). The only round shapes are 7px status dots and their pulsing ring. Rows are divided by 1px hairlines, never enclosed in boxes.

## Components

### Header
Sticky, solid paper, 72px. Wordmark left, `/`-separated nav centred with an underline wipe and lime active dot, ink "Available for work" pill right (fills lime from the bottom on hover, arrow turns 45°). Mobile becomes "Menu +" opening a full-screen ink overlay.

### Section Label
`02 / EXPERIENCE` style opener: lime number chip whose digits roll up, uppercase label, 1px rule above. Decorative; each section also carries a real (visually hidden) h2.

### Experience Row
Full-width row with index, giant company name, Type/Context/Date metadata and an expandable bullet panel (grid-rows 0fr→1fr). Hover nudges the title right, dims siblings to pale stone, draws a hairline across the top.

### Project Stage
Sticky rail of large numbers (active 800 ink, rest 500 stone with a dash) beside one project at a time: lime `/ 00N` chip, display name, screenshot linking to the live site, and a Type/Sector/Year/Live list. The section background tints to each project's colour; the dark project flips to night tokens.

### Contact Row
Label / large handle / arrow, separated by hairlines; hover draws lime rules top and bottom, highlights the handle in lime and turns the arrow 45°.

## Do's and Don'ts

### Do:
- **Do** use `--fg-2` (stone) for any text a visitor must read; keep `--fg-3` for decoration and dimmed states.
- **Do** keep every motion on `cubic-bezier(.16,1,.3,1)` at 600–1400ms and provide a reduced-motion path.
- **Do** separate content with 1px hairlines and whitespace.
- **Do** keep the 3D figure as the hero's central element.

### Don't:
- **Don't** add cards, shadows, gradients, rounded corners or glass.
- **Don't** set lime text on paper.
- **Don't** invent stats, testimonials or client logos; only true facts appear.
- **Don't** use emoji or exclamation marks.
