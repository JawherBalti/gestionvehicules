<?php
require_once 'database.php';
 session_start();

 //Configuration CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Vérifier si la requête est POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $marque = $_POST['marque'] ?? '';
    $modele = $_POST['modele'] ?? '';
    $immatriculation = $_POST['immatriculation'] ?? '';
    $imageUrl = $_POST['image'] ?? null; // Retrieve base64 string

    // Validation des données
    if (empty($marque) || empty($modele) || empty($immatriculation)) {
        echo json_encode(['success' => false, 'message' => 'Tous les champs sont obligatoires']);
        exit;
    }

    $conn = getDatabaseConnection();

    // Vérifier si l'immatriculation est unique
    $checkStmt = $conn->prepare("SELECT id_vehicule FROM vehicules WHERE immatriculation = ?");
    $checkStmt->bind_param("s", $immatriculation);
    $checkStmt->execute();
    $checkStmt->store_result();

    if ($checkStmt->num_rows > 0) {
        echo json_encode(['success' => false, 'message' => "L'immatriculation existe déjà. Veuillez en utiliser une autre."]);
        $checkStmt->close();
        $conn->close();
        exit;
    }
    $checkStmt->close();

    // Insérer le véhicule dans la base

    $stmt = $conn->prepare("
        INSERT INTO vehicules (marque, modele, immatriculation, image_url) 
        VALUES (?, ?, ?, ?)
    ");
    $stmt->bind_param("ssss", $marque, $modele, $immatriculation, $imageUrl);

    if ($stmt->execute()) {
        echo json_encode([
            'success' => true,
            'message' => 'Véhicule ajouté avec succès',
            'data' => [
                'id' => $stmt->insert_id,
                'marque' => $marque,
                'modele' => $modele,
                'immatriculation' => $immatriculation,
                'image_url' => $imageUrl
            ]
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Erreur lors de l\'ajout du véhicule']);
    }

    $conn->close();
}
?>
