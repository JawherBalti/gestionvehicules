import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  FlatList,
} from "react-native";
import { useLayoutEffect, useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import HeaderLeft from "../components/HeaderLeft";
import HeaderRight from "../components/HeaderRight";
import Spinner from "react-native-loading-spinner-overlay";
import axios from "axios";
import Navbar from "../components/Navbar";

const AffichageVehicules = ({ navigation, route }) => {
  const [vehiculesList, setVehiculesList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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
    const fetchVehicules = async () => {
      try {
        const response = await axios.get(
          "https://5dc4-41-62-82-125.ngrok-free.app/gestion_vehicules/api/affichageVehicules.php"
        );
        setVehiculesList(response.data.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des véhicules:", error);
        alert(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVehicules();
  }, []);

  const goHome = () => {
    navigation.navigate("Home");
  };

  const handlePress = (id, marque, modele, immatriculation, image_url) => {
    if (route?.params?.nextPage &&  route.params.nextPage !=="Vehicule") {
      navigation.navigate(route.params.nextPage, { id });
    } else if(route?.params?.nextPage &&  route.params.nextPage ==="Vehicule") {
      navigation.navigate(route.params.nextPage, { id, marque, modele, immatriculation, image_url });
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => handlePress(item.id, item.marque, item.modele, item.immatriculation, item.image_url)}>
      <Image
        source={{
          uri: item.image_url,
        }}
        style={styles.image}
      />
      <View style={styles.details}>
        <Text style={styles.marque}>Marque: {item.marque}</Text>
        <Text style={styles.modele}>Modèle: {item.modele}</Text>
        <Text style={styles.immatriculation}>
          Immatricule: {item.immatriculation}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      <Navbar navigation={navigation} />
      <View style={styles.container}>
        <TouchableOpacity style={styles.arrowBack} onPress={goHome}>
          <Ionicons name="arrow-back" size={30} color="#fff" />
          <Text style={styles.arrowBackTitle}>Accueil</Text>
        </TouchableOpacity>
        {isLoading && <Spinner visible={isLoading} color="#ffffff" />}

        <View style={styles.inputContainer}>
          <Text style={styles.pageTitle}>Sélectionner une véhicule</Text>
        </View>

        <ScrollView
          style={styles.contentContainer}
          contentContainerStyle={styles.scrollContainer}
        >
          <FlatList
            data={vehiculesList}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.listContainer}
            scrollEnabled={false} // Disable FlatList scrolling, use parent ScrollView
          />
        </ScrollView>
      </View>
    </>
  );
};

export default AffichageVehicules;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  contentContainer: {
    flex: 1,
  },
  scrollContainer: {
    padding: 10,
    paddingBottom: 40,
  },
  listContainer: {
    gap: 10,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#000000a5",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 10,
    padding: 10,
  },
  marque: {
    color: "#fff",
  },
  modele: {
    color: "#fff",
  },
  immatriculation: {
    color: "#fff",
  },
  arrowBack: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 10,
    marginBottom: 10,
  },
  arrowBackTitle: {
    color: "#fff",
    fontSize: 25,
  },
  inputContainer: {
    padding: 20,
    paddingBottom: 0,
    marginTop: 30,
  },
  image: {
    width: 100,
    height: 80,
    borderRadius: 10,
  },
  pageTitle: {
    color: "#fff",
    fontSize: 35,
    marginBottom: 30,
  },
});
