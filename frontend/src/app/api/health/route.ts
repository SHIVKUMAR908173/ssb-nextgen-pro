import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET() {
  let dbStatus = 'ok'
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          },
        },
      }
    )
    const { error } = await supabase.from('user_streaks').select('id').limit(1)
    if (error) dbStatus = 'degraded'
  } catch {
    dbStatus = 'offline'
  }

  return NextResponse.json({
    status: dbStatus === 'ok' ? 'online' : dbStatus,
    timestamp: new Date().toISOString(),
    services: {
      database: dbStatus,
      ai: process.env.GEMINI_API_KEY ? 'ok' : 'not_configured'
    }
  }, {
    headers: { 'Cache-Control': 'no-store' }
  })
}
