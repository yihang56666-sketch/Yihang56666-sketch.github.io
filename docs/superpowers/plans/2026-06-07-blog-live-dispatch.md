# Blog Live Dispatch Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the blog feel more like a living anime/cyberpunk personal notebook by adding a lightweight live dispatch module and motion polish.

**Architecture:** Keep the site static and dependency-free. Add structured homepage data in `assets/app.js`, render it as a compact dispatch strip, then style it in `assets/styles.css` using existing card, reveal, and Night City visual language.

**Tech Stack:** Vanilla JavaScript, CSS, static GitHub Pages assets.

---

### Task 1: Homepage Dispatch Data And Markup

**Files:**
- Modify: `assets/app.js`

- [ ] **Step 1: Add dispatch entries**

Add a `siteUpdates` array near `projects`:

```js
const siteUpdates = [
  {
    time: "06/07 01:40",
    type: "layout",
    title: "首页改成手账现场",
    body: "把最近写作、项目状态和站点更新放到第一屏附近，让博客像还在发光。"
  }
];
```

- [ ] **Step 2: Render the dispatch module**

In `renderHome()`, place a `live-dispatch` section between the intro panel and the latest-post heading:

```html
<section class="live-dispatch" aria-label="站点更新">
  ${siteUpdates.map(update => "...").join("")}
</section>
```

- [ ] **Step 3: Run syntax check**

Run: `node --check assets\app.js`

Expected: exits with code 0.

### Task 2: Motion And Layout Polish

**Files:**
- Modify: `assets/styles.css`

- [ ] **Step 1: Add dispatch styles**

Create `.live-dispatch`, `.dispatch-item`, `.dispatch-time`, and `.dispatch-dot` styles that fit the existing `--radius`, `--line`, `--primary`, `--accent`, and `--gold` variables.

- [ ] **Step 2: Add subtle anime/cyberpunk motion**

Add a `dispatch-scan` keyframe for a narrow scanning highlight and keep it disabled under `prefers-reduced-motion: reduce`.

- [ ] **Step 3: Check responsive behavior**

Run the existing Playwright smoke scripts:

```bash
node output\playwright\check-blog.mjs
node output\playwright\check-projects.mjs
node output\playwright\check-interactions.mjs
```

Expected: all scripts pass and screenshots show no text overlap.

### Task 3: Documentation Touch

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Document the dispatch module**

In the content maintenance section, note that homepage live updates are maintained through `siteUpdates` in `assets/app.js`.

- [ ] **Step 2: Search for obvious mojibake markers**

Run:

```bash
rg -n "鐨|銆|绔|瀵|�" README.md assets\app.js assets\styles.css
```

Expected: no matches when files are read as UTF-8.
