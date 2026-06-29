import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  let dbStatus = 'ok'
  try {
    const supabase = await createClient()
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
