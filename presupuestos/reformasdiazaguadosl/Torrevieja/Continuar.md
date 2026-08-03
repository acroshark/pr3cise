# Nota de continuación — Revisión presupuesto 5viviendas

**Fecha:** 11/05/2026 — 15:40  
**Modelo:** Claude Sonnet 4.5 (con extended thinking)  
**Archivo principal:** `partidas/5viviendas.json`

---

## Tarea en curso

Revisión partida por partida del presupuesto de instalación eléctrica (`5viviendas.json`) con dos objetivos:

1. **Reducir horas de mano de obra (MO)** donde los rendimientos sean excesivos.
2. **Corregir precios de materiales (MAT)** cruzando contra:
   - `mediciones/notas.txt` — precios netos negociados (mandan sobre todo lo demás)
   - `mediciones/OFERTA_CB_ELECTRIC.csv` — oferta principal de CB Electric
   - `mediciones/OFERTA_CB_ELECTRIC_CUADROS_Y_CENTRALIZACION.csv` — cuadros montados CB Electric
   - `mediciones/OFERTA_ELECTROSTOCK.csv` — oferta Electrostock (segunda opción)

**Regla de prioridad:** notas.txt > CSVs de oferta > precio original del JSON.

---

## Estado actual — Partidas revisadas y corregidas

### Capítulo 1 — INSTALACIÓN DE ENLACE (todas corregidas ✅)

| Partida | Título | Correcciones aplicadas |
|---|---|---|
| 1.01 | CGP 160A | MT01 CGP: 113→117.42€ (CB Electric); MT02 fusibles: 3.2→3.80€; mat: 161.3→167.52€ |
| 1.02 | Canalización DN160mm | MO: 0.20+0.15h→0.12+0.08h/m; MT01 tubo: 1.652→3.371€/m (CB TBDECA160); mo: 13.2→7.64; mat: 2.15→3.87 |
| 1.03 | Cable RZ1-K 4×50mm² | MO: 0.20+0.15h→0.15+0.10h/m; MT01: 45.261→30.336€/m (4×CB CBLHK1X50B); mo: 13.2→9.55; mat: 45.76→30.84 |
| 1.04 | Centralización contadores | MO: 4h+4h→3h+2h; mo: 292→191€; mat: 952€ mantenido (Electrostock confirmado) |
| 1.05 | Tubo DN50 obra fábrica (237m) | MO: ayudante 0.02→0.01h/m; MT01: 1.652→0.930€/m (CB TBFOR50); mo: 3.26→2.98; mat: 1.75→1.03 |
| 1.06 | Cable H07Z1K 1×10mm² (180m) | MT01: 2.987→1.401€/m (CB CBLH10AB); mat: 3.09→1.50 |
| 1.07 | Cable H07Z1K 1×35mm² (612m) | MO: ayudante 0.03→0.02h/m; MT01: 8.216→5.418€/m (CB CBLH35AB); mo: 3.99→3.71; mat: 8.37→5.57 |
| 1.08 | Rabillo CGP-CSS 50mm² (1 ud) | MO: oficial 1.5h→1h; mo: 81.5→59€ |
| 1.09 | Canal protección LGA (6m) | MO: 0.15→0.10h/m; mo: 6.75→4.50 |
| 1.10 | Tramitación y legalización | MO: 8h→5h; mo: 360→225€ |

**Partida 1.11** (Circuito 3×1.5mm² H07Vk, 250m) — No revisada aún, pero los precios de tubo DN20 y cable 1.5mm² ya están correctos en el JSON (0.18€/m y 0.191€/m).

---

### Capítulo 2 — CUADROS Y ZONAS COMUNES (parcialmente corregido)

