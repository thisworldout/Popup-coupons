# Popup-coupons

Встраиваемый виджет промокода: вертикальная рейка «Скидка» и раскрывающаяся панель с кодом, описанием и CTA. Стили и поведение — в одном наборе файлов (`css/widget.css`, `js/widget.js`).

## Быстрый старт (локально)

Из корня репозитория:

```bash
python3 -m http.server 8765
```

- **Каталог сценариев внедрения:** [gallery/index.html](http://127.0.0.1:8765/gallery/index.html)
- Полный список URL и пояснения: [local-test/LOCAL_SERVER.txt](local-test/LOCAL_SERVER.txt)

## Структура

| Путь | Назначение |
|------|------------|
| `css/widget.css` | Стили виджета (desktop / tablet / mobile) |
| `js/widget.js` | Логика: раскрытие, копирование, хостинг в `body`, хранение состояния |
| `js/config.js` | `window.COUPON_CONFIG` — код, тексты, отступы, флаги поведения |
| `html/widget.html` | Эталонная разметка `#coupon-root` |
| `local-test/*.html` | Стенды: split-вставка, fixed-хост, edge-case без класса на корне |
| `gallery/index.html` | Навигация по демо и статические фрагменты для копирования |
| `widget-all-in-one.html` | Один HTML со встроенным CSS и JS (после синхронизации) |

## Один файл (all-in-one)

После правок в `css/` или `js/`:

```bash
python3 local-test/sync_all_in_one.py
```

## Вставка на сайт

1. Подключите шрифты (Inter, JetBrains Mono), `css/widget.css`, затем `js/config.js` и `js/widget.js` с `defer`.
2. Вставьте разметку из [`html/widget.html`](html/widget.html) (блок `#coupon-root`).
3. Для фиксированной позиции слева используйте класс `coupon-root--host` на корне (см. демо в `local-test/`).

Подробности — на странице [gallery/index.html](gallery/index.html).

## Лицензия

Укажите при необходимости.
