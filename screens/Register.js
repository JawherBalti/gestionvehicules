import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Text,
} from "react-native";
import { useLayoutEffect, useState } from "react";
import Input from "../components/Input";
import { Ionicons } from "@expo/vector-icons";
import HeaderLeft from "../components/HeaderLeft";
import HeaderRight from "../components/HeaderRight";
import Spinner from "react-native-loading-spinner-overlay";
import axios from "axios";
import Navbar from "../components/Navbar";
// import { createUserWithCredentials, uploadImage, pickImage } from "../utils";

const Register = ({ navigation }) => {
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "",
      headerStyle: { backgroundColor: "#ffffff" },
      headerLeft: () => <HeaderLeft navigation={navigation} />,
      headerRight: () => <HeaderRight navigation={navigation} />,
    });
  }, []);

  // Fonction d'enregistrement
  const register = async () => {
    // Valider les champs avant envoi
    if (!nom || !prenom || !email || !password) {
      alert("Veuillez remplir tous les champs !");
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append("nom", nom);
    formData.append("prenom", prenom);
    formData.append("email", email);
    formData.append("password", password);

    try {
      const response = await axios.post(
        "https://5dc4-41-62-82-125.ngrok-free.app/gestion_vehicules/api/register.php",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const data = response.data;

      if (data.success) {
        alert("Utilisateur créé avec succès !");
        navigation.navigate("Login"); // Redirection vers l'écran de connexion
      } else {
        alert(data.message || "Erreur lors de l'inscription.");
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("Impossible de se connecter au serveur.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar navigation={navigation} />
      <View style={styles.container}>
        {isLoading && <Spinner visible={isLoading} color="#ffffff" />}
        <Text style={styles.title}>Inscrivez-vous</Text>

        <View style={styles.inputContainer}>
          <Input
            label="Nom"
            icon="person-outline"
            size={20}
            value={nom}
            setValue={setNom}
            placeholder="Entrez votre nom"
            isSecure={false}
            type="text"
          />

          <Input
            label="Prenom"
            icon="person-outline"
            size={20}
            value={prenom}
            setValue={setPrenom}
            placeholder="Entrez votre prenom"
            isSecure={false}
            type="text"
          />

          <Input
            label="Adresse email"
            icon="mail-outline"
            size={20}
            value={email}
            setValue={setEmail}
            placeholder="Entez votre email"
            isSecure={false}
            type="email"
          />

          <Input
            label="Mot de passe"
            icon="key-outline"
            size={20}
            value={password}
            setValue={setPassword}
            placeholder="Entrez votre mot de passe"
            isSecure={true}
            type="password"
            onSubmit={register}
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={register}>
          <Ionicons name="log-in" size={20} color="#fff" />
          <Text style={styles.btnText}>Créer un compte</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.label}>Vous avez déjà un compte? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.link}>Connectez-vous</Text>
          </TouchableOpacity>
        </View>
        <View style={{ height: 90 }} />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    height: Dimensions.get("window").height,
    alignItems: "center",
    justifyContent: "space-evenly",
    backgroundColor: "transparent",
  },
  inputContainer: {
    width: "80%",
  },
  title: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 25,
  },
  label: {
    color: "#fff",
    fontSize: 15,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "80%",
    padding: 10,
    backgroundColor: "#dc3545",
    borderColor: "#dc3545",
    borderWidth: 5,
    borderRadius: 5,
  },
  btnText: {
    marginLeft: 5,
    color: "#fff",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
  },
  link: {
    color: "#1877f2",
  },
  googleButton: {
    backgroundColor: "#ffffff",
  },
  facebookButton: {
    backgroundColor: "#1877f2",
  },
});

export default Register;
