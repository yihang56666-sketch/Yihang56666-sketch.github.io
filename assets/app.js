(function () {
  const RING_CIRCUMFERENCE = 2 * Math.PI * 21;
  const SPARK_PALETTE = ["✦", "♡", "✧", "♪", "✿", "❀", "⋆", "✺"];

  const site = {
    name: "beid",
    title: "beid",
    description: "beid 的个人博客。",
    author: "beid",
    origin: "https://yihang56666-sketch.github.io",
    github: "https://github.com/Yihang56666-sketch"
  };

  const root = document.documentElement;
  const main = document.getElementById("main");
  const nav = document.querySelector("[data-nav]");
  let revealObserver;
  let tocObserver;
  let cursorFxLayer;
  let cursorIdleTimer;
  let lastCursorSpark = 0;

  const assetBase = new URL(".", document.currentScript?.src || location.href).href;
  const animePath = (file) => `${assetBase}images/anime/${file}`;
  const animeImage = (file) => `url('${animePath(file)}')`;

  const covers = {
    hero: animeImage("hero-letter-desk.png"),
    profile: animePath("profile-host.png"),
    catDesign: animeImage("category-editorial.png"),
    catProjects: animeImage("category-workshop.png"),
    catReading: animeImage("category-library.png"),
    catLab: animeImage("category-night-light.png"),
    postRedesign: animeImage("post-blog-redesign.png"),
    postStories: animeImage("post-project-stories.png"),
    postCache: animeImage("post-reading-cache.png"),
    postTags: animeImage("post-tag-granularity.png"),
    postChecklist: animeImage("post-spa-checklist.png"),
    postNight: animeImage("post-night-lighting.png"),
    projectMagent: animeImage("project-magent-hero.png"),
    readingDesign: animeImage("reading-design-book.png"),
    readingUi: animeImage("reading-refactoring-ui.png"),
    readingNotes: animeImage("reading-smart-notes.png"),
    readingA11y: animeImage("reading-a11y.png"),
    about: animePath("about-host-garden.png")
  };

  const posts = [
    {
      title: "Codex 原生子智能体编排 Skill",
      slug: "codex-native-subagent-orchestrator-skill",
      date: "2026-08-14",
      updated: "2026-08-14",
      category: "项目复盘",
      tags: ["Codex", "子智能体", "Skill", "编排"],
      cover: covers.projectMagent,
      summary: "一个通用的 Codex Skill，用来判断何时分派任务、选择边界清晰的只读角色、处理失败，并汇总原生子智能体的结果。",
      note: "原生子智能体负责执行，Skill 负责围绕执行过程建立判断、边界和协作纪律。",
      sections: [
        {
          heading: "这次改了什么",
          paragraphs: [
            "这个仓库现在是一个通过 GitHub 分发的 Skill，而不是独立运行的智能体框架。它直接使用 Codex 原生的 spawn_agent，因此不需要自定义 CLI、模型 API、仪表盘或遥测层。",
            "Skill 规定主智能体是唯一的写入者、验证者和用户交互负责人。子智能体只在明确边界内返回证据和建议。"
          ]
        },
        {
          heading: "它能帮什么忙",
          bullets: [
            "小任务留在主智能体本地处理，避免不必要的分派和协调成本。",
            "较大的任务会得到 1 到 3 个角色清晰的子智能体，并带有范围、证据和停止条件。",
            "共享工作区检查可以保护已有修改，让只读约束不只是口头要求。"
          ]
        }
      ]
    },
    {
      title: "博客换装手记",
      slug: "white-anime-blog-redesign",
      date: "2026-07-05",
      updated: "2026-07-05",
      category: "站点手记",
      tags: ["改版", "设计", "博客"],
      cover: covers.postRedesign,
      summary: "这次给博客换上更轻盈的动漫封面：封面、动效、入口和移动端节奏。",
      note: "重点不是把页面堆满，而是让第一屏更像一个好逛的小站。",
      legacyPaths: ["/posts/white-anime-blog-redesign/"],
      sections: [
        {
          heading: "封面先建立气质",
          paragraphs: [
            "首页第一屏承担的是站点封面，而不是功能列表。现在的方向是白底、大标题、轻网格和少量漂浮标签，让访客一眼知道这里是个人博客，同时保留一点动漫感。"
          ]
        },
        {
          heading: "内容入口要像博客",
          bullets: [
            "首页负责展示封面故事、精选文章和专题。",
            "归档负责按月份追踪写作节奏。",
            "标签和分类负责把同一主题串起来。"
          ]
        }
      ]
    },
    {
      title: "轻量 SPA 博客的维护清单",
      slug: "static-spa-blog-checklist",
      date: "2026-05-12",
      updated: "2026-05-20",
      category: "工程记录",
      tags: ["静态站", "GitHub Pages", "前端"],
      cover: covers.postChecklist,
      summary: "没有框架和构建步骤也能做成熟博客，但需要固定路由、元信息、无障碍和移动端检查。",
      note: "越轻的架构，越要靠清单守住质量。",
      sections: [
        {
          heading: "静态站也需要产品意识",
          paragraphs: [
            "页面能打开只是第一步。标题、描述、文章结构、404 回退、移动端导航和图片加载，都决定了它是不是一个能长期使用的博客。"
          ]
        },
        {
          heading: "每次改版后的检查项",
          bullets: [
            "打开首页、文章页、归档页和关于页。",
            "截桌面与移动端图，确认文字没有重叠。",
            "检查主题切换、移动导航和搜索框。"
          ]
        }
      ]
    }
  ];

  const readingItems = [
    {
      title: "写给大家看的设计书",
      topic: "视觉基础",
      status: "在读",
      progress: "72%",
      desc: "用很低的门槛复习对比、重复、对齐和亲密性，适合给博客卡片和排版做体检。",
      tags: ["设计", "排版"],
      cover: covers.readingDesign
    },
    {
      title: "Refactoring UI",
      topic: "界面打磨",
      status: "重读",
      progress: "44%",
      desc: "关注细节层级、留白、字体和组件状态，适合配合这次白色博客改版慢慢消化。",
      tags: ["UI", "前端"],
      cover: covers.readingUi
    },
    {
      title: "How to Take Smart Notes",
      topic: "笔记方法",
      status: "整理",
      progress: "58%",
      desc: "把零散阅读转成可连接的笔记，再从笔记长出文章、专题和复盘。",
      tags: ["阅读", "知识管理"],
      cover: covers.readingNotes
    },
    {
      title: "Web 可访问性清单",
      topic: "工程质量",
      status: "常备",
      progress: "持续",
      desc: "检查标题层级、按钮标签、颜色对比、键盘导航和移动端触控区域。",
      tags: ["前端", "维护"],
      cover: covers.readingA11y
    }
  ];

  const showcaseCategories = [
    {
      title: "Blog Design",
      label: "站点手记",
      desc: "改版、封面、动效和长期维护。",
      href: "#/categories/站点手记",
      cover: covers.catDesign
    },
    {
      title: "Project Notes",
      label: "项目复盘",
      desc: "把做过的工具写成可回看的故事。",
      href: "#/categories/项目复盘",
      cover: covers.catProjects
    },
    {
      title: "Reading Cache",
      label: "阅读笔记",
      desc: "书单、课程和资料的消化入口。",
      href: "#/reading",
      cover: covers.catReading
    },
    {
      title: "Interface Lab",
      label: "视觉实验",
      desc: "浅色层次、动漫图像和交互动效。",
      href: "#/categories/视觉实验",
      cover: covers.catLab
    }
  ];

  const projects = [
    {
      title: "RIXIA",
      slug: "rixia",
      desc: "一个本地优先的 Android 个人节律与效率应用，包含今日、任务、习惯、笔记、倒计时、专注计时和考研学习计划，并支持保存自定义全屏背景。",
      tags: ["Android", "Capacitor", "React", "考研"],
      cover: covers.catProjects,
      status: "已发布 · Android APK",
      updated: "08/14",
      links: {
        github: "https://github.com/yihang56666-sketch/RIXIA",
        download: "/downloads/RIXIA-0.1.0-debug.apk"
      },
      stats: [
        { label: "本地数据", value: "100%" },
        { label: "Android", value: "API 36" },
        { label: "自定义背景", value: "支持" },
        { label: "测试", value: "14" }
      ],
      detail: [
        {
          heading: "移动端工作台",
          paragraphs: ["RIXIA 把一天的节律、待办、习惯和专注时间收进一个轻量的手机工作台，数据默认保存在设备本地。"]
        },
        {
          heading: "可按自己的方式使用",
          bullets: ["设置页可上传并持久化自定义全屏背景。", "新增考研区：按科目和小类安排起止日期，每日勾选自动累计学习进度。", "Android 桌面图标使用彩色菱形品牌图标。", "项目源码和调试 APK 均公开在 GitHub。"]
        }
      ]
    },
    {
      title: "Hardware Butler 硬件 Agent",
      slug: "hardware-butler",
      desc: "一个安全优先的嵌入式开发助手，把一句话硬件需求编排成需求解析、芯片选型、CubeMX 配置、固件生成、构建、烧录、观测和目标验证的 9 阶段流水线。",
      tags: ["Python", "嵌入式", "STM32", "LLM", "硬件 Agent"],
      cover: covers.postStories,
      status: "已发布 · GitHub",
      updated: "09/04",
      links: {
        github: "https://github.com/yihang56666-sketch/hardware-butler"
      },
      stats: [
        { label: "流水线路段", value: "9" },
        { label: "CLI 子命令", value: "36+" },
        { label: "厂商族", value: "14" },
        { label: "单元测试", value: "739" }
      ],
      detail: [
        {
          heading: "安全优先的自动化",
          paragraphs: [
            "默认走 mock 工作流；真实烧录必须同时满足环境变量、确认 token、目标值域检查和固件产物 hash 校验，普通输入路径无法绕过门控。"
          ]
        },
        {
          heading: "从一句话到固件",
          bullets: [
            "LLM 只负责把自然语言转成结构化意图，执行器、门控和验证器由确定性代码掌控。",
            "覆盖 STM32、ESP32、MSP430、AVR、Nordic、RISC-V 等厂商族，GD32/CH32 映射到 STM32 兼容路径。",
            "PyQt6 GUI 提供 12 个 tab，CLI 提供 36+ 子命令，行为验证支持 regex、频率测量和 QEMU 仿真分层。",
            "ruff 与 mypy 全绿，739 个单元测试回归通过；真实板卡日流程有独立 runbook 记录。"
          ]
        }
      ]
    },
    {
      title: "Codex 原生子智能体编排 Skill",
      slug: "codex-native-subagent-orchestrator-skill",
      desc: "一个通用 Skill，帮助 Codex 判断何时分派任务、动态生成临时专家角色、保持子智能体只读、处理失败，并使用原生 spawn_agent 汇总经过验证的结果。",
      tags: ["Codex", "Skill", "子智能体", "任务编排", "只读"],
      cover: covers.projectMagent,
      status: "已发布 · GitHub",
      updated: "08/14",
      links: {
        github: "https://github.com/yihang56666-sketch/magent",
        docs: "#/posts/codex-native-subagent-orchestrator-skill"
      },
      stats: [
        { label: "默认团队", value: "1-3" },
        { label: "原生引擎", value: "spawn_agent" },
        { label: "写入负责人", value: "主智能体" },
        { label: "契约测试", value: "20" }
      ],
      detail: [
        {
          heading: "核心边界",
          paragraphs: [
            "Codex 原生子智能体负责执行分派的工作。这个 Skill 判断分派是否值得协调成本，分配边界清晰的角色，检查共享工作区，并负责最终验证与汇总。"
          ]
        },
        {
          heading: "面向复用设计",
          bullets: [
            "内置角色覆盖探索、实现审查、测试、安全和文档工作。",
            "遇到特殊领域任务时，可以动态生成临时专家。",
            "恢复契约可以处理结果缺失、执行失败和超时，不会让任务卡住。",
            "仓库同时提供示例和无外部依赖的契约测试。"
          ]
        }
      ]
    },
    {
      title: "Codex 多智能体编排 · 从运行时到 Skill 的演进",
      slug: "codex-multi-agent",
      desc: "这个项目的第一版（v1.2.0）是一个纯本地的多智能体编排运行时：26 个领域专家身份、12 种协作模式、CLI + 本地仪表盘。真正用起来之后我发现，手工编排的价值不在执行引擎，而在分派判断、边界契约和结果核验——于是把整个项目重定位成上面那张纯方法论 Skill 卡，旧运行时归档。这张卡保留演进过程，作为设计决策的记录。",
      tags: ["ai-agents", "orchestration", "codex", "python", "design-decision"],
      cover: covers.projectMagent,
      status: "已归档 · 演进为 Skill",
      updated: "08/15",
      links: {
        github: "https://github.com/yihang56666-sketch/magent",
        docs: "#/posts/codex-native-subagent-orchestrator-skill"
      },
      stats: [
        { label: "v1 身份库", value: "26" },
        { label: "v1 协作模式", value: "12" },
        { label: "v2 形态", value: "纯 Skill" },
        { label: "契约测试", value: "20" }
      ],
      detail: [
        {
          heading: "v1.2.0 是什么样",
          paragraphs: [
            "「Codex-only」设计：不依赖任何第三方 LLM API，路由和任务拆解在本地 .agents/ 目录完成，执行由当前 Codex 会话按 dispatch-plan 手动逐个回答，再由 merge-results.py 合成 synthesis.md。身份层（26 身份 + 120+ 社区导入）、编排层（route_identity.py 多因子评分路由）、执行层（spawn-team / sync / merge 脚本链）三层结构，配一个 localhost:8080 的实时仪表盘。"
          ]
        },
        {
          heading: "为什么重定位",
          paragraphs: [
            "实际使用暴露了根本矛盾：执行环节本来就是 Codex 原生 spawn_agent 已经做好的事，v1 用 3000 行 Python 重新包了一层执行状态机，反而带来检查点、缓存、仪表盘这些需要持续维护的资产。真正被反复用到的是分派准则（什么时候不该分派）、角色契约（每个子智能体只回答一个可验证的问题）和结果核验（要求文件、行号、命令输出级证据）。",
            "重定位结论：执行引擎交给原生 spawn_agent，Skill 只做决策、路由、安全与汇总层。v1.2.0 归档，文档里的 CLI / 仪表盘承诺同步移除，避免仓库宣传与实际内容不一致。"
          ]
        },
        {
          heading: "演进前后对比",
          table: {
            headers: ["维度", "v1.2.0 运行时", "v2 纯 Skill"],
            rows: [
              ["形态", "Python CLI + 脚本链 + 仪表盘", "SKILL.md 契约 + 参考文档 + 示例"],
              ["执行", "手动编排（逐个回答 prompt）", "原生 spawn_agent 引擎"],
              ["维护面", "3.2k 行代码 + 检查点/缓存", "文档契约 + 20 个无依赖契约测试"],
              ["核心价值", "把多智能体跑起来", "判断值不值得分派、边界与核验"],
              ["失败处理", "检查点恢复", "恢复契约：失败/超时/空结果的有限替补"]
            ]
          }
        },
        {
          heading: "带走的三条经验",
          bullets: [
            "先证伪「更多智能体一定更快」：分派和协调本身有成本，默认留在主智能体本地才是常见正解。",
            "文档与实现的不一致会在使用时暴露：重定位时同步清理了所有旧产品承诺，并给仓库加上契约测试防回退。",
            "归档不等于删除：保留演进记录（这张卡）比假装 v1 不存在更有说服力。"
          ]
        }
      ]
    }
  ];

  // ── archive month notes ────────────────────────────────
  // （旧版这里的 siteUpdates 数组从未被任何视图渲染，且 README 把它
  // 错标成"首页站点更新"——已随本期重构移除，更新近况直接看归档。）
  const archiveNotes = {
    "2026-08": "8 月发布了 Codex 原生子智能体 Skill，并把 BEID 平板播放器打磨到可长期自用。",
    "2026-07": "7 月主要在打磨站点封面、首页结构和整体气质。",
    "2026-06": "6 月把项目复盘和阅读缓存整理成更像长期栏目的一组入口。",
    "2026-05": "5 月关注标签粒度、静态站维护和轻量前端体验。",
    "2026-04": "4 月留下了一些界面调光和动效尺度的视觉实验。"
  };

  const pages = {
    home: { title: site.title, desc: site.description },
    archive: { title: "文章归档", desc: "按时间索引文章和手账，新的记录会自然进入时间线。" },
    projects: { title: "项目札记", desc: "项目复盘、工具实验和自动化系统，都以清爽卡片的方式陈列。" },
    reading: { title: "阅读缓存", desc: "书单、资料和学习路线会被整理成可检索的知识缓存。" },
    about: { title: "关于 beid", desc: "这里是 beid 的个人博客。" },
    tags: { title: "标签索引", desc: "标签会串起文章、项目和学习记录。" },
    categories: { title: "分类目录", desc: "分类负责把不同主题整理到对应的内容模块。" },
    links: { title: "外部链接", desc: "站点、仓库和公开入口集中放在这里。" },
    kaoyan: { title: "学习阵地", desc: "阶段计划和复习材料会整理成更轻的任务面板。" }
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

  posts.forEach((post) => {
    (post.legacyPaths || []).forEach((legacyPath) => {
      legacyLookup.set(normalizePath(legacyPath), post.slug);
    });
  });

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


  function coverUrl(cover) {
    return String(cover || "").replace(/^url\(['"]?/, "").replace(/['"]?\)$/, "");
  }

  function magazineFrame(cover, alt) {
    const src = coverUrl(cover);
    const image = `<img src="${esc(src)}" alt="${esc(alt)}" data-zoom>`;
    if (prefersReducedMotion()) {
      return `<div class="magazine-cover">${image}</div>`;
    }
    return `
      <div class="atropos magazine-atropos" data-magazine-tilt>
        <div class="atropos-scale">
          <div class="atropos-rotate">
            <div class="atropos-inner magazine-cover" data-atropos-offset="4">
              ${image}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function pageHeader(title, desc, eyebrow) {
    return `
      <section class="page-title">
        <div>
          <p class="eyebrow">${esc(eyebrow || "beid blog")}</p>
          <h1>${esc(title)}</h1>
          <p>${esc(desc)}</p>
        </div>
        <div class="page-title-index" aria-hidden="true">
          <span>Blog</span>
          <b>${esc(eyebrow || "home")}</b>
        </div>
      </section>
    `;
  }

  function emptyPanel(title, desc, actionText = "回到首页", actionHref = "#/") {
    return `
      <section class="plain-panel empty-state-panel">
        <p class="eyebrow">empty shelf</p>
        <h2>${esc(title)}</h2>
        <p>${esc(desc)}</p>
        <a class="pill-button" href="${esc(actionHref)}"><i data-lucide="pen-line"></i>${esc(actionText)}</a>
      </section>
    `;
  }

  function renderHomeMaikire() {
    const query = state.query.trim().toLowerCase();
    const filtered = posts.filter((post) => {
      const haystack = `${post.title} ${post.summary} ${post.category} ${post.tags.join(" ")}`.toLowerCase();
      return haystack.includes(query);
    });
    const articleList = (query ? filtered : posts).slice(0, 6);

    main.innerHTML = `
      <div class="maikire-home">
        <section class="maikire-hero" aria-labelledby="home-title">
          <div class="maikire-hero-title">
            <p class="hero-kicker"><span class="hero-kicker-dot" aria-hidden="true"></span>personal blog · digital garden · est. 2024</p>
            <h1 id="home-title" data-split-text>beid</h1>
            <p class="hero-serif-line"><em>code, essays &amp; soft light</em> — 把写作、项目和灵感收进一间白色小屋。</p>
            <div class="hero-cta-row">
              <a class="pill-button primary" href="#/archive" data-magnetic><i data-lucide="feather"></i>开始阅读</a>
              <a class="pill-button" href="#/projects" data-magnetic><i data-lucide="flask-conical"></i>看看项目</a>
            </div>
          </div>
          <button class="maikire-down" type="button" data-action="scroll-blog-home" aria-label="进入博客主页">
            <i data-lucide="chevron-down"></i>
          </button>
        </section>

        <section class="maikire-content" id="blog-home" aria-label="博客主页">
          <div class="maikire-main">
            <section class="maikire-section" aria-label="精选分类">
              <div class="maikire-heading">
                <span></span>
                <h2>精选分类</h2>
                <span></span>
              </div>
              <div class="maikire-category-grid">
                ${showcaseCategories.map(showcaseCard).join("")}
              </div>
            </section>

            <section class="maikire-section" aria-label="文章列表">
              <div class="maikire-heading maikire-heading-list">
                <span></span>
                <h2>文章列表</h2>
                <span></span>
              </div>
              <div class="maikire-list-tools">
                <label class="search-box maikire-search">
                  <i data-lucide="search"></i>
                  <input type="search" placeholder="搜索文章、标签、分类..." value="${esc(state.query)}" data-search aria-label="搜索文章">
                  <span class="kbd-hint" data-kbd-hint>/</span>
                </label>
                <a class="pill-button" href="#/archive"><i data-lucide="archive"></i>时间线</a>
              </div>
              <div class="search-live" data-search-live aria-live="polite" aria-atomic="true"></div>
              <div class="maikire-article-list">
                ${articleList.length ? articleList.map(maikireArticleCard).join("") : '<div class="empty-state" data-empty-shelf><span class="empty-shelf-icon" aria-hidden="true">📖</span>没有匹配的文章，可以换个关键词试试。<span class="empty-shelf-hint">第一篇已经在路上了。</span></div>'}
              </div>
            </section>
          </div>

          <aside class="maikire-sidebar">
            ${maikireProfileCard()}
            <nav class="maikire-side-nav" aria-label="站点导航">
              <a class="is-active" href="#/"><i data-lucide="castle"></i><span>首页</span></a>
              <a href="#/about"><i data-lucide="circle-user-round"></i><span>关于</span></a>
              <a href="#/archive"><i data-lucide="feather"></i><span>文章</span></a>
              <a href="#/projects"><i data-lucide="play-circle"></i><span>项目</span></a>
              <a href="#/reading"><i data-lucide="heart"></i><span>阅读</span></a>
              <a href="#/links"><i data-lucide="send"></i><span>开往</span></a>
            </nav>
          </aside>
        </section>
      </div>
    `;
  }

  function showcaseCard(item) {
    return `
      <a class="maikire-category-card" href="${esc(item.href)}" style="--cover: ${item.cover}">
        <span>${esc(item.label)}</span>
        <strong>${esc(item.title)}</strong>
        <p>${esc(item.desc)}</p>
      </a>
    `;
  }

  function maikireArticleCard(post) {
    return `
      <article class="maikire-post-card" style="--cover: ${post.cover}">
        <a class="maikire-post-cover" href="${postHref(post)}" aria-label="阅读：${esc(post.title)}"></a>
        <div class="maikire-post-body">
          <div class="maikire-post-meta">
            <span><i data-lucide="calendar-days"></i>${formatDate(post.date)}</span>
            <span><i data-lucide="pen-line"></i>${Math.max(0.5, (readingTime(post) * 1.1).toFixed(1))}k 字</span>
            <span><i data-lucide="clock"></i>${readingTime(post)} 分钟</span>
          </div>
          <h3><a href="${postHref(post)}">${esc(post.title)}</a></h3>
          <p>${esc(post.summary)}</p>
          <div class="maikire-post-foot">
            <span><i data-lucide="flag"></i>${esc(post.category)}</span>
            <a href="${postHref(post)}">more...</a>
          </div>
        </div>
      </article>
    `;
  }

  function maikireProfileCard() {
    return `
      <section class="maikire-profile">
        <img src="${esc(covers.profile)}" alt="">
        <h2>beid</h2>
        <p>૮₍ ˶ᵔ ᵕ ᵔ˶ ₎ა</p>
        <div class="maikire-profile-stats" data-counter-group>
          <span><b data-counter="${posts.length}">0</b>文章</span>
          <span><b data-counter="${getAllCategories().length}">0</b>分类</span>
          <span><b data-counter="${getAllTags().length}">0</b>标签</span>
        </div>
        <div class="maikire-socials" aria-label="社交链接">
          <a href="${site.github}" target="_blank" rel="noreferrer" aria-label="GitHub"><i data-lucide="code-2"></i></a>
          <a href="#/reading" aria-label="阅读"><i data-lucide="book-heart"></i></a>
          <a href="#/links" aria-label="链接"><i data-lucide="mail"></i></a>
        </div>
      </section>
    `;
  }

  function renderArchive(filter) {
    let list = posts;
    let desc = pages.archive.desc;
    let title = pages.archive.title;
    let eyebrow = "archive";

    // 空态文案按真实列表长度决定，别在非空列表上方喊"还没有新文章"。
    if (filter?.tag) {
      list = posts.filter((post) => post.tags.includes(filter.tag));
      title = `标签：${filter.tag}`;
      desc = list.length ? `${list.length} 篇文章带有「${filter.tag}」标签。` : "这个标签下还没有新文章。";
      eyebrow = "tag";
    }

    if (filter?.category) {
      list = posts.filter((post) => post.category === filter.category);
      title = `分类：${filter.category}`;
      desc = list.length ? `${list.length} 篇文章归入「${filter.category}」分类。` : "这个分类下还没有新文章。";
      eyebrow = "category";
    }

    main.innerHTML = `
      ${pageHeader(title, desc, eyebrow)}
      <section class="magazine-list">
        ${list.length
          ? archiveGroups(list)
              .map(
                ([month, items]) => `
                  <div class="archive-group">
                    <h2>${archiveMonthLabel(month)}</h2>
                    <p class="archive-month-note">${esc(archiveMonthNote(month, items))}</p>
                    ${items
                      .map(
                        (post, index) => `
                          <article class="magazine-row ${index % 2 ? "is-flipped" : ""}" style="--cover: ${post.cover}">
                            ${magazineFrame(post.cover, post.title)}
                            <div class="magazine-copy">
                              <time datetime="${esc(post.date)}">${post.date.slice(5).replace("-", "/")}</time>
                              <p class="eyebrow">${esc(post.category)}</p>
                              <h3><a href="${postHref(post)}">${esc(post.title)}</a></h3>
                              <p>${esc(post.note || post.summary)}</p>
                              <span>${readingTime(post)} 分钟</span>
                            </div>
                          </article>
                        `
                      )
                      .join("")}
                  </div>
                `
              )
              .join("")
          : '<div class="empty-state" data-empty-shelf><span class="empty-shelf-icon" aria-hidden="true">📖</span>暂无文章。新的日志写入后，会按时间顺序显示在这个书架。<span class="empty-shelf-hint">准备写下第一篇？</span></div>'}
      </section>
    `;
  }

  function renderProjects() {
    main.innerHTML = `
      ${pageHeader(pages.projects.title, pages.projects.desc, "projects")}
      ${projects.length
        ? `<section class="magazine-list">${projects
            .map(
              (project, index) => `
                <article class="magazine-project ${index % 2 ? "is-flipped" : ""}">
                  ${magazineFrame(project.cover, project.title)}
                  <div class="magazine-copy">
                    <p class="eyebrow">${esc(project.tags[0])}</p>
                    <h2><a href="#/projects/${project.slug}">${esc(project.title)}</a></h2>
                    <p>${esc(project.desc)}</p>
                    <div class="project-status">
                      <span>${esc(project.status)}</span>
                      <strong>${esc(project.next || "文档、复盘和运行记录可浏览")}</strong>
                      <small>最近更新 ${esc(project.updated)}</small>
                    </div>
                    ${project.stats?.length ? `<div class="project-stats">${project.stats.map((stat) => `<div class="project-stat"><b>${esc(stat.value)}</b><span>${esc(stat.label)}</span></div>`).join("")}</div>` : ""}
                    <div class="tag-row">${tagChips(project.tags)}</div>
                    <div class="project-actions">
                      <a class="pill-button ghost" href="#/projects/${project.slug}"><i data-lucide="book-open"></i>项目详情</a>
                      ${project.links?.github ? `<a class="pill-button" href="${esc(project.links.github)}" target="_blank" rel="noreferrer"><i data-lucide="code-2"></i>GitHub</a>` : ""}
                      ${project.links?.download ? `<a class="pill-button primary" href="${esc(project.links.download)}" download><i data-lucide="download"></i>下载 APK</a>` : ""}
                    </div>
                  </div>
                </article>
              `
            )
            .join("")}</section>`
        : emptyPanel("项目札记待添加", "新的项目复盘会以博客卡片形式加入 projects 数组，并自动出现在这里。", "回首页", "#/")}
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
            <div class="project-endpoint-strip">
              <span>项目札记 · ${esc(project.slug)}</span>
              <b>${esc(project.updated)}</b>
            </div>
            <div class="project-detail-actions">
              ${project.links?.github ? `<a class="pill-button" href="${esc(project.links.github)}" target="_blank" rel="noreferrer"><i data-lucide="code-2"></i>GitHub</a>` : ""}
              ${project.links?.download ? `<a class="pill-button primary" href="${esc(project.links.download)}" download><i data-lucide="download"></i>下载 Android APK</a>` : ""}
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
            <span>此为 ${esc(site.author)} 的项目札记 / 复盘记录。</span>
            <a href="#/projects" style="display:inline-flex;align-items:center;gap:6px;margin-top:10px">&larr; 返回项目列表</a>
          </div>
        </div>
      </div>
    `;
  }

  function renderReading() {
    main.innerHTML = `
      ${pageHeader(pages.reading.title, pages.reading.desc, "reading")}
      <section class="reading-board">
        <div class="reading-board-head">
          <div>
            <p class="eyebrow">reading shelf</p>
            <h2>正在消化的资料</h2>
            <p>这里放正在读、重读和常备的资料。每条记录都保留主题、状态、进度和下一步，方便以后写成文章。</p>
          </div>
          <a class="pill-button" href="#/archive"><i data-lucide="pen-line"></i>看相关文章</a>
        </div>
        <div class="shelf-grid">
          ${readingItems.map((item) => `
            <article class="shelf-card">
              ${magazineFrame(item.cover, item.title)}
              <div class="magazine-copy">
                <div class="reading-card-top">
                  <span>${esc(item.topic)}</span>
                  <strong>${esc(item.status)}</strong>
                </div>
                <h3>${esc(item.title)}</h3>
                <p>${esc(item.desc)}</p>
                <div class="reading-progress shelf-progress" style="--progress: ${Number.parseFloat(item.progress) || 100}%">
                  <span></span>
                  <b>${esc(item.progress)}</b>
                </div>
                <div class="tag-row">${tagChips(item.tags)}</div>
              </div>
            </article>
          `).join("")}
        </div>
      </section>
    `;
  }

  function renderAbout() {
    main.innerHTML = `
      ${pageHeader(pages.about.title, pages.about.desc, "about")}
      <section class="about-hero">
        <img src="${esc(covers.about)}" alt="" data-zoom>
        <div>
          <p class="eyebrow">about</p>
          <h1>关于 beid</h1>
          <p>这里是 beid 的个人博客。页面轻一点，打开时心情好一点。</p>
          <div class="intro-actions">
            <a class="pill-button primary" href="${site.github}" target="_blank" rel="noreferrer"><i data-lucide="code-2"></i>GitHub</a>
            <a class="pill-button" href="#/archive"><i data-lucide="book-open"></i>文章列表</a>
          </div>
        </div>
      </section>
      <section class="about-notes">
        <article class="about-note-card">
          <h2>写什么</h2>
          <p>项目是做过的东西，文章是当时的判断，阅读是还在消化的材料。它们会互相链接，慢慢长成自己的资料库。</p>
        </article>
        <article class="about-note-card">
          <h2>怎么维护</h2>
          <p>目前依旧是无构建的静态 SPA，内容集中在 assets/app.js，样式集中在 assets/styles.css，方便直接部署到 GitHub Pages。</p>
        </article>
        <article class="about-note-card">
          <h2>视觉原则</h2>
          <p>清晰文字、少量强调色、独立角色封面和稳定间距。所有动态都服务于气质，不打断阅读。</p>
        </article>
        <article class="about-note-card">
          <h2>站点规模</h2>
          <p>${posts.length} 篇文章、${projects.length} 个项目、${readingItems.length} 条阅读、${getAllTags().length} 个标签，内容会慢慢补齐。</p>
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
      renderTagIndex();
      return;
    }
    if (key === "categories") {
      renderCategoryIndex();
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
        ${emptyPanel("任务面板待接入", "这里会继续整理新的阶段计划、学习路径和复习资料。")}
      `;
    }
  }

  function renderTagIndex() {
    const tags = getAllTags();
    main.innerHTML = `
      ${pageHeader(pages.tags.title, pages.tags.desc, "tags")}
      <section class="index-grid">
        ${tags
          .map((tag) => {
            const count = posts.filter((post) => post.tags.includes(tag)).length;
            const latest = posts.find((post) => post.tags.includes(tag));
            return `
              <article class="index-card">
                <a href="#/tags/${encodeURIComponent(tag)}" aria-label="查看标签：${esc(tag)}"></a>
                <p class="eyebrow">tag</p>
                <h2>${esc(tag)}</h2>
                <p>${latest ? esc(latest.summary) : "这个标签下会继续收纳新的文章。"}</p>
                <span>${count} 篇文章</span>
              </article>
            `;
          })
          .join("")}
      </section>
    `;
  }

  function renderCategoryIndex() {
    const categories = getAllCategories();
    main.innerHTML = `
      ${pageHeader(pages.categories.title, pages.categories.desc, "categories")}
      <section class="index-grid">
        ${categories
          .map((category) => {
            const items = posts.filter((post) => post.category === category);
            return `
              <article class="index-card">
                <a href="#/categories/${encodeURIComponent(category)}" aria-label="查看分类：${esc(category)}"></a>
                <p class="eyebrow">category</p>
                <h2>${esc(category)}</h2>
                <p>${esc(items[0]?.note || items[0]?.summary || "这个分类会继续整理新的文章。")}</p>
                <span>${items.length} 篇文章</span>
              </article>
            `;
          })
          .join("")}
      </section>
    `;
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
            <header class="article-hero magazine-article-hero">
              ${magazineFrame(post.cover, post.title)}
              <div class="magazine-copy">
                <p class="eyebrow">${esc(post.category)}</p>
                <h1 class="article-title">${esc(post.title)}</h1>
                <div class="inline-meta">
                  <span>${formatDate(post.date)}</span>
                  <span>${readingTime(post)} 分钟阅读</span>
                </div>
                <p class="article-note">${esc(post.note || "")}</p>
              </div>
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
            ${older ? `<a href="${postHref(older)}"><img src="${esc(coverUrl(older.cover))}" alt=""><small>上一篇</small><strong>${esc(older.title)}</strong></a>` : `<a href="#/archive"><small>返回</small><strong>文章归档</strong></a>`}
            ${newer ? `<a href="${postHref(newer)}"><img src="${esc(coverUrl(newer.cover))}" alt=""><small>下一篇</small><strong>${esc(newer.title)}</strong></a>` : `<a href="#/projects"><small>继续看</small><strong>做过的东西</strong></a>`}
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
      ${pageHeader("找不到这页", "这篇内容暂时不在书架上，可以回到首页或查看已有栏目。", "404")}
      <section class="plain-grid">
        <article class="plain-panel"><h2>最近文章</h2><p>文章书架暂时没有公开内容。</p></article>
        <article class="plain-panel"><h2>快速入口</h2><div class="tag-cloud"><a class="tag-chip" href="#/archive">归档</a><a class="tag-chip" href="#/tags">标签</a><a class="tag-chip" href="#/categories">分类</a></div></article>
      </section>
    `;
  }

  function parseRoute() {
    let hash = location.hash.replace(/^#\/?/, "");
    try {
      hash = decodeURIComponent(hash);
    } catch {
      return { view: "notFound" };
    }
    if (hash) {
      const parts = hash.split("/").filter(Boolean);
      if (!parts.length) return { view: "home" };
        if (parts[0] === "posts" && parts[1]) return { view: "post", slug: parts[1] };
        if (parts[0] === "tags" && parts[1]) return { view: "tag", tag: parts[1] };
        if (parts[0] === "categories" && parts[1]) return { view: "category", category: parts[1] };
        if (parts[0] === "projects" && parts[1]) return { view: "project", slug: parts[1] };
        return pages[parts[0]] ? { view: parts[0] } : { view: "notFound" };
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
      const project = route.view === "project" ? projects.find((item) => item.slug === route.slug) : null;
      const notFound = route.view === "notFound" || (route.view === "post" && !post) || (route.view === "project" && !project);
    const routeMeta =
      route.view === "tag"
        ? { title: `标签：${route.tag} | ${site.name}`, desc: `查看 ${site.name} 中使用“${route.tag}”标签的文章。`, path: `tags/${encodeURIComponent(route.tag)}` }
        : route.view === "category"
          ? { title: `分类：${route.category} | ${site.name}`, desc: `查看 ${site.name} 中归入“${route.category}”分类的文章。`, path: `categories/${encodeURIComponent(route.category)}` }
          : null;
      const page = notFound ? { title: "找不到这页 | beid", desc: "这篇内容暂时不在书架上。" } : routeMeta || pages[route.view] || pages.home;
    const title = post ? `${post.title} | ${site.name}` : project ? `${project.title} | ${site.name}` : page.title;
    const desc = post ? post.summary : project ? project.desc : page.desc;
      const canonical = notFound
        ? site.origin
        : post
        ? `${site.origin}/#/posts/${post.slug}`
        : project
          ? `${site.origin}/#/projects/${project.slug}`
        : route.view === "home"
          ? site.origin
          : `${site.origin}/#/${page.path || route.view}`;
      const socialImage = `${site.origin}/assets/images/anime/hero-letter-desk.png`;

    document.title = title;
    upsertMeta("description", desc);
    upsertMeta("author", site.author);
      upsertMeta("robots", notFound ? "noindex,follow" : "index,follow");
    upsertMetaProperty("og:type", post ? "article" : "website");
    upsertMetaProperty("og:title", title);
      upsertMetaProperty("og:description", desc);
      upsertMetaProperty("og:url", canonical);
      upsertMetaProperty("og:site_name", site.name);
      upsertMetaProperty("og:image", socialImage);
      upsertMeta("theme-color", root.classList.contains("dark") ? "#0f172a" : "#f6f3f7");
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
            keywords: post.tags.join(","),
            image: `${site.origin}/assets/images/anime/hero-letter-desk.png`
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


  const motion = {
    lenis: null,
    tilts: [],
    zoom: null
  };

  function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function destroyMotionEnhancements() {
    motion.tilts.splice(0).forEach((tilt) => tilt.destroy?.());
    motion.zoom?.detach();
    motion.zoom = null;
  }

  function initLenis() {
    if (prefersReducedMotion() || !window.Lenis || motion.lenis) return;
    motion.lenis = new window.Lenis({ autoRaf: true });
    motion.lenis.on("scroll", updateScrollState);
  }

  function initMotionEnhancements() {
    destroyMotionEnhancements();
    if (prefersReducedMotion()) return;
    initLenis();
    document.querySelectorAll("[data-magazine-tilt]").forEach((node) => {
      if (!window.Atropos) return;
      try {
        motion.tilts.push(window.Atropos(node, { activeOffset: 28, rotateXMax: 9, rotateYMax: 9 }));
      } catch {
        // Atropos is decorative; keep the page readable if the CDN module fails.
      }
    });
    if (window.mediumZoom) {
      motion.zoom = window.mediumZoom("[data-zoom]", {
        background: "rgba(247, 248, 251, 0.92)",
        margin: 24
      });
    }
  }

  function afterRender(route) {
    root.dataset.view = route.view;
      setActiveNav(route);
      setMeta(route);
      syncNavState(false);
    prepareMotion();
    prepareRouteMotion();
    prepareArticleTools(route);
    updateScrollState();
    prepareHeroMotion();
    initMotionEnhancements();
    initCounters();


      if (window.lucide) {
        window.lucide.createIcons();
      }
      syncThemeControl();
      syncKbdHint();
  }

  function prepareMotion() {
    revealObserver?.disconnect();

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      main?.querySelectorAll(".reveal-on-scroll").forEach((node) => node.classList.add("is-visible"));
      return;
    }

    const targets = main?.querySelectorAll(
      ".maikire-hero-title, .maikire-section, .maikire-category-card, .maikire-post-card, .maikire-profile, .maikire-side-nav, .issue-strip, .api-hero, .endpoint-card, .editorial-board, .editorial-lead, .secondary-story, .month-brief, .topic-card, .column-card, .reading-card, .index-card, .about-profile, .metric, .live-dispatch, .dispatch-item, .post-card, .side-panel, .desk-link, .page-title, .archive-group, .archive-row, .project-card, .reading-item, .plain-panel, .article-main, .article-meta-rail, .toc-panel, .terminal-log, .license-box, .post-nav, .magazine-row, .magazine-project, .shelf-card, .about-hero, .about-note-card, .magazine-article-hero"
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

  function prepareHeroMotion() {
    const hero = document.querySelector(".api-hero, .maikire-hero");
    if (!hero || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    hero.addEventListener("pointermove", (event) => {
      const rect = hero.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - 0.5).toFixed(3);
      const y = ((event.clientY - rect.top) / rect.height - 0.5).toFixed(3);
      hero.style.setProperty("--hero-x", x);
      hero.style.setProperty("--hero-y", y);
    });

    hero.addEventListener("pointerleave", () => {
      hero.style.removeProperty("--hero-x");
      hero.style.removeProperty("--hero-y");
    });
  }

  function initCursorFx() {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    if (reduceMotion || !finePointer) return;

    cursorFxLayer = document.createElement("div");
    cursorFxLayer.className = "cursor-fx-layer";
    cursorFxLayer.setAttribute("aria-hidden", "true");

    const cursorFollower = document.createElement("span");
    cursorFollower.className = "cursor-follower";
    cursorFxLayer.appendChild(cursorFollower);
    document.body.appendChild(cursorFxLayer);

    document.addEventListener("pointermove", handleCursorFx, { passive: true });
    document.addEventListener("pointerleave", () => cursorFxLayer?.classList.remove("is-active"), { passive: true });
  }

  function handleCursorFx(event) {
    if (!cursorFxLayer || event.pointerType === "touch") return;

    root.style.setProperty("--cursor-x", `${event.clientX}px`);
    root.style.setProperty("--cursor-y", `${event.clientY}px`);
    cursorFxLayer.classList.add("is-active");

    window.clearTimeout(cursorIdleTimer);
    cursorIdleTimer = window.setTimeout(() => cursorFxLayer?.classList.remove("is-active"), 900);

    const now = performance.now();
    if (now - lastCursorSpark < 46) return;
    lastCursorSpark = now;
    createCursorSpark(event.clientX, event.clientY);
  }

  function createCursorSpark(x, y) {
    if (!cursorFxLayer) return;
    const spark = document.createElement("span");
    spark.className = "cursor-spark";
    spark.textContent = SPARK_PALETTE[Math.floor(Math.random() * SPARK_PALETTE.length)];
    spark.style.left = `${x}px`;
    spark.style.top = `${y}px`;
    spark.style.setProperty("--spark-x", `${(Math.random() - 0.5) * 42}px`);
    spark.style.setProperty("--spark-y", `${-18 - Math.random() * 28}px`);
    spark.style.setProperty("--spark-rotate", `${(Math.random() - 0.5) * 70}deg`);
    cursorFxLayer.appendChild(spark);

    const sparks = cursorFxLayer.querySelectorAll(".cursor-spark");
    if (sparks.length > 26) sparks[0].remove();
    window.setTimeout(() => spark.remove(), 760);
  }

  function updateScrollState() {
    const limit = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const progress = Math.min(1, Math.max(0, window.scrollY / limit));
    root.style.setProperty("--scroll-progress", progress.toFixed(4));
    const btn = document.querySelector("[data-action='back-top']");
    if (btn && !btn.querySelector("svg.ring")) {
      btn.innerHTML = `
        <svg class="ring" viewBox="0 0 48 48" aria-hidden="true">
          <circle class="ring-track" cx="24" cy="24" r="21"></circle>
          <circle class="ring-progress" cx="24" cy="24" r="21"></circle>
        </svg>
        <i data-lucide="arrow-up"></i>
      `;
      window.lucide?.createIcons();
    }
    document.querySelector(".back-top")?.classList.toggle("is-visible", window.scrollY > 520);
    const ring = document.querySelector(".ring-progress");
    if (ring) ring.style.strokeDashoffset = `${(1 - progress) * RING_CIRCUMFERENCE}`;
  }

  function render() {
    main?.classList.remove("is-route-ready");
    main?.classList.add("is-route-pending");
    const route = parseRoute();

    if (route.view === "home") renderHomeMaikire();
    else if (route.view === "post") renderArticle(route.slug);
    else if (route.view === "project") renderProjectDetail(route.slug);
    else if (route.view === "tag") renderArchive({ tag: route.tag });
    else if (route.view === "category") renderArchive({ category: route.category });
    else if (pages[route.view]) renderSimplePage(route.view);
    else renderNotFound();

    afterRender(route);
    if (motion.lenis) motion.lenis.scrollTo(0, { immediate: true });
    else window.scrollTo({ top: 0, behavior: "auto" });
  }

  function readThemePreference() {
    try {
      return localStorage.getItem("beid-theme");
    } catch {
      return null;
    }
  }

  function writeThemePreference(value) {
    try {
      localStorage.setItem("beid-theme", value);
    } catch {
      // Theme preference is optional; the current session still updates.
    }
  }

  function syncThemeControl() {
    const button = document.querySelector("[data-action='toggle-theme']");
    if (!button) return;
    const dark = root.classList.contains("dark");
    button.setAttribute("aria-pressed", String(dark));
    button.setAttribute("aria-label", dark ? "切换到浅色主题" : "切换到深色主题");
    const icon = button.querySelector("[data-lucide]");
    if (icon) icon.setAttribute("data-lucide", dark ? "sun" : "moon");
    window.lucide?.createIcons();
  }

  function syncNavState(open) {
    const isOpen = Boolean(open);
    nav?.classList.toggle("is-open", isOpen);
    document.querySelector("[data-action='toggle-nav']")?.setAttribute("aria-expanded", String(isOpen));
  }

  function initTheme() {
    const saved = readThemePreference();
    if (saved === "dark" || (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      root.classList.add("dark");
    }
  }

  document.addEventListener("click", (event) => {
    if (event.target.closest(".nav-links a")) syncNavState(false);
    const action = event.target.closest("[data-action]")?.dataset.action;
    if (!action) return;

    if (action === "toggle-theme") {
      const wasDark = root.classList.contains("dark");
      root.classList.add("theme-transition");
      const dropThemeTransition = () => root.classList.remove("theme-transition");
      window.setTimeout(dropThemeTransition, 520);
      const burst = document.createElement("span");
      burst.className = "theme-burst";
      const btn = event.target.closest("[data-action='toggle-theme']");
      const rect = btn?.getBoundingClientRect();
      if (rect) {
        burst.style.left = `${rect.left + rect.width / 2}px`;
        burst.style.top = `${rect.top + rect.height / 2}px`;
      } else {
        burst.style.left = `${window.innerWidth - 60}px`;
        burst.style.top = "60px";
      }
      document.body.appendChild(burst);
      window.setTimeout(() => burst.remove(), 720);
      root.classList.toggle("dark");
      writeThemePreference(root.classList.contains("dark") ? "dark" : "light");
      syncThemeControl();
    }

    if (action === "copy-endpoint") {
      const button = event.target.closest("[data-action='copy-endpoint']");
      const value = button?.closest("[data-copy-value]")?.dataset.copyValue;
      if (!button || !value) return;
      const label = button.querySelector("span");
      const write = navigator.clipboard?.writeText(value) || Promise.reject(new Error("Clipboard API unavailable"));
      write.then(
        () => {
          if (!label) return;
          label.textContent = "已复制";
          window.setTimeout(() => {
            label.textContent = "复制";
          }, 1400);
        },
        () => {
          if (!label) return;
          label.textContent = "复制失败";
          window.setTimeout(() => {
            label.textContent = "复制";
          }, 1400);
        }
      );
    }

    if (action === "scroll-blog-home") {
      event.preventDefault();
      document.getElementById("blog-home")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    if (action === "toggle-nav") {
      syncNavState(!nav?.classList.contains("is-open"));
    }

    if (action === "back-top") {
      if (motion.lenis) motion.lenis.scrollTo(0);
      else window.scrollTo({ top: 0, behavior: "smooth" });
      document.querySelector(".back-top")?.classList.add("is-leaping");
      window.setTimeout(() => document.querySelector(".back-top")?.classList.remove("is-leaping"), 900);
    }
  });

  // 目录/文内锚点点击：裸 #fragment 会触发 hashchange → parseRoute → notFound
  // （裸片段不是路由），把整篇文章替换成 404 页。这里拦截并原地平滑滚动，
  // 不触碰路由 hash；滚动监听器随后会更新目录高亮。
  document.addEventListener("click", (event) => {
    const link = event.target.closest(".toc-panel a[href^='#'], .article-main a[href^='#']");
    if (!link) return;
    const rawId = decodeURIComponent(link.getAttribute("href").slice(1));
    if (!rawId) return;
    const heading = document.getElementById(rawId);
    if (!heading) return;
    event.preventDefault();
    if (motion.lenis) motion.lenis.scrollTo(heading);
    else heading.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
    history.replaceState(null, "", location.hash || "#/");
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      const nav = document.querySelector("[data-nav]");
      if (nav?.classList.contains("is-open")) {
        syncNavState(false);
        document.querySelector("[data-action='toggle-nav']")?.focus();
        return;
      }
      const search = document.querySelector("[data-search]");
      if (search && document.activeElement === search) {
        search.value = "";
        state.query = "";
        renderHomeMaikire();
        afterRender({ view: "home" });
        search.blur();
        return;
      }
    }

    if ((event.key === "k" || event.key === "K") && (event.ctrlKey || event.metaKey)) {
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
      return;
    }

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

  // 搜索过滤。CJK 输入法组合期间（isComposing）绝不能整体重渲染：
  // renderHomeMaikire 会重建包括正在组词的输入框在内的整个视图，
  // 拼音组合被打断 → 中文搜索基本不可用。组合结束后再过滤一次。
  function applySearchFilter(input) {
    state.query = input.value;
    renderHomeMaikire();
    afterRender({ view: "home" });
    const next = document.querySelector("[data-search]");
    if (next && next !== input) {
      next.focus();
      next.setSelectionRange(next.value.length, next.value.length);
    }
    const liveRegion = document.querySelector("[data-search-live]");
    if (liveRegion) {
      const cards = document.querySelectorAll(".maikire-post-card").length;
      liveRegion.textContent = `搜索 ${state.query}，匹配 ${cards} 篇`;
      liveRegion.classList.add("is-active");
      window.clearTimeout(window.__searchPulseTimer);
      window.__searchPulseTimer = window.setTimeout(() => {
        liveRegion.classList.remove("is-active");
      }, 1400);
    }
  }

  document.addEventListener("input", (event) => {
    if (!event.target.matches("[data-search]")) return;
    if (event.isComposing) return;
    applySearchFilter(event.target);
  });

  document.addEventListener("compositionend", (event) => {
    if (!event.target.matches?.("[data-search]")) return;
    applySearchFilter(event.target);
  });

  function initKonami() {
    const seq = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
    let pos = 0;
    document.addEventListener("keydown", (event) => {
      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
      if (key !== seq[pos]) {
        pos = key === seq[0] ? 1 : 0;
        return;
      }
      pos++;
      if (pos === seq.length) {
        pos = 0;
        triggerKonamiBurst();
      }
    });
  }

  function triggerKonamiBurst() {
    if (prefersReducedMotion()) return;
    root.classList.add("is-party");
    const symbols = SPARK_PALETTE.concat(SPARK_PALETTE);
    for (let i = 0; i < 40; i++) {
      const x = Math.random() * window.innerWidth;
      const y = window.innerHeight + 20;
      const spark = document.createElement("span");
      spark.className = "cursor-spark konami-spark";
      spark.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      spark.style.left = `${x}px`;
      spark.style.top = `${y}px`;
      spark.style.setProperty("--spark-x", `${(Math.random() - 0.5) * 120}px`);
      spark.style.setProperty("--spark-y", `${-window.innerHeight * (0.6 + Math.random() * 0.4)}px`);
      spark.style.setProperty("--spark-rotate", `${(Math.random() - 0.5) * 320}deg`);
      spark.style.animationDuration = `${1.6 + Math.random() * 1.2}s`;
      cursorFxLayer = cursorFxLayer || document.querySelector(".cursor-fx-layer");
      if (!cursorFxLayer) return;
      cursorFxLayer.appendChild(spark);
      window.setTimeout(() => spark.remove(), 3200);
    }
    window.setTimeout(() => root.classList.remove("is-party"), 3600);
  }

  function initCounters() {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const counters = document.querySelectorAll("[data-counter]");
    if (!counters.length) return;
    if (reduceMotion) {
      counters.forEach((el) => {
        el.textContent = el.dataset.counter;
      });
      return;
    }
    const easeOut = (t) => 1 - Math.pow(1 - t, 3);
    const animate = (el) => {
      const target = parseInt(el.dataset.counter, 10) || 0;
      if (target === 0) { el.textContent = "0"; return; }
      const duration = 900 + Math.min(target, 20) * 30;
      const start = performance.now();
      const step = (now) => {
        const t = Math.min(1, (now - start) / duration);
        el.textContent = String(Math.round(target * easeOut(t)));
        if (t < 1) requestAnimationFrame(step);
        else el.textContent = String(target);
      };
      requestAnimationFrame(step);
    };
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animate(entry.target);
        io.unobserve(entry.target);
      });
    }, { threshold: 0.4 });
    counters.forEach((el) => io.observe(el));
  }

  function syncKbdHint() {
    const isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent || "");
    document.querySelectorAll("[data-kbd-hint]").forEach((el) => {
      el.textContent = isMac ? "⌘K" : "Ctrl K";
    });
  }

  function initFooterClock() {
    const node = document.querySelector("[data-footer-clock]");
    if (!node) return;
    const update = () => {
      const d = new Date();
      const pad = (n) => String(n).padStart(2, "0");
      node.textContent = `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())} · ${pad(d.getHours())}:${pad(d.getMinutes())}`;
    };
    update();
    window.setInterval(update, 30000);
  }

  function initMagnetic() {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    if (reduceMotion || !finePointer) return;
    document.addEventListener("pointermove", (event) => {
      const targets = document.querySelectorAll("[data-magnetic]");
      if (!targets.length) return;
      targets.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (event.clientX < rect.left - 80 || event.clientX > rect.right + 80 ||
            event.clientY < rect.top - 80 || event.clientY > rect.bottom + 80) {
          if (el.dataset.magneticActive === "1") {
            el.dataset.magneticActive = "0";
            el.style.transform = "";
          }
          return;
        }
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (event.clientX - cx) * 0.22;
        const dy = (event.clientY - cy) * 0.28;
        el.dataset.magneticActive = "1";
        el.style.transform = `translate(${dx.toFixed(2)}px, ${dy.toFixed(2)}px)`;
      });
    }, { passive: true });
    document.addEventListener("pointerleave", () => {
      document.querySelectorAll("[data-magnetic]").forEach((el) => {
        el.dataset.magneticActive = "0";
        el.style.transform = "";
      });
    }, { passive: true });
  }

  function initReadingProgress() {
    // .page-progress：页面级滚动指示条（.reading-progress 已被阅读书架
    // 卡片占用，同名会让 fixed/opacity 规则把卡片进度条拽到视口顶部藏掉）。
    let bar = document.querySelector(".page-progress");
    if (!bar) {
      bar = document.createElement("div");
      bar.className = "page-progress";
      bar.setAttribute("aria-hidden", "true");
      bar.innerHTML = "<span class='page-progress-fill'></span>";
      document.body.appendChild(bar);
    }
    const fill = bar.querySelector(".page-progress-fill");
    const update = () => {
      const article = document.querySelector(".article-body");
      if (!article) {
        bar.classList.remove("is-visible");
        return;
      }
      const rect = article.getBoundingClientRect();
      const articleTopAbs = rect.top + window.scrollY;
      const articleBottomAbs = articleTopAbs + rect.height;
      const scrollableStart = articleTopAbs;
      const scrollableEnd = Math.max(scrollableStart + 1, articleBottomAbs - window.innerHeight);
      const progress = Math.min(1, Math.max(0, (window.scrollY - scrollableStart) / (scrollableEnd - scrollableStart)));
      bar.classList.toggle("is-visible", window.scrollY > scrollableStart + 80);
      fill.style.transform = `scaleX(${progress.toFixed(4)})`;
    };
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("hashchange", () => requestAnimationFrame(update));
  }

  window.addEventListener("motion-libs-ready", () => {
    initLenis();
    initMotionEnhancements();
  });
  window.addEventListener("hashchange", render);
  window.addEventListener("popstate", render);
  window.addEventListener("scroll", updateScrollState, { passive: true });
  window.addEventListener("visibilitychange", () => {
    if (document.hidden) cursorFxLayer?.classList.remove("is-active");
  });

  function initGreeting() {
    if (document.querySelector(".beid-greeting")) return;
    const node = document.createElement("aside");
    node.className = "beid-greeting";
    node.setAttribute("aria-hidden", "true");
    const hour = new Date().getHours();
    const text = hour < 5 ? "夜深了，beid 还亮着一盏灯" : hour < 11 ? "早安，今天也是好天气" : hour < 14 ? "午安，喝口水再继续" : hour < 18 ? "下午好，慢慢翻一页" : hour < 22 ? "晚上好，欢迎来小站坐坐" : "夜安，星星和代码都在";
    node.innerHTML = `<span class="greeting-dot"></span><span>${esc(text)}</span>`;
    document.body.appendChild(node);
    requestAnimationFrame(() => node.classList.add("is-active"));
    let hideTimer;
    const flash = () => {
      node.classList.add("is-active");
      window.clearTimeout(hideTimer);
      hideTimer = window.setTimeout(() => node.classList.remove("is-active"), 2600);
    };
    setTimeout(flash, 1200);
    document.addEventListener("scroll", () => {
      if (window.scrollY < 60) {
        node.classList.add("is-active");
        window.clearTimeout(hideTimer);
      }
    }, { passive: true });
    document.addEventListener("pointermove", (event) => {
      if (event.clientY < 90 && !document.querySelector(".nav-links.is-open")) flash();
    }, { passive: true });
  }

  initTheme();
  initCursorFx();
  initGreeting();
  initKonami();
  initMagnetic();
  initReadingProgress();
  initFooterClock();
  render();
})();
