import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { useLayoutEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import HeaderLeft from "../components/HeaderLeft";
import HeaderRight from "../components/HeaderRight";
import Input from "../components/Input";
import Spinner from "react-native-loading-spinner-overlay";
import Navbar from "../components/Navbar";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";

const AjoutVehicule = ({ navigation }) => {
  const [marque, setMarque] = useState("");
  const [modele, setModele] = useState("");
  const [immatriculation, setImmatriculation] = useState("");
  const [imagePreview, setImagePreview] = useState();
  const [image, setImage] = useState({
    uri: "",
    type: "",
    name: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  // useLayoutEffect(() => {
  //   navigation.setOptions({
  //     title: '',
  //     headerStyle: { backgroundColor: '#fff' },
  //     headerTitleStyle: { color: '#000' },
  //     headerTintColor: '#000',
  //     headerRight: () => <HeaderRight navigation={navigation} />,
  //     headerLeft: () => <HeaderLeft navigation={navigation} />,
  //   });
  // }, []);

  const create = async () => {
    setIsLoading(true);

    try {
      let cloudinaryUrl = "";

      if (image.uri.startsWith("data:image")) {
        const base64Image = image.uri.split(",")[1];

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

        let res = await fetch(
          "https://api.cloudinary.com/v1_1/dv1lhvgjr/image/upload",
          {
            method: "post",
            body: cloudinaryFormData,
          }
        );
        const cloudinaryResponse = await res.json();
        cloudinaryUrl = cloudinaryResponse.url;
      }

      // Proceed with other form submissions
      const formData = new FormData();
      formData.append("marque", marque);
      formData.append("modele", modele);
      formData.append("immatriculation", immatriculation);
      formData.append("image", cloudinaryUrl);
      const response = await axios.post(
        "https://5dc4-41-62-82-125.ngrok-free.app/gestion_vehicules/api/ajoutVehicule.php",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        alert("Véhicule ajouté avec succès");
        setMarque("");
        setModele("");
        setImmatriculation("");
        setImage(null);
        setImagePreview(null);
      } else {
        alert(response.data.message || "Erreur lors de l'ajout du véhicule");
      }
    } catch (error) {
      if (error.response) {
        console.error("Error Response:", error.response.data);
        alert(`Error: ${error.response.data.error.message}`);
      } else if (error.request) {
        console.error("No Response:", error.request);
        alert("Error: No response from the server");
      } else {
        console.error("Error:", error.message);
        alert(`Error: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted) {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        aspect: [4, 3],
        quality: 1,
        base64: true,
        allowsEditing: true,
      });

      if (!result.canceled) {
        let imageObj = {
          uri: result.assets[0].uri,
          type: result.assets[0].mimeType || "image/jpeg", // Replace with detected MIME type
          name: result.assets[0].fileName || "vehicle_image.jpg", // Ensure a valid filename
        };
        setImage(imageObj);
        setImagePreview(result.assets[0].uri);
      }
    }
  };

  const goHome = () => {
    navigation.navigate("Home");
  };

  return (
    <>
      <Navbar navigation={navigation} />

      <ScrollView style={styles.container}>
        <TouchableOpacity style={styles.arrowBack} onPress={goHome}>
          <Ionicons name="arrow-back" size={30} color="#fff" />
          <Text style={styles.arrowBackTitle}>Acceuil</Text>
        </TouchableOpacity>
        {isLoading && <Spinner visible={isLoading} color="#ffffff" />}

        <View style={styles.inputContainer}>
          <Text style={styles.pageTitle}>Ajouter une véhicule</Text>
          <Input
            label="Marque"
            icon="car-outline"
            size={20}
            value={marque}
            setValue={setMarque}
            placeholder="Entrez la marque"
            isSecure={false}
            type="text"
          />
          <Input
            label="Modele"
            icon="car-sport-outline"
            size={20}
            value={modele}
            setValue={setModele}
            placeholder="Entrez le modele"
            isSecure={false}
            type="text"
          />

          <Input
            label="Immatriculation"
            icon="list-outline"
            size={20}
            value={immatriculation}
            setValue={setImmatriculation}
            placeholder="Entez l'immatriculation"
            isSecure={false}
            type="text"
            onSubmit={create}
          />

          <TouchableOpacity style={styles.button} onPress={pickImage}>
            <Ionicons name="camera-outline" size={20} color="#fff" />
            <Text style={styles.btnText}>
              {image ? "Changer l'image" : "Sélectionner une image"}
            </Text>
          </TouchableOpacity>
          <View style={styles.imageContainer}>
            {imagePreview && (
              <View>
                <Image
                  source={{ uri: image?.uri }}
                  style={styles.previewImage}
                />
              </View>
            )}
          </View>
          <TouchableOpacity style={styles.button} onPress={create}>
            <Ionicons name="add" size={20} color="#fff" />
            <Text style={styles.btnText}>Ajouter</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
};

export default AjoutVehicule;

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
