import { Image, StyleSheet, View } from "react-native";
import { StatusBar } from "expo-status-bar";

const HeaderLeft = ({ navigation }) => {


  return (
    <View style={styles.headerLeft}>
      <StatusBar style="dark" />
        <Image
          style={{
            width: 120,
            height: 45,
          }}
            source={{
              uri: "https://wbcc.fr/wp-content/uploads/2023/07/Fichier-8@100x-8.png"
            }}
        />
    </View>
  );
};

export default HeaderLeft;

const styles = StyleSheet.create({
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    color: "#001e2b",
  },
});