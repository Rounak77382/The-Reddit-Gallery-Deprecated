//generation of the custom video player

let videocontrols = document.createElement('div');
div.className = 'video-controls';

let leftControls = document.createElement('div');
leftControls.className = 'left-controls';

let playButton = document.createElement('button');
playButton.id = 'playButton';
playButton.className = 'play-pause';

let playImg = document.createElement('img');
playImg.id = 'play';
playImg.src = '/public/icons/play.svg';
playImg.alt = 'play';
playImg.style.display = 'block';

let pauseImg = document.createElement('img');
pauseImg.id = 'pause';
pauseImg.src = '/public/icons/pause.svg';
pauseImg.alt = 'pause';
pauseImg.style.display = 'none';

playButton.appendChild(playImg);
playButton.appendChild(pauseImg);

let seekBar = document.createElement('div');
seekBar.className = 'seek-bar';

let seekSlider = document.createElement('input');
seekSlider.type = 'range';
seekSlider.id = 'seekSlider';
seekSlider.min = '0';
seekSlider.max = '100';
seekSlider.value = '0';
seekSlider.step = '0.0001';

seekBar.appendChild(seekSlider);

leftControls.appendChild(playButton);
leftControls.appendChild(seekBar);

let muteButton = document.createElement('button');
muteButton.id = 'muteButton';
muteButton.className = 'volume';

let muteIcon = document.createElement('i');
muteIcon.className = 'material-icons';

let unmuteImg = document.createElement('img');
unmuteImg.id = 'unmute';
unmuteImg.src = '/public/icons/speaker-high.svg';
unmuteImg.alt = '';
unmuteImg.style.display = 'flex';

let muteImg = document.createElement('img');
muteImg.id = 'mute';
muteImg.src = '/public/icons/speaker-slash.svg';
muteImg.alt = '';
muteImg.style.display = 'none';

muteIcon.appendChild(unmuteImg);
muteIcon.appendChild(muteImg);
muteButton.appendChild(muteIcon);

let volumeBar = document.createElement('div');
volumeBar.className = 'volume-bar';

let volumeSlider = document.createElement('input');
volumeSlider.type = 'range';
volumeSlider.id = 'volumeSlider';
volumeSlider.min = '0';
volumeSlider.max = '1';
volumeSlider.value = '1';
volumeSlider.step = '0.1';

volumeBar.appendChild(volumeSlider);
muteButton.appendChild(volumeBar);

let rightControls = document.createElement('div');
rightControls.className = 'right-controls';

let fullScreenButton = document.createElement('button');
fullScreenButton.id = 'fullScreenButton';
fullScreenButton.className = 'fullscreen';

let fullScreenImg = document.createElement('img');
fullScreenImg.src = '/public/icons/corners-out.svg';
fullScreenImg.alt = '';

fullScreenButton.appendChild(fullScreenImg);

let speedButtonContainer = document.createElement('div');
speedButtonContainer.style.position = 'relative';

let speedButton = document.createElement('button');
speedButton.id = 'speedButton';
speedButton.className = 'playback-speed';

let speedImg = document.createElement('img');
speedImg.src = '/public/icons/gauge.svg';
speedImg.alt = '';

speedButton.appendChild(speedImg);
speedButtonContainer.appendChild(speedButton);

rightControls.appendChild(fullScreenButton);
rightControls.appendChild(speedButtonContainer);

videocontrols.appendChild(leftControls);
videocontrols.appendChild(muteButton);
videocontrols.appendChild(rightControls);

const videoContainer = document.querySelector('.video-container');

videoContainer.appendChild(videocontrols);






//functionality for the custom video player
var video = document.querySelector('#content');


const volume = document.getElementById('muteButton');
const unmute = document.getElementById('muteButton').querySelector('i');



const speedDropdown = document.querySelector('.speed-dropdown');
const pipButton = document.getElementById('pipButton');
const downloadButton = document.getElementById('downloadButton');

