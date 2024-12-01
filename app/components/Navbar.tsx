import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import color from '../shared/color';
import { userWidth } from '../shared/constants';

export default function Navbar() {
  return (
    <View style={styles.container}>
      <View style={styles.navItem}>
        <MaterialIcons name="inventory" size={24} color="black" />
        <Text style={styles.navText}>Inventário</Text>
      </View>
      <View style={styles.navItem}>
        <AntDesign name="profile" size={24} color="black" />
        <Text style={styles.navText}>Perfil</Text>
      </View>
      <View style={styles.navItem}>
        <MaterialIcons name="view-agenda" size={24} color="black" />
        <Text style={styles.navText}>Missões</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: userWidth,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    position: 'absolute',
    bottom: 25,
    backgroundColor: color.primary,
    borderRadius: 10,
    height: 60,
    alignItems: 'center',
  },
  navItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  navText: {
    fontSize: 12,
    color: 'black',
    marginTop: 4,
  },
});
