
const socket = io();

let stoprendering = false;
let finished = true;
let abortController = new AbortController();
let allowNSFW = false;
let totalWidth = 0;
let totalmedia = 0;
let Widths = [];

var dropdownMenu = document.getElementById('dropdownMenu');

document.getElementById('profilePic').addEventListener('click', function (event) {
    event.stopPropagation();
    dropdownMenu.style.display = dropdownMenu.style.display === 'none' ? 'block' : 'none';
});

document.addEventListener('click', function () {
    dropdownMenu.style.display = 'none';
});

dropdownMenu.addEventListener('click', function (event) {
    event.stopPropagation();
});

document.getElementById('nsfw').querySelector('button').addEventListener('click', () => {
    const nsfwText = document.getElementById('nsfw').querySelector('button');
    const nsfwbutton = document.getElementById('nsfw')
    const toggleNSFW = document.getElementById('toggleNSFW');
    
    nsfwText.textContent = (nsfwText.textContent === 'NSFW') ? 'SFW' : 'NSFW';

    if (nsfwText.textContent === 'NSFW') {
        console.warn("NSFW content Enabled");
        allowNSFW = true;
        toggleNSFW.checked = false;
        nsfwbutton.style.backgroundColor = '#ff4500';
        nsfwText.style.fontWeight = '700';
        const elements = document.getElementsByClassName('blur');
        for (let i = 0; i < elements.length; i++) {
            elements[i].style.visibility = 'hidden';
        }
    }
    else {
        nsfwbutton.style.backgroundColor = '';
        allowNSFW = false;
        toggleNSFW.checked = true;
        nsfwText.style.fontWeight = '400';
        const elements = document.getElementsByClassName('blur');
        for (let i = 0; i < elements.length; i++) {
            elements[i].style.visibility = 'visible';
        }
    }
});

document.getElementById('toggleNSFW').addEventListener('change', function() {
    const nsfwText = document.getElementById('nsfw').querySelector('button');
    const nsfwbutton = document.getElementById('nsfw')
    if(!this.checked) {
        console.warn("NSFW content Enabled");
        allowNSFW = true;
        nsfwbutton.style.backgroundColor = '#ff4500';
        nsfwText.style.fontWeight = '700';
        nsfwText.textContent = 'NSFW';
        const elements = document.getElementsByClassName('blur');
        for (let i = 0; i < elements.length; i++) {
            elements[i].style.visibility = 'hidden';
        }
        console.log('Safe Search is enabled');
    } else {
        nsfwbutton.style.backgroundColor = '';
        allowNSFW = false;
        nsfwText.style.fontWeight = '400';
        nsfwText.textContent = 'SFW';
        const elements = document.getElementsByClassName('blur');
        for (let i = 0; i < elements.length; i++) {
            elements[i].style.visibility = 'visible';
        }
        console.log('Safe Search is disabled');
    }
});

socket.on('authorized', (userIsAuthorized) => {
    console.log('User is authorized:',userIsAuthorized);
    const loginBtn = document.getElementById('loginButton');
    loginBtn.style.display = userIsAuthorized ? 'none' : 'flex';
    const loginItem = document.getElementById('loginitem');
    loginItem.style.display = userIsAuthorized ? 'none' : 'flex';
    const logoutItem = document.getElementById('logoutitem');
    logoutItem.style.display = userIsAuthorized ? 'flex' : 'none';
    const profiledetails = document.getElementById('viewprofile');
    profiledetails.style.display = userIsAuthorized ? 'flex' : 'none';
});



socket.on('profilepicture', (dp) => {
    console.log("Profile Picture: ", dp);
    const profilePic = document.getElementById('profilePic').querySelector('img');
    profilePic.src = dp;
    const profilePic_2 = document.getElementById('profilePic_2').querySelector('img');
    profilePic_2.src = dp;
});

