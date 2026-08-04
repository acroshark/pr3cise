document.addEventListener('DOMContentLoaded', () => {

    /* 2026-08-03 | SEO: header y footer ya vienen estáticos en el HTML de cada página.
       Antes se inyectaban con fetch('components/header.html'), lo que dejaba TODOS los
       enlaces internos fuera del HTML servido y hacía que el enlazado interno dependiera
       de que el rastreador ejecutase JavaScript. Aquí solo se conecta el comportamiento. */

    // Marcar el enlace de navegación de la página actual
    let currentPath = window.location.pathname;
    if (currentPath.endsWith('/')) currentPath += 'index.html';

    document.querySelectorAll('.site-nav a').forEach(link => {
        const href = link.getAttribute('href');
        if (href && href === currentPath) {
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
        toggleButton.setAttribute('aria-label', 'Abrir menú');
        toggleButton.setAttribute('aria-expanded', 'false');
        siteHeader.insertBefore(toggleButton, siteNav);

        toggleButton.addEventListener('click', () => {
            const open = siteNav.classList.toggle('active');
            toggleButton.innerHTML = open ? '✕' : '☰';
            toggleButton.setAttribute('aria-expanded', String(open));
        });
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

    // La lógica One-Page Smooth Scroll se ha suprimido por la estructura Multi-Página

    // 2. Animaciones On-Scroll (Intersection Observer)
    const fadeElements = document.querySelectorAll('.fade-in');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };
    
    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Dejamos de observar una vez ha aparecido para que la animación termine y se mantenga
                observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);
    
    fadeElements.forEach(el => scrollObserver.observe(el));

    // 3. Interactividad en Pricing (Resaltar "Paquetes Recurrentes" con ratón)
    const cardBusiness = document.getElementById('card-business');
    if (cardBusiness) {
        cardBusiness.addEventListener('mouseenter', () => {
            cardBusiness.classList.add('highlight');
        });
        
        cardBusiness.addEventListener('mouseleave', () => {
            cardBusiness.classList.remove('highlight');
        });
    }

    // 4. Gestión del Formulario (Validación y Fetch sin recargar)
    const contactForm = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');
    const submitBtn = document.getElementById('submit-btn');

    if (contactForm) {
        /* 2026-08-03 | Los textos de estado del formulario salen de data-msg-* en el <form>.
           Las páginas en /en/ los declaran en inglés; si no hay atributo, se usa el castellano. */
        const msg = (key, fallback) => contactForm.dataset[key] || fallback;
        // 2025-04-26 01:42 | Email mask: strip spaces on input, live valid/invalid border
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

        // 2025-04-26 01:42 | Phone mask: strip non-digits, auto-space every 3 digits, max 15
        const phoneNumInput = document.getElementById('telefono_numero');
        if (phoneNumInput) {
            phoneNumInput.addEventListener('input', function () {
                const cur = this.selectionStart;
                const before = this.value.slice(0, cur).replace(/\D/g, '').length;
                const digits = this.value.replace(/\D/g, '').slice(0, 15);
                this.value = digits.replace(/(\d{3})(?=\d)/g, '$1\u00a0');
                let newCur = 0, count = 0;
                for (let i = 0; i < this.value.length; i++) {
                    if (this.value[i] !== '\u00a0') count++;
                    if (count === before) { newCur = i + 1; break; }
                }
                this.setSelectionRange(newCur, newCur);
            });
        }

        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Validación de los campos
            const nombre = document.getElementById('nombre').value.trim();
            const empresa = document.getElementById('empresa').value.trim();
            const email = document.getElementById('email').value.trim();
            const tipoProyecto = document.getElementById('tipo_proyecto').value;
            const mensaje = document.getElementById('mensaje').value.trim();
            
            if (!nombre || !empresa || !email || !tipoProyecto || !mensaje) {
                showMessage(msg('msgRequired', 'Por favor, completa todos los campos obligatorios.'), 'error');
                return;
            }
            
            // Validación de email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showMessage(msg('msgEmail', 'Por favor, introduce un correo electrónico válido.'), 'error');
                return;
            }

            // Cambiar estado a "Enviando..."
            const originalBtnText = submitBtn.innerText;
            submitBtn.innerText = msg('msgSending', 'Enviando...');
            submitBtn.disabled = true;
            showMessage('', ''); // Disimula msjs previos
            
            // Preparar FormData y añadir correo destino
            const formData = new FormData(contactForm);
            /* 2025-04-26 01:00 | Updated to contact@pr3cise.com */
            formData.append('lead_destination', 'contact@pr3cise.com');
            /* 2025-04-26 01:55 | Append current page language for multilingual confirmation email */
            /* 2026-08-03 | El idioma del email de confirmación se toma del <html lang> de la
               página. Antes dependía de window.I18N, que no se carga en /en/: un contacto
               desde la web inglesa recibía la confirmación en castellano. */
            const _lang = document.documentElement.lang
                || (window.I18N && typeof window.I18N.getLang === 'function' ? window.I18N.getLang() : null)
                || localStorage.getItem('pr3cise_lang')
                || 'es';
            formData.append('user_lang', _lang);
            /* 2025-04-26 01:42 | Combine country prefix + number into legacy telefono field */
            const _pref = document.getElementById('telefono_prefijo');
            const _num  = document.getElementById('telefono_numero');
            if (_pref && _num) {
                const combined = _num.value.trim()
                    ? _pref.value + ' ' + _num.value.replace(/[\s\u00a0]/g, '')
                    : '';
                formData.append('telefono', combined);
            }
            
            try {
                // Petición a 'api/send_mail.php'
                const response = await fetch('api/send_mail.php', {
                    method: 'POST',
                    body: formData
                });
                
                if (response.ok) {
                    // Éxito:
                    showMessage(msg('msgSuccess', '¡Éxito! Tu mensaje ha sido enviado. Te responderemos pronto.'), 'success');
                    contactForm.reset();
                } else {
                    throw new Error('Respuesta inválida del servidor (' + response.status + ')');
                }
            } catch (error) {
                // Manejo de Error:
                console.error('Error enviando formulario:', error);
                showMessage(msg('msgError', 'Error enviando el mensaje. Inténtalo de nuevo más tarde.'), 'error');
            } finally {
                // Restaurar botón
                submitBtn.innerText = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }
    
    // 5. FAQ Accordion
    const accordionTriggers = document.querySelectorAll('.accordion-trigger');
    accordionTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
            const content = trigger.nextElementSibling;

            // Close all others
            accordionTriggers.forEach(other => {
                if (other !== trigger) {
                    other.setAttribute('aria-expanded', 'false');
                    other.nextElementSibling.style.maxHeight = '0';
                }
            });

            // Toggle current
            if (!isExpanded) {
                trigger.setAttribute('aria-expanded', 'true');
                content.style.maxHeight = content.scrollHeight + 'px';
            } else {
                trigger.setAttribute('aria-expanded', 'false');
                content.style.maxHeight = '0';
            }
        });
    });

    // 6. Slideshow (Ejemplos)
    const slideshow = document.getElementById('ejemplos-slideshow');
    if (slideshow) {
        const slides = Array.from(slideshow.querySelectorAll('.slide'));
        const dotsContainer = document.getElementById('slide-dots');
        let current = 0;
        let timer;

        // Build dots
        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.classList.add('slide-dot');
            dot.setAttribute('aria-label', `Imagen ${i + 1}`);
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goTo(i));
            dotsContainer.appendChild(dot);
        });

        const dots = () => Array.from(dotsContainer.querySelectorAll('.slide-dot'));

        function goTo(index) {
            slides[current].classList.remove('active');
            dots()[current].classList.remove('active');
            current = (index + slides.length) % slides.length;
            slides[current].classList.add('active');
            dots()[current].classList.add('active');
        }

        function next() { goTo(current + 1); }
        function prev() { goTo(current - 1); }

        function startTimer() {
            clearInterval(timer);
            /* 2025-04-26 00:33 | Changed interval from 4000 to 3000 ms */
            timer = setInterval(next, 3000);
        }

        document.querySelector('.slide-next')?.addEventListener('click', () => { next(); startTimer(); });
        document.querySelector('.slide-prev')?.addEventListener('click', () => { prev(); startTimer(); });

        // Pause on hover
        slideshow.addEventListener('mouseenter', () => clearInterval(timer));
        slideshow.addEventListener('mouseleave', startTimer);

        startTimer();

        // 2025-04-26 00:27 | Lightbox: tap/click image → fullscreen overlay
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

            // 2025-04-26 00:33 | Lightbox navigation — synced with slideshow state
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

            // Attach tap/click to every slide image
            slideshow.querySelectorAll('.slide img').forEach(img => {
                img.addEventListener('click', () => openLightbox(img));
            });

            // Close via × button
            if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);

            // Prev / Next inside lightbox
            if (lightboxPrev) lightboxPrev.addEventListener('click', e => { e.stopPropagation(); lightboxGoTo(current - 1); });
            if (lightboxNext) lightboxNext.addEventListener('click', e => { e.stopPropagation(); lightboxGoTo(current + 1); });

            // Close on backdrop click (touch the black area around the image)
            lightbox.addEventListener('click', e => {
                if (e.target === lightbox) closeLightbox();
            });

            // Close on Escape (useful on desktop)
            document.addEventListener('keydown', e => {
                if (e.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox();
            });
        }
    }

    // Función Helper para mensajes de estado
    function showMessage(text, type) {
        formMessage.textContent = text;
        formMessage.className = `form-message show ${type}`;
        
        // Quitar si es de éxito a los 6 segundos
        if (type === 'success') {
            setTimeout(() => {
                formMessage.classList.remove('show');
            }, 6000);
        }
    }
});
