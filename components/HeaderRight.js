import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useState, useEffect } from "react";
import Spinner from "react-native-loading-spinner-overlay";
import AsyncStorage from "@react-native-async-storage/async-storage";

const HeaderRight = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [userInfo, setUserInfo] = useState({
    id: 0,
    nom: "",
    prenom: "",
    role: "",
  });

  useEffect(() => {
    const checkUserSession = async () => {
      const user = await AsyncStorage.getItem("user");
      if (user) {
        const userData = JSON.parse(user);
        setUserInfo(userData);
      }
    };
    checkUserSession();
  }, [navigation]);

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("user");
      navigation.navigate("Login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <View style={styles.headerRight}>
      {isLoading && <Spinner visible={isLoading} color="#ffffff" />}
      {userInfo.id ? (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity
            style={styles.logout}
            activeOpacity={0.5}
            onPress={logout}
          >
            <Text>Déconnexion</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.text}>Connexion</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={styles.text}>S'inscrire</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default HeaderRight;

const styles = StyleSheet.create({
  headerRight: {
    flexDirection: "row",
    marginRight: 10,
  },
  text: {
    color: "#000",
    marginLeft: 10,
  },
  logout: {
  },
});
