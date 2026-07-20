import { NextResponse } from 'next/server'
import Parser from 'rss-parser'
import { getServerUser } from '@/lib/supabase/auth';

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
  category?: string;
}

export const revalidate = 3600

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
]

function extractImage(item: any): string | undefined {
  const htmlContent = item['content:encoded'] || item.content || '';
  const match = htmlContent.match(/<img[^>]+src="([^">]+)"/i);
  if (match && match[1]) {
    return match[1];
  }
  return undefined;
}

export async function GET() {
  try {
    const user = await getServerUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const parser = new Parser({
      customFields: {
        item: ['content:encoded', 'media:content']
      }
    });

    // We fetch from multiple reliable RSS feeds to guarantee it loads, provides images, and direct links without API keys.
    const [ssbCrackFeed, googleNewsFeed] = await Promise.allSettled([
      parser.parseURL('https://ssbcrackexams.com/feed/'),
      parser.parseURL('https://news.google.com/rss/search?q=Indian+Defence+OR+Indian+Army+OR+Indian+Navy+OR+IAF&hl=en-IN&gl=IN&ceid=IN:en')
    ]);

    let rawArticles: any[] = [];

    if (ssbCrackFeed.status === 'fulfilled' && ssbCrackFeed.value) {
      rawArticles = [...rawArticles, ...(ssbCrackFeed.value.items || []).map(item => ({...item, _sourceId: 'SSBCrack'}))];
    }
    
    if (googleNewsFeed.status === 'fulfilled' && googleNewsFeed.value) {
      rawArticles = [...rawArticles, ...(googleNewsFeed.value.items || []).map(item => ({...item, _sourceId: 'Google News'}))];
    }

    // Sort by date descending
    rawArticles.sort((a, b) => {
      const dateA = a.isoDate ? new Date(a.isoDate).getTime() : 0;
      const dateB = b.isoDate ? new Date(b.isoDate).getTime() : 0;
      return dateB - dateA;
    });

    const articles: NewsItem[] = rawArticles.slice(0, 30).map((item) => {
      // Decode HTML entities in title
      let title = item.title || '';
      title = title.replace(/&#8211;/g, '-').replace(/&#8217;/g, "'").replace(/&#38;/g, '&');
      
      let description = item.contentSnippet || item.content || '';
      if (description.length > 250) {
        description = description.substring(0, 247) + '...';
      }

      const category = categorizeArticle(title + ' ' + description);
      
      return {
        id: item.guid || item.link,
        title: title,
        description: description,
        url: item.link || '',
        image: extractImage(item),
        publishedAt: item.isoDate || new Date().toISOString(),
        source: item.creator || item._sourceId || 'Defence News',
        category: category,
      };
    });

    if (articles.length === 0) {
      return NextResponse.json({ articles: STATIC_FALLBACK, source: 'static', total: STATIC_FALLBACK.length })
    }

    return NextResponse.json({ articles, source: 'live', total: articles.length, fetchedAt: new Date().toISOString() })
  } catch (err) {
    console.error('News fetch error:', err)
    return NextResponse.json({ articles: STATIC_FALLBACK, source: 'static', total: STATIC_FALLBACK.length })
  }
}

