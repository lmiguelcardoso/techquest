import { NavigationProps } from '@/app/navigation/AppNavigator';
import color from '@/app/shared/color';
import fontSize from '@/app/shared/font-size';
import { supabase } from '@/lib/supabase';
import React, { useState } from 'react';
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

type Props = NavigationProps<'SignUp'>;

export default function SignUp({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Preencha todos os campos!');
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crie sua Conta</Text>

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
      <Pressable style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Cadastrar</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: color.white,
    padding: 20,
  },
  title: {
    fontSize: fontSize.primary,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: color.primary,
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    width: '100%',
    fontSize: fontSize.secondary,
  },
  button: {
    backgroundColor: color.primary,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: color.white,
    fontSize: fontSize.secondary,
    fontWeight: 'bold',
  },
});
