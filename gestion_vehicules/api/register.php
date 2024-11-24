<?php
require_once 'database.php';

//Configuration CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nom = $_POST['nom'] ?? '';
    $prenom = $_POST['prenom'] ?? '';
    $email = $_POST['email'] ?? '';
    $password = $_POST['password'] ?? '';

    // Vérifications de base
    if (empty($nom) || empty($prenom) || empty($email) || empty($password)) {
        echo json_encode(['success' => false, 'message' => 'Tous les champs sont obligatoires']);
        exit;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['success' => false, 'message' => 'Adresse email invalide']);
        exit;
    }

    $conn = getDatabaseConnection();

    // Vérifier si l'email existe déjà
    $stmt = $conn->prepare("SELECT * FROM utilisateurs WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        echo json_encode(['success' => false, 'message' => 'Cet email est dejà utilise']);
        exit;
    }

    // Vérifier si c'est le premier utilisateur
    $stmt = $conn->prepare("SELECT COUNT(*) AS total FROM utilisateurs");
    $stmt->execute();
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();
    $totalUsers = $row['total'];

    $role = ($totalUsers === 0) ? 'admin' : 'chauffeur'; // Premier utilisateur => admin

    // Hacher le mot de passe
    $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

    // Insérer le nouvel utilisateur
    $stmt = $conn->prepare("
        INSERT INTO utilisateurs (nom, prenom, email, mot_de_passe, role) 
        VALUES (?, ?, ?, ?, ?)
    ");
    $stmt->bind_param("sssss", $nom, $prenom, $email, $hashedPassword, $role);

    if ($stmt->execute()) {
        echo json_encode([
            'success' => true,
            'message' => 'Utilisateur cree avec succes',
            'data' => [
                'id' => $stmt->insert_id,
                'nom' => $nom,
                'prenom' => $prenom,
                'email' => $email,
                'role' => $role
            ]
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Erreur lors de la création de l\'utilisateur']);
    }

    $conn->close();
}
?>