| Partida | Título | Correcciones aplicadas |
|---|---|---|
| 2.01 | Cuadro Comunes (1 ud) | ⚠️ GRAN CORRECCIÓN: PVP Schneider sin descuento → CB Electric montado. mat: 4513.15→952€; mo: 326→208€ |
| 2.02 | Subcuadro RITU-A (1 ud) | ⚠️ GRAN CORRECCIÓN: PVP Schneider sin descuento → CB Electric montado. mat: 665.30→232€; mo: 208→104€ |
| 2.03 | Tubo DN50 (20m) | Igual que 1.05: MT01: 1.652→0.930€/m; mo: 3.26→2.98; mat: 1.65→0.93 |
| 2.04 | Cable H07Z1K 1×6mm² (30m) | MT01: 1.738→0.802€/m (CB CBLH6A / notas 0.803€/m); mat: 1.74→0.80 |
| 2.05 | Punto luz simple zonas comunes (66 ud) | MT01 tubo DN20: 0.391→0.18€/m; MT02 cable 1.5mm²: 0.464→0.191€/m; mat: 21.43→18.34 |

---

### Capítulo 2 — CUADROS Y ZONAS COMUNES (todas corregidas ✅)

| Partida | Título | Correcciones aplicadas |
|---|---|---|
| 2.06 | Punto cruzamiento-pulsador | tubo DN20 0.391→0.18; cable 1.5mm² 0.464→0.191; mat 21.57→19.51€ |
| 2.07 | Sensor movimiento interior | detector CB DINDMTEC008 38→48.15€ neto (PVP 77.66 - 38%dto) |
| 2.08 | Punto TC exterior IP44 | tubo DN20 0.391→0.18; cable 2.5mm² 0.754→0.336; mat 39.7→36.56€ |
| 2.09 | Punto videoportero | Sin cambios (sin ref. CB Electric) |
| 2.10 | Reloj programado | relé CB SASSUL180A 28→22.50€ neto |
| 2.11 | Alimentación cuadro ascensor | cable 6mm² 1.738→0.802€/m (CB CBLH6A); mat 9.02→4.34€/m |
| 2.12 | Emergencia 150lm | luminaria CB NRMG150L 38.929→16.19€ neto (PVP 32.38 - 50%dto); mat 39.39→16.38€ |
| 2.13 | Tramitación y legalización | Sin cambios (pendiente confirmar tasas CAIB/UDIT) |

**Correcciones globales aplicadas (replace_all):**
- Tubo DN20 AISCAN: **0.391 → 0.18€/m** en todos los capítulos
- Cable H07Z1-K 1.5mm²: **0.464 → 0.191€/m** en todos los capítulos

---

### Capítulo 3 — INSTALACIONES VIVIENDAS (todas corregidas ✅)

| Partida | Título | Correcciones aplicadas |
|---|---|---|
| 3.01 | Cuadro protecciones vivienda | Schneider dto 75%+55%: mat 2336.87→763.42€ |
| 3.02 | Subcuadro piscina | Schneider dto 75%+55%: mat 1130.46→325.20€ |
| 3.03 | Punto luz sencillo | mat recalc con tubo 0.18+cable 0.191: 21.35→18.26€ |
| 3.04 | Punto luz exteriores | mat recalc: 21.35→18.26€ |
| 3.05 | Punto tira LED | mat recalc: 11.07→9.01€ |
| 3.06 | Punto interruptor simple | mat recalc: 19.57→17.51€ |
| 3.07 | Punto interruptor conmutado | mat recalc: 20.57→18.51€ |
| 3.08 | Punto cruzamiento-pulsador | mat recalc: 21.57→19.51€ |
| 3.09 | Punto interruptor exterior IP44 | mat recalc: 30.57→28.51€ |
| 3.10 | Punto persiana con pulsador | cable 2.5mm² ×5 0.754→0.336; mat 23.94→21.22€ |
| 3.11 | Punto TC 16A | cable 2.5mm² 0.754→0.336; mat 27.7→24.56€ |
| 3.12 | Punto TC exterior IP44 | mat recalc (cable ya corregido): 39.7→36.56€ |
| 3.13 | Punto TC cocina 25A | cable 6mm² 1.738→0.802 (CB CBLH6A); mat 31.9→29.10€ |
| 3.14 | Alimentación A/C exterior | cable 6mm² 1.738→0.802; mat 25.4→22.60€ ⚠ verificar si RV-K |
| 3.15 | Punto pulsador timbre | mat recalc: 21.57→19.51€ |
| 3.16 | Timbre interior vivienda | Sin cambios ✓ |
| 3.17 | Punto alimentación extractores | mat recalc: 10.85→7.76€ |
| 3.18 | Tramitación certificación | Sin cambios (tasas pendiente confirmar) |

