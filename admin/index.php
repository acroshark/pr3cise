<?php
/**
 * admin/index.php — Panel de administración de PR3CISE.
 * Muestra los leads captados (empresas de construcción) y el estado del outreach.
 */
require_once __DIR__ . '/config.php';

// ── Cerrar sesión ────────────────────────────────────────────────────────
if (isset($_GET['logout'])) {
    admin_logout();
    header('Location: index.php');
    exit;
}

// ── Login ────────────────────────────────────────────────────────────────
$login_error = false;
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['password'])) {
    if (admin_login((string)$_POST['password'])) {
        header('Location: index.php');
        exit;
    }
    $login_error = true;
    usleep(600000);   // frena los intentos por fuerza bruta
}

$authed = admin_is_authed();

// ── Datos ────────────────────────────────────────────────────────────────
$db = $authed ? admin_db() : null;
$stats = ['total'=>0,'con_email'=>0,'contactados'=>0,'pendientes'=>0,'favoritos'=>0,'respondidos'=>0,'enviados_hoy'=>0];
$leads = []; $total_filtrado = 0; $paises = []; $ciudades = []; $oficios = [];
$por_mercado = []; $ultimos_envios = [];
$db_error = $authed && !$db;

// Filtros
$f_pais   = $_GET['pais']   ?? '';
$f_ciudad = $_GET['ciudad'] ?? '';
$f_oficio = $_GET['oficio'] ?? '';
$f_estado = $_GET['estado'] ?? '';
$f_buscar = trim($_GET['q'] ?? '');
$f_fav    = !empty($_GET['fav']);
$pagina   = max(1, (int)($_GET['p'] ?? 1));
$por_pag  = 50;

