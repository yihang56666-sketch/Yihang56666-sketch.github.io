# AGENTS.md — beid blog

## Repo type

Vanilla HTML/CSS/JS static SPA — **no build step, no framework**. Root directory serves directly as GitHub Pages publish source.

## Key files

| File | Role |
|---|---|
| `index.html` | SPA shell, canonical entry |
| `404.html` | GitHub Pages SPA fallback (hash routing) |
| `assets/app.js` | **All JS** — SPA router, renderers, theme, animations (883 lines, single IIFE) |
| `assets/styles.css` | **All CSS** — Cyberpunk/Edgerunners theme (2222 lines) |
| `assets/images/edgerunners/` | Visual assets |

## Content model

Posts, projects, site updates, and archive notes live as **JS data arrays/objects** in `assets/app.js` (lines 31-35):

- `posts[]` — article data (`slug`, `title`, `date`, `category`, `tags`, `cover`, `sections`, `legacyPaths`)
- `projects[]` — project cards
- `siteUpdates[]` — homepage "site updates" entries
- `archiveNotes` — per-month archival prose

Editing content = editing `assets/app.js`. No markdown, no CMS, no separate content files.

## Routing

Hash-based SPA (`#/archive`, `#/projects`, `#/posts/my-post`, etc.). The `render()` function (line 810) handles route dispatch. Legacy paths use `legacyLookup` Map + `404.html` for GitHub Pages fallback.

## Local preview

```bash
npx serve .
# then http://localhost:3000
```

`npm test` not configured — Playwright (`@playwright/test` ^1.60) is a devDependency but no `playwright.config.js` or test files exist. Create them if adding tests.

## Gotchas

- `package.json` and `package-lock.json` are **listed in `.gitignore`** (lines 5-6). They're currently tracked but changes may not be committed. Be explicit about intent if modifying them.
- `output/`, `.playwright-cli/`, `repo-main.zip`, `old-atom.xml` are gitignored.
- External deps: `augmented-ui` and `lucide` loaded via CDN (unpkg) — no bundling.
- CSS uses `data-augmented-ui` attribute for HUD-style borders on nav panels.
- Dark/light theme toggling via `.dark` class on `<html>`, swapping CSS custom properties.
