/**
 * Pr3cise — Official Trustpilot Integration Component
 *
 * HOW TO ACTIVATE THE LIVE TRUSTBOX WIDGET LATER:
 * 1. Log in to Trustpilot Business -> Integrations -> Website widgets -> TrustBox Library.
 * 2. Copy your `data-businessunit-id` and chosen `data-template-id`.
 * 3. Paste both values into `PR3CISE_TRUSTPILOT_CONFIG` below.
 *
 * While `businessUnitId` or `templateId` is empty, this component renders an honest,
 * brand-aligned Trustpilot profile card linking directly to the official profile URL,
 * with zero fabricated stars, scores, review counts, or testimonials.
 */
(function () {
    'use strict';

    var DEFAULT_CONFIG = {
        profileUrl: 'https://www.trustpilot.com/review/pr3cise.com',
        businessUnitId: '', // Paste Trustpilot data-businessunit-id here when available
        templateId: '',     // Paste Trustpilot data-template-id here when available
        styleHeight: '140px',
        styleWidth: '100%',
        theme: 'light',
        locales: {
            en: 'en-US',
            es: 'es-ES',
            de: 'de-DE',
            fr: 'fr-FR'
        }
    };

    var COPY = {
        en: {
            badge: 'Official Profile on Trustpilot',
            status: 'Independent client reviews are published directly on our public Trustpilot profile as projects are completed.',
            note: 'Every review on Trustpilot is posted by real construction professionals — never edited or curated on this website.',
            ctaView: 'View Pr3cise on Trustpilot',
            ctaWrite: 'Leave a Client Review'
        },
        es: {
            badge: 'Perfil oficial en Trustpilot',
            status: 'Las opiniones verificadas de nuestros clientes se publican directamente en nuestro perfil público de Trustpilot.',
            note: 'Cada reseña en Trustpilot la publican profesionales reales del sector — sin edición ni selección previa en esta web.',
            ctaView: 'Ver perfil en Trustpilot',
            ctaWrite: 'Dejar una reseña'
        },
        de: {
            badge: 'Offizielles Profil auf Trustpilot',
            status: 'Unabhängige Kundenbewertungen werden direkt auf unserem öffentlichen Trustpilot-Profil veröffentlicht.',
            note: 'Jede Bewertung auf Trustpilot stammt von echten Baufachleuten — ohne Vorabauswahl oder Bearbeitung auf dieser Website.',
            ctaView: 'Pr3cise auf Trustpilot ansehen',
            ctaWrite: 'Bewertung abgeben'
        },
        fr: {
            badge: 'Profil officiel sur Trustpilot',
            status: 'Les avis indépendants de nos clients sont publiés directement sur notre profil public Trustpilot.',
            note: 'Chaque avis sur Trustpilot est déposé par des professionnels du bâtiment — sans sélection ni modification sur ce site.',
            ctaView: 'Voir Pr3cise sur Trustpilot',
            ctaWrite: 'Laisser un avis'
        }
    };

    function getConfig() {
        var custom = window.PR3CISE_TRUSTPILOT_CONFIG || {};
        return {
            profileUrl: custom.profileUrl || DEFAULT_CONFIG.profileUrl,
            businessUnitId: (custom.businessUnitId || DEFAULT_CONFIG.businessUnitId || '').trim(),
            templateId: (custom.templateId || DEFAULT_CONFIG.templateId || '').trim(),
            styleHeight: custom.styleHeight || DEFAULT_CONFIG.styleHeight,
            styleWidth: custom.styleWidth || DEFAULT_CONFIG.styleWidth,
            theme: custom.theme || DEFAULT_CONFIG.theme,
            locales: custom.locales || DEFAULT_CONFIG.locales
        };
    }

    function ensureBootstrapScript() {
        if (document.querySelector('script[data-trustpilot-bootstrap]')) return;
        var s = document.createElement('script');
        s.src = 'https://widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js';
        s.async = true;
        s.setAttribute('data-trustpilot-bootstrap', 'true');
        document.head.appendChild(s);
    }

    function renderMount(mount, cfg) {
        var rawLang = (mount.getAttribute('data-lang') || document.documentElement.lang || 'en').slice(0, 2).toLowerCase();
        var lang = COPY[rawLang] ? rawLang : 'en';
        var copy = COPY[lang];
        var tpLocale = cfg.locales[lang] || cfg.locales.en;

        mount.innerHTML = '';

        // Official TrustBox mode: active automatically as soon as businessUnitId + templateId are set
        if (cfg.businessUnitId && cfg.templateId) {
            var widget = document.createElement('div');
            widget.className = 'trustpilot-widget';
            widget.setAttribute('data-locale', tpLocale);
            widget.setAttribute('data-template-id', cfg.templateId);
            widget.setAttribute('data-businessunit-id', cfg.businessUnitId);
            widget.setAttribute('data-style-height', mount.getAttribute('data-style-height') || cfg.styleHeight);
            widget.setAttribute('data-style-width', mount.getAttribute('data-style-width') || cfg.styleWidth);
            widget.setAttribute('data-theme', mount.getAttribute('data-theme') || cfg.theme);

            var fallbackLink = document.createElement('a');
            fallbackLink.href = cfg.profileUrl;
            fallbackLink.target = '_blank';
            fallbackLink.rel = 'noopener noreferrer';
            fallbackLink.textContent = 'Trustpilot';
            widget.appendChild(fallbackLink);

            mount.appendChild(widget);
            ensureBootstrapScript();
            if (window.Trustpilot && typeof window.Trustpilot.loadFromElement === 'function') {
                window.Trustpilot.loadFromElement(widget, true);
            }
            return;
        }

        // Honest pre-widget fallback card (no fabricated stars, ratings, or review counts)
        var card = document.createElement('div');
        card.className = 'tp-profile-card';

        var top = document.createElement('div');
        top.className = 'tp-profile-top';

        var badge = document.createElement('span');
        badge.className = 'tp-brand-pill';
        badge.innerHTML =
            '<svg class="tp-mark" width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
            '<path fill="#00B67A" d="M12 2l2.95 6.26L22 9.24l-5 4.86L18.18 21 12 17.73 5.82 21 7 14.1 2 9.24l7.05-.98L12 2z"/>' +
            '</svg>' +
            '<span>Trustpilot</span>';

        var label = document.createElement('span');
        label.className = 'tp-profile-badge-text';
        label.textContent = copy.badge;

        top.appendChild(badge);
        top.appendChild(label);

        var body = document.createElement('p');
        body.className = 'tp-profile-status';
        body.textContent = copy.status;

        var note = document.createElement('p');
        note.className = 'tp-profile-note';
        note.textContent = copy.note;

        var actions = document.createElement('div');
        actions.className = 'tp-profile-actions';

        var btnView = document.createElement('a');
        btnView.className = 'btn-cta tp-btn-primary';
        btnView.href = cfg.profileUrl;
        btnView.target = '_blank';
        btnView.rel = 'noopener noreferrer';
        btnView.innerHTML =
            '<span>' + copy.ctaView + '</span>' +
            '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17L17 7"/><path d="M7 7h10v10"/></svg>';

        actions.appendChild(btnView);

        card.appendChild(top);
        card.appendChild(body);
        card.appendChild(note);
        card.appendChild(actions);

        mount.appendChild(card);
    }

    function initTrustpilot() {
        var mounts = document.querySelectorAll('[data-pr3cise-trustpilot]');
        if (!mounts.length) return;
        var cfg = getConfig();
        mounts.forEach(function (mount) {
            renderMount(mount, cfg);
        });
    }

    window.PR3CISE_TRUSTPILOT = {
        init: initTrustpilot,
        getConfig: getConfig
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTrustpilot);
    } else {
        initTrustpilot();
    }
})();
