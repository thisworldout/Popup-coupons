#!/usr/bin/env python3
"""Вставить актуальный css/widget.css в <style> файла widget-all-in-one.html."""
import pathlib

REPO = pathlib.Path(__file__).resolve().parent.parent
css_path = REPO / "css" / "widget.css"
html_path = REPO / "widget-all-in-one.html"
css = css_path.read_text(encoding="utf-8")
html = html_path.read_text(encoding="utf-8")
start = html.index("<style>") + len("<style>")
end = html.index("</style>")
html_path.write_text(html[:start] + "\n" + css + "\n    " + html[end:], encoding="utf-8")
print("OK:", html_path.name, "<style> =", len(css), "bytes from", css_path.name)