socket.on('username', (name) => {
    console.log("Username: ", name);
    const username = document.getElementById('viewprofilebutton').getElementsByTagName('span')[0];
    username.textContent = "u/" + name;
    const viewprofile = document.getElementById('viewprofilebutton').getElementsByTagName('button')[0];
    viewprofile.onclick = function() {
        window.open('https://www.reddit.com/user/' + name, '_blank');
    };
});


socket.on('image', (imageData) => {
    if (!stoprendering) {
        finished = false;
        displayImage(imageData, allowNSFW);
        socket.emit('imageReceived');
    }
});

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

socket.on('clearGallery', () => {
    const gallery = document.getElementById('gallery');
    while (gallery.firstChild) {
        gallery.removeChild(gallery.firstChild);
    }
    gallery.style.borderBottom = 'none';
});

document.getElementById('redditForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    stoprendering = true;

    socket.emit('stopDownloadProcess');

    if (!finished) {
        await new Promise(resolve => setTimeout(resolve, 1000));
    }


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
    
    const responsePromise = fetch('/download', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ subredditName, postLimit, postType, postTime })
    });
    const stoprenderingPromise = new Promise((resolve) => {
        stoprendering = false
        resolve();
    });

    await Promise.all([responsePromise, stoprenderingPromise]);
    


});



const loginBtns = document.querySelectorAll('#loginBtn');
loginBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        var w = window.innerWidth * 0.5;
        var h = window.innerHeight * 0.75;
        var left = (screen.width/2)-(w/2);
        var top = (screen.height/2)-(h/2);
        window.open('http://localhost:3000/authorize', '_blank', 'width='+w+',height='+h+',top='+top+',left='+left);
    });
});

window.onload = function() {
    var scaleSlider = document.getElementById('scaleSlider');
    var scaleValue = document.getElementById('scaleValue');

    scaleSlider.oninput = function() {
        var value = parseFloat(this.value);
        scaleValue.textContent = value.toFixed(3);
    };
};

document.getElementById('toggleSmartScale').addEventListener('change', function() {
    if(this.checked) {
        // The checkbox is checked
        console.log('SmartScale is checked');
    } else {
        // The checkbox is not checked
        console.log('SmartScale is not checked');
    }
});

let validValues = [];
let backupvalidValues = [];

validValues = new Proxy(validValues, {
    set: function(target, property, value, receiver) {
        //console.log(`Array modified. Property: ${property}, Value: ${value}`);
        return Reflect.set(target, property, value, receiver);
    }
});

let closest = null;
let ScaleSlider = document.getElementById('scaleSlider');

document.getElementById('toggleSmartScale').addEventListener('change', function() {
    if(this.checked) {
        
        validValues = backupvalidValues.slice();
        if (closest !== null) {
            document.getElementById('gallery').style.zoom = closest;
            ScaleSlider.value = closest;
            let event = new Event('input', {
                bubbles: true,
                cancelable: true,
                });
            
            ScaleSlider.dispatchEvent(event);
        }
        console.log('Smart Scale is enabled');
    } else {

        backupvalidValues = validValues.slice();
        validValues.length = 0;
        console.log('Smart Scale is disabled');
    }
});


document.getElementById('scaleSlider').addEventListener('input', function (event) {
    let zoomLevel = parseFloat(event.target.value);
    const gallery = document.getElementById('gallery');
    const elements = gallery.getElementsByTagName('*');


    if (!validValues.includes(zoomLevel)) {
        if (validValues.length !== 0) {
            zoomLevel = validValues.reduce((prev, curr) =>
                Math.abs(curr - zoomLevel) < Math.abs(prev - zoomLevel) ? curr : prev
            );
        }

        // Set the slider to the nearest valid value
        event.target.value = zoomLevel;
    }

    gallery.style.zoom = zoomLevel;
});

