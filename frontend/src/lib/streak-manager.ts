import { SupabaseClient } from '@supabase/supabase-js'

export async function updateStreak(userId: string, supabase: SupabaseClient) {
  const today = new Date().toISOString().split('T')[0]
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]

  const { data: existing } = await supabase
    .from('user_streaks').select('*').eq('user_id', userId).single()

  if (!existing) {
    await supabase.from('user_streaks').insert({
      user_id: userId, current_streak: 1, longest_streak: 1,
      last_active_date: today, total_active_days: 1
    })
    return
  }

  if (existing.last_active_date === today) return

  const newStreak = existing.last_active_date === yesterday
    ? existing.current_streak + 1 : 1

  await supabase.from('user_streaks').update({
    current_streak: newStreak,
    longest_streak: Math.max(newStreak, existing.longest_streak),
    last_active_date: today,
    total_active_days: existing.total_active_days + 1
  }).eq('user_id', userId)
}
