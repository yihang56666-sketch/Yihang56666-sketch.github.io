# 双选会 · 全项目 HR 应对手册

更新：2026-09-30。只写仓库中已落地、可用命令复现的事实。

---

## 30 秒自我介绍（可直接背）

> 我主要做三类作品：一是**嵌入式工作流 Agent（Hardware Butler）**，把一句话需求编排成九阶段流水线，默认 mock、真实烧录多层门控；二是**本地优先学习工作台 BEID**，React 多端客户端，自研 DASH 播放与本地数据迁移；三是**多智能体编排协议 magent** 和**无构建工程博客**，前者约束子智能体只读与证据交接，后者用 Playwright 锁前端回归。每个项目都有测试数字和诚实边界，可以现场演示。

---

## 项目总览（面试官 10 秒看懂）

| 项目 | 一句话 | 关键数字 | 仓库 |
|---|---|---|---|
| Hardware Butler | 安全优先嵌入式开发助手 | 1017 测试 · 14 厂商族 · 9 阶段 | hardware-butler |
| BEID / RIXIA | 本地优先学习 + B 站 DASH 工作台 | 762+32 测试 · 多端 | RIXIA |
| magent | Codex 原生子智能体编排 Skill | 33 项契约测试 | magent |
| beid blog | 无构建静态作品集站 | 16 条 Playwright | Pages 站 |

---

## 一、Hardware Butler

### 一句话
安全优先的嵌入式开发助手：从「在 PD12 上让 LED 以 2Hz 闪烁」到选型、CubeMX、固件、构建、烧录、观测、验证的九阶段编排。

