# 博客项目 HR 面试指导书

## 一句话介绍

这是一个部署在 GitHub Pages 上的原生 JavaScript 静态博客 SPA，重点解决低成本发布、Hash 路由、内容归档、响应式阅读和分享元数据维护问题。

## 技术与架构

- HTML/CSS/JavaScript，无前端框架、无构建步骤，根目录直接作为 Pages 发布源。
- `assets/app.js` 集中维护文章、项目、更新数据，并负责路由解析、页面渲染、主题和交互。
- `assets/styles.css` 负责响应式布局、主题、动效和 reduced-motion 适配。
- `404.html` 将 GitHub Pages 的未知路径回退到 SPA；站内导航使用 `#/archive`、`#/projects` 等 Hash 路由。
- Lenis、Atropos、medium-zoom、Lucide 等增强能力通过 CDN 可选加载，加载失败不影响正文阅读。

## 可演示路径

```powershell
cd D:\boke
npx serve . -l 4173
npx playwright test
```

可现场演示首页、文章归档、项目页、关于页、暗色模式、移动端导航、搜索输入、错误路由和 reduced-motion。当前 Playwright 完整回归 15/15 通过（含目录锚点不触发 404、中文输入法组合不被重渲染打断两条回归）；测试配置会启动静态服务器。

## HR 常问与回答

**为什么不用 React/Vue？** 这个项目的目标是静态托管和极低部署成本；页面规模可控时原生实现能减少构建链和运行时依赖。

**Hash 路由有什么取舍？** GitHub Pages 无需服务端重写即可支持页面导航和分享；代价是 URL 包含 Hash，SEO 元数据需要在每次路由渲染时同步。

**如何保证 CDN 挂掉页面仍可用？** 增强库只参与动效和缩放，初始化代码有能力检测和异常兜底，核心 HTML 内容不依赖它们。

**你测试了什么？** Playwright 覆盖主要路由、移动端无横向溢出、主题持久化、搜索焦点、错误恢复、Canonical/OG 元数据和 reduced-motion。

**目前诚实的限制是什么？** 内容仍集中在 JS 数据结构，没有 CMS；文章更新需要提交代码。Hash 路由也不是服务端渲染，搜索引擎表现依赖元数据和 Pages 抓取。

## 下一步

把文章数据拆到 Markdown/JSON 并在 CI 中生成静态页面；同时为 CDN 依赖增加版本锁定或本地 fallback。
