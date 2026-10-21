
import { supabase } from './lib/supabase';

export async function testSupabase() {
  const { data, error } = await supabase
    .from('videos')
    .select('id')
    .limit(1);

  if (error) {
    console.error('Supabase error:', error.message);
  } else {
    console.log('Supabase connected successfully!', data);
  }
}
