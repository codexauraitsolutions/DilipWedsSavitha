/*
  WEDDING DATA FILE
  -----------------
  Everything the guest sees comes from this file. To make a new invitation:
    1. Copy this file and rename it, e.g.  rahul-weds-priya.js
    2. Change the values below.
    3. Open  index.html?w=rahul-weds-priya

  Rules: keep the quotes "" around text, keep the commas at line ends.
  Any section can be switched off with  enabled: false.
*/
window.WEDDING = {

  // ---------- THE COUPLE ----------
  couple: {
    first: "bride",                       // whose name appears first: "bride" or "groom"
    monogram: "",                         // leave "" to auto-build from initials (e.g. A&K)
    groom: {
      firstName: "Karthik",
      fullName: "Karthik Reddy",
      photo: "assets/photos/karthik-weds-ananya/groom.jpg",
      tagline: "With Divine Blessings...",
      parents: "Son of Mr. Srinivas Reddy & Mrs. Lakshmi Reddy"
    },
    bride: {
      firstName: "Ananya",
      fullName: "Ananya Rao",
      photo: "assets/photos/karthik-weds-ananya/bride.jpg",
      tagline: "In the presence of love...",
      parents: "Daughter of Mr. Venkat Rao & Mrs. Padmaja Rao"
    }
  },

  // ---------- MAIN DATE & VENUE (hero + countdown) ----------
  wedding: {
    date: "2026-12-06T10:30:00+05:30",    // YYYY-MM-DDTHH:MM:SS+05:30 (India time)
    timezone: "Asia/Kolkata",
    venue: "The Royal Gardens, Lakeview Palace",
    city: "Hyderabad"
  },

  // ---------- QUOTE (under the couple) ----------
  quote: {
    text: "Under the beautiful canopy of divine grace, two hearts unite in holy matrimony. A sacred covenant of eternal love, happiness, and shared dreams.",
    caption: "A Divine Promise",
    flowers: true,                        // grass and flowers on top of the quote card; false to remove
    river: true                           // river scene under the quote; false to remove
  },

  // ---------- OUR JOURNEY ----------
  story: {
    enabled: true,
    butterflies: true,                    // butterflies hanging at the top of the story; false to remove
    illustration: true,                  // couple picture beside the story; false to remove
    image: "",                            // "" = built-in drawing. Or your own picture, e.g. "assets/photos/karthik-weds-ananya/couple.png" (transparent PNG looks best)
    items: [
      { year: "2021", title: "First Met",      text: "We crossed paths at a friend's housewarming — one shared plate of biryani later, the conversation never really stopped." },
      { year: "2023", title: "Shared Dreams",  text: "Countless weekend drives, filter coffees, and the quiet realisation that we were meant to be." },
      { year: "2025", title: "The Proposal",   text: "On a misty morning in the hills, Karthik asked, and Ananya said Yes!" },
      { year: "2026", title: "Forever Begins", text: "Now we invite you to share our joy as we pledge a lifetime of always to one another." }
    ]
  },

  // ---------- EVENTS (add / remove blocks freely) ----------
  events: {
    enabled: true,
    birds: true,                          // little birds perched on the event cards; false to remove
    animals: true,                        // row of animals under the last card; false to remove
    items: [
      {
        tag: "First Ceremony",
        title: "Haldi & Sangeet",
        icon: "sparkles",                 // sparkles | rings | calendar | music | glass | heart
        date: "2026-12-05",
        time: "6:30 PM Onwards",
        venue: "Grand Ballroom, Lakeview Palace",
        address: "Banjara Hills, Hyderabad, India",
        mapUrl: ""                        // paste a Google Maps link, or leave "" to auto-search the venue
      },
      {
        tag: "Main Ritual",
        title: "Wedding Ceremony",
        icon: "rings",
        date: "2026-12-06",
        time: "10:30 AM Onwards",
        venue: "The Royal Gardens, Lakeview Palace",
        address: "Banjara Hills, Hyderabad, India",
        mapUrl: ""
      },
      {
        tag: "Celebration",
        title: "Grand Reception",
        icon: "glass",
        date: "2026-12-06",
        time: "7:30 PM Onwards",
        venue: "Grand Ballroom, Lakeview Palace",
        address: "Banjara Hills, Hyderabad, India",
        mapUrl: ""
      }
    ]
  },

  // ---------- GALLERY (any number of photos) ----------
  gallery: {
    enabled: true,
    decor: true,                          // faint palm leaves behind the heading; false to remove
    layout: "slider",                     // "slider" = one photo at a time with arrows, "grid" = all photos in a grid
    autoplay: 4,                          // slider moves to the next photo every 4 seconds; 0 = only when tapped
    photos: [
      "assets/photos/karthik-weds-ananya/1.jpg",
      "assets/photos/karthik-weds-ananya/2.jpg",
      "assets/photos/karthik-weds-ananya/3.jpg",
      "assets/photos/karthik-weds-ananya/4.jpg",
      "assets/photos/karthik-weds-ananya/5.jpg",
      "assets/photos/karthik-weds-ananya/6.jpg"
    ]
  },

  // ---------- RSVP ----------
  rsvp: {
    enabled: true,
    decor: true,                          // all RSVP artwork: top vine and bird houses, side creeper, monkey, jungle at the bottom; false to remove
    respondBy: "2026-11-25",
    whatsappNumber: "910000000000",       // country code + number, no + or spaces. "" hides the WhatsApp button
    maxGuests: 10,
    endpoint: ""                          // optional Google Sheet web-app URL (see README) so wishes are shared between guests
  },

  // Wishes shown on the wall from the start
  wishes: [
    { name: "Reddy Family", attending: true, message: "Wishing you a lifetime of love and happiness together." },
    { name: "Sahithi",      attending: true, message: "So happy for you both. Can't wait to celebrate!" }
  ],

  // ---------- GIFTS ----------
  gifts: {
    enabled: true,
    text: "Your presence on our special day is the greatest gift of all. However, should you wish to bless us with a gift, a contribution towards our dream home and future together would be sincerely appreciated.",
    upiId: "yourname@upi",
    upiName: "Karthik Reddy",
    qrImage: "",                          // e.g. "assets/photos/karthik-weds-ananya/qr.png"
    bank: { accountName: "", accountNumber: "", ifsc: "", bankName: "" }   // leave "" to hide
  },

  // ---------- THANK YOU ----------
  thanks: {
    text: "It is the greatest honor to have you as part of our story. May your life be filled with love, light, and lasting joy. We can't wait to celebrate with you!",
    signoff: "Wishing you a lifetime of love and happiness."
  },

  // ---------- MUSIC (starts when the guest taps to open) ----------
  // Plays the song file if it exists; otherwise the site's built-in instrumental tune. builtIn: false = silence when there is no file.
  music: { src: "assets/music/song.mp3", builtIn: true },

  // ---------- FOOTER CREDIT ----------
  footer: { credit: "MaNaVi Capture Studios", creditUrl: "" },

  // ---------- OPTIONAL: colours ----------
  // theme: { bg: "#edf3ef", ink: "#2f3e36", gold: "#bda06a", dark: "#12281d", heroInk: "#6b4a2a" },

  // ---------- OPTIONAL: change any heading text ----------
  // text: { coupleTitle: "Meet the Couple", eventsTitle: "Wedding Events" }   // full list in js/app.js (DEFAULT_TEXT)

  // ---------- OPTIONAL: section order ----------
  // sections: ["couple", "story", "countdown", "events", "gallery", "rsvp", "gifts", "thanks"]
};
