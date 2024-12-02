import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { CharacterProvider } from './context/CharacterContext';
import { DungeonProvider } from './context/DungeonContext';
import AppNavigator from './navigation/AppNavigator';

export default function Index() {
  return (
    <AuthProvider>
      <CharacterProvider>
        <DungeonProvider>
          <AppNavigator />
        </DungeonProvider>
      </CharacterProvider>
    </AuthProvider>
  );
}
