// customplayer.js
function addCustomControls(videoContainer) {
    
  //generation of the custom video player
  console.log(videoContainer);

  let videocontrols = document.createElement('div');
  videocontrols.className = 'video-controls';
  videocontrols.style.opacity = '0';

  let leftControls = document.createElement('div');
  leftControls.className = 'left-controls';

  let playButton = document.createElement('button');
  playButton.id = 'playButton';
  playButton.className = 'play-pause';

  let playImg = document.createElement('img');
  playImg.className = 'icon';
  playImg.id = 'play';
  playImg.src = 'icons/play.svg';
  playImg.alt = 'play';
  playImg.style.display = 'block';

  let pauseImg = document.createElement('img');
  pauseImg.className = 'icon';
  pauseImg.id = 'pause';
  pauseImg.src = 'icons/pause.svg';
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
  unmuteImg.className = 'icon';
  unmuteImg.id = 'unmute';
  unmuteImg.src = 'icons/speaker-high.svg';
  unmuteImg.alt = '';
  unmuteImg.style.display = 'flex';

  let muteImg = document.createElement('img');
  muteImg.className = 'icon';
  muteImg.id = 'mute';
  muteImg.src = 'icons/speaker-slash.svg';
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
  fullScreenImg.className = 'icon';
  fullScreenImg.src = 'icons/corners-out.svg';
  fullScreenImg.alt = '';

  fullScreenButton.appendChild(fullScreenImg);

  let speedButtonContainer = document.createElement('div');
  speedButtonContainer.style.position = 'relative';

  let speedButton = document.createElement('button');
  speedButton.id = 'speedButton';
  speedButton.className = 'playback-speed';

  let speedImg = document.createElement('img');
  speedImg.className = 'icon';
  speedImg.src = 'icons/gauge.svg';
  speedImg.alt = '';
  speedButton.appendChild(speedImg);

  let speedDropdown = document.createElement('div');
  speedDropdown.className = 'speed-dropdown';
  let speedList = document.createElement('ul');
  let speedOptions = [
    { speed: "0.5", text: "0.5x" },
    { speed: "1.0", text: "1.0x" },
    { speed: "1.5", text: "1.5x" },
    { speed: "2.0", text: "2.0x" }
  ];

  speedOptions.forEach(option => {
    let speedListItem = document.createElement('li');
    speedListItem.dataset.speed = option.speed;
    speedListItem.textContent = option.text;
    speedList.appendChild(speedListItem);
  });

  speedDropdown.appendChild(speedList);
  speedButtonContainer.appendChild(speedDropdown);



  speedButtonContainer.appendChild(speedButton);

  let pipButton = document.createElement('button');
  pipButton.id = 'pipButton';
  pipButton.className = 'pip';
  let pipImg = document.createElement('img');
  pipImg.className = 'icon';
  pipImg.src = 'icons/picture-in-picture.svg';
  pipImg.alt = '';
  pipButton.appendChild(pipImg);

  let downloadButton = document.createElement('button');
  downloadButton.id = 'downloadButton';
  let downloadImg = document.createElement('img');
  downloadImg.className = 'icon';
  downloadImg.src = 'icons/download-simple.svg';
  downloadImg.alt = '';
  downloadButton.appendChild(downloadImg);




  let moreOptions = document.createElement('button');
  moreOptions.id = 'moreOptions';
  moreOptions.className = 'more-options';
  let moreOptionsImg = document.createElement('img');
  moreOptionsImg.className = 'icon';
  moreOptionsImg.src = 'icons/dots-three-vertical.svg';
  moreOptionsImg.alt = '';
  let moreOptionsDropdown = document.createElement('div');
  moreOptionsDropdown.id = 'options-dropdown';

  let moreOptionsList = document.createElement('ul');
  let moreOptionsItems = [
    { id: 'speedButton', text: 'Playback Speed' },
    { id: 'pipButton', text: 'Picture-in-Picture' },
    { id: 'downloadButton', text: 'Download' }
  ];
  moreOptionsItems.forEach(item => {
    let moreOptionsListItem = document.createElement('li');
    moreOptionsListItem.id = item.id;
    moreOptionsListItem.textContent = item.text;
    moreOptionsList.appendChild(moreOptionsListItem);
  });
  moreOptionsDropdown.appendChild(moreOptionsList);
  moreOptions.appendChild(moreOptionsImg);
  moreOptions.appendChild(moreOptionsDropdown);


  rightControls.appendChild(fullScreenButton);
  rightControls.appendChild(speedButtonContainer);
  rightControls.appendChild(pipButton);
  rightControls.appendChild(downloadButton);
  rightControls.appendChild(moreOptions);

  videocontrols.appendChild(leftControls);
  videocontrols.appendChild(muteButton);
  videocontrols.appendChild(rightControls);




  videoContainer.appendChild(videocontrols)



  var video = videoContainer.querySelector('video');
  const volume = videoContainer.querySelector('#muteButton');
  const unmute = videoContainer.querySelector('#muteButton').querySelector('i');
  const videoControls = videoContainer.querySelector('.video-controls');
  var playIcon = videoContainer.querySelector('#play');
  var pauseIcon = videoContainer.querySelector('#pause');
 
  var unmuteIcon = videoContainer.querySelector('#unmute');

  var moreControls = videoContainer.querySelector('.more-controls');



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


  videoContainer.addEventListener('mouseover', () => {
  videoControls.style.opacity = '1';
  });

  videoContainer.addEventListener('mouseout', () => {
  videoControls.style.opacity = '0';
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

    let initial_height;
    let imgs;

    video.addEventListener('loadedmetadata', function() {

      initial_height = getComputedStyle(video).getPropertyValue('height');
      console.log("Initial height: " + initial_height);
      imgs = videoContainer.querySelectorAll('icon');

      fullScreenButton.addEventListener('click', function() {
        if (!document.fullscreenElement) {
          gallery.style.zoom = '1';
          videoContainer.style.setProperty('height', `100vh`);
          video.style.setProperty('height', `100%`);
          imgs.forEach(img => img.style.setProperty('height', `22px`));

          if (videoContainer.requestFullscreen) {
            videoContainer.requestFullscreen();
          } else if (videoContainer.webkitRequestFullscreen) { /* Safari */
            videoContainer.webkitRequestFullscreen();
          } else if (videoContainer.msRequestFullscreen) { /* IE11 */
            videoContainer.msRequestFullscreen();
          }
        } else {
          if (document.exitFullscreen) {
            document.exitFullscreen();
            videoContainer.style.setProperty('height', initial_height);
            video.style.setProperty('height', initial_height);
            imgs.forEach(img => img.style.setProperty('--video-height', initial_height));
          } else if (document.webkitExitFullscreen) { /* Safari */
            document.webkitExitFullscreen();
            videoContainer.style.setProperty('height', initial_height);
            video.style.setProperty('height', initial_height);
            imgs.forEach(img => img.style.setProperty('--video-height', initial_height));
          } else if (document.msExitFullscreen) { /* IE11 */
            document.msExitFullscreen();
            videoContainer.style.setProperty('height', initial_height);
            video.style.setProperty('height', initial_height);
            imgs.forEach(img => img.style.setProperty('--video-height', initial_height));
          }
        }
      });
    });


    videoContainer.addEventListener('fullscreenchange', function() {
      if (!document.fullscreenElement) {
          videoContainer.style.setProperty('height', initial_height);
          video.style.setProperty('height', initial_height);
          imgs.forEach(img => img.style.setProperty('--video-height', initial_height));
      }
    });



      pipButton.addEventListener('click', () => {
        if (video.requestPictureInPicture) {
          video.requestPictureInPicture();
        }
      });
    

      speedButton.addEventListener('click', () => {
        speedDropdown.classList.toggle('active');
        speedDropdown.classList.toggle('show-dropdown');
      });
    
    videoContainer.addEventListener('click', (event) => {
      if (!speedDropdown.contains(event.target) && speedDropdown.classList.contains('active')) {
        speedDropdown.classList.remove('active');
      }
    });


    


      if (speedDropdown) {
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
      }


    

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



      if (moreOptions) {
        moreOptions.addEventListener('click', function() {
          var moreOptionsDiv = videoContainer.querySelector('#options-dropdown');
          if (moreOptionsDiv.style.display === 'none' || moreOptionsDiv.style.display === '') {
              moreOptionsDiv.style.display = 'block';
          } else {
              moreOptionsDiv.style.display = 'none';
          }
        });
      }

      
  const options = videoContainer.querySelectorAll('#options-dropdown li');
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

  video.addEventListener('loadedmetadata', function() {
    updateVideoControls();

    window.addEventListener('resize', updateVideoControls);

    function updateVideoControls() {
      if (videoContainer.offsetWidth < 450) {
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
          volume.style.width = '70%';});
        
        volume.addEventListener('mouseout', function() {
          volume.style.width = '';});
      }
    }
  });

}