if ($db) {
    // Desplegables
    foreach (['pais'=>&$paises, 'ciudad'=>&$ciudades, 'oficio'=>&$oficios] as $col => &$dest) {
        $dest = $db->query("SELECT DISTINCT $col FROM leads WHERE $col != '' ORDER BY $col")
                   ->fetchAll(PDO::FETCH_COLUMN);
    }
    unset($dest);

    // WHERE dinámico
    $where = []; $args = [];
    if ($f_pais   !== '') { $where[] = 'pais = ?';   $args[] = $f_pais; }
    if ($f_ciudad !== '') { $where[] = 'ciudad = ?'; $args[] = $f_ciudad; }
    if ($f_oficio !== '') { $where[] = 'oficio = ?'; $args[] = $f_oficio; }
    if ($f_estado !== '') { $where[] = 'estado = ?'; $args[] = $f_estado; }
    if ($f_fav)           { $where[] = 'favorito = 1'; }
    if ($f_buscar !== '') {
        $where[] = '(empresa LIKE ? OR email LIKE ? OR ciudad LIKE ?)';
        $t = '%' . $f_buscar . '%';
        array_push($args, $t, $t, $t);
    }
    $sql_where = $where ? ' WHERE ' . implode(' AND ', $where) : '';

    // Estadísticas (respetan el filtro)
    $row = $db->prepare("SELECT
            COUNT(*) total,
            SUM(CASE WHEN email != '' THEN 1 ELSE 0 END) con_email,
            SUM(CASE WHEN contactado = 1 THEN 1 ELSE 0 END) contactados,
            SUM(CASE WHEN email != '' AND contactado = 0 AND email_dead = 0 THEN 1 ELSE 0 END) pendientes,
            SUM(CASE WHEN favorito = 1 THEN 1 ELSE 0 END) favoritos,
            SUM(CASE WHEN estado = 'respondido' THEN 1 ELSE 0 END) respondidos
        FROM leads" . $sql_where);
    $row->execute($args);
    $stats = array_merge($stats, array_map('intval', $row->fetch() ?: []));

    $stats['enviados_hoy'] = (int)$db->query(
        "SELECT COUNT(*) FROM envios WHERE estado='enviado' AND substr(enviado_at,1,10)=date('now')"
    )->fetchColumn();

    // Listado paginado
    $c = $db->prepare("SELECT COUNT(*) FROM leads" . $sql_where);
    $c->execute($args);
    $total_filtrado = (int)$c->fetchColumn();

    $q = $db->prepare("SELECT * FROM leads" . $sql_where .
                      " ORDER BY favorito DESC, updated_at DESC LIMIT ? OFFSET ?");
    foreach ($args as $i => $v) $q->bindValue($i + 1, $v);
    $q->bindValue(count($args) + 1, $por_pag, PDO::PARAM_INT);
    $q->bindValue(count($args) + 2, ($pagina - 1) * $por_pag, PDO::PARAM_INT);
    $q->execute();
    $leads = $q->fetchAll();

    // Resumen por mercado
    $por_mercado = $db->query(
        "SELECT pais,
                COUNT(*) total,
                SUM(CASE WHEN email != '' THEN 1 ELSE 0 END) con_email,
                SUM(CASE WHEN contactado = 1 THEN 1 ELSE 0 END) contactados
         FROM leads WHERE pais != '' GROUP BY pais ORDER BY total DESC"
    )->fetchAll();

    // Últimos envíos
    $ultimos_envios = $db->query(
        "SELECT e.email_to, e.asunto, e.estado, e.enviado_at, l.empresa
         FROM envios e LEFT JOIN leads l ON l.id = e.lead_id
         ORDER BY e.id DESC LIMIT 12"
    )->fetchAll();
}

$NOMBRE_PAIS = ['ES'=>'🇪🇸 España','US'=>'🇺🇸 EE.UU.','UK'=>'🇬🇧 Reino Unido',
                'IE'=>'🇮🇪 Irlanda','AE'=>'🇦🇪 UAE'];

function url_con(array $extra = []): string {
    $base = array_intersect_key($_GET, array_flip(['pais','ciudad','oficio','estado','q','fav']));
    return '?' . http_build_query(array_merge($base, $extra));
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="robots" content="noindex, nofollow">
<title>Panel · Pr3cise</title>
<link rel="icon" href="../favicon.ico">
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<style>
  :root{
    --primary-dark:#0F172A; --accent-gold:#B08D57; --bg-stone:#F8FAFC;
    --text-main:#334155; --white:#fff; --border-lux:#E2E8F0;
    --green:#15803D; --green-bg:#DCFCE7; --amber:#B45309; --amber-bg:#FEF3C7;
    --red:#B91C1C; --red-bg:#FEE2E2; --muted:#64748B;
    --font-heading:'Montserrat',sans-serif; --font-body:'Inter',sans-serif;
  }
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:var(--font-body);background:var(--bg-stone);color:var(--text-main);font-size:14px;line-height:1.6}
  a{color:var(--accent-gold);text-decoration:none}
  a:hover{text-decoration:underline}

  /* Login */
  .login-wrap{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px;
              background:linear-gradient(160deg,var(--primary-dark) 0%,#1e293b 100%)}
  .login-box{background:#fff;border-radius:14px;padding:40px;width:100%;max-width:380px;
             box-shadow:0 24px 60px rgba(15,23,42,.35)}
  .login-box .brand{font-family:var(--font-heading);font-weight:700;font-size:22px;color:var(--primary-dark);letter-spacing:-.02em}
  .login-box .brand span{color:var(--accent-gold)}
  .login-box h1{font-family:var(--font-heading);font-size:16px;color:var(--primary-dark);margin:14px 0 6px}
  .login-box p{color:var(--muted);font-size:13px;margin-bottom:22px}
  input[type=password],input[type=search],select{
    width:100%;padding:11px 13px;border:1px solid var(--border-lux);border-radius:8px;
    font-family:inherit;font-size:14px;color:var(--text-main);background:#fff;outline:none}
  input:focus,select:focus{border-color:var(--accent-gold);box-shadow:0 0 0 3px rgba(176,141,87,.12)}
  .btn{background:var(--primary-dark);color:#fff;border:none;border-radius:8px;padding:11px 18px;
       font-family:var(--font-heading);font-weight:600;font-size:14px;cursor:pointer;width:100%;margin-top:16px}
  .btn:hover{background:#1e293b}
  .error{background:var(--red-bg);color:var(--red);padding:10px 12px;border-radius:8px;font-size:13px;margin-top:14px}

  /* Cabecera */
  header{background:var(--primary-dark);color:#fff;padding:16px 28px;display:flex;align-items:center;gap:14px;flex-wrap:wrap}
  header .brand{font-family:var(--font-heading);font-weight:700;font-size:17px;letter-spacing:-.02em}
  header .brand span{color:var(--accent-gold)}
  header .tag{font-size:11px;text-transform:uppercase;letter-spacing:.14em;color:#94A3B8}
  header .right{margin-left:auto;display:flex;align-items:center;gap:16px;font-size:13px;color:#CBD5E1}
  header .right a{color:#CBD5E1}

  main{max-width:1400px;margin:0 auto;padding:24px 28px 60px}

  /* Tarjetas de estadísticas */
  .stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:14px;margin-bottom:24px}
  .card{background:#fff;border:1px solid var(--border-lux);border-radius:12px;padding:16px 18px}
  .card .lbl{font-size:10.5px;text-transform:uppercase;letter-spacing:.1em;color:var(--muted);font-weight:600}
  .card .val{font-family:var(--font-heading);font-size:28px;font-weight:700;color:var(--primary-dark);
             margin-top:6px;font-variant-numeric:tabular-nums}
  .card.gold .val{color:var(--accent-gold)}
  .card.green .val{color:var(--green)}
  .card.amber .val{color:var(--amber)}

  .cols{display:grid;grid-template-columns:1fr 320px;gap:20px;align-items:start}
  @media(max-width:1080px){.cols{grid-template-columns:1fr}}

  .panel{background:#fff;border:1px solid var(--border-lux);border-radius:12px;overflow:hidden}
  .panel h2{font-family:var(--font-heading);font-size:13px;color:var(--primary-dark);
            padding:14px 18px;border-bottom:1px solid var(--border-lux);font-weight:600}

  /* Filtros */
  form.filters{padding:14px 18px;border-bottom:1px solid var(--border-lux);display:flex;gap:10px;flex-wrap:wrap;align-items:center}
  form.filters select,form.filters input[type=search]{width:auto;min-width:150px;padding:8px 11px;font-size:13px}
  .chip{display:inline-flex;align-items:center;gap:6px;padding:8px 13px;border:1px solid var(--border-lux);
        border-radius:8px;font-size:13px;cursor:pointer;background:#fff;color:var(--text-main)}
  .chip.on{background:var(--accent-gold);color:#fff;border-color:var(--accent-gold)}
  .btn-sm{background:var(--primary-dark);color:#fff;border:none;border-radius:8px;padding:8px 16px;
          font-size:13px;font-weight:600;cursor:pointer;width:auto;margin:0;font-family:var(--font-heading)}

  /* Tabla */
  .tbl-wrap{overflow-x:auto}
  table{width:100%;border-collapse:collapse;min-width:900px}
  th{font-size:10.5px;text-transform:uppercase;letter-spacing:.08em;color:var(--muted);font-weight:600;
     text-align:left;padding:11px 16px;border-bottom:1px solid var(--border-lux);white-space:nowrap;background:#fff}
  td{padding:11px 16px;border-bottom:1px solid var(--border-lux);vertical-align:top}
  tr:last-child td{border-bottom:none}
  tr:hover td{background:#FCFCFD}
  .empresa{font-weight:600;color:var(--primary-dark)}
  .sub{font-size:11.5px;color:var(--muted);margin-top:2px}
  .badge{display:inline-block;padding:3px 9px;border-radius:20px;font-size:11px;font-weight:600;white-space:nowrap}
  .b-nuevo{background:#F1F5F9;color:var(--muted)}
  .b-enriquecido{background:var(--amber-bg);color:var(--amber)}
  .b-contactado{background:var(--green-bg);color:var(--green)}
  .b-respondido{background:#DBEAFE;color:#1D4ED8}
  .b-muerto,.b-descartado{background:var(--red-bg);color:var(--red)}
  .b-sin_web{background:#F1F5F9;color:var(--muted)}
  .star{color:var(--accent-gold);font-size:15px}
  .pill{display:inline-block;padding:2px 8px;border-radius:6px;background:#F1F5F9;font-size:11px;color:var(--muted)}

  .pager{padding:13px 18px;display:flex;justify-content:space-between;align-items:center;
         border-top:1px solid var(--border-lux);font-size:13px;color:var(--muted)}
  .pager a{padding:6px 13px;border:1px solid var(--border-lux);border-radius:7px;color:var(--text-main)}
  .pager a:hover{background:var(--primary-dark);color:#fff;border-color:var(--primary-dark);text-decoration:none}
  .pager .off{opacity:.35;pointer-events:none}

  /* Lateral */
  .mk{display:flex;justify-content:space-between;align-items:center;padding:11px 18px;border-bottom:1px solid var(--border-lux);font-size:13px}
  .mk:last-child{border-bottom:none}
  .mk .n{font-variant-numeric:tabular-nums;color:var(--muted);font-size:12px}
  .mk .n b{color:var(--primary-dark);font-size:14px}
  .env{padding:11px 18px;border-bottom:1px solid var(--border-lux);font-size:12.5px}
  .env:last-child{border-bottom:none}
  .env .to{font-weight:600;color:var(--primary-dark);word-break:break-word}
  .env .meta{color:var(--muted);font-size:11px;margin-top:2px}
  .empty{padding:36px 20px;text-align:center;color:var(--muted);font-size:13px}
  .warn{background:var(--amber-bg);color:var(--amber);padding:14px 18px;border-radius:10px;margin-bottom:20px;font-size:13.5px}
</style>
</head>
<body>

<?php if (!$authed): ?>
<div class="login-wrap">
  <form class="login-box" method="post" autocomplete="off">
    <div class="brand">PR<span>3</span>CISE</div>
    <h1>Panel de administración</h1>
    <p>Acceso restringido. Introduce la contraseña.</p>
    <input type="password" name="password" placeholder="Contraseña" autofocus required>
    <?php if ($login_error): ?><div class="error">Contraseña incorrecta.</div><?php endif; ?>
    <button class="btn" type="submit">Entrar</button>
  </form>
</div>

<?php else: ?>
<header>
  <div class="brand">PR<span>3</span>CISE</div>
  <div class="tag">Panel de captación</div>
  <div class="right">
    <span>Hoy: <strong style="color:#fff"><?= $stats['enviados_hoy'] ?></strong> emails</span>
    <a href="../index.html">Ver web</a>
    <a href="?logout=1">Salir</a>
  </div>
</header>

<main>
<?php if ($db_error): ?>
  <div class="warn">
    <strong>No se encuentra la base de datos.</strong><br>
    Sube el fichero <code>pr3cise.db</code> a <code>admin/data/</code> del servidor.
    Ruta esperada: <code><?= h(DB_PATH) ?></code>
  </div>
<?php else: ?>

  <div class="stats">
    <div class="card"><div class="lbl">Empresas captadas</div><div class="val"><?= number_format($stats['total'],0,',','.') ?></div></div>
    <div class="card amber"><div class="lbl">Con email</div><div class="val"><?= number_format($stats['con_email'],0,',','.') ?></div></div>
    <div class="card amber"><div class="lbl">Pendientes</div><div class="val"><?= number_format($stats['pendientes'],0,',','.') ?></div></div>
    <div class="card green"><div class="lbl">Contactadas</div><div class="val"><?= number_format($stats['contactados'],0,',','.') ?></div></div>
    <div class="card green"><div class="lbl">Respondidas</div><div class="val"><?= number_format($stats['respondidos'],0,',','.') ?></div></div>
    <div class="card gold"><div class="lbl">Favoritas</div><div class="val"><?= number_format($stats['favoritos'],0,',','.') ?></div></div>
  </div>

  <div class="cols">
    <div class="panel">
      <h2>Empresas</h2>
      <form class="filters" method="get">
        <select name="pais" onchange="this.form.submit()">
          <option value="">Todos los países</option>
          <?php foreach ($paises as $p): ?>
            <option value="<?= h($p) ?>" <?= $f_pais===$p?'selected':'' ?>><?= h($NOMBRE_PAIS[$p] ?? $p) ?></option>
          <?php endforeach; ?>
        </select>
        <select name="ciudad" onchange="this.form.submit()">
          <option value="">Todas las ciudades</option>
          <?php foreach ($ciudades as $c): ?>
            <option value="<?= h($c) ?>" <?= $f_ciudad===$c?'selected':'' ?>><?= h($c) ?></option>
          <?php endforeach; ?>
        </select>
        <select name="oficio" onchange="this.form.submit()">
          <option value="">Todos los oficios</option>
          <?php foreach ($oficios as $o): ?>
            <option value="<?= h($o) ?>" <?= $f_oficio===$o?'selected':'' ?>><?= h($o) ?></option>
          <?php endforeach; ?>
        </select>
        <select name="estado" onchange="this.form.submit()">
          <option value="">Todos los estados</option>
          <?php foreach (['nuevo','enriquecido','contactado','respondido','descartado','muerto','sin_web'] as $e): ?>
            <option value="<?= $e ?>" <?= $f_estado===$e?'selected':'' ?>><?= $e ?></option>
          <?php endforeach; ?>
        </select>
        <a class="chip <?= $f_fav?'on':'' ?>" href="<?= h(url_con(['fav'=>$f_fav?null:1,'p'=>null])) ?>">★ Favoritas</a>
        <input type="search" name="q" value="<?= h($f_buscar) ?>" placeholder="Buscar empresa, email…">
        <button class="btn-sm" type="submit">Filtrar</button>
      </form>

      <div class="tbl-wrap">
      <table>
        <thead><tr>
          <th style="width:26px"></th><th>Empresa</th><th>Ciudad</th><th>Oficio</th>
          <th>Email</th><th>Teléfono</th><th>Estado</th><th>Actualizado</th>
        </tr></thead>
        <tbody>
        <?php if (!$leads): ?>
          <tr><td colspan="8"><div class="empty">Sin resultados con estos filtros.</div></td></tr>
        <?php else: foreach ($leads as $l):
              $est = $l['estado'] ?: 'nuevo'; ?>
          <tr>
            <td><?= $l['favorito'] ? '<span class="star">★</span>' : '' ?></td>
            <td>
              <div class="empresa"><?= h(mb_strimwidth($l['empresa'], 0, 54, '…')) ?></div>
              <?php if (!empty($l['website'])): ?>
                <div class="sub"><a href="<?= h($l['website']) ?>" target="_blank" rel="noopener">
                  <?= h(mb_strimwidth(preg_replace('#^https?://(www\.)?#','',$l['website']), 0, 34, '…')) ?></a></div>
              <?php endif; ?>
            </td>
            <td><?= $l['ciudad'] ? '<span class="pill">'.h($l['ciudad']).'</span>' : '—' ?></td>
            <td style="font-size:12.5px"><?= h($l['oficio'] ?: '—') ?></td>
            <td style="font-size:12.5px">
              <?= $l['email'] ? '<a href="mailto:'.h($l['email']).'">'.h(mb_strimwidth($l['email'],0,30,'…')).'</a>' : '<span style="color:var(--muted)">—</span>' ?>
            </td>
            <td style="font-size:12.5px;white-space:nowrap"><?= h($l['telefono'] ?: '—') ?></td>
            <td><span class="badge b-<?= h($est) ?>"><?= h($est) ?></span></td>
            <td style="font-size:12px;color:var(--muted);white-space:nowrap">
              <?= h(substr((string)($l['contactado_at'] ?: $l['updated_at']), 0, 16)) ?>
            </td>
          </tr>
        <?php endforeach; endif; ?>
        </tbody>
      </table>
      </div>

      <?php $desde = ($pagina-1)*$por_pag + 1; $hasta = min($pagina*$por_pag, $total_filtrado); ?>
      <div class="pager">
        <span><?= $total_filtrado ? "$desde–$hasta de " . number_format($total_filtrado,0,',','.') : '0 resultados' ?></span>
        <span>
          <a class="<?= $pagina<=1?'off':'' ?>" href="<?= h(url_con(['p'=>$pagina-1])) ?>">← Anterior</a>
          <a class="<?= $hasta>=$total_filtrado?'off':'' ?>" href="<?= h(url_con(['p'=>$pagina+1])) ?>">Siguiente →</a>
        </span>
      </div>
    </div>

    <div style="display:flex;flex-direction:column;gap:20px">
      <div class="panel">
        <h2>Por mercado</h2>
        <?php if (!$por_mercado): ?><div class="empty">Sin datos</div><?php endif; ?>
        <?php foreach ($por_mercado as $m): ?>
          <div class="mk">
            <span><?= h($NOMBRE_PAIS[$m['pais']] ?? $m['pais']) ?></span>
            <span class="n"><b><?= number_format((int)$m['total'],0,',','.') ?></b>
              · <?= number_format((int)$m['con_email'],0,',','.') ?> email
              · <?= number_format((int)$m['contactados'],0,',','.') ?> contact.</span>
          </div>
        <?php endforeach; ?>
      </div>

      <div class="panel">
        <h2>Últimos envíos</h2>
        <?php if (!$ultimos_envios): ?><div class="empty">Todavía no se ha enviado nada</div><?php endif; ?>
        <?php foreach ($ultimos_envios as $e): ?>
          <div class="env">
            <div class="to"><?= h($e['empresa'] ?: $e['email_to']) ?></div>
            <div class="meta"><?= h($e['email_to']) ?> · <?= h(substr((string)$e['enviado_at'],0,16)) ?>
              <?= $e['estado']!=='enviado' ? ' · <strong style="color:var(--red)">'.h($e['estado']).'</strong>' : '' ?></div>
          </div>
        <?php endforeach; ?>
      </div>
    </div>
  </div>
<?php endif; ?>
</main>
<?php endif; ?>
</body>
</html>
