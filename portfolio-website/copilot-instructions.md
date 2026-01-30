# Copilot / AI Agent Instructions

**Project type:** Static single-page portfolio (HTML / CSS / JS)

## Quick summary
- This is a simple, single-page static site: `index.html`, `style.css`, `script.js`, plus an `images/` folder.
- No build, package manager, or test framework is present—changes are verified by loading the page in a browser.

## Where to make changes
- Content/text: edit `index.html` (top-level sections use IDs: `#home`, `#skills`, `#about`, `#projects`, `#contact`).
  - Add/modify projects inside `<div class="projects">` (each project should be a `.project-card`).
- Styling: edit `style.css` (keep the existing class-based patterns and responsive grid `skills-grid`).
- Behavior: edit `script.js` (currently only logs `"Portfolio Loaded"` — JS additions should enhance progressively).
- Images: add/update `images/profile.jpg` (path is referenced from `index.html`).

## Conventions & patterns to follow
- Keep semantic HTML sections and the existing ID anchors (they drive navigation links).
- Use the existing utility/class patterns (`.card`, `.btn`, `.section`, `.skills-grid`) when adding components.
- Maintain the color palette / visual rhythm: dark background (`#0b0f1a`) and accent color (`#00bfff`).
- The `skills-grid` uses `grid-template-columns: repeat(auto-fit, minmax(150px, 1fr))` for responsiveness—preserve that approach for similar layouts.

## Local verification (no build step)
- Open `index.html` directly in a browser OR serve the folder and use a local server to avoid file/protocol issues:
  - Python: `python -m http.server 8000`
  - Node (if available): `npx http-server` or `npx serve`
- Verify:
  - Navigation links jump to the right sections (anchors work properly).
  - Page scales on narrow viewports (inspect `skills-grid` and `.hero` behavior).
  - Images load from `images/` and are not broken.

## Examples (how to change things safely)
- To add a project card, add markup within the `#projects .projects` container, e.g.:
```html
<div class="project-card">My New Project — <a href="https://...">Live</a></div>
```
- To highlight new text, prefer existing classes (e.g., `.btn` / `.btn.outline`) instead of inline styles.

## Known quirks / small issues
- `style.css` contains a `.p{ color: #00bfff; }` selector — this is a class selector, not `p` elements; consider correcting to `p { ... }` when editing content.
- `script.js` is minimal; prefer small, unobtrusive enhancements and keep behavior progressive.

## PR & commit guidance
- Commit messages: short, present-tense (e.g., `Add project card to projects section`).
- PR description: list what was changed, how to verify locally, and note any visual assets added to `images/`.

## When in doubt
- Preserve semantic structure and IDs used for navigation.
- Avoid adding dependencies unless a clear need emerges (this repo currently has none).

---

If anything in the above is unclear or you want more detail (examples for a specific change, component templates, or a CSS color tokenization proposal), tell me which area to expand and I’ll iterate.