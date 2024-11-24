<?php
require_once 'config.php';

function getDatabaseConnection() {
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);

    if ($conn->connect_error) {
        die("Erreur de connexion : " . $conn->connect_error);
    }

    return $conn;
}
?>