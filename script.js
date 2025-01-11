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
      'Register'
    ],
    showActiveTooltip: true,
    
    // Snap-like scrolling
    autoScrolling: true,
    fitToSection: true,
    fitToSectionDelay: 500,
    scrollingSpeed: 700,
    scrollBar: true, // helps transitions & ensures a real scrollbar

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

// ---- SLIDE TO SUBMIT LOGIC ----
(function() {
  const form = document.getElementById('registration-form');
  const handle = document.getElementById('slider-handle');
  const track = document.querySelector('.slider-track');
  const sliderText = document.getElementById('slider-text');

  let isDragging = false;
  let startX = 0;    // mouse/touch down x
  let offsetX = 0;   // how far handle has moved

  // Validate form fields & checkboxes
  function validateForm() {
    const name = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const phone = document.getElementById('reg-phone').value.trim();
    const college = document.getElementById('reg-college').value.trim();
    
    // NEW FIELDS
    const department = document.getElementById('reg-department').value.trim();
    const year = document.getElementById('reg-year').value.trim();
    // END NEW FIELDS

    // Check if all fields are filled
    if (!name || !email || !phone || !college || !department || !year) {
      return false;
    }

    // At least one event must be checked
    const checkboxes = document.querySelectorAll('.checkbox-group input[type="checkbox"]');
    let anyChecked = false;
    checkboxes.forEach(box => {
      if (box.checked) anyChecked = true;
    });
    if (!anyChecked) {
      return false;
    }

    return true;
  }

  // Helper: Sets handle position with bounds check
  function setHandlePosition(px) {
    const trackRect = track.getBoundingClientRect();
    const maxMove = trackRect.width - handle.offsetWidth;

    // Constrain offset
    if (px < 0) px = 0;
    if (px > maxMove) px = maxMove;

    offsetX = px;
    handle.style.transform = `translateX(${px}px)`;

    // If handle reached the end => attempt submit
    if (px >= maxMove) {
      isDragging = false;

      if (validateForm()) {
        // Turn everything green & update text
        track.style.backgroundColor = '#00ff00';
        handle.style.backgroundColor = '#00ff00';
        sliderText.innerText = 'Submitted!';

        // Delay actual submission to let user see it
        setTimeout(() => {
          form.submit();
        }, 800);

      } else {
        alert('Please fill all fields and select at least one event.');
        // Reset handle
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
    const moveX = e.clientX - startX;
    setHandlePosition(moveX);
  });

  document.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    // If not at end, reset
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
    const moveX = touch.clientX - startX;
    setHandlePosition(moveX);
  });

  document.addEventListener('touchend', () => {
    if (!isDragging) return;
    isDragging = false;
    // If not at end, reset
    if (offsetX < track.offsetWidth - handle.offsetWidth) {
      setHandlePosition(0);
    }
  });
})();
// ---- END SLIDE TO SUBMIT LOGIC ----
