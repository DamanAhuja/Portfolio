  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll('.video-box').forEach(box => {
      const video = box.querySelector('video');
      const playBtnContainer = box.querySelector('.play-button-container');
      const label = playBtnContainer.querySelector('label');

      // Initial: hide controls
      video.controls = false;

      label.addEventListener('click', () => {
        video.play();
        video.controls = true; // show controls
        playBtnContainer.style.display = 'none';
      });

      video.addEventListener('ended', () => {
        playBtnContainer.style.display = 'grid';
        video.controls = false; // hide controls again
      });
    });
  });


  function scrollVideos(direction, button) {
    const slider = button
      .closest('.position-relative')
      ?.querySelector('#video-slider');
  
    if (!slider) return;
  
    const card = slider.querySelector('.card');
    if (!card) return;
  
    const cardStyle = window.getComputedStyle(card);
    const marginRight = parseInt(cardStyle.marginRight) || 16;
    const cardWidth = card.offsetWidth + marginRight;
  
    slider.scrollBy({ left: direction * cardWidth, behavior: 'smooth' });
  }
  
  

  