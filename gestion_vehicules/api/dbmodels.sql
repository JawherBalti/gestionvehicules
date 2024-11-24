USE gestion_vehicules;

-- Table: vehicules
CREATE TABLE IF NOT EXISTS vehicules (
    id_vehicule INT AUTO_INCREMENT PRIMARY KEY,
    marque VARCHAR(100) NOT NULL,
    modele VARCHAR(100) NOT NULL,
    immatriculation VARCHAR(50) NOT NULL UNIQUE,
    image_url VARCHAR(255) NULL,
    date_ajout DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Table: utilisateurs
CREATE TABLE IF NOT EXISTS utilisateurs (
    id_utilisateur INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100),
    prenom VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    mot_de_passe VARCHAR(255),
    role ENUM('chauffeur', 'admin') NOT NULL
);

-- Table: entretiens_quotidiens
CREATE TABLE IF NOT EXISTS entretiens_quotidiens (
    id_entretien INT AUTO_INCREMENT PRIMARY KEY,
    id_utilisateur INT,
    id_vehicule INT,
    kilometrage INT,
    carburant_utilisé FLOAT,
    date DATE,
    photos_videos_kilometrage TEXT,
    FOREIGN KEY (id_utilisateur) REFERENCES utilisateurs(id_utilisateur),
    FOREIGN KEY (id_vehicule) REFERENCES vehicules(id_vehicule)
);

-- Table: achats_carburant
CREATE TABLE IF NOT EXISTS achats_carburant (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_vehicule INT NOT NULL,
    id_utilisateur INT NOT NULL,
    montant DECIMAL(10, 2) NOT NULL,
    litres DECIMAL(10, 2) NOT NULL,
    facture VARCHAR(255) NOT NULL,
    date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_vehicule) REFERENCES vehicules(id_vehicule),
    FOREIGN KEY (id_utilisateur) REFERENCES utilisateurs(id_utilisateur)
);

-- Table: nettoyages_vehicules
CREATE TABLE IF NOT EXISTS nettoyages_vehicules (
    id_nettoyage INT AUTO_INCREMENT PRIMARY KEY,
    id_vehicule INT NOT NULL,
    id_utilisateur INT NOT NULL,
    date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_vehicule) REFERENCES vehicules(id_vehicule),
    FOREIGN KEY (id_utilisateur) REFERENCES utilisateurs(id_utilisateur)
);

-- Table: nettoyage_medias
CREATE TABLE IF NOT EXISTS nettoyage_medias (
    id_media INT AUTO_INCREMENT PRIMARY KEY,
    id_nettoyage INT NOT NULL,
    type_media ENUM('avant', 'apres') NOT NULL,
    url_media VARCHAR(255) NOT NULL,
    FOREIGN KEY (id_nettoyage) REFERENCES nettoyages_vehicules(id_nettoyage) ON DELETE CASCADE
);
