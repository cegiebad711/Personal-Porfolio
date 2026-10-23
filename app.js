/**
 * CEGIE BADAYOS — PERSONAL PORTFOLIO JAVASCRIPT
 * Features:
 *  - Theme Toggle (Light / Dark mode with localStorage persistence)
 *  - Sticky Navbar & Dynamic Scroll Progress Bar
 *  - Mobile Navigation Drawer Toggle
 *  - Scroll-Reveal via IntersectionObserver
 *  - Active Section Nav Highlighter
 *  - Ambient Mouse-Tracking Glow
 *  - Contact Form Client Validation & Submission Feedback
 */

document.addEventListener('DOMContentLoaded', () => {

  // --------------------------------------------------------------------------
  // 1. LIGHT / DARK THEME TOGGLE
  // --------------------------------------------------------------------------
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  const root = document.documentElement;

  // Check saved theme or system preference
  const savedTheme = localStorage.getItem('cegie-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme ? savedTheme : (prefersDark ? 'dark' : 'light');

  applyTheme(initialTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = root.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      localStorage.setItem('cegie-theme', newTheme);
    });
  }

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    if (themeIcon) {
      themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
  }

  // --------------------------------------------------------------------------
  // 2. STICKY NAVBAR & SCROLL PROGRESS BAR
  // --------------------------------------------------------------------------
  const navbar = document.getElementById('navbar');
  const scrollProgress = document.getElementById('scrollProgress');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Sticky shrink class
    if (navbar) {
      if (scrollY > 30) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    // Scroll progress bar width
    if (scrollProgress) {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        const progressPercent = (scrollY / docHeight) * 100;
        scrollProgress.style.width = `${Math.min(100, Math.max(0, progressPercent))}%`;
      }
    }
  }, { passive: true });

  // --------------------------------------------------------------------------
  // 3. MOBILE MENU TOGGLE
  // --------------------------------------------------------------------------
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      menuToggle.classList.toggle('open', isOpen);
      menuToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close mobile menu when clicking a link
    navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        menuToggle.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target) && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        menuToggle.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // --------------------------------------------------------------------------
  // 4. ACTIVE SECTION NAVIGATION HIGHLIGHTER
  // --------------------------------------------------------------------------
  const sections = document.querySelectorAll('section[id], header[id]');
  const allNavLinks = document.querySelectorAll('.nav-links .nav-link');

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        allNavLinks.forEach(link => {
          const href = link.getAttribute('href');
          if (href === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, {
    rootMargin: '-30% 0px -60% 0px'
  });

  sections.forEach(section => navObserver.observe(section));

  // --------------------------------------------------------------------------
  // 5. SCROLL REVEAL ANIMATIONS
  // --------------------------------------------------------------------------
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // --------------------------------------------------------------------------
  // 6. MOUSE-TRACKING AMBIENT GLOW EFFECT
  // --------------------------------------------------------------------------
  window.addEventListener('mousemove', (e) => {
    const x = e.clientX;
    const y = e.clientY;
    root.style.setProperty('--mouse-x', `${x}px`);
    root.style.setProperty('--mouse-y', `${y}px`);
  }, { passive: true });

  // --------------------------------------------------------------------------
  // 7. CONTACT FORM CLIENT-SIDE VALIDATION & HANDLING
  // --------------------------------------------------------------------------
  const contactForm = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const formStatus = document.getElementById('formStatus');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('userName');
      const emailInput = document.getElementById('userEmail');
      const businessInput = document.getElementById('businessType');
      const messageInput = document.getElementById('userMessage');

      const name = nameInput.value.trim();
      const email = emailInput.value.trim();
      const business = businessInput.value;
      const message = messageInput.value.trim();

      // Reset status display
      formStatus.className = 'form-status-alert';
      formStatus.style.display = 'none';

      // Basic client validation
      if (!name) {
        showStatus('Please enter your name.', 'error');
        nameInput.focus();
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email)) {
        showStatus('Please enter a valid email address.', 'error');
        emailInput.focus();
        return;
      }

      if (!business) {
        showStatus('Please select your business or trade type.', 'error');
        businessInput.focus();
        return;
      }

      if (!message || message.length < 8) {
        showStatus('Please provide a brief message describing your business or automation needs.', 'error');
        messageInput.focus();
        return;
      }

      // UI Sending state
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Sending inquiry...</span>`;

      // Simulated clean submission flow
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;

        showStatus(
          `Thank you, ${name}! Your inquiry has been recorded. I will review your business details and get back to you at ${email} within 24 hours.`,
          'success'
        );

        // Reset inputs
        contactForm.reset();
      }, 900);
    });
  }

  function showStatus(msg, type) {
    if (!formStatus) return;
    formStatus.textContent = msg;
    formStatus.className = `form-status-alert ${type}`;
    formStatus.style.display = 'block';
    formStatus.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

});
