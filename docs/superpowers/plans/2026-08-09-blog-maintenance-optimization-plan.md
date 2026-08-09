# 博客维护整理与体验优化 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在保留现有静态 SPA 和白色动漫视觉的前提下，移除旧首页实现，强化核心交互、路由元信息、响应式与可访问性，并用真实浏览器验证主要页面。

**Architecture:** 继续使用 `assets/app.js` 的单 IIFE 和结构化数据数组。首页统一由 `renderHomeMaikire()` 渲染；新增少量无副作用的状态/元信息辅助函数，交互通过现有的事件委托接入。CSS 以当前浅色/深色 token 和 Maikire 首页为最终视觉基线，删除旧 cyberpunk 基础层和旧首页专用规则，保留内页组件所需的公共规则。

**Tech Stack:** Vanilla HTML/CSS/JavaScript, GitHub Pages hash routing, Lucide CDN, Playwright 1.60.

---

### Task 1: 建立浏览器回归基线

**Files:**
- Create: `playwright.config.js`
- Create: `tests/blog.spec.js`
- Modify: `package.json` only if a test script is needed; keep existing tracked dependency declarations unchanged unless required.

- [ ] **Step 1: Create the local Playwright configuration**

Create a config that starts `npx serve . -l 4173`, uses Chromium, and defines `baseURL: http://127.0.0.1:4173`.

```js
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  use: { baseURL: "http://127.0.0.1:4173", trace: "retain-on-failure" },
  webServer: {
    command: "npx serve . -l 4173",
    url: "http://127.0.0.1:4173",
    reuseExistingServer: true
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }]
});
```

- [ ] **Step 2: Add failing regression tests for the required contracts**

Cover: home heading and primary links, navigation to archive, article navigation, mobile nav `aria-expanded`, theme persistence, search filtering, not-found recovery, and no horizontal overflow at 390px.

```js
import { test, expect } from "@playwright/test";

test("home exposes the primary reading paths", async ({ page }) => {
  await page.goto("/#/");
  await expect(page.locator("h1").first()).toContainText("beid");
  await expect(page.locator('a[href="#/archive"]').first()).toBeVisible();
  await expect(page.locator('a[href="#/projects"]').first()).toBeVisible();
  await page.locator('a[href="#/archive"]').first().click();
  await expect(page).toHaveURL(/#\/archive$/);
  await expect(page.locator("main h1")).toContainText("文章归档");
  await page.locator('a[href^="#/posts/"]').first().click();
  await expect(page).toHaveURL(/#\/posts\//);
  await expect(page.locator("article h1")).toBeVisible();
});

test("core routes render without horizontal overflow", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of ["/#/archive", "/#/reading", "/#/about", "/#/projects"]) {
    await page.goto(route);
    await expect(page.locator("main")).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  }
});

test("mobile navigation exposes its state", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/#/");
  const toggle = page.locator("[data-action='toggle-nav']");
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
});

test("theme preference survives a reload", async ({ page }) => {
  await page.goto("/#/");
  await page.locator("[data-action='toggle-theme']").click();
  const theme = await page.locator("html").getAttribute("class");
  await page.reload();
  expect(await page.locator("html").getAttribute("class")).toBe(theme);
});

test("invalid routes provide recovery", async ({ page }) => {
  await page.goto("/#/missing-route");
  await expect(page.locator("main")).toContainText("找不到");
  await expect(page.locator('a[href="#/"]').last()).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex,follow");
});
```

- [ ] **Step 3: Run the baseline tests and record failures**

Run: `npx playwright test tests/blog.spec.js --reporter=line`

Expected: the tests that assert the new `aria-expanded` contract fail before implementation; existing route assertions should expose any current runtime failures. Do not weaken the assertions to match the current bugs.

- [ ] **Step 4: Commit the test baseline**

```bash
git add playwright.config.js tests/blog.spec.js
git commit -m "test: add blog browser regression baseline"
```

