const socket = io();


socket.on('image', (imageData) => {
    displayImage(imageData);
});


// fetch('/subreddits')
//     .then(response => response.json())
//     .then(subredditNames => {
//         const datalist = document.getElementById('subreddits');
//         subredditNames.forEach(name => {
//             const option = document.createElement('option');
//             option.value = name;
//             datalist.appendChild(option);
//         });
//     })
//     .catch(error => console.error('Error:', error));

let timer;
document.getElementById('subredditName').addEventListener('input', (e) => {
    clearTimeout(timer);
    timer = setTimeout(async () => {
        const subredditName = e.target.value;
        const response = await fetch(`/subreddits/${subredditName}`);
        const subredditResults = await response.json();
        console.log(subredditResults);

        const datalist = document.getElementById('subreddits');
        datalist.innerHTML = '';
        subredditResults.forEach(name => {
            const option = document.createElement('option');
            option.value = name;
            datalist.appendChild(option);
        });
    }, 100);
});

document.getElementById('redditForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    // Clear the gallery
    const gallery = document.getElementById('gallery');
    while (gallery.firstChild) {
        gallery.removeChild(gallery.firstChild);
    }
    gallery.style.borderBottom = 'none';

    const subredditName = document.getElementById('subredditName').value;
    const postLimit = document.getElementById('postLimit').value;
    const postType = document.getElementById('postType').value;
    const postTime = document.getElementById('postTime').value;
    console.log(subredditName, postLimit, postType, postTime);
    const response = await fetch('/download', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ subredditName , postLimit , postType , postTime})
    });

    if (!response.ok) {
        console.error('Failed to download images');
    }
});


