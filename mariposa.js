/* Mariposa del logo: entra grande, vuela haciéndose pequeña y se posa en el logo del menú.
   Una vez por visita (sessionStorage rs_fly); ?vuelo la repite. Después aletea cada 10 s.
   Las páginas que la usan ponen en <head> un script que añade html.fly-wait para que el logo
   esté oculto desde el principio hasta que la mariposa llega. */
(function () {
  var logo = document.querySelector('.logo-icon, .brand .b-icon');
  var root = document.documentElement;
  if (!logo) { root.classList.remove('fly-wait'); return; }

  var st = document.createElement('style');
  st.textContent =
    '.rs-bfly{position:fixed;left:0;top:0;z-index:160;opacity:0;pointer-events:none;transform-origin:0 0;will-change:transform,opacity}' +
    '.rs-bfly img{width:100%;height:100%;display:block;object-fit:contain;transform-origin:50% 55%;animation:rsFlap .2s ease-in-out infinite alternate}' +
    '@keyframes rsFlap{to{transform:scaleX(.35)}}' +
    '.rs-flutter{transform-origin:50% 55%;animation:rsFlutter 10s ease-in-out infinite 2s}' +
    '@keyframes rsFlutter{0%,92%,100%{transform:scaleX(1)}94%{transform:scaleX(.4)}96%{transform:scaleX(1)}98%{transform:scaleX(.5)}}' +
    '@media(prefers-reduced-motion:reduce){.rs-flutter{animation:none}}';
  document.head.appendChild(st);

  function settle() { logo.style.visibility = ''; root.classList.remove('fly-wait'); logo.classList.add('rs-flutter'); }
  var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches, flown = false;
  try { flown = sessionStorage.getItem('rs_fly') === '1' && !/[?&]vuelo/.test(location.search); } catch (e) {}
  if (still || flown || window.scrollY > 200 || !root.classList.contains('fly-wait')) { settle(); return; }

  var b = document.createElement('div'); b.className = 'rs-bfly';
  b.innerHTML = '<img src="/img/img1.png" alt="">';
  var lr = logo.getBoundingClientRect(), size = lr.width || 34;
  b.style.width = b.style.height = size + 'px';
  document.body.appendChild(b);
  var vw = window.innerWidth, vh = window.innerHeight;
  var big = Math.min(vw, vh) * (vw < 760 ? .5 : .32) / size;
  // Empieza fuera de la pantalla (a la derecha), ya grande, y entra volando.
  var start = [vw + big * size * .6, vh * .6], end = [lr.left, lr.top];
  var c1 = [vw * .6, vh * .02], c2 = [vw * .3, vh * .4];
  function pt(t) { var u = 1 - t; return [0, 1].map(function (k) { return u*u*u*start[k] + 3*u*u*t*c1[k] + 3*u*t*t*c2[k] + t*t*t*end[k]; }); }
  var dur = vw < 760 ? 2200 : 2600, t0 = null;
  function frame(now) {
    if (t0 === null) t0 = now;
    var t = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - t, 2.4);
    var p = pt(e), sc = big + (1 - big) * e, sway = Math.sin(t * Math.PI * 3) * 10 * (1 - t);
    b.style.opacity = 1;
    b.style.transform = 'translate(' + (p[0] - (sc - 1) * size / 2) + 'px,' + (p[1] - (sc - 1) * size / 2) + 'px) rotate(' + sway + 'deg) scale(' + sc + ')';
    if (t < 1) requestAnimationFrame(frame);
    else { b.remove(); settle(); try { sessionStorage.setItem('rs_fly', '1'); } catch (e) {} }
  }
  setTimeout(function () { requestAnimationFrame(frame); }, 250);
  setTimeout(function () { if (b.isConnected) { b.remove(); settle(); } }, 5000);
})();