### Task 2: Consolidate the active JavaScript path

**Files:**
- Modify: `assets/app.js:656-1107` to remove the unused `renderHome`, `renderHomeV2`, `editorialBoard`, `categoryDigestCards`, `featuredPostCard`, and other helpers/constants used only by those renderers.
- Modify: `assets/app.js:1766-2190` to harden route parsing, theme state, navigation state, and post-render focus.

- [ ] **Step 1: Confirm dead-code references before deleting**

Run:

```bash
rg -n "renderHome\(|renderHomeV2\(|editorialBoard\(|categoryDigestCards\(|featuredPostCard\(" assets/app.js
```

Expected after the cleanup: no definitions or calls remain; `renderHomeMaikire()` remains the only home branch in `render()`.

- [ ] **Step 2: Make malformed hash input recoverable**

Replace direct decoding in `parseRoute()` with a guarded decoder so an invalid percent escape renders `notFound` instead of aborting the whole IIFE:

```js
function parseRoute() {
  let hash = location.hash.replace(/^#\/?/, "");
  try {
    hash = decodeURIComponent(hash);
  } catch {
    return { view: "notFound" };
  }
  // Keep the existing route-part dispatch below this guard.
}
```

- [ ] **Step 3: Add resilient theme helpers and synchronize the control**

Use safe storage access and update the button state after initialization and toggles:

```js
function readThemePreference() {
  try { return localStorage.getItem("beid-theme"); } catch { return null; }
}

function writeThemePreference(value) {
  try { localStorage.setItem("beid-theme", value); } catch { /* optional enhancement */ }
}

function syncThemeControl() {
  const button = document.querySelector("[data-action='toggle-theme']");
  if (!button) return;
  const dark = root.classList.contains("dark");
  button.setAttribute("aria-pressed", String(dark));
  button.setAttribute("aria-label", dark ? "切换到浅色主题" : "切换到深色主题");
  const icon = button.querySelector("[data-lucide]");
  if (icon) icon.setAttribute("data-lucide", dark ? "sun" : "moon");
  window.lucide?.createIcons();
}
```

Call `syncThemeControl()` after `initTheme()` and after the toggle writes the preference. Preserve the current route and scroll position.

- [ ] **Step 4: Add mobile navigation state semantics**

Set `aria-expanded="false"` and `aria-controls="site-navigation"` on both `index.html` and `404.html`, give the nav `id="site-navigation"`, and make the existing delegated `toggle-nav` handler update `aria-expanded` whenever `is-open` changes. Close the menu after a `.nav-links a` click.

- [ ] **Step 5: Focus the main region after hash navigation**

After rendering a route, focus `main` with `{ preventScroll: true }` only when the route changed due to a hash/popstate event; do not steal focus from an active form control during live search. Keep `tabindex="-1"` on `main`.

- [ ] **Step 6: Run syntax and browser tests**

Run: `node --check assets/app.js` and `npx playwright test tests/blog.spec.js --reporter=line`.

Expected: syntax passes; the new theme, navigation, malformed-route, and recovery assertions pass.

- [ ] **Step 7: Commit JavaScript and shell semantics**

```bash
git add assets/app.js index.html 404.html
git commit -m "refactor: consolidate blog routing and interactions"
```

### Task 3: Remove duplicate CSS layers without changing the visual contract

**Files:**
- Modify: `assets/styles.css:1-2590` to remove the superseded cyberpunk token/body/legacy-home layer while retaining any shared rules still consumed by inner pages.
- Modify: `assets/styles.css:2592-6964` to consolidate duplicate selectors and keep the active light/dark and Maikire rules in one ordered layer.
- Modify: `assets/styles.css` near responsive and reduced-motion blocks to enforce overflow, focus, and stable control dimensions.

- [ ] **Step 1: Build a class usage list before deleting selectors**