function displayImage(imageData) {
    console.log("Received image data:", imageData);
    if (Array.isArray(imageData) && imageData.length > 0) {
        const image = imageData[0];
        const gallery = document.getElementById('gallery');
    
        // Create the media container
        const mediaContainer = document.createElement('div');
        mediaContainer.id = 'media';
    
        // Create the card container
        const cardContainer = document.createElement('div');
        cardContainer.id = 'card';
    
        // Create the upper slider container
        const upperSlider = document.createElement('div');
        upperSlider.id = 'upperslider';
    
        // Create the user info anchor element
        const userInfo = document.createElement('a');
        userInfo.href = image.userurl;
        userInfo.id = 'userinfo';
    
        // Create and set attributes for profile picture
        const profilePic = document.createElement('img');
        profilePic.id = 'profilepic';
        profilePic.src = image.author_dp;
        profilePic.alt = '';
    
    // Create and set attributes for username
    const username = document.createElement('div');
    username.id = 'reditor';
    username.title = image.author;

    const regex = /[\ud800-\udbff][\udc00-\udfff]|[\s\S]/g;

    // Convert the author name to an array of Unicode characters
    const authorArray = image.author.match(regex);
    const flairArray = image.flair.match(regex);
    console.log(authorArray);
    console.log(flairArray);

    if (image.flair.toLowerCase() === 'none') {
        if (authorArray.length > 25) {
            username.textContent = authorArray.slice(0, 25).join('') + '.';
        } else {
            username.textContent = image.author;
        }
    } 
    else {
        if (authorArray.length > 15) {
            username.textContent = authorArray.slice(0, 13).join('') + '.';
        } else {
            username.textContent = image.author;
        }
    }
                
        
        // Create and set attributes for user flair
        const flair = document.createElement('div');
        flair.id = 'flair';
        flair.title = image.flair;
        if (flairArray.length > 9) {
            flair.textContent = image.flair.substring(0, 8);
        } else {
            flair.textContent = image.flair;
        }
    
        // Create and set attributes for dot image
        const dotImage = document.createElement('img');
        dotImage.id = 'dot';
        dotImage.src = '/icons/dot.svg';
        dotImage.alt = '';
    
        // Create and set attributes for time since post
        const since = document.createElement('div');
        since.id = 'since';
        since.title = image.posted_since;   
        since.textContent = image.posted_since;
    
        // Append user info elements to the user info anchor
        userInfo.appendChild(profilePic);
        userInfo.appendChild(username);
        if (image.flair.toLowerCase() !== 'none'){
            userInfo.appendChild(flair);
        }
        userInfo.appendChild(dotImage);
        userInfo.appendChild(since);
    
        // Create and set attributes for post title
        const postTitle = document.createElement('p');
        postTitle.id = 'title';
        postTitle.title = image.title;
        postTitle.textContent = image.title;
    
        // Append user info and post title to the upper slider container
        upperSlider.appendChild(userInfo);
        upperSlider.appendChild(postTitle);
    
        // Create the lower slider anchor element
        const lowerSlider = document.createElement('a');
        lowerSlider.href = image.siteurl;
        lowerSlider.id = 'lowerslider';
    
        // Create and set attributes for votes container
        const votesContainer = document.createElement('div');
        votesContainer.id = 'votes';
    
        // Create and set attributes for upvote image
        const upvoteImage = document.createElement('img');
        upvoteImage.id = 'upvote';
        upvoteImage.src = '/icons/upvote.png';
        upvoteImage.alt = '';
    
        // Create and set attributes for upvote count
        const upvoteCount = document.createElement('div');
        upvoteCount.id = 'upCount';
        upvoteCount.textContent = image.upvotes;
    
        // Create and set attributes for downvote image
        const downvoteImage = document.createElement('img');
        downvoteImage.id = 'downvote';
        downvoteImage.src = '/icons/downvote.png';
        downvoteImage.alt = '';
    
        // Create and set attributes for downvote count
        const downvoteCount = document.createElement('div');
        downvoteCount.id = 'downCount';
        downvoteCount.textContent = image.downvotes;
    
        // Append voting elements to the votes container
        votesContainer.appendChild(upvoteImage);
        votesContainer.appendChild(upvoteCount);
        votesContainer.appendChild(downvoteImage);
        votesContainer.appendChild(downvoteCount);
    
        // Create and set attributes for comments container
        const commentsContainer = document.createElement('div');
        commentsContainer.id = 'comments';
    
        // Create and set attributes for comment image
        const commentImage = document.createElement('img');
        commentImage.id = 'comment';
        commentImage.src = '/icons/comment.svg';
        commentImage.alt = '';
    
        // Create and set attributes for comment count
        const commentCount = document.createElement('div');
        commentCount.id = 'commentCount';
        commentCount.textContent = image.comments;
    
        // Append comment elements to the comments container
        commentsContainer.appendChild(commentImage);
        commentsContainer.appendChild(commentCount);
    
        // Append votes and comments containers to the lower slider anchor
        lowerSlider.appendChild(votesContainer);
        lowerSlider.appendChild(commentsContainer);
    
        // Append upper and lower sliders to the card container
        cardContainer.appendChild(upperSlider);
        cardContainer.appendChild(lowerSlider);
    
        // Create and set attributes for media element (image or video)
        let mediaElement;
        if (/\.(jpe?g|png|gif|bmp)$/i.test(image.url)) {
            mediaElement = new Image();
            mediaElement.src = `${image.url.trim().replace('public/', '')}`;
            mediaElement.alt = image.title;
        } else if (/\.(mp4|webm|ogg)$/i.test(image.url)) {



            mediaElement = document.createElement('div');
            mediaElement.className = 'video-container';
            mediaElement.id = 'content';
            const video = document.createElement('video');
            video.preload = 'auto';
            video.volume = 0.1;
            video.src = `${image.url.trim().replace('public/', '')}`;
            video.alt = image.title;
            mediaElement.appendChild(video);
            addCustomControls(mediaElement);

        } else {
            console.error("Invalid image data:", imageData);
            return;
        }

        // mediaElement.addEventListener('mouseover', function() {
        //     this.controls = true;
        //     mediaElement.volume = 0.1;
        // });
        // mediaElement.addEventListener('mouseout', function() {
        //     this.controls = false;
        // });
    
        mediaElement.onerror = function(e) {
            console.error("Failed to load media:", image.url);
            console.error("Error details:", e);
            gallery.removeChild(mediaContainer);
        };
        
        mediaElement.id = 'content';
        
    
        // Append card container to the media container
        mediaContainer.appendChild(cardContainer);
        mediaContainer.appendChild(mediaElement);
    
        // Append the media container to the gallery
        gallery.appendChild(mediaContainer);
    } else {
        console.error("Invalid image data:", imageData);
    }
}

document.getElementById('postType').addEventListener('change', function() {
    var postTime = document.getElementById('postTime');
    if (this.value === 'top') {
        postTime.style.display = 'block';
    } else {
        postTime.style.display = 'none';
    }
});



socket.on('pythonProcessClosed', () => {
    const gallery = document.getElementById('gallery');
    gallery.style.borderBottom = '#1a282d 1px solid';
});

socket.on('pythonProcessStarted', () => {
    
});