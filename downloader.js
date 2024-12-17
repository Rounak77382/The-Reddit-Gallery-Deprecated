import snoowrap from 'snoowrap';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { toZonedTime } from 'date-fns-tz';
import ora from 'ora';
import util from 'util';
import {getGif} from 'redgif';
import process from 'node:process';
import e from 'express';
import qs from 'qs';

async function getAccessToken() {
    const authString = `${process.env.praw_api_client_id}:${process.env.praw_api_client_secret}`;
    const authBuffer = Buffer.from(authString, 'utf8');
    const authBase64 = authBuffer.toString('base64');
  
    const response = await axios.post('https://www.reddit.com/api/v1/access_token', qs.stringify({
      grant_type: 'client_credentials',
    }), {
      headers: {
        'Authorization': `Basic ${authBase64}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
  
    const r = new snoowrap({
        userAgent: 'testscript by RS_ted',
        clientId: process.env.praw_api_client_id,
        clientSecret: process.env.praw_api_client_secret,
        accessToken: response.data.access_token,
        });

    console.log("Access Token: ", r.accessToken);

    return r;
}

async function urltolocalurl(url, post, name, outputDir, safeTitle) {
    try {

        console.log("url: ", url);
        if (url.includes('reddit.com/gallery')) {
            // This is a gallery post

            const localUrls = [];
            for (let key in post.media_metadata) {
                //console.log("key: ", key);
                const media = post.media_metadata[key];
                if (media.e === "Image" || media.e === "AnimatedImage") {
                    let mediaUrl;
                    mediaUrl = media.s.gif ? media.s.gif : media.s.u;
                    //console.log("mediaUrl: ", mediaUrl);
                    const fileExtension = path.extname(mediaUrl.split('?')[0]);
                    const filePath = path.join(outputDir, `${safeTitle}_${key}${fileExtension}`);
                    if (!fs.existsSync(filePath)) {
                        const response = await axios.get(mediaUrl, { responseType: 'stream' });
                        const writer = fs.createWriteStream(filePath);
                        response.data.pipe(writer);
                        new Promise((resolve, reject) => {
                            writer.on('finish', resolve);
                            writer.on('error', reject);

                        localUrls.push(mediaUrl);
                            
                    });
                    }else{
                    localUrls.push(filePath.replace(/\\/g, '/'));
                    }
                    //console.log(`Downloaded ${filePath.replace(/\\/g, '/')}`);
                }
            }
            return localUrls;
        } else if (url.includes('redgifs.com/watch')) {
            // This is a redgifs vid
            const filePath = path.join(outputDir, `${safeTitle}.mp4`);
            if (!fs.existsSync(filePath)) {
                const gifId = url.split('/').pop().split('#')[0];
                const buffer = await getGif(gifId);
                const writer = fs.writeFileSync(filePath, buffer)
                
                new Promise((resolve, reject) => {
                    fs.writeFile(filePath, buffer, (err) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve();
                        }
                    });
                });
                return filePath.replace(/\\/g, '/');
            }
            else {
            return filePath.replace(/\\/g, '/');
            }
        }
        else if (url.includes('i.redgifs')) {
            // This is a redgifs image
            const filePath = path.join(outputDir, `${safeTitle}.jpg`);
            if (!fs.existsSync(filePath)) {
                const gifId = url.split('/').pop().split('#')[0].split('.')[0];
                const buffer = await getGif(gifId);
                

                new Promise((resolve, reject) => {
                    fs.writeFile(filePath, buffer, (err) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve();
                        }
                    });
                });

                return filePath.replace(/\\/g, '/');
            }
            return filePath.replace(/\\/g, '/');
        }

        else if (url.includes('v.redd.it')) {
            // This is a v.redd.it post
            //console.log("!!!This is a v.redd.it post!!!");
            const filePath = path.join(outputDir, `${safeTitle}.mp4`);
            if (!fs.existsSync(filePath)) {
                //console.log("!!!Debugging!!!   ", post);
                
                const child = exec(`youtube-dl ${url} -o "${filePath}"`);
                new Promise((resolve, reject) => {
                    child.on('close', resolve);
                    child.on('error', reject);
                });

                return post.secure_media.reddit_video.hls_url;
            }
            else {  
            return filePath.replace(/\\/g, '/');
            }
        } else if (url.includes('imgur.com') && url.endsWith('.gifv')) {
            // This is an imgur post
            const fileName = `${safeTitle}.mp4`;
            const fileDir = path.join(outputDir);
            const filePath = path.join(fileDir, fileName);
            if (!fs.existsSync(filePath)) {
                const child = exec(`gallery-dl ${url} -D "${fileDir}" -f "${fileName}"`);
                await new Promise((resolve, reject) => {
                    child.on('close', resolve);
                    child.on('error', reject);
                });
            }
            return filePath.replace(/\\/g, '/');
        } else if (url.includes('imgur.com') && (url.endsWith('.jpg') || url.endsWith('.png'))) {
            // This is an imgur post
            const fileName = `${safeTitle}.jpg`;
            const fileDir = path.join(outputDir);
            const filePath = path.join(fileDir, fileName);
            if (!fs.existsSync(filePath)) {
                const child = exec(`gallery-dl ${url} -D "${fileDir}" -f "${fileName}"`);
                await new Promise((resolve, reject) => {
                    child.on('close', resolve);
                    child.on('error', reject);
                });
            }
            return filePath.replace(/\\/g, '/');
        } else {
            // This is a single image post
            const fileExtension = path.extname(url.split('?')[0]);
            if (!fileExtension) return url;
            const filePath = path.join(outputDir, `${safeTitle}${fileExtension}`);
            if (!fs.existsSync(filePath)) {
                const response = await axios.get(url, { responseType: 'stream' });
                console.log("response: ", response);
                const writer = fs.createWriteStream(filePath);
                response.data.pipe(writer);
                new Promise((resolve, reject) => {
                    writer.on('finish', resolve);
                    writer.on('error', reject);
                });
                return url;
            }
            else {
                return filePath.replace(/\\/g, '/');
            }
        }
    } catch {
        console.log("Error in urltolocalurl");
        return url;
    }
}

function postedSinceCalc(post) {
    const units = [
        { name: "yr.", ms: 12 * 30 * 24 * 60 * 60 * 1000 },
        { name: "mo.", ms: 30 * 24 * 60 * 60 * 1000 },
        { name: "day", ms: 24 * 60 * 60 * 1000 },
        { name: "hr.", ms: 60 * 60 * 1000 },
        { name: "min.", ms: 60 * 1000 },
        { name: "sec.", ms: 1000 }
    ];

    let timeDifference = Date.now() - (post.created_utc * 1000);

    for (let unit of units) {
        const value = Math.floor(timeDifference / unit.ms);
        if (value > 0) {
            return `${value} ${unit.name} ago`;
        }
    }
    return "just now";
}

export async function* downloadImages(subredditName, outputDir = './public/media', limit = 10, postType = 'top', since = 'all',r = null, signal = null) {

    if (!r){
        r = await getAccessToken();
        console.log("guest mode");
    } else
    {
        console.log("user mode");
    }

    const snooWrap = new snoowrap({
        userAgent: r.userAgent,
        clientId: r.clientId,
        clientSecret: r.clientSecret,
        refreshToken: r.refreshToken,
        accessToken: r.accessToken
    });

    r = snooWrap;
    
    console.log("r: ", r);

    const spinner = ora('Fetching posts...').start();
    let name = subredditName;

    let subreddit;
    let Posts;
    if (name === ''){
        Posts = await r.getHot();
        name = '_other_';
    }
    else{

        subreddit = await r.getSubreddit(name);
        switch (postType) {
            case 'top':
                Posts = await subreddit.getTop({ time: since, limit });
                break;
            case 'hot':
                Posts = await subreddit.getHot({ limit });
                break;
            case 'new':
                Posts = await subreddit.getNew({ limit });
                break;
            case 'rising':
                Posts = await subreddit.getRising({ limit });
                break;
            default:
                Posts = await subreddit.getTop({ time: since, limit });
        }
    }

    spinner.stop();

    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }


    const outputPath = outputDir + '/' + name;
    if (!fs.existsSync(outputPath)) {
        fs.mkdirSync(outputPath, { recursive: false });
    }

    for (const post of Posts) {

        if (signal && signal.aborted) {
            console.log('Generator aborted.');
            return;
          }

        let url;

        try {
            url = post.url;
            let aspectRatio;
            if (post.is_gallery) {
                const galleryData = post.media_metadata;
                let maxAspectRatio = -1;
                for (let key in galleryData) {
                    const media = galleryData[key];
                    if (media.e === "Image" || media.e === "AnimatedImage") {
                        const aspectRatio = media.s.x/media.s.y;
                        if (aspectRatio > maxAspectRatio) {
                            maxAspectRatio = aspectRatio;
                        }
                    }
                }
                aspectRatio = maxAspectRatio;
            }

            else if (post.is_video && post.is_reddit_media_domain == true) {
                aspectRatio = post.secure_media.reddit_video.width / post.secure_media.reddit_video.height;
            }

            
            
            else if (post.is_reddit_media_domain == false && post.preview && post.preview.reddit_video_preview != null) {

                aspectRatio = post.preview.reddit_video_preview.width / post.preview.reddit_video_preview.height;

            }

            
            else if (post.preview && post.preview.images[0].source != null) {
                try {
                    aspectRatio = post.preview.images[0].source.width / post.preview.images[0].source.height;
                } catch {
                    aspectRatio = NaN;
                }
            }

        
            const title = post.title;
            const author = post.author.name;
            let authorDp;
            try {
                authorDp = await post.author.icon_img;
                if (!authorDp) {
                    authorDp = 'https://i.redd.it/snoovatar/avatars/8658e16c-55fa-486f-b7c7-00726de2e742.png';
                }
            } catch {
                authorDp = 'https://i.redd.it/snoovatar/avatars/8658e16c-55fa-486f-b7c7-00726de2e742.png';
            }
            const postedSince = postedSinceCalc(post);
            const flair = post.link_flair_text || 'none';
            const comments = post.num_comments >= 1000 ? `${Math.floor(post.num_comments / 1000)}k` : post.num_comments.toString();
            const upvotes = post.score >= 1000 ? `${Math.floor(post.score / 1000)}k` : post.score.toString();
            const downvotes = Math.floor(post.score * (1 - post.upvote_ratio)) >= 1000 ? `${Math.floor(post.score * (1 - post.upvote_ratio) / 1000)}k` : Math.floor(post.score * (1 - post.upvote_ratio)).toString();
            const isNSFW = post.over_18;
            const safeTitle = `${title} by ${author}`.replace(/[^a-zA-Z0-9 ]/g, '').trim();

            // const fileExists = fs.existsSync(path.join(outputPath, `${safeTitle}.*`));
    
                const localUrl = await urltolocalurl(url, post, name, outputPath, safeTitle);
                if (localUrl) {
                    const imageData = {
                        url: localUrl,
                        aspect_ratio: aspectRatio,
                        title: title,
                        author,
                        author_dp: authorDp,
                        posted_since: postedSince,
                        flair,
                        comments,
                        upvotes,
                        downvotes,
                        siteurl: `https://www.reddit.com${post.permalink}`,
                        userurl: `https://www.reddit.com/user/${author}`,
                        mediaurl: url,
                        isNSFW: isNSFW
                    };
                    yield imageData;
                    //console.log(JSON.stringify(imageData));
                }

        } catch (err) {
            
            console.error("Error in url:",url);
            console.error(err);
            yield { error: err };
            console.log("Error in url:",url);
            console.log('Error :' + err);
        }
    }

}



