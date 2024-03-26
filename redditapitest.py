import praw
import requests
import os
import json
import traceback
from imgur_downloader import ImgurDownloader
import subprocess
from redgifs import API
from datetime import datetime
api = API()
api.login()

#print(subreddit_name, output_dir)
reddit = praw.Reddit(
    client_id = os.getenv('praw_api_client_id'),
    client_secret = os.getenv('praw_api_client_secret'),
    user_agent = "testscript by RS_ted ",
    redirect_uri = "http://localhost:5353"
)
 
name = "cosplaygirls"
subreddit = reddit.subreddit(name)
top_posts = subreddit.top(time_filter="month",limit=1)
#get the subreddit profile picture


for posts in top_posts:

    print("URL: ", posts.url)
    print("Title: ", posts.title)
    print("Author: ", posts.author)
    #print author profile picture
    print("Author Profile Picture: ", posts.author.icon_img)
    #print("Author Flair Text: ", posts.author_flair_text)
    #print("Clicked: ", posts.clicked)
    #print("Comments: ", posts.comments)
    print("Creation Time: ", datetime.fromtimestamp(posts.created_utc).strftime('%H:%M %d-%m-%Y '))
    #print("Distinguished: ", posts.distinguished)
    #print("Edited: ", posts.edited)
    print("ID: ", posts.id)
    #print("Is Original Content: ", posts.is_original_content)
    #print("Is Selfpost: ", posts.is_self)
    #print("Link Flair ID: ", posts.link_flair_template_id)
    print("Link Flair Text: ", posts.author_flair_text)
    #print("Locked: ", posts.locked)
    print("Name: ", posts.name)
    print("Number of Comments: ", posts.num_comments)
    print("NSFW: ", posts.over_18)
    #print("Permalink: ", posts.permalink)
    try:
        print("Poll Data: ", posts.poll_data)
    except Exception as e:
        print("Poll Data: ", None)
    #print("Saved: ", posts.saved)
    
    #print("Self Text: ", posts.selftext)
    #print("Spoiler: ", posts.spoiler)
    #print("Stickied: ", posts.stickied)
    print("Subreddit: ", posts.subreddit)
    #print("Upvote Ratio: ", posts.upvote_ratio)
    print("Upvote: ", posts.score)
    print("Downvotes: ", int(posts.score*(1-posts.upvote_ratio)))
    
    
    # for comment in posts.comments:
    #     print("-----------------------------")
    #     print("Body:\n" , comment.body)
    #     print("By" , comment.author)    
    
    #https://www.reddit.com/1bg0y6o