(function () {
  const site = {
    name: "beid",
    title: "beid 的夜城技术手账",
    description: "beid 的个人博客，记录嵌入式、计算机视觉、AI 工具、项目复盘和一点夜城风格的碎碎念。",
    author: "beid",
    origin: "https://yihang56666-sketch.github.io",
    github: "https://github.com/Yihang56666-sketch"
  };

  const root = document.documentElement;
  const main = document.getElementById("main");
  const nav = document.querySelector("[data-nav]");
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

  const posts = [
    {
      slug: "drug-cart",
      title: "电赛送药小车控制系统",
      date: "2026-05-27",
      updated: "2026-05-27",
      category: "项目复盘",
      tags: ["C2000", "PID", "RFID", "视觉", "嵌入式"],
      cover: covers.robot,
      legacyPaths: ["/2026/05/27/电赛送药小车控制系统/"],
      summary: "C2000 固件、循线控制、RFID 站点识别、视觉协议和 Python 调参工具的工程复盘。",
      sections: [
        {
          heading: "项目目标",
          paragraphs: [
            "这篇文章把电赛送药小车从“能跑”重新整理成“能讲清楚”的工程记录。重点不只是硬件小车本身，而是控制闭环、站点识别、视觉辅助和调试工具如何组成一个稳定系统。",
            "新版博客把它放在主项目位，因为它最能体现嵌入式项目的完整链路：传感器输入、控制策略、状态机、上位机调参和现场复盘。"
          ]
        },
        {
          heading: "模块拆分",
          bullets: [
            "底盘控制：循线输入、速度环、转向补偿和 PID 参数记录。",
            "站点识别：RFID 数据读取、去抖、站点状态切换和异常兜底。",
            "视觉协议：把上位视觉结果压缩成 MCU 侧能稳定消费的串口帧。",
            "工具链：用 Python 调参脚本记录参数组合、现象和下一轮试验结论。"
          ]
        },
        {
          heading: "工程复盘",
          paragraphs: [
            "真正困难的地方往往不是单个算法，而是现场条件一变，所有模块同时暴露边界。循线丢失、RFID 重读、视觉延迟、串口抖动都会互相放大。",
            "后续文章适合补两类内容：一类是具体代码结构，一类是现场调试日志。这样博客会从项目介绍变成真正能复盘、能被别人参考的工程文档。"
          ],
          code: "state = read_line_sensor();\nstation = rfid_poll();\nvision = uart_receive_frame();\n\nif (station.changed) {\n  planner_enter_station(station.id);\n}\ncontroller_update(state, vision.offset);"
        }
      ]
    },
    {
      slug: "embedded-report-automation",
      title: "嵌入式实验报告自动整理",
      date: "2026-05-27",
      updated: "2026-05-27",
      category: "项目复盘",
      tags: ["Python", "自动化", "文档整理", "嵌入式实验"],
      cover: covers.notebook,
      legacyPaths: ["/2026/05/27/嵌入式实验报告自动整理/"],
      summary: "把实验报告、课堂笔记、生成脚本和最终清单串成可重复的文档生产流程。",
      sections: [
        {
          heading: "为什么要自动化",
          paragraphs: [
            "嵌入式实验报告里重复劳动很多：目录、图表编号、实验步骤、代码片段、结果截图、格式检查。手工做一次还能忍，连续做就会消耗掉真正应该留给理解电路和代码的注意力。",
            "这个项目的价值不是炫技，而是把文档工作变成一条可检查的流水线。"
          ]
        },
        {
          heading: "流程结构",
          bullets: [
            "收集：按实验编号整理原始截图、代码片段和课堂笔记。",
            "生成：脚本把 Markdown 或模板数据写入正式报告结构。",
            "核对：扫描残留占位符、空标题、图片缺失和格式不一致。",
            "导出：生成 WPS 兼容版本和最终提交版本。"
          ]
        },
        {
          heading: "下一步优化",
          paragraphs: [
            "后续可以把这个流程抽象成“实验报告 CLI”：输入实验编号，自动给出缺失项、生成报告并打开预览。博客里则保留输入、输出、检查结果三张关键图，让读者一眼看懂收益。"
          ]
        }
      ]
    },
    {
      slug: "music-workflow",
      title: "《海和过去和你》音乐创作流程",
      date: "2026-05-27",
      updated: "2026-05-27",
      category: "创作记录",
      tags: ["音乐创作", "MIDI", "AI 音乐", "工作流"],
      cover: covers.music,
      legacyPaths: ["/2026/05/27/海和过去和你音乐创作流程/"],
      summary: "从歌词、beat notes、MIDI、stems 到 demo 的音乐项目整理方式。",
      sections: [
        {
          heading: "从灵感到工程文件",
          paragraphs: [
            "这类内容适合放进博客，是因为它和技术项目有同一种底层逻辑：灵感只是起点，真正让作品留下来的是版本、素材、结构和复盘。",
            "《海和过去和你》可以按歌词动机、和声走向、MIDI 草稿、音色选择、混音记录和 demo 版本来展示。"
          ]
        },
        {
          heading: "可公开的结构",
          bullets: [
            "主题：一句话说明这首歌要表达的情绪。",
            "素材：歌词片段、参考音色、MIDI 草稿和 stems。",
            "过程：哪些段落保留，哪些段落推翻，为什么。",
            "结果：demo、封面方向和下一版修正点。"
          ]
        }
      ]
    },
    {
      slug: "chip-skill-toolkit",
      title: "嵌入式 Chip-Skill 工具集开发",
      date: "2026-04-29",
      updated: "2026-05-26",
      category: "技术折腾",
      tags: ["MCP", "AI 工具", "嵌入式"],
      cover: covers.code,
      legacyPaths: ["/2026/04/29/嵌入式Chip-Skill工具集开发/"],
      summary: "把芯片资料、板卡分析和调试流程做成 AI 可调用的工具能力。",
      sections: [
        {
          heading: "问题定义",
          paragraphs: [
            "嵌入式资料经常散在数据手册、参考手册、例程、论坛和工程目录里。Chip-Skill 的核心目标，是把这些资料变成可被 AI 稳定调用的工作流。",
            "它不应该只是知识库问答，而应该能回答：当前板子是什么芯片、有哪些接口、工程怎么编译、怎么烧录、怎么观察日志。"
          ]
        },
        {
          heading: "工具边界",
          bullets: [
            "资料侧：芯片型号、外设寄存器、引脚复用和参考链接。",
            "工程侧：识别 Keil、CMake、GCC、OpenOCD、J-Link 等工具链。",
            "调试侧：串口、CAN、网络抓包和 RTT 日志观察。",
            "安全侧：外部动作默认只读，烧录和远程修改必须明确确认。"
          ]
        },
        {
          heading: "博客呈现建议",
          paragraphs: [
            "文章里可以放一个完整案例：从识别工程，到构建，再到烧录和读取日志。读者不需要看到所有内部细节，但要看到这个工具为什么能减少重复查资料的时间。"
          ]
        }
      ]
    },
    {
      slug: "openmv-rope-inspection",
      title: "OpenMV 绳驱巡检装置视觉系统",
      date: "2026-04-29",
      updated: "2026-05-26",
      category: "技术折腾",
      tags: ["OpenMV", "STM32", "视觉", "嵌入式"],
      cover: covers.circuits,
      legacyPaths: ["/2026/04/29/OpenMV绳驱巡检装置视觉系统/"],
      summary: "橙色目标识别、视觉定位、火源检测、UART 协议和现场调试思路。",
      sections: [
        {
          heading: "系统定位",
          paragraphs: [
            "OpenMV 负责把复杂图像降维成 MCU 能处理的少量数据：目标是否存在、目标中心偏移、置信程度和异常标记。",
            "绳驱巡检装置的重点是稳定性。视觉算法不需要花哨，但需要在光照变化和运动抖动下给出一致结果。"
          ]
        },
        {
          heading: "视觉链路",
          bullets: [
            "颜色阈值锁定橙色目标，减少背景干扰。",
            "ROI 限制检测区域，提升帧率并降低误检。",
            "形态学处理过滤噪点。",
            "UART 输出结构化帧，供 STM32 状态机消费。"
          ]
        },
        {
          heading: "调试心得",
          paragraphs: [
            "现场调 OpenMV 最忌只看屏幕效果。更可靠的做法是把阈值、帧率、识别面积、串口输出都记录下来，让视觉结果和 MCU 行为能够对上。"
          ]
        }
      ]
    },
    {
      slug: "image-stitching",
      title: "图像特征提取与全景拼接实践",
      date: "2026-04-29",
      updated: "2026-05-26",
      category: "技术折腾",
      tags: ["OpenCV", "图像拼接", "计算机视觉"],
      cover: covers.water,
      legacyPaths: ["/2026/04/29/图像特征提取与全景拼接实践/"],
      summary: "围绕特征点、匹配、单应性矩阵和图像融合整理一次 OpenCV 拼接练习。",
      sections: [
        {
          heading: "核心链路",
          paragraphs: [
            "全景拼接是计算机视觉里很适合作为阶段练习的项目：它把特征提取、匹配、几何变换和图像融合都串在一起。",
            "博客里可以把最终效果图放在前面，再拆解每一步为什么会失败，以及怎么判断失败来自匹配还是来自变换。"
          ]
        },
        {
          heading: "工程步骤",
          bullets: [
            "提取局部特征点并计算描述子。",
            "用匹配器寻找候选对应点。",
            "用 RANSAC 估计单应性矩阵，剔除离群匹配。",
            "透视变换后做边界裁剪和亮度融合。"
          ],
          code: "features_a = detector.detectAndCompute(image_a, None)\nfeatures_b = detector.detectAndCompute(image_b, None)\nmatches = matcher.knnMatch(features_a.desc, features_b.desc, k=2)\nH = cv2.findHomography(points_a, points_b, cv2.RANSAC)"
        }
      ]
    },
    {
      slug: "yolov8-water-distance",
      title: "项目复盘：基于 YOLOv8 的水面障碍物检测与测距系统",
      date: "2026-03-03",
      updated: "2026-05-26",
      category: "技术折腾",
      tags: ["计算机视觉", "YOLOv8", "PyQt6"],
      cover: covers.water,
      legacyPaths: [
        "/2026/03/03/项目复盘：基于YOLOv8的水面障碍物检测与测距系统/",
        "/2026/03/03/基于YOLOv8的水面障碍物检测与测距系统/"
      ],
      summary: "复杂水面环境下的目标检测、单目测距、多线程界面和实时预警。",
      sections: [
        {
          heading: "项目背景",
          paragraphs: [
            "这是一个针对复杂水面环境的障碍物检测与预警系统。水面环境和普通道路不同，波浪反光、视角晃动、小目标尺度变化都会考验算法的抗干扰能力。",
            "方案选择用 YOLOv8 做目标检测，再叠加单目测距和 PyQt6 可视化，让系统不但能“看见”，还能判断距离并给出预警。"
          ]
        },
        {
          heading: "技术栈速览",
          bullets: [
            "核心算法：YOLOv8，配合 Mosaic 数据增强和 C2f 特征提取。",
            "开发框架：Python 3.9、PyTorch 2.1、OpenCV 4.8。",
            "界面：PyQt6，多线程生产者消费者模式。",
            "硬件：NVIDIA RTX 4060，CUDA 12.1。"
          ]
        },
        {
          heading: "单目测距",
          paragraphs: [
            "只画检测框还不够，我希望系统知道障碍物离我有多远。由于没有激光雷达，方案采用单目针孔成像模型，把相机高度、焦距等参数合并成标定系数。",
            "基于透视投影，物体越近在画面中越靠下，越远越接近地平线。经过水边反复标定，K 取 5000 时误差最小。"
          ],
          code: "distance = (K * y_diff) / max(1, y_bbox - v_horizon)"
        },
        {
          heading: "界面和预警",
          paragraphs: [
            "最初把视频读取、YOLO 推理和界面刷新塞在一个主线程里，UI 会直接假死。后来改成后台 QThread 跑采集和推理，主线程只接收 Signal 并刷新画面。",
            "系统设定 safe_limit = 5.0 米，一旦目标距离小于阈值，状态机在 30ms 内触发，画面由绿框变红并显示 WARN。"
          ]
        }
      ]
    },
    {
      slug: "first-blog-note",
      title: "终于折腾完这个博客了……",
      date: "2026-03-03",
      updated: "2026-03-03",
      category: "日常",
      tags: ["碎碎念", "Hexo", "博客"],
      cover: covers.notebook,
      legacyPaths: ["/2026/03/03/我的第一篇设计日记/"],
      summary: "从主题、背景图、404 到页面部署，把个人自留地一点点搭起来的第一篇记录。",
      sections: [
        {
          heading: "搭建原因",
          paragraphs: [
            "我想有个完全属于自己、干净清爽的地方放点东西，而不是受限于各大平台千篇一律的排版。",
            "中间踩了不少坑，比如背景图死活不出来、页面老是 404。看着主题一点点变成想要的模样，成就感还是挺满的。"
          ]
        },
        {
          heading: "以后这里放什么",
          bullets: [
            "比较好用的工具。",
            "嵌入式开发创新灵感。",
            "瞎折腾的日常记录。",
            "看番、打游戏和阶段性的碎碎念。"
          ],
          note: "这篇是博客开张时的第一盏灯，新版保留它，是为了让站点有自己的来路。"
        }
      ]
    },
    {
      slug: "hello-world",
      title: "Hello World",
      date: "2025-09-20",
      updated: "2026-03-03",
      category: "归档",
      tags: ["博客"],
      cover: covers.books,
      legacyPaths: ["/2025/09/20/hello-world/"],
      summary: "Hexo 初始化时留下的第一篇文章，现在作为旧站点启动记录归档。",
      sections: [
        {
          heading: "旧站启动记录",
          paragraphs: [
            "这是 Hexo 初始化生成的第一篇文章。它不再作为主内容展示，但适合作为博客迁移和版本演进的时间锚点。",
            "新版站点把它收进归档，提醒自己：复杂的个人站也是从一个 Hello World 开始的。"
          ]
        }
      ]
    }
  ].sort((a, b) => b.date.localeCompare(a.date));

  const projects = [
    {
      title: "电赛送药小车控制系统",
      desc: "底盘控制、RFID 站点识别、视觉协议和 Python 调参工具构成的完整嵌入式项目。",
      tags: ["C2000", "PID", "RFID", "UART"],
      post: "drug-cart",
      cover: covers.robot
    },
    {
      title: "水面障碍物检测与测距系统",
      desc: "YOLOv8、单目测距、PyQt6 多线程界面和预警策略的视觉工程实践。",
      tags: ["YOLOv8", "OpenCV", "PyQt6"],
      post: "yolov8-water-distance",
      cover: covers.water
    },
    {
      title: "Chip-Skill 嵌入式工具集",
      desc: "面向芯片资料、构建烧录和调试观察的 AI 工具链封装实验。",
      tags: ["MCP", "AI 工具", "嵌入式"],
      post: "chip-skill-toolkit",
      cover: covers.code
    }
  ];

  const pages = {
    home: { title: site.title, desc: site.description },
    archive: { title: "文章归档", desc: "按发布时间整理旧博客和新文章，像翻一本持续变厚的技术手账。" },
    projects: { title: "做过的东西", desc: "把能跑起来的项目留下封面、过程和复盘，之后还能接着改。" },
    reading: { title: "阅读与学习", desc: "嵌入式、视觉、AI 工具和阶段规划的资料入口，也放一点最近在看的东西。" },
    about: { title: "关于 beid", desc: "一个把项目、工具、灵感、踩坑和碎碎念认真收拾起来的个人博客。" },
    tags: { title: "标签", desc: "从主题词快速进入相关文章。" },
    categories: { title: "分类", desc: "按内容类型查看文章。" },
    links: { title: "链接", desc: "站点、仓库和后续 RSS 等公开入口。" },
    kaoyan: { title: "考研阵地", desc: "阶段计划、资料整理和复盘节奏。" }
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
  posts.forEach((post) => {
    post.legacyPaths.forEach((path) => {
      legacyLookup.set(normalizePath(path), post.slug);
      legacyLookup.set(normalizePath(`${path.replace(/\/$/, "")}/index.html`), post.slug);
    });
  });

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
      .replace(/[\s/]+/g, "-")
      .replace(/[^\u4e00-\u9fa5a-z0-9-]/g, "")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  }

  function formatDate(value) {
    return new Intl.DateTimeFormat("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }).format(new Date(`${value}T00:00:00`));
  }

  function plainText(post) {
    return post.sections
      .map((section) => [section.heading, ...(section.paragraphs || []), ...(section.bullets || []), section.note || ""].join(""))
      .join("");
  }

  function readingTime(post) {
    return Math.max(1, Math.round(plainText(post).length / 500));
  }

  function getAllTags() {
    return [...new Set(posts.flatMap((post) => post.tags))].sort((a, b) => a.localeCompare(b, "zh-CN"));
  }

  function getAllCategories() {
    return [...new Set(posts.map((post) => post.category))];
  }

  function postHref(post) {
    return `#/posts/${post.slug}`;
  }

  function tagChips(tags, alt) {
    return tags
      .map((tag) => `<a class="tag-chip ${alt ? "alt" : ""}" href="#/tags/${encodeURIComponent(tag)}">${esc(tag)}</a>`)
      .join("");
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

  function postCard(post) {
    return `
      <article class="post-card">
        <a class="post-visual" style="--cover: ${post.cover}" href="${postHref(post)}" aria-label="阅读：${esc(post.title)}"></a>
        <div>
          <div class="post-kicker">${formatDate(post.date)} · ${esc(post.category)}</div>
          <h3><a href="${postHref(post)}">${esc(post.title)}</a></h3>
          <p>${esc(post.summary)}</p>
          <div class="post-meta">
            <span>${readingTime(post)} 分钟</span>
            <a href="${postHref(post)}">阅读全文</a>
          </div>
          <div class="tag-row">${tagChips(post.tags)}</div>
        </div>
      </article>
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
              <h1>beid 的技术手账与夜城碎片。</h1>
              <p>这里是我的博客自留地：嵌入式、OpenMV、YOLOv8、AI 工具、自动化文档，还有一些写到凌晨才想明白的复盘。能跑起来的东西会留下封面，想明白的过程会写成文章。</p>
              <div class="intro-actions">
                <a class="pill-button primary" href="#/archive"><i data-lucide="book-open"></i>随便翻翻</a>
                <a class="pill-button" href="#/projects"><i data-lucide="cpu"></i>做过的东西</a>
                <a class="pill-button" href="#/about"><i data-lucide="user"></i>关于 beid</a>
              </div>
            </div>
            <aside class="focus-board">
              <div>
                <p class="eyebrow">now writing</p>
                <h2>最近在写</h2>
                <ul class="journal-list">
                  <li><time>05/27</time><span>把电赛送药小车的控制链路拆成能讲清楚的模块。</span></li>
                  <li><time>04/29</time><span>补 OpenMV 视觉系统的现场调试细节，别只留下结果图。</span></li>
                  <li><time>03/03</time><span>把 YOLOv8 水面检测项目从“做完了”写成真正的复盘。</span></li>
                </ul>
              </div>
              <div class="soft-quote">
                <span>站主小纸条</span>
                <p>写博客不是把东西摆整齐就完事，更重要的是留下当时怎么想、怎么错、怎么改。</p>
              </div>
            </aside>
          </section>

          <div class="section-heading">
            <div>
              <h2>最近写下的</h2>
              <span>${query ? `搜索：${esc(state.query)}` : "按时间慢慢往前翻"}</span>
            </div>
            <a class="pill-button" href="#/archive"><i data-lucide="archive"></i>归档</a>
          </div>
          <section class="post-list">
            ${featured.length ? featured.map(postCard).join("") : '<div class="empty-state">没有找到匹配文章。</div>'}
          </section>
        </div>

        <aside class="side-stack">
          <section class="side-panel">
            <div class="author-line">
              <span class="avatar avatar-image" aria-hidden="true"></span>
              <div>
                <h2>beid</h2>
                <p>嵌入式 + 边缘 AI 开发学习者。这里不是简历，更像一本持续增补的夜城项目手账。</p>
              </div>
            </div>
          </section>
          <section class="side-panel">
            <h2>搜索</h2>
            <label class="search-box">
              <i data-lucide="search"></i>
              <input type="search" placeholder="标题、标签、项目..." value="${esc(state.query)}" data-search>
            </label>
          </section>
          <section class="side-panel side-note">
            <h2>最近状态</h2>
            <p>白天拆项目，晚上补文档。想把每个“能跑了”的瞬间，都写成以后还能看懂的记录。</p>
          </section>
          <section class="side-panel">
            <h2>分类</h2>
            <div class="tag-cloud">${getAllCategories()
              .map((category) => `<a class="tag-chip" href="#/categories/${encodeURIComponent(category)}">${esc(category)}</a>`)
              .join("")}</div>
          </section>
          <section class="side-panel">
            <h2>标签</h2>
            <div class="tag-cloud">${tagChips(getAllTags(), true)}</div>
          </section>
        </aside>
      </div>
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
      desc = `共有 ${list.length} 篇文章使用这个标签。`;
      eyebrow = "tag";
    }

    if (filter?.category) {
      list = posts.filter((post) => post.category === filter.category);
      title = `分类：${filter.category}`;
      desc = `共有 ${list.length} 篇文章归入这个分类。`;
      eyebrow = "category";
    }

    main.innerHTML = `
      ${pageHeader(title, desc, eyebrow)}
      <section class="archive-list">
        ${list
          .map(
            (post) => `
              <article class="archive-row">
                <time datetime="${esc(post.date)}">${formatDate(post.date)}</time>
                <div>
                  <h2><a href="${postHref(post)}">${esc(post.title)}</a></h2>
                  <div class="post-meta"><span>${esc(post.category)}</span><span>${readingTime(post)} 分钟</span></div>
                </div>
                <div class="tag-row">${tagChips(post.tags.slice(0, 2))}</div>
              </article>
            `
          )
          .join("") || '<div class="empty-state">这里暂时没有文章。</div>'}
      </section>
    `;
  }

  function renderProjects() {
    main.innerHTML = `
      ${pageHeader(pages.projects.title, pages.projects.desc, "project notes")}
      <section class="project-grid">
        ${projects
          .map(
            (project) => `
              <article class="project-card" style="--cover: ${project.cover}">
                <a class="project-cover" href="#/posts/${project.post}" aria-label="查看项目：${esc(project.title)}"></a>
                <div class="project-content">
                  <p class="eyebrow">${esc(project.tags[0])}</p>
                  <h2><a href="#/posts/${project.post}">${esc(project.title)}</a></h2>
                  <p>${esc(project.desc)}</p>
                  <div class="tag-row">${tagChips(project.tags)}</div>
                </div>
              </article>
            `
          )
          .join("")}
      </section>
    `;
  }

  function renderReading() {
    const items = [
      ["嵌入式", "STM32、FreeRTOS、Linux、ROS 和调试工具链，优先整理能直接关联项目的资料。"],
      ["计算机视觉", "YOLOv8、OpenCV、图像拼接、数据增强和工程部署。"],
      ["AI 工具", "MCP、自动化文档、代码代理和本地工作流。"],
      ["阶段计划", "考研、项目复盘、手账整理和写作节奏。"]
    ];

    main.innerHTML = `
      ${pageHeader(pages.reading.title, pages.reading.desc, "reading")}
      <section class="reading-grid">
        ${items
          .map(
            ([title, desc]) => `
              <article class="reading-item">
                <h2>${esc(title)}</h2>
                <p>${esc(desc)}</p>
              </article>
            `
          )
          .join("")}
      </section>
    `;
  }

  function renderAbout() {
    main.innerHTML = `
      ${pageHeader(pages.about.title, pages.about.desc, "about")}
      <section class="plain-grid">
        <article class="plain-panel">
          <h2>我在做什么</h2>
          <p>平时关注 STM32、FreeRTOS、Linux、ROS、神经网络和边缘 AI。这个博客会更像项目手账和复盘笔记库，而不只是放碎片笔记。</p>
        </article>
        <article class="plain-panel">
          <h2>新版方向</h2>
          <p>旧站是 Hexo + 主题站点风格。新版保留个人气质，但把重点放回文章阅读、项目结构、标签归档和移动端稳定性。</p>
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
        <section class="plain-panel"><div class="tag-cloud">${tagChips(getAllTags(), true)}</div></section>
      `;
      return;
    }
    if (key === "categories") {
      main.innerHTML = `
        ${pageHeader(pages.categories.title, pages.categories.desc, "categories")}
        <section class="plain-panel"><div class="tag-cloud">${getAllCategories()
          .map((category) => `<a class="tag-chip" href="#/categories/${encodeURIComponent(category)}">${esc(category)}</a>`)
          .join("")}</div></section>
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
        <section class="plain-grid">
          <article class="plain-panel"><h2>核心方向</h2><p>控制工程专硕，当前重点是数学、英语、专业课和政治的阶段推进。</p></article>
          <article class="plain-panel"><h2>阶段节奏</h2><p>基础阶段重在补齐知识框架，强化阶段重在题型和错题，冲刺阶段重在真题、模拟和背诵。</p></article>
          <article class="plain-panel"><h2>效率原则</h2><p>任务少而明确，每天记录完成情况，不把计划页面做成另一个需要维护的负担。</p></article>
        </section>
      `;
    }
  }

  function renderSections(post) {
    return post.sections
      .map((section) => {
        const id = slugify(section.heading);
        return `
          <section>
            <h2 id="${esc(id)}">${esc(section.heading)}</h2>
            ${(section.paragraphs || []).map((text) => `<p>${esc(text)}</p>`).join("")}
            ${section.bullets ? `<ul>${section.bullets.map((item) => `<li>${esc(item)}</li>`).join("")}</ul>` : ""}
            ${section.code ? `<pre><code>${esc(section.code)}</code></pre>` : ""}
            ${section.note ? `<div class="note-box">${esc(section.note)}</div>` : ""}
          </section>
        `;
      })
      .join("");
  }

  function renderToc(post) {
    return post.sections
      .map((section, index) => {
        const id = slugify(section.heading);
        return `<a href="#${esc(id)}"><b>${index + 1}</b><span>${esc(section.heading)}</span></a>`;
      })
      .join("");
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
            </header>
            <div class="article-body">
              ${renderSections(post)}
              <div class="license-box">
                <strong>${esc(post.title)}</strong>
                <span>本文为 ${esc(site.author)} 的项目复盘 / 学习记录。转载请保留来源链接。</span>
                <span>旧链接：${esc(post.legacyPaths[0] || "/")}</span>
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
      ${pageHeader("页面没有找到", "旧链接可能已经迁移。你可以从归档、标签或分类继续查找。", "404")}
      <section class="plain-grid">
        <article class="plain-panel"><h2>最近文章</h2><div class="tag-cloud">${posts
          .slice(0, 6)
          .map((post) => `<a class="tag-chip" href="${postHref(post)}">${esc(post.title)}</a>`)
          .join("")}</div></article>
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
    const current = route.view === "post" || route.view === "tag" || route.view === "category" ? "archive" : route.view;
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

  function render() {
    const route = parseRoute();

    if (route.view === "home") renderHome();
    else if (route.view === "post") renderArticle(route.slug);
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

  window.addEventListener("hashchange", render);
  window.addEventListener("popstate", render);
  window.addEventListener("scroll", () => {
    document.querySelector(".back-top")?.classList.toggle("is-visible", window.scrollY > 520);
  });

  initTheme();
  render();
})();
