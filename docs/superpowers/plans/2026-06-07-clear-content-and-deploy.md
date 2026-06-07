# Clear Content And Deploy Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Clear old blog content while keeping the redesigned shell, then verify and deploy to GitHub Pages.

**Architecture:** Remove user-facing content data from `assets/app.js` while preserving routes, theme, visual assets, and empty-state rendering. Update static meta/docs/sitemap, run smoke checks, commit, and push to the GitHub Pages repository.

**Tech Stack:** Static HTML, vanilla JavaScript, CSS, GitHub Pages.

---

### Task 1: Clear Content Data

**Files:**
- Modify: `assets/app.js`

- [ ] **Step 1: Replace old content arrays**

Set `posts`, `postNotes`, `labLogs`, `projects`, `siteUpdates`, and `archiveNotes` to empty collections.

- [ ] **Step 2: Replace homepage placeholder copy**

Remove old project-specific writing list and sidebar status text; keep neutral rewrite placeholders.

- [ ] **Step 3: Keep empty states helpful**

Archive, project, reading, tag, category, search, and 404 views should say the content is being rewritten.

### Task 2: Static Metadata And Docs

**Files:**
- Modify: `index.html`
- Modify: `404.html`
- Modify: `README.md`
- Modify: `sitemap.xml`

- [ ] **Step 1: Update meta descriptions**

Say the blog is being reorganized for new content.

- [ ] **Step 2: Update README examples**

Use neutral example slugs instead of old article names.

- [ ] **Step 3: Refresh sitemap dates**

Set `lastmod` to `2026-06-07`.

### Task 3: Verify And Deploy

**Files:**
- No source edits after this task unless verification fails.

- [ ] **Step 1: Run static checks**

Run `node --check assets\app.js`, `git diff --check`, and scans for old content markers.

- [ ] **Step 2: Run Playwright smoke scripts**

Run the existing blog/project/interaction scripts.

- [ ] **Step 3: Commit and push**

Commit the verified changes and push to `origin` for GitHub Pages deployment.
