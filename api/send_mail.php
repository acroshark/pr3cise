<?php
/**
 * api/send_mail.php — formulario de contacto de pr3cise.com (es / en / de / fr)
 *
 * Recibe el POST de assets/js/main.js (fetch con "Accept: application/json") o,
 * si main.js no llegó a ejecutarse, el envío normal del formulario
 * (<form method="post" action="/api/send_mail.php">). Envía dos correos:
 *   1. aviso interno a contact@pr3cise.com (Reply-To = cliente), con todos los datos
 *   2. confirmación al cliente, en su idioma: texto fijo + email, teléfono y alcance.
 *      Nunca repite texto libre del formulario (nombre, empresa, mensaje): así nadie
 *      puede usarlo para mandar su texto a terceros desde pr3cise.com.
 *
 * Respuesta a main.js (JSON UTF-8):
 *   200 {"status":"success",...}  el aviso interno fue aceptado por mail()
 *   400 {"status":"error",...}    faltan campos o el email no es válido ("field":"email")
 *   405 {"status":"error",...}    método distinto de POST
 *   500 {"status":"error",...}    mail() falló
 * Envío sin JavaScript: 303 a la página de contacto de su idioma, con
 *   ?enviado=1#form-enviado (éxito) o ?enviado=0#form-fallo (error).
 *
 * 2026-11-08 | Robustez:
 *   - display_errors desactivado: un aviso de PHP nunca puede romper el JSON.
 *   - Honeypot "website": si llega relleno, se responde éxito sin enviar nada
 *     (se anota en contact-spam.jsonl por si alguna vez fuera una persona).
 *   - El email se valida en bruto, antes de escapar, y solo se admiten
 *     direcciones "normales": FILTER_VALIDATE_EMAIL acepta partes locales entre
 *     comillas con saltos de línea escapados, que irían tal cual a Reply-To.
 *   - Asuntos en RFC 2047 troceados (palabras de 75 caracteres como máximo) y
 *     cuerpos en base64 (líneas cortas que ningún MTA tiene que partir).
 *   - Red de seguridad: cada solicitud válida se guarda ANTES de enviar como una
 *     línea JSON en contact-leads.jsonl (sin IP), en la primera carpeta de datos
 *     escribible: ../../pr3cise_data (fuera de la web) o ../admin/data.
 *   - Límite por visitante (huella de la IP con sal diaria, nunca la IP): más de
 *     5 envíos en una hora, sin confirmación al cliente; más de 20, sin correos.
 *     La solicitud se guarda siempre.
 *
 * Compatible con PHP 7.4+. Sin dependencias.
 */

// Ningún warning puede colarse en la respuesta: rompería el JSON.
ini_set('display_errors', '0');

// 1. Configuración de Destinatario
/* 2025-04-26 01:00 | Updated destination to contact@pr3cise.com */
$to = 'contact@pr3cise.com';

// 5. Lógica de Respuesta - Establecer cabecera JSON anticipadamente
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

/** Texto de $_POST: siempre string y sin espacios en los extremos. */
function campo($nombre)
{
    if (!isset($_POST[$nombre]) || !is_string($_POST[$nombre])) {
        return '';
    }
    return trim($_POST[$nombre]);
}

/** Idioma de la página que envía (campo user_lang): es, en, de o fr. */
function idioma()
{
    $lang = preg_replace('/[^a-z]/', '', strtolower(campo('user_lang')));
    return in_array($lang, ['es', 'en', 'de', 'fr'], true) ? $lang : 'es';
}

/** ¿Lo envía main.js (fetch)? Si no, es el envío normal del formulario, sin JavaScript. */
function pide_json()
{
    $accept = isset($_SERVER['HTTP_ACCEPT']) ? (string) $_SERVER['HTTP_ACCEPT'] : '';
    return strpos($accept, 'application/json') !== false;
}

/**
 * Responde y termina. A main.js, en JSON. A un envío sin JavaScript, con una
 * redirección 303 a la página de contacto de su idioma, que muestra el aviso.
 */
