import { StyleSheet, View } from "react-native";
import HeaderLeft from "./HeaderLeft";
import HeaderRight from "./HeaderRight";

const Navbar = ({navigation}) => {
  return (
    <View style={styles.navbar}>
      <HeaderLeft navigation={navigation}/>
      <HeaderRight navigation={navigation}/>
    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    flexDirection: "row",
    justifyContent:"space-around",
    alignItems:"center",
    backgroundColor:"white",
    marginTop:0,
    height:90,
    paddingTop:40
  },
});

export default Navbar;
