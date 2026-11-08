/**
 * Pr3cise — Cipher effects (letters ⇄ digits)
 *
 * 2026-11-08 | Restored the original "cash register" letter scramble that the
 * 2026-11-07 redesign had switched off, and extended it:
 *   - Nav links (.site-nav > ul > li > a) and text CTAs (.btn-cta): on hover the
 *     letters roll through digits and land on the Pr3cise cipher (E→3, A→4,
 *     S→5, O→0…); on leave they roll back. On touch screens each CTA plays the
 *     roll once when it first scrolls into view.
 *   - Hero keyword (.hero-precision): loop with the original timing (roll to cipher, hold 2 s,
 *     roll back, rest 3 s), also on hover/tap. Since 2026-11-08 it starts after the first
 *     interaction, plays 3 times on its own, waits while the hero is off-screen, and on v3
 *     pages is drawn by an aria-hidden overlay so the H1 text never changes.
 *   - [data-cipher-decode]: text decodes from rolling digits the first time it
 *     enters the viewport (section eyebrows).
 *   - [data-cipher-count]: only the digits of a figure roll like a counter and
 *     settle on the real value ("24–72 h", "< 24 h", "0 €").
 *   - [data-cipher-hover]: opt-in hover scramble for any other text element.
 * Fixes vs. the original: no layout shift (width is locked while rolling),
 * elements with icons keep their markup (only text nodes are animated),
 * screen readers always get the real text (aria-label), and
 * prefers-reduced-motion disables all motion.
 */