function responder($codigo, array $datos)
{
    $metodo = isset($_SERVER['REQUEST_METHOD']) ? strtoupper((string) $_SERVER['REQUEST_METHOD']) : '';
    if ($metodo === 'POST' && !pide_json()) {
        $paginas = [
            'es' => '/contacto.html',
            'en' => '/en/contact.html',
            'de' => '/de/kontakt.html',
            'fr' => '/fr/contact.html'
        ];
        $destino = $paginas[idioma()] . ($codigo === 200 ? '?enviado=1#form-enviado' : '?enviado=0#form-fallo');
        header('Location: ' . $destino, true, 303);
        exit;
    }
    http_response_code($codigo);
    echo json_encode($datos, JSON_UNESCAPED_UNICODE);
    exit;
}

/** Recorta a $max caracteres sin partir caracteres UTF-8 (no necesita mbstring). */
function recortar($texto, $max)
{
    $texto = (string) $texto;
    if (preg_match('/^.{0,' . (int) $max . '}/su', $texto, $m)) {
        return $m[0];
    }
    return substr($texto, 0, (int) $max);
}

/**
 * Cabecera en RFC 2047 (UTF-8, base64), troceada sin partir caracteres en
 * palabras de 72 caracteres como máximo (la norma pide 75). Los programas de
 * correo unen las palabras seguidas al mostrarlas.
 */
function cabecera_utf8($texto)
{
    $texto = (string) $texto;
    $letras = preg_split('//u', $texto, -1, PREG_SPLIT_NO_EMPTY);
    if (!is_array($letras)) {
        $letras = str_split($texto);
    }
    $palabras = [];
    $actual = '';
    foreach ($letras as $letra) {
        if ($actual !== '' && strlen($actual . $letra) > 45) {
            $palabras[] = '=?UTF-8?B?' . base64_encode($actual) . '?=';
            $actual = '';
        }
        $actual .= $letra;
    }
    if ($actual !== '') {
        $palabras[] = '=?UTF-8?B?' . base64_encode($actual) . '?=';
    }
    return implode(' ', $palabras);
}

/**
 * Carpetas de datos escribibles, las mismas que usan api/medir.php y
 * admin/config.php: fuera de la web (preferida) y admin/data. Esta última está
 * dentro de la web, así que solo se usa si tiene (o se le puede crear) su
 * .htaccess que deniega el acceso.
 */
function carpetas_datos()
{
    static $carpetas = null;
    if ($carpetas !== null) {
        return $carpetas;
    }
    $carpetas = [];
    foreach ([dirname(__DIR__, 2) . '/pr3cise_data', dirname(__DIR__) . '/admin/data'] as $dir) {
        if (!@is_dir($dir) || !@is_writable($dir)) {
            continue;
        }
        if (strpos($dir, '/admin/data') !== false && !@is_file($dir . '/.htaccess')) {
            $creado = @file_put_contents(
                $dir . '/.htaccess',
                "<IfModule mod_authz_core.c>\n    Require all denied\n</IfModule>\n"
                . "<IfModule !mod_authz_core.c>\n    Order deny,allow\n    Deny from all\n</IfModule>\n"
            );
            if ($creado === false) {
                continue;
            }
        }
        $carpetas[] = $dir;
    }
    return $carpetas;
}

/**
 * Añade una línea JSON a $fichero en la primera carpeta de datos donde la
 * escritura funcione. Nunca hace fallar la petición. Con $max_bytes > 0 no
 * escribe si el fichero ya pasa de ese tamaño.
 */
function guardar_linea($fichero, array $datos, $max_bytes = 0)
{
    $flags = JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES;
    if (defined('JSON_INVALID_UTF8_SUBSTITUTE')) {
        $flags = $flags | JSON_INVALID_UTF8_SUBSTITUTE;
    }
    $linea = json_encode($datos, $flags);
    if ($linea === false) {
        return false;
    }
    foreach (carpetas_datos() as $dir) {
        $ruta = $dir . '/' . $fichero;
        if ($max_bytes > 0 && @is_file($ruta) && @filesize($ruta) > $max_bytes) {
            return false;
        }
        if (@file_put_contents($ruta, $linea . "\n", FILE_APPEND | LOCK_EX) !== false) {
            return true;
        }
    }
    return false;
}

