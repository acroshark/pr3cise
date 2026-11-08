/**
 * nivel.js — spirit-level check of the Pr3cise contact form (es / en / de / fr).
 *
 * 2026-11-08 | Moved here from the four inline copies on the contact pages.
 * The canvas drawing and the spring physics are the original ones; what
 * changed is how the check behaves, so that it can never cost a lead:
 *
 *  - The submit button is always clickable. This script only keeps
 *    form.dataset.human = 'true' | 'false' and the status line up to date;
 *    main.js reads it on submit and, if needed, asks the visitor to level.
 *  - Easy to solve: start tilt ±7–12°, "magnetic" snap to 0 when the slider
 *    is moved with the keyboard within ±1.4°, or released (pointer / finger)
 *    within ±1.4° or ±14 px of track, whichever is wider: a 192 px phone
 *    slider gets ±3.5°, desktop about ±1.7° (with 1.4° alone a finger had to
 *    land within ±6 px of the centre). Solved when |angle| < 1.0° and
 *    |bubble x| < 4, and it stays solved until the slider goes beyond ±2°.
 *  - Keyboard: arrows 0.2° (native step), PageUp / PageDown 2°, Home / End
 *    keep the native min / max. aria-valuetext reads "Inclinación 3,4°".
 *  - The animation loop pauses while the level is off-screen
 *    (IntersectionObserver), while the tab is hidden and once the bubble has
 *    settled; any change wakes it up. With prefers-reduced-motion the static
 *    resting state is drawn on every change instead (no spring animation).
 *  - 'pr3cise:form-reset' (fired by main.js after a successful send)
 *    re-randomises the tilt and sets human back to 'false'.
 *  - window.Pr3ciseNivel.check() lets main.js settle the physics on submit,
 *    so somebody who has just centred the slider is not asked to wait.
 *
 * Safe to load with or without `defer`, before or after DOMContentLoaded.
 */
