# 内页杂志排版、独立角色图与流动动效 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在锁定首页封面结构的前提下，把内页改成大图杂志排版，换成不重复的高清原创角色图，并用 Lenis / Atropos / medium-zoom 做出滚动和悬停流动感。

**Architecture:** 继续用 `assets/app.js` 单 IIFE 和数据数组。首页只换 `covers` 指向的图。内页 `renderArchive` / `renderProjects` / `renderReading` / `renderAbout` / `renderArticle` 改成杂志模板。第三方库通过 CDN ESM 挂到 `window`，在 `afterRender()` 里初始化并在减少动态时跳过。角色图一对一放进 `assets/images/anime/`。

**Tech Stack:** Vanilla HTML/CSS/JS, GitHub Pages hash routing, Lenis 1.3.4, Atropos 2.0.2, medium-zoom 1.1.0, Lucide, Playwright 1.60, imagegen.

**Spec:** `docs/superpowers/specs/2026-08-13-inner-pages-unique-art-flow-design.md`

---

## File map

- Create: `assets/images/anime/hero-letter-desk.png` and the 17 other unique portraits listed in Task 2
- Keep / add: `playwright.config.js`
- Modify: `tests/blog.spec.js`
- Modify: `index.html`
- Modify: `404.html`
- Modify: `assets/app.js`
- Modify: `assets/styles.css`
- Modify: `README.md`
- Delete after zero references: `assets/images/anime/white-haired-*.png`

Do not split `app.js`. Do not change the DOM structure of `renderHomeMaikire()`. Keep existing uncommitted maintenance edits; only layer this work on top.

---

### Task 1: Write failing magazine regression tests

**Files:**
- Modify: `tests/blog.spec.js`
- Modify: `package.json` if it has no test script
- Keep: `playwright.config.js`

- [ ] **Step 1: Ensure package.json can run Playwright**

```json
{
  "scripts": {
    "test": "playwright test"
  },
  "devDependencies": {
    "@playwright/test": "^1.60.0"
  }
}
```

- [ ] **Step 2: Append these tests to `tests/blog.spec.js`, keeping existing cases**

```js
test("home cover structure stays and uses distinct new art", async ({ page }) => {
  await page.goto("/#/");
  await expect(page.locator(".maikire-hero")).toBeVisible();
  await expect(page.locator(".maikire-category-card")).toHaveCount(4);
  await expect(page.locator(".maikire-post-card").first()).toBeVisible();
  await expect(page.locator(".maikire-profile img")).toHaveAttribute("src", /profile-host\.png$/);

  const heroBg = await page.locator(".maikire-hero").evaluate((el) => getComputedStyle(el).backgroundImage);
  expect(heroBg).toContain("hero-letter-desk.png");
  expect(heroBg).not.toContain("white-haired-");

  const categoryCovers = await page.locator(".maikire-category-card").evaluateAll((nodes) =>
    nodes.map((node) => node.getAttribute("style"))
  );
  expect(new Set(categoryCovers).size).toBe(categoryCovers.length);
});

test("archive uses unique magazine rows", async ({ page }) => {
  await page.goto("/#/archive");
  const rows = page.locator(".magazine-row");
  await expect(rows).toHaveCount(6);
  await expect(page.locator(".magazine-cover [data-zoom]")).toHaveCount(6);
  const covers = await rows.evaluateAll((nodes) => nodes.map((node) => node.getAttribute("style")));
  expect(new Set(covers).size).toBe(covers.length);
  expect(covers.join(" ")).not.toContain("white-haired-");
});

test("inner content pages use the magazine templates", async ({ page }) => {
  await page.goto("/#/projects");
  await expect(page.locator(".magazine-project")).toHaveCount(1);
  await expect(page.locator('a[href="https://github.com/yihang56666-sketch/magent"]').first()).toBeVisible();

  await page.goto("/#/reading");
  await expect(page.locator(".shelf-card")).toHaveCount(4);
  await expect(page.locator(".shelf-card [data-zoom]")).toHaveCount(4);

  await page.goto("/#/about");
  await expect(page.locator(".about-hero img")).toHaveAttribute("src", /about-host-garden\.png$/);
  await expect(page.locator(".about-note-card")).toHaveCount(4);
});

test("motion libraries stay optional under reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#/archive");
  await expect(page.locator(".magazine-row").first()).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.classList.contains("lenis"))).toBe(false);
  expect(await page.locator(".atropos-rotate").count()).toBe(0);
});
```

