<?php
require_once 'database.php';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Authorization, Content-Type');

// Connexion à la base de données
$conn = getDatabaseConnection();

// Requête pour récupérer tous les véhicules
$sql = "SELECT * FROM vehicules";
$result = $conn->query($sql);

// Vérification des résultats
if ($result->num_rows > 0) {
    $vehicules = [];
    
    // Parcourir les résultats
    while ($row = $result->fetch_assoc()) {
        $vehicules[] = [
            'id' => $row['id_vehicule'],
            'marque' => $row['marque'],
            'modele' => $row['modele'],
            'immatriculation' => $row['immatriculation'],
            'image_url' => $row['image_url'],
        ];
    }

    // Réponse JSON
    echo json_encode([
        'success' => true,
        'data' => $vehicules,
    ]);
} else {
    // Réponse si aucun véhicule trouvé
    echo json_encode([
        'success' => false,
        'message' => 'Aucun véhicule trouvé',
    ]);
}

// Fermer la connexion
$conn->close();
?>
