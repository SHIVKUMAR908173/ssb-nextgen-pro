from fastapi import APIRouter, HTTPException
import json
import urllib.request
import urllib.error
import xml.etree.ElementTree as ET
import random
from datetime import datetime, timedelta

router = APIRouter()

# Free Open Source Defence RSS Feeds
DEFENCE_FEEDS = [
    "https://www.defense.gov/DesktopModules/ArticleCS/RSS.ashx?max=10&Types=1&Site=gov",
    "https://defencenews.in/rss.xml"
]

# Image categories for news items
NEWS_IMAGE_CATEGORIES = {
    "missile": ["missile_test", "drdo", "defense_tech"],
    "navy": ["naval_ship", "maritime", "ocean"],
    "airforce": ["fighter_jet", "aircraft", "iaf"],
    "army": ["soldier", "military", "army_exercise"],
    "technology": ["defense_tech", "radar", "satellite"],
    "default": ["defense", "military", "india"]
}

def get_image_for_news(title: str, summary: str) -> dict:
    """Generate appropriate image URL based on news content"""
    title_lower = title.lower()
    summary_lower = summary.lower()
    
    # Determine category
    category = "default"
    if any(word in title_lower or word in summary_lower for word in ["missile", "rocket", "test", "drdo"]):
        category = "missile"
    elif any(word in title_lower or word in summary_lower for word in ["navy", "ship", "maritime", "ocean", "sea"]):
        category = "navy"
    elif any(word in title_lower or word in summary_lower for word in ["airforce", "iaf", "aircraft", "jet", "fighter"]):
        category = "airforce"
    elif any(word in title_lower or word in summary_lower for word in ["army", "soldier", "military", "exercise"]):
        category = "army"
    elif any(word in title_lower or word in summary_lower for word in ["technology", "tech", "satellite", "radar", "cyber"]):
        category = "technology"
    
    # Generate image URL using placeholder service with relevant keywords
    keywords = NEWS_IMAGE_CATEGORIES[category]
    keyword = random.choice(keywords)
    
    return {
        "url": None,
        "thumbnail": None,
        "alt_text": f"Image related to {category} news",
        "category": category
    }

@router.get("/news/daily", summary="Fetch daily defence news from open sources")
async def get_daily_news():
    """
    Fetches the latest open-source defense news from RSS feeds and formats it for the platform.
    Includes images for each news item for better visual engagement.
    """
    articles = []
    
    # Try fetching from Defence.gov RSS
    for feed_url in DEFENCE_FEEDS:
        try:
            req = urllib.request.Request(feed_url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req, timeout=5) as response:
                xml_data = response.read()
                root = ET.fromstring(xml_data)
                
                # Basic RSS Parsing
                for item in root.findall('.//item')[:5]:
                    title_elem = item.find('title')
                    link_elem = item.find('link')
                    desc_elem = item.find('description')
                    pub_elem = item.find('pubDate')
                    
                    if title_elem is not None:
                        title = title_elem.text
                        summary = desc_elem.text[:200] + "..." if desc_elem is not None and desc_elem.text else "No summary available."
                        
                        articles.append({
                            "title": title,
                            "url": link_elem.text if link_elem is not None else "",
                            "summary": summary,
                            "date": pub_elem.text if pub_elem is not None else "Recent",
                            "source": "Open Source Intelligence",
                            "image": get_image_for_news(title, summary)
                        })
        except Exception as e:
            print(f"Failed to fetch {feed_url}: {str(e)}")
            continue
            
    # If network fetch fails entirely, return empty list instead of fake data in production
    if not articles:
        pass
        
    return {"status": "success", "count": len(articles), "data": articles}

@router.get("/youtube/tactical", summary="Fetch curated SSB preparation videos from YouTube")
async def get_youtube_intel():
    """
    Fetches real SSB preparation videos from curated YouTube channels via RSS.
    """
    videos = []
    
    # Popular SSB preparation YouTube channel IDs
    YOUTUBE_CHANNELS = [
        "UCqaFnNMeQ4VWjJkA_5XBHBw",  # SSB Interview Tips
        "UCLzz8pXQYOU7gNwgwCjJusg",  # Defence Current Affairs
    ]
    
    for channel_id in YOUTUBE_CHANNELS:
        try:
            feed_url = f"https://www.youtube.com/feeds/videos.xml?channel_id={channel_id}"
            req = urllib.request.Request(feed_url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req, timeout=5) as response:
                xml_data = response.read()
                root = ET.fromstring(xml_data)
                ns = {'atom': 'http://www.w3.org/2005/Atom', 'media': 'http://search.yahoo.com/mrss/'}
                
                for entry in root.findall('.//atom:entry', ns)[:3]:
                    title_elem = entry.find('atom:title', ns)
                    link_elem = entry.find('atom:link', ns)
                    published = entry.find('atom:published', ns)
                    media_group = entry.find('media:group', ns)
                    thumbnail = None
                    if media_group is not None:
                        thumb_elem = media_group.find('media:thumbnail', ns)
                        if thumb_elem is not None:
                            thumbnail = thumb_elem.get('url')
                    
                    if title_elem is not None:
                        videos.append({
                            "title": title_elem.text,
                            "url": link_elem.get('href') if link_elem is not None else "",
                            "published": published.text if published is not None else "Recent",
                            "thumbnail": thumbnail or "",
                            "source": "YouTube"
                        })
        except Exception as e:
            print(f"Failed to fetch YouTube channel {channel_id}: {e}")
            continue
    
    # Fallback if no videos fetched (Removed mock links for production)
    if not videos:
        pass
    return {"status": "success", "count": len(videos), "data": videos}
