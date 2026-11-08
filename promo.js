// Promoción de temporada: preparación del permiso de trabajo (I-765) sin costo para casos
// nuevos de asilo o de petición familiar con ajuste de estatus. En noviembre se presenta como
// "Black Friday"; en diciembre como "Promo de fin de año"; desde el 1 de enero no aparece.
// En el celular es una tarjeta pequeña abajo (no tapa la página); en computador, una ventana
// centrada. Sale una sola vez por visita, a los ~18 s o al bajar un poco, y si la cierran no
// vuelve en 3 días.
(function () {
  if (window.__promo) return;
  window.__promo = true;

  var END = '2026-12-31';
  var DELAY_MS = 18000, SCROLL_AT = 0.35, SNOOZE_DAYS = 3;
  var WA = 'https://wa.me/17862016327?text=' + encodeURIComponent('Hola, quiero la promoción del permiso de trabajo sin costo.');
  var ASK = 'Quiero saber de la promoción del permiso de trabajo sin costo';

  var today;
  try { today = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York' }).format(new Date()); }
  catch (e) { today = new Date().toISOString().slice(0, 10); }
  if (today > END) return;
  var kicker = today < '2026-12-01' ? 'Black Friday · todo noviembre' : 'Promo de fin de año';

  function snoozed() {
    try { var t = Number(localStorage.getItem('rs_promo_x') || 0); return t && Date.now() - t < SNOOZE_DAYS * 864e5; } catch (e) { return false; }
  }
  function seenThisVisit() { try { return sessionStorage.getItem('rs_promo_seen') === '1'; } catch (e) { return false; } }
  // Si entran por el enlace de la promoción (?promo=...), se muestra enseguida aunque la hayan cerrado antes.
  var fromLink = /[?&]promo=/.test(location.search);
  if (!fromLink && (snoozed() || seenThisVisit())) return;
  function track(name, params) { if (window.gtag) window.gtag('event', name, params || {}); }

  var css = '\
.rp{--p-bg:#FFFFFF;--p-ink:#0F1F17;--p-ink2:#4A6356;--p-line:rgba(15,31,23,.12);--p-brand:#064E3B;--p-gold:#D97706;--p-gold-bg:#FEF3C7;--p-shadow:0 30px 70px -20px rgba(6,40,28,.5);font-family:inherit;color:var(--p-ink)}\
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]) .rp{--p-bg:#111916;--p-ink:#EEF5F1;--p-ink2:#A9BBB2;--p-line:rgba(190,255,225,.14);--p-brand:#34D399;--p-gold:#FBBF24;--p-gold-bg:rgba(251,191,36,.14);--p-shadow:0 30px 70px -20px rgba(0,0,0,.75)}}\
:root[data-theme="dark"] .rp{--p-bg:#111916;--p-ink:#EEF5F1;--p-ink2:#A9BBB2;--p-line:rgba(190,255,225,.14);--p-brand:#34D399;--p-gold:#FBBF24;--p-gold-bg:rgba(251,191,36,.14);--p-shadow:0 30px 70px -20px rgba(0,0,0,.75)}\
.rp *{box-sizing:border-box}\
.rp-back{position:fixed;inset:0;z-index:95;background:rgba(10,22,17,.45);opacity:0;transition:opacity .3s}\
.rp-card{position:fixed;z-index:96;left:50%;top:50%;width:min(440px,calc(100vw - 32px));transform:translate(-50%,-46%);opacity:0;background:var(--p-bg);border:1px solid var(--p-line);border-radius:20px;box-shadow:var(--p-shadow);padding:1.5rem 1.5rem 1.25rem;transition:opacity .3s,transform .3s}\
.rp.on .rp-back{opacity:1}\
.rp.on .rp-card{opacity:1;transform:translate(-50%,-50%)}html.rp-open .sofia-launch,html.rp-open .sofia-nudge{visibility:hidden}\
.rp-x{position:absolute;top:.6rem;right:.6rem;width:34px;height:34px;border:0;border-radius:50%;background:none;color:var(--p-ink2);display:grid;place-items:center;cursor:pointer}\
.rp-x:hover{background:rgba(127,127,127,.12)}\
.rp-x svg{width:16px;height:16px}\
.rp-kick{display:inline-block;font-size:.72rem;font-weight:800;letter-spacing:.09em;text-transform:uppercase;color:var(--p-gold);background:var(--p-gold-bg);padding:.3rem .65rem;border-radius:99px;margin-bottom:.75rem}\
.rp h2{margin:0 0 .5rem;font-size:1.4rem;line-height:1.2;letter-spacing:-.01em;color:var(--p-ink);text-wrap:balance}\
.rp p{margin:0 0 1rem;font-size:.95rem;line-height:1.5;color:var(--p-ink2)}\
.rp p b{color:var(--p-ink)}\
.rp-btns{display:flex;flex-direction:column;gap:.5rem}\
.rp-btn{display:flex;align-items:center;justify-content:center;gap:.5rem;width:100%;border:0;border-radius:12px;padding:.8rem 1rem;font:inherit;font-size:.95rem;font-weight:700;cursor:pointer;text-decoration:none}\
.rp-btn svg{width:19px;height:19px;flex-shrink:0}\
.rp-sofia{background:var(--p-brand);color:#fff}\
:root[data-theme="dark"] .rp-sofia{color:#05261A}\
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]) .rp-sofia{color:#05261A}}\
.rp-wa{background:#25D366;color:#fff}\
.rp-fine{margin:.85rem 0 0!important;font-size:.72rem!important;line-height:1.45!important;color:var(--p-ink2)}\
@media (max-width:640px){\
.rp-back{display:none}\
.rp-card{left:10px;right:10px;top:auto;bottom:calc(var(--rp-bottom,16px));width:auto;transform:translateY(16px);padding:.8rem .85rem .7rem;border-radius:16px}\
.rp.on .rp-card{transform:none}\
.rp h2{font-size:1rem;margin-bottom:.3rem;padding-right:1.8rem}\
.rp p{font-size:.8rem;line-height:1.4;margin-bottom:.55rem}\
.rp-kick{font-size:.62rem;margin-bottom:.4rem;padding:.22rem .55rem}\
.rp-btns{flex-direction:row}\
.rp-btn{padding:.55rem .5rem;font-size:.82rem;border-radius:10px}\
.rp-fine{font-size:.62rem!important;line-height:1.35!important;margin-top:.45rem!important}.rp-x{top:.35rem;right:.35rem}\
}\
@media (prefers-reduced-motion:reduce){.rp *{transition:none!important}}';

  var ICON = {
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    chat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 12.5c0 3.87-3.58 7-8 7-1.15 0-2.25-.21-3.24-.6L4 20l1.2-3.6A6.6 6.6 0 014 12.5c0-3.87 3.58-7 8-7s8 3.13 8 7z"/></svg>',
    wa: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12c0 1.89.53 3.66 1.44 5.17L2 22l4.83-1.44A9.96 9.96 0 0012 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18a8 8 0 01-4.24-1.21l-.25-.15-2.87.85.85-2.87-.17-.28A8 8 0 1112 20z"/></svg>'
  };

  var root, shown = false;
  function build() {
    root = document.createElement('div');
    root.className = 'rp';
    root.innerHTML = '<style>' + css + '</style>' +
      '<div class="rp-back"></div>' +
      '<section class="rp-card" role="dialog" aria-modal="false" aria-labelledby="rp-title">' +
        '<button class="rp-x" type="button" aria-label="Cerrar promoción">' + ICON.close + '</button>' +
        '<span class="rp-kick">' + kicker + '</span>' +
        '<h2 id="rp-title">Preparación de tu permiso de trabajo sin costo</h2>' +
        '<p>Contrata tu caso de <b>asilo</b> o de <b>petición familiar con ajuste de estatus</b> y te preparamos también el permiso de trabajo (I-765) sin cobrar nuestro servicio.</p>' +
        '<div class="rp-btns">' +
          '<button class="rp-btn rp-sofia" type="button">' + ICON.chat + 'Pregúntale a Sofía</button>' +
          '<a class="rp-btn rp-wa" href="' + WA + '" target="_blank" rel="noopener" data-cta="promo">' + ICON.wa + 'WhatsApp</a>' +
        '</div>' +
        '<p class="rp-fine">Solo clientes nuevos, casos contratados hasta el 31/12/2026, cuando califiques para pedir el permiso (en asilo, desde los 150 días). Tarifas de USCIS aparte; el permiso lo decide USCIS. No somos abogados.</p>' +
      '</section>';
    document.body.appendChild(root);
    root.querySelector('.rp-x').addEventListener('click', function () { dismiss('cerrar'); });
    root.querySelector('.rp-back').addEventListener('click', function () { dismiss('fuera'); });
    root.querySelector('.rp-sofia').addEventListener('click', function () {
      track('promo_click', { canal: 'sofia' });
      hide();
      if (window.openSofia) window.openSofia(ASK, 'promo'); else location.href = WA;
    });
    root.querySelector('.rp-wa').addEventListener('click', function () { track('promo_click', { canal: 'whatsapp' }); hide(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && shown) dismiss('esc'); });
  }

  // En el celular la tarjeta va encima de la barra de WhatsApp.
  function placeMobile() {
    var bar = document.querySelector('.wa-bar');
    var b = bar && getComputedStyle(bar).display !== 'none' && bar.offsetHeight ? bar.offsetHeight + 10 : 12;
    root.style.setProperty('--rp-bottom', b + 'px');
  }

  function cookieOpen() {
    var c = document.getElementById('cookie-banner') || document.querySelector('.cookie-banner, .cookie');
    return !!c && c.offsetParent !== null && getComputedStyle(c).display !== 'none' && getComputedStyle(c).visibility !== 'hidden';
  }

  function show(trigger) {
    if (shown || (!fromLink && (snoozed() || seenThisVisit()))) return;
    var sofiaOpen = document.querySelector('.sofia-panel.open');
    if (sofiaOpen || cookieOpen()) { setTimeout(function () { show(trigger); }, 4000); return; }
    shown = true;
    try { sessionStorage.setItem('rs_promo_seen', '1'); } catch (e) {}
    if (!root) build();
    placeMobile();
    window.__promoOpen = true;
    document.documentElement.classList.add('rp-open');
    setTimeout(function () { root.classList.add('on'); }, 30);
    track('promo_ver', { momento: trigger, tipo: kicker });
  }
  function hide() {
    if (!root) return;
    root.classList.remove('on');
    window.__promoOpen = false;
    document.documentElement.classList.remove('rp-open');
    setTimeout(function () { if (root) root.style.display = 'none'; }, 350);
  }
  function dismiss(how) {
    try { localStorage.setItem('rs_promo_x', String(Date.now())); } catch (e) {}
    track('promo_cerrar', { como: how });
    hide();
  }

  function pct() {
    var h = document.documentElement.scrollHeight - window.innerHeight;
    return h > 0 ? window.scrollY / h : 0;
  }
  var armed = Date.now();
  window.addEventListener('scroll', function () {
    if (!shown && Date.now() - armed > 6000 && pct() >= SCROLL_AT) show('scroll');
  }, { passive: true });
  setTimeout(function () { show(fromLink ? 'enlace' : 'tiempo'); }, fromLink ? 1500 : DELAY_MS);
  // En computador, también cuando el mouse va a salir de la página (a cerrar o cambiar de pestaña).
  if (window.matchMedia('(min-width:641px)').matches) {
    document.addEventListener('mouseout', function (e) {
      if (!shown && !e.relatedTarget && e.clientY <= 0 && Date.now() - armed > 5000) show('salida');
    });
  }
})();