(function () {
    'use strict';

    var MSG = {
        es: { ok: '✓ Nivel correcto — ya puedes enviar', drag: 'Arrastra el deslizador para centrar la burbuja', tilt: 'Inclinación', dec: ',' },
        en: { ok: '✓ Level is true — you can send now', drag: 'Drag the slider to center the bubble', tilt: 'Tilt', dec: '.' },
        de: { ok: '✓ Libelle im Lot — Sie können jetzt senden', drag: 'Schieberegler ziehen, um die Libelle auszurichten', tilt: 'Neigung', dec: ',' },
        fr: { ok: '✓ Niveau centré — vous pouvez envoyer', drag: 'Faites glisser le curseur pour centrer la bulle', tilt: 'Inclinaison', dec: ',' }
    };

    var MIN = -20, MAX = 20;      // slider range (degrees)
    var SNAP = 1.4;               // |value| <= SNAP jumps to 0 on release / keyboard
    var SNAP_PX = 14;             // pointer release: snap window at least ±14 px of track
    var THUMB_PX = 30;            // thumb width (contacto.css)
    var UNSOLVE = 2;              // once solved, only |value| > UNSOLVE un-solves it
    var SOLVED_ANGLE = 1.0;       // solved when |angle| < 1.0°
    var SOLVED_BUBBLE = 4;        //   ... and |bubble x| < 4
    var PAGE_STEP = 2;            // PageUp / PageDown
    var KEY_WINDOW_MS = 400;      // an 'input' this soon after a key press counts as keyboard input

    /* The form's own language (hidden user_lang input): i18n.js may rewrite
       <html lang> with ?lang=xx while the form itself stays in its language. */
    function msgs() {
        var form = document.getElementById('contact-form');
        var field = form ? form.querySelector('input[name="user_lang"]') : null;
        var l = String((field && field.value) || document.documentElement.lang || 'es').slice(0, 2).toLowerCase();
        return MSG[l] || MSG.es;
    }

    function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
    function toStep(v) { return Math.round(v * 5) / 5; }          // multiples of 0.2

    function init() {
        var form = document.getElementById('contact-form');
        var box = form ? form.querySelector('.level-captcha') : null;
        var sl = document.getElementById('level-slider');
        var stEl = document.getElementById('level-status');
        var cv = document.getElementById('lv');
        if (!form || !box || !sl || !stEl || !cv || typeof cv.getContext !== 'function') return;
        if (form.getAttribute('data-level-ready') === '1') return;
        var g = cv.getContext('2d');
        if (!g) return;

        var REDUCED = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

        function randomTilt() {
            var sign = Math.random() < 0.5 ? -1 : 1;
            return sign * toStep(7 + Math.random() * 5);           /* ±7–12° */
        }

        var startTilt = randomTilt();
        var solved = false;
        sl.min = String(MIN); sl.max = String(MAX); sl.step = '0.2';
        sl.value = String(startTilt);

        /* ── Canvas + physics (original) ─────────────────────────────── */
        var hB = { x: 0, vx: 0 };
        var lC = { x: 0, y: 0, vx: 0, vy: 0 }, rC = { x: 0, y: 0, vx: 0, vy: 0 };
        var tA = startTilt, dA = startTilt;
        var K = 0.018, DF = 0.945;

        function rrect(x, y, w, h, r) {
            g.beginPath();
            g.moveTo(x + r, y); g.lineTo(x + w - r, y); g.arcTo(x + w, y, x + w, y + r, r);
            g.lineTo(x + w, y + h - r); g.arcTo(x + w, y + h, x + w - r, y + h, r);
            g.lineTo(x + r, y + h); g.arcTo(x, y + h, x, y + h - r, r);
            g.lineTo(x, y + r); g.arcTo(x, y, x + r, y, r); g.closePath();
        }

        function phys() {
            dA += (tA - dA) * 0.14;
            var a = dA * Math.PI / 180;
            var hT = -Math.sin(a) * 50;
            hB.vx += K * (hT - hB.x); hB.vx *= DF; hB.x += hB.vx;
            if (Math.abs(hB.x) > 37) { hB.x = Math.sign(hB.x) * 37; hB.vx *= -0.18; }
            var cTx = -Math.sin(a) * 21;
            [lC, rC].forEach(function (b) {
                b.vx += K * (cTx - b.x); b.vx *= DF; b.x += b.vx;
                b.vy += K * (0 - b.y); b.vy *= DF; b.y += b.vy;
                var d = Math.hypot(b.x, b.y);
                if (d > 20) { var r = 20 / d; b.x *= r; b.y *= r; b.vx *= -0.14; b.vy *= -0.14; }
            });
        }

        /* Resting state for the current target: used with reduced motion and
           when main.js asks for a decision on submit. */
        function settle() {
            dA = tA;
            var a = dA * Math.PI / 180;
            hB.x = clamp(-Math.sin(a) * 50, -37, 37); hB.vx = 0;
            var cTx = clamp(-Math.sin(a) * 21, -20, 20);
            [lC, rC].forEach(function (b) { b.x = cTx; b.y = 0; b.vx = 0; b.vy = 0; });
        }

        function drawHVial(cx, cy, bub) {
            var vw = 120, vh = 30;
            g.fillStyle = '#181818'; rrect(cx - vw / 2 - 5, cy - vh / 2 - 5, vw + 10, vh + 10, 7); g.fill();
            g.strokeStyle = 'rgba(255,255,255,0.06)'; g.lineWidth = 0.5;
            rrect(cx - vw / 2 - 5, cy - vh / 2 - 5, vw + 10, vh + 10, 7); g.stroke();
            var lg = g.createLinearGradient(0, cy - vh / 2, 0, cy + vh / 2);
            lg.addColorStop(0, '#B8D600'); lg.addColorStop(0.45, '#8CAA00'); lg.addColorStop(1, '#5A7000');
            g.fillStyle = lg; rrect(cx - vw / 2, cy - vh / 2, vw, vh, 4); g.fill();
            var is = g.createLinearGradient(0, cy - vh / 2, 0, cy - vh / 2 + 7);
            is.addColorStop(0, 'rgba(0,0,0,0.28)'); is.addColorStop(1, 'rgba(0,0,0,0)');
            g.fillStyle = is; rrect(cx - vw / 2, cy - vh / 2, vw, vh, 4); g.fill();
            [cx - 13, cx + 13].forEach(function (lx) {
                g.strokeStyle = 'rgba(0,0,0,0.6)'; g.lineWidth = 1.2;
                g.beginPath(); g.moveTo(lx, cy - vh / 2 + 3); g.lineTo(lx, cy + vh / 2 - 3); g.stroke();
                g.strokeStyle = 'rgba(255,255,255,0.08)'; g.lineWidth = 0.4;
                g.beginPath(); g.moveTo(lx + 0.5, cy - vh / 2 + 3); g.lineTo(lx + 0.5, cy + vh / 2 - 3); g.stroke();
            });
            g.strokeStyle = 'rgba(0,0,0,0.2)'; g.lineWidth = 0.4;
            g.beginPath(); g.moveTo(cx, cy - vh / 2 + 4); g.lineTo(cx, cy + vh / 2 - 4); g.stroke();
            var bx = cx + bub.x, by = cy, bw = 34, bh = 18;
            var bbg = g.createRadialGradient(bx - 5, by - 4, 1, bx, by, bw / 2);
            bbg.addColorStop(0, 'rgba(255,255,232,0.97)');
            bbg.addColorStop(0.3, 'rgba(238,255,88,0.9)');
            bbg.addColorStop(0.72, 'rgba(192,232,58,0.66)');
            bbg.addColorStop(1, 'rgba(150,200,38,0.22)');
            g.fillStyle = bbg; g.beginPath(); g.ellipse(bx, by, bw / 2, bh / 2, 0, 0, Math.PI * 2); g.fill();
            g.strokeStyle = 'rgba(210,248,80,0.45)'; g.lineWidth = 0.8;
            g.beginPath(); g.ellipse(bx, by, bw / 2, bh / 2, 0, 0, Math.PI * 2); g.stroke();
            g.fillStyle = 'rgba(255,255,255,0.72)';
            g.beginPath(); g.ellipse(bx - 6, by - 4, 7, 3.5, -0.3, 0, Math.PI * 2); g.fill();
            g.strokeStyle = 'rgba(255,255,255,0.16)'; g.lineWidth = 1;
            rrect(cx - vw / 2, cy - vh / 2, vw, vh, 4); g.stroke();
        }

        function drawCVial(cx, cy, bub) {
            var R = 27;
            var og = g.createRadialGradient(cx - 5, cy - 5, 4, cx, cy, R + 9);
            og.addColorStop(0, '#6A6A6A'); og.addColorStop(0.5, '#222'); og.addColorStop(1, '#0C0C0C');
            g.fillStyle = og; g.beginPath(); g.arc(cx, cy, R + 9, 0, Math.PI * 2); g.fill();
            g.strokeStyle = 'rgba(255,255,255,0.12)'; g.lineWidth = 1.5;
            g.beginPath(); g.arc(cx, cy, R + 6, -2.7, -0.45); g.stroke();
            g.strokeStyle = 'rgba(255,255,255,0.04)'; g.lineWidth = 2;
            g.beginPath(); g.arc(cx, cy, R + 2, 0, Math.PI * 2); g.stroke();
            var lq = g.createRadialGradient(cx - 6, cy - 6, 3, cx, cy, R);
            lq.addColorStop(0, '#CCDF00'); lq.addColorStop(0.5, '#98B400'); lq.addColorStop(1, '#617000');
            g.fillStyle = lq; g.beginPath(); g.arc(cx, cy, R, 0, Math.PI * 2); g.fill();
            var sh = g.createRadialGradient(cx, cy - R + 8, 2, cx, cy - R + 14, R - 2);
            sh.addColorStop(0, 'rgba(255,255,200,0.17)'); sh.addColorStop(1, 'rgba(255,255,200,0)');
            g.fillStyle = sh; g.beginPath(); g.arc(cx, cy, R, 0, Math.PI * 2); g.fill();
            [6, 14].forEach(function (cr) {
                g.strokeStyle = 'rgba(0,0,0,0.42)'; g.lineWidth = cr === 6 ? 0.9 : 0.7;
                g.beginPath(); g.arc(cx, cy, cr, 0, Math.PI * 2); g.stroke();
            });
            g.fillStyle = 'rgba(0,0,0,0.28)'; g.beginPath(); g.arc(cx, cy, 1.5, 0, Math.PI * 2); g.fill();
            g.strokeStyle = 'rgba(0,0,0,0.28)'; g.lineWidth = 0.5;
            g.beginPath(); g.moveTo(cx - R + 4, cy); g.lineTo(cx + R - 4, cy);
            g.moveTo(cx, cy - R + 4); g.lineTo(cx, cy + R - 4); g.stroke();
            var bx = cx + bub.x, by = cy + bub.y, bR = 11;
            var bbg = g.createRadialGradient(bx - 3, by - 3, 1, bx, by, bR);
            bbg.addColorStop(0, 'rgba(255,255,228,0.97)');
            bbg.addColorStop(0.32, 'rgba(240,255,86,0.92)');
            bbg.addColorStop(0.74, 'rgba(192,234,58,0.66)');
            bbg.addColorStop(1, 'rgba(148,198,38,0.28)');
            g.fillStyle = bbg; g.beginPath(); g.arc(bx, by, bR, 0, Math.PI * 2); g.fill();
            g.strokeStyle = 'rgba(215,248,78,0.48)'; g.lineWidth = 0.7;
            g.beginPath(); g.arc(bx, by, bR, 0, Math.PI * 2); g.stroke();
            g.fillStyle = 'rgba(255,255,255,0.74)';
            g.beginPath(); g.arc(bx - 3, by - 3, 3.5, 0, Math.PI * 2); g.fill();
            g.strokeStyle = 'rgba(255,255,255,0.13)'; g.lineWidth = 2;
            g.beginPath(); g.arc(cx, cy, R, 0, Math.PI * 2); g.stroke();
        }

        function drawLevel() {
            g.clearRect(0, 0, cv.width, cv.height);
            g.save();
            g.translate(cv.width / 2, cv.height / 2);
            g.scale(0.75, 0.75);
            g.rotate(dA * Math.PI / 180);
            var W = 530, H = 62;
            var bg = g.createLinearGradient(0, -H / 2, 0, H / 2);
            bg.addColorStop(0, '#FF8235'); bg.addColorStop(0.1, '#E86218');
            bg.addColorStop(0.44, '#C85012'); bg.addColorStop(0.56, '#C85012');
            bg.addColorStop(0.9, '#E86218'); bg.addColorStop(1, '#FF8235');
            g.fillStyle = bg; rrect(-W / 2, -H / 2, W, H, 4); g.fill();
            g.strokeStyle = 'rgba(255,170,90,0.55)'; g.lineWidth = 1;
            g.beginPath(); g.moveTo(-W / 2 + 22, -H / 2 + 1); g.lineTo(W / 2 - 22, -H / 2 + 1); g.stroke();
            g.strokeStyle = 'rgba(0,0,0,0.22)';
            g.beginPath(); g.moveTo(-W / 2 + 22, H / 2 - 1); g.lineTo(W / 2 - 22, H / 2 - 1); g.stroke();
            [[-W / 2, 1], [W / 2 - 22, -1]].forEach(function (ec) {
                var ex = ec[0], dir = ec[1];
                var cg = g.createLinearGradient(ex, 0, ex + 22 * dir, 0);
                if (dir > 0) { cg.addColorStop(0, '#0F0F0F'); cg.addColorStop(1, '#313131'); }
                else { cg.addColorStop(0, '#313131'); cg.addColorStop(1, '#0F0F0F'); }
                g.fillStyle = cg; g.fillRect(ex, -H / 2, 22, H);
            });
            [-W / 2 + 11, W / 2 - 11].forEach(function (ex) {
                g.beginPath(); g.arc(ex, 0, 5.5, 0, Math.PI * 2);
                g.fillStyle = '#080808'; g.fill();
                g.strokeStyle = '#444'; g.lineWidth = 0.6; g.stroke();
                g.beginPath(); g.arc(ex, 0, 2.8, 0, Math.PI * 2);
                g.strokeStyle = '#1C1C1C'; g.lineWidth = 0.5; g.stroke();
            });
            for (var i = -240; i <= 240; i += 2) {
                var isCm = (Math.round(i * 10) % 100 === 0);
                var isMid = (Math.round(i * 10) % 50 === 0);
                var tk = isCm ? 7.5 : isMid ? 4.5 : 2.2;
                g.strokeStyle = isCm ? 'rgba(255,255,255,0.62)' : 'rgba(255,255,255,0.38)';
                g.lineWidth = isCm ? 0.8 : 0.45;
                g.beginPath(); g.moveTo(i, -H / 2); g.lineTo(i, -H / 2 + tk); g.stroke();
            }
            g.fillStyle = 'rgba(255,255,255,0.65)'; g.font = '6.5px monospace'; g.textAlign = 'center';
            for (var j = -220; j <= 220; j += 20) {
                if (Math.abs(j) < 8) continue;
                g.fillText(Math.abs(j / 10) + '', j, -H / 2 + 16.5);
            }
            drawHVial(60, 0, hB);
            drawCVial(-195, 0, lC);
            drawCVial(195, 0, rC);
            g.restore();
        }

        /* ── State ───────────────────────────────────────────────────── */
        function setHuman(value) {
            var v = value ? 'true' : 'false';
            if (form.dataset.human === v) return;
            form.dataset.human = v;
            try {
                form.dispatchEvent(new CustomEvent('pr3cise:level', { detail: { human: !!value } }));
            } catch (e) { /* very old browser: main.js still reads dataset.human */ }
        }

        function showStatus() {
            var m = msgs();
            stEl.textContent = solved ? m.ok : m.drag;
            stEl.classList.toggle('ok', solved);
        }

        function updateValueText() {
            var m = msgs();
            var v = Math.round((parseFloat(sl.value) || 0) * 10) / 10;
            var txt = Math.abs(v).toFixed(1);
            if (m.dec !== '.') txt = txt.replace('.', m.dec);
            sl.setAttribute('aria-valuetext', m.tilt + ' ' + (v < 0 ? '-' : '') + txt + '°');
        }

        function evaluate() {
            if (!solved && Math.abs(tA) <= UNSOLVE && Math.abs(dA) < SOLVED_ANGLE && Math.abs(hB.x) < SOLVED_BUBBLE) {
                solved = true;
                showStatus();
                setHuman(true);
            }
        }

        /* ── Animation loop: pauses off-screen, in hidden tabs and at rest ── */
        var rafId = 0;
        var inView = !('IntersectionObserver' in window);
        var pageVisible = !document.hidden;
        var asleep = false;
        var idleFrames = 0;

        function canRun() { return !REDUCED && inView && pageVisible && !asleep; }

        function frame() {
            rafId = 0;
            phys();
            drawLevel();
            evaluate();
            var a = dA * Math.PI / 180;
            var restX = clamp(-Math.sin(a) * 50, -37, 37);
            var restC = clamp(-Math.sin(a) * 21, -20, 20);
            /* Sub-pixel motion only (angle weighted: 0.01° ≈ 0.04 px at the ends) */
            var motion = Math.abs(tA - dA) * 5 + Math.abs(hB.vx) + Math.abs(hB.x - restX) +
                Math.abs(lC.vx) + Math.abs(lC.vy) + Math.abs(lC.x - restC) + Math.abs(lC.y) +
                Math.abs(rC.vx) + Math.abs(rC.vy) + Math.abs(rC.x - restC) + Math.abs(rC.y);
            idleFrames = motion < 0.05 ? idleFrames + 1 : 0;
            if (idleFrames > 30) { asleep = true; return; }
            if (canRun()) rafId = requestAnimationFrame(frame);
        }

        function start() {
            if (!rafId && canRun()) rafId = requestAnimationFrame(frame);
        }

        function stop() {
            if (rafId) { cancelAnimationFrame(rafId); rafId = 0; }
        }

        function render() {
            if (REDUCED) {
                settle();
                drawLevel();
                evaluate();
                return;
            }
            asleep = false;
            idleFrames = 0;
            start();
        }

        /* ── Slider ──────────────────────────────────────────────────── */
        var lastKeyAt = 0;

        /* Pointer snap window in degrees: at least ±SNAP_PX of thumb travel,
           never below SNAP (≈3.5° on a 192 px phone slider, ≈1.7° on desktop). */
        function snapLimit() {
            var w = sl.getBoundingClientRect().width;
            var pxPerDeg = w > THUMB_PX + 10 ? (w - THUMB_PX) / (MAX - MIN) : 0;
            return pxPerDeg ? Math.max(SNAP, SNAP_PX / pxPerDeg) : SNAP;
        }

        function fromKeyboard() { return Date.now() - lastKeyAt < KEY_WINDOW_MS; }

        /* snapTo: |value| <= snapTo jumps to 0 (0 = no snap, e.g. while dragging) */
        function applyValue(snapTo) {
            var v = parseFloat(sl.value);
            if (isNaN(v)) v = 0;
            if (snapTo > 0 && v !== 0 && Math.abs(v) <= snapTo) {
                v = 0;
                sl.value = '0';
            }
            tA = v;
            updateValueText();
            if (solved && Math.abs(v) > UNSOLVE) {
                solved = false;
                showStatus();
                setHuman(false);
            }
            render();
        }

        sl.addEventListener('input', function () {
            applyValue(fromKeyboard() ? SNAP : 0);
        });

        /* Pointer release (and keyboard in most browsers) */
        sl.addEventListener('change', function () {
            applyValue(fromKeyboard() ? SNAP : snapLimit());
        });

        sl.addEventListener('keydown', function (e) {
            var k = e.key;
            if (k === 'PageUp' || k === 'PageDown') {
                e.preventDefault();
                var v = parseFloat(sl.value) || 0;
                v = toStep(clamp(v + (k === 'PageUp' ? PAGE_STEP : -PAGE_STEP), MIN, MAX));
                sl.value = String(v);
                lastKeyAt = Date.now();
                applyValue(SNAP);
                return;
            }
            if (k === 'ArrowLeft' || k === 'ArrowRight' || k === 'ArrowUp' || k === 'ArrowDown' ||
                k === 'Left' || k === 'Right' || k === 'Up' || k === 'Down' || k === 'Home' || k === 'End') {
                lastKeyAt = Date.now();
            }
        });

        /* ── Pause / resume ──────────────────────────────────────────── */
        if ('IntersectionObserver' in window) {
            var io = new IntersectionObserver(function (entries) {
                inView = entries[entries.length - 1].isIntersecting;
                if (inView) start(); else stop();
            }, { rootMargin: '120px 0px' });
            io.observe(box);
        }

        document.addEventListener('visibilitychange', function () {
            pageVisible = !document.hidden;
            if (pageVisible) start(); else stop();
        });

        /* ── New tilt after a successful send ────────────────────────── */
        document.addEventListener('pr3cise:form-reset', function () {
            startTilt = randomTilt();
            sl.value = String(startTilt);
            tA = startTilt; dA = startTilt;
            solved = false;
            showStatus();
            setHuman(false);
            updateValueText();
            if (REDUCED) settle();
            drawLevel();
            render();
        });

        /* ── API for main.js (and tests) ─────────────────────────────── */
        window.Pr3ciseNivel = {
            /* Decide now: if the slider is (almost) level, jump to the resting
               state instead of waiting for the spring to settle. */
            check: function () {
                if (solved) return true;
                var v = parseFloat(sl.value);
                if (!isNaN(v) && Math.abs(v) <= snapLimit()) {
                    if (v !== 0) sl.value = '0';
                    tA = 0;
                    updateValueText();
                    settle();
                    drawLevel();
                    evaluate();
                }
                return solved;
            },
            isSolved: function () { return solved; },
            state: function () {
                return {
                    solved: solved, value: parseFloat(sl.value), angle: dA, bubble: hB.x,
                    running: !!rafId, asleep: asleep, inView: inView, pageVisible: pageVisible, reduced: REDUCED
                };
            }
        };

        /* ── First paint ─────────────────────────────────────────────── */
        if (!stEl.hasAttribute('aria-live')) stEl.setAttribute('aria-live', 'polite');
        if (REDUCED) settle();
        drawLevel();
        showStatus();
        updateValueText();
        form.setAttribute('data-level-ready', '1');
        form.dataset.human = 'false';       // from here on main.js enforces the check
        start();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
