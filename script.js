/* ═══════════════════════════════════════════════
   VILLA BUTTERFLY MARRAKECH — JavaScript
   ═══════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', function () {

  /* ── LANGUAGE SWITCHER ──────────────────────── */
  let currentLang = 'en';

  window.switchLang = function (lang) {
    currentLang = lang;
    document.documentElement.lang = lang;

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

    document.querySelectorAll('.lang-btn').forEach(function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });
  };

  switchLang('en');


  /* ── HEADER SCROLL EFFECT ───────────────────── */
  var header = document.getElementById('site-header');
  function updateHeader() {
    if (header) header.classList.toggle('scrolled', window.scrollY > 80);
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

    navMenu.querySelectorAll('a, button').forEach(function (el) {
      el.addEventListener('click', function () {
        navToggle.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('is-open');
      });
    });

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
  window._animObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        window._animObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.animate-in').forEach(function (el) {
    window._animObserver.observe(el);
  });


  /* ── GALLERY PREVIEW ────────────────────────── */
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

  window.openPreviewLightbox = function (index) {
    lbImages = previewImages;
    showLightboxAt(index);
    openLightbox();
  };

  window.openModalLightbox = function (index) {
    var items = document.querySelectorAll('#gallery-modal-grid .gm-item');
    lbImages = Array.from(items).map(function (el) {
      return { src: el.getAttribute('data-src'), title: el.getAttribute('data-title') };
    });
    showLightboxAt(index);
    openLightbox();
  };

  document.querySelectorAll('#gallery-preview .gp-item').forEach(function (item) {
    var idx = parseInt(item.getAttribute('data-index'), 10);
    item.addEventListener('click', function () {
      window.openPreviewLightbox(idx);
    });
  });

  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', function (e) {
    if (lightbox.classList.contains('is-open')) {
      if (e.key === 'ArrowLeft')  lbChange(-1);
      if (e.key === 'ArrowRight') lbChange(1);
      if (e.key === 'Escape')     closeLightbox();
    } else if (galleryModal.classList.contains('is-open')) {
      if (e.key === 'Escape') closeGallery();
    }
  });


  /* ── BOOKING FORM — WhatsApp + Firebase + EmailJS ─ */
  var form = document.getElementById('booking-form');

  if (form) {
    var today         = new Date().toISOString().split('T')[0];
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

      if (!name || !phone || !checkin || !checkout || !guests) {
        alert(currentLang === 'fr'
          ? 'Veuillez remplir tous les champs obligatoires (*).'
          : 'Please fill in all required fields (*).');
        return;
      }
      if (checkout <= checkin) {
        alert(currentLang === 'fr'
          ? "La date de départ doit être après la date d'arrivée."
          : 'Check-out date must be after check-in date.');
        return;
      }

      var nights = Math.round((new Date(checkout) - new Date(checkin)) / 86400000);

      // 1 — Save to Firestore (silent, non-blocking)
      try {
        if (typeof firebase !== 'undefined' && firebase.apps.length) {
          firebase.firestore().collection('reservations').add({
            guestName: name,
            phone:     phone,
            checkIn:   checkin,
            checkOut:  checkout,
            guests:    guests,
            occasion:  occasion,
            message:   message,
            source:    'website',
            status:    'new',
            notes:     '',
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
          }).catch(function (err) { console.warn('Firestore save failed:', err.message); });
        }
      } catch (err) { console.warn('Firestore unavailable:', err.message); }

      // 2 — Send email notification via EmailJS (silent, non-blocking)
      try {
        if (typeof emailjs !== 'undefined'
            && typeof EMAILJS_CONFIG !== 'undefined'
            && EMAILJS_CONFIG.publicKey !== 'PASTE_YOUR_EMAILJS_PUBLIC_KEY') {
          emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateId, {
            guest_name: name,
            phone:      phone,
            check_in:   checkin,
            check_out:  checkout,
            nights:     nights,
            num_guests: guests,
            occasion:   occasion || 'Not specified',
            message:    message  || 'None',
            to_email:   'villayellowbutterfly@gmail.com'
          }).catch(function (err) { console.warn('EmailJS failed:', err); });
        }
      } catch (err) { console.warn('EmailJS unavailable:', err.message); }

      // 3 — Open WhatsApp (always runs)
      var text = 'Hello! I would like to book Villa Butterfly Marrakech.\n\n'
        + '👤 Name: '     + name     + '\n'
        + '📞 Phone: '    + phone    + '\n'
        + '📅 Check-in: ' + checkin  + '\n'
        + '📅 Check-out: '+ checkout + '\n'
        + '🌙 Duration: ' + nights + ' night' + (nights > 1 ? 's' : '') + '\n'
        + '👥 Guests: '   + guests   + '\n'
        + (occasion ? '🎉 Occasion: ' + occasion + '\n' : '')
        + (message  ? '💬 Message: '  + message  + '\n' : '')
        + '\n→ Booking via official site: villayellowbutterfly.com';

      window.open('https://wa.me/212640015353?text=' + encodeURIComponent(text),
        '_blank', 'noopener,noreferrer');
    });
  }


  /* ── FIREBASE DYNAMIC CONTENT ─────────────────── */
  if (typeof firebase !== 'undefined' && firebase.apps.length) {
    var _fbdb = firebase.firestore();
    loadDynamicPricing(_fbdb);
    loadAvailabilityCalendar(_fbdb);
    loadActiveOffers(_fbdb);
    loadExtraServices(_fbdb);
  } else {
    renderCalendarFallback();
  }

});


