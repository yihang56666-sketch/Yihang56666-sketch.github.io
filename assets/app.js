(function () {
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
      title: "Codex Native Subagent Orchestrator Skill",
      slug: "codex-native-subagent-orchestrator-skill",
      date: "2026-08-14",
      updated: "2026-08-14",
      category: "Project Notes",
      tags: ["Codex", "AI agents", "Skills", "orchestration"],
      cover: covers.projectMagent,
      summary: "A general-purpose Codex Skill for deciding when to delegate, selecting bounded read-only roles, recovering from failures, and synthesizing native subagent results.",
      note: "Native subagents provide the execution engine. This Skill provides the operating discipline around that engine.",
      sections: [
        {
          heading: "What changed",
          paragraphs: [
            "The repository is now a GitHub-distributed Skill rather than a standalone agent runtime. It uses Codex native spawn_agent, so there is no custom CLI, model API dependency, dashboard, or telemetry layer.",
            "The Skill keeps the main agent as the only writer, verifier, and user-facing owner. Delegated roles return evidence and recommendations in a bounded packet."
          ]
        },
        {
          heading: "Why it helps",
          bullets: [
            "Small tasks stay local instead of paying the coordination cost of unnecessary delegation.",
            "Larger tasks get a 1-3 agent team with explicit roles, scope, evidence, and stop conditions.",
            "Shared-worktree checks protect pre-existing changes and keep read-only delegation honest.",
            "Timeouts and failed agents have bounded recovery instead of indefinite waiting.",
            "The main agent verifies the repository state and synthesizes conflicting findings before completion."
          ]
        },
        {
          heading: "Read the source",
          paragraphs: [
            "The complete Skill, routing rubric, role catalog, dispatch contract, workflow patterns, examples, and contract tests are available in the GitHub repository."
          ],
          links: [
            { label: "GitHub repository", href: "https://github.com/yihang56666-sketch/magent" }
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
      tags: ["改版", "设计", "博客", "白发少女"],
      cover: covers.postRedesign,
      summary: "这次给博客换上更轻盈的动漫封面：封面、动效、入口和移动端节奏。",
      note: "重点不是把页面堆满，而是让第一屏更像一个好逛的小站。",
      legacyPaths: ["/posts/white-anime-blog-redesign/"],
      sections: [
        {
          heading: "封面先建立气质",
          paragraphs: [
            "首页第一屏承担的是站点封面，而不是功能列表。现在的方向是白底、大标题、轻网格、白发少女角色卡和少量漂浮标签，让访客一眼知道这里是个人博客，同时保留一点动漫感。",
            "动态的尺度要克制：角色轻微呼吸、封面卡片漂浮、光扫过卡面即可。太多闪烁会抢走文字，太安静又不像一个活的站点。"
          ]
        },
        {
          heading: "内容入口要像博客",
          paragraphs: [
            "成熟博客至少需要精选文章、最近更新、归档、标签、分类、阅读清单和关于页。它们不一定复杂，但每个入口都要能解释自己为什么存在。",
            "这次继续沿用 assets/app.js 里的数据模型，文章直接作为结构化对象维护，适合静态托管，也方便后面再迁移到 Markdown 或 CMS。"
          ],
          bullets: [
            "首页负责展示封面故事、精选文章和专题。",
            "归档负责按月份追踪写作节奏。",
            "标签和分类负责把同一主题串起来。",
            "阅读页负责存放正在消化的书、课程和资料。"
          ]
        },
        {
          heading: "下一轮可以继续补什么",
          paragraphs: [
            "如果后续内容越来越多，可以再加入全文搜索索引、文章系列页、RSS 摘要、图片封面生成流程和更完整的站点地图。现在先把视觉和信息架构做稳。"
          ],
          note: "成熟感来自稳定的结构，不来自一次性塞满所有功能。"
        }
      ]
    },
    {
      title: "把项目复盘写成可读的故事",
      slug: "project-notes-as-stories",
      date: "2026-06-29",
      updated: "2026-07-02",
      category: "项目复盘",
      tags: ["项目", "复盘", "写作"],
      cover: covers.postStories,
      summary: "项目页不只是成果展示，也应该解释动机、约束、关键选择和踩坑后的判断。",
      note: "好的复盘像路线图，能让几个月后的自己快速回到现场。",
      sections: [
        {
          heading: "先写问题，再写结果",
          paragraphs: [
            "项目复盘最容易写成清单，但真正有价值的是问题背景。为什么要做这个东西，原来的办法哪里不舒服，限制条件是什么，这些比最后做了几个功能更重要。",
            "读者通常不是来背参数的，而是想理解你如何判断。把选择写清楚，项目就会从展示品变成经验。"
          ]
        },
        {
          heading: "保留中间态",
          paragraphs: [
            "成熟的博客不怕出现半成品记录。阶段性截图、命令片段、失败路线和后续计划，会让复盘更可信，也更像一个长期维护的工作台。"
          ],
          bullets: [
            "每个项目保留状态、更新时间和下一步。",
            "把复杂细节折进文章正文，不挤在卡片里。",
            "让项目卡只回答：这是什么、为什么值得点开、现在到哪一步。"
          ]
        }
      ]
    },
    {
      title: "我的阅读缓存整理法",
      slug: "reading-cache-method",
      date: "2026-06-18",
      updated: "2026-06-24",
      category: "阅读笔记",
      tags: ["阅读", "知识管理", "笔记"],
      cover: covers.postCache,
      summary: "把书单、课程、长文和资料变成可复用的阅读缓存，而不是散落在收藏夹里的链接。",
      note: "阅读页的目标不是炫书单，是帮助自己重新进入一个主题。",
      sections: [
        {
          heading: "每条阅读记录只保留四件事",
          paragraphs: [
            "标题、主题、进度和下一步足够支撑日常回看。太多字段会让维护成本升高，最后变成另一个没人整理的仓库。",
            "读完以后再补核心观点、关联文章和实践动作。这样阅读笔记会自然长成站内内容，而不是停在打卡。"
          ]
        },
        {
          heading: "把资料连回文章",
          paragraphs: [
            "阅读缓存最好能和文章标签互相连接。比如设计系统相关资料，可以连接到博客改版日志；工程维护资料，可以连接到静态站清单。"
          ]
        }
      ]
    },
    {
      title: "个人知识库的标签粒度",
      slug: "personal-tags-granularity",
      date: "2026-05-30",
      updated: "2026-06-08",
      category: "知识管理",
      tags: ["标签", "归档", "知识管理"],
      cover: covers.postTags,
      summary: "标签太细会失控，太粗会失去导航价值。个人博客更适合一组稳定的大标签加少量临时标签。",
      note: "标签不是装饰，它应该帮读者和未来的自己少走两步。",
      sections: [
        {
          heading: "先从主题而不是技术名词开始",
          paragraphs: [
            "博客标签应该优先服务阅读路径。比如「改版」「复盘」「阅读」比某个非常细的实现词更稳定，因为它们能解释内容的用途。",
            "技术名词也可以存在，但更适合作为第二层线索。等文章数量变多，再决定哪些词值得升级为分类。"
          ]
        },
        {
          heading: "定期合并标签",
          paragraphs: [
            "每隔一段时间看一次标签云，合并只出现一次且语义接近的标签。这个动作会让归档越来越清楚，也能反过来提醒自己最近真正关注什么。"
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
      tags: ["静态站", "GitHub Pages", "前端", "维护"],
      cover: covers.postChecklist,
      summary: "没有框架和构建步骤也能做成熟博客，但需要固定一些维护习惯：路由、元信息、无障碍和移动端检查。",
      note: "越轻的架构，越要靠清单守住质量。",
      sections: [
        {
          heading: "静态站也需要产品意识",
          paragraphs: [
            "页面能打开只是第一步。标题、描述、文章结构、404 回退、移动端导航和图片加载，都决定了它是不是一个能长期使用的博客。",
            "当前站点用 hash 路由保证 GitHub Pages 上的路径兼容，这让部署简单，也让内容迁移成本更低。"
          ]
        },
        {
          heading: "每次改版后的检查项",
          bullets: [
            "跑一次 JavaScript 语法检查。",
            "打开首页、文章页、归档页和关于页。",
            "截桌面与移动端图，确认文字没有重叠。",
            "检查主题切换、复制按钮、移动导航和搜索框。"
          ]
        }
      ]
    },
    {
      title: "深夜界面调光记录",
      slug: "late-night-interface-lighting",
      date: "2026-04-27",
      updated: "2026-05-01",
      category: "视觉实验",
      tags: ["动效", "视觉", "界面"],
      cover: covers.postNight,
      summary: "浅色页面也可以有层次：用阴影、线框、微弱色块和缓慢动画，而不是把背景染成单一颜色。",
      note: "一切动态都应该让页面更轻，而不是让读者更累。",
      sections: [
        {
          heading: "浅色不等于空",
          paragraphs: [
            "白色界面的成熟感来自对比关系：纯白、淡灰、墨色文字、少量强调色和稳定的间距。只要层级清楚，页面不需要很重的背景。",
            "动漫角色可以作为视觉锚点，但最好用在封面、页头和少数装饰位置，不要变成每个模块都在抢镜。"
          ]
        },
        {
          heading: "动效保持同一种语气",
          paragraphs: [
            "漂浮、呼吸、扫光和轻微视差属于同一种柔和动效语言。统一之后，页面会显得更成熟，而不是像拼贴。"
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
      desc: "一个本地优先的 Android 个人节律与效率应用，包含今日、任务、习惯、笔记、倒计时和专注计时，并支持保存自定义全屏背景。",
      tags: ["Android", "Capacitor", "React", "效率"],
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
        { label: "测试", value: "9" }
      ],
      detail: [
        {
          heading: "移动端工作台",
          paragraphs: ["RIXIA 把一天的节律、待办、习惯和专注时间收进一个轻量的手机工作台，数据默认保存在设备本地。"]
        },
        {
          heading: "可按自己的方式使用",
          bullets: ["设置页可上传并持久化自定义全屏背景。", "Android 桌面图标使用彩色菱形品牌图标。", "项目源码和调试 APK 均公开在 GitHub。"]
        }
      ]
    },
    {
      title: "Codex Native Subagent Orchestrator Skill",
      slug: "codex-native-subagent-orchestrator-skill",
      desc: "A general-purpose Skill that helps Codex decide when to delegate, generate temporary specialist roles, keep subagents read-only, recover from failures, and synthesize verified results using native spawn_agent.",
      tags: ["codex", "skills", "subagents", "orchestration", "read-only"],
      cover: covers.projectMagent,
      status: "Published · GitHub",
      updated: "08/14",
      links: {
        github: "https://github.com/yihang56666-sketch/magent",
        docs: "#/posts/codex-native-subagent-orchestrator-skill"
      },
      stats: [
        { label: "Default team", value: "1-3" },
        { label: "Native engine", value: "spawn_agent" },
        { label: "Write owner", value: "Main" },
        { label: "Contract tests", value: "19" }
      ],
      detail: [
        {
          heading: "Core boundary",
          paragraphs: [
            "Codex native subagents execute delegated work. This Skill decides whether delegation is worth the coordination cost, assigns a bounded role, checks the shared worktree, and owns final verification and synthesis."
          ]
        },
        {
          heading: "Designed for reuse",
          bullets: [
            "Built-in roles cover exploration, implementation review, testing, security, and documentation.",
            "Temporary specialists can be generated for domain-specific tasks.",
            "The recovery contract handles missing, failed, or timed-out results without hanging the task.",
            "The repository ships examples and dependency-free contract tests."
          ]
        }
      ]
    },
    {
      title: "Codex 多智能体编排框架",
      slug: "codex-multi-agent",
      desc: "一个纯本地运行的 AI 多智能体协作系统，不依赖任何外部 LLM API。通过 26 个领域专家身份库、12 种协作模式和 7 种预定义工作流，将复杂任务自动拆解、路由到最适合的 specialist 智能体，并在 Codex 会话中以手动编排的方式逐个执行、同步、合并产出。",
      tags: ["ai-agents", "orchestration", "codex", "python", "cli"],
      cover: covers.projectMagent,
      status: "已发布 · v1.2.0",
      updated: "06/25",
      links: {
        github: "https://github.com/yihang56666-sketch/magent",
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
      time: "07/05",
      type: "redesign",
      title: "首页封面升级",
      body: "动漫封面、精选文章和专题入口已经合并到首页。"
    },
    {
      time: "07/04",
      type: "writing",
      title: "文章书架补齐",
      body: "新增站点手记、项目复盘、阅读笔记、知识管理和工程记录等内容样例。"
    },
    {
      time: "06/25",
      type: "project",
      title: "Codex 多智能体编排框架",
      body: "首个项目卡上架。26 个领域身份、12 种协作模式、纯本地运行、零外部服务依赖。"
    }
  ];
  const archiveNotes = {
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
        <div class="page-title-console" aria-hidden="true">
          <span>Blog · ${esc(eyebrow || "home")}</span>
          <b>Read</b>
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
          <div class="maikire-hero-shade" aria-hidden="true"></div>
          <div class="maikire-meteors" aria-hidden="true">
            <span style="--x: 9%; --y: 8%; --d: 0s; --s: 1;"></span>
            <span style="--x: 28%; --y: 16%; --d: -2.8s; --s: 0.72;"></span>
            <span style="--x: 47%; --y: 7%; --d: -5.6s; --s: 0.9;"></span>
            <span style="--x: 66%; --y: 22%; --d: -8.4s; --s: 0.66;"></span>
            <span style="--x: 82%; --y: 12%; --d: -11.2s; --s: 0.84;"></span>
            <span style="--x: 93%; --y: 30%; --d: -14s; --s: 0.58;"></span>
          </div>
          <div class="maikire-float-windows" aria-hidden="true">
            <div class="maikire-float-window float-window-one">
              <span>mood</span>
              <strong><i data-lucide="sparkles"></i></strong>
              <small>kirakira</small>
            </div>
            <div class="maikire-float-window float-window-two">
              <span>hello</span>
              <strong><i data-lucide="cat"></i></strong>
              <small>nyan</small>
            </div>
            <div class="maikire-float-window float-window-three">
              <span>spark</span>
              <strong><i data-lucide="wand-sparkles"></i></strong>
              <small>lucky</small>
            </div>
          </div>
          <div class="maikire-live-stickers" aria-hidden="true">
            <span class="live-sticker live-sticker-one"><i data-lucide="heart"></i></span>
            <span class="live-sticker live-sticker-two"><i data-lucide="star"></i></span>
            <span class="live-sticker live-sticker-three"><i data-lucide="music"></i></span>
            <span class="live-sticker live-sticker-four"><i data-lucide="sparkle"></i></span>
          </div>
          <div class="maikire-petals" aria-hidden="true">
            <span></span><span></span><span></span><span></span><span></span>
            <span></span><span></span><span></span><span></span><span></span>
          </div>
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
          <div class="maikire-wave" aria-hidden="true">
            <span></span>
            <span></span>
          </div>
        </section>

        <section class="maikire-content" id="blog-home" aria-label="博客主页">
          <div class="maikire-content-float" aria-hidden="true">
            <span>♡</span>
            <span>✦</span>
            <span>♪</span>
          </div>
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
                  <input type="search" placeholder="搜索文章、标签、分类..." value="${esc(state.query)}" data-search>
                  <span class="kbd-hint">/</span>
                </label>
                <a class="pill-button" href="#/archive"><i data-lucide="archive"></i>时间线</a>
              </div>
              <div class="maikire-article-list">
                ${articleList.length ? articleList.map(maikireArticleCard).join("") : '<div class="empty-state">没有匹配的文章，可以换个关键词试试。</div>'}
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
        <div class="maikire-profile-stats">
          <span><b>${posts.length}</b>文章</span>
          <span><b>${getAllCategories().length}</b>分类</span>
          <span><b>${getAllTags().length}</b>标签</span>
        </div>
        <div class="maikire-socials" aria-label="社交链接">
          <a href="${site.github}" target="_blank" rel="noreferrer" aria-label="GitHub"><i data-lucide="code-2"></i></a>
          <a href="#/reading" aria-label="阅读"><i data-lucide="book-heart"></i></a>
          <a href="#/links" aria-label="链接"><i data-lucide="mail"></i></a>
        </div>
      </section>
    `;
  }

  function readingCard(item, compact = false) {
    const progressValue = Number.parseFloat(item.progress);
    const progress = Number.isFinite(progressValue) ? `${Math.min(100, Math.max(0, progressValue))}%` : "100%";
    return `
      <article class="reading-card${compact ? " is-compact" : ""}" style="--cover: ${item.cover}; --progress: ${progress}">
        <div class="reading-cover" aria-hidden="true"></div>
        <div>
          <div class="reading-card-top">
            <span>${esc(item.topic)}</span>
            <strong>${esc(item.status)}</strong>
          </div>
          <h3>${esc(item.title)}</h3>
          <p>${esc(item.desc)}</p>
          <div class="reading-progress" aria-label="阅读进度 ${esc(item.progress)}">
            <span></span>
            <b>${esc(item.progress)}</b>
          </div>
          <div class="tag-row">${tagChips(item.tags)}</div>
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
          : '<div class="empty-state">暂无文章。新的日志写入后，会按时间顺序显示在这个书架。</div>'}
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
                    <div class="tag-row">${tagChips(project.tags)}</div>
                    ${project.links?.github ? `<a class="pill-button" href="${esc(project.links.github)}" target="_blank" rel="noreferrer"><i data-lucide="code-2"></i>GitHub</a>` : ""}
                    ${project.links?.download ? `<a class="pill-button primary" href="${esc(project.links.download)}" download><i data-lucide="download"></i>下载 APK</a>` : ""}
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
        : `${site.origin}/#/${route.view === "home" ? "" : page.path || route.view}`;
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


      if (window.lucide) {
        window.lucide.createIcons();
      }
      syncThemeControl();
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
    spark.textContent = ["✦", "♡", "✧", "♪"][Math.floor(Math.random() * 4)];
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
    document.querySelector(".back-top")?.classList.toggle("is-visible", window.scrollY > 520);
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

  document.addEventListener("input", (event) => {
    if (!event.target.matches("[data-search]")) return;
    state.query = event.target.value;
    renderHomeMaikire();
    afterRender({ view: "home" });
    const next = document.querySelector("[data-search]");
    if (next && next !== event.target) {
      next.focus();
      next.setSelectionRange(next.value.length, next.value.length);
    }
  });

  window.addEventListener("motion-libs-ready", () => {
    initLenis();
    initMotionEnhancements();
  });
  window.addEventListener("hashchange", render);
  window.addEventListener("popstate", render);
  window.addEventListener("scroll", updateScrollState, { passive: true });

  initTheme();
  initCursorFx();
  render();
})();
