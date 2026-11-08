/**
 * Pr3cise — i18n (Internationalisation)
 * Languages: es | en | de | fr
 * Each language lives on its own static URL (/, /en/, /de/, /fr/).
 * Explicit ?lang= query parameter is supported for shared pages like /legal.html?lang=en.
 */
(function () {
  'use strict';

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
      'hero.eyebrow': 'Florida · Europa · Clientes en todo el mundo',
      'hero.h1':      'Mediciones y <span class="hero-highlight hero-precision">estimación de costes</span> de obra a precio cerrado.',
      'hero.h1.mob':  'Mediciones y <span class="hero-highlight hero-precision">estimación de costes</span> de obra a precio cerrado.',
      'hero.p':       'Desgloses partida a partida y takeoffs trazables elaborados por un arquitecto técnico. Trabajamos sobre todo en el <a href="/estimados-de-construccion-miami.html">Estado de Florida</a>, con clientes en toda Europa y alrededor del mundo — sin fronteras.',
      'hero.p.mob':   'Mediciones y presupuestos de obra a <span class="hero-highlight">precio cerrado</span> elaborados por un arquitecto técnico para constructoras, subcontratistas y estudios.',
      'hero.cta':     'Solicitar Presupuesto Gratuito',
      'hero.cta2':    'Ver Ejemplos de Presupuestos',
      'hero.trust.1': 'Precio cerrado por escrito antes de empezar',
      'hero.trust.2': 'Entrega habitual en 24–72 h',
      'hero.trust.3': 'Excel, PDF y BC3 · CSI MasterFormat',
      'hero.trust.4': 'Elaborado por arquitecto técnico',

      /* DELIVERABLES & TRUST PILLARS */
      'deliv.h2':    'Qué recibes en cada presupuesto',
      'deliv.sub':   'Documentación técnica trazable y lista para licitar, contratar subcontratas o defender tu oferta ante la propiedad.',
      'deliv.1.tag': 'Excel · PDF · BC3',
      'deliv.1.h':   'Desglose de precios unitarios',
      'deliv.1.p':   'Materiales, mano de obra, rendimientos y maquinaria separados en cada partida, con mermas calculadas por material.',
      'deliv.2.tag': 'CSI MasterFormat / Capítulos',
      'deliv.2.h':   'Medición trazable sobre plano',
      'deliv.2.p':   'Cada cantidad vinculada a planos marcados por colores para auditar cualquier partida en segundos sin rehacer el trabajo.',
      'deliv.3.tag': 'Transparencia comercial',
      'deliv.3.h':   'Alcance, gastos generales y exclusiones',
      'deliv.3.p':   'Gastos generales, beneficio industrial, supuestos de cálculo y exclusiones documentados por escrito para proteger tu margen.',
      'pillar.1.h':  'Precio cerrado por adelantado',
      'pillar.1.p':  'Cada encargo recibe presupuesto fijo y fecha de entrega por escrito antes de iniciar el trabajo. Sin cargos por horas imprevistos.',
      'pillar.2.h':  'Arquitecto técnico colegiado de formación',
      'pillar.2.p':  'Cada presupuesto lo elabora directamente un arquitecto técnico con décadas de experiencia en edificación.',
      'pillar.3.h':  'Confidencialidad estricta',
      'pillar.3.p':  'Tus planos, memorias y precios de proveedores se tratan de forma estrictamente confidencial y nunca se comparten con terceros.',
      'pillar.4.h':  'Estructura europea transparente',
      'pillar.4.p':  'Pr3cise está operada por Clear Ascend OÜ (registro 17448615, Estonia), trabajando 100 % en remoto con clientes internacionales.',

      /* PROBLEM */
      'prob.h2':    '¿Los errores de medición están reduciendo el margen de tus obras?',
      'prob.p1':    'En el estudio de referencia de Bent Flyvbjerg sobre <strong>258 proyectos de infraestructuras</strong> (<em>Journal of the American Planning Association</em>, 2002), <strong>9 de cada 10 obras superaron su presupuesto inicial</strong>, con una desviación media del <strong>28 %</strong>. Presentar una oferta sin una medición trazable expone tu margen desde el primer día.',
      'prob.p2':    'Externalizar tus mediciones te permite ofertar más licitaciones sin ampliar plantilla fija, con cantidades verificables sobre plano y costes adaptados al mercado real de la obra.',
      'prob.stat1': 'Proyectos con sobrecoste (Flyvbjerg, 258 obras)',
      'prob.stat2': 'Desviación media registrada (Flyvbjerg, 2002)',
      'prob.stat3': 'Entrega habitual según alcance',

      /* FLOOR PLAN */
      'ri.label':        'Presupuesto en tiempo real',
      'ri.title':        'Tu obra, partida a partida',
      'ri.total.label':  'presupuesto acumulado · ejemplo en €',
      'ri.scroll':       '↓ desplaza para explorar ↓',
      'ri.slider.label': 'ARRASTRA · CONTROL DE GASTOS',
      'ri.room.salon':   'SALÓN / COMEDOR',
      'ri.room.cocina':  'COCINA',
      'ri.room.bano':    'BAÑO',
      'ri.room.dorm1':   'DORMITORIO 1',
      'ri.room.dorm2':   'DORMITORIO 2',
      'ri.scale':        'ESCALA 1:50 · 85 m² · PLANTA BAJA',
      'ri.leg.p':        'Fontanería / Clim.',
      'ri.leg.e':        'Electricidad',
      'ri.leg.w':        'Ventanas',
      'ri.leg.d':        'Puertas',
      'ri.sum.p':        'Fontanería / Clim.',
      'ri.sum.e':        'Electricidad',
      'ri.sum.w':        'Ventanas',
      'ri.sum.d':        'Puertas',
      'ri.sum.total':    'Total reforma',
      'phase.p':         '01 · FONTANERÍA / CLIM.',
      'phase.e':         '02 · ELECTRICIDAD',
      'phase.w':         '03 · VENTANAS',
      'phase.d':         '04 · PUERTAS',
      'tag.p0.name':     'fontanería · cocina',
      'tag.p0.desc':     'Fregadero + lavavajillas + lavadora',
      'tag.p1.name':     'fontanería · baño',
      'tag.p1.desc':     'Ducha, WC, lavabo + tubería completa',
      'tag.p2.name':     'climatización',
      'tag.p2.desc':     '4× splits + conductos + instalación',
      'tag.e0.name':     'eléctrico · cuadro',
      'tag.e0.desc':     'Cuadro general + 9 circuitos protegidos',
      'tag.e1.name':     'eléctrico · iluminación',
      'tag.e1.desc':     'Puntos de luz LED toda la vivienda',
      'tag.e2.name':     'eléctrico · enchufes',
      'tag.e2.desc':     '24 puntos de corriente',
      'tag.w0.name':     'ventanas · salón',
      'tag.w0.desc':     '2× PVC doble acristalamiento',
      'tag.w1.name':     'ventanas · dormitorios',
      'tag.w1.desc':     '3× ventana + persiana enrollable',
      'tag.w2.name':     'ventanas · cocina',
      'tag.w2.desc':     'Corredera con mosquitera',
      'tag.d0.name':     'puertas · entrada',
      'tag.d0.desc':     'Blindada clase 3 + cerrojo',
      'tag.d1.name':     'puertas · interiores',
      'tag.d1.desc':     '4× puerta lacada blanca',

      /* PROCESS */
      'proc.h2':  'Cómo trabajamos: 4 pasos transparentes',
      'proc.sub': 'Un flujo claro desde que nos envías los planos hasta que entregas tu oferta. Consulta todos los <a href="/servicios.html">oficios y servicios que presupuestamos</a>.',
      'proc.1.h': 'Envío de planos y alcance',
      'proc.1.p': 'Nos remites planos (PDF, DWG o BIM), memorias y fecha límite. Revisamos la documentación sin coste.',
      'proc.2.h': 'Cotización cerrada y plazo',
      'proc.2.p': 'Recibes por escrito el alcance exacto, nuestros honorarios fijos y la fecha de entrega antes de empezar.',
      'proc.3.h': 'Medición y valoración técnica',
      'proc.3.p': 'Un arquitecto técnico realiza la medición sobre plano con marcado por colores y valora materiales, mano de obra y equipos.',
      'proc.4.h': 'Entrega lista para licitar',
      'proc.4.p': 'Entregamos en Excel, PDF y BC3 (o divisiones CSI MasterFormat), con supuestos, exclusiones y una ronda de revisión incluida.',

      /* WHO WE WORK WITH */
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

      /* DONDE TRABAJAMOS */
      'donde.h2':    'Foco principal en Florida. Clientes en toda Europa y el mundo.',
      'donde.sub':   'Trabajamos sobre todo en el Estado de Florida, al tiempo que acompañamos a constructoras, subcontratas, promotores y arquitectos en toda Europa y alrededor del mundo. Sin fronteras: los planos viajan en digital y adaptamos normativa, unidades y divisa a la ubicación real de tu obra.',
      'donde.1.h':   'Especialización en el Estado de Florida',
      'donde.1.p':   'Partidas estructuradas en CSI MasterFormat con costes regionales de Florida, integrando <a href="/estimados-de-construccion-miami.html">Florida Building Code, zona HVHZ y aprobaciones NOA en Miami-Dade y el sur de Florida</a> desde el primer número.',
      'donde.2.h':   'Europa y resto del mundo · Sin fronteras',
      'donde.2.p':   'Sin límites geográficos: entregamos en sistema métrico o imperial, en tu moneda local y en el estándar que exija tu pliego (CSI MasterFormat, BC3, Eurocódigos o Bill of Quantities).',
      'donde.3.h':   'Ventaja horaria para entregas más rápidas',
      'donde.3.p':   'Nuestra oficina técnica (Clear Ascend OÜ, Estonia) arranca 7 horas antes que la costa este de EE. UU., permitiendo medir durante la noche los planos enviados al cierre de tu jornada.',
      'donde.badge.main': 'Florida · Europa · Worldwide',
      'donde.badge.sub': 'No border limits · 100 % digital',
      'donde.outro': '¿Trabajas en Miami o el sur de Florida? Consulta nuestra página específica de <a href="/estimados-de-construccion-miami.html">estimados de construcción en Miami</a> o <a href="/contacto.html">envíanos tus planos para recibir cotización cerrada</a>.',

      /* FAQ */
      'faq.h2':    'Preguntas Frecuentes sobre Estimación de Costes',
      'faq.intro': 'Resolvemos las dudas habituales antes de enviarnos tus planos. También puedes conocer <a href="/nosotros.html">quién elabora realmente cada presupuesto</a>.',
      'faq.1.q':   '¿Por qué contratar a una consultoría externa de mediciones y presupuestos?',
      'faq.1.a':   'Externalizar la medición aporta objetividad, evita errores por picos de trabajo en época de licitaciones, incorpora precios de mercado contrastados y libera a tu equipo de obra para centrarse en contratar y ejecutar.',
      'faq.2.q':   '¿Qué tipo de proyectos de construcción presupuestáis?',
      'faq.2.a':   'Elaboramos mediciones y presupuestos para edificación residencial, reformas integrales, locales comerciales, oficinas, naves industriales e instalaciones MEP (electricidad, fontanería, climatización y PCI).',
      'faq.3.q':   '¿Quién elabora los presupuestos y qué rigor técnico tienen?',
      'faq.3.a':   'Cada presupuesto lo elabora directamente un arquitecto técnico con décadas de experiencia en edificación. Combinamos medición digital trazable sobre plano (PDF, DWG o BIM) con desglose completo de materiales, mano de obra, mermas, supuestos y exclusiones.',
      'faq.4.q':   '¿Qué diferencia hay entre una medición y un presupuesto de ejecución?',
      'faq.4.a':   'La medición es el recuento geométrico exacto trazable hasta el plano (metros cuadrados, metros lineales, unidades, pesos). El presupuesto valora esa medición con precios de mercado, mano de obra, mermas, gastos generales y beneficio industrial. Entregamos ambos para que puedas defender cada cifra.',
      'faq.5.q':   '¿Trabajáis con modelos BIM o solo con planos en PDF?',
      'faq.5.a':   'Con ambos. Si dispones de modelo BIM extraemos cantidades directamente del modelo; si trabajas con PDF o DWG medimos sobre plano con marcado por colores para auditar cualquier partida en segundos.',
      'faq.6.q':   '¿Podéis preparar el presupuesto para una licitación pública?',
      'faq.6.a':   'Sí. Adaptamos la estructura al pliego de condiciones, entregamos en BC3 editable además de Excel y PDF, y dejamos documentados los supuestos técnicos y las exclusiones.',
      'faq.7.q':   '¿Cómo se fijan vuestros honorarios?',
      'faq.7.a':   'Trabajamos siempre con precio cerrado por proyecto. Revisamos tus planos sin compromiso y te enviamos por escrito el alcance, el importe fijo y la fecha de entrega antes de empezar. No facturamos horas imprevistas.',
      'faq.8.q':   '¿Cómo protegéis la confidencialidad de mis planos y datos?',
      'faq.8.a':   'Toda la documentación técnica y económica recibida se utiliza exclusivamente para elaborar tu presupuesto, bajo estricta confidencialidad profesional. Si tu empresa requiere firmar un acuerdo de confidencialidad (NDA) antes de enviar los planos, lo firmamos sin problema.',

      /* TRUSTPILOT */
      'tp.h2':  'Lo que opinan nuestros clientes',
      'tp.sub': 'Valoraciones reales de profesionales que confían en Pr3cise para sus mediciones y estimaciones de costes.',

      /* SERVICES PAGE */
      'services.h2':             'Sectores de Actuación y Especialidades',
      'services.sub':            'Elaboramos mediciones y presupuestos detallados adaptados a los requisitos técnicos y normativos de cada disciplina.',
      'services.construccion.h3':'Proyectos de Viviendas y Edificación Residencial',
      'services.construccion.p': 'Desgloses completos desde el movimiento de tierras hasta los acabados, asegurando que tu promoción inmobiliaria o vivienda unifamiliar cuente con cantidades reales desde el inicio.',
      'services.publica.h3':     'Licitaciones de Obra Pública',
      'services.publica.p':      'Formatos adaptados a los requerimientos de cada administración pública: cumplimos los pliegos del organismo convocante y entregamos en BC3 estandarizado, Excel y PDF.',
      'services.fontaneria.h3':  'Instalaciones Técnicas (MEP)',
      'services.fontaneria.p':   'Especialistas en Electricidad, <strong>Fontanería</strong>, Saneamiento y <strong>PCI</strong> (Protección Contra Incendios). Cumplimiento riguroso de la normativa vigente allí donde construyas: Florida Building Code, NEC y NFPA en Florida, Eurocódigos y reglamentos nacionales en Europa, y el código local en cualquier otro país.',
      'services.albanileria.h3': 'Oficios Especializados',
      'services.albanileria.p':  'Mediciones minuciosas para <strong>Albañilería</strong>, Estructura de Hormigón, Carpintería (madera y metálica), Cristalería, Aluminio y Acero.',
      'services.methodology.h3': '¿Qué incluye cada uno de nuestros presupuestos?',
      'services.methodology.1':  '<strong>Cuantificación de unidades de materiales y precios:</strong> PVP y coste neto actualizados a precios reales del mercado donde se construye.',
      'services.methodology.2':  '<strong>Mermas, gastos generales y beneficio editables:</strong> hojas de cálculo abiertas para ajustar tus márgenes antes de ofertar.',
      'services.methodology.3':  '<strong>Desglose (o descompuesto) técnico:</strong> precio por unidad de ejecución separando mano de obra, materiales y maquinaria.',
      'services.methodology.4':  '<strong>Alcance, supuestos y exclusiones por escrito:</strong> qué incluye el precio, qué no incluye y qué indefiniciones presentan los planos.',
      'services.methodology.5':  '<strong>Entrega final en formatos abiertos:</strong> Excel, PDF, BC3 o estructura CSI MasterFormat según exija tu mercado.',
      'services.methodology.6':  '<strong>Ronda de revisión incluida:</strong> ajustamos partidas o precios ante adendas o cambios puntuales de especificación.',
      'services.where.h2':       'Dónde trabajamos',
      'services.where.p1':       'Pr3cise es una oficina técnica remota —Clear Ascend OÜ, sociedad registrada en Estonia— sin delegaciones físicas a las que tengas que desplazarte. Todo viaja como archivo: envías planos y memorias, un arquitecto técnico los mide y los valora, y recibes el presupuesto en el formato y con la normativa del mercado en el que se construye. Atendemos en español y en inglés.',
      'services.where.li1':      '<strong>Estado de Florida (foco principal)</strong> — partidas por divisiones CSI MasterFormat con costes regionales; en <a href="/estimados-de-construccion-miami.html">Miami-Dade y el sur de Florida</a> valoramos desde el principio el Florida Building Code, la zona HVHZ y las aprobaciones NOA de producto.',
      'services.where.li2':      '<strong>Toda Europa</strong> — mediciones y presupuestos con Eurocódigos y la normativa nacional de cada obra, en BC3, bill of quantities, Excel o PDF, licitación pública incluida.',
      'services.where.li3':      '<strong>Resto del mundo, sin fronteras</strong> — la estructura que pida el pliego (CSI MasterFormat, bill of quantities o tu propia plantilla), en sistema métrico o imperial y en tu moneda.',
      'services.where.p2':       'Nadie necesita pisar la obra para medir un plano, y nuestra jornada empieza siete horas antes que la costa este de Estados Unidos durante casi todo el año (seis horas en las breves semanas de cambio horario): los planos que envías al cerrar tu oficina se miden esa misma noche. Puedes ver <a href="/nosotros.html">quién elabora cada presupuesto</a>, leer <a href="/articulos/">nuestros artículos sobre presupuestos de obra</a>, repasar la oferta de un contratista con nuestra <a href="/revisar-presupuesto-lista.html">lista para revisar un presupuesto antes de firmar</a> o <a href="/contacto.html">solicitar presupuesto cerrado para tu próxima obra</a>.',
      'services.cta':            'Consulta nuestros ejemplos',

      /* NOSOTROS PAGE */
      'nosotros.h2':   'Arquitectura técnica aplicada al control real de costes de obra.',
      'nosotros.sub':  'Pr3cise cuenta con décadas de experiencia en el sector de la edificación. Cada presupuesto lo elabora directamente un arquitecto técnico para convertir tus planos en números trazables y defendibles.',
      'nosotros.p1':   'Detrás de cada presupuesto de Pr3cise hay un arquitecto técnico con décadas de experiencia real en edificación y control de costes. No delegamos tus planos en plantillas genéricas ni inflamos estructuras: quien lee tus detalles constructivos, mide cada partida y arma los descompuestos conoce cómo se ejecuta realmente la obra.',
      'nosotros.p2':   'Pr3cise está operada por Clear Ascend OÜ (sociedad registrada en Estonia, código 17448615) y trabaja 100 % en remoto, sobre todo en el Estado de Florida —con foco especial en Miami-Dade y el sur de Florida— y para clientes de toda Europa y del resto del mundo, sin fronteras. Estructuramos cada entrega según el estándar de tu licitación (divisiones CSI MasterFormat, BC3, Bills of Quantities o tu propia plantilla) con precio cerrado acordado antes de empezar y confidencialidad estricta sobre tus planos.',
      'nosotros.1.h':  'Elaborado por Arquitecto Técnico',
      'nosotros.1.p':  'Cada medición y cada precio descompuesto los prepara directamente un arquitecto técnico con décadas de trayectoria en edificación.',
      'nosotros.2.h':  'Criterio Constructivo Internacional',
      'nosotros.2.p':  'Adaptamos unidades, rendimientos y criterios de coste a cada obra: CSI MasterFormat y exigencias HVHZ/FBC en Florida, Eurocódigos y normativa nacional en Europa, y el código local en cualquier otro país.',
      'nosotros.3.h':  'Transparencia y Confidencialidad',
      'nosotros.3.p':  'Operamos desde Clear Ascend OÜ (Estonia) con honorarios fijos previos por escrito, plazos claros y tratamiento estrictamente confidencial de toda la documentación recibida.',
      'nosotros.cta':  'Ver nuestros servicios',

      /* MARIEDOM SECTION */
      'mariedom.label': 'Práctica Arquitectónica Vinculada',
      'mariedom.h3':    'Arquitectura, Diseño y Desarrollo Técnico — MARIEDOM',
      'mariedom.p1':    'Además de nuestros servicios de mediciones y estimación de costes, nuestro despacho de arquitectura desarrolla otros proyectos de arquitectura, diseño, documentación técnica y visualización 3D.',
      'mariedom.p2':    'Si quieres conocer más sobre nuestro trabajo arquitectónico, puedes visitar MARIEDOM.',
      'mariedom.cta':   'Descubrir MARIEDOM',

      /* EJEMPLOS PAGE */
      'ejemplos.h2':          'Ejemplos Reales de Presupuestos y Mediciones: El Estándar Pr3cise',
      'ejemplos.sub':         'Entregamos herramientas reales de licitación y control de costes: cada partida llega con su medición trazable sobre plano, sus mermas por material y sus gastos generales y beneficio desglosados.',
      'ejemplos.1.h':         '1. CONTROL DE MERMAS POR MATERIAL',
      'ejemplos.1.p':         'Calculamos el coeficiente de paso y mermas reales según cada familia de material (cerámicos, áridos, acero, conductos) para evitar desviaciones en compras.',
      'ejemplos.2.h':         '2. GASTOS GENERALES (GG) Y BENEFICIO INDUSTRIAL (BI)',
      'ejemplos.2.p':         'Desglose transparente de costes indirectos. Estructuramos los gastos generales y el beneficio como exija tu mercado —por ejemplo, los <span class="highlight-gold">porcentajes de GG y BI</span> que fije el pliego de una licitación pública, o el overhead &amp; profit de una oferta CSI— para proteger tu margen.',
      'ejemplos.3.h':         '3. HOJAS EDITABLES Y PRECIOS REGIONALES',
      'ejemplos.3.p':         'Bases de datos actualizadas y hojas Excel abiertas para que puedas ajustar precios de tus proveedores habituales o rendimientos de tus cuadrillas en segundos.',
      'ejemplos.4.h':         '4. MEDICIONES GEOMÉTRICAS TRAZABLES',
      'ejemplos.4.p':         'Cada línea de medición enlaza con planos marcados por colores. Transparencia total para certificaciones rápidas y revisiones sin fricciones.',
      'ejemplos.redact.note': 'Todas las muestras anteriores son extractos reales anonimizados de mediciones y presupuestos elaborados por un arquitecto técnico en Pr3cise — omitimos datos del cliente, emplazamiento y tarifas privadas para preservar la confidencialidad.',
      'ejemplos.cta':         'Solicitar presupuesto cerrado',

      /* CONTACTO PAGE */
      'contacto.h2':             'Solicita tu presupuesto cerrado sin compromiso',
      'contacto.sub':            'Envíanos los datos de tu obra y te respondemos en menos de 24 horas laborables con alcance, honorarios fijos y fecha de entrega.',
      'contacto.intro.1':        'Cada presupuesto lo elabora un arquitecto técnico partida a partida, separando materiales, mano de obra y equipos en Excel, PDF y BC3 o CSI MasterFormat. <strong>Entrega habitual entre 24 y 72 horas</strong> según alcance, con precio fijo cerrado por escrito antes de empezar.',
      'contacto.intro.2':        'La revisión inicial de tus planos es gratuita y confidencial. Trabajamos en remoto (Clear Ascend OÜ, Estonia) con constructoras, subcontratistas, promotores y estudios de arquitectura, sobre todo en el Estado de Florida y para clientes de toda Europa y del resto del mundo, sin fronteras.',
      'contacto.drawings.p':     '<strong>¿Tienes planos listos (PDF, DWG, Revit/IFC)?</strong> Pega un enlace de Google Drive, Dropbox, OneDrive o WeTransfer en el mensaje, o envíalos directamente a <a href="mailto:contact@pr3cise.com">contact@pr3cise.com</a>. Tratamos toda la documentación con estricta confidencialidad.',
      'contacto.lbl.nombre':     'Nombre',
      'contacto.lbl.empresa':    'Empresa',
      'contacto.lbl.email':      'Email profesional',
      'contacto.lbl.telefono':   'Teléfono (opcional)',
      'contacto.phone.code':     'Prefijo',
      'contacto.lbl.proyecto':   'Alcance requerido',
      'contacto.lbl.mensaje':    'Detalles del proyecto y enlace a planos',
      'contacto.opt.default':    'Selecciona alcance o disciplina',
      'contacto.opt.completo':   'Presupuesto completo multi-oficio (obra nueva / reforma)',
      'contacto.opt.takeoff':    'Medición de cantidades (Quantity Takeoff)',
      'contacto.opt.conceptual': 'Estimación conceptual / viabilidad preliminar',
      'contacto.opt.mep':        'Instalaciones completas MEP (Climatización, Elec., Font., PCI)',
      'contacto.opt.construccion':'Instalaciones eléctricas',
      'contacto.opt.fontaneria': 'Fontanería y saneamiento',
      'contacto.opt.pci':        'PCI (Protección Contra Incendios)',
      'contacto.opt.albanileria':'Estructura, hormigón y albañilería',
      'contacto.opt.carpinteria':'Acabados, tabiquería y carpintería',
      'contacto.opt.otro':       'Licitación pública / otro alcance',
      'contacto.captcha':        'Verificación rápida · Centra la burbuja para habilitar el envío',
      'contacto.level.drag':     'Arrastra el deslizador para centrar la burbuja',
      'contacto.submit':         'Solicitar Cotización Cerrada',
      'contacto.sent':           'Solicitud enviada correctamente. Te responderemos en menos de 24 horas laborables.',
      'contacto.error':          'Error al enviar. Por favor, escríbenos a contact@pr3cise.com.',

      /* CONTACT-PAGE FAQ */
      'cfaq.h2':  'Preguntas Frecuentes antes de enviar tus planos',
      'cfaq.sub': 'Cómo cotizamos, qué formatos aceptamos y cómo protegemos la información de tu proyecto.',
      'cfaq.1.q': '¿Cuánto tiempo tardáis en entregar un presupuesto?',
      'cfaq.1.a': 'Las mediciones de un oficio suelen entregarse en <strong>24–48 horas</strong> y los presupuestos completos en <strong>48–72 horas</strong> desde que recibimos la documentación completa. En obras de gran superficie o complejidad confirmamos la fecha exacta por escrito antes de empezar.',
      'cfaq.2.q': '¿Qué documentación necesitáis para cotizar el servicio?',
      'cfaq.2.a': 'Basta con los planos en PDF o DWG (o modelo BIM), la ubicación de la obra y las partidas que necesitas valorar. Si hay pliego de condiciones o estado de mediciones mudo, también lo revisamos.',
      'cfaq.3.q': '¿Revisar mis planos y darme precio tiene algún coste?',
      'cfaq.3.a': 'Ninguno. Revisamos los planos gratuitamente y te enviamos una propuesta con <strong>precio fijo cerrado y fecha de entrega</strong> antes de iniciar cualquier trabajo. Sin recargos horarios ni sorpresas.',
      'cfaq.4.q': '¿En qué formatos entregáis el presupuesto final?',
      'cfaq.4.a': 'Entregamos de serie en <strong>Excel editable y PDF</strong>, más planos marcados por colores, y también en <strong>BC3</strong> (compatible con Presto, Arquímedes y TCQ) o por divisiones <strong>CSI MasterFormat</strong>, según exija tu licitación.',
      'cfaq.5.q': '¿Incluís revisiones si hay cambios o adendas?',
      'cfaq.5.a': 'Sí. Cada encargo incluye una ronda de revisión para ajustar precios unitarios, márgenes o pequeñas adendas. Si el proyecto sufre un rediseño sustancial, acordamos la actualización previamente.',
      'cfaq.6.q': '¿Trabajáis con empresas de cualquier país?',
      'cfaq.6.a': 'Sí. Operamos <strong>100 % en remoto</strong> desde Clear Ascend OÜ (Estonia), sobre todo en el Estado de Florida y para clientes de toda Europa y del resto del mundo —sin fronteras—, valorando cada obra con precios y unidades locales.',
      'cfaq.7.q': '¿Podéis presupuestar instalaciones especializadas (MEP, eléctrica, PCI, fontanería)?',
      'cfaq.7.a': 'Sí. Medimos y valoramos instalaciones eléctricas, fontanería, saneamiento, climatización (HVAC) y protección contra incendios (PCI / NFPA), desglosando materiales, equipos y horas de montaje.',
      'cfaq.8.q': '¿Mis planos y precios quedan protegidos de forma confidencial?',
      'cfaq.8.a': 'Por completo. Tus planos, memorias y tarifas se emplean únicamente para preparar tu estimación y nunca se ceden a terceros. Firmamos NDA antes de recibir los archivos si lo solicitas.',

      /* PRICING PAGE */
      'pricing.h2':              'Inversión clara, sin sorpresas.',
      'pricing.basic.h3':        'Proyecto Individual (Precio Cerrado)',
      'pricing.basic.p':         'Desde 300 € <span class="tax">+ impuestos según alcance.</span>',
      'pricing.basic.delivery':  'Cotización fija previa y entrega habitual en 24–72 h.',
      'pricing.business.h3':     'Colaboración Recurrente (Volumen Mensual)',
      'pricing.business.p':      'Optimiza tu coste por licitación externalizando tus mediciones de forma continuada con un arquitecto técnico.',
      'pricing.business.volume':  'Para constructoras, subcontratas y estudios con flujo mensual.',
      'pricing.disclaimer':      'Nuestros presupuestos no son simples ofertas comerciales; son presupuestos técnicos desglosados partida a partida elaborados por un arquitecto técnico, listos para licitar, comprar y controlar el coste real durante toda la ejecución de la obra.',

      /* CTA FINAL */
      'cta.h2':  'Solicita un Presupuesto Cerrado para tu Próximo Proyecto',
      'cta.p':   'Envía tus planos y alcance. Recibirás una cotización fija por escrito, supuestos documentados y fecha de entrega confirmada antes de empezar a medir.',
      'cta.btn': 'Solicitar Presupuesto Gratuito',

      /* FOOTER */
      'footer.brand':      'Consultoría técnica de mediciones y estimación de costes de construcción operada por Clear Ascend OÜ (Estonia) para proyectos internacionales.',
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
      'footer.legal.4':    'Términos y Condiciones',
      'legal.title':       'Información Legal'
    },

    en: {
      /* NAV */
      'nav.about':    'About Us',
      'nav.services': 'Services',
      'nav.examples': 'Portfolio',
      'nav.contact':  'Contact',

      /* HERO */
      'hero.eyebrow': 'State of Florida · Europe · Clients Worldwide',
      'hero.h1':      'Fixed-fee <span class="hero-highlight hero-precision">construction estimating</span> and quantity takeoffs.',
      'hero.h1.mob':  'Fixed-fee <span class="hero-highlight hero-precision">construction estimating</span> and takeoffs.',
      'hero.p':       'Line-item cost estimates and traceable quantity takeoffs prepared directly by a technical architect. Primarily serving the <a href="/en/miami-construction-estimating-services.html">State of Florida</a>, with clients across Europe and around the world — no border limits.',
      'hero.p.mob':   'Fixed-fee quantity takeoffs and cost estimates prepared by a <span class="hero-highlight">technical architect</span> for GCs, subcontractors and architects.',
      'hero.cta':     'Request a Free Estimate',
      'hero.cta2':    'View Sample Estimates',
      'hero.trust.1': 'Fixed fee agreed before work begins',
      'hero.trust.2': '24–72h typical turnaround',
      'hero.trust.3': 'CSI MasterFormat · Excel, PDF & BC3',
      'hero.trust.4': 'Prepared by a technical architect',

      /* DELIVERABLES & TRUST PILLARS */
      'deliv.h2':    'Professional deliverables you can bid from',
      'deliv.sub':   'Every estimate is structured for real preconstruction review, subcontractor buyout and tender submission.',
      'deliv.1.tag': 'Excel · PDF · CSI MasterFormat',
      'deliv.1.h':   'Labour, material & equipment breakdown',
      'deliv.1.p':   'Every line item separates material, labour hours, crew rates and material-specific waste factors in editable spreadsheets.',
      'deliv.2.tag': 'Traceable Quantities',
      'deliv.2.h':   'Colour-coded drawing markups',
      'deliv.2.p':   'Every quantity links directly to marked-up drawings so your team can verify any measurement in seconds.',
      'deliv.3.tag': 'Commercial Clarity',
      'deliv.3.h':   'Documented scope, overhead & exclusions',
      'deliv.3.p':   'General conditions, overhead, profit, pricing assumptions and scope exclusions clearly written out.',
      'pillar.1.h':  'Fixed quotation upfront',
      'pillar.1.p':  'Every project receives a firm written fee and confirmed delivery date before work starts — zero unexpected hourly charges.',
      'pillar.2.h':  'Technical architect authorship',
      'pillar.2.p':  'Every estimate is prepared directly by a technical architect with decades of building construction experience.',
      'pillar.3.h':  'Strict confidentiality',
      'pillar.3.p':  'Your drawings, specifications and vendor pricing are treated confidentially, with NDA execution available on request.',
      'pillar.4.h':  'Transparent European company',
      'pillar.4.p':  'Operated 100% digitally by Clear Ascend OÜ (Estonia, Reg. 17448615) serving clients without borders.',

      /* PROBLEM */
      'prob.h2':    'Are takeoff gaps and rushed bids eroding your project margins?',
      'prob.p1':    'In Bent Flyvbjerg\'s landmark study of <strong>258 transport infrastructure projects</strong> (<em>Journal of the American Planning Association</em>, 2002), <strong>9 out of 10 projects exceeded their initial budget</strong>, with an average cost overrun of <strong>28%</strong>. Bidding without traceable quantities puts your margin at risk before construction starts.',
      'prob.p2':    'Outsourcing your estimating gives you reliable bid capacity without adding full-time overhead, backed by regional pricing for the market where the project is built.',
      'prob.stat1': 'Projects with cost overruns (Flyvbjerg, 258 projects)',
      'prob.stat2': 'Average cost overrun (Flyvbjerg, 2002)',
      'prob.stat3': 'Typical turnaround by scope',

      /* FLOOR PLAN */
      'ri.label':        'Real-time budget',
      'ri.title':        'Your project, line by line',
      'ri.total.label':  'accumulated budget · sample in €',
      'ri.scroll':       '↓ scroll to explore ↓',
      'ri.slider.label': 'DRAG · BUDGET CONTROL',
      'ri.room.salon':   'LIVING / DINING ROOM',
      'ri.room.cocina':  'KITCHEN',
      'ri.room.bano':    'BATHROOM',
      'ri.room.dorm1':   'BEDROOM 1',
      'ri.room.dorm2':   'BEDROOM 2',
      'ri.scale':        'SCALE 1:50 · 85 m² · GROUND FLOOR',
      'ri.leg.p':        'Plumbing / HVAC',
      'ri.leg.e':        'Electrical',
      'ri.leg.w':        'Windows',
      'ri.leg.d':        'Doors',
      'ri.sum.p':        'Plumbing / HVAC',
      'ri.sum.e':        'Electrical',
      'ri.sum.w':        'Windows',
      'ri.sum.d':        'Doors',
      'ri.sum.total':    'Total renovation',
      'phase.p':         '01 · PLUMBING / HVAC',
      'phase.e':         '02 · ELECTRICAL',
      'phase.w':         '03 · WINDOWS',
      'phase.d':         '04 · DOORS',
      'tag.p0.name':     'plumbing · kitchen',
      'tag.p0.desc':     'Sink + dishwasher + washing machine',
      'tag.p1.name':     'plumbing · bathroom',
      'tag.p1.desc':     'Shower, WC, basin + full pipework',
      'tag.p2.name':     'HVAC',
      'tag.p2.desc':     '4× splits + ducts + installation',
      'tag.e0.name':     'electrical · panel',
      'tag.e0.desc':     'MCB + 9 protected circuits',
      'tag.e1.name':     'electrical · lighting',
      'tag.e1.desc':     'LED light points throughout',
      'tag.e2.name':     'electrical · sockets',
      'tag.e2.desc':     '24 power outlets',
      'tag.w0.name':     'windows · living room',
      'tag.w0.desc':     '2× PVC double glazing',
      'tag.w1.name':     'windows · bedrooms',
      'tag.w1.desc':     '3× window + roller blind',
      'tag.w2.name':     'windows · kitchen',
      'tag.w2.desc':     'Sliding with mosquito screen',
      'tag.d0.name':     'doors · entrance',
      'tag.d0.desc':     'Security class 3 + deadbolt',
      'tag.d1.name':     'doors · interior',
      'tag.d1.desc':     '4× white lacquered door',

      /* PROCESS */
      'proc.h2':  'How our estimating process works',
      'proc.sub': 'Four transparent steps from drawing submission to bid-ready delivery. Explore the full list of <a href="/en/services.html">trades and services we estimate</a>.',
      'proc.1.h': 'Submit drawings & specs',
      'proc.1.p': 'Send PDF, DWG or BIM files, specifications and your bid deadline. Initial scope review is free.',
      'proc.2.h': 'Fixed fee & delivery date',
      'proc.2.p': 'We confirm exact scope, fixed project fee and delivery date in writing before any work begins.',
      'proc.3.h': 'Quantity takeoff & pricing',
      'proc.3.p': 'A technical architect prepares colour-coded drawing markups and prices labour, material and equipment.',
      'proc.4.h': 'Deliverable package',
      'proc.4.p': 'Receive editable Excel and PDF reports (plus CSI MasterFormat or BC3), documented exclusions and one revision round.',

      /* WHO WE WORK WITH */
      'quien.h':   'Who we work with',
      'quien.sub': 'Different buyers, different deliverables. We adjust the output to how you actually bid — <a href="/en/portfolio.html">see what a finished estimate looks like</a>.',
      'quien.1.h': 'General contractors',
      'quien.1.p': 'Multi-trade budgets and full bid packages, from conceptual through hard bid. Scope gaps flagged in writing so you know what the subs did not include.',
      'quien.2.h': 'Subcontractors',
      'quien.2.p': 'Single-trade takeoffs priced for bid day. Send the plans, get quantities and pricing back fast enough to still make the deadline.',
      'quien.3.h': 'Developers and owners',
      'quien.3.p': 'Conceptual and design-phase budgets for feasibility, lender packages and go/no-go decisions, updated as the drawings develop.',
      'quien.4.h': 'Architects',
      'quien.4.p': 'Independent cost checks at SD, DD and CD so the design stays inside the owner\'s number instead of getting value-engineered after the fact.',

      /* DONDE TRABAJAMOS */
      'donde.h2':    'Primary focus in Florida. Clients across Europe and around the world.',
      'donde.sub':   'We work primarily in the State of Florida, while supporting contractors, subcontractors, developers and architects across Europe and around the world. No border limits: drawings travel digitally and every estimate adapts to the building code, measurement system and currency of your jobsite.',
      'donde.1.h':   'State of Florida Specialization',
      'donde.1.p':   'CSI MasterFormat line items with regional Florida labor and material data — pricing <a href="/en/miami-construction-estimating-services.html">Florida Building Code, Miami-Dade HVHZ and NOA impact approvals across South Florida</a> from day one.',
      'donde.2.h':   'Europe & Worldwide · No Border Limits',
      'donde.2.p':   'No geographic restrictions: we deliver in imperial or metric units, in your local currency, structured to your tender standard (CSI MasterFormat, Bill of Quantities, Eurocodes or BC3).',
      'donde.3.h':   'Overnight Time-Zone Advantage',
      'donde.3.p':   'Our technical office (Clear Ascend OÜ, Estonia) starts 7 hours ahead of US Eastern Time, measuring overnight the drawings you send at the close of your afternoon.',
      'donde.badge.main': 'Florida · Europe · Worldwide',
      'donde.badge.sub': 'No border limits · 100% digital',
      'donde.outro': 'Bidding in South Florida? Visit our <a href="/en/miami-construction-estimating-services.html">Miami construction estimating page</a> or <a href="/en/contact.html">send your drawings for a fixed-fee quote</a>.',

      /* FAQ */
      'faq.h2':    'Frequently Asked Questions',
      'faq.intro': 'Key answers before sending your drawings. You can also read more about <a href="/en/about.html">who prepares every Pr3cise estimate</a>.',
      'faq.1.q':   'Why outsource construction estimating to Pr3cise?',
      'faq.1.a':   'Outsourcing gives you immediate estimating capacity for bid deadlines without hiring full-time overhead, while ensuring objective, traceable quantities and regional pricing.',
      'faq.2.q':   'What types of construction projects do you estimate?',
      'faq.2.a':   'We estimate residential developments, custom homes, commercial interiors, retail, hospitality, industrial buildings and specialized MEP, concrete and masonry scopes.',
      'faq.3.q':   'Who prepares the estimates?',
      'faq.3.a':   'Every estimate is prepared directly by a technical architect with decades of building construction experience, combining colour-coded digital takeoff markups with line-item labour, material and equipment breakdowns.',
      'faq.4.q':   'What is the difference between a quantity takeoff and a cost estimate?',
      'faq.4.a':   'A quantity takeoff measures every physical item on the drawings (areas, lengths, volumes, counts) traceable to colour-coded markups. A cost estimate prices those quantities with local material rates, labour hours, waste factors, overhead and profit.',
      'faq.5.q':   'Do you work from BIM models or PDF drawings?',
      'faq.5.a':   'Both. We extract quantities from BIM/IFC models when available, or measure directly from PDF and DWG drawing sets with colour-coded takeoff markups.',
      'faq.6.q':   'Can you format estimates for public tenders or CSI MasterFormat?',
      'faq.6.a':   'Yes. We structure every estimate to the tender\'s standard: CSI MasterFormat divisions, Bills of Quantities (BoQ), or BC3 plus Excel and PDF for public tenders.',
      'faq.7.q':   'How does your fixed-fee pricing work?',
      'faq.7.a':   'Every project receives a fixed written quotation and confirmed delivery date after we review your drawings — before any work begins. There are never unexpected hourly charges.',
      'faq.8.q':   'How do you protect the confidentiality of our drawings?',
      'faq.8.a':   'All drawings, specifications and commercial information are treated strictly confidentially and used solely to prepare your estimate. We sign NDAs prior to file transfer whenever requested.',

      /* TRUSTPILOT */
      'tp.h2':  'What Our Clients Say',
      'tp.sub': 'Real feedback from professionals who trust Pr3cise with their construction estimating requirements.',

      /* SERVICES PAGE */
      'services.h2':             'Sectors of Operation and Specialties',
      'services.sub':            'Detailed quantity takeoffs and cost estimates tailored to the technical and code requirements of each trade.',
      'services.construccion.h3':'Residential & Commercial Building Projects',
      'services.construccion.p': 'Complete CSI or chapter breakdowns from earthwork and structure to finishes, giving developers and GCs traceable cost control.',
      'services.publica.h3':     'Public Works & Formal Tenders',
      'services.publica.p':      'Formatted strictly to tender specifications and delivered in editable Excel, PDF and standardised BC3 where required.',
      'services.fontaneria.h3':  'Technical Installations (MEP)',
      'services.fontaneria.p':   'Detailed takeoffs for Electrical, <strong>Plumbing</strong>, HVAC and <strong>Fire Protection</strong>, priced to the code where the project is built: Florida Building Code, NEC and NFPA in Florida, Eurocodes across Europe.',
      'services.albanileria.h3': 'Structural & Specialised Trades',
      'services.albanileria.p':  'Assembly-level takeoffs for Concrete, <strong>Masonry</strong>, Structural Steel, Drywall, Carpentry and Glazing.',
      'services.methodology.h3': 'What is included in every Pr3cise estimate?',
      'services.methodology.1':  '<strong>Material quantities and regional unit pricing:</strong> updated to current market rates where the project is built.',
      'services.methodology.2':  '<strong>Editable waste factors, overhead and profit:</strong> open formulas so you can adjust markups before submitting your bid.',
      'services.methodology.3':  '<strong>Labour, material and equipment separated:</strong> crew hours and unit rates visible on every line item.',
      'services.methodology.4':  '<strong>Written scope, assumptions and exclusions:</strong> clear documentation of what is included, excluded or ambiguous on the plans.',
      'services.methodology.5':  '<strong>Multi-format delivery:</strong> Excel, PDF, CSI MasterFormat or BC3, plus colour-coded takeoff markups.',
      'services.methodology.6':  '<strong>One revision round included:</strong> for addenda, specification updates or supplier quote adjustments.',
      'services.where.h2':       'Where we work',
      'services.where.p1':       'Pr3cise is a remote estimating consultancy — Clear Ascend OÜ, registered in Estonia — with no physical branch you need to drive to. Every job travels as a file: you send drawings and specs, a technical architect measures and prices them, and the estimate comes back in the format and against the building code of the market where the project is built.',
      'services.where.li1':      '<strong>State of Florida (primary focus)</strong> — line items by CSI MasterFormat division, priced with regional material and labor data. Across <a href="/en/miami-construction-estimating-services.html">Miami-Dade and South Florida</a>, the Florida Building Code, High-Velocity Hurricane Zone assemblies and Notice of Acceptance product approvals are priced in from the start rather than added later.',
      'services.where.li2':      '<strong>Across Europe</strong> — bills of quantities, pre-tender cost plans and BC3 deliverables in the structure the tender documents ask for, priced against the Eurocodes and their national annexes.',
      'services.where.li3':      '<strong>Worldwide, no border limits</strong> — the structure your tender requires (CSI MasterFormat, BoQ or your own template), metric or imperial, in your currency.',
      'services.where.p2':       'Nobody needs to stand on site to measure a drawing set, and our workday starts seven hours ahead of US Eastern Time for most of the year (six hours during brief daylight-saving transition weeks). See <a href="/en/about.html">who prepares every estimate</a>, read <a href="/en/articles/">our estimating articles</a> or <a href="/en/contact.html">request a fixed-fee quote</a>.',
      'services.cta':            'View sample estimates',

      /* NOSOTROS PAGE */
      'nosotros.h2':   'Technical architecture applied to construction cost control.',
      'nosotros.sub':  'Pr3cise brings decades of building construction experience. Every estimate is prepared directly by a technical architect so your bids rest on traceable quantities.',
      'nosotros.p1':   'Every Pr3cise estimate is prepared directly by a technical architect with decades of experience in building construction and cost control. We do not hand off your drawings to junior data-entry teams or inflate our structure: the professional reading your details, measuring assemblies and building unit rates understands how buildings are actually put together on site.',
      'nosotros.p2':   'Pr3cise is operated by Clear Ascend OÜ (registered in Estonia, Reg. Code 17448615) and works 100% remotely, primarily in the State of Florida (with a focus on Miami-Dade and South Florida) and for clients across Europe and around the world, with no border limits. Every engagement starts with a fixed written quotation, documented scope and strict confidentiality.',
      'nosotros.1.h':  'Prepared by a Technical Architect',
      'nosotros.1.p':  'Every quantity takeoff and unit-cost breakdown is prepared directly by a technical architect with decades of construction experience.',
      'nosotros.2.h':  'International Code & Format Fluency',
      'nosotros.2.p':  'CSI MasterFormat and FBC/HVHZ cost drivers in Florida, Eurocodes and Bills of Quantities across Europe, and BC3 or your own template wherever else you build.',
      'nosotros.3.h':  'Fixed Fees & Confidentiality',
      'nosotros.3.p':  'Operated transparently by Clear Ascend OÜ (Estonia) with firm upfront fees, confirmed turnaround dates and confidential handling of client drawings.',
      'nosotros.cta':  'View our services',

      /* MARIEDOM SECTION */
      'mariedom.label': 'Connected Architecture Practice',
      'mariedom.h3':    'Architectural Design & Technical Development — MARIEDOM',
      'mariedom.p1':    'Beyond construction estimating, our architecture practice also develops architectural design, technical documentation and 3D visualization projects.',
      'mariedom.p2':    'Our wider architectural work includes residential projects, spatial design and technical development. To explore our architectural projects and services, visit MARIEDOM.',
      'mariedom.cta':   'Explore MARIEDOM',

      /* EJEMPLOS PAGE */
      'ejemplos.h2':          'Sample Estimates & Takeoffs: The Pr3cise Standard',
      'ejemplos.sub':         'We deliver bid-ready estimating packages: every line item arrives with traceable drawing quantities, per-material waste factors, and separate overhead and profit.',
      'ejemplos.1.h':         '1. PER-MATERIAL WASTE FACTORS',
      'ejemplos.1.p':         'Tile, concrete, rebar and ductwork do not waste at the same rate. We price realistic waste per material instead of applying blanket allowances.',
      'ejemplos.2.h':         '2. OVERHEAD & PROFIT BROKEN OUT',
      'ejemplos.2.p':         'Transparent indirect cost structure — whether <span class="highlight-gold">overhead and profit percentages</span> set by the tender documents or GC general conditions, overhead &amp; profit in a CSI bid — so your margin is clear and adjustable.',
      'ejemplos.3.h':         '3. EDITABLE SPREADSHEETS & REGIONAL PRICING',
      'ejemplos.3.p':         'Refreshed regional cost data in unlocked Excel sheets so you can plug in subcontractor quotes or adjust crew productivity in seconds.',
      'ejemplos.4.h':         '4. COLOUR-CODED TAKEOFF TRACEABILITY',
      'ejemplos.4.p':         'Every quantity ties back to colour-coded drawing markups for fast internal review, value engineering and payment applications.',
      'ejemplos.redact.note': 'All samples shown above are authentic, redacted excerpts from Pr3cise construction estimates and quantity takeoffs prepared by a technical architect — client names, site addresses and proprietary pricing are removed to maintain strict client confidentiality.',
      'ejemplos.cta':         'Send Your Drawings for a Quote',

      /* CONTACTO PAGE */
      'contacto.h2':             'Request a Fixed-Fee Estimate',
      'contacto.sub':            'Share your project scope and we will reply within one business day with a firm fee and confirmed delivery date.',
      'contacto.intro.1':        'Every estimate is prepared line by line by a technical architect, separating material, labour and equipment in Excel, PDF and CSI MasterFormat or BC3. <strong>Typical turnaround is 24–72 hours</strong> depending on scope, with a fixed fee agreed in writing upfront.',
      'contacto.intro.2':        'Initial drawing review is free and strictly confidential. Operated remotely by Clear Ascend OÜ (Estonia), serving GCs, subcontractors, developers and architects primarily in the State of Florida and across Europe and the rest of the world, with no border limits.',
      'contacto.drawings.p':     '<strong>Have drawings ready (PDF, DWG, Revit/IFC)?</strong> Paste a Google Drive, Dropbox, OneDrive or WeTransfer link in your message, or email files directly to <a href="mailto:contact@pr3cise.com">contact@pr3cise.com</a>. All project files are treated confidentially.',
      'contacto.lbl.nombre':     'Name',
      'contacto.lbl.empresa':    'Company',
      'contacto.lbl.email':      'Work Email',
      'contacto.lbl.telefono':   'Phone (optional)',
      'contacto.phone.code':     'Code',
      'contacto.lbl.proyecto':   'Scope Needed',
      'contacto.lbl.mensaje':    'Project details & drawing link',
      'contacto.opt.default':    'Select scope or trade',
      'contacto.opt.completo':   'Full multi-trade cost estimate (new build / renovation)',
      'contacto.opt.takeoff':    'Quantity takeoff / material takeoff',
      'contacto.opt.conceptual': 'Conceptual / early feasibility budget',
      'contacto.opt.mep':        'Full MEP package (HVAC, Electrical, Plumbing, Fire)',
      'contacto.opt.construccion':'Electrical estimating',
      'contacto.opt.fontaneria': 'Plumbing & piping estimating',
      'contacto.opt.pci':        'Fire protection (NFPA / PCI)',
      'contacto.opt.albanileria':'Concrete, structural & masonry',
      'contacto.opt.carpinteria':'Finishes, drywall & millwork',
      'contacto.opt.otro':       'Public tender / other scope',
      'contacto.captcha':        'Quick check · Center the spirit-level bubble to enable sending',
      'contacto.level.drag':     'Drag the slider to center the bubble',
      'contacto.submit':         'Request Fixed-Fee Quote',
      'contacto.sent':           'Request received. We will reply within one business day.',
      'contacto.error':          'Could not send right now. Please email contact@pr3cise.com.',

      /* CONTACT-PAGE FAQ */
      'cfaq.h2':  'Frequently Asked Questions',
      'cfaq.sub': 'Turnaround times, accepted drawing formats, fixed fees and confidentiality.',
      'cfaq.1.q': 'How fast do you deliver an estimate?',
      'cfaq.1.a': 'Single-trade takeoffs typically return in <strong>24–48 hours</strong>, and full multi-trade estimates in <strong>48–72 hours</strong> once complete drawings are received. Larger commercial projects receive a confirmed schedule before work begins.',
      'cfaq.2.q': 'What files do you need to quote my project?',
      'cfaq.2.a': 'PDF or DWG drawings (or BIM models), the project location, your target trades and your bid deadline are enough for us to review scope and issue a fixed fee.',
      'cfaq.3.q': 'Is there any charge for reviewing my drawings?',
      'cfaq.3.a': 'No. Scope review is <strong>free and without obligation</strong>. You receive our fixed fee and delivery date in writing before deciding to proceed.',
      'cfaq.4.q': 'What formats do you deliver?',
      'cfaq.4.a': 'Editable <strong>Excel spreadsheets and PDF reports</strong> plus colour-coded takeoff markups as standard, organized by <strong>CSI MasterFormat</strong>, <strong>BC3</strong> or the structure your tender requires.',
      'cfaq.5.q': 'Are revisions included if an addendum is issued?',
      'cfaq.5.a': 'Yes. One revision round is included for unit-price adjustments, markups or minor addenda. Major scope redesigns are quoted transparently together.',
      'cfaq.6.q': 'Do you work with contractors in any country?',
      'cfaq.6.a': 'Yes. We operate <strong>100% remotely</strong> from Clear Ascend OÜ (Estonia), primarily for contractors, developers and architects in the State of Florida and for clients across Europe and around the world, with no border limits, pricing every job to local market data.',
      'cfaq.7.q': 'Can you estimate specialized MEP and structural trades?',
      'cfaq.7.a': 'Yes. We prepare standalone trade takeoffs and priced estimates for electrical, plumbing, HVAC, fire protection, concrete and masonry.',
      'cfaq.8.q': 'Are our drawings and bid numbers kept confidential?',
      'cfaq.8.a': 'Strictly. Client drawings, specs and pricing are never shared with third parties or other bidders, and we gladly sign your NDA prior to file transfer.',

      /* PRICING PAGE */
      'pricing.h2':              'Clear fixed fees, no hourly surprises.',
      'pricing.basic.h3':        'Per-Project Fixed Fee',
      'pricing.basic.p':         'From €300 <span class="tax">+ applicable tax by project scope.</span>',
      'pricing.basic.delivery':  'Written fixed quote upfront · 24–72h typical delivery.',
      'pricing.business.h3':     'Monthly Estimating Retainer',
      'pricing.business.p':      'Lower your cost per bid with dedicated monthly takeoff capacity from a technical architect.',
      'pricing.business.volume':  'Designed for contractors and studios with recurring bid volume.',
      'pricing.disclaimer':      'Every Pr3cise deliverable is a line-item technical estimate prepared by a technical architect — built for real bidding, subcontractor buyout and construction cost control.',

      /* CTA FINAL */
      'cta.h2':  'Request a Fixed-Fee Quote for Your Next Project',
      'cta.p':   'Send your drawings and scope. Every project receives a fixed written quotation, documented assumptions and a confirmed delivery date before work begins.',
      'cta.btn': 'Request a Free Estimate',

      /* FOOTER */
      'footer.brand':      'Technical architecture & construction cost estimating · State of Florida, Europe & clients worldwide.',
      'footer.services.h': 'Featured Services',
      'footer.svc.1':      'Construction cost estimation',
      'footer.svc.2':      'Plumbing estimating services',
      'footer.svc.3':      'Fire protection estimating',
      'footer.svc.4':      'Masonry & concrete estimating',
      'footer.contact.h':  'Quick Contact',
      'footer.wa':         'Contact via WhatsApp',
      'footer.legal.h':    'Legal Information',
      'footer.legal.1':    'Legal Notice',
      'footer.legal.2':    'Privacy Policy',
      'footer.legal.3':    'Cookie Policy',
      'footer.legal.4':    'Terms and Conditions',
      'legal.title':       'Legal Information'
    },

    de: {
      /* NAV */
      'nav.about':    'Über uns',
      'nav.services': 'Leistungen',
      'nav.examples': 'Portfolio',
      'nav.contact':  'Kontakt',

      /* HERO */
      'hero.eyebrow': 'Florida · Europa · Kunden weltweit',
      'hero.h1':      'Präzise <span class="hero-highlight hero-precision">Baukostenschätzung</span> und Mengenermittlung zum Festpreis.',
      'hero.h1.mob':  '<span class="hero-highlight hero-precision">Baukostenschätzung</span> und Mengenermittlung zum Festpreis.',
      'hero.p':       'Detaillierte Mengenermittlungen (Quantity Takeoffs) und Baukostenkalkulationen, erstellt von einem <span class="hero-highlight">technischen Architekten (Bautechniker)</span>. Wir arbeiten vor allem im <span class="hero-highlight">Bundesstaat Florida</span> und für Kunden in ganz Europa und weltweit – ohne Grenzen.',
      'hero.p.mob':   'Mengenermittlungen und Baukostenkalkulationen zum <span class="hero-highlight">Festpreis</span>, erstellt von einem technischen Architekten.',
      'hero.cta':     'Kostenloses Angebot anfordern',
      'hero.cta2':    'Kalkulationsbeispiele ansehen',
      'hero.trust.1': 'Schriftlicher Festpreis vor Arbeitsbeginn',
      'hero.trust.2': 'Übliche Lieferung in 24–72 Std.',
      'hero.trust.3': 'Excel, PDF & BC3 · CSI MasterFormat',
      'hero.trust.4': 'Erstellt durch technischen Architekten',

      /* DELIVERABLES & TRUST PILLARS */
      'deliv.h2':    'Was Sie mit jeder Kalkulation erhalten',
      'deliv.sub':   'Nachvollziehbare technische Unterlagen für Ausschreibungen, Nachunternehmervergabe und Angebotsprüfung.',
      'deliv.1.tag': 'Excel · PDF · BC3',
      'deliv.1.h':   'Einheitspreis-Aufschlüsselung',
      'deliv.1.p':   'Material, Lohnstunden, Leistungswerte und Geräte getrennt je Position ausgewiesen, inklusive materialspezifischem Verschnitt.',
      'deliv.2.tag': 'CSI MasterFormat / Gewerke',
      'deliv.2.h':   'Farbig markierte Planaufmaße',
      'deliv.2.p':   'Jede Menge ist mit farbig markierten Plänen verknüpft, damit jede Position in Sekunden geprüft werden kann.',
      'deliv.3.tag': 'Kaufmännische Klarheit',
      'deliv.3.h':   'Leistungsumfang, Gemeinkosten & Ausschlüsse',
      'deliv.3.p':   'Baustellengemeinkosten, Wagnis und Gewinn, Annahmen sowie Leistungsausschlüsse sauber schriftlich dokumentiert.',
      'pillar.1.h':  'Festpreis vorab garantiert',
      'pillar.1.p':  'Jedes Projekt erhält vor Arbeitsbeginn ein verbindliches Festpreisangebot und ein festes Lieferdatum — ohne versteckte Stundensätze.',
      'pillar.2.h':  'Erstellt vom technischen Architekten',
      'pillar.2.p':  'Jede Kalkulation wird direkt von einem technischen Architekten mit jahrzehntelanger Erfahrung im Hochbau ausgearbeitet.',
      'pillar.3.h':  'Strenge Vertraulichkeit',
      'pillar.3.p':  'Ihre Pläne, Baubeschreibungen und Einkaufspreise werden streng vertraulich behandelt; auf Wunsch unterzeichnen wir vorab eine NDA.',
      'pillar.4.h':  'Transparente EU-Unternehmensstruktur',
      'pillar.4.p':  'Pr3cise wird betrieben von Clear Ascend OÜ (Reg.-Nr. 17448615, Estland) und arbeitet zu 100 % remote für internationale Auftraggeber.',

      /* PROBLEM */
      'prob.h2':    'Schmälern ungenaue Aufmaße und Zeitdruck Ihre Projektmargen?',
      'prob.p1':    'In Bent Flyvbjergs Referenzstudie zu <strong>258 Verkehrsinfrastrukturprojekten</strong> (<em>Journal of the American Planning Association</em>, 2002) überschritten <strong>9 von 10 Projekten ihr ursprüngliches Budget</strong> — bei einer durchschnittlichen Kostenüberschreitung von <strong>28 %</strong>. Angebote ohne prüfbares Aufmaß gefährden Ihre Marge ab Tag eins.',
      'prob.p2':    'Durch die Auslagerung Ihrer Mengenermittlung gewinnen Sie sofortige Kalkulationskapazität ohne zusätzliche Fixkosten — bewertet mit regionalen Marktpreisen des jeweiligen Bauorts.',
      'prob.stat1': 'Projekte mit Kostenüberschreitung (Flyvbjerg, 258 Bauten)',
      'prob.stat2': 'Durchschnittliche Abweichung (Flyvbjerg, 2002)',
      'prob.stat3': 'Übliche Lieferzeit je nach Umfang',

      /* FLOOR PLAN */
      'ri.label':        'Budget in Echtzeit',
      'ri.title':        'Ihr Projekt, Gewerk für Gewerk',
      'ri.total.label':  'kumuliertes Budget · Beispiel in €',
      'ri.scroll':       '↓ scrollen zum Erkunden ↓',
      'ri.slider.label': 'ZIEHEN · KOSTENKONTROLLE',
      'ri.room.salon':   'WOHN- / ESSZIMMER',
      'ri.room.cocina':  'KÜCHE',
      'ri.room.bano':    'BAD',
      'ri.room.dorm1':   'SCHLAFZIMMER 1',
      'ri.room.dorm2':   'SCHLAFZIMMER 2',
      'ri.scale':        'MAßSTAB 1:50 · 85 m² · ERDGESCHOSS',
      'ri.leg.p':        'Sanitär / HLK',
      'ri.leg.e':        'Elektro',
      'ri.leg.w':        'Fenster',
      'ri.leg.d':        'Türen',
      'ri.sum.p':        'Sanitär / HLK',
      'ri.sum.e':        'Elektro',
      'ri.sum.w':        'Fenster',
      'ri.sum.d':        'Türen',
      'ri.sum.total':    'Gesamtrenovierung',
      'phase.p':         '01 · SANITÄR / HLK',
      'phase.e':         '02 · ELEKTRO',
      'phase.w':         '03 · FENSTER',
      'phase.d':         '04 · TÜREN',
      'tag.p0.name':     'Sanitär · Küche',
      'tag.p0.desc':     'Spüle + Spülmaschine + Waschmaschine',
      'tag.p1.name':     'Sanitär · Bad',
      'tag.p1.desc':     'Dusche, WC, Waschbecken + Rohrleitungen',
      'tag.p2.name':     'Klimaanlage',
      'tag.p2.desc':     '4× Splits + Leitungen + Montage',
      'tag.e0.name':     'Elektro · Verteiler',
      'tag.e0.desc':     'Sicherung + 9 geschützte Stromkreise',
      'tag.e1.name':     'Elektro · Beleuchtung',
      'tag.e1.desc':     'LED-Lichtpunkte in der gesamten Wohnung',
      'tag.e2.name':     'Elektro · Steckdosen',
      'tag.e2.desc':     '24 Steckdosen',
      'tag.w0.name':     'Fenster · Wohnzimmer',
      'tag.w0.desc':     '2× PVC-Doppelverglasung',
      'tag.w1.name':     'Fenster · Schlafzimmer',
      'tag.w1.desc':     '3× Fenster + Rollladenkasten',
      'tag.w2.name':     'Fenster · Küche',
      'tag.w2.desc':     'Schiebetür mit Fliegengitter',
      'tag.d0.name':     'Türen · Eingang',
      'tag.d0.desc':     'Sicherheitstür Klasse 3 + Schloss',
      'tag.d1.name':     'Türen · Innen',
      'tag.d1.desc':     '4× weiß lackierte Innentür',

      /* PROCESS */
      'proc.h2':  'Unser Kalkulationsprozess in 4 klaren Schritten',
      'proc.sub': 'Ein transparenter Ablauf vom Planeingang bis zur abgabefertigen Kalkulation. Sehen Sie hier alle <a href="/servicios.html">Gewerke und Leistungen, die wir kalkulieren</a>.',
      'proc.1.h': 'Pläne & Umfang senden',
      'proc.1.p': 'Sie übermitteln Pläne (PDF, DWG oder BIM), Baubeschreibung und Abgabefrist. Die Erstprüfung ist kostenlos.',
      'proc.2.h': 'Festpreis & Liefertermin',
      'proc.2.p': 'Vor Arbeitsbeginn erhalten Sie schriftlich den genauen Leistungsumfang, unser Festhonorar und das Lieferdatum.',
      'proc.3.h': 'Aufmaß & technische Bewertung',
      'proc.3.p': 'Ein technischer Architekt ermittelt alle Mengen mit farbiger Planmarkierung und kalkuliert Material, Lohn und Geräte.',
      'proc.4.h': 'Abgabefertige Übergabe',
      'proc.4.p': 'Lieferung als offene Excel-Datei, PDF und BC3 (oder CSI MasterFormat), inklusive dokumentierter Annahmen und einer Korrekturrunde.',

      /* WHO WE WORK WITH */
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

      /* DONDE TRABAJAMOS */
      'donde.h2':    'Schwerpunkt Florida. Kunden in ganz Europa und weltweit.',
      'donde.sub':   'Wir arbeiten vor allem im Bundesstaat Florida und begleiten Bauunternehmen, Nachunternehmer, Projektentwickler und Architekten in ganz Europa und weltweit. Ohne Grenzen: Pläne reisen digital, und jede Kalkulation folgt den Normen, Einheiten und der Währung des Bauorts.',
      'donde.1.h':   'Spezialisierung auf den Bundesstaat Florida',
      'donde.1.p':   'Positionen nach CSI MasterFormat mit regionalen Kosten für Florida – inklusive <a href="/de/baukostenschaetzung-miami.html">Florida Building Code, HVHZ und NOA-Freigaben in Miami-Dade und Südflorida</a> ab der ersten Zahl.',
      'donde.2.h':   'Europa und weltweit · ohne Grenzen',
      'donde.2.p':   'Keine geografischen Grenzen: metrisch oder imperial, in Ihrer Währung und im Standard Ihrer Ausschreibung (CSI MasterFormat, BC3, Eurocodes oder Bill of Quantities).',
      'donde.3.h':   'Zeitvorsprung für schnellere Lieferung',
      'donde.3.p':   'Unser technisches Büro (Clear Ascend OÜ, Estland) beginnt 7 Stunden vor der US-Ostküste – Pläne, die Sie zum Feierabend senden, werden über Nacht ermittelt.',
      'donde.badge.main': 'Florida · Europa · Weltweit',
      'donde.badge.sub': 'Ohne Grenzen · 100 % digital',
      'donde.outro': 'Planen oder kalkulieren Sie ein Projekt in Südflorida? Besuchen Sie unsere Seite zur <a href="/estimados-de-construccion-miami.html">Baukostenschätzung in Miami</a> oder <a href="/contacto.html">senden Sie uns Ihre Pläne für ein Festpreisangebot</a>.',

      /* FAQ */
      'faq.h2':    'Häufig gestellte Fragen zur Baukostenschätzung',
      'faq.intro': 'Die wichtigsten Antworten vor dem Versand Ihrer Pläne. Erfahren Sie auch, <a href="/nosotros.html">wer jede Pr3cise-Kalkulation ausarbeitet</a>.',
      'faq.1.q':   'Warum ein externes Büro für Mengenermittlung und Kostenschätzung beauftragen?',
      'faq.1.a':   'Die Auslagerung schafft sofortige Kalkulationskapazität bei engen Abgabefristen ohne zusätzliche Fixkosten, sorgt für objektive, prüfbare Mengen und entlastet Ihre Projektleitung.',
      'faq.2.q':   'Welche Bauprojekte kalkulieren Sie?',
      'faq.2.a':   'Wir kalkulieren Wohnanlagen, Einfamilienhäuser, Umbauten, Gewerbe- und Büroflächen, Industriehallen sowie Fachgewerke der technischen Gebäudeausrüstung (TGA/MEP), Beton- und Maurerarbeiten.',
      'faq.3.q':   'Wer erstellt die Kalkulationen bei Pr3cise?',
      'faq.3.a':   'Jede Kalkulation wird direkt von einem technischen Architekten (Bautechniker) mit jahrzehntelanger Erfahrung im Hochbau erstellt — gestützt auf nachvollziehbare digitale Planaufmaße (PDF, DWG oder BIM) sowie detaillierte Lohn-, Material- und Geräteansätze.',
      'faq.4.q':   'Was ist der Unterschied zwischen Mengenermittlung und Kostenschätzung?',
      'faq.4.a':   'Die Mengenermittlung (Takeoff) erfasst alle geometrischen Einheiten farbig nachvollziehbar am Plan. Die Kostenschätzung bewertet diese Mengen mit aktuellen Marktpreisen, Lohnstunden, Verschnitt sowie Gemeinkosten und Gewinn.',
      'faq.5.q':   'Arbeiten Sie mit BIM-Modellen oder mit PDF-Plänen?',
      'faq.5.a':   'Mit beidem. Liegt ein BIM-Modell vor, lesen wir die Mengen direkt aus; liegen PDF- oder DWG-Pläne vor, messen wir mit farbiger Planmarkierung, sodass jede Position in Sekunden prüfbar ist.',
      'faq.6.q':   'Können Sie Kalkulationen für öffentliche Ausschreibungen erstellen?',
      'faq.6.a':   'Ja. Wir übernehmen die geforderte Gliederung der Vergabeunterlagen, liefern als offenes Excel, PDF und BC3 und dokumentieren alle technischen Annahmen und Ausschlüsse schriftlich.',
      'faq.7.q':   'Wie werden Ihre Honorare berechnet?',
      'faq.7.a':   'Wir arbeiten ausschließlich zum Festpreis je Projekt. Nach kostenloser Sichtung Ihrer Pläne erhalten Sie vor Arbeitsbeginn schriftlich Leistungsumfang, Festhonorar und Liefertermin.',
      'faq.8.q':   'Wie schützen Sie die Vertraulichkeit meiner Baupläne?',
      'faq.8.a':   'Alle übermittelten Pläne, Beschreibungen und Preisdaten werden streng vertraulich ausschließlich für Ihr Angebot genutzt und niemals an Dritte weitergegeben. Gerne unterzeichnen wir vorab eine Geheimhaltungsvereinbarung (NDA).',

      /* TRUSTPILOT */
      'tp.h2':  'Was unsere Kunden sagen',
      'tp.sub': 'Echtes Feedback von Fachleuten, die Pr3cise ihre Mengenermittlungen und Baukostenschätzungen anvertrauen.',

      /* SERVICES PAGE */
      'services.h2':             'Einsatzbereiche und Fachgewerke',
      'services.sub':            'Präzise Mengenermittlungen und Baukostenkalkulationen, abgestimmt auf die technischen und normativen Anforderungen jedes Gewerks.',
      'services.construccion.h3':'Wohnungsbau und Hochbauprojekte',
      'services.construccion.p': 'Vollständige Positionsaufschlüsselung vom Erdbau über den Rohbau bis zum Innenausbau für Bauträger, Generalunternehmer und Architekten.',
      'services.publica.h3':     'Öffentliche Ausschreibungen',
      'services.publica.p':      'Struktur exakt nach Vergabeunterlagen, geliefert als offene Excel-Tabelle, PDF und standardisierte BC3-Datei.',
      'services.fontaneria.h3':  'Technische Gebäudeausrüstung (TGA / MEP)',
      'services.fontaneria.p':   'Detaillierte Kalkulationen für Elektro, <strong>Sanitär</strong>, Lüftung/Klima und <strong>Brandschutz</strong> nach den am Bauort geltenden Regelwerken (z. B. Florida Building Code, NEC und NFPA in Florida, Eurocodes in Europa).',
      'services.albanileria.h3': 'Rohbau & Ausbaugewerke',
      'services.albanileria.p':  'Sorgfältige Aufmaße für Beton- und Stahlbetonarbeiten, <strong>Mauerwerk</strong>, Trockenbau, Tischler-, Metallbau- und Glasarbeiten.',
      'services.methodology.h3': 'Was beinhaltet jede Pr3cise-Kalkulation?',
      'services.methodology.1':  '<strong>Mengen und regionale Marktpreise:</strong> Listen- und Einkaufspreise passend zum tatsächlichen Projektstandort.',
      'services.methodology.2':  '<strong>Anpassbare Verschnitt-, Gemeinkosten- und Gewinnansätze:</strong> offene Formeln zur schnellen Anpassung Ihrer Zuschläge.',
      'services.methodology.3':  '<strong>Einheitspreis-Zergliederung:</strong> getrennter Ausweis von Lohn, Material und Gerätekosten je Position.',
      'services.methodology.4':  '<strong>Dokumentierter Leistungsumfang & Ausschlüsse:</strong> klare schriftliche Abgrenzung von Annahmen und Planunschärfen.',
      'services.methodology.5':  '<strong>Lieferung in offenen Formaten:</strong> Excel, PDF, BC3 oder CSI MasterFormat inklusive farbiger Planmarkierungen.',
      'services.methodology.6':  '<strong>Inklusive Überarbeitungsrunde:</strong> Anpassung bei Nachträgen zum Ausschreibungspaket oder geänderten Spezifikationen.',
      'services.where.h2':       'Wo wir arbeiten',
      'services.where.p1':       'Pr3cise ist ein remote arbeitendes Kalkulationsbüro — Clear Ascend OÜ, eingetragen in Estland — ohne physische Niederlassungen vor Ort. Sie senden Pläne und Baubeschreibung digital, ein technischer Architekt ermittelt Mengen und Preise, und Sie erhalten die Kalkulation im Format und nach dem Regelwerk des Projektlandes.',
      'services.where.li1':      '<strong>Bundesstaat Florida (Schwerpunkt)</strong> — Gliederung nach CSI MasterFormat mit regionalen Kostendaten; in <a href="/de/baukostenschaetzung-miami.html">Miami-Dade und Südflorida</a> mit Florida Building Code, HVHZ und NOA von Anfang an.',
      'services.where.li2':      '<strong>Ganz Europa</strong> — Aufmaße, Leistungsverzeichnisse und Bills of Quantities nach Eurocodes und den nationalen Regelwerken des Bauorts, in BC3, Excel und PDF.',
      'services.where.li3':      '<strong>Weltweit, ohne Grenzen</strong> — die Gliederung, die Ihre Ausschreibung verlangt (CSI MasterFormat, BoQ oder Ihre eigene Vorlage), metrisch oder imperial und in Ihrer Währung.',
      'services.where.p2':       'Niemand muss auf der Baustelle stehen, um einen Plansatz zu vermessen — und unser Arbeitstag beginnt fast das ganze Jahr über sieben Stunden vor der US-Ostküste (sechs Stunden während der kurzen Zeitumstellungswochen). Erfahren Sie, <a href="/nosotros.html">wer jede Kalkulation erstellt</a>, oder <a href="/contacto.html">fordern Sie ein Festpreisangebot an</a>.',
      'services.cta':            'Kalkulationsbeispiele ansehen',

      /* NOSOTROS PAGE */
      'nosotros.h2':   'Technische Architektur im Dienst verlässlicher Baukosten.',
      'nosotros.sub':  'Pr3cise verfügt über jahrzehntelange Erfahrung im Hochbau. Jede Kalkulation wird direkt von einem technischen Architekten (Bautechniker) ausgearbeitet.',
      'nosotros.p1':   'Hinter jeder Kalkulation von Pr3cise steht ein technischer Architekt mit jahrzehntelanger praktischer Erfahrung im Bauwesen und in der Kostenkontrolle. Wir geben Ihre Pläne weder an anonyme Datenerfasser weiter noch blähen wir unsere Struktur künstlich auf: Wer Ihre Konstruktionsdetails liest, Mengen misst und Einheitspreise aufbaut, kennt die reale Bauausführung.',
      'nosotros.p2':   'Pr3cise wird von Clear Ascend OÜ (eingetragen in Estland, Registernummer 17448615) betrieben und arbeitet zu 100 % remote – mit Schwerpunkt im Bundesstaat Florida (Miami-Dade und Südflorida) und für Kunden in ganz Europa und weltweit, ohne Grenzen. Jedes Projekt startet mit einem schriftlichen Festpreis, klarem Liefertermin und strenger Vertraulichkeit.',
      'nosotros.1.h':  'Direkt vom technischen Architekten',
      'nosotros.1.p':  'Jedes Aufmaß und jede Preisaufschlüsselung wird direkt von einem technischen Architekten mit Jahrzehnten Bauerfahrung erstellt.',
      'nosotros.2.h':  'Internationale Norm- & Formatsicherheit',
      'nosotros.2.p':  'CSI MasterFormat und HVHZ/FBC-Kostenfaktoren in Florida, Eurocodes und BoQ-Formate in Europa – und überall sonst BC3 oder das Format, das Ihre Ausschreibung verlangt.',
      'nosotros.3.h':  'Festpreis & Vertraulichkeit',
      'nosotros.3.p':  'Transparente Abwicklung über Clear Ascend OÜ (Estland) mit verbindlichem Festhonorar vorab und vertraulicher Behandlung aller Planunterlagen.',
      'nosotros.cta':  'Unsere Leistungen ansehen',

      /* MARIEDOM SECTION */
      'mariedom.label': 'Verbundenes Architekturbüro',
      'mariedom.h3':    'Architektur, Design & Technische Planung — MARIEDOM',
      'mariedom.p1':    'Über die Baukostenschätzung und Mengenermittlung hinaus entwickelt unser Architekturbüro auch Projekte in den Bereichen Architekturentwurf, technische Ausführungsplanung und 3D-Visualisierung.',
      'mariedom.p2':    'Unsere weiterführende architektonische Arbeit umfasst Wohnbauprojekte, Raumgestaltung und technische Projektentwicklung. Entdecken Sie unsere Architekturprojekte bei MARIEDOM.',
      'mariedom.cta':   'MARIEDOM entdecken',

      /* EJEMPLOS PAGE */
      'ejemplos.h2':          'Reale Kalkulationsbeispiele: Der Pr3cise-Standard',
      'ejemplos.sub':         'Wir liefern belastbare Werkzeuge für Angebot und Vergabe: jede Position enthält ein prüfbares Planaufmaß, materialspezifischen Verschnitt sowie getrennt ausgewiesene Gemeinkosten und Gewinn.',
      'ejemplos.1.h':         '1. MATERIALSPEZIFISCHE VERSCHNITTSÄTZE',
      'ejemplos.1.p':         'Fliesen, Schüttgüter, Bewehrungsstahl und Lüftungskanäle haben unterschiedliche Verschnittquoten. Wir kalkulieren reale Faktoren je Material statt pauschaler Schätzwerte.',
      'ejemplos.2.h':         '2. GEMEINKOSTEN (AGK) UND UNTERNEHMERGEWINN',
      'ejemplos.2.p':         'Transparente Aufschlüsselung indirekter Kosten — ob <span class="highlight-gold">Gemeinkosten- und Gewinnzuschläge</span> nach Vorgabe der Ausschreibung oder General Conditions &amp; Markup nach CSI — damit Ihre Marge jederzeit nachvollziehbar bleibt.',
      'ejemplos.3.h':         '3. OFFENE EXCEL-TABELLEN & REGIONALE PREISE',
      'ejemplos.3.p':         'Monatlich gepflegte regionale Preisdaten in offenen Tabellen, sodass Sie eigene Lieferantenpreise oder Kolonnenwerte sofort anpassen können.',
      'ejemplos.4.h':         '4. NACHVOLLZIEHBARE FARBIGE PLANAUFMAßE',
      'ejemplos.4.p':         'Jede Menge verweist auf farbig markierte Zeichnungen — für schnelle interne Prüfungen, Nachtragsmanagement und Abrechnung.',
      'ejemplos.redact.note': 'Alle gezeigten Muster sind echte, anonymisierte Auszüge aus Pr3cise-Baukostenkalkulationen und Mengenermittlungen eines technischen Architekten — Kundennamen, Projektadressen und vertrauliche Einkaufspreise wurden zum Schutz der Vertraulichkeit entfernt.',
      'ejemplos.cta':         'Festpreisangebot anfordern',

      /* CONTACTO PAGE */
      'contacto.h2':             'Fordern Sie Ihr unverbindliches Festpreisangebot an',
      'contacto.sub':            'Senden Sie uns Ihre Projekteckdaten — wir antworten innerhalb eines Werktags mit Leistungsumfang, Festpreis und Liefertermin.',
      'contacto.intro.1':        'Jede Kalkulation wird Position für Position von einem technischen Architekten erstellt, getrennt nach Material, Lohn und Geräten in Excel, PDF sowie BC3 oder CSI MasterFormat. <strong>Übliche Lieferzeit 24–72 Stunden</strong> je nach Umfang, zum vorab schriftlich vereinbarten Festpreis.',
      'contacto.intro.2':        'Die Erstsichtung Ihrer Pläne ist kostenlos und vertraulich. Wir arbeiten remote (Clear Ascend OÜ, Estland) für Bauunternehmen, Nachunternehmer, Bauträger und Architekturbüros in Miami-Dade, Europa und weltweit.',
      'contacto.drawings.p':     '<strong>Pläne bereits vorhanden (PDF, DWG, Revit/IFC)?</strong> Fügen Sie einen Link (Google Drive, Dropbox, OneDrive, WeTransfer) in Ihre Nachricht ein oder senden Sie die Dateien direkt an <a href="mailto:contact@pr3cise.com">contact@pr3cise.com</a>. Alle Unterlagen werden streng vertraulich behandelt.',
      'contacto.lbl.nombre':     'Name',
      'contacto.lbl.empresa':    'Unternehmen',
      'contacto.lbl.email':      'Geschäftliche E-Mail',
      'contacto.lbl.telefono':   'Telefon (optional)',
      'contacto.phone.code':     'Vorwahl',
      'contacto.lbl.proyecto':   'Gewünschter Leistungsumfang',
      'contacto.lbl.mensaje':    'Projektdetails & Plan-Link',
      'contacto.opt.default':    'Umfang oder Gewerk auswählen',
      'contacto.opt.completo':   'Komplettkalkulation über alle Gewerke (Neubau / Umbau)',
      'contacto.opt.takeoff':    'Reine Mengenermittlung (Quantity Takeoff)',
      'contacto.opt.conceptual': 'Konzept- / Machbarkeitsschätzung',
      'contacto.opt.mep':        'Komplettpaket TGA / MEP (HLK, Elektro, Sanitär, Brandschutz)',
      'contacto.opt.construccion':'Elektroinstallationen',
      'contacto.opt.fontaneria': 'Sanitär- und Rohrleitungsbau',
      'contacto.opt.pci':        'Brandschutz (NFPA / PCI)',
      'contacto.opt.albanileria':'Rohbau, Beton- und Maurerarbeiten',
      'contacto.opt.carpinteria':'Innenausbau, Trockenbau & Tischlerarbeiten',
      'contacto.opt.otro':       'Öffentliche Ausschreibung / sonstiger Umfang',
      'contacto.captcha':        'Kurzprüfung · Zentrieren Sie die Libelle zum Aktivieren des Versands',
      'contacto.level.drag':     'Schieberegler ziehen, um die Libelle auszurichten',
      'contacto.submit':         'Festpreisangebot anfordern',
      'contacto.sent':           'Anfrage gesendet. Wir melden uns innerhalb eines Werktags.',
      'contacto.error':          'Senden fehlgeschlagen. Bitte schreiben Sie an contact@pr3cise.com.',

      /* CONTACT-PAGE FAQ */
      'cfaq.h2':  'Häufige Fragen vor dem Planversand',
      'cfaq.sub': 'Lieferzeiten, Dateiformate, Festpreise und Vertraulichkeit im Überblick.',
      'cfaq.1.q': 'Wie schnell liefern Sie eine Kalkulation?',
      'cfaq.1.a': 'Einzelgewerk-Aufmaße liefern wir meist in <strong>24–48 Stunden</strong>, vollständige Mehrgewerke-Kalkulationen in <strong>48–72 Stunden</strong> ab Eingang vollständiger Unterlagen. Bei Großprojekten bestätigen wir den Termin vorab schriftlich.',
      'cfaq.2.q': 'Welche Unterlagen benötigen Sie für ein Honorarangebot?',
      'cfaq.2.a': 'Pläne als PDF oder DWG (bzw. BIM-Modell), der Projektstandort, die gewünschten Gewerke und Ihr Abgabetermin genügen für unser kostenloses Festpreisangebot.',
      'cfaq.3.q': 'Kostet die Vorprüfung meiner Pläne etwas?',
      'cfaq.3.a': 'Nein. Die Sichtung und Angebotserstellung sind <strong>kostenlos und unverbindlich</strong>. Sie kennen Festpreis und Lieferdatum vorab schriftlich.',
      'cfaq.4.q': 'In welchen Formaten liefern Sie?',
      'cfaq.4.a': 'Standardmäßig als <strong>offene Excel-Datei und PDF</strong> samt farbigen Planmarkierungen — gegliedert nach <strong>CSI MasterFormat</strong>, <strong>BC3</strong> oder dem Standard Ihrer Ausschreibung.',
      'cfaq.5.q': 'Sind Anpassungen bei Planänderungen enthalten?',
      'cfaq.5.a': 'Ja, eine Überarbeitungsrunde für Preisaktualisierungen oder kleinere Nachträge ist enthalten. Größere Umplanungen stimmen wir transparent vorab ab.',
      'cfaq.6.q': 'Arbeiten Sie mit Unternehmen aus jedem Land?',
      'cfaq.6.a': 'Ja. Wir arbeiten <strong>100 % remote</strong> über Clear Ascend OÜ (Estland) – mit Schwerpunkt im Bundesstaat Florida und für Kunden in ganz Europa und weltweit, ohne Grenzen –, jeweils mit lokalen Marktpreisen.',
      'cfaq.7.q': 'Kalkulieren Sie auch Fachgewerke wie TGA/MEP, Elektro oder Brandschutz?',
      'cfaq.7.a': 'Ja. Wir erstellen detaillierte Einzelkalkulationen für Elektro, Sanitär, Lüftung/Klima, Brandschutz sowie Beton- und Mauerwerksbau.',
      'cfaq.8.q': 'Bleiben meine Pläne und Kalkulationsdaten vertraulich?',
      'cfaq.8.a': 'Uneingeschränkt. Ihre Unterlagen werden ausschließlich für Ihr Projekt verwendet und niemals weitergegeben. Auf Wunsch unterzeichnen wir vorab eine NDA.',

      /* PRICING PAGE */
      'pricing.h2':              'Klare Festpreise, keine Überraschungen.',
      'pricing.basic.h3':        'Einzelprojekt (Festpreis)',
      'pricing.basic.p':         'Ab 300 € <span class="tax">+ MwSt. je nach Projektumfang.</span>',
      'pricing.basic.delivery':  'Verbindliches Angebot vorab · Lieferung meist in 24–72 Std.',
      'pricing.business.h3':     'Monatliche Rahmenvereinbarung',
      'pricing.business.p':      'Senken Sie Ihre Kosten pro Ausschreibung durch laufende Zusammenarbeit mit einem technischen Architekten.',
      'pricing.business.volume':  'Für Unternehmen mit regelmäßigem Kalkulationsvolumen.',
      'pricing.disclaimer':      'Unsere Kalkulationen sind keine pauschalen Schätzungen, sondern Position für Position ausgearbeitete technische Kostenberechnungen eines technischen Architekten für Vergabe, Einkauf und Kostenkontrolle.',

      /* CTA FINAL */
      'cta.h2':  'Fordern Sie ein Festpreisangebot für Ihr nächstes Projekt an',
      'cta.p':   'Senden Sie uns Ihre Pläne und den gewünschten Umfang. Sie erhalten vor Arbeitsbeginn ein schriftliches Festpreisangebot, dokumentierte Annahmen und einen verbindlichen Liefertermin.',
      'cta.btn': 'Kostenloses Angebot anfordern',

      /* FOOTER */
      'footer.brand':      'Remote arbeitendes Beratungsbüro für Baukostenschätzung und Mengenermittlung, betrieben von Clear Ascend OÜ (Estland) für internationale Bauprojekte.',
      'footer.services.h': 'Ausgewählte Leistungen',
      'footer.svc.1':      'Baukostenschätzung',
      'footer.svc.2':      'Sanitär-Kalkulation',
      'footer.svc.3':      'Brandschutz-Kalkulation',
      'footer.svc.4':      'Mauerwerks- & Betonkalkulation',
      'footer.contact.h':  'Schnellkontakt',
      'footer.wa':         'Per WhatsApp kontaktieren',
      'footer.legal.h':    'Rechtliche Informationen',
      'footer.legal.1':    'Impressum',
      'footer.legal.2':    'Datenschutzerklärung',
      'footer.legal.3':    'Cookie-Richtlinie',
      'footer.legal.4':    'Allgemeine Geschäftsbedingungen',
      'legal.title':       'Rechtliche Informationen'
    },

    fr: {
      /* NAV */
      'nav.about':    'À propos',
      'nav.services': 'Services',
      'nav.examples': 'Portfolio',
      'nav.contact':  'Contact',

      /* HERO */
      'hero.eyebrow': 'Floride · Europe · Clients dans le monde entier',
      'hero.h1':      'Métrés et <span class="hero-highlight hero-precision">estimation des coûts</span> de construction à prix forfaitaire.',
      'hero.h1.mob':  'Métrés et <span class="hero-highlight hero-precision">estimation des coûts</span> à prix forfaitaire.',
      'hero.p':       'Métrés détaillés (quantity takeoffs) et devis estimatifs élaborés par un <span class="hero-highlight">architecte technique</span>. Nous travaillons surtout dans l\'<span class="hero-highlight">État de Floride</span>, avec des clients dans toute l\'Europe et dans le monde entier — sans frontières.',
      'hero.p.mob':   'Métrés et devis de travaux à <span class="hero-highlight">prix forfaitaire</span> élaborés par un architecte technique.',
      'hero.cta':     'Demander un Devis Gratuit',
      'hero.cta2':    'Voir des Exemples de Devis',
      'hero.trust.1': 'Forfait écrit convenu avant démarrage',
      'hero.trust.2': 'Livraison habituelle sous 24–72 h',
      'hero.trust.3': 'Excel, PDF & BC3 · CSI MasterFormat',
      'hero.trust.4': 'Élaboré par un architecte technique',

      /* DELIVERABLES & TRUST PILLARS */
      'deliv.h2':    'Ce que contient chaque dossier livré',
      'deliv.sub':   'Une documentation technique traçable, prête pour répondre aux appels d\'offres, consulter vos sous-traitants et défendre vos marges.',
      'deliv.1.tag': 'Excel · PDF · BC3',
      'deliv.1.h':   'Sous-détail de prix unitaires',
      'deliv.1.p':   'Matériaux, heures de main-d\'œuvre, rendements et matériel séparés à chaque ligne, avec pertes calculées par matériau.',
      'deliv.2.tag': 'CSI MasterFormat / Lots',
      'deliv.2.h':   'Plans repérés en couleurs',
      'deliv.2.p':   'Chaque quantité renvoie aux plans annotés par couleurs afin de vérifier n\'importe quel poste en quelques secondes.',
      'deliv.3.tag': 'Clarté commerciale',
      'deliv.3.h':   'Périmètre, frais généraux & exclusions',
      'deliv.3.p':   'Frais généraux, bénéfice, hypothèses de chiffrage et exclusions consignés par écrit pour sécuriser votre offre.',
      'pillar.1.h':  'Honoraires forfaitaires connus d\'avance',
      'pillar.1.p':  'Chaque mission fait l\'objet d\'un tarif fixe et d\'une date de livraison confirmés par écrit avant tout démarrage — sans facturation horaire imprévue.',
      'pillar.2.h':  'Réalisé par un architecte technique',
      'pillar.2.p':  'Chaque devis est élaboré directement par un architecte technique fort de plusieurs décennies d\'expérience dans le bâtiment.',
      'pillar.3.h':  'Confidentialité stricte',
      'pillar.3.p':  'Vos plans, cahiers des charges et tarifs fournisseurs sont traités en toute confidentialité, avec signature de NDA sur simple demande.',
      'pillar.4.h':  'Société européenne transparente',
      'pillar.4.p':  'Pr3cise est exploité par Clear Ascend OÜ (code 17448615, Estonie) et intervient 100 % à distance pour une clientèle internationale.',

      /* PROBLEM */
      'prob.h2':    'Les imprécisions de métré grèvent-elles la rentabilité de vos chantiers ?',
      'prob.p1':    'Dans l\'étude de référence de Bent Flyvbjerg portant sur <strong>258 projets d\'infrastructures de transport</strong> (<em>Journal of the American Planning Association</em>, 2002), <strong>9 projets sur 10 ont dépassé leur budget initial</strong>, avec un dépassement moyen de <strong>28 %</strong>. Remettre un prix sans métré traçable expose votre marge dès le départ.',
      'prob.p2':    'Externaliser vos métrés vous donne une capacité de chiffrage immédiate sans alourdir vos charges fixes, avec des bases de prix adaptées au marché réel du chantier.',
      'prob.stat1': 'Projets en dépassement (Flyvbjerg, 258 projets)',
      'prob.stat2': 'Dépassement moyen constaté (Flyvbjerg, 2002)',
      'prob.stat3': 'Délai habituel selon périmètre',

      /* FLOOR PLAN */
      'ri.label':        'Budget en temps réel',
      'ri.title':        'Votre projet, ligne par ligne',
      'ri.total.label':  'budget cumulé · exemple en €',
      'ri.scroll':       '↓ faites défiler pour explorer ↓',
      'ri.slider.label': 'GLISSER · CONTRÔLE DU BUDGET',
      'ri.room.salon':   'SALON / SALLE À MANGER',
      'ri.room.cocina':  'CUISINE',
      'ri.room.bano':    'SALLE DE BAIN',
      'ri.room.dorm1':   'CHAMBRE 1',
      'ri.room.dorm2':   'CHAMBRE 2',
      'ri.scale':        'ÉCHELLE 1:50 · 85 m² · REZ-DE-CHAUSSÉE',
      'ri.leg.p':        'Plomberie / CVC',
      'ri.leg.e':        'Électricité',
      'ri.leg.w':        'Fenêtres',
      'ri.leg.d':        'Portes',
      'ri.sum.p':        'Plomberie / CVC',
      'ri.sum.e':        'Électricité',
      'ri.sum.w':        'Fenêtres',
      'ri.sum.d':        'Portes',
      'ri.sum.total':    'Total rénovation',
      'phase.p':         '01 · PLOMBERIE / CVC',
      'phase.e':         '02 · ÉLECTRICITÉ',
      'phase.w':         '03 · FENÊTRES',
      'phase.d':         '04 · PORTES',
      'tag.p0.name':     'plomberie · cuisine',
      'tag.p0.desc':     'Évier + lave-vaisselle + lave-linge',
      'tag.p1.name':     'plomberie · salle de bain',
      'tag.p1.desc':     'Douche, WC, lavabo + tuyauterie complète',
      'tag.p2.name':     'climatisation',
      'tag.p2.desc':     '4× splits + conduits + installation',
      'tag.e0.name':     'électrique · tableau',
      'tag.e0.desc':     'Disjoncteur + 9 circuits protégés',
      'tag.e1.name':     'électrique · éclairage',
      'tag.e1.desc':     'Points lumineux LED dans tout le logement',
      'tag.e2.name':     'électrique · prises',
      'tag.e2.desc':     '24 prises de courant',
      'tag.w0.name':     'fenêtres · salon',
      'tag.w0.desc':     '2× PVC double vitrage',
      'tag.w1.name':     'fenêtres · chambres',
      'tag.w1.desc':     '3× fenêtre + volet roulant',
      'tag.w2.name':     'fenêtres · cuisine',
      'tag.w2.desc':     'Coulissante avec moustiquaire',
      'tag.d0.name':     'portes · entrée',
      'tag.d0.desc':     'Blindée classe 3 + verrou',
      'tag.d1.name':     'portes · intérieures',
      'tag.d1.desc':     '4× porte laquée blanche',

      /* PROCESS */
      'proc.h2':  'Notre méthode de chiffrage en 4 étapes claires',
      'proc.sub': 'Un déroulement simple de l\'envoi des plans à la remise de votre offre. Consultez la liste complète des <a href="/servicios.html">lots et prestations que nous chiffrons</a>.',
      'proc.1.h': 'Envoi des plans & du périmètre',
      'proc.1.p': 'Transmettez vos plans (PDF, DWG ou BIM), descriptifs et date de remise. L\'analyse initiale est gratuite.',
      'proc.2.h': 'Devis forfaitaire & délai confirmé',
      'proc.2.p': 'Vous recevez par écrit le périmètre exact, nos honoraires fixes et la date de livraison avant tout démarrage.',
      'proc.3.h': 'Métré & chiffrage technique',
      'proc.3.p': 'Un architecte technique réalise le métré avec repérage couleur sur plan et valorise matériaux, main-d\'œuvre et matériel.',
      'proc.4.h': 'Livraison prête à soumissionner',
      'proc.4.p': 'Remise en Excel modifiable, PDF et BC3 (ou divisions CSI MasterFormat), avec hypothèses, exclusions et un cycle de révision inclus.',

      /* WHO WE WORK WITH */
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

      /* DONDE TRABAJAMOS */
      'donde.h2':    'Priorité à la Floride. Clients dans toute l\'Europe et dans le monde.',
      'donde.sub':   'Nous travaillons surtout dans l\'État de Floride et accompagnons entreprises générales, sous-traitants, promoteurs et architectes dans toute l\'Europe et dans le monde entier. Sans frontières : les plans voyagent en numérique et chaque devis suit les normes, les unités et la devise du lieu du chantier.',
      'donde.1.h':   'Spécialisation dans l\'État de Floride',
      'donde.1.p':   'Postes structurés selon CSI MasterFormat avec coûts régionaux de Floride, intégrant <a href="/fr/estimation-construction-miami.html">le Florida Building Code, la zone HVHZ et les agréments NOA à Miami-Dade et en Floride du Sud</a> dès le premier chiffre.',
      'donde.2.h':   'Europe et reste du monde · Sans frontières',
      'donde.2.p':   'Aucune limite géographique : système métrique ou impérial, dans votre devise et selon le standard de votre appel d\'offres (CSI MasterFormat, BC3, Eurocodes ou Bill of Quantities).',
      'donde.3.h':   'Décalage horaire pour des livraisons plus rapides',
      'donde.3.p':   'Notre bureau technique (Clear Ascend OÜ, Estonie) démarre 7 heures avant la côte Est des États-Unis : les plans envoyés en fin de journée sont métrés pendant la nuit.',
      'donde.badge.main': 'Floride · Europe · Monde entier',
      'donde.badge.sub': 'Sans frontières · 100 % numérique',
      'donde.outro': 'Vous chiffrez un projet en Floride du Sud ? Consultez notre page dédiée à l\'<a href="/estimados-de-construccion-miami.html">estimation de construction à Miami</a> ou <a href="/contacto.html">envoyez vos plans pour recevoir un forfait écrit</a>.',

      /* FAQ */
      'faq.h2':    'Questions Fréquentes sur l\'Estimation des Coûts',
      'faq.intro': 'Les réponses essentielles avant de nous confier vos plans. Découvrez aussi <a href="/nosotros.html">qui élabore concrètement chaque devis</a>.',
      'faq.1.q':   'Pourquoi externaliser vos métrés et estimations de coûts ?',
      'faq.1.a':   'L\'externalisation offre une capacité de chiffrage immédiate lors des pics d\'appels d\'offres sans embauche fixe, avec des quantités vérifiables et des prix actualisés.',
      'faq.2.q':   'Quels types de projets de construction chiffrez-vous ?',
      'faq.2.a':   'Nous chiffrons les opérations résidentielles, rénovations lourdes, commerces, bureaux, bâtiments industriels ainsi que les lots techniques MEP, gros œuvre et maçonnerie.',
      'faq.3.q':   'Qui réalise les devis chez Pr3cise ?',
      'faq.3.a':   'Chaque devis est élaboré directement par un architecte technique disposant de plusieurs décennies d\'expérience dans le bâtiment, alliant métré numérique repéré par couleurs (PDF, DWG ou BIM) et sous-détail complet main-d\'œuvre, matériaux et matériel.',
      'faq.4.q':   'Quelle différence entre un métré quantitatif et un devis estimatif ?',
      'faq.4.a':   'Le métré recense toutes les quantités physiques traçables sur les plans annotés. Le devis estimatif valorise ces quantités avec les prix régionaux, rendements, pertes, frais généraux et bénéfice.',
      'faq.5.q':   'Travaillez-vous sur maquette BIM ou sur plans PDF ?',
      'faq.5.a':   'Les deux. Nous extrayons les quantités des maquettes BIM/IFC lorsqu\'elles existent, ou mesurons sur plans PDF/DWG avec repérage couleur.',
      'faq.6.q':   'Pouvez-vous préparer le chiffrage d\'un appel d\'offres public ?',
      'faq.6.a':   'Oui. Nous respectons le cadre du DPGF ou du cahier des charges, livrons en Excel, PDF et BC3, et documentons par écrit les hypothèses et exclusions.',
      'faq.7.q':   'Comment sont fixés vos honoraires ?',
      'faq.7.a':   'Chaque dossier fait l\'objet d\'un forfait fixe convenu par écrit après examen gratuit de vos plans, avec date de livraison garantie avant tout démarrage.',
      'faq.8.q':   'Comment assurez-vous la confidentialité de nos plans ?',
      'faq.8.a':   'Tous vos plans, descriptifs et prix fournisseurs sont traités de manière strictement confidentielle et ne sont jamais partagés avec des tiers. Nous signons un accord de confidentialité (NDA) sur demande.',

      /* TRUSTPILOT */
      'tp.h2':  'Ce que disent nos clients',
      'tp.sub': 'Retours authentiques de professionnels qui confient leurs métrés et estimations de coûts à Pr3cise.',

      /* SERVICES PAGE */
      'services.h2':             'Secteurs d\'Intervention et Spécialités',
      'services.sub':            'Métrés détaillés et estimations de coûts adaptés aux exigences techniques et réglementaires de chaque corps d\'état.',
      'services.construccion.h3':'Projets Résidentiels et Bâtiments Tertiaires',
      'services.construccion.p': 'Décompositions complètes des terrassements aux finitions pour sécuriser le budget des promoteurs, entreprises générales et maîtres d\'œuvre.',
      'services.publica.h3':     'Appels d\'Offres Publics',
      'services.publica.p':      'Cadres adaptés aux cahiers des charges publics avec remise en Excel modifiable, PDF et BC3 normalisé.',
      'services.fontaneria.h3':  'Lots Techniques (MEP / CVC)',
      'services.fontaneria.p':   'Métrés précis en Électricité, <strong>Plomberie</strong>, CVC et <strong>Protection Incendie</strong>, selon les référentiels en vigueur sur le lieu du chantier (par exemple Florida Building Code, NEC et NFPA en Floride, Eurocodes en Europe).',
      'services.albanileria.h3': 'Gros Œuvre & Corps d\'État Spécialisés',
      'services.albanileria.p':  'Quantitatifs minutieux pour Béton armé, <strong>Maçonnerie</strong>, Charpente métallique, Cloisons, Menuiseries et Vitrerie.',
      'services.methodology.h3': 'Que comprend chacun de nos devis ?',
      'services.methodology.1':  '<strong>Quantités de matériaux et prix régionaux à jour :</strong> prix publics et nets adaptés au marché réel du chantier.',
      'services.methodology.2':  '<strong>Pertes, frais généraux et marge modifiables :</strong> feuilles de calcul ouvertes pour ajuster vos coefficients.',
      'services.methodology.3':  '<strong>Sous-détail technique par unité :</strong> distinction claire entre main-d\'œuvre, matériaux et matériel.',
      'services.methodology.4':  '<strong>Note de périmètre, hypothèses et exclusions :</strong> clarification écrite de ce qui est inclus ou non défini sur les plans.',
      'services.methodology.5':  '<strong>Livraison multi-formats :</strong> Excel, PDF, BC3 ou divisions CSI MasterFormat, accompagnés des plans repérés.',
      'services.methodology.6':  '<strong>Cycle de révision inclus :</strong> ajustement en cas d\'additif au dossier ou de mise à jour ponctuelle.',
      'services.where.h2':       'Où nous intervenons',
      'services.where.p1':       'Pr3cise est un bureau d\'estimation à distance — Clear Ascend OÜ, société immatriculée en Estonie — sans agence physique où vous déplacer. Vous transmettez plans et descriptifs par voie numérique, un architecte technique les mesure et les chiffre, et vous recevez le devis dans le format et selon les normes du lieu de construction.',
      'services.where.li1':      '<strong>État de Floride (priorité)</strong> — postes structurés selon CSI MasterFormat avec coûts régionaux ; à <a href="/fr/estimation-construction-miami.html">Miami-Dade et en Floride du Sud</a>, Florida Building Code, HVHZ et NOA intégrés dès le départ.',
      'services.where.li2':      '<strong>Toute l\'Europe</strong> — métrés, budgets et Bills of Quantities selon les Eurocodes et les normes nationales du chantier, en BC3, Excel et PDF.',
      'services.where.li3':      '<strong>Monde entier, sans frontières</strong> — la structure exigée par votre dossier (CSI MasterFormat, BoQ ou votre propre modèle), en unités métriques ou impériales et dans votre devise.',
      'services.where.p2':       'Nul besoin d\'être sur le chantier pour mesurer un jeu de plans, et notre journée commence sept heures avant la côte Est américaine presque toute l\'année (six heures durant les brèves semaines de changement d\'heure). Découvrez <a href="/nosotros.html">qui élabore chaque devis</a> ou <a href="/contacto.html">demandez un chiffrage forfaitaire</a>.',
      'services.cta':            'Voir nos exemples de devis',

      /* NOSOTROS PAGE */
      'nosotros.h2':   'L\'architecture technique au service de la maîtrise des coûts.',
      'nosotros.sub':  'Pr3cise s\'appuie sur plusieurs décennies d\'expérience dans le bâtiment. Chaque devis est élaboré directement par un architecte technique.',
      'nosotros.p1':   'Derrière chaque estimation Pr3cise se trouve un architecte technique fort de plusieurs décennies d\'expérience concrète en bâtiment et économie de la construction. Nous ne sous-traitons pas vos plans à des opérateurs de saisie et ne gonflons pas artificiellement nos équipes : le professionnel qui lit vos détails, mesure chaque ouvrage et compose les prix connaît la réalité du chantier.',
      'nosotros.p2':   'Pr3cise est exploité par Clear Ascend OÜ (société enregistrée en Estonie, code 17448615) et travaille 100 % à distance, avec une priorité sur l\'État de Floride (Miami-Dade et Floride du Sud) et des clients dans toute l\'Europe et dans le monde entier — sans frontières. Chaque mission débute par un forfait écrit, un délai garanti et une confidentialité stricte.',
      'nosotros.1.h':  'Élaboré par un Architecte Technique',
      'nosotros.1.p':  'Chaque métré et chaque sous-détail de prix est préparé directement par un architecte technique expérimenté.',
      'nosotros.2.h':  'Maîtrise des Standards Internationaux',
      'nosotros.2.p':  'Divisions CSI MasterFormat et exigences HVHZ/FBC en Floride, Eurocodes et cadres BoQ en Europe, et partout ailleurs le BC3 ou le format exigé par votre appel d\'offres.',
      'nosotros.3.h':  'Forfait Écrit & Confidentialité',
      'nosotros.3.p':  'Structure transparente via Clear Ascend OÜ (Estonie), honoraires fixes convenus d\'avance et protection stricte de vos documents.',
      'nosotros.cta':  'Voir nos services',

      /* MARIEDOM SECTION */
      'mariedom.label': 'Pratique Architecturale Associée',
      'mariedom.h3':    'Architecture, Design & Développement Technique — MARIEDOM',
      'mariedom.p1':    'Au-delà de l\'estimation des coûts de construction, notre agence d\'architecture développe également des projets de conception architecturale, de documentation technique et de visualisation 3D.',
      'mariedom.p2':    'Notre activité architecturale comprend des projets résidentiels, le design d\'espace et le développement technique. Pour découvrir nos réalisations et services d\'architecture, visitez MARIEDOM.',
      'mariedom.cta':   'Découvrir MARIEDOM',

      /* EJEMPLOS PAGE */
      'ejemplos.h2':          'Exemples Réels de Devis et Métrés : Le Standard Pr3cise',
      'ejemplos.sub':         'Nous livrons de véritables outils de remise d\'offre et de gestion : chaque poste inclut son métré traçable sur plan, ses pertes par matériau ainsi que les frais généraux et le bénéfice détaillés.',
      'ejemplos.1.h':         '1. PERTES ET CHUTES CALCULÉES PAR MATÉRIAU',
      'ejemplos.1.p':         'Carrelage, granulats, aciers et gaines n\'ont pas le même taux de chute. Nous appliquons des coefficients réalistes par matériau plutôt qu\'un forfait arbitraire.',
      'ejemplos.2.h':         '2. FRAIS GÉNÉRAUX ET BÉNÉFICE DÉTAILLÉS',
      'ejemplos.2.p':         'Ventilation claire des coûts indirects — qu\'il s\'agisse des <span class="highlight-gold">pourcentages de frais généraux et de bénéfice</span> imposés par l\'appel d\'offres ou du General Conditions &amp; Markup CSI — pour défendre votre marge.',
      'ejemplos.3.h':         '3. TABLEURS OUVERTS & PRIX RÉGIONAUX',
      'ejemplos.3.p':         'Bases de prix actualisées dans des classeurs Excel non verrouillés permettant d\'intégrer vos propres remises fournisseurs en quelques secondes.',
      'ejemplos.4.h':         '4. MÉTRÉS GÉOMÉTRIQUES REPÉRÉS EN COULEURS',
      'ejemplos.4.p':         'Chaque quantité est reliée aux plans annotés en couleurs pour faciliter le contrôle interne, les variantes et les situations de travaux.',
      'ejemplos.redact.note': 'Tous les exemples présentés ci-dessus sont des extraits authentiques et anonymisés de métrés et devis élaborés par un architecte technique chez Pr3cise — noms des clients, adresses et prix confidentiels ont été masqués.',
      'ejemplos.cta':         'Demander un forfait de chiffrage',

      /* CONTACTO PAGE */
      'contacto.h2':             'Demandez votre devis forfaitaire sans engagement',
      'contacto.sub':            'Présentez-nous votre projet : nous répondons sous 24 heures ouvrées avec le périmètre, le tarif fixe et la date de livraison.',
      'contacto.intro.1':        'Chaque devis est élaboré poste par poste par un architecte technique, en distinguant matériaux, main-d\'œuvre et matériel sous Excel, PDF et BC3 ou CSI MasterFormat. <strong>Livraison habituelle sous 24 à 72 heures</strong> selon le périmètre, à prix fixe convenu par écrit.',
      'contacto.intro.2':        'L\'examen initial de vos plans est gratuit et confidentiel. Nous travaillons à distance (Clear Ascend OÜ, Estonie) avec entreprises générales, sous-traitants, promoteurs et architectes à Miami-Dade, en Europe et à l\'international.',
      'contacto.drawings.p':     '<strong>Vos plans sont prêts (PDF, DWG, Revit/IFC) ?</strong> Collez un lien Google Drive, Dropbox, OneDrive ou WeTransfer dans votre message, ou envoyez-les directement à <a href="mailto:contact@pr3cise.com">contact@pr3cise.com</a>. Confidentialité stricte garantie.',
      'contacto.lbl.nombre':     'Nom',
      'contacto.lbl.empresa':    'Entreprise',
      'contacto.lbl.email':      'E-mail professionnel',
      'contacto.lbl.telefono':   'Téléphone (facultatif)',
      'contacto.phone.code':     'Indicatif',
      'contacto.lbl.proyecto':   'Périmètre souhaité',
      'contacto.lbl.mensaje':    'Détails du projet & lien vers les plans',
      'contacto.opt.default':    'Sélectionnez le périmètre ou le lot',
      'contacto.opt.completo':   'Devis complet tous corps d\'état (neuf / rénovation)',
      'contacto.opt.takeoff':    'Métré quantitatif seul (Quantity Takeoff)',
      'contacto.opt.conceptual': 'Estimation conceptuelle / faisabilité',
      'contacto.opt.mep':        'Lot complet MEP / CVC, Électricité, Plomberie, Incendie',
      'contacto.opt.construccion':'Installations électriques',
      'contacto.opt.fontaneria': 'Plomberie et assainissement',
      'contacto.opt.pci':        'Protection incendie (NFPA / PCI)',
      'contacto.opt.albanileria':'Gros œuvre, béton et maçonnerie',
      'contacto.opt.carpinteria':'Second œuvre, cloisons et menuiseries',
      'contacto.opt.otro':       'Appel d\'offres public / autre besoin',
      'contacto.captcha':        'Vérification rapide · Centrez la bulle pour activer l\'envoi',
      'contacto.level.drag':     'Faites glisser le curseur pour centrer la bulle',
      'contacto.submit':         'Demander un Devis Forfaitaire',
      'contacto.sent':           'Demande envoyée avec succès. Réponse sous 24 heures ouvrées.',
      'contacto.error':          'Erreur d\'envoi. Veuillez nous écrire à contact@pr3cise.com.',

      /* CONTACT-PAGE FAQ */
      'cfaq.h2':  'Questions Fréquentes avant l\'envoi de vos plans',
      'cfaq.sub': 'Délais, formats acceptés, honoraires forfaitaires et confidentialité.',
      'cfaq.1.q': 'Sous quel délai livrez-vous un devis ?',
      'cfaq.1.a': 'Les métrés d\'un seul lot sont généralement livrés en <strong>24–48 heures</strong> et les chiffrages tous corps d\'état en <strong>48–72 heures</strong> après réception du dossier complet. Pour les projets plus vastes, le délai exact est confirmé par écrit avant démarrage.',
      'cfaq.2.q': 'Quels documents faut-il transmettre pour obtenir un tarif ?',
      'cfaq.2.a': 'Les plans en PDF ou DWG (ou maquette BIM), la localisation du chantier, les lots à chiffrer et votre date limite suffisent pour établir notre proposition forfaitaire.',
      'cfaq.3.q': 'L\'analyse initiale des plans est-elle payante ?',
      'cfaq.3.a': 'Non, l\'examen de faisabilité et le chiffrage de nos honoraires sont <strong>gratuits et sans engagement</strong>. Aucun frais caché.',
      'cfaq.4.q': 'Dans quels formats remettez-vous le dossier ?',
      'cfaq.4.a': 'En standard sous <strong>Excel modifiable et PDF</strong> avec plans repérés en couleurs — structurés selon <strong>CSI MasterFormat</strong>, en <strong>BC3</strong> ou selon le standard de votre appel d\'offres.',
      'cfaq.5.q': 'Une révision est-elle prévue si le projet évolue ?',
      'cfaq.5.a': 'Oui, un cycle de révision est inclus pour ajuster des prix unitaires, des marges ou un additif mineur. Toute refonte majeure du périmètre est convenue ensemble.',
      'cfaq.6.q': 'Travaillez-vous avec des entreprises de n\'importe quel pays ?',
      'cfaq.6.a': 'Oui. Nous travaillons <strong>100 % à distance</strong> depuis Clear Ascend OÜ (Estonie), principalement dans l\'État de Floride et pour des clients dans toute l\'Europe et dans le monde entier — sans frontières —, avec les prix locaux du chantier.',
      'cfaq.7.q': 'Chiffrez-vous les lots techniques spécialisés (MEP, électricité, incendie, plomberie) ?',
      'cfaq.7.a': 'Oui. Nous réalisons des métrés et décompositions complètes en électricité, plomberie, CVC, protection incendie, béton armé et maçonnerie.',
      'cfaq.8.q': 'Mes plans et données commerciales restent-ils confidentiels ?',
      'cfaq.8.a': 'Absolument. Vos documents servent uniquement à établir votre estimation et ne sont jamais transmis à des tiers. Nous signons un NDA avant l\'envoi des fichiers sur simple demande.',

      /* PRICING PAGE */
      'pricing.h2':              'Honoraires forfaitaires clairs, sans surprise.',
      'pricing.basic.h3':        'Projet à l\'Unité (Forfait Fixe)',
      'pricing.basic.p':         'À partir de 300 € <span class="tax">HT selon le périmètre du projet.</span>',
      'pricing.basic.delivery':  'Devis écrit préalable · Livraison habituelle sous 24–72 h.',
      'pricing.business.h3':     'Forfait Récurrent (Volume Mensuel)',
      'pricing.business.p':      'Réduisez votre coût par appel d\'offres en externalisant régulièrement vos métrés auprès d\'un architecte technique.',
      'pricing.business.volume':  'Pour entreprises générales, sous-traitants et agences à flux régulier.',
      'pricing.disclaimer':      'Nos livrables ne sont pas de simples offres commerciales : ce sont des devis techniques détaillés poste par poste, élaborés par un architecte technique pour soumissionner, acheter et suivre vos coûts réels.',

      /* CTA FINAL */
      'cta.h2':  'Demandez un Devis Forfaitaire pour Votre Prochain Projet',
      'cta.p':   'Envoyez vos plans et votre périmètre. Vous recevrez par écrit une proposition à prix fixe, les hypothèses documentées et une date de livraison confirmée avant tout démarrage.',
      'cta.btn': 'Demander un Devis Gratuit',

      /* FOOTER */
      'footer.brand':      'Cabinet d\'estimation des coûts de construction et de métrés à distance exploité par Clear Ascend OÜ (Estonie) pour projets internationaux.',
      'footer.services.h': 'Services Phares',
      'footer.svc.1':      'Estimation des coûts de construction',
      'footer.svc.2':      'Métrés et devis de plomberie',
      'footer.svc.3':      'Devis protection incendie',
      'footer.svc.4':      'Chiffrage béton et maçonnerie',
      'footer.contact.h':  'Contact Rapide',
      'footer.wa':         'Contacter par WhatsApp',
      'footer.legal.h':    'Informations Légales',
      'footer.legal.1':    'Mentions Légales',
      'footer.legal.2':    'Politique de Confidentialité',
      'footer.legal.3':    'Politique de Cookies',
      'footer.legal.4':    'Conditions Générales',
      'legal.title':       'Informations Légales'
    }
  }; /* end T */

  var currentLang = 'es';

  function getLang() { return currentLang; }

  function t(key) {
    return (T[currentLang] && T[currentLang][key]) ||
           (T['es'] && T['es'][key]) || key;
  }

  function applyTranslations(lang) {
    var dict = T[lang];
    if (!dict) return;

    document.documentElement.lang = lang;

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (dict[key] !== undefined) el.textContent = dict[key];
    });

    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-html');
      if (dict[key] !== undefined) el.innerHTML = dict[key];
    });

    var flagImg = document.getElementById('lang-flag-img');
    if (flagImg && FLAG_IMGS[lang]) {
      flagImg.src = FLAG_IMGS[lang];
      flagImg.alt = '';
    }

    document.querySelectorAll('.lang-option').forEach(function (btn) {
      var code = btn.getAttribute('data-lang') || (btn.getAttribute('hreflang') || '').slice(0, 2);
      btn.classList.toggle('active', code === lang);
    });
  }

  function setLang(lang) {
    if (!T[lang]) return;
    try { localStorage.setItem('pr3cise_lang', lang); } catch (e) {}
    applyTranslations(lang);
  }

  var _dropOpen = false;

  function closeDropdown() {
    var dd = document.getElementById('lang-dropdown');
    var btn = document.getElementById('lang-flag-btn');
    if (dd) dd.classList.remove('open');
    if (btn) {
      btn.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    }
    _dropOpen = false;
  }

  function initDropdown() {
    var flagBtn = document.getElementById('lang-flag-btn');
    if (!flagBtn || flagBtn.dataset.bound === '1') return;
    flagBtn.dataset.bound = '1';

    flagBtn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      _dropOpen = !_dropOpen;
      var dd = document.getElementById('lang-dropdown');
      if (dd) dd.classList.toggle('open', _dropOpen);
      flagBtn.classList.toggle('open', _dropOpen);
      flagBtn.setAttribute('aria-expanded', String(_dropOpen));
    });

    document.querySelectorAll('button.lang-option[data-lang]').forEach(function (opt) {
      opt.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        setLang(opt.getAttribute('data-lang'));
        closeDropdown();
      });
    });

    document.querySelectorAll('a.lang-option[hreflang]').forEach(function (link) {
      link.addEventListener('click', function () {
        var code = (link.getAttribute('hreflang') || '').slice(0, 2);
        try { localStorage.setItem('pr3cise_lang', code); } catch (e) {}
      });
    });

    document.addEventListener('click', function (e) {
      if (!e.target.closest('.lang-switcher')) closeDropdown();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && _dropOpen) {
        closeDropdown();
        flagBtn.focus();
      }
    });
  }

  function init() {
    var pageLang = (document.documentElement.getAttribute('lang') || 'es').slice(0, 2).toLowerCase();
    currentLang = T[pageLang] ? pageLang : 'es';

    /* Explicit ?lang= query parameter is respected on shared legal pages (/legal.html?lang=en) */
    var qLang = null;
    try { qLang = new URLSearchParams(location.search).get('lang'); } catch (e) {}
    if (qLang && T[qLang]) {
      currentLang = qLang;
      try { localStorage.setItem('pr3cise_lang', qLang); } catch (e) {}
      if (qLang !== pageLang) {
        applyTranslations(qLang);
      }
    }

    var flagImg = document.getElementById('lang-flag-img');
    if (flagImg && FLAG_IMGS[currentLang]) {
      flagImg.src = FLAG_IMGS[currentLang];
      flagImg.alt = '';
    }

    initDropdown();
  }

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