Compare selectors in the candidate legacy range against class names emitted by `assets/app.js` and static HTML. Keep selectors used by active inner-page markup; remove only selectors whose markup is unreachable after Task 2 or whose later definitions fully replace them.

- [ ] **Step 2: Consolidate the token and body definitions**

Keep one `:root`, one `:root.dark`, one `html`, and one `body` baseline. Use the current light token values as the default and preserve the current dark values under `:root.dark`. Keep homepage-specific background and fixed navigation under `html[data-view="home"]`.

- [ ] **Step 3: Add focused responsive and accessibility safeguards**

Add rules equivalent to:

```css
html { overflow-x: clip; }

button, a, input { min-height: 44px; }

@media (max-width: 780px) {
  .article-layout,
  .article-main,
  .article-meta-rail,
  .post-nav { min-width: 0; }

  .article-body pre { max-width: 100%; overflow-x: auto; }
}

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
}
```

Do not apply a blanket min-height to text links that are part of dense inline prose; target interactive controls and navigation items instead.

- [ ] **Step 4: Run CSS syntax and screenshot checks**

Run: `npx playwright test tests/blog.spec.js --reporter=line` and inspect screenshots at 1440x1000, 768x1024, and 390x844. Expected: no horizontal overflow, no clipped primary text, and no regression to the home hero or article body.

- [ ] **Step 5: Commit CSS cleanup**

```bash
git add assets/styles.css
git commit -m "style: consolidate blog theme layers"
```

### Task 4: Normalize metadata and content maintenance surfaces

**Files:**
- Modify: `index.html` and `404.html` to keep base title/description/Open Graph/theme-color values valid and identical in encoding and resource strategy.
- Modify: `assets/app.js` in `setMeta()` and `upsertJsonLd()` to set `og:image`, article date metadata when applicable, `theme-color`, and a stable canonical for `notFound`.
- Modify: `README.md` to document the new maintenance checks and the single active home renderer.

- [ ] **Step 1: Add a shared metadata contract to the browser tests**

Assert on home, archive, article, project, and not-found routes that `document.title`, description, canonical, `og:title`, `og:description`, and robots exist; assert article routes expose JSON-LD with `headline` and `datePublished`.

- [ ] **Step 2: Implement route metadata updates**

Use the resolved post/project cover as `og:image` when available, use the site hero image for section pages, and set the not-found canonical to the site origin while keeping `robots=noindex,follow`. Keep every dynamic value escaped by DOM attribute assignment or the existing upsert helpers.

- [ ] **Step 3: Update the maintenance documentation**

Document `npx playwright test`, the three supported viewport checks, the single `renderHomeMaikire()` home entry, and the rule that factual content additions must come from the site owner.

- [ ] **Step 4: Run all checks and commit**

Run: `node --check assets/app.js`, `npx playwright test --reporter=line`, and `git diff --check`.

Expected: all tests pass, no whitespace errors, and only the intended files differ from the design-doc commit plus preserved user changes.

```bash
git add index.html 404.html assets/app.js README.md tests playwright.config.js
git commit -m "chore: finish blog maintenance pass"
```

### Task 5: Final verification and handoff

**Files:**
- Verify: `index.html`, `404.html`, `assets/app.js`, `assets/styles.css`, `README.md`, `playwright.config.js`, `tests/blog.spec.js`.

- [ ] **Step 1: Run the complete verification loop**

Run:

```bash
node --check assets/app.js
npx playwright test --reporter=line
git diff --check
git status --short
```

- [ ] **Step 2: Review the final diff**

Confirm that the design document commit and implementation commits do not include `repo-main.zip`, `output/`, `.playwright-cli/`, credentials, or unrelated user changes. Confirm the final rendered pages retain all existing content arrays and image references.

- [ ] **Step 3: Report residual risk precisely**

Mention that CDN availability is still an external runtime dependency and that visual checks cover Chromium only unless another browser is explicitly added later.
