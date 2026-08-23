/**
 * Genera /de/ y /fr/ en pr3cise.com. Los dos idiomas existían ya "por
 * JavaScript" (assets/js/i18n.js cambiaba el texto en caliente) pero sin URL
 * propia ni hreflang: para un buscador no existían. Esto les da página real.
 *
 * Cada página es un CLÚSTER con una versión por idioma y una fuente:
 *   fuente 'es' → se parte del HTML español y se aplica el diccionario de
 *                 i18n.js en servidor, igual que hacía el navegador. Lo que el
 *                 diccionario no cubre (title, description, JSON-LD, alt, texto
 *                 suelto) sale de extra-<lang>.json.
 *   fuente 'en' → la página sólo existe en inglés (landings por oficio, Miami).
 *                 La traducción completa la produce un agente y se recoge de
 *                 pr3cise-traducciones/<lang>/<fichero-en>.html; aquí sólo se
 *                 ajusta la cabecera, los enlaces y el selector.
 *
 * Uso:
 *   node render-pr3cise-idiomas.mjs --informe   lista lo que falta por traducir
 *   node render-pr3cise-idiomas.mjs             escribe las páginas, actualiza
 *                                               hreflang/selector en es y en, y
 *                                               reescribe sitemap.xml
 */
import fs from 'node:fs'
import path from 'node:path'
import * as cheerio from 'cheerio' // npm i cheerio (no se versiona node_modules)

// En Windows, pathname de un file:// empieza por "/M:/..."; se quita esa barra.
const AQUI = path.dirname(decodeURIComponent(new URL(import.meta.url).pathname).replace(/^\/([A-Z]:)/, '$1'))
const RAIZ = path.resolve(AQUI, '..', '..')
const ORIGEN = 'https://pr3cise.com'
const TRADUCCIONES = path.join(AQUI, 'pr3cise-traducciones')
const NUEVOS = ['de', 'fr']
const INFORME = process.argv.includes('--informe')

/** Rutas relativas a la raíz del sitio. `null` = esa versión no existe. */
export const CLUSTERS = [
  { id: 'home',      fuente: 'es', es: 'index.html',                           en: 'en/index.html',                                     de: 'de/index.html',                              fr: 'fr/index.html' },
  { id: 'servicios', fuente: 'es', es: 'servicios.html',                       en: 'en/services.html',                                  de: 'de/leistungen.html',                         fr: 'fr/services.html' },
  { id: 'ejemplos',  fuente: 'es', es: 'ejemplos.html',                        en: 'en/portfolio.html',                                 de: 'de/portfolio.html',                          fr: 'fr/portfolio.html' },
  { id: 'nosotros',  fuente: 'es', es: 'nosotros.html',                        en: 'en/about.html',                                     de: 'de/ueber-uns.html',                          fr: 'fr/a-propos.html' },
  { id: 'contacto',  fuente: 'es', es: 'contacto.html',                        en: 'en/contact.html',                                   de: 'de/kontakt.html',                            fr: 'fr/contact.html' },
  // El sitio inglés no tiene aviso legal; el selector manda a su portada.
  { id: 'legal',     fuente: 'es', es: 'legal.html',                           en: null,                                                de: 'de/rechtliches.html',                        fr: 'fr/mentions-legales.html' },
  { id: 'miami',     fuente: 'en', es: 'estimados-de-construccion-miami.html', en: 'en/miami-construction-estimating-services.html',    de: 'de/baukostenschaetzung-miami.html',          fr: 'fr/estimation-construction-miami.html' },
  { id: 'plumbing',  fuente: 'en', es: null,                                   en: 'en/plumbing-estimating-services-miami.html',        de: 'de/sanitaer-kalkulation-miami.html',         fr: 'fr/estimation-plomberie-miami.html' },
  { id: 'electric',  fuente: 'en', es: null,                                   en: 'en/electrical-estimating-services-miami.html',      de: 'de/elektro-kalkulation-miami.html',          fr: 'fr/estimation-electricite-miami.html' },
  { id: 'concrete',  fuente: 'en', es: null,                                   en: 'en/concrete-masonry-estimating-services-miami.html', de: 'de/beton-mauerwerk-kalkulation-miami.html', fr: 'fr/estimation-beton-maconnerie-miami.html' },
  { id: 'fire',      fuente: 'en', es: null,                                   en: 'en/fire-protection-estimating-services-miami.html', de: 'de/brandschutz-kalkulation-miami.html',      fr: 'fr/estimation-protection-incendie-miami.html' },
  { id: 'mep',       fuente: 'en', es: null,                                   en: 'en/mep-estimating-services-miami.html',             de: 'de/tga-kalkulation-miami.html',              fr: 'fr/estimation-lots-techniques-miami.html' },
]
const IDIOMAS = ['es', 'en', 'de', 'fr']
const OG_LOCALE = { es: 'es_ES', en: 'en_US', de: 'de_DE', fr: 'fr_FR' }
const NOMBRE = { es: 'Español', en: 'English', de: 'Deutsch', fr: 'Français' }
const BANDERA = { es: 'es', en: 'us', de: 'de', fr: 'fr' }