- [ ] **Step 3: Run the new tests and confirm they fail**

Run:

```powershell
cd D:\boke
npx playwright test tests/blog.spec.js -g "magazine|distinct new art|motion libraries"
```

Expected: FAIL because `.magazine-row`, new filenames, and the magent link do not exist yet.

- [ ] **Step 4: Commit**

```powershell
git add package.json playwright.config.js tests/blog.spec.js
git commit -m "test: add magazine layout and unique-art contracts"
```

---

### Task 2: Generate 18 unique high-res character portraits

**Files:**
- Create: `D:\boke\assets\images\anime\hero-letter-desk.png`
- Create: `D:\boke\assets\images\anime\profile-host.png`
- Create: `D:\boke\assets\images\anime\category-editorial.png`
- Create: `D:\boke\assets\images\anime\category-workshop.png`
- Create: `D:\boke\assets\images\anime\category-library.png`
- Create: `D:\boke\assets\images\anime\category-night-light.png`
- Create: `D:\boke\assets\images\anime\post-blog-redesign.png`
- Create: `D:\boke\assets\images\anime\post-project-stories.png`
- Create: `D:\boke\assets\images\anime\post-reading-cache.png`
- Create: `D:\boke\assets\images\anime\post-tag-granularity.png`
- Create: `D:\boke\assets\images\anime\post-spa-checklist.png`
- Create: `D:\boke\assets\images\anime\post-night-lighting.png`
- Create: `D:\boke\assets\images\anime\project-magent-hero.png`
- Create: `D:\boke\assets\images\anime\reading-design-book.png`
- Create: `D:\boke\assets\images\anime\reading-refactoring-ui.png`
- Create: `D:\boke\assets\images\anime\reading-smart-notes.png`
- Create: `D:\boke\assets\images\anime\reading-a11y.png`
- Create: `D:\boke\assets\images\anime\about-host-garden.png`

Use the imagegen skill built-in `image_gen` tool, one image per call. Do not draw copyrighted franchise characters, game characters, logos, watermarks, or readable text. After each generation, copy the selected file from the default `$CODEX_HOME/generated_images/` location into the path above.

- [ ] **Step 1: Generate and copy each asset**

Shared prefix:

`High-end anime illustration, original character, not a copyrighted franchise character, no logos, no text, no watermark, sharp 4k, cinematic lighting, vertical 3:4 composition, detailed face and costume, blog cover art.`

| File | Extra prompt |
|---|---|
| `hero-letter-desk.png` | Soft daylight, original girl at a white wooden desk writing a letter, cream room, flowers, gentle film still, keep a wide negative space on the left for title overlay |
| `profile-host.png` | Different original character from the hero, casual knit sweater, close portrait, airy white room, friendly expression |
| `category-editorial.png` | Fashion editorial illustrator with short dark hair, white studio, fabric swatches and layout boards |
| `category-workshop.png` | Creator at a messy but pretty workbench, tools and notebooks, warm lamp, different face from all others |
| `category-library.png` | Reader in a sunlit library aisle, glasses, beige coat, bookshelves receding |
| `category-night-light.png` | Night balcony observer, city bokeh, cool moonlight, long hair in a color unused by other portraits |
| `post-blog-redesign.png` | Illustrator rearranging paper mockups on a white wall, calm interior, pastel clothes |
| `post-project-stories.png` | Storyteller pinning photos and notes onto a cork wall, denim shirt, documentary mood |
| `post-reading-cache.png` | Scholar among tall shelves holding index cards, olive cardigan |
| `post-tag-granularity.png` | Archivist in front of labeled wooden drawers, muted green outfit |
| `post-spa-checklist.png` | Frontend engineer at a night desk with a checklist notebook, hoodie, monitor glow, no readable UI text |
| `post-night-lighting.png` | Character watching city lights from a balcony, navy coat, quiet atmosphere |
| `project-magent-hero.png` | Original hero-engineer in a red-and-blue utility suit on a rainy city rooftop, no spider emblem, no copied Spider-Man mask, more tech harness than superhero costume |
| `reading-design-book.png` | Original silver-haired elf traveler sitting in stone ruins reading a thick book, Frieren-like mood only, not Frieren |
| `reading-refactoring-ui.png` | UI designer holding color chips and paper components, bright studio |
| `reading-smart-notes.png` | Student connecting paper notes with red string, warm lamp |
| `reading-a11y.png` | Designer inspecting a large printed contrast chart, soft daylight, calm expression |
| `about-host-garden.png` | Third distinct original character walking through a white courtyard garden, airy, three-quarter body |

