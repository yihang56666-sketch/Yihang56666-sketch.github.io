# 内页杂志排版、独立高清角色与流动动效设计

## 目标

在保留首页封面结构和布局的前提下，解决三类问题：角色贴图重复且不够高清、封面以外栏目排版拥挤、页面缺少悬停/滚动流动感。同时把 GitHub 上已经公开、适合展示的自有项目补进项目页，把少量高质量外部仓库放进链接页作为引用。

本轮成功标准：

- 首页 `renderHomeMaikire()` 的区块顺序、栅格和封面结构不改，只替换重复贴图。
- 归档、项目、阅读、关于、文章、标签、分类页改为大图杂志排版，桌面与 390px 移动端都不横向溢出。
- 每张角色图只服务一个位置，不再出现同一张图同时当封面、卡片和页面背景。
- 角色为高清原创二次元人物；气质可以接近超级英雄或《葬送的芙莉莲》，但不画正版角色，也不画任何游戏角色。
- 悬停时图片、文字和光感会变化；滚动时卡片依次出现，封面有轻微视差；`prefers-reduced-motion` 下关闭装饰动效。
- 项目页展示 `magent` 与 `NextBoard` 两个真实仓库；不展示自动注册/会话采集类项目。
- 不引入框架、构建步骤或新的运行时库；继续用 Vanilla HTML/CSS/JS + GitHub Pages hash 路由。

## 方案与边界

采用“首页锁定 + 内页重排 + 资产换新”：

- 首页结构和布局锁定。
- 内页渲染函数重写为杂志/书架模板，CSS 新增内页层，不再沿用现在的窄列表和灰盒 `plain-panel` 作为主视觉。
- 用 imagegen 生成一组不重复的高清角色图，写入 `assets/images/anime/`，由 `covers` 一对一引用。
- 页面底纹改为浅色纸感或雾面渐变，删除 `styles.css` 里把 `white-haired-letter-hero.png` / collage 当整页背景的规则。

明确不做：

- 不改首页封面结构和布局。
- 不画蜘蛛侠、芙莉莲、雷电将军或其他可识别 IP / 游戏角色。
- 不把 `retoolautoregautomange` 及其同类自动注册项目写进公开博客。
- 不引入 Lenis、Anime.js、AOS 等新运行时依赖。
- 不虚构未在 GitHub/现有文案中出现的项目事实。
- 不把本轮做成 CMS/Markdown 迁移。

## GitHub 扫描结论

