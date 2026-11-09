<?php
/**
 * api/form-token.php — entrega el token del formulario de contacto (ver form-guard.inc.php).
 *
 * GET  -> 200 {"token":"v1.<unix>.<nonce>.<firma>","min":2,"max":28800}
 * Otro -> 405
 *
 * Lo pide assets/js/main.js al cargar la página de contacto y lo manda como form_token en el
 * POST a send_mail.php. Sin caché: cada visita recibe el suyo.
 */

ini_set('display_errors', '0');
require __DIR__ . '/form-guard.inc.php';

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, max-age=0');
header('X-Robots-Tag: noindex, nofollow');

$metodo = isset($_SERVER['REQUEST_METHOD']) ? strtoupper((string) $_SERVER['REQUEST_METHOD']) : '';
if ($metodo !== 'GET') {
    header('Allow: GET');
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
    exit;
}

echo json_encode(['token' => fg_token_nuevo(), 'min' => FG_EDAD_MIN, 'max' => FG_EDAD_MAX]);
