# 内页杂志排版、独立高清角色与流动动效设计

## 目标

在保留首页封面结构和布局的前提下，解决三类问题：角色贴图重复且不够高清、封面以外栏目排版拥挤、页面缺少悬停/滚动流动感。搭建时引入少量成熟的开源库，而不是从零手写全部滚动和悬停效果。

本轮成功标准：

- 首页 `renderHomeMaikire()` 的区块顺序、栅格和封面结构不改，只替换重复贴图。
- 归档、项目、阅读、关于、文章、标签、分类页改为大图杂志排版，桌面与 390px 移动端都不横向溢出。
- 每张角色图只服务一个位置，不再出现同一张图同时当封面、卡片和页面背景。
- 角色为高清原创二次元人物；气质可以接近超级英雄或《葬送的芙莉莲》，但不画正版角色，也不画任何游戏角色。
- 滚动有平滑惯性，卡片悬停有 3D 视差，高清图可点击放大；`prefers-reduced-motion` 下全部降级为静态。
- 继续无构建、GitHub Pages、hash 路由；第三方库只用 CDN，不引入框架或打包器。

## 方案与边界

采用“首页锁定 + 内页重排 + 开源库增强 + 资产换新”：

- 首页结构和布局锁定。
- 内页渲染函数改成杂志/书架模板。
- 用 imagegen 生成不重复高清角色图。
- 页面底纹改为浅色纸感，不再把角色图铺成整页背景。
- 流动感应接现成库：平滑滚动用 Lenis，卡片悬停用 Atropos，图片放大用 medium-zoom。揭示动画继续用现有 IntersectionObserver，不重复引入 AOS。

明确不做：

- 不改首页封面结构和布局。
- 不画蜘蛛侠、芙莉莲或其他可识别 IP / 游戏角色。
- 不引入 React/Vue、GSAP 商业插件、Live2D 看板娘、WebGL 置换过渡。
- 不把本轮做成 CMS/Markdown 迁移。
- 不把自动注册/会话采集类仓库写进公开页面。
- 不把“展示自己的 GitHub 作品墙”当作本轮主目标。现有 magent 卡片若仓库链接错误可顺手修正，但不扩写成新的作品集需求。

## 第三方项目怎么结合进博客

这里的“引用”是指把别人的开源项目接到站点实现里，不是在链接页堆仓库名单。

### 接入

