<?php
require_once 'database.php';
session_start();

 //Configuration CORS
 header("Access-Control-Allow-Origin: *");
 header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
 header("Access-Control-Allow-Headers: Content-Type, Authorization");
 

// Vérifier si l'utilisateur est authentifié
// if (!isset($_SESSION['user_id'])) {
//     echo json_encode(['success' => false, 'message' => 'Utilisateur non authentifié']);
//     exit;
// }

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id_utilisateur = $_POST['id_utilisateur'];
    $id_vehicule = $_POST['id_vehicule'];
    $montant = $_POST['montant'];
    $litres = $_POST['litres'];
    $imageUrl = $_POST['facture'] ?? null;

        $conn = getDatabaseConnection();
        $stmt = $conn->prepare("
            INSERT INTO achats_carburant (id_utilisateur, id_vehicule, montant, litres, facture, date) 
            VALUES (?, ?, ?, ?, ?, NOW())
        ");
        $stmt->bind_param("iidss", $id_utilisateur, $id_vehicule, $montant, $litres, $imageUrl);

        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Achat enregistré avec succès']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Erreur lors de l\'ajout']);
        }

        $conn->close();

}
?>
