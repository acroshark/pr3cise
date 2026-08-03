<?php
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['authenticated']) || $_SESSION['authenticated'] !== true) {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'No autorizado']);
    exit;
}

$budgetId = preg_replace('/[^a-zA-Z0-9_]/', '', $_GET['budgetId'] ?? '');
if (!$budgetId) {
    echo json_encode(['success' => false, 'message' => 'budgetId requerido']);
    exit;
}

$backupDir = __DIR__ . '/partidas/backups';
if (!is_dir($backupDir)) {
    echo json_encode(['success' => true, 'backups' => []]);
    exit;
}

$files = glob($backupDir . '/' . $budgetId . '_*.json');
if ($files === false) $files = [];
rsort($files); // newest first

$months = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];

$backups = [];
foreach ($files as $file) {
    $basename = basename($file, '.json');
    if (preg_match('/_(\d{4})(\d{2})(\d{2})_(\d{2})(\d{2})(\d{2})$/', $basename, $m)) {
        $day   = (int)$m[3];
        $month = $months[(int)$m[2] - 1];
        $year  = $m[1];
        $time  = $m[4] . ':' . $m[5] . ':' . $m[6];
        $backups[] = [
            'filename' => basename($file),
            'label'    => "Copia del $day de $month de $year a las $time"
        ];
    }
}

echo json_encode(['success' => true, 'backups' => $backups]);
?>
