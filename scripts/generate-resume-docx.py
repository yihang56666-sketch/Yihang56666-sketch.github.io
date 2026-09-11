from __future__ import annotations

from pathlib import Path

from docx import Document
from docx.enum.section import WD_SECTION
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_TAB_ALIGNMENT
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Cm, Pt, RGBColor


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "docs" / "beid-dual-selection-resume.md"
TARGET = ROOT / "docs" / "beid-dual-selection-resume.docx"

ACCENT = RGBColor(0x1D, 0x35, 0x57)
TEXT = RGBColor(0x24, 0x2C, 0x33)
MUTED = RGBColor(0x5B, 0x65, 0x70)


def set_columns(section) -> None:
    # python-docx does not expose section cell margins directly.
    sectPr = section._sectPr
    layout = sectPr.first_child_found_in("w:cols")
    if layout is None:
        layout = OxmlElement("w:cols")
        sectPr.append(layout)
    layout.set(qn("w:num"), "2")
    layout.set(qn("w:space"), "500")


def remove_tabs(paragraph) -> None:
    pPr = paragraph._p.get_or_add_pPr()
    pPr.append(OxmlElement("w:suppressLineNumbers"))


def add_rule(paragraph) -> None:
    pPr = paragraph._p.get_or_add_pPr()
    borders = OxmlElement("w:pBdr")
    bottom = OxmlElement("w:bottom")
    bottom.set(qn("w:val"), "single")
    bottom.set(qn("w:sz"), "8")
    bottom.set(qn("w:space"), "3")
    bottom.set(qn("w:color"), "1D3557")
    borders.append(bottom)
    pPr.append(borders)


def add_text(paragraph: object, text: str, bold: bool = False, size: int = 9) -> None:
    run = paragraph.add_run(text)
    run.bold = bold
    run.font.size = Pt(size)
    run.font.name = "Microsoft YaHei"
    run._element.rPr.rFonts.set(qn("w:eastAsia"), "Microsoft YaHei")


def add_heading(document: Document, text: str) -> None:
    paragraph = document.add_paragraph()
    paragraph.paragraph_format.space_before = Pt(14)
    paragraph.paragraph_format.space_after = Pt(3)
    add_text(paragraph, text.upper(), bold=True, size=10)
    paragraph.runs[0].font.color.rgb = ACCENT
    add_rule(paragraph)


def add_paragraph(document: Document, text: str) -> None:
    paragraph = document.add_paragraph()
    paragraph.paragraph_format.space_after = Pt(4)
    add_text(paragraph, text)
    paragraph.runs[0].font.color.rgb = TEXT


def add_bullet(document: Document, text: str) -> None:
    paragraph = document.add_paragraph()
    paragraph.paragraph_format.left_indent = Cm(0.5)
    paragraph.paragraph_format.first_line_indent = Cm(-0.5)
    paragraph.paragraph_format.space_after = Pt(3)
    add_text(paragraph, "•  ")
    add_text(paragraph, text)
    paragraph.runs[0].font.color.rgb = MUTED
    paragraph.runs[1].font.color.rgb = TEXT


def add_project(document: Document, title: str, subtitle: str, link: str | None, bullets: list[str]) -> None:
    paragraph = document.add_paragraph()
    paragraph.paragraph_format.space_before = Pt(10)
    paragraph.paragraph_format.space_after = Pt(1)
    add_text(paragraph, title, bold=True, size=10)
    paragraph.runs[0].font.color.rgb = TEXT

    paragraph = document.add_paragraph()
    paragraph.paragraph_format.space_after = Pt(2)
    add_text(paragraph, subtitle)
    paragraph.runs[0].font.color.rgb = MUTED

    if link:
        paragraph = document.add_paragraph()
        paragraph.paragraph_format.space_after = Pt(3)
        add_text(paragraph, link)
        paragraph.runs[0].font.color.rgb = ACCENT

    for bullet in bullets:
        add_bullet(document, bullet)


