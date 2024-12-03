import { supabase } from '@/lib/supabase';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Background from '../components/Background';
import { useAuth } from '../context/AuthContext';
import { NavigationProps } from '../navigation/AppNavigator';
import color from '../shared/color';
import { userHeight, userWidth } from '../shared/constants';
import fontSize from '../shared/font-size';

type Props = NavigationProps<'Login'>;

export default function Login({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { handleLogin } = useAuth();

  GoogleSignin.configure({
    scopes: ['https://www.googleapis.com/auth/drive.readonly'],
    webClientId:
      '8990435403-feukvau6njeahl8s4tp5ovepjlr3plmh.apps.googleusercontent.com',
  });

  const handleSignInWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      if (userInfo.data?.idToken) {
        const { data, error } = await supabase.auth.signInWithIdToken({
          provider: 'google',
          token: userInfo.data.idToken,
        });
        console.log(error, data);
      } else {
        throw new Error('no ID token present!');
      }
    } catch (e: any) {
      console.log(e);
    }
  };

  const handleLoginWithEmail = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Preencha todos os campos!');
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        Alert.alert('Erro no login', error.message);
      } else {
        handleLogin(data.user, data.session);
        Alert.alert('Sucesso', 'Login realizado com sucesso!');
        navigation.navigate('Home');
      }
    } catch (e: any) {
      console.error(e);
      Alert.alert('Erro inesperado', 'Tente novamente mais tarde.');
    }
  };

  return (
    <Background>
      <View style={styles.welcomeContainer}>
        <Text style={{ ...styles.welcomeText, marginTop: 20 }}>Bem vindo!</Text>
        <Image source={require('../../assets/images/icon.png')} />
      </View>
      <Text
        style={{
          ...styles.welcomeText,
          textAlign: 'center',
          justifyContent: 'flex-end',
          marginBottom: 20,
        }}
      >
        Entre na sua conta
      </Text>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Digite seu e-mail"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          placeholderTextColor="#FFF"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Digite sua senha"
          value={password}
          onChangeText={setPassword}
          placeholderTextColor="#FFF"
          secureTextEntry
        />
        <Pressable style={styles.button} onPress={handleLoginWithEmail}>
          <Text style={styles.loginBtnLabel}>Continuar</Text>
        </Pressable>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
          }}
        >
          <View style={styles.dividerContainer}>
            <View style={styles.line} />
            <Text style={styles.text}>ou continue com</Text>
            <View style={styles.line} />
          </View>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.button_social}>
              <FontAwesome name="facebook-f" size={24} color="blue" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button_social}
              onPress={handleSignInWithGoogle}
            >
              <AntDesign name="google" size={24} color="red" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.button_social}>
              <AntDesign name="apple1" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    justifyContent: 'center',
  },
  welcomeContainer: {
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: fontSize.primary,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
  },
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 11,
    paddingVertical: 14,
    width: userWidth - 40,
    height: 53,
    backgroundColor: color.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
    borderRadius: 10,
    color: '#FFFFFF',
    marginBottom: 20,
  },
  button: {
    backgroundColor: color.primary,
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
    borderWidth: 1.5,
  },
  loginBtnLabel: {
    color: color.white,
    fontSize: fontSize.secondary,
    fontWeight: 'bold',
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: userHeight,
  },

  icon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    width: '95%',
    alignSelf: 'center',
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#d3d3d3',
    marginHorizontal: 10,
  },
  text: {
    fontSize: 16,
    color: '#fff',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 10,
  },
  button_social: {
    width: userWidth / 3 - 35,
    height: 56,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    marginHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});
