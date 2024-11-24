import React, { useState, useEffect, useCallback } from 'react';
import { ScrollView, StyleSheet } from "react-native";
import Card from "../components/Card";
import Navbar from "../components/Navbar";
import { useAuth } from '../hooks/useAuth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Home = ({ navigation }) => {
  const { userInfo: globalUserInfo, login, logout } = useAuth();
  const [localUserInfo, setLocalUserInfo] = useState(globalUserInfo);

  const refetchUserInfo = useCallback(async () => {
    try {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        setLocalUserInfo(JSON.parse(storedUser));
      } else {
        setLocalUserInfo(null);
      }
    } catch (error) {
      console.error('Error refetching user info:', error);
      setLocalUserInfo(null);
    }
  }, []);

  useEffect(() => {
    refetchUserInfo();
  }, [globalUserInfo, refetchUserInfo]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      refetchUserInfo();
    });

    return unsubscribe;
  }, [navigation, refetchUserInfo]);

  useEffect(() => {
    return () => {
      console.log('Home component unmounted');
    };
  }, []);

  if (!localUserInfo) {
    navigation.navigate("Login");
    return null;
  }

  return (
    <>
    <Navbar navigation={navigation}/>
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {localUserInfo?.role === "admin" && (
        <Card
          navigation={navigation}
          page="AjoutVehicule"
          nextPage=""
          label="Ajout de véhicules"
          backgroundImage="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSeiFJd3GbcJfDUZqIR6DQ89iERs0wPQIzTPw&s"
        />
      )}
      {localUserInfo?.role === "admin" && (
        <Card
          navigation={navigation}
          page="AffichageVehicules"
          nextPage="Vehicule"
          label="Mes vehicules"
          backgroundImage="https://media.product.which.co.uk/prod/images/original/222f4a4449ce-best-cars-inline2.jpg"
        />
      )}
      <Card
        navigation={navigation}
        page="AffichageVehicules"
        nextPage="SuiviQuotidien"
        label="Suivi quotidien"
        backgroundImage="https://voiture.kidioui.fr/image/lexique/consommation.jpg"
      />
      <Card
        navigation={navigation}
        page="AffichageVehicules"
        nextPage="NettoyageVehicule"
        label="Nettoyage véhicule"
        backgroundImage="https://sf1.autoplus.fr/wp-content/uploads/autoplus/2021/05/85-nettoyage-printemps-10-adobe-stock.jpg"
      />
      <Card
        navigation={navigation}
        page="AffichageVehicules"
        nextPage="AchatCarburant"
        label="Achat carburant"
        backgroundImage="https://www.carte-carburant-guide.be/wp-content/uploads/sites/2/2024/08/station-recharge-voiture-1024x538.jpg"
      />
    </ScrollView>
    </>

  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 10,
    paddingBottom: 20, // Ensures space for the last element
  },
});
