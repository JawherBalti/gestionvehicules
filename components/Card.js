import { Text, View, TouchableOpacity, StyleSheet, Image } from 'react-native';

const Card = ({ page, nextPage, label, backgroundImage, navigation }) => {
  const goTo = () => {
    nextPage ? navigation.navigate(page, {nextPage}) : navigation.navigate(page);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.cardLabel}>{label}</Text>
      <TouchableOpacity style={styles.cardContainer} onPress={goTo}>
        <View style={styles.card}>
          <View style={styles.cardBackgroundContianer}>
            <Image
              style={styles.cardBackground}
              resizeMode="cover" // Ensures the image covers the container
              source={{
                uri: backgroundImage,
              }}
            />
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default Card;

const styles = StyleSheet.create({
  container: {

  },
  cardContainer: {
    flex: 1,
    alignItems: 'center',
    marginTop: 5,
  },
  card: {
    width: '90%',
    aspectRatio: 3 / 1,
    position: 'relative',
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    // Shadow for iOS
    shadowColor: '#000', // Shadow color
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    // Shadow for Android
    elevation: 5,
  },
  cardBackgroundContianer: {
    flex: 1,
  },
  cardBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  cardLabel: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 10,
    width: '90%',
    textAlign: 'left',
    fontWeight: 'bold',
    textShadowColor: '#000',
    textShadowOffset: { width: 5, height: 5 },
    textShadowRadius: 5,
  },
});
