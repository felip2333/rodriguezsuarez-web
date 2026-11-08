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

  // Estética de "Black Friday": fondo verde casi negro con dorado, siempre oscura a propósito
  // (se ve igual en tema claro u oscuro). Animaciones: entrada con rebote, cinta que corre,
  // brillo que cruza el "100%", "DESCUENTO" que late y destellos. Sin movimiento si el
  // dispositivo pide reducir movimiento.
  var css = '\
.rp{--p-bg:#06140E;--p-bg2:#0B2A1E;--p-ink:#F4F1E8;--p-ink2:#B9C9BF;--p-gold:#FBBF24;--p-gold2:#F59E0B;--p-gold3:#FDE68A;--p-line:rgba(251,191,36,.35);font-family:inherit;color:var(--p-ink)}\
.rp *{box-sizing:border-box}\
.rp-back{position:fixed;inset:0;z-index:95;background:rgba(4,12,9,.62);opacity:0;transition:opacity .3s}\
.rp-card{position:fixed;z-index:96;left:50%;top:50%;width:min(460px,calc(100vw - 32px));transform:translate(-50%,-50%) scale(.85);opacity:0;overflow:hidden;background:radial-gradient(120% 90% at 50% 0%,var(--p-bg2) 0%,var(--p-bg) 65%);border:1.5px solid var(--p-line);border-radius:22px;box-shadow:0 0 0 1px rgba(0,0,0,.4),0 30px 80px -20px rgba(0,0,0,.7),0 0 60px -10px rgba(251,191,36,.35);padding:0 0 1.15rem}\
.rp.on .rp-back{opacity:1}\
.rp.on .rp-card{opacity:1;transform:translate(-50%,-50%) scale(1);transition:opacity .25s,transform .55s cubic-bezier(.2,1.6,.4,1)}\
html.rp-open .sofia-launch,html.rp-open .sofia-nudge{visibility:hidden}\
.rp-x{position:absolute;z-index:3;top:2.6rem;right:.55rem;width:34px;height:34px;border:0;border-radius:50%;background:rgba(255,255,255,.08);color:var(--p-ink);display:grid;place-items:center;cursor:pointer}\
.rp-x:hover{background:rgba(255,255,255,.16)}\
.rp-x svg{width:16px;height:16px}\
.rp-tape{display:flex;overflow:hidden;background:linear-gradient(90deg,var(--p-gold2),var(--p-gold),var(--p-gold2));color:#1A1205;font-size:.78rem;font-weight:900;letter-spacing:.14em;text-transform:uppercase;white-space:nowrap;padding:.45rem 0;border-bottom:1px solid rgba(0,0,0,.25)}\
.rp-tape span{flex-shrink:0;padding-right:1.4rem;animation:rpTape 14s linear infinite}\
@keyframes rpTape{to{transform:translateX(-100%)}}\
.rp-in{padding:1rem 1.4rem 0;text-align:center;position:relative}\
.rp-big{position:relative;display:inline-flex;align-items:center;gap:.6rem;margin:.35rem 0 .2rem}\
.rp-pct{font-size:4.6rem;font-weight:900;line-height:.9;letter-spacing:-.04em;background:linear-gradient(110deg,var(--p-gold2) 0%,var(--p-gold3) 28%,var(--p-gold) 45%,#fff 50%,var(--p-gold) 55%,var(--p-gold2) 100%);background-size:250% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;animation:rpShine 3.2s ease-in-out infinite;filter:drop-shadow(0 4px 18px rgba(251,191,36,.35))}\
@keyframes rpShine{0%{background-position:100% 0}60%,100%{background-position:0 0}}\
.rp-off{display:flex;flex-direction:column;align-items:flex-start;line-height:1;text-align:left}\
.rp-off small{font-size:.95rem;font-weight:800;color:var(--p-ink);letter-spacing:.02em}\
.rp-off b{margin-top:.25rem;font-size:1.35rem;font-weight:900;letter-spacing:.06em;color:#1A1205;background:var(--p-gold);padding:.25rem .5rem .2rem;border-radius:7px;transform-origin:center;animation:rpBeat 1.6s ease-in-out infinite}\
@keyframes rpBeat{0%,100%{transform:scale(1) rotate(-2deg)}50%{transform:scale(1.12) rotate(2deg)}}\
.rp-spark{position:absolute;width:18px;height:18px;color:var(--p-gold3);animation:rpTwinkle 2.4s ease-in-out infinite}\
.rp-spark.s1{top:-6px;left:-18px}\
.rp-spark.s2{bottom:-4px;right:-22px;width:14px;height:14px;animation-delay:.8s}\
.rp-spark.s3{top:8px;right:-30px;width:11px;height:11px;animation-delay:1.5s}\
@keyframes rpTwinkle{0%,100%{opacity:0;transform:scale(.4) rotate(0)}50%{opacity:1;transform:scale(1) rotate(45deg)}}\
.rp h2{margin:.35rem 0 .45rem;font-size:1.2rem;line-height:1.25;color:var(--p-ink);text-wrap:balance}\
.rp h2 em{font-style:normal;color:var(--p-gold)}\
.rp p{margin:0 0 .95rem;font-size:.9rem;line-height:1.45;color:var(--p-ink2)}\
.rp p b{color:var(--p-ink)}\
.rp-btns{display:flex;flex-direction:column;gap:.5rem;padding:0 1.4rem}\
.rp-btn{position:relative;overflow:hidden;display:flex;align-items:center;justify-content:center;gap:.5rem;width:100%;border:0;border-radius:12px;padding:.85rem 1rem;font:inherit;font-size:.98rem;font-weight:800;cursor:pointer;text-decoration:none}\
.rp-btn svg{width:19px;height:19px;flex-shrink:0}\
.rp-sofia{background:linear-gradient(180deg,var(--p-gold3),var(--p-gold) 45%,var(--p-gold2));color:#1A1205;box-shadow:0 8px 24px -8px rgba(251,191,36,.7)}\
.rp-sofia::after{content:"";position:absolute;top:0;bottom:0;left:-40%;width:30%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.65),transparent);transform:skewX(-20deg);animation:rpSweep 2.8s ease-in-out infinite 1s}\
@keyframes rpSweep{0%{left:-40%}55%,100%{left:130%}}\
.rp-wa{background:#25D366;color:#fff}\
.rp-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}\
.rp-fine{margin:.8rem 1.4rem 0!important;font-size:.68rem!important;line-height:1.45!important;color:#8FA399!important;text-align:center}\
@media (max-width:640px){\
.rp-back{display:none}\
.rp-card{left:8px;right:8px;top:auto;bottom:calc(var(--rp-bottom,12px));width:auto;transform:translateY(40px) scale(.95);border-radius:18px;padding-bottom:.75rem}\
.rp.on .rp-card{transform:none}\
.rp-tape{font-size:.7rem;padding:.38rem 0}\
.rp-x{top:2.25rem;right:.4rem;width:30px;height:30px}\
.rp-in{padding:.6rem .9rem 0}\
.rp-pct{font-size:3.4rem}\
.rp-off small{font-size:.82rem}\
.rp-off b{font-size:1.08rem}\
.rp h2{font-size:1rem;margin:.25rem 0 .3rem}\
.rp p{font-size:.8rem;margin-bottom:.6rem}\
.rp-btns{flex-direction:row;padding:0 .9rem}\
.rp-btn{padding:.65rem .4rem;font-size:.86rem;border-radius:10px;white-space:nowrap}\n.rp-sofia svg{display:none}\
.rp-fine{margin:.5rem .9rem 0!important;font-size:.6rem!important;line-height:1.35!important}\
}\
@media (prefers-reduced-motion:reduce){.rp *,.rp *::after{animation:none!important;transition:none!important}}';

  var ICON = {
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    chat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 12.5c0 3.87-3.58 7-8 7-1.15 0-2.25-.21-3.24-.6L4 20l1.2-3.6A6.6 6.6 0 014 12.5c0-3.87 3.58-7 8-7s8 3.13 8 7z"/></svg>',
    wa: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12c0 1.89.53 3.66 1.44 5.17L2 22l4.83-1.44A9.96 9.96 0 0012 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18a8 8 0 01-4.24-1.21l-.25-.15-2.87.85.85-2.87-.17-.28A8 8 0 1112 20z"/></svg>'
  };

  var tapeText = (today < '2026-12-01' ? 'Black Friday · todo noviembre' : 'Promo de fin de año') + ' · 100% de descuento · ';
  var tape = '<span>' + tapeText + tapeText + tapeText + '</span>';
  var root, shown = false;
  function build() {
    root = document.createElement('div');
    root.className = 'rp';
    root.innerHTML = '<style>' + css + '</style>' +
      '<div class="rp-back"></div>' +
      '<section class="rp-card" role="dialog" aria-modal="false" aria-labelledby="rp-title">' +
        '<button class="rp-x" type="button" aria-label="Cerrar promoción">' + ICON.close + '</button>' +
        '<div class="rp-tape" aria-hidden="true">' + tape + tape + '</div>' +
        '<div class="rp-in">' +
          '<div class="rp-big" aria-hidden="true">' +
            '<svg class="rp-spark s1" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0l2.6 9.4L24 12l-9.4 2.6L12 24l-2.6-9.4L0 12l9.4-2.6z"/></svg>' +
            '<span class="rp-pct">100%</span>' +
            '<span class="rp-off"><small>DE</small><b>DESCUENTO</b></span>' +
            '<svg class="rp-spark s2" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0l2.6 9.4L24 12l-9.4 2.6L12 24l-2.6-9.4L0 12l9.4-2.6z"/></svg>' + '<svg class="rp-spark s3" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0l2.6 9.4L24 12l-9.4 2.6L12 24l-2.6-9.4L0 12l9.4-2.6z"/></svg>' +
          '</div>' +
          '<h2 id="rp-title"><span class="rp-sr">' + kicker + ': 100% de descuento </span>en la preparación de tu <em>permiso de trabajo</em></h2>' +
          '<p>Al contratar tu caso de <b>asilo</b> o de <b>petición familiar con ajuste de estatus</b>. Te preparamos el I-765 sin cobrar nuestro servicio.</p>' +
        '</div>' +
        '<div class="rp-btns">' +
          '<button class="rp-btn rp-sofia" type="button">' + ICON.chat + 'Quiero el descuento</button>' +
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

  // En el celular la tarjeta va encima de lo que haya abajo: el aviso de cookies o la barra de WhatsApp.
  function visibleBottom(el) {
    if (!el) return 0;
    var cs = getComputedStyle(el), r = el.getBoundingClientRect();
    if (cs.display === 'none' || cs.visibility === 'hidden' || r.height === 0 || r.top >= window.innerHeight) return 0;
    return window.innerHeight - r.top;
  }
  function cookieEl() { return document.getElementById('cookie-banner') || document.querySelector('.cookie-banner'); }
  function placeMobile() {
    var used = Math.max(visibleBottom(cookieEl()), visibleBottom(document.querySelector('.wa-bar')));
    root.style.setProperty('--rp-bottom', (used ? used + 10 : 12) + 'px');
  }

  function show(trigger) {
    if (shown || (!fromLink && (snoozed() || seenThisVisit()))) return;
    if (document.querySelector('.sofia-panel.open')) { setTimeout(function () { show(trigger); }, 4000); return; }
    shown = true;
    try { sessionStorage.setItem('rs_promo_seen', '1'); } catch (e) {}
    if (!root) build();
    placeMobile();
    // Si aceptan o cierran las cookies con la promo abierta, la tarjeta baja a su lugar.
    var ck = cookieEl();
    if (ck) ck.addEventListener('click', function () { setTimeout(placeMobile, 350); });
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
