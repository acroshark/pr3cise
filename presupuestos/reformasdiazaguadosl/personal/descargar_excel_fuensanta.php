<?php
// 16/05/2026 00:32 - Creado endpoint de descarga Excel para presupuesto Fuensanta
// Basado en descargar_excel_juandeborbon.php, adaptado a generar_excel_fuensanta.py

session_start();
if (!isset($_SESSION['authenticated']) || $_SESSION['authenticated'] !== true) {
    http_response_code(403);
    exit('Acceso no autorizado');
}

$scriptPath = __DIR__ . DIRECTORY_SEPARATOR . 'generar_excel_fuensanta.py';

$outputFile = sys_get_temp_dir() . DIRECTORY_SEPARATOR . 'presupuesto_fuensanta_' . uniqid() . '.xlsx';

$pythonCmd = null;
foreach (['python3', 'python3.12', 'python3.11', 'python3.10', 'python3.9', 'python3.8', 'python3.7', 'python3.6', 'python', 'py'] as $cmd) {
    $test = @shell_exec($cmd . ' --version 2>&1');
    if ($test && preg_match('/Python (\d+)\.(\d+)/', $test, $m)) {
        $major = (int)$m[1];
        $minor = (int)$m[2];
        if ($major > 3 || ($major === 3 && $minor >= 6)) {
            $pythonCmd = $cmd;
            break;
        }
    }
}
if (!$pythonCmd) {
    exit('Error: No se encontró Python 3.6+ en el servidor.');
}

$checkXlsx = @shell_exec($pythonCmd . ' -c "import xlsxwriter" 2>&1');
if ($checkXlsx !== '') {
    @shell_exec($pythonCmd . ' -m pip install xlsxwriter --user --quiet 2>&1');
}

$cmd    = $pythonCmd . ' ' . escapeshellarg($scriptPath) . ' ' . escapeshellarg($outputFile) . ' 2>&1';
$output = []; $code = 0;
exec($cmd, $output, $code);

if ($code !== 0 || !file_exists($outputFile)) {
    exit('Error al generar Excel (código ' . $code . '):<br>' . nl2br(htmlspecialchars(implode("\n", $output))));
}

$filename = 'Presupuesto_Fuensanta_' . date('Ymd') . '.xlsx';
header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
header('Content-Disposition: attachment; filename="' . $filename . '"');
header('Cache-Control: max-age=0');
header('Content-Length: ' . filesize($outputFile));
readfile($outputFile);
@unlink($outputFile);
exit;
