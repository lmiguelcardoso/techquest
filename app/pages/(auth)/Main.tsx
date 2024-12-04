import Background from '@/app/components/Background';
import ButtonPrimary from '@/app/components/ButtonPrimary';
import { RootStackParamList } from '@/app/navigation/AppNavigator';
import color from '@/app/shared/color';
import fontSize from '@/app/shared/font-size';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

type NavigationProps = StackNavigationProp<RootStackParamList, 'Main'>;

export default function Main() {
  const navigation = useNavigation<NavigationProps>();

  const handleLogin = () => {
    navigation.navigate('Login');
  };
  const handleRegister = () => {
    navigation.navigate('SignUp');
  };
  return (
    <Background>
      <View style={styles.welcomeContainer}>
        <Text style={{ ...styles.welcomeText }}>Bem vindo!</Text>
        <View style={styles.centralizeImg}>
          <Image source={require('../../../assets/images/icon.png')} />
        </View>
      </View>

      <ButtonPrimary onPress={handleLogin}>
        <Text>Login</Text>
      </ButtonPrimary>
      <ButtonPrimary style={styles.registerBtnMargin} onPress={handleRegister}>
        <Text>Registrar</Text>
      </ButtonPrimary>
    </Background>
  );
}

const styles = StyleSheet.create({
  welcomeContainer: {
    alignItems: 'center',
    flex: 1,
  },
  centralizeImg: {
    flex: 1,
    justifyContent: 'center',
  },
  welcomeText: {
    fontSize: fontSize.primary,
    fontWeight: 'bold',
    textAlign: 'center',
    color: color.white,
  },
  registerBtnMargin: { marginBottom: 30 },
});