- [ ] **Step 2: Confirm all 18 files exist and are non-empty**

```powershell
Get-ChildItem D:\boke\assets\images\anime\*.png | Select-Object Name, Length
```

Expected: every filename in the table exists. If two faces or outfits look like the same person, regenerate only the colliding image.

- [ ] **Step 3: Commit**

```powershell
git add assets/images/anime/*.png
git commit -m "feat: add unique high-res anime cover portraits"
```

---

### Task 3: Map covers one-to-one and remove repeated page backgrounds

**Files:**
- Modify: `assets/app.js` covers object and all cover assignments
- Modify: `assets/app.js` `setMeta` default image
- Modify: `assets/styles.css` every `url("images/anime/white-haired-...")`
- Modify: `index.html` and `404.html` `og:image`

- [ ] **Step 1: Replace the covers object**

```js
  const covers = {
    hero: animeImage("hero-letter-desk.png"),
    profile: animePath("profile-host.png"),
    catDesign: animeImage("category-editorial.png"),
    catProjects: animeImage("category-workshop.png"),
    catReading: animeImage("category-library.png"),
    catLab: animeImage("category-night-light.png"),
    postRedesign: animeImage("post-blog-redesign.png"),
    postStories: animeImage("post-project-stories.png"),
    postCache: animeImage("post-reading-cache.png"),
    postTags: animeImage("post-tag-granularity.png"),
    postChecklist: animeImage("post-spa-checklist.png"),
    postNight: animeImage("post-night-lighting.png"),
    projectMagent: animeImage("project-magent-hero.png"),
    readingDesign: animeImage("reading-design-book.png"),
    readingUi: animeImage("reading-refactoring-ui.png"),
    readingNotes: animeImage("reading-smart-notes.png"),
    readingA11y: animeImage("reading-a11y.png"),
    about: animePath("about-host-garden.png")
  };
```

Then retarget references:

- posts: `postRedesign`, `postStories`, `postCache`, `postTags`, `postChecklist`, `postNight`
- readingItems: `readingDesign`, `readingUi`, `readingNotes`, `readingA11y`
- showcaseCategories: `catDesign`, `catProjects`, `catReading`, `catLab`
- project cover: `projectMagent`
- project `links.github`: `https://github.com/yihang56666-sketch/magent`
- `renderAbout()` image: `${esc(covers.about)}`
- `setMeta` / JSON-LD default image: `${site.origin}/assets/images/anime/hero-letter-desk.png`

Keep the home hero structure. Only change the filename in CSS:

```css
.maikire-hero {
  background:
    linear-gradient(90deg, rgba(22, 20, 38, 0.68), rgba(22, 20, 38, 0.18)),
    url("images/anime/hero-letter-desk.png") 62% center / cover no-repeat;
}
```

Replace every other `white-haired-letter-hero.png` or collage page background with paper, not a character:

```css
background:
  radial-gradient(circle at top left, rgba(255, 255, 255, 0.9), transparent 42%),
  linear-gradient(180deg, #f7f8fb, #eef1f6);
```

Update `og:image` in `index.html` and `404.html` to `hero-letter-desk.png`.

- [ ] **Step 2: Confirm old filenames are gone**

```powershell
Select-String -Path D:\boke\assets\app.js,D:\boke\assets\styles.css,D:\boke\index.html,D:\boke\404.html -Pattern "white-haired-"
```

Expected: no matches.

- [ ] **Step 3: Commit**

```powershell
git add assets/app.js assets/styles.css index.html 404.html
git commit -m "feat: map unique covers and remove repeated page art"
```

---

### Task 4: Rebuild inner pages as magazine templates

**Files:**
- Modify: `assets/app.js` functions `renderArchive`, `renderProjects`, `renderReading`, `renderAbout`, `renderArticle`

- [ ] **Step 1: Add helpers next to `pageHeader`**

