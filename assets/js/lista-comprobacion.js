/* lista-comprobacion.js — lista de comprobación interactiva de presupuestos.
 *
 * Sirve a /en/estimate-review-checklist.html y /revisar-presupuesto-lista.html.
 * Sin librerías, sin servidor: marcar, contar, imprimir y reiniciar.
 *
 * Lo marcado se guarda en localStorage (una clave por idioma, que viene en
 * data-store) siempre dentro de try/catch: si el navegador lo tiene capado,
 * la herramienta sigue funcionando, solo que sin memoria.
 *
 * Avisa a la analítica propia con el mismo patrón que assets/js/medir.js
 * (sendBeacon, texto plano, sin preflight, y si falla, calla):
 *   - lista_imprimir : alguien manda la lista a la impresora o al PDF.
 *   - lista_completa : alguien termina las 43 comprobaciones.
 */
(function () {
    'use strict';

    var raiz = document.getElementById('erc');
    if (!raiz) return;

    // ── Analítica: mismo patrón que medir.js ─────────────────────────────
    var URL_MEDIR = '/api/medir.php';
    var enviados = {};

    function medir(nombre, detalle) {
        try {
            var clave = nombre + '|' + (detalle || '');
            if (enviados[clave]) return;        // un mismo gesto no se cuenta dos veces
            enviados[clave] = true;
            var cuerpo = JSON.stringify({
                e: nombre,
                d: detalle || null,
                p: location.pathname,
                q: location.search
            });
            if (navigator.sendBeacon) {
                navigator.sendBeacon(URL_MEDIR, new Blob([cuerpo], { type: 'text/plain;charset=UTF-8' }));
            } else {
                var x = new XMLHttpRequest();
                x.open('POST', URL_MEDIR, true);
                x.setRequestHeader('Content-Type', 'text/plain;charset=UTF-8');
                x.send(cuerpo);
            }
        } catch (e) { /* silencio: medir nunca puede estorbar */ }
    }

    // ── Estado guardado ──────────────────────────────────────────────────
    var CLAVE = raiz.getAttribute('data-store') || 'pr3cise-lista';
    var ETIQUETA = raiz.getAttribute('data-evento') || location.pathname;

    function leer() {
        try {
            var s = localStorage.getItem(CLAVE);
            if (!s) return {};
            var d = JSON.parse(s);
            return (d && typeof d === 'object' && !Array.isArray(d)) ? d : {};
        } catch (e) { return {}; }
    }

    function guardar(d) {
        try { localStorage.setItem(CLAVE, JSON.stringify(d)); } catch (e) { /* sin memoria */ }
    }

    function olvidar() {
        try { localStorage.removeItem(CLAVE); } catch (e) { /* nada que borrar */ }
    }

    // ── Piezas ───────────────────────────────────────────────────────────
    var cajas = Array.prototype.slice.call(raiz.querySelectorAll('.erc-cb'));
    var total = cajas.length;
    var elHechas = document.getElementById('erc-done');
    var elTotal = document.getElementById('erc-total');
    var elFill = document.getElementById('erc-fill');
    var elTrack = document.getElementById('erc-track');

    if (elTotal) elTotal.textContent = total;
    if (elTrack) elTrack.setAttribute('aria-valuemax', total);

    function pintar() {
        var hechas = 0;
        var porBloque = {};

        for (var i = 0; i < cajas.length; i++) {
            var c = cajas[i];
            var b = c.getAttribute('data-block') || '-';
            if (!porBloque[b]) porBloque[b] = { ok: 0, n: 0 };
            porBloque[b].n++;
            if (c.checked) { hechas++; porBloque[b].ok++; }
        }

        if (elHechas) elHechas.textContent = hechas;

        var pct = total ? Math.round((hechas * 100) / total) : 0;
        if (elFill) elFill.style.width = pct + '%';
        if (elTrack) {
            elTrack.setAttribute('aria-valuenow', hechas);
            elTrack.setAttribute('aria-valuetext', hechas + ' / ' + total);
        }

        for (var b2 in porBloque) {
            if (!Object.prototype.hasOwnProperty.call(porBloque, b2)) continue;
            var t = raiz.querySelector('[data-tally="' + b2 + '"]');
            if (t) t.textContent = porBloque[b2].ok + '/' + porBloque[b2].n;
        }

        var completa = (total > 0 && hechas === total);
        raiz.classList.toggle('erc-full', completa);
        if (completa) medir('lista_completa', ETIQUETA);
    }

    // ── Arranque: el navegador restaura casillas al recargar, así que se
    //    fija el estado a lo que diga localStorage, no a lo que él recuerde.
    var estado = leer();
    for (var j = 0; j < cajas.length; j++) {
        cajas[j].checked = !!estado[cajas[j].getAttribute('data-id')];
    }
    pintar();

    // ── Marcar ───────────────────────────────────────────────────────────
    raiz.addEventListener('change', function (ev) {
        var c = ev.target;
        if (!c || !c.classList || !c.classList.contains('erc-cb')) return;
        var d = leer();
        var id = c.getAttribute('data-id');
        if (c.checked) d[id] = 1; else delete d[id];
        guardar(d);
        pintar();
    });

    // ── Imprimir o guardar en PDF ────────────────────────────────────────
    var btnImprimir = document.getElementById('erc-print');
    if (btnImprimir) {
        btnImprimir.addEventListener('click', function () {
            medir('lista_imprimir', ETIQUETA);
            window.print();
        });
    }
    // También si imprimen con Ctrl+P
    if (window.addEventListener) {
        window.addEventListener('beforeprint', function () { medir('lista_imprimir', ETIQUETA); });
    }

    // ── Reiniciar (en dos toques: borrar 43 marcas sin querer fastidia) ──
    var btnReset = document.getElementById('erc-reset');
    if (btnReset) {
        var textoNormal = btnReset.getAttribute('data-label') || btnReset.textContent;
        var textoConfirm = btnReset.getAttribute('data-confirm') || textoNormal;
        var armado = false;
        var reloj = null;

        function desarmar() {
            armado = false;
            if (reloj) { clearTimeout(reloj); reloj = null; }
            btnReset.textContent = textoNormal;
            btnReset.classList.remove('erc-btn-warn');
        }

        btnReset.addEventListener('click', function () {
            if (!armado) {
                armado = true;
                btnReset.textContent = textoConfirm;
                btnReset.classList.add('erc-btn-warn');
                reloj = setTimeout(desarmar, 5000);
                return;
            }
            desarmar();
            for (var k = 0; k < cajas.length; k++) cajas[k].checked = false;
            olvidar();
            pintar();
            if (cajas[0]) cajas[0].focus();
        });
    }

    // ── La barra se pega justo debajo de la cabecera, mida lo que mida ───
    function ajustarTope() {
        var cab = document.getElementById('site-header');
        if (!cab) return;
        document.documentElement.style.setProperty('--erc-top', cab.offsetHeight + 'px');
    }
    ajustarTope();
    window.addEventListener('resize', ajustarTope);
    window.addEventListener('load', ajustarTope);
})();