// export async function* downloadImages(subredditName, outputDir, limit = 10, postType = 'top', since = 'all') {
//     let spinner = ora('Fetching posts...').start();
//     const name = subredditName;

//     let url;
//     switch (postType) {
//         case 'top':
//             url = `https://www.reddit.com/r/${name}/top.json?t=${since}&limit=${limit}`;
//             break;
//         case 'hot':
//             url = `https://www.reddit.com/r/${name}/hot.json?limit=${limit}`;
//             break;
//         case 'new':
//             url = `https://www.reddit.com/r/${name}/new.json?limit=${limit}`;
//             break;
//         case 'rising':
//             url = `https://www.reddit.com/r/${name}/rising.json?limit=${limit}`;
//             break;
//         default:
//             url = `https://www.reddit.com/r/${name}/top.json?t=${since}&limit=${limit}`;
//     }

//     console.log("url: ", url);

//     let response;
//     try {
//         response = await axios.get(url);
//         //console.log(response);
//     } catch (error) {
//         console.error(`Error fetching posts: ${error}`);
//         return;
//     }
//     spinner.stop();

//     const outputPath = outputDir + '/' + name;
//     if (!fs.existsSync(outputPath)) {
//         fs.mkdirSync(outputPath, { recursive: false });
//     }

//     const Posts = response.data.data.children.map(child => child.data);
//     let authorResponse;
//     for(const post of Posts) {

