import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RootStackParamList } from '../navigation/AppNavigator';
import color from '../shared/color';
import { userWidth } from '../shared/constants';

type NavItem = {
  icon: React.ComponentType<any>;
  name: string;
  label: string;
  screenName: keyof RootStackParamList;
};

export default function Navbar() {
  const navigation = useNavigation();

  const navItems: NavItem[] = [
    {
      icon: MaterialIcons,
      name: 'inventory',
      label: 'Inventário',
      screenName: 'Home',
    },
    {
      icon: AntDesign,
      name: 'profile',
      label: 'Perfil',
      screenName: 'Home',
    },
    {
      icon: MaterialIcons,
      name: 'view-agenda',
      label: 'Missões',
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
          <item.icon name={item.name} size={24} color="black" />
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
    justifyContent: 'space-evenly',
    position: 'absolute',
    bottom: 45,
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
