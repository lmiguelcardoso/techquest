import { Ionicons } from '@expo/vector-icons'; // Para o ícone de seta
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

type ButtonReturnProps = {
  onPress: () => void;
};

export default function ButtonReturn({ onPress }: ButtonReturnProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
      onPress={onPress}
    >
      <View style={styles.iconContainer}>
        <Ionicons name="chevron-back" size={24} color="white" />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    backgroundColor: '#580068',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
    position: 'absolute',
    marginTop: 22,
    marginLeft: 20,
  },
  buttonPressed: {
    opacity: 0.7,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
