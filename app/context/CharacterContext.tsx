import { supabase } from '@/lib/supabase';
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Attributes } from '../shared/entities/attributes';
import { Character } from '../shared/entities/character';
import { EquippedItem } from '../shared/entities/equipped-item';
import { Race } from '../shared/entities/race';
import { useAuth } from './AuthContext';

interface CharacterContextData {
  character: Character | null;
  race: Partial<Race> | null;
  setCharacter: (character: Character | null) => void;
  fetchCharacter: () => Promise<void>;
  equippedItems: EquippedItem[];
  attributes: Attributes;
  setEquippedItems: React.Dispatch<React.SetStateAction<EquippedItem[]>>;
  equipItem: (itemId: string, slot: string) => Promise<void>;
  unequipItem: (equippedItem: EquippedItem) => Promise<void>;
}

const CharacterContext = createContext<CharacterContextData | undefined>(
  undefined
);

export const CharacterProvider = ({ children }: { children: ReactNode }) => {
  const [character, setCharacter] = useState<Character | null>(null);
  const [race, setRace] = useState<Partial<Race> | null>(null);
  const [equippedItems, setEquippedItems] = useState<EquippedItem[]>([]);
  const [attributes, setAttributes] = useState<Attributes>({
    health: 0,
    armor: 0,
    damage: 0,
    strength: 0,
    luck: 0,
  });
  const { userData } = useAuth();

  const fetchCharacter = async () => {
    if (!userData) return;
    try {
      const { data, error } = await supabase
        .from('characters')
        .select(
          `
        *,
        races (race_id, role, icon, name)
      `
        )
        .eq('user_id', userData?.id)
        .single();

      if (error) {
        console.error('Erro ao buscar personagem:', error);
        return;
      }

      setCharacter(data);
      setRace({
        icon: data['races'].icon,
        race_id: data['races'].race_id,
        role: data['races'].role,
        name: data['races'].name,
      });
    } catch (error) {
      console.error('Erro ao buscar personagem:', error);
    }
  };

  const fetchEquippedItems = async (characterId: string) => {
    const { data, error } = await supabase
      .from('equipped_items')
      .select('*, items ( id, name, type, bonus, icon )')
      .eq('character_id', characterId);

    if (error) {
      console.error('Erro ao buscar itens equipados:', error);
      return;
    }

    setEquippedItems(data);
    calculateAttributes(data);
  };

  const calculateAttributes = (items: EquippedItem[]) => {
    if (!Array.isArray(items)) {
      console.error('Expected items to be an array, but got:', typeof items);
      items = [];
    }

    const newAttributes: Attributes = {
      health: 0,
      armor: 0,
      damage: 0,
      strength: 0,
      luck: 0,
    };

    items.forEach((item) => {
      const bonuses = JSON.parse(item.items?.bonus) as Attributes;
      Object.keys(bonuses).forEach((key) => {
        newAttributes[key as keyof Attributes] += Number(
          bonuses[key as keyof Attributes] || 0
        );
      });
    });

    setAttributes(newAttributes);
  };

  const equipItem = async (itemId: string, slot: string) => {
    try {
      const { data: newEquip, error: equipError } = await supabase
        .from('equipped_items')
        .insert({
          item_id: itemId,
          type: slot,
          character_id: character?.id,
        })
        .select('*, items ( id, name, type, bonus, icon )');

      if (equipError) {
        console.error('Erro ao equipar item:', equipError);
        return;
      }

      if (newEquip) {
        setEquippedItems((prev) => {
          const updatedItems = prev
            .filter((item) => item.type !== slot)
            .concat(newEquip[0]);
          calculateAttributes(updatedItems);
          return updatedItems;
        });
      }
    } catch (err) {
      console.error('Erro inesperado ao equipar item:', err);
    }
  };

  const unequipItem = async (equippedItem: EquippedItem) => {
    try {
      const { error } = await supabase
        .from('equipped_items')
        .delete()
        .match({ id: equippedItem.id, character_id: character?.id });

      if (error) {
        console.error('Erro ao desequipar item:', error);
        return;
      }

      setEquippedItems((prev) => {
        const updatedItems = prev.filter((item) => item.id !== equippedItem.id);
        calculateAttributes(updatedItems);
        return updatedItems;
      });
    } catch (err) {
      console.error('Erro inesperado ao desequipar item:', err);
    }
  };

  useEffect(() => {
    if (character) {
      fetchEquippedItems(character.id);
    }
  }, [character]);

  return (
    <CharacterContext.Provider
      value={{
        character,
        race,
        setCharacter,
        fetchCharacter,
        equippedItems,
        attributes,
        setEquippedItems,
        equipItem,
        unequipItem,
      }}
    >
      {children}
    </CharacterContext.Provider>
  );
};

export const useCharacter = () => {
  const context = useContext(CharacterContext);
  if (context === undefined) {
    throw new Error('useCharacter must be used within a CharacterProvider');
  }
  return context;
};
