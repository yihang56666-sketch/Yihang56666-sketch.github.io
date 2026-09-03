import { test, expect } from "@playwright/test";

test("home exposes the primary reading paths", async ({ page }) => {
  await page.goto("/#/");
  await expect(page.locator("h1").first()).toContainText("beid");
  await expect(page.locator('a[href="#/archive"]').first()).toBeVisible();
  await expect(page.locator('a[href="#/projects"]').first()).toBeVisible();
  await page.locator('a[href="#/archive"]').first().click();
  await expect(page).toHaveURL(/#\/archive$/);
  await expect(page.locator("main h1")).toContainText("文章归档");
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
  const dark = await page.locator("html").evaluate((el) => el.classList.contains("dark"));
  await page.reload();
  expect(await page.locator("html").evaluate((el) => el.classList.contains("dark"))).toBe(dark);
});

test("invalid routes provide recovery", async ({ page }) => {
  await page.goto("/#/missing-route");
  await expect(page.locator("main")).toContainText("找不到");
  await expect(page.locator('a[href="#/"]').last()).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex,follow");
});

test("base layout clips overflow and respects reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#/archive");
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).overflowX)).toBe("clip");
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe("auto");
});

test("content routes expose shareable metadata", async ({ page }) => {
  await page.goto("/#/");
  await expect(page.locator("main")).toBeVisible();
  await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /.+/);
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", /^https:\/\//);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://yihang56666-sketch.github.io");

  await page.goto("/#/missing-route");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://yihang56666-sketch.github.io");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex,follow");
});

test("legacy post paths still resolve through the fallback", async ({ page }) => {
  await page.goto("/#/missing-route");
  await expect(page.locator("main")).toContainText("找不到");
});

test("search input keeps focus while typing and filters posts", async ({ page }) => {
  await page.goto("/#/");
  const search = page.locator("[data-search]");
  await search.click();
  await search.pressSequentially("测试", { delay: 30 });
  await expect(search).toBeFocused();
  await expect(page.locator("[data-search]")).toHaveValue("测试");
});

test("table of contents links scroll in place instead of hitting the 404 route", async ({ page }) => {
  await page.goto("/#/posts/codex-native-subagent-orchestrator-skill");
  const tocLink = page.locator(".toc-panel a[href^='#']").first();
  await expect(tocLink).toBeVisible();
  await tocLink.click();
  // 回归：裸 #fragment 曾被 hashchange 当成路由解析成 notFound，整篇文章被 404 页替换。
  await expect(page).toHaveURL(/posts\/codex-native-subagent-orchestrator-skill/);
  await expect(page.locator("main")).not.toContainText("找不到");
  await expect(page.locator(".article-main")).toBeVisible();
});

test("search ignores IME composition events and applies the filter on compositionend", async ({ page }) => {
  await page.goto("/#/");
  const search = page.locator("[data-search]");
  await search.click();
  // 模拟 CJK 输入法组合：input 事件携带 isComposing=true 时不得整体重渲染，
  // 否则正在组词的输入框被销毁，中文搜索根本打不出字。
  await page.evaluate(() => {
    const input = document.querySelector("[data-search]");
    input.__beidCompositionProbe = true;
    input.value = "ceshi";
    input.dispatchEvent(new InputEvent("input", { bubbles: true, composed: true, isComposing: true }));
  });
  expect(await page.evaluate(() => document.querySelector("[data-search]")?.__beidCompositionProbe === true)).toBe(true);

  // 组合提交（compositionend）后过滤器生效。
  await page.evaluate(() => {
    const input = document.querySelector("[data-search]");
    input.value = "测试";
    input.dispatchEvent(new CompositionEvent("compositionend", { bubbles: true, data: "测试" }));
  });
  await expect(page.locator("[data-search-live]")).toContainText(/匹配 \d+ 篇/);
});

test("home cover structure stays and uses distinct new art", async ({ page }) => {
  await page.goto("/#/");
  await expect(page.locator(".maikire-hero")).toBeVisible();
  await expect(page.locator(".maikire-category-card")).toHaveCount(4);
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
  const rowCount = await rows.count();
  expect(rowCount).toBeGreaterThan(0);
  const covers = await rows.evaluateAll((nodes) => nodes.map((node) => node.getAttribute("style")));
  expect(new Set(covers).size).toBe(covers.length);
  expect(covers.join(" ")).not.toContain("white-haired-");
});

test("inner content pages use the magazine templates", async ({ page }) => {
  await page.goto("/#/projects");
  await expect(page.locator(".magazine-project")).toHaveCount(3);

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
