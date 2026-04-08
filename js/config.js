/**
 * Редактируйте значения здесь — сборка не нужна.
 * Встраивание: не вешайте coupon-widget-doc на <html> — fixed включается только если у <body> нет coupon-widget-doc (как в демо html/widget.html).
 */
window.COUPON_CONFIG = {
  couponCode: "NEW10APR",

  kicker: "10%",

  title: "Скидка",

  description: "",

  footnote:
    "*Действует на бронирования до конца Апреля. Для активации введите код при бронировании на сайте.",

  copyLabel: "",
  copiedLabel: "Скопировано",

  /** На мобильной вёрстке (≤480px): синяя кнопка с белым текстом (макет Figma). На шире экрана скрыта — копирование по полю кода и крестик «закрыть». */
  ctaText: "Скопировать",
  ctaUrl: "",

  accent: "#2958ff",

  /** true: перенести #coupon-root в document.body (Tilda / предки с transform). false — оставить в разметке */
  hoistToBody: true,

  /**
   * Слева от края viewport (px). Не задавайте — берётся из css/widget.css (20px, как t135).
   * Если виджет уезжает: задайте hostInlinePx / hostInlinePxMobile под замер DevTools у логотипа.
   * Раньше здесь стояло 50 — на десктопе это перебивало 20px и ломало выравнивание с шапкой.
   */
  // hostInlinePx: 50,
  // hostInlinePxMobile: 20,
  hostBottomPx: 50,

  startExpanded: false,
  rememberState: true,
  storageKey: "coupon-widget-state",
  /** Без задержки — виджет сразу в финальном виде, без «мигания» */
  showDelayMs: 0,

  /** После закрытия крестиком: не показывать виджет на новых страницах N мс (localStorage). 0 — сразу снова как раньше */
  dismissCooldownMs: 10 * 60 * 1000,

  /** Авто-раскрытие по таймеру отключает скачки вида на встраивании */
  autoDemo: false,
  autoDemoAfterMs: 900,
  autoDemoHoldMs: 3000,
  autoDemoOncePerSession: true,

  hoverOpen: true,
  hoverRevealBodyMs: null,
  hoverRailExpandMs: 400,
};
