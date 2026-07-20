import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { computeAssessmentProfile } from '@/lib/ml-assessment-engine'
import { getServerUser } from '@/lib/supabase/auth';

export async function GET(req: Request) {
  try {
    const user = await getServerUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const url = new URL(req.url)
    const userIdQuery = url.searchParams.get('userId')
    
    if (!userIdQuery) {
      return NextResponse.json({ error: 'Missing userId parameter' }, { status: 400 })
    }

    const supabase = await createClient()
    if (user.id !== userIdQuery) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 1. Check cache first
    const { data: cachedProfile, error: cacheError } = await supabase
      .from('assessment_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (!cacheError && cachedProfile) {
      const expiresAt = new Date(cachedProfile.expires_at).getTime()
      if (expiresAt > Date.now()) {
        return NextResponse.json(cachedProfile.profile_data)
      }
    }

    // 2. Fetch all sessions
    const { data: sessions, error: sessionsError } = await supabase
      .from('assessment_sessions')
      .select('*')
      .eq('user_id', user.id)

    if (sessionsError) {
      console.error("Error fetching sessions", sessionsError)
      return NextResponse.json({ error: 'Failed to fetch sessions' }, { status: 500 })
    }

    // 3. Compute new profile
    const newProfile = computeAssessmentProfile(user.id, sessions || [])

    // 4. Save to cache
    const { error: upsertError } = await supabase
      .from('assessment_profiles')
      .upsert({
        user_id: user.id,
        profile_data: newProfile,
        overall_score: newProfile.overallOfficerScore,
        grade: newProfile.grade,
        recommendation_likelihood: newProfile.recommendationLikelihood,
        computed_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString() // 1 hour cache
      }, { onConflict: 'user_id' })

    if (upsertError) {
      console.error("Error saving assessment profile cache", upsertError)
    }

    return NextResponse.json(newProfile)

  } catch (error) {
    console.error("Assessment Profile error:", error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