/* ── DYNAMIC PRICING ────────────────────────────── */
function loadDynamicPricing(db) {
  db.collection('settings').doc('pricing').get().then(function (doc) {
    if (!doc.exists) return;
    var data = doc.data();
    var map  = { low: 'price-low', high: 'price-high', peak: 'price-peak' };
    Object.keys(map).forEach(function (k) {
      if (!data[k] || !data[k].price) return;
      var el = document.getElementById(map[k]);
      if (!el) return;
      var nightSpan = el.querySelector('span');
      el.textContent = '€' + Number(data[k].price).toLocaleString('en-US');
      if (nightSpan) el.appendChild(nightSpan);
    });
  }).catch(function () {});
}


/* ── ACTIVE OFFERS ──────────────────────────────── */
function loadActiveOffers(db) {
  db.collection('offers').where('active', '==', true).get().then(function (snap) {
    if (snap.empty) return;
    var section = document.getElementById('offers-section');
    var grid    = document.getElementById('offers-grid');
    var lang    = document.documentElement.lang || 'en';
    var html    = '';

    snap.forEach(function (doc) {
      var d     = doc.data();
      var title = (lang === 'fr' && d.titleFr) ? d.titleFr : (d.titleEn || '');
      var desc  = (lang === 'fr' && d.descFr)  ? d.descFr  : (d.descEn  || '');
      var period = (d.startDate && d.endDate)
        ? d.startDate + ' — ' + d.endDate : '';

      html += '<div class="offer-card animate-in">'
        + (d.discount ? '<div class="offer-badge">-' + d.discount + '%</div>' : '')
        + '<h3>' + _esc(title)  + '</h3>'
        + (desc   ? '<p>'                       + _esc(desc)   + '</p>' : '')
        + (period ? '<p class="offer-period">📅 ' + _esc(period) + '</p>' : '')
        + '<a class="btn btn-gold" href="#booking">Book Now</a>'
        + '</div>';
    });

    grid.innerHTML = html;
    section.style.display = '';

    document.querySelectorAll('.offer-card.animate-in').forEach(function (el) {
      if (window._animObserver) window._animObserver.observe(el);
    });
  }).catch(function () {});
}


