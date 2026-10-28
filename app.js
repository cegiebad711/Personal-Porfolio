/**
 * CEGIE BADAYOS — PERSONAL PORTFOLIO JAVASCRIPT
 * Features:
 *  - Minimal Sticky Navbar & Dynamic Scroll Progress Bar
 *  - Clean Mobile Navigation Drawer
 *  - Staggered Scroll-Reveal Animations (IntersectionObserver)
 *  - Active Section Navigation Highlighter
 *  - Live HubSpot Forms API CRM Integration (Portal 247641741 / Form d3cabcd1-f0c9-4881-b2ad-5464b15d2167)
 */

document.addEventListener('DOMContentLoaded', () => {

  // --------------------------------------------------------------------------
  // 1. STICKY NAVBAR & DYNAMIC SCROLL PROGRESS BAR
  // --------------------------------------------------------------------------
  const navbar = document.getElementById('navbar');
  const scrollProgress = document.getElementById('scrollProgress');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Add .scrolled class for subtle blur & hairline border
    if (navbar) {
      if (scrollY > 30) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    // Update top progress bar width
    if (scrollProgress) {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        const progressPercent = (scrollY / docHeight) * 100;
        scrollProgress.style.width = `${Math.min(100, Math.max(0, progressPercent))}%`;
      }
    }
  }, { passive: true });

  // --------------------------------------------------------------------------
  // 2. MOBILE MENU SLIDE-IN DRAWER
  // --------------------------------------------------------------------------
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      menuToggle.classList.toggle('open', isOpen);
      menuToggle.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close mobile menu when a nav link is clicked
    navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        menuToggle.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target) && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        menuToggle.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  // --------------------------------------------------------------------------
  // 3. ACTIVE SECTION NAVIGATION HIGHLIGHTER
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
    rootMargin: '-25% 0px -65% 0px'
  });

  sections.forEach(section => navObserver.observe(section));

  // --------------------------------------------------------------------------
  // 4. SUBTLE SCROLL-REVEAL ANIMATIONS (INTERSECTION OBSERVER)
  // --------------------------------------------------------------------------
  const fadeUpElements = document.querySelectorAll('.fade-up');

  // Stagger sibling elements inside grids
  fadeUpElements.forEach((el, index) => {
    const parentGrid = el.closest('.bento-services-grid, .hero-trust-row, .case-study-panels-list, .connected-track-container');
    if (parentGrid) {
      const siblings = Array.from(parentGrid.querySelectorAll('.fade-up'));
      const siblingIndex = siblings.indexOf(el);
      if (siblingIndex > 0) {
        el.style.transitionDelay = `${siblingIndex * 0.08}s`;
      }
    }
  });

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  fadeUpElements.forEach(el => revealObserver.observe(el));

  // --------------------------------------------------------------------------
  // 5. HUBSPOT CRM LIVE INTEGRATION & CONTACT FORM
  // --------------------------------------------------------------------------
  const HUBSPOT_CONFIG = {
    portalId: '247641741',
    formGuid: 'd3cabcd1-f0c9-4881-b2ad-5464b15d2167',
    region: 'na2'
  };

  const contactForm = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const formStatus = document.getElementById('formStatus');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('userName');
      const emailInput = document.getElementById('userEmail');
      const businessInput = document.getElementById('businessType');
      const messageInput = document.getElementById('userMessage');

      const name = nameInput.value.trim();
      const email = emailInput.value.trim();
      const business = businessInput.value;
      const message = messageInput.value.trim();

      // Reset alert status
      formStatus.className = 'form-status-alert';
      formStatus.style.display = 'none';

      // Validation
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

      // Button sending state
      const originalBtnHTML = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Connecting to HubSpot...</span>`;

      // Live HubSpot Submissions API v3
      const regionalEndpoint = `https://api-na2.hsforms.com/submissions/v3/integration/submit/${HUBSPOT_CONFIG.portalId}/${HUBSPOT_CONFIG.formGuid}`;
      const globalEndpoint = `https://api.hsforms.com/submissions/v3/integration/submit/${HUBSPOT_CONFIG.portalId}/${HUBSPOT_CONFIG.formGuid}`;

      const payload = {
        fields: [
          { name: 'firstname', value: name },
          { name: 'email', value: email },
          { name: 'company', value: business },
          { name: 'message', value: `[Business/Trade: ${business}]\n\n${message}` }
        ],
        context: {
          pageUri: window.location.href,
          pageName: document.title
        }
      };

      try {
        // Attempt 1: Regional NA2 endpoint
        let response = await fetch(regionalEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }).catch(() => null);

        // Attempt 2: Global endpoint fallback if regional doesn't answer
        if (!response || !response.ok) {
          response = await fetch(globalEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
        }

        if (response && response.ok) {
          showStatus(
            `Thank you, ${name}! Your inquiry has been sent directly to my HubSpot CRM. I will review your business details and get back to you at ${email} within 24 hours.`,
            'success'
          );
          contactForm.reset();
        } else {
          const errData = response ? await response.json().catch(() => ({})) : {};
          console.error('HubSpot API Response Error:', errData);
          showStatus('Your message could not be sent to HubSpot right now. Please email me directly at cegiebad@outlook.com or call 0919 422 5298.', 'error');
        }
      } catch (networkError) {
        console.error('HubSpot Network Error:', networkError);
        showStatus('Connection issue. Please email me directly at cegiebad@outlook.com.', 'error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHTML;
      }
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
