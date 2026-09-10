# Yihang · 双选会简历

**求职方向**：嵌入式软件 / 工具链 / 客户端开发 / AI 应用工程  
**邮箱**：yihang56666@gmail.com  
**GitHub**：https://github.com/Yihang56666-sketch  
**个人博客**：https://yihang56666-sketch.github.io  
**教育经历**：现场投递时补充（学校 / 专业 / 学历 / 时间）

---

## 能力概述

- 能独立把复杂需求拆成可演示、可回归、可讲清边界的完整作品：从架构、状态模型到测试与安全门控。
- 跨端交付：React + TypeScript 客户端、Electron / Capacitor Android、Python 工具链、无构建静态站。
- 工程可靠性意识：单元测试、契约测试、类型检查、发布边界测试、默认安全执行，不靠口头记忆功能列表。
- 调试叙事能力：能讲清问题根因、取舍与回归，而不是只报功能清单。

---

## 项目经历

### 1. Hardware Butler · 安全优先的嵌入式开发助手

**技术**：Python 3.10+ · CLI + PyQt6 GUI · 9 阶段工作流 · LLM 多 Provider  
**仓库**：https://github.com/yihang56666-sketch/hardware-butler

- 将一句话硬件需求编排为：需求解析 → 芯片选型 → 资料收集 → CubeMX 配置 → 固件生成 → 构建 → 烧录 → 观测 → 目标验证；状态机可 resume，失败可重试与定位。
- 默认 mock 路径；真实烧录必须同时满足环境变量 opt-in、确认 token、值域防呆、固件产物 hash 校验与审计日志。
- 覆盖 14 个 MCU 厂商族（Cortex-M / RISC-V / AVR / MSP430 / Xtensa / C28x / MIPS / RX 等），5 层行为验证（关键词 / 频率 / 文本 / 正则 / 数值范围）。
- LLM 只做「自然语言 → 结构化意图 / 固件计划」，执行器与门控由确定性代码掌控，避免模型直接获得硬件副作用权限。
- 工程回归：**1017 passed / 12 skipped**；ruff + mypy 全绿；GUI 13 tab、CLI 35 子命令、Codex 插件镜像同步。

**面试可深挖**：安全门控威胁建模、状态机设计、无板 mock 验证策略、LLM 与确定性执行的边界。

---

### 2. BEID / RIXIA · 本地优先学习工作台

**技术**：React 19 · TypeScript · Vite 7 · Zustand · Electron · Capacitor Android · PWA  
**仓库**：https://github.com/yihang56666-sketch/RIXIA

- 把任务、习惯、日记、专注计时、考研规划与 B 站搜索 / DASH 播放 / 时间点笔记收进同一套领域模型；个人数据默认只落本机。
- 自研 MSE 播放管线：sidx 分段索引实现远距离 seek、背压与缓冲淘汰、CDN 备用源切换；不嵌官方 iframe，保证单一控制层。
- 持久化 schema v3，兼容 v1/v2 迁移；配额失败可见提示；companion backup 覆盖主 store 之外的播放器与学习清单键。
- 修复过真实产品缺陷：直链 BV 号误判、逾期任务导航丢失、跨午夜日期状态陈旧（UTC→本地日）、专注分钟钳制不一致。
- 回归：**762 Vitest + 32 Node（Electron / 发布边界）**；typecheck 与生产构建通过。

**面试可深挖**：本地优先取舍、schema 迁移、DASH/MSE、账号状态机、多端网络适配层。

---

### 3. magent · Codex 原生子智能体编排 Skill

**技术**：声明式 Skill 协议 · 零运行时依赖 · 标准库 unittest 契约测试  
**仓库**：https://github.com/yihang56666-sketch/magent

- 定位是**编排契约层**，不是自研多智能体运行时：原生工具负责创建 / 运行子智能体；Skill 约束「派谁、允许读什么、交什么证据、失败怎么收」；主智能体独占写入与最终验证。
- 把五个经典协作失败模式产品化为可测试不变量：授权门、立即阻塞留本地、内容指纹基线、超时 ≠ 失败、完成后释放并发槽。
- 33 项无依赖结构契约测试覆盖元数据、分派包、只读边界、隐私路径与生命周期；公开声明「结构测试 ≠ 模型行为保证」。
- 与 LangGraph / AutoGen / CrewAI 的差异：通用框架做执行引擎，本项目做 Codex 原生子智能体之上的判断、边界与核验层。

**面试可深挖**：何时不该委派、dirty workspace 为何 git status 不够、只读如何保证（以及不能保证什么）。

---

### 4. beid blog · 无构建静态作品集博客

**技术**：原生 HTML / CSS / JS · Hash SPA · GitHub Pages · Playwright  
**站点**：https://yihang56666-sketch.github.io  
**仓库**：https://github.com/yihang56666-sketch/Yihang56666-sketch.github.io

- 零构建零框架：Hash 路由、动态 SEO 元数据（title / OG / canonical / JSON-LD）、404 回退、深浅主题、键盘快捷键与无障碍。
- 以 16 条 Playwright E2E 锁关键路径：移动端无横向溢出、主题持久化、中文 IME 组合、TOC 锚点、reduced-motion 降级。
- 双选会前完成诚实化改造：真实字数与 Atom feed、本地 vendor 对齐 404、统一内外页视觉语言（紫 / 玫红 / 暖金 + 衬线标题）、项目数据与实测数字对齐。

**面试可深挖**：为什么不用框架、Hash 路由 SEO 取舍、渐进增强与动效纪律。

---

## 技术栈

| 类别 | 内容 |
|---|---|
| 语言与框架 | TypeScript、React 19、Python、JavaScript、HTML / CSS |
| 客户端与站点 | Vite、Electron、Capacitor Android、PWA、GitHub Pages、PyQt6 |
| 状态与数据 | Zustand 本地持久化、schema 迁移、JSON 备份导入导出 |
| 测试与质量 | Vitest、Playwright、pytest、unittest、ruff、mypy、契约测试、发布边界测试 |
| 领域 | 嵌入式工作流编排、安全执行门控、B 站 DASH/MSE、本地优先应用、多智能体协作协议 |

---

## 工程判断

- 先把风险边界讲清楚，再谈自动化程度。
- 能用测试固定的行为，不靠口头记忆。
- 默认安全、默认可回滚、默认不吞错误。
- 能演示的部分直接演示；不能演示的部分主动说明验证范围（例如 Hardware Butler 尚未宣称真实板卡闭环）。

---

## 90 秒现场演示路线

1. **博客**：首页工程定位 → 项目卡 → 暗色主题 → 源仓库入口。
2. **BEID**：今日下一步 → 逾期任务仍可见 → 本地备份 → 播放器 / 学习联动。
3. **Hardware Butler**：内置 fixture 跑 mock 九阶段，说明默认不碰硬件与真实烧录门控。
4. **magent**：现场跑 33 项契约测试，打开分派契约，说明只读与主智能体写入权。

---

## 诚实边界（建议主动说明）

- Hardware Butler 的真实板卡烧录未在本材料中声称完成；有完整 runbook 与门控设计。
- BEID 的扫码登录、真机播放与 Windows 安装包需要现场设备与网络验收。
- magent 的契约测试验证协议结构，不承诺模型必然遵循指令或并行一定提速。
- 博客已部署 GitHub Pages；Hash 路由不是 SSR，SEO 依赖元数据同步。

---

*本简历只写入可复现的项目事实与当前实测数字；教育经历与手机号按现场投递版补充。*
