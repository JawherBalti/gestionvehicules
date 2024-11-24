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
import Input from "../components/Input";
import Spinner from "react-native-loading-spinner-overlay";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Navbar from "../components/Navbar";

const SuiviQuotidien = ({ navigation, route }) => {
  const [kilometrage, setKilometrage] = useState(0);
  const [carburant, setCarburant] = useState(0);
  const [imagePreview, setImagePreview] = useState();
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
    setIsLoading(true);
    try {
      let cloudinaryUrl = "";
      if (image.uri.startsWith("data:image")) {
        const cloudinaryFormData = new FormData();
        cloudinaryFormData.append("file", {
          uri: image.uri,
          type: image.type || "image/jpeg",
          name: image.name || "vehicle_image.jpg",
        });
        cloudinaryFormData.append("upload_preset", "eiqxfhzq");
        cloudinaryFormData.append("cloud_name", "dv1lhvgjr");
        let res = await fetch(
          "https://api.cloudinary.com/v1_1/dv1lhvgjr/image/upload",
          {
            method: "post",
            body: cloudinaryFormData,
          }
        );
        const cloudinaryResponse = await res.json();

        cloudinaryUrl = cloudinaryResponse.url;
      } else if (image.uri) {
        const cloudinaryFormData = new FormData();
        cloudinaryFormData.append("file", {
          uri: image.uri,
          type: image.type || "image/jpeg",
          name: image.name || "vehicle_image.jpg",
        });
        cloudinaryFormData.append("upload_preset", "eiqxfhzq");
        cloudinaryFormData.append("cloud_name", "dv1lhvgjr");
        let cloudinaryAPI =
          "https://api.cloudinary.com/v1_1/dv1lhvgjr/image/upload";
        if (image.type === "video/mp4") {
          cloudinaryAPI =
            "https://api.cloudinary.com/v1_1/dv1lhvgjr/video/upload";
        }
        let res = await fetch(cloudinaryAPI, {
          method: "post",
          body: cloudinaryFormData,
        });
        const cloudinaryResponse = await res.json();
        cloudinaryUrl = cloudinaryResponse.secure_url;
      }

      const formData = new FormData();
      formData.append("kilometrage", kilometrage);
      formData.append("carburant", carburant);
      formData.append("id_utilisateur", userInfo.id);
      formData.append("id_vehicule", id);
      formData.append("image", cloudinaryUrl);

      const response = await axios.post(
        "https://5dc4-41-62-82-125.ngrok-free.app/gestion_vehicules/api/entretiens.php",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        alert("Suivi quotidien effectué");
        setKilometrage(0);
        setCarburant(0);
        setImage(null);
        setImagePreview(null);
      } else {
        alert(response.data.message || "Erreur lors du suivi");
      }
    } catch (error) {
      console.error("Error:", error);
      alert(error);
    } finally {
      setIsLoading(false);
    }
  };

  ///////////////////////////////////////////////////////////////

  const pickImage = async () => {
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
        setImage(imageObj);
        setImagePreview(result.assets[0].uri);
      }
    }
  };

  const goBack = () => {
    navigation.navigate("AffichageVehicules", { nextPage: "SuiviQuotidien" });
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
        <Text style={styles.pageTitle}>Suivi quotidien</Text>
        <Input
          label="Kilometrage"
          icon="speedometer-outline"
          size={20}
          value={kilometrage}
          setValue={setKilometrage}
          placeholder="Entrez la kilometrage"
          isSecure={false}
          keyboardType="numeric"
        />
        <Input
          label="Carburant"
          icon="water-outline"
          size={20}
          value={carburant}
          setValue={setCarburant}
          placeholder="Entrez le carburant"
          isSecure={false}
          keyboardType="numeric"
        />

        <TouchableOpacity style={styles.button} onPress={pickImage}>
          <Ionicons name="camera-outline" size={20} color="#fff" />
          <Text style={styles.btnText}>
            {image?.uri
              ? "Changer le fichier"
              : "Sélectionner une image ou video"}
          </Text>
        </TouchableOpacity>
        <View style={styles.imageContainer}>
          {imagePreview && (
            <View>
              <Image source={{ uri: image?.uri }} style={styles.previewImage} />
            </View>
          )}
        </View>
        <TouchableOpacity style={styles.button} onPress={create}>
          <Ionicons name="add" size={20} color="#fff" />
          <Text style={styles.btnText}>Ajouter suivi</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
    </>
  );
};

export default SuiviQuotidien;

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
  },
  previewImage: {
    width: 200,
    height: 150,
    borderRadius: 20,
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
