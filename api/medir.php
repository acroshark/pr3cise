<?php
/**
 * api/medir.php — analítica propia de pr3cise.com.
 *
 * Por qué existe: la web no tiene Google Analytics (no hay propiedad creada) y
 * durante meses no se ha medido nada. Esto mide lo justo, en primera persona y
 * sin cookies ni datos personales, así que no necesita banner de consentimiento:
 *
 *   - No guarda la IP. Solo un hash irreversible (IP + navegador + día + sal)
 *     que sirve para contar visitantes distintos de un día y caduca cada noche.
 *   - No usa cookies ni localStorage. No sigue a nadie entre webs.
 *   - Guarda la página vista, el idioma, de dónde venía y el tipo de aparato.
 *
 * Recibe el aviso de assets/js/medir.js por sendBeacon (texto plano, sin
 * preflight) y lo escribe en SQLite. Responde 204 y se acaba: nunca debe
 * ralentizar la web ni romperla si falla.
 */

// Escribe rápido y calla: ningún error de aquí puede salir a la web.
ini_set('display_errors', '0');
header_remove('X-Powered-By');

function fin(int $codigo = 204): void { http_response_code($codigo); exit; }

function ruta_db(): string {
    foreach ([dirname(__DIR__, 2) . '/pr3cise_data', dirname(__DIR__) . '/admin/data'] as $dir) {
        if (is_dir($dir) && is_writable($dir)) return $dir . '/trafico.db';
    }
    return dirname(__DIR__) . '/admin/data/trafico.db';
}


