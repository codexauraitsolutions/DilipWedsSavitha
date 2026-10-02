/*
  WEDDING DATA FILE — Dilip weds Savitha (20 November 2026)
  Every field is explained in  weddings/karthik-weds-ananya.js  (the template).
*/
window.WEDDING = {

  // ---------- THE COUPLE ----------
  couple: {
    first: "groom",                       // whose name appears first: "bride" or "groom"
    monogram: "",                         // "" = auto (D&S)
    groom: {
      firstName: "Dilip",
      fullName: "Channagiri Dilip Pavan Sai",
      photo: "assets/photos/dilip-weds-savitha/groom.jpg",
      photoPosition: "50% 22%",           // which part of the photo stays in the frame (left-right%, top-bottom%)
      tagline: "With Divine Blessings...",
      parents: "Son of Sri Channagiri Srihari & Smt. Channagiri Prasanna Lakshmi"
    },
    bride: {
      firstName: "Savitha",
      fullName: "Kurmala Hari Sri Savitha",
      photo: "assets/photos/dilip-weds-savitha/bride.jpg",
      photoPosition: "78% 30%",
      tagline: "In the presence of love...",
      parents: "Daughter of Sri Kurmala Chandra Sekhar & Smt. Kurmala Jayapradha"
    }
  },

  // ---------- MAIN DATE & VENUE (hero + countdown) ----------
  wedding: {
    date: "2026-11-20T09:40:00+05:30",    // Friday, 20 November 2026, Muhurtham 9:40 AM
    timezone: "Asia/Kolkata",
    venue: "Vijayam Convention",
    city: "Guntur"
  },

  // Gentle colour grade so the photos sit with the soft green-and-gold page. "" = photos exactly as shot.
  photoFilter: "saturate(.86) contrast(.97) brightness(1.03) sepia(.07)",

  // ---------- QUOTE ----------
  quote: {
    text: "Under the beautiful canopy of divine grace, two hearts unite in holy matrimony. A sacred covenant of eternal love, happiness, and shared dreams.",
    caption: "A Divine Promise",
    flowers: true,
    river: true
  },

  // ---------- OUR JOURNEY (hidden) ----------
  story: { enabled: false, items: [] },

  // ---------- EVENTS ----------
  events: {
    enabled: true,
    birds: true,
    animals: true,
    items: [
      {
        tag: "Sumuhurtham",
        title: "Wedding Ceremony",
        icon: "rings",
        date: "2026-11-20",
        time: "Muhurtham 9:40 AM",
        venue: "Vijayam Convention",
        address: "Venugopalnagar, Gauthami Nagar, Guntur, Andhra Pradesh 522007",
        mapUrl: "https://maps.app.goo.gl/Ktd6U4Nb51B9zdx27"
      },
      {
        tag: "Pooja",
        title: "Satyanarayana Vratham",
        icon: "sparkles",
        date: "2026-11-21",
        time: "8:00 AM",
        venue: "At Home",
        address: "Atluri Avenue, KVR Colony Road No. 1, Enikepadu, Vijayawada 521108",
        mapUrl: "https://maps.app.goo.gl/UoApu9gkwJk6FrbB6"
      },
      {
        tag: "Celebration",
        title: "Reception",
        icon: "glass",
        date: "2026-11-21",
        time: "7:30 PM Onwards",
        venue: "Swarna Convention",
        address: "Guru Nanak Road, beside NAC Kalyana Vedika, opp. NextGen School, Guru Nanak Colony, Vijayawada, Andhra Pradesh 520007",
        mapUrl: "https://maps.app.goo.gl/Jme8svvyvabNNmzY9"
      }
    ]
  },

  // ---------- GALLERY ----------
  gallery: {
    enabled: true,
    decor: true,
    layout: "slider",
    autoplay: 4,
    photos: [
      { src: "assets/photos/dilip-weds-savitha/couple-2.jpg", position: "50% 30%" },
      { src: "assets/photos/dilip-weds-savitha/couple-1.jpg", position: "50% 20%" },
      { src: "assets/photos/dilip-weds-savitha/groom.jpg",    position: "50% 22%" },
      { src: "assets/photos/dilip-weds-savitha/bride.jpg",    position: "78% 30%" }
    ]
  },

  // ---------- RSVP ----------
  rsvp: {
    enabled: true,
    decor: true,
    respondBy: "",                        // e.g. "2026-11-10"; "" hides the line
    whatsappNumber: "919100867234",       // +91 91008 67234 — country code + number, no + or spaces; "" hides the WhatsApp button
    maxGuests: 10,
    endpoint: ""
  },

  wishes: [],

  // ---------- GIFTS (hidden) ----------
  gifts: { enabled: false },

  // ---------- THANK YOU ----------
  thanks: {
    text: "It is the greatest honor to have you as part of our story. May your life be filled with love, light, and lasting joy. We can't wait to celebrate with you!",
    signoff: "With best compliments from Channagiri Srihari & Prasanna Lakshmi"
  },

  // ---------- MUSIC ----------
  // Plays the song file if it exists; otherwise the site's built-in instrumental tune. builtIn: false = silence when there is no file.
  music: { src: "assets/music/dilip-weds-savitha.mp3", builtIn: true },

  // ---------- FOOTER CREDIT ----------
  footer: { credit: "MaNaVi Capture Studios", creditUrl: "" }
};
