<?php
session_start();
header('Content-Type: application/json');

// Contraseña definida
$correct_password = 'D3mo'; // 19/05/2026 17:25 - Actualizado de Ib1za a D3mo

// Verificar estado de autenticación
if (isset($_GET['check_auth'])) {
    if (isset($_SESSION['authenticated']) && $_SESSION['authenticated'] === true) {
        echo json_encode(['authenticated' => true]);
    } else {
        echo json_encode(['authenticated' => false]);
    }
    exit;
}

// Intentar login
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $password = $input['password'] ?? '';

    if ($password === $correct_password) {
        $_SESSION['authenticated'] = true;
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Contraseña incorrecta']);
    }
    exit;
}
?>
