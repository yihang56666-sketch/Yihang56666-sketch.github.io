(function () {
  const site = {
    name: "beid",
    title: "beid 的夜城技术手账",
    description: "beid 的个人博客正在重新整理内容，新的文章、项目复盘和手账会陆续补上。",
    author: "beid",
    origin: "https://yihang56666-sketch.github.io",
    github: "https://github.com/Yihang56666-sketch"
  };

  const root = document.documentElement;
  const main = document.getElementById("main");
  const nav = document.querySelector("[data-nav]");
  let revealObserver;
  let tocObserver;

  const assetBase = new URL(".", document.currentScript?.src || location.href).href;
  const image = (file) => `url('${assetBase}images/edgerunners/${file}')`;

  const covers = {
    circuits: image("sandevistan.jpg"),
    water: image("night-city.jpg"),
    code: image("netrunner.jpg"),
    robot: image("characters.jpg"),
    notebook: image("manga.jpg"),
    music: image("whatsnew.jpg"),
    books: image("story.jpg"),
    hero: image("edgerunners-cover.jpg")
  };

  const posts = [];
  const projects = [
    {
      title: "Codex 多智能体编排框架",
      slug: "codex-multi-agent",
      desc: "一个纯本地运行的 AI 多智能体协作系统，不依赖任何外部 LLM API。通过 26 个领域专家身份库、12 种协作模式和 7 种预定义工作流，将复杂任务自动拆解、路由到最适合的 specialist 智能体，并在 Codex 会话中以手动编排的方式逐个执行、同步、合并产出。",
      tags: ["ai-agents", "orchestration", "codex", "python", "cli"],
      cover: covers.code,
      status: "已发布 · v1.2.0",
      updated: "06/25",
      links: {
        github: "https://github.com/yihang56666-sketch/yihang56666-sketch.github.io",
        docs: null
      },
      stats: [
        { label: "领域身份", value: "26" },
        { label: "协作模式", value: "12" },
        { label: "预置工作流", value: "7" },
        { label: "代码量", value: "3.2k" }
      ],
      detail: [
        {
          heading: "特性亮点",
          bullets: [
            "纯本地运行: 不依赖任何第三方 LLM API，所有路由和编排在本地完成",
            "26 个领域身份: 前端/后端/嵌入式/安全/QA/架构/ML/DevOps 等专家身份卡",
            "12 种协作模式: supervisor / handoff / SOP / group-chat / critic-loop / stateful-observer 等",
            "7 套预制工作流: bugfix / feature-build / security-review / refactor / architecture-decision 等",
            "6 个团队预设: small-team / frontend-team / embedded-team / full-review-team 等",
            "检查点恢复: 崩溃后从最近检查点恢复，零进度丢失",
            "智能缓存: 基于内容的缓存策略，实测节省 67% 重复 token"
          ]
        },
        {
          heading: "运行模式",
          paragraphs: [
            "框架的核心设计理念是「Codex-only」—— 不依赖 Anthropic、OpenAI 或任何第三方 LLM API。所有智能体路由、任务拆解和执行跟踪都在本地 .agents/ 目录下完成。",
            "正常编排流程分六步：spawn-team.py 生成 dispatch-plan → execute-dispatch-plan.py 准备执行包 → 当前 Codex 会话逐个回答每个 agent 的 prompt → 将答案写入 *.output.md → magent sync 刷新状态 → merge-results.py 合成为最终 synthesis.md。"
          ]
        },
        {
          heading: "架构设计",
          paragraphs: [
            "框架分为三层：身份层（identity bank）、编排层（orchestration engine）、执行层（manual runtime）。"
          ]
        },
        {
          heading: "架构树形图",
          tree: `身份层 Identity Layer
├── 身份索引 /identity-bank/
│   ├── 28 个手工精调核心身份
│   │   ├── 前端工程师 (frontend-engineer)
│   │   ├── 后端架构师 (backend-api-engineer)
│   │   ├── 嵌入式工程师 (embedded-engineer)
│   │   ├── 安全工程师 (security-engineer)
│   │   ├── QA 自动化工程师 (qa-test-automation-engineer)
│   │   └── 23 个其它核心身份
│   └── 120+ 社区导入身份
├── 身份卡字段
│   ├── 领域描述 (domain description)
│   ├── 关键词 (keywords)
│   ├── 关联 Skill
│   ├── 执行权限 (read-only / worker)
│   └── 执行模式 (auto / semi-auto / manual)
│
编排层 Orchestration Layer
├── 路由引擎 route_identity.py
│   ├── 多因子评分系统
│   │   ├── 关键词匹配: 单次 2pt, 组合 3pt
│   │   ├── 技能偏好: +5pt/skill
│   │   └── 领域重叠: 叠加加分
│   ├── 任务类型自动检测
│   │   ├── read-only vs worker
│   │   └── 推断最佳协作模式
│   └── 平局裁决 (domain anchor)
├── 协作模式引擎
│   ├── supervisor / handoff / SOP
│   └── group-chat / critic-loop / stateful-observer
│
执行层 Runtime Layer
├── 执行包生成器
│   ├── agent-prompts.md (各 agent prompt 汇总)
│   ├── handoff-contract.md (交接合约)
│   └── next-agent.md (当前待回答问题)
├── 状态同步
│   └── magent sync → .output.md 写入状态
├── 产物存档
│   └── .agents/reports/runs/<run-id>/
│       ├── dispatch-plan.json
│       ├── synthesis.md (最终合并报告)
│       └── 各 agent 原始输出
└── 本地仪表盘 localhost:8080
    ├── dashboard-live.html (实时状态)
    └── agent 详情面板`,
          note: "箭头 ├── 表示横向展开的元素层级，leaf node 无子节点。最简部署只需 magent.py + route_identity.py 即可运行。"
        },
        {
          heading: "路由算法",
          paragraphs: [
            "路由引擎 route_identity.py 使用多因子评分系统做身份匹配：关键词匹配（单次 2 分，多词组合 3 分）、领域重叠加分、skill 偏好匹配（+5 分/个）。路由还会自动附加 reviewer 身份（安全/认证/性能类任务加 code-reviewer，测试类任务加 QA）。",
            "任务类型自动检测：扫描关键词判定 read-only vs worker 任务，推断最佳协作模式。平局时用领域锚点（domain anchor）打破——例如 rust 相关任务自动偏向 rust-engineer。"
          ],
          code: "# 路由示例：分析认证模块\n$ magent run --task \"analyze auth module security\" --scope \"src/auth tests/auth\"\n\n# 路由结果（dispatch-plan.json 摘要）\n{\n  \"task\": \"analyze auth module security\",\n  \"pattern\": \"critic-loop\",\n  \"identities\": [\n    \"security-engineer\",\n    \"backend-api-engineer\",\n    \"code-reviewer\",\n    \"qa-test-automation-engineer\"\n  ],\n  \"max_identities\": 4\n}"
        },
        {
          heading: "CLI 命令参考",
          code: "# ── 启动本地仪表盘 ──\nmagent ui\n# 在浏览器打开 http://localhost:8080/dashboard-live.html\n\n# ── 运行新任务 ──\nmagent run --task \"你的任务描述\" --scope \"代码路径\"\n\n# ── 执行流程 ──\nmagent next latest       # 查看下一个待执行的 agent\n# 打开 agent-prompts.md 按顺序回答\nmagent sync latest      # 刷新执行状态\n\n# ── 状态管理 ──\nmagent status latest    # 查看运行状态概览\nmagent agents           # 列出所有可用 agent\nmagent list             # 列出所有运行记录\n\n# ── 结果合并 ──\npython .agents/scripts/merge-results.py .agents/reports/runs/<run-id>",
          note: "所有命令都支持 magent.exe 独立执行（PyInstaller 打包），无需 Python 环境"
        },
        {
          heading: "项目结构",
          code: ".agents/\n├── magent.py              # CLI 入口（307 行）\n├── identities/            # 26 个身份卡（ai/design/engineering/operations/product/quality）\n├── presets/               # 6 个团队预设 JSON\n├── workflows/             # 7 个工作流定义（YAML + JSON）\n├── skills/                # 2 个 skill 包（identity-bank + orchestrator）\n│   ├── codex-agent-identity-bank/\n│   └── codex-multi-agent-orchestrator/\n├── scripts/               # 33 个辅助脚本\n│   ├── route_identity.py   # 核心路由算法（368 行）\n│   ├── spawn-team.py       # 运行文件夹生成器\n│   ├── manual_execution.py # 手动执行引擎\n│   └── merge-results.py    # 结果合并\n├── ui/                    # 本地仪表盘（dashboard.html）\n├── reports/runs/          # 运行产物存档\n└── identity-bank/         # 150+ 身份索引"
        },
        {
          heading: "与同类项目对比",
          table: {
            headers: ["特性", "本框架", "AutoGen", "CrewAI", "LangGraph"],
            rows: [
              ["当前状态", "纯本地，manual-only", "混合 API", "混合 API", "混合 API"],
              ["协作模式数量", "12 种", "3 种", "2 种", "1 种"],
              ["领域身份系统", "26 个专属身份 + 120+ 社区", "无专业身份", "无专业身份", "无专业身份"],
              ["执行方式", "手动编排（Codex 内）", "自动执行", "自动执行", "自动执行"],
              ["LLM 依赖", "零依赖（纯本地）", "必选（API Key）", "必选（API Key）", "必选（API Key）"],
              ["产物质控", "人肉 review 每一步", "自动输出", "自动输出", "自动输出"],
              ["检查点恢复", "支持（断点续传）", "不支持", "有限支持", "不支持"],
              ["仪表盘", "localhost:8080 实时查看", "无内置", "CrewAI Enterprise", "LangSmith"],
              ["团队预设", "6 个内置预设", "无", "无", "无"],
              ["适用场景", "需人类审核的关键任务", "自动化流水线", "自动化协作", "有向图流程"]
            ]
          }
        },
        {
          heading: "提升方向",
          paragraphs: [
            "当前框架已完成最小可用集（v1.2.0），以下是识别到的提升方向："
          ],
          bullets: [
            "自动化执行模式: 当前仅 manual-only，可加入可选的 auto-execute 模式，让框架调用本地 LLM（如 llama.cpp、Ollama）完成部分低风险步骤",
            "身份卡覆盖度加深: 某些小众领域（如量化交易、生物信息、法律合规）缺少专门身份，需社区贡献",
            "路由评分调优: 关键词评分目前是固定权重，可引入 ML 权重自动学习历史路由成功/失败数据",
            "结果质量评估: 缺少自动化的 synthesis 质量评分机制，目前仅靠人工判断",
            "插件系统: 支持第三方 identity pack 和 workflow pack 的在线安装/更新",
            "可视化工作流编辑器: 当前工作流用 YAML/JSON 手写，可以做一个拖拽式 DAG 编辑界面",
            "分布式执行: 当前只支持单机串行执行，可扩展到多机并行 agent 执行",
            "生态集成: 对接更多外部工具（Jira、GitHub Issues、Slack 通知）使编排结果能自动创建工单"
          ]
        },
        {
          heading: "Roadmap",
          code: "# v1.x — 核心打磨\n[ ] 自动化执行模式（local LLM 集成）\n[ ] 检查点自动备份到云存储\n[ ] 身份卡 marketplace 预览页\n\n# v2.0 — 生态扩展\n[ ] 身份卡插件系统（npm-style install）\n[ ] 可视化 DAG 工作流编辑器\n[ ] 结果质量自动评分（BLEU / ROUGE / F1）\n[ ] 并行 agent 执行引擎\n\n# v2.x — 企业级\n[ ] Jira / GitHub Issues 双向同步\n[ ] SSO / 团队权限管理\n[ ] 历史运行数据趋势分析仪表盘",
          note: "Roadmap 持续在 GitHub Projects 中维护，欢迎提 Issue 和 PR。"
        }
      ]
    }
  ];

  // ── site updates ──────────────────────────────────────
  const siteUpdates = [
    {
      time: "06/25",
      type: "project",
      title: "Codex 多智能体编排框架",
      body: "首个项目卡上架。26 个领域身份、12 种协作模式、纯本地运行、零 API 依赖。"
    }
  ];
  const archiveNotes = {};

  const pages = {
    home: { title: site.title, desc: site.description },
    archive: { title: "文章归档", desc: "旧内容已经清空，新的文章会按发布时间重新整理在这里。" },
    projects: { title: "做过的东西", desc: "折腾过的项目复盘和阶段记录。" },
    reading: { title: "阅读与学习", desc: "资料入口正在重新整理，之后会放新的学习记录。" },
    about: { title: "关于 beid", desc: "这个博客正在重新写内容，先保留站点外壳和夜城风格。" },
    tags: { title: "标签", desc: "新文章发布后会自动生成标签。" },
    categories: { title: "分类", desc: "新文章发布后会自动生成分类。" },
    links: { title: "链接", desc: "站点、仓库和后续公开入口。" },
    kaoyan: { title: "考研阵地", desc: "内容正在重新整理。" }
  };

  const state = { query: "" };
  const routeByPath = {
    "/archive/": "archive",
    "/archives/": "archive",
    "/tags/": "tags",
    "/categories/": "categories",
    "/about/": "about",
    "/projects/": "projects",
    "/reading/": "reading",
    "/links/": "links",
    "/kaoyan/": "kaoyan"
  };
  const legacyLookup = new Map();

  function esc(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function normalizePath(path) {
    let value = path || "/";
    try {
      value = decodeURI(value);
    } catch (error) {
      value = path || "/";
    }
    if (!value.startsWith("/")) value = `/${value}`;
    if (value !== "/" && !value.endsWith("/") && !value.endsWith(".html")) value = `${value}/`;
    return value;
  }

  function slugify(value) {
    return String(value)
      .toLowerCase()
      .trim()
      .replace(/[^\p{L}\p{N}]+/gu, "-")
      .replace(/^-+|-+$/g, "");
  }

  function formatDate(date) {
    if (!date) return "";
    return date.replace(/-/g, "/");
  }

  function readingTime(post) {
    const text = [post.summary, ...(post.sections || []).flatMap((section) => [section.heading, ...(section.paragraphs || []), ...(section.bullets || [])])]
      .join("");
    return Math.max(1, Math.ceil(text.length / 480));
  }

  function getAllTags() {
    return [...new Set(posts.flatMap((post) => post.tags))].sort((a, b) => a.localeCompare(b, "zh-CN"));
  }

  function getAllCategories() {
    return [...new Set(posts.map((post) => post.category))];
  }

  function tagChips(tags, linked = false) {
    if (!tags.length) return '<span class="tag-chip alt">待添加</span>';
    return tags
      .map((tag) => {
        const content = esc(tag);
        return linked
          ? `<a class="tag-chip" href="#/tags/${encodeURIComponent(tag)}">${content}</a>`
          : `<span class="tag-chip">${content}</span>`;
      })
      .join("");
  }

  function postHref(post) {
    return `#/posts/${post.slug}`;
  }

  function archiveGroups(list) {
    const groups = new Map();
    list.forEach((post) => {
      const month = post.date.slice(0, 7);
      if (!groups.has(month)) groups.set(month, []);
      groups.get(month).push(post);
    });
    return [...groups.entries()];
  }

  function archiveMonthLabel(month) {
    const [year, value] = month.split("-");
    return `${year} / ${value}`;
  }

  function archiveMonthNote(month, items) {
    return archiveNotes[month] || `${items.length} 篇记录，继续往前翻会看到当时正在折腾的主题。`;
  }

  function pageHeader(title, desc, eyebrow) {
    return `
      <section class="page-title">
        <p class="eyebrow">${esc(eyebrow || "beid blog")}</p>
        <h1>${esc(title)}</h1>
        <p>${esc(desc)}</p>
      </section>
    `;
  }

  function emptyPanel(title, desc, actionText = "回到首页", actionHref = "#/") {
    return `
      <section class="plain-panel empty-state-panel">
        <p class="eyebrow">rewrite mode</p>
        <h2>${esc(title)}</h2>
        <p>${esc(desc)}</p>
        <a class="pill-button" href="${esc(actionHref)}"><i data-lucide="pen-line"></i>${esc(actionText)}</a>
      </section>
    `;
  }

  function renderHome() {
    const query = state.query.trim().toLowerCase();
    const filtered = posts.filter((post) => {
      const haystack = `${post.title} ${post.summary} ${post.category} ${post.tags.join(" ")}`.toLowerCase();
      return haystack.includes(query);
    });
    const featured = filtered.slice(0, 6);

    main.innerHTML = `
      <div class="home-grid">
        <div>
          <section class="intro-panel">
            <div class="intro-copy">
              <p class="eyebrow">night city notes</p>
              <h1>内容已清空，准备重新写。</h1>
              <p>博客外壳、夜城风格、动效和路由已经保留。接下来可以从第一篇新文章、第一张项目卡和第一条手账开始重新生长。</p>
              <div class="intro-actions">
                <a class="pill-button primary" href="#/archive"><i data-lucide="book-open"></i>查看空归档</a>
                <a class="pill-button" href="#/projects"><i data-lucide="cpu"></i>项目占位</a>
                <a class="pill-button" href="#/about"><i data-lucide="user"></i>关于站点</a>
              </div>
            </div>
            <aside class="focus-board">
              <div>
                <p class="eyebrow">now writing</p>
                <h2>新内容槽位</h2>
                <ul class="journal-list">
                  <li><time>01</time><span>第一篇新文章。</span></li>
                  <li><time>02</time><span>第一张项目复盘卡。</span></li>
                  <li><time>03</time><span>第一条阶段手账。</span></li>
                </ul>
              </div>
              <div class="soft-quote">
                <span>站主小纸条</span>
                <p>旧内容已经撤下。现在这里是一块干净的夜城草稿板。</p>
              </div>
            </aside>
          </section>

          ${
            siteUpdates.length
              ? `<section class="live-dispatch aug-frame" data-augmented-ui="tl-clip br-clip border" aria-label="站点更新">
                  <div class="dispatch-head">
                    <p class="eyebrow">live dispatch</p>
                    <h2>站点现场</h2>
                  </div>
                  <div class="dispatch-track">
                    ${siteUpdates
                      .map(
                        (update) => `
                          <article class="dispatch-item">
                            <span class="dispatch-dot" aria-hidden="true"></span>
                            <div>
                              <div class="dispatch-line">
                                <time class="dispatch-time">${esc(update.time)}</time>
                                <span class="dispatch-type">${esc(update.type)}</span>
                              </div>
                              <h3>${esc(update.title)}</h3>
                              <p>${esc(update.body)}</p>
                            </div>
                          </article>
                        `
                      )
                      .join("")}
                  </div>
                </section>`
              : ""
          }

          <div class="section-heading section-heading-search">
            <div>
              <h2>最近写下的</h2>
              <span>${query ? `搜索：${esc(state.query)} · 找到 ${filtered.length} 篇` : "当前没有公开文章"}</span>
            </div>
            <div class="section-actions">
              <label class="search-box home-search">
                <i data-lucide="search"></i>
                <input type="search" placeholder="新内容发布后可搜索..." value="${esc(state.query)}" data-search>
                <span class="kbd-hint">/</span>
              </label>
              <a class="pill-button" href="#/archive"><i data-lucide="archive"></i>归档</a>
            </div>
          </div>
          <section class="post-list">
            ${featured.length ? featured.map(postCard).join("") : '<div class="empty-state">内容已清空，准备重新写。</div>'}
          </section>
        </div>

        <aside class="side-stack">
          <section class="side-panel">
            <div class="author-line">
              <span class="avatar avatar-image" aria-hidden="true"></span>
              <div>
                <h2>beid</h2>
                <p>博客内容正在重写。这里先保留站点外壳，等新文章重新上线。</p>
              </div>
            </div>
          </section>
          <section class="side-panel side-note">
            <h2>最近状态</h2>
            <p>旧文章和旧项目已经清空。下一步可以重新补文章、项目、标签和分类。</p>
            <ul class="mini-list">
              <li><span>文章</span><strong>待添加</strong></li>
              <li><span>项目</span><strong>待添加</strong></li>
              <li><span>手账</span><strong>待添加</strong></li>
            </ul>
          </section>
          <section class="side-panel">
            <h2>分类</h2>
            <div class="tag-cloud">${getAllCategories().length ? getAllCategories()
              .map((category) => `<a class="tag-chip" href="#/categories/${encodeURIComponent(category)}">${esc(category)}</a>`)
              .join("") : '<span class="tag-chip alt">待添加</span>'}</div>
          </section>
          <section class="side-panel">
            <h2>标签</h2>
            <div class="tag-cloud">${tagChips(getAllTags(), true)}</div>
          </section>
        </aside>
      </div>
    `;
  }

  function postCard(post) {
    return `
      <article class="post-card">
        <a class="post-visual" style="--cover: ${post.cover}" href="${postHref(post)}" aria-label="阅读：${esc(post.title)}"></a>
        <div>
          <div class="post-kicker">${formatDate(post.date)} · ${esc(post.category)}</div>
          <h3><a href="${postHref(post)}">${esc(post.title)}</a></h3>
          <p>${esc(post.summary)}</p>
          <p class="post-note">${esc(post.note || "")}</p>
          <div class="post-meta">
            <span>${readingTime(post)} 分钟</span>
            <a href="${postHref(post)}">阅读全文</a>
          </div>
          <div class="tag-row">${tagChips(post.tags)}</div>
        </div>
      </article>
    `;
  }

  function renderArchive(filter) {
    let list = posts;
    let desc = pages.archive.desc;
    let title = pages.archive.title;
    let eyebrow = "archive";

    if (filter?.tag) {
      list = posts.filter((post) => post.tags.includes(filter.tag));
      title = `标签：${filter.tag}`;
      desc = "这个标签下还没有新文章。";
      eyebrow = "tag";
    }

    if (filter?.category) {
      list = posts.filter((post) => post.category === filter.category);
      title = `分类：${filter.category}`;
      desc = "这个分类下还没有新文章。";
      eyebrow = "category";
    }

    main.innerHTML = `
      ${pageHeader(title, desc, eyebrow)}
      <section class="archive-list">
        ${list.length
          ? archiveGroups(list)
              .map(
                ([month, items]) => `
                  <div class="archive-group">
                    <h2>${archiveMonthLabel(month)}</h2>
                    <p class="archive-month-note">${esc(archiveMonthNote(month, items))}</p>
                    ${items
                      .map(
                        (post) => `
                          <article class="archive-row">
                            <time datetime="${esc(post.date)}">${post.date.slice(5).replace("-", "/")}</time>
                            <div>
                              <h3><a href="${postHref(post)}">${esc(post.title)}</a></h3>
                              <p>${esc(post.note || post.summary)}</p>
                            </div>
                            <span>${esc(post.category)} · ${readingTime(post)} 分钟</span>
                          </article>
                        `
                      )
                      .join("")}
                  </div>
                `
              )
              .join("")
          : '<div class="empty-state">归档已清空，等新文章发布后会重新出现。</div>'}
      </section>
    `;
  }

  function renderProjects() {
    main.innerHTML = `
      ${pageHeader(pages.projects.title, pages.projects.desc, "project notes")}
      ${projects.length
        ? `<section class="project-grid">${projects
            .map(
              (project) => `
                <article class="project-card aug-frame" data-augmented-ui="tl-clip br-clip border" style="--cover: ${project.cover}">
                  <a class="project-cover" href="#/projects/${project.slug}" aria-label="查看项目：${esc(project.title)}"></a>
                  <div class="project-content">
                    <p class="eyebrow">${esc(project.tags[0])}</p>
                    <h2><a href="#/projects/${project.slug}">${esc(project.title)}</a></h2>
                    <p>${esc(project.desc)}</p>
                    <div class="project-status">
                      <span>${esc(project.status)}</span>
                      <strong>${esc(project.next)}</strong>
                      <small>最近更新 ${esc(project.updated)}</small>
                    </div>
                    <div class="tag-row">${tagChips(project.tags)}</div>
                  </div>
                </article>
              `
            )
            .join("")}</section>`
        : emptyPanel("项目内容已清空", "等你重新写项目复盘时，只需要在 assets/app.js 的 projects 数组里添加项目卡。", "回首页", "#/")}
    `;
  }

  function renderProjectDetail(slug) {
    const project = projects.find((item) => item.slug === slug);
    if (!project) return renderNotFound();

    main.innerHTML = `
      <div class="project-detail">
        <header class="project-detail-hero" style="--cover: ${project.cover}">
          <div class="project-detail-hero-inner">
            <p class="eyebrow">${esc(project.tags[0])}</p>
            <h1 class="article-title">${esc(project.title)}</h1>
            <p class="project-detail-desc">${esc(project.desc)}</p>
            <div class="project-detail-actions">
              ${project.links?.github ? `<a class="pill-button" href="${esc(project.links.github)}" target="_blank" rel="noreferrer"><i data-lucide="github"></i>GitHub</a>` : ""}
              <span class="crt-badge" style="color:var(--primary);border-color:var(--primary)">${esc(project.status)}</span>
            </div>
            <div class="tag-row" style="margin-top:14px">${tagChips(project.tags)}</div>
          </div>
        </header>

        ${project.stats?.length ? `
          <section class="project-detail-stats">
            ${project.stats.map((s) => `
              <div class="crt-stat">
                <div class="crt-stat-value">${esc(s.value)}</div>
                <div class="crt-stat-label">${esc(s.label)}</div>
              </div>
            `).join("")}
          </section>
        ` : ""}

        <div class="project-detail-body">
          ${(project.detail || []).map((section) => {
            const id = slugify(section.heading);
            return `
              <section class="project-detail-section">
                <h2 id="${esc(id)}">${esc(section.heading)}</h2>
                ${(section.paragraphs || []).map((text) => `<p>${esc(text)}</p>`).join("")}
                ${section.bullets ? `
                  <div class="project-feature-grid">
                    ${section.bullets.map((item) => {
                      const match = item.match(/^(.+?)(?::\s*)(.+)$/);
                      if (match) {
                        return `<div class="project-feature-card aug-frame" data-augmented-ui="tl-clip br-clip border"><strong>${esc(match[1])}</strong><span>${esc(match[2])}</span></div>`;
                      }
                      return `<div class="project-feature-card aug-frame" data-augmented-ui="tl-clip br-clip border"><span>${esc(item)}</span></div>`;
                    }).join("")}
                  </div>
                ` : ""}
                ${section.code ? `<pre class="terminal-block"><code>${esc(section.code)}</code></pre>` : ""}
                ${section.tree ? `<pre class="tree-block"><code>${esc(section.tree)}</code></pre>` : ""}
                ${section.table ? `
                  <div class="crt-table-wrap">
                    <table class="crt-table">
                      <thead><tr>${section.table.headers.map((h) => `<th>${esc(h)}</th>`).join("")}</tr></thead>
                      <tbody>${section.table.rows.map((row) => `<tr>${row.map((cell) => `<td>${esc(cell)}</td>`).join("")}</tr>`).join("")}</tbody>
                    </table>
                  </div>
                ` : ""}
                ${section.note ? `<div class="note-box">${esc(section.note)}</div>` : ""}
              </section>
            `;
          }).join("")}

          <div class="license-box" style="margin-top:2.4rem">
            <strong>${esc(project.title)}</strong>
            <span>此为 ${esc(site.author)} 的项目复盘记录。</span>
            <a href="#/projects" style="display:inline-flex;align-items:center;gap:6px;margin-top:10px">&larr; 返回项目列表</a>
          </div>
        </div>
      </div>
    `;
  }

  function renderReading() {
    main.innerHTML = `
      ${pageHeader(pages.reading.title, pages.reading.desc, "reading")}
      ${emptyPanel("阅读清单待重写", "旧资料入口已经撤下，之后可以重新添加分类、书单和学习路线。")}
    `;
  }

  function renderAbout() {
    main.innerHTML = `
      ${pageHeader(pages.about.title, pages.about.desc, "about")}
      <section class="plain-grid">
        <article class="plain-panel">
          <h2>现在的状态</h2>
          <p>站点已经完成样式和动效搭建，内容区保持空白，等待重新写作。</p>
        </article>
        <article class="plain-panel">
          <h2>保留的东西</h2>
          <p>夜城视觉、二次元背景、HUD 边框、搜索、归档、标签、分类、项目页、文章页和移动端适配。</p>
        </article>
        <article class="plain-panel">
          <h2>联系</h2>
          <p>GitHub: <a class="tag-chip" href="${site.github}" target="_blank" rel="noreferrer">Yihang56666-sketch</a></p>
        </article>
      </section>
    `;
  }

  function renderSimplePage(key) {
    if (key === "projects") return renderProjects();
    if (key === "reading") return renderReading();
    if (key === "about") return renderAbout();
    if (key === "archive") return renderArchive();
    if (key === "tags") {
      main.innerHTML = `
        ${pageHeader(pages.tags.title, pages.tags.desc, "tags")}
        ${emptyPanel("暂无标签", "新文章发布后，标签会从 posts 数据里自动生成。")}
      `;
      return;
    }
    if (key === "categories") {
      main.innerHTML = `
        ${pageHeader(pages.categories.title, pages.categories.desc, "categories")}
        ${emptyPanel("暂无分类", "新文章发布后，分类会从 posts 数据里自动生成。")}
      `;
      return;
    }
    if (key === "links") {
      main.innerHTML = `
        ${pageHeader(pages.links.title, pages.links.desc, "links")}
        <section class="plain-grid">
          <article class="plain-panel"><h2>GitHub</h2><p><a class="tag-chip" href="${site.github}" target="_blank" rel="noreferrer">Yihang56666-sketch</a></p></article>
          <article class="plain-panel"><h2>Sitemap</h2><p><a class="tag-chip" href="/sitemap.xml">sitemap.xml</a></p></article>
        </section>
      `;
      return;
    }
    if (key === "kaoyan") {
      main.innerHTML = `
        ${pageHeader(pages.kaoyan.title, pages.kaoyan.desc, "kaoyan")}
        ${emptyPanel("内容待重写", "这里先保持为空，之后再补新的阶段计划。")}
      `;
    }
  }

  function renderSections(post) {
    return (post.sections || [])
      .map((section) => {
        const id = slugify(section.heading);
        return `
          <section>
            <h2 id="${esc(id)}">${esc(section.heading)}</h2>
            ${(section.paragraphs || []).map((text) => `<p>${esc(text)}</p>`).join("")}
            ${section.bullets ? `<ul>${section.bullets.map((item) => `<li>${esc(item)}</li>`).join("")}</ul>` : ""}
            ${section.code ? `<pre class="terminal-block"><code>${esc(section.code)}</code></pre>` : ""}
            ${section.note ? `<div class="note-box">${esc(section.note)}</div>` : ""}
          </section>
        `;
      })
      .join("");
  }

  function renderToc(post) {
    return (post.sections || [])
      .map((section, index) => {
        const id = slugify(section.heading);
        return `<a href="#${esc(id)}"><b>${index + 1}</b><span>${esc(section.heading)}</span></a>`;
      })
      .join("");
  }

  function renderLabLog(post) {
    if (!post.labLog?.length) return "";
    return `
      <section class="terminal-log aug-frame" data-augmented-ui="tl-clip br-clip border" aria-label="实验日志">
        <div class="terminal-head">
          <span></span><span></span><span></span>
          <strong>session.log</strong>
        </div>
        <div class="terminal-lines">
          ${post.labLog
            .map(
              (item) => `
                <div class="terminal-line">
                  <span class="terminal-prompt">${esc(item.step)}</span>
                  <code>${esc(item.command)}</code>
                  <p>${esc(item.result)}</p>
                </div>
              `
            )
            .join("")}
        </div>
      </section>
    `;
  }

  function renderArticle(slug) {
    const post = posts.find((item) => item.slug === slug);
    if (!post) return renderNotFound();
    const index = posts.findIndex((item) => item.slug === post.slug);
    const older = posts[index + 1];
    const newer = posts[index - 1];

    main.innerHTML = `
      <article class="article-layout">
        <aside class="article-meta-rail">
          <h2>文章信息</h2>
          <div class="meta-block"><span>作者</span><strong>${esc(site.author)}</strong></div>
          <div class="meta-block"><span>发布</span><strong>${formatDate(post.date)}</strong></div>
          <div class="meta-block"><span>更新</span><strong>${formatDate(post.updated)}</strong></div>
          <div class="meta-block"><span>分类</span><strong>${esc(post.category)}</strong></div>
          <div class="meta-block"><span>阅读</span><strong>${readingTime(post)} 分钟</strong></div>
          <div class="tag-row">${tagChips(post.tags, true)}</div>
        </aside>

        <div>
          <div class="article-main">
            <header class="article-hero" style="--cover: ${post.cover}">
              <p class="eyebrow">${esc(post.category)}</p>
              <h1 class="article-title">${esc(post.title)}</h1>
              <div class="inline-meta">
                <span>${formatDate(post.date)}</span>
                <span>${readingTime(post)} 分钟阅读</span>
                <span>${post.tags.length} 个标签</span>
              </div>
              <p class="article-note aug-frame" data-augmented-ui="tl-clip br-clip border">${esc(post.note || "")}</p>
            </header>
            ${renderLabLog(post)}
            <div class="article-body">
              ${renderSections(post)}
              <div class="license-box">
                <strong>${esc(post.title)}</strong>
                <span>本文为 ${esc(site.author)} 的项目复盘 / 学习记录。转载请保留来源链接。</span>
                <span>旧链接：${esc(post.legacyPaths?.[0] || "/")}</span>
              </div>
            </div>
          </div>
          <nav class="post-nav" aria-label="上一篇和下一篇">
            ${older ? `<a href="${postHref(older)}"><small>上一篇</small><strong>${esc(older.title)}</strong></a>` : `<a href="#/archive"><small>返回</small><strong>文章归档</strong></a>`}
            ${newer ? `<a href="${postHref(newer)}"><small>下一篇</small><strong>${esc(newer.title)}</strong></a>` : `<a href="#/projects"><small>继续看</small><strong>做过的东西</strong></a>`}
          </nav>
        </div>

        <aside class="toc-panel">
          <h2>目录</h2>
          <nav>${renderToc(post)}</nav>
        </aside>
      </article>
    `;
  }

  function renderNotFound() {
    main.innerHTML = `
      ${pageHeader("页面没有找到", "旧内容已经清空。你可以回到首页，等新文章重新发布。", "404")}
      <section class="plain-grid">
        <article class="plain-panel"><h2>最近文章</h2><p>暂无公开文章。</p></article>
        <article class="plain-panel"><h2>快速入口</h2><div class="tag-cloud"><a class="tag-chip" href="#/archive">归档</a><a class="tag-chip" href="#/tags">标签</a><a class="tag-chip" href="#/categories">分类</a></div></article>
      </section>
    `;
  }

  function parseRoute() {
    const hash = decodeURIComponent(location.hash.replace(/^#\/?/, ""));
    if (hash) {
      const parts = hash.split("/").filter(Boolean);
      if (!parts.length) return { view: "home" };
      if (parts[0] === "posts") return { view: "post", slug: parts[1] };
      if (parts[0] === "tags" && parts[1]) return { view: "tag", tag: parts[1] };
      if (parts[0] === "categories" && parts[1]) return { view: "category", category: parts[1] };
      if (parts[0] === "projects" && parts[1]) return { view: "project", slug: parts[1] };
      return { view: parts[0] };
    }

    const path = normalizePath(location.pathname);
    const legacySlug = legacyLookup.get(path);
    if (legacySlug) return { view: "post", slug: legacySlug, legacy: true };
    if (routeByPath[path]) return { view: routeByPath[path] };
    return path === "/" || path.endsWith("/index.html") ? { view: "home" } : { view: "notFound" };
  }

  function setActiveNav(route) {
    const links = document.querySelectorAll(".nav-links a");
    links.forEach((link) => link.removeAttribute("aria-current"));
    const current = route.view === "post" || route.view === "tag" || route.view === "category" ? "archive" : route.view === "project" ? "projects" : route.view;
    const target = `#/${current === "home" ? "" : current}`;
    const active = Array.from(links).find((link) => link.getAttribute("href").replace(/^\//, "") === target);
    if (active) active.setAttribute("aria-current", "page");
  }

  function setMeta(route) {
    const post = route.view === "post" ? posts.find((item) => item.slug === route.slug) : null;
    const routeMeta =
      route.view === "tag"
        ? { title: `标签：${route.tag} | ${site.name}`, desc: `查看 ${site.name} 中使用“${route.tag}”标签的文章。`, path: `tags/${encodeURIComponent(route.tag)}` }
        : route.view === "category"
          ? { title: `分类：${route.category} | ${site.name}`, desc: `查看 ${site.name} 中归入“${route.category}”分类的文章。`, path: `categories/${encodeURIComponent(route.category)}` }
          : null;
    const page = routeMeta || pages[route.view] || pages.home;
    const title = post ? `${post.title} | ${site.name}` : page.title;
    const desc = post ? post.summary : page.desc;
    const canonical = post
      ? `${site.origin}/#/posts/${post.slug}`
      : `${site.origin}/#/${route.view === "home" ? "" : page.path || route.view}`;

    document.title = title;
    upsertMeta("description", desc);
    upsertMeta("author", site.author);
    upsertMeta("robots", route.view === "notFound" ? "noindex,follow" : "index,follow");
    upsertMetaProperty("og:type", post ? "article" : "website");
    upsertMetaProperty("og:title", title);
    upsertMetaProperty("og:description", desc);
    upsertMetaProperty("og:url", canonical);
    upsertMetaProperty("og:site_name", site.name);
    upsertLink("canonical", canonical);
    upsertJsonLd(post);
  }

  function upsertMeta(name, content) {
    let node = document.head.querySelector(`meta[name="${name}"]`);
    if (!node) {
      node = document.createElement("meta");
      node.setAttribute("name", name);
      document.head.appendChild(node);
    }
    node.setAttribute("content", content);
  }

  function upsertMetaProperty(property, content) {
    let node = document.head.querySelector(`meta[property="${property}"]`);
    if (!node) {
      node = document.createElement("meta");
      node.setAttribute("property", property);
      document.head.appendChild(node);
    }
    node.setAttribute("content", content);
  }

  function upsertLink(rel, href) {
    let node = document.head.querySelector(`link[rel="${rel}"]`);
    if (!node) {
      node = document.createElement("link");
      node.setAttribute("rel", rel);
      document.head.appendChild(node);
    }
    node.setAttribute("href", href);
  }

  function upsertJsonLd(post) {
    let node = document.getElementById("structured-data");
    if (!node) {
      node = document.createElement("script");
      node.type = "application/ld+json";
      node.id = "structured-data";
      document.head.appendChild(node);
    }
    const data = post
      ? {
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: post.summary,
          datePublished: post.date,
          dateModified: post.updated,
          author: { "@type": "Person", name: site.author },
          mainEntityOfPage: `${site.origin}/#/posts/${post.slug}`,
          keywords: post.tags.join(",")
        }
      : {
          "@context": "https://schema.org",
          "@type": "Blog",
          name: site.name,
          description: site.description,
          url: site.origin
        };
    node.textContent = JSON.stringify(data);
  }

  function afterRender(route) {
    setActiveNav(route);
    setMeta(route);
    nav?.classList.remove("is-open");
    prepareMotion();
    prepareRouteMotion();
    prepareArticleTools(route);
    updateScrollState();

    const search = document.querySelector("[data-search]");
    if (search) {
      search.addEventListener("input", (event) => {
        state.query = event.target.value;
        renderHome();
        afterRender({ view: "home" });
      });
    }

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  function prepareMotion() {
    revealObserver?.disconnect();

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      main?.querySelectorAll(".reveal-on-scroll").forEach((node) => node.classList.add("is-visible"));
      return;
    }

    const targets = main?.querySelectorAll(
      ".intro-copy, .focus-board, .live-dispatch, .post-card, .side-panel, .page-title, .archive-group, .archive-row, .project-card, .reading-item, .plain-panel, .article-main, .article-meta-rail, .toc-panel, .terminal-log, .license-box, .post-nav"
    );

    targets?.forEach((node, index) => {
      node.classList.add("reveal-on-scroll");
      node.style.setProperty("--reveal-delay", `${Math.min(index, 10) * 46}ms`);
      node.addEventListener("pointermove", handlePointerGlow);
      node.addEventListener("pointerleave", resetPointerGlow);
    });

    requestAnimationFrame(() => {
      revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          });
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
      );

      main?.querySelectorAll(".reveal-on-scroll").forEach((node) => revealObserver.observe(node));
    });
  }

  function prepareRouteMotion() {
    requestAnimationFrame(() => {
      main?.classList.add("is-route-ready");
      main?.classList.remove("is-route-pending");
    });
  }

  function prepareArticleTools(route) {
    tocObserver?.disconnect();
    if (route.view !== "post") return;

    document.querySelectorAll(".article-body pre").forEach((pre) => {
      if (pre.querySelector(".copy-code")) return;
      const button = document.createElement("button");
      button.type = "button";
      button.className = "copy-code";
      button.textContent = "复制";
      button.addEventListener("click", async () => {
        const code = pre.querySelector("code")?.innerText || "";
        try {
          await navigator.clipboard.writeText(code);
          button.textContent = "已复制";
          setTimeout(() => {
            button.textContent = "复制";
          }, 1400);
        } catch (error) {
          button.textContent = "复制失败";
        }
      });
      pre.appendChild(button);
    });

    const headings = [...document.querySelectorAll(".article-body h2[id]")];
    const links = new Map(
      [...document.querySelectorAll(".toc-panel a[href^='#']")].map((link) => [decodeURIComponent(link.getAttribute("href").slice(1)), link])
    );
    tocObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          document.querySelectorAll(".toc-panel a.is-active").forEach((link) => link.classList.remove("is-active"));
          links.get(entry.target.id)?.classList.add("is-active");
        });
      },
      { rootMargin: "-24% 0px -58% 0px", threshold: 0.1 }
    );
    headings.forEach((heading) => tocObserver.observe(heading));
  }

  function handlePointerGlow(event) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    event.currentTarget.style.setProperty("--mx", `${x.toFixed(1)}%`);
    event.currentTarget.style.setProperty("--my", `${y.toFixed(1)}%`);
  }

  function resetPointerGlow(event) {
    event.currentTarget.style.removeProperty("--mx");
    event.currentTarget.style.removeProperty("--my");
  }

  function updateScrollState() {
    const limit = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const progress = Math.min(1, Math.max(0, window.scrollY / limit));
    root.style.setProperty("--scroll-progress", progress.toFixed(4));
    document.querySelector(".back-top")?.classList.toggle("is-visible", window.scrollY > 520);
  }

  function render() {
    main?.classList.remove("is-route-ready");
    main?.classList.add("is-route-pending");
    const route = parseRoute();

    if (route.view === "home") renderHome();
    else if (route.view === "post") renderArticle(route.slug);
    else if (route.view === "project") renderProjectDetail(route.slug);
    else if (route.view === "tag") renderArchive({ tag: route.tag });
    else if (route.view === "category") renderArchive({ category: route.category });
    else if (pages[route.view]) renderSimplePage(route.view);
    else renderNotFound();

    afterRender(route);
    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
  }

  function initTheme() {
    const saved = localStorage.getItem("beid-theme");
    if (saved === "dark" || (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      root.classList.add("dark");
    }
  }

  document.addEventListener("click", (event) => {
    const action = event.target.closest("[data-action]")?.dataset.action;
    if (!action) return;

    if (action === "toggle-theme") {
      root.classList.toggle("dark");
      localStorage.setItem("beid-theme", root.classList.contains("dark") ? "dark" : "light");
      if (window.lucide) window.lucide.createIcons();
    }

    if (action === "toggle-nav") {
      nav?.classList.toggle("is-open");
    }

    if (action === "back-top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "/" || event.ctrlKey || event.metaKey || event.altKey) return;
    const target = event.target;
    const isTyping =
      target instanceof HTMLInputElement ||
      target instanceof HTMLTextAreaElement ||
      target?.isContentEditable;
    if (isTyping) return;

    event.preventDefault();
    const focusSearch = () => {
      const search = document.querySelector("[data-search]");
      search?.focus();
      search?.select();
    };

    if (!document.querySelector("[data-search]")) {
      location.hash = "#/";
      setTimeout(focusSearch, 80);
      return;
    }

    focusSearch();
  });

  window.addEventListener("hashchange", render);
  window.addEventListener("popstate", render);
  window.addEventListener("scroll", updateScrollState, { passive: true });

  initTheme();
  render();
})();