/* ── EXTRA SERVICES ─────────────────────────────── */
function loadExtraServices(db) {
  db.collection('services').where('active', '==', true)
    .orderBy('createdAt', 'asc').get().then(function (snap) {
      if (snap.empty) return;
      var section = document.getElementById('extra-services-section');
      var grid    = document.getElementById('extra-services-grid');
      var lang    = document.documentElement.lang || 'en';
      var html    = '';

      snap.forEach(function (doc) {
        var d    = doc.data();
        var name = (lang === 'fr' && d.nameFr) ? d.nameFr : (d.nameEn || '');
        var desc = (lang === 'fr' && d.descFr) ? d.descFr : (d.descEn || '');
        html += '<div class="amenity-item animate-in">'
          + '<div class="amenity-icon">' + (d.icon || '⭐') + '</div>'
          + '<h4>'  + _esc(name) + '</h4>'
          + '<p>'   + _esc(desc) + '</p>'
          + '</div>';
      });

      grid.innerHTML = html;
      section.style.display = '';
    }).catch(function () {});
}


/* ── AVAILABILITY CALENDAR ──────────────────────── */
function loadAvailabilityCalendar(db) {
  db.collection('settings').doc('availability').get()
    .then(function (doc) {
      var ranges = doc.exists ? (doc.data().ranges || []) : [];
      renderCalendar(ranges);
    })
    .catch(function () { renderCalendarFallback(); });
}

function renderCalendarFallback() {
  renderCalendar([]);
}

function renderCalendar(bookedRanges) {
  var container = document.getElementById('avail-calendar');
  if (!container) return;

  var today = new Date();
  today.setHours(0, 0, 0, 0);
  var todayStr = _toDateStr(today);

  var html = '<div class="cal-months">';
  for (var m = 0; m < 3; m++) {
    html += _buildMonth(today.getFullYear(), today.getMonth() + m, todayStr, bookedRanges);
  }
  html += '</div>';
  container.innerHTML = html;
}

function _buildMonth(year, monthOffset, todayStr, bookedRanges) {
  var date = new Date(year, monthOffset, 1);
  var yr   = date.getFullYear();
  var mo   = date.getMonth();
  var monthNames = ['January','February','March','April','May','June',
                    'July','August','September','October','November','December'];
  var dayNames   = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

  var html = '<div class="cal-month">';
  html += '<div class="cal-month-name">' + monthNames[mo] + ' ' + yr + '</div>';
  html += '<div class="cal-grid">';
  dayNames.forEach(function (d) { html += '<div class="cal-dow">' + d + '</div>'; });

  var firstDay = (new Date(yr, mo, 1).getDay() + 6) % 7;
  for (var i = 0; i < firstDay; i++) {
    html += '<div class="cal-day cal-empty"></div>';
  }

  var daysInMonth = new Date(yr, mo + 1, 0).getDate();
  for (var d = 1; d <= daysInMonth; d++) {
    var dateStr  = yr + '-' + _pad2(mo + 1) + '-' + _pad2(d);
    var isPast   = dateStr <  todayStr;
    var isToday  = dateStr === todayStr;
    var isBooked = _isDateBooked(dateStr, bookedRanges);

    var cls = 'cal-day';
    if (isPast)   cls += ' cal-past';
    if (isToday)  cls += ' cal-today';
    if (isBooked) cls += ' cal-booked';

    html += '<div class="' + cls + '">' + d + '</div>';
  }

  html += '</div></div>';
  return html;
}

function _isDateBooked(dateStr, ranges) {
  return ranges.some(function (r) {
    return dateStr >= r.checkIn && dateStr < r.checkOut;
  });
}

function _toDateStr(d) {
  return d.getFullYear() + '-' + _pad2(d.getMonth() + 1) + '-' + _pad2(d.getDate());
}

function _pad2(n) { return n < 10 ? '0' + n : String(n); }

function _esc(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
