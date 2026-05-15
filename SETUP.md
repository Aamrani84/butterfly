# Villa Butterfly — Reservation System Setup Guide

This guide walks you through the one-time setup. Once done, the system runs automatically forever.

---

## Overview of What Was Built

| File | Purpose |
|------|---------|
| `portal.html` | Private dashboard for Manager and Owner/Admin |
| `firebase-config.js` | Your credentials (fill in after steps below) |
| `index.html` | Updated with availability calendar + booking system |
| `script.js` | Updated to save bookings to database + send email |
| `styles.css` | Updated with calendar and offer styles |

---

## STEP 1 — Create a Firebase Project (Free)

1. Go to **https://console.firebase.google.com**
2. Click **"Add project"** → Name it `villa-butterfly` → Continue
3. Disable Google Analytics (not needed) → **Create project**
4. When ready, click **Continue**

---

## STEP 2 — Enable Firestore Database

1. In the left menu click **"Firestore Database"**
2. Click **"Create database"**
3. Choose **"Start in production mode"** → Next
4. Choose region: **`europe-west1`** (closest to Morocco) → Enable
5. Once created, go to the **"Rules"** tab and replace with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    function isAuth() { return request.auth != null; }
    function getRole() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role;
    }
    function isAdmin()   { return isAuth() && getRole() == 'admin'; }
    function isStaff()   { return isAuth() && (getRole() == 'admin' || getRole() == 'manager'); }

    match /reservations/{id} {
      allow create: if true;
      allow read, update: if isStaff();
      allow delete: if isAdmin();
    }
    match /settings/{doc} {
      allow read: if true;
      allow write: if isAdmin();
    }
    match /offers/{id} {
      allow read: if true;
      allow write: if isAdmin();
    }
    match /services/{id} {
      allow read: if true;
      allow write: if isAdmin();
    }
    match /users/{uid} {
      allow read: if isAuth() && request.auth.uid == uid;
      allow write: if false;
    }
  }
}
```

6. Click **"Publish"**

---

## STEP 3 — Enable Firebase Storage (for contract PDFs)

1. In the left menu click **"Storage"**
2. Click **"Get started"** → Production mode → Choose same region → Done
3. Go to **"Rules"** tab and replace with:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /contracts/{reservationId}/{fileName} {
      allow read, write: if request.auth != null;
    }
  }
}
```

4. Click **"Publish"**

---

## STEP 4 — Enable Email/Password Authentication

1. In the left menu click **"Authentication"**
2. Click **"Get started"**
3. Under **"Sign-in method"**, click **"Email/Password"**
4. Enable the first toggle → **Save**

---

## STEP 5 — Create the Manager Account

1. Still in Authentication, click **"Users"** tab → **"Add user"**
2. Email: the manager's email (e.g. `manager@gmail.com`)
3. Password: choose a strong password → **Add user**
4. Copy the **User UID** shown in the table (long string like `abc123...`)

---

## STEP 6 — Create the Owner/Admin Account

1. Same as above — **"Add user"**
2. Email: `villayellowbutterfly@gmail.com` (or owner's email)
3. Password: strong password → **Add user**
4. Copy the **User UID**

---

## STEP 7 — Set User Roles in Firestore

1. In Firestore, click **"Start collection"** → Collection ID: `users` → Next
2. Document ID: paste the **manager's UID** → Add fields:
   - `role` (string) = `manager`
   - `name` (string) = `Manager` (or their actual name)
   - Click **Save**
3. Click **"Add document"** → Document ID: paste the **owner's UID** → Add fields:
   - `role` (string) = `admin`
   - `name` (string) = `Owner` (or their actual name)
   - Click **Save**

---

## STEP 8 — Get Your Firebase Config Credentials

1. In Firebase Console, click the **gear icon** (⚙️) → **"Project settings"**
2. Scroll down to **"Your apps"** → Click **"</> Web"** (Add web app)
3. App nickname: `villa-butterfly-web` → **Register app**
4. You will see a code block like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "villa-butterfly-xxxxx.firebaseapp.com",
  projectId: "villa-butterfly-xxxxx",
  storageBucket: "villa-butterfly-xxxxx.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef..."
};
```

5. Open the file **`firebase-config.js`** in this folder
6. Replace each `PASTE_YOUR_...` value with the values from your Firebase console

---

## STEP 9 — Set Up EmailJS (for email notifications)

1. Go to **https://www.emailjs.com** → Create a free account
2. Click **"Add New Service"** → Choose **Gmail** → Connect your Gmail account
3. Note down your **Service ID** (e.g. `service_abc123`)
4. Click **"Email Templates"** → **"Create New Template"**
5. Set the template up as follows:

**To email:** `{{to_email}}`
**Subject:** `🦋 New Booking — {{guest_name}} | {{check_in}} to {{check_out}}`
**Body:**
```
New Reservation Inquiry — Villa Butterfly

Guest: {{guest_name}}
Phone: {{phone}}
Check-in: {{check_in}}
Check-out: {{check_out}}
Duration: {{nights}} nights
Guests: {{num_guests}}
Occasion: {{occasion}}
Message: {{message}}

Log in to the portal to manage this reservation.
```

6. Click **Save** and note down the **Template ID**
7. Go to **Account** → note down your **Public Key**
8. Open `firebase-config.js` and fill in the three EmailJS values

---

## STEP 10 — Deploy to Netlify

1. Make sure all files are saved
2. Push to GitHub (or drag-and-drop the folder to Netlify dashboard)
3. Netlify will deploy automatically

---

## STEP 11 — Share Access

- **Portal URL:** `https://villayellowbutterfly.com/portal.html`
- Share this URL privately with the manager and owner
- They log in with the email/password created in Steps 5 & 6

---

## How the System Works (Summary)

### When a guest books on the website:
1. Form saves the reservation to Firestore with status **"New"**
2. Email is sent automatically to `villayellowbutterfly@gmail.com`
3. WhatsApp opens for the manager with all details (as before)

### Manager's daily workflow:
1. Open `portal.html` on mobile
2. See all reservations in the **Reservations** tab
3. Tap a reservation → change status as the conversation progresses
4. When pre-payment received → change status to **"Confirmed"**
5. Upload the contract PDF → share link via WhatsApp button

### Adding an agency booking:
1. Portal → **"Add Booking"** tab
2. Fill in guest details → Source: **Agency** → Add

### Owner's view:
1. Open `portal.html`
2. See all reservations in real-time (updates automatically)
3. Admin tabs: change prices, add offers, add services

### Availability calendar on the website:
- Shows automatically — any reservation with status **"Confirmed"** or **"Awaiting Payment"** appears as blocked (red) dates
- Guests see this before submitting their request

---

## Firestore Collections Reference

| Collection | Purpose |
|-----------|---------|
| `reservations` | All bookings (website + manual) |
| `settings/pricing` | Seasonal prices (editable in portal) |
| `offers` | Special promotions (shown on website when active) |
| `services` | Extra services (shown on website when active) |
| `users` | Staff accounts with roles |

---

## Need Help?

Contact the developer at: **abdelbassetamrani1@gmail.com**
