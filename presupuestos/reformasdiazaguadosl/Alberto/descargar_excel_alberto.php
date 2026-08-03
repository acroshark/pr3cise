<?php
// 11/06/2026 - Endpoint PHP para generación y descarga de Excel "Proyecto Alberto".
// Autentifica sesión, ejecuta Python para regenerar desde el JSON actualizado, y sirve el .xlsx.

session_start();

// Verificar autenticación
if (!isset($_SESSION['authenticated']) || $_SESSION['authenticated'] !== true) {
    http_response_code(403);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'No autorizado. Accede primero al presupuesto.']);
    exit;
}

$scriptDir   = __DIR__;
$pyScript    = $scriptDir . DIRECTORY_SEPARATOR . 'generar_excel_alberto.py';
$staticExcel = $scriptDir . DIRECTORY_SEPARATOR . 'Presupuesto_Alberto.xlsx';
$tempFile    = $scriptDir . DIRECTORY_SEPARATOR . 'tmp_' . uniqid() . '.xlsx';

// Ejecutar Python para regenerar el Excel desde el JSON actualizado
$fileToServe = null;
$pyError     = '';

foreach (['python', 'python3', 'py'] as $cmd) {
    $exec = $cmd . ' "' . $pyScript . '" "' . $tempFile . '" 2>&1';
    $out  = [];
    $code = 0;
    exec($exec, $out, $code);
    if ($code === 0 && file_exists($tempFile) && filesize($tempFile) > 0) {
        $fileToServe = $tempFile;
        break;
    }
    $pyError = implode("\n", $out);
}

// Fallback: servir el Excel estático ya existente si Python no está disponible
if ($fileToServe === null) {
    if (file_exists($staticExcel)) {
        $fileToServe = $staticExcel;
    } else {
        http_response_code(500);
        header('Content-Type: text/plain; charset=utf-8');
        echo "Error al generar el Excel.\n";
        echo "Python no disponible o error en el script:\n" . $pyError;
        exit;
    }
}

// Servir el archivo como descarga
$downloadName = 'Presupuesto_Alberto_ReformasDiazAguado.xlsx';
header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
header('Content-Disposition: attachment; filename="' . $downloadName . '"');
header('Content-Length: ' . filesize($fileToServe));
header('Cache-Control: no-cache, no-store, must-revalidate');
header('Pragma: no-cache');
header('Expires: 0');

readfile($fileToServe);

// Limpiar temporal
if ($fileToServe === $tempFile && file_exists($tempFile)) {
    unlink($tempFile);
}
exit;
?>
