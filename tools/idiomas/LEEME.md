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

## Aviso (11-11-2026): `/de/` y `/fr/` se corrigieron A MANO

Ese día se reescribió toda la web para dejar de decir que Pr3cise mide sobre planos
(solo valora la hoja de mediciones del cliente; ver `.claude/product-marketing.md`).
El generador no se pudo usar: `--informe` daba cientos de textos sin traducir en las
páginas de fuente española (el HTML español rediseñado ya no casaba con
`extra-<lang>.json`), y regenerar habría colado español en alemán y francés.

Lo que quedó hecho:
- Corregidos el diccionario (`assets/js/i18n.js`, los 4 idiomas), las landings de
  `pr3cise-traducciones/` y, directamente, los HTML publicados de `/de/` y `/fr/`.
- NO se tocaron `extra-de.json` ni `extra-fr.json`: sus claves `texto:` siguen
  siendo los textos españoles antiguos y varias traducciones aún hablan de planos.

Antes de volver a regenerar: actualizar esas claves y traducciones (el `--informe`
lista lo que falta) y comprobar que el resultado no reintroduce «Pläne senden»,
«vos plans», «Aufmaß», «métré sur plan», etc.

Para cambiar un texto alemán/francés de una landing: edita el fichero de
`pr3cise-traducciones/` y regenera. Para una página de fuente española: edita
el diccionario o `extra-<lang>.json` y regenera.