(function () {
    'use strict';

    var REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var NO_HOVER = window.matchMedia && window.matchMedia('(hover: none)').matches;

    /* Rolling frames: mostly digits, a few currency signs (cash-register feel) */
    var ROLL = '0123456789012345678901234567890123456789€$£¥%#';
    var DIGITS = '0123456789';

    /* Landing cipher: digits wherever a digit looks like the letter (the brand's
       own E→3), and look-alike glyphs from the original version elsewhere. */
    var CIPHER = {
        A: '4', B: '8', C: '©', D: 'Ð', E: '3', F: 'ƒ', G: '6', H: '#', I: '1',
        J: '¥', K: 'К', L: '£', M: 'М', N: 'И', O: '0', P: 'Р', Q: '9', R: 'Я',
        S: '5', T: '7', U: 'Ц', V: '√', W: 'Ш', X: '×', Y: '¥', Z: '2',
        'Á': '4', 'À': '4', 'Ä': '4', 'Â': '4', 'É': '3', 'È': '3', 'Ê': '3', 'Ë': '3',
        'Í': '1', 'Ì': '1', 'Î': '1', 'Ï': '1', 'Ó': '0', 'Ò': '0', 'Ö': '0', 'Ô': '0',
        'Ú': 'Ц', 'Ù': 'Ц', 'Ü': 'Ц', 'Û': 'Ц', 'Ñ': 'И', 'Ç': '©', 'ß': '8'
    };

    function cipherChar(ch) {
        var up = ch.toUpperCase();
        return CIPHER[up] || ch;
    }

    function cipherText(text) {
        return Array.from(text).map(cipherChar).join('');
    }

    function rollChar() {
        return ROLL.charAt(Math.floor(Math.random() * ROLL.length));
    }

    function isBlank(ch) {
        return ch === ' ' || ch === ' ' || ch === '\n' || ch === '\t';
    }

    /* Non-empty text nodes of an element (so icons / child markup survive) */
    function textNodes(el) {
        var out = [];
        var walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
        var n;
        while ((n = walker.nextNode())) {
            if (n.nodeValue && n.nodeValue.trim()) out.push(n);
        }
        return out;
    }

    /* Build an animation target: each text node with its original and cipher */
    function makeTarget(el) {
        if (el.__cipher) return el.__cipher;
        var nodes = textNodes(el);
        if (!nodes.length) return null;
        var parts = nodes.map(function (node) {
            var original = node.nodeValue;
            return { node: node, original: original, cipher: cipherText(original) };
        });
        var label = el.textContent.replace(/\s+/g, ' ').trim();
        if (label && !el.hasAttribute('aria-label') && el.tagName !== 'SPAN') {
            el.setAttribute('aria-label', label);
        }
        el.__cipher = { el: el, parts: parts, token: null };
        return el.__cipher;
    }

    /* Lock the rendered box while rolling so neighbours never jump. 2026-11-08: the height is
       pinned too, so a label that would wrap mid-roll (a wider fallback font, a long word) can
       never make a button taller. */
    function lock(el) {
        if (el.dataset.cipherLocked === '1') return;
        var r = el.getBoundingClientRect();
        if (!r.width) return;
        var wasInline = window.getComputedStyle(el).display === 'inline';   /* read once: the style object is live */
        el.dataset.cipherLocked = '1';
        el.dataset.cipherPrevWidth = el.style.width || '';
        el.dataset.cipherPrevHeight = el.style.height || '';
        el.dataset.cipherPrevDisplay = el.style.display || '';
        el.dataset.cipherPrevWs = el.style.whiteSpace || '';
        el.style.whiteSpace = 'nowrap';
        if (wasInline) el.style.display = 'inline-block';
        /* Exact sub-pixel size (no rounding up): the box must not grow even by 1 px */
        el.style.width = r.width + 'px';
        /* An inline box's rect is its glyph area, taller than its line: only boxes get a pinned height */
        if (!wasInline) el.style.height = r.height + 'px';
    }

    function unlock(el) {
        if (el.dataset.cipherLocked !== '1') return;
        el.style.width = el.dataset.cipherPrevWidth || '';
        el.style.height = el.dataset.cipherPrevHeight || '';
        el.style.display = el.dataset.cipherPrevDisplay || '';
        el.style.whiteSpace = el.dataset.cipherPrevWs || '';
        delete el.dataset.cipherLocked;
        delete el.dataset.cipherPrevWidth;
        delete el.dataset.cipherPrevHeight;
        delete el.dataset.cipherPrevDisplay;
        delete el.dataset.cipherPrevWs;
    }

    /**
     * Roll every text node of the target towards `key` ('cipher' | 'original').
     * Characters land in a left-to-right wave between 15 % and 80 % of the
     * duration — the timing of the original 2025 effect.
     * opts.digitsOnly: only digit positions roll (used for figures).
     */
    function rollTo(target, key, duration, opts) {
        opts = opts || {};
        var token = {};
        target.token = token;
        var start = null;
        var FRAME = 35;
        var last = 0;

        var total = 0;
        target.parts.forEach(function (p) { total += Array.from(p[key]).length; });
        var landAt = [];
        for (var i = 0; i < total; i++) {
            landAt.push(0.15 + (i / Math.max(total - 1, 1)) * 0.65);
        }

        return new Promise(function (resolve) {
            function frame(now) {
                if (target.token !== token) { resolve(false); return; }
                if (start === null) start = now;
                if (now - last < FRAME && now - start < duration) {
                    requestAnimationFrame(frame);
                    return;
                }
                last = now;
                var progress = Math.min((now - start) / duration, 1);
                var idx = 0;
                target.parts.forEach(function (p) {
                    var chars = Array.from(p[key]);
                    var out = '';
                    for (var c = 0; c < chars.length; c++, idx++) {
                        var ch = chars[c];
                        if (isBlank(ch) || progress >= landAt[idx]) {
                            out += ch;
                        } else if (opts.digitsOnly) {
                            out += /\d/.test(ch) ? DIGITS.charAt(Math.floor(Math.random() * 10)) : ch;
                        } else {
                            out += rollChar();
                        }
                    }
                    p.node.nodeValue = out;
                });
                if (progress < 1) {
                    requestAnimationFrame(frame);
                } else {
                    target.parts.forEach(function (p) { p.node.nodeValue = p[key]; });
                    resolve(true);
                }
            }
            requestAnimationFrame(frame);
        });
    }

    function restore(target) {
        target.token = null;
        target.parts.forEach(function (p) { p.node.nodeValue = p.original; });
    }

    /* ── Hover scramble (nav links, CTAs, opt-in elements) ─────────────── */
    function attachHover(el, forwardMs, reverseMs) {
        if (el.__cipherHover) return;
        var target = makeTarget(el);
        if (!target) return;
        el.__cipherHover = true;

        el.addEventListener('mouseenter', function () {
            lock(el);
            el.classList.add('scrambling');
            rollTo(target, 'cipher', forwardMs);
        });

        el.addEventListener('mouseleave', function () {
            rollTo(target, 'original', reverseMs).then(function (done) {
                if (done) {
                    el.classList.remove('scrambling');
                    unlock(el);
                }
            });
        });

        /* Keyboard users get the original text immediately on blur */
        el.addEventListener('blur', function () {
            restore(target);
            el.classList.remove('scrambling');
            unlock(el);
        });
    }

    /* Touch screens: play one forward/back roll when a CTA first appears */
    function playOnce(el, forwardMs, holdMs, reverseMs) {
        var target = makeTarget(el);
        if (!target) return;
        lock(el);
        el.classList.add('scrambling');
        rollTo(target, 'cipher', forwardMs).then(function (done) {
            if (!done) return;
            setTimeout(function () {
                rollTo(target, 'original', reverseMs).then(function (ok) {
                    if (ok) {
                        el.classList.remove('scrambling');
                        unlock(el);
                    }
                });
            }, holdMs);
        });
    }

    /* ── Hero keyword loop (original timing) ───────────────────────────── */
    function visibleHeroWord() {
        var all = document.querySelectorAll('.hero-precision');
        for (var i = 0; i < all.length; i++) {
            if (all[i].offsetParent !== null) return all[i];
        }
        return null;
    }

    /* 2026-11-08 (v3 review):
       - The loop starts only after the visitor interacts (pointer, scroll, touch, key), so the
         first paint and crawlers (which never interact) always get the real word.
       - It plays at most HERO_MAX_CYCLES times on its own (WCAG 2.2.2) and waits while the hero
         is under 10 % visible or the tab is hidden. Hover and click still replay it.
       - When the word is nowrap (v3 pages) the roll is drawn by an aria-hidden overlay on top of
         the word: the H1 keeps the real text for screen readers, copy/paste and translation at
         every moment, and nothing can reflow. Older markup (a word that may wrap) rolls in place
         and its heading gets an aria-label with the real text. */
    /* 6 rolls per visit to the hero (~40 s); the count starts again every time the hero comes
       back into view, so the word keeps transforming like the original loop the owner asked for. */
    var HERO_MAX_CYCLES = 6;
    var HERO_START_EVENTS = ['pointermove', 'pointerdown', 'touchstart', 'scroll', 'wheel', 'keydown'];

    function initHeroLoop() {
        var el = visibleHeroWord();
        if (!el) return;
        var useOverlay = window.getComputedStyle(el).whiteSpace === 'nowrap';
        var target = null;
        var busy = false;
        var timer = null;
        var cycles = 0;
        var started = false;
        var inView = true;

        function getTarget() {
            if (target) return target;
            if (useOverlay) {
                var fx = document.createElement('span');
                fx.className = 'hero-precision-fx';
                fx.setAttribute('aria-hidden', 'true');
                fx.textContent = el.textContent;
                el.classList.add('has-fx');
                el.appendChild(fx);
                target = makeTarget(fx);
            } else {
                var heading = el.closest('h1, h2, p');
                if (heading && !heading.hasAttribute('aria-label')) {
                    heading.setAttribute('aria-label', heading.textContent.replace(/\s+/g, ' ').trim());
                }
                target = makeTarget(el);
            }
            return target;
        }

        function canAuto() {
            return started && inView && !document.hidden && cycles < HERO_MAX_CYCLES;
        }

        function schedule(ms) {
            clearTimeout(timer);
            if (canAuto()) timer = setTimeout(function () { cycle(false); }, ms);
        }

        function cycle(manual) {
            if (busy) return;
            if (!manual && !canAuto()) return;
            var t = getTarget();
            if (!t) return;
            busy = true;
            if (!manual) cycles++;
            el.classList.add('scrambling');
            rollTo(t, 'cipher', 900).then(function (done) {
                if (!done) { el.classList.remove('scrambling'); busy = false; return; }
                setTimeout(function () {
                    rollTo(t, 'original', 700).then(function () {
                        el.classList.remove('scrambling');
                        busy = false;
                        schedule(3000);
                    });
                }, 2000);
            });
        }

        function onFirstInteraction() {
            HERO_START_EVENTS.forEach(function (ev) { window.removeEventListener(ev, onFirstInteraction, true); });
            if (started) return;
            started = true;
            schedule(1800);
        }
        HERO_START_EVENTS.forEach(function (ev) {
            window.addEventListener(ev, onFirstInteraction, { capture: true, passive: true });
        });

        if ('IntersectionObserver' in window) {
            var hero = el.closest('section') || el;
            var leftView = false;
            new IntersectionObserver(function (entries) {
                var e = entries[entries.length - 1];
                inView = e.isIntersecting && e.intersectionRatio >= 0.1;
                if (!inView) {
                    clearTimeout(timer);
                    leftView = true;
                } else {
                    if (leftView) { cycles = 0; leftView = false; }
                    if (!busy) schedule(1200);
                }
            }, { threshold: [0, 0.1, 0.25] }).observe(hero);
        }

        document.addEventListener('visibilitychange', function () {
            if (document.hidden) clearTimeout(timer);
            else if (!busy) schedule(1200);
        });

        el.addEventListener('mouseenter', function () {
            if (!busy) { clearTimeout(timer); cycle(true); }
        });
        el.addEventListener('click', function () {
            if (!busy) { clearTimeout(timer); cycle(true); }
        });
    }

    /* ── Reveal-on-view effects (decode / count) ───────────────────────── */
    function onFirstView(elements, cb) {
        if (!elements.length) return;
        if (!('IntersectionObserver' in window)) {
            elements.forEach(cb);
            return;
        }
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    io.unobserve(entry.target);
                    cb(entry.target);
                }
            });
        }, { threshold: 0.6 });
        elements.forEach(function (el) { io.observe(el); });
    }

    function initDecode() {
        var els = Array.prototype.slice.call(document.querySelectorAll('[data-cipher-decode]'));
        onFirstView(els, function (el) {
            var target = makeTarget(el);
            if (!target) return;
            var len = el.textContent.length;
            rollTo(target, 'original', Math.min(1400, 500 + len * 28));
        });
    }

    function initCount() {
        var els = Array.prototype.slice.call(document.querySelectorAll('[data-cipher-count]'));
        onFirstView(els, function (el) {
            var target = makeTarget(el);
            if (!target) return;
            lock(el);
            rollTo(target, 'original', 1300, { digitsOnly: true }).then(function () { unlock(el); });
        });
    }

    function init() {
        if (REDUCED) return;

        document.querySelectorAll('.site-nav > ul > li > a').forEach(function (el) {
            attachHover(el, 1100, 450);
        });

        var ctas = Array.prototype.slice.call(document.querySelectorAll('.btn-cta'));
        ctas.forEach(function (el) {
            if (el.querySelector('img, svg')) return;
            attachHover(el, 900, 350);
        });
        if (NO_HOVER) {
            onFirstView(ctas.filter(function (el) { return !el.querySelector('img, svg'); }), function (el) {
                playOnce(el, 800, 650, 450);
            });
        }

        document.querySelectorAll('[data-cipher-hover]').forEach(function (el) {
            attachHover(el, 900, 400);
        });

        initHeroLoop();
        initDecode();
        initCount();
    }

    /* Rolled text must never be submitted or copied mid-animation: restore on pagehide */
    window.addEventListener('pagehide', function () {
        document.querySelectorAll('.scrambling, .hero-precision-fx').forEach(function (el) {
            if (el.__cipher) restore(el.__cipher);
        });
    });

    window.Pr3ciseCipher = { cipherText: cipherText, rollTo: rollTo, makeTarget: makeTarget };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
