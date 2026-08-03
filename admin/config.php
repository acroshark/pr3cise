<?php
/**
 * admin/config.php — configuración del panel de administración PR3CISE.
 *
 * NO subir este fichero a repositorios públicos.
 */

// ── Contraseña de acceso ─────────────────────────────────────────────────
// Hash bcrypt. Para cambiar la contraseña, genera un hash nuevo con:
//     php -r 'echo password_hash("TU_NUEVA_CLAVE", PASSWORD_DEFAULT);'
// y pégalo aquí.
const ADMIN_PASSWORD_HASH = '$2y$10$FqKzqTU9BIWQMJWdWCOjgupsT11X1n.Q61mLzE.hr/Ywahiky9JcK';

// ── Base de datos de leads (SQLite) ──────────────────────────────────────
// Se busca en varias rutas, de la MÁS SEGURA a la menos:
//
//   1. Fuera de la carpeta pública (recomendado). En OVH tu espacio suele ser
//      /home/tuusuario/www — sube la BD a /home/tuusuario/pr3cise_data/ y así
//      es IMPOSIBLE descargarla por la web, pase lo que pase.
//   2. admin/data/ dentro de la web. Funciona, pero ahí la protección depende
//      del .htaccess: si el servidor no lo respeta, la BD queda expuesta.
//
// Si quieres forzar una ruta concreta, defínela aquí y quita el resto.
function admin_db_path(): string {
    $candidatas = [
        dirname(__DIR__, 2) . '/pr3cise_data/pr3cise.db',   // fuera del web root
        dirname(__DIR__) . '/../pr3cise_data/pr3cise.db',
        __DIR__ . '/data/pr3cise.db',                        // dentro (con .htaccess)
    ];
    foreach ($candidatas as $ruta) {
        if (is_readable($ruta)) return $ruta;
    }
    return end($candidatas);   // para poder mostrar la ruta esperada en el aviso
}

define('DB_PATH', admin_db_path());

// ── Sesión ───────────────────────────────────────────────────────────────
const SESSION_NAME    = 'pr3cise_admin';
const SESSION_MAX_AGE = 60 * 60 * 8;   // 8 horas

// ── Arranque de sesión con cookie segura ─────────────────────────────────
function admin_start_session(): void {
    if (session_status() === PHP_SESSION_ACTIVE) return;
    $https = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
          || (($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https');
    session_name(SESSION_NAME);
    session_set_cookie_params([
        'lifetime' => SESSION_MAX_AGE,
        'path'     => '/',
        'httponly' => true,
        'secure'   => $https,
        'samesite' => 'Strict',
    ]);
    session_start();
}

function admin_is_authed(): bool {
    admin_start_session();
    if (empty($_SESSION['authed'])) return false;
    if ((time() - ($_SESSION['ts'] ?? 0)) > SESSION_MAX_AGE) {
        admin_logout();
        return false;
    }
    return true;
}

function admin_login(string $password): bool {
    admin_start_session();
    if (!password_verify($password, ADMIN_PASSWORD_HASH)) return false;
    session_regenerate_id(true);       // evita fijación de sesión
    $_SESSION['authed'] = true;
    $_SESSION['ts']     = time();
    return true;
}

function admin_logout(): void {
    admin_start_session();
    $_SESSION = [];
    session_destroy();
}

/** Conexión de solo lectura a la base de datos de leads. */
function admin_db(): ?PDO {
    if (!file_exists(DB_PATH)) return null;
    try {
        $pdo = new PDO('sqlite:' . DB_PATH);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        return $pdo;
    } catch (Throwable $e) {
        return null;
    }
}

function h(?string $s): string {
    return htmlspecialchars((string)$s, ENT_QUOTES, 'UTF-8');
}
