document.addEventListener('DOMContentLoaded', () => {

    /* 2026-08-03 | SEO: header y footer ya vienen estáticos en el HTML de cada página. */

    const pageLang = (document.documentElement.lang || 'es').slice(0, 2).toLowerCase();

    /* 2026-11-08 | Textos del formulario de contacto: errores por campo, aviso
       del nivel, fallos de envío con alternativas y panel de confirmación.
       {email} y {whatsapp} se sustituyen por enlaces creados con nodos DOM. */
    const UI_STRINGS = {
        es: {
            openMenu: 'Abrir menú',
            closeMenu: 'Cerrar menú',
            required: 'Por favor, completa todos los campos obligatorios.',
            email: 'Por favor, introduce un correo electrónico válido.',
            sending: 'Enviando…',
            phonePlaceholder: '600 000 000',
            errNombre: 'Indica tu nombre.',
            errEmpresa: 'Indica el nombre de tu empresa.',
            errEmailRequired: 'Indica tu email.',
            errEmailFormat: 'Revisa el email: debe tener el formato nombre@empresa.com.',
            errTipo: 'Selecciona el alcance que necesitas presupuestar.',
            errMensaje: 'Cuéntanos brevemente el proyecto.',
            levelRequired: 'Nivela la burbuja para enviar: arrastra el deslizador hasta el centro.',
            sendErrorLead: 'No hemos podido enviar tu solicitud.',
            sendErrorTimeout: 'El envío estaba tardando demasiado y lo hemos detenido.',
            sendErrorAlt: 'Inténtalo de nuevo o escríbenos a {email} o por {whatsapp}.',
            mailSubject: 'Solicitud de presupuesto (formulario web)',
            waText: 'Hola, he intentado enviar el formulario de contacto de pr3cise.com y no ha funcionado.',
            successTitle: 'Solicitud recibida',
            successNext: 'Te responderemos en menos de 24 h laborables con alcance, precio cerrado y fecha de entrega.',
            successPlans: '¿Quieres adelantar los planos? Envíalos a {email}.',
            successAgain: 'Enviar otra solicitud'
        },
        en: {
            openMenu: 'Open menu',
            closeMenu: 'Close menu',
            required: 'Please complete all required fields.',
            email: 'Please enter a valid business email address.',
            sending: 'Sending…',
            phonePlaceholder: '305 555 0199',
            errNombre: 'Please enter your name.',
            errEmpresa: 'Please enter your company name.',
            errEmailRequired: 'Please enter your email address.',
            errEmailFormat: 'Check the email address: it should look like name@company.com.',
            errTipo: 'Please select the scope you need priced.',
            errMensaje: 'Please add a few details about the project.',
            levelRequired: 'Level the bubble to send: drag the slider to the center.',
            sendErrorLead: 'We could not send your request.',
            sendErrorTimeout: 'Sending was taking too long, so we stopped it.',
            sendErrorAlt: 'Please try again, or email us at {email} or message us on {whatsapp}.',
            mailSubject: 'Estimate request (website form)',
            waText: 'Hi, I tried to send the contact form on pr3cise.com and it did not go through.',
            successTitle: 'Request received',
            successNext: 'We will reply within one business day with the scope, a fixed price and a delivery date.',
            successPlans: 'Want to send the drawings now? Email them to {email}.',
            successAgain: 'Send another request'
        },
        de: {
            openMenu: 'Menü öffnen',
            closeMenu: 'Menü schließen',
            required: 'Bitte füllen Sie alle Pflichtfelder aus.',
            email: 'Bitte geben Sie eine gültige E-Mail-Adresse ein.',
            sending: 'Wird gesendet…',
            phonePlaceholder: '151 23456789',
            errNombre: 'Bitte geben Sie Ihren Namen ein.',
            errEmpresa: 'Bitte geben Sie Ihr Unternehmen an.',
            errEmailRequired: 'Bitte geben Sie Ihre E-Mail-Adresse ein.',
            errEmailFormat: 'Bitte prüfen Sie die E-Mail-Adresse (Format: name@firma.com).',
            errTipo: 'Bitte wählen Sie den gewünschten Leistungsumfang.',
            errMensaje: 'Bitte beschreiben Sie Ihr Projekt kurz.',
            levelRequired: 'Richten Sie zum Senden die Libelle aus: Schieberegler in die Mitte ziehen.',
            sendErrorLead: 'Ihre Anfrage konnte nicht gesendet werden.',
            sendErrorTimeout: 'Das Senden hat zu lange gedauert und wurde abgebrochen.',
            sendErrorAlt: 'Bitte versuchen Sie es erneut oder schreiben Sie uns an {email} oder per {whatsapp}.',
            mailSubject: 'Angebotsanfrage (Website-Formular)',
            waText: 'Hallo, ich habe versucht, das Kontaktformular auf pr3cise.com zu senden, aber es hat nicht funktioniert.',
            successTitle: 'Anfrage erhalten',
            successNext: 'Wir antworten innerhalb eines Werktags mit Leistungsumfang, Festpreis und Liefertermin.',
            successPlans: 'Möchten Sie die Pläne schon vorab senden? Schicken Sie sie an {email}.',
            successAgain: 'Weitere Anfrage senden'
        },
        fr: {
            openMenu: 'Ouvrir le menu',
            closeMenu: 'Fermer le menu',
            required: 'Veuillez remplir tous les champs obligatoires.',
            email: 'Veuillez saisir une adresse e-mail valide.',
            sending: 'Envoi en cours…',
            phonePlaceholder: '6 12 34 56 78',
            errNombre: 'Veuillez indiquer votre nom.',
            errEmpresa: 'Veuillez indiquer le nom de votre entreprise.',
            errEmailRequired: 'Veuillez indiquer votre adresse e-mail.',
            errEmailFormat: 'Vérifiez l’adresse e-mail (format attendu : nom@entreprise.com).',
            errTipo: 'Veuillez sélectionner le périmètre à chiffrer.',
            errMensaje: 'Décrivez brièvement votre projet.',
            levelRequired: 'Mettez la bulle à niveau pour envoyer : faites glisser le curseur jusqu’au centre.',
            sendErrorLead: 'Votre demande n’a pas pu être envoyée.',
            sendErrorTimeout: 'L’envoi prenait trop de temps, nous l’avons interrompu.',
            sendErrorAlt: 'Réessayez ou écrivez-nous à {email} ou sur {whatsapp}.',
            mailSubject: 'Demande de devis (formulaire du site)',
            waText: 'Bonjour, j’ai essayé d’envoyer le formulaire de contact de pr3cise.com, sans succès.',
            successTitle: 'Demande reçue',
            successNext: 'Nous vous répondrons sous 24 h ouvrées avec le périmètre, un prix ferme et une date de livraison.',
            successPlans: 'Vous souhaitez transmettre vos plans dès maintenant ? Envoyez-les à {email}.',
            successAgain: 'Envoyer une autre demande'
        }
    };

    const ui = UI_STRINGS[pageLang] || UI_STRINGS.es;

    // Marcar el enlace de navegación de la página actual
    let currentPath = window.location.pathname;
    if (currentPath.endsWith('/')) currentPath += 'index.html';

    document.querySelectorAll('.site-nav a').forEach(link => {
        const href = link.getAttribute('href');
        if (!href) return;
        const normalizedHref = href.endsWith('/') ? href + 'index.html' : href;
        if (normalizedHref === currentPath) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        }
    });

    // Menú móvil
    const siteHeader = document.getElementById('site-header');
    const siteNav = document.querySelector('.site-nav');
    if (siteHeader && siteNav && !siteHeader.querySelector('.mobile-menu-toggle')) {
        const toggleButton = document.createElement('button');
        toggleButton.type = 'button';
        toggleButton.classList.add('mobile-menu-toggle');
        toggleButton.innerHTML = '☰';
        toggleButton.setAttribute('aria-label', ui.openMenu);
        toggleButton.setAttribute('aria-expanded', 'false');
        siteHeader.insertBefore(toggleButton, siteNav);

        const setMenuOpen = (open) => {
            siteNav.classList.toggle('active', open);
            toggleButton.innerHTML = open ? '✕' : '☰';
            toggleButton.setAttribute('aria-expanded', String(open));
            toggleButton.setAttribute('aria-label', open ? ui.closeMenu : ui.openMenu);
        };

        toggleButton.addEventListener('click', (e) => {
            e.stopPropagation();
            setMenuOpen(!siteNav.classList.contains('active'));
        });

        document.addEventListener('click', (e) => {
            if (siteNav.classList.contains('active') && !siteHeader.contains(e.target)) {
                setMenuOpen(false);
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && siteNav.classList.contains('active')) {
                setMenuOpen(false);
                toggleButton.focus();
            }
        });
    }

    // Selector de idioma en páginas sin i18n.js (todo /en/, /de/ traducciones, /fr/ traducciones)
    if (!window.I18N) {
        const flagBtn = document.getElementById('lang-flag-btn');
        const dropdown = document.getElementById('lang-dropdown');
        if (flagBtn && dropdown) {
            flagBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const open = dropdown.classList.toggle('open');
                flagBtn.classList.toggle('open', open);
                flagBtn.setAttribute('aria-expanded', String(open));
            });
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.lang-switcher')) {
                    dropdown.classList.remove('open');
                    flagBtn.classList.remove('open');
                    flagBtn.setAttribute('aria-expanded', 'false');
                }
            });
            dropdown.querySelectorAll('a.lang-option[hreflang], a.lang-option[data-lang]').forEach((link) => {
                link.addEventListener('click', () => {
                    const code = link.dataset.lang || link.getAttribute('hreflang').slice(0, 2);
                    try {
                        localStorage.setItem('pr3cise_lang', code);
                    } catch (_) { /* modo privado */ }
                });
            });
        }
    }

    // Año dinámico del footer
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // Botón volver arriba
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            backToTopBtn.classList.toggle('visible', window.scrollY > 300);
        }, { passive: true });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // 2. Animaciones On-Scroll (Intersection Observer)
    const fadeElements = document.querySelectorAll('.fade-in');
    if ('IntersectionObserver' in window) {
        const scrollObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { root: null, rootMargin: '0px', threshold: 0.12 });

        fadeElements.forEach(el => scrollObserver.observe(el));
    } else {
        fadeElements.forEach(el => el.classList.add('visible'));
    }

    // 3. Interactividad en Pricing
    const cardBusiness = document.getElementById('card-business');
    if (cardBusiness) {
        cardBusiness.addEventListener('mouseenter', () => cardBusiness.classList.add('highlight'));
        cardBusiness.addEventListener('mouseleave', () => cardBusiness.classList.remove('highlight'));
    }

    // 4. Formulario de contacto (validación por campo, nivel, honeypot y envío robusto)
    //    2026-11-08 | El formulario se comparte en grupos y portales: no puede perder ni un contacto.
    //    - Error en línea bajo cada campo (aria-invalid + aria-describedby) y el resumen de siempre.
    //    - Nivel de burbuja (assets/js/nivel.js): el botón está siempre activo; si falta nivelar se
    //      avisa bajo el nivel y no se envía. Si nivel.js no llegara a ejecutarse, no se bloquea nada.
    //    - Honeypot "website": si lo rellena un robot se muestra el éxito sin llamar al servidor.
    //    - fetch con límite de 20 s; ante error de red, límite o 5xx se ofrecen el email (con los
    //      datos ya escritos) y WhatsApp como alternativa. El botón solo se desactiva mientras envía.
    //    - Tras el envío, un panel de confirmación sustituye a los campos ("Enviar otra solicitud")
    //      y se lanza 'pr3cise:form-sent' en document (solo envíos aceptados por el servidor).
    //    - assets/js/medir.js escucha el evento submit de este mismo formulario: no cambiar su id.
    //    - 2026-11-09 | Token anti-robots (api/form-guard.inc.php): al cargar se pide uno a
    //      /api/form-token.php y va como form_token en el POST, con la cabecera X-Pr3cise-Form.
    //      El servidor lo acepta desde 2 s hasta 8 h después de emitirlo: si hace falta se espera
    //      a los 2 s y, pasadas 2 h, se pide otro. Si el servidor lo rechaza (403 code "token")
    //      se pide uno nuevo y se reintenta una vez; si no se consigue, se ofrecen email y WhatsApp.
    //    - El formulario ya no lleva action (lo usaban robots que leen el HTML): sin JavaScript
    //      la página muestra un <noscript> con email y WhatsApp. Los avisos #form-enviado /
    //      #form-fallo (CSS :target) se conservan para enlaces antiguos.
    //    - En móvil y tableta el botón "volver arriba" se oculta mientras pasa por encima de la
    //      tarjeta del formulario (tapaba el botón de envío y los campos).
    const contactForm = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');
    const submitBtn = document.getElementById('submit-btn');

    const FORM_ENDPOINT = '/api/send_mail.php';   // ruta absoluta: vale desde /, /en/, /de/ y /fr/
    const TOKEN_ENDPOINT = '/api/form-token.php';
    const TOKEN_MIN_AGE_MS = 2500;                // el servidor exige 2 s desde que lo emite
    const TOKEN_REFRESH_MS = 2 * 60 * 60 * 1000;  // el servidor lo admite 8 h; se renueva a las 2
    const FORM_TIMEOUT_MS = 20000;
    const CONTACT_EMAIL = 'contact@pr3cise.com';
    const CONTACT_WHATSAPP = 'https://wa.me/34722879218';
    // Mismas reglas que FILTER_VALIDATE_EMAIL de PHP para direcciones normales: ASCII, partes
    // separadas por un solo punto y dominio con TLD que empieza por letra (admite o'neil@...).
    const EMAIL_RE = /^[A-Za-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[A-Za-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[A-Za-z0-9]+(?:-+[A-Za-z0-9]+)*\.)+[A-Za-z][A-Za-z0-9]*(?:-+[A-Za-z0-9]+)*$/;

    function isValidEmail(value) {
        if (!value || value.length > 254) return false;
        const at = value.lastIndexOf('@');
        if (at < 1 || at > 64) return false;
        return EMAIL_RE.test(value);
    }

    function reducedMotion() {
        return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    }

    // La etiqueta del botón puede estar "rodando" por el efecto cifrado de nav-scramble.js (hover,
    // o al aparecer en pantallas táctiles). Se guarda la original al cargar y, al cambiarla, se
    // detiene el efecto y se le entrega el texto nuevo para que el hover siga funcionando.
    function cipherTargetOf(el) {
        const C = window.Pr3ciseCipher;
        if (!el || !el.__cipher || !C || typeof C.makeTarget !== 'function') return null;
        try {
            const target = C.makeTarget(el);
            return target && Array.isArray(target.parts) ? target : null;
        } catch (_) {
            return null;
        }
    }

    function buttonLabel(el) {
        const target = cipherTargetOf(el);
        const text = target ? target.parts.map((p) => p.original).join('') : el.textContent;
        return String(text || '').replace(/\s+/g, ' ').trim();
    }

    function setButtonLabel(el, text) {
        if (!el || !text) return;
        const target = cipherTargetOf(el);
        if (target) target.token = null;                 // detiene cualquier animación en curso
        el.classList.remove('scrambling');
        if (el.dataset.cipherLocked === '1') {           // ancho fijado por nav-scramble mientras rueda
            el.style.width = el.dataset.cipherPrevWidth || '';
            el.style.display = el.dataset.cipherPrevDisplay || '';
            delete el.dataset.cipherLocked;
            delete el.dataset.cipherPrevWidth;
            delete el.dataset.cipherPrevDisplay;
        }
        el.textContent = text;
        if (target && el.firstChild) {
            const C = window.Pr3ciseCipher;
            target.parts = [{
                node: el.firstChild,
                original: text,
                cipher: typeof C.cipherText === 'function' ? C.cipherText(text) : text
            }];
        }
        if (el.hasAttribute('aria-label')) el.setAttribute('aria-label', text);
    }

    function makeLink(href, text, external) {
        const a = document.createElement('a');
        a.href = href;
        a.textContent = text;
        if (external) {
            a.target = '_blank';
            a.rel = 'noopener noreferrer';
        }
        return a;
    }

    // Rellena un texto con {marcadores} usando nodos DOM (nunca innerHTML con datos del usuario)
    function appendTemplate(parent, template, nodes) {
        String(template).split(/(\{[a-z]+\})/).forEach((part) => {
            const key = /^\{([a-z]+)\}$/.exec(part);
            if (key && nodes[key[1]]) parent.appendChild(nodes[key[1]]);
            else if (part) parent.appendChild(document.createTextNode(part));
        });
    }

    // Un campo autocompletado por el navegador lo ha rellenado una persona, no un robot
    function isAutofilled(el) {
        const selectors = [':autofill', ':-webkit-autofill'];
        for (let i = 0; i < selectors.length; i++) {
            try {
                if (el.matches(selectors[i])) return true;
            } catch (_) { /* selector no soportado */ }
        }
        return false;
    }

    function formatPhoneDigits(digits, prefix) {
        if (!digits) return '';
        // US / Canada (+1): format 10 digits as XXX XXX XXXX
        if (prefix === '+1') {
            const us = digits.slice(0, 10);
            if (us.length <= 3) return us;
            if (us.length <= 6) return us.slice(0, 3) + ' ' + us.slice(3);
            return us.slice(0, 3) + ' ' + us.slice(3, 6) + ' ' + us.slice(6);
        }
        // International: clean ASCII space grouping every 3 digits (max 15 digits)
        return digits.slice(0, 15).replace(/(\d{3})(?=\d)/g, '$1 ');
    }

    if (contactForm) {
        // Los textos del formulario siguen el idioma de su página (input oculto user_lang): i18n.js
        // puede cambiar <html lang> con ?lang=xx, pero las etiquetas de los campos no se traducen.
        const langField = contactForm.querySelector('input[name="user_lang"]');
        const formLang = String((langField && langField.value) || pageLang).slice(0, 2).toLowerCase();
        const ui = UI_STRINGS[formLang] || UI_STRINGS[pageLang] || UI_STRINGS.es;
        const msg = (key, fallback) => contactForm.dataset[key] || fallback;
        const levelBox = contactForm.querySelector('.level-captcha');
        const honeypot = contactForm.querySelector('input[name="website"]');
        const emailInput = document.getElementById('email');
        const phonePrefSelect = document.getElementById('telefono_prefijo');
        const phoneNumInput = document.getElementById('telefono_numero');
        const fieldErrors = {
            nombre: ui.errNombre,
            empresa: ui.errEmpresa,
            tipo_proyecto: ui.errTipo,
            mensaje: ui.errMensaje
        };
        const fields = ['nombre', 'empresa', 'email', 'tipo_proyecto', 'mensaje']
            .map((id) => document.getElementById(id))
            .filter(Boolean);
        let sending = false;
        let attentionTimer = 0;
        let successPanel = null;

        contactForm.noValidate = true;
        if (submitBtn && !submitBtn.dataset.label) submitBtn.dataset.label = buttonLabel(submitBtn);

        // Pre-select scope from ?scope= query param (from homepage interactive configurator)
        const scopeSelect = document.getElementById('tipo_proyecto');
        if (scopeSelect) {
            try {
                const params = new URLSearchParams(window.location.search);
                const scopeParam = (params.get('scope') || '').toLowerCase();
                const scopeIndexMap = {
                    full: 1,
                    takeoff: 2,
                    conceptual: 3,
                    mep: 4,
                    electrical: 5,
                    plumbing: 6,
                    fire: 7,
                    structural: 8,
                    finishes: 9
                };
                if (scopeParam && scopeIndexMap[scopeParam] && scopeSelect.options[scopeIndexMap[scopeParam]]) {
                    scopeSelect.selectedIndex = scopeIndexMap[scopeParam];
                }
            } catch (_) { /* ignore malformed query */ }
        }

        // ?plan= (sección de precios de la portada): deja escrito en el mensaje el plan elegido
        try {
            const planParam = (new URLSearchParams(window.location.search).get('plan') || '').toLowerCase();
            const PLAN_MSG = {
                es: { basic: 'Me interesa el plan Básico (suscripción mensual).', pro: 'Me interesa el plan Profesional (suscripción mensual).', business: 'Me interesa el plan Empresa (suscripción mensual).', job: 'Me interesa un presupuesto puntual (pago por obra).' },
                en: { basic: 'I am interested in the Starter plan (monthly subscription).', pro: 'I am interested in the Professional plan (monthly subscription).', business: 'I am interested in the Business plan (monthly subscription).', job: 'I need a one-off estimate (pay per project).' },
                de: { basic: 'Ich interessiere mich für das Paket Basis (Monatsabo).', pro: 'Ich interessiere mich für das Paket Professional (Monatsabo).', business: 'Ich interessiere mich für das Paket Business (Monatsabo).', job: 'Ich brauche eine einzelne Kalkulation (Abrechnung pro Projekt).' },
                fr: { basic: 'La formule Essentiel m’intéresse (abonnement mensuel).', pro: 'La formule Professionnel m’intéresse (abonnement mensuel).', business: 'La formule Entreprise m’intéresse (abonnement mensuel).', job: 'J’ai besoin d’une estimation ponctuelle (paiement par projet).' }
            };
            const planText = (PLAN_MSG[pageLang] || PLAN_MSG.es)[planParam];
            const mensajeField = document.getElementById('mensaje');
            if (planText && mensajeField && !mensajeField.value.trim()) {
                mensajeField.value = planText + '\n\n';
            }
        } catch (_) { /* ignore malformed query */ }

        // ── Errores por campo ───────────────────────────────────────────────
        const addDescribedBy = (el, id) => {
            const ids = (el.getAttribute('aria-describedby') || '').split(/\s+/).filter(Boolean);
            if (ids.indexOf(id) === -1) {
                ids.push(id);
                el.setAttribute('aria-describedby', ids.join(' '));
            }
        };

        const errorElFor = (field) => {
            const id = field.id + '-error';
            let el = document.getElementById(id);
            if (!el) {
                el = document.createElement('p');
                el.id = id;
                el.className = 'field-error';
                el.hidden = true;
                field.insertAdjacentElement('afterend', el);
            }
            addDescribedBy(field, id);
            return el;
        };

        const setFieldError = (field, text) => {
            const el = errorElFor(field);
            el.textContent = text;
            el.hidden = false;
            field.setAttribute('aria-invalid', 'true');
            field.classList.add('input-invalid');
            field.classList.remove('input-valid');
        };

        const clearFieldError = (field) => {
            const el = document.getElementById(field.id + '-error');
            if (el) {
                el.textContent = '';
                el.hidden = true;
            }
            field.removeAttribute('aria-invalid');
            field.classList.remove('input-invalid');
        };

        const fieldError = (field) => {
            const value = String(field.value || '').trim();
            if (field === emailInput) {
                if (!value) return ui.errEmailRequired;
                return isValidEmail(value) ? '' : ui.errEmailFormat;
            }
            return value ? '' : (fieldErrors[field.id] || ui.required);
        };

        const focusField = (field) => {
            try { field.focus({ preventScroll: true }); } catch (_) { field.focus(); }
            try {
                field.scrollIntoView({ block: 'center', behavior: reducedMotion() ? 'auto' : 'smooth' });
            } catch (_) { /* navegador antiguo */ }
        };

        // Resumen rojo de validación: se marca como tal y desaparece en cuanto no queda ningún
        // campo con error (antes seguía en pantalla aunque todo estuviera ya corregido).
        const showSummary = (text) => {
            showMessage(text, 'error');
            if (formMessage) formMessage.dataset.kind = 'validation';
        };

        const clearSummaryIfFixed = () => {
            if (formMessage && formMessage.dataset.kind === 'validation'
                && !fields.some((f) => f.getAttribute('aria-invalid') === 'true')) {
                showMessage('', '');
            }
        };

        fields.forEach((field) => {
            errorElFor(field);
            if (field === emailInput) return;
            field.addEventListener(field.tagName === 'SELECT' ? 'change' : 'input', () => {
                if (field.getAttribute('aria-invalid') === 'true' && !fieldError(field)) {
                    clearFieldError(field);
                    clearSummaryIfFixed();
                }
            });
        });

        // Email: sin espacios, verde cuando es válido; el error de formato aparece al salir del campo
        if (emailInput) {
            const refreshEmail = (onBlur) => {
                const clean = emailInput.value.replace(/\s/g, '');
                if (clean !== emailInput.value) emailInput.value = clean;
                const error = fieldError(emailInput);
                const flagged = emailInput.getAttribute('aria-invalid') === 'true';
                if (!clean) {
                    emailInput.classList.remove('input-valid');
                    if (flagged) setFieldError(emailInput, error);
                } else if (!error) {
                    clearFieldError(emailInput);
                    emailInput.classList.add('input-valid');
                    clearSummaryIfFixed();
                } else {
                    emailInput.classList.remove('input-valid');
                    if (onBlur || flagged) setFieldError(emailInput, error);
                }
            };
            emailInput.addEventListener('input', () => refreshEmail(false));
            emailInput.addEventListener('change', () => refreshEmail(false));
            emailInput.addEventListener('blur', () => {
                if (emailInput.value) refreshEmail(true);
            });
        }

        // ── Teléfono: prefijo + número con formato; sin prefijo se admite "+código" ──
        const syncPhonePlaceholder = () => {
            if (!phoneNumInput) return;
            const pref = phonePrefSelect ? phonePrefSelect.value : '';
            if (pref === '+1') phoneNumInput.placeholder = '305 555 0199';
            else if (pref === '+34') phoneNumInput.placeholder = '600 000 000';
            else if (pref === '+44') phoneNumInput.placeholder = '7700 900000';
            else phoneNumInput.placeholder = ui.phonePlaceholder;
        };

        const phoneValue = () => {
            if (!phoneNumInput) return '';
            const raw = phoneNumInput.value.trim();
            const digits = raw.replace(/\D/g, '');
            if (!digits) return '';
            const pref = phonePrefSelect ? phonePrefSelect.value : '';
            if (pref) return pref + ' ' + formatPhoneDigits(digits, pref);
            return (raw.charAt(0) === '+' ? '+' : '') + formatPhoneDigits(digits, '');
        };

        if (phonePrefSelect) {
            phonePrefSelect.addEventListener('change', () => {
                syncPhonePlaceholder();
                if (phoneNumInput && phoneNumInput.value) {
                    const digits = phoneNumInput.value.replace(/\D/g, '');
                    const plus = !phonePrefSelect.value && phoneNumInput.value.trim().charAt(0) === '+';
                    phoneNumInput.value = (plus ? '+' : '') + formatPhoneDigits(digits, phonePrefSelect.value);
                }
            });
            syncPhonePlaceholder();
        }

        if (phoneNumInput) {
            phoneNumInput.addEventListener('input', function () {
                const pref = phonePrefSelect ? phonePrefSelect.value : '';
                const plus = !pref && this.value.trim().charAt(0) === '+';
                const cur = this.selectionStart || 0;
                const beforeDigits = this.value.slice(0, cur).replace(/\D/g, '').length;
                const digits = this.value.replace(/\D/g, '');
                this.value = (plus ? '+' : '') + formatPhoneDigits(digits, pref);

                let newCur = beforeDigits > 0 ? this.value.length : (plus ? 1 : 0);
                let count = 0;
                if (beforeDigits > 0) {
                    for (let i = 0; i < this.value.length; i++) {
                        if (/\d/.test(this.value[i])) count++;
                        if (count === beforeDigits) {
                            newCur = i + 1;
                            break;
                        }
                    }
                }
                try { this.setSelectionRange(newCur, newCur); } catch (_) { /* sin selección */ }
            });
        }

        // ── Nivel de burbuja (assets/js/nivel.js) ───────────────────────────
        const levelOk = () => {
            if (!levelBox) return true;
            const human = contactForm.dataset.human;
            if (human === undefined) return true;    // nivel.js no se ejecutó: nunca bloquear un contacto
            if (human === 'true') return true;
            const nivel = window.Pr3ciseNivel;
            if (nivel && typeof nivel.check === 'function') {
                try {
                    if (nivel.check() === true) return true;
                } catch (_) {
                    return true;
                }
            }
            return contactForm.dataset.human === 'true';
        };

        const levelErrorEl = () => {
            let el = document.getElementById('level-error');
            if (!el && levelBox) {
                el = document.createElement('p');
                el.id = 'level-error';
                el.className = 'level-error';
                el.setAttribute('role', 'alert');
                el.hidden = true;
                levelBox.appendChild(el);
            }
            return el;
        };

        const hideLevelError = () => {
            const el = document.getElementById('level-error');
            if (el) {
                el.hidden = true;
                el.textContent = '';
            }
            if (levelBox) levelBox.classList.remove('level-attention');
        };

        const showLevelError = () => {
            const el = levelErrorEl();
            if (el) {
                el.textContent = ui.levelRequired;
                el.hidden = false;
            }
            showMessage('', '');
            if (levelBox) {
                levelBox.classList.remove('level-attention');
                void levelBox.offsetWidth;                  // reinicia la animación de aviso
                levelBox.classList.add('level-attention');
                clearTimeout(attentionTimer);
                attentionTimer = setTimeout(() => levelBox.classList.remove('level-attention'), 1800);
                try {
                    levelBox.scrollIntoView({ block: 'center', behavior: reducedMotion() ? 'auto' : 'smooth' });
                } catch (_) { /* navegador antiguo */ }
            }
            const slider = document.getElementById('level-slider');
            if (slider) {
                try { slider.focus({ preventScroll: true }); } catch (_) { slider.focus(); }
            }
        };

        contactForm.addEventListener('pr3cise:level', (ev) => {
            if (ev.detail && ev.detail.human) hideLevelError();
        });

        // ── Envío ───────────────────────────────────────────────────────────
        const setBusy = (busy) => {
            if (!submitBtn) return;
            submitBtn.disabled = busy;
            if (busy) {
                submitBtn.setAttribute('aria-busy', 'true');
                setButtonLabel(submitBtn, msg('msgSending', ui.sending));
            } else {
                submitBtn.removeAttribute('aria-busy');
                setButtonLabel(submitBtn, submitBtn.dataset.label);
            }
        };

        // Enlace mailto con lo que la persona ya escribió, para no perder la solicitud si falla el envío
        const mailtoHref = () => {
            const value = (id) => {
                const el = document.getElementById(id);
                return el ? String(el.value || '').trim() : '';
            };
            const label = (id, fallback) => {
                const el = contactForm.querySelector('label[for="' + id + '"]');
                return el ? el.textContent.replace(/\s+/g, ' ').trim() : fallback;
            };
            const scope = document.getElementById('tipo_proyecto');
            const scopeText = scope && scope.selectedIndex > 0 ? scope.options[scope.selectedIndex].text : '';
            const head = [
                label('nombre', 'Nombre') + ': ' + value('nombre'),
                label('empresa', 'Empresa') + ': ' + value('empresa'),
                label('email', 'Email') + ': ' + value('email'),
                label('telefono_numero', 'Teléfono') + ': ' + phoneValue(),
                label('tipo_proyecto', 'Alcance') + ': ' + scopeText
            ].join('\r\n');
            const base = 'mailto:' + CONTACT_EMAIL + '?subject=' + encodeURIComponent(ui.mailSubject) + '&body=';
            let message = value('mensaje');
            let href = base + encodeURIComponent(head + '\r\n\r\n' + message);
            // Algunos clientes de correo cortan los enlaces mailto muy largos
            for (let i = 0; i < 8 && href.length > 1900 && message; i++) {
                const chars = Array.from(message);
                message = chars.slice(0, Math.floor(chars.length * 0.6)).join('') + '…';
                href = base + encodeURIComponent(head + '\r\n\r\n' + message);
            }
            return href;
        };

        const showSendError = (timedOut) => {
            if (!formMessage) return;
            let mailHref = 'mailto:' + CONTACT_EMAIL;
            try { mailHref = mailtoHref(); } catch (_) { /* enlace sin datos */ }
            const lead = document.createElement('strong');
            lead.textContent = (timedOut ? ui.sendErrorTimeout : ui.sendErrorLead) + ' ';
            const rest = document.createElement('span');
            appendTemplate(rest, ui.sendErrorAlt, {
                email: makeLink(mailHref, CONTACT_EMAIL),
                whatsapp: makeLink(CONTACT_WHATSAPP + '?text=' + encodeURIComponent(ui.waText), 'WhatsApp', true)
            });
            formMessage.textContent = '';
            formMessage.appendChild(lead);
            formMessage.appendChild(rest);
            formMessage.className = 'form-message show error';
            formMessage.dataset.kind = 'send';
        };

        // Avisos de un envío anterior sin JavaScript (#form-enviado / #form-fallo, CSS :target):
        // en cuanto se envía desde aquí ya no aplican.
        const hideNoJsNotes = () => {
            document.querySelectorAll('.form-nojs-note').forEach((note) => { note.hidden = true; });
        };

        // ── Confirmación ────────────────────────────────────────────────────
        const restoreForm = () => {
            if (successPanel) successPanel.hidden = true;
            contactForm.hidden = false;
            const first = document.getElementById('nombre');
            if (first) focusField(first);
        };

        const buildSuccessPanel = () => {
            const panel = document.createElement('div');
            panel.className = 'form-success';
            panel.id = 'form-success';
            panel.setAttribute('role', 'status');
            panel.hidden = true;

            const icon = document.createElement('span');
            icon.className = 'form-success-icon';
            icon.setAttribute('aria-hidden', 'true');
            icon.textContent = '✓';

            const title = document.createElement('h2');
            title.className = 'form-success-title';
            title.tabIndex = -1;
            title.textContent = ui.successTitle;

            const next = document.createElement('p');
            next.className = 'form-success-next';
            next.textContent = ui.successNext;

            const plans = document.createElement('p');
            plans.className = 'form-success-plans';
            appendTemplate(plans, ui.successPlans, { email: makeLink('mailto:' + CONTACT_EMAIL, CONTACT_EMAIL) });

            const again = document.createElement('button');
            again.type = 'button';
            again.className = 'form-success-again';
            again.textContent = ui.successAgain;
            again.addEventListener('click', restoreForm);

            [icon, title, next, plans, again].forEach((node) => panel.appendChild(node));
            contactForm.insertAdjacentElement('afterend', panel);
            return panel;
        };

        const showSuccessPanel = () => {
            if (!successPanel) successPanel = buildSuccessPanel();
            contactForm.hidden = true;
            successPanel.hidden = false;
            const title = successPanel.querySelector('.form-success-title');
            if (title) {
                try { title.focus({ preventScroll: true }); } catch (_) { title.focus(); }
            }
            try {
                successPanel.scrollIntoView({ block: 'center', behavior: reducedMotion() ? 'auto' : 'smooth' });
            } catch (_) { /* navegador antiguo */ }
        };

        const completeSuccess = () => {
            hideNoJsNotes();
            contactForm.reset();
            fields.forEach(clearFieldError);
            contactForm.querySelectorAll('.input-valid').forEach((el) => el.classList.remove('input-valid'));
            syncPhonePlaceholder();
            showMessage('', '');
            hideLevelError();
            document.dispatchEvent(new CustomEvent('pr3cise:form-reset'));
            window.dispatchEvent(new CustomEvent('pr3cise:form-reset'));
            showSuccessPanel();
        };

        // ── Token anti-robots (api/form-token.php) ──────────────────────────
        let formToken = '';
        let tokenAt = 0;
        let tokenRequest = null;

        const fetchToken = () => {
            if (tokenRequest) return tokenRequest;
            tokenRequest = fetch(TOKEN_ENDPOINT, {
                method: 'GET',
                cache: 'no-store',
                credentials: 'same-origin',
                headers: { Accept: 'application/json' }
            })
                .then((r) => (r.ok ? r.json() : null))
                .then((data) => {
                    if (data && typeof data.token === 'string' && data.token) {
                        formToken = data.token;
                        tokenAt = Date.now();
                    }
                })
                .catch((err) => {
                    console.warn('[contacto] token no disponible:', err && (err.name || err.message));
                })
                .then(() => {
                    tokenRequest = null;
                    return formToken;
                });
            return tokenRequest;
        };

        // Devuelve un token utilizable ('' si no se pudo conseguir), esperando a la edad mínima
        const ensureToken = async (renew) => {
            if (renew) formToken = '';
            if (!formToken || Date.now() - tokenAt > TOKEN_REFRESH_MS) await fetchToken();
            if (!formToken) return '';
            const wait = TOKEN_MIN_AGE_MS - (Date.now() - tokenAt);
            if (wait > 0) await new Promise((resolve) => setTimeout(resolve, wait));
            return formToken;
        };

        fetchToken();

        // Un POST a send_mail.php con límite de tiempo. Nunca lanza excepción.
        const postForm = async (formData, token) => {
            formData.set('form_token', token);
            const controller = typeof AbortController === 'function' ? new AbortController() : null;
            let timedOut = false;
            const timer = controller ? setTimeout(() => {
                timedOut = true;
                controller.abort();
            }, FORM_TIMEOUT_MS) : 0;
            try {
                const response = await fetch(FORM_ENDPOINT, {
                    method: 'POST',
                    body: formData,
                    headers: { Accept: 'application/json', 'X-Pr3cise-Form': '1' },
                    signal: controller ? controller.signal : undefined
                });
                let payload = null;
                try {
                    payload = await response.json();
                } catch (_) { /* respuesta sin JSON */ }
                return { response, payload, timedOut: false };
            } catch (err) {
                console.warn('[contacto] envío fallido:', err && (err.name || err.message));
                return { response: null, payload: null, timedOut };
            } finally {
                if (timer) clearTimeout(timer);
            }
        };

        const sendForm = async () => {
            sending = true;
            setBusy(true);
            showMessage('', '');
            hideNoJsNotes();

            const formData = new FormData(contactForm);
            formData.set('user_lang', formLang);
            formData.set('telefono', phoneValue());
            // Solo se llega aquí con el honeypot vacío o rellenado por el autocompletado del navegador
            if (honeypot) formData.set('website', '');

            let outcome = 'error';
            try {
                let token = await ensureToken(false);
                let result = token ? await postForm(formData, token) : null;
                // Token caducado o rechazado: se pide otro y se reintenta una sola vez
                if (result && result.response && result.response.status === 403
                    && result.payload && result.payload.code === 'token') {
                    token = await ensureToken(true);
                    result = token ? await postForm(formData, token) : null;
                }
                const response = result && result.response;
                const payload = result && result.payload;
                if (!result) {
                    console.warn('[contacto] sin token del formulario: no se envía');
                } else if (response && response.ok && payload && payload.status === 'success') {
                    outcome = 'ok';
                } else if (response && response.status === 400 && payload && payload.field === 'email') {
                    outcome = 'email';
                } else {
                    outcome = result.timedOut ? 'timeout' : 'error';
                    if (response) console.warn('[contacto] envío no aceptado:', response.status, payload && payload.message);
                }
            } catch (err) {
                outcome = 'error';
                console.warn('[contacto] envío fallido:', err && (err.name || err.message));
            } finally {
                sending = false;
                setBusy(false);
            }

            if (outcome === 'ok') {
                completeSuccess();
                // Conversión real (el servidor aceptó la solicitud): para la analítica (medir.js)
                try {
                    document.dispatchEvent(new CustomEvent('pr3cise:form-sent', { detail: { lang: formLang } }));
                } catch (_) { /* navegador muy antiguo */ }
            } else if (outcome === 'email' && emailInput) {
                setFieldError(emailInput, ui.errEmailFormat);
                showSummary(msg('msgEmail', ui.email));
                focusField(emailInput);
            } else {
                showSendError(outcome === 'timeout');
            }
        };

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (sending) return;

            // 1. Campos obligatorios y formato del email
            let firstInvalid = null;
            let onlyEmailFormat = true;
            fields.forEach((field) => {
                const error = fieldError(field);
                if (error) {
                    setFieldError(field, error);
                    if (!firstInvalid) firstInvalid = field;
                    if (field !== emailInput || !String(field.value || '').trim()) onlyEmailFormat = false;
                } else {
                    clearFieldError(field);
                }
            });
            if (firstInvalid) {
                showSummary(onlyEmailFormat ? msg('msgEmail', ui.email) : msg('msgRequired', ui.required));
                focusField(firstInvalid);
                return;
            }

            // 2. Nivel de burbuja
            if (!levelOk()) {
                showLevelError();
                return;
            }
            hideLevelError();

            // 3. Honeypot: un robot rellenó "website" → éxito aparente, sin llamar al servidor
            if (honeypot && honeypot.value && !isAutofilled(honeypot)) {
                sending = true;
                setBusy(true);
                showMessage('', '');
                setTimeout(() => {
                    sending = false;
                    setBusy(false);
                    completeSuccess();
                }, 600);
                return;
            }

            sendForm();
        });

        // ── Botón "volver arriba" (fijo abajo a la derecha) ─────────────────
        // Por debajo de 900 px la tarjeta ocupa todo el ancho y el botón tapaba el de envío
        // (un toque ahí subía la página en vez de enviar), los campos y los avisos. Se oculta
        // mientras la tarjeta (formulario o panel de confirmación) pasa por la franja inferior
        // de la pantalla donde está el botón. Mismo umbral (300 px) que su manejador de arriba.
        const toTopBtn = document.getElementById('back-to-top');
        const formCard = contactForm.closest('.form-container') || contactForm;
        if (toTopBtn) {
            const narrow = window.matchMedia ? window.matchMedia('(max-width: 899px)') : null;
            const syncToTop = () => {
                const vh = window.innerHeight || document.documentElement.clientHeight;
                const r = formCard.getBoundingClientRect();
                const over = (!narrow || narrow.matches) && r.height > 0 && r.top < vh - 20 && r.bottom > vh - 84;
                toTopBtn.classList.toggle('over-form', over);
                toTopBtn.classList.toggle('visible', !over && window.scrollY > 300);
            };
            window.addEventListener('scroll', syncToTop, { passive: true });
            window.addEventListener('resize', syncToTop);
            if (narrow) {
                if (narrow.addEventListener) narrow.addEventListener('change', syncToTop);
                else if (narrow.addListener) narrow.addListener(syncToTop);
            }
            // La tarjeta cambia de alto sin scroll (errores, aviso de envío, panel de confirmación)
            if ('ResizeObserver' in window) new ResizeObserver(() => syncToTop()).observe(formCard);
            syncToTop();
        }
    }

    // 5. FAQ Accordion (.accordion-trigger)
    const accordionTriggers = document.querySelectorAll('.accordion-trigger');
    accordionTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
            const content = trigger.nextElementSibling;

            accordionTriggers.forEach(other => {
                if (other !== trigger) {
                    other.setAttribute('aria-expanded', 'false');
                    if (other.nextElementSibling) other.nextElementSibling.style.maxHeight = '0';
                }
            });

            if (!isExpanded) {
                trigger.setAttribute('aria-expanded', 'true');
                if (content) content.style.maxHeight = content.scrollHeight + 'px';
            } else {
                trigger.setAttribute('aria-expanded', 'false');
                if (content) content.style.maxHeight = '0';
            }
        });
    });

    // 6. Slideshow (Ejemplos / Portfolio)
    const slideshow = document.getElementById('ejemplos-slideshow');
    if (slideshow) {
        const slides = Array.from(slideshow.querySelectorAll('.slide'));
        const dotsContainer = document.getElementById('slide-dots');
        let current = 0;
        let timer;

        if (dotsContainer) {
            slides.forEach((_, i) => {
                const dot = document.createElement('button');
                dot.type = 'button';
                dot.classList.add('slide-dot');
                dot.setAttribute('aria-label', (pageLang === 'en' ? 'Slide ' : 'Imagen ') + (i + 1));
                if (i === 0) dot.classList.add('active');
                dot.addEventListener('click', () => goTo(i));
                dotsContainer.appendChild(dot);
            });
        }

        const dots = () => dotsContainer ? Array.from(dotsContainer.querySelectorAll('.slide-dot')) : [];

        function goTo(index) {
            slides[current].classList.remove('active');
            if (dots()[current]) dots()[current].classList.remove('active');
            current = (index + slides.length) % slides.length;
            slides[current].classList.add('active');
            if (dots()[current]) dots()[current].classList.add('active');
        }

        function next() { goTo(current + 1); }
        function prev() { goTo(current - 1); }

        function startTimer() {
            clearInterval(timer);
            timer = setInterval(next, 4000);
        }

        // Sin "?.": con encadenamiento opcional todo main.js da error de sintaxis en Safari < 13.1
        // (iPad e iPhone con iOS < 13.4) y en Chrome < 80, y el formulario se queda sin script.
        const nextBtn = document.querySelector('.slide-next');
        if (nextBtn) nextBtn.addEventListener('click', () => { next(); startTimer(); });
        const prevBtn = document.querySelector('.slide-prev');
        if (prevBtn) prevBtn.addEventListener('click', () => { prev(); startTimer(); });

        slideshow.addEventListener('mouseenter', () => clearInterval(timer));
        slideshow.addEventListener('mouseleave', startTimer);

        startTimer();

        const lightbox      = document.getElementById('img-lightbox');
        const lightboxImg   = document.getElementById('lightbox-img');
        const lightboxClose = document.getElementById('lightbox-close');

        if (lightbox && lightboxImg) {
            function openLightbox(img) {
                lightboxImg.src = img.src;
                lightboxImg.alt = img.alt;
                lightbox.classList.add('open');
                document.body.style.overflow = 'hidden';
                clearInterval(timer);
                if (lightboxClose) lightboxClose.focus();
            }

            function closeLightbox() {
                lightbox.classList.remove('open');
                document.body.style.overflow = '';
                startTimer();
            }

            const lightboxPrev = document.getElementById('lightbox-prev');
            const lightboxNext = document.getElementById('lightbox-next');

            function lightboxGoTo(index) {
                goTo(index);
                const activeImg = slides[current].querySelector('img');
                if (activeImg) {
                    lightboxImg.src = activeImg.src;
                    lightboxImg.alt = activeImg.alt;
                }
            }

            slideshow.querySelectorAll('.slide img').forEach(img => {
                img.addEventListener('click', () => openLightbox(img));
            });

            if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
            if (lightboxPrev) lightboxPrev.addEventListener('click', e => { e.stopPropagation(); lightboxGoTo(current - 1); });
            if (lightboxNext) lightboxNext.addEventListener('click', e => { e.stopPropagation(); lightboxGoTo(current + 1); });

            lightbox.addEventListener('click', e => {
                if (e.target === lightbox) closeLightbox();
            });

            document.addEventListener('keydown', e => {
                if (e.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox();
            });
        }
    }

    function showMessage(text, type) {
        if (!formMessage) return;
        delete formMessage.dataset.kind;      // 'validation' | 'send': lo pone quien lo necesita
        formMessage.textContent = text;
        formMessage.className = text ? `form-message show ${type}` : 'form-message';
    }
});
