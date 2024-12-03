import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet } from 'react-native';

export default function Background({ children }: any) {
  return (
    <LinearGradient
      colors={['#D700FF', '#83009B']}
      start={{ x: 0.9, y: 0.15 }}
      end={{ x: 0.25, y: 0.55 }}
      style={styles.container}
    >
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
