document.addEventListener('DOMContentLoaded', function() {
  new fullpage('#fullpage', {
    anchors: [
      'home',
      'about-us',
      'event1',
      'event2',
      'event3',
      'event4',
      'event5',
      'map',
      'rules',
      'register'
    ],
    menu: '#menu',
    navigation: true,
    navigationPosition: 'right',
    navigationTooltips: [
      'Home',
      'About Us',
      'Event 1',
      'Event 2',
      'Event 3',
      'Event 4',
      'Event 5',
      'Map',
      'Rules',
      'Register'
    ],
    showActiveTooltip: true,
    
    // Snap-like scrolling
    autoScrolling: true,
    fitToSection: true,
    fitToSectionDelay: 500,
    scrollingSpeed: 700,
    scrollBar: true,

    afterRender: function() {
      // Immediately fade in the HOME content
      const homeElems = document.querySelectorAll('#home .content');
      homeElems.forEach(elem => {
        elem.style.opacity = 1;
        elem.style.transform = 'translateY(0)';
      });
    },

    afterLoad: function(origin, destination) {
      // Fade in the newly active section's content
      const activeElems = destination.item.querySelectorAll('.content, .registration-container');
      activeElems.forEach(elem => {
        elem.style.opacity = 1;
        elem.style.transform = 'translateY(0)';
      });
    },

    onLeave: function(origin, destination) {
      // Fade out the old section's content
      const leavingElems = origin.item.querySelectorAll('.content, .registration-container');
      leavingElems.forEach(elem => {
        elem.style.opacity = 0;
        elem.style.transform = 'translateY(30px)';
      });
    }
  });
});

// ---- SLIDE TO SUBMIT LOGIC (no-refresh) ----
(function() {
  const form = document.getElementById('registration-form');
  const handle = document.getElementById('slider-handle');
  const track = document.querySelector('.slider-track');
  const sliderText = document.getElementById('slider-text');

  // Our custom success modal
  const successModal = document.getElementById('success-modal');
  const closeModalBtn = document.getElementById('close-modal-btn');

  let isDragging = false;
  let startX = 0;
  let offsetX = 0;

  function validateForm() {
    const name = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const phone = document.getElementById('reg-phone').value.trim();
    const college = document.getElementById('reg-college').value.trim();
    const department = document.getElementById('reg-department').value.trim();
    const year = document.getElementById('reg-year').value.trim();

    // All fields required
    if (!name || !email || !phone || !college || !department || !year) {
      return false;
    }
    // At least one event checked
    const checkboxes = document.querySelectorAll('.checkbox-group input[type="checkbox"]');
    let anyChecked = false;
    checkboxes.forEach(box => {
      if (box.checked) anyChecked = true;
    });
    return anyChecked;
  }

  function setHandlePosition(px) {
    const trackRect = track.getBoundingClientRect();
    const maxMove = trackRect.width - handle.offsetWidth;

    if (px < 0) px = 0;
    if (px > maxMove) px = maxMove;

    offsetX = px;
    handle.style.transform = `translateX(${px}px)`;

    // If handle reached the end => attempt pseudo-submit
    if (px >= maxMove) {
      isDragging = false;

      if (validateForm()) {
        // Turn track & handle green to indicate success
        track.style.backgroundColor = '#00ff00';
        handle.style.backgroundColor = '#00ff00';
        sliderText.innerText = 'Submitted!';

        // Show modal (no refresh)
        setTimeout(() => {
          successModal.style.display = 'flex';
        }, 500);

      } else {
        alert('Please fill all fields and select at least one event.');
        setTimeout(() => {
          setHandlePosition(0);
        }, 300);
      }
    }
  }

  // MOUSE EVENTS
  handle.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.clientX - offsetX;
  });
  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    setHandlePosition(e.clientX - startX);
  });
  document.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    if (offsetX < track.offsetWidth - handle.offsetWidth) {
      setHandlePosition(0);
    }
  });

  // TOUCH EVENTS
  handle.addEventListener('touchstart', (e) => {
    isDragging = true;
    const touch = e.touches[0];
    startX = touch.clientX - offsetX;
  });
  document.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    setHandlePosition(touch.clientX - startX);
  });
  document.addEventListener('touchend', () => {
    if (!isDragging) return;
    isDragging = false;
    if (offsetX < track.offsetWidth - handle.offsetWidth) {
      setHandlePosition(0);
    }
  });

  // Close modal => reset handle & track
  closeModalBtn.addEventListener('click', () => {
    successModal.style.display = 'none';
    setHandlePosition(0);
    track.style.backgroundColor = 'rgba(255,255,255,0.2)';
    handle.style.backgroundColor = '#ff9800';
    sliderText.innerText = 'Slide to Submit';
  });
})();

// ---- NAVBAR ARROW SCROLLING LOGIC (optional) ----
(function() {
  const leftArrow = document.querySelector('.nav-arrow-left');
  const rightArrow = document.querySelector('.nav-arrow-right');
  const navUl = document.querySelector('#navbar ul');

  if (leftArrow && rightArrow && navUl) {
    const SCROLL_STEP = 100;

    leftArrow.addEventListener('click', () => {
      navUl.scrollBy({ left: -SCROLL_STEP, behavior: 'smooth' });
    });
    rightArrow.addEventListener('click', () => {
      navUl.scrollBy({ left: SCROLL_STEP, behavior: 'smooth' });
    });
  }
})();

// ---- SPARKLING MOUSE CURSOR TRAIL ----
(function() {
  document.addEventListener('mousemove', (e) => {
    // Create a small sparkle dot
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    sparkle.style.left = e.pageX + 'px';
    sparkle.style.top = e.pageY + 'px';

    document.body.appendChild(sparkle);

    // Remove it after animation
    setTimeout(() => {
      sparkle.remove();
    }, 500);
  });
})();
