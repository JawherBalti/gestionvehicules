<?php
require_once 'database.php';
session_start();

// Vérifier si l'utilisateur est authentifié
// if (!isset($_SESSION['user_id'])) {
//     echo json_encode(['success' => false, 'message' => 'Utilisateur non authentifie']);
//     exit;
// }
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");


if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id_utilisateur = $_POST['id_utilisateur'];
    $id_vehicule = $_POST['id_vehicule'];
    $kilometrage = $_POST['kilometrage'];
    $carburant = (float) $_POST['carburant'];
    $imageUrl = $_POST['image'] ?? null;

    $conn = getDatabaseConnection();
    $stmt = $conn->prepare("
        INSERT INTO entretiens_quotidiens (id_utilisateur, id_vehicule, kilometrage, carburant_utilisé, date, photos_videos_kilometrage) 
        VALUES (?, ?, ?, ?, NOW(), ?)
    ");
    $stmt->bind_param("iiids", $id_utilisateur, $id_vehicule, $kilometrage, $carburant, $imageUrl);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Entretien ajouté avec succès']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Erreur lors de l\'ajout']);
    }

    $conn->close();
}
?>