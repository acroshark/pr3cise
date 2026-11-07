document.addEventListener('DOMContentLoaded', () => {

    /* 2026-08-03 | SEO: header y footer ya vienen estáticos en el HTML de cada página. */

    const pageLang = (document.documentElement.lang || 'es').slice(0, 2).toLowerCase();

    const UI_STRINGS = {
        es: {
            openMenu: 'Abrir menú',
            closeMenu: 'Cerrar menú',
            required: 'Por favor, completa todos los campos obligatorios.',
            email: 'Por favor, introduce un correo electrónico válido.',
            sending: 'Enviando...',
            success: 'Solicitud enviada correctamente. Te responderemos en menos de 24 horas laborables con alcance, precio cerrado y plazo.',
            error: 'No se pudo enviar el formulario en este momento. Escríbenos directamente a contact@pr3cise.com.',
            phonePlaceholder: '600 000 000'
        },
        en: {
            openMenu: 'Open menu',
            closeMenu: 'Close menu',
            required: 'Please complete all required fields.',
            email: 'Please enter a valid business email address.',
            sending: 'Sending...',
            success: 'Request received. We will reply within one business day with your fixed fee and delivery date.',
            error: 'Could not send your message right now. Please email us directly at contact@pr3cise.com.',
            phonePlaceholder: '305 555 0199'
        },
        de: {
            openMenu: 'Menü öffnen',
            closeMenu: 'Menü schließen',
            required: 'Bitte füllen Sie alle Pflichtfelder aus.',
            email: 'Bitte geben Sie eine gültige E-Mail-Adresse ein.',
            sending: 'Wird gesendet...',
            success: 'Anfrage erhalten. Wir antworten innerhalb eines Werktags mit Festpreis und Liefertermin.',
            error: 'Nachricht konnte nicht gesendet werden. Bitte schreiben Sie direkt an contact@pr3cise.com.',
            phonePlaceholder: '151 23456789'
        },
        fr: {
            openMenu: 'Ouvrir le menu',
            closeMenu: 'Fermer le menu',
            required: 'Veuillez remplir tous les champs obligatoires.',
            email: 'Veuillez saisir une adresse e-mail valide.',
            sending: 'Envoi en cours...',
            success: 'Demande envoyée. Nous vous répondrons sous 24 heures ouvrées avec un prix forfaitaire et un délai.',
            error: 'Impossible d\'envoyer le message pour le moment. Écrivez-nous directement à contact@pr3cise.com.',
            phonePlaceholder: '6 12 34 56 78'
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

    // 4. Gestión del Formulario (Validación y Fetch sin recargar)
    const contactForm = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');
    const submitBtn = document.getElementById('submit-btn');

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
        const msg = (key, fallback) => contactForm.dataset[key] || fallback;

        const emailInput = document.getElementById('email');
        if (emailInput) {
            const emailFmt = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
            emailInput.addEventListener('input', function () {
                this.value = this.value.replace(/\s/g, '');
                if (!this.value) {
                    this.classList.remove('input-valid', 'input-invalid');
                } else if (emailFmt.test(this.value)) {
                    this.classList.add('input-valid');
                    this.classList.remove('input-invalid');
                } else {
                    this.classList.add('input-invalid');
                    this.classList.remove('input-valid');
                }
            });
        }

        const phonePrefSelect = document.getElementById('telefono_prefijo');
        const phoneNumInput = document.getElementById('telefono_numero');

        const syncPhonePlaceholder = () => {
            if (!phoneNumInput) return;
            const pref = phonePrefSelect ? phonePrefSelect.value : '';
            if (pref === '+1') phoneNumInput.placeholder = '305 555 0199';
            else if (pref === '+34') phoneNumInput.placeholder = '600 000 000';
            else if (pref === '+44') phoneNumInput.placeholder = '7700 900000';
            else phoneNumInput.placeholder = ui.phonePlaceholder;
        };

        if (phonePrefSelect) {
            phonePrefSelect.addEventListener('change', () => {
                syncPhonePlaceholder();
                if (phoneNumInput && phoneNumInput.value) {
                    const digits = phoneNumInput.value.replace(/\D/g, '');
                    phoneNumInput.value = formatPhoneDigits(digits, phonePrefSelect.value);
                }
            });
            syncPhonePlaceholder();
        }

        if (phoneNumInput) {
            phoneNumInput.addEventListener('input', function () {
                const cur = this.selectionStart || 0;
                const beforeDigits = this.value.slice(0, cur).replace(/\D/g, '').length;
                const digits = this.value.replace(/\D/g, '');
                const pref = phonePrefSelect ? phonePrefSelect.value : '';
                this.value = formatPhoneDigits(digits, pref);

                let newCur = 0;
                let count = 0;
                for (let i = 0; i < this.value.length; i++) {
                    if (/\d/.test(this.value[i])) count++;
                    if (count === beforeDigits) {
                        newCur = i + 1;
                        break;
                    }
                }
                if (beforeDigits === 0) newCur = 0;
                this.setSelectionRange(newCur, newCur);
            });
        }

        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const nombre = document.getElementById('nombre').value.trim();
            const empresa = document.getElementById('empresa').value.trim();
            const email = document.getElementById('email').value.trim();
            const tipoProyecto = document.getElementById('tipo_proyecto').value;
            const mensaje = document.getElementById('mensaje').value.trim();

            if (!nombre || !empresa || !email || !tipoProyecto || !mensaje) {
                showMessage(msg('msgRequired', ui.required), 'error');
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showMessage(msg('msgEmail', ui.email), 'error');
                return;
            }

            const originalBtnText = submitBtn.innerText;
            submitBtn.innerText = msg('msgSending', ui.sending);
            submitBtn.disabled = true;
            showMessage('', '');

            const formData = new FormData(contactForm);
            formData.append('lead_destination', 'contact@pr3cise.com');

            const _lang = (document.documentElement.lang
                || (window.I18N && typeof window.I18N.getLang === 'function' ? window.I18N.getLang() : null)
                || localStorage.getItem('pr3cise_lang')
                || 'es').slice(0, 2).toLowerCase();
            formData.append('user_lang', _lang);

            if (phonePrefSelect && phoneNumInput) {
                const cleanDigits = phoneNumInput.value.replace(/\D/g, '');
                const combined = cleanDigits
                    ? (phonePrefSelect.value ? phonePrefSelect.value + ' ' : '') + formatPhoneDigits(cleanDigits, phonePrefSelect.value)
                    : '';
                formData.append('telefono', combined);
            }

            let submittedOk = false;
            try {
                // Absolute root path '/api/send_mail.php' works from /, /en/, /de/, and /fr/
                const response = await fetch('/api/send_mail.php', {
                    method: 'POST',
                    body: formData
                });

                if (response.ok) {
                    submittedOk = true;
                    showMessage(msg('msgSuccess', ui.success), 'success');
                    contactForm.reset();
                    if (emailInput) emailInput.classList.remove('input-valid', 'input-invalid');
                    syncPhonePlaceholder();
                    window.dispatchEvent(new CustomEvent('pr3cise:form-reset'));
                } else {
                    throw new Error('Server status ' + response.status);
                }
            } catch (error) {
                console.error('Error enviando formulario:', error);
                showMessage(msg('msgError', ui.error), 'error');
            } finally {
                submitBtn.innerText = originalBtnText;
                // Keep enabled if an error occurred so user can retry without re-solving CAPTCHA
                if (!submittedOk) {
                    submitBtn.disabled = false;
                }
            }
        });
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

        document.querySelector('.slide-next')?.addEventListener('click', () => { next(); startTimer(); });
        document.querySelector('.slide-prev')?.addEventListener('click', () => { prev(); startTimer(); });

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
        formMessage.textContent = text;
        formMessage.className = text ? `form-message show ${type}` : 'form-message';

        if (type === 'success') {
            setTimeout(() => {
                formMessage.classList.remove('show');
            }, 9000);
        }
    }
});
