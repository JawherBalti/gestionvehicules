<?php
require_once 'database.php';
session_start();

// Configuration CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Vérifier si l'utilisateur est authentifié
// if (!isset($_SESSION['user_id'])) {
//     echo json_encode(['success' => false, 'message' => 'Utilisateur non authentifié']);
//     exit;
// }

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id_vehicule = $_POST['id_vehicule'];

    if (!$id_vehicule) {
        echo json_encode(['success' => false, 'message' => 'id_vehicule est requis']);
        exit;
    }

    try {
        $conn = getDatabaseConnection();
        
        $date_du_jour = date('Y-m-d');

        // Préparer et exécuter la requête pour récupérer les entretiens
        $stmt = $conn->prepare("
        SELECT 
            a.id,
            a.montant,
            a.litres,
            a.date,
            a.facture,
            u.id_utilisateur,
            u.nom,
            u.prenom
        FROM 
            achats_carburant a
        INNER JOIN 
            utilisateurs u
        ON 
            a.id_utilisateur = u.id_utilisateur
        WHERE 
            a.id_vehicule = ?
        ORDER BY 
            a.date DESC
    ");
    
        $stmt->bind_param("i", $id_vehicule);
        $stmt->execute();
        $result = $stmt->get_result();

        $entretiens = [];
        while ($row = $result->fetch_assoc()) {
            $entretiens[] = $row;
        }

        echo json_encode(['success' => true, 'data' => $entretiens]);
        
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => 'Erreur lors de la récupération des achats: ' . $e->getMessage()]);
    } finally {
        $conn->close();
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Méthode non autorisée']);
}
?>
