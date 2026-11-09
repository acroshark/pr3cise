<?php
/**
 * api/form-guard.inc.php — prueba de que el formulario de contacto se cargó en un navegador.
 *
 * 2026-11-09 | Spam del formulario. El 8-11 el formulario pasó a llevar
 *   action="/api/send_mail.php" (envío sin JavaScript) y al día siguiente un robot de los que
 *   rellenan formularios leyendo solo el HTML ("Robertcon", "I want to know your price")
 *   mandó 22 solicitudes falsas en hora y media, con empresas inventadas y emails de terceros
 *   (que además recibían nuestra confirmación). Ese tipo de robot no ejecuta JavaScript: ni
 *   ve el nivel de burbuja ni pasa por main.js. Dos medidas:
 *     1. Los formularios ya no llevan action: el HTML no dice a dónde se envía.
 *     2. send_mail.php exige un token firmado que entrega api/form-token.php y que main.js
 *        pide al cargar la página. Formato: v1.<unix>.<16 hex>.<32 hex HMAC-SHA256>.
 *        Válido desde 2 s hasta 8 h después de emitirse (main.js lo renueva antes).
 *
 * El secreto (64 hex) se crea solo la primera vez en la carpeta de datos (la misma que usa
 * send_mail.php: ../../pr3cise_data, fuera de la web, o ../admin/data, protegida por .htaccess)
 * y no está en git. Si no hubiera carpeta escribible se usa uno derivado de la ruta del
 * servidor, que no se publica en ningún sitio.
 *
 * Solo se incluye desde otros PHP; abierto directamente responde 404.
 * Compatible con PHP 7.4+. Sin dependencias.
 */

if (isset($_SERVER['SCRIPT_FILENAME']) && realpath((string) $_SERVER['SCRIPT_FILENAME']) === __FILE__) {
    http_response_code(404);
    exit;
}

const FG_EDAD_MIN = 2;          // segundos: nadie rellena el formulario en menos tiempo
const FG_EDAD_MAX = 28800;      // 8 horas

/** Carpetas donde puede vivir el secreto, en orden de preferencia. */
function fg_carpetas()
{
    return [dirname(__DIR__, 2) . '/pr3cise_data', dirname(__DIR__) . '/admin/data'];
}

/** Secreto del HMAC: se lee del disco o se crea una sola vez. */
function fg_secreto()
{
    static $secreto = null;
    if ($secreto !== null) {
        return $secreto;
    }
    foreach (fg_carpetas() as $dir) {
        $fichero = $dir . '/form-secret.key';
        if (@is_file($fichero)) {
            $valor = trim((string) @file_get_contents($fichero));
            if (strlen($valor) >= 32) {
                return $secreto = $valor;
            }
        }
    }
    foreach (fg_carpetas() as $dir) {
        if (!@is_dir($dir) || !@is_writable($dir)) {
            continue;
        }
        // admin/data está dentro de la web: solo si su .htaccess deniega el acceso
        if (strpos($dir, '/admin/data') !== false && !@is_file($dir . '/.htaccess')) {
            continue;
        }
        $fichero = $dir . '/form-secret.key';
        try {
            $nuevo = bin2hex(random_bytes(32));
        } catch (Exception $e) {
            break;
        }
        $fh = @fopen($fichero, 'x');            // 'x': falla si otro proceso lo acaba de crear
        if ($fh !== false) {
            @fwrite($fh, $nuevo);
            @fclose($fh);
            return $secreto = $nuevo;
        }
        if (@is_file($fichero)) {
            $valor = trim((string) @file_get_contents($fichero));
            if (strlen($valor) >= 32) {
                return $secreto = $valor;
            }
        }
    }
    return $secreto = hash('sha256', 'pr3cise-form|' . __FILE__ . '|' . dirname(__DIR__, 2));
}

/** Firma de la parte "v1.<unix>.<nonce>" del token. */
function fg_firma($base)
{
    return substr(hash_hmac('sha256', $base, fg_secreto()), 0, 32);
}

/** Token nuevo para el formulario. */
function fg_token_nuevo()
{
    try {
        $nonce = bin2hex(random_bytes(8));
    } catch (Exception $e) {
        $nonce = substr(hash('sha256', uniqid('', true) . mt_rand()), 0, 16);
    }
    $base = 'v1.' . time() . '.' . $nonce;
    return $base . '.' . fg_firma($base);
}

/**
 * Estado de un token recibido: 'ok', 'falta', 'formato', 'firma', 'pronto' (enviado antes de
 * FG_EDAD_MIN segundos) o 'caducado' (más de FG_EDAD_MAX).
 */
function fg_token_estado($token)
{
    if (!is_string($token) || $token === '') {
        return 'falta';
    }
    if (!preg_match('/^v1\.([0-9]{9,11})\.([0-9a-f]{16})\.([0-9a-f]{32})$/', $token, $m)) {
        return 'formato';
    }
    if (!hash_equals(fg_firma('v1.' . $m[1] . '.' . $m[2]), $m[3])) {
        return 'firma';
    }
    $edad = time() - (int) $m[1];
    if ($edad < FG_EDAD_MIN) {
        return 'pronto';
    }
    if ($edad > FG_EDAD_MAX) {
        return 'caducado';
    }
    return 'ok';
}
