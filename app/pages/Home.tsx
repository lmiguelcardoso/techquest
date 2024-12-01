import React from 'react';
import { Button, Text, View } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { handleLogout } = useAuth();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>Home</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
}