//         spinner = ora(`Downloading ${post.title}...`).start();

//         try {

//             const url = post.url;
//             const title = post.title;
//             const author = post.author;
//             let authorDp;
//             if (post.author != '[deleted]') {
//                 try {
//                     authorResponse = await axios.get(`https://www.reddit.com/user/${post.author}/about.json`);
//                     //console.log("authorResponse: ", authorResponse);
//                     authorDp = authorResponse.data.data.icon_img.split('?')[0];

//                 } catch (error) {
//                     authorDp = 'https://i.redd.it/snoovatar/avatars/8658e16c-55fa-486f-b7c7-00726de2e742.png';
//                 }
//             }else {
//                 authorDp = 'https://i.redd.it/snoovatar/avatars/8658e16c-55fa-486f-b7c7-00726de2e742.png';
//             }
//             const postedSince = postedSinceCalc(post);
//             const flair = post.link_flair_text || 'none';
//             const comments = post.num_comments >= 1000 ? `${Math.floor(post.num_comments / 1000)}k` : post.num_comments.toString();
//             const upvotes = post.score >= 1000 ? `${Math.floor(post.score / 1000)}k` : post.score.toString();
//             const downvotes = Math.floor(post.score * (1 - post.upvote_ratio)) >= 1000 ? `${Math.floor(post.score * (1 - post.upvote_ratio) / 1000)}k` : Math.floor(post.score * (1 - post.upvote_ratio)).toString();
//             const isNSFW = post.over_18;
//             const safeTitle = `${title} by ${author}`.replace(/[^a-zA-Z0-9 ]/g, '').trim();