/**
 * Envíos válidos de este visitante en la última hora, contando el actual.
 * Solo se guarda una huella (sha256 truncado de la IP con sal diaria), nunca
 * la IP, y cada marca caduca a la hora. Si no hay carpeta escribible o algo
 * falla devuelve 0: el límite nunca bloquea a un cliente por un fallo propio.
 */
function envios_ultima_hora()
{
    $ip = isset($_SERVER['REMOTE_ADDR']) ? (string) $_SERVER['REMOTE_ADDR'] : '';
    if ($ip === '') {
        return 0;
    }
    $huella = 'h' . substr(hash('sha256', $ip . '|' . gmdate('Y-m-d') . '|' . __DIR__), 0, 16);
    $ahora = time();
    foreach (carpetas_datos() as $dir) {
        $fh = @fopen($dir . '/contact-ratelimit.json', 'c+');
        if ($fh === false) {
            continue;
        }
        $total = 0;
        if (@flock($fh, LOCK_EX)) {
            $previo = json_decode((string) stream_get_contents($fh), true);
            $vigente = [];
            if (is_array($previo)) {
                foreach ($previo as $clave => $marcas) {
                    if (!is_array($marcas)) {
                        continue;
                    }
                    foreach ($marcas as $marca) {
                        if (is_int($marca) && $marca > $ahora - 3600) {
                            $vigente[$clave][] = $marca;
                        }
                    }
                }
            }
            $vigente[$huella][] = $ahora;
            $total = count($vigente[$huella]);
            @ftruncate($fh, 0);
            @rewind($fh);
            @fwrite($fh, (string) json_encode($vigente));
            @fflush($fh);
            @flock($fh, LOCK_UN);
        }
        @fclose($fh);
        return $total;
    }
    return 0;
}