```js
  function coverUrl(cover) {
    return String(cover || "").replace(/^url\(['"]?/, "").replace(/['"]?\)$/, "");
  }

  function magazineFrame(cover, alt) {
    const src = coverUrl(cover);
    return `
      <div class="atropos magazine-atropos" data-magazine-tilt>
        <div class="atropos-scale">
          <div class="atropos-rotate">
            <div class="atropos-inner magazine-cover" data-atropos-offset="4">
              <img src="${esc(src)}" alt="${esc(alt)}" data-zoom>
            </div>
          </div>
        </div>
      </div>
    `;
  }
```

- [ ] **Step 2: Rewrite archive rows**

Keep `pageHeader()` and month groups. Replace `.archive-row` items with:

```js
<article class="magazine-row ${index % 2 ? "is-flipped" : ""}" style="--cover: ${post.cover}">
  ${magazineFrame(post.cover, post.title)}
  <div class="magazine-copy">
    <time datetime="${esc(post.date)}">${post.date.slice(5).replace("-", "/")}</time>
    <p class="eyebrow">${esc(post.category)}</p>
    <h3><a href="${postHref(post)}">${esc(post.title)}</a></h3>
    <p>${esc(post.note || post.summary)}</p>
    <span>${readingTime(post)} 分钟</span>
  </div>
</article>
```

Wrap the list in `<section class="magazine-list">`.

- [ ] **Step 3: Rewrite projects, reading, and about**

`renderProjects()` output one `.magazine-project` per project:

```js
<article class="magazine-project ${index % 2 ? "is-flipped" : ""}">
  ${magazineFrame(project.cover, project.title)}
  <div class="magazine-copy">
    <p class="eyebrow">${esc(project.tags[0])}</p>
    <h2><a href="#/projects/${project.slug}">${esc(project.title)}</a></h2>
    <p>${esc(project.desc)}</p>
    <div class="project-status">
      <span>${esc(project.status)}</span>
      <small>最近更新 ${esc(project.updated)}</small>
    </div>
    <div class="tag-row">${tagChips(project.tags)}</div>
  </div>
</article>
```

`renderReading()` output four `.shelf-card` items. Top: `magazineFrame(item.cover, item.title)`. Bottom: title, topic, status, desc, and a `.shelf-progress` width from `item.progress`.

`renderAbout()`:

```js
<section class="about-hero">
  <img src="${esc(covers.about)}" alt="" data-zoom>
  <div>
    <p class="eyebrow">about</p>
    <h1>关于 beid</h1>
    <p>这里是 beid 的个人博客。</p>
  </div>
</section>
<section class="about-notes">
  <article class="about-note-card"><h2>写什么</h2><p>项目是做过的东西，文章是当时的判断，阅读是还在消化的材料。</p></article>
  <article class="about-note-card"><h2>怎么维护</h2><p>目前依旧是无构建的静态 SPA，内容集中在 assets/app.js。</p></article>
  <article class="about-note-card"><h2>视觉原则</h2><p>清晰文字、少量强调色、独立角色封面和稳定间距。</p></article>
  <article class="about-note-card"><h2>站点规模</h2><p>${posts.length} 篇文章、${projects.length} 个项目、${readingItems.length} 条阅读、${getAllTags().length} 个标签。</p></article>
</section>
```

- [ ] **Step 4: Rewrite the article hero, keep body and TOC**

```js
<header class="article-hero magazine-article-hero">
  ${magazineFrame(post.cover, post.title)}
  <div class="magazine-copy">
    <p class="eyebrow">${esc(post.category)}</p>
    <h1 class="article-title">${esc(post.title)}</h1>
    <div class="inline-meta">
      <span>${formatDate(post.date)}</span>
      <span>${readingTime(post)} 分钟阅读</span>
    </div>
    <p class="article-note">${esc(post.note || "")}</p>
  </div>
</header>
```

Prev/next cards include the matching cover thumbnail via `coverUrl(older.cover)` / `coverUrl(newer.cover)`. Keep the meta rail and TOC, but do not make CRT the primary look.

- [ ] **Step 5: Syntax-check**

```powershell
node --check D:\boke\assets\app.js
```

Expected: exit code 0 and no output.

- [ ] **Step 6: Commit**

```powershell
git add assets/app.js
git commit -m "feat: rebuild inner pages as magazine layouts"
```

---

### Task 5: Add the magazine CSS layer

