import { supabase } from '@/lib/supabase';
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Character } from '../shared/entities/character';
import { useAuth } from './AuthContext';

interface CharacterContextData {
  character: Character | null;
  setCharacter: (character: Character | null) => void;
  fetchCharacter: () => Promise<void>;
}

const CharacterContext = createContext<CharacterContextData | undefined>(
  undefined
);

export const CharacterProvider = ({ children }: { children: ReactNode }) => {
  const [character, setCharacter] = useState<Character | null>(null);
  const { userData } = useAuth();
  const fetchCharacter = async () => {
    if (!userData) return;
    try {
      const { data, error } = await supabase
        .from('characters')
        .select('*')
        .eq('user_id', userData?.id)
        .single();

      if (error) {
        console.error('Erro ao buscar personagem:', error);
        return;
      }

      if (data) setCharacter(data);
    } catch (error) {
      console.error('Erro ao buscar personagem:', error);
    }
  };

  useEffect(() => {
    fetchCharacter();
  }, []);

  return (
    <CharacterContext.Provider
      value={{ character, setCharacter, fetchCharacter }}
    >
      {children}
    </CharacterContext.Provider>
  );
};

export const useCharacter = (): CharacterContextData => {
  const context = useContext(CharacterContext);
  if (!context) {
    throw new Error('useCharacter deve ser usado dentro de CharacterProvider');
  }
  return context;
};
