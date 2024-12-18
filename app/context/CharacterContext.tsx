import { supabase } from '@/lib/supabase';
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Character } from '../shared/entities/character';
import { Race } from '../shared/entities/race';
import { useAuth } from './AuthContext';

interface CharacterContextData {
  character: Character | null;
  race: Partial<Race> | null;
  setCharacter: (character: Character | null) => void;
  fetchCharacter: () => Promise<void>;
}

const CharacterContext = createContext<CharacterContextData | undefined>(
  undefined
);

export const CharacterProvider = ({ children }: { children: ReactNode }) => {
  const [character, setCharacter] = useState<Character | null>(null);
  const [race, setRace] = useState<Partial<Race> | null>(null);
  const { userData } = useAuth();

  const fetchCharacter = async () => {
    if (!userData) return;
    try {
      const { data, error } = await supabase
        .from('characters')
        .select(
          `
        *,
        races (race_id, role, icon,name)
      `
        )
        .eq('user_id', userData?.id)
        .single();

      setRace({
        icon: data['races'].icon,
        race_id: data['races'].race_id,
        role: data['races'].role,
        name: data['races'].name,
      });

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
      value={{ character, race, setCharacter, fetchCharacter }}
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
