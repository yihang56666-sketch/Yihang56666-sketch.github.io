# beid blog

这是从旧博客和 GitHub Pages 备份重建的个人静态博客。当前版本不依赖 Hexo 构建链，仓库根目录可以直接作为 GitHub Pages 发布源。

## 站点目标

- 保留博客外壳、夜城视觉、项目页、标签、分类和学习计划入口。
- 版式参考现代文章博客：顶部导航、文章流、侧栏信息、文章目录、版权说明、上一篇/下一篇。
- 当前内容数据已清空，方便重新写文章和项目复盘。
- 将内容数据集中到 `assets/app.js`，减少静态页面之间的重复维护。

## 本地预览

直接打开 `index.html` 即可预览多数页面。

如果要验证路由 fallback，可启动任意静态服务器后访问类似：

```bash
npx serve .
```

然后打开：

```text
http://localhost:3000/archive/
```

## 内容维护

文章数据集中在 `assets/app.js` 的 `posts` 数组。新增文章时填写：

- `slug`：新版 hash 路由，例如 `#/posts/my-first-post`
- `title`：文章标题
- `date` / `updated`：发布日期和更新日期，格式为 `YYYY-MM-DD`
- `category`：分类名
- `tags`：标签数组
- `cover`：封面图变量或 CSS `url(...)`
- `legacyPaths`：可选的旧路径数组，用于 404 路由兼容
- `summary`：卡片摘要和 SEO 描述
- `sections`：正文段落、列表、代码块和提示信息

项目入口维护在 `projects` 数组，除标题、描述、标签、关联文章和封面外，也可以维护：

- `status`：项目当前状态，例如“已跑通”“待补误差表”
- `updated`：项目卡片上的最近更新日期，格式可用 `MM/DD`
- `next`：下一步要补的内容，例如现场图、误差记录、部署截图

首页“站点现场”维护在 `siteUpdates` 数组；归档页每个月的叙事小字维护在 `archiveNotes` 对象。页面标题、归档、标签、分类、关于等基础文案维护在 `pages` 和 `site` 配置里。

## 视觉素材

当前二次元 / 夜城风格素材集中在 `assets/images/edgerunners/`，主要来自 Cyberpunk: Edgerunners 官方公开页面资源。个人博客展示时可继续使用；如果后续要做商业化展示或公开分发模板，建议替换成自有授权图片。

## 动效与开源库取舍

当前动效主要使用原生 CSS、`IntersectionObserver`、`scroll` 进度和少量 DOM 增强实现。`augmented-ui` 通过 CDN 接入，只用于导航、项目卡、站点现场和文章提示等少量 HUD 面板。

已实现的轻交互包括：滚动渐入、路由入场、顶部阅读进度、目录高亮、代码块复制、卡片指针光斑、封面 hover 微动效、HUD 状态条扫描线、文章实验日志终端块，以及 `/` 键快速回到首页搜索。

当前采用与调研过的开源方向：

- [`augmented-ui`](https://github.com/propjockey/augmented-ui)：已小范围接入，用 `data-augmented-ui` 给关键面板加斜切边框；主题色和尺寸仍由 `assets/styles.css` 控制。
- [`cyberpunk-css`](https://github.com/alddesign/cyberpunk-css)：可借鉴标题、警示条和装饰线，但整包风格太强，暂不直接覆盖当前博客。
- [`Open Props`](https://github.com/argyleink/open-props)：适合学习 token 化的阴影、动画曲线和尺寸系统；当前变量已够用，先借鉴思路。
- [`Lenis`](https://github.com/darkroomengineering/lenis)：适合整站平滑滚动，但个人博客长文阅读不宜过度接管滚动。
- [`Anime.js`](https://github.com/juliangarnier/anime) / [`Motion One`](https://motion.dev/)：适合复杂编排动画；当前卡片、路由和滚动动效用 CSS 足够。
- [`AOS`](https://github.com/michalsnik/aos) / `ScrollReveal`：滚动出现动画能做，但原生 `IntersectionObserver` 更轻。
- [`medium-zoom`](https://github.com/francoischalifour/medium-zoom)：后续文章正文图变多时值得加入，适合点击放大图片。
- [`Pagefind`](https://pagefind.app/)：文章数量上来后可替换当前简单搜索，做静态全文搜索。
- [`Swup`](https://github.com/swup/swup)：适合传统多页站转场；当前 hash 路由已经由 `assets/app.js` 接管。
- [`terminal.css`](https://github.com/Gioni06/terminal.css/)：已借鉴“终端日志块”的信息结构，但没有整包引入，避免全局字体、表单和排版被覆盖。

## SEO 与路由

- `index.html` 提供基础 meta、Open Graph、canonical 和站点骨架。
- `assets/app.js` 会根据当前路由动态更新 `title`、`description`、Open Graph 和 JSON-LD。
- `sitemap.xml` 收录首页和主要入口页。
- `robots.txt` 允许全站抓取并指向 sitemap。
- 可选旧路径由 `legacyPaths` 与 `404.html` 共同处理。

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
