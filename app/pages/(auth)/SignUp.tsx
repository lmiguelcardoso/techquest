import Background from '@/app/components/Background';
import ButtonPrimary from '@/app/components/ButtonPrimary';
import ButtonReturn from '@/app/components/ButtonReturn';
import { NavigationProps } from '@/app/navigation/AppNavigator';
import color from '@/app/shared/color';
import fontSize from '@/app/shared/font-size';
import { supabase } from '@/lib/supabase';
import React, { useState } from 'react';
import { Alert, Image, StyleSheet, Text, TextInput, View } from 'react-native';

type Props = NavigationProps<'SignUp'>;

export default function SignUp({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignUp = async () => {
    if (!email || !password || !nickname) {
      Alert.alert('Erro', 'Preencha todos os campos!');
      return;
    }

    if (confirmPassword !== password) {
      Alert.alert(
        'Erro',
        'As senhas não coincidem. Por favor, tente novamente.'
      );
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nickname,
          },
        },
      });

      if (error) {
        if (error.message.includes('already registered')) {
          Alert.alert('Erro no cadastro', 'Este e-mail já está cadastrado!');
        } else {
          Alert.alert('Erro no cadastro', error.message);
        }
      } else {
        Alert.alert('Sucesso', 'Conta criada com sucesso!');
        navigation.navigate('Login');
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
        <Text style={{ ...styles.createNewAccount }}>Bem vindo!</Text>
        <Image source={require('../../../assets/images/icon.png')} />
      </View>
      <Text style={{ ...styles.createNewAccount }}>
        Cadastre uma nova conta
      </Text>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Apelido"
          value={nickname}
          onChangeText={setNickname}
          keyboardType="default"
          placeholderTextColor="#FFF"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="E-mail"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          placeholderTextColor="#FFF"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          value={password}
          onChangeText={setPassword}
          placeholderTextColor="#FFF"
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder="Confirme sua senha"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholderTextColor="#FFF"
          secureTextEntry
        />
        <ButtonPrimary onPress={handleSignUp}>
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
  createNewAccount: {
    fontSize: fontSize.secondary,
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
});
