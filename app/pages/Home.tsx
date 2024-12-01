import React, { useEffect } from 'react';
import { Button, StyleSheet, View } from 'react-native';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { userHeight } from '../shared/constants';
import { getDungeons } from '../shared/services/DungeonService';

export default function Home() {
  const { handleLogout } = useAuth();

  const load = async () => {
    console.log(await getDungeons());
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <View style={styles.container}>
      <Header />
      <Button title="Logout" onPress={handleLogout} />
      <Navbar />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    height: userHeight,
    padding: 20,
  },
});
