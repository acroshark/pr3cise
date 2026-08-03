/**
 * Nav Scramble — Cash Register / Ticker Effect
 * On mouseenter: chars roll through financial symbols before settling on cipher text.
 * On mouseleave: quick reverse roll back to original.
 */

(function () {

    const ROLL_CHARS = '€$%₿Ξ@&*Я0123456789¢£¥±×ΛΜΝΘΡΤΗΚΦΨΩΣΔΑΕΙΥΒΖΓ§><{}[]|/\\';

    // Cipher: look-alike replacements using Greek, Cyrillic and financial symbols.
    // Every replacement should be visually similar to the original letter.
    const CIPHER = {
        'a': 'Λ',  'A': 'Λ',   // Greek Lambda ≈ A
        'b': '₿',  'B': '₿',   // Bitcoin ≡ B
        'c': '©',  'C': '©',   // Copyright ≈ C
        'd': 'Ð',  'D': 'Ð',   // Eth ≈ D
        'e': '€',  'E': '€',   // Euro ≡ E
        'f': 'ƒ',  'F': 'ƒ',   // Florin ≈ F
        'g': 'Ğ',  'G': 'Ğ',   // G-breve ≈ G
        'h': 'Η',  'H': 'Η',   // Greek Eta ≡ H
        'i': '1',  'I': '|',   // pipe ≡ I
        'j': '¥',  'J': '¥',   // Yen ≈ J
        'k': 'Κ',  'K': 'Κ',   // Greek Kappa ≡ K
        'l': 'Ⅼ',  'L': 'Ⅼ',   // Roman numeral L ≡ L
        'm': 'Μ',  'M': 'Μ',   // Greek Mu ≡ M
        'n': 'Ν',  'N': 'Ν',   // Greek Nu ≡ N  (identical shape!)
        'o': 'Θ',  'O': 'Θ',   // Greek Theta ≈ O
        'p': 'Ρ',  'P': 'Ρ',   // Greek Rho ≡ P
        'q': 'Q',  'Q': 'Q',
        'r': 'Я',  'R': 'Я',   // Cyrillic Ya = reversed R
        's': '$',  'S': '$',   // Dollar ≡ S
        't': 'Τ',  'T': 'Τ',   // Greek Tau ≡ T
        'u': 'Ц',  'U': 'Ц',   // Cyrillic Tse ≈ U
        'v': '√',  'V': '√',   // sqrt ≈ V
        'w': 'Ш',  'W': 'Ш',   // Cyrillic Sha ≈ W
        'x': '×',  'X': '×',   // multiplication ≡ X
        'y': 'Υ',  'Y': 'Υ',   // Greek Upsilon ≈ Y
        'z': 'Ƶ',  'Z': 'Ƶ',   // Z-stroke ≈ Z
    };

    function getCipher(char) {
        return CIPHER[char] || char;
    }

    function buildCiphered(text) {
        return Array.from(text).map(getCipher).join('');
    }

    function randomRollChar() {
        return ROLL_CHARS[Math.floor(Math.random() * ROLL_CHARS.length)];
    }

    /**
     * Animate element text from its current value toward `target`.
     * Each character lands in a staggered wave (left → right).
     * @param {HTMLElement} el
     * @param {string} target   — the final text to land on
     * @param {number} duration — ms total for the roll
     * @param {Object} state    — shared cancellation token { cancelled }
     */
    function rollTo(el, target, duration, state) {
        const FRAME_MS = 35;
        const totalFrames = Math.round(duration / FRAME_MS);
        let frame = 0;

        // Land wave: char at index i lands when progress >= landAt[i]
        const len = target.length;
        const landAt = Array.from({ length: len }, (_, i) =>
            0.15 + (i / Math.max(len - 1, 1)) * 0.65   // spread landing 15%→80% of duration
        );

        const tick = setInterval(() => {
            if (state.cancelled) { clearInterval(tick); return; }

            frame++;
            const progress = frame / totalFrames;

            const result = Array.from(target).map((char, i) => {
                if (char === ' ') return '\u00A0'; // non-breaking space
                if (progress >= landAt[i]) return char;
                return randomRollChar();
            }).join('');

            el.textContent = result;

            if (frame >= totalFrames) {
                clearInterval(tick);
                if (!state.cancelled) el.textContent = target;
            }
        }, FRAME_MS);
    }

    function attachScramble(el, forwardMs, reverseMs) {
        const original = el.textContent.trim();
        const ciphered = buildCiphered(original);

        el.setAttribute('data-original', original);
        el.setAttribute('data-ciphered', ciphered);

        let animState = { cancelled: true };

        el.addEventListener('mouseenter', () => {
            animState.cancelled = true;
            animState = { cancelled: false };
            el.classList.add('scrambling');
            rollTo(el, ciphered, forwardMs, animState);
        });

        el.addEventListener('mouseleave', () => {
            animState.cancelled = true;
            animState = { cancelled: false };
            rollTo(el, original, reverseMs, animState);
            setTimeout(() => el.classList.remove('scrambling'), reverseMs + 50);
        });
    }

    function initScramble() {
        // Nav links — full effect
        document.querySelectorAll('.site-nav a').forEach(el => attachScramble(el, 1100, 450));

        // CTA buttons — slightly faster so they feel snappy
        document.querySelectorAll('.btn-cta').forEach(el => attachScramble(el, 900, 350));
    }

    // The header is injected dynamically; wait until it's in the DOM
    function waitForNav(retries = 30) {
        const links = document.querySelectorAll('.site-nav a');
        if (links.length > 0) {
            initScramble();
        } else if (retries > 0) {
            setTimeout(() => waitForNav(retries - 1), 100);
        }
    }

    /* ── Hero "precision" word — autonomous loop animation ──────────────
     * 2025-04-26 00:00 | Every 3 s the word scrambles to its cipher form,
     * holds for 3 s, then rolls back. Cycle repeats indefinitely.
     * 2025-04-26 00:11 | Fixed stale DOM reference (main.js rebuilds spans).
     * 2025-04-26 00:45 | getVisiblePrecision() targets the rendered span so
     *                    the animation works on mobile (desktop span is hidden).
     * ------------------------------------------------------------------ */

    function getVisiblePrecision() {
        var all = document.querySelectorAll('.hero-precision');
        for (var i = 0; i < all.length; i++) {
            if (all[i].offsetParent !== null) return all[i];
        }
        return null;
    }

    function initHeroPrecision() {
        var seed = getVisiblePrecision();
        if (!seed) return;
        var original = seed.textContent.trim();
        if (!original) return;
        var ciphered = buildCiphered(original);

        var animState = { cancelled: false };

        function runCycle() {
            var el = getVisiblePrecision();
            if (!el) return;

            // Phase 1 → roll to ciphered
            animState = { cancelled: false };
            el.classList.add('scrambling');
            rollTo(el, ciphered, 900, animState);

            // Phase 2 → hold ciphered 2 s, then roll back
            setTimeout(function () {
                var el2 = getVisiblePrecision();
                if (!el2) return;
                animState = { cancelled: false };
                rollTo(el2, original, 700, animState);

                // Phase 3 → hold original 3 s, then repeat
                setTimeout(function () {
                    var el3 = getVisiblePrecision();
                    if (el3) el3.classList.remove('scrambling');
                    runCycle();
                }, 700 + 3000);
            }, 900 + 2000);
        }

        setTimeout(runCycle, 3000);
    }

    function waitForHeroPrecision(retries) {
        retries = (retries === undefined) ? 60 : retries;
        var el = getVisiblePrecision();
        if (el && el.textContent.trim()) {
            initHeroPrecision();
        } else if (retries > 0) {
            setTimeout(function () { waitForHeroPrecision(retries - 1); }, 100);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            waitForNav();
            waitForHeroPrecision();
        });
    } else {
        waitForNav();
        waitForHeroPrecision();
    }

})();
