#!/usr/bin/env python3
"""Вставить js/config.js и js/widget.js в два блока <script> внутри widget-all-in-one.html."""

import pathlib
import sys

REPO = pathlib.Path(__file__).resolve().parent.parent
html_path = REPO / "widget-all-in-one.html"
config_path = REPO / "js" / "config.js"
widget_path = REPO / "js" / "widget.js"

_JOIN_CONFIG_WIDGET = "\n};\n    </script>\n    <script>\n(function () {"

_WIDGET_END_DOUBLE = "\n})();\n\n    </script>"
_WIDGET_END_SINGLE = "\n})();\n    </script>"


def main() -> None:
    cfg = config_path.read_text(encoding="utf-8").rstrip() + "\n"
    wdg = widget_path.read_text(encoding="utf-8").rstrip() + "\n"

    html = html_path.read_text(encoding="utf-8")

    cfg_key = html.find("window.COUPON_CONFIG = {")
    if cfg_key == -1:
        print("error: в HTML нет window.COUPON_CONFIG", file=sys.stderr)
        sys.exit(1)

    c0 = html.rfind("    <script>", 0, cfg_key)
    if c0 == -1:
        print("error: не найден <script> перед конфигом", file=sys.stderr)
        sys.exit(1)
    c_open = html.find("\n", c0)
    if c_open == -1:
        sys.exit(1)
    c_content_start = c_open + 1

    sep_at = html.find(_JOIN_CONFIG_WIDGET, c_content_start)
    if sep_at == -1:
        print("error: не найден стык }; </script> <script> (function", file=sys.stderr)
        sys.exit(1)

    w_old_start = sep_at + len("\n};\n    </script>\n    <script>\n")

    w_end_at = html.find(_WIDGET_END_DOUBLE, w_old_start)
    end_marker = _WIDGET_END_DOUBLE
    if w_end_at == -1:
        w_end_at = html.find(_WIDGET_END_SINGLE, w_old_start)
        end_marker = _WIDGET_END_SINGLE
    if w_end_at == -1:
        print("error: не найдено закрытие виджета })(); + </script>", file=sys.stderr)
        sys.exit(1)

    tail = html[w_end_at + len(end_marker) :]

    new_html = (
        html[:c_content_start]
        + cfg.rstrip()
        + "\n    </script>\n    <script>\n"
        + wdg.rstrip()
        + "\n\n    </script>"
        + tail
    )

    html_path.write_text(new_html, encoding="utf-8")
    print(
        "OK:",
        html_path.name,
        "config =",
        len(cfg),
        "bytes, widget =",
        len(wdg),
        "bytes",
    )


if __name__ == "__main__":
    main()
