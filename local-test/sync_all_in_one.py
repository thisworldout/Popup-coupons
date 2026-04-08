#!/usr/bin/env python3
"""Полная пересборка widget-all-in-one.html: <style> из css/widget.css; скрипты из js/config.js + js/widget.js."""

import subprocess
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent


def run(name: str) -> None:
    p = subprocess.run([sys.executable, str(HERE / name)], check=False)
    if p.returncode != 0:
        sys.exit(p.returncode)


def main() -> None:
    run("sync_all_in_one_style.py")
    run("sync_all_in_one_js.py")
    print("OK: widget-all-in-one.html — style + JS")


if __name__ == "__main__":
    main()
