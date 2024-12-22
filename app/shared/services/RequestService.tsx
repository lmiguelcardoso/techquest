import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import { Dungeon } from '../entities/dungeon';
import { TopicWithUserStatus } from '../entities/topic';
import { UserProgressWithDungeon } from '../entities/user_progress';

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

export const getUserProgressById = async (
  userId: string,
  dungeonId?: string
) => {
  let query = supabase
    .from('user_progress')
    .select(
      `
      *,
      dungeon: dungeon_id (id, name, description, min_level, race_id)
    `
    )
    .order('created_at')
    .eq('user_id', userId);

  if (dungeonId) {
    query = query.eq('dungeon_id', dungeonId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Erro ao buscar o progresso do usuario:', error);
    return [];
  }

  return data as UserProgressWithDungeon[];
};

export const getTopicsByDungeonID = async (
  dungeonId: string,
  userId: string
): Promise<TopicWithUserStatus[]> => {
  // 1. Buscar todos os tópicos da dungeon
  const { data: topics, error: topicsError } = await supabase
    .from('topics')
    .select('*')
    .eq('dungeon_id', dungeonId);

  if (topicsError) {
    console.error('Erro ao buscar tópicos:', topicsError.message);
    throw topicsError;
  }

  // 2. Buscar progresso do usuário na tabela topic_progress
  const { data: progressData, error: progressError } = await supabase
    .from('topic_progress')
    .select('topic_id, completed')
    .eq('user_id', userId);

  if (progressError) {
    console.error(
      'Erro ao buscar progresso do usuário:',
      progressError.message
    );
    throw progressError;
  }

  // 3. Criar um mapa para progresso do usuário
  const progressMap = new Map<string, boolean>();
  progressData?.forEach((progress) => {
    progressMap.set(progress.topic_id, progress.completed);
  });

  // 4. Combinar os dados dos tópicos com o progresso do usuário
  const topicsWithStatus: TopicWithUserStatus[] = topics.map((topic) => ({
    ...topic,
    completed: progressMap.get(topic.id) || false, // Verifica o progresso, default é false
  }));

  return topicsWithStatus;
};
export const isFirstAcess = async (userId: string) => {
  const { data: characters } = await supabase
    .from('characters')
    .select('*')
    .eq('user_id', userId)
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

export const fetchQuestionsByTopicId = async (topicId: string) => {
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .eq('topic_id', topicId);

  if (error) {
    console.error('Erro ao buscar perguntas:', error.message);
    throw error;
  }

  return data;
};

export const fetchQuestionsWithAnswers = async (topicId: string) => {
  const { data: questions, error: questionError } = await supabase
    .from('questions')
    .select('id, text, topic_id')
    .eq('topic_id', topicId);

  if (questionError) {
    throw questionError;
  }

  // Para cada pergunta, buscamos as respostas associadas
  const questionsWithAnswers = await Promise.all(
    questions.map(async (question: any) => {
      const { data: answers, error: answersError } = await supabase
        .from('answers')
        .select('id, text, is_correct, question_id')
        .eq('question_id', question.id);

      if (answersError) {
        throw answersError;
      }

      return { ...question, answers };
    })
  );

  return questionsWithAnswers;
};
