import { NextResponse } from 'next/server'

interface NewsItem {
  id?: string;
  title: string;
  description: string;
  url: string;
  image?: string;
  urlToImage?: string;
  publishedAt?: string;
  published?: string;
  author?: string;
  source?: { name: string } | string;
}

export const revalidate = 3600

const DEFENCE_KEYWORDS = 'India defence military army navy airforce DRDO armed forces'

function categorizeArticle(text: string): string {
  const lower = text.toLowerCase()
  if (lower.match(/army|infantry|regiment|soldier/)) return 'Indian Army'
  if (lower.match(/navy|warship|submarine|naval/)) return 'Indian Navy'
  if (lower.match(/air force|aircraft|rafale|fighter|iaf/)) return 'Indian Air Force'
  if (lower.match(/drdo|missile|brahmos|tejas/)) return 'Defence Tech'
  if (lower.match(/border|lac|loc|china|pakistan/)) return 'Border Security'
  if (lower.match(/ssb|nda|cds|upsc|selection/)) return 'SSB/Recruitment'
  return 'Defence News'
}

const STATIC_FALLBACK = [
  { id: 's1', title: 'Indian Army Conducts PRAGATI 2026 Exercise', description: 'Large-scale multilateral exercise in Meghalaya combining jungle warfare and technology demonstrations.', url: 'https://indiandefensenews.in', image: null, publishedAt: '2026-05-25T00:00:00Z', source: 'Indian Defence News', category: 'Indian Army' },
  { id: 's2', title: 'HAL Tejas Mk1A Production Accelerated', description: 'HAL ramps up production of Tejas Mk1A fighters as IAF awaits delivery of 83 ordered aircraft.', url: 'https://indiandefensenews.in', image: null, publishedAt: '2026-05-20T00:00:00Z', source: 'Defence News', category: 'Indian Air Force' },
  { id: 's3', title: 'DRDO Astra Mk2 BVR Missile Test Successful', description: 'India\'s beyond-visual-range air-to-air missile Astra Mk2 completes successful test firing.', url: 'https://indiandefensenews.in', image: null, publishedAt: '2026-05-18T00:00:00Z', source: 'DRDO', category: 'Defence Tech' },
  { id: 's4', title: 'Indian Navy INS Vikrant Completes Deployment', description: 'India\'s first indigenously built aircraft carrier completes extended operational deployment.', url: 'https://indiandefensenews.in', image: null, publishedAt: '2026-05-15T00:00:00Z', source: 'Indian Navy', category: 'Indian Navy' },
  { id: 's5', title: 'SSB Selection Process Updates for 2026 Batch', description: 'Services Selection Board announces calendar and procedure updates for 2026 selection batch.', url: 'https://joinindianarmy.nic.in', image: null, publishedAt: '2026-05-10T00:00:00Z', source: 'Join Indian Army', category: 'SSB/Recruitment' },
  { id: 's6', title: 'BrahMos Supersonic Cruise Missile Order from Philippines', description: 'BrahMos Aerospace secures additional export order for coastal defense variant from the Philippines.', url: 'https://indiandefensenews.in', image: null, publishedAt: '2026-05-08T00:00:00Z', source: 'Defence News', category: 'Defence Tech' },
  { id: 's7', title: 'LAC Infrastructure Development Accelerated', description: 'Border Roads Organisation completes strategic road and tunnel projects along Line of Actual Control.', url: 'https://indiandefensenews.in', image: null, publishedAt: '2026-05-05T00:00:00Z', source: 'Border Roads', category: 'Border Security' },
  { id: 's8', title: 'NDA Entrance Exam 2026 Registration Opens', description: 'UPSC opens registration for National Defence Academy entrance examination for 2026 batch admissions.', url: 'https://upsc.gov.in', image: null, publishedAt: '2026-05-01T00:00:00Z', source: 'UPSC', category: 'SSB/Recruitment' },
]

export async function GET() {
  const apiKey = process.env.NEWS_API_KEY || process.env.CURRENTS_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ articles: STATIC_FALLBACK, source: 'static', total: STATIC_FALLBACK.length })
  }

  try {
    // Determine which API to use based on key format or presence
    // NewsAPI keys are exactly 32 character hex strings, but we'll just try NewsAPI first
    const url = new URL('https://newsapi.org/v2/everything')
    url.searchParams.set('q', 'Indian Defence OR Indian Army OR DRDO OR Indian Navy OR IAF')
    url.searchParams.set('language', 'en')
    url.searchParams.set('sortBy', 'publishedAt')
    url.searchParams.set('apiKey', apiKey)

    const res = await fetch(url.toString(), { next: { revalidate: 3600 } })
    
    // If NewsAPI fails (e.g. 401), we can fallback to Currents or just throw
    if (!res.ok) {
      if (res.status === 401) {
         // Let's try Currents API as a fallback if the key was actually a Currents key
         const currentsUrl = new URL('https://api.currentsapi.services/v1/search')
         currentsUrl.searchParams.set('apiKey', apiKey)
         currentsUrl.searchParams.set('keywords', DEFENCE_KEYWORDS)
         currentsUrl.searchParams.set('language', 'en')
         currentsUrl.searchParams.set('country', 'IN')
         
         const curRes = await fetch(currentsUrl.toString(), { next: { revalidate: 3600 } })
         if (!curRes.ok) throw new Error(`Currents API error: ${curRes.status}`)
         const curData = await curRes.json()
         const articles = (curData.news ?? []).map((item: NewsItem) => ({
            id: item.id,
            title: item.title,
            description: item.description,
            url: item.url,
            image: item.image !== 'None' ? item.image : null,
            publishedAt: item.published,
            source: item.author ?? 'Defence News',
            category: categorizeArticle(item.title + ' ' + (item.description || '')),
         }))
         return NextResponse.json({ articles, source: 'live', total: articles.length, fetchedAt: new Date().toISOString() })
      }
      throw new Error(`NewsAPI error: ${res.status}`)
    }

    const data = await res.json()
    const articles = (data.articles ?? []).filter((item: NewsItem) => item.title !== '[Removed]').map((item: NewsItem) => ({
      id: item.url,
      title: item.title,
      description: item.description,
      url: item.url,
      image: item.urlToImage || null,
      publishedAt: item.publishedAt,
      source: (typeof item.source === 'object' ? item.source?.name : item.source) ?? 'Defence News',
      category: categorizeArticle(item.title + ' ' + (item.description || '')),
    }))

    if (articles.length === 0) {
      return NextResponse.json({ articles: STATIC_FALLBACK, source: 'static', total: STATIC_FALLBACK.length })
    }

    return NextResponse.json({ articles, source: 'live', total: articles.length, fetchedAt: new Date().toISOString() })
  } catch (err) {
    console.error('News fetch error:', err)
    return NextResponse.json({ articles: STATIC_FALLBACK, source: 'static', total: STATIC_FALLBACK.length })
  }
}
