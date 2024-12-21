import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { RootStackParamList } from '../navigation/AppNavigator';
import color from '../shared/color';
import { userWidth } from '../shared/constants';

type NavItem = {
  image: ImageSourcePropType;
  label: string;
  screenName: keyof RootStackParamList;
};

export default function Navbar() {
  const navigation = useNavigation();

  const navItems: NavItem[] = [
    {
      image: require('../../assets/images/navbar/home.png'),
      label: 'Inicio',
      screenName: 'Home',
    },
    {
      image: require('../../assets/images/navbar/chest.png'),
      label: 'Inventário',
      screenName: 'Inventory',
    },
    {
      image: require('../../assets/images/navbar/profile.png'),
      label: 'Personagem',
      screenName: 'Home',
    },
  ];

  const handleNavigation = (nav: NavItem) => {
    navigation.navigate(nav.screenName as never);
  };

  return (
    <View style={styles.container}>
      {navItems.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.navItem}
          onPress={() => handleNavigation(item)}
        >
          <Image source={item.image} style={styles.image} />
          <Text style={styles.navText}>{item.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: userWidth,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    position: 'absolute',
    bottom: 0,
    backgroundColor: color.white,
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
    fontWeight: '800',
    color: color.primary,
    marginTop: 2,
  },
  image: { width: 25, height: 25 },
});
