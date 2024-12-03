import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import color from '../shared/color';
import fontSize from '../shared/font-size';

type ButtonPrimaryProps = {
  onPress: (...any: any) => any;
};

export default function ButtonPrimary({ onPress }: ButtonPrimaryProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
      onPress={onPress}
    >
      <Text style={styles.loginBtnLabel}>Continuar</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  buttonPressed: {
    backgroundColor: '#3d004c',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    opacity: 0.9,
  },
  loginBtnLabel: {
    color: color.white,
    fontSize: fontSize.secondary,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#580068',
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
    borderColor: '#fff',
    borderWidth: 1.25,
  },
});