### 架构怎么讲
- **tools/**：CLI + 工作流状态机 + 安全门控 + LLM client + 14 厂商 adapter  
- **embeddedskills/**：独立仓库的构建/烧录/串口/CAN 后端（父仓 clone 可能没有，用 plugins 镜像）  
- **nextboard/**：方案选型与 BOM 风险  
- **gui/**：PyQt6 13 tab  

### 安全模型（必考）
1. 默认 mock，不碰硬件  
2. `HARDWARE_BUTLER_ENABLE_REAL_FLASH=1` 显式 opt-in  
3. 确认 token 绑定计划字段（防篡改完整性，**不是**密码学人工授权）  
4. 电压/电流值域防呆 + 固件 SHA-256 + 一次性消费 + 审计日志  

### 演示
```powershell
python tools\hardware_butler.py guide --root tests\fixtures\cubemx-basic
python tools\hardware_butler.py workflow-run --root tests\fixtures\cubemx-basic --intent develop-feature --goal "LED blink on PD12" --feature led-blink --pin PD12 --function gpio-output --json
```

### 高频追问
| 问题 | 答法 |
|---|---|
| 烧过真板吗？ | **诚实**：非硬件路径已回归；真实板卡有 runbook，未在本材料宣称完成闭环。 |
| LLM 会不会乱烧板子？ | LLM 只产结构化意图；执行器与门控是确定性代码。 |
| 为什么分 9 阶段？ | 每阶段有输入/产物/状态，失败可定位可 resume；高风险动作放在构建之后。 |
| 没有硬件怎么验证？ | CubeMX fixture + mock workflow + 行为验证分层 + QEMU 可选仿真。 |

### 禁止夸大
- 不说「已完成真实硬件闭环」  
- 不说「token 等价于人工签字」  
- 测试数字以最新实测 **1017 passed / 12 skipped** 为准（勿再背 924）

---

## 二、BEID / RIXIA

### 一句话
本地优先个人节奏与学习工作台：任务/习惯/日记/专注/考研 + B 站搜索、DASH 播放、时间点笔记，Web / Electron / Android 一套源码。

### 可深挖技术点
1. **DASH/MSE 管线**：sidx 索引 seek、背压、缓冲淘汰、CDN 备用源  
2. **本地优先**：Zustand persist v3 + 迁移 + 配额失败可见 + companion backup  
3. **锚定计时**：`endsAt` 时间戳真源，后台节流不漂移  
4. **习惯频率模型**：daily / weekly-N / interval-N 参与 due/streak/strength  
5. **多端网络适配**：Web 代理 / Electron 本地反代 / CapacitorHttp  

### 演示
```powershell
npm install
npm run dev
npm test
```

### 高频追问
| 问题 | 答法 |
|---|---|
| 为什么本地优先？ | 个人数据隐私 + 离线可用 + 无服务端成本；联网只在 B 站内容需要时。 |
| 最近修了什么？ | BV 直链误判、逾期任务导航、跨午夜 UTC 日、专注钳制不一致；先写失败测试再改实现。 |
| Cookie 怎么处理？ | 个人应用存本机 localStorage；能解释 XSS 威胁模型，不假装企业级密钥管理。 |
| 纯 Web 能播 B 站吗？ | 开发走 Vite 代理；生产 Web 受 CORS/防盗链限制，Electron 有自己的反代。 |

### 禁止夸大
- 不说「已上架应用商店」  
- 扫码/真机/安装包需现场验收  
- 勿把 `rixia-v1` 内部键说成线上产品名

---

## 三、magent（子智能体编排 Skill）

### 一句话（开场 10 秒必须说对）
**这不是多智能体运行时，是 Codex 原生子智能体之上的编排契约 Skill。**  
原生工具负责跑子智能体；magent 负责判断派不派、派给谁、允许读什么、交什么证据；主智能体独占写入。

### 五个失败模式 → 五条不变量
1. 复杂度 ≠ 授权 → 授权门  
2. 立即阻塞的工作不该空等委派 → keep-local  
3. `git status` 看不出 M 文件二次修改 → 内容指纹基线  
4. wait 超时 ≠ 代理终止 → pending 与 terminal 分离  
5. 完成仍占并发槽 → 显式 close/archive  

### 演示
```powershell
python -X utf8 -B -m unittest discover -s tests -v
```

### 高频追问
| 问题 | 答法 |
|---|---|
| 这不就是提示词吗？ | 声明式协议；价值在输入输出契约、失败语义、跨文件一致性与版本化回归。 |
| 为什么不 LangGraph？ | 宿主已有原生 subagent 执行层；再包一层是第二套生命周期。 |
| 怎么保证只读？ | 指令 + 事后审计；强保证需宿主权限隔离，不虚构沙箱。 |
| 33 项测试证明什么？ | 证明结构契约完整，不证明模型一定遵循。 |

### 禁止夸大
- 不说自研执行引擎 / 分布式调度  
- 不说保证提速数倍  
- 命名对外统一为 **magent — Codex 原生子智能体编排 Skill**

---

## 四、beid blog

### 一句话
GitHub Pages 上的无构建静态 SPA：Hash 路由、动态 SEO、深浅主题、Playwright 回归。

### 亮点
- 零构建零框架，根目录直发 Pages  
- 本地 vendor，CDN 挂掉核心阅读仍可用  
- 16 条 E2E：IME、主题、溢出、reduced-motion、TOC  
- 双选会前诚实化：真实字数、真实 Atom、统一视觉语言  

### 高频追问
| 问题 | 答法 |
|---|---|
| 为什么不用 React？ | 部署成本与运行时依赖；页面规模可控时原生足够。 |
| SEO 怎么办？ | 路由渲染时同步 title/OG/canonical；Hash 路由是已知取舍。 |

---

## 统一面试策略

1. **先说边界再吹能力**：真实板卡未闭环、契约测试非行为评测——主动说，加分。  
2. **每个项目准备 1 个「修过的真 bug」**：比功能列表更可信。  
3. **数字对齐**：Hardware 1017 · BEID 762+32 · magent 33 · Blog 16。  
4. **演示顺序**：博客（视觉）→ BEID（产品）→ Hardware（深度）→ magent（方法论）。  
5. **被问不会的**：说清「当前材料验证范围」，不要现场编。

---

## 会前 15 分钟核对清单

- [ ] 四个仓库可打开，远程链接正确  
- [ ] 博客本地 `npx serve .` 可跑  
- [ ] BEID `npm test` 或至少 `npm run typecheck`  
- [ ] Hardware `workflow-run --root tests\fixtures\cubemx-basic` 可演示  
- [ ] magent `unittest discover` 33 OK  
- [ ] 简历数字与 README / 站点卡片一致  
- [ ] 不打开私有 token、个人聊天记录、未授权目录  

---

*配套文件：`docs/Yihang-双选会简历-2026.md`（简历）· 各仓库 `docs/HR_PROJECT_GUIDE.md`（项目细册）*
