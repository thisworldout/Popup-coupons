/**
 * Локальные тесты: кнопка сброса закрытия виджета (крестик + dismissCooldownMs).
 * Подключать после js/config.js (нужен COUPON_CONFIG.storageKey).
 */
(function () {
  function keyBase() {
    return (window.COUPON_CONFIG && window.COUPON_CONFIG.storageKey) || "coupon-widget-state";
  }

  function resetCouponStorage() {
    var k = keyBase();
    try {
      localStorage.removeItem(k);
    } catch (_) {}
    try {
      localStorage.removeItem(k + ":dismissed-at");
    } catch (_) {}
    try {
      sessionStorage.removeItem(k + ":auto-demo-shown");
    } catch (_) {}
  }

  function inject() {
    if (!document.body) return;
    var btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = "Reset: сброс закрытия";
    btn.setAttribute(
      "title",
      "Очистить localStorage/sessionStorage виджета и перезагрузить страницу"
    );
    btn.setAttribute("aria-label", "Сбросить закрытие промокода и перезагрузить");
    btn.style.cssText = [
      "position:fixed",
      "bottom:max(12px,env(safe-area-inset-bottom,0px))",
      "right:max(12px,env(safe-area-inset-right,0px))",
      "z-index:10001",
      "padding:10px 14px",
      "font-size:13px",
      "font-family:system-ui,sans-serif",
      "border-radius:8px",
      "border:1px solid rgba(15,23,42,.22)",
      "background:#fff",
      "color:#0f172a",
      "cursor:pointer",
      "box-shadow:0 2px 12px rgba(0,0,0,.12)",
    ].join(";");
    btn.addEventListener("click", function () {
      resetCouponStorage();
      location.reload();
    });
    document.body.appendChild(btn);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", inject);
  } else {
    inject();
  }
})();
