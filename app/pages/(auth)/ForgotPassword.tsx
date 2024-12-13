import Background from '@/app/components/Background';
import ButtonPrimary from '@/app/components/ButtonPrimary';
import ButtonReturn from '@/app/components/ButtonReturn';
import { RootStackParamList } from '@/app/navigation/AppNavigator';
import { supabase } from '@/lib/supabase';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Button,
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

type NavigationProps = StackNavigationProp<
  RootStackParamList,
  'RecoverPassword'
>;

export default function ResetPassword() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [stage, setStage] = useState<'email' | 'otp' | 'password'>('email'); // Controle do estágio do processo
  const navigation = useNavigation<NavigationProps>();

  const handleSendResetEmail = async () => {
    if (!email) {
      Alert.alert('Erro', 'Por favor, insira seu e-mail.');
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) {
        Alert.alert('Erro ao enviar e-mail', error.message);
      } else {
        Alert.alert('Sucesso', 'E-mail de recuperação enviado com sucesso!');
        setStage('otp');
      }
    } catch (error) {
      console.error(error);
      Alert.alert(
        'Erro',
        'Ocorreu um erro inesperado. Tente novamente mais tarde.'
      );
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      Alert.alert('Erro', 'Por favor, insira o código OTP.');
      return;
    }

    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'email',
      });

      if (error) {
        Alert.alert('Erro ao verificar OTP', error.message);
      } else {
        Alert.alert('Sucesso', 'Código OTP verificado com sucesso!');
        setStage('password');
      }
    } catch (error) {
      console.error(error);
      Alert.alert(
        'Erro',
        'Ocorreu um erro inesperado. Tente novamente mais tarde.'
      );
    }
  };

  const handleChangePassword = async () => {
    if (!password || !confirmPassword) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem.');
      return;
    }

    try {
      const { data, error } = await supabase.auth.updateUser({ password });
      if (error) {
        Alert.alert('Erro', error.message);
      } else {
        Alert.alert('Sucesso', 'Senha alterada com sucesso!');
        navigation.navigate('Main');
      }
    } catch (error) {
      Alert.alert(
        'Erro',
        'Ocorreu um erro inesperado. Tente novamente mais tarde.'
      );
    }
  };
  const handleReturn = () => {
    navigation.navigate('Main');
  };
  return (
    <Background>
      <ButtonReturn onPress={handleReturn}></ButtonReturn>
      <View style={{ justifyContent: 'center', flex: 1 }}>
        <Text style={styles.title}>Recuperação de Senha</Text>
        <Image
          style={{ alignSelf: 'center' }}
          source={require('../../../assets/images/icon.png')}
        />

        {stage === 'email' && (
          <>
            <TextInput
              style={styles.input}
              placeholder="Digite seu e-mail"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            <ButtonPrimary onPress={handleSendResetEmail}>
              <Text>Enviar código</Text>
            </ButtonPrimary>
          </>
        )}

        {stage === 'otp' && (
          <>
            <TextInput
              style={styles.input}
              placeholder="Digite o código OTP"
              value={otp}
              onChangeText={setOtp}
              keyboardType="numeric"
              autoCapitalize="none"
            />
            <Button title="Verificar Código OTP" onPress={handleVerifyOtp} />
          </>
        )}

        {stage === 'password' && (
          <>
            <TextInput
              style={styles.input}
              placeholder="Digite sua nova senha"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            <TextInput
              style={styles.input}
              placeholder="Confirme sua nova senha"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <Button title="Alterar Senha" onPress={handleChangePassword} />
          </>
        )}
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 10,
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
});
