<?php
session_start();
header('Content-Type: application/json');

// Contraseña definida
$correct_password = 'Reformaselmanitas.'; // 11/06/2026 - Actualizado a contraseña del cliente

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
