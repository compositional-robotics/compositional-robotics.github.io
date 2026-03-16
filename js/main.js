/* =========================================================
   IROS 2026 Workshop — main.js
   Navbar scroll effect, mobile menu, scroll animations
   ========================================================= */

(function () {
  'use strict';

  /* ---- Constants ---- */
  var ACTIVE_LINK_SCROLL_OFFSET = 100;   // px past section top to count as "active"
  var ANIMATION_THRESHOLD       = 0.12;  // fraction of element visible before animating
  var ANIMATION_ROOT_MARGIN     = '0px 0px -40px 0px'; // delay until element is clearly in view

  /* ---- Navbar: add "scrolled" class on scroll ---- */
  var navbar = document.getElementById('navbar');
  function onScroll() {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    updateActiveNavLink();
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---- Mobile nav toggle ---- */
  var navToggle = document.getElementById('navToggle');
  var navLinks  = document.getElementById('navLinks');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      navLinks.classList.toggle('open');
    });
    // Close menu when a link is clicked
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
      });
    });
  }

  /* ---- Active nav link highlighting ---- */
  var sections = document.querySelectorAll('section[id], header[id]');
  function updateActiveNavLink() {
    var scrollY = window.scrollY + ACTIVE_LINK_SCROLL_OFFSET;
    sections.forEach(function (section) {
      var top    = section.offsetTop;
      var height = section.offsetHeight;
      var id     = section.getAttribute('id');
      var link   = document.querySelector('.nav-links a[href="#' + id + '"]');
      if (link) {
        if (scrollY >= top && scrollY < top + height) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      }
    });
  }

  /* ---- Scroll-triggered animations ---- */
  var animatedEls = document.querySelectorAll(
    '.section-header, .focus-card, .cfp-card, .timeline-item, .speaker-card, .organizer-card'
  );

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: ANIMATION_THRESHOLD, rootMargin: ANIMATION_ROOT_MARGIN }
    );
    animatedEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback: just show everything
    animatedEls.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  /* ---- Smooth scroll offset for fixed navbar ---- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        var navbarH = navbar ? navbar.offsetHeight : 0;
        var top     = target.getBoundingClientRect().top + window.scrollY - navbarH;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });
}());