// ── Comprobación de salud ────────────────────────────────────────────────
// Responde solo SÍ/NO: si la carpeta es escribible, si la tabla existe y si
// hay algún dato reciente. Ni cifras de tráfico ni rutas ni nada privado, así
// que puede ser pública y sirve para comprobar de un vistazo que esto mide.
if (($_SERVER['REQUEST_METHOD'] ?? '') === 'GET' && isset($_GET['estado'])) {
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    $r = ['escribible' => false, 'tabla' => false, 'hay_datos' => false, 'dato_ultimas_24h' => false];
    try {
        $r['escribible'] = is_writable(dirname(ruta_db()));
        if (is_file(ruta_db())) {
            $bd = new PDO('sqlite:' . ruta_db(), null, null, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
            $r['tabla'] = (bool)$bd->query("SELECT name FROM sqlite_master WHERE type='table' AND name='visitas'")->fetchColumn();
            if ($r['tabla']) {
                $ult = (int)$bd->query('SELECT COALESCE(MAX(ts),0) FROM visitas')->fetchColumn();
                $r['hay_datos'] = $ult > 0;
                $r['dato_ultimas_24h'] = $ult > time() - 86400;
            }
        }
    } catch (Throwable $e) { /* se responde con los NO que haya */ }
    echo json_encode($r);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') fin(405);

$bruto = file_get_contents('php://input', false, null, 0, 4096);
if ($bruto === false || $bruto === '') fin(400);
$d = json_decode($bruto, true);
if (!is_array($d)) fin(400);

// ── Fuera robots ─────────────────────────────────────────────────────────
$ua = (string)($_SERVER['HTTP_USER_AGENT'] ?? '');
if ($ua === '' || preg_match('/bot|crawl|spider|slurp|curl|wget|headless|lighthouse|preview|monitor|pingdom|gtmetrix|python-requests|axios|facebookexternalhit|semrush|ahrefs|dataprovider|bytespider/i', $ua)) fin();

// ── Normalización ────────────────────────────────────────────────────────
function texto($v, int $max): ?string {
    if (!is_string($v)) return null;
    $v = trim(preg_replace('/[[:cntrl:]]/u', '', $v));
    if ($v === '') return null;
    return mb_substr($v, 0, $max, 'UTF-8');
}

$ruta = texto($d['p'] ?? null, 300);
if ($ruta === null || $ruta[0] !== '/') fin(400);          // solo rutas del propio sitio
$evento  = texto($d['e'] ?? null, 40);                      // null = página vista
$detalle = texto($d['d'] ?? null, 300);
$titulo  = texto($d['t'] ?? null, 160);

// Idioma por la carpeta de la URL: /en/..., /de/..., /fr/..., raíz = es
$idioma = 'es';
if (preg_match('#^/(en|de|fr)(/|$)#', $ruta, $m)) $idioma = $m[1];

// Referente: solo el dominio, y nunca el propio
$referer = null;
$ref = texto($d['r'] ?? null, 300);
if ($ref !== null) {
    $h = parse_url($ref, PHP_URL_HOST);
    if (is_string($h)) {
        $h = strtolower(preg_replace('/^www\./', '', $h));
        if ($h !== 'pr3cise.com') $referer = mb_substr($h, 0, 100);
    }
}

// Campañas (utm_*) tal y como vengan en la URL
$utm = ['source' => null, 'medium' => null, 'campaign' => null];
$qs = texto($d['q'] ?? null, 500);
if ($qs !== null) {
    parse_str(ltrim($qs, '?'), $par);
    foreach ($utm as $k => $_) {
        $v = $par['utm_' . $k] ?? null;
        if (is_string($v)) $utm[$k] = mb_substr(preg_replace('/[^\w .\-]/u', '', $v), 0, 60);
    }
}

$aparato = preg_match('/iPad|Tablet/i', $ua) ? 'tableta'
         : (preg_match('/Mobi|Android|iPhone/i', $ua) ? 'movil' : 'escritorio');

// ── Base de datos ────────────────────────────────────────────────────────
// Fuera de la carpeta pública si se puede; si no, junto a la de leads.

try {
    $bd = new PDO('sqlite:' . ruta_db(), null, null, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
    $bd->exec('PRAGMA journal_mode=WAL');
    $bd->exec('CREATE TABLE IF NOT EXISTS visitas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ts INTEGER NOT NULL, fecha TEXT NOT NULL, hora INTEGER NOT NULL,
        ruta TEXT NOT NULL, idioma TEXT, titulo TEXT,
        evento TEXT, detalle TEXT, referer TEXT,
        utm_source TEXT, utm_medium TEXT, utm_campaign TEXT,
        aparato TEXT, visitante TEXT NOT NULL)');
    $bd->exec('CREATE INDEX IF NOT EXISTS idx_visitas_fecha ON visitas(fecha)');
    $bd->exec('CREATE INDEX IF NOT EXISTS idx_visitas_ruta  ON visitas(ruta)');

    // Sal del hash: se crea sola, vive junto a la BD y nunca sale de ahí.
    $fsal = dirname(ruta_db()) . '/.sal-medir';
    if (!is_file($fsal)) @file_put_contents($fsal, bin2hex(random_bytes(16)));
    $sal = (string)@file_get_contents($fsal);

    $ip  = (string)($_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? '');
    $ip  = trim(explode(',', $ip)[0]);
    $hoy = gmdate('Y-m-d');
    $visitante = substr(hash('sha256', $ip . '|' . $ua . '|' . $hoy . '|' . $sal), 0, 16);

    // Un mismo visitante no puede meter más de 300 avisos al día: cortafuegos simple.
    $n = $bd->prepare('SELECT COUNT(*) FROM visitas WHERE visitante = ? AND fecha = ?');
    $n->execute([$visitante, $hoy]);
    if ((int)$n->fetchColumn() > 300) fin();

    $ins = $bd->prepare('INSERT INTO visitas
        (ts, fecha, hora, ruta, idioma, titulo, evento, detalle, referer,
         utm_source, utm_medium, utm_campaign, aparato, visitante)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)');
    $ins->execute([time(), $hoy, (int)gmdate('G'), $ruta, $idioma, $titulo,
        $evento, $detalle, $referer, $utm['source'], $utm['medium'], $utm['campaign'],
        $aparato, $visitante]);
} catch (Throwable $e) {
    // Medir nunca puede romper la web: si falla, se pierde el dato y ya está.
}

fin();
