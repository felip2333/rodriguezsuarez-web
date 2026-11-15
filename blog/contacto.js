// Blog: llevar a WhatsApp a quien está leyendo.
//  1) Un recuadro con botón de WhatsApp justo después del primer párrafo del artículo.
//  2) En el celular, una barra fija abajo que aparece al pasar la foto de portada.
// El texto y el mensaje de WhatsApp cambian según el artículo.
(function () {
  var WA = '17862016327';
  var TOPICS = {
    'peticion-familiar-ajuste-de-estatus': { q: '¿Quieres pedir a tu familiar?', s: 'Te decimos qué formularios aplican a tu caso.', m: 'Hola, quiero información para pedir a un familiar (petición familiar).' },
    'asilo-en-estados-unidos-2026': { q: '¿Necesitas ayuda con tu asilo?', s: 'Te decimos qué formularios aplican a tu caso.', m: 'Hola, quiero información sobre la solicitud de asilo.' },
    'permiso-de-trabajo-asilo-2026': { q: '¿Quieres pedir tu permiso de trabajo?', s: 'Revisamos si ya puedes pedirlo y lo preparamos.', m: 'Hola, quiero información para pedir mi permiso de trabajo.' },
    'cancelacion-de-deportacion-2026': { q: '¿Tienes un caso en la corte?', s: 'Te orientamos con los documentos y trámites.', m: 'Hola, tengo un caso en la corte de inmigración y quiero información.' },
    'cambio-de-direccion-uscis-corte-de-inmigracion': { q: '¿Te mudaste?', s: 'Te ayudamos a avisar a USCIS y a la corte a tiempo.', m: 'Hola, me mudé y necesito cambiar mi dirección con USCIS o la corte.' },
    'seguro-social-despues-del-permiso-de-trabajo': { q: '¿Ya tienes tu permiso de trabajo?', s: 'Te ayudamos a pedir tu Seguro Social.', m: 'Hola, quiero ayuda para pedir mi número de Seguro Social.' }
  };
  var slug = (location.pathname.match(/\/blog\/([^/.]+)/) || [])[1];
  var t = TOPICS[slug];
  var article = document.querySelector('article');
  if (!t || !article) return;
  var href = 'https://wa.me/' + WA + '?text=' + encodeURIComponent(t.m);
  var ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12c0 1.89.53 3.66 1.44 5.17L2 22l4.83-1.44A9.96 9.96 0 0012 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm4.47 12.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.26-.47-2.39-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.18-1.41-.08-.13-.27-.2-.57-.35z"/></svg>';

  var st = document.createElement('style');
  st.textContent =
    '.rs-intro{display:flex;align-items:center;gap:1rem;flex-wrap:wrap;margin:1.4rem 0 1.8rem;padding:1rem 1.15rem;border:1px solid rgba(37,211,102,.35);border-radius:14px;background:rgba(37,211,102,.07)}' +
    '.rs-intro div{flex:1;min-width:200px;line-height:1.35}.rs-intro b{display:block;font-size:1.02rem}.rs-intro span{font-size:.9rem;opacity:.8}' +
    '.rs-wa{display:inline-flex;align-items:center;gap:.5rem;padding:.7rem 1.05rem;border-radius:999px;background:#25D366;color:#05361C!important;font-weight:700;font-size:.95rem;text-decoration:none!important;white-space:nowrap}' +
    '.rs-wa svg{width:19px;height:19px}' +
    '.wa-bar{display:none}' +
    '@media(max-width:760px){' +
      '.wa-bar{display:flex;align-items:center;gap:.7rem;position:fixed;left:0;right:0;bottom:0;z-index:70;padding:.6rem .75rem calc(.6rem + env(safe-area-inset-bottom));background:rgba(255,255,255,.94);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);border-top:1px solid rgba(0,0,0,.08);transform:translateY(110%);transition:transform .35s ease}' +
      '.wa-bar.show{transform:none}.wa-bar div{flex:1;min-width:0;line-height:1.25;font-size:.82rem;color:#0F1F17}.wa-bar div b{display:block;font-size:.88rem}' +
      '.wa-bar .rs-wa{padding:.6rem .9rem;font-size:.88rem}' +
      'body.has-wa-bar .wa-float{display:none!important}' +
      'body.has-wa-bar{padding-bottom:4.5rem}' +
    '}' +
    '@media(prefers-color-scheme:dark){.wa-bar{background:rgba(17,25,22,.94)!important}.wa-bar div{color:#EEF5F1!important}}' +
    '@media(prefers-reduced-motion:reduce){.wa-bar{transition:none}}';
  document.head.appendChild(st);

  // 1) Recuadro después del primer párrafo
  var firstP = article.querySelector('img.cover ~ p') || article.querySelector('p:not(.article-meta)');
  if (firstP) {
    var box = document.createElement('div');
    box.className = 'rs-intro';
    box.innerHTML = '<div><b>' + t.q + '</b><span>' + t.s + ' Consulta gratis y en español.</span></div><a class="rs-wa" href="' + href + '" target="_blank" rel="noopener" data-cta="blog_inicio">' + ICON + 'Escríbenos por WhatsApp</a>';
    firstP.after(box);
  }

  // 2) Barra fija en el celular
  var bar = document.createElement('div');
  bar.className = 'wa-bar';
  bar.innerHTML = '<div><b>' + t.q + '</b>' + t.s + '</div><a class="rs-wa" href="' + href + '" target="_blank" rel="noopener" data-cta="blog_barra">' + ICON + 'WhatsApp</a>';
  document.body.appendChild(bar);
  document.body.classList.add('has-wa-bar');
  var cover = article.querySelector('img.cover');
  function onScroll() {
    var limit = cover ? cover.getBoundingClientRect().bottom : 300;
    bar.classList.toggle('show', limit < 0 || window.scrollY > 500);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
// Formularios que se pueden tocar: cada código (I-130, I-485…) dentro del artículo abre una
// explicación corta y un botón para preguntar por WhatsApp. Así esos toques que antes no
// hacían nada llevan a una conversación.
(function () {
  var FORMS = {
    'I-130': ['Petición familiar', 'Un ciudadano o residente pide a su familiar ante USCIS.'],
    'I-130A': ['Datos del cónyuge', 'Información del esposo o esposa que va junto con el I-130.'],
    'I-485': ['Ajuste de estatus', 'La solicitud de residencia (green card) sin salir de EE. UU.'],
    'I-765': ['Permiso de trabajo', 'La solicitud para trabajar legalmente en EE. UU.'],
    'I-589': ['Solicitud de asilo', 'El formulario para pedir asilo y la suspensión de deportación.'],
    'I-864': ['Patrocinio económico', 'El peticionario demuestra que puede apoyar a su familiar.'],
    'I-693': ['Examen médico', 'Lo hace un médico autorizado por USCIS y va en sobre sellado.'],
    'I-131': ['Permiso de viaje', 'Para salir y volver a EE. UU. mientras el caso sigue pendiente.'],
    'I-94': ['Registro de entrada', 'El documento que muestra cuándo y cómo entraste al país.'],
    'I-797': ['Aviso de USCIS', 'Las cartas de recibo y de aprobación que envía USCIS.'],
    'AR-11': ['Cambio de dirección (USCIS)', 'Para avisar a USCIS que te mudaste, dentro de 10 días.'],
    'EOIR-33': ['Cambio de dirección (corte)', 'Para avisar a la corte de inmigración tu nueva dirección.'],
    'EOIR-42B': ['Cancelación de deportación', 'Para personas sin residencia con 10 años en EE. UU.'],
    'EOIR-42A': ['Cancelación de deportación', 'Para residentes permanentes en proceso de deportación.'],
    'SS-5': ['Seguro Social', 'La solicitud de tu número de Seguro Social.'],
    'G-1055': ['Tarifas de USCIS', 'La guía oficial con lo que cuesta cada formulario.']
  };
  var RE = /\b(I-130A|I-130|I-485|I-765|I-589|I-864|I-693|I-131|I-94|I-797|AR-11|EOIR-33|EOIR-42B|EOIR-42A|SS-5|G-1055)\b/g;
  var st2 = document.createElement('style');
  st2.textContent =
    '.rs-form{all:unset;cursor:pointer;font-weight:inherit;color:inherit;border-bottom:1.5px dotted #10B981;padding:0 1px;border-radius:3px}' +
    '.rs-form:hover,.rs-form:focus-visible{background:rgba(16,185,129,.12);outline:none}' +
    '.rs-pop{position:absolute;z-index:80;width:min(290px,calc(100vw - 24px));background:#fff;color:#0F1F17;border:1px solid rgba(0,0,0,.1);border-radius:14px;box-shadow:0 18px 40px -14px rgba(6,40,28,.4);padding:.85rem .95rem;font-size:.9rem;line-height:1.4;font-weight:400}' +
    '.rs-pop b{display:block;font-size:.95rem;margin-bottom:.15rem}.rs-pop small{display:block;font-size:.72rem;letter-spacing:.06em;color:#0f766e;font-weight:700;margin-bottom:.1rem}' +
    '.rs-pop p{margin:0 0 .65rem}.rs-pop .rs-wa{font-size:.85rem;padding:.55rem .85rem}' +
    '@media(prefers-color-scheme:dark){.rs-pop{background:#111916;color:#EEF5F1;border-color:rgba(190,255,225,.14)}}';
  document.head.appendChild(st2);

  // Envolver los códigos en el texto (párrafos, listas y tablas; no en títulos ni enlaces)
  var walker = document.createTreeWalker(article, NodeFilter.SHOW_TEXT, {
    acceptNode: function (n) {
      var p = n.parentElement;
      if (!p || p.closest('a,button,h1,h2,h3,script,style,.rs-intro,.rs-pop,.ask-box,.cta-box')) return NodeFilter.FILTER_REJECT;
      RE.lastIndex = 0;
      return RE.test(n.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
    }
  });
  var nodes = []; while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach(function (n) {
    var frag = document.createDocumentFragment(), text = n.nodeValue, last = 0, m;
    RE.lastIndex = 0;
    while ((m = RE.exec(text))) {
      frag.appendChild(document.createTextNode(text.slice(last, m.index)));
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'rs-form'; b.textContent = m[0]; b.dataset.f = m[0];
      b.setAttribute('aria-label', m[0] + ': ' + FORMS[m[0]][0] + '. Toca para ver qué es');
      frag.appendChild(b);
      last = m.index + m[0].length;
    }
    frag.appendChild(document.createTextNode(text.slice(last)));
    n.parentNode.replaceChild(frag, n);
  });

  var pop = null;
  function closePop() { if (pop) { pop.remove(); pop = null; } }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('.rs-form');
    if (!b) { if (pop && !e.target.closest('.rs-pop')) closePop(); return; }
    e.preventDefault();
    closePop();
    var f = b.dataset.f, info = FORMS[f];
    var link = 'https://wa.me/17862016327?text=' + encodeURIComponent('Hola, tengo una pregunta sobre el formulario ' + f + ' (' + info[0].toLowerCase() + ').');
    pop = document.createElement('div');
    pop.className = 'rs-pop'; pop.setAttribute('role', 'dialog'); pop.setAttribute('aria-label', f);
    pop.innerHTML = '<small>' + f + '</small><b>' + info[0] + '</b><p>' + info[1] + '</p><a class="rs-wa" href="' + link + '" target="_blank" rel="noopener" data-cta="blog_formulario">' + ICON + 'Pregúntanos por tu caso</a>';
    document.body.appendChild(pop);
    var r = b.getBoundingClientRect(), w = pop.offsetWidth;
    var left = Math.min(Math.max(12, r.left + window.scrollX + r.width / 2 - w / 2), window.scrollX + document.documentElement.clientWidth - w - 12);
    var top = r.bottom + window.scrollY + 8;
    if (r.bottom + pop.offsetHeight + 90 > window.innerHeight) top = r.top + window.scrollY - pop.offsetHeight - 8;
    pop.style.left = left + 'px'; pop.style.top = top + 'px';
    if (window.gtag) window.gtag('event', 'formulario_tocado', { formulario: f, pagina: location.pathname });
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closePop(); });
  window.addEventListener('resize', closePop);
})();
})();