socket.on('galleryUpdated', () => {

    finished = true;
    console.log("!!!!Gallery updated!!!!");
    const gallery = document.getElementById('gallery');
    gallery.style.borderBottom = '#1a282d 1px solid';
    console.log("average width: ", totalWidth / totalmedia);
    console.log("Widths: ", Widths.join(", "));
    const bodyWidth = document.body.offsetWidth;
    console.log("Total Width:", bodyWidth);

    let galleryMarginStyle = window.getComputedStyle(gallery).getPropertyValue('margin');
    let galleryMargin = galleryMarginStyle.substring(0, galleryMarginStyle.length - 2);
    console.log("Gallery Margin:", galleryMargin);

    let mediaMarginStyle = window.getComputedStyle(document.getElementById('media')).getPropertyValue('margin');
    let mediaMargin = mediaMarginStyle.substring(0, mediaMarginStyle.length - 2);
    console.log("Media Margin:", mediaMargin);

    const newValues = minimumgap(Widths, bodyWidth, galleryMargin, mediaMargin);
    validValues.length = 0; // Clear the array
    newValues.forEach(value => validValues.push(value)); // Fill the array with new values

    console.log("Valid values:", validValues);

    closest = validValues.reduce((prev, curr) =>
        Math.abs(curr - 1) < Math.abs(prev - 1) ? curr : prev
    );

    document.getElementById('gallery').style.zoom = closest;
    
    
    ScaleSlider.value = closest;

    let event = new Event('input', {
    bubbles: true,
    cancelable: true,
    });

    // Dispatch the event
    ScaleSlider.dispatchEvent(event);




    totalWidth = 0;
    totalmedia = 0;
    Widths = [];
});

