import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          },
        },
      }
    )

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: streakData, error: fetchError } = await supabase
      .from('user_streaks')
      .select('*')
      .eq('user_id', user.id)
      .single()

    const todayStr = new Date().toISOString().split('T')[0]
    
    if (fetchError || !streakData) {
      // First time setting a streak
      const { data: newStreak, error: insertError } = await supabase
        .from('user_streaks')
        .insert({
          user_id: user.id,
          current_streak: 1,
          longest_streak: 1,
          last_active_date: todayStr,
          total_active_days: 1
        })
        .select()
        .single()
        
      if (insertError) throw insertError
      return NextResponse.json(newStreak)
    }

    // Logic to increment streak
    const lastActiveDate = streakData.last_active_date
    let currentStreak = streakData.current_streak
    let longestStreak = streakData.longest_streak
    let totalActiveDays = streakData.total_active_days

    if (lastActiveDate !== todayStr) {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayStr = yesterday.toISOString().split('T')[0]

      if (lastActiveDate === yesterdayStr) {
        // Active yesterday, increment
        currentStreak += 1
      } else {
        // Gap > 1 day, reset
        currentStreak = 1
      }

      if (currentStreak > longestStreak) {
        longestStreak = currentStreak
      }
      totalActiveDays += 1

      const { data: updated, error: updateError } = await supabase
        .from('user_streaks')
        .update({
          current_streak: currentStreak,
          longest_streak: longestStreak,
          last_active_date: todayStr,
          total_active_days: totalActiveDays
        })
        .eq('user_id', user.id)
        .select()
        .single()

      if (updateError) throw updateError
      return NextResponse.json(updated)
    }

    // Already active today, no change
    return NextResponse.json(streakData)

  } catch (error) {
    console.error("Update Streak error:", error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
