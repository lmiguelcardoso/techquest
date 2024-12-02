import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { CharacterProvider } from './context/CharacterContext';
import AppNavigator from './navigation/AppNavigator';

export default function Index() {
  return (
    <AuthProvider>
      <CharacterProvider>
        <AppNavigator />
      </CharacterProvider>
    </AuthProvider>
  );
}