function displayImage(imageData, allowNSFW) {
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
        if (image.flair.toLowerCase() !== 'none') {
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

        

        if (image.isNSFW) {
            // Create and set attributes for blur container
            const blurContainer = document.createElement('div');
            blurContainer.className = 'blur';
            blurContainer.style.visibility = image.isNSFW && !allowNSFW ? 'visible' : 'hidden';
            // Create and set attributes for eye image
            const eyeImage = document.createElement('img');
            eyeImage.className = 'eye';
            eyeImage.src = 'icons/eye.png';
            eyeImage.alt = 'NSFW';

            // Append eye image to the blur container
            blurContainer.appendChild(eyeImage);

            // Append NSFW container to the card container
            mediaContainer.appendChild(blurContainer);
        }

        

        // Create and set attributes for media element (image or video)
        let mediaElement;
        if (Array.isArray(image.url) && image.url.length > 1) {
            mediaElement = document.createElement('div');
            mediaElement.className = 'slider-container';
            mediaElement.id = 'content';
        
            let leftArrow = document.createElement('div');
            leftArrow.className = 'arrow left';
            leftArrow.onclick = slideLeft;
            leftArrow.innerHTML = '&#10094;';
            mediaElement.appendChild(leftArrow);

        
            image.url.forEach((url, index) => {
                let slide = new Image();
                slide.onload = function() {
                    // Calculate the width based on the height and the aspect ratio
                    let aspectRatio = this.width / this.height;
                    let calculatedWidth = mediaElement.offsetHeight * aspectRatio;
        
                    // Update the width of the mediaElement if this image is wider
                    if (calculatedWidth > mediaElement.offsetWidth) {
                        mediaElement.style.width = `${calculatedWidth}px`;
                    }
                };
                
                slide.src = `${url.replace('public/', '')}`;
                slide.alt = image.title;
                if (index === 0) {
                    slide.className = 'active';
                }
                if (image.isNSFW) {
                    slide.style.backdropFilter = 'blur(10px)';
                }
                mediaElement.appendChild(slide);
            });
        
            let rightArrow = document.createElement('div');
            rightArrow.className = 'arrow right';
            rightArrow.onclick = slideRight;
            rightArrow.innerHTML = '&#10095;';
            mediaElement.appendChild(rightArrow);

            let currentImageIndex = 0;
            const images = mediaElement.querySelectorAll('.slider-container img');

            function slideLeft(){
                images[currentImageIndex].classList.remove('active');
                currentImageIndex--; 
                if (currentImageIndex < 0) { 
                    currentImageIndex = images.length - 1;
                }
                images[currentImageIndex].classList.add('active'); 
            }

            function slideRight() { 
                images[currentImageIndex].classList.remove('active');
                currentImageIndex++; 
                if (currentImageIndex >= images.length) { 
                    currentImageIndex = 0; 
                }
                images[currentImageIndex].classList.add('active'); 
            }
        }
        else if (/\.(jpe?g|png|gif|bmp)/i.test(image.url)) {
            mediaElement = new Image();
            mediaElement.src = `${image.url.replace('public/', '')}`;
            mediaElement.alt = image.title;
            if (image.isNSFW) {
                mediaElement.style.backdropFilter = 'blur(10px)';
            }
        } else if (/\.(mp4|webm|ogg)/i.test(image.url)) {
            mediaElement = document.createElement('div');
            mediaElement.className = 'video-container';
            mediaElement.id = 'content';
            const video = document.createElement('video');
            video.src = `${image.url.replace('public/', '')}`;
            video.alt = image.title;
            video.preload = 'metadata';
            if (image.isNSFW) {
                video.style.backdropFilter = 'blur(10px)';
            }
            mediaElement.appendChild(video);
            addCustomControls(mediaElement);
        } else if (/\.m3u8/i.test(image.url)) {
            if (Hls.isSupported()) {
                console.warn('!!!HLS supported');
                mediaElement = document.createElement('div');
                mediaElement.className = 'video-container';
                mediaElement.id = 'content';
                var video = document.createElement('video');
                mediaElement.appendChild(video);
                var hls = new Hls();
                hls.loadSource(image.url.replace('public/', ''));
                hls.attachMedia(video);
                video.preload = 'metadata';
                video.alt = image.title;
                if (image.isNSFW) {
                    video.style.backdropFilter = 'blur(10px)';
                }
                addCustomControls(mediaElement);
            }
            console.warn('!!!HLS not supported');
        } else {
            console.error("!!!!!Invalid image data:", imageData);
            return;
        }

        



        mediaElement.onerror = function (e) {
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

        var width = Math.max(Math.round(parseFloat(image.aspect_ratio * 400)), 250);
        console.log("mediaElement width: ", width);
        totalWidth += parseFloat(width);
        Widths.push(parseFloat(width));
        totalmedia++;

    } else {
        console.error("Invalid image data:", imageData);
    }

    
}

document.getElementById('postType').addEventListener('change', function () {
    var postTime = document.getElementById('postTime');
    if (this.value === 'top') {
        postTime.style.display = 'block';
    } else {
        postTime.style.display = 'none';
    }
});


function minimumgap(a, screen_width, screen_margin=0, container_margin=0) {
    let optimal_scale = 0;
    let min_gap = Infinity;
    let gaps = [];

    for (let z = 500; z < 2000; z++) {
        let zFloat = z / 1000.0; 
        let sw = (screen_width / zFloat) - (2 * screen_margin);
        let line_sum = 0;
        let gap_sum = 0;
        
        for (let item of a) {
            let item_width = item + 2 * container_margin;
            if (line_sum + item_width > sw) {
                gap_sum += (sw - line_sum);
                line_sum = item_width;
            } else {
                line_sum += item_width;
            }
            
            if (line_sum === sw) {
                line_sum = 0;
            }
        }
        
        // Add the gap for the last line if it is not complete

        // if (line_sum !== 0) {
        //     gap_sum += (sw - line_sum);
        // }
        
        gaps.push(Math.floor(gap_sum));
        
        if (gap_sum < min_gap) {
            min_gap = gap_sum;
            optimal_scale = zFloat;
        }
    }

    let minimas = [];
    for (let i = 1; i < gaps.length - 1; i++) {
        if (gaps[i] < gaps[i-1] && gaps[i] < gaps[i+1]) {
            minimas.push(i + 500);
        }
    }

    return minimas.map(minima => minima / 1000);
}