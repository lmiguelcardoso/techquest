import Background from '@/app/components/Background';
import ButtonPrimary from '@/app/components/ButtonPrimary';
import ButtonReturn from '@/app/components/ButtonReturn';
import { useAuth } from '@/app/context/AuthContext';
import { NavigationProps } from '@/app/navigation/AppNavigator';
import color from '@/app/shared/color';
import fontSize from '@/app/shared/font-size';
import { supabase } from '@/lib/supabase';
import { Entypo } from '@expo/vector-icons';
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
    borderRadius: 10,
    color: '#FFFFFF',
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
  subtitleContainer: {
    textAlign: 'center',
    marginBottom: 20,
  },
  eyeIconContainer: {
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
