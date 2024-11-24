import axios from 'axios';
import { useEffect, useState } from 'react';
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { Video } from "expo-av";
import Spinner from "react-native-loading-spinner-overlay";
import { Ionicons } from "@expo/vector-icons";
import Navbar from "../components/Navbar";

const NettoyageDetails = ({ navigation, route }) => {
  const { id, marque, modele, immatriculation, image_url } = route.params;

  const [nettoyages, setNettoyages] = useState([]);
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
          "https://5dc4-41-62-82-125.ngrok-free.app/gestion_vehicules/api/nettoyageDetails.php",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );



        if (response.data.success) {
          setNettoyages(response.data.data);
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

  const gotTo = (page) => {
    navigation.navigate(page);
  };

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
<Spinner visible={loading} color="#ffffff" />
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
          <Text style={styles.pageTitle}>Nettoyage Détails</Text>
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

        {nettoyages.map((nettoyage) => (
          <View key={nettoyage.id_nettoyage} style={styles.nettoyageContainer}>
            <Text style={styles.label}>
              Nettoyage effectué par: {nettoyage.nom} {nettoyage.prenom}
            </Text>
            <Text style={styles.label}>Date: {nettoyage.date}</Text>

            <Text style={styles.subLabel}>Médias Avant:</Text>
            <ScrollView horizontal style={styles.mediaScroll}>
              {nettoyage.medias_avant.split(',').map((media) => renderMedia(media))}
            </ScrollView>

            <Text style={styles.subLabel}>Médias Après:</Text>
            <ScrollView horizontal style={styles.mediaScroll}>
              {nettoyage.medias_apres.split(',').map((media) => renderMedia(media))}
            </ScrollView>
          </View>
        ))}
      </ScrollView>
    </>
  );
};

export default NettoyageDetails;

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
  nettoyageContainer: {
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
  btnText: {
    marginLeft: 5,
    color: "#fff",
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
});
