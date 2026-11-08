// Sofía — asistente virtual del chat de la página (IA).
// Habla con la función sofia-chat del CRM; cada conversación llega a Mensajes y,
// con nombre y contacto, como lead. Agenda la consulta con Calendly dentro del chat.
(function () {
  if (window.__sofia) return;
  window.__sofia = true;

  var API = window.SOFIA_API || 'https://app.rodriguezsuarezllc.com/.netlify/functions/sofia-chat';
  var CALENDLY = 'https://calendly.com/isarodriguez19960206/30min';
  var WA = 'https://wa.me/17862016327?text=' + encodeURIComponent('Hola, vengo del chat con Sofía en la página web.');
  var STORE = 'rs_sofia';
  var GREETING = 'Hola, soy Sofía, la asistente virtual de Rodriguez Suarez. Te ayudo a entender tu trámite y a agendar tu consulta gratis. ¿En qué te puedo ayudar?';
  var CHIPS = ['Asilo', 'Permiso de trabajo', 'Me mudé', 'Petición familiar', 'Residencia', 'Otra consulta'];

  // Horario del equipo: todos los días de 9:00 a 24:00 en España.
  function teamOpen() {
    try {
      var h = Number(new Intl.DateTimeFormat('en-US', { timeZone: 'Europe/Madrid', hour: 'numeric', hour12: false }).format(new Date())) % 24;
      return h >= 9 && h < 24;
    } catch (e) { return true; }
  }
  function fromGoogle() {
    try { var v = JSON.parse(localStorage.getItem('rs_src') || 'null'); return v && Date.now() - v.t < 90 * 864e5 ? v : null; } catch (e) { return null; }
  }
  function load() { try { return JSON.parse(sessionStorage.getItem(STORE) || 'null') || { msgs: [] }; } catch (e) { return { msgs: [] }; } }
  function save() { try { sessionStorage.setItem(STORE, JSON.stringify(state)); } catch (e) {} }
  function track(name, params) { if (window.gtag) window.gtag('event', name, params || {}); }

  var state = load();
  var busy = false;

  var css = '\
.sofia{--s-bg:#FFFFFF;--s-bg2:#F2F6F4;--s-ink:#0F1F17;--s-ink2:#4A6356;--s-line:rgba(15,31,23,.12);--s-brand:#064E3B;--s-brand-ink:#FFFFFF;--s-live:#10B981;--s-me:#064E3B;--s-me-ink:#F2FBF7;--s-shadow:0 24px 60px -18px rgba(6,40,28,.45);font-family:inherit;color:var(--s-ink)}\
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]) .sofia{--s-bg:#111916;--s-bg2:#18231E;--s-ink:#EEF5F1;--s-ink2:#A9BBB2;--s-line:rgba(190,255,225,.14);--s-brand:#34D399;--s-brand-ink:#05261A;--s-me:#1F6B52;--s-me-ink:#F2FBF7;--s-shadow:0 24px 60px -18px rgba(0,0,0,.7)}}\
:root[data-theme="dark"] .sofia{--s-bg:#111916;--s-bg2:#18231E;--s-ink:#EEF5F1;--s-ink2:#A9BBB2;--s-line:rgba(190,255,225,.14);--s-brand:#34D399;--s-brand-ink:#05261A;--s-me:#1F6B52;--s-me-ink:#F2FBF7;--s-shadow:0 24px 60px -18px rgba(0,0,0,.7)}\
.sofia *{box-sizing:border-box}\
.sofia-launch{position:fixed;right:var(--sofia-right,1.25rem);bottom:var(--sofia-bottom,6rem);z-index:75;display:flex;align-items:center;gap:.65rem;border:0;cursor:pointer;background:none;padding:0;font:inherit;color:var(--s-ink)}\
.sofia-orb{width:var(--sofia-size,56px);height:var(--sofia-size,56px);border-radius:50%;display:grid;place-items:center;background:var(--s-brand);color:var(--s-brand-ink);box-shadow:0 12px 28px -10px rgba(6,78,59,.6);position:relative;flex-shrink:0;transition:transform .2s}\
.sofia-orb svg{width:27px;height:27px}\
.sofia-launch:hover .sofia-orb{transform:scale(1.06)}\
.sofia-orb i,.sofia-av i{position:absolute;right:1px;bottom:1px;width:14px;height:14px;border-radius:50%;background:var(--s-live);border:2.5px solid var(--s-bg)}\
.sofia-orb::after{content:"";position:absolute;inset:0;border-radius:50%;box-shadow:0 0 0 0 rgba(16,185,129,.45)}\
.sofia-orb.ping::after{animation:sofiaPing 1.8s ease-out 2}\
.sofia-nudge{position:fixed;z-index:75;right:calc(var(--sofia-right,1.25rem) + var(--sofia-size,56px) + 10px);bottom:calc(var(--sofia-bottom,6rem) + var(--sofia-size,56px) / 2);transform:translate(8px,50%);opacity:0;visibility:hidden;pointer-events:none;display:flex;align-items:flex-start;max-width:240px;background:var(--s-bg);border:1px solid var(--s-line);border-radius:14px 14px 4px 14px;box-shadow:var(--s-shadow);transition:opacity .35s,transform .35s,visibility 0s .35s}\
.sofia-nudge.on{opacity:1;visibility:visible;pointer-events:auto;transform:translate(0,50%);transition:opacity .35s,transform .35s}\
.sofia-nudge-txt{flex:1;display:flex;flex-direction:column;align-items:flex-start;gap:.1rem;border:0;background:none;font:inherit;color:var(--s-ink);text-align:left;line-height:1.3;padding:.55rem .2rem .55rem .8rem;cursor:pointer}\
.sofia-nudge-txt b{font-size:.88rem;font-weight:700;letter-spacing:-.01em}\
.sofia-nudge-txt small{font-size:.74rem;color:var(--s-ink2)}\
.sofia-nudge-x{flex-shrink:0;width:30px;height:30px;margin:.2rem .2rem 0 0;border:0;background:none;border-radius:50%;color:var(--s-ink2);display:grid;place-items:center;cursor:pointer}\
.sofia-nudge-x:hover{background:var(--s-bg2)}\
.sofia-nudge-x svg{width:14px;height:14px}\
.sofia-av{width:40px;height:40px;border-radius:50%;display:grid;place-items:center;background:var(--s-brand);color:var(--s-brand-ink);position:relative;flex-shrink:0}\
.sofia-av svg{width:21px;height:21px}\
@keyframes sofiaPing{0%{box-shadow:0 0 0 0 rgba(16,185,129,.45)}80%,100%{box-shadow:0 0 0 14px rgba(16,185,129,0)}}\
.sofia-panel{position:fixed;right:1.25rem;bottom:1.25rem;z-index:120;width:380px;height:min(640px,calc(100vh - 2.5rem));display:flex;flex-direction:column;background:var(--s-bg);border:1px solid var(--s-line);border-radius:20px;box-shadow:var(--s-shadow);overflow:hidden;opacity:0;transform:translateY(16px) scale(.98);transform-origin:bottom right;visibility:hidden;transition:opacity .22s,transform .22s,visibility .22s}\
.sofia-panel.open{opacity:1;transform:none;visibility:visible}\
.sofia-head{display:flex;align-items:center;gap:.7rem;padding:.85rem .9rem .85rem 1rem;border-bottom:1px solid var(--s-line)}\
.sofia-who{flex:1;min-width:0}\
.sofia-who b{display:block;font-size:.95rem;line-height:1.2}\
.sofia-who small{display:block;font-size:.74rem;color:var(--s-ink2);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\
.sofia-ib{width:36px;height:36px;border-radius:10px;display:grid;place-items:center;border:0;background:none;color:var(--s-ink2);cursor:pointer;text-decoration:none}\
.sofia-ib:hover{background:var(--s-bg2);color:var(--s-ink)}\
.sofia-ib svg{width:19px;height:19px}\
.sofia-log{flex:1;overflow-y:auto;padding:1rem;display:flex;flex-direction:column;gap:.45rem;background:var(--s-bg2);overscroll-behavior:contain}\
.sofia-log>*{flex-shrink:0}\n.sofia-msg{max-width:84%;padding:.6rem .8rem;border-radius:16px;font-size:.9rem;line-height:1.45;white-space:pre-line;overflow-wrap:anywhere;animation:sofiaIn .2s ease-out}\
.sofia-msg.bot{align-self:flex-start;background:var(--s-bg);border:1px solid var(--s-line);border-bottom-left-radius:5px}\
.sofia-msg.me{align-self:flex-end;background:var(--s-me);color:var(--s-me-ink);border-bottom-right-radius:5px}\
.sofia-msg.note{align-self:center;max-width:100%;background:none;border:0;color:var(--s-ink2);font-size:.76rem;text-align:center;padding:.2rem}\
.sofia-msg.ok{align-self:stretch;max-width:100%;background:rgba(16,185,129,.12);border:1px solid rgba(16,185,129,.35);color:var(--s-ink)}\
.sofia-typing{align-self:flex-start;display:flex;gap:4px;padding:.75rem .9rem;background:var(--s-bg);border:1px solid var(--s-line);border-radius:16px;border-bottom-left-radius:5px}\
.sofia-typing i{width:6px;height:6px;border-radius:50%;background:var(--s-ink2);opacity:.4;animation:sofiaDot 1s infinite}\
.sofia-typing i:nth-child(2){animation-delay:.15s}.sofia-typing i:nth-child(3){animation-delay:.3s}\
.sofia-chips{display:flex;flex-wrap:wrap;gap:.4rem;margin-top:.15rem}\
.sofia-chips button{font:inherit;font-size:.8rem;font-weight:600;padding:.42rem .75rem;border-radius:999px;border:1px solid var(--s-line);background:var(--s-bg);color:var(--s-ink);cursor:pointer}\
.sofia-chips button:hover{border-color:var(--s-live)}\
.sofia-cal{align-self:stretch;background:var(--s-bg);border:1px solid var(--s-line);border-radius:14px;overflow:hidden}\
.sofia-cal iframe{display:block;width:100%;height:520px;border:0;background:#fff}\
.sofia-cal p{margin:0;padding:.55rem .8rem;font-size:.76rem;color:var(--s-ink2);border-top:1px solid var(--s-line)}\
.sofia-form{display:flex;align-items:flex-end;gap:.5rem;padding:.7rem .75rem calc(.7rem + env(safe-area-inset-bottom));border-top:1px solid var(--s-line);background:var(--s-bg)}\
.sofia-form textarea{flex:1;resize:none;max-height:120px;min-height:42px;padding:.65rem .85rem;border:1px solid var(--s-line);border-radius:14px;background:var(--s-bg2);color:var(--s-ink);font:inherit;font-size:16px;line-height:1.35;outline:none}\
.sofia-form textarea:focus{border-color:var(--s-live)}\
.sofia-send{width:42px;height:42px;flex-shrink:0;border-radius:12px;border:0;display:grid;place-items:center;background:var(--s-brand);color:var(--s-brand-ink);cursor:pointer}\
.sofia-send:disabled{opacity:.45;cursor:default}\
.sofia-send svg{width:18px;height:18px}\
.sofia-fine{margin:0;padding:0 1rem .55rem;font-size:.68rem;color:var(--s-ink2);background:var(--s-bg);text-align:center}\
.sofia-fine a{color:inherit;text-decoration:underline}\
.sofia :focus-visible{outline:2px solid var(--s-live);outline-offset:2px}\
@keyframes sofiaIn{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}\
@keyframes sofiaDot{0%,100%{opacity:.3;transform:translateY(0)}50%{opacity:1;transform:translateY(-2px)}}\
@media (max-width:560px){.sofia-panel{right:0;bottom:0;left:0;top:0;width:auto;height:auto;border-radius:0;border:0}.sofia-nudge{max-width:200px}}\
@media (prefers-reduced-motion:reduce){.sofia *{animation:none!important;transition:none!important}}';

  var ICON = {
    bot: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M20 12.5c0 3.87-3.58 7-8 7-1.15 0-2.25-.21-3.24-.6L4 20l1.2-3.6A6.6 6.6 0 014 12.5c0-3.87 3.58-7 8-7"/><path d="M18 2.5l.8 2.2 2.2.8-2.2.8L18 8.5l-.8-2.2-2.2-.8 2.2-.8z" fill="currentColor" stroke-width="1.2"/><circle cx="8.5" cy="12.5" r=".9" fill="currentColor" stroke="none"/><circle cx="12" cy="12.5" r=".9" fill="currentColor" stroke="none"/><circle cx="15.5" cy="12.5" r=".9" fill="currentColor" stroke="none"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    send: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h13M13 6l6 6-6 6"/></svg>',
    wa: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12c0 1.89.53 3.66 1.44 5.17L2 22l4.83-1.44A9.96 9.96 0 0012 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18a8 8 0 01-4.24-1.21l-.25-.15-2.87.85.85-2.87-.17-.28A8 8 0 1112 20zm4.47-5.62c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.26-.47-2.39-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.18-1.41-.08-.13-.27-.2-.57-.35z"/></svg>'
  };

  var root = document.createElement('div');
  root.className = 'sofia';
  root.innerHTML =
    '<style>' + css + '</style>' +
    '<button class="sofia-launch" type="button" aria-label="Abrir chat con Sofía, asistente virtual">' +
      '<span class="sofia-orb" aria-hidden="true">' + ICON.bot + '<i></i></span>' +
    '</button>' +
    '<div class="sofia-nudge" role="status">' +
      '<button class="sofia-nudge-txt" type="button"><b></b><small></small></button>' +
      '<button class="sofia-nudge-x" type="button" aria-label="Cerrar aviso">' + ICON.close + '</button>' +
    '</div>' +
    '<section class="sofia-panel" role="dialog" aria-modal="false" aria-label="Chat con Sofía" aria-hidden="true">' +
      '<header class="sofia-head">' +
        '<span class="sofia-av" aria-hidden="true">' + ICON.bot + '<i></i></span>' +
        '<div class="sofia-who"><b>Sofía</b><small class="sofia-status"></small></div>' +
        '<a class="sofia-ib" href="' + WA + '" target="_blank" rel="noopener" aria-label="Seguir por WhatsApp" title="Seguir por WhatsApp">' + ICON.wa + '</a>' +
        '<button class="sofia-ib sofia-x" type="button" aria-label="Cerrar chat">' + ICON.close + '</button>' +
      '</header>' +
      '<div class="sofia-log" aria-live="polite"></div>' +
      '<form class="sofia-form"><textarea rows="1" maxlength="1000" placeholder="Escribe tu mensaje…" aria-label="Escribe tu mensaje"></textarea>' +
        '<button class="sofia-send" type="submit" aria-label="Enviar">' + ICON.send + '</button></form>' +
      '<p class="sofia-fine">Sofía es una asistente con inteligencia artificial. No damos asesoría legal. <a href="/privacidad.html#privacidad">Privacidad</a></p>' +
    '</section>';
  document.body.appendChild(root);

  var launch = root.querySelector('.sofia-launch');
  var orb = root.querySelector('.sofia-orb');
  var nudge = root.querySelector('.sofia-nudge');
  var panel = root.querySelector('.sofia-panel');
  var log = root.querySelector('.sofia-log');
  var form = root.querySelector('.sofia-form');
  var input = form.querySelector('textarea');
  var sendBtn = form.querySelector('.sofia-send');

  // El botón va justo encima del botón de WhatsApp, centrado con él y del mismo tamaño;
  // en el celular, encima de la barra inferior.
  function place() {
    var bar = document.querySelector('.wa-bar');
    var fl = document.querySelector('.wa-float');
    var b = 20, size = 56, right = 20;
    if (bar && getComputedStyle(bar).display !== 'none') {
      b = bar.offsetHeight + 14;
    } else if (fl && getComputedStyle(fl).display !== 'none') {
      var r = fl.getBoundingClientRect();
      size = Math.round(r.width) || size;
      b = window.innerHeight - r.top + 14;
      right = document.documentElement.clientWidth - r.right;
    }
    root.style.setProperty('--sofia-bottom', b + 'px');
    root.style.setProperty('--sofia-right', right + 'px');
    root.style.setProperty('--sofia-size', size + 'px');
  }
  place();
  window.addEventListener('resize', place);

  function status() {
    root.querySelector('.sofia-status').textContent = teamOpen()
      ? 'Asistente virtual · el equipo está en línea'
      : 'Asistente virtual · te respondo ahora mismo';
  }

  function scroll() { log.scrollTop = log.scrollHeight; }
  function bubble(kind, text) {
    var d = document.createElement('div');
    d.className = 'sofia-msg ' + kind;
    d.textContent = text;
    log.appendChild(d);
    scroll();
    return d;
  }
  function push(kind, text) { state.msgs.push({ k: kind, t: text }); save(); bubble(kind, text); }

  function chips() {
    var wrap = document.createElement('div');
    wrap.className = 'sofia-chips';
    CHIPS.forEach(function (c) {
      var b = document.createElement('button');
      b.type = 'button'; b.textContent = c;
      b.onclick = function () { wrap.remove(); send(c === 'Me mudé' ? 'Me mudé y necesito cambiar mi dirección' : c === 'Otra consulta' ? 'Tengo otra consulta' : 'Necesito ayuda con: ' + c); };
      wrap.appendChild(b);
    });
    log.appendChild(wrap);
    scroll();
  }

  function calendar() {
    var old = log.querySelector('.sofia-cal'); if (old) old.remove();
    var box = document.createElement('div');
    box.className = 'sofia-cal';
    var url = CALENDLY + '?embed_type=Inline&hide_gdpr_banner=1&embed_domain=' + encodeURIComponent(location.hostname);
    box.innerHTML = '<iframe title="Elegir día y hora de la consulta" loading="lazy" src="' + url + '"></iframe><p>Elige el día y la hora que te queden mejor. Verás los horarios en tu hora local.</p>';
    log.appendChild(box);
    scroll();
  }
  window.addEventListener('message', function (e) {
    if (e.origin !== 'https://calendly.com' || !e.data || e.data.event !== 'calendly.event_scheduled') return;
    if (state.booked) return;
    state.booked = true; save();
    var cal = log.querySelector('.sofia-cal'); if (cal) cal.remove();
    push('ok', '¡Listo! Tu consulta gratis quedó agendada. Te llegará la confirmación por correo. Si necesitas algo antes, escríbeme aquí o por WhatsApp.');
    track('sofia_cita_agendada');
    if (window.adsConversion) window.adsConversion('agendar');
    if (state.chatId) fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'booked', chatId: state.chatId }) }).catch(function () {});
  });

  function typing(on) {
    var t = log.querySelector('.sofia-typing');
    if (on && !t) { t = document.createElement('div'); t.className = 'sofia-typing'; t.setAttribute('aria-label', 'Sofía está escribiendo'); t.innerHTML = '<i></i><i></i><i></i>'; log.appendChild(t); scroll(); }
    if (!on && t) t.remove();
  }

  function send(text) {
    text = (text || '').trim();
    if (!text || busy) return;
    var ch = log.querySelector('.sofia-chips'); if (ch) ch.remove();
    push('me', text);
    if (state.msgs.filter(function (m) { return m.k === 'me'; }).length === 1) track('sofia_primer_mensaje');
    busy = true; sendBtn.disabled = true; typing(true);
    var g = fromGoogle();
    var visitor = { tz: (Intl.DateTimeFormat().resolvedOptions() || {}).timeZone || '', page: location.pathname, fromGoogle: !!g, campaign: g ? g.c : '' };
    fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'message', chatId: state.chatId || null, text: text, visitor: visitor }) })
      .then(function (r) { return r.json().catch(function () { return {}; }); })
      .then(function (d) {
        typing(false);
        if (d.chatId) { state.chatId = d.chatId; save(); }
        push('bot', d.reply || d.error || 'No pude responder ahora. Escríbenos por WhatsApp y el equipo te atiende.');
        if (d.showCalendar && !state.booked) calendar();
        if (d.leadCreated) { track('generate_lead', { method: 'sofia' }); if (window.adsConversion) window.adsConversion('formulario'); }
      })
      .catch(function () {
        typing(false);
        push('bot', 'Se cortó la conexión. Inténtalo de nuevo o escríbenos por WhatsApp.');
      })
      .then(function () { busy = false; sendBtn.disabled = false; input.focus(); });
  }

  function render() {
    log.innerHTML = '';
    bubble('bot', GREETING);
    state.msgs.forEach(function (m) { bubble(m.k, m.t); });
    if (!state.msgs.length) chips();
  }

  var lastFocus = null;
  function open(ask, from) {
    if (!log.childElementCount) render();
    hideNudge(true);
    state.nudgeOff = true;
    if (typeof ask === 'string' && ask && !input.value) { input.value = ask; input.dispatchEvent(new Event('input')); }
    status();
    lastFocus = document.activeElement;
    panel.classList.add('open');
    panel.setAttribute('aria-hidden', 'false');
    launch.style.visibility = 'hidden';
    if (window.matchMedia('(max-width:560px)').matches) document.documentElement.style.overflow = 'hidden';
    setTimeout(function () { input.focus(); scroll(); }, 60);
    state.seen = true; save();
    track('sofia_abrir', { origen: typeof from === 'string' ? from : 'boton' });
  }
  // Para los botones dentro de los artículos: abren el chat con la pregunta ya escrita.
  window.openSofia = function (ask, from) { open(ask, from || 'articulo'); };
  function close() {
    panel.classList.remove('open');
    panel.setAttribute('aria-hidden', 'true');
    launch.style.visibility = '';
    document.documentElement.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  launch.addEventListener('click', function () { open(); });
  root.querySelector('.sofia-x').addEventListener('click', close);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && panel.classList.contains('open')) close(); });
  form.addEventListener('submit', function (e) { e.preventDefault(); var t = input.value; input.value = ''; input.style.height = ''; send(t); });
  input.addEventListener('keydown', function (e) { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); form.requestSubmit ? form.requestSubmit() : form.dispatchEvent(new Event('submit')); } });
  input.addEventListener('input', function () { input.style.height = ''; input.style.height = Math.min(input.scrollHeight, 120) + 'px'; });

  /* ---------- Aviso junto al botón ----------
     No se queda fijo: aparece cuando la persona ya leyó un poco, dura unos segundos y se
     recoge; después el botón late suavemente unas pocas veces. Si lo cierran, no vuelve
     en esa visita. En los artículos, el mensaje habla del tema que están leyendo. */
  var NUDGE_MS = 8000;
  var TOPICS = {
    '/blog/permiso-de-trabajo-asilo-2026.html': { t: '¿Tu permiso vence pronto?', s: 'Pregúntame si ya puedes renovarlo', q: 'Quiero renovar mi permiso de trabajo. ¿Ya puedo hacerlo?' },
    '/blog/peticion-familiar-ajuste-de-estatus.html': { t: '¿Quieres pedir a tu familiar?', s: 'Te explico el proceso y los documentos', q: 'Quiero pedir a un familiar. ¿Cómo es el proceso?' },
    '/blog/cambio-de-direccion-uscis-corte-de-inmigracion.html': { t: '¿Te mudaste hace poco?', s: 'Te ayudo a avisar a USCIS y a la corte', q: 'Me mudé y necesito cambiar mi dirección' },
    '/blog/seguro-social-despues-del-permiso-de-trabajo.html': { t: '¿Ya tienes tu permiso de trabajo?', s: 'Te explico cómo sacar tu Seguro Social', q: 'Ya tengo permiso de trabajo y quiero sacar mi Seguro Social' }
  };
  var topic = TOPICS[location.pathname];
  var nudgeTimer = null, pulsed = false, nudgeShown = false;
  function nudgeOff() { return !!state.nudgeOff || panel.classList.contains('open'); }
  function showNudge(title, sub, ask) {
    if (nudgeOff() || nudgeShown) return;
    nudgeShown = true;
    nudge.querySelector('b').textContent = title;
    nudge.querySelector('small').textContent = sub;
    nudge.dataset.ask = ask || '';
    nudge.classList.add('on');
    track('sofia_aviso', { tipo: topic ? 'tema' : 'general' });
    clearTimeout(nudgeTimer);
    nudgeTimer = setTimeout(function () { hideNudge(); }, NUDGE_MS);
  }
  function hideNudge(stop) {
    clearTimeout(nudgeTimer);
    nudge.classList.remove('on');
    if (!stop) pulse();
  }
  // Tres latidos suaves, separados unos 20 segundos; luego se queda quieto.
  function pulse() {
    if (pulsed) return;
    pulsed = true;
    [1500, 21500, 41500].forEach(function (ms) {
      setTimeout(function () {
        if (panel.classList.contains('open')) return;
        orb.classList.remove('ping'); void orb.offsetWidth; orb.classList.add('ping');
      }, ms);
    });
  }
  nudge.querySelector('.sofia-nudge-txt').addEventListener('click', function () { open(nudge.dataset.ask, topic ? 'aviso_tema' : 'aviso'); });
  nudge.querySelector('.sofia-nudge-x').addEventListener('click', function () { state.nudgeOff = true; save(); hideNudge(); });

  function readPct() {
    var h = document.documentElement.scrollHeight - window.innerHeight;
    return h > 0 ? window.scrollY / h : 1;
  }
  function maybeNudge(force) {
    if (nudgeShown || nudgeOff()) return;
    var pct = readPct();
    if (topic) {
      // En un artículo: cuando ya va por la mitad, o tras un buen rato leyendo.
      if (force === 'late' || pct >= 0.45) showNudge(topic.t, topic.s, topic.q);
    } else if (force || pct >= 0.3) {
      if (state.msgs.length) showNudge('Sigue con Sofía', 'Tu conversación sigue aquí', '');
      else showNudge('Habla con Sofía', 'Te respondo al instante, 24/7', '');
    }
  }
  if (nudgeOff()) {
    setTimeout(pulse, 6000);
  } else {
    window.addEventListener('scroll', function () { maybeNudge(); }, { passive: true });
    setTimeout(function () { maybeNudge(topic ? null : 'time'); }, 9000);
    if (topic) setTimeout(function () { maybeNudge('late'); }, 25000);
  }
})();
