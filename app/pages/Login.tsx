import { supabase } from '@/lib/supabase';
import AntDesign from '@expo/vector-icons/AntDesign';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import React, { useState } from 'react';
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { NavigationProps } from '../navigation/AppNavigator';
import color from '../shared/color';
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
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Bem vindo ao TechQuest</Text>

      <TextInput
        style={styles.input}
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Pressable style={styles.button} onPress={handleLoginWithEmail}>
        <Text style={styles.loginBtnLabel}>Login com E-mail</Text>
      </Pressable>

      <Pressable onPress={handleSignInWithGoogle}>
        <View
          style={{
            padding: 10,
            width: 'auto',
            borderRadius: 10,
            alignSelf: 'center',
            backgroundColor: color.primary,
          }}
        >
          <AntDesign name="google" size={24} color="white" />
        </View>
      </Pressable>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
        }}
      >
        <Pressable
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('SignUp')}
        >
          <Text style={styles.secondaryButtonText}>Criar Conta</Text>
        </Pressable>
        <Pressable style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>Esqueci a senha</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: color.white,
    padding: 20,
    flex: 1,
    justifyContent: 'center',
  },
  welcomeText: {
    fontSize: fontSize.primary,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: color.primary,
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: fontSize.secondary,
  },
  button: {
    backgroundColor: color.primary,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 15,
  },
  loginBtnLabel: {
    color: color.white,
    fontSize: fontSize.secondary,
    fontWeight: 'bold',
  },
  secondaryButton: {
    padding: 10,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: color.primary,
    fontSize: fontSize.secondary,
    textDecorationLine: 'underline',
  },
});
