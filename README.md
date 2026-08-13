# beid blog

这是从旧博客和 GitHub Pages 备份重建的个人静态博客。当前版本不依赖 Hexo 构建链，仓库根目录可以直接作为 GitHub Pages 发布源。

## 站点目标

- 保留博客外壳、项目页、标签、分类和学习计划入口，视觉改为柔和、动态的二次元博客，封面角色不重复。
- 版式参考现代文章博客：顶部导航、文章流、侧栏信息、文章目录、版权说明、上一篇/下一篇。
- 文章、项目、阅读清单和站点更新都集中维护在 `assets/app.js`，页面本身只负责渲染和路由。
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

当前白毛二次元风格素材集中在 `assets/images/anime/`，用于首页主视觉、分类拼贴、个人侧栏和文章卡片封面。后续新增图片时优先放在该目录，并同步更新 `assets/app.js` 中的图片变量。

## 动效与开源库取舍

当前动效主要使用原生 CSS、`IntersectionObserver`、`scroll` 进度和少量 DOM 增强实现。页面包含浮窗、弹幕、漂浮纸片、花瓣、滚动渐入、路由入场、卡片 hover 和移动端导航动效。

已实现的轻交互包括：滚动渐入、路由入场、顶部阅读进度、目录高亮、代码块复制、卡片指针光斑、封面 hover 微动效、浮动玻璃面板、弹幕条和 `/` 键快速回到首页搜索。

当前采用与调研过的开源方向：

- [`augmented-ui`](https://github.com/propjockey/augmented-ui)：已小范围接入，用 `data-augmented-ui` 给关键面板加斜切边框；主题色和尺寸仍由 `assets/styles.css` 控制。
- [`Open Props`](https://github.com/argyleink/open-props)：适合学习 token 化的阴影、动画曲线和尺寸系统；当前变量已够用，先借鉴思路。
- [`Lenis`](https://github.com/darkroomengineering/lenis)：适合整站平滑滚动，但个人博客长文阅读不宜过度接管滚动。
- [`Anime.js`](https://github.com/juliangarnier/anime) / [`Motion One`](https://motion.dev/)：适合复杂编排动画；当前卡片、路由和滚动动效用 CSS 足够。
- [`AOS`](https://github.com/michalsnik/aos) / `ScrollReveal`：滚动出现动画能做，但原生 `IntersectionObserver` 更轻。
- [`medium-zoom`](https://github.com/francoischalifour/medium-zoom)：后续文章正文图变多时值得加入，适合点击放大图片。
- [`Pagefind`](https://pagefind.app/)：文章数量上来后可替换当前简单搜索，做静态全文搜索。
- [`Swup`](https://github.com/swup/swup)：适合传统多页站转场；当前 hash 路由已经由 `assets/app.js` 接管。
- [`terminal.css`](https://github.com/Gioni06/terminal.css/)：已借鉴“终端日志块”的信息结构，但没有整包引入，避免全局字体、表单和排版被覆盖。

## 维护检查

每次调整路由、交互或样式后，建议至少运行：

```bash
node --check assets/app.js
npx playwright test --reporter=line
git diff --check
```

浏览器回归覆盖首页、归档、文章、项目、阅读、关于和无效路由，并重点检查 390px、768px 和桌面宽度。首页只由 `renderHomeMaikire()` 渲染；新增事实性内容前先补充 `posts`、`projects` 或对应数据数组，再让页面自动生成统计、归档和元信息。

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
- `assets/images/anime/`
- `index.html`
- `404.html`
- `robots.txt`
- `sitemap.xml`
- `README.md`


## 封面与动效

- 角色图一对一放在 `assets/images/anime/`，不要复用同一张图当封面和整页背景。
- 首页封面结构保持不变；归档、项目、阅读、关于、文章使用杂志大图模板。
- CDN：Lenis 1.3.4、Atropos 2.0.2、medium-zoom 1.1.0。开启“减少动态”时全部降级。
- 来源记录见 `assets/images/anime/IMAGE-CREDITS.md`。
