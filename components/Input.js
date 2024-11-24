import { View, Text, StyleSheet, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Input = ({
  label,
  icon,
  size,
  value,
  setValue,
  placeholder,
  isSecure,
  type,
  keyboardType,
  onSubmit,
}) => {
  return (
    <View>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.input}>
        <Ionicons name={icon} size={size} color="#000" />
        <TextInput
          value={value}
          onChangeText={(text) => setValue(text)}
          placeholder={placeholder}
          secureTextEntry={isSecure}
          type={type}
          placeholderTextColor="grey"
          onSubmitEditing={onSubmit}
          style={styles.textInput}
          keyboardType={keyboardType? keyboardType : ""}
        />
      </View>
    </View>
  );
};

export default Input;

const styles = StyleSheet.create({
  label: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textShadowColor: '#000',
    textShadowOffset: { width: 5, height: 5 }, // Horizontal and vertical shadow
    textShadowRadius: 5, // Blur radius of the shadow
  },

  input: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffffc0',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    borderBottomWidth: 2,
  },

  textInput: {
    color: '#000',
    marginLeft: 5,
    width: '90%',
    fontSize: 12,
    height: '100%',
    borderWidth: 0,
  },
});