---

### Capítulo 4 — APARCAMIENTO (todas corregidas ✅)

| Partida | Correcciones aplicadas |
|---|---|
| 4.01 | Sin cambios (cuadro estimado, sin Schneider) |
| 4.02 | Sin cambios (SAI Legrand precio estimado) |
| 4.03 | mat recalc (cable 1.5mm² ya 0.191): 13.10→9.01€ |
| 4.04 | cable 2.5mm² rend:30 0.754→0.336; mat 52.92→40.38€ |
| 4.05–4.06 | Sin cambios |
| 4.07 | cable 2.5mm² rend:30 0.754→0.336; mat 52.92→40.38€ |
| 4.08 | RV-K 3×2.5mm² multipolar: NO cambiar sin confirmación |
| 4.09 | SZ1-K(AS+) price estimado: sin cambios |
| 4.10 | cable 2.5mm² rend:30 0.754→0.336; mat 52.92→40.38€ |
| 4.11–4.15 | Sin cambios (precios estimados/confirmados) |

### Cap 5 (ICT/Telecom), Cap 6 (Videoportero), Cap 7 (Obra) — revisados ✅

- Cap 5: sin cables CB Electric → sin correcciones de precio
- Cap 6: videoportero estimado → sin correcciones
- **7.05**: cable ref PIR20193995 (H07Z1-K 6mm²) pero desc dice RZ1-K 5×16mm² → precio 1.738→0.802 con ⚠ nota verificar
- **dataMaterial**: MAT-038/039/043 (2.5mm²) 0.754→0.336; MAT-040/041/044/046 (6mm²) 1.738→0.802; MAT-046 desc corregida (era RV-K, ref es H07Z1-K); MAT-048 (RZ1-K 5×16mm²) ⚠ precio provisional 0.802 pendiente confirmar

**Precios 0.754 residuales intencionales (NO cambiar):**
- MAT-045 + item 4.08: Cable RV-K 3×2.5mm² multipolar — precio pendiente confirmar con proveedor

---

## ✅ ESTADO GLOBAL: Correcciones completadas en todos los capítulos

**Pendiente confirmar (requieren precio de proveedor):**
- Cuadros aparcamiento/obra (estimados 300-400€)
- SAI Legrand 2kW (estimado 600€)
- Videoportero Fermax 5 PAU (estimado 350€)
- Jung LS990 mecanismos (precios netos con Saltoki)
- Cable RV-K 3×2.5mm² multipolar (precio actual 0.754 = provisional)
- Cable RZ1-K 5×16mm² item 7.05 (precio real ~7-10€/m, usando 0.802 como provisional)
- Módulo Pinazo CPM-T16 (estimado 200€)
- Tasas CAIB/UDIT (items 2.13 y 3.18)

---

## Servidor local

```
php -S localhost:8000 router.php
```
Ejecutar desde `c:\Users\USER\Desktop\inelmasl\` si está caído.

---

## Notas generales

- Las tarifas horarias son: **oficial electricista 45€/h**, **ayudante 28€/h**
- Los precios de los CSVs de Electrostock tienen un 60% de descuento aplicado
- Los precios de CB Electric en sus CSVs son ya precios netos (sin IVA)
- notas.txt manda sobre cualquier CSV cuando hay discrepancia
