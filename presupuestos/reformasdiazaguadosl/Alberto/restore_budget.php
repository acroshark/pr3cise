<?php
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['authenticated']) || $_SESSION['authenticated'] !== true) {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'No autorizado']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método no permitido']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$budgetId = preg_replace('/[^a-zA-Z0-9_]/', '', $input['budgetId'] ?? '');
$filename = preg_replace('/[^a-zA-Z0-9_\-.]/', '', $input['filename'] ?? '');

if (!$budgetId || !$filename) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Datos inválidos']);
    exit;
}

// Security: ensure the backup filename belongs to this budgetId
if (strpos($filename, $budgetId . '_') !== 0) {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Acceso denegado']);
    exit;
}

$backupDir  = __DIR__ . '/partidas/backups';
$backupFile = $backupDir . '/' . $filename;
$targetFile = __DIR__ . '/partidas/' . $budgetId . '.json';

if (!file_exists($backupFile)) {
    http_response_code(404);
    echo json_encode(['success' => false, 'message' => 'Copia de seguridad no encontrada']);
    exit;
}

if (!file_exists($targetFile)) {
    http_response_code(404);
    echo json_encode(['success' => false, 'message' => 'Presupuesto principal no encontrado']);
    exit;
}

// Backup current state before restoring
$dateStr = date('Ymd_His');
copy($targetFile, $backupDir . '/' . $budgetId . '_' . $dateStr . '.json');

if (copy($backupFile, $targetFile)) {
    echo json_encode(['success' => true]);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error al restaurar el archivo']);
}
?>
