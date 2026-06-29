import { SupabaseClient } from '@supabase/supabase-js'

export async function updateStreak(userId: string, supabase: SupabaseClient) {
  try {
    const res = await fetch('/api/update-streak', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!res.ok) {
      console.error('Failed to update streak via API', await res.text());
    }
  } catch (error) {
    console.error('Failed to update streak:', error);
  }
}