//             const fileExists = fs.existsSync(path.join(outputPath, `${safeTitle}.*`));

//             const localUrl = await urltolocalurl(url, post, name, outputPath, safeTitle);

//             if (localUrl) {
//                 const imageData = {
//                     url: Array.isArray(localUrl) ? localUrl : localUrl,
//                     title: title,
//                     author,
//                     author_dp: authorDp,
//                     posted_since: postedSince,
//                     flair,
//                     comments,
//                     upvotes,
//                     downvotes,
//                     siteurl: `https://www.reddit.com${post.permalink}`,
//                     userurl: `https://www.reddit.com/user/${author}`,
//                     mediaurl: url,
//                     isNSFW: isNSFW
//                 };
//                 //console.log(JSON.stringify(imageData));
//                 yield imageData;
//             }
//         }
//         catch (err) {
//             console.error(err);
//             yield { error: err };
//             console.log('Error :' + err);
//         }

//         spinner.stop();
//     } 
// }


// if (process.argv.length > 2) {
//     const [, , subredditName, outputDir = 'public/media', limit = 10, postType = 'top', since = 'all'] = process.argv;
//     downloadImages(subredditName, outputDir, limit, postType, since);
//   }

// const imageGenerator = downloadImages('news', './public/media', 2, 'top', 'today');

// for await (const value of imageGenerator) {
//     if (value instanceof Promise) {
//         await value; // Wait for the download promise to resolve
//     } else {
//         // Do something with the imageData object
//         console.log(value);
//     }
// }