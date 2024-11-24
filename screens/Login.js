import { useEffect, useLayoutEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Text,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import HeaderRight from "../components/HeaderRight";
import HeaderLeft from "../components/HeaderLeft";
import Input from "../components/Input";
import Spinner from "react-native-loading-spinner-overlay";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Navbar from "../components/Navbar";

const Login = ({ navigation }) => {
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

  useEffect(() => {
    const checkUserSession = async () => {
      const user = await AsyncStorage.getItem("user");
      if (user) {
        navigation.navigate("Home");
      } else {
        navigation.navigate("Login");
      }
    };
    checkUserSession();
  }, [navigation]);

  const login = async () => {
    if (!email || !password) {
      alert("Veuillez remplir tous les champs !");
      return;
    }

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    setIsLoading(true);

    try {
      const response = await axios.post(
        "https://5dc4-41-62-82-125.ngrok-free.app/gestion_vehicules/api/login.php",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const data = response.data;

      if (data.success) {
        // Stocker les données utilisateur dans AsyncStorage
        await AsyncStorage.setItem("user", JSON.stringify(data.data));
        // Rediriger l'utilisateur
        navigation.navigate("Home");
      } else {
        alert(data.message || "Identifiants incorrects");
      }
    } catch (error) {
      console.error("Erreur lors de la connexion :", error);
      alert("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar navigation={navigation} />
      <View style={styles.container}>
        {isLoading && <Spinner visible={isLoading} color="#ffffff" />}
        <Text style={styles.title}>Connectez-vous</Text>

        <View style={styles.inputContainer}>
          <Input
            label="Adresse email"
            icon="mail-outline"
            size={20}
            value={email}
            setValue={setEmail}
            placeholder="Entrez votre email"
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
            onSubmit={login}
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={login}>
          <Ionicons name="log-in" size={20} color="#fff" />
          <Text style={styles.btnText}>Connexion</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.label}>Vous n'avez pas de compte? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={styles.link}>Créez un</Text>
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
});

export default Login;
