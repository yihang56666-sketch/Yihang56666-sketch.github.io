# AGENTS.md — beid blog

## Repo type

Vanilla HTML/CSS/JS static SPA — **no build step, no framework**. Root directory serves directly as GitHub Pages publish source.

## Key files

| File | Role |
|---|---|
| `index.html` | SPA shell, canonical entry (local vendor deps) |
| `404.html` | GitHub Pages SPA fallback (hash routing) |
| `assets/app.js` | **All JS** — SPA router, renderers, theme, animations (~2000 lines, single IIFE) |
| `assets/styles.css` | **All CSS** — blog theme, motion layers, responsive layouts |
| `assets/images/anime/` | Cover / hero visual assets |
| `assets/vendor/` | Localized Lenis / Atropos / medium-zoom / Lucide / fonts |
| `tests/blog.spec.js` | Playwright E2E (16 cases) |
| `playwright.config.js` | Playwright config |
| `atom.xml` | Static Atom feed |

## Content model

Posts, projects, and archive notes live as **JS data arrays/objects** in `assets/app.js`:

- `posts[]` — article data (`slug`, `title`, `date`, `category`, `tags`, `cover`, `sections`, `legacyPaths`)
- `projects[]` — project cards (`slug`, `title`, `desc`, `tags`, `stats`, `detail`, `links`)
- `archiveNotes` — per-month archival prose

Editing content = editing `assets/app.js`. No markdown, no CMS, no separate content files.

## Routing

Hash-based SPA (`#/archive`, `#/projects`, `#/posts/my-post`, etc.). Legacy paths use `legacyLookup` Map + `404.html` for GitHub Pages fallback.

## Local preview

```bash
npx serve .
# then http://localhost:3000
```

## Tests

```bash
npm install
npx playwright test
```

`package.json` / `package-lock.json` are tracked so clone-and-test works.

## Gotchas

- External motion libs are **localized** under `assets/vendor/` (no CDN required for core paths).
- Dark/light theme via `.dark` on `<html>`, CSS custom properties swap.
- `downloads/*.apk` is gitignored; link APK via GitHub Releases instead of committing binaries.
- Keep `app.js` project stats in sync with real test counts (Hardware Butler = 1013 passed / 12 skipped).
