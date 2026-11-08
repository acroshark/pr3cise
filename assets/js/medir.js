/* medir.js — analítica propia de Pr3cise (sin cookies, sin datos personales).
 *
 * Manda a /api/medir.php la página vista y los gestos que importan de verdad:
 * clic en WhatsApp, clic en el correo, envío del formulario de contacto y
 * pulsación de los botones de llamada a la acción. Nada más.
 *
 * Usa sendBeacon con texto plano para no disparar preflight y para que el aviso
 * salga aunque el visitante cierre la pestaña. Si algo falla, calla: medir nunca
 * puede estorbar a la web.
 */
(function () {
  'use strict';
  var URL_MEDIR = '/api/medir.php';
  var enviados = {};

  function enviar(datos) {
    try {
      datos.p = location.pathname;
      datos.q = location.search;
      var cuerpo = JSON.stringify(datos);
      if (navigator.sendBeacon) {
        navigator.sendBeacon(URL_MEDIR, new Blob([cuerpo], { type: 'text/plain;charset=UTF-8' }));
      } else {
        var x = new XMLHttpRequest();
        x.open('POST', URL_MEDIR, true);
        x.setRequestHeader('Content-Type', 'text/plain;charset=UTF-8');
        x.send(cuerpo);
      }
    } catch (e) { /* silencio */ }
  }

  function evento(nombre, detalle) {
    var clave = nombre + '|' + (detalle || '');
    if (enviados[clave]) return;          // un mismo gesto no se cuenta dos veces
    enviados[clave] = true;
    enviar({ e: nombre, d: detalle || null });
  }

  // ── Página vista ───────────────────────────────────────────────────────
  enviar({ r: document.referrer || null, t: document.title || null });

  // ── Gestos que valen dinero ────────────────────────────────────────────
  document.addEventListener('click', function (ev) {
    var a = ev.target && ev.target.closest ? ev.target.closest('a, button') : null;
    if (!a) return;
    var href = (a.getAttribute && a.getAttribute('href')) || '';

    if (href.indexOf('wa.me') > -1 || href.indexOf('whatsapp') > -1) return evento('whatsapp', href);
    if (href.indexOf('mailto:') === 0) return evento('correo', href.replace('mailto:', ''));
    if (href.indexOf('tel:') === 0) return evento('telefono', href.replace('tel:', ''));
    if (a.classList && a.classList.contains('btn-cta')) {
      // 2026-11-08 | El efecto de cifrado (nav-scramble.js) cambia el texto del botón
      // mientras rueda; su aria-label conserva siempre el texto real.
      var etiqueta = (a.getAttribute('aria-label') || a.textContent || '').replace(/\s+/g, ' ').trim();
      return evento('cta', etiqueta.slice(0, 60) + ' -> ' + (href || 'submit'));
    }
    if (href && /^https?:\/\//i.test(href) && href.indexOf(location.host) === -1) {
      return evento('salida', href.slice(0, 200));
    }
  }, true);

  var f = document.getElementById('contact-form');
  if (f) {
    f.addEventListener('submit', function () { evento('formulario', 'contacto'); }, true);
  }
})();
