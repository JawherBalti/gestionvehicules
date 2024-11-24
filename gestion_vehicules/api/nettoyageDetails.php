<?php
require_once 'database.php';
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Vérification des données envoyées
if (!isset($_POST['id_vehicule'])) {
    echo json_encode(['success' => false, 'message' => 'ID du véhicule manquant.']);
    exit;
}

$id_vehicule = $_POST['id_vehicule'];

$conn = getDatabaseConnection();

$sql = "
    SELECT 
        n.id_nettoyage, 
        n.date,
        u.nom,
        u.prenom,
        (SELECT GROUP_CONCAT(url_media) 
         FROM nettoyage_medias 
         WHERE id_nettoyage = n.id_nettoyage AND type_media = 'avant') AS medias_avant,
        (SELECT GROUP_CONCAT(url_media) 
         FROM nettoyage_medias 
         WHERE id_nettoyage = n.id_nettoyage AND type_media = 'apres') AS medias_apres
    FROM 
        nettoyages_vehicules n
    INNER JOIN 
        utilisateurs u ON n.id_utilisateur = u.id_utilisateur
    WHERE 
        n.id_vehicule = ?
    ORDER BY 
        n.date DESC";

$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode(['success' => false, 'message' => 'Erreur lors de la préparation de la requête.']);
    exit;
}

$stmt->bind_param('i', $id_vehicule);

if (!$stmt->execute()) {
    echo json_encode(['success' => false, 'message' => 'Erreur lors de l\'exécution de la requête.']);
    exit;
}

$result = $stmt->get_result();
$cleaning_data = [];

// Extraire les résultats
while ($row = $result->fetch_assoc()) {
    $cleaning_data[] = $row;
}

// Retourner les données en JSON
echo json_encode([
    'success' => true,
    'data' => $cleaning_data
]);

$stmt->close();
$conn->close();
?>