公开账号 [yihang56666-sketch](https://github.com/yihang56666-sketch) 现有 5 个仓库。适合上站的只有下面两个自有项目：

| 仓库 | 上站方式 | 理由 |
|---|---|---|
| [magent](https://github.com/yihang56666-sketch/magent) | 更新现有项目卡，纠正仓库链接 | 现有“Codex 多智能体编排框架”应对齐这个源码仓库，而不是 github.io 站点仓 |
| [NextBoard](https://github.com/yihang56666-sketch/NextBoard) | 新增项目卡 | 嵌入式硬件副驾驶，README 完整，主题是 CubeMX / 固件 / 台架安全门控 |

不上站：

- `Yihang56666-sketch.github.io`：这是博客本身，不当项目作品重复陈列。
- `Yihang56666-sketch`：主页介绍仓，没有独立作品信息。
- `retoolautoregautomange`：自动注册与登录态采集，不适合作为公开作品引用。

链接页可增加“最近在看”引用，只放用户已 star、且适合公开推荐的仓库，文案标明“引用 / 在看”，不写成自己的作品：

- [obra/superpowers](https://github.com/obra/superpowers)
- [mengxi-ream/read-frog](https://github.com/mengxi-ream/read-frog)
- [TLRKFXE/BiliShelf](https://github.com/TLRKFXE/BiliShelf)
- [esengine/DeepSeek-Reasonix](https://github.com/esengine/DeepSeek-Reasonix)
- [awesome-selfhosted/awesome-selfhosted](https://github.com/awesome-selfhosted/awesome-selfhosted)

## 角色资产

所有新图放在 `assets/images/anime/`，文件名按用途命名，不再使用 `white-haired-*` 作为多处别名。`covers` 里每个键对应一张独立文件。

### 首页（只换图）

| 键 | 文件 | 角色方向 |
|---|---|---|
| `hero` | `hero-letter-desk.png` | 原创少女在白色书桌前写信，构图接近现有封面 |
| `profile` | `profile-host.png` | 另一位日常私服角色，只用于侧栏头像 |
| `catDesign` | `category-editorial.png` | 编辑/时装插画师 |
| `catProjects` | `category-workshop.png` | 工作台前的创作者 |
| `catReading` | `category-library.png` | 图书馆里的阅读者 |
| `catLab` | `category-night-light.png` | 夜间调光的界面观察者 |

### 文章封面

| 文章 | 文件 | 角色方向 |
|---|---|---|
| 博客换装手记 | `post-blog-redesign.png` | 白色房间里整理版式的插画师 |
| 把项目复盘写成可读的故事 | `post-project-stories.png` | 把草稿钉在墙上的叙事者 |
| 我的阅读缓存整理法 | `post-reading-cache.png` | 书架间做卡片索引的学者 |
| 个人知识库的标签粒度 | `post-tag-granularity.png` | 整理标签柜的档案员 |
| 轻量 SPA 博客的维护清单 | `post-spa-checklist.png` | 深夜核对清单的前端工程师 |
| 深夜界面调光记录 | `post-night-lighting.png` | 阳台上看城市灯光的角色 |

### 项目与阅读、关于

| 用途 | 文件 | 角色方向 |
|---|---|---|
| magent | `project-magent-hero.png` | 原创红蓝防护服工程师，有都市夜景，不画蜘蛛侠脸或标志 |
| NextBoard | `project-nextboard-lab.png` | 原创作案台上的嵌入式工程师，周围是开发板和探针 |
| 写给大家看的设计书 | `reading-design-book.png` | 银发精灵旅人在废墟看书，只借鉴芙莉莲气质 |
| Refactoring UI | `reading-refactoring-ui.png` | 手持色票和组件稿的界面设计师 |
| How to Take Smart Notes | `reading-smart-notes.png` | 把卡片连成网的笔记学生 |
| Web 可访问性清单 | `reading-a11y.png` | 检查对比度和焦点环的设计师 |
| 关于页主视觉 | `about-host-garden.png` | 与头像不同的第三位角色，走在白色庭院/房间里 |

生成约束：

- 竖构图或接近 3:4 的角色特写 + 场景，适合裁成封面。
- 高清、干净、浅色或电影感光，不要文字、水印、UI 框。
- 人物五官和服装彼此明显不同，避免“同一张脸换衣服”。
- 旧的 `white-haired-*.png` 生成并验证后删除，避免继续被 CSS 当背景引用。

## 内页排版

### 归档 / 标签 / 分类

现在是月份标题 + 无图窄行。改为大图时间线：

- 左侧或顶部保留月份标签，桌面端月份可粘滞。
- 每篇文章是一条宽幅杂志行：左侧大角色图，右侧标题、短注、分类、阅读时长。
- 相邻行左右交替，避免所有图都挤在同一侧。
- 空状态保持可回到首页/归档的恢复入口。

### 项目列表

现在是单卡栅格，且只有一个项目。改为宽幅专题流：

- 每个项目占一整行，图文左右交替。
- 展示状态、最近更新、一句话描述、标签和仓库链接。
- `magent` 作为现有条目更新；`NextBoard` 作为第二条新增。
- 项目详情页保留现有内容结构，只把英雄区改成该项目专属大图，去掉过重的 CRT 装饰感。

### 阅读

现在是普通卡片。改为书架大卡：

- 上半是独立角色图，下半是书名、主题、状态、短评和进度。
- 进度条在进入视口后再填充，不在首屏就全部走完。

### 关于

现在是一张重复封面图 + 四块灰盒。改为：

- 顶部人物主视觉 + 简短自我介绍。
- 下面四块更疏的信息卡：写什么、怎么维护、视觉原则、站点规模。
- 站点规模继续用现有数据实时统计，不手写假数字。

### 文章

- 顶部改成该篇专属宽封面，标题叠在图下或图内低对比遮罩上，保证可读。
- 正文列宽和行距加大，侧栏信息/目录变轻，不再像三列仪表盘。
- 移动端改为：封面 -> 标题 -> 正文 -> 元信息 -> 目录。
- 上一篇/下一篇改成带对应封面缩略图的卡片。

### 链接

- 保留站点/仓库入口。
- 新增“最近在看”引用区，使用上面的外部仓库列表。

## 流动感

继续用现有事件委托、`IntersectionObserver` 和 CSS，不接新动画库。

悬停：

- 角色图轻微放大并位移，从略灰回到彩色。
- 卡片抬起、出现一束斜向扫光。
- 标题和元信息做很短的位移，不改变最终占位尺寸，避免布局跳动。

滚动：

- 内页卡片按顺序 fade/slide 进入。
- 封面图用很弱的视差（几个百分点），不造成眩晕。
- 阅读进度条、月份标签、返回顶部维持现有能力，并接到新模板的选择器上。

约束：

- 所有新动画写入 `prefers-reduced-motion: reduce` 关闭规则。
- 触控设备上不做指针跟随粒子；现有桌面光标特效如果干扰阅读，内页降为更轻的扫光。
- 动效服务阅读，不自动循环大幅动画。

## 数据与文件边界

只改这些文件：

- `assets/app.js`：`covers` 映射、项目数据、链接数据、内页 `render*()` 模板。
- `assets/styles.css`：删除整页角色背景，新增内页杂志层和流动动效。
- `assets/images/anime/`：写入新图，删除确认不再引用的旧图。
- `index.html` / `404.html`：仅当 Open Graph 默认图需要改到新 hero 时更新。
- `README.md`：补一张资产清单，说明图不再复用。
- `tests/blog.spec.js`：补归档/项目/阅读/关于的标题、封面节点和减少动态时的回归。

`projects` 更新规则：

- `codex-multi-agent` 的 `links.github` 改为 `https://github.com/yihang56666-sketch/magent`。
- 新增 `nextboard`，描述只摘 README 已有事实：safety-first embedded hardware copilot，把板级证据、CubeMX、固件计划和台架预检收成可门控的下一步。

## 验证

- `node --check assets/app.js`
- 本地静态服务器打开首页、归档、文章、项目列表、两个项目详情、阅读、关于、链接、标签、分类、404
- 确认首页封面结构未改，且首页/内页没有重复角色图
- 390 / 768 / 1440 宽度下无横向滚动，文字不压图
- 悬停和滚动动效可见；`prefers-reduced-motion` 下关闭
- 主题切换、搜索、移动导航、旧路径 fallback 仍可用
- Playwright 覆盖：首页主标题、归档大图行、项目仓库链接、阅读进度卡、关于主视觉、无效路由恢复

