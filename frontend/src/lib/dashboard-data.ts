import { SupabaseClient } from '@supabase/supabase-js'
import { AssessmentSession, StudyProgress, UserStreak, AssessmentProfile } from '../types/database.types'

export interface DashboardData {
  testsCompleted: number
  avgScore: number
  overallProgress: number
  currentStreak: number
  longestStreak: number
  officerScore: number
  grade: string
  radarData: { olq: string; score: number }[]
  trajectoryData: { date: string; score: number | null }[]
  activityFeed: { module: string; score: number; time: string }[]
}

export async function getDashboardData(userId: string, supabase: SupabaseClient): Promise<DashboardData> {
  const [sessions, progress, streak, profile] = await Promise.allSettled([
    supabase.from('assessment_sessions')
      .select('score, module, created_at, olq_scores')
      .eq('user_id', userId).order('created_at', { ascending: false }),
    supabase.from('study_progress')
      .select('status, exam, chapter_id').eq('user_id', userId),
    supabase.from('user_streaks')
      .select('current_streak, longest_streak, total_active_days')
      .eq('user_id', userId).single(),
    supabase.from('assessment_profiles')
      .select('overall_score, grade, profile_data, recommendation_likelihood')
      .eq('user_id', userId).single(),
  ])

  const sessionsData: Partial<AssessmentSession>[] = sessions.status === 'fulfilled' ? (sessions.value.data as unknown as Partial<AssessmentSession>[]) ?? [] : []
  const progressData: Partial<StudyProgress>[] = progress.status === 'fulfilled' ? (progress.value.data as unknown as Partial<StudyProgress>[]) ?? [] : []
  const streakData: Partial<UserStreak> | null = streak.status === 'fulfilled' ? (streak.value.data as unknown as Partial<UserStreak>) : null
  const profileData: Partial<AssessmentProfile> | null = profile.status === 'fulfilled' ? (profile.value.data as unknown as Partial<AssessmentProfile>) : null

  const testsCompleted = sessionsData.length
  const avgScore = testsCompleted > 0
    ? Math.round(sessionsData.reduce((s: number, x) => s + (x.score ?? 0), 0) / testsCompleted) : 0
  const completedTopics = progressData.filter(p => p.status === 'completed').length
  const overallProgress = Math.round((completedTopics / Math.max(progressData.length, 1)) * 100)

  // OLQ aggregation for radar
  const olqMap: Record<string, number[]> = {}
  sessionsData.forEach(s => {
    if (s.olq_scores) {
      Object.entries(s.olq_scores).forEach(([k, v]) => {
        if (!olqMap[k]) olqMap[k] = []
        olqMap[k].push(v as number)
      })
    }
  })
  const radarData = Object.entries(olqMap).map(([olq, scores]) => ({
    olq, score: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
  }))

  // 14-day trajectory
  const trajectoryData = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (13 - i))
    const dateStr = d.toISOString().split('T')[0]
    const daySessions = sessionsData.filter(s => s.created_at?.startsWith(dateStr))
    return {
      date: dateStr.slice(5),
      score: daySessions.length > 0
        ? Math.round(daySessions.reduce((s: number, x) => s + (x.score ?? 0), 0) / daySessions.length)
        : null
    }
  })

  // Recent activity
  const activityFeed = sessionsData.slice(0, 8).map(s => ({
    module: s.module?.toUpperCase() ?? 'TEST',
    score: s.score ?? 0,
    time: s.created_at ? getRelativeTime(s.created_at) : 'unknown',
  }))

  return {
    testsCompleted, avgScore, overallProgress,
    currentStreak: streakData?.current_streak ?? 0,
    longestStreak: streakData?.longest_streak ?? 0,
    officerScore: profileData?.overall_score ?? 0,
    grade: profileData?.grade ?? 'NOT_ASSESSED',
    radarData, trajectoryData, activityFeed,
  }
}

function getRelativeTime(iso: string): string {
  if (!iso) return 'unknown'
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}
