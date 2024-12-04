import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import fontSize from '../shared/font-size';

export default function Header() {
  return (
    <View style={styles.container}>
      <View style={styles.containerGreetings}>
        <Text style={{ fontSize: fontSize.secondary }}>Olá</Text>
        <Text style={{ fontSize: fontSize.secondary }}>Viajante</Text>
      </View>

      <Image
        style={styles.profilePhoto}
        source={{
          uri: 'https://media.tenor.com/ni8G-dHQ7VkAAAAM/owm-midget.gif',
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  containerGreetings: {
    display: 'flex',
    flexDirection: 'column',
  },
  profilePhoto: {
    width: 75,
    height: 75,
    borderRadius: 30,
  },
});
