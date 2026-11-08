/**
 * Pr3cise — Interactive UX modules (v3 · 2026-11-08)
 *
 * This file runs on the Spanish homepage and on /en/ (still on the previous markup until it
 * is ported). Every module is guarded by element presence and must never throw when its
 * block is missing. prefers-reduced-motion → no autoplay, no rolling, instant states.
 * User-visible strings live in STR (es / en / de / fr) and follow <html lang>.
 *
 * 1. Scroll progress bar + header shadow
 * 2. Hero: no-reflow lock for the rolling word (the pointer spotlight was removed on 2026-11-08)
 * 3. Hero telemetry card: ARIA tabs with arrow keys, count-up on first view, one rotation pass
 * 4. Deliverable lightbox ([data-zoom-src])
 * 5. Scope & turnaround configurator ([data-scope-calc])
 * 6. Hiring process ([data-process]): desktop tabs with pausable autoplay, mobile carousel
 * 7. Dual live clock ([data-tz]): Florida vs our technical office (Intl, DST-safe)
 * 8. LEGACY 4-step stepper ([data-contract-stepper]): only /en/index.html — delete after porting
 */
(function () {
  'use strict';

  var MQ_REDUCED = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  var REDUCED_MOTION = !!(MQ_REDUCED && MQ_REDUCED.matches);
  var LANG = (document.documentElement.getAttribute('lang') || 'es').slice(0, 2).toLowerCase();

  var STR = {
    es: {
      locale: 'es-ES',
      lbDialog: 'Vista ampliada de la muestra',
      lbClose: 'Cerrar',
      pause: 'Pausar',
      play: 'Reanudar',
      carousel: 'carrusel',
      slide: 'paso',
      goTo: 'Ir al paso {n}: {t}',
      stepOf: 'Paso {n} de {total}',
      tzOpen: 'Nuestra oficina está abierta: son las {eu} aquí y las {fl} en Florida. Si nos envías los planos ahora, empezamos a revisarlos hoy mismo.',
      tzNext: 'Si nos envías los planos ahora, empezamos a revisarlos el {day} a las {eu} de nuestra mañana, que son las {fl} en Florida.',
      tzAria: 'Jornada en Florida de {a} a {b}. Jornada de nuestra oficina de {c} a {d}, en hora de Florida.',
      tzAriaOverlap: ' Horas en común: de {e} a {f}.'
    },
    en: {
      locale: 'en-US',
      lbDialog: 'Enlarged sample preview',
      lbClose: 'Close',
      pause: 'Pause',
      play: 'Resume',
      carousel: 'carousel',
      slide: 'step',
      goTo: 'Go to step {n}: {t}',
      stepOf: 'Step {n} of {total}',
      tzOpen: 'Our office is open: it is {eu} here and {fl} in Florida. Send your drawings now and we start reviewing them today.',
      tzNext: 'Send your drawings now and we start reviewing them on {day} at {eu} our time, which is {fl} in Florida.',
      tzAria: 'Florida working day from {a} to {b}. Our office works from {c} to {d}, Florida time.',
      tzAriaOverlap: ' Shared hours: {e} to {f}.'
    },
    de: {
      locale: 'de-DE',
      lbDialog: 'Vergrößerte Musteransicht',
      lbClose: 'Schließen',
      pause: 'Pausieren',
      play: 'Fortsetzen',
      carousel: 'Karussell',
      slide: 'Schritt',
      goTo: 'Zu Schritt {n}: {t}',
      stepOf: 'Schritt {n} von {total}',
      tzOpen: 'Unser Büro ist geöffnet: Hier ist es {eu} Uhr, in Florida {fl} Uhr. Senden Sie uns Ihre Pläne jetzt, und wir prüfen sie noch heute.',
      tzNext: 'Senden Sie uns Ihre Pläne jetzt: Wir beginnen am {day} um {eu} Uhr unserer Zeit mit der Prüfung, in Florida ist es dann {fl} Uhr.',
      tzAria: 'Arbeitstag in Florida von {a} bis {b}. Unser Büro arbeitet von {c} bis {d}, Ortszeit Florida.',
      tzAriaOverlap: ' Gemeinsame Stunden: {e} bis {f}.'
    },
    fr: {
      locale: 'fr-FR',
      lbDialog: 'Aperçu agrandi de l’échantillon',
      lbClose: 'Fermer',
      pause: 'Pause',
      play: 'Reprendre',
      carousel: 'carrousel',
      slide: 'étape',
      goTo: 'Aller à l’étape {n} : {t}',
      stepOf: 'Étape {n} sur {total}',
      tzOpen: 'Notre bureau est ouvert : il est {eu} ici et {fl} en Floride. Envoyez vos plans maintenant, nous commençons à les examiner aujourd’hui.',
      tzNext: 'Envoyez vos plans maintenant : nous commençons à les examiner {day} à {eu}, heure de notre bureau, soit {fl} en Floride.',
      tzAria: 'Journée de travail en Floride de {a} à {b}. Notre bureau travaille de {c} à {d}, heure de Floride.',
      tzAriaOverlap: ' Heures communes : de {e} à {f}.'
    }
  };
  var T = STR[LANG] || STR.es;

  function fill(tpl, map) {
    return tpl.replace(/\{(\w+)\}/g, function (m, k) {
      return Object.prototype.hasOwnProperty.call(map, k) ? map[k] : m;
    });
  }

  function onVisible(el, cb, threshold) {
    if (!('IntersectionObserver' in window)) { cb(true); return null; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) { cb(entry.isIntersecting); });
    }, { threshold: threshold || 0 });
    io.observe(el);
    return io;
  }

  /* Thousands with a dot (es/de/fr) or a comma ($), as printed in the markup */
  function formatAmount(n, prefix, suffix) {
    var sep = prefix === '$' ? ',' : '.';
    return (prefix || '') + String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, sep) + (suffix || '');
  }

  function animateNumber(el, from, to, prefix, suffix, dur) {
    if (!el) return;
    el.dataset.currentVal = String(to);
    if (REDUCED_MOTION) { el.textContent = formatAmount(to, prefix, suffix); return; }
    var start = null;
    var token = {};
    el.__countToken = token;
    function tick(now) {
      if (el.__countToken !== token) return;
      if (start === null) start = now;
      var p = Math.min((now - start) / (dur || 480), 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = formatAmount(from + (to - from) * eased, prefix, suffix);
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  /* ── 1. Scroll progress + header shadow ─────────────────────────────── */
  function initScrollChrome() {
    var header = document.getElementById('site-header');
    var bar = document.querySelector('.scroll-progress');
    if (!bar) {
      bar = document.createElement('div');
      bar.className = 'scroll-progress';
      bar.setAttribute('aria-hidden', 'true');
      bar.appendChild(document.createElement('span'));
      document.body.appendChild(bar);
    }
    var fillEl = bar.firstElementChild;
    var queued = false;

    function update() {
      queued = false;
      var max = document.documentElement.scrollHeight - window.innerHeight;
      var y = window.pageYOffset || document.documentElement.scrollTop || 0;
      var p = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0;
      if (fillEl) fillEl.style.transform = 'scaleX(' + p.toFixed(4) + ')';
      if (header) header.classList.toggle('is-scrolled', y > 8);
    }
    function queue() {
      if (!queued) { queued = true; requestAnimationFrame(update); }
    }
    window.addEventListener('scroll', queue, { passive: true });
    window.addEventListener('resize', queue, { passive: true });
    update();
  }

  /* ── 2. Hero: rolling-word width lock ───────────────────────────────── */
  /* The keyword rolls letters → digits → cipher (nav-scramble.js). It is mono, so every glyph
     has the same advance; we also pin its width once fonts are ready so the H1 can never
     reflow, and ask early for the Cyrillic subset the cipher uses (Р, Я, Ц…). */
  function initHeroWord() {
    var words = Array.prototype.slice.call(document.querySelectorAll('.hero-precision'));
    if (!words.length) return;
    if (document.fonts && document.fonts.load) {
      try { document.fonts.load('500 1em "IBM Plex Mono"', 'РЯЦИМШКФ'); } catch (e) { /* optional */ }
    }
    function lock() {
      var retry = false;
      words.forEach(function (w) {
        if (w.offsetParent === null) return;
        if (w.classList.contains('scrambling')) { retry = true; return; }
        w.style.width = '';
        var width = w.getBoundingClientRect().width;
        if (width) w.style.width = Math.ceil(width) + 'px';
      });
      if (retry) setTimeout(lock, 3200);
    }
    var ready = (document.fonts && document.fonts.ready) ? document.fonts.ready : Promise.resolve();
    ready.then(lock, lock);
    var t = null;
    window.addEventListener('resize', function () {
      clearTimeout(t);
      t = setTimeout(lock, 160);
    }, { passive: true });
  }

  /* ── 3. Hero telemetry card ─────────────────────────────────────────── */
  function initHeroTelemetry() {
    var card = document.querySelector('[data-telemetry-card]');
    if (!card) return;

    var tabs = Array.prototype.slice.call(card.querySelectorAll('[data-tel-tab]'));
    var panels = Array.prototype.slice.call(card.querySelectorAll('[data-tel-panel]'));
    var totalEl = card.querySelector('[data-tel-total]');
    if (!tabs.length || !panels.length) return;

    var activeIdx = 0;
    var userTouched = false;
    var hovering = false;
    var focusing = false;
    var visible = false;
    var seen = false;       // the card has been ≥ 30 % visible once
    var rotations = 0;      // the tabs rotate through once on their own, then stay put (WCAG 2.2.2)
    var rotTimer = null;

    function stopRotation() {
      if (rotTimer) clearInterval(rotTimer);
      rotTimer = null;
    }

    function activate(idx, focus) {
      activeIdx = (idx + tabs.length) % tabs.length;
      tabs.forEach(function (t, i) {
        var on = i === activeIdx;
        t.classList.toggle('active', on);
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.tabIndex = on ? 0 : -1;
      });
      panels.forEach(function (p, i) {
        var on = i === activeIdx;
        p.classList.toggle('active', on);
        p.hidden = !on;
      });
      if (focus) tabs[activeIdx].focus();
      var tab = tabs[activeIdx];
      if (totalEl && tab.dataset.total) {
        var from = parseFloat(totalEl.dataset.currentVal || tab.dataset.total) || 0;
        animateNumber(totalEl, from, parseFloat(tab.dataset.total), tab.dataset.prefix || '', tab.dataset.suffix || '', 480);
      }
    }

    tabs.forEach(function (tab, idx) {
      tab.addEventListener('click', function () {
        userTouched = true;
        stopRotation();
        activate(idx);
      });
      tab.addEventListener('keydown', function (e) {
        var next = null;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = idx + 1;
        else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = idx - 1;
        else if (e.key === 'Home') next = 0;
        else if (e.key === 'End') next = tabs.length - 1;
        if (next === null) return;
        e.preventDefault();
        userTouched = true;
        stopRotation();
        activate(next, true);
      });
    });

    card.addEventListener('mouseenter', function () { hovering = true; });
    card.addEventListener('mouseleave', function () { hovering = false; });
    card.addEventListener('focusin', function () { focusing = true; });
    card.addEventListener('focusout', function (e) {
      if (!card.contains(e.relatedTarget)) focusing = false;
    });

    var first = tabs[0];
    if (totalEl && first.dataset.total) totalEl.dataset.currentVal = first.dataset.total;
    tabs.forEach(function (t, i) { t.tabIndex = i === 0 ? 0 : -1; });

    /* The hero's single load moment: the subtotal counts up from zero the first time the card is
       ≥ 30 % visible (the markup keeps the real figure for no-JS and reduced motion). Then the tabs
       rotate through once, pausing on hover/focus/off-screen, and stay on the first tab. */
    var countUp = !REDUCED_MOTION && totalEl && first.dataset.total;
    if (countUp) totalEl.textContent = formatAmount(0, first.dataset.prefix || '', first.dataset.suffix || '');

    function firstView() {
      if (seen) return;
      seen = true;
      if (countUp && !userTouched) {
        animateNumber(totalEl, 0, parseFloat(first.dataset.total), first.dataset.prefix || '', first.dataset.suffix || '', 1200);
      }
      if (REDUCED_MOTION) return;
      rotTimer = setInterval(function () {
        if (userTouched) { stopRotation(); return; }
        if (hovering || focusing || !visible || document.hidden) return;
        rotations++;
        activate(activeIdx + 1);
        if (rotations >= tabs.length) stopRotation();
      }, 4600);
    }

    onVisible(card, function (v) {
      visible = v;
      if (v) firstView();
    }, 0.3);
  }

  /* ── 4. Deliverable lightbox ────────────────────────────────────────── */
  function initDeliverableZoom() {
    var triggers = Array.prototype.slice.call(document.querySelectorAll('[data-zoom-src]'));
    if (!triggers.length) return;

    var modal = document.getElementById('home-deliv-lightbox');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'home-deliv-lightbox';
      modal.className = 'img-lightbox';
      modal.setAttribute('role', 'dialog');
      modal.setAttribute('aria-modal', 'true');
      modal.setAttribute('aria-label', T.lbDialog);
      modal.innerHTML = '<button class="lightbox-close" type="button">&times;</button><img id="home-lightbox-img" alt="">';
      modal.querySelector('.lightbox-close').setAttribute('aria-label', T.lbClose);
      document.body.appendChild(modal);
    }

    var modalImg = modal.querySelector('img');
    var closeBtn = modal.querySelector('.lightbox-close');
    var lastTrigger = null;

    function open(src, alt, trigger) {
      lastTrigger = trigger || null;
      modalImg.src = src;
      modalImg.alt = alt || '';
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
      if (closeBtn) closeBtn.focus();
    }

    function close() {
      if (!modal.classList.contains('open')) return;
      modal.classList.remove('open');
      document.body.style.overflow = '';
      if (lastTrigger) lastTrigger.focus();
    }

    triggers.forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        var img = btn.querySelector('img');
        open(btn.dataset.zoomSrc, img ? img.alt : '', btn);
      });
    });

    if (closeBtn) closeBtn.addEventListener('click', close);
    modal.addEventListener('click', function (e) {
      if (e.target === modal) close();
    });
    document.addEventListener('keydown', function (e) {
      if (!modal.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'Tab' && closeBtn) { e.preventDefault(); closeBtn.focus(); }
    });
  }

  /* ── 5. Scope & turnaround configurator ─────────────────────────────── */
  function initScopeConfigurator() {
    var box = document.querySelector('[data-scope-calc]');
    if (!box) return;

    var scopeBtns = Array.prototype.slice.call(box.querySelectorAll('[data-scope-val]'));
    var turnaroundEl = box.querySelector('[data-calc-turnaround]');
    var outputEl = box.querySelector('[data-calc-output]');
    var ctaEl = box.querySelector('[data-calc-cta]');
    if (!scopeBtns.length) return;

    var SCOPE_OUTPUTS = {
      es: {
        full: 'Excel + PDF + BC3 / CSI + Planos marcados',
        mep: 'Desglose MEP + Mano de obra + Planos marcados',
        takeoff: 'Medición cuantificada + Marcado por colores'
      },
      en: {
        full: 'Excel + PDF + CSI / BoQ + Colour-coded markups',
        mep: 'MEP line-item breakdown + Labor + Markups',
        takeoff: 'Quantified takeoff + Colour-coded markups'
      },
      de: {
        full: 'Excel + PDF + LV / CSI + Farbmarkierte Pläne',
        mep: 'TGA-Aufschlüsselung + Lohnstunden + Pläne',
        takeoff: 'Mengenermittlung + Farbmarkierte Pläne'
      },
      fr: {
        full: 'Excel + PDF + DPGF / CSI + Plans annotés',
        mep: 'Détail CVC-élec-plomberie + Main-d’œuvre + Plans',
        takeoff: 'Métré quantitatif + Plans annotés couleur'
      }
    };

    if (ctaEl && !ctaEl.dataset.baseHref) {
      ctaEl.dataset.baseHref = ctaEl.getAttribute('href').split('?')[0];
    }

    function selectScope(btn) {
      scopeBtns.forEach(function (b) {
        var on = b === btn;
        b.classList.toggle('active', on);
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      if (turnaroundEl && btn.dataset.turnaround) turnaroundEl.textContent = btn.dataset.turnaround;
      if (outputEl) {
        var map = SCOPE_OUTPUTS[LANG];
        var val = btn.dataset.scopeVal;
        if (map && map[val]) outputEl.textContent = map[val];
        else if (btn.dataset.deliverables) outputEl.textContent = btn.dataset.deliverables;
      }
      if (ctaEl && ctaEl.dataset.baseHref) {
        var sep = ctaEl.dataset.baseHref.indexOf('?') >= 0 ? '&' : '?';
        ctaEl.setAttribute('href', ctaEl.dataset.baseHref + sep + 'scope=' + encodeURIComponent(btn.dataset.scopeVal));
      }
    }

    scopeBtns.forEach(function (btn) {
      btn.addEventListener('click', function () { selectScope(btn); });
    });

    var initial = scopeBtns.filter(function (b) { return b.classList.contains('active'); })[0] || scopeBtns[0];
    selectScope(initial);
  }

  /* ── 6. Hiring process ──────────────────────────────────────────────── */
  function initProcess() {
    var root = document.querySelector('[data-process]');
    if (!root) return;

    var list = root.querySelector('.proc-list');
    var stage = root.querySelector('.proc-stage');
    var tabs = list ? Array.prototype.slice.call(list.querySelectorAll('.proc-tab')) : [];
    var panels = tabs.map(function (t) { return document.getElementById(t.getAttribute('aria-controls')); });
    if (!stage || !tabs.length || panels.some(function (p) { return !p; })) return;

    var railFill = root.querySelector('.proc-rail-fill');
    var toggle = root.querySelector('[data-proc-toggle]');
    var toggleLbl = toggle ? toggle.querySelector('[data-proc-toggle-label]') : null;
    var mq = window.matchMedia ? window.matchMedia('(max-width: 899px)') : null;
    var titles = tabs.map(function (t) {
      var el = t.querySelector('.proc-tab-title');
      return (el ? el.textContent : t.textContent).replace(/\s+/g, ' ').trim();
    });
    var listLabel = list.getAttribute('aria-label') || '';

    var current = 0;
    var mode = null;            // 'tabs' (desktop) | 'carousel' (< 900 px)
    var userStopped = false;    // manual selection or pause button
    var pause = { hover: false, focus: false, hidden: document.hidden, offscreen: true };

    function canAutoplay() {
      return mode === 'tabs' && !REDUCED_MOTION && !userStopped;
    }

    function refreshPlayback() {
      var playing = canAutoplay();
      root.classList.toggle('is-playing', playing);
      root.classList.toggle('is-paused', playing && (pause.hover || pause.focus || pause.hidden || pause.offscreen));
      if (toggle) {
        /* Only touch the DOM when something changed: rewriting the label under the pointer
           (hover/focus changes fire right before mousedown) made WebKit drop the click. */
        var hide = !(mode === 'tabs' && !REDUCED_MOTION);
        var state = userStopped ? 'paused' : 'playing';
        var label = userStopped ? T.play : T.pause;
        if (toggle.hidden !== hide) toggle.hidden = hide;
        if (toggle.dataset.state !== state) toggle.dataset.state = state;
        if (toggleLbl && toggleLbl.textContent !== label) toggleLbl.textContent = label;
      }
    }

    function restartBar() {
      var barFill = tabs[current].querySelector('.proc-bar-fill');
      if (!barFill) return;
      barFill.style.animation = 'none';
      void barFill.offsetWidth;
      barFill.style.animation = '';
    }

    /* Counting totals. Default unit: a narrow no-break space + €. Other currencies can set
       data-proc-prefix="$" and/or data-proc-suffix="" on the element. */
    function runCounters(panel) {
      Array.prototype.slice.call(panel.querySelectorAll('[data-proc-count]')).forEach(function (el) {
        var to = parseFloat(el.getAttribute('data-proc-count')) || 0;
        var pre = el.getAttribute('data-proc-prefix') || '';
        var suf = el.hasAttribute('data-proc-suffix') ? el.getAttribute('data-proc-suffix') : ' €';
        animateNumber(el, 0, to, pre, suf, 900);
      });
    }

    function scrollToPanel(i, smooth) {
      var p = panels[i];
      var left = p.offsetLeft - (stage.clientWidth - p.offsetWidth) / 2;
      var behavior = smooth && !REDUCED_MOTION ? 'smooth' : 'auto';
      if (typeof stage.scrollTo === 'function') stage.scrollTo({ left: Math.max(0, left), behavior: behavior });
      else stage.scrollLeft = Math.max(0, left);
    }

    function select(i, opts) {
      opts = opts || {};
      var prev = current;
      current = (i + tabs.length) % tabs.length;
      tabs.forEach(function (t, k) {
        var on = k === current;
        t.classList.toggle('is-active', on);
        t.classList.toggle('is-done', k < current);
        if (mode === 'tabs') {
          t.setAttribute('aria-selected', on ? 'true' : 'false');
          t.tabIndex = on ? 0 : -1;
        } else if (on) {
          t.setAttribute('aria-current', 'step');
        } else {
          t.removeAttribute('aria-current');
        }
      });
      panels.forEach(function (p, k) { p.classList.toggle('is-active', k === current); });
      if (railFill) railFill.style.height = (tabs.length > 1 ? (current / (tabs.length - 1)) * 100 : 0) + '%';
      if (opts.focus) tabs[current].focus();
      if (mode === 'carousel' && opts.scroll) scrollToPanel(current, opts.smooth);
      if (mode === 'tabs') restartBar();
      if (current !== prev || opts.force) runCounters(panels[current]);
    }

    function setMode() {
      var next = mq && mq.matches ? 'carousel' : 'tabs';
      if (next === mode) return;
      mode = next;
      if (mode === 'tabs') {
        list.setAttribute('role', 'tablist');
        list.setAttribute('aria-orientation', 'vertical');
        list.setAttribute('aria-label', listLabel);
        tabs.forEach(function (t, k) {
          t.setAttribute('role', 'tab');
          t.setAttribute('aria-controls', panels[k].id);
          t.removeAttribute('aria-current');
          t.removeAttribute('aria-label');
        });
        panels.forEach(function (p, k) {
          p.setAttribute('role', 'tabpanel');
          p.setAttribute('aria-labelledby', tabs[k].id);
          p.removeAttribute('aria-roledescription');
          p.removeAttribute('aria-label');
        });
        ['role', 'aria-roledescription', 'aria-label'].forEach(function (a) { stage.removeAttribute(a); });
      } else {
        list.setAttribute('role', 'group');
        list.removeAttribute('aria-orientation');
        tabs.forEach(function (t, k) {
          t.removeAttribute('role');
          t.removeAttribute('aria-selected');
          t.tabIndex = 0;
          t.setAttribute('aria-label', fill(T.goTo, { n: k + 1, t: titles[k] }));
        });
        panels.forEach(function (p, k) {
          p.setAttribute('role', 'group');
          p.removeAttribute('aria-labelledby');
          p.setAttribute('aria-roledescription', T.slide);
          p.setAttribute('aria-label', fill(T.stepOf, { n: k + 1, total: panels.length }));
        });
        stage.setAttribute('role', 'region');
        stage.setAttribute('aria-roledescription', T.carousel);
        stage.setAttribute('aria-label', listLabel);
      }
      select(current, { scroll: true, smooth: false });
      refreshPlayback();
    }

    tabs.forEach(function (tab, k) {
      tab.addEventListener('click', function () {
        if (mode === 'tabs') {
          userStopped = true;
          select(k);
          refreshPlayback();
        } else {
          select(k, { scroll: true, smooth: true });
        }
      });
      tab.addEventListener('keydown', function (e) {
        if (mode !== 'tabs') return;
        var next = null;
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') next = k + 1;
        else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') next = k - 1;
        else if (e.key === 'Home') next = 0;
        else if (e.key === 'End') next = tabs.length - 1;
        if (next === null) return;
        e.preventDefault();
        userStopped = true;
        select(next, { focus: true });
        refreshPlayback();
      });
    });

    /* Autoplay: the story bar of the active step is a CSS animation; its end advances */
    root.addEventListener('animationend', function (e) {
      if (!e.target.classList || !e.target.classList.contains('proc-bar-fill')) return;
      if (!canAutoplay() || e.target !== tabs[current].querySelector('.proc-bar-fill')) return;
      select(current + 1);
    });

    if (toggle) {
      toggle.addEventListener('click', function () {
        userStopped = !userStopped;
        if (!userStopped) restartBar();
        refreshPlayback();
      });
    }

    [list, stage].forEach(function (area) {
      area.addEventListener('mouseenter', function () { pause.hover = true; refreshPlayback(); });
      area.addEventListener('mouseleave', function () { pause.hover = false; refreshPlayback(); });
      area.addEventListener('focusin', function () { pause.focus = true; refreshPlayback(); });
      area.addEventListener('focusout', function (e) {
        if (!list.contains(e.relatedTarget) && !stage.contains(e.relatedTarget)) {
          pause.focus = false;
          refreshPlayback();
        }
      });
    });

    document.addEventListener('visibilitychange', function () {
      pause.hidden = document.hidden;
      refreshPlayback();
    });

    var io = onVisible(root, function (v) { pause.offscreen = !v; refreshPlayback(); }, 0.35);
    if (!io) pause.offscreen = false;

    /* All step photos are lazy; fetch and decode the five together as the section approaches,
       so neither the crossfade nor a swipe ever reveals an empty frame. */
    var imgs = Array.prototype.slice.call(stage.querySelectorAll('img'));
    var warmed = false;
    function warm() {
      if (warmed) return;
      warmed = true;
      imgs.forEach(function (img) {
        img.loading = 'eager';
        if (img.decode) img.decode().catch(function () { /* decoded on paint instead */ });
      });
    }
    if ('IntersectionObserver' in window) {
      var warmIo = new IntersectionObserver(function (entries) {
        if (entries.some(function (e) { return e.isIntersecting; })) { warm(); warmIo.disconnect(); }
      }, { rootMargin: '700px 0px' });
      warmIo.observe(root);
    } else {
      warm();
    }

    /* Carousel: the card nearest to the centre becomes the current step */
    var scrollRaf = 0;
    stage.addEventListener('scroll', function () {
      if (mode !== 'carousel' || scrollRaf) return;
      scrollRaf = requestAnimationFrame(function () {
        scrollRaf = 0;
        var centre = stage.scrollLeft + stage.clientWidth / 2;
        var best = current;
        var bestDist = Infinity;
        panels.forEach(function (p, k) {
          var d = Math.abs(p.offsetLeft + p.offsetWidth / 2 - centre);
          if (d < bestDist) { bestDist = d; best = k; }
        });
        if (best !== current) select(best);
      });
    }, { passive: true });

    if (mq) {
      var onChange = function () { setMode(); };
      if (mq.addEventListener) mq.addEventListener('change', onChange);
      else if (mq.addListener) mq.addListener(onChange);
    }
    if (MQ_REDUCED) {
      var onReduced = function () { REDUCED_MOTION = MQ_REDUCED.matches; refreshPlayback(); };
      if (MQ_REDUCED.addEventListener) MQ_REDUCED.addEventListener('change', onReduced);
      else if (MQ_REDUCED.addListener) MQ_REDUCED.addListener(onReduced);
    }

    /* The desktop crossfade (one panel at a time) only applies once this module runs: without
       JavaScript all five steps stay visible, stacked (styles.css · .proc.is-ready). */
    root.classList.add('is-ready');
    setMode();
  }

  /* ── 7. Dual live clock: Florida vs our technical office ────────────── */
  function initTimezones() {
    var root = document.querySelector('[data-tz]');
    if (!root || !window.Intl || !Intl.DateTimeFormat) return;

    var ZONES = { fl: 'America/New_York', eu: 'Europe/Tallinn' };
    var OPEN_H = 8;     // working day 08:00–18:00, Monday to Friday, in each zone
    var CLOSE_H = 18;
    var H12 = LANG === 'en';
    var WD = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
    var partsFmt = {};
    var dayFmt = {};

    try {
      Object.keys(ZONES).forEach(function (k) {
        partsFmt[k] = new Intl.DateTimeFormat('en-US', {
          timeZone: ZONES[k], hourCycle: 'h23', weekday: 'short',
          year: 'numeric', month: 'numeric', day: 'numeric',
          hour: '2-digit', minute: '2-digit', second: '2-digit'
        });
        dayFmt[k] = new Intl.DateTimeFormat(T.locale, { timeZone: ZONES[k], weekday: 'long' });
      });
    } catch (e) {
      return; /* very old engine without time-zone support: keep the static sentence */
    }

    function zoned(date, k) {
      var o = {};
      partsFmt[k].formatToParts(date).forEach(function (p) { o[p.type] = p.value; });
      return {
        y: +o.year, mo: +o.month, d: +o.day,
        h: (+o.hour) % 24, mi: +o.minute, s: +o.second,
        wd: WD[o.weekday]
      };
    }

    /* Minutes east of UTC for a zone at a given instant (DST-safe) */
    function offsetMin(date, k) {
      var z = zoned(date, k);
      var wall = Date.UTC(z.y, z.mo - 1, z.d, z.h, z.mi, z.s);
      return Math.round((wall - Math.floor(date.getTime() / 1000) * 1000) / 60000);
    }

    function pad(n) { return (n < 10 ? '0' : '') + n; }

    function hm(h, m) {
      if (!H12) return pad(h) + ':' + pad(m);
      var hh = h % 12 || 12;
      return hh + ':' + pad(m) + (h < 12 ? ' AM' : ' PM');
    }

    function minutesLabel(mins) {
      var m = ((Math.round(mins) % 1440) + 1440) % 1440;
      return hm(Math.floor(m / 60), m % 60);
    }

    function isWorking(z) {
      return z.wd >= 1 && z.wd <= 5 && z.h >= OPEN_H && z.h < CLOSE_H;
    }

    /* Next opening of the office (08:00 Europe/Tallinn on a weekday) as an absolute Date */
    function nextOpening(now) {
      var z = zoned(now, 'eu');
      var base = Date.UTC(z.y, z.mo - 1, z.d);
      for (var add = 0; add < 8; add++) {
        var dayStart = new Date(base + add * 86400000);
        var wd = (z.wd + add) % 7;
        if (wd === 0 || wd === 6) continue;
        if (add === 0 && (z.h * 60 + z.mi) >= OPEN_H * 60) continue;
        var wallMs = dayStart.getTime() + OPEN_H * 3600000;
        var guess = new Date(wallMs - offsetMin(new Date(wallMs), 'eu') * 60000);
        return new Date(wallMs - offsetMin(guess, 'eu') * 60000);
      }
      return null;
    }

    var els = {
      hm: { fl: root.querySelector('[data-tz-hm="fl"]'), eu: root.querySelector('[data-tz-hm="eu"]') },
      s: { fl: root.querySelector('[data-tz-s="fl"]'), eu: root.querySelector('[data-tz-s="eu"]') },
      day: { fl: root.querySelector('[data-tz-day="fl"]'), eu: root.querySelector('[data-tz-day="eu"]') },
      work: { fl: root.querySelector('[data-tz-work="fl"]'), eu: root.querySelector('[data-tz-work="eu"]') },
      overlap: root.querySelector('[data-tz-overlap]'),
      now: root.querySelector('[data-tz-now]'),
      strip: root.querySelector('[data-tz-strip]'),
      sentence: root.querySelector('[data-tz-sentence]')
    };

    function setText(el, txt) {
      if (el && el.textContent !== txt) el.textContent = txt;
    }

    /* Paint one or two segments (a window can wrap past midnight) inside a track */
    function paintWindow(el, start, end) {
      if (!el) return;
      var track = el.parentNode;
      Array.prototype.slice.call(track.querySelectorAll('.tz-work-extra')).forEach(function (n) { n.remove(); });
      var segs = [];
      if (start < 0) segs.push([start + 1440, 1440], [0, end]);
      else if (end > 1440) segs.push([start, 1440], [0, end - 1440]);
      else segs.push([start, end]);
      segs.forEach(function (sg, i) {
        var node = el;
        if (i > 0) {
          node = el.cloneNode(false);
          node.removeAttribute('data-tz-work');
          node.classList.add('tz-work-extra');
          track.appendChild(node);
        }
        node.style.left = (sg[0] / 14.4) + '%';
        node.style.width = ((sg[1] - sg[0]) / 14.4) + '%';
      });
    }

    var lastMinuteKey = '';

    function render() {
      var now = new Date();
      var fl = zoned(now, 'fl');
      var eu = zoned(now, 'eu');

      ['fl', 'eu'].forEach(function (k) {
        var z = k === 'fl' ? fl : eu;
        if (H12) {
          setText(els.hm[k], (z.h % 12 || 12) + ':' + pad(z.mi));
          setText(els.s[k], ':' + pad(z.s) + (z.h < 12 ? ' AM' : ' PM'));
        } else {
          setText(els.hm[k], pad(z.h) + ':' + pad(z.mi));
          setText(els.s[k], ':' + pad(z.s));
        }
      });

      var minuteKey = fl.y + '-' + fl.mo + '-' + fl.d + ' ' + fl.h + ':' + fl.mi;
      if (minuteKey === lastMinuteKey) return;
      lastMinuteKey = minuteKey;

      setText(els.day.fl, dayFmt.fl.format(now));
      setText(els.day.eu, dayFmt.eu.format(now));

      /* 24 h strip in Florida time */
      var diff = offsetMin(now, 'eu') - offsetMin(now, 'fl');
      var flStart = OPEN_H * 60;
      var flEnd = CLOSE_H * 60;
      var euStart = OPEN_H * 60 - diff;
      var euEnd = CLOSE_H * 60 - diff;
      paintWindow(els.work.fl, flStart, flEnd);
      paintWindow(els.work.eu, euStart, euEnd);

      var normStart = ((euStart % 1440) + 1440) % 1440;
      var normEnd = normStart + (euEnd - euStart);
      var ovStart = Math.max(flStart, normStart);
      var ovEnd = Math.min(flEnd, normEnd);
      if (els.overlap) {
        if (ovEnd > ovStart) {
          els.overlap.hidden = false;
          els.overlap.style.left = (ovStart / 14.4) + '%';
          els.overlap.style.width = ((ovEnd - ovStart) / 14.4) + '%';
        } else {
          els.overlap.hidden = true;
        }
      }
      if (els.now) els.now.style.left = ((fl.h * 60 + fl.mi) / 14.4) + '%';

      if (els.strip) {
        var label = fill(T.tzAria, {
          a: minutesLabel(flStart), b: minutesLabel(flEnd),
          c: minutesLabel(euStart), d: minutesLabel(euEnd)
        });
        if (ovEnd > ovStart) label += fill(T.tzAriaOverlap, { e: minutesLabel(ovStart), f: minutesLabel(ovEnd) });
        els.strip.setAttribute('aria-label', label);
      }

      /* The sentence: open now, or when we start on the next working morning */
      if (els.sentence) {
        var html;
        if (isWorking(eu)) {
          html = fill(T.tzOpen, {
            eu: '<span class="tz-hl">' + hm(eu.h, eu.mi) + '</span>',
            fl: '<span class="tz-hl">' + hm(fl.h, fl.mi) + '</span>'
          });
        } else {
          var open = nextOpening(now);
          if (open) {
            var flOpen = zoned(open, 'fl');
            html = fill(T.tzNext, {
              day: dayFmt.eu.format(open),
              eu: '<span class="tz-hl">' + hm(OPEN_H, 0) + '</span>',
              fl: '<span class="tz-hl">' + hm(flOpen.h, flOpen.mi) + '</span>'
            });
          }
        }
        if (html && els.sentence.innerHTML !== html) els.sentence.innerHTML = html;
      }
    }

    var timer = null;
    var running = false;
    var inView = true;

    function loop() {
      render();
      timer = setTimeout(loop, 1000 - (Date.now() % 1000) + 15);
    }
    function start() {
      if (running) return;
      running = true;
      loop();
    }
    function stop() {
      running = false;
      clearTimeout(timer);
    }
    function sync() {
      if (inView && !document.hidden) start();
      else stop();
    }

    /* Clocks and strip are hidden until this point (styles.css · .tz:not(.is-ready)): without
       JavaScript only the static sentence shows, never "--:--". */
    root.classList.add('is-ready');
    render();
    onVisible(root, function (v) { inView = v; sync(); }, 0);
    document.addEventListener('visibilitychange', sync);
    sync();
  }

  /* ── 8. LEGACY 4-step stepper — only /en/index.html until it is ported to v3 ── */
  function initContractStepper() {
    var root = document.querySelector('[data-contract-stepper]');
    if (!root) return;

    var steps = Array.prototype.slice.call(root.querySelectorAll('[data-step-btn]'));
    var panels = Array.prototype.slice.call(root.querySelectorAll('[data-step-panel]'));
    var progressFill = root.querySelector('[data-step-progress]');
    var prevBtn = root.querySelector('[data-step-prev]');
    var nextBtn = root.querySelector('[data-step-next]');
    if (!steps.length || !panels.length) return;

    var current = 0;
    var paused = false;

    function goTo(index, fromUser) {
      current = (index + steps.length) % steps.length;
      steps.forEach(function (btn, i) {
        btn.classList.toggle('active', i === current);
        btn.classList.toggle('completed', i < current);
        btn.setAttribute('aria-selected', i === current ? 'true' : 'false');
      });
      panels.forEach(function (panel, i) {
        panel.classList.toggle('active', i === current);
        panel.hidden = i !== current;
      });
      if (progressFill) progressFill.style.width = ((current + 1) / steps.length) * 100 + '%';
      if (fromUser) {
        paused = true;
        root.classList.add('is-paused');
      }
    }

    steps.forEach(function (btn, i) {
      btn.addEventListener('click', function () { goTo(i, true); });
      btn.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          e.preventDefault();
          goTo(i + 1, true);
          steps[current].focus();
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          e.preventDefault();
          goTo(i - 1, true);
          steps[current].focus();
        }
      });
    });

    if (prevBtn) prevBtn.addEventListener('click', function () { goTo(current - 1, true); });
    if (nextBtn) nextBtn.addEventListener('click', function () { goTo(current + 1, true); });
    root.addEventListener('mouseenter', function () { paused = true; });
    root.addEventListener('mouseleave', function () {
      if (!root.classList.contains('is-paused')) paused = false;
    });

    goTo(0, false);
    if (!REDUCED_MOTION) {
      setInterval(function () {
        if (!paused && !document.hidden) goTo(current + 1, false);
      }, 5500);
    }
  }

  function boot() {
    var modules = [initScrollChrome, initHeroWord, initHeroTelemetry,
      initDeliverableZoom, initScopeConfigurator, initProcess, initTimezones, initContractStepper];
    modules.forEach(function (fn) {
      try { fn(); } catch (err) {
        if (window.console && console.error) console.error('[interactive] ' + (fn.name || 'module') + ':', err);
      }
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
