import Background from '@/app/components/Background';
import ButtonPrimary from '@/app/components/ButtonPrimary';
import ButtonReturn from '@/app/components/ButtonReturn';
import { useAuth } from '@/app/context/AuthContext';
import { NavigationProps } from '@/app/navigation/AppNavigator';
import color from '@/app/shared/color';
import fontSize from '@/app/shared/font-size';
import { supabase } from '@/lib/supabase';
import { AntDesign, Entypo } from '@expo/vector-icons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

type Props = NavigationProps<'Login'>;

export default function Login({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { handleLogin } = useAuth();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  GoogleSignin.configure({
    scopes: ['email', 'profile'],
    webClientId:
      '8990435403-feukvau6njeahl8s4tp5ovepjlr3plmh.apps.googleusercontent.com',
  });

  const handleSignInWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const idToken = (await GoogleSignin.getTokens()).idToken;

      if (idToken) {
        const { data, error } = await supabase.auth.signInWithIdToken({
          provider: 'google',
          token: idToken,
        });

        if (error) {
          Alert.alert('Erro no login', error.message);
        } else {
          handleLogin(data.user, data.session);
          Alert.alert('Sucesso', 'Login com Google realizado com sucesso!');
          navigation.navigate('Home');
        }
      } else {
        throw new Error('Token de autenticação do Google não encontrado.');
      }
    } catch (error) {
      Alert.alert('Erro inesperado ao autenticar com Google.');
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

  const handleReturn = () => {
    navigation.navigate('Main');
  };

  const redirectToRecoverPassword = () => {
    navigation.navigate('RecoverPassword');
  };

  return (
    <Background>
      <ButtonReturn onPress={handleReturn} />
      <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeText}>Bem vindo!</Text>
        <Image source={require('../../../assets/images/icon.png')} />
      </View>
      <Text style={[styles.welcomeText, styles.subtitleContainer]}>
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
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Digite sua senha"
            value={password}
            onChangeText={setPassword}
            placeholderTextColor="#FFF"
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity
            onPress={togglePasswordVisibility}
            style={styles.eyeIconContainer}
          >
            <Entypo
              name={showPassword ? 'eye-with-line' : 'eye'}
              size={18}
              color="#fff"
            />
          </TouchableOpacity>
        </View>
        <ButtonPrimary onPress={handleLoginWithEmail}>
          <Text>Continuar</Text>
        </ButtonPrimary>
        <View style={styles.alignContent}>
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
              <Image
                style={styles.googleIcon}
                source={{
                  uri: 'https://img.icons8.com/color/48/google-logo.png',
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.button_social}>
              <AntDesign name="apple1" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity onPress={redirectToRecoverPassword}>
          <Text style={styles.forgetPasswordLabel}>Esqueceu sua senha?</Text>
        </TouchableOpacity>
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
    color: color.white,
  },
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 11,
    paddingVertical: 14,
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
    height: 56,
    width: 56,
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
  googleIcon: { width: 25, height: 25 },
  alignContent: {
    flex: 1,
    alignItems: 'center',
  },
  subtitleContainer: {
    textAlign: 'center',
    justifyContent: 'flex-end',
    marginBottom: 20,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
    paddingHorizontal: 11,
    paddingVertical: 14,
    height: 53,
    backgroundColor: color.primary,
    borderRadius: 10,
    marginBottom: 20,
  },
  passwordInput: {
    flex: 1,
    color: '#FFFFFF',
  },
  eyeIconContainer: {
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  forgetPasswordLabel: {
    textDecorationLine: 'underline',
    color: color.white,
    fontSize: fontSize.text,
    textAlign: 'center',
  },
});
