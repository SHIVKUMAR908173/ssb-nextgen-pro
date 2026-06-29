import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Fallback bank just in case the database is empty
import watBank from '@/data/wat_word_bank.json'

interface ScenarioItem {
    id: string;
    word: string;
    image_url?: string;
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const type = searchParams.get('type') || 'WAT'
        const limit = parseInt(searchParams.get('limit') || '60', 10)

        const supabase = await createClient()
        // Try to fetch from database
        const { data: dbScenarios, error } = await supabase
            .from('mansa_scenarios')
            .select('*')
            .eq('test_type', type)
        
        let scenarios = dbScenarios || []

        if (error) {
            console.error('Error fetching scenarios from DB:', error)
        }

        // If DB has scenarios, pick random ones
        if (scenarios.length > 0) {
            // Shuffle
            scenarios = scenarios.sort(() => 0.5 - Math.random()).slice(0, limit)

            const formatted: ScenarioItem[] = scenarios.map((s: Record<string, any>) => ({
                id: s.id as string,
                word: s.prompt_text as string,
                image_url: s.image_url as string | undefined
            }))
            
            // If we don't have enough in DB, pad with fallbacks
            if (formatted.length < limit && type === 'WAT') {
                const missingCount = limit - formatted.length
                const fallbackWords = watBank.sets[0].words.sort(() => 0.5 - Math.random()).slice(0, missingCount)
                fallbackWords.forEach((word: string, i: number) => {
                    formatted.push({ id: `fallback-${i}`, word })
                })
            }

            return NextResponse.json({ scenarios: formatted })
        }

        // Fallback for WAT if DB is empty completely
        if (type === 'WAT') {
            const fallbackSetIndex = Math.floor(Math.random() * watBank.sets.length)
            const words = watBank.sets[fallbackSetIndex].words.slice(0, limit)
            const formatted = words.map((word: string, i: number) => ({
                id: `fallback-${fallbackSetIndex}-${i}`,
                word
            }))
            return NextResponse.json({ scenarios: formatted })
        }

        return NextResponse.json({ scenarios: [] })
    } catch (err: unknown) {
        console.error('Error in scenarios route:', err)
        return NextResponse.json({ error: (err as Error).message }, { status: 500 })
    }
}
