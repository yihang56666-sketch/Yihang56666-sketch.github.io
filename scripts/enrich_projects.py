# -*- coding: utf-8 -*-
from pathlib import Path

p = Path(r"D:\boke\assets\app.js")
text = p.read_text(encoding="utf-8")

old_hw = '''            "ruff 与 mypy 全绿，1017 个单元测试回归通过；真实板卡日流程有独立 runbook 记录。"
          ]
        }
      ]
    },
    {
      title: "Codex 原生子智能体编排 Skill",'''

new_hw = '''            "ruff 与 mypy 全绿，1017 个单元测试回归通过；真实板卡日流程有独立 runbook 记录。"
          ]
        },
        {
          heading: "仓库分层",
          tree: "hardware-butler/\\n  tools/            # CLI + 9 阶段状态机 + 安全门控 + LLM + 14 厂商 adapter\\n  embeddedskills/   # 构建/烧录/串口/CAN 后端（独立仓，可用 plugins 镜像）\\n  nextboard/        # 方案选型与 BOM 风险\\n  gui/              # PyQt6 13 tab\\n  plugins/          # Codex 插件镜像\\n  tests/fixtures/   # 无板可跑的 CubeMX fixture"
        },
        {
          heading: "现场可跑（mock）",
          code: "python tools/hardware_butler.py guide --root tests/fixtures/cubemx-basic\\npython tools/hardware_butler.py workflow-run --root tests/fixtures/cubemx-basic --intent develop-feature --goal \\"LED blink on PD12\\" --feature led-blink --pin PD12 --function gpio-output --json"
        },
        {
          heading: "诚实边界",
          bullets: [
            "真实板卡烧录未在本材料宣称完成；有 runbook 与多层门控设计。",
            "确认 token 是参数完整性绑定，不是密码学级人工授权（SECURITY.md 已披露）。",
            "embeddedskills 作为独立仓维护，父仓 clone 后可能没有根目录，可用 plugins 镜像。"
          ]
        }
      ]
    },
    {
      title: "Codex 原生子智能体编排 Skill",'''

if old_hw not in text:
    idx = text.find("1017 个单元测试")
    print("HW NOT FOUND", repr(text[idx:idx+180]) if idx>=0 else "no marker")
else:
    text = text.replace(old_hw, new_hw, 1)
    print("HW ok")

old_mg = '''            "和通用开源多智能体框架相比，它不是新的运行时，而是一层更薄的判断、边界、安全与核验规则。"
          ]
        }
      ]
    },
    {
      title: "Codex 多智能体编排 · 从运行时到 Skill 的演进",'''

new_mg = '''            "和通用开源多智能体框架相比，它不是新的运行时，而是一层更薄的判断、边界、安全与核验规则。"
          ]
        },
        {
          heading: "五个失败模式 → 五条不变量",
          table: {
            headers: ["失败模式", "协议不变量"],
            rows: [
              ["复杂度触发委派", "授权门：加载 Skill ≠ 分派许可"],
              ["主智能体空等", "立即阻塞工作 keep-local"],
              ["M 文件二次修改不可见", "内容指纹基线，而非只看 git status"],
              ["wait 超时被当成失败", "pending 与 terminal 分离"],
              ["完成代理占满并发槽", "显式 close / archive"]
            ]
          }
        },
        {
          heading: "现场可跑",
          code: "python -X utf8 -B -m unittest discover -s tests -v   # 33 项契约测试"
        },
        {
          heading: "诚实边界",
          bullets: [
            "不是自研多智能体运行时；不承诺并行一定提速。",
            "只读靠指令与事后审计，强保证需宿主权限隔离，不虚构沙箱。",
            "契约测试验证协议结构，不证明模型必然遵循指令。"
          ]
        }
      ]
    },
    {
      title: "Codex 多智能体编排 · 从运行时到 Skill 的演进",'''

if old_mg not in text:
    idx = text.find("更薄的判断、边界")
    print("MG NOT FOUND", repr(text[idx:idx+180]) if idx>=0 else "no marker")
else:
    text = text.replace(old_mg, new_mg, 1)
    print("MG ok")

p.write_text(text, encoding="utf-8")
print("written", len(text))
