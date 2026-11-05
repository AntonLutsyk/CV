# Anton Lutsyk — Portfolio

UX/UI designer & frontend developer. One-page portfolio: selected work, experience, expertise, skills, education and contacts, with a 3D figure in the hero and light/dark themes.

## Run locally

Any static server works, for example:

```bash
npx serve .
```

Then open http://localhost:3000. Opening `index.html` straight from disk (`file://`) won't load the 3D model, so use a server.

## Deploy to GitHub Pages

1. Push these files to the root of a repository.
2. Settings → Pages → Source: "Deploy from a branch", branch `main`, folder `/ (root)`.
3. The site will be live at `https://<username>.github.io/<repository>/`.

`.nojekyll` is included so GitHub serves the `_ds` folder as is.

## Structure

- `index.html` — the page (Claude Design `.dc` template, rendered at runtime by `support.js` with React 18 from unpkg).
- `avatar-glb.js` — the 3D figure (three.js from esm.sh, model in `assets/anton.glb`).
- `_ds/` — the Anton Lutsyk design system: tokens, components, light/dark colours.
- `assets/` — screenshots, portrait, logo, favicon, CV.
- `PRODUCT.md`, `DESIGN.md` — product and design-system notes.

The page loads React, three.js, icons and fonts from CDNs, so it needs an internet connection.
