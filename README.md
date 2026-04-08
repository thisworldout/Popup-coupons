# Popup-coupons

[![Live demo — GitHub Pages](https://img.shields.io/badge/live%20demo-GitHub%20Pages-2962ff?style=flat-square)](https://thisworldout.github.io/Popup-coupons/)

Встраиваемый виджет промокода: вертикальная рейка «Скидка» и раскрывающаяся панель с кодом, описанием и CTA. Стили и логика в `css/widget.css` и `js/widget.js`.

## Live demo

После включения **GitHub Pages** (ветка `main`, корень `/`) сайт будет доступен по адресу:

**https://thisworldout.github.io/Popup-coupons/**

- Главная: `index.html` → ссылки на каталог и all-in-one.
- Каталог вставок: [gallery/index.html](https://thisworldout.github.io/Popup-coupons/gallery/index.html).

### Включить Pages

Вручную: репозиторий → **Settings** → **Pages** → **Build and deployment** → Source: **Deploy from a branch**, branch **main**, folder **/ (root)**.

Через [GitHub CLI](https://cli.github.com/) (уже нужен авторизованный `gh`):

```bash
gh api repos/thisworldout/Popup-coupons/pages -X POST \
  -f source[branch]=main -f source[path]=/
```

Скрипты `local-test/sync_all_in_one.py` на Pages не выполняются — перед пушем при необходимости прогоняйте синхронизацию локально. Файл `widget-all-in-one.html` в репозитории уже готов к отдаче как статика.

### Пути на GitHub Pages

У [project site](https://docs.github.com/en/pages/getting-started-with-github-pages/about-github-pages#types-of-github-pages-sites) базовый путь — `/Popup-coupons/`. Стенды в `local-test/` и ссылки в `gallery/` используют **относительные** пути к `css/` и `js/`, чтобы демо открывались и локально, и на Pages. На своём сайте задавайте URL к своим копияи файлов (или пути от корня домена).

## Быстрый старт (локально)

```bash
python3 -m http.server 8765
```

Откройте [http://127.0.0.1:8765/](http://127.0.0.1:8765/) или [gallery/index.html](http://127.0.0.1:8765/gallery/index.html). Подробный список URL: [local-test/LOCAL_SERVER.txt](local-test/LOCAL_SERVER.txt).

## Репозиторий через GitHub CLI

Если поднимаете проект с нуля на машине с `gh`:

```bash
git init
git add .
git commit -m "init"
gh repo create popup-coupons --public --push --source=.
```

(У репозитория уже есть remote — этот блок для справки.)

## Структура

| Путь | Назначение |
|------|------------|
| `index.html` | Точка входа: ссылки на галерею и демо |
| `css/widget.css` | Стили (desktop / tablet / mobile) |
| `js/widget.js` | Раскрытие, копирование, хост, состояние |
| `js/config.js` | `window.COUPON_CONFIG` |
| `html/widget.html` | Эталон разметки `#coupon-root` |
| `local-test/*.html` | Стенды (относительные пути к `css` / `js`) |
| `gallery/index.html` | Каталог сценариев и фрагменты для копирования |
| `widget-all-in-one.html` | Один HTML со встроенным CSS и JS |

## Один файл (all-in-one)

```bash
python3 local-test/sync_all_in_one.py
```

## Вставка на свой сайт

1. Скопируйте на хостинг `css/widget.css`, `js/config.js`, `js/widget.js` (или используйте один `widget-all-in-one.html`).
2. Подключите шрифты Inter и JetBrains Mono (см. `html/widget.html`).
3. Вставьте разметку блока `#coupon-root` из [`html/widget.html`](html/widget.html).
4. Скрипты подключайте с `defer` **после** разметки виджета.
5. Для фиксированной плашки слева добавьте класс `coupon-root--host` на корень (см. `local-test/host-fixed-center-left.html`).

Поле конфигурации — объект `COUPON_CONFIG` в `js/config.js` (код промо, сноска, CTA, отступы, `hoistToBody` для Tilda и т.д.).

## Лицензия

Укажите при необходимости.
