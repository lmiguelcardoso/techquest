import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import { Dungeon } from '../entities/dungeon';

export const getDungeonsByRace = async (raceId: number) => {
  const { data, error } = await supabase
    .from('dungeons')
    .select('*')
    .order('min_level')
    .eq('race_id', raceId);

  if (error) {
    console.error('Erro ao buscar as dungeons:', error);
    return [];
  }

  return data as Dungeon[];
};

export const isFirstAcess = async (userId: string) => {
  const { data: characters } = await supabase
    .from('characters')
    .select('*')
    .eq('id', userId)
    .single();

  return characters == null;
};

export const getUserById = async (userId: string) => {
  const { data: user } = await supabase
    .from('users')
    .select('id')
    .eq('id', userId)
    .single();

  return user;
};

export const createCharacter = async (user: User, raceId: number) => {
  const raceExists = await validateIfRaceAlreadyExists(user, raceId);

  if (raceExists) {
    alert(`Você já possui um personagem dessa raça`);
    return;
  }

  const { error } = await supabase
    .from('characters')
    .insert([
      {
        user_id: user.id,
        level: 1,
        race_id: raceId,
      },
    ])
    .select();

  if (error) {
    console.error('Erro ao criar o personagem:', error);
    return [];
  }

  alert(`Raça criada`);

  async function validateIfRaceAlreadyExists(user: User, raceId: number) {
    const { data } = await supabase
      .from('characters')
      .select('id')
      .eq('user_id', user.id)
      .eq('race_id', raceId);

    return data && data.length > 0;
  }
};

export const createFirstCharacter = async (user: User, raceId: number) => {
  createCharacter(user, raceId);
  const data = await getDungeonsByRace(raceId);

  const firstDungeon = data![0].id;

  await createUserProgress(user, firstDungeon);
};

export const createUserProgress = async (user: User, dungeonId: string) => {
  const { error } = await supabase
    .from('user_progress')
    .insert([
      {
        user_id: user.id,
        dungeon_id: dungeonId,
        progress: 0,
      },
    ])
    .select();

  if (error) {
    console.error('Erro ao criar o personagem:', error);
    return [];
  }
};

export const getRaces = async () => {
  const { data } = await supabase.from('races').select('*').order('race_id');
  return data;
};
