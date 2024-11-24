import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Navbar from "../components/Navbar";

const Vehicule = ({ navigation, route }) => {
  const { id, marque, modele, immatriculation, image_url } = route.params;

  const goHome = () => {
    navigation.navigate("AffichageVehicules", { nextPage: "Vehicule" });
  };

  const gotTo = (page) => {
navigation.navigate(page, {id, marque, modele, immatriculation, image_url})
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
          <Text style={styles.pageTitle}>Details véhicule</Text>
          <View style={styles.imageContainer}>
            <Image
              source={{
                uri: image_url,
              }}
              style={styles.image}
            />
          </View>
          <Text style={styles.label}>Marque: {marque}</Text>
          <Text style={styles.label}>Modele: {modele}</Text>
          <Text style={styles.label}>Immatriculation: {immatriculation}</Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={()=>gotTo("SuiviDetails")}>
          <Text style={styles.btnText}>Historique du suivi quotidien</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={()=>gotTo("NettoyageDetails")}>
          <Text style={styles.btnText}>Historique du nettoyage</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={()=>gotTo("AchatDetails")}>
          <Text style={styles.btnText}>Historique d'achat carburant</Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
};

export default Vehicule;

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
    textShadowColor: "#000",
    textShadowOffset: { width: 5, height: 5 }, // Horizontal and vertical shadow
    textShadowRadius: 5, // Blur radius of the shadow
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
