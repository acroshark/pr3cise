/**
 * Pr3cise — i18n (Internationalisation)
 * Languages: es | en | de | fr
 * Detection: localStorage → IP API → navigator.language fallback
 */
(function () {
  'use strict';

  /* 2026-08-03 | Banderas servidas localmente en lugar de flagcdn.com:
     elimina una dependencia externa, requests de terceros y CLS en el header. */
  var FLAG_IMGS = {
    es: '/assets/img/flags/es.svg',
    en: '/assets/img/flags/us.svg',
    de: '/assets/img/flags/de.svg',
    fr: '/assets/img/flags/fr.svg'
  };

  /* ─── Translation dictionary ─────────────────────────────────────── */
  var T = {
    es: {
      /* NAV */
      'nav.about':    'Nosotros',
      'nav.services': 'Servicios',
      'nav.examples': 'Ejemplos',
      'nav.contact':  'Contacto',

      /* HERO */
      /* 2025-04-25 23:55 | New slogan and subtitle */
      /* 2025-04-26 00:00 | Added HTML highlights + precision animation target */
      'hero.h1':     'La <span class="hero-highlight hero-precision">precisión</span> que define a tu empresa.',
      /* 2025-04-26 00:45 | HTML highlights on mobile hero keys */
      'hero.h1.mob': 'La <span class="hero-highlight hero-precision">precisión</span> que define a tu empresa.',
      'hero.p.mob':  'Que un <span class="hero-highlight">presupuesto deficiente</span> no arruine tu proyecto. Optimizamos tus <span class="hero-highlight">costes</span> para maximizar tu beneficio.',
      'hero.p':      'Que un <span class="hero-highlight">presupuesto inflado o deficiente</span> no arruine un buen proyecto. Optimizamos tus <span class="hero-highlight">costes</span> para evitar el descarte inmediato y <span class="hero-highlight">maximizar tu beneficio</span>.',
      'hero.cta': 'Solicitar Presupuesto Gratis',

      /* PROBLEM */
      'prob.h2':    '¿Los sobrecostes están devorando el margen de beneficio de tus obras?',
      'prob.p1':    'El <strong>70% de los proyectos de construcción</strong> superan su presupuesto inicial. Una estimación de costes inexacta no solo retrasa la ejecución de la obra, sino que reduce drásticamente tu rentabilidad y genera tensión con los inversores.',
      'prob.p2':    'No dejes tus márgenes al azar. Una planificación financiera rigurosa es la diferencia entre un proyecto exitoso y una pérdida millonaria.',
      'prob.stat1': 'Proyectos con sobrecostes',
      'prob.stat2': 'Desviación media del presupuesto',
      'prob.stat3': 'ROI de la estimación precisa',

      /* FLOOR PLAN */
      'ri.label':      'Presupuesto en tiempo real',
      'ri.title':      'Tu obra, partida a partida',
      'ri.total.label':'presupuesto acumulado',
      'ri.scroll':     '↓ desplaza para explorar ↓',
      'ri.slider.label': 'ARRASTRA · CONTROL DE GASTOS',
      'ri.room.salon': 'SALÓN / COMEDOR',
      'ri.room.cocina':'COCINA',
      'ri.room.bano':  'BAÑO',
      'ri.room.dorm1': 'DORMITORIO 1',
      'ri.room.dorm2': 'DORMITORIO 2',
      'ri.scale':      'ESCALA 1:50 · 85 m² · PLANTA BAJA',
      /* Legend */
      'ri.leg.p': 'Fontanería / Clim.',
      'ri.leg.e': 'Electricidad',
      'ri.leg.w': 'Ventanas',
      'ri.leg.d': 'Puertas',
      /* Summary bar */
      'ri.sum.p':     'Fontanería / Clim.',
      'ri.sum.e':     'Electricidad',
      'ri.sum.w':     'Ventanas',
      'ri.sum.d':     'Puertas',
      'ri.sum.total': 'Total reforma',
      /* Phase labels (used by inline JS) */
      'phase.p': '01 · FONTANERÍA / CLIM.',
      'phase.e': '02 · ELECTRICIDAD',
      'phase.w': '03 · VENTANAS',
      'phase.d': '04 · PUERTAS',
      /* Price tag names */
      'tag.p0.name': 'fontanería · cocina',
      'tag.p0.desc': 'Fregadero + lavavajillas + lavadora',
      'tag.p1.name': 'fontanería · baño',
      'tag.p1.desc': 'Ducha, WC, lavabo + tubería completa',
      'tag.p2.name': 'climatización',
      'tag.p2.desc': '4× splits + conductos + instalación',
      'tag.e0.name': 'eléctrico · cuadro',
      'tag.e0.desc': 'ICP + 9 circuitos protegidos',
      'tag.e1.name': 'eléctrico · iluminación',
      'tag.e1.desc': 'Puntos de luz LED toda la vivienda',
      'tag.e2.name': 'eléctrico · enchufes',
      'tag.e2.desc': '24 puntos de corriente',
      'tag.w0.name': 'ventanas · salón',
      'tag.w0.desc': '2× PVC doble acristalamiento',
      'tag.w1.name': 'ventanas · dormitorios',
      'tag.w1.desc': '3× ventana + persiana enrollable',
      'tag.w2.name': 'ventanas · cocina',
      'tag.w2.desc': 'Corredera con mosquitera',
      'tag.d0.name': 'puertas · entrada',
      'tag.d0.desc': 'Blindada clase 3 + cerrojo',
      'tag.d1.name': 'puertas · interiores',
      'tag.d1.desc': '4× puerta lacada blanca',

      /* PROCESS */
      'proc.h2':  'Nuestro Proceso de Estimación de Costes',
      'proc.sub': 'Cuatro fases probadas en cientos de proyectos, diseñadas para garantizar máxima precisión y viabilidad financiera desde el primer día.',
      'proc.1.h': 'Viabilidad Conceptual',
      'proc.1.p': 'Analizamos planos, memorias y especificaciones técnicas para construir una base financiera sólida antes del diseño final.',
      'proc.2.h': 'Medición y Takeoffs',
      'proc.2.p': 'Cuantificación exacta de cada partida — materiales, mano de obra y equipos — sin dejar ninguna unidad sin medir, con metodología BIM.',
      'proc.3.h': 'Ingeniería de Valor',
      'proc.3.p': 'Aplicamos precios de mercado actualizados y optimizamos recursos para reducir costes sin comprometer calidad ni normativa.',
      'proc.4.h': 'Entrega y Licitación',
      'proc.4.p': 'Recibes el presupuesto en BC3/Excel/PDF, listo para presentar a clientes, licitar o auditar — con GG, BI y mermas desglosados.',

      /* FAQ */
      'faq.h2':    'Preguntas Frecuentes sobre Estimadores de Costes',
      'faq.intro': 'Todo lo que necesitas saber antes de externalizar tu estimación de costes de obra.',
      'faq.1.q':   '¿Por qué contratar a una empresa de estimación de costes externa?',
      'faq.1.a':   'Externalizar el servicio con un <em>cost estimator</em> aporta objetividad, elimina errores internos por exceso de carga de trabajo, garantiza el uso de bases de datos de precios actualizadas y libera a tu equipo técnico para que se concentre en la ejecución y supervisión de la obra.',
      'faq.2.q':   '¿Qué tipo de proyectos de construcción presupuestáis?',
      'faq.2.a':   'Realizamos estimaciones integrales para edificación residencial, proyectos comerciales, naves industriales y obra civil. Adaptamos nuestras métricas al tipo de estructura y acabados requeridos.',
      'faq.3.q':   '¿Qué nivel de precisión tienen vuestros presupuestos de obra?',
      'faq.3.a':   'Trabajamos con los márgenes de error más bajos del sector gracias a la combinación de tecnología de medición digital (BIM) y la validación manual de ingenieros civiles experimentados.',

      /* SERVICES PAGE */
      'services.h2':      'Sectores de Actuación y Especialidades',
      'services.sub':     'Realizamos presupuestos de alta precisión adaptados a las necesidades específicas de cada disciplina.',
      'services.construccion.h3': 'Proyectos de Viviendas y Edificación Residencial',
      'services.construccion.p':  'Desgloses completos desde el movimiento de tierras hasta los acabados, asegurando que tu promoción inmobiliaria o vivienda unifamiliar no sufra desviaciones.',
      'services.publica.h3':     'Licitaciones de Obra Pública',
      'services.publica.p':      'Formatos adaptados a los requerimientos de la Administración, cumpliendo estrictamente con los pliegos de condiciones y formatos BC3 estandarizados.',
      'services.fontaneria.h3':  'Instalaciones Técnicas (Mep)',
      'services.fontaneria.p':   'Especialistas en Electricidad, <strong>Fontanería</strong>, Saneamiento y <strong>PCI</strong> (Protección Contra Incendios). Cumplimiento riguroso de normativas (REBT, CTE, RSCIEI).',
      'services.albanileria.h3': 'Oficios Especializados',
      'services.albanileria.p':  'Mediciones minuciosas para <strong>Albañilería</strong>, Carpintería (madera y metálica), Cristalería, Aluminio y Acero. Ni un solo herraje queda sin cuantificar.',
      'services.methodology.h3': '¿Qué incluye cada uno de nuestros presupuestos?',
      'services.methodology.1':  '<strong>Cuantificación de unidades de materiales y precios:</strong> PVP y NETO actualizado a precios reales del mercado actual.',
      'services.methodology.2':  '<strong>Posibilidad de modificar mermas</strong>, variaciones de IPC, GG, BI, y otros elementos.',
      'services.methodology.3':  '<strong>Desglose (o descompuesto) técnico:</strong> Precio por unidad de ejecución incluyendo mano de obra y materiales.',
      'services.methodology.4':  '<strong>Ficha técnica para el cliente:</strong> Descripción de los trabajos realizados y precio final.',
      'services.methodology.5':  '<strong>Entrega final en diferentes formatos:</strong> Excel, BC3, PDF.',
      'services.methodology.6':  '<strong>Soporte post-venta:</strong> Si necesitas que modifiquemos algo para hacer más ajustes, lo hacemos.',
      'services.cta':            'Consulta nuestros ejemplos',

      /* NOSOTROS PAGE */
      'nosotros.h2':      'Más que números: Arquitectura al servicio de tu rentabilidad.',
      'nosotros.sub':     'Pr3cise no es una gestoría de presupuestos; somos una firma de arquitectura técnica y superior con décadas de experiencia en el sector de la edificación en Europa. Entendemos que un presupuesto mal calculado es una obra que nace muerta.',
      'nosotros.p1':      'Nuestro equipo está formado por arquitectos técnicos y superiores, ingenieros de instalaciones y especialistas en gestión de proyectos con una trayectoria consolidada en el sector de la edificación. Combinamos la precisión técnica con una visión estratégica del coste que convierte cada presupuesto en una herramienta real de toma de decisiones, no en un simple listado de partidas.',
      'nosotros.p2':      'Trabajamos bajo los estándares internacionales de gestión de proyectos (PMBOK, IPMA) y las normativas técnicas españolas vigentes (CTE, RITE, RSCIEI, REBT), garantizando que cada partida refleje la realidad constructiva con total rigor. Cuando entregamos un presupuesto, entregamos una línea base de coste autorizada, trazable y defendible ante cualquier cliente, administración o auditoría.',
      'nosotros.1.h':     'Experiencia Real en Obra',
      'nosotros.1.p':     'Sabemos cómo se construye, por eso sabemos qué hay que presupuestar. Evitamos los "olvidos" que destrozan tus márgenes.',
      'nosotros.2.h':     'Especialización Técnica',
      'nosotros.2.p':     'Dominamos la normativa técnica (CTE, RITE, RSCIEI) para que cada partida de fontanería, PCI o albañilería cumpla con la ley y con la realidad de ejecución.',
      'nosotros.3.h':     'Compromiso Pr3cise',
      'nosotros.3.p':     'Llevamos años ofreciendo un servicio de calidad basado en la transparencia y la rapidez. Tu éxito es nuestra métrica de crecimiento.',
      'nosotros.cta':    'Ver nuestros servicios',

      /* EJEMPLOS PAGE */
      'ejemplos.h2':     'Presupuestos con Inteligencia de Obra: El estándar Pr3cise',
      'ejemplos.sub':    'No entregamos simples listados de precios. Entregamos herramientas de gestión para tu obra.',
      'ejemplos.1.h':    '1. CONTROL DE MERMAS Y DESPERDICIOS',
      'ejemplos.1.p':    'Calculamos el coeficiente de paso y mermas reales por material (cerámicos, áridos, acero). Evita roturas de stock y sobrecostes ocultos en la compra.',
      'ejemplos.2.h':    '2. GASTOS GENERALES (GG) Y BENEFICIO INDUSTRIAL (BI)',
      'ejemplos.2.p':    'Análisis pormenorizado de costes indirectos. Estructuramos el <span class="highlight-gold">13% de GG y el 6% de BI</span> (o personalizados) para que tu margen sea real y defendible ante cualquier auditoría o cliente.',
      'ejemplos.3.h':    '3. PARTIDAS REGULABLES Y PRECIOS DE MERCADO 2026',
      'ejemplos.3.p':    'Conexión con bases de datos actualizadas mensualmente. Ajustamos los precios según la volatilidad de materias primas y mano de obra actual.',
      'ejemplos.4.h':    '4. MEDICIONES GEOMÉTRICAS Y DESGLOSES',
      'ejemplos.4.p':    'Cada partida incluye su medición detallada. Transparencia total para certificaciones de obra rápidas y sin conflictos con la dirección facultativa.',
      'ejemplos.cta':   'Contacta con nosotros',

      /* CONTACTO PAGE */
      'contacto.h2':      'Contáctanos y optimiza tu rentabilidad',
      'contacto.sub':     'Cuéntanos tu proyecto y te respondemos en menos de 24 horas. Sin compromiso.',
      'contacto.lbl.nombre': 'Nombre',
      'contacto.lbl.empresa': 'Empresa',
      'contacto.lbl.email': 'Email',
      'contacto.lbl.telefono': 'Teléfono',
      'contacto.lbl.proyecto': 'Tipo de Proyecto',
      'contacto.lbl.mensaje': 'Mensaje',
      'contacto.opt.default': 'Selecciona tipo de proyecto',
      'contacto.opt.construccion': 'Instalaciones eléctricas',
      'contacto.opt.pci': 'PCI (Protección Contra Incendios)',
      'contacto.opt.fontaneria': 'Fontanería',
      'contacto.opt.albanileria': 'Albañilería',
      'contacto.opt.carpinteria': 'Carpintería',
      'contacto.captcha': 'Verificación · Nivela la burbuja para habilitar el envío',
      'contacto.submit': 'Enviar Mensaje',
      'contacto.sent': 'Mensaje enviado correctamente. Te contactaremos pronto.',
      'contacto.error': 'Error al enviar. Por favor, inténtalo de nuevo.',

      /* CONTACT-PAGE FAQ */
      'cfaq.h2':   'Preguntas Frecuentes',
      'cfaq.sub':  'Todo lo que necesitas saber antes de solicitar tu presupuesto. Si tienes más dudas, escríbenos.',
      'cfaq.1.q':  '¿Cuánto tiempo tardáis en entregar un presupuesto?',
      'cfaq.1.a':  'El plazo estándar es de <strong>72 horas</strong> desde que recibimos la documentación completa del proyecto (planos, memorias, especificaciones). Para proyectos de mayor complejidad o volumen, acordamos un plazo personalizado antes de comenzar.',
      'cfaq.2.q':  '¿Qué documentación necesitáis para elaborar el presupuesto?',
      'cfaq.2.a':  'Con los planos en formato PDF o DWG y la memoria descriptiva es suficiente para comenzar. Si dispones de mediciones previas o pliegos de condiciones, también los incorporamos. Cuanta más información nos aportes, mayor será la precisión del resultado.',
      'cfaq.3.q':  '¿El servicio tiene algún coste inicial?',
      'cfaq.3.a':  'La consulta inicial y el análisis de viabilidad son <strong>gratuitos y sin compromiso</strong>. El presupuesto del servicio se facilita antes de iniciar cualquier trabajo, para que puedas tomar la decisión con total transparencia. No hay costes ocultos.',
      'cfaq.4.q':  '¿En qué formatos entregáis el presupuesto final?',
      'cfaq.4.a':  'Entregamos el presupuesto en <strong>Excel, PDF y BC3</strong> de forma estándar. El formato BC3 es compatible con los principales programas de gestión de obra (Presto, TCQ, Arquímedes). Si necesitas un formato específico para tu licitación o cliente, consúltanos.',
      'cfaq.5.q':  '¿Podéis modificar el presupuesto si cambia el proyecto?',
      'cfaq.5.a':  'Sí. Incluimos una ronda de revisiones dentro del servicio para ajustar partidas, cambiar especificaciones o actualizar precios. Si el cambio implica una modificación sustancial del alcance, lo evaluamos y presupuestamos conjuntamente.',
      'cfaq.6.q':  '¿Trabajáis con empresas de toda España o solo de una zona?',
      'cfaq.6.a':  'Trabajamos de forma <strong>100% remota</strong> con constructoras, promotoras y estudios de toda España y Europa. No tenemos limitación geográfica: toda la documentación se intercambia digitalmente, lo que nos permite garantizar el mismo nivel de servicio sin importar dónde esté tu proyecto.',
      'cfaq.7.q':  '¿Podéis presupuestar instalaciones especializadas (eléctrica, PCI, fontanería)?',
      'cfaq.7.a':  'Sí, es una de nuestras especialidades. Realizamos desgloses completos de instalaciones eléctricas (REBT), PCI (RSCIEI), fontanería y saneamiento (CTE-HS), y climatización (RITE). Cada partida se presupuesta cumpliendo la normativa técnica vigente, con materiales y mano de obra diferenciados.',
      'cfaq.8.q':  '¿Los precios están actualizados con el mercado actual?',
      'cfaq.8.a':  'Siempre. Utilizamos bases de datos de precios actualizadas mensualmente y contrastadas con precios reales de proveedores y fabricantes. Tanto el PVP como el precio NETO de cada material quedan reflejados, para que puedas calcular tu margen real antes de presentar la oferta.',

      /* PRICING PAGE */
      'pricing.h2':      'Inversión clara, sin sorpresas.',
      'pricing.basic.h3': 'Tarjeta Básica',
      'pricing.basic.p': 'Desde 300€ <span class="tax">+ impuestos por presupuesto.</span>',
      'pricing.basic.delivery': 'Entrega garantizada en 72h.',
      'pricing.business.h3': 'Tarjeta Business (Paquetes Recurrentes)',
      'pricing.business.p': 'Optimiza tu coste por presupuesto externalizando tu departamento de mediciones con nosotros.',
      'pricing.business.volume': 'Para empresas con volumen mensual.',
      'pricing.disclaimer': 'Nuestros presupuestos no son simples ofertas comerciales; son Líneas Base de Coste según estándares PMBOK, listas para ser usadas como herramienta de control durante toda la ejecución de la obra.',

      /* CTA FINAL */
      'cta.h2': 'Asegura la Rentabilidad de tu Próximo Proyecto Hoy Mismo',
      'cta.p':  'Un presupuesto preciso es el primer cimiento de una obra exitosa. Habla con nuestros estimadores expertos y descubre cómo podemos proteger la inversión de tu proyecto.',
      'cta.btn':'Contactar a un Estimador de Costes',

      /* FOOTER */
      'footer.brand':      'Oficina Técnica de Presupuestación especializada en la elaboración de presupuestos de alta precisión para el sector de la edificación.',
      'footer.services.h': 'Servicios Destacados',
      'footer.svc.1':      'Estimación de costes construcción',
      'footer.svc.2':      'Elaboración de presupuestos fontanería',
      'footer.svc.3':      'Presupuestos instalaciones PCI',
      'footer.svc.4':      'Cálculo de costes albañilería',
      'footer.contact.h':  'Contacto Rápido',
      'footer.wa':         'Contactar por WhatsApp',
      'footer.legal.h':    'Información Legal',
      'footer.legal.1':    'Aviso Legal',
      'footer.legal.2':    'Política de Privacidad',
      'footer.legal.3':    'Política de Cookies',
      /* 2025-04-25 21:00 | Added Términos y Condiciones link + legal page title */
      'footer.legal.4':    'Términos y Condiciones',
      'legal.title':       'Información Legal',
    },

    en: {
      /* NAV */
      'nav.about':    'About Us',
      'nav.services': 'Services',
      'nav.examples': 'Portfolio',
      'nav.contact':  'Contact',

      /* HERO */
      /* 2025-04-25 23:55 | New slogan and subtitle */
      /* 2025-04-26 00:00 | Added HTML highlights + precision animation target */
      'hero.h1':     'The <span class="hero-highlight hero-precision">precision</span> that defines your company.',
      /* 2025-04-26 00:45 | HTML highlights on mobile hero keys */
      'hero.h1.mob': 'The <span class="hero-highlight hero-precision">precision</span> that defines your company.',
      'hero.p.mob':  "Don't let a <span class='hero-highlight'>poor budget</span> ruin your project. We optimise your <span class='hero-highlight'>costs</span> to maximise your profit.",
      'hero.p':      "Don't let an <span class='hero-highlight'>inflated or deficient budget</span> ruin a good project. We optimise your <span class='hero-highlight'>costs</span> to avoid immediate rejection and <span class='hero-highlight'>maximise your profit</span>.",
      'hero.cta': 'Request a Free Quote',

      /* PROBLEM */
      'prob.h2':    'Are cost overruns eating into your project margins?',
      'prob.p1':    '<strong>70% of construction projects</strong> exceed their initial budget. Inaccurate cost estimation not only delays project delivery, it slashes your profitability and creates tension with investors.',
      'prob.p2':    "Don't leave your margins to chance. Rigorous financial planning is the difference between a successful project and a million-euro loss.",
      'prob.stat1': 'Projects with cost overruns',
      'prob.stat2': 'Average budget deviation',
      'prob.stat3': 'ROI of precise estimation',

      /* FLOOR PLAN */
      'ri.label':      'Real-time budget',
      'ri.title':      'Your project, line by line',
      'ri.total.label':'accumulated budget',
      'ri.scroll':     '↓ scroll to explore ↓',
      'ri.slider.label': 'DRAG · BUDGET CONTROL',
      'ri.room.salon': 'LIVING / DINING ROOM',
      'ri.room.cocina':'KITCHEN',
      'ri.room.bano':  'BATHROOM',
      'ri.room.dorm1': 'BEDROOM 1',
      'ri.room.dorm2': 'BEDROOM 2',
      'ri.scale':      'SCALE 1:50 · 85 m² · GROUND FLOOR',
      /* Legend */
      'ri.leg.p': 'Plumbing / HVAC',
      'ri.leg.e': 'Electrical',
      'ri.leg.w': 'Windows',
      'ri.leg.d': 'Doors',
      /* Summary bar */
      'ri.sum.p':     'Plumbing / HVAC',
      'ri.sum.e':     'Electrical',
      'ri.sum.w':     'Windows',
      'ri.sum.d':     'Doors',
      'ri.sum.total': 'Total renovation',
      /* Phase labels (used by inline JS) */
      'phase.p': '01 · PLUMBING / HVAC',
      'phase.e': '02 · ELECTRICAL',
      'phase.w': '03 · WINDOWS',
      'phase.d': '04 · DOORS',
      /* Price tag names */
      'tag.p0.name': 'plumbing · kitchen',
      'tag.p0.desc': 'Sink + dishwasher + washing machine',
      'tag.p1.name': 'plumbing · bathroom',
      'tag.p1.desc': 'Shower, WC, basin + full pipework',
      'tag.p2.name': 'HVAC',
      'tag.p2.desc': '4× splits + ducts + installation',
      'tag.e0.name': 'electrical · panel',
      'tag.e0.desc': 'MCB + 9 protected circuits',
      'tag.e1.name': 'electrical · lighting',
      'tag.e1.desc': 'LED light points throughout',
      'tag.e2.name': 'electrical · sockets',
      'tag.e2.desc': '24 power outlets',
      'tag.w0.name': 'windows · living room',
      'tag.w0.desc': '2× PVC double glazing',
      'tag.w1.name': 'windows · bedrooms',
      'tag.w1.desc': '3× window + roller blind',
      'tag.w2.name': 'windows · kitchen',
      'tag.w2.desc': 'Sliding with mosquito screen',
      'tag.d0.name': 'doors · entrance',
      'tag.d0.desc': 'Security class 3 + deadbolt',
      'tag.d1.name': 'doors · interior',
      'tag.d1.desc': '4× white lacquered door',

      /* PROCESS */
      'proc.h2':  'Our Cost Estimation Process',
      'proc.sub': 'Four battle-tested phases designed to guarantee maximum precision and financial viability from day one.',
      'proc.1.h': 'Conceptual Feasibility',
      'proc.1.p': 'We analyse drawings, specifications and technical documents to build a solid financial foundation before the final design.',
      'proc.2.h': 'Measurement & Takeoffs',
      'proc.2.p': 'Precise quantification of every line item — materials, labour and equipment — with no unit left unaccounted for, using BIM methodology.',
      'proc.3.h': 'Value Engineering',
      'proc.3.p': 'We apply up-to-date market prices and optimise resources to reduce costs without compromising quality or compliance.',
      'proc.4.h': 'Delivery & Tendering',
      'proc.4.p': 'You receive the budget in BC3/Excel/PDF, ready to present to clients, tender or audit — with overheads, profit and waste fully itemised.',

      /* FAQ */
      'faq.h2':    'Frequently Asked Questions About Cost Estimators',
      'faq.intro': 'Everything you need to know before outsourcing your construction cost estimation.',
      'faq.1.q':   'Why hire an external cost estimation firm?',
      'faq.1.a':   'Outsourcing to a <em>cost estimator</em> brings objectivity, eliminates internal errors from workload pressure, guarantees use of up-to-date price databases, and frees your technical team to focus on execution and site supervision.',
      'faq.2.q':   'What types of construction projects do you budget for?',
      'faq.2.a':   'We produce comprehensive estimates for residential buildings, commercial projects, industrial warehouses and civil works. We adapt our metrics to the structure type and finishes required.',
      'faq.3.q':   'How accurate are your construction budgets?',
      'faq.3.a':   'We work to the lowest error margins in the industry, combining digital measurement technology (BIM) and manual validation by experienced civil engineers.',

      /* SERVICES PAGE */
      'services.h2':      'Sectors of Operation and Specialties',
      'services.sub':     'We prepare high-precision budgets adapted to the specific needs of each discipline.',
      'services.construccion.h3': 'Residential Housing and Building Projects',
      'services.construccion.p':  'Complete breakdowns from earthworks to finishes, ensuring your real estate development or single-family home suffers no deviations.',
      'services.publica.h3':     'Public Works Tenders',
      'services.publica.p':      'Formats adapted to Administration requirements, strictly complying with tender specifications and standardised BC3 formats.',
      'services.fontaneria.h3':  'Technical Installations (MEP)',
      'services.fontaneria.p':   'Specialists in Electrical, <strong>Plumbing</strong>, Sanitation and <strong>Fire Protection</strong>. Rigorous compliance with regulations (REBT, CTE, RSCIEI).',
      'services.albanileria.h3': 'Specialised Trades',
      'services.albanileria.p':  'Meticulous measurements for <strong>Masonry</strong>, Carpentry (wood and metal), Glazing, Aluminium and Steel. Not a single fitting goes unquantified.',
      'services.methodology.h3': 'What does each of our budgets include?',
      'services.methodology.1':  '<strong>Quantification of material units and prices:</strong> RRP and NET updated to current real market prices.',
      'services.methodology.2':  '<strong>Ability to modify waste</strong>, CPI variations, overheads, profit, and other elements.',
      'services.methodology.3':  '<strong>Technical breakdown:</strong> Price per execution unit including labour and materials.',
      'services.methodology.4':  '<strong>Technical sheet for the client:</strong> Description of work performed and final price.',
      'services.methodology.5':  '<strong>Final delivery in different formats:</strong> Excel, BC3, PDF.',
      'services.methodology.6':  '<strong>After-sales support:</strong> If you need us to make adjustments, we do it.',
      'services.cta':            'View our portfolio',

      /* NOSOTROS PAGE */
      'nosotros.h2':      'More than numbers: Architecture at the service of your profitability.',
      'nosotros.sub':     'Pr3cise is not a budgeting service; we are a technical and higher architecture firm with decades of experience in the European construction sector. We understand that a poorly calculated budget is a project that is born dead.',
      'nosotros.p1':      'Our team consists of technical and higher architects, installation engineers and project management specialists with a proven track record in the construction sector. We combine technical precision with a strategic vision of cost that turns each budget into a real decision-making tool, not just a list of line items.',
      'nosotros.p2':      'We work under international project management standards (PMBOK, IPMA) and current Spanish technical regulations (CTE, RITE, RSCIEI, REBT), guaranteeing that each item reflects construction reality with total rigour. When we deliver a budget, we deliver an authorised, traceable and defensible cost baseline before any client, administration or audit.',
      'nosotros.1.h':     'Real On-Site Experience',
      'nosotros.1.p':     'We know how it is built, so we know what needs to be budgeted. We avoid the "oversights" that destroy your margins.',
      'nosotros.2.h':     'Technical Specialisation',
      'nosotros.2.p':     'We master technical regulations (CTE, RITE, RSCIEI) so that each plumbing, fire protection or masonry item complies with the law and execution reality.',
      'nosotros.3.h':     'Pr3cise Commitment',
      'nosotros.3.p':     'We have been offering a quality service based on transparency and speed for years. Your success is our growth metric.',
      'nosotros.cta':    'View our services',

      /* EJEMPLOS PAGE */
      'ejemplos.h2':     'Budgets with Site Intelligence: The Pr3cise Standard',
      'ejemplos.sub':    'We don\'t deliver simple price lists. We deliver management tools for your project.',
      'ejemplos.1.h':    '1. WASTE AND LOSS CONTROL',
      'ejemplos.1.p':    'We calculate real pass coefficient and waste per material (ceramics, aggregates, steel). Avoid stock shortages and hidden overcosts in purchasing.',
      'ejemplos.2.h':    '2. GENERAL EXPENSES (GE) AND INDUSTRIAL PROFIT (IP)',
      'ejemplos.2.p':    'Detailed analysis of indirect costs. We structure the <span class="highlight-gold">13% GE and 6% IP</span> (or customised) so your margin is real and defensible before any audit or client.',
      'ejemplos.3.h':    '3. REGULATED ITEMS AND 2026 MARKET PRICES',
      'ejemplos.3.p':    'Connection with databases updated monthly. We adjust prices according to raw material and current labour volatility.',
      'ejemplos.4.h':    '4. GEOMETRIC MEASUREMENTS AND BREAKDOWNS',
      'ejemplos.4.p':    'Each item includes its detailed measurement. Total transparency for fast project certifications without conflicts with project management.',
      'ejemplos.cta':   'Contact us',

      /* CONTACTO PAGE */
      'contacto.h2':      'Contact us and optimise your profitability',
      'contacto.sub':     'Tell us about your project and we will respond within 24 hours. No obligation.',
      'contacto.lbl.nombre': 'Name',
      'contacto.lbl.empresa': 'Company',
      'contacto.lbl.email': 'Email',
      'contacto.lbl.telefono': 'Phone',
      'contacto.lbl.proyecto': 'Project Type',
      'contacto.lbl.mensaje': 'Message',
      'contacto.opt.default': 'Select project type',
      'contacto.opt.construccion': 'Electrical Installations',
      'contacto.opt.pci': 'Fire Protection (PCI)',
      'contacto.opt.fontaneria': 'Plumbing',
      'contacto.opt.albanileria': 'Masonry',
      'contacto.opt.carpinteria': 'Carpentry',
      'contacto.captcha': 'Verification · Level the bubble to enable sending',
      'contacto.submit': 'Send Message',
      'contacto.sent': 'Message sent successfully. We will contact you soon.',
      'contacto.error': 'Error sending. Please try again.',

      /* CONTACT-PAGE FAQ */
      'cfaq.h2':   'Frequently Asked Questions',
      'cfaq.sub':  'Everything you need to know before requesting your quote. If you have more questions, write to us.',
      'cfaq.1.q':  'How long does it take to deliver a budget?',
      'cfaq.1.a':  'The standard turnaround is <strong>72 hours</strong> from when we receive the full project documentation (drawings, reports, specifications). For more complex or larger projects, we agree on a personalised timeline before starting.',
      'cfaq.2.q':  'What documentation do you need to prepare the budget?',
      'cfaq.2.a':  'Drawings in PDF or DWG format and the project specification are sufficient to get started. If you have prior measurements or tender documents, we incorporate those too. The more information you provide, the greater the precision of the result.',
      'cfaq.3.q':  'Is there any upfront cost for the service?',
      'cfaq.3.a':  'The initial consultation and feasibility analysis are <strong>free and without obligation</strong>. The service quote is provided before any work begins, so you can make an informed decision with full transparency. No hidden fees.',
      'cfaq.4.q':  'In what formats do you deliver the final budget?',
      'cfaq.4.a':  'We deliver the budget in <strong>Excel, PDF and BC3</strong> as standard. BC3 format is compatible with the main project management software (Presto, TCQ, Arquímedes). If you need a specific format for your tender or client, just ask.',
      'cfaq.5.q':  'Can you modify the budget if the project changes?',
      'cfaq.5.a':  'Yes. We include a round of revisions within the service to adjust items, change specifications or update prices. If the change involves a substantial scope modification, we assess it and quote together.',
      'cfaq.6.q':  'Do you work with companies across Spain or only in one area?',
      'cfaq.6.a':  'We work <strong>100% remotely</strong> with contractors, developers and studios across Spain and Europe. We have no geographic limitation: all documentation is exchanged digitally, allowing us to guarantee the same level of service regardless of where your project is located.',
      'cfaq.7.q':  'Can you budget specialised installations (electrical, fire protection, plumbing)?',
      'cfaq.7.a':  'Yes, it is one of our specialties. We produce complete breakdowns for electrical installations (REBT), fire protection (RSCIEI), plumbing and sanitation (CTE-HS), and HVAC (RITE). Every item is budgeted in compliance with current technical regulations, with materials and labour itemised separately.',
      'cfaq.8.q':  'Are your prices up to date with the current market?',
      'cfaq.8.a':  'Always. We use pricing databases updated monthly and cross-referenced with real supplier and manufacturer prices. Both RRP and NET price for each material are included, so you can calculate your real margin before submitting your offer.',

      /* PRICING PAGE */
      'pricing.h2':      'Clear investment, no surprises.',
      'pricing.basic.h3': 'Basic Card',
      'pricing.basic.p': 'From 300€ <span class="tax">+ tax per budget.</span>',
      'pricing.basic.delivery': 'Guaranteed delivery in 72h.',
      'pricing.business.h3': 'Business Card (Recurring Packages)',
      'pricing.business.p': 'Optimise your cost per budget by outsourcing your measurement department to us.',
      'pricing.business.volume': 'For companies with monthly volume.',
      'pricing.disclaimer': 'Our budgets are not simple commercial offers; they are Cost Baselines according to PMBOK standards, ready to be used as a control tool throughout the entire project execution.',

      /* CTA FINAL */
      'cta.h2': "Secure Your Next Project's Profitability Today",
      'cta.p':  'A precise budget is the first cornerstone of a successful project. Talk to our expert estimators and discover how we can protect your project investment.',
      'cta.btn':'Contact a Cost Estimator',

      /* FOOTER */
      'footer.brand':      'Technical Estimation Office specialising in high-precision budgeting for the construction and building sector.',
      'footer.services.h': 'Featured Services',
      'footer.svc.1':      'Construction cost estimation',
      'footer.svc.2':      'Plumbing budget preparation',
      'footer.svc.3':      'Fire protection system budgets',
      'footer.svc.4':      'Masonry cost calculation',
      'footer.contact.h':  'Quick Contact',
      'footer.wa':         'Contact via WhatsApp',
      'footer.legal.h':    'Legal Information',
      'footer.legal.1':    'Legal Notice',
      'footer.legal.2':    'Privacy Policy',
      'footer.legal.3':    'Cookie Policy',
      /* 2025-04-25 21:00 | Added Terms & Conditions link + legal page title */
      'footer.legal.4':    'Terms and Conditions',
      'legal.title':       'Legal Information',
    },

    de: {
      'nav.about':    'Über uns',
      'nav.services': 'Leistungen',
      'nav.examples': 'Portfolio',
      'nav.contact':  'Kontakt',
      /* 2025-04-25 23:55 | New slogan and subtitle */
      /* 2025-04-26 00:00 | Added HTML highlights + precision animation target */
      'hero.h1':     'Die <span class="hero-highlight hero-precision">Präzision</span>, die Ihr Unternehmen definiert.',
      /* 2025-04-26 00:45 | HTML highlights on mobile hero keys */
      'hero.h1.mob': 'Die <span class="hero-highlight hero-precision">Präzision</span>, die Ihr Unternehmen definiert.',
      'hero.p.mob':  'Kein <span class="hero-highlight">schlechtes Budget</span> soll Ihr Projekt ruinieren. Wir optimieren Ihre <span class="hero-highlight">Kosten</span> für maximalen Gewinn.',
      'hero.p':      'Lassen Sie nicht zu, dass ein <span class="hero-highlight">überhöhtes oder unzureichendes Budget</span> ein gutes Projekt ruiniert. Wir optimieren Ihre <span class="hero-highlight">Kosten</span>, um eine sofortige Ablehnung zu vermeiden und Ihren <span class="hero-highlight">Gewinn zu maximieren</span>.',
      'hero.cta': 'Kostenloses Angebot anfordern',
      'prob.h2':    'Fressen Kostenüberschreitungen Ihre Projektmargen auf?',
      'prob.p1':    '<strong>70 % der Bauprojekte</strong> überschreiten ihr ursprüngliches Budget. Ungenaue Kostenschätzungen verzögern nicht nur die Ausführung, sie schmälern drastisch Ihre Rentabilität und erzeugen Spannungen mit Investoren.',
      'prob.p2':    'Überlassen Sie Ihre Margen nicht dem Zufall. Eine solide Finanzplanung entscheidet über Erfolg oder Millionenverlust.',
      'prob.stat1': 'Projekte mit Kostenüberschreitungen',
      'prob.stat2': 'Durchschnittliche Budgetabweichung',
      'prob.stat3': 'ROI präziser Kalkulation',
      'ri.label':      'Budget in Echtzeit',
      'ri.title':      'Ihr Projekt, Gewerk für Gewerk',
      'ri.total.label':'kumuliertes Budget',
      'ri.scroll':     '↓ scrollen zum Erkunden ↓',
      'ri.slider.label': 'ZIEHEN · KOSTENKONTROLLE',
      'ri.room.salon': 'WOHN- / ESSZIMMER',
      'ri.room.cocina':'KÜCHE',
      'ri.room.bano':  'BAD',
      'ri.room.dorm1': 'SCHLAFZIMMER 1',
      'ri.room.dorm2': 'SCHLAFZIMMER 2',
      'ri.scale':      'MAßSTAB 1:50 · 85 m² · ERDGESCHOSS',
      'ri.leg.p': 'Sanitär / HLK',    'ri.leg.e': 'Elektro',
      'ri.leg.w': 'Fenster',          'ri.leg.d': 'Türen',
      'ri.sum.p': 'Sanitär / HLK',    'ri.sum.e': 'Elektro',
      'ri.sum.w': 'Fenster',          'ri.sum.d': 'Türen',
      'ri.sum.total': 'Gesamtrenovierung',
      'phase.p': '01 · SANITÄR / HLK',
      'phase.e': '02 · ELEKTRO',
      'phase.w': '03 · FENSTER',
      'phase.d': '04 · TÜREN',
      'tag.p0.name': 'Sanitär · Küche',          'tag.p0.desc': 'Spüle + Spülmaschine + Waschmaschine',
      'tag.p1.name': 'Sanitär · Bad',             'tag.p1.desc': 'Dusche, WC, Waschbecken + Rohrleitungen',
      'tag.p2.name': 'Klimaanlage',               'tag.p2.desc': '4× Splits + Leitungen + Montage',
      'tag.e0.name': 'Elektro · Verteiler',       'tag.e0.desc': 'Sicherung + 9 geschützte Stromkreise',
      'tag.e1.name': 'Elektro · Beleuchtung',     'tag.e1.desc': 'LED-Lichtpunkte in der gesamten Wohnung',
      'tag.e2.name': 'Elektro · Steckdosen',      'tag.e2.desc': '24 Steckdosen',
      'tag.w0.name': 'Fenster · Wohnzimmer',      'tag.w0.desc': '2× PVC-Doppelverglasung',
      'tag.w1.name': 'Fenster · Schlafzimmer',    'tag.w1.desc': '3× Fenster + Rollladenkasten',
      'tag.w2.name': 'Fenster · Küche',           'tag.w2.desc': 'Schiebetür mit Fliegengitter',
      'tag.d0.name': 'Türen · Eingang',           'tag.d0.desc': 'Sicherheitstür Klasse 3 + Schloss',
      'tag.d1.name': 'Türen · Innen',             'tag.d1.desc': '4× weiß lackierte Innentür',
      'proc.h2':  'Unser Kostenschätzungsprozess',
      'proc.sub': 'Vier bewährte Phasen für maximale Präzision und finanzielle Tragfähigkeit von Anfang an.',
      'proc.1.h': 'Konzeptionelle Machbarkeit',
      'proc.1.p': 'Wir analysieren Pläne, Leistungsbeschreibungen und technische Unterlagen, um vor dem endgültigen Entwurf eine solide finanzielle Basis zu schaffen.',
      'proc.2.h': 'Aufmaß und Mengenermittlung',
      'proc.2.p': 'Genaue Quantifizierung aller Positionen — Materialien, Arbeit und Ausrüstung — nach BIM-Methodik, ohne eine einzige Einheit zu übersehen.',
      'proc.3.h': 'Value Engineering',
      'proc.3.p': 'Wir wenden aktuelle Marktpreise an und optimieren Ressourcen, um Kosten zu senken, ohne Qualität oder Vorschriften zu beeinträchtigen.',
      'proc.4.h': 'Übergabe und Ausschreibung',
      'proc.4.p': 'Sie erhalten das Budget in BC3/Excel/PDF, bereit zur Vorlage bei Kunden, Ausschreibung oder Prüfung — mit vollständig aufgeschlüsselten Gemeinkosten und Verlusten.',
      'faq.h2':    'Häufig gestellte Fragen zu Kostenschätzern',
      'faq.intro': 'Alles, was Sie wissen müssen, bevor Sie Ihre Baukostenschätzung auslagern.',
      'faq.1.q':   'Warum ein externes Kostenschätzungsunternehmen beauftragen?',
      'faq.1.a':   'Die Auslagerung an einen <em>Cost Estimator</em> bringt Objektivität, eliminiert interne Fehler durch Arbeitsüberlastung, garantiert aktuelle Preisdatenbanken und entlastet Ihr technisches Team.',
      'faq.2.q':   'Für welche Bauprojekte erstellen Sie Kostenvoranschläge?',
      'faq.2.a':   'Wir erstellen umfassende Schätzungen für Wohngebäude, Gewerbeprojekte, Industriehallen und Tiefbau. Wir passen unsere Metriken an Struktur und Ausbaustandard an.',
      'faq.3.q':   'Wie präzise sind Ihre Baukostenvoranschläge?',
      'faq.3.a':   'Wir arbeiten mit den niedrigsten Fehlerquoten der Branche, kombiniert aus digitaler Messtechnologie (BIM) und manueller Validierung durch erfahrene Bauingenieure.',

      /* SERVICES PAGE */
      'services.h2':      'Einsatzbereiche und Spezialisierungen',
      'services.sub':     'Wir erstellen hochpräzise Budgets, angepasst an die spezifischen Anforderungen jeder Disziplin.',
      'services.construccion.h3': 'Wohnbauprojekte und Wohnbebau',
      'services.construccion.p':  'Vollständige Aufschlüsselungen von Erdarbeiten bis zu den Fertigstellungsarbeiten, damit Ihr Immobilienprojekt oder Einfamilienhaus keine Abweichungen erleidet.',
      'services.publica.h3':     'Ausschreibungen öffentlicher Bauvorhaben',
      'services.publica.p':      'Formate angepasst an Verwaltungsanforderungen, strikte Einhaltung der Ausschreibungsbedingungen und standardisierte BC3-Formate.',
      'services.fontaneria.h3':  'Technische Anlagen (MEP)',
      'services.fontaneria.p':   'Spezialisten für Elektro, <strong>Sanitär</strong>, Entwässerung und <strong>Brandschutz</strong>. Strenge Einhaltung der Vorschriften (REBT, CTE, RSCIEI).',
      'services.albanileria.h3': 'Spezialgewerke',
      'services.albanileria.p':  'Sorgfältige Aufmaße für <strong>Mauerwerk</strong>, Tischlerei (Holz und Metall), Verglasung, Aluminium und Stahl. Kein einziges Beschlägteil bleibt unquantifiziert.',
      'services.methodology.h3': 'Was beinhaltet jedes unserer Budgets?',
      'services.methodology.1':  '<strong>Quantifizierung von Materialeinheiten und Preisen:</strong> UVP und NETTO aktualisiert auf aktuelle reale Marktpreise.',
      'services.methodology.2':  '<strong>Möglichkeit zur Anpassung von Schwund</strong>, IPC-Variationen, Gemeinkosten, Gewinn und anderen Elementen.',
      'services.methodology.3':  '<strong>Technische Aufschlüsselung:</strong> Preis pro Ausführungseinheit inklusive Arbeitskraft und Materialien.',
      'services.methodology.4':  '<strong>Technisches Datenblatt für den Kunden:</strong> Beschreibung der ausgeführten Arbeiten und Endpreis.',
      'services.methodology.5':  '<strong>Endlieferung in verschiedenen Formaten:</strong> Excel, BC3, PDF.',
      'services.methodology.6':  '<strong>Kundendienst nach dem Verkauf:</strong> Wenn Sie Anpassungen benötigen, führen wir diese durch.',
      'services.cta':            'Portfolio ansehen',

      /* NOSOTROS PAGE */
      'nosotros.h2':      'Mehr als Zahlen: Architektur im Dienst Ihrer Rentabilität.',
      'nosotros.sub':     'Pr3cise ist kein Budgetierungsservice; wir sind ein technisches und höheres Architekturbüro mit Jahrzehnten der Erfahrung im europäischen Baugewerbe. Wir verstehen, dass ein schlecht kalkuliertes Budget ein Projekt ist, das tot geboren wird.',
      'nosotros.p1':      'Unser Team besteht aus technischen und höheren Architekten, Anlagenbauingenieuren und Projektmanagement-Spezialisten mit einer fundierten Laufbahn im Bausektor. Wir kombinieren technische Präzision mit einer strategischen Kostenperspektive, die jedes Budget zu einem echten Entscheidungsinstrument macht, nicht zu einer einfachen Aufstellung von Positionen.',
      'nosotros.p2':      'Wir arbeiten nach internationalen Projektmanagement-Standards (PMBOK, IPMA) und den geltenden spanischen technischen Vorschriften (CTE, RITE, RSCIEI, REBT) und garantieren, dass jede Position die Baurealität mit voller Strenge widerspiegelt. Wenn wir ein Budget liefern, liefern wir eine autorisierte, nachvollziehbare und verteidigungsfähige Kostenbasis gegenüber jedem Kunden, jeder Verwaltung und jedem Audit.',
      'nosotros.1.h':     'Echte Baustellenerfahrung',
      'nosotros.1.p':     'Wir wissen, wie gebaut wird, daher wissen wir, was budgetiert werden muss. Wir vermeiden die "Vergesslichkeiten", die Ihre Margen zerstören.',
      'nosotros.2.h':     'Technische Spezialisierung',
      'nosotros.2.p':     'Wir beherrschen die technischen Vorschriften (CTE, RITE, RSCIEI), damit jede Sanitär-, Brandschutz- oder Mauerwerksposition dem Gesetz und der Ausführungsrealität entspricht.',
      'nosotros.3.h':     'Pr3cise-Engagement',
      'nosotros.3.p':     'Wir bieten seit Jahren einen qualitativ hochwertigen Service basierend auf Transparenz und Geschwindigkeit. Ihr Erfolg ist unsere Wachstumsmetrik.',
      'nosotros.cta':    'Unsere Leistungen ansehen',

      /* EJEMPLOS PAGE */
      'ejemplos.h2':     'Budgets mit Baustellen-Intelligenz: Der Pr3cise-Standard',
      'ejemplos.sub':    'Wir liefern keine einfachen Preislisten. Wir liefern Management-Tools für Ihr Projekt.',
      'ejemplos.1.h':    '1. VERSCHWENDUNG- UND VERLUSTKONTROLLE',
      'ejemplos.1.p':    'Wir berechnen den echten Passkoeffizienten und Verlust pro Material (Keramik, Zuschlagstoffe, Stahl). Vermeiden Sie Lagerengpässe und versteckte Überkosten beim Einkauf.',
      'ejemplos.2.h':    '2. ALLGEMEINE KOSTEN (AK) UND INDUSTRIELLE GEWINN (IG)',
      'ejemplos.2.p':    'Detaillierte Analyse indirekter Kosten. Wir strukturieren die <span class="highlight-gold">13 % AK und 6 % IG</span> (oder angepasst), damit Ihre Marge echt und gegenüber jeder Prüfung oder jedem Kunden verteidigungsfähig ist.',
      'ejemplos.3.h':    '3. REGELBARE POSTEN UND MARKTPREISE 2026',
      'ejemplos.3.p':    'Verbindung mit monatlich aktualisierten Datenbanken. Wir passen die Preise an die Volatilität von Rohstoffen und aktueller Arbeitskraft an.',
      'ejemplos.4.h':    '4. GEOMETRISCHE AUFMAßE UND AUFTEILUNGEN',
      'ejemplos.4.p':    'Jeder Posten enthält sein detailliertes Aufmaß. Volle Transparenz für schnelle Abnahmen ohne Konflikte mit der Bauleitung.',
      'nosotros.cta':    'Unsere Leistungen ansehen',

      /* CONTACTO PAGE */
      'contacto.h2':      'Kontaktieren Sie uns und optimieren Sie Ihre Rentabilität',
      'contacto.sub':     'Erzählen Sie uns von Ihrem Projekt und wir antworten innerhalb von 24 Stunden. Keine Verpflichtung.',
      'contacto.lbl.nombre': 'Name',
      'contacto.lbl.empresa': 'Unternehmen',
      'contacto.lbl.email': 'E-Mail',
      'contacto.lbl.telefono': 'Telefon',
      'contacto.lbl.proyecto': 'Projektart',
      'contacto.lbl.mensaje': 'Nachricht',
      'contacto.opt.default': 'Projektart auswählen',
      'contacto.opt.construccion': 'Elektroanlagen',
      'contacto.opt.pci': 'Brandschutz (PCI)',
      'contacto.opt.fontaneria': 'Sanitär',
      'contacto.opt.albanileria': 'Mauerwerk',
      'contacto.opt.carpinteria': 'Tischlerei',
      'contacto.captcha': 'Verifizierung · Nivellieren Sie die Blase, um das Senden zu aktivieren',
      'contacto.submit': 'Nachricht senden',
      'contacto.sent': 'Nachricht erfolgreich gesendet. Wir werden Sie bald kontaktieren.',
      'contacto.error': 'Fehler beim Senden. Bitte versuchen Sie es erneut.',

      /* CONTACT-PAGE FAQ */
      'cfaq.h2':   'Häufig gestellte Fragen',
      'cfaq.sub':  'Alles, was Sie wissen müssen, bevor Sie Ihr Angebot anfordern. Bei weiteren Fragen schreiben Sie uns.',
      'cfaq.1.q':  'Wie lange dauert die Lieferung eines Kostenvoranschlags?',
      'cfaq.1.a':  'Die Standardlieferzeit beträgt <strong>72 Stunden</strong> ab Eingang der vollständigen Projektunterlagen (Pläne, Berichte, Spezifikationen). Bei komplexeren oder größeren Projekten vereinbaren wir vor Beginn eine individuelle Frist.',
      'cfaq.2.q':  'Welche Unterlagen benötigen Sie für die Kostenschätzung?',
      'cfaq.2.a':  'Pläne im PDF- oder DWG-Format und die Projektbeschreibung reichen für den Start aus. Falls Ihnen Vorvermessungen oder Ausschreibungsunterlagen vorliegen, beziehen wir diese ebenfalls ein. Je mehr Informationen Sie bereitstellen, desto präziser das Ergebnis.',
      'cfaq.3.q':  'Entstehen vorab Kosten für den Service?',
      'cfaq.3.a':  'Die Erstberatung und Machbarkeitsanalyse sind <strong>kostenlos und unverbindlich</strong>. Das Serviceangebot wird vor Beginn jeglicher Arbeiten bereitgestellt, damit Sie Ihre Entscheidung in voller Transparenz treffen können. Keine versteckten Kosten.',
      'cfaq.4.q':  'In welchen Formaten wird das endgültige Budget geliefert?',
      'cfaq.4.a':  'Wir liefern das Budget standardmäßig in den Formaten <strong>Excel, PDF und BC3</strong>. Das BC3-Format ist mit den gängigen Baumanagementsoftwareprogrammen (Presto, TCQ, Arquímedes) kompatibel. Bei Bedarf an einem spezifischen Format für Ihre Ausschreibung oder Ihren Kunden, fragen Sie uns.',
      'cfaq.5.q':  'Können Sie das Budget anpassen, wenn sich das Projekt ändert?',
      'cfaq.5.a':  'Ja. Wir schließen eine Überarbeitungsrunde in den Service ein, um Positionen anzupassen, Spezifikationen zu ändern oder Preise zu aktualisieren. Bei wesentlichen Umfangsänderungen bewerten und kalkulieren wir diese gemeinsam.',
      'cfaq.6.q':  'Arbeiten Sie mit Unternehmen aus ganz Spanien oder nur in einer Region?',
      'cfaq.6.a':  'Wir arbeiten <strong>100% remote</strong> mit Bauunternehmen, Entwicklern und Büros aus ganz Spanien und Europa. Keine geografische Einschränkung: Die gesamte Dokumentation wird digital ausgetauscht, sodass wir dasselbe Serviceniveau unabhängig vom Projektstandort gewährleisten.',
      'cfaq.7.q':  'Können Sie spezialisierte Installationen (Elektro, Brandschutz, Sanitär) kalkulieren?',
      'cfaq.7.a':  'Ja, das ist eine unserer Spezialitäten. Wir erstellen vollständige Aufschlüsselungen für Elektroanlagen (REBT), Brandschutz (RSCIEI), Sanitär und Entwässerung (CTE-HS) sowie HLK (RITE). Jede Position wird gemäß den geltenden technischen Vorschriften kalkuliert.',
      'cfaq.8.q':  'Sind Ihre Preise mit dem aktuellen Markt aktualisiert?',
      'cfaq.8.a':  'Immer. Wir verwenden monatlich aktualisierte Preisdatenbanken, die mit realen Lieferanten- und Herstellerpreisen abgeglichen werden. Sowohl UVP als auch Nettopreis jedes Materials sind ausgewiesen, damit Sie Ihre reale Marge vor der Angebotsabgabe berechnen können.',

      /* PRICING PAGE */
      'pricing.h2':      'Klare Investition, ohne Überraschungen.',
      'pricing.basic.h3': 'Basis-Karte',
      'pricing.basic.p': 'Ab 300€ <span class="tax">+ Steuer pro Budget.</span>',
      'pricing.basic.delivery': 'Garantierte Lieferung in 72h.',
      'pricing.business.h3': 'Business-Karte (Wiederkehrende Pakete)',
      'pricing.business.p': 'Optimieren Sie Ihre Kosten pro Budget durch Outsourcing Ihrer Messabteilung an uns.',
      'pricing.business.volume': 'Für Unternehmen mit monatlichem Volumen.',
      'pricing.disclaimer': 'Unsere Budgets sind keine einfachen kommerziellen Angebote; sie sind Kostenbasislinien nach PMBOK-Standards, bereit als Kontrollinstrument während der gesamten Projektausführung verwendet zu werden.',

      'cta.h2': 'Sichern Sie noch heute die Rentabilität Ihres nächsten Projekts',
      'cta.p':  'Ein präzises Budget ist das erste Fundament eines erfolgreichen Projekts. Sprechen Sie mit unseren Experten und entdecken Sie, wie wir Ihre Investition schützen können.',
      'cta.btn':'Kontakt zu einem Kostenschätzer',
      'footer.brand':      'Technisches Kostenbüro, spezialisiert auf hochpräzise Budgetierung für die Baubranche.',
      'footer.services.h': 'Ausgewählte Leistungen',
      'footer.svc.1': 'Baukostenschätzung',
      'footer.svc.2': 'Sanitärinstallation Budgetierung',
      'footer.svc.3': 'Brandschutzanlagen Budgets',
      'footer.svc.4': 'Maurerarbeiten Kostenkalkulation',
      'footer.contact.h': 'Schnellkontakt',
      'footer.wa':        'Per WhatsApp kontaktieren',
      'footer.legal.h':   'Rechtliche Informationen',
      'footer.legal.1':   'Impressum',
      'footer.legal.2':   'Datenschutzerklärung',
      'footer.legal.3':   'Cookie-Richtlinie',
      /* 2025-04-25 21:00 | Added AGB link + legal page title */
      'footer.legal.4':   'Allgemeine Geschäftsbedingungen',
      'legal.title':      'Rechtliche Informationen',
    },

    fr: {
      'nav.about':    'À propos',
      'nav.services': 'Services',
      'nav.examples': 'Portfolio',
      'nav.contact':  'Contact',
      /* 2025-04-25 23:55 | New slogan and subtitle */
      /* 2025-04-26 00:00 | Added HTML highlights + precision animation target */
      'hero.h1':     'La <span class="hero-highlight hero-precision">précision</span> qui définit votre entreprise.',
      /* 2025-04-26 00:45 | HTML highlights on mobile hero keys */
      'hero.h1.mob': 'La <span class="hero-highlight hero-precision">précision</span> qui définit votre entreprise.',
      'hero.p.mob':  'Ne laissez pas un <span class="hero-highlight">mauvais budget</span> ruiner votre projet. Nous optimisons vos <span class="hero-highlight">coûts</span> pour maximiser votre bénéfice.',
      'hero.p':      "Ne laissez pas un <span class='hero-highlight'>budget gonflé ou insuffisant</span> ruiner un bon projet. Nous optimisons vos <span class='hero-highlight'>coûts</span> pour éviter le rejet immédiat et <span class='hero-highlight'>maximiser votre bénéfice</span>.",
      'hero.cta': 'Demander un devis gratuit',
      'prob.h2':    'Les dépassements de coûts rongent-ils vos marges de projet ?',
      'prob.p1':    "<strong>70 % des projets de construction</strong> dépassent leur budget initial. Une estimation inexacte ne retarde pas seulement l'exécution ; elle réduit drastiquement votre rentabilité et génère des tensions avec les investisseurs.",
      'prob.p2':    "Ne laissez pas vos marges au hasard. Une planification financière rigoureuse est la différence entre un projet réussi et une perte d'un million.",
      'prob.stat1': 'Projets avec dépassements de coûts',
      'prob.stat2': 'Écart budgétaire moyen',
      'prob.stat3': "ROI de l'estimation précise",
      'ri.label':      'Budget en temps réel',
      'ri.title':      'Votre projet, ligne par ligne',
      'ri.total.label':'budget cumulé',
      'ri.scroll':     '↓ faites défiler pour explorer ↓',
      'ri.slider.label': 'GLISSER · CONTRÔLE DU BUDGET',
      'ri.room.salon': 'SALON / SALLE À MANGER',
      'ri.room.cocina':'CUISINE',
      'ri.room.bano':  'SALLE DE BAIN',
      'ri.room.dorm1': 'CHAMBRE 1',
      'ri.room.dorm2': 'CHAMBRE 2',
      'ri.scale':      "ÉCHELLE 1:50 · 85 m² · REZ-DE-CHAUSSÉE",
      'ri.leg.p': 'Plomberie / CVC',  'ri.leg.e': 'Électricité',
      'ri.leg.w': 'Fenêtres',         'ri.leg.d': 'Portes',
      'ri.sum.p': 'Plomberie / CVC',  'ri.sum.e': 'Électricité',
      'ri.sum.w': 'Fenêtres',         'ri.sum.d': 'Portes',
      'ri.sum.total': 'Total rénovation',
      'phase.p': '01 · PLOMBERIE / CVC',
      'phase.e': '02 · ÉLECTRICITÉ',
      'phase.w': '03 · FENÊTRES',
      'phase.d': '04 · PORTES',
      'tag.p0.name': 'plomberie · cuisine',       'tag.p0.desc': 'Évier + lave-vaisselle + lave-linge',
      'tag.p1.name': 'plomberie · salle de bain', 'tag.p1.desc': 'Douche, WC, lavabo + tuyauterie complète',
      'tag.p2.name': 'climatisation',             'tag.p2.desc': '4× splits + conduits + installation',
      'tag.e0.name': 'électrique · tableau',      'tag.e0.desc': 'Disjoncteur + 9 circuits protégés',
      'tag.e1.name': 'électrique · éclairage',    'tag.e1.desc': 'Points lumineux LED dans tout le logement',
      'tag.e2.name': 'électrique · prises',       'tag.e2.desc': '24 prises de courant',
      'tag.w0.name': 'fenêtres · salon',          'tag.w0.desc': '2× PVC double vitrage',
      'tag.w1.name': 'fenêtres · chambres',       'tag.w1.desc': '3× fenêtre + volet roulant',
      'tag.w2.name': 'fenêtres · cuisine',        'tag.w2.desc': 'Coulissante avec moustiquaire',
      'tag.d0.name': 'portes · entrée',           'tag.d0.desc': 'Blindée classe 3 + verrou',
      'tag.d1.name': 'portes · intérieures',      'tag.d1.desc': '4× porte laquée blanche',
      'proc.h2':  "Notre processus d'estimation des coûts",
      'proc.sub': 'Quatre phases éprouvées pour garantir précision maximale et viabilité financière dès le premier jour.',
      'proc.1.h': 'Faisabilité conceptuelle',
      'proc.1.p': 'Nous analysons plans, mémoires et spécifications techniques pour construire une base financière solide avant la conception finale.',
      'proc.2.h': 'Métrés et quantitatifs',
      'proc.2.p': "Quantification précise de chaque poste — matériaux, main-d'œuvre et équipements — sans aucune unité oubliée, avec la méthodologie BIM.",
      'proc.3.h': 'Ingénierie de la valeur',
      'proc.3.p': 'Nous appliquons des prix de marché actualisés et optimisons les ressources pour réduire les coûts sans compromettre la qualité ni la réglementation.',
      'proc.4.h': "Livraison et appel d'offres",
      'proc.4.p': 'Vous recevez le budget en BC3/Excel/PDF, prêt à présenter aux clients, à soumissionner ou à auditer — avec frais généraux et pertes détaillés.',
      'faq.h2':    "Questions fréquentes sur les estimateurs de coûts",
      'faq.intro': "Tout ce que vous devez savoir avant d'externaliser votre estimation de coûts de construction.",
      'faq.1.q':   "Pourquoi engager une entreprise externe d'estimation des coûts ?",
      'faq.1.a':   "Externaliser à un <em>cost estimator</em> apporte objectivité, élimine les erreurs internes dues à la surcharge, garantit l'utilisation de bases de données de prix actualisées et libère votre équipe technique.",
      'faq.2.q':   'Pour quels types de projets établissez-vous des budgets ?',
      'faq.2.a':   'Nous réalisons des estimations complètes pour la construction résidentielle, les projets commerciaux, les entrepôts industriels et le génie civil. Nous adaptons nos métriques au type de structure et aux finitions requises.',
      'faq.3.q':   'Quelle est la précision de vos budgets de construction ?',
      'faq.3.a':   "Nous travaillons avec les marges d'erreur les plus faibles du secteur, grâce à la technologie de mesure numérique (BIM) et la validation manuelle par des ingénieurs civils expérimentés.",

      /* SERVICES PAGE */
      'services.h2':      'Secteurs d\'intervention et spécialités',
      'services.sub':     'Nous établissons des budgets de haute précision adaptés aux besoins spécifiques de chaque discipline.',
      'services.construccion.h3': 'Projets de logement et construction résidentielle',
      'services.construccion.p':  'Décomptes complets des travaux de terrassement aux finitions, pour éviter tout écart dans votre promotion immobilière ou maison individuelle.',
      'services.publica.h3':     'Appels d\'offres de travaux publics',
      'services.publica.p':      'Formats adaptés aux exigences de l\'Administration, en stricte conformité avec les cahiers des charges et les formats BC3 normalisés.',
      'services.fontaneria.h3':  'Installations techniques (MEP)',
      'services.fontaneria.p':   'Spécialistes en électricité, <strong>plomberie</strong>, assainissement et <strong>protection incendie</strong>. Conformité rigoureuse aux réglementations (REBT, CTE, RSCIEI).',
      'services.albanileria.h3': 'Métiers spécialisés',
      'services.albanileria.p':  'Métrés méticuleux pour <strong>maçonnerie</strong>, menuiserie (bois et métal), vitrerie, aluminium et acier. Aucune quincaillerie n\'est laissée sans quantification.',
      'services.methodology.h3': 'Que comprend chacun de nos budgets ?',
      'services.methodology.1':  '<strong>Quantification des unités de matériaux et prix :</strong> PV et NET mis à jour aux prix réels du marché actuel.',
      'services.methodology.2':  '<strong>Possibilité de modifier les pertes</strong>, variations IPC, frais généraux, bénéfice et autres éléments.',
      'services.methodology.3':  '<strong>Décomposition technique :</strong> Prix par unité d\'exécution incluant main-d\'œuvre et matériaux.',
      'services.methodology.4':  '<strong>Fiche technique pour le client :</strong> Description des travaux réalisés et prix final.',
      'services.methodology.5':  '<strong>Livraison finale dans différents formats :</strong> Excel, BC3, PDF.',
      'services.methodology.6':  '<strong>Support après-vente :</strong> Si vous avez besoin d\'ajustements, nous les effectuons.',
      'services.cta':            'Voir notre portfolio',

      /* NOSOTROS PAGE */
      'nosotros.h2':      'Plus que des chiffres : l\'architecture au service de votre rentabilité.',
      'nosotros.sub':     'Pr3cise n\'est pas un service de budgétisation ; nous sommes un cabinet d\'architecture technique et supérieure avec des décennies d\'expérience dans le secteur de la construction en Europe. Nous comprenons qu\'un budget mal calculé est un projet qui naît mort.',
      'nosotros.p1':      'Notre équipe est composée d\'architectes techniques et supérieurs, d\'ingénieurs d\'installations et de spécialistes en gestion de projet avec une trajectoire consolidée dans le secteur de la construction. Nous combinons la précision technique avec une vision stratégique du coût qui transforme chaque budget en un véritable outil de décision, pas une simple liste de postes.',
      'nosotros.p2':      'Nous travaillons selon les normes internationales de gestion de projet (PMBOK, IPMA) et les réglementations techniques espagnoles en vigueur (CTE, RITE, RSCIEI, REBT), garantissant que chaque poste reflète la réalité constructive avec un total rigueur. Lorsque nous livrons un budget, nous livrons une ligne de base de coût autorisée, traçable et défendable devant tout client, administration ou audit.',
      'nosotros.1.h':     'Expérience réelle sur chantier',
      'nosotros.1.p':     'Nous savons comment construire, c\'est pourquoi nous savons ce qu\'il faut budgétiser. Nous évitons les "oublis" qui détruisent vos marges.',
      'nosotros.2.h':     'Spécialisation technique',
      'nosotros.2.p':     'Nous maîtrisons les réglementations techniques (CTE, RITE, RSCIEI) pour que chaque poste de plomberie, protection incendie ou maçonnerie respecte la loi et la réalité d\'exécution.',
      'nosotros.3.h':     'Engagement Pr3cise',
      'nosotros.3.p':     'Nous offrons depuis des années un service de qualité basé sur la transparence et la rapidité. Votre succès est notre métrique de croissance.',
      'nosotros.cta':    'Voir nos services',

      /* EJEMPLOS PAGE */
      'ejemplos.h2':     'Budgets avec Intelligence de Chantier : Le standard Pr3cise',
      'ejemplos.sub':    'Nous ne livrons pas de simples listes de prix. Nous livrons des outils de gestion pour votre projet.',
      'ejemplos.1.h':    '1. CONTRÔLE DES DÉCHETS ET PERTES',
      'ejemplos.1.p':    'Nous calculons le coefficient de passage réel et les pertes par matériau (céramiques, granulats, acier). Évitez les ruptures de stock et les surcoûts cachés lors de l\'achat.',
      'ejemplos.2.h':    '2. FRAIS GÉNÉRAUX (FG) ET BÉNÉFICE INDUSTRIEL (BI)',
      'ejemplos.2.p':    'Analyse détaillée des coûts indirects. Nous structurons les <span class="highlight-gold">13 % de FG et 6 % de BI</span> (ou personnalisés) pour que votre marge soit réelle et défendable devant tout audit ou client.',
      'ejemplos.3.h':    '3. POSTES RÉGLEMENTÉS ET PRIX DU MARCHÉ 2026',
      'ejemplos.3.p':    'Connexion avec des bases de données mises à jour mensuellement. Nous ajustons les prix selon la volatilité des matières premières et de la main-d\'œuvre actuelle.',
      'ejemplos.4.h':    '4. MESURES GÉOMÉTRIQUES ET DÉCOMPOSITIONS',
      'ejemplos.4.p':    'Chaque poste comprend sa mesure détaillée. Transparence totale pour des certifications rapides sans conflits avec la maîtrise d\'œuvre.',
      'ejemplos.cta':   'Contactez-nous',

      /* CONTACTO PAGE */
      'contacto.h2':      'Contactez-nous et optimisez votre rentabilité',
      'contacto.sub':     'Parlez-nous de votre projet et nous répondrons sous 24 heures. Sans engagement.',
      'contacto.lbl.nombre': 'Nom',
      'contacto.lbl.empresa': 'Entreprise',
      'contacto.lbl.email': 'E-mail',
      'contacto.lbl.telefono': 'Téléphone',
      'contacto.lbl.proyecto': 'Type de projet',
      'contacto.lbl.mensaje': 'Message',
      'contacto.opt.default': 'Sélectionnez le type de projet',
      'contacto.opt.construccion': 'Installations électriques',
      'contacto.opt.pci': 'Protection incendie (PCI)',
      'contacto.opt.fontaneria': 'Plomberie',
      'contacto.opt.albanileria': 'Maçonnerie',
      'contacto.opt.carpinteria': 'Menuiserie',
      'contacto.captcha': 'Vérification · Nivelez la bulle pour activer l\'envoi',
      'contacto.submit': 'Envoyer le message',
      'contacto.sent': 'Message envoyé avec succès. Nous vous contacterons bientôt.',
      'contacto.error': 'Erreur lors de l\'envoi. Veuillez réessayer.',

      /* CONTACT-PAGE FAQ */
      'cfaq.h2':   'Questions Fréquentes',
      'cfaq.sub':  'Tout ce que vous devez savoir avant de demander votre devis. Pour toute autre question, écrivez-nous.',
      'cfaq.1.q':  'Combien de temps faut-il pour livrer un budget ?',
      'cfaq.1.a':  'Le délai standard est de <strong>72 heures</strong> à partir de la réception de la documentation complète du projet (plans, mémoires, spécifications). Pour les projets plus complexes ou volumineux, nous convenons d\'un délai personnalisé avant de commencer.',
      'cfaq.2.q':  'Quelle documentation nous faut-il pour élaborer le budget ?',
      'cfaq.2.a':  'Des plans en PDF ou DWG et la note descriptive suffisent pour commencer. Si vous disposez de métrés préalables ou de cahiers des charges, nous les intégrons également. Plus vous nous fournissez d\'informations, plus le résultat sera précis.',
      'cfaq.3.q':  'Le service a-t-il un coût initial ?',
      'cfaq.3.a':  'La consultation initiale et l\'analyse de faisabilité sont <strong>gratuites et sans engagement</strong>. Le devis du service est fourni avant tout début de travail, pour que vous puissiez prendre votre décision en toute transparence. Aucun frais caché.',
      'cfaq.4.q':  'Dans quels formats livrez-vous le budget final ?',
      'cfaq.4.a':  'Nous livrons le budget en <strong>Excel, PDF et BC3</strong> de manière standard. Le format BC3 est compatible avec les principaux logiciels de gestion de projet (Presto, TCQ, Arquímedes). Si vous avez besoin d\'un format spécifique pour votre appel d\'offres ou votre client, contactez-nous.',
      'cfaq.5.q':  'Pouvez-vous modifier le budget si le projet change ?',
      'cfaq.5.a':  'Oui. Nous incluons un cycle de révisions dans le service pour ajuster les postes, modifier les spécifications ou mettre à jour les prix. Si le changement implique une modification substantielle du périmètre, nous l\'évaluons et le chiffrons ensemble.',
      'cfaq.6.q':  'Travaillez-vous avec des entreprises de toute l\'Espagne ou seulement d\'une zone ?',
      'cfaq.6.a':  'Nous travaillons <strong>100% à distance</strong> avec des constructeurs, promoteurs et bureaux de toute l\'Espagne et d\'Europe. Aucune limite géographique : toute la documentation est échangée numériquement, ce qui nous permet de garantir le même niveau de service quelle que soit la localisation de votre projet.',
      'cfaq.7.q':  'Pouvez-vous budgétiser des installations spécialisées (électricité, PCI, plomberie) ?',
      'cfaq.7.a':  'Oui, c\'est l\'une de nos spécialités. Nous réalisons des décompositions complètes des installations électriques (REBT), protection incendie (RSCIEI), plomberie et assainissement (CTE-HS), et climatisation (RITE). Chaque poste est budgétisé en conformité avec les réglementations techniques en vigueur.',
      'cfaq.8.q':  'Vos prix sont-ils à jour avec le marché actuel ?',
      'cfaq.8.a':  'Toujours. Nous utilisons des bases de données de prix mises à jour mensuellement et vérifiées par rapport aux prix réels des fournisseurs et fabricants. Le prix public et le prix NET de chaque matériau sont tous deux indiqués, afin que vous puissiez calculer votre marge réelle avant de soumettre votre offre.',

      /* PRICING PAGE */
      'pricing.h2':      'Investissement clair, sans surprises.',
      'pricing.basic.h3': 'Carte de Base',
      'pricing.basic.p': 'À partir de 300€ <span class="tax">+ taxe par budget.</span>',
      'pricing.basic.delivery': 'Livraison garantie en 72h.',
      'pricing.business.h3': 'Carte Business (Forfaits Récurrents)',
      'pricing.business.p': 'Optimisez votre coût par budget en externalisant votre département de métrés avec nous.',
      'pricing.business.volume': 'Pour les entreprises avec un volume mensuel.',
      'pricing.disclaimer': 'Nos budgets ne sont pas de simples offres commerciales ; ce sont des Lignes de Base de Coût selon les normes PMBOK, prêtes à être utilisées comme outil de contrôle tout au long de l\'exécution du projet.',

      'cta.h2': "Sécurisez dès aujourd'hui la rentabilité de votre prochain projet",
      'cta.p':  "Un budget précis est le premier fondement d'un projet réussi. Parlez à nos estimateurs experts et découvrez comment nous pouvons protéger votre investissement.",
      'cta.btn':'Contacter un estimateur de coûts',
      'footer.brand':      "Bureau technique spécialisé dans l'élaboration de budgets de haute précision pour le secteur du bâtiment.",
      'footer.services.h': 'Services phares',
      'footer.svc.1': 'Estimation des coûts de construction',
      'footer.svc.2': 'Élaboration de budgets plomberie',
      'footer.svc.3': 'Budgets installations protection incendie',
      'footer.svc.4': 'Calcul des coûts de maçonnerie',
      'footer.contact.h': 'Contact rapide',
      'footer.wa':        'Contacter par WhatsApp',
      'footer.legal.h':   'Informations légales',
      'footer.legal.1':   'Mentions légales',
      'footer.legal.2':   'Politique de confidentialité',
      'footer.legal.3':   'Politique de cookies',
      /* 2025-04-25 21:00 | Added CGV link + legal page title */
      'footer.legal.4':   'Conditions générales',
      'legal.title':      'Informations légales',
    }
  }; /* end T */

  /* ─── Current language (synchronous: read localStorage before DOM) ── */
  var currentLang = localStorage.getItem('pr3cise_lang') || 'es';

  /* ─── Core helpers ───────────────────────────────────────────────── */
  function getLang() { return currentLang; }

  function t(key) {
    return (T[currentLang] && T[currentLang][key]) ||
           (T['es'] && T['es'][key]) || key;
  }

  function applyTranslations(lang) {
    var dict = T[lang];
    if (!dict) return;

    document.documentElement.lang = lang;

    /* Plain text nodes */
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (dict[key] !== undefined) el.textContent = dict[key];
    });

    /* HTML content (for entries with <strong>, <em>, etc.) */
    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-html');
      if (dict[key] !== undefined) el.innerHTML = dict[key];
    });

    /* Update flag button image */
    var flagImg = document.getElementById('lang-flag-img');
    if (flagImg && FLAG_IMGS[lang]) {
      flagImg.src = FLAG_IMGS[lang];
      flagImg.alt = lang.toUpperCase();
    }

    /* Sync dropdown active option */
    document.querySelectorAll('.lang-option').forEach(function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });

    /* Re-read nav scramble originals if scramble is loaded */
    document.querySelectorAll('.site-nav a[data-original]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (key && dict[key]) {
        el.setAttribute('data-original', dict[key]);
        el.textContent = dict[key];
      }
    });
  }

  function setLang(lang) {
    if (!T[lang]) return;
    localStorage.setItem('pr3cise_lang', lang);
    location.reload();
  }

  /* ─── IP-based detection (async, only when no preference stored) ───
     2026-08-03 | SEO: antes esto podía forzar 'en' por IP. Googlebot rastrea
     mayoritariamente desde EE.UU., así que el sitio en español se servía traducido
     al inglés sobre la MISMA URL: contenido duplicado y señal de idioma contradictoria.
     Ahora la detección solo cubre alemán y francés (que no tienen URL propia) y nunca
     inglés: el inglés vive en /en/ con su URL real y se alcanza vía hreflang o el
     selector de idioma. */
  var COUNTRY_LANG = {
    /* German — Germany, Austria, Switzerland */
    DE: 'de', AT: 'de', CH: 'de',
    /* French — France, Belgium, Luxembourg */
    FR: 'fr', BE: 'fr', LU: 'fr'
  };

  function detectIP() {
    if (localStorage.getItem('pr3cise_lang')) return; /* already set */
    fetch('https://api.country.is/')
      .then(function (r) { return r.json(); })
      .then(function (data) {
        var detected = COUNTRY_LANG[(data && data.country) || ''];
        if (!detected || detected === currentLang) return;
        localStorage.setItem('pr3cise_lang', detected);
        currentLang = detected;
        applyTranslations(detected);
      })
      .catch(function () { /* keep default */ });
  }

  /* ─── Initialise ─────────────────────────────────────────────────── */
  var _dropOpen = false;

  function closeDropdown() {
    var dd = document.getElementById('lang-dropdown');
    var btn = document.getElementById('lang-flag-btn');
    if (dd) { dd.classList.remove('open'); }
    if (btn) { btn.classList.remove('open'); }
    _dropOpen = false;
  }

  /* 2025-04-26 02:09 | Separate dropdown init to call after header loads */
  function initDropdown() {
    var flagBtn = document.getElementById('lang-flag-btn');
    if (!flagBtn) return;

    flagBtn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      _dropOpen = !_dropOpen;
      var dd = document.getElementById('lang-dropdown');
      var btn = document.getElementById('lang-flag-btn');
      if (dd) dd.classList.toggle('open', _dropOpen);
      if (btn) btn.classList.toggle('open', _dropOpen);
    });

    /* 2026-08-03 | Solo los <button data-lang> (de/fr) se gestionan por JS.
       Español e inglés son <a href> reales hacia sus propias URLs: si se les
       aplicase preventDefault aquí, el enlace no navegaría nunca. */
    document.querySelectorAll('button.lang-option[data-lang]').forEach(function (opt) {
      opt.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        setLang(opt.getAttribute('data-lang'));
        closeDropdown();
      });
    });

    /* Recordar la elección al seguir los enlaces es/en para futuras visitas */
    document.querySelectorAll('a.lang-option[hreflang]').forEach(function (link) {
      link.addEventListener('click', function () {
        localStorage.setItem('pr3cise_lang', link.getAttribute('hreflang'));
      });
    });

    document.addEventListener('click', function (e) {
      if (!e.target.closest('.lang-switcher')) closeDropdown();
    });
  }

  /* 2026-08-03 | Si el visitante ya eligió inglés y aterriza en una URL española,
     lo llevamos a la URL inglesa equivalente declarada en hreflang. Es seguro para
     SEO porque los rastreadores no tienen localStorage: a ellos nunca se les redirige
     y siempre indexan la versión española de esta URL. */
  function redirectToChosenEnglish() {
    if (currentLang !== 'en') return false;
    var alt = document.querySelector('link[rel="alternate"][hreflang="en"]');
    if (!alt) return false;
    var target = new URL(alt.getAttribute('href'), location.href);
    if (target.pathname === location.pathname) return false;
    location.replace(target.href);
    return true;
  }

  function init() {
    if (redirectToChosenEnglish()) return;
    if (!T[currentLang]) currentLang = 'es';
    applyTranslations(currentLang);
    detectIP();
    /* 2025-04-26 02:09 | Try init dropdown immediately, fallback to main.js call */
    initDropdown();
  }

  /* Expose globally so main.js and inline scripts can use it */
  window.I18N = {
    getLang: getLang,
    setLang: setLang,
    t: t,
    apply: applyTranslations,
    T: T,
    initDropdown: initDropdown
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
