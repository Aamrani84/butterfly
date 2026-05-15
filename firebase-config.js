// ═══════════════════════════════════════════════
// VILLA BUTTERFLY — Firebase & EmailJS Config
// Fill in your values — see SETUP.md for full guide
// ═══════════════════════════════════════════════

const FIREBASE_CONFIG = {
  apiKey:            "AIzaSyCzvmUj-l7XFVgq7GnwZnc4eJDRAH8-arg",
  authDomain:        "villa-butterfly-b1f2c.firebaseapp.com",
  projectId:         "villa-butterfly-b1f2c",
  storageBucket:     "villa-butterfly-b1f2c.firebasestorage.app",
  messagingSenderId: "888265427960",
  appId:             "1:888265427960:web:cb74c95b97176afd71a40d"
};

const EMAILJS_CONFIG = {
  publicKey:  "hNHdWkXSUXBqgIlPV",
  serviceId:  "service_vt6xsls",
  templateId: "template_no97k0t"
};

// Initialise Firebase (skips silently if not yet configured)
if (typeof firebase !== 'undefined' && !firebase.apps.length) {
  try {
    firebase.initializeApp(FIREBASE_CONFIG);
  } catch (err) {
    console.warn('[VillaButterfly] Firebase init error:', err.message);
  }
}

// Initialise EmailJS
if (typeof emailjs !== 'undefined' && EMAILJS_CONFIG.publicKey !== 'PASTE_YOUR_EMAILJS_PUBLIC_KEY') {
  emailjs.init(EMAILJS_CONFIG.publicKey);
}
