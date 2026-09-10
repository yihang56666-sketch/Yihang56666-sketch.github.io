# 博客项目 HR 面试指导书

更新：2026-09-30。

## 一句话介绍

部署在 GitHub Pages 上的无构建静态 SPA 博客：Hash 路由、动态 SEO 元数据、深浅主题、Playwright 回归，根目录直接发布。

## 技术与架构

- 原生 HTML/CSS/JavaScript，无框架、无打包链。
- `assets/app.js` 集中维护文章/项目数据、路由、渲染与主题；`assets/styles.css` 负责主题 token 与响应式。
- `404.html` 与 `index.html` 统一使用本地 vendor（Lenis / Atropos / medium-zoom / Lucide），不依赖 unpkg `@latest`。
- `atom.xml` 提供真实 Atom 订阅；RSS 图标指向真实 feed，不再假装指向归档页。
- 15 条 Playwright E2E：路由、移动端溢出、主题持久化、中文 IME、TOC 锚点、reduced-motion、计数器等。

## 可演示路径

```powershell
cd D:\boke
npx serve . -l 4173
npx playwright test
```

## HR 常问与回答

**为什么不用 React/Vue？** 目标是静态托管与极低部署成本；页面规模可控时原生实现能减少构建链和运行时依赖。

**Hash 路由取舍？** Pages 无需服务端重写即可导航；代价是 URL 带 Hash，SEO 靠每次路由渲染同步元数据。

**CDN 挂了还能用吗？** 增强库已本地化到 `assets/vendor/`；核心阅读路径不依赖网络加载第三方。

**你测试了什么？** Playwright 覆盖主要路由、移动端无横向溢出、主题持久化、搜索 IME 焦点、错误恢复、Canonical/OG、reduced-motion。

**诚实限制？** 内容在 JS 数据结构中，无 CMS；Hash 路由不是 SSR；文章数量仍在增长。

## 本轮双选会前修复

- 去掉假字数，改为真实 `charCount` + 阅读分钟。
- RSS 改为真实 `atom.xml`。
- 取消 gitignore 中的 package.json，clone 后可直接跑测试。
- 空壳 `#/kaoyan` 重定向到项目页。
- 404 与 index 依赖策略对齐（本地 vendor）。
- 统一内外页主色（紫/玫红/暖金）与衬线标题（Instrument Serif）。
- 站点项目卡片测试数字与硬件仓实测对齐（1017）。

