// Medición en el blog: recuerda si la persona llegó por un anuncio de Google (90 días),
// marca su WhatsApp con "(Los encontré en Google)" y envía click_whatsapp a GA4
// (el mismo evento de la página principal, para importarlo como conversión en Google Ads).
(function(){
  try{
    var q=new URLSearchParams(location.search);
    if(q.get('gclid')||q.get('gbraid')||q.get('wbraid')||(q.get('utm_source')||'').toLowerCase()==='google')
      localStorage.setItem('rs_src',JSON.stringify({s:'google',c:q.get('utm_campaign')||'',t:Date.now()}));
  }catch(e){}
  function fromGoogle(){try{var v=JSON.parse(localStorage.getItem('rs_src')||'null');return !!v&&Date.now()-v.t<90*864e5;}catch(e){return false;}}
  document.addEventListener('click',function(e){
    var a=e.target.closest('a[href*="wa.me"]');if(!a)return;
    if(fromGoogle()){
      try{var u=new URL(a.href);var t=u.searchParams.get('text')||'Hola, quiero información.';if(t.indexOf('encontré en Google')<0){u.searchParams.set('text',t+'\n\n(Los encontré en Google)');a.href=u.toString();}}catch(err){}
    }
    if(window.gtag)gtag('event','click_whatsapp',{ubicacion:a.dataset.cta||'blog',pagina:location.pathname});
    // Conversión directa en Google Ads: "Clic en WhatsApp (web)" (categoría Contacto)
    if(window.gtag)gtag('event','conversion',{send_to:'AW-18548675612/qtZwCKum2rYdEJyo2YxF'});
  });
})();
