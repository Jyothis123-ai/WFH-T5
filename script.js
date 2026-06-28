/* ==========================================================================
   Instagram Clone Interactivity & Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  
  // --- Theme Toggle Control ---
  const themeToggleBtn = document.getElementById('theme-toggle');
  
  // Check for saved theme preference, otherwise default to system preference
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
  } else if (savedTheme === 'light') {
    document.body.classList.remove('dark-mode');
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.body.classList.add('dark-mode');
  }

  themeToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    if (document.body.classList.contains('dark-mode')) {
      localStorage.setItem('theme', 'dark');
    } else {
      localStorage.setItem('theme', 'light');
    }
  });


  // --- Phone Slideshow Animation ---
  const slideshow = document.getElementById('slideshow');
  if (slideshow) {
    const slides = slideshow.querySelectorAll('.slide');
    let currentSlideIndex = 0;

    setInterval(() => {
      // Fade out current slide
      slides[currentSlideIndex].classList.remove('active');
      
      // Calculate next slide index
      currentSlideIndex = (currentSlideIndex + 1) % slides.length;
      
      // Fade in next slide
      slides[currentSlideIndex].classList.add('active');
    }, 4000); // Transitions every 4 seconds
  }


  // --- Login Form Interactivity ---
  const loginForm = document.getElementById('login-form');
  const usernameInput = document.getElementById('login-username');
  const passwordInput = document.getElementById('login-password');
  const loginBtn = document.getElementById('login-btn');
  const togglePasswordBtn = document.getElementById('toggle-password');
  const usernameWrapper = document.getElementById('username-wrapper');
  const passwordWrapper = document.getElementById('password-wrapper');

  // Input fields floating label handler
  const handleInputLabel = (input, wrapper) => {
    if (input.value.trim() !== '') {
      wrapper.classList.add('active');
    } else {
      wrapper.classList.remove('active');
    }
  };

  // Form validation to enable/disable submit button
  const checkFormValidity = () => {
    const usernameVal = usernameInput.value.trim();
    const passwordVal = passwordInput.value.trim();
    
    // Instagram enables login when password is 6+ chars and username is not empty
    if (usernameVal.length > 0 && passwordVal.length >= 6) {
      loginBtn.removeAttribute('disabled');
    } else {
      loginBtn.setAttribute('disabled', 'true');
    }
  };

  if (usernameInput && passwordInput) {
    [usernameInput, passwordInput].forEach(input => {
      const wrapper = input.parentElement;
      
      // Initial check (in case of browser autocomplete)
      handleInputLabel(input, wrapper);
      
      input.addEventListener('input', () => {
        handleInputLabel(input, wrapper);
        checkFormValidity();
      });

      input.addEventListener('blur', () => {
        handleInputLabel(input, wrapper);
      });
      
      input.addEventListener('focus', () => {
        wrapper.classList.add('active');
      });
    });
  }

  // Password hide/show toggle
  if (togglePasswordBtn && passwordInput) {
    togglePasswordBtn.addEventListener('click', () => {
      if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        togglePasswordBtn.textContent = 'Hide';
      } else {
        passwordInput.type = 'password';
        togglePasswordBtn.textContent = 'Show';
      }
    });
  }


  // --- Simulated Login Transition ---
  const loggedOutState = document.getElementById('logged-out-state');
  const loggedInState = document.getElementById('logged-in-state');
  const globalFooter = document.getElementById('global-footer');
  const loginSpinner = document.getElementById('login-spinner');
  const btnText = loginBtn ? loginBtn.querySelector('.btn-text') : null;

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Start Loading Spinner
      if (loginSpinner && btnText && loginBtn) {
        loginSpinner.style.display = 'block';
        btnText.style.display = 'none';
        loginBtn.setAttribute('disabled', 'true');
      }

      // Simulate a network authentication delay
      setTimeout(() => {
        // Toggle view states
        loggedOutState.classList.remove('active');
        loggedInState.classList.add('active');
        if (globalFooter) globalFooter.style.display = 'none';

        // Scroll to the top of the feed page
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Reset login form fields and loading states
        loginForm.reset();
        handleInputLabel(usernameInput, usernameWrapper);
        handleInputLabel(passwordInput, passwordWrapper);
        if (loginSpinner && btnText && loginBtn) {
          loginSpinner.style.display = 'none';
          btnText.style.display = 'block';
          loginBtn.setAttribute('disabled', 'true');
        }
      }, 1200);
    });
  }


  // --- Log Out Event Handler ---
  const logoutLink = document.getElementById('logout-link');
  if (logoutLink) {
    logoutLink.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Switch back to logged-out screen
      loggedInState.classList.remove('active');
      loggedOutState.classList.add('active');
      if (globalFooter) globalFooter.style.display = 'flex';

      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }


  // --- Post Interactivity (Likes, Double-click, Comments, Bookmarks) ---
  const feedPostsContainer = document.getElementById('feed-posts');

  if (feedPostsContainer) {
    
    // 1. Post Like Button & Bookmark Button Click Toggle
    feedPostsContainer.addEventListener('click', (e) => {
      
      // Like icon click
      const likeBtn = e.target.closest('.like-btn');
      if (likeBtn) {
        const postCard = likeBtn.closest('.post-card');
        const likesCountSpan = postCard.querySelector('.likes-count span');
        let currentLikes = parseInt(likesCountSpan.textContent.replace(/,/g, ''), 10);
        
        if (likeBtn.classList.contains('liked')) {
          likeBtn.classList.remove('liked');
          currentLikes -= 1;
        } else {
          likeBtn.classList.add('liked');
          currentLikes += 1;
        }
        
        likesCountSpan.textContent = currentLikes.toLocaleString();
        return;
      }

      // Bookmark icon click
      const bookmarkBtn = e.target.closest('.bookmark-btn');
      if (bookmarkBtn) {
        bookmarkBtn.classList.toggle('bookmarked');
        return;
      }

      // Focus comment input
      const commentFocusBtn = e.target.closest('.comment-focus-btn');
      if (commentFocusBtn) {
        const postCard = commentFocusBtn.closest('.post-card');
        const commentInput = postCard.querySelector('.comment-input');
        if (commentInput) commentInput.focus();
        return;
      }

      // View Comments toggle
      const toggleCommentsBtn = e.target.closest('.view-comments-btn');
      if (toggleCommentsBtn) {
        const postCard = toggleCommentsBtn.closest('.post-card');
        const commentsList = postCard.querySelector('.post-comment-list');
        if (commentsList) {
          if (commentsList.style.display === 'none') {
            commentsList.style.display = 'flex';
            toggleCommentsBtn.textContent = 'Hide comments';
          } else {
            commentsList.style.display = 'none';
            toggleCommentsBtn.textContent = 'View all comments';
          }
        }
        return;
      }
    });

    // 2. Photo Double Click to Like (with screen pop-up heart overlay)
    const postPhotos = feedPostsContainer.querySelectorAll('.post-photo');
    postPhotos.forEach(photo => {
      photo.addEventListener('dblclick', (e) => {
        const postCard = photo.closest('.post-card');
        const likeBtn = postCard.querySelector('.like-btn');
        const heartPopup = postCard.querySelector('.like-heart-popup');
        const likesCountSpan = postCard.querySelector('.likes-count span');
        
        // Trigger red heart activation and increment if not already liked
        if (!likeBtn.classList.contains('liked')) {
          likeBtn.classList.add('liked');
          let currentLikes = parseInt(likesCountSpan.textContent.replace(/,/g, ''), 10);
          currentLikes += 1;
          likesCountSpan.textContent = currentLikes.toLocaleString();
        }

        // Trigger double-click animation overlay
        if (heartPopup) {
          heartPopup.classList.add('animate');
          // Remove class after animation concludes to allow repetitions
          setTimeout(() => {
            heartPopup.classList.remove('animate');
          }, 800);
        }
      });
    });

    // 3. Comment Posting Form Submission
    const commentForms = feedPostsContainer.querySelectorAll('.post-comment-box');
    commentForms.forEach(form => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const input = form.querySelector('.comment-input');
        const commentText = input.value.trim();
        if (commentText === '') return;

        const postCard = form.closest('.post-card');
        const commentsContainer = postCard.querySelector('.post-comment-list');
        
        // Create new comment element
        const commentItem = document.createElement('div');
        commentItem.className = 'comment-item';
        
        const userLink = document.createElement('a');
        userLink.href = '#';
        userLink.className = 'username';
        userLink.textContent = 'karthik_2509';
        
        const textSpan = document.createElement('span');
        textSpan.textContent = commentText;

        commentItem.appendChild(userLink);
        commentItem.appendChild(textSpan);
        
        // Append comment and reset input
        commentsContainer.appendChild(commentItem);
        input.value = '';

        // Ensure comments are visible after adding a new one
        commentsContainer.style.display = 'flex';
        const toggleCommentsBtn = postCard.querySelector('.view-comments-btn');
        if (toggleCommentsBtn) {
          toggleCommentsBtn.textContent = 'Hide comments';
        }
      });
    });
  }

});