// 4. Seguridad: escapado para el HTML de los correos
function sanitize_input($data)
{
    return htmlspecialchars(trim((string) $data), ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

// Permitir solicitudes solo si son POST
$metodo = isset($_SERVER['REQUEST_METHOD']) ? strtoupper((string) $_SERVER['REQUEST_METHOD']) : '';
if ($metodo !== 'POST') {
    header('Allow: POST');
    responder(405, ["status" => "error", "message" => "Método HTTP no permitido."]);
}

$respuesta_ok = [
    "status"  => "success",
    "message" => "Solicitud enviada. Recibirá respuesta en menos de 24h."
];

// Honeypot: "website" está oculto para las personas; si llega relleno es un robot.
// Se responde como si todo hubiera ido bien y no se envía nada. Se anota aparte
// (contact-spam.jsonl, máximo 2 MB) por si alguna vez fuera una persona.
if (campo('website') !== '') {
    guardar_linea('contact-spam.jsonl', [
        'ts'      => gmdate('c'),
        'motivo'  => 'honeypot',
        'lang'    => idioma(),
        'website' => recortar(campo('website'), 200),
        'nombre'  => recortar(campo('nombre'), 200),
        'empresa' => recortar(campo('empresa'), 200),
        'email'   => recortar(campo('email'), 320),
        'mensaje' => recortar(campo('mensaje'), 2000)
    ], 2000000);
    responder(200, $respuesta_ok);
}

// 2. Captura de Datos (en bruto; se escapan después de validar)
$nombre_raw   = campo('nombre');
$empresa_raw  = campo('empresa');
$email_raw    = campo('email');
$telefono_raw = campo('telefono');
if ($telefono_raw === '' && campo('telefono_numero') !== '') {
    // Envío sin JavaScript: main.js no ha unido el prefijo y el número
    $telefono_raw = trim(campo('telefono_prefijo') . ' ' . campo('telefono_numero'));
}
$tipo_raw     = isset($_POST['tipo_proyecto']) ? campo('tipo_proyecto') : 'No especificado';
$mensaje_raw  = campo('mensaje');
/* 2025-04-26 01:55 | Read page language for multilingual confirmation email */
$user_lang  = idioma();
$lang_names = ['es' => 'Español', 'en' => 'English', 'de' => 'Deutsch', 'fr' => 'Français'];
$lang_label = $lang_names[$user_lang];

// Validaciones (=== '' y no empty(): una empresa llamada "0" es válida)
if ($nombre_raw === '' || $empresa_raw === '' || $email_raw === '' || $tipo_raw === '' || $mensaje_raw === '') {
    responder(400, ["status" => "error", "message" => "Por favor, complete todos los campos obligatorios."]);
}

// El email se valida en bruto, antes de escapar. Además de FILTER_VALIDATE_EMAIL, solo
// direcciones "normales": ASCII imprimible, sin comillas, barra invertida, paréntesis,
// coma, dos puntos, punto y coma, < > ni corchetes. FILTER_VALIDATE_EMAIL admite partes
// locales entre comillas con \<CR>\<LF> escapados ("\<LF>Bcc:x@y,"@dominio.com), que
// irían tal cual a la cabecera Reply-To: una inyección de cabeceras (Bcc a terceros).
$email_valido = filter_var($email_raw, FILTER_VALIDATE_EMAIL);
if ($email_valido === false || preg_match('/[^\x21-\x7E]|["\\\\(),:;<>\[\]]/', $email_valido)) {
    responder(400, ["status" => "error", "field" => "email", "message" => "Formato de correo electrónico inválido."]);
}

// Versiones escapadas para el HTML de los correos
$nombre        = sanitize_input($nombre_raw);
$empresa       = sanitize_input($empresa_raw);
$email         = sanitize_input($email_valido);
$telefono      = sanitize_input($telefono_raw);
$tipo_proyecto = sanitize_input($tipo_raw);
$mensaje       = sanitize_input($mensaje_raw);

// Límite por visitante: por encima de 5 envíos en una hora no se manda la confirmación
// al cliente (el aviso interno sí, marcado); por encima de 20, ningún correo.
$envios_hora      = envios_ultima_hora();
$sin_confirmacion = $envios_hora > 5;
$sin_correos      = $envios_hora > 20;

// Red de seguridad: se guarda antes de enviar, por si mail() falla o el correo se pierde
guardar_linea('contact-leads.jsonl', [
    'ts'            => gmdate('c'),
    'lang'          => $user_lang,
    'nombre'        => recortar($nombre_raw, 300),
    'empresa'       => recortar($empresa_raw, 300),
    'email'         => recortar($email_valido, 320),
    'telefono'      => recortar($telefono_raw, 60),
    'tipo_proyecto' => recortar($tipo_raw, 200),
    'mensaje'       => recortar($mensaje_raw, 10000),
    'via'           => pide_json() ? 'web' : 'sin_js',
    'correos'       => $sin_correos ? 'ninguno' : ($sin_confirmacion ? 'solo_aviso' : 'ambos')
]);

if ($sin_correos) {
    responder(200, $respuesta_ok);
}

// 3. Cabeceras Profesionales (asunto en RFC 2047; empresa en bruto: el asunto no es HTML)
$empresa_asunto = recortar(trim(preg_replace('/[\x00-\x20\x7F]+/', ' ', $empresa_raw)), 120);
$subject  = cabecera_utf8(($sin_confirmacion ? '[Revisar: muchos envíos] ' : '') . "Nueva Solicitud (" . $lang_label . ") — " . $empresa_asunto);
$headers  = "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=UTF-8\r\n";
$headers .= "Content-Transfer-Encoding: base64\r\n";
$headers .= "From: form-robot@pr3cise.com\r\n";
$headers .= "Reply-To: " . $email_valido;

// 6. Estructura del Email: Maquetación con una tabla sencilla
$email_body = "
<!DOCTYPE html>
<html lang='es'>
<head>
    <meta charset='UTF-8'>
    <title>Solicitud de Presupuesto</title>
    <style>
        table { width: 100%; max-width: 600px; border-collapse: collapse; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; }
        th, td { text-align: left; padding: 12px; border-bottom: 1px solid #ddd; }
        th { background-color: #0A2540; color: #ffffff; width: 35%; }
        td { color: #2C3E50; }
    </style>
</head>
<body style='background-color: #F4F7FA; padding: 20px;'>
    <div style='background-color: #ffffff; padding: 20px; border-radius: 8px;'>
        <h2 style='color: #0A2540; margin-top: 0;'>Detalles de la nueva solicitud</h2>
        <table>
            <tr>
                <th>Nombre</th>
                <td>{$nombre}</td>
            </tr>
            <tr>
                <th>Empresa</th>
                <td>{$empresa}</td>
            </tr>
            <tr>
                <th>Email</th>
                <td><a href='mailto:{$email}'>{$email}</a></td>
            </tr>
            <tr>
                <th>Teléfono</th>
                <td>{$telefono}</td>
            </tr>
            <tr>
                <th>Tipo de Proyecto</th>
                <td>{$tipo_proyecto}</td>
            </tr>
            <tr>
                <th>Mensaje</th>
                <td>" . nl2br($mensaje) . "</td>
            </tr>
            <tr>
                <th style='background:#B08D57;color:#0A2540;'>Idioma del cliente</th>
                <td><strong>{$lang_label}</strong> &mdash; Responder en este idioma</td>
            </tr>
        </table>
    </div>
</body>
</html>
";

/* Multilingual confirmation strings — 4 languages (sin texto libre del formulario) */
$conf = [
    'es' => [
        'tagline'  => 'Mediciones y Estimación de Costes',
        'subject'  => 'Hemos recibido su solicitud — Pr3cise',
        'greeting' => 'Hola,',
        'p1'       => 'Hemos recibido correctamente su solicitud. Revisaremos el alcance y le responderemos habitualmente en menos de 24 horas laborables con el precio cerrado por proyecto y la fecha de entrega. Si desea enviar planos o documentación técnica adicional, puede hacerlo directamente a contact@pr3cise.com.',
        'p2'       => 'Estos son los datos que hemos registrado:',
        'f'        => ['Nombre', 'Empresa', 'Email', 'Teléfono', 'Tipo de proyecto', 'Mensaje'],
        'thanks'   => 'Gracias por confiar en Pr3cise.',
        'auto'     => 'Este es un mensaje automático generado por el formulario de contacto de <strong>pr3cise.com</strong>. Para enviar planos o consultas adicionales escríbanos a <a href="mailto:contact@pr3cise.com" style="color:#B08D57;">contact@pr3cise.com</a>.',
    ],
    'en' => [
        'tagline'  => 'Construction Cost Estimating & Takeoffs',
        'subject'  => 'We have received your request — Pr3cise',
        'greeting' => 'Hello,',
        'p1'       => 'We have received your estimate request. We will review your scope and reply within one business day with a fixed project fee and a confirmed delivery date. If you still need to share drawings or specifications, you can send files or a cloud link directly to contact@pr3cise.com.',
        'p2'       => 'These are the details we have recorded:',
        'f'        => ['Name', 'Company', 'Email', 'Phone', 'Project type', 'Message'],
        'thanks'   => 'Thank you for trusting Pr3cise.',
        'auto'     => 'This is an automated confirmation from <strong>pr3cise.com</strong>. To send drawings, addenda or enquiries write directly to <a href="mailto:contact@pr3cise.com" style="color:#B08D57;">contact@pr3cise.com</a>.',
    ],
    'de' => [
        'tagline'  => 'Baukostenschätzung & Mengenermittlung',
        'subject'  => 'Wir haben Ihre Anfrage erhalten — Pr3cise',
        'greeting' => 'Guten Tag,',
        'p1'       => 'Wir haben Ihre Angebotsanfrage erfolgreich erhalten. Wir prüfen den Umfang und melden uns in der Regel innerhalb eines Werktags mit einem schriftlichen Festpreis und Liefertermin. Pläne oder Cloud-Links können Sie jederzeit direkt an contact@pr3cise.com senden.',
        'p2'       => 'Diese Angaben haben wir erfasst:',
        'f'        => ['Name', 'Unternehmen', 'E-Mail', 'Telefon', 'Projektart', 'Nachricht'],
        'thanks'   => 'Vielen Dank für Ihr Vertrauen in Pr3cise.',
        'auto'     => 'Dies ist eine automatische Bestätigung von <strong>pr3cise.com</strong>. Für Pläne oder Rückfragen schreiben Sie bitte direkt an <a href="mailto:contact@pr3cise.com" style="color:#B08D57;">contact@pr3cise.com</a>.',
    ],
    'fr' => [
        'tagline'  => 'Estimation des Coûts & Métrés',
        'subject'  => 'Nous avons reçu votre demande — Pr3cise',
        'greeting' => 'Bonjour,',
        'p1'       => "Nous avons bien reçu votre demande de chiffrage. Nous reviendrons vers vous généralement sous 24 heures ouvrées avec un prix forfaitaire et une date de livraison. Vous pouvez également envoyer vos plans ou liens de téléchargement directement à contact@pr3cise.com.",
        'p2'       => 'Voici les informations que nous avons enregistrées :',
        'f'        => ['Nom', 'Entreprise', 'E-mail', 'Téléphone', 'Type de projet', 'Message'],
        'thanks'   => 'Merci de faire confiance à Pr3cise.',
        'auto'     => 'Confirmation automatique générée par <strong>pr3cise.com</strong>. Pour transmettre vos plans ou toute question, écrivez-nous à <a href="mailto:contact@pr3cise.com" style="color:#B08D57;">contact@pr3cise.com</a>.',
    ],
];
$s = $conf[$user_lang];

// Lo único del formulario que se repite al cliente: su email (es el destinatario), el
// teléfono si solo lleva cifras y signos telefónicos, y el alcance si es una opción
// del desplegable (valores de las 4 páginas de contacto).
$alcances = [
    'Presupuesto completo de obra', 'Solo mediciones / Takeoff', 'Estimación conceptual / Viabilidad',
    'Instalaciones MEP / Climatización', 'Instalaciones eléctricas', 'Fontanería y saneamiento',
    'PCI (Protección Contra Incendios)', 'Estructura, hormigón y albañilería', 'Carpintería y acabados', 'Otro',
    'Full building estimate', 'Quantity takeoff only', 'Conceptual budget', 'MEP / HVAC', 'Electrical',
    'Plumbing', 'Fire protection', 'Concrete / Masonry', 'Drywall / Framing / Finishes', 'Other'
];
$alcance_conf  = in_array($tipo_raw, $alcances, true) ? $tipo_proyecto : '';
$telefono_conf = preg_match('/^[+(]?[0-9][0-9 ()\-]{3,30}$/', $telefono_raw) ? $telefono : '';

// Shared inline-style helpers for confirmation email table cells
$th = 'style="background:#0A2540;color:#B08D57;font-weight:700;padding:10px 14px;font-size:0.72rem;text-transform:uppercase;letter-spacing:1px;"';
$td = 'style="padding:10px 14px;border-bottom:1px solid #eee;color:#333;"';

$phone_row = $telefono_conf !== ''
    ? '<tr><td ' . $th . '>' . $s['f'][3] . '</td><td ' . $td . '>' . $telefono_conf . '</td></tr>'
    : '';
$scope_row = $alcance_conf !== ''
    ? '<tr><td ' . $th . '>' . $s['f'][4] . '</td><td ' . $td . '>' . $alcance_conf . '</td></tr>'
    : '';

/* Build branded confirmation HTML email */
$conf_body =
    '<!DOCTYPE html><html lang="' . $user_lang . '"><head><meta charset="UTF-8">'
    . '<title>' . $s['subject'] . '</title>'
    . '<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Inter:wght@400;500&family=Montserrat:wght@700&display=swap" rel="stylesheet">'
    . '<style>body{font-family:Inter,sans-serif;}</style></head>'
    . '<body style="margin:0;padding:0;background:#f4f6f9;font-family:Inter,Helvetica,Arial,sans-serif;">'
    . '<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f9;padding:32px 16px;">'
    . '<tr><td align="center">'
    . '<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:4px;overflow:hidden;">'
    . '<tr><td style="background:#0A2540;padding:32px 40px;text-align:center;">'
    . '<img src="https://pr3cise.com/assets/img/logo.png" alt="PR3CISE Logo" width="120" style="display:block;margin:0 auto 12px;">'
    . '<div style="font-family:IBM Plex Mono,monospace;font-size:12px;font-weight:500;letter-spacing:2px;color:#B08D57;text-transform:uppercase;">' . $s['tagline'] . '</div>'
    . '</td></tr>'
    . '<tr><td style="padding:40px 40px 32px;">'
    . '<p style="font-family:Montserrat,sans-serif;font-size:1.1rem;color:#0A2540;font-weight:700;margin:0 0 16px;">' . $s['greeting'] . '</p>'
    . '<p style="font-family:Inter,sans-serif;font-size:0.95rem;color:#4a4a4a;line-height:1.75;margin:0 0 10px;">' . $s['p1'] . '</p>'
    . '<p style="font-family:Inter,sans-serif;font-size:0.88rem;color:#777;margin:0 0 18px;">' . $s['p2'] . '</p>'
    . '<table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;font-family:Inter,sans-serif;font-size:0.88rem;margin-bottom:28px;">'
    . '<tr><td ' . $th . '>' . $s['f'][2] . '</td><td ' . $td . '>' . $email . '</td></tr>'
    . $phone_row
    . $scope_row
    . '</table>'
    . '<p style="font-family:Montserrat,sans-serif;font-size:0.95rem;color:#0A2540;font-weight:700;margin:0;">' . $s['thanks'] . '</p>'
    . '</td></tr>'
    . '<tr><td style="background:#f5f2ec;padding:24px 40px;border-top:3px solid #B08D57;text-align:center;">'
    . '<p style="font-family:Inter,sans-serif;font-size:0.75rem;color:#666;margin:0;line-height:1.7;">' . $s['auto'] . '</p>'
    . '<p style="font-family:IBM Plex Mono,monospace;font-size:0.72rem;color:#777;margin:10px 0 0;">&copy; ' . date('Y') . ' Clear Ascend OÜ · pr3cise.com</p>'
    . '</td></tr>'
    . '</table></td></tr></table></body></html>';

// 5. Aviso interno (cuerpo en base64: líneas de 76 caracteres)
$admin_sent = @mail($to, $subject, chunk_split(base64_encode($email_body)), $headers);

if (!$admin_sent) {
    responder(500, [
        "status"  => "error",
        "message" => "Ocurrió un error en el servidor al enviar el correo. Por favor, inténtelo de nuevo más tarde."
    ]);
}

// Confirmación al cliente en su idioma (a la dirección validada), salvo si este
// visitante ya ha enviado más de 5 solicitudes en la última hora
if (!$sin_confirmacion) {
    $conf_headers  = "MIME-Version: 1.0\r\n";
    $conf_headers .= "Content-Type: text/html; charset=UTF-8\r\n";
    $conf_headers .= "Content-Transfer-Encoding: base64\r\n";
    $conf_headers .= "From: PR3CISE <no-reply@pr3cise.com>\r\n";
    $conf_headers .= "Reply-To: contact@pr3cise.com";
    @mail($email_valido, cabecera_utf8($s['subject']), chunk_split(base64_encode($conf_body)), $conf_headers);
}

responder(200, $respuesta_ok);