| 项目 | 作用 | 接入方式 |
|---|---|---|
| [darkroomengineering/lenis](https://github.com/darkroomengineering/lenis) 15.4k | 整站平滑滚动，让下滑时封面视差和卡片入场更跟手 | `index.html` / `404.html` 用 unpkg/jsDelivr ESM 或 UMD，在现有 `afterRender()` 里初始化，路由切换后 `lenis.resize()` |
| [nolimits4web/atropos](https://github.com/nolimits4web/atropos) 3.6k | 角色卡 3D 悬停视差，图和文字分层移动 | 归档行、项目宽卡、阅读卡、文章封面外包一层 `atropos`；移动端降低 rotate 或关闭 |
| [francoischalifour/medium-zoom](https://github.com/francoischalifour/medium-zoom) 3.9k | 点击高清角色图放大查看 | 只绑封面/关于主视觉等显式 `data-zoom` 图，不绑装饰底纹 |
| 现有 [lucide](https://github.com/lucide-icons/lucide) | 图标 | 保持 CDN |
| 现有 [augmented-ui](https://github.com/propjockey/augmented-ui) | 少量切角边框 | 保持，但不作为内页主视觉 |

### 只借思路，不整库引入

| 项目 | 怎么用 |
|---|---|
| [argyleink/open-props](https://github.com/argyleink/open-props) 5.5k | 抄一套 easing / 阴影 token 进 `styles.css`，不加载整份 CSS |
| 现有 IntersectionObserver 揭示 | 继续做滚动入场，不装 [AOS](https://github.com/michalsnik/aos) |

### 评估后不用

| 项目 | 原因 |
|---|---|
| [juliangarnier/anime](https://github.com/juliangarnier/anime) / [motiondivision/motion](https://github.com/motiondivision/motion) / [greensock/GSAP](https://github.com/greensock/GSAP) | 能力重复，当前 CSS + Lenis + Atropos 已够 |
| [locomotivemtl/locomotive-scroll](https://github.com/locomotivemtl/locomotive-scroll) | 比 Lenis 更重，和现有滚动进度条更难共存 |
| [micku7zu/vanilla-tilt.js](https://github.com/micku7zu/vanilla-tilt.js) | 和 Atropos 重叠，Atropos 分层视差更适合杂志大图 |
| [robin-dela/hover-effect](https://github.com/robin-dela/hover-effect) | 要 WebGL 和置换贴图，维护成本高 |
| [stevenjoezhang/live2d-widget](https://github.com/stevenjoezhang/live2d-widget) | 看板娘会和本轮高清角色封面抢注意力，也影响阅读 |

降级：CDN 失败、脚本被拦或用户开启减少动态时，页面仍完全可读写，只是没有平滑滚动、3D 悬停和放大。

## 角色资产

所有新图放在 `assets/images/anime/`，文件名按用途命名。`covers` 里每个键对应一张独立文件。

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

### 项目、阅读、关于

| 用途 | 文件 | 角色方向 |
|---|---|---|
| magent | `project-magent-hero.png` | 原创红蓝防护服工程师，有都市夜景，不画蜘蛛侠标志 |
| 现有项目若仍只此一项 | 同上 | 不为本轮强行新增自己的其他仓库卡 |
| 写给大家看的设计书 | `reading-design-book.png` | 银发精灵旅人在废墟看书，只借鉴芙莉莲气质 |
| Refactoring UI | `reading-refactoring-ui.png` | 手持色票和组件稿的界面设计师 |
| How to Take Smart Notes | `reading-smart-notes.png` | 把卡片连成网的笔记学生 |
| Web 可访问性清单 | `reading-a11y.png` | 检查对比度和焦点环的设计师 |
| 关于页主视觉 | `about-host-garden.png` | 与头像不同的第三位角色，走在白色庭院/房间里 |

生成约束：

- 竖构图或接近 3:4 的角色特写 + 场景，适合裁成封面。
- 高清、干净，不要文字、水印、UI 框。
- 人物五官和服装彼此明显不同。
- 旧的 `white-haired-*.png` 在新图验证后删除，避免 CSS 继续当背景引用。

## 内页排版

### 归档 / 标签 / 分类

改为大图时间线：月份可粘滞；每篇文章是宽幅杂志行，左侧大角色图，右侧标题、短注、分类、阅读时长；相邻行左右交替。角色图包在 Atropos 层里。

### 项目列表

宽幅专题行：图文左右交替，展示状态、更新、描述、标签和仓库链接。现有 magent 卡保留；仓库链接若仍指向 github.io 则改到 [magent](https://github.com/yihang56666-sketch/magent)。详情页英雄区改成专属大图，减弱 CRT 装饰。

### 阅读

书架大卡：上半独立角色图，下半书名、主题、状态、短评和进度。进度条进入视口后再填充。

### 关于

顶部人物主视觉 + 简短介绍；下面四块更疏的信息卡。站点规模继续用现有数据统计。

### 文章

该篇专属宽封面；正文更疏；移动端改为封面 -> 标题 -> 正文 -> 元信息 -> 目录。上一篇/下一篇带对应封面缩略图。

### 链接

保持现有站点/仓库入口即可。不把本轮做成外部仓库推荐墙。

## 流动感

- Lenis 接管平滑滚动，并同步现有阅读进度条和返回顶部。
- Atropos 负责角色卡悬停：图一层、文字一层，桌面开启，粗指针/减少动态时关闭。
- 滚动入场继续用 IntersectionObserver，选择器改接到新模板。
- 封面视差只做几个百分点。
- medium-zoom 提供“看清高清图”的点击反馈。
- 所有装饰动效写入 `prefers-reduced-motion` 关闭规则；Lenis 在该媒体查询下不初始化。

## 数据与文件边界

- `index.html` / `404.html`：加 Lenis、Atropos、medium-zoom 的 CSS/JS CDN；默认 OG 图改到新 hero。
- `assets/app.js`：`covers` 映射、内页 `render*()`、Lenis/Atropos/zoom 的初始化与销毁、路由后 resize。
- `assets/styles.css`：删整页角色背景；新增杂志内页层；接入 Atropos 所需的少量覆盖。
- `assets/images/anime/`：新图写入，确认无引用后删旧图。
- `README.md`：记录 CDN 依赖和角色图一对一规则。
- `tests/blog.spec.js`：封面节点、减少动态时的静态降级、核心路由不溢出。

## 验证

- `node --check assets/app.js`
- 断网或屏蔽 CDN 时页面仍可浏览
- 首页封面结构未改，全站角色图不重复
- 390 / 768 / 1440 无横向滚动
- 桌面悬停有 3D 层移，滚动平滑，点击封面可放大
- `prefers-reduced-motion` 下无平滑滚动、无 3D、无放大动画
- 主题、搜索、移动导航、旧路径 fallback 仍可用
