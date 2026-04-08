(function () {
  /* Вставка: #coupon-root с hidden + class coupon-root--host + data-ready="false" до скрипта — иначе слот в шапке и скачок позиции. */
  function runCouponWidget() {
  var root = document.getElementById("coupon-root");
  if (!root) {
    if (typeof console !== "undefined" && console.warn) {
      console.warn("[coupon-widget] Не найден элемент #coupon-root.");
    }
    return;
  }

  /* Без class coupon-root токены из CSS не применяются — var(...) ломается, рейка схлопывается (~76px). */
  if (!root.classList.contains("coupon-root")) {
    root.classList.add("coupon-root");
  }

  var cfg = window.COUPON_CONFIG || {};
  var storageKey = cfg.storageKey || "coupon-widget-state";

  /* Пока не готов — не показываем (убирает мелькание в шапке до hoist/fixed). */
  root.setAttribute("data-ready", "false");

  /* Демо только как в html/widget.html: class на body. Если class только на html (часто при копировании) — на сайте всё равно включаем host+fixed+hoist. */
  var isCouponDemoPage =
    document.body &&
    document.body.classList.contains("coupon-widget-doc");
  if (!isCouponDemoPage) {
    root.classList.add("coupon-root--host");
    if (cfg.hoistToBody !== false && document.body) {
      document.body.appendChild(root);
    }
  }

  root.removeAttribute("hidden");

  var code = String(cfg.couponCode || "CODE");

  var panel = document.getElementById("coupon-panel");
  var collapseEl = document.getElementById("coupon-collapse");
  var header = document.getElementById("coupon-header");
  var kickerEl = document.getElementById("coupon-kicker");
  var titleEl = document.getElementById("coupon-title");
  var descEl = document.getElementById("coupon-description");
  var codeEl = document.getElementById("coupon-code");
  var hintEl = document.getElementById("coupon-copy-hint");
  var ctaEl = document.getElementById("coupon-cta");
  var footEl = document.getElementById("coupon-footnote");
  var closeFullEl = document.getElementById("coupon-close-full");

  var demoTimers = [];
  function clearDemo() {
    for (var i = 0; i < demoTimers.length; i++) {
      clearTimeout(demoTimers[i]);
    }
    demoTimers = [];
    clearHoverReveal();
  }

  /** Откуда открыто: hover = закрыть при mouseleave; click/storage/demo = нет */
  var openSource = "closed";

  function supportsHoverFine() {
    try {
      return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    } catch (_) {
      return false;
    }
  }

  function persistExpanded(isOpen) {
    if (!cfg.rememberState) return;
    try {
      localStorage.setItem(storageKey, isOpen ? "1" : "0");
    } catch (_) {}
  }

  if (cfg.accent) {
    root.style.setProperty("--coupon-accent", cfg.accent);
  }
  if (typeof cfg.hostBottomPx === "number") {
    root.style.setProperty("--coupon-host-bottom", cfg.hostBottomPx + "px");
  }

  /* hostInlinePx задаёт инлайн и перебивает CSS; на ≤768px снимаем его, если нет hostInlinePxMobile,
     чтобы работали значения из widget.css (по умолчанию 20px — как t135). */
  function applyHostInlineFromConfig() {
    var desktop =
      typeof cfg.hostInlinePx === "number" ? cfg.hostInlinePx : null;
    var mobile =
      typeof cfg.hostInlinePxMobile === "number"
        ? cfg.hostInlinePxMobile
        : null;

    function sync() {
      var narrow = window.matchMedia("(max-width: 768px)").matches;
      if (narrow) {
        if (mobile !== null) {
          root.style.setProperty("--coupon-host-inline", mobile + "px");
        } else if (desktop !== null) {
          root.style.removeProperty("--coupon-host-inline");
        }
      } else {
        if (desktop !== null) {
          root.style.setProperty("--coupon-host-inline", desktop + "px");
        } else {
          root.style.removeProperty("--coupon-host-inline");
        }
      }
    }

    sync();
    try {
      var mql = window.matchMedia("(max-width: 768px)");
      if (mql.addEventListener) {
        mql.addEventListener("change", sync);
      } else if (mql.addListener) {
        mql.addListener(sync);
      }
    } catch (_) {}
    window.addEventListener("orientationchange", sync);
    window.addEventListener("resize", sync);
  }

  applyHostInlineFromConfig();

  kickerEl.textContent = cfg.kicker || "10%";
  titleEl.textContent = cfg.title || "Скидка";

  var foot = (cfg.footnote || "").trim();
  if (foot && footEl) {
    footEl.textContent = foot;
    footEl.removeAttribute("hidden");
  } else if (footEl) {
    footEl.textContent = "";
    footEl.setAttribute("hidden", "");
  }

  var desc = (cfg.description || "").trim();
  if (desc) {
    descEl.textContent = desc;
    descEl.removeAttribute("hidden");
  } else {
    descEl.textContent = "";
    descEl.setAttribute("hidden", "");
  }

  codeEl.textContent = code;
  codeEl.setAttribute(
    "aria-label",
    "Промокод " + code + ", нажмите чтобы скопировать"
  );

  var copyLabel = (cfg.copyLabel || "").trim();
  var copiedLabel = cfg.copiedLabel || "Скопировано";
  if (copyLabel) {
    hintEl.textContent = copyLabel;
    hintEl.removeAttribute("hidden");
  } else {
    hintEl.textContent = "";
    hintEl.setAttribute("hidden", "");
  }

  function isNarrowMobile() {
    try {
      return window.matchMedia("(max-width: 480px)").matches;
    } catch (_) {
      return false;
    }
  }

  function syncCtaVisibility() {
    if (!ctaEl) return;
    var ctaTextCfg = cfg.ctaText;
    ctaEl.hidden = !ctaTextCfg;
  }

  function copyCode(collapseAfterCopy) {
    function hintFinish() {
      if (!hintVisible()) return;
      hintEl.textContent = copiedLabel;
      hintEl.setAttribute("data-copied", "true");
      setTimeout(function () {
        hintEl.textContent = copyLabel;
        hintEl.removeAttribute("data-copied");
      }, 2200);
    }

    function hintVisible() {
      return copyLabel && !hintEl.hasAttribute("hidden");
    }

    function ctaFinish() {
      if (!ctaEl || ctaEl.hidden) return;
      if (!(cfg.ctaText && !cfg.ctaUrl)) return;
      var prev = ctaEl.textContent;
      ctaEl.textContent = copiedLabel;
      ctaEl.disabled = true;
      setTimeout(function () {
        ctaEl.textContent = prev;
        ctaEl.disabled = false;
      }, 2200);
    }

    function finish() {
      hintFinish();
      ctaFinish();
      if (collapseAfterCopy) {
        clearDemo();
        applyExpanded(false);
      }
    }

    function fallbackCopy() {
      var ta = document.createElement("textarea");
      ta.value = code;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
        finish();
      } catch (_) {}
      document.body.removeChild(ta);
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(code).then(finish).catch(fallbackCopy);
    } else {
      fallbackCopy();
    }
  }

  var ctaText = cfg.ctaText;
  var ctaUrl = cfg.ctaUrl;
  if (ctaText && ctaUrl) {
    if (ctaEl) {
      ctaEl.textContent = ctaText;
      ctaEl.type = "button";
      ctaEl.setAttribute("aria-label", ctaText + " — открыть ссылку");
      ctaEl.addEventListener("click", function () {
        commitOpen();
        window.open(ctaUrl, "_blank", "noopener,noreferrer");
      });
    }
  } else if (ctaText) {
    if (ctaEl) {
      ctaEl.textContent = ctaText;
      ctaEl.type = "button";
      ctaEl.setAttribute("aria-label", "Скопировать промокод");
      ctaEl.addEventListener("click", function () {
        commitOpen();
        copyCode(true);
      });
    }
  }
  syncCtaVisibility();

  function getStoredExpanded() {
    if (!cfg.rememberState) return null;
    try {
      var v = localStorage.getItem(storageKey);
      if (v === "1") return true;
      if (v === "0") return false;
    } catch (_) {}
    return null;
  }

  /** Сколько ещё ждать перед показом после закрытия крестиком (0 = пауза выключена). */
  function dismissCooldownRemainingMs() {
    var ms =
      typeof cfg.dismissCooldownMs === "number"
        ? cfg.dismissCooldownMs
        : 10 * 60 * 1000;
    if (ms <= 0) return 0;
    try {
      var raw = localStorage.getItem(storageKey + ":dismissed-at");
      if (!raw) return 0;
      var at = parseInt(raw, 10);
      if (isNaN(at)) return 0;
      var left = ms - (Date.now() - at);
      return left > 0 ? left : 0;
    } catch (_) {
      return 0;
    }
  }

  function persistDismissTimestamp() {
    try {
      localStorage.setItem(storageKey + ":dismissed-at", String(Date.now()));
    } catch (_) {}
  }

  var expanded = false;
  var pointerInPanel = false;
  var hoverRevealTimer = null;
  var hoverRevealFallbackTimer = null;
  var collapseShrinkHandler = null;

  /**
   * Рельс (узкая → полная ширина перед открытием) отключён: одна ширина,
   * меньше визуальных фаз и мерцания при hover/embed.
   */
  function useRailBehavior() {
    return false;
  }

  function setRootWidthMode(mode) {
    if (!useRailBehavior()) {
      root.removeAttribute("data-panel-width");
      return;
    }
    root.setAttribute("data-panel-width", mode === "mini" ? "mini" : "full");
  }

  function clearHoverReveal() {
    if (hoverRevealTimer) {
      clearTimeout(hoverRevealTimer);
      hoverRevealTimer = null;
    }
    if (hoverRevealFallbackTimer) {
      clearTimeout(hoverRevealFallbackTimer);
      hoverRevealFallbackTimer = null;
    }
    root.removeEventListener("transitionend", onRailWidthTransitionEnd);
  }

  function onRailWidthTransitionEnd(e) {
    if (e.target !== root || e.propertyName !== "width") return;
    root.removeEventListener("transitionend", onRailWidthTransitionEnd);
    clearTimeout(hoverRevealFallbackTimer);
    hoverRevealFallbackTimer = null;
    tryOpenHoverBody();
  }

  function tryOpenHoverBody() {
    if (!pointerInPanel || expanded) return;
    applyExpanded(true, "hover");
  }

  function cancelCollapseShrinkListen() {
    if (!collapseShrinkHandler) return;
    collapseEl.removeEventListener("transitionend", collapseShrinkHandler);
    collapseShrinkHandler = null;
  }

  function scheduleShrinkRailAfterClose() {
    cancelCollapseShrinkListen();
    var fallbackMs = 550;
    function done() {
      cancelCollapseShrinkListen();
      setRootWidthMode("mini");
    }
    collapseShrinkHandler = function (e) {
      if (e.target !== collapseEl) return;
      if (
        e.propertyName !== "grid-template-columns" &&
        e.propertyName !== "grid-template-rows"
      ) {
        return;
      }
      done();
    };
    collapseEl.addEventListener("transitionend", collapseShrinkHandler);
    setTimeout(function () {
      if (collapseShrinkHandler) done();
    }, fallbackMs);
  }

  function headerAria() {
    var narrow = false;
    try {
      narrow = window.matchMedia("(max-width: 480px)").matches;
    } catch (_) {}
    var railLbl = narrow
      ? String(cfg.title || "Скидка").trim()
      : ((cfg.title || "") + " " + (cfg.kicker || "")).trim();
    if (expanded) {
      header.setAttribute("aria-label", "Свернуть: " + railLbl);
    } else {
      header.setAttribute(
        "aria-label",
        "Открыть промокод: " + (railLbl || "Скидка")
      );
    }
  }

  function commitOpen() {
    if (openSource !== "hover") return;
    openSource = "click";
    if (cfg.rememberState && expanded) persistExpanded(true);
  }

  function applyExpanded(v, source) {
    var on = !!v;
    var wasExpanded = expanded;
    expanded = on;
    clearHoverReveal();
    if (!on) {
      openSource = "closed";
      cancelCollapseShrinkListen();
      panel.setAttribute("data-expanded", "false");
      header.setAttribute("aria-expanded", "false");
      persistExpanded(false);
      headerAria();
      if (wasExpanded) {
        scheduleShrinkRailAfterClose();
      } else {
        setRootWidthMode("mini");
      }
      return;
    }

    cancelCollapseShrinkListen();
    setRootWidthMode("full");

    openSource = source || "click";
    panel.setAttribute("data-expanded", "true");
    header.setAttribute("aria-expanded", "true");
    if (openSource === "click" || openSource === "storage") {
      persistExpanded(true);
    }
    headerAria();
  }

  /** Закрытие крестиком: скрыть сейчас; на следующих страницах показ снова после dismissCooldownMs. */
  function dismissWidgetFully() {
    clearDemo();
    cancelCollapseShrinkListen();
    persistDismissTimestamp();
    applyExpanded(false);
    root.setAttribute("hidden", "");
    root.setAttribute("data-ready", "false");
  }

  function toggle() {
    clearDemo();
    if (expanded) {
      applyExpanded(false);
    } else {
      applyExpanded(true, "click");
    }
  }

  function onPanelMouseEnter() {
    pointerInPanel = true;
    if (cfg.hoverOpen === false) return;
    if (!useRailBehavior()) {
      if (!expanded) applyExpanded(true, "hover");
      return;
    }
    if (expanded) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setRootWidthMode("full");
      applyExpanded(true, "hover");
      return;
    }

    clearHoverReveal();
    setRootWidthMode("full");

    var manualMs = cfg.hoverRevealBodyMs;
    if (typeof manualMs === "number" && manualMs >= 0) {
      hoverRevealTimer = setTimeout(function () {
        hoverRevealTimer = null;
        tryOpenHoverBody();
      }, manualMs);
      return;
    }

    hoverRevealFallbackTimer = setTimeout(function () {
      hoverRevealFallbackTimer = null;
      root.removeEventListener("transitionend", onRailWidthTransitionEnd);
      tryOpenHoverBody();
    }, 550);

    root.addEventListener("transitionend", onRailWidthTransitionEnd);
  }

  function onPanelMouseLeave() {
    pointerInPanel = false;
    clearHoverReveal();
    if (expanded && openSource === "hover") {
      applyExpanded(false);
      return;
    }
    if (!expanded && supportsHoverFine()) {
      cancelCollapseShrinkListen();
      setRootWidthMode("mini");
    }
  }

  var stored = getStoredExpanded();
  var initial = stored !== null ? stored : cfg.startExpanded !== false;
  cancelCollapseShrinkListen();
  if (initial) {
    applyExpanded(true, "storage");
  } else {
    applyExpanded(false);
  }

  header.addEventListener("click", toggle);
  header.addEventListener("keydown", function (e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle();
    }
  });

  /* На ≤768px у .coupon-root pointer-events: none — hover вешаем на панель */
  panel.addEventListener("mouseenter", onPanelMouseEnter);
  panel.addEventListener("mouseleave", onPanelMouseLeave);

  panel.addEventListener("click", function (e) {
    if (header === e.target || header.contains(e.target)) return;
    clearDemo();
    commitOpen();
  });

  panel.addEventListener("focusin", function (e) {
    if (header.contains(e.target)) return;
    clearDemo();
    commitOpen();
  });

  codeEl.addEventListener("click", function (e) {
    e.stopPropagation();
    commitOpen();
    copyCode(true);
  });
  codeEl.addEventListener("keydown", function (e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();
      commitOpen();
      copyCode(true);
    }
  });

  if (closeFullEl) {
    closeFullEl.addEventListener("click", function (e) {
      e.stopPropagation();
      dismissWidgetFully();
    });
    closeFullEl.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        e.stopPropagation();
        dismissWidgetFully();
      }
    });
  }

  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape" || !expanded) return;
    if (!isNarrowMobile()) return;
    e.preventDefault();
    dismissWidgetFully();
  });

  function scheduleAutoDemo() {
    if (cfg.autoDemo === false) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (expanded) return;
    if (stored === true) return;

    var onceKey = storageKey + ":auto-demo-shown";
    if (cfg.autoDemoOncePerSession !== false) {
      try {
        if (sessionStorage.getItem(onceKey)) return;
      } catch (_) {}
    }

    var after =
      typeof cfg.autoDemoAfterMs === "number" ? cfg.autoDemoAfterMs : 900;
    var hold =
      typeof cfg.autoDemoHoldMs === "number" ? cfg.autoDemoHoldMs : 3000;

    demoTimers.push(
      setTimeout(function () {
        if (expanded) return;
        function openDemoBody() {
          if (expanded) return;
          applyExpanded(true, "demo");
          demoTimers.push(
            setTimeout(function () {
              applyExpanded(false);
              try {
                if (cfg.autoDemoOncePerSession !== false) {
                  sessionStorage.setItem(onceKey, "1");
                }
              } catch (_) {}
            }, hold)
          );
        }
        if (useRailBehavior()) {
          setRootWidthMode("full");
          var railWait =
            typeof cfg.hoverRailExpandMs === "number"
              ? cfg.hoverRailExpandMs
              : 400;
          demoTimers.push(setTimeout(openDemoBody, railWait));
        } else {
          openDemoBody();
        }
      }, after)
    );
  }

  var delay =
    (typeof cfg.showDelayMs === "number" ? cfg.showDelayMs : 0) +
    dismissCooldownRemainingMs();

  function finishShow() {
    root.setAttribute("data-ready", "true");
    scheduleAutoDemo();
  }

  function revealWhenLaidOut() {
    function go() {
      requestAnimationFrame(function () {
        requestAnimationFrame(finishShow);
      });
    }
    if (delay > 0) {
      setTimeout(go, delay);
    } else {
      go();
    }
  }

  revealWhenLaidOut();
}

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", runCouponWidget);
  } else {
    runCouponWidget();
  }
})();
