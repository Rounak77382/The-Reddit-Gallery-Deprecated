import praw
import os

reddit = praw.Reddit(
        client_id = os.getenv('praw_api_client_id'),
        client_secret = os.getenv('praw_api_client_secret'),
        user_agent = "testscript by RS_ted ",
        redirect_uri = "http://localhost:5353"
    )

while True:

    print("Enter the subreddit: r/",end="")
    
    subreddit_results = reddit.subreddits.search_by_name(input(), include_nsfw=True)


    for index,subreddit in enumerate(subreddit_results):
        
        print(f"{index+1}.{subreddit.display_name}")
        
        

