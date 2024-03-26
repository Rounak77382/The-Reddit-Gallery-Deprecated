import praw
import requests
import os
import json
import traceback
from imgur_downloader import ImgurDownloader
import subprocess
from redgifs import API
import sys
api = API()
api.login()
from datetime import datetime, timezone


def urltolocalurl(url,post,name,output_dir,safe_title):
    try:
        if "reddit.com/gallery" in url:
            # This is a gallery post
            for i, media in enumerate(post.media_metadata.values()):
                media_url = media['s']['u']
                file_extension = os.path.splitext(media_url.split("?")[0])[1]  # Remove URL parameters
                file_path = os.path.join(f"{output_dir}/{name}", f'{safe_title}_{i}{file_extension}')
                if not os.path.exists(file_path):
                    response = requests.get(media_url)
                    with open(file_path, 'wb') as f:
                        f.write(response.content)
                        
            #images_data.append({'url': f"{output_dir}/{name}/{safe_title}_{i}{file_extension}", 'title': safe_title})    
            localurl=f"{output_dir}/{name}/{safe_title}_{i}{file_extension}"
                                
        elif "redgifs.com/watch" in url:
            # This is a redgifs post
            file_path = os.path.join(f"{output_dir}/{name}", f'{safe_title}.mp4')
            if not os.path.exists(file_path):
                result = api.get_gif(url.split("/")[-1])
                api.download(result.urls.hd, f'{output_dir}/{name}/{safe_title}.mp4')

                
            #images_data.append({'url': f'{output_dir}/{name}/{safe_title}.mp4'.replace("\\", "/"), 'title': safe_title})
            localurl = f'{output_dir}/{name}/{safe_title}.mp4'.replace("\\", "/")
                
                
                
                #https://v.redd.it/x2hinx0binu21
        elif "v.redd.it" in url:
            # This is a v.redd.it post
            file_path = os.path.join(f"{output_dir}/{name}", f'{safe_title}.mp4')
            if not os.path.exists(file_path):
                command = f"youtube-dl {url} -o \"{file_path}\""
                process = subprocess.Popen(command, shell=False)
                process.wait()
                
            #images_data.append({'url': f"{output_dir}/{name}/{safe_title}.mp4".replace("\\", "/"), 'title': safe_title})
            localurl = f"{output_dir}/{name}/{safe_title}.mp4".replace("\\", "/")
            
                
                #https://i.imgur.com/mQlSXHO.gifv
                #https://imgur.com/download/mQlSXHO
        elif "imgur.com" in url and url.endswith(".gifv"):
            # This is an imgur post
            file_name = f'{safe_title}.mp4'
            file_direct = f"{output_dir}/{name}"
            file_path = os.path.join(f"{file_direct}", f'{file_name}') 
            
            if not os.path.exists(file_name):
                command = f"gallery-dl {url} -D \"{file_direct}\" -f \"{file_name}\""

                process = subprocess.Popen(command, shell=True)
                process.wait()
                
              
            #images_data.append({'url': file_path.replace("\\", "/"), 'title': safe_title})   
            localurl = file_path.replace("\\", "/")    
                        
        elif "imgur.com" in url and (url.endswith(".jpg") or url.endswith(".png")):
            # This is an imgur post
            file_name = f'{safe_title}.jpg'
            file_direct = f"{output_dir}/{name}"
            file_path = os.path.join(f"{file_direct}", f'{file_name}') 
            
            if not os.path.exists(file_name):
                command = f"gallery-dl {url} -D \"{file_direct}\" -f \"{file_name}\""

                process = subprocess.Popen(command, shell=False)
                process.wait()
              
            #images_data.append({'url': file_path.replace("\\", "/"), 'title': safe_title})
            localurl = file_path.replace("\\", "/")
            
        else:
            # This is a single image post
            file_extension = os.path.splitext(url.split("?")[0])[1]
            if file_extension == "":
                return None
                
            file_path = os.path.join(f"{output_dir}/{name}", f'{safe_title}{file_extension}')
            if not os.path.exists(file_path):
                response = requests.get(url)
                with open(file_path, 'wb') as f:
                    f.write(response.content)
                    
            #images_data.append({'url': f"{output_dir}/{name}/{safe_title}{file_extension}".replace("\\", "/"), 'title': safe_title})
            localurl = f"{output_dir}/{name}/{safe_title}{file_extension}".replace("\\", "/")
    except:
        traceback.print_exc()
        return None
    return localurl


