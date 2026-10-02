/* Built-in background music: a soft plucked melody over a drone, generated in the browser.
   Used when a wedding has no song file of its own, so no audio file needs to ship with the site. */
(function () {
  'use strict';

  const BPM = 72, BEAT = 60 / BPM;
  const SA = 293.66;                                    // D4 — every note is a semitone offset from this
  const hz = semis => SA * Math.pow(2, semis / 12);

  // [semitones above Sa, length in beats] — eight bars of four beats, in the Kalyani (Yaman) scale
  const MELODY = [
    [-1, .5], [2, .5], [4, 1], [6, .5], [7, 1.5],
    [9, .5], [7, .5], [6, .5], [4, .5], [2, 1], [4, 1],
    [7, 1], [9, .5], [11, .5], [12, 2],
    [11, .5], [9, .5], [7, 1], [6, .5], [4, .5], [2, 1],
    [4, .5], [6, .5], [7, 1], [9, 1], [7, 1],
    [6, .5], [4, .5], [2, 1], [-1, .5], [2, .5], [0, 1],
    [4, 1], [7, 1], [12, 1.5], [11, .5],
    [9, .5], [7, .5], [4, .5], [2, .5], [0, 2]
  ];

  // Flatten to timed events and add a low Sa / Pa pluck under each bar
  const EVENTS = [];
  let at = 0;
  MELODY.forEach(([n, len]) => { EVENTS.push({ at, f: hz(n), vol: 0.22, ring: 1.4 + len * 0.5 }); at += len; });
  const LOOP = at;
  for (let b = 0; b < LOOP; b += 4) {
    EVENTS.push({ at: b, f: hz(-12), vol: 0.16, ring: 3 }, { at: b + 2, f: hz(-5), vol: 0.1, ring: 2.4 });
  }
  EVENTS.sort((a, b) => a.at - b.at);

  window.makeTune = function () {
    let ctx, out, timer, next = 0, loopStart = 0, playing = false;

    function build() {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      out = ctx.createGain(); out.gain.value = 0.9;
      const echo = ctx.createDelay(1), back = ctx.createGain(), wet = ctx.createGain();
      echo.delayTime.value = BEAT * 0.75; back.gain.value = 0.32; wet.gain.value = 0.3;
      out.connect(ctx.destination);
      out.connect(echo); echo.connect(back); back.connect(echo); echo.connect(wet); wet.connect(ctx.destination);
      // tanpura-like drone on Sa and Pa
      [[hz(-12), 0.035], [hz(-5), 0.022], [hz(0), 0.012]].forEach(([f, v]) => {
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.frequency.value = f; g.gain.value = v; o.connect(g); g.connect(out); o.start();
      });
      loopStart = ctx.currentTime + 0.15;
    }

    function pluck(f, when, vol, ring) {
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, when);
      g.gain.exponentialRampToValueAtTime(vol, when + 0.012);
      g.gain.exponentialRampToValueAtTime(0.0001, when + ring);
      g.connect(out);
      [['triangle', 1, 1], ['sine', 2, 0.3]].forEach(([type, mult, level]) => {
        const o = ctx.createOscillator(), og = ctx.createGain();
        o.type = type; o.frequency.value = f * mult; og.gain.value = level;
        o.connect(og); og.connect(g); o.start(when); o.stop(when + ring + 0.05);
      });
    }

    // Queue everything due in the next second; called often so timing stays tight even if the tab is busy
    function schedule() {
      const horizon = ctx.currentTime + 1;
      for (;;) {
        const e = EVENTS[next], when = loopStart + e.at * BEAT;
        if (when > horizon) break;
        if (when >= ctx.currentTime - 0.05) pluck(e.f, Math.max(when, ctx.currentTime), e.vol, e.ring);
        if (++next === EVENTS.length) { next = 0; loopStart += LOOP * BEAT; }
      }
    }

    return {
      get paused() { return !playing; },
      // Call from inside a tap/click so browsers allow sound
      unlock() { if (!ctx) build(); if (!playing) ctx.suspend(); },
      play() {
        if (!ctx) build();
        ctx.resume();
        playing = true;
        clearInterval(timer); schedule(); timer = setInterval(schedule, 200);
      },
      pause() { playing = false; clearInterval(timer); if (ctx) ctx.suspend(); }
    };
  };
})();
