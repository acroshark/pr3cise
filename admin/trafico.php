<?php
/**
 * admin/trafico.php — qué pasa de verdad en pr3cise.com.
 *
 * Lee la base de la analítica propia (api/medir.php). No hay Google Analytics:
 * esto es todo lo que se mide, y se mide sin cookies ni datos personales.
 */
require_once __DIR__ . '/config.php';

if (!admin_is_authed()) { header('Location: index.php'); exit; }

function ruta_db_trafico(): string {
    foreach ([dirname(__DIR__, 2) . '/pr3cise_data', __DIR__ . '/data'] as $dir) {
        if (is_file($dir . '/trafico.db')) return $dir . '/trafico.db';
    }
    return __DIR__ . '/data/trafico.db';
}

$DIAS  = max(7, min(90, (int)($_GET['dias'] ?? 30)));
$db    = null;
$error = null;
try {
    $ruta = ruta_db_trafico();
    if (!is_file($ruta)) throw new RuntimeException('Todavía no hay datos: la base se crea sola con la primera visita.');
    $db = new PDO('sqlite:' . $ruta, null, null, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
} catch (Throwable $e) { $error = $e->getMessage(); }

$desde = gmdate('Y-m-d', time() - ($DIAS - 1) * 86400);

/** Consulta corta con parámetros; si algo falla devuelve vacío y no rompe el panel. */
function q(?PDO $db, string $sql, array $args = []): array {
    if (!$db) return [];
    try { $s = $db->prepare($sql); $s->execute($args); return $s->fetchAll(PDO::FETCH_ASSOC); }
    catch (Throwable $e) { return []; }
}
function uno(?PDO $db, string $sql, array $args = []) {
    $f = q($db, $sql, $args); return $f ? array_values($f[0])[0] : 0;
}

const CONV = "('whatsapp','correo','telefono','formulario','cta')";

$kpi = [
  'vistas'     => (int)uno($db, "SELECT COUNT(*) FROM visitas WHERE evento IS NULL AND fecha >= ?", [$desde]),
  'visitantes' => (int)uno($db, "SELECT COUNT(DISTINCT visitante) FROM visitas WHERE fecha >= ?", [$desde]),
  'conversion' => (int)uno($db, "SELECT COUNT(*) FROM visitas WHERE evento IN " . CONV . " AND fecha >= ?", [$desde]),
  'hoy'        => (int)uno($db, "SELECT COUNT(*) FROM visitas WHERE evento IS NULL AND fecha = ?", [gmdate('Y-m-d')]),
];

$por_dia = q($db, "SELECT fecha, COUNT(*) n FROM visitas
                   WHERE evento IS NULL AND fecha >= ? GROUP BY fecha ORDER BY fecha", [$desde]);
$serie = [];
for ($i = $DIAS - 1; $i >= 0; $i--) { $serie[gmdate('Y-m-d', time() - $i * 86400)] = 0; }
foreach ($por_dia as $f) if (isset($serie[$f['fecha']])) $serie[$f['fecha']] = (int)$f['n'];

$paginas  = q($db, "SELECT ruta, COUNT(*) n, COUNT(DISTINCT visitante) v FROM visitas
                    WHERE evento IS NULL AND fecha >= ? GROUP BY ruta ORDER BY n DESC LIMIT 20", [$desde]);
$fuentes  = q($db, "SELECT COALESCE(referer,'(directo)') f, COUNT(*) n FROM visitas
                    WHERE evento IS NULL AND fecha >= ? GROUP BY f ORDER BY n DESC LIMIT 12", [$desde]);
$idiomas  = q($db, "SELECT idioma, COUNT(*) n FROM visitas WHERE evento IS NULL AND fecha >= ?
                    GROUP BY idioma ORDER BY n DESC", [$desde]);
$aparatos = q($db, "SELECT aparato, COUNT(*) n FROM visitas WHERE evento IS NULL AND fecha >= ?
                    GROUP BY aparato ORDER BY n DESC", [$desde]);
$campanas = q($db, "SELECT utm_source s, utm_medium m, utm_campaign c, COUNT(*) n FROM visitas
                    WHERE fecha >= ? AND utm_source IS NOT NULL GROUP BY s,m,c ORDER BY n DESC LIMIT 10", [$desde]);
$eventos  = q($db, "SELECT evento, COUNT(*) n FROM visitas WHERE evento IS NOT NULL AND fecha >= ?
                    GROUP BY evento ORDER BY n DESC", [$desde]);
$ultimos  = q($db, "SELECT ts, ruta, evento, detalle FROM visitas WHERE evento IN " . CONV . "
                    ORDER BY ts DESC LIMIT 25");

$max = $serie ? max(1, max($serie)) : 1;
?>
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="robots" content="noindex, nofollow">
<title>Tráfico · Pr3cise</title>
<link rel="icon" href="../favicon.ico">
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="panel.css">
<style>
  .barras{display:flex;align-items:flex-end;gap:3px;height:150px;padding:18px 20px 0}
  .barras div{flex:1;background:var(--accent-gold,#B08D57);border-radius:2px 2px 0 0;min-height:2px;position:relative}
  .barras div:hover::after{content:attr(data-t);position:absolute;bottom:100%;left:50%;transform:translateX(-50%);
      background:#0F172A;color:#fff;font-size:11px;padding:3px 7px;border-radius:4px;white-space:nowrap;z-index:5}
  .eje{display:flex;justify-content:space-between;padding:6px 20px 16px;font-size:11px;color:var(--muted,#64748B)}
  .tabla{width:100%;border-collapse:collapse;font-size:13px}
  .tabla th{text-align:left;font-size:11px;letter-spacing:.05em;text-transform:uppercase;color:var(--muted,#64748B);
      padding:10px 14px;border-bottom:1px solid var(--border-lux,#E2E8F0)}
  .tabla td{padding:9px 14px;border-bottom:1px solid #F1F5F9}
  .tabla tr:last-child td{border-bottom:none}
  .tabla td.n{text-align:right;font-variant-numeric:tabular-nums;font-weight:600;color:#0F172A}
  .ruta{font-family:'IBM Plex Mono',Consolas,monospace;font-size:12px}
  .cols2{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:20px}
  @media(max-width:900px){.cols2{grid-template-columns:1fr}}
  .aviso{padding:26px 30px;color:var(--muted,#64748B);line-height:1.7}
  .pill{display:inline-block;padding:2px 8px;border-radius:20px;font-size:10.5px;font-weight:600;text-transform:uppercase;
      background:var(--green-bg,#DCFCE7);color:var(--green,#16A34A)}
</style>
</head>
<body>
<header>
  <div class="brand">PR<span>3</span>CISE</div>
  <div class="tag">Tráfico de la web</div>
  <div class="right">
    <a href="index.php">Leads</a>
    <a href="articulos.php">Artículos</a>
    <a href="../index.html">Ver web</a>
    <a href="index.php?logout=1">Salir</a>
  </div>
</header>

<main>
<?php if ($error): ?>
  <div class="panel"><h2>Sin datos todavía</h2>
    <div class="aviso">
      <?= h($error) ?><br><br>
      La medición ya está puesta en todas las páginas (<code>/assets/js/medir.js</code>) y escribe en
      <code><?= h(ruta_db_trafico()) ?></code>. En cuanto alguien entre en la web, aquí aparecerán las visitas.
    </div>
  </div>
<?php else: ?>

  <div class="stats">
    <div class="card"><div class="lbl">Páginas vistas (<?= $DIAS ?> días)</div><div class="val"><?= number_format($kpi['vistas'],0,',','.') ?></div></div>
    <div class="card amber"><div class="lbl">Visitantes distintos</div><div class="val"><?= number_format($kpi['visitantes'],0,',','.') ?></div></div>
    <div class="card green"><div class="lbl">Contactos iniciados</div><div class="val"><?= number_format($kpi['conversion'],0,',','.') ?></div></div>
    <div class="card"><div class="lbl">Vistas hoy</div><div class="val"><?= number_format($kpi['hoy'],0,',','.') ?></div></div>
  </div>

  <div class="panel">
    <h2>Visitas por día
      <span style="float:right;font-weight:400;font-size:12px">
        <a href="?dias=7">7</a> · <a href="?dias=30">30</a> · <a href="?dias=90">90</a> días
      </span>
    </h2>
    <div class="barras">
      <?php foreach ($serie as $d => $n): ?>
        <div style="height:<?= max(2, (int)round($n / $max * 100)) ?>%" data-t="<?= h($d) ?>: <?= $n ?>"></div>
      <?php endforeach; ?>
    </div>
    <div class="eje">
      <span><?= h((string)array_key_first($serie)) ?></span>
      <span>máximo en un día: <?= $max ?></span>
      <span><?= h((string)array_key_last($serie)) ?></span>
    </div>
  </div>

  <div class="cols2">
    <div class="panel">
      <h2>Páginas más vistas</h2>
      <table class="tabla">
        <tr><th>Ruta</th><th style="text-align:right">Vistas</th><th style="text-align:right">Visitantes</th></tr>
        <?php foreach ($paginas as $p): ?>
          <tr><td class="ruta"><?= h($p['ruta']) ?></td><td class="n"><?= $p['n'] ?></td><td class="n"><?= $p['v'] ?></td></tr>
        <?php endforeach; ?>
        <?php if (!$paginas): ?><tr><td colspan="3" class="aviso">Sin visitas en el periodo.</td></tr><?php endif; ?>
      </table>
    </div>

    <div class="panel">
      <h2>De dónde llegan</h2>
      <table class="tabla">
        <tr><th>Origen</th><th style="text-align:right">Visitas</th></tr>
        <?php foreach ($fuentes as $f): ?>
          <tr><td><?= h($f['f']) ?></td><td class="n"><?= $f['n'] ?></td></tr>
        <?php endforeach; ?>
        <?php if (!$fuentes): ?><tr><td colspan="2" class="aviso">Sin datos.</td></tr><?php endif; ?>
      </table>
      <?php if ($campanas): ?>
        <h2 style="margin-top:18px">Campañas (utm)</h2>
        <table class="tabla">
          <tr><th>Fuente</th><th>Medio</th><th>Campaña</th><th style="text-align:right">Visitas</th></tr>
          <?php foreach ($campanas as $c): ?>
            <tr><td><?= h($c['s']) ?></td><td><?= h($c['m']) ?></td><td><?= h($c['c']) ?></td><td class="n"><?= $c['n'] ?></td></tr>
          <?php endforeach; ?>
        </table>
      <?php endif; ?>
    </div>
  </div>

  <div class="cols2">
    <div class="panel">
      <h2>Idioma y aparato</h2>
      <table class="tabla">
        <?php foreach ($idiomas as $i): ?>
          <tr><td>Idioma <strong><?= h(strtoupper((string)($i['idioma'] ?? '?'))) ?></strong></td><td class="n"><?= $i['n'] ?></td></tr>
        <?php endforeach; ?>
        <?php foreach ($aparatos as $a): ?>
          <tr><td><?= h(ucfirst((string)($a['aparato'] ?? '?'))) ?></td><td class="n"><?= $a['n'] ?></td></tr>
        <?php endforeach; ?>
      </table>
    </div>

    <div class="panel">
      <h2>Gestos de contacto</h2>
      <table class="tabla">
        <tr><th>Tipo</th><th style="text-align:right">Veces</th></tr>
        <?php foreach ($eventos as $e): ?>
          <tr><td><?= h($e['evento']) ?></td><td class="n"><?= $e['n'] ?></td></tr>
        <?php endforeach; ?>
        <?php if (!$eventos): ?><tr><td colspan="2" class="aviso">Nadie ha pulsado WhatsApp, correo ni el formulario todavía.</td></tr><?php endif; ?>
      </table>
    </div>
  </div>

  <?php if ($ultimos): ?>
  <div class="panel">
    <h2>Últimos contactos iniciados</h2>
    <table class="tabla">
      <tr><th>Cuándo</th><th>Tipo</th><th>Desde</th><th>Detalle</th></tr>
      <?php foreach ($ultimos as $u): ?>
        <tr>
          <td><?= h(date('d/m/Y H:i', (int)$u['ts'])) ?></td>
          <td><span class="pill"><?= h($u['evento']) ?></span></td>
          <td class="ruta"><?= h($u['ruta']) ?></td>
          <td class="ruta"><?= h(mb_strimwidth((string)$u['detalle'], 0, 70, '…')) ?></td>
        </tr>
      <?php endforeach; ?>
    </table>
  </div>
  <?php endif; ?>

<?php endif; ?>
</main>
</body>
</html>
