# beid blog

博客地址：<https://yihang56666-sketch.github.io/>

这是一个使用原生 HTML、CSS 和 JavaScript 搭建的个人静态博客。项目不依赖前端框架，也不需要编译或打包；仓库根目录可以直接作为 GitHub Pages 的发布源。

## 如何搭建

### 1. 准备环境

本地需要安装：

- [Git](https://git-scm.com/)，用于克隆和提交代码。
- [Node.js](https://nodejs.org/)，用于通过 `npx serve` 启动本地静态服务器。

### 2. 克隆仓库

```bash
git clone https://github.com/yihang56666-sketch/Yihang56666-sketch.github.io.git
cd Yihang56666-sketch.github.io
```

### 3. 本地预览

项目没有构建步骤，也不需要先执行 `npm install`。在仓库根目录运行：

```bash
npx serve .
```

然后在浏览器打开 <http://localhost:3000>。首次运行时，`npx` 可能会询问是否下载 `serve`，确认即可。

请通过本地静态服务器访问博客，不要直接双击打开 `index.html`，这样才能正确验证页面资源和路由行为。

### 4. 修改博客内容

主要文件如下：

| 文件 | 用途 |
| --- | --- |
| `index.html` | 博客入口、页面基础信息和外部资源引用 |
| `404.html` | GitHub Pages 的路由回退页面 |
| `assets/app.js` | 文章、项目、站点更新、页面渲染和 Hash 路由 |
| `assets/styles.css` | 全站主题、布局、响应式样式和动效 |
| `assets/images/anime/` | 博客使用的图片资源 |

文章、项目和站点更新都直接维护在 `assets/app.js` 中：

- `posts`：博客文章。
- `projects`：项目卡片。
- `siteUpdates`：首页站点更新。
- `archiveNotes`：归档页面的月份说明。

修改完成后刷新本地页面即可查看效果，不需要运行构建命令。

### 5. 部署到 GitHub Pages

1. 在 GitHub 创建名为 `你的用户名.github.io` 的公开仓库。
2. 将博客文件放在仓库根目录并推送到 `main` 分支。
3. 打开仓库的 **Settings → Pages**。
4. 在 **Build and deployment** 中选择 **Deploy from a branch**。
5. 分支选择 `main`，目录选择 `/(root)`，然后保存。
6. 等待 GitHub Pages 完成部署，即可通过 `https://你的用户名.github.io/` 访问博客。

本仓库对应的线上地址是 <https://yihang56666-sketch.github.io/>。后续只需将修改提交并推送到 `main` 分支，GitHub Pages 就会自动更新站点。

## 实现方式

- 使用原生 HTML、CSS 和 JavaScript，无框架、无构建步骤。
- 使用 Hash 路由实现单页应用导航，适配 GitHub Pages 静态托管。
- 使用 `404.html` 处理 GitHub Pages 的页面回退。
- 通过 CDN 加载 Lenis、Atropos、medium-zoom、Lucide 和 augmented-ui。
- 支持深色模式、响应式布局、文章归档、标签、分类和项目展示。
