# Alemán y francés de pr3cise.com

`/de/` y `/fr/` se GENERAN, no se editan a mano.

- Páginas de fuente española (portada, servicios, ejemplos, nosotros, contacto,
  legal): salen del HTML español + el diccionario de `assets/js/i18n.js` +
  `extra-<lang>.json` (títulos, descriptions, JSON-LD, alt y textos sueltos).
- Landings de fuente inglesa (Miami y los cinco oficios): la traducción
  completa vive en `pr3cise-traducciones/<lang>/`; el script sólo ajusta
  cabecera, enlaces y selector.

Regenerar (necesita `npm i cheerio` en esta carpeta o en la raíz):

    node _source-no-deploy/idiomas/render-idiomas.mjs --informe   # qué falta
    node _source-no-deploy/idiomas/render-idiomas.mjs             # escribe de/, fr/, sitemap.xml
                                                                  # y actualiza hreflang+selector en es/en

Para cambiar un texto alemán/francés de una landing: edita el fichero de
`pr3cise-traducciones/` y regenera. Para una página de fuente española: edita
el diccionario o `extra-<lang>.json` y regenera.
