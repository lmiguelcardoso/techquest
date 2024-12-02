import React from 'react';
import { Button, StyleSheet, View } from 'react-native';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { userHeight } from '../shared/constants';

export default function Home() {
  const { handleLogout } = useAuth();

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
