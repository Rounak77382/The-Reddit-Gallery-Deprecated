import youtube_dl

video_url = 'https://v.redd.it/1twjzdaytfsc1'

with youtube_dl.YoutubeDL({'format': 'bestvideo', 'verbose': False}) as ydl:
    video_info = ydl.extract_info(video_url, download=False)

print(video_info.get('url', 'No video found.'))