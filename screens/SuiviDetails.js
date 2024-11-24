import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Video } from "expo-av";
import Navbar from "../components/Navbar";
import axios from "axios";

const SuiviDetails = ({ navigation, route }) => {
  const { id, marque, modele, immatriculation, image_url } = route.params;

  const [entretiens, setEntretiens] = useState([]);
  const [loading, setLoading] = useState(true);

  const goHome = () => {
    navigation.navigate("AffichageVehicules", { nextPage: "Vehicule" });
  };

  useEffect(() => {
    const fetchDetails = async () => {
      const formData = new FormData();
      formData.append("id_vehicule", Number(id));

      try {
        const response = await axios.post(
          "https://5dc4-41-62-82-125.ngrok-free.app/gestion_vehicules/api/suiviDetails.php",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.data.success) {
          setEntretiens(response.data.data);
        } else {
          console.error("Erreur dans la réponse:", response.data.message);
        }
      } catch (error) {
        console.error("Erreur de récupération:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, []);

  const renderMedia = (mediaUrl) => {
    const isVideo = /\.(mp4|mov|avi|webm)$/i.test(mediaUrl);

    if (isVideo) {
      return (
        <Video
          key={mediaUrl}
          source={{ uri: mediaUrl }}
          style={styles.media}
          useNativeControls
          resizeMode="contain"
          isLooping
        />
      );
    }

    return <Image key={mediaUrl} source={{ uri: mediaUrl }} style={styles.media} />;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Chargement des données...</Text>
      </View>
    );
  }

  return (
    <>
      <Navbar navigation={navigation} />

      <ScrollView style={styles.container}>
        <TouchableOpacity style={styles.arrowBack} onPress={goHome}>
          <Ionicons name="arrow-back" size={30} color="#fff" />
          <Text style={styles.arrowBackTitle}>Sélectionner véhicule</Text>
        </TouchableOpacity>

        <View style={styles.inputContainer}>
          <Text style={styles.pageTitle}>Suivi Détails</Text>
          <View style={styles.imageContainer}>
            <Image
              source={{
                uri: image_url,
              }}
              style={styles.image}
            />
          </View>
          <Text style={styles.label}>Marque: {marque}</Text>
          <Text style={styles.label}>Modèle: {modele}</Text>
          <Text style={styles.label}>Immatriculation: {immatriculation}</Text>
        </View>

        {entretiens.length > 0 ? (
          entretiens.map((entretien) => (
            <View key={entretien.id_entretien} style={styles.entretienContainer}>
              <Text style={styles.label}>
                Entretien par: {entretien.nom} {entretien.prenom}
              </Text>
              <Text style={styles.label}>Date: {entretien.date}</Text>
              <Text style={styles.label}>Kilométrage: {entretien.kilometrage} km</Text>
              <Text style={styles.label}>Carburant utilisé: {entretien.carburant_utilisé} litres</Text>

              <Text style={styles.subLabel}>Médias Associés:</Text>
              <ScrollView horizontal style={styles.mediaScroll}>
                {entretien.photos_videos_kilometrage
                  .split(",")
                  .map((media) => renderMedia(media))}
              </ScrollView>
            </View>
          ))
        ) : (
          <Text style={styles.noDataText}>Aucun entretien disponible pour ce véhicule.</Text>
        )}
      </ScrollView>
    </>
  );
};

export default SuiviDetails;

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  arrowBack: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 10,
  },
  arrowBackTitle: {
    color: "#fff",
    fontSize: 25,
  },
  inputContainer: {
    padding: 20,
    marginTop: 30,
  },
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  image: {
    width: "100%",
    height: 150,
    borderRadius: 10,
  },
  label: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subLabel: {
    color: "#ddd",
    fontSize: 16,
    marginTop: 10,
  },
  entretienContainer: {
    backgroundColor: "#000000a5",
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
  },
  mediaScroll: {
    marginVertical: 10,
  },
  media: {
    width: 200,
    height: 150,
    borderRadius: 20,
    marginRight: 10,
  },
  pageTitle: {
    color: "#fff",
    fontSize: 35,
    marginBottom: 30,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#fff",
    fontSize: 20,
  },
  noDataText: {
    color: "#ddd",
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
  },
});