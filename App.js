import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { ImageBackground } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './screens/Login';
import Register from './screens/Register';
import Home from './screens/Home';
import Vehicule from './screens/Vehicule';
import AjoutVehicule from './screens/AjoutVehicule';
import AchatCarburant from './screens/AchatCarburant';
import AffichageVehicules from './screens/AffichageVehicules';
import SuiviQuotidien from './screens/SuiviQuotidien';
import NettoyageVehicule from './screens/NettoyageVehicule';
import SuiviDetails from './screens/SuiviDetails';
import AchatDetails from './screens/AchatDetails';
import NettoyageDetails from './screens/NettoyageDetails';
import { AuthProvider } from './hooks/useAuth';

const Stack = createNativeStackNavigator();

const myTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'transparent',
  },
};

const globalScreenOptions = {
  headerStyle: { backgroundColor: '#00f' },
  headerTitleStyle: { color: 'white' },
  headerTintColor: 'white',
  headerTitleAlign: 'center',
  headerShown: false
};

function App() {
  return (
    <AuthProvider>
    <NavigationContainer theme={myTheme}>
        <ImageBackground
          style={{ flexGrow: 1 }}
          source={{
            uri: 'https://bsmedia.business-standard.com/_media/bs/img/article/2023-12/31/full/1704044517-9976.jpg?im=FeatureCrop,size=(826,465)',
          }}
          resizeMode="cover">
          <LinearGradient
            style={{ flexGrow: 1 }}
            colors={['#000000e6', '#aaaaaa20', '#000000e6']}>
            <Stack.Navigator
              initialRouteName="Home"
              screenOptions={globalScreenOptions}>
              <Stack.Screen name="Login" component={Login} />
              <Stack.Screen name="Register" component={Register} />
              <Stack.Screen name="Home" component={Home} />
              <Stack.Screen name="Vehicule" component={Vehicule} />
              <Stack.Screen name="AjoutVehicule" component={AjoutVehicule} />
              <Stack.Screen name="AchatCarburant" component={AchatCarburant} />
              <Stack.Screen
                name="AffichageVehicules"
                component={AffichageVehicules}
              />
              <Stack.Screen name="SuiviQuotidien" component={SuiviQuotidien} />
              <Stack.Screen name="NettoyageVehicule" component={NettoyageVehicule} />
              <Stack.Screen name="SuiviDetails" component={SuiviDetails} />
              <Stack.Screen name="AchatDetails" component={AchatDetails} />
              <Stack.Screen name="NettoyageDetails" component={NettoyageDetails} />
            </Stack.Navigator>
          </LinearGradient>
        </ImageBackground>
    </NavigationContainer>
    </AuthProvider>

  );
}

export default App;
