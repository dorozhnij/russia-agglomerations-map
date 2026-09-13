(function () {
  "use strict";

  var STORAGE_KEY = "urbanica_pd_cookie_consent";
  var PRIVACY_HREF = "privacy.html";
  var ABOUT_HREF = "about.html";
  var SITEMAP_HREF = "sitemap.html";
  var TELEGRAM_HREF = "https://t.me/urbanica_spb";
  var TELEGRAM_ICON =
    '<svg class="site-telegram-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
    '<path fill="currentColor" d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>' +
    "</svg>";

  function telegramLinkHtml() {
    return (
      '<a class="site-telegram" href="' +
      TELEGRAM_HREF +
      '" target="_blank" rel="noopener noreferrer" aria-label="Подписывайтесь на Telegram-канал Урбаники">' +
      TELEGRAM_ICON +
      "<span>Подписывайтесь</span></a>"
    );
  }

  function injectStyles() {
    if (document.getElementById("site-legal-styles")) return;
    var style = document.createElement("style");
    style.id = "site-legal-styles";
    style.textContent = [
      ".site-legal{display:flex;flex-wrap:wrap;align-items:flex-start;gap:12px 32px;max-width:46rem}",
      ".site-legal a{color:inherit;text-decoration:none;border-bottom:none;line-height:1.35}",
      ".site-legal a:hover{color:#FE6643}",
      ".site-legal-req{display:block;margin-top:3px;font-size:12px;opacity:.78;font-weight:400}",
      "footer.page-foot .site-legal{flex:1 1 100%;padding-top:6px}",
      "footer.page-foot .site-legal a{border-bottom:none}",
      ".footer-links .site-legal{max-width:none}",
      ".site-telegram{display:inline-flex;align-items:center;gap:8px;color:inherit;text-decoration:none;border-bottom:none;font-weight:600;white-space:nowrap;line-height:1}",
      ".site-telegram:hover{color:#FE6643}",
      ".site-telegram:focus-visible{outline:2px solid #FE6643;outline-offset:3px}",
      ".site-telegram-icon{width:20px;height:20px;display:block;flex-shrink:0}",
      "footer.page-foot .site-telegram{margin-left:auto;border-bottom:none}",
      "footer.page-foot .site-telegram:hover{border-bottom:none;color:#FE6643}",
      "@media (max-width:560px){.footer-links .site-legal,.site-legal{justify-content:center;text-align:center}.site-telegram{justify-content:center}footer.page-foot .site-telegram{margin-left:0;width:100%;justify-content:center}}",
      ".cookie-consent{position:fixed;z-index:4000;left:24px;bottom:24px;width:min(392px,calc(100vw - 32px));padding:22px 22px 20px;background:#fff;color:#1a1a1a;border:1px solid #e6e6e6;box-shadow:0 16px 48px rgba(0,0,0,.14);font-family:inherit;line-height:1.45;-webkit-font-smoothing:antialiased}",
      ".cookie-consent[hidden]{display:none}",
      ".cookie-consent-kicker{margin:0 0 8px;font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:#888}",
      ".cookie-consent p{margin:0 0 12px;font-size:14px;color:#333}",
      ".cookie-consent-policy{display:inline;font-size:13px;color:#1a1a1a;text-decoration:none;border-bottom:1px solid #d0d0d0}",
      ".cookie-consent-policy:hover{color:#FE6643;border-bottom-color:#FE6643}",
      ".cookie-consent-actions{display:flex;justify-content:flex-end;margin-top:16px}",
      ".cookie-consent-accept{appearance:none;border:0;background:#FE6643;color:#fff;font-family:inherit;font-size:14px;font-weight:600;padding:10px 18px;border-radius:8px;cursor:pointer}",
      ".cookie-consent-accept:hover{background:#e05535}",
      ".cookie-consent-accept:focus-visible{outline:2px solid #FE6643;outline-offset:3px}",
      "@media (max-width:560px){.cookie-consent{left:12px;right:12px;bottom:12px;width:auto;padding:18px 16px 16px}.cookie-consent-accept{width:100%}.cookie-consent-actions{display:block}}",
      "@media (prefers-reduced-motion:reduce){.cookie-consent-accept{transition:none}}"
    ].join("");
    document.head.appendChild(style);
  }

  function hasConsent() {
    try {
      return window.localStorage.getItem(STORAGE_KEY) === "accepted";
    } catch (err) {
      return false;
    }
  }

  function saveConsent() {
    try {
      window.localStorage.setItem(STORAGE_KEY, "accepted");
    } catch (err) {}
  }

  function legalLinksHtml() {
    return (
      '<a href="' +
      PRIVACY_HREF +
      '">Политика в отношении обработки персональных данных</a>' +
      '<a href="' +
      ABOUT_HREF +
      '">ИТП «Урбаника»<span class="site-legal-req">ИНН 7840413341 ОГРН 1097847144856</span></a>' +
      '<a href="' +
      SITEMAP_HREF +
      '">Карта сайта</a>'
    );
  }

  function ensureSitemapLink() {
    var nav = document.querySelector(".site-legal");
    if (!nav || nav.querySelector('a[href="' + SITEMAP_HREF + '"]')) return;
    var link = document.createElement("a");
    link.href = SITEMAP_HREF;
    link.textContent = "Карта сайта";
    nav.appendChild(link);
  }

  function ensureFooterLinks() {
    if (document.querySelector(".site-legal")) {
      ensureSitemapLink();
      return;
    }
    var footer = document.querySelector("footer");
    if (!footer) return;

    var nav = document.createElement("nav");
    nav.className = "site-legal";
    nav.setAttribute("aria-label", "Правовая информация");
    nav.innerHTML = legalLinksHtml();

    var host = footer.querySelector(".footer-links") || footer;
    host.insertBefore(nav, host.firstChild);
  }

  function ensureTelegramLink() {
    if (document.querySelector(".site-telegram")) return;
    var footer = document.querySelector("footer");
    if (!footer) return;

    var wrap = document.createElement("div");
    wrap.innerHTML = telegramLinkHtml();
    var link = wrap.firstChild;

    var footerLinks = footer.querySelector(".footer-links");
    if (footerLinks) {
      var share = footerLinks.querySelector(".share-btn, #shareBtn");
      if (share) footerLinks.insertBefore(link, share);
      else footerLinks.appendChild(link);
      return;
    }

    var legal = footer.querySelector(".site-legal");
    if (legal && legal.parentNode) {
      legal.parentNode.insertBefore(link, legal);
      return;
    }

    footer.appendChild(link);
  }

  function showCookieDialog() {
    if (hasConsent()) return;
    if (document.getElementById("cookieConsent")) return;

    var box = document.createElement("div");
    box.id = "cookieConsent";
    box.className = "cookie-consent";
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-modal", "false");
    box.setAttribute("aria-labelledby", "cookieConsentTitle");
    box.setAttribute("aria-describedby", "cookieConsentText");
    box.innerHTML =
      '<p class="cookie-consent-kicker" id="cookieConsentTitle">Cookies и персональные данные</p>' +
      '<p id="cookieConsentText">Сайт использует файлы cookie и обрабатывает персональные данные. Нажимая «Принять», вы даете согласие на обработку в соответствии с политикой. Оператор — ИТП «Урбаника».</p>' +
      '<a class="cookie-consent-policy" href="' +
      PRIVACY_HREF +
      '">Политика в отношении обработки персональных данных</a>' +
      '<div class="cookie-consent-actions"><button type="button" class="cookie-consent-accept">Принять</button></div>';

    document.body.appendChild(box);
    var button = box.querySelector(".cookie-consent-accept");
    button.addEventListener("click", function () {
      saveConsent();
      box.hidden = true;
      box.remove();
    });
  }

  function boot() {
    injectStyles();
    ensureFooterLinks();
    ensureTelegramLink();
    showCookieDialog();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