const videoControls = document.querySelector('.video-controls');
var playIcon = document.getElementById('play');
var pauseIcon = document.getElementById('pause');
var moreOptions = document.querySelector('#moreOptions');

playButton.addEventListener('click', function() {
    if (video.paused == true) {
        // Play the video
        video.play();

        // Update the button icon to 'Pause'
        playIcon.style.display = 'none';
        pauseIcon.style.display = 'block';
    } else {
        // Pause the video
        video.pause();

        // Update the button icon to 'Play'
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
    }
});

var unmuteIcon = document.getElementById('unmute');
var muteIcon = document.getElementById('mute');

videoContainer.addEventListener('mouseover', () => {
videoControls.style.opacity = '1';
});

videoContainer.addEventListener('mouseout', () => {
videoControls.style.opacity = '1';
});


seekSlider.addEventListener('input', () => {
  const seekTime = video.duration * (seekSlider.value / 100);
  video.currentTime = seekTime;
});

video.addEventListener('timeupdate', () => {
  const percent = (video.currentTime / video.duration) * 100;
  seekSlider.value = percent;
});

unmute.addEventListener('click', () => {
    if (video.muted) {
      video.muted = false;
      unmute.classList.remove('fa-mute'); // Replace with appropriate icon class for muted state
      unmute.classList.add('fa-volume_up'); // Replace with appropriate icon class for unmuted state

      // Update the button icon to 'Mute'
      unmuteIcon.style.display = 'block';
      muteIcon.style.display = 'none';
    } else {
      video.muted = true;
      unmute.classList.remove('fa-volume_up');
      unmute.classList.add('fa-mute');

      // Update the button icon to 'Unmute'
      unmuteIcon.style.display = 'none';
      muteIcon.style.display = 'block';
    }
});
  
  volumeSlider.addEventListener('input', () => {
    video.volume = volumeSlider.value;
  });


  const initial_height = video.style.height;
  const videocontainer = document.querySelector('.video-container');
  const originalVideoHeight = getComputedStyle(video).getPropertyValue('--video-height');
  const imgs = document.querySelectorAll('img');

  fullScreenButton.addEventListener('click', function() {
    if (!document.fullscreenElement) {
      video.style.setProperty('--video-height', `${window.innerHeight}px`);
      imgs.forEach(img => img.style.setProperty('--video-height', `${window.innerHeight}px`));

      if (video.requestFullscreen) {
        videoContainer.requestFullscreen();
      } else if (video.webkitRequestFullscreen) { /* Safari */
        videoContainer.webkitRequestFullscreen();
      } else if (video.msRequestFullscreen) { /* IE11 */
        videoContainer.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        video.style.setProperty('--video-height', originalVideoHeight);
        imgs.forEach(img => img.style.setProperty('--video-height', originalVideoHeight));
      } else if (document.webkitExitFullscreen) { /* Safari */
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) { /* IE11 */
        document.msExitFullscreen();
      }
    }
  });


  document.addEventListener('fullscreenchange', function() {
    if (!document.fullscreenElement) {
        video.style.height = initial_height;
    }
});


  // Check for browser support (modify as needed)
  if (document.pictureInPictureEnabled) {
    pipButton.addEventListener('click', () => {
      if (video.requestPictureInPicture) {
        video.requestPictureInPicture();
      }
    });
  } else {
    pipButton.classList.add('disabled'); // Add a disabled class for visual indication
  }
  
  speedButton.addEventListener('click', () => {
    speedDropdown.classList.toggle('active');
  });

  speedButton.addEventListener('click', () => {
    speedDropdown.classList.toggle('show-dropdown');
  });
  
  document.addEventListener('click', (event) => {
    if (!speedDropdown.contains(event.target) && speedDropdown.classList.contains('active')) {
      speedDropdown.classList.remove('active');
    }
  });
  
  const speedOptions = speedDropdown.querySelectorAll('li');
  speedOptions.forEach(option => {
    option.addEventListener('click', () => {
      const selectedSpeed = option.dataset.speed;
      video.playbackRate = selectedSpeed;
      speedDropdown.classList.remove('active');
      speedDropdown.classList.remove('show-dropdown');

      // Reset color for all options
      speedOptions.forEach(opt => opt.style.color = '');

      // Change color of selected option
      option.style.color = 'red'; // Change 'red' to any color you want
    });
  });

  
  // Download functionality (highly browser-dependent, consider server-side handling)
  downloadButton.addEventListener('click', () => {
    alert('Download functionality is not fully supported by browsers yet. Consider server-side solutions.');
  });
  
  // Responsive behavior: Hide non-essential controls on small screens
  
  const toggleMoreControls = () => {
    moreControls.classList.toggle('hidden');
  }
  
  const windowWidth = window.innerWidth;
  if (windowWidth < 768) { // Adjust breakpoint as needed
    moreControls.classList.add('hidden');
    playButton.addEventListener('click', toggleMoreControls);
  }


  video.addEventListener('timeupdate', function() {
    // Update seek slider value based on video's current time
    const value = (100 / video.duration) * video.currentTime;
    seekSlider.value = value;

    // Update the slider background color
    updateSlider(seekSlider);
});


  // Function to update slider background
  function updateSlider(slider, color1 = '#fd0000', color2 = '#FFFFFF') {
    // Ensure slider exists and has a valid max and min to avoid division by zero
    if (!slider || slider.max === slider.min) return;

    const value = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
    slider.style.background = `linear-gradient(to right, ${color1} 0%, ${color1} ${value}%, ${color2} ${value}%, ${color2} 100%)`;
}
  // Update the seek bar slider's background on input
  seekSlider.addEventListener('input', function() {
    updateSlider(this);
    const seekTime = video.duration * (this.value / 100);
    video.currentTime = seekTime;
  });

  // Call updateSlider for seekSlider initially
  updateSlider(seekSlider);

  // Update the volume bar slider's background on input
  volumeSlider.addEventListener('input', function() {
    updateSlider(this);
    video.volume = this.value;
  });

  // Call updateSlider for volumeSlider initially with different colors if needed
  updateSlider(volumeSlider);

  document.getElementById('moreOptions').addEventListener('click', function() {
    var moreOptionsDiv = document.getElementById('options-dropdown');
    if (moreOptionsDiv.style.display === 'none' || moreOptionsDiv.style.display === '') {
        moreOptionsDiv.style.display = 'block';
    } else {
        moreOptionsDiv.style.display = 'none';
    }
});
    