const rutaPublica = (f) => '/' + f.replace(/(^|\/)index\.html$/, '$1')
const url = (c, l) => (c[l] ? ORIGEN + rutaPublica(c[l]) : null)
const idiomasDe = (c) => IDIOMAS.filter((l) => c[l])
const xDefault = (c) => url(c, 'en') || url(c, 'es')
/** Fichero (relativo a la raíz) → { clúster, idioma } */
const POR_FICHERO = new Map()
for (const c of CLUSTERS) for (const l of IDIOMAS) if (c[l]) POR_FICHERO.set(c[l], { c, l })

// ── Diccionario: extraer `var T = {...}` de i18n.js sin ejecutar el resto ──
function cargarDiccionario() {
  const src = fs.readFileSync(path.join(RAIZ, 'assets/js/i18n.js'), 'utf8')
  const ini = src.search(/var\s+T\s*=\s*\{/)
  if (ini < 0) throw new Error('no encuentro `var T = {` en i18n.js')
  let i = src.indexOf('{', ini), prof = 0, enCadena = null, j = i
  for (; j < src.length; j++) {
    const ch = src[j]
    if (enCadena) { if (ch === '\\') j++; else if (ch === enCadena) enCadena = null; continue }
    if (ch === "'" || ch === '"' || ch === '`') { enCadena = ch; continue }
    if (ch === '{') prof++
    else if (ch === '}') { prof--; if (prof === 0) break }
  }
  return new Function('return ' + src.slice(i, j + 1))()
}
function extra(lang) {
  const f = path.join(AQUI, `extra-${lang}.json`)
  return fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : {}
}

// ── Piezas comunes a toda página ──
function ponerCabecera($, c, lang) {
  $('html').attr('lang', lang)
  $('link[rel="canonical"]').attr('href', url(c, lang))
  $('meta[property="og:url"]').attr('content', url(c, lang))
  $('meta[property="og:locale"]').attr('content', OG_LOCALE[lang])
  $('meta[property="og:locale:alternate"]').remove()
  for (const l of idiomasDe(c)) if (l !== lang) $('meta[property="og:locale"]').after(`\n    <meta property="og:locale:alternate" content="${OG_LOCALE[l]}">`)
  $('link[rel="alternate"][hreflang]').remove()
  const lineas = idiomasDe(c).map((l) => `<link rel="alternate" hreflang="${l}" href="${url(c, l)}">`)
  lineas.push(`<link rel="alternate" hreflang="x-default" href="${xDefault(c)}">`)
  $('link[rel="canonical"]').after('\n    ' + lineas.join('\n    '))
}

function ponerSelector($, c, lang) {
  const $dd = $('#lang-dropdown')
  if (!$dd.length) return
  $dd.empty()
  for (const l of IDIOMAS) {
    const destino = c[l] ? rutaPublica(c[l]) : (l === 'es' ? '/' : `/${l}/`)
    $dd.append(`\n                <a class="lang-option${l === lang ? ' active' : ''}" href="${destino}" hreflang="${l}"><img src="/assets/img/flags/${BANDERA[l]}.svg" width="20" height="14" alt=""> ${NOMBRE[l]}</a>`)
  }
  $dd.append('\n            ')
  $('#lang-flag-img').attr('src', `/assets/img/flags/${BANDERA[lang]}.svg`)
}

/** Enlaces internos → la versión de este idioma del mismo clúster (si existe). */
function reenlazar($, ficheroOrigen, lang) {
  const dirOrigen = path.posix.dirname(ficheroOrigen)
  $('a[href]').each((_, el) => {
    if ($(el).hasClass('lang-option')) return
    const h = $(el).attr('href')
    // Se admite ?query (p. ej. legal.html?lang=en, que conmutaba el bloque por
    // JS); al apuntar a la página del idioma la query sobra y se descarta.
    const m = h.match(/^(?!https?:|mailto:|tel:|#)([^#?]*)(\?[^#]*)?(#.*)?$/)
    if (!m) return
    let f = m[1].startsWith('/') ? m[1].slice(1) : path.posix.normalize(path.posix.join(dirOrigen === '.' ? '' : dirOrigen, m[1]))
    if (f === '' || f.endsWith('/')) f += 'index.html'
    const hit = POR_FICHERO.get(f)
    if (!hit || !hit.c[lang]) return
    $(el).attr('href', rutaPublica(hit.c[lang]) + (m[3] || ''))
  })
}

// ── Fuente español + diccionario ──
function desdeEspanol(c, lang, dict, ext) {
  const $ = cheerio.load(fs.readFileSync(path.join(RAIZ, c.es), 'utf8'), { decodeEntities: false })
  const residuo = []
  const pagExt = ext[c.id] || {}

  // legal.html trae el aviso en los cuatro idiomas en bloques ocultos que el
  // navegador conmuta; aquí queda sólo el de este idioma (cuatro copias del
  // mismo aviso en una página sería contenido duplicado para el buscador).
  $('.lang-block[data-lang]').each((_, el) => {
    if ($(el).attr('data-lang') === lang) $(el).removeAttr('hidden'); else $(el).remove()
  })

  // Lo mismo que applyTranslations() en el navegador
  $('[data-i18n]').each((_, el) => {
    const k = $(el).attr('data-i18n')
    if (dict[k] !== undefined) $(el).text(dict[k])
    else if (pagExt[`clave:${k}`]) $(el).text(pagExt[`clave:${k}`])
    else residuo.push({ tipo: 'clave-sin-traducir', clave: k, texto: $(el).text().trim().slice(0, 80) })
  })
  $('[data-i18n-html]').each((_, el) => {
    const k = $(el).attr('data-i18n-html')
    if (dict[k] !== undefined) $(el).html(dict[k])
    else residuo.push({ tipo: 'clave-sin-traducir', clave: k, texto: $(el).text().trim().slice(0, 80) })
  })
  $('.site-nav a[data-original]').each((_, el) => {
    const k = $(el).attr('data-i18n')
    if (k && dict[k]) $(el).attr('data-original', dict[k])
  })

  aplicarExtras($, c, lang, pagExt, residuo)
  ponerCabecera($, c, lang)
  reenlazar($, c.es, lang)
  ponerSelector($, c, lang)
  return { html: $.html(), residuo }
}

/** title, description, OG, JSON-LD, alt y texto sin clave: de extra-<lang>.json o al informe. */
function aplicarExtras($, c, lang, pagExt, residuo) {
  const campos = { title: $('title'), description: $('meta[name="description"]'), 'og:title': $('meta[property="og:title"]'), 'og:description': $('meta[property="og:description"]') }
  for (const [campo, $el] of Object.entries(campos)) {
    if (!$el.length) continue
    const actual = campo === 'title' ? $el.text() : $el.attr('content')
    if (pagExt[campo]) { campo === 'title' ? $el.text(pagExt[campo]) : $el.attr('content', pagExt[campo]) }
    else residuo.push({ tipo: 'cabecera', campo, texto: actual })
  }
  // Las tarjetas de Twitter repiten title/description
  if ($('meta[name="twitter:title"]').length) $('meta[name="twitter:title"]').attr('content', $('title').text())
  if ($('meta[name="twitter:description"]').length) $('meta[name="twitter:description"]').attr('content', $('meta[name="description"]').attr('content'))
  $('script[type="application/ld+json"]').each((i, el) => {
    const k = `ld+json#${i}`
    if (pagExt[k]) {
      // URLs del grafo → las de este idioma
      let txt = typeof pagExt[k] === 'string' ? pagExt[k] : JSON.stringify(pagExt[k], null, 2)
      for (const [f, { c: cc }] of POR_FICHERO) if (cc[lang]) txt = txt.split(ORIGEN + rutaPublica(f)).join(url(cc, lang))
      try { JSON.parse(txt) } catch { residuo.push({ tipo: 'json-ld-invalido', campo: k, texto: txt.slice(0, 120) }); return }
      $(el).html('\n' + txt + '\n    ')
    } else residuo.push({ tipo: 'json-ld', campo: k, texto: $(el).html().trim() })
  })
  $('img[alt]').each((_, el) => {
    const a = $(el).attr('alt').trim()
    if (!a) return
    if (pagExt[`alt:${a}`]) $(el).attr('alt', pagExt[`alt:${a}`])
    else residuo.push({ tipo: 'alt', texto: a })
  })
  $('body *').each((_, el) => {
    if (['script', 'style', 'noscript'].includes(el.tagName)) return
    if ($(el).attr('data-i18n') !== undefined || $(el).attr('data-i18n-html') !== undefined) return
    if ($(el).closest('[data-i18n-html]').length) return
    if ($(el).closest('.lang-block').length) return // ya está en el idioma destino
    if ($(el).hasClass('lang-option')) return
    const nodos = $(el).contents().filter((_, n) => n.type === 'text')
    const propio = nodos.text().replace(/\s+/g, ' ').trim()
    if (propio.length <= 2 || !/[a-záéíóúñ]{3,}/i.test(propio)) return
    if (/^(Pr3cise|[\w.+-]+@[\w.-]+)$/.test(propio)) return
    // El informe recorta el texto a 120 caracteres, así que la clave que el
    // traductor recibió puede ser la versión recortada.
    const trad = pagExt[`texto:${propio}`] || pagExt[`texto:${propio.slice(0, 120)}`]
    if (trad) nodos.each((_, n) => { if (n.data.trim()) n.data = n.data.replace(n.data.trim(), trad) })
    else residuo.push({ tipo: 'texto-sin-clave', etiqueta: el.tagName, texto: propio.slice(0, 120) })
  })
  // atributos con texto visible
  $('[placeholder],[aria-label],[title]').each((_, el) => {
    for (const at of ['placeholder', 'aria-label', 'title']) {
      const v = ($(el).attr(at) || '').trim()
      if (!v || !/[a-záéíóúñ]{3,}/i.test(v)) continue
      if (pagExt[`${at}:${v}`]) $(el).attr(at, pagExt[`${at}:${v}`])
      else residuo.push({ tipo: 'atributo', campo: at, texto: v })
    }
  })
}

// ── Fuente inglés: HTML traducido por un agente ──
function desdeTraduccion(c, lang) {
  const f = path.join(TRADUCCIONES, lang, path.basename(c.en))
  if (!fs.existsSync(f)) return { html: null, residuo: [{ tipo: 'falta-traduccion', texto: f }] }
  const $ = cheerio.load(fs.readFileSync(f, 'utf8'), { decodeEntities: false })
  ponerCabecera($, c, lang)
  reenlazar($, c.en, lang)
  ponerSelector($, c, lang)
  const residuo = []
  // JSON-LD: URLs del grafo a las de este idioma, y que siga siendo JSON
  $('script[type="application/ld+json"]').each((i, el) => {
    let txt = $(el).html()
    for (const [ff, { c: cc }] of POR_FICHERO) if (cc[lang]) txt = txt.split(ORIGEN + rutaPublica(ff)).join(url(cc, lang))
    try { JSON.parse(txt) } catch { residuo.push({ tipo: 'json-ld-invalido', campo: `ld+json#${i}` }) }
    $(el).html(txt)
  })
  if ($('html').attr('lang') !== lang) residuo.push({ tipo: 'lang-incorrecto' })
  // Las tarjetas de Twitter repiten title/description; que no se queden con la
  // versión larga que el traductor escribió antes del recorte.
  if ($('meta[name="twitter:title"]').length) $('meta[name="twitter:title"]').attr('content', $('title').text())
  if ($('meta[name="twitter:description"]').length) $('meta[name="twitter:description"]').attr('content', $('meta[name="description"]').attr('content'))
  return { html: $.html(), residuo }
}

/** En las páginas es/en ya existentes sólo se tocan hreflang, OG alternos y selector. */
function actualizarExistente(c, lang) {
  // Ediciones de texto, no un viaje de ida y vuelta por cheerio: la
  // reserialización reescribe SVG y entidades de páginas en producción y
  // convierte un cambio de cuatro líneas en un diff de cientos.
  const ruta = path.join(RAIZ, c[lang])
  let s = fs.readFileSync(ruta, 'utf8')
  const antes = s

  // hreflang: bloque completo justo detrás del canonical
  s = s.replace(/[ \t]*<link rel="alternate" hreflang="[^"]*" href="[^"]*">\r?\n/g, '')
  const hl = idiomasDe(c).map((l) => `    <link rel="alternate" hreflang="${l}" href="${url(c, l)}">`)
  hl.push(`    <link rel="alternate" hreflang="x-default" href="${xDefault(c)}">`)
  s = s.replace(/(<link rel="canonical" href="[^"]*">)\r?\n/, `$1\n${hl.join('\n')}\n`)

  // og:locale:alternate: uno por idioma hermano, detrás de og:locale
  s = s.replace(/[ \t]*<meta property="og:locale:alternate" content="[^"]*">\r?\n/g, '')
  const og = idiomasDe(c).filter((l) => l !== lang).map((l) => `    <meta property="og:locale:alternate" content="${OG_LOCALE[l]}">`)
  s = s.replace(/(<meta property="og:locale" content="[^"]*">)\r?\n/, `$1\n${og.join('\n')}\n`)

  // selector: los dos <button data-lang> pasan a enlaces reales
  for (const l of ['de', 'fr']) {
    const destino = c[l] ? rutaPublica(c[l]) : `/${l}/`
    s = s.replace(
      new RegExp(`<button class="lang-option" type="button" data-lang="${l}">(<img[^>]*>) ${NOMBRE[l]}</button>`),
      `<a class="lang-option" href="${destino}" hreflang="${l}">$1 ${NOMBRE[l]}</a>`,
    )
  }
  if (s !== antes) fs.writeFileSync(ruta, s)
}

function sitemap() {
  const hoy = new Date().toISOString().slice(0, 10)
  const bloques = []
  for (const c of CLUSTERS) for (const l of idiomasDe(c)) {
    const alt = idiomasDe(c).map((a) => `    <xhtml:link rel="alternate" hreflang="${a}" href="${url(c, a)}"/>`)
    alt.push(`    <xhtml:link rel="alternate" hreflang="x-default" href="${xDefault(c)}"/>`)
    bloques.push(`  <url>\n    <loc>${url(c, l)}</loc>\n    <lastmod>${hoy}</lastmod>\n${alt.join('\n')}\n  </url>`)
  }
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${bloques.join('\n')}\n</urlset>\n`
}

// ── Ejecución ──
const T = cargarDiccionario()
const informe = {}
let escritas = 0
for (const lang of NUEVOS) {
  const ext = extra(lang)
  for (const c of CLUSTERS) {
    if (!c[lang]) continue
    const { html, residuo } = c.fuente === 'es' ? desdeEspanol(c, lang, T[lang], ext) : desdeTraduccion(c, lang)
    informe[`${lang}/${c.id}`] = residuo
    if (!INFORME && html && !residuo.some((r) => r.tipo === 'json-ld-invalido')) {
      const destino = path.join(RAIZ, c[lang])
      fs.mkdirSync(path.dirname(destino), { recursive: true })
      fs.writeFileSync(destino, html)
      escritas++
    }
  }
}

const salida = path.join(AQUI, 'informe-pr3cise-residuo.json')
fs.writeFileSync(salida, JSON.stringify(informe, null, 2))
for (const [k, r] of Object.entries(informe)) {
  const porTipo = r.reduce((a, x) => ((a[x.tipo] = (a[x.tipo] || 0) + 1), a), {})
  console.log(k.padEnd(14), Object.entries(porTipo).map(([t, n]) => `${t}=${n}`).join('  ') || 'todo cubierto')
}
if (INFORME) {
  console.log('detalle en', salida)
} else {
  for (const c of CLUSTERS) for (const l of ['es', 'en']) if (c[l]) actualizarExistente(c, l)
  fs.writeFileSync(path.join(RAIZ, 'sitemap.xml'), sitemap())
  console.log(`\n${escritas} páginas escritas; hreflang y selector actualizados en es/en; sitemap con ${CLUSTERS.reduce((n, c) => n + idiomasDe(c).length, 0)} URLs`)
}
