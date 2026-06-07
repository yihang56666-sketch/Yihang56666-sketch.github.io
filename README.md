# beid blog

这是从旧博客和 GitHub Pages 备份重建的个人静态博客。当前版本不依赖 Hexo 构建链，仓库根目录可以直接作为 GitHub Pages 发布源。

## 站点目标

- 保留旧站文章、项目、标签、分类和学习计划入口。
- 版式参考现代文章博客：顶部导航、文章流、侧栏信息、文章目录、版权说明、上一篇/下一篇。
- 用 `404.html` 接管旧 Hexo 风格链接，让旧文章 URL 仍能渲染到新版文章页。
- 将内容数据集中到 `assets/app.js`，减少静态页面之间的重复维护。

## 本地预览

直接打开 `index.html` 即可预览多数页面。

如果要验证旧链接 fallback，可启动任意静态服务器后访问类似：

```bash
npx serve .
```

然后打开：

```text
http://localhost:3000/2026/05/27/电赛送药小车控制系统/
```

## 内容维护

文章数据集中在 `assets/app.js` 的 `posts` 数组。新增文章时填写：

- `slug`：新版 hash 路由，例如 `#/posts/drug-cart`
- `title`：文章标题
- `date` / `updated`：发布日期和更新日期，格式为 `YYYY-MM-DD`
- `category`：分类名
- `tags`：标签数组
- `cover`：封面图变量或 CSS `url(...)`
- `legacyPaths`：旧站路径数组，用于 404 路由兼容
- `summary`：卡片摘要和 SEO 描述
- `sections`：正文段落、列表、代码块和提示信息

项目入口维护在 `projects` 数组；页面标题、归档、标签、分类、关于等基础文案维护在 `pages` 和 `site` 配置里。

## 视觉素材

当前二次元 / 夜城风格素材集中在 `assets/images/edgerunners/`，主要来自 Cyberpunk: Edgerunners 官方公开页面资源。个人博客展示时可继续使用；如果后续要做商业化展示或公开分发模板，建议替换成自有授权图片。

## SEO 与路由

- `index.html` 提供基础 meta、Open Graph、canonical 和站点骨架。
- `assets/app.js` 会根据当前路由动态更新 `title`、`description`、Open Graph 和 JSON-LD。
- `sitemap.xml` 收录首页和主要入口页。
- `robots.txt` 允许全站抓取并指向 sitemap。
- 旧路径由 `legacyPaths` 与 `404.html` 共同处理。

## 文件边界

当前优化只修改这些文件：

- `assets/app.js`
- `assets/styles.css`
- `assets/images/edgerunners/`
- `index.html`
- `404.html`
- `robots.txt`
- `sitemap.xml`
- `README.md`