const options = document.querySelectorAll('#options-dropdown li');
options.forEach(option => {
    option.addEventListener('click', () => {
        const optionId = option.id;
        switch (optionId) {
            case 'speedButton':
                speedButton.click();
                break;
            case 'pipButton':
                pipButton.click();
                break;
            case 'downloadButton':
                downloadButton.click();
                break;
            default:
                break;
        }
    });
});

window.onload = function() {
  var video = document.getElementById('content');
  updateVideoControls();

  window.addEventListener('resize', updateVideoControls);

  function updateVideoControls() {
    if (video.offsetWidth < 450) {
      pipButton.style.display = 'none';
      speedButton.style.display = 'none';
      downloadButton.style.display = 'none';
      moreOptions.style.display = 'flex';

      volume.addEventListener('mouseover', function() {
        volume.style.width = '60%';});
      
      volume.addEventListener('mouseout', function() {
          volume.style.width = '';});
      
    }
    else {
      pipButton.style.display = 'flex';
      speedButton.style.display = 'flex';
      downloadButton.style.display = 'flex';
      moreOptions.style.display = 'none';
      volume.addEventListener('mouseover', function() {
        volume.style.width = '50%';});
      
      volume.addEventListener('mouseout', function() {
          volume.style.width = '';});
    }
  }
}
