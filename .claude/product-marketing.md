# Pr3cise — contexto de producto y marketing

> Lo lee cualquier skill de marketing/SEO antes de trabajar. Si algo cambia
> (precios, mercados, servicios), se actualiza aquí y no en cada skill.
> Última revisión: 22 de septiembre de 2026.

## Qué es

**Oficina técnica de estimación de costes de obra** (construction cost estimating
+ quantity takeoff) que trabaja **en remoto** para empresas de construcción.
Entrega presupuestos por partidas, mediciones trazables al plano y listas de
materiales en Excel y PDF, listos para licitar.

- Web: https://pr3cise.com (ES raíz, EN `/en/`, DE `/de/`, FR `/fr/`)
- Empresa: Clear Ascend OÜ (Estonia). Voz y CEO: Hugo Karreflow.
- Contacto: contact@pr3cise.com · WhatsApp +34 722 879 218
- Panel interno: `/admin/` (leads, artículos, tráfico)

## El foco: MIAMI (orden de Hugo, 22-09-2026)

El posicionamiento se enfoca en **Miami-Dade y el sur de Florida**. Es el mercado
que paga (tickets 3-5 veces los de España) y donde ya hay señales de demanda
reales en Search Console: `concrete contractor estimate miami`, `estimators miami`,
`florida mep estimation`, `electrician estimating software miami`.

El público de Miami son **contratistas generales y subcontratistas** (hormigón y
albañilería, eléctrico, fontanería, PCI, MEP), promotores y arquitectos, muchos
de ellos hispanohablantes: se trabaja en inglés de EE. UU. y en español.

Lo que hace creíble a Pr3cise en Miami y hay que repetir en el contenido:
- **HVHZ** (High-Velocity Hurricane Zone) y **NOA** de Miami-Dade: el producto
  se mide contra el código local, no genérico.
- **Florida Building Code** y permisos de Miami-Dade / City of Miami.
- CSI MasterFormat, clasificaciones AACE, precio cerrado por proyecto.
- Entrega en 24-72 h.

## Qué vende (y a qué precio)

| Servicio | Qué incluye | Precio de referencia |
|---|---|---|
| Presupuesto de un gremio | Medición + precios + partidas de un oficio | 250-400 € |
| Obra completa | Todos los gremios, BoQ y resumen por capítulos | 800-1.000 € |
| Paquete mensual | Volumen continuado para empresas | a medida |

Nunca se inventan precios, plazos, clientes ni testimonios fuera de esta tabla.

## Mercados por rentabilidad

1. **EE. UU. / Miami-Dade y sur de Florida** — prioridad absoluta.
2. España (mercado de origen, tickets bajos).
3. Reino Unido.
4. Alemania/Suiza: sin correo frío (§7 UWG); solo canales pasivos.
5. Francia: descartada (no paga lo suficiente).

## Activos que ya existen

- 6 páginas de Miami en inglés: general, MEP, eléctrico, fontanería,
  hormigón/albañilería y protección contra incendios. Sus gemelas en ES/DE/FR.
- `/ejemplos.html` y `/en/portfolio.html`: presupuestos reales de muestra.
- Sitemap con hreflang, breadcrumbs y schema en todas las páginas.
- Sección de artículos (`/articulos/` y `/en/articles/`), oculta del menú.
- Panel `/admin/` con leads y revisión de borradores.

## Restricciones duras

- **Nada de datos inventados**: ni cifras de ahorro, ni clientes, ni reseñas,
  ni dirección o teléfono de EE. UU. que no existan de verdad. Pr3cise **no
  tiene sede física en Miami**: es un equipo remoto que sirve a Miami. El
  contenido no puede dar a entender lo contrario (ni NAP local falso, ni
  `LocalBusiness` con dirección inventada: se usa `ProfessionalService` con
  `areaServed`).
- Sin Google Business Profile (requiere dirección verificable en EE. UU.).
- El correo comercial sale por Resend desde contact@pr3cise.com, nunca WhatsApp
  en frío.
- Los 4 borradores de `admin/borradores/` no se publican sin el visto bueno de Hugo.

## Estado de la analítica (22-09-2026)

- **No hay GA4**: no existe propiedad de Pr3cise en la cuenta de Analytics de
  Hugo y la web no lleva ninguna etiqueta. Se ha montado una **analítica propia**
  (first-party, sin cookies) en `/api/medir.php` con panel en `/admin/trafico.php`.
- Search Console: propiedad `sc-domain:pr3cise.com`, verificada.
  Últimos 48 días: 320 impresiones, 9 clics, posición media 19,6.
  33 páginas indexadas y 24 sin indexar.
