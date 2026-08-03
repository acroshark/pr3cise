<?php
// Evitar la caché para JSON y HTML
$path = pathinfo($_SERVER['SCRIPT_FILENAME']);
if (isset($path['extension'])) {
    if (in_array(strtolower($path['extension']), ['json', 'html', 'js', 'css'])) {
        header('Cache-Control: no-cache, no-store, must-revalidate'); // HTTP 1.1.
        header('Pragma: no-cache'); // HTTP 1.0.
        header('Expires: 0'); // Proxies.
    }
}

// Devuelve falso para servir el archivo tal cual (después de añadir los headers)
return false;
