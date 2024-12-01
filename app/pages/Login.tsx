import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import color from '../shared/color';
import AntDesign from '@expo/vector-icons/AntDesign';
import fontSize from '../shared/font-size';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { supabase } from '@/lib/supabase';

export default function Login() {
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

  return (
    <View>
      <View style={styles.container}>
        <Text
          style={StyleSheet.flatten([styles.welcomeText, styles.welcomeTextP])}
        >
          Olá Viajante!
        </Text>
        <Text style={styles.welcomeText}>Bem vindo ao TechQuest</Text>
        <Pressable onPress={handleSignInWithGoogle}>
          <Text style={{ textAlign: 'center', paddingTop: 20, fontSize: 25 }}>
            Login/Cadastro
          </Text>
          <View style={styles.button}>
            <AntDesign
              name="google"
              size={24}
              color="white"
              style={{ margin: 10 }}
            />
            <Text style={styles.loginBtnLabel}>Login com Google</Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 'auto',
    backgroundColor: color.white,
  },
  welcomeText: {
    padding: 15,
    textAlign: 'center',
    fontSize: fontSize.primary,
    fontWeight: 'bold',
  },
  welcomeTextP: {
    padding: 15,
  },
  loginBtnLabel: { color: color.white, fontSize: fontSize.secondary },
  button: {
    backgroundColor: color.primary,
    padding: 10,
    margin: 20,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
});
