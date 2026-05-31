# Template Guide

This project can be used as a template for new progressive web apps. When
creating a new app from it, update the items below.

## App Settings and Icon

Update the `app` section in `package.json` to set your app's identity.
These values are injected into `index.html`, `manifest.json`, and `sw.js`
at build time.

```json
"app": {
  "title": "Hello",
  "name": "Hello",
  "shortName": "Hello",
  "description": "A simple, modern progressive web app",
  "themeColor": "#2563eb",
  "backgroundColor": "#ffffff"
}
```

Replace `static/icon.svg` with a square SVG using a `512 512`
viewBox. The SVG must be self-contained (no external fonts or images)
so it rasterizes cleanly. The build script automatically renders
192px and 512px PNGs from it.

## Placeholder Content

These components contain "Hello" app content. Replace them with your app's
actual UI when building out the real product.

| File | What's there now |
|---|---|
| `src/components/Nav.tsx` | Brand icon (Sparkles) — swap for your logo |
| `src/pages/Home.tsx` | Hero heading, button labels, action definitions |
| `src/pages/Settings.tsx` | Button action options + about copy |
| `src/components/Greeting.tsx` | Multilingual greeting strings |
| `src/components/Quote.tsx` | Inspirational quote strings |

## Generally Useful Content

These are structural pieces that work for any app built on this template:

- `src/utils/store.ts` — generic localStorage-backed store
- `src/components/ThemeProvider.tsx` — theme resolution and dark mode
- `src/App.tsx` — settings shape (add fields), routing (add routes)
- `tools/` — build and dev server scripts
- `tools/build.ts` — generates `sw.js` with versioned cache and asset list