**Files:**
- Modify: `assets/styles.css`

- [ ] **Step 1: Append this layer at the end of `assets/styles.css`**

Do not rewrite home Maikire layout rules. Only the hero background filename may change.

```css
:root {
  --ease-out-5: cubic-bezier(0.19, 1, 0.22, 1);
  --shadow-4: 0 18px 46px rgba(31, 41, 55, 0.08);
}

.magazine-list,
.magazine-project,
.shelf-grid,
.about-notes {
  display: grid;
  gap: 28px;
}

.magazine-row,
.magazine-project,
.shelf-card,
.about-hero {
  display: grid;
  grid-template-columns: minmax(180px, 0.9fr) minmax(0, 1.2fr);
  gap: 28px;
  align-items: center;
  border: 1px solid rgba(226, 232, 240, 0.92);
  border-radius: 18px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.92);
  box-shadow: var(--shadow-4);
}

.magazine-row.is-flipped,
.magazine-project.is-flipped {
  grid-template-columns: minmax(0, 1.2fr) minmax(180px, 0.9fr);
}

.magazine-cover,
.magazine-cover img,
.about-hero img,
.shelf-card img {
  display: block;
  width: 100%;
  aspect-ratio: 3 / 4;
  object-fit: cover;
  border-radius: 14px;
}

.magazine-copy h2,
.magazine-copy h3,
.article-title {
  line-height: 1.2;
  letter-spacing: -0.03em;
}

.magazine-row,
.magazine-project,
.shelf-card,
.about-note-card {
  transition: transform 420ms var(--ease-out-5), box-shadow 420ms var(--ease-out-5);
}

.magazine-row:hover,
.magazine-project:hover,
.shelf-card:hover,
.about-note-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 24px 56px rgba(31, 41, 55, 0.12);
}

.shelf-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.shelf-card {
  grid-template-columns: 1fr;
  align-items: stretch;
}

.about-notes {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

@media (max-width: 768px) {
  .magazine-row,
  .magazine-row.is-flipped,
  .magazine-project,
  .magazine-project.is-flipped,
  .about-hero,
  .article-layout {
    grid-template-columns: 1fr;
  }

  .shelf-grid,
  .about-notes {
    grid-template-columns: 1fr;
  }
}

@media (prefers-reduced-motion: reduce) {
  .magazine-row,
  .magazine-project,
  .shelf-card,
  .about-note-card {
    transition: none;
  }
}
```

- [ ] **Step 2: Commit**

```powershell
git add assets/styles.css
git commit -m "style: add magazine inner-page layout layer"
```

---

### Task 6: Wire Lenis, Atropos, and medium-zoom

**Files:**
- Modify: `index.html`
- Modify: `404.html`
- Modify: `assets/app.js`

- [ ] **Step 1: Load the libraries before `assets/app.js` in both HTML files**

```html
<link rel="stylesheet" href="https://unpkg.com/atropos@2.0.2/atropos.min.css">
<script type="module">
  import Lenis from "https://unpkg.com/lenis@1.3.4/dist/lenis.mjs";
  import Atropos from "https://unpkg.com/atropos@2.0.2/atropos.min.js";
  import mediumZoom from "https://unpkg.com/medium-zoom@1.1.0/dist/medium-zoom.esm.js";
  window.Lenis = Lenis;
  window.Atropos = Atropos.default || Atropos;
  window.mediumZoom = mediumZoom;
  window.dispatchEvent(new Event("motion-libs-ready"));
</script>
```

Keep `404.html` asset paths rooted at `/assets/app.js`.

- [ ] **Step 2: Add a motion controller in `assets/app.js`**

```js
  const motion = {
    lenis: null,
    tilts: [],
    zoom: null
  };

  function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function destroyMotionEnhancements() {
    motion.tilts.splice(0).forEach((tilt) => tilt.destroy?.());
    motion.zoom?.detach();
    motion.zoom = null;
  }

  function initLenis() {
    if (prefersReducedMotion() || !window.Lenis || motion.lenis) return;
    motion.lenis = new window.Lenis({ autoRaf: true });
    motion.lenis.on("scroll", updateScrollState);
  }

  function initMotionEnhancements() {
    destroyMotionEnhancements();
    if (prefersReducedMotion()) return;
    initLenis();
    document.querySelectorAll("[data-magazine-tilt]").forEach((node) => {
      if (!window.Atropos) return;
      motion.tilts.push(window.Atropos(node, { activeOffset: 28, rotateXMax: 9, rotateYMax: 9 }));
    });
    if (window.mediumZoom) {
      motion.zoom = window.mediumZoom("[data-zoom]", {
        background: "rgba(247, 248, 251, 0.92)",
        margin: 24
      });
    }
  }
```

