<?php
// 1. Configuración de Destinatario
/* 2025-04-26 01:00 | Updated destination to contact@pr3cise.com */
$to = 'contact@pr3cise.com';

// 5. Lógica de Respuesta - Establecer cabecera JSON anticipadamente
header('Content-Type: application/json');

// Permitir solicitudes solo si son POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // 4. Seguridad: Función de limpieza de strings
    function sanitize_input($data) {
        $data = trim($data);
        $data = stripslashes($data);
        $data = htmlspecialchars($data, ENT_QUOTES, 'UTF-8');
        return $data;
    }

    // 2. Captura de Datos
    $nombre        = isset($_POST['nombre']) ? sanitize_input($_POST['nombre']) : '';
    $empresa       = isset($_POST['empresa']) ? sanitize_input($_POST['empresa']) : '';
    $email         = isset($_POST['email']) ? sanitize_input($_POST['email']) : '';
    $telefono      = isset($_POST['telefono']) ? sanitize_input($_POST['telefono']) : '';
    $tipo_proyecto = isset($_POST['tipo_proyecto']) ? sanitize_input($_POST['tipo_proyecto']) : 'No especificado';
    $mensaje       = isset($_POST['mensaje']) ? sanitize_input($_POST['mensaje']) : '';
    /* 2025-04-26 01:55 | Read page language for multilingual confirmation email */
    $user_lang  = isset($_POST['user_lang']) ? preg_replace('/[^a-z]/', '', $_POST['user_lang']) : 'es';
    $user_lang  = in_array($user_lang, ['es', 'en', 'de', 'fr']) ? $user_lang : 'es';
    $lang_names = ['es' => 'Español', 'en' => 'English', 'de' => 'Deutsch', 'fr' => 'Français'];
    $lang_label = $lang_names[$user_lang];

    // Validaciones
    if (empty($nombre) || empty($empresa) || empty($email) || empty($tipo_proyecto) || empty($mensaje)) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Por favor, complete todos los campos obligatorios."]);
        exit;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Formato de correo electrónico inválido."]);
        exit;
    }

    // 3. Cabeceras Profesionales
    $subject = "Nueva Solicitud (" . $lang_label . ") — " . $empresa;
    $headers  = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type: text/html; charset=UTF-8" . "\r\n";
    $headers .= "From: form-robot@pr3cise.com" . "\r\n";
    $headers .= "Reply-To: " . $email . "\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();

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

    /* Multilingual confirmation strings — 4 languages */
    $conf = [
        'es' => [
            'tagline'  => 'Mediciones y Estimación de Costes',
            'subject'  => 'Hemos recibido su solicitud — Pr3cise',
            'greeting' => "Estimado/a {$nombre},",
            'p1'       => 'Hemos recibido correctamente su solicitud. Revisaremos el alcance y le responderemos habitualmente en menos de 24 horas laborables con el precio cerrado por proyecto y la fecha de entrega. Si desea enviar planos o documentación técnica adicional, puede hacerlo directamente a contact@pr3cise.com.',
            'p2'       => 'A continuación encontrará un resumen de la información enviada:',
            'f'        => ['Nombre','Empresa','Email','Teléfono','Tipo de proyecto','Mensaje'],
            'thanks'   => 'Gracias por confiar en Pr3cise.',
            'auto'     => 'Este es un mensaje automático generado por el formulario de contacto de <strong>pr3cise.com</strong>. Para enviar planos o consultas adicionales escríbanos a <a href="mailto:contact@pr3cise.com" style="color:#B08D57;">contact@pr3cise.com</a>.',
        ],
        'en' => [
            'tagline'  => 'Construction Cost Estimating & Takeoffs',
            'subject'  => 'We have received your request — Pr3cise',
            'greeting' => "Dear {$nombre},",
            'p1'       => 'We have received your estimate request. We will review your scope and reply within one business day with a fixed project fee and a confirmed delivery date. If you still need to share drawings or specifications, you can send files or a cloud link directly to contact@pr3cise.com.',
            'p2'       => 'Below is a summary of the information you submitted:',
            'f'        => ['Name','Company','Email','Phone','Project type','Message'],
            'thanks'   => 'Thank you for trusting Pr3cise.',
            'auto'     => 'This is an automated confirmation from <strong>pr3cise.com</strong>. To send drawings, addenda or enquiries write directly to <a href="mailto:contact@pr3cise.com" style="color:#B08D57;">contact@pr3cise.com</a>.',
        ],
        'de' => [
            'tagline'  => 'Baukostenschätzung & Mengenermittlung',
            'subject'  => 'Wir haben Ihre Anfrage erhalten — Pr3cise',
            'greeting' => "Sehr geehrte/r {$nombre},",
            'p1'       => 'Wir haben Ihre Angebotsanfrage erfolgreich erhalten. Wir prüfen den Umfang und melden uns in der Regel innerhalb eines Werktags mit einem schriftlichen Festpreis und Liefertermin. Pläne oder Cloud-Links können Sie jederzeit direkt an contact@pr3cise.com senden.',
            'p2'       => 'Nachfolgend finden Sie eine Zusammenfassung Ihrer übermittelten Daten:',
            'f'        => ['Name','Unternehmen','E-Mail','Telefon','Projektart','Nachricht'],
            'thanks'   => 'Vielen Dank für Ihr Vertrauen in Pr3cise.',
            'auto'     => 'Dies ist eine automatische Bestätigung von <strong>pr3cise.com</strong>. Für Pläne oder Rückfragen schreiben Sie bitte direkt an <a href="mailto:contact@pr3cise.com" style="color:#B08D57;">contact@pr3cise.com</a>.',
        ],
        'fr' => [
            'tagline'  => 'Estimation des Coûts & Métrés',
            'subject'  => 'Nous avons reçu votre demande — Pr3cise',
            'greeting' => "Cher/Chère {$nombre},",
            'p1'       => "Nous avons bien reçu votre demande de chiffrage. Nous reviendrons vers vous généralement sous 24 heures ouvrées avec un prix forfaitaire et une date de livraison. Vous pouvez également envoyer vos plans ou liens de téléchargement directement à contact@pr3cise.com.",
            'p2'       => 'Vous trouverez ci-dessous un récapitulatif des informations envoyées :',
            'f'        => ['Nom','Entreprise','E-mail','Téléphone','Type de projet','Message'],
            'thanks'   => 'Merci de faire confiance à Pr3cise.',
            'auto'     => 'Confirmation automatique générée par <strong>pr3cise.com</strong>. Pour transmettre vos plans ou toute question, écrivez-nous à <a href="mailto:contact@pr3cise.com" style="color:#B08D57;">contact@pr3cise.com</a>.',
        ],
    ];
    $s = $conf[$user_lang];

    // Shared inline-style helpers for confirmation email table cells
    $th     = 'style="background:#0A2540;color:#B08D57;font-weight:700;padding:10px 14px;font-size:0.72rem;text-transform:uppercase;letter-spacing:1px;"';
    $th_top = 'style="background:#0A2540;color:#B08D57;font-weight:700;padding:10px 14px;font-size:0.72rem;text-transform:uppercase;letter-spacing:1px;vertical-align:top;"';
    $td     = 'style="padding:10px 14px;border-bottom:1px solid #eee;color:#333;"';
    $td_top = 'style="padding:10px 14px;border-bottom:1px solid #eee;color:#333;vertical-align:top;"';

    $phone_row = $telefono
        ? '<tr><td ' . $th . '>' . $s['f'][3] . '</td><td ' . $td . '>' . $telefono . '</td></tr>'
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
        . '<tr><td ' . $th . '>' . $s['f'][0] . '</td><td ' . $td . '>' . $nombre . '</td></tr>'
        . '<tr><td ' . $th . '>' . $s['f'][1] . '</td><td ' . $td . '>' . $empresa . '</td></tr>'
        . '<tr><td ' . $th . '>' . $s['f'][2] . '</td><td ' . $td . '>' . $email . '</td></tr>'
        . $phone_row
        . '<tr><td ' . $th . '>' . $s['f'][4] . '</td><td ' . $td . '>' . $tipo_proyecto . '</td></tr>'
        . '<tr><td ' . $th_top . '>' . $s['f'][5] . '</td><td ' . $td_top . '>' . nl2br($mensaje) . '</td></tr>'
        . '</table>'
        . '<p style="font-family:Montserrat,sans-serif;font-size:0.95rem;color:#0A2540;font-weight:700;margin:0;">' . $s['thanks'] . '</p>'
        . '</td></tr>'
        . '<tr><td style="background:#f5f2ec;padding:24px 40px;border-top:3px solid #B08D57;text-align:center;">'
        . '<p style="font-family:Inter,sans-serif;font-size:0.75rem;color:#666;margin:0;line-height:1.7;">' . $s['auto'] . '</p>'
        . '<p style="font-family:IBM Plex Mono,monospace;font-size:0.72rem;color:#777;margin:10px 0 0;">&copy; ' . date('Y') . ' Clear Ascend OÜ · pr3cise.com</p>'
        . '</td></tr>'
        . '</table></td></tr></table></body></html>';

    // 5. Send admin notification
    $admin_sent = @mail($to, $subject, $email_body, $headers);

    // Send branded confirmation to customer in their language
    $conf_headers  = "MIME-Version: 1.0\r\n";
    $conf_headers .= "Content-type: text/html; charset=UTF-8\r\n";
    $conf_headers .= "From: PR3CISE <no-reply@pr3cise.com>\r\n";
    $conf_headers .= "Reply-To: contact@pr3cise.com\r\n";
    $conf_headers .= "X-Mailer: PHP/" . phpversion();
    @mail($email, $s['subject'], $conf_body, $conf_headers);

    if ($admin_sent) {
        http_response_code(200);
        echo json_encode([
            "status"  => "success",
            "message" => "Solicitud enviada. Recibirá respuesta en menos de 24h."
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            "status"  => "error",
            "message" => "Ocurrió un error en el servidor al enviar el correo. Por favor, inténtelo de nuevo más tarde."
        ]);
    }

} else {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Método HTTP no permitido."]);
}
?>
