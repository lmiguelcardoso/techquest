import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import { Dungeon } from '../entities/dungeon';

export const getDungeonsByRace = async (raceId: number) => {
  let { data, error } = await supabase
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

export const isFirstAcess = async () => {
  let { data: user_progress, error } = await supabase
    .from('user_progress')
    .select('id');

  return user_progress?.length == 0;
};

export const getUserById = async (userId: string) => {
  let { data: user } = await supabase
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

  // const { data, error } = await supabase
  //   .from('characters')
  //   .insert([
  //     {
  //       user_id: user.id,
  //       level: 1,
  //       race_id: raceId,
  //     },
  //   ])
  //   .select();

  alert(`Raça criada`);

  async function validateIfRaceAlreadyExists(user: User, raceId: number) {
    let { data, error } = await supabase
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
  const { data, error } = await supabase
    .from('user_progress')
    .insert([
      {
        user_id: user.id,
        dungeon_id: dungeonId,
        progress: 0,
      },
    ])
    .select();
};
