/* Renders the whole invitation from window.WEDDING (a file in /weddings). No content is hard-coded here except default headings. */
(function () {
  'use strict';

  const A = window.ART;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  // Any of these can be overridden per wedding with  text: { key: "..." }
  const DEFAULT_TEXT = {
    tapToOpen: 'Tap to Open',
    invitedLine: 'You are invited',
    heroEyebrow: 'The Wedding Of',
    coupleEyebrow: 'Beginning of Forever', coupleTitle: 'Meet the Couple',
    groomLabel: 'The Groom', brideLabel: 'The Bride',
    storyEyebrow: 'Our Journey', storyTitle: 'How We Met',
    countdownEyebrow: 'Join the Celebration', countdownTitle: 'Counting Down',
    countdownHint: 'Tap the golden lotus to reveal the celebration countdown!',
    countdownDateLabel: 'Our Wedding Date', countdownDone: 'Happily married!',
    eventsEyebrow: 'The Celebration', eventsTitle: 'Wedding Events', navigate: 'Navigate Venue',
    galleryEyebrow: 'Captured Moments', galleryTitle: 'Our Love Gallery',
    rsvpEyebrow: 'Your Presence is a Blessing', rsvpTitle: 'Confirm Your Attendance', respondBy: 'Kindly reply by',
    rsvpButton: 'Send Blessings & Reply',
    wishesTitle: 'Divine Wishes',
    giftsEyebrow: 'Wishing Well', giftsTitle: 'Registry & Gifts',
    thanksEyebrow: 'With Gratitude', thanksTitle: 'Thank You'
  };
  const DEFAULT_SECTIONS = ['couple', 'story', 'countdown', 'events', 'gallery', 'rsvp', 'gifts', 'thanks'];

  // Browsers put a reloaded page back where it was last scrolled to; the invitation must always start at the top
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  const toTop = () => window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

  // ---------- load the wedding file ----------
  const params = new URLSearchParams(location.search);
  const slug = (params.get('w') || document.documentElement.dataset.defaultWedding || '').toLowerCase();
  const guest = (params.get('to') || '').trim().slice(0, 60);

  function fail() {
    document.body.classList.remove('locked');
    $('#app').innerHTML = `<div class="notfound"><h1>Invitation not found</h1><p>Please check the link you received.</p></div>`;
  }

  if (!/^[a-z0-9-]+$/.test(slug)) return fail();
  const loader = document.createElement('script');
  loader.src = `weddings/${slug}.js`;
  loader.onload = () => (window.WEDDING ? start(window.WEDDING) : fail());
  loader.onerror = fail;
  document.head.append(loader);

  // Broken / missing photos fall back to the placeholder underneath
  document.addEventListener('error', e => { if (e.target.matches?.('.ph img, .qr, .story-art img')) e.target.remove(); }, true);

  // ---------- dates ----------
  const ordinal = n => n + (['th', 'st', 'nd', 'rd'][(n % 100 - 20) % 10] || ['th', 'st', 'nd', 'rd'][n % 100] || 'th');
  function dateParts(value, tz) {
    const dateOnly = /^\d{4}-\d{2}-\d{2}$/.test(value);
    const d = new Date(dateOnly ? value + 'T00:00:00Z' : value);
    if (isNaN(d)) return null;
    const p = {};
    new Intl.DateTimeFormat('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: dateOnly ? 'UTC' : tz })
      .formatToParts(d).forEach(x => (p[x.type] = x.value));
    return p;
  }
  const fmtFull = (v, tz) => { const p = dateParts(v, tz); return p ? `${p.weekday}, ${p.day} ${p.month} ${p.year}` : v; };
  const fmtEvent = (v, tz) => { const p = dateParts(v, tz); return p ? `${p.weekday}, ${p.month} ${ordinal(+p.day)}` : v; };
  const fmtBy = (v, tz) => { const p = dateParts(v, tz); return p ? `${p.month} ${p.day}, ${p.year}` : v; };

  // ---------- small building blocks ----------
  const heading = (eyebrow, title, ico) => `<header class="head reveal"><p class="eyebrow">${esc(eyebrow)}</p><h2 class="title">${esc(title)}</h2>${ico ? `<span class="rule ico-rule">${A.icon(ico)}</span>` : '<span class="rule"></span>'}</header>`;
  // `position` (e.g. "70% 20%") chooses which part of the picture stays in view when it is cropped to the frame
  const photo = (src, alt, fallback, position) => `<div class="ph">${fallback}${src ? `<img src="${esc(src)}" alt="${esc(alt)}" loading="lazy"${position ? ` style="object-position:${esc(position)}"` : ''}>` : ''}</div>`;
  // A gallery entry is either "path.jpg" or { src: "path.jpg", position: "50% 20%" }
  const shot = p => (typeof p === 'string' ? { src: p } : p || {});
  const on = sec => sec && sec.enabled !== false;

  function start(D) {
    const T = Object.assign({}, DEFAULT_TEXT, D.text);
    const tz = D.wedding?.timezone || 'Asia/Kolkata';
    const { groom = {}, bride = {} } = D.couple || {};
    const pair = D.couple?.first === 'groom' ? [groom, bride] : [bride, groom];
    const names = pair.map(p => p.firstName || '');
    const monogram = D.couple?.monogram || `${(names[0][0] || '')}&${(names[1][0] || '')}`;
    const coupleLine = `${names[0]} & ${names[1]}`;

    document.title = D.meta?.title || `${coupleLine} | Wedding Invitation`;
    $('meta[name="description"]').content = D.meta?.description || `Join us to celebrate the wedding of ${coupleLine} on ${fmtFull(D.wedding?.date, tz)}.`;
    if (D.photoFilter) document.documentElement.style.setProperty('--photo-filter', D.photoFilter);
    Object.entries(D.theme || {}).forEach(([k, v]) =>
      document.documentElement.style.setProperty('--' + k.replace(/[A-Z]/g, m => '-' + m.toLowerCase()), v));

    // ---------- sections ----------
    const person = (p, label, flip) => `
      <article class="person reveal">
        <div class="frame ${flip ? 'flip' : ''}">${photo(p.photo, p.fullName, `<span class="ph-mono">${esc((p.firstName || '?')[0])}</span>`, p.photoPosition)}</div>
        <p class="eyebrow sm">${esc(label)}</p>
        <h3 class="pname">${esc(p.fullName)}</h3>
        ${p.tagline ? `<p class="ptag">${esc(p.tagline)}</p>` : ''}
        ${p.parents ? `<p class="parents ${flip ? 'flip' : ''}">${esc(p.parents)}</p>` : ''}
      </article>`;

    const S = {
      couple: () => `
        <section class="sec couple" id="couple">
          ${A.sprig('deco tl')}${A.sprig('deco tr')}
          ${heading(T.coupleEyebrow, T.coupleTitle)}
          ${person(groom, T.groomLabel, false)}
          <div class="amp reveal">&amp;</div>
          ${person(bride, T.brideLabel, true)}
          ${D.quote?.text ? `<blockquote class="quote reveal">${D.quote.flowers === false ? '' : A.tuft()}<p>“${esc(D.quote.text)}”</p>${D.quote.caption ? `<cite>— ${esc(D.quote.caption)}</cite>` : ''}</blockquote>` : ''}
          ${D.quote?.river === false ? '' : A.river()}
        </section>`,

      story: () => !on(D.story) || !D.story.items?.length ? '' : `
        <section class="sec story alt" id="story">
          ${D.story.butterflies === false ? '' : A.butterflies()}
          ${heading(T.storyEyebrow, T.storyTitle)}
          <div class="story-wrap ${D.story.illustration === false ? '' : 'has-art'}">
            ${D.story.illustration === false ? '' : `<div class="story-art reveal">${D.story.image ? `<img src="${esc(D.story.image)}" alt="">` : A.coupleArt()}</div>`}
            <ol class="timeline">
              ${D.story.items.map(i => `<li class="reveal"><span class="year">${esc(i.year)}</span><h3>${esc(i.title)}</h3><p>${esc(i.text)}</p></li>`).join('')}
            </ol>
          </div>
        </section>`,

      countdown: () => !on(D.countdown || {}) || !D.wedding?.date ? '' : `
        <section class="sec countdown" id="countdown">
          ${heading(T.countdownEyebrow, T.countdownTitle)}
          <p class="hint reveal" id="cdHint">${esc(T.countdownHint)}</p>
          <button class="lotus reveal" id="lotus" type="button" aria-label="Reveal countdown">${A.lotus()}<span>Reveal</span></button>
          <div class="cd-card" id="cdCard" hidden>
            <p class="eyebrow sm">${esc(T.countdownDateLabel)}</p>
            <p class="cd-date">${esc(fmtFull(D.wedding.date, tz))}</p>
            <div class="cd-grid" id="cdGrid">
              ${['Days', 'Hours', 'Minutes', 'Seconds'].map(u => `<div><b data-u="${u}">0</b><span>${u}</span></div>`).join('')}
            </div>
          </div>
        </section>`,

      events: () => !on(D.events) || !D.events.items?.length ? '' : `
        <section class="sec events alt" id="events">
          ${heading(T.eventsEyebrow, T.eventsTitle)}
          ${D.events.items.map((e, i) => {
            const map = e.mapUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([e.venue, e.address].filter(Boolean).join(', '))}`;
            return `
            <article class="event reveal">
              ${D.events.birds === false ? '' : A.perchBird(i, i % 2 ? 'right' : 'left')}
              <div class="event-in">
                <span class="badge">${A.icon(e.icon)}</span>
                ${e.tag ? `<p class="eyebrow sm">${esc(e.tag)}</p>` : ''}
                <h3>${esc(e.title)}</h3>
                <div class="when">
                  ${e.time ? `<p class="time">${A.icon('clock')}${esc(e.time)}</p>` : ''}
                  ${e.date ? `<p class="day">${esc(e.dateText || fmtEvent(e.date, tz))}</p>` : ''}
                </div>
                <span class="pin">${A.icon('pin')}</span>
                <p class="venue">${esc(e.venue)}</p>
                ${e.address ? `<p class="addr">${esc(e.address)}</p>` : ''}
                <a class="btn dark" href="${esc(map)}" target="_blank" rel="noopener">${A.icon('pin')}${esc(T.navigate)}</a>
              </div>
            </article>`;
          }).join('')}
          ${D.events.animals === false ? '' : A.animals()}
        </section>`,

      gallery: () => !on(D.gallery) || !D.gallery.photos?.length ? '' : `
        <section class="sec gallery" id="gallery">
          ${D.gallery.decor === false ? '' : A.fronds()}
          ${heading(T.galleryEyebrow, T.galleryTitle, 'heart')}
          ${(() => {
            const grid = D.gallery.layout === 'grid';
            const tiles = D.gallery.photos.map(shot).map((p, i) => `<button class="tile ${grid ? 'reveal' : ''}" type="button" data-i="${i}" aria-label="Open photo ${i + 1}">${photo(p.src, `${coupleLine} photo ${i + 1}`, A.icon('heart'), p.position)}</button>`).join('');
            return grid ? `<div class="grid">${tiles}</div>` : `
              <div class="slider reveal">
                <div class="slides" id="slides">${tiles}</div>
                <button class="sl-btn sl-prev" type="button" aria-label="Previous photo">${A.icon('left')}</button>
                <button class="sl-btn sl-next" type="button" aria-label="Next photo">${A.icon('right')}</button>
              </div>
              <div class="dots" id="dots">${D.gallery.photos.map((_, i) => `<button type="button" class="${i ? '' : 'on'}" data-i="${i}" aria-label="Go to photo ${i + 1}"></button>`).join('')}</div>`;
          })()}
        </section>`,

      rsvp: () => !on(D.rsvp) ? '' : `
        <section class="sec rsvp alt" id="rsvp">
          ${D.rsvp.decor === false ? '' : A.vine() + A.sideVine()}
          ${heading(T.rsvpEyebrow, T.rsvpTitle)}
          ${D.rsvp.respondBy ? `<p class="respond reveal">${esc(T.respondBy)} ${esc(fmtBy(D.rsvp.respondBy, tz))}</p>` : ''}
          <form class="card form reveal" id="rsvpForm" novalidate>
            <label>Guest Name<input name="name" type="text" autocomplete="name" maxlength="60" required></label>
            <label>Contact Number<input name="phone" type="tel" autocomplete="tel" maxlength="20"></label>
            <fieldset>
              <legend>Attendance</legend>
              <div class="choice">
                <label><input type="radio" name="attending" value="yes" checked><span><b>Accepts</b>with pleasure</span></label>
                <label><input type="radio" name="attending" value="no"><span><b>Declines</b>with regret</span></label>
              </div>
            </fieldset>
            <div class="guests" id="guestsRow">
              <span class="lbl">Guests Count</span>
              <div class="stepper"><button type="button" data-step="-1" aria-label="Fewer guests">−</button><output id="guestOut">1 Guest</output><button type="button" data-step="1" aria-label="More guests">+</button></div>
            </div>
            <label>Special Blessings<textarea name="message" rows="3" maxlength="300"></textarea></label>
            <p class="form-msg" id="formMsg" role="status"></p>
            ${D.rsvp.whatsappNumber
              ? `<button class="btn wa" type="submit" id="waBtn">${A.icon('send')}Send to WhatsApp</button>`
              : `<button class="btn gold" type="submit">${A.icon('heart')}${esc(T.rsvpButton)}</button>`}
          </form>
          ${D.rsvp.decor === false ? '' : A.monkey()}
          <div class="wish-card reveal">
            <h3 class="subtitle">${esc(T.wishesTitle)}</h3>
            <div class="wishes" id="wishes"></div>
          </div>
          ${D.rsvp.decor === false ? '' : A.jungle()}
        </section>`,

      gifts: () => {
        const g = D.gifts;
        if (!on(g)) return '';
        const bank = g.bank && g.bank.accountNumber ? g.bank : null;
        const row = (k, v) => v ? `<div class="kv"><span>${k}</span><b>${esc(v)}</b></div>` : '';
        const hasDetails = g.upiId || g.qrImage || bank;
        return `
        <section class="sec gifts" id="gifts">
          ${heading(T.giftsEyebrow, T.giftsTitle)}
          <p class="lead reveal">${esc(g.text)}</p>
          ${hasDetails ? `
          <button class="envelope reveal" id="giftBtn" type="button" aria-expanded="false">${A.icon('gift')}<span>Tap to Open</span></button>
          <div class="card gift-card" id="giftCard" hidden>
            ${g.qrImage ? `<img class="qr" src="${esc(g.qrImage)}" alt="Payment QR code">` : ''}
            ${g.upiId ? `<div class="kv"><span>UPI ID</span><b>${esc(g.upiId)}</b><button class="mini" type="button" data-copy="${esc(g.upiId)}">${A.icon('copy')}Copy</button></div>
              <a class="btn dark" href="upi://pay?pa=${encodeURIComponent(g.upiId)}&pn=${encodeURIComponent(g.upiName || '')}&cu=INR">Pay with UPI app</a>` : ''}
            ${bank ? row('Account Name', bank.accountName) + row('Account No.', bank.accountNumber) + row('IFSC', bank.ifsc) + row('Bank', bank.bankName) : ''}
          </div>` : ''}
        </section>`;
      },

      thanks: () => `
        <section class="sec thanks alt" id="thanks">
          ${A.sprig('deco bl')}${A.sprig('deco br')}
          ${heading(T.thanksEyebrow, T.thanksTitle)}
          ${D.thanks?.text ? `<p class="lead reveal">${esc(D.thanks.text)}</p>` : ''}
          <p class="sign reveal">${esc(coupleLine)}</p>
          ${D.thanks?.signoff ? `<p class="signoff reveal">${esc(D.thanks.signoff)}</p>` : ''}
        </section>`
    };

    const credit = D.footer?.credit
      ? `<footer class="foot">Made with ♥ by ${D.footer.creditUrl ? `<a class="credit" href="${esc(D.footer.creditUrl)}" target="_blank" rel="noopener">${esc(D.footer.credit)}</a>` : `<span class="credit">${esc(D.footer.credit)}</span>`}</footer>` : '';

    $('#app').innerHTML = `
      <div class="gate" id="gate">
        <div class="gate-door gate-l">${A.gate('L')}</div>
        <div class="gate-door gate-r">${A.gate('R')}</div>
        <div class="gate-center">
          <p class="gate-to">${esc(T.invitedLine)}${guest ? `<b>${esc(guest)}</b>` : ''}</p>
          <button class="seal" id="seal" type="button">
            <span class="seal-star">✦</span>
            <span class="seal-mono">${esc(monogram)}</span>
            <span class="seal-tap">${esc(T.tapToOpen)}</span>
          </button>
        </div>
      </div>

      <section class="hero" id="hero">
        ${A.cage('l', 96)}${A.cage('r', 132)}
        ${A.canopy()}
        ${A.birds()}
        <div class="petals" aria-hidden="true">${Array.from({ length: 9 }, (_, i) => `<i style="left:${8 + i * 10}%;animation-delay:${(i * 1.7) % 9}s;animation-duration:${9 + (i * 3) % 6}s"></i>`).join('')}</div>
        <div class="hero-text">
          <p class="eyebrow">${esc(T.heroEyebrow)}</p>
          <h1><span>${esc(names[0])}</span><em>&amp;</em><span>${esc(names[1])}</span></h1>
          <p class="hero-date">${esc(fmtFull(D.wedding?.date, tz))}</p>
          <p class="hero-venue">${esc(D.wedding?.venue)}</p>
          <p class="hero-city">${esc(D.wedding?.city)}</p>
        </div>
        ${A.palace()}
        <a class="scroll" href="#couple" aria-label="Scroll down">${A.icon('down')}</a>
      </section>

      ${(D.sections || DEFAULT_SECTIONS).map(k => (S[k] ? S[k]() : '')).join('')}
      ${credit}

      ${D.music?.src || D.music?.builtIn !== false ? `<button class="music" id="musicBtn" type="button" aria-label="Toggle music" hidden>${A.icon('music')}</button>` : ''}
      ${D.music?.src ? `<audio id="audio" src="${esc(D.music.src)}" loop preload="none"></audio>` : ''}
      <div class="lightbox" id="lightbox" hidden>
        <button class="lb-close" type="button" aria-label="Close">${A.icon('close')}</button>
        <button class="lb-prev" type="button" aria-label="Previous">${A.icon('left')}</button>
        <img alt="">
        <button class="lb-next" type="button" aria-label="Next">${A.icon('right')}</button>
      </div>`;

    wireGate(D.music || {});
    wireReveal();
    wireCountdown(D.wedding?.date, T);
    wireGallery((D.gallery?.photos || []).map(p => shot(p).src), D.gallery?.autoplay ?? 4);
    wireRsvp(D, coupleLine);
    wireGifts();
  }

  // ---------- behaviour ----------
  function wireGate(music) {
    const gate = $('#gate'), audio = $('#audio'), btn = $('#musicBtn');
    const useTune = music.builtIn !== false && window.makeTune;
    const tune = useTune ? window.makeTune() : null;
    const mark = on => btn.classList.toggle('playing', on);
    const tunePlayer = { play: () => { tune.play(); mark(true); }, pause: () => { tune.pause(); mark(false); }, get paused() { return tune.paused; } };
    let player = null, opened = false;

    if (audio) {
      const filePlayer = player = { play: () => audio.play().catch(() => {}), pause: () => audio.pause(), get paused() { return audio.paused; } };
      // Ignored once the built-in tune has taken over, so a late event from the failed file can't un-light the button
      audio.addEventListener('play', () => player === filePlayer && mark(true));
      audio.addEventListener('pause', () => player === filePlayer && mark(false));
      // Song file missing or unplayable → fall back to the built-in tune (or hide the button if that is switched off)
      audio.addEventListener('error', () => {
        if (!tune) { player = null; btn.remove(); return; }
        player = tunePlayer;
        if (opened) player.play();
      });
    } else if (tune) player = tunePlayer;

    btn?.addEventListener('click', () => player && (player.paused ? player.play() : player.pause()));
    toTop();
    $('#seal').addEventListener('click', () => {
      toTop();
      gate.classList.add('open');
      document.body.classList.remove('locked');
      document.body.classList.add('opened');
      opened = true;
      if (player) { btn.hidden = false; tune?.unlock(); player.play(); }
      setTimeout(() => gate.remove(), 1900);
    }, { once: true });
  }

  function wireReveal() {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: 0.12 });
    $$('.reveal').forEach(el => io.observe(el));
  }

  function wireCountdown(date, T) {
    const lotus = $('#lotus');
    if (!lotus) return;
    const target = new Date(date).getTime(), grid = $('#cdGrid');
    const tick = () => {
      let s = Math.floor((target - Date.now()) / 1000);
      if (s <= 0) { grid.outerHTML = `<p class="cd-done">${esc(T.countdownDone)}</p>`; clearInterval(timer); return; }
      const v = { Days: Math.floor(s / 86400), Hours: Math.floor(s % 86400 / 3600), Minutes: Math.floor(s % 3600 / 60), Seconds: s % 60 };
      $$('b', grid).forEach(b => (b.textContent = v[b.dataset.u]));
    };
    let timer;
    lotus.addEventListener('click', () => {
      lotus.classList.add('gone'); $('#cdHint').hidden = true;
      $('#cdCard').hidden = false;
      tick(); timer = setInterval(tick, 1000);
    }, { once: true });
  }

  function wireGallery(photos, autoplaySecs) {
    const slides = $('#slides');
    if (slides) {
      const dots = $$('#dots button');
      let cur = 0, timer, settle;
      const mark = n => { cur = n; dots.forEach((d, j) => d.classList.toggle('on', j === cur)); };
      const go = n => { mark((n + photos.length) % photos.length); slides.scrollTo({ left: cur * slides.clientWidth, behavior: 'smooth' }); };
      // Restarted on every interaction so the slider never moves right after the guest touches it
      const play = () => { clearInterval(timer); if (autoplaySecs > 0 && photos.length > 1) timer = setInterval(() => go(cur + 1), autoplaySecs * 1000); };
      // After a swipe comes to rest, light the dot for whichever photo it landed on
      slides.addEventListener('scroll', () => {
        clearTimeout(settle);
        settle = setTimeout(() => mark(Math.round(slides.scrollLeft / slides.clientWidth)), 140);
      }, { passive: true });
      slides.addEventListener('pointerdown', play);
      $('.sl-prev').addEventListener('click', () => { go(cur - 1); play(); });
      $('.sl-next').addEventListener('click', () => { go(cur + 1); play(); });
      dots.forEach(d => d.addEventListener('click', () => { go(+d.dataset.i); play(); }));
      play();
    }

    const lb = $('#lightbox'), img = $('img', lb);
    let i = 0;
    const show = n => { i = (n + photos.length) % photos.length; img.src = photos[i]; };
    const close = () => { lb.hidden = true; img.removeAttribute('src'); };
    $$('.tile').forEach(t => t.addEventListener('click', () => {
      if (!$('img', t)) return;                                         // placeholder tile, nothing to enlarge
      lb.hidden = false; show(+t.dataset.i);
    }));
    $('.lb-close', lb).addEventListener('click', close);
    $('.lb-prev', lb).addEventListener('click', () => show(i - 1));
    $('.lb-next', lb).addEventListener('click', () => show(i + 1));
    lb.addEventListener('click', e => { if (e.target === lb) close(); });
    document.addEventListener('keydown', e => {
      if (lb.hidden) return;
      if (e.key === 'Escape') close(); else if (e.key === 'ArrowLeft') show(i - 1); else if (e.key === 'ArrowRight') show(i + 1);
    });
  }

  function wireRsvp(D, coupleLine) {
    const form = $('#rsvpForm');
    if (!form) return;
    const cfg = D.rsvp, key = 'wishes:' + slug, wall = $('#wishes'), msg = $('#formMsg');
    const max = cfg.maxGuests || 10;
    let guests = 1;

    const load = () => { try { return JSON.parse(localStorage.getItem(key)) || []; } catch { return []; } };
    const save = list => { try { localStorage.setItem(key, JSON.stringify(list)); } catch { /* private mode */ } };
    const draw = list => {
      wall.innerHTML = list.filter(w => w && w.name).map(w => `
        <article class="wish">
          <span class="avatar">${esc(String(w.name)[0].toUpperCase())}</span>
          <div><h4>${esc(w.name)} <small class="${w.attending ? '' : 'no'}">${w.attending ? 'Attending' : 'With regrets'}</small></h4>
          ${w.message ? `<p>“${esc(w.message)}”</p>` : ''}</div>
        </article>`).join('') || '<p class="no-wish">Be the first to send your blessings.</p>';
    };
    const seed = D.wishes || [];
    draw([...load(), ...seed]);
    if (cfg.endpoint) fetch(cfg.endpoint).then(r => r.json()).then(remote => Array.isArray(remote) && draw([...remote.reverse(), ...seed])).catch(() => {});

    const read = () => {
      const f = new FormData(form), attending = f.get('attending') === 'yes';
      return { name: f.get('name').trim(), phone: f.get('phone').trim(), attending, guests: attending ? guests : 0, message: f.get('message').trim() };
    };
    const valid = e => { if (e.name) return true; msg.textContent = 'Please enter your name.'; form.elements.name.focus(); return false; };

    $$('[data-step]', form).forEach(b => b.addEventListener('click', () => {
      guests = Math.min(max, Math.max(1, guests + +b.dataset.step));
      $('#guestOut').textContent = `${guests} Guest${guests > 1 ? 's' : ''}`;
    }));
    form.addEventListener('change', () => { $('#guestsRow').hidden = form.attending.value !== 'yes'; });

    form.addEventListener('submit', ev => {
      ev.preventDefault();
      const e = read();
      if (!valid(e)) return;
      save([{ name: e.name, attending: e.attending, message: e.message }, ...load()]);
      draw([...load(), ...seed]);
      // text/plain keeps this a "simple" request, which Google Apps Script accepts without CORS preflight
      if (cfg.endpoint) fetch(cfg.endpoint, { method: 'POST', body: JSON.stringify({ ...e, wedding: slug }) }).catch(() => {});
      if (cfg.whatsappNumber) {
        const text = [`*Reply to the wedding invitation — ${coupleLine}*`, `Name: ${e.name}`, e.phone && `Contact: ${e.phone}`,
          `Attendance: ${e.attending ? 'Accepts with pleasure' : 'Declines with regret'}`, e.attending && `Guests: ${e.guests}`,
          e.message && `Blessings: ${e.message}`].filter(Boolean).join('\n');
        window.open(`https://wa.me/${String(cfg.whatsappNumber).replace(/\D/g, '')}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
      }
      form.reset(); guests = 1; $('#guestOut').textContent = '1 Guest'; $('#guestsRow').hidden = false;
      msg.textContent = cfg.whatsappNumber ? 'WhatsApp is opening — press send there to deliver your reply.' : 'Thank you! Your blessings have been added.';
    });
  }

  function wireGifts() {
    const btn = $('#giftBtn'), card = $('#giftCard');
    if (!btn) return;
    btn.addEventListener('click', () => { card.hidden = !card.hidden; btn.setAttribute('aria-expanded', String(!card.hidden)); btn.classList.toggle('opened', !card.hidden); });
    $$('[data-copy]', card).forEach(b => b.addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(b.dataset.copy); b.lastChild.textContent = 'Copied'; }
      catch { b.lastChild.textContent = 'Copy failed'; }
      setTimeout(() => (b.lastChild.textContent = 'Copy'), 1800);
    }));
  }
})();
