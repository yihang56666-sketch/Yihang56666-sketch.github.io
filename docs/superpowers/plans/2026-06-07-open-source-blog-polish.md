# Open Source Blog Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply lightweight open-source-inspired polish to the blog without making the static GitHub Pages deployment heavy.

**Architecture:** Include augmented-ui before the local stylesheet and use `data-augmented-ui` only on selected HUD surfaces. Add a local terminal-style article log component inspired by terminal.css instead of importing the whole framework.

**Tech Stack:** Vanilla JavaScript, CSS, augmented-ui via CDN, static GitHub Pages assets.

---

### Task 1: Augmented HUD Surfaces

**Files:**
- Modify: `index.html`
- Modify: `404.html`
- Modify: `assets/app.js`
- Modify: `assets/styles.css`

- [ ] **Step 1: Include augmented-ui before local CSS**

Add:

```html
<link rel="stylesheet" href="https://unpkg.com/augmented-ui@2/augmented-ui.min.css">
```

- [ ] **Step 2: Mark selected panels**

Use `data-augmented-ui="tl-clip tr-clip br-clip bl-clip border"` on the navigation shell and selected blog surfaces.

- [ ] **Step 3: Add local design variables**

Style `.aug-frame` with `--aug-border-all`, `--aug-border-bg`, and corner sizes so the library matches the current palette.

### Task 2: Terminal Log Module

**Files:**
- Modify: `assets/app.js`
- Modify: `assets/styles.css`

- [ ] **Step 1: Add per-post `labLog` data**

Store short command/result/next lines on posts that benefit from engineering context.

- [ ] **Step 2: Render the module on article pages**

Place the terminal log between the article hero and body, only when the post has log entries.

- [ ] **Step 3: Style responsively**

Use monospace rows, prompt markers, scan highlight, and mobile-safe wrapping.

### Task 3: Documentation And Verification

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Document the actual dependency choice**

Note that augmented-ui is included by CDN, while terminal.css is only used as a design reference.

- [ ] **Step 2: Verify**

Run:

```bash
node --check assets\app.js
git diff --check
node output\playwright\check-blog.mjs
node output\playwright\check-projects.mjs
node output\playwright\check-interactions.mjs
```