def postedsincecalc(post):
    time_difference = (datetime.now(timezone.utc) - datetime.fromtimestamp(post.created_utc, timezone.utc))
    time_since_post = [time_difference.seconds,
                        time_difference.seconds // 60,
                        time_difference.seconds // 3600,
                        time_difference.days,
                        time_difference.days // 30,
                        time_difference.days // 365]

    postedsince = "Unknown"
    
    for i in range(len(time_since_post)):
        if time_since_post[i] == 0:
            
            postedsince = str(time_since_post[i-1]) + " " + ["sec.", "min.", "hr.", "days", "mo.", "yr."][i-1] + " ago"
            return postedsince
        
    return str(time_since_post[-1]) + " yr. ago"

        
def download_images(subreddit_name, output_dir,limit=10,post_type="top",since="all"):
    #print(subreddit_name, output_dir)
    reddit = praw.Reddit(
        client_id = os.getenv('praw_api_client_id'),
        client_secret = os.getenv('praw_api_client_secret'),
        user_agent = "testscript by RS_ted ",
        redirect_uri = "http://localhost:5353"
    )

    name = subreddit_name

    subreddit = reddit.subreddit(name)
    #print(subreddit.top(limit=100))
    if post_type == "top":
        top_posts = subreddit.top(time_filter=since,limit=limit)
    elif post_type == "hot":
        top_posts = subreddit.hot(limit=limit)
    elif post_type == "new":
        top_posts = subreddit.new(limit=limit)
    elif post_type == "rising":
        top_posts = subreddit.rising(limit=limit)

    #input(f"Downloading {name} images to {output_dir}. Press Enter to continue...")
    # Create the directory if it doesn't exist
    if not os.path.exists(f"{output_dir}/{name}"):
        os.makedirs(f"{output_dir}/{name}")
 
    images_data = []
    #C:/Users/rouna/OneDrive/Desktop/Nodejs_intro/redditdownlaoder/reddit_gallery_project/reddit_gallery/media/subreddit_name
    for post in (top_posts):
        try:
            try:
                url = post.url
            except Exception as e:
                print(f"Error: {e}")
                url=None

            try:
                title = post.title
            except Exception as e:
                print(f"Error: {e}")

                title=None

            try:
                author = str(post.author)
            except Exception as e:
                print(f"Error: {e}")
     
                author=None

            try:
                authordp = post.author.icon_img
            except Exception as e:
                print(f"Error: {e}")
                authordp="https://i.redd.it/snoovatar/avatars/8658e16c-55fa-486f-b7c7-00726de2e742.png"

            try:
                postedsince = postedsincecalc(post)
            except Exception as e:
                print(f"Error: {e}")
 
                postedsince=None
            
            try:
                flair = str(post.link_flair_text)
            except:
                flair = "none"
            
            try:
                comments = f"{int(post.num_comments) // 1000}k" if int(post.num_comments) >= 1000 else int(post.num_comments)
            except Exception as e:
                print(f"Error: {e}")

                comments='NaN'

            try:
                upvotes = f"{int(post.score) // 1000}k" if int(post.score) >= 1000 else int(post.score)
            except Exception as e:
                print(f"Error: {e}")

                upvotes='NaN'

            try:
                downvotes = f"{int(post.score*(1-post.upvote_ratio)) // 1000}k" if int(post.score*(1-post.upvote_ratio)) >= 1000 else int(post.score*(1-post.upvote_ratio))
                #print("downvotes: ",post.upvote_ratio, post.score*(1-post.upvote_ratio))
            except Exception as e:
                print(f"Error: {e}")

                downvotes='NaN'

            try:
                safe_title = ''.join(c for c in f"{title} by {author}" if c.isalnum() or c in (' ',)).rstrip()
            except Exception as e:
                print(f"Error: {e}")

                safe_title=None
            localurl = urltolocalurl(url,post,name,output_dir,safe_title)
            if localurl == None:
                continue
            siteurl = "https://www.reddit.com"+str(post.permalink)
            userurl = "https://www.reddit.com/user/"+str(post.author)


            images_data.append({'url': localurl, 'title': safe_title, 'author': author,
                                'author_dp': authordp, 'posted_since': postedsince,
                                'flair': flair, 'comments': comments, 'upvotes': upvotes,
                                'downvotes': downvotes,'siteurl':siteurl,'userurl':userurl,'mediaurl':url})    
            
              
            print("["+json.dumps(images_data[-1])+"]")   
            
        except Exception as e:
            print(f"Error: {e}")
            traceback.print_exc()
            continue
 

#download_images("nsfw_gifs", "public\media", 10, "top", "all")

if __name__ == "__main__":

    # Command line arguments: subreddit name and output directory
    subreddit_name = sys.argv[1]
    output_dir = sys.argv[2] if len(sys.argv) > 2 else "public\media"
    limit = int(sys.argv[3]) if len(sys.argv) > 3 else 10
    post_type = sys.argv[4] if len(sys.argv) > 4 else "top"
    since = sys.argv[5] if len(sys.argv) > 5 else "all"

    download_images(subreddit_name, output_dir, limit, post_type, since)




# download_images(input("enter subrrdiit: "), "public\media")

# python downloader.py "swimsuitsuccubus" "public\media" 10 top all