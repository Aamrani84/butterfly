/* ═══════════════════════════════════════════════
   VILLA BUTTERFLY MARRAKECH — JavaScript
   ═══════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', function () {

  /* ── LANGUAGE SWITCHER ──────────────────────── */
  let currentLang = 'en';

  window.switchLang = function (lang) {
    currentLang = lang;
    document.documentElement.lang = lang;

    // Update all elements with data-en / data-fr attributes
    document.querySelectorAll('[data-en], [data-fr]').forEach(function (el) {
      const val = el.getAttribute('data-' + lang) || el.getAttribute('data-en');
      if (!val) return;
      if (el.tagName === 'INPUT' && el.type !== 'date') {
        el.placeholder = val;
      } else if (el.tagName === 'TEXTAREA') {
        el.placeholder = val;
      } else if (el.tagName === 'OPTION') {
        el.textContent = val;
      } else {
        el.textContent = val;
      }
    });

    // Highlight active language button
    document.querySelectorAll('.lang-btn').forEach(function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });
  };

  // Initialize with English
  switchLang('en');


  /* ── HEADER SCROLL EFFECT ───────────────────── */
  var header = document.getElementById('site-header');
  function updateHeader() {
    if (header) {
      header.classList.toggle('scrolled', window.scrollY > 80);
    }
  }
  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();


  /* ── MOBILE NAV ─────────────────────────────── */
  var navToggle = document.getElementById('nav-toggle');
  var navMenu   = document.getElementById('site-nav');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function () {
      var isOpen = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!isOpen));
      navMenu.classList.toggle('is-open', !isOpen);
    });

    // Close on any nav link or button click
    navMenu.querySelectorAll('a, button').forEach(function (el) {
      el.addEventListener('click', function () {
        navToggle.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('is-open');
      });
    });

    // Close on resize past mobile breakpoint
    window.addEventListener('resize', function () {
      if (window.innerWidth > 720) {
        navToggle.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('is-open');
      }
    });
  }


  /* ── SMOOTH SCROLL ──────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });


  /* ── SCROLL ANIMATIONS ──────────────────────── */
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.animate-in').forEach(function (el) {
    observer.observe(el);
  });


  /* ── GALLERY PREVIEW — set background images ── */
  var previewImages = [
    { src: 'WhatsApp Image 2026-04-06 at 01.49.09.jpeg', title: 'Pool & Garden' },
    { src: 'marrakech-villa-butterfly-12.jpg',           title: 'Luxury Interior' },
    { src: 'marrakech-villa-butterfly-16.jpg',           title: 'Garden View' },
    { src: 'marrakech-villa-butterfly-45.jpg',           title: 'Living Room' },
    { src: 'marrakech-villa-butterfly-26.jpg',           title: 'Master Suite' }
  ];

  document.querySelectorAll('#gallery-preview .gp-item').forEach(function (item) {
    var idx = parseInt(item.getAttribute('data-index'), 10);
    if (previewImages[idx]) {
      item.style.backgroundImage = "url('" + previewImages[idx].src + "')";
    }
  });


  /* ── GALLERY MODAL ──────────────────────────── */
  var galleryModal = document.getElementById('gallery-modal');

  window.openGallery = function () {
    galleryModal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  };

  window.closeGallery = function () {
    galleryModal.classList.remove('is-open');
    document.body.style.overflow = '';
  };

  // Close when clicking the dark backdrop
  galleryModal.addEventListener('click', function (e) {
    if (e.target === galleryModal) closeGallery();
  });


  /* ── LIGHTBOX ───────────────────────────────── */
  var lightbox = document.getElementById('lightbox');
  var lbImg    = document.getElementById('lb-img');
  var lbCap    = document.getElementById('lb-caption');
  var lbImages = [];
  var lbIndex  = 0;

  function showLightboxAt(index) {
    lbIndex = (index + lbImages.length) % lbImages.length;
    var item = lbImages[lbIndex];
    lbImg.src = item.src;
    lbImg.alt = item.title;
    lbCap.textContent = (lbIndex + 1) + ' / ' + lbImages.length + ' — ' + item.title;
  }

  function openLightbox() {
    lightbox.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  window.closeLightbox = function () {
    lightbox.classList.remove('is-open');
    lbImg.src = '';
    document.body.style.overflow = '';
  };

  window.lbChange = function (dir) {
    showLightboxAt(lbIndex + dir);
  };

  // Open from the gallery preview (outside the modal)
  window.openPreviewLightbox = function (index) {
    lbImages = previewImages;
    showLightboxAt(index);
    openLightbox();
  };

  // Open from within the gallery modal
  window.openModalLightbox = function (index) {
    var items = document.querySelectorAll('#gallery-modal-grid .gm-item');
    lbImages = Array.from(items).map(function (el) {
      return { src: el.getAttribute('data-src'), title: el.getAttribute('data-title') };
    });
    showLightboxAt(index);
    openLightbox();
  };

  // Set onclick for preview items
  document.querySelectorAll('#gallery-preview .gp-item').forEach(function (item) {
    var idx = parseInt(item.getAttribute('data-index'), 10);
    item.addEventListener('click', function () {
      window.openPreviewLightbox(idx);
    });
  });

  // Close lightbox on backdrop click
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLightbox();
  });

  // Keyboard navigation
  document.addEventListener('keydown', function (e) {
    if (lightbox.classList.contains('is-open')) {
      if (e.key === 'ArrowLeft')  lbChange(-1);
      if (e.key === 'ArrowRight') lbChange(1);
      if (e.key === 'Escape')     closeLightbox();
    } else if (galleryModal.classList.contains('is-open')) {
      if (e.key === 'Escape') closeGallery();
    }
  });


  /* ── BOOKING FORM — Send to WhatsApp ─────────── */
  var form = document.getElementById('booking-form');

  if (form) {
    // Set minimum date to today
    var today = new Date().toISOString().split('T')[0];
    var checkinInput  = document.getElementById('b-checkin');
    var checkoutInput = document.getElementById('b-checkout');

    checkinInput.min  = today;
    checkoutInput.min = today;

    checkinInput.addEventListener('change', function () {
      checkoutInput.min = this.value || today;
      if (checkoutInput.value && checkoutInput.value <= this.value) {
        checkoutInput.value = '';
      }
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var name     = document.getElementById('b-name').value.trim();
      var phone    = document.getElementById('b-phone').value.trim();
      var checkin  = document.getElementById('b-checkin').value;
      var checkout = document.getElementById('b-checkout').value;
      var guests   = document.getElementById('b-guests').value;
      var occasion = document.getElementById('b-occasion').value;
      var message  = document.getElementById('b-message').value.trim();

      // Validate required fields
      if (!name || !phone || !checkin || !checkout || !guests) {
        var msg = currentLang === 'fr'
          ? 'Veuillez remplir tous les champs obligatoires (*).'
          : 'Please fill in all required fields (*).';
        alert(msg);
        return;
      }

      if (checkout <= checkin) {
        var msg2 = currentLang === 'fr'
          ? 'La date de départ doit être après la date d\'arrivée.'
          : 'Check-out date must be after check-in date.';
        alert(msg2);
        return;
      }

      // Build WhatsApp message
      var nights = Math.round((new Date(checkout) - new Date(checkin)) / 86400000);
      var text = 'Hello! I would like to book Villa Butterfly Marrakech.\n\n';
      text += '\uD83D\uDC64 Name: '        + name      + '\n';
      text += '\uD83D\uDCDE Phone: '        + phone     + '\n';
      text += '\uD83D\uDCC5 Check-in: '    + checkin   + '\n';
      text += '\uD83D\uDCC5 Check-out: '   + checkout  + '\n';
      text += '\uD83C\uDF19 Duration: '    + nights + ' night' + (nights > 1 ? 's' : '') + '\n';
      text += '\uD83D\uDC65 Guests: '       + guests    + '\n';
      if (occasion) text += '\uD83C\uDF89 Occasion: ' + occasion + '\n';
      if (message)  text += '\uD83D\uDCAC Message: '  + message  + '\n';
      text += '\n\u2192 Booking via official site: butterflyroyalvilla.com';

      var waUrl = 'https://wa.me/212640015353?text=' + encodeURIComponent(text);
      window.open(waUrl, '_blank', 'noopener,noreferrer');
    });
  }

});
