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
      'ri.total.label':'presupuesto acumulado · ejemplo en €',
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
      'tag.e0.desc': 'Cuadro general + 9 circuitos protegidos',
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
      'proc.sub': 'Cuatro fases probadas en cientos de proyectos, diseñadas para garantizar máxima precisión y viabilidad financiera desde el primer día. Aquí tienes la lista completa de <a href="/servicios.html">oficios y servicios que presupuestamos</a>.',
      'proc.1.h': 'Viabilidad Conceptual',
      'proc.1.p': 'Analizamos planos, memorias y especificaciones técnicas para construir una base financiera sólida antes del diseño final.',
      'proc.2.h': 'Medición y Takeoffs',
      'proc.2.p': 'Cuantificación exacta de cada partida — materiales, mano de obra y equipos — sin dejar ninguna unidad sin medir, con metodología BIM.',
      'proc.3.h': 'Ingeniería de Valor',
      'proc.3.p': 'Aplicamos precios de mercado actualizados y optimizamos recursos para reducir costes sin comprometer calidad ni normativa.',
      'proc.4.h': 'Entrega y Licitación',
      'proc.4.p': 'Recibes el presupuesto en Excel/PDF —y en BC3 o el formato que use tu mercado—, listo para presentar a clientes, licitar o auditar, con gastos generales, beneficio y mermas desglosados.',

      /* FAQ */
      'quien.h':   'Con quién trabajamos',
      'quien.sub': 'Cada cliente necesita un entregable distinto. Ajustamos el formato a cómo presentas tú la oferta — <a href="/ejemplos.html">mira cómo es un presupuesto terminado</a>.',
      'quien.1.h': 'Constructoras',
      'quien.1.p': 'Presupuestos multi-oficio y paquetes completos de licitación, desde el anteproyecto hasta la oferta en firme. Los huecos de alcance se señalan por escrito, para que sepas qué no ha incluido cada subcontrata.',
      'quien.2.h': 'Subcontratas',
      'quien.2.p': 'Mediciones de un solo oficio valoradas para el día de la oferta. Envías los planos y recibes cantidades y precios a tiempo de llegar al plazo.',
      'quien.3.h': 'Promotores y propiedad',
      'quien.3.p': 'Presupuestos de fase conceptual y de diseño para estudios de viabilidad, expedientes de financiación y decisiones de seguir o parar, actualizados según avanza el proyecto.',
      'quien.4.h': 'Estudios de arquitectura',
      'quien.4.p': 'Contraste independiente de costes en anteproyecto, básico y ejecución, para que el diseño se mantenga dentro del número de la propiedad en lugar de recortarse a posteriori.',
      'faq.h2':    'Preguntas Frecuentes sobre Estimadores de Costes',
      'faq.intro': 'Todo lo que necesitas saber antes de externalizar tu estimación de costes de obra. Si prefieres empezar por <a href="/nosotros.html">quién hace realmente los números</a>, empieza ahí.',
      'faq.1.q':   '¿Por qué contratar a una empresa de estimación de costes externa?',
      'faq.1.a':   'Externalizar el servicio con un <em>cost estimator</em> aporta objetividad, elimina errores internos por exceso de carga de trabajo, garantiza el uso de bases de datos de precios actualizadas y libera a tu equipo técnico para que se concentre en la ejecución y supervisión de la obra.',
      'faq.2.q':   '¿Qué tipo de proyectos de construcción presupuestáis?',
      'faq.2.a':   'Realizamos estimaciones integrales para edificación residencial, proyectos comerciales, naves industriales y obra civil. Adaptamos nuestras métricas al tipo de estructura y acabados requeridos.',
      'faq.3.q':   '¿Qué nivel de precisión tienen vuestros presupuestos de obra?',
      'faq.3.a':   'Trabajamos con los márgenes de error más bajos del sector gracias a la combinación de tecnología de medición digital (BIM) y la validación manual de ingenieros civiles experimentados.',
      'faq.4.q':   '¿Qué diferencia hay entre una medición y un presupuesto de ejecución?',
      'faq.4.a':   'La medición es el recuento: cuántos metros de tabique, cuántos puntos de luz, cuántos metros cúbicos de hormigón, y cada cifra trazable hasta el plano. El presupuesto es esa medición ya valorada, con precios de mercado, mermas, mano de obra y los gastos generales y el beneficio industrial desglosados. Entregamos las dos cosas, porque sin la medición detrás un presupuesto no se puede defender ante nadie.',
      'faq.5.q':   '¿Trabajáis con modelos BIM o solo con planos en PDF?',
      'faq.5.a':   'Con ambos. Si nos pasas un modelo BIM extraemos las mediciones del propio modelo, lo que reduce el margen de error y acorta el plazo. Si solo tienes PDF o DWG, medimos sobre plano con marcado por colores, para que puedas auditar cualquier partida en segundos. No exigimos un formato concreto para empezar.',
      'faq.6.q':   '¿Podéis preparar el presupuesto para una licitación pública?',
      'faq.6.a':   'Sí, es uno de nuestros encargos habituales. Ajustamos el desglose al formato que exija el pliego, entregamos en BC3 para los programas de gestión de obra, y dejamos por escrito las exclusiones y las hipótesis: eso es lo que suele decidir una adjudicación cuando dos ofertas van parejas.',

      /* SERVICES PAGE */
      'services.h2':      'Sectores de Actuación y Especialidades',
      'services.sub':     'Realizamos presupuestos de alta precisión adaptados a las necesidades específicas de cada disciplina.',
      'services.construccion.h3': 'Proyectos de Viviendas y Edificación Residencial',
      'services.construccion.p':  'Desgloses completos desde el movimiento de tierras hasta los acabados, asegurando que tu promoción inmobiliaria o vivienda unifamiliar no sufra desviaciones.',
      'services.publica.h3':     'Licitaciones de Obra Pública',
      'services.publica.p':      'Formatos adaptados a los requerimientos de cada administración pública: cumplimos estrictamente los pliegos del organismo convocante y entregamos en el formato que exija tu licitación, BC3 estandarizado incluido.',
      'services.fontaneria.h3':  'Instalaciones Técnicas (Mep)',
      'services.fontaneria.p':   'Especialistas en Electricidad, <strong>Fontanería</strong>, Saneamiento y <strong>PCI</strong> (Protección Contra Incendios). Cumplimiento riguroso de la normativa de tu mercado: REBT, CTE y RSCIEI en España, NEC y NFPA en EE. UU., y el reglamento local allí donde construyas.',
      'services.albanileria.h3': 'Oficios Especializados',
      'services.albanileria.p':  'Mediciones minuciosas para <strong>Albañilería</strong>, Carpintería (madera y metálica), Cristalería, Aluminio y Acero. Ni un solo herraje queda sin cuantificar.',
      'services.methodology.h3': '¿Qué incluye cada uno de nuestros presupuestos?',
      'services.methodology.1':  '<strong>Cuantificación de unidades de materiales y precios:</strong> PVP y NETO actualizado a precios reales del mercado actual.',
      'services.methodology.2':  '<strong>Posibilidad de modificar mermas</strong>, índices de inflación, gastos generales, beneficio y otros elementos.',
      'services.methodology.3':  '<strong>Desglose (o descompuesto) técnico:</strong> Precio por unidad de ejecución incluyendo mano de obra y materiales.',
      'services.methodology.4':  '<strong>Ficha técnica para el cliente:</strong> Descripción de los trabajos realizados y precio final.',
      'services.methodology.5':  '<strong>Entrega final en diferentes formatos:</strong> Excel, PDF, BC3 u otro que exija tu mercado o tu cliente.',
      'services.methodology.6':  '<strong>Soporte post-venta:</strong> Si necesitas que modifiquemos algo para hacer más ajustes, lo hacemos.',
      'services.cta':            'Consulta nuestros ejemplos',

      /* NOSOTROS PAGE */
      'nosotros.h2':      'Más que números: Arquitectura al servicio de tu rentabilidad.',
      'nosotros.sub':     'Pr3cise es una firma de arquitectura técnica y superior con décadas de experiencia en el sector de la edificación: convertimos cada presupuesto en una herramienta real de toma de decisiones, porque un presupuesto mal calculado es una obra que nace muerta.',
      'nosotros.p1':      'Nuestro equipo está formado por arquitectos técnicos y superiores, ingenieros de instalaciones y especialistas en gestión de proyectos con una trayectoria consolidada en el sector de la edificación. Combinamos la precisión técnica con una visión estratégica del coste que convierte cada presupuesto en una herramienta real de toma de decisiones, no en un simple listado de partidas.',
      'nosotros.p2':      'Trabajamos bajo los estándares internacionales de gestión de proyectos (PMBOK, IPMA) y aplicamos la normativa técnica del país donde se construye: CTE, RITE, RSCIEI y REBT en España, los Eurocódigos y sus anejos nacionales en el resto de Europa, y la codificación CSI MasterFormat con el código local en Estados Unidos — y en cualquier otro mercado, la normativa local vigente. Cuando entregamos un presupuesto, entregamos una línea base de coste autorizada, trazable y defendible ante cualquier cliente, administración o auditoría.',
      'nosotros.1.h':     'Experiencia Real en Obra',
      'nosotros.1.p':     'Sabemos cómo se construye, por eso sabemos qué hay que presupuestar. Evitamos los "olvidos" que destrozan tus márgenes.',
      'nosotros.2.h':     'Especialización Técnica',
      'nosotros.2.p':     'Dominamos la normativa técnica de cada mercado —CTE, RITE y RSCIEI en España, los Eurocódigos en Europa, el Florida Building Code y sus exigencias de zona huracanada en Miami-Dade— para que cada partida de fontanería, PCI o albañilería cumpla con la ley y con la realidad de ejecución.',
      'nosotros.3.h':     'Compromiso Pr3cise',
      'nosotros.3.p':     'Llevamos años ofreciendo un servicio de calidad basado en la transparencia y la rapidez. Tu éxito es nuestra métrica de crecimiento.',
      'nosotros.cta':    'Ver nuestros servicios',

      /* EJEMPLOS PAGE */
      'ejemplos.h2':     'Presupuestos con Inteligencia de Obra: El estándar Pr3cise',
      'ejemplos.sub':    'Entregamos herramientas de gestión para tu obra: cada partida llega con su medición detallada, sus mermas reales y sus márgenes (gastos generales y beneficio) desglosados, no un simple listado de precios.',
      'ejemplos.1.h':    '1. CONTROL DE MERMAS Y DESPERDICIOS',
      'ejemplos.1.p':    'Calculamos el coeficiente de paso y mermas reales por material (cerámicos, áridos, acero). Evita roturas de stock y sobrecostes ocultos en la compra.',
      'ejemplos.2.h':    '2. GASTOS GENERALES (GG) Y BENEFICIO INDUSTRIAL (BI)',
      'ejemplos.2.p':    'Análisis pormenorizado de costes indirectos. Estructuramos los porcentajes de gastos generales y beneficio que exija tu mercado —por ejemplo, el <span class="highlight-gold">13% de GG y el 6% de BI</span> habituales en la licitación española— para que tu margen sea real y defendible ante cualquier auditoría o cliente.',
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
      'cfaq.4.a':  'Entregamos el presupuesto en <strong>Excel, PDF y BC3</strong> de forma estándar. El formato BC3 es compatible con los programas de gestión de obra más usados en España (Presto, TCQ, Arquímedes); si tu mercado o tu licitación usan otro estándar, nos adaptamos. Si necesitas un formato específico para tu licitación o cliente, consúltanos.',
      'cfaq.5.q':  '¿Podéis modificar el presupuesto si cambia el proyecto?',
      'cfaq.5.a':  'Sí. Incluimos una ronda de revisiones dentro del servicio para ajustar partidas, cambiar especificaciones o actualizar precios. Si el cambio implica una modificación sustancial del alcance, lo evaluamos y presupuestamos conjuntamente.',
      'cfaq.6.q':  '¿Trabajáis con empresas de cualquier país?',
      'cfaq.6.a':  'Trabajamos de forma <strong>100% remota</strong> con constructoras, promotoras y estudios de cualquier país: España, Latinoamérica, el resto de Europa y Estados Unidos entre ellos. No tenemos limitación geográfica y toda la documentación se intercambia digitalmente. Además, cada proyecto se valora con bases de precios de su mercado real y no con una media nacional, así que el presupuesto refleja los costes de mano de obra y material del lugar donde se construye.',
      'cfaq.7.q':  '¿Podéis presupuestar instalaciones especializadas (eléctrica, PCI, fontanería)?',
      'cfaq.7.a':  'Sí, es una de nuestras especialidades. Realizamos desgloses completos de instalaciones eléctricas, PCI, fontanería, saneamiento y climatización, aplicando la normativa vigente en tu mercado: REBT, RSCIEI, CTE-HS y RITE en España; NEC y NFPA en EE. UU. Cada partida se presupuesta cumpliendo la normativa técnica vigente, con materiales y mano de obra diferenciados.',
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
      'ri.total.label':'accumulated budget · sample in €',
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
      'proc.sub': 'Four battle-tested phases designed to guarantee maximum precision and financial viability from day one. The full list of <a href="/servicios.html">trades and services we estimate</a> is here.',
      'proc.1.h': 'Conceptual Feasibility',
      'proc.1.p': 'We analyse drawings, specifications and technical documents to build a solid financial foundation before the final design.',
      'proc.2.h': 'Measurement & Takeoffs',
      'proc.2.p': 'Precise quantification of every line item — materials, labour and equipment — with no unit left unaccounted for, using BIM methodology.',
      'proc.3.h': 'Value Engineering',
      'proc.3.p': 'We apply up-to-date market prices and optimise resources to reduce costs without compromising quality or compliance.',
      'proc.4.h': 'Delivery & Tendering',
      'proc.4.p': 'You receive the estimate in Excel/PDF — and in BC3 or whatever format your market uses — ready to present to clients, tender or audit, with overheads, profit and waste fully itemised.',

      /* FAQ */
      'quien.h':   'Who we work with',
      'quien.sub': 'Different buyers, different deliverables. We adjust the output to how you actually bid — <a href="/ejemplos.html">see what a finished estimate looks like</a>.',
      'quien.1.h': 'General contractors',
      'quien.1.p': 'Multi-trade budgets and full bid packages, from conceptual through hard bid. Scope gaps flagged in writing so you know what the subs did not include.',
      'quien.2.h': 'Subcontractors',
      'quien.2.p': 'Single-trade takeoffs priced for bid day. Send the plans, get quantities and pricing back fast enough to still make the deadline.',
      'quien.3.h': 'Developers and owners',
      'quien.3.p': 'Conceptual and design-phase budgets for feasibility, lender packages and go/no-go decisions, updated as the drawings develop.',
      'quien.4.h': 'Architects',
      'quien.4.p': 'Independent cost checks at SD, DD and CD so the design stays inside the owner\'s number instead of getting value-engineered after the fact.',
      'faq.h2':    'Frequently Asked Questions About Cost Estimators',
      'faq.intro': 'Everything you need to know before outsourcing your construction cost estimation. If you would rather start with <a href="/nosotros.html">who actually produces the numbers</a>, start there.',
      'faq.1.q':   'Why hire an external cost estimation firm?',
      'faq.1.a':   'Outsourcing to a <em>cost estimator</em> brings objectivity, eliminates internal errors from workload pressure, guarantees use of up-to-date price databases, and frees your technical team to focus on execution and site supervision.',
      'faq.2.q':   'What types of construction projects do you budget for?',
      'faq.2.a':   'We produce comprehensive estimates for residential buildings, commercial projects, industrial warehouses and civil works. We adapt our metrics to the structure type and finishes required.',
      'faq.3.q':   'How accurate are your construction budgets?',
      'faq.3.a':   'We work to the lowest error margins in the industry, combining digital measurement technology (BIM) and manual validation by experienced civil engineers.',
      'faq.4.q':   'What is the difference between a takeoff and a cost estimate?',
      'faq.4.a':   'The takeoff is the count: how many linear metres of partition, how many light points, how many cubic metres of concrete, every figure traceable back to the drawing. The estimate is that takeoff priced up, with market rates, waste factors, labour, and overhead and profit broken out. We deliver both, because without the takeoff behind it an estimate cannot be defended to anyone.',
      'faq.5.q':   'Do you work from BIM models or only from PDF drawings?',
      'faq.5.a':   'Both. If you send a BIM model we pull quantities from the model itself, which cuts the error margin and shortens the turnaround. If you only have PDF or DWG, we measure on the drawing with colour-coded markups so you can audit any line item in seconds. We do not require a particular format to start.',
      'faq.6.q':   'Can you prepare the estimate for a public tender?',
      'faq.6.a':   'Yes, it is one of our regular jobs. We match the breakdown to the format the tender documents demand, deliver in the formats your project management software reads, and put exclusions and assumptions in writing: that is usually what decides an award when two bids are close.',

      /* SERVICES PAGE */
      'services.h2':      'Sectors of Operation and Specialties',
      'services.sub':     'We prepare high-precision budgets adapted to the specific needs of each discipline.',
      'services.construccion.h3': 'Residential Housing and Building Projects',
      'services.construccion.p':  'Complete breakdowns from earthworks to finishes, ensuring your real estate development or single-family home suffers no deviations.',
      'services.publica.h3':     'Public Works Tenders',
      'services.publica.p':      'Formats adapted to each public authority: we comply strictly with the tender specifications and deliver in whatever format your bid requires, standardised BC3 included.',
      'services.fontaneria.h3':  'Technical Installations (MEP)',
      'services.fontaneria.p':   'Specialists in Electrical, <strong>Plumbing</strong>, Sanitation and <strong>Fire Protection</strong>. Rigorous compliance with the code of your market: REBT, CTE and RSCIEI in Spain, NEC and NFPA in the US, and the local regulations wherever you build.',
      'services.albanileria.h3': 'Specialised Trades',
      'services.albanileria.p':  'Meticulous measurements for <strong>Masonry</strong>, Carpentry (wood and metal), Glazing, Aluminium and Steel. Not a single fitting goes unquantified.',
      'services.methodology.h3': 'What does each of our budgets include?',
      'services.methodology.1':  '<strong>Quantification of material units and prices:</strong> RRP and NET updated to current real market prices.',
      'services.methodology.2':  '<strong>Ability to modify waste</strong>, CPI variations, overheads, profit, and other elements.',
      'services.methodology.3':  '<strong>Technical breakdown:</strong> Price per execution unit including labour and materials.',
      'services.methodology.4':  '<strong>Technical sheet for the client:</strong> Description of work performed and final price.',
      'services.methodology.5':  '<strong>Final delivery in different formats:</strong> Excel, PDF, BC3 or whatever your market or client requires.',
      'services.methodology.6':  '<strong>After-sales support:</strong> If you need us to make adjustments, we do it.',
      'services.cta':            'View our portfolio',

      /* NOSOTROS PAGE */
      'nosotros.h2':      'More than numbers: Architecture at the service of your profitability.',
      'nosotros.sub':     'Pr3cise is a technical and higher architecture firm with decades of experience in building construction: we turn every estimate into a real decision-making tool, because a poorly calculated budget is a project that is born dead.',
      'nosotros.p1':      'Our team consists of technical and higher architects, installation engineers and project management specialists with a proven track record in the construction sector. We combine technical precision with a strategic vision of cost that turns each budget into a real decision-making tool, not just a list of line items.',
      'nosotros.p2':      'We work under international project management standards (PMBOK, IPMA) and apply the technical code of the country the project is built in: CTE, RITE, RSCIEI and REBT in Spain, the Eurocodes and their national annexes across the rest of Europe, and CSI MasterFormat coding with the local building code in the United States — and in any other market, the regulations in force there. When we deliver a budget, we deliver an authorised, traceable and defensible cost baseline before any client, administration or audit.',
      'nosotros.1.h':     'Real On-Site Experience',
      'nosotros.1.p':     'We know how it is built, so we know what needs to be budgeted. We avoid the "oversights" that destroy your margins.',
      'nosotros.2.h':     'Technical Specialisation',
      'nosotros.2.p':     'We master the technical code of each market — CTE, RITE and RSCIEI in Spain, the Eurocodes across Europe, the Florida Building Code and its High-Velocity Hurricane Zone requirements in Miami-Dade — so that each plumbing, fire protection or masonry item complies with the law and with execution reality.',
      'nosotros.3.h':     'Pr3cise Commitment',
      'nosotros.3.p':     'We have been offering a quality service based on transparency and speed for years. Your success is our growth metric.',
      'nosotros.cta':    'View our services',

      /* EJEMPLOS PAGE */
      'ejemplos.h2':     'Budgets with Site Intelligence: The Pr3cise Standard',
      'ejemplos.sub':    'We deliver management tools for your project: every line item arrives with its detailed measurement, its real waste factors and its margins (overhead and profit) broken out — not a simple price list.',
      'ejemplos.1.h':    '1. WASTE AND LOSS CONTROL',
      'ejemplos.1.p':    'We calculate real pass coefficient and waste per material (ceramics, aggregates, steel). Avoid stock shortages and hidden overcosts in purchasing.',
      'ejemplos.2.h':    '2. GENERAL EXPENSES (GE) AND INDUSTRIAL PROFIT (IP)',
      'ejemplos.2.p':    'Detailed analysis of indirect costs. We structure the overhead and profit percentages your market requires — for example the <span class="highlight-gold">13% overhead and 6% profit</span> standard in Spanish public tenders — so your margin is real and defensible before any audit or client.',
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
      'cfaq.4.a':  'We deliver the budget in <strong>Excel, PDF and BC3</strong> as standard. BC3 is compatible with the software most used in Spain (Presto, TCQ, Arquímedes); if your market or your tender uses another standard, we adapt. If you need a specific format for your tender or client, just ask.',
      'cfaq.5.q':  'Can you modify the budget if the project changes?',
      'cfaq.5.a':  'Yes. We include a round of revisions within the service to adjust items, change specifications or update prices. If the change involves a substantial scope modification, we assess it and quote together.',
      'cfaq.6.q':  'Do you work with companies in any country?',
      'cfaq.6.a':  'We work <strong>100% remotely</strong> with contractors, developers and studios in any country — Spain, Latin America, the rest of Europe and the United States among them. There is no geographic limitation and all documentation is exchanged digitally. Every project is also priced from cost data for its actual market rather than a national average, so the estimate reflects the labor and material costs of the place it is being built.',
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
      'ri.total.label':'kumuliertes Budget · Beispiel in €',
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
      'proc.sub': 'Vier bewährte Phasen für maximale Präzision und finanzielle Tragfähigkeit von Anfang an. Die vollständige Liste der <a href="/servicios.html">Gewerke und Leistungen, die wir kalkulieren</a>, finden Sie hier.',
      'proc.1.h': 'Konzeptionelle Machbarkeit',
      'proc.1.p': 'Wir analysieren Pläne, Leistungsbeschreibungen und technische Unterlagen, um vor dem endgültigen Entwurf eine solide finanzielle Basis zu schaffen.',
      'proc.2.h': 'Aufmaß und Mengenermittlung',
      'proc.2.p': 'Genaue Quantifizierung aller Positionen — Materialien, Arbeit und Ausrüstung — nach BIM-Methodik, ohne eine einzige Einheit zu übersehen.',
      'proc.3.h': 'Value Engineering',
      'proc.3.p': 'Wir wenden aktuelle Marktpreise an und optimieren Ressourcen, um Kosten zu senken, ohne Qualität oder Vorschriften zu beeinträchtigen.',
      'proc.4.h': 'Übergabe und Ausschreibung',
      'proc.4.p': 'Sie erhalten die Kalkulation in Excel/PDF — und in BC3 oder dem Format Ihres Marktes —, bereit zur Vorlage bei Kunden, Ausschreibung oder Prüfung, mit vollständig aufgeschlüsselten Gemeinkosten, Gewinn und Verlusten.',
      'quien.h':   'Mit wem wir arbeiten',
      'quien.sub': 'Jeder Auftraggeber braucht ein anderes Ergebnis. Wir passen die Ausgabe daran an, wie Sie tatsächlich kalkulieren — <a href="/ejemplos.html">sehen Sie, wie eine fertige Kalkulation aussieht</a>.',
      'quien.1.h': 'Bauunternehmen',
      'quien.1.p': 'Gewerkeübergreifende Budgets und vollständige Angebotspakete, von der Konzeptphase bis zum verbindlichen Angebot. Lücken im Leistungsumfang werden schriftlich benannt, damit Sie wissen, was die Nachunternehmer nicht eingerechnet haben.',
      'quien.2.h': 'Nachunternehmer',
      'quien.2.p': 'Einzelgewerk-Massenermittlungen, kalkuliert für den Abgabetag. Pläne schicken, Mengen und Preise rechtzeitig zurückbekommen, um die Frist zu halten.',
      'quien.3.h': 'Projektentwickler und Bauherren',
      'quien.3.p': 'Budgets in Konzept- und Entwurfsphase für Machbarkeitsstudien, Finanzierungsunterlagen und Go/No-Go-Entscheidungen, fortgeschrieben mit dem Planungsstand.',
      'quien.4.h': 'Architekturbüros',
      'quien.4.p': 'Unabhängige Kostenkontrolle in Vor-, Entwurfs- und Ausführungsplanung, damit der Entwurf im Budget des Bauherrn bleibt, statt nachträglich wegoptimiert zu werden.',
      'faq.h2':    'Häufig gestellte Fragen zu Kostenschätzern',
      'faq.intro': 'Alles, was Sie wissen müssen, bevor Sie Ihre Baukostenschätzung auslagern. Wenn Sie lieber mit <a href="/nosotros.html">den Menschen hinter den Zahlen</a> beginnen möchten, fangen Sie dort an.',
      'faq.1.q':   'Warum ein externes Kostenschätzungsunternehmen beauftragen?',
      'faq.1.a':   'Die Auslagerung an einen <em>Cost Estimator</em> bringt Objektivität, eliminiert interne Fehler durch Arbeitsüberlastung, garantiert aktuelle Preisdatenbanken und entlastet Ihr technisches Team.',
      'faq.2.q':   'Für welche Bauprojekte erstellen Sie Kostenvoranschläge?',
      'faq.2.a':   'Wir erstellen umfassende Schätzungen für Wohngebäude, Gewerbeprojekte, Industriehallen und Tiefbau. Wir passen unsere Metriken an Struktur und Ausbaustandard an.',
      'faq.3.q':   'Wie präzise sind Ihre Baukostenvoranschläge?',
      'faq.3.a':   'Wir arbeiten mit den niedrigsten Fehlerquoten der Branche, kombiniert aus digitaler Messtechnologie (BIM) und manueller Validierung durch erfahrene Bauingenieure.',
      'faq.4.q':   'Was ist der Unterschied zwischen Massenermittlung und Kostenschätzung?',
      'faq.4.a':   'Die Massenermittlung ist die Zählung: wie viele laufende Meter Trennwand, wie viele Lichtpunkte, wie viele Kubikmeter Beton — jede Zahl bis zum Plan nachvollziehbar. Die Kostenschätzung ist diese Massenermittlung mit Preisen: Marktpreise, Verschnitt, Lohnkosten sowie Gemeinkosten und Gewinn getrennt ausgewiesen. Wir liefern beides, denn ohne die Massenermittlung dahinter lässt sich eine Kalkulation niemandem gegenüber verteidigen.',
      'faq.5.q':   'Arbeiten Sie mit BIM-Modellen oder nur mit PDF-Plänen?',
      'faq.5.a':   'Mit beidem. Schicken Sie uns ein BIM-Modell, entnehmen wir die Mengen direkt daraus, was die Fehlerquote senkt und die Bearbeitungszeit verkürzt. Haben Sie nur PDF oder DWG, messen wir auf dem Plan mit farbiger Kennzeichnung, sodass Sie jede Position in Sekunden prüfen können. Ein bestimmtes Format ist für den Start nicht erforderlich.',
      'faq.6.q':   'Können Sie die Kalkulation für eine öffentliche Ausschreibung erstellen?',
      'faq.6.a':   'Ja, das gehört zu unserem Alltag. Wir passen die Gliederung an das von den Vergabeunterlagen geforderte Format an, liefern in den Formaten, die Ihre Bausoftware liest, und halten Ausschlüsse und Annahmen schriftlich fest: genau das entscheidet in der Regel den Zuschlag, wenn zwei Angebote dicht beieinanderliegen.',

      /* SERVICES PAGE */
      'services.h2':      'Einsatzbereiche und Spezialisierungen',
      'services.sub':     'Wir erstellen hochpräzise Budgets, angepasst an die spezifischen Anforderungen jeder Disziplin.',
      'services.construccion.h3': 'Wohnbauprojekte und Wohnbebau',
      'services.construccion.p':  'Vollständige Aufschlüsselungen von Erdarbeiten bis zu den Fertigstellungsarbeiten, damit Ihr Immobilienprojekt oder Einfamilienhaus keine Abweichungen erleidet.',
      'services.publica.h3':     'Ausschreibungen öffentlicher Bauvorhaben',
      'services.publica.p':      'Formate angepasst an jede Vergabestelle: strikte Einhaltung der Ausschreibungsbedingungen und Lieferung im Format, das Ihre Ausschreibung verlangt, standardisiertes BC3 inklusive.',
      'services.fontaneria.h3':  'Technische Anlagen (MEP)',
      'services.fontaneria.p':   'Spezialisten für Elektro, <strong>Sanitär</strong>, Entwässerung und <strong>Brandschutz</strong>. Strenge Einhaltung der Vorschriften Ihres Marktes: REBT, CTE und RSCIEI in Spanien, NEC und NFPA in den USA und die lokalen Vorschriften, wo immer Sie bauen.',
      'services.albanileria.h3': 'Spezialgewerke',
      'services.albanileria.p':  'Sorgfältige Aufmaße für <strong>Mauerwerk</strong>, Tischlerei (Holz und Metall), Verglasung, Aluminium und Stahl. Kein einziges Beschlägteil bleibt unquantifiziert.',
      'services.methodology.h3': 'Was beinhaltet jedes unserer Budgets?',
      'services.methodology.1':  '<strong>Quantifizierung von Materialeinheiten und Preisen:</strong> UVP und NETTO aktualisiert auf aktuelle reale Marktpreise.',
      'services.methodology.2':  '<strong>Möglichkeit zur Anpassung von Schwund</strong>, Inflationsindizes, Gemeinkosten, Gewinn und anderen Elementen.',
      'services.methodology.3':  '<strong>Technische Aufschlüsselung:</strong> Preis pro Ausführungseinheit inklusive Arbeitskraft und Materialien.',
      'services.methodology.4':  '<strong>Technisches Datenblatt für den Kunden:</strong> Beschreibung der ausgeführten Arbeiten und Endpreis.',
      'services.methodology.5':  '<strong>Endlieferung in verschiedenen Formaten:</strong> Excel, PDF, BC3 oder das Format, das Ihr Markt oder Kunde verlangt.',
      'services.methodology.6':  '<strong>Kundendienst nach dem Verkauf:</strong> Wenn Sie Anpassungen benötigen, führen wir diese durch.',
      'services.cta':            'Portfolio ansehen',

      /* NOSOTROS PAGE */
      'nosotros.h2':      'Mehr als Zahlen: Architektur im Dienst Ihrer Rentabilität.',
      'nosotros.sub':     'Pr3cise ist ein technisches und höheres Architekturbüro mit Jahrzehnten an Erfahrung im Hochbau: Wir machen aus jeder Kalkulation ein echtes Entscheidungswerkzeug, denn ein schlecht kalkuliertes Budget ist ein Projekt, das tot geboren wird.',
      'nosotros.p1':      'Unser Team besteht aus technischen und höheren Architekten, Anlagenbauingenieuren und Projektmanagement-Spezialisten mit einer fundierten Laufbahn im Bausektor. Wir kombinieren technische Präzision mit einer strategischen Kostenperspektive, die jedes Budget zu einem echten Entscheidungsinstrument macht, nicht zu einer einfachen Aufstellung von Positionen.',
      'nosotros.p2':      'Wir arbeiten nach internationalen Projektmanagement-Standards (PMBOK, IPMA) und wenden die technischen Vorschriften des Landes an, in dem gebaut wird: CTE, RITE, RSCIEI und REBT in Spanien, die Eurocodes samt nationalen Anhängen im übrigen Europa und die CSI-MasterFormat-Gliederung mit dem lokalen Baurecht in den USA — und in jedem anderen Markt die dort geltenden Vorschriften. Wenn wir ein Budget liefern, liefern wir eine autorisierte, nachvollziehbare und verteidigungsfähige Kostenbasis gegenüber jedem Kunden, jeder Verwaltung und jedem Audit.',
      'nosotros.1.h':     'Echte Baustellenerfahrung',
      'nosotros.1.p':     'Wir wissen, wie gebaut wird, daher wissen wir, was budgetiert werden muss. Wir vermeiden die "Vergesslichkeiten", die Ihre Margen zerstören.',
      'nosotros.2.h':     'Technische Spezialisierung',
      'nosotros.2.p':     'Wir beherrschen die technischen Vorschriften jedes Marktes — CTE, RITE und RSCIEI in Spanien, die Eurocodes in Europa, den Florida Building Code samt Hurrikanzonen-Anforderungen in Miami-Dade —, damit jede Sanitär-, Brandschutz- oder Mauerwerksposition dem Gesetz und der Ausführungsrealität entspricht.',
      'nosotros.3.h':     'Pr3cise-Engagement',
      'nosotros.3.p':     'Wir bieten seit Jahren einen qualitativ hochwertigen Service basierend auf Transparenz und Geschwindigkeit. Ihr Erfolg ist unsere Wachstumsmetrik.',
      'nosotros.cta':    'Unsere Leistungen ansehen',

      /* EJEMPLOS PAGE */
      'ejemplos.h2':     'Budgets mit Baustellen-Intelligenz: Der Pr3cise-Standard',
      'ejemplos.sub':    'Wir liefern Management-Werkzeuge für Ihr Projekt: Jede Position kommt mit detaillierter Messung, realen Verschnittfaktoren und aufgeschlüsselten Margen (Gemeinkosten und Gewinn) — keine einfache Preisliste.',
      'ejemplos.1.h':    '1. VERSCHWENDUNG- UND VERLUSTKONTROLLE',
      'ejemplos.1.p':    'Wir berechnen den echten Passkoeffizienten und Verlust pro Material (Keramik, Zuschlagstoffe, Stahl). Vermeiden Sie Lagerengpässe und versteckte Überkosten beim Einkauf.',
      'ejemplos.2.h':    '2. ALLGEMEINE KOSTEN (AK) UND INDUSTRIELLE GEWINN (IG)',
      'ejemplos.2.p':    'Detaillierte Analyse indirekter Kosten. Wir strukturieren die Gemeinkosten- und Gewinnprozentsätze Ihres Marktes — zum Beispiel die in spanischen Ausschreibungen üblichen <span class="highlight-gold">13 % und 6 %</span> —, damit Ihre Marge echt und gegenüber jeder Prüfung oder jedem Kunden verteidigungsfähig ist.',
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
      'cfaq.4.a':  'Wir liefern das Budget standardmäßig in den Formaten <strong>Excel, PDF und BC3</strong>. Das BC3-Format ist mit der in Spanien gängigsten Baumanagementsoftware (Presto, TCQ, Arquímedes) kompatibel; nutzt Ihr Markt oder Ihre Ausschreibung einen anderen Standard, passen wir uns an. Bei Bedarf an einem spezifischen Format für Ihre Ausschreibung oder Ihren Kunden, fragen Sie uns.',
      'cfaq.5.q':  'Können Sie das Budget anpassen, wenn sich das Projekt ändert?',
      'cfaq.5.a':  'Ja. Wir schließen eine Überarbeitungsrunde in den Service ein, um Positionen anzupassen, Spezifikationen zu ändern oder Preise zu aktualisieren. Bei wesentlichen Umfangsänderungen bewerten und kalkulieren wir diese gemeinsam.',
      'cfaq.6.q':  'Arbeiten Sie mit Unternehmen aus jedem Land?',
      'cfaq.6.a':  'Wir arbeiten <strong>100% remote</strong> mit Bauunternehmen, Entwicklern und Büros aus jedem Land — darunter Spanien, Lateinamerika, das übrige Europa und die USA. Es gibt keine geografische Einschränkung und die gesamte Dokumentation wird digital ausgetauscht. Zudem wird jedes Projekt mit Preisdaten seines tatsächlichen Marktes kalkuliert und nicht mit einem nationalen Durchschnitt, sodass die Kalkulation die Lohn- und Materialkosten des Bauorts abbildet.',
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
      'ri.total.label':'budget cumulé · exemple en €',
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
      'proc.sub': 'Quatre phases éprouvées pour garantir précision maximale et viabilité financière dès le premier jour. La liste complète des <a href="/servicios.html">corps d\'état et prestations que nous chiffrons</a> est ici.',
      'proc.1.h': 'Faisabilité conceptuelle',
      'proc.1.p': 'Nous analysons plans, mémoires et spécifications techniques pour construire une base financière solide avant la conception finale.',
      'proc.2.h': 'Métrés et quantitatifs',
      'proc.2.p': "Quantification précise de chaque poste — matériaux, main-d'œuvre et équipements — sans aucune unité oubliée, avec la méthodologie BIM.",
      'proc.3.h': 'Ingénierie de la valeur',
      'proc.3.p': 'Nous appliquons des prix de marché actualisés et optimisons les ressources pour réduire les coûts sans compromettre la qualité ni la réglementation.',
      'proc.4.h': "Livraison et appel d'offres",
      'proc.4.p': 'Vous recevez le devis en Excel/PDF — et en BC3 ou dans le format de votre marché —, prêt à présenter aux clients, à soumissionner ou à auditer, avec frais généraux, bénéfice et pertes détaillés.',
      'quien.h':   'Avec qui nous travaillons',
      'quien.sub': 'Chaque client attend un livrable différent. Nous adaptons le format à votre façon de répondre aux appels d\'offres — <a href="/ejemplos.html">voyez à quoi ressemble un devis terminé</a>.',
      'quien.1.h': 'Entreprises générales',
      'quien.1.p': 'Budgets tous corps d\'état et dossiers d\'offre complets, de l\'esquisse à l\'offre ferme. Les manques dans le périmètre sont signalés par écrit, pour que vous sachiez ce que les sous-traitants n\'ont pas inclus.',
      'quien.2.h': 'Sous-traitants',
      'quien.2.p': 'Métrés d\'un seul corps d\'état chiffrés pour le jour de la remise. Vous envoyez les plans, vous recevez quantités et prix à temps pour tenir le délai.',
      'quien.3.h': 'Promoteurs et maîtres d\'ouvrage',
      'quien.3.p': 'Budgets de phase conceptuelle et de conception pour les études de faisabilité, les dossiers de financement et les décisions de poursuite, actualisés à mesure que les plans avancent.',
      'quien.4.h': 'Cabinets d\'architecture',
      'quien.4.p': 'Contrôle indépendant des coûts en esquisse, avant-projet et projet, pour que la conception reste dans le budget du maître d\'ouvrage au lieu d\'être rabotée après coup.',
      'faq.h2':    "Questions fréquentes sur les estimateurs de coûts",
      'faq.intro': "Tout ce que vous devez savoir avant d'externaliser votre estimation de coûts de construction. Si vous préférez commencer par <a href='/nosotros.html'>qui produit réellement les chiffres</a>, commencez là.",
      'faq.1.q':   "Pourquoi engager une entreprise externe d'estimation des coûts ?",
      'faq.1.a':   "Externaliser à un <em>cost estimator</em> apporte objectivité, élimine les erreurs internes dues à la surcharge, garantit l'utilisation de bases de données de prix actualisées et libère votre équipe technique.",
      'faq.2.q':   'Pour quels types de projets établissez-vous des budgets ?',
      'faq.2.a':   'Nous réalisons des estimations complètes pour la construction résidentielle, les projets commerciaux, les entrepôts industriels et le génie civil. Nous adaptons nos métriques au type de structure et aux finitions requises.',
      'faq.3.q':   'Quelle est la précision de vos budgets de construction ?',
      'faq.3.a':   "Nous travaillons avec les marges d'erreur les plus faibles du secteur, grâce à la technologie de mesure numérique (BIM) et la validation manuelle par des ingénieurs civils expérimentés.",
      'faq.4.q':   'Quelle différence entre un métré et un devis d\'exécution ?',
      'faq.4.a':   'Le métré, c\'est le comptage : combien de mètres linéaires de cloison, combien de points lumineux, combien de mètres cubes de béton, chaque chiffre traçable jusqu\'au plan. Le devis, c\'est ce métré chiffré, avec prix du marché, pertes, main-d\'œuvre, frais généraux et bénéfice détaillés. Nous livrons les deux, car sans le métré derrière, un devis ne se défend devant personne.',
      'faq.5.q':   'Travaillez-vous à partir de maquettes BIM ou seulement de plans PDF ?',
      'faq.5.a':   'Les deux. Si vous envoyez une maquette BIM, nous extrayons les quantités du modèle lui-même, ce qui réduit la marge d\'erreur et raccourcit le délai. Si vous n\'avez que du PDF ou du DWG, nous mesurons sur plan avec un repérage en couleurs, pour que vous puissiez vérifier n\'importe quel poste en quelques secondes. Aucun format particulier n\'est exigé pour démarrer.',
      'faq.6.q':   'Pouvez-vous préparer le devis pour un appel d\'offres public ?',
      'faq.6.a':   'Oui, c\'est l\'une de nos missions courantes. Nous adaptons la décomposition au format exigé par le dossier de consultation, livrons dans les formats que lit votre logiciel de gestion de chantier, et consignons par écrit les exclusions et les hypothèses : c\'est souvent ce qui décide de l\'attribution quand deux offres sont proches.',

      /* SERVICES PAGE */
      'services.h2':      'Secteurs d\'intervention et spécialités',
      'services.sub':     'Nous établissons des budgets de haute précision adaptés aux besoins spécifiques de chaque discipline.',
      'services.construccion.h3': 'Projets de logement et construction résidentielle',
      'services.construccion.p':  'Décomptes complets des travaux de terrassement aux finitions, pour éviter tout écart dans votre promotion immobilière ou maison individuelle.',
      'services.publica.h3':     'Appels d\'offres de travaux publics',
      'services.publica.p':      'Formats adaptés à chaque administration publique : stricte conformité aux cahiers des charges et livraison dans le format exigé par votre appel d\u2019offres, BC3 normalisé inclus.',
      'services.fontaneria.h3':  'Installations techniques (MEP)',
      'services.fontaneria.p':   'Spécialistes en électricité, <strong>plomberie</strong>, assainissement et <strong>protection incendie</strong>. Conformité rigoureuse à la réglementation de votre marché : REBT, CTE et RSCIEI en Espagne, NEC et NFPA aux États-Unis, et la réglementation locale où que vous construisiez.',
      'services.albanileria.h3': 'Métiers spécialisés',
      'services.albanileria.p':  'Métrés méticuleux pour <strong>maçonnerie</strong>, menuiserie (bois et métal), vitrerie, aluminium et acier. Aucune quincaillerie n\'est laissée sans quantification.',
      'services.methodology.h3': 'Que comprend chacun de nos budgets ?',
      'services.methodology.1':  '<strong>Quantification des unités de matériaux et prix :</strong> PV et NET mis à jour aux prix réels du marché actuel.',
      'services.methodology.2':  '<strong>Possibilité de modifier les pertes</strong>, indices d\u2019inflation, frais généraux, bénéfice et autres éléments.',
      'services.methodology.3':  '<strong>Décomposition technique :</strong> Prix par unité d\'exécution incluant main-d\'œuvre et matériaux.',
      'services.methodology.4':  '<strong>Fiche technique pour le client :</strong> Description des travaux réalisés et prix final.',
      'services.methodology.5':  '<strong>Livraison finale dans différents formats :</strong> Excel, PDF, BC3 ou tout format exigé par votre marché ou votre client.',
      'services.methodology.6':  '<strong>Support après-vente :</strong> Si vous avez besoin d\'ajustements, nous les effectuons.',
      'services.cta':            'Voir notre portfolio',

      /* NOSOTROS PAGE */
      'nosotros.h2':      'Plus que des chiffres : l\'architecture au service de votre rentabilité.',
      'nosotros.sub':     'Pr3cise est un cabinet d\'architecture technique et supérieure avec des décennies d\'expérience dans le bâtiment : nous faisons de chaque devis un véritable outil de décision, car un budget mal calculé est un projet qui naît mort.',
      'nosotros.p1':      'Notre équipe est composée d\'architectes techniques et supérieurs, d\'ingénieurs d\'installations et de spécialistes en gestion de projet avec une trajectoire consolidée dans le secteur de la construction. Nous combinons la précision technique avec une vision stratégique du coût qui transforme chaque budget en un véritable outil de décision, pas une simple liste de postes.',
      'nosotros.p2':      'Nous travaillons selon les normes internationales de gestion de projet (PMBOK, IPMA) et appliquons la réglementation technique du pays où l\'on construit : CTE, RITE, RSCIEI et REBT en Espagne, les Eurocodes et leurs annexes nationales dans le reste de l\'Europe, et la codification CSI MasterFormat avec le code local aux États-Unis — et sur tout autre marché, la réglementation locale en vigueur. Lorsque nous livrons un budget, nous livrons une ligne de base de coût autorisée, traçable et défendable devant tout client, administration ou audit.',
      'nosotros.1.h':     'Expérience réelle sur chantier',
      'nosotros.1.p':     'Nous savons comment construire, c\'est pourquoi nous savons ce qu\'il faut budgétiser. Nous évitons les "oublis" qui détruisent vos marges.',
      'nosotros.2.h':     'Spécialisation technique',
      'nosotros.2.p':     'Nous maîtrisons la réglementation technique de chaque marché — CTE, RITE et RSCIEI en Espagne, les Eurocodes en Europe, le Florida Building Code et ses exigences de zone cyclonique à Miami-Dade — pour que chaque poste de plomberie, protection incendie ou maçonnerie respecte la loi et la réalité d\'exécution.',
      'nosotros.3.h':     'Engagement Pr3cise',
      'nosotros.3.p':     'Nous offrons depuis des années un service de qualité basé sur la transparence et la rapidité. Votre succès est notre métrique de croissance.',
      'nosotros.cta':    'Voir nos services',

      /* EJEMPLOS PAGE */
      'ejemplos.h2':     'Budgets avec Intelligence de Chantier : Le standard Pr3cise',
      'ejemplos.sub':    'Nous livrons des outils de gestion pour votre projet : chaque poste arrive avec son métré détaillé, ses pertes réelles et ses marges (frais généraux et bénéfice) détaillées — pas une simple liste de prix.',
      'ejemplos.1.h':    '1. CONTRÔLE DES DÉCHETS ET PERTES',
      'ejemplos.1.p':    'Nous calculons le coefficient de passage réel et les pertes par matériau (céramiques, granulats, acier). Évitez les ruptures de stock et les surcoûts cachés lors de l\'achat.',
      'ejemplos.2.h':    '2. FRAIS GÉNÉRAUX (FG) ET BÉNÉFICE INDUSTRIEL (BI)',
      'ejemplos.2.p':    'Analyse détaillée des coûts indirects. Nous structurons les pourcentages de frais généraux et de bénéfice exigés par votre marché — par exemple les <span class="highlight-gold">13 % et 6 %</span> usuels des marchés publics espagnols — pour que votre marge soit réelle et défendable devant tout audit ou client.',
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
      'cfaq.4.a':  'Nous livrons le budget en <strong>Excel, PDF et BC3</strong> de manière standard. Le format BC3 est compatible avec les logiciels les plus utilisés en Espagne (Presto, TCQ, Arquímedes) ; si votre marché ou votre appel d\u2019offres utilise un autre standard, nous nous adaptons. Si vous avez besoin d\'un format spécifique pour votre appel d\'offres ou votre client, contactez-nous.',
      'cfaq.5.q':  'Pouvez-vous modifier le budget si le projet change ?',
      'cfaq.5.a':  'Oui. Nous incluons un cycle de révisions dans le service pour ajuster les postes, modifier les spécifications ou mettre à jour les prix. Si le changement implique une modification substantielle du périmètre, nous l\'évaluons et le chiffrons ensemble.',
      'cfaq.6.q':  'Travaillez-vous avec des entreprises de tout pays ?',
      'cfaq.6.a':  'Nous travaillons <strong>100% à distance</strong> avec des constructeurs, promoteurs et bureaux de tout pays : l\'Espagne, l\'Amérique latine, le reste de l\'Europe et les États-Unis notamment. Aucune limite géographique et toute la documentation est échangée numériquement. Chaque projet est en outre chiffré à partir des données de prix de son marché réel et non d\'une moyenne nationale, de sorte que le devis reflète les coûts de main-d\'œuvre et de matériaux du lieu de construction.',
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

  /* ─── Detección de idioma ──────────────────────────────────────────
     2026-08-03 | Sustituye a la antigua detección por IP contra api.country.is.
     Dos motivos:

     1. RGPD. Aquella llamada enviaba la IP del visitante (dato personal) a un
        tercero en cada carga, antes de cualquier consentimiento.
     2. SEO. Podía forzar 'en' por IP, y como Googlebot rastrea sobre todo desde
        EE.UU., servía la web española traducida al inglés sobre la MISMA URL:
        contenido duplicado y señal de idioma contradictoria.

     navigator.language es además mejor señal que la IP: refleja el idioma que
     la persona ha elegido, no dónde está físicamente. No sale ningún dato del
     navegador y desaparece una petición externa.

     Solo cubre alemán y francés, que no tienen URL propia. El inglés nunca se
     autodetecta: vive en /en/ con su URL real y se alcanza por hreflang o por
     el selector de idioma. */
  function detectBrowserLang() {
    if (localStorage.getItem('pr3cise_lang')) return; /* el usuario ya eligió */

    var langs = navigator.languages || [navigator.language || ''];
    for (var i = 0; i < langs.length; i++) {
      var code = String(langs[i]).slice(0, 2).toLowerCase();
      /* 'es' y 'en' se ignoran a propósito: cada uno tiene su propia URL */
      if (code === 'de' || code === 'fr') {
        if (code === currentLang) return;
        currentLang = code;
        applyTranslations(code);
        return;
      }
      if (code === 'es' || code === 'en') return; /* preferencia clara: no tocar */
    }
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

  /* 2026-08-10 | RETIRADA la redirección automática a /en/.

     Se añadió para llevar al visitante que ya había elegido inglés desde una URL
     española a su equivalente en /en/. Creaba una trampa sin salida:

       1. Con 'en' guardado, entrar en / te mandaba a /en/.
       2. Las páginas /en/ no cargan este script, así que el enlace "Español"
          del selector no podía guardar la preferencia antes de navegar.
       3. Volvías a / … y / te rebotaba otra vez a /en/.

     El resultado era que la home española quedaba inalcanzable: desaparecía el
     plano interactivo (que solo existe en /) y el selector de idioma parecía
     roto. La navegación entre idiomas se resuelve con los enlaces reales del
     selector y las etiquetas hreflang, que es lo que recomienda Google. */

  function init() {
    /* 2026-08-12 | ?lang= explicito en la URL manda sobre lo guardado (deep-link
       desde los footers ingleses hacia /legal.html?lang=en) */
    var qLang = null;
    try { qLang = new URLSearchParams(location.search).get('lang'); } catch (e) {}
    if (qLang && T[qLang]) {
      currentLang = qLang;
      try { localStorage.setItem('pr3cise_lang', qLang); } catch (e) {}
    }

    if (!T[currentLang]) currentLang = 'es';

    /* 2026-08-23 | Los cuatro idiomas tienen ya URL propia: /, /en/, /de/ y
       /fr/. El idioma de una página es el que declara su <html lang>, y no se
       traduce nada en caliente: traducir por JavaScript sobre otra URL es el
       contenido duplicado que evitamos al crear /en/, y además dejaba /de/ en
       español a cualquier visitante sin preferencia guardada (el valor por
       defecto era 'es'). El diccionario sigue aquí porque el plano interactivo
       de la portada pide sus textos con I18N.t(). Al resto de idiomas se llega
       por los enlaces reales del selector y por hreflang, que es lo que
       recomienda Google. applyTranslations() y detectBrowserLang() quedan sin
       llamar a propósito. */
    var pageLang = document.documentElement.getAttribute('lang') || 'es';
    currentLang = T[pageLang] ? pageLang : 'es';
    var flagImg = document.getElementById('lang-flag-img');
    if (flagImg && FLAG_IMGS[currentLang]) {
      flagImg.src = FLAG_IMGS[currentLang];
      flagImg.alt = currentLang.toUpperCase();
    }
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
