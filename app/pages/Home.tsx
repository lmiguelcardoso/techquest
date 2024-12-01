import React, { useEffect, useState } from 'react';
import { Button, StyleSheet, View } from 'react-native';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { userHeight } from '../shared/constants';
import { isFirstAcess } from '../shared/services/RequestService';
import Onboarding from './Onboarding';

export default function Home() {
  const { handleLogout } = useAuth();
  const [firstAccess, setFirstAccess] = useState<boolean>(false);

  const getFirstAccess = async () => {
    setFirstAccess(await isFirstAcess());
  };

  useEffect(() => {
    getFirstAccess();
  }, []);

  return (
    <View style={styles.container}>
      {firstAccess ? (
        <Onboarding />
      ) : (
        <>
          <Header />
          <Button title="Logout" onPress={handleLogout} />
          <Navbar />
        </>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    height: userHeight,
    padding: 20,
  },
});
