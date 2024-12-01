import { supabase } from '@/lib/supabase';

export const getDungeons = async () => {
  let { data: answers, error } = await supabase.from('dungeons').select('id');

  return answers;
};