- [ ] **Step 3: Hook the controller into page life cycle**

Call `initMotionEnhancements()` at the end of `afterRender()`.

Add these selectors to `prepareMotion()`: `.magazine-row, .magazine-project, .shelf-card, .about-hero, .about-note-card, .magazine-article-hero`.

Change back-to-top:

```js
if (action === "back-top") {
  if (motion.lenis) motion.lenis.scrollTo(0);
  else window.scrollTo({ top: 0, behavior: "smooth" });
}
```

In `render()`, reset scroll with `motion.lenis?.scrollTo(0, { immediate: true })` when Lenis exists, otherwise keep `window.scrollTo({ top: 0, behavior: "auto" })`.

Also listen once:

```js
window.addEventListener("motion-libs-ready", () => {
  initLenis();
  initMotionEnhancements();
});
```

If a CDN script fails, skip silently. The page must remain readable.

- [ ] **Step 4: Commit**

```powershell
git add index.html 404.html assets/app.js
git commit -m "feat: wire Lenis, Atropos, and medium-zoom"
```
---

### Task 7: Remove old portraits, document the stack, and verify

**Files:**
- Delete: `assets/images/anime/white-haired-writing.png`
- Delete: `assets/images/anime/white-haired-reading.png`
- Delete: `assets/images/anime/white-haired-sketching.png`
- Delete: `assets/images/anime/white-haired-stargazing.png`
- Delete: `assets/images/anime/white-haired-profile.png`
- Delete: `assets/images/anime/white-haired-category-collage.png`
- Delete: `assets/images/anime/white-haired-letter-hero.png`
- Modify: `README.md`

- [ ] **Step 1: Delete old images only after the reference scan is empty**

```powershell
Select-String -Path D:\boke\index.html,D:\boke\404.html,D:\boke\assets\app.js,D:\boke\assets\styles.css,D:\boke\README.md -Pattern "white-haired-"
Remove-Item D:\boke\assets\images\anime\white-haired-*.png
```

Expected: the search prints nothing, then the seven old files are gone.

- [ ] **Step 2: Update README**

Add a short section that states:

- Cover portraits are one file per slot and live in `assets/images/anime/`
- Home structure stays; inner pages use magazine templates
- CDN libraries are Lenis 1.3.4, Atropos 2.0.2, and medium-zoom 1.1.0
- `prefers-reduced-motion` disables smooth scroll, tilt, and zoom animation

- [ ] **Step 3: Run syntax check and the full Playwright file**

```powershell
node --check D:\boke\assets\app.js
cd D:\boke
npx playwright test tests/blog.spec.js
```

Expected: all tests PASS, including the old regressions and the new magazine cases.

- [ ] **Step 4: Manual pass**

Run `npx serve .` and check:

- Home cover structure and section order are unchanged, but the art is new
- Archive, projects, reading, about, and article pages are large-image magazine layouts
- Hover tilts, scrolling feels smooth, clicking a cover zooms
- 390px width has no horizontal scroll
- Blocking the CDN still leaves a readable site

- [ ] **Step 5: Commit**

```powershell
git add README.md assets/images/anime
git commit -m "chore: drop reused portraits and document motion stack"
```

---

## Self-review

- Home structure lock: Task 3 only changes the hero filename; Task 5 forbids rewriting Maikire layout rules.
- 18 unique portraits: Task 2 plus Task 3.
- No game or franchise characters: Task 2 prompts say so.
- Magazine inner pages: Task 4 plus Task 5.
- Lenis / Atropos / medium-zoom: Task 6. Open Props easing and shadow only: Task 5.
- No AOS / GSAP / Live2D / WebGL hover tasks.
- Magent repo link: Task 3 and Task 4.
- No personal project wall and no external repo recommendation wall.
- Reduced motion and CDN fallback: Task 1 tests plus Task 6.
- No TBD, no empty test steps, and no "do the same as a previous task".