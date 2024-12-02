import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Dungeon } from '../shared/entities/dungeon';

interface DungeonContextProps {
  dungeon: Dungeon | null;
  setDungeon: React.Dispatch<React.SetStateAction<Dungeon | null>>;
}

const DungeonContext = createContext<DungeonContextProps | undefined>(
  undefined
);

export const DungeonProvider = ({ children }: { children: ReactNode }) => {
  const [dungeon, setDungeon] = useState<Dungeon | null>(null);

  useEffect(() => {}, []);

  return (
    <DungeonContext.Provider value={{ dungeon, setDungeon }}>
      {children}
    </DungeonContext.Provider>
  );
};

export const useDungeon = () => {
  const context = useContext(DungeonContext);
  if (!context) {
    throw new Error('useDungeon must be used within a DungeonProvider');
  }
  return context;
};
