<?php
session_start();
header('Content-Type: application/json');

// Check authentication
if (!isset($_SESSION['authenticated']) || $_SESSION['authenticated'] !== true) {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'No autorizado']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input || !isset($input['budgetId']) || !isset($input['budgetData'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Datos inválidos']);
        exit;
    }

    $budgetId = preg_replace('/[^a-zA-Z0-9_]/', '', $input['budgetId']); // sanitize
    $budgetData = $input['budgetData'];
    
    $partidasDir = __DIR__ . '/partidas';
    $targetFile = $partidasDir . '/' . $budgetId . '.json';
    
    if (!file_exists($targetFile)) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Presupuesto no encontrado']);
        exit;
    }

    // Prepare backup directory
    $backupDir = $partidasDir . '/backups';
    if (!is_dir($backupDir)) {
        mkdir($backupDir, 0777, true);
    }

    // Create backup filename: budgetId_YYYYMMDD_HHMMSS.json
    $dateStr = date('Ymd_His');
    $backupFile = $backupDir . '/' . $budgetId . '_' . $dateStr . '.json';

    // Copy current to backup
    if (!copy($targetFile, $backupFile)) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Error al crear backup']);
        exit;
    }

    // Format JSON with nice indentation
    $jsonContent = json_encode($budgetData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    
    // Save new data
    if (file_put_contents($targetFile, $jsonContent) !== false) {
        echo json_encode(['success' => true, 'message' => 'Guardado correctamente']);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Error al escribir el archivo']);
    }
} else {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método no permitido']);
}
?>
