import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { useLayoutEffect, useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import HeaderLeft from "../components/HeaderLeft";
import HeaderRight from "../components/HeaderRight";
import Spinner from "react-native-loading-spinner-overlay";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Navbar from "../components/Navbar";

const NettoyageVehicule = ({ navigation, route }) => {
  const [imagesBeforePreview, setImagesBeforePreview] = useState([]);
  const [imagesAfterPreview, setImagesAfterPreview] = useState([]);
  const [imagesBefore, setImagesBefore] = useState([]);
  const [imagesAfter, setImagesAfter] = useState([]);
  const [image, setImage] = useState({
    uri: "",
    type: "",
    name: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  const { id } = route.params;

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "",
      headerStyle: { backgroundColor: "#fff" },
      headerTitleStyle: { color: "#000" },
      headerTintColor: "#000",
      headerRight: () => <HeaderRight navigation={navigation} />,
      headerLeft: () => <HeaderLeft navigation={navigation} />,
    });
  }, [navigation]);

  useEffect(() => {
    const checkUserSession = async () => {
      const user = await AsyncStorage.getItem("user");
      if (user) {
        const userData = JSON.parse(user);
        setUserInfo(userData);
      } else {
        navigation.navigate("Login");
      }
    };
    checkUserSession();
  }, [navigation]);

  const create = async () => {
    if (imagesBefore.length === 0 || imagesAfter.length === 0) {
      alert(
        "Veuillez sélectionner au moins une image ou vidéo avant et après."
      );
      return;
    }

    setIsLoading(true);

    try {
      // Fonction pour uploader un fichier vers Cloudinary
      const uploadToCloudinary = async (file, fileType) => {
        const uploadUrl =
          fileType === "image"
            ? "https://api.cloudinary.com/v1_1/dv1lhvgjr/image/upload"
            : "https://api.cloudinary.com/v1_1/dv1lhvgjr/video/upload";

        const formDataCloudinary = new FormData();
        formDataCloudinary.append("file", {
          uri: file.uri,
          type: file.type,
          name: file.name,
        });
        formDataCloudinary.append("upload_preset", "eiqxfhzq"); // Remplacez par votre `upload_preset` Cloudinary
        formDataCloudinary.append("cloud_name", "dv1lhvgjr");

        const response = await axios.post(uploadUrl, formDataCloudinary, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        return response.data.secure_url; // Retourne l'URL Cloudinary
      };

      // Upload des fichiers "avant"
      const uploadedBefore = await Promise.all(
        imagesBefore.map((file) =>
          uploadToCloudinary(
            file,
            file.type.includes("image") ? "image" : "video"
          )
        )
      );

      // Upload des fichiers "après"
      const uploadedAfter = await Promise.all(
        imagesAfter.map((file) =>
          uploadToCloudinary(
            file,
            file.type.includes("image") ? "image" : "video"
          )
        )
      );

      const formData = new FormData();
      formData.append("id_utilisateur", userInfo.id);
      formData.append("id_vehicule", id);
      // Ajoutez les URLs des fichiers "avant"
      uploadedBefore.forEach((url, index) => {
        formData.append(`media_avant[${index}]`, url);
      });

      // Ajoutez les URLs des fichiers "après"
      uploadedAfter.forEach((url, index) => {
        formData.append(`media_apres[${index}]`, url);
      });

      // Appeler l'API backend pour enregistrer les informations
      const response = await axios.post(
        "https://5dc4-41-62-82-125.ngrok-free.app/gestion_vehicules/api/nettoyages.php",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        alert("Nettoyage enregistré avec succès !");
        navigation.goBack(); // Retour à l'écran précédent
      } else {
        alert("Erreur lors de l'enregistrement : " + response.data.message);
      }
    } catch (error) {
      console.error("Erreur lors de la création :", error);
      alert("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  ///////////////////////////////////////////////////////////////

  const pickImageBefore = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted) {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        aspect: [4, 3],
        quality: 1,
        base64: true,
        allowsEditing: true,
      });

      if (!result.canceled) {
        let imageObj = {
          uri: result.assets[0].uri,
          type: result.assets[0].mimeType || "image/jpeg",
          name: result.assets[0].fileName || "facture_image.jpg",
        };
        // setImage(imageObj);
        setImagesBefore((prev) => [...prev, imageObj]);
        setImagesBeforePreview((prev) => [...prev, result.assets[0].uri]);
      }
    }
  };

  const pickImageAfter = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted) {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        aspect: [4, 3],
        quality: 1,
        base64: true,
        allowsEditing: true,
      });

      if (!result.canceled) {
        let imageObj = {
          uri: result.assets[0].uri,
          type: result.assets[0].mimeType || "image/jpeg",
          name: result.assets[0].fileName || "facture_image.jpg",
        };
        // setImage(imageObj);

        setImagesAfter((prev) => [...prev, imageObj]);
        setImagesAfterPreview((prev) => [...prev, result.assets[0].uri]);
      }
    }
  };

  const goBack = () => {
    navigation.navigate("AffichageVehicules", {
      nextPage: "NettoyageVehicule",
    });
  };

  const removeImageBefore = (id) => {
    setImagesBefore((prev) => prev.filter((_image, index) => index !== id));
    setImagesBeforePreview((prev) =>
      prev.filter((_image, index) => index !== id)
    );
  };

  const removeImageAfter = (id) => {
    setImagesAfter((prev) => prev.filter((_image, index) => index !== id));
    setImagesAfterPreview((prev) =>
      prev.filter((_image, index) => index !== id)
    );
  };

  return (
    <>
      <Navbar navigation={navigation} />
      <ScrollView style={styles.container}>
        <TouchableOpacity style={styles.arrowBack} onPress={goBack}>
          <Ionicons name="arrow-back" size={30} color="#fff" />
          <Text style={styles.arrowBackTitle}>Sélectionner Véhicule</Text>
        </TouchableOpacity>
        {isLoading && <Spinner visible={isLoading} color="#ffffff" />}

        <View style={styles.inputContainer}>
          <Text style={styles.pageTitle}>Nettoyer véhicule</Text>
          <View>
            <Text style={styles.label}>Images ou videos Avant:</Text>
            <TouchableOpacity style={styles.button} onPress={pickImageBefore}>
              <Ionicons name="camera-outline" size={20} color="#fff" />
              <Text style={styles.btnText}>
                Sélectionner une image ou video
              </Text>
            </TouchableOpacity>
            <View style={styles.imageContainer}>
              {imagesBeforePreview.map((uri, idx) => (
                <View key={idx}>
                  <Image source={{ uri }} style={styles.previewImage} />
                  <TouchableOpacity
                    style={styles.deleteIcon}
                    onPress={() => removeImageBefore(idx)}
                  >
                    <Ionicons name="close-outline" size={20} color="#fff" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
          <View>
            <Text style={styles.label}>Images ou videos Après:</Text>
            <TouchableOpacity style={styles.button} onPress={pickImageAfter}>
              <Ionicons name="camera-outline" size={20} color="#fff" />
              <Text style={styles.btnText}>
                Sélectionner une image ou video
              </Text>
            </TouchableOpacity>
            <View style={styles.imageContainer}>
              {imagesAfterPreview.map((uri, idx) => (
                <View key={idx}>
                  <Image source={{ uri }} style={styles.previewImage} />
                  <TouchableOpacity
                    style={styles.deleteIcon}
                    onPress={() => removeImageAfter(idx)}
                  >
                    <Ionicons name="close-outline" size={20} color="#fff" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
          <TouchableOpacity style={styles.button} onPress={create}>
            <Ionicons name="add" size={20} color="#fff" />
            <Text style={styles.btnText}>Ajouter fichiers</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
};

export default NettoyageVehicule;

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
  label: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textShadowColor: "#000",
    textShadowOffset: { width: 5, height: 5 }, // Horizontal and vertical shadow
    textShadowRadius: 5, // Blur radius of the shadow
  },
  inputContainer: {
    padding: 20,
    marginTop: 30,
  },
  imageContainer: {
    position: "relative",
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteIcon: {
    position: "absolute",
    backgroundColor: "black",
    height: 20,
    width: 20,
    borderRadius: 50,
    left: "80%",
    bottom: "80%",
  },
  previewImage: {
    width: 80,
    height: 60,
    borderRadius: 10,
    marginBottom: 5,
  },
  pageTitle: {
    color: "#fff",
    fontSize: 35,
    marginBottom: 30,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    padding: 10,
    backgroundColor: "#dc3545",
    borderColor: "#dc3545",
    borderWidth: 5,
    borderRadius: 5,
    marginBottom: 10,
  },
  btnText: {
    marginLeft: 5,
    color: "#fff",
  },
});
