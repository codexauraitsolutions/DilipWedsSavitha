# Wedding Invitation Website

One template, unlimited weddings. Every name, date, venue, event, photo and message comes from a single data file per wedding — you never touch the design code.

## Change the details

Open [weddings/karthik-weds-ananya.js](weddings/karthik-weds-ananya.js) in any text editor and change the values. Save, refresh the browser.

| To change | Edit this in the data file |
|---|---|
| Names, parents, photos | `couple` |
| Wedding date, venue, city (hero + countdown) | `wedding` |
| Story timeline | `story.items` |
| Events (add/remove as many as you like) | `events.items` |
| Gallery photos | `gallery.photos` |
| RSVP deadline, WhatsApp number | `rsvp` |
| UPI / bank / QR | `gifts` |
| Music | `music.src` |
| Which part of a photo shows in its frame | `photoPosition` on the bride/groom, or `{ src, position }` in the gallery (e.g. `"70% 20%"` = towards the right, near the top) |
| Colour grade for all photos | `photoFilter` (leave out or `""` for photos exactly as shot) |
| Hide a section | `enabled: false` inside that section |
| Colours, heading text, section order | `theme`, `text`, `sections` (optional, at the bottom) |

Dates like "Sunday, 6 December 2026" and the countdown are generated automatically from the date you type.

## Make an invitation for a new couple

1. Copy `weddings/karthik-weds-ananya.js` → `weddings/rahul-weds-priya.js` (lowercase letters, numbers and `-` only).
2. Edit the values.
3. Put their photos in `assets/photos/rahul-weds-priya/` and their song in `assets/music/`, and point the data file at them.
4. Share the link: `https://your-site.com/?w=rahul-weds-priya`

Personalised link for a guest: add `&to=Ravi+%26+Family` and their name appears on the opening screen.

The invitation shown when a link has no `?w=` is set in [index.html](index.html) (`data-default-wedding`).

## Photos and music

- Couple photos: portrait, about 900×1200 px. Gallery: any size, under ~400 KB each for fast loading.
- If a photo file is missing, a monogram placeholder is shown instead, so nothing looks broken.
- If the music file is missing, the site plays its own built-in instrumental tune instead (`js/tune.js`). Set `builtIn: false` under `music` to have no music at all when there is no file.

## Preview on your computer

Double-click `index.html`, or run this in the project folder and open http://localhost:5173

```bash
python -m http.server 5173
```

## Put it online

It is a plain static site (no build step, no database). Upload the whole folder to Netlify, Vercel, GitHub Pages, Cloudflare Pages or any web hosting.

## RSVP: how it works

- **Send to WhatsApp** opens WhatsApp with the guest's reply typed out, addressed to `rsvp.whatsappNumber`.
- **Send Blessings & RSVP** adds the wish to the wall on that guest's own device.
- To collect every RSVP in a Google Sheet and show all guests' wishes to everyone, create a Google Sheet → Extensions → Apps Script, paste the code below, Deploy → Web app → access "Anyone", and paste the URL into `rsvp.endpoint`.

```js
function doPost(e) {
  const d = JSON.parse(e.postData.contents);
  SpreadsheetApp.getActiveSheet().appendRow([new Date(), d.wedding, d.name, d.phone, d.attending, d.guests, d.message]);
  return ContentService.createTextOutput('ok');
}
function doGet() {
  const rows = SpreadsheetApp.getActiveSheet().getDataRange().getValues();
  const wishes = rows.map(r => ({ name: r[2], attending: r[4], message: r[6] }));
  return ContentService.createTextOutput(JSON.stringify(wishes)).setMimeType(ContentService.MimeType.JSON);
}
```

## Files

- `index.html` – page shell
- `weddings/*.js` – **the data you edit** (one file per wedding)
- `js/app.js` – builds the page from the data
- `js/art.js` – the illustrations (gate, palace, foliage, lotus, icons), drawn in code
- `css/style.css` – design
