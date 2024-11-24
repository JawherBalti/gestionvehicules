<?php
require_once 'database.php';
session_start();

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Vérifier si la requête est POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Récupérer les données envoyées via POST
    $userId = $_POST['id_utilisateur'] ?? null;
    $vehiculeId = $_POST['id_vehicule'] ?? null;

    // Validation des données
    if (!$vehiculeId) {
        echo json_encode(['success' => false, 'message' => 'ID véhicule obligatoire']);
        exit;
    }

    // Connexion à la base de données
    $conn = getDatabaseConnection();
    $stmt = $conn->prepare("
        INSERT INTO nettoyages_vehicules (id_vehicule, id_utilisateur) 
        VALUES (?, ?)
    ");
    $stmt->bind_param("ii", $vehiculeId, $userId);

    if (!$stmt->execute()) {
        echo json_encode(['success' => false, 'message' => 'Erreur lors de l\'ajout du nettoyage']);
        $conn->close();
        exit;
    }

    $nettoyageId = $stmt->insert_id;

    // Initialisation des tableaux pour les erreurs et les médias enregistrés
    $errors = [];
    $successMedia = [];

    // Fonction pour enregistrer les URLs dans la base de données
    function saveMediaUrls($urls, $typeMedia, $nettoyageId, $conn, &$successMedia, &$errors) {
        foreach ($urls as $url) {
            $stmt = $conn->prepare("
                INSERT INTO nettoyage_medias (id_nettoyage, type_media, url_media) 
                VALUES (?, ?, ?)
            ");
            $stmt->bind_param("iss", $nettoyageId, $typeMedia, $url);

            if ($stmt->execute()) {
                $successMedia[] = $url;
            } else {
                $errors[] = "Erreur lors de l'enregistrement du média avec l'URL $url.";
            }
        }
    }

    // Traiter les médias avant nettoyage
    if (isset($_POST['media_avant'])) {
        // Les données de `media_avant` sont envoyées sous forme de tableau JSON encodé ou texte brut
        $mediaAvantData = $_POST['media_avant'];
        $mediaAvantUrls = is_string($mediaAvantData) ? json_decode($mediaAvantData, true) : $mediaAvantData;

        if (is_array($mediaAvantUrls)) {
            saveMediaUrls($mediaAvantUrls, 'avant', $nettoyageId, $conn, $successMedia, $errors);
        } else {
            $errors[] = "Les URLs des médias avant sont invalides.";
        }
    }

    // Traiter les médias après nettoyage
    if (isset($_POST['media_apres'])) {
        $mediaApresData = $_POST['media_apres'];
        $mediaApresUrls = is_string($mediaApresData) ? json_decode($mediaApresData, true) : $mediaApresData;

        if (is_array($mediaApresUrls)) {
            saveMediaUrls($mediaApresUrls, 'apres', $nettoyageId, $conn, $successMedia, $errors);
        } else {
            $errors[] = "Les URLs des médias après sont invalides.";
        }
    }

    // Fermer la connexion à la base de données
    $conn->close();

    // Réponse finale
    echo json_encode([
        'success' => empty($errors),
        'message' => empty($errors) ? 'Nettoyage ajouté avec succès' : 'Certaines erreurs sont survenues',
        'data' => [
            'nettoyage_id' => $nettoyageId,
            'media' => $successMedia
        ],
        'errors' => $errors
    ]);
}
?>