def parse_source() -> dict[str, object]:
    lines = SOURCE.read_text(encoding="utf-8").splitlines()
    content = {
        "heading": "",
        "intent": "",
        "contact": "",
        "note": "",
        "direction": "",
        "skills": [],
        "projects": [],
        "demo": [],
        "boundaries": [],
    }
    current: list[str] = []
    mode = ""
    project = None

    for raw_line in lines:
        line = raw_line.rstrip()
        if line.startswith("# "):
            content["heading"] = line[2:].strip()
        elif line.startswith("求职意向："):
            content["intent"] = line.removeprefix("求职意向：").strip()
        elif line.startswith("联系方式："):
            content["contact"] = line.removeprefix("联系方式：").strip()
        elif line.startswith("> "):
            content["note"] = line[2:].strip()
        elif line == "## 求职方向":
            mode = "direction"
        elif line == "## 技术栈":
            mode = "skills"
            current = content["skills"]
        elif line == "## 项目经历":
            mode = "projects"
        elif line == "## 90 秒演示":
            mode = "demo"
            current = content["demo"]
        elif line == "## 不要夸大":
            mode = "boundaries"
            current = content["boundaries"]
        elif mode == "direction" and line:
            content["direction"] = line
            mode = ""
        elif mode == "projects" and line.startswith("### "):
            if project:
                content["projects"].append(project)
            project = {"title": line[4:].strip(), "subtitle": "", "link": None, "bullets": []}
        elif mode == "projects" and project and line.startswith("- "):
            project["bullets"].append(line[2:].strip())
        elif mode == "projects" and project and line.startswith("仓库："):
            project["link"] = line.removeprefix("仓库：").strip()
        elif mode == "projects" and project and line and not line.startswith("- "):
            project["subtitle"] = line.strip()
        elif line.startswith(("- ", "1. ", "2. ", "3. ", "4. ")) and current is not None:
            current.append(line[line.find(" ") + 1 :].strip())

    if project:
        content["projects"].append(project)
    return content


def build_document(content: dict[str, object]) -> Document:
    document = Document()
    section = document.sections[0]
    section.page_width = Cm(21)
    section.page_height = Cm(29.7)
    section.top_margin = Cm(1.8)
    section.bottom_margin = Cm(1.6)
    section.left_margin = Cm(1.6)
    section.right_margin = Cm(1.6)
    set_columns(section)

    title = document.add_paragraph()
    title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    title.paragraph_format.space_after = Pt(2)
    add_text(title, content["heading"], bold=True, size=18)
    title.runs[0].font.color.rgb = ACCENT

    subtitle = document.add_paragraph()
    subtitle.alignment = WD_ALIGN_PARAGRAPH.CENTER
    subtitle.paragraph_format.space_after = Pt(2)
    add_text(subtitle, content["intent"], bold=True, size=10)
    subtitle.runs[0].font.color.rgb = TEXT

    contact = document.add_paragraph()
    contact.alignment = WD_ALIGN_PARAGRAPH.CENTER
    contact.paragraph_format.space_after = Pt(8)
    add_text(contact, content["contact"], size=8)
    contact.runs[0].font.color.rgb = MUTED
    add_rule(contact)

    add_heading(document, "求职方向")
    add_paragraph(document, content["direction"])

    add_heading(document, "技术栈")
    for skill in content["skills"]:
        add_bullet(document, skill)

    add_heading(document, "项目经历")
    for project in content["projects"]:
        add_project(document, **project)

    add_heading(document, "90 秒演示")
    for index, step in enumerate(content["demo"], start=1):
        paragraph = document.add_paragraph()
        paragraph.paragraph_format.left_indent = Cm(0.5)
        paragraph.paragraph_format.first_line_indent = Cm(-0.5)
        paragraph.paragraph_format.space_after = Pt(3)
        add_text(paragraph, f"{index}.  ")
        add_text(paragraph, step)
        paragraph.runs[0].font.color.rgb = MUTED
        paragraph.runs[1].font.color.rgb = TEXT

    add_heading(document, "验证边界")
    for boundary in content["boundaries"]:
        add_bullet(document, boundary)

    footer = document.sections[0].footer.paragraphs[0]
    footer.alignment = WD_ALIGN_PARAGRAPH.CENTER
    add_text(footer, content["note"], size=7)
    footer.runs[0].font.color.rgb = MUTED
    return document


def main() -> None:
    document = build_document(parse_source())
    document.save(TARGET)
    print(f"Wrote {TARGET}")


if __name__ == "__main__":
    main()
