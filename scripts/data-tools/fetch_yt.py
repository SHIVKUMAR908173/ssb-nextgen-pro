import urllib.request, re, json

try:
    req = urllib.request.Request(
        'https://www.youtube.com/results?search_query=SSB+Interview+preparation',
        headers={'User-Agent': 'Mozilla/5.0'}
    )
    html = urllib.request.urlopen(req).read().decode('utf-8')
    video_ids = re.findall(r'"videoId":"([^"]{11})"', html)
    unique_ids = list(dict.fromkeys(video_ids))[:12]
    
    data = [
        {
            'title': f'SSB Preparation Masterclass {i+1}', 
            'channel': 'SSB Experts', 
            'duration': '15:00', 
            'thumb': f'https://i.ytimg.com/vi/{vid}/hqdefault.jpg', 
            'tag': 'SSB', 
            'url': f'https://www.youtube.com/watch?v={vid}'
        } for i, vid in enumerate(unique_ids)
    ]
    
    with open('frontend/src/data/youtube_masterclass.json', 'w') as f:
        json.dump(data, f, indent=2)
    print(f"Successfully saved {len(data)} YouTube videos")
except Exception as e:
    print(f"Error: {e}")
