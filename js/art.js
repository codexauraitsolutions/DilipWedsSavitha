/* All illustrations are drawn here as SVG, so the site needs no image files to look complete. */
(function () {
  'use strict';

  const f = n => +n.toFixed(1);

  // Seeded random so the foliage looks the same on every load
  function rng(seed) {
    return function () {
      seed |= 0; seed = seed + 0x6D2B79F5 | 0;
      let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  const GREENS = ['#2f5237', '#3f6b45', '#5a8a55', '#7da56c', '#94b77f'];
  const leaf = (x, y, rot, s, fill) =>
    `<path transform="translate(${f(x)} ${f(y)}) rotate(${f(rot)}) scale(${f(s)})" d="M0 0C5-9 19-10 28 0C19 10 5 9 0 0Z" fill="${fill}"/>`;

  const dome = (cx, baseY, w, h, fill) =>
    `<path d="M${cx - w / 2} ${baseY}C${f(cx - w * 0.6)} ${f(baseY - h * 0.45)} ${f(cx - w * 0.26)} ${f(baseY - h * 0.72)} ${cx} ${baseY - h}C${f(cx + w * 0.26)} ${f(baseY - h * 0.72)} ${f(cx + w * 0.6)} ${f(baseY - h * 0.45)} ${cx + w / 2} ${baseY}Z" fill="${fill}"/>` +
    `<path d="M${cx} ${baseY - h}v${-f(h * 0.3)}" stroke="#b98a4e" stroke-width="1.6"/><circle cx="${cx}" cy="${f(baseY - h * 1.3)}" r="2" fill="#c9a45c"/>`;

  const arch = (x, y, w, h, fill, extra = '') =>
    `<path d="M${x} ${y + h}V${f(y + h * 0.45)}Q${x} ${f(y + h * 0.12)} ${x + w / 2} ${y}Q${x + w} ${f(y + h * 0.12)} ${x + w} ${f(y + h * 0.45)}V${y + h}Z" fill="${fill}" ${extra}/>`;

  function canopy() {
    const r = rng(7);
    let out = '';
    for (let i = 0; i < 150; i++) {
      const x = r() * 400;
      const edge = Math.abs(x - 200) / 200;
      const y = r() * (16 + 120 * edge * edge) - 6;
      out += leaf(x, y, 30 + r() * 120, 0.6 + r() * 0.9, GREENS[Math.floor(r() * GREENS.length)]);
    }
    for (let i = 0; i < 16; i++) {
      const x = r() * 400, edge = Math.abs(x - 200) / 200, y = r() * (14 + 100 * edge * edge);
      out += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(2 + r() * 2)}" fill="${r() > 0.5 ? '#f7dfe0' : '#fff7e6'}"/><circle cx="${f(x)}" cy="${f(y)}" r="1" fill="#e2b25c"/>`;
    }
    return `<svg class="canopy" viewBox="0 0 400 150" aria-hidden="true">${out}</svg>`;
  }

  // Drawn facing right with the tail trailing down-left; feet land at local (80, 76)
  function peacock(x, y, s, flip) {
    const eyes = [[14, 96], [26, 88], [22, 100], [38, 80], [36, 92], [50, 72], [50, 84], [62, 66], [63, 76]]
      .map(([ex, ey]) => `<ellipse cx="${ex}" cy="${ey}" rx="4.6" ry="3.4" fill="#d9b24c" transform="rotate(-35 ${ex} ${ey})"/><circle cx="${ex}" cy="${ey}" r="1.9" fill="#1d4f8f"/>`).join('');
    return `<g transform="translate(${x} ${y}) scale(${flip ? -s : s} ${s})">
      <path d="M80 64v12M85 63v13" stroke="#8a6a45" stroke-width="1.6" stroke-linecap="round"/>
      <path d="M74 50C50 46 18 68 0 106C10 108 22 108 34 102C52 94 70 82 84 64Z" fill="#2f7d6b"/>
      <path d="M72 54C50 58 26 78 8 102M76 58C60 66 44 82 30 100" fill="none" stroke="#5fae8f" stroke-width="1" opacity=".7"/>
      ${eyes}
      <path d="M66 58C64 44 78 38 88 44C96 50 94 62 84 66C76 68 68 66 66 58Z" fill="#1f6f8f"/>
      <path d="M70 56C76 48 88 50 90 58C84 64 76 64 70 56Z" fill="#3a9488"/>
      <path d="M82 48C87 38 90 28 91 18C92 12 101 12 101 19C100 30 98 40 93 50Z" fill="#1d5fa0"/>
      <circle cx="96" cy="16" r="5.6" fill="#1d5fa0"/>
      <path d="M101 14.500l7 2.500l-7 2z" fill="#c9a45c"/>
      <circle cx="97.500" cy="15" r="1.300" fill="#fff"/><circle cx="97.800" cy="15" r=".6" fill="#1b2a2a"/>
      <path d="M94 11L91 3M96 10.500V2M98 11L101 3" stroke="#1d5fa0" stroke-width=".9"/>
      <circle cx="91" cy="3" r="1.200" fill="#2f7d6b"/><circle cx="96" cy="2" r="1.200" fill="#2f7d6b"/><circle cx="101" cy="3" r="1.200" fill="#2f7d6b"/>
    </g>`;
  }

  const palace = () => `<svg class="palace" viewBox="${PALACE_BOX}" aria-hidden="true">${palaceShapes()}</svg>`;
  const PALACE_BOX = '0 -28 400 288';

  function palaceShapes() {
    const s1 = '#ecd0ae', s2 = '#dcb58f', s3 = '#c99c76', dk = '#7a5236';
    let o = '';
    // far towers
    o += `<rect x="18" y="150" width="44" height="110" fill="${s2}"/>` + dome(40, 150, 46, 34, s3) + arch(32, 170, 16, 30, dk, 'opacity=".55"');
    o += `<rect x="338" y="150" width="44" height="110" fill="${s2}"/>` + dome(360, 150, 46, 34, '#e6bfae') + arch(352, 170, 16, 30, dk, 'opacity=".55"');
    // cypress trees
    o += `<ellipse cx="78" cy="176" rx="8" ry="32" fill="#4c7350"/><ellipse cx="322" cy="176" rx="8" ry="32" fill="#4c7350"/>`;
    // base wall
    o += `<rect x="0" y="192" width="400" height="68" fill="${s2}"/><rect x="0" y="188" width="400" height="6" fill="${s3}"/>`;
    for (let x = 10; x < 400; x += 30) if (x < 150 || x > 240) o += arch(x, 216, 14, 28, dk, 'opacity=".45"');
    // chhatris
    [108, 292].forEach(cx => {
      o += `<rect x="${cx - 18}" y="152" width="36" height="40" fill="${s1}"/><rect x="${cx - 24}" y="148" width="48" height="5" fill="${s3}"/>`;
      o += dome(cx, 148, 44, 30, s3) + arch(cx - 8, 162, 16, 30, dk, 'opacity=".5"');
    });
    // central block
    o += `<rect x="140" y="112" width="120" height="148" fill="${s1}"/><rect x="132" y="107" width="136" height="6" fill="${s3}"/>`;
    o += `<rect x="160" y="62" width="80" height="46" fill="${s1}"/><rect x="153" y="57" width="94" height="6" fill="${s3}"/>`;
    for (let i = 0; i < 5; i++) o += arch(165 + i * 15, 74, 10, 26, dk, 'opacity=".5"');
    o += dome(200, 57, 84, 60, s2);
    o += arch(150, 134, 14, 30, dk, 'opacity=".5"') + arch(236, 134, 14, 30, dk, 'opacity=".5"');
    o += arch(170, 172, 60, 88, s3) + arch(180, 190, 40, 70, dk);
    o += `<rect x="158" y="252" width="84" height="8" fill="${s3}"/>`;
    // bushes
    const r = rng(21);
    for (let i = 0; i < 90; i++) {
      const left = i % 2 === 0;
      const x = left ? r() * 80 - 10 : 330 + r() * 80;
      const y = 205 + r() * 60;
      o += leaf(x, y, r() * 360, 0.6 + r() * 0.9, GREENS[Math.floor(r() * GREENS.length)]);
    }
    // peacocks perched on the wall, facing the gate
    o += peacock(-26, 106, 1.1) + peacock(426, 106, 1.1, true);
    return o;
  }

  // Stone tracery window: the sky and palace show through the openings, the doors part down the central mullion
  function gate(id) {
    const stone = '#8f8960', surround = '#7c7751', deep = '#666140', line = '#3d3a25', lite = '#aca67f';
    const lancet = (a, b) => `<path d="M${a} 720V415Q${a} 375 ${(a + b) / 2} 345Q${b} 375 ${b} 415V720Z"/>`;
    const flower = (cx, cy) => [0, 60, 120, 180, 240, 300].map(a => `<ellipse cx="${cx}" cy="${cy - 21}" rx="9" ry="14" transform="rotate(${a} ${cx} ${cy})"/>`).join('') + `<circle cx="${cx}" cy="${cy}" r="8"/>`;
    const openings = [[20, 96], [114, 190], [210, 286], [304, 380]].map(([a, b]) => lancet(a, b)).join('') +
      flower(105, 250) + flower(295, 250) +
      '<path d="M178 190V125Q178 100 200 78Q222 100 222 125V190Z"/><path d="M180 305V242Q180 220 200 206Q220 220 220 242V305Z"/>' +
      '<path d="M105 298l10 17l-10 17l-10-17Z"/><path d="M295 298l10 17l-10 17l-10-17Z"/>' +
      '<circle cx="142" cy="165" r="13"/><circle cx="258" cy="165" r="13"/>';
    const archD = 'M10 800V330C10 180 110 70 200 30C290 70 390 180 390 330V800';

    const r = rng(11);
    let leaves = '';
    for (let i = 0; i < 80; i++) {
      const x = i % 2 ? r() * 120 - 10 : 290 + r() * 120;
      leaves += leaf(x, r() * r() * 130 - 8, 30 + r() * 120, 0.7 + r() * 0.9, GREENS[Math.floor(r() * 3)]);
    }

    return `<svg viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <filter id="grain${id}" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="2" seed="3"/>
          <feColorMatrix type="matrix" values="0 0 0 0 .2  0 0 0 0 .18  0 0 0 0 .08  0 0 0 .6 0"/>
          <feComposite in2="SourceGraphic" operator="in" result="g"/>
          <feMerge><feMergeNode in="SourceGraphic"/><feMergeNode in="g"/></feMerge>
        </filter>
        <clipPath id="open${id}">${openings}</clipPath>
        <linearGradient id="sky${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8fb0b0"/><stop offset="1" stop-color="#c3d3c6"/></linearGradient>
        <radialGradient id="vig${id}" cx=".5" cy=".5" r=".75"><stop offset=".45" stop-color="#141a10" stop-opacity=".12"/><stop offset="1" stop-color="#141a10" stop-opacity=".6"/></radialGradient>
      </defs>
      <g filter="url(#grain${id})">
        <rect width="400" height="800" fill="${surround}"/>
        <path d="${archD}Z" fill="${stone}"/>
        <path d="M-8 800V326C-8 166 102 52 200 8C298 52 408 166 408 326V800" fill="none" stroke="${deep}" stroke-width="5"/>
        <path d="${archD}" fill="none" stroke="${lite}" stroke-width="3"/>
        <path d="M24 800V332C24 192 118 88 200 50C282 88 376 192 376 332" fill="none" stroke="${deep}" stroke-width="1.5" opacity=".6"/>
        <g fill="none" stroke="${deep}" stroke-width="2"><circle cx="105" cy="250" r="42"/><circle cx="295" cy="250" r="42"/></g>
        <g fill="${deep}" stroke="${deep}" stroke-width="9" stroke-linejoin="round">${openings}</g>
        <rect y="716" width="400" height="84" fill="${stone}"/><rect y="716" width="400" height="7" fill="${lite}"/><rect y="723" width="400" height="3" fill="${deep}"/>
      </g>
      <g clip-path="url(#open${id})">
        <rect width="400" height="800" fill="url(#sky${id})"/>
        <svg x="0" y="440" width="400" height="288" viewBox="${PALACE_BOX}">${palaceShapes()}</svg>
        <rect width="400" height="800" fill="#93b0ac" opacity=".42"/>
      </g>
      <g fill="none" stroke="${line}" stroke-width="1.2" opacity=".8">${openings}</g>
      ${leaves}
      <rect width="400" height="800" fill="url(#vig${id})"/>
    </svg>`;
  }

  // Gold bird cage on a chain; `drop` is the chain length, so each cage can hang at a different height
  function cage(side, drop) {
    const t = drop, gold = '#c39a3f';
    const bars = [10, 17, 23.500, 30, 36.500, 43, 50].map(x => `<path d="M${x} ${t + 68}V${t + 26}Q${x} ${t + 5} 30 ${t}"/>`).join('');
    return `<svg class="cage cage-${side}" viewBox="0 0 60 ${t + 96}" aria-hidden="true">
      <path d="M30 0V${t - 6}" stroke="${gold}" stroke-width="1.2" stroke-dasharray="3 2"/>
      <circle cx="30" cy="${t - 3}" r="3" fill="none" stroke="${gold}" stroke-width="1.4"/>
      <path d="M10 ${t + 68}V${t + 26}C10 ${t + 6} 20 ${t} 30 ${t}C40 ${t} 50 ${t + 6} 50 ${t + 26}V${t + 68}Z" fill="#fff6dc" fill-opacity=".45"/>
      <g transform="translate(22 ${t + 44})">
        <path d="M2 8C2 2 10 0 14 4C17 7 16 13 10 14C5 15 2 12 2 8Z" fill="#e9b7b0"/><circle cx="13" cy="4" r="3.600" fill="#e9b7b0"/>
        <path d="M16.500 3.500l4 1l-4 1.200z" fill="${gold}"/><circle cx="13.800" cy="3.500" r=".7" fill="#3a2a20"/>
        <path d="M3 9C-2 10-4 14-5 18C0 17 4 15 7 12Z" fill="#d79a94"/>
        <path d="M-6 16H22" stroke="${gold}" stroke-width="1.200"/>
      </g>
      <g fill="none" stroke="${gold}" stroke-width="1.300">${bars}<path d="M10 ${t + 26}H50M10 ${t + 47}H50"/></g>
      <rect x="7" y="${t + 68}" width="46" height="5" rx="2" fill="${gold}"/>
      <path d="M30 ${t + 73}v6" stroke="${gold}" stroke-width="1.300"/><circle cx="30" cy="${t + 81}" r="2.200" fill="${gold}"/>
      ${leaf(30, t + 2, 150, 0.55, GREENS[2])}${leaf(30, t + 2, 20, 0.5, GREENS[3])}${leaf(29, t + 3, 95, 0.6, GREENS[1])}
      ${leaf(12, t + 70, 100, 0.5, GREENS[3])}${leaf(48, t + 71, 70, 0.55, GREENS[2])}${leaf(46, t + 72, 110, 0.4, GREENS[4])}
      <circle cx="33" cy="${t + 1}" r="2.600" fill="#f7dfe0"/><circle cx="33" cy="${t + 1}" r="1" fill="#e2b25c"/>
    </svg>`;
  }

  // Bird perched on a blossom branch that grows in from the left edge (flip with CSS for the right side)
  const PERCH_COLOURS = [
    { body: '#8fc3d4', wing: '#4f8fa8', belly: '#f6e6cc' },
    { body: '#f1d06e', wing: '#8fb0d6', belly: '#fcf0c8' },
    { body: '#86c9aa', wing: '#4f9a86', belly: '#f6c0a8' }
  ];
  function perchBird(i, cls = '') {
    const c = PERCH_COLOURS[i % PERCH_COLOURS.length];
    const blossom = (x, y) => [0, 72, 144, 216, 288].map(a => `<circle cx="${x}" cy="${y - 3.2}" r="2.600" fill="#f4c6d2" transform="rotate(${a} ${x} ${y})"/>`).join('') + `<circle cx="${x}" cy="${y}" r="1.500" fill="#e2b25c"/>`;
    return `<svg class="perch ${cls}" viewBox="0 0 120 100" aria-hidden="true">
      <path d="M0 80C34 78 70 72 118 58M78 68C86 60 92 52 100 48M26 79C32 86 40 90 50 92" fill="none" stroke="#9a7a5c" stroke-width="2.600" stroke-linecap="round"/>
      ${leaf(98, 50, -50, 0.5, GREENS[3])}${leaf(100, 48, 10, 0.45, GREENS[4])}${leaf(112, 59, -20, 0.5, GREENS[3])}${leaf(48, 92, 20, 0.5, GREENS[4])}${leaf(12, 80, -140, 0.45, GREENS[3])}
      ${blossom(90, 60)}${blossom(108, 52)}${blossom(38, 88)}
      <path d="M44 60L12 70L18 78L48 68Z" fill="${c.wing}"/>
      <path d="M58 72v6M64 71v6" stroke="#8a6a45" stroke-width="1.400" stroke-linecap="round"/>
      <path d="M40 60C40 42 58 32 72 40C84 47 83 63 70 69C58 75 43 72 40 60Z" fill="${c.body}"/>
      <path d="M54 66C60 58 74 56 80 50C82 60 78 66 70 69C64 71 58 70 54 66Z" fill="${c.belly}"/>
      <circle cx="74" cy="36" r="11" fill="${c.body}"/>
      <path d="M44 56C50 44 66 44 70 54C62 64 50 64 44 56Z" fill="${c.wing}"/>
      <path d="M84 33.500l11 3.500l-11 3.500z" fill="#d9a441"/>
      <circle cx="77.500" cy="34" r="1.800" fill="#2a2a2a"/><circle cx="78.100" cy="33.400" r=".6" fill="#fff"/>
    </svg>`;
  }

  // Giraffe, hippo, lion, deer and elephant on a strip of grass (ground line at y=135)
  function animals() {
    const legs = (xs, y, w, fill) => `<g class="legs">${xs.map(x => `<rect x="${x}" y="${y}" width="${w}" height="${135 - y}" rx="${w / 2.500}" fill="${fill}"/>`).join('')}</g>`;
    const eye = (x, y) => `<circle cx="${x}" cy="${y}" r="1.300" fill="#2a2a2a"/>`;
    const dots = (pts, r, fill) => pts.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"/>`).join('');
    const r = rng(5);
    let grass = '';
    for (let i = 0; i < 46; i++) grass += leaf(r() * 400, 137 + r() * 6, -60 - r() * 60, 0.3 + r() * 0.3, GREENS[2 + Math.floor(r() * 3)]);

    const giraffe = `
      <path d="M13 86C7 92 7 100 9 106" fill="none" stroke="#c99a45" stroke-width="2"/><circle cx="9" cy="107" r="2.500" fill="#9a6a33"/>
      ${legs([17, 25, 44, 52], 92, 5, '#eec560')}
      <ellipse cx="36" cy="88" rx="24" ry="13" fill="#f2cf6a"/>
      <path d="M46 86L58 30L69 33L61 92Z" fill="#f2cf6a"/>
      <path d="M61 20L60 11M67 21L68 12" stroke="#c99a45" stroke-width="1.800" stroke-linecap="round"/>${dots([[60, 10], [68, 11]], 2, '#9a6a33')}
      <ellipse cx="57" cy="24" rx="4" ry="2.400" fill="#eec560" transform="rotate(-30 57 24)"/>
      <ellipse cx="68" cy="27" rx="11" ry="6.500" fill="#f2cf6a" transform="rotate(12 68 27)"/>
      <ellipse cx="76" cy="29.500" rx="4.500" ry="4" fill="#f7e2a3"/>${eye(67, 25)}
      ${dots([[22, 84], [32, 92], [42, 84], [50, 92], [28, 80], [55, 70], [58, 56], [61, 44], [53, 82], [16, 90]], 3, '#b9813f')}`;

    const hippo = `
      ${legs([102, 114, 134, 146], 120, 9, '#96745c')}
      <ellipse cx="125" cy="112" rx="30" ry="17" fill="#a7846a"/>
      ${dots([[147, 100], [156, 99]], 3.200, '#96745c')}
      <ellipse cx="155" cy="111" rx="15" ry="12" fill="#a7846a"/>
      <ellipse cx="164" cy="116" rx="11" ry="9" fill="#bf9c82"/>
      ${eye(153, 106)}${dots([[166, 112], [171, 113]], 1, '#7a5a46')}
      <path d="M95 108C91 110 91 114 93 117" fill="none" stroke="#96745c" stroke-width="2" stroke-linecap="round"/>`;

    const lion = `
      <path d="M187 110C178 108 174 102 176 95" fill="none" stroke="#d49a45" stroke-width="2.200" stroke-linecap="round"/><circle cx="176" cy="94" r="3" fill="#b8742f"/>
      ${legs([189, 197, 212, 220], 116, 5.500, '#d99c46')}
      <ellipse cx="205" cy="112" rx="20" ry="11" fill="#e3a850"/>
      <circle cx="228" cy="100" r="13.500" fill="#b8742f"/>
      ${dots([[223, 92], [236, 92]], 2.600, '#e3a850')}
      <circle cx="230" cy="101" r="8.800" fill="#ecbc68"/>
      ${eye(227, 99)}${eye(233, 99)}<path d="M228.500 103h3l-1.500 2z" fill="#7a4a2a"/>`;

    const deer = `
      ${legs([259, 265, 278, 284], 112, 3.200, '#c98f58')}
      <ellipse cx="272" cy="108" rx="16" ry="9" fill="#d9a066"/><circle cx="256" cy="105" r="2.600" fill="#fff7ea"/>
      <path d="M281 108L287 86L294 88L290 112Z" fill="#d9a066"/>
      <path d="M289 80L285 65M287 73L281 69M292 80L297 63M294.500 71L301 67" fill="none" stroke="#8a5a3a" stroke-width="1.500" stroke-linecap="round"/>
      <ellipse cx="286" cy="81" rx="3.600" ry="2" fill="#c98f58" transform="rotate(-25 286 81)"/>
      <ellipse cx="293" cy="85" rx="7" ry="5" fill="#d9a066"/><circle cx="299.500" cy="86" r="1.200" fill="#5a3a2a"/>
      ${eye(293, 83.500)}${dots([[264, 104], [270, 108], [276, 103], [268, 112]], 1.300, '#fff7ea')}`;

    const elephant = `
      ${legs([352, 374], 114, 13, '#a9adb7')}
      <ellipse cx="378" cy="100" rx="36" ry="26" fill="#b9bcc4"/>
      <circle cx="345" cy="92" r="18" fill="#b9bcc4"/>
      <path d="M334 90C322 98 322 120 329 129C333 132 338 129 336 124C331 115 334 106 344 104Z" fill="#b9bcc4"/>
      <path d="M338 104C335 108 334 111 335 114" fill="none" stroke="#fff" stroke-width="2.400" stroke-linecap="round"/>
      <ellipse cx="360" cy="93" rx="12" ry="17" fill="#a9adb7"/><ellipse cx="360" cy="94" rx="7" ry="11" fill="#e6c6c6"/>
      ${eye(340, 88)}`;

    // Everyone faces right (the elephant is mirrored) and each animal bobs slightly out of step with the others.
    // The herd is drawn twice, PARADE_GAP apart, and CSS slides it by exactly that distance so the loop is seamless.
    const PARADE_GAP = 480;
    const herd = [giraffe, hippo, lion, deer, `<g transform="translate(736 0) scale(-1 1)">${elephant}</g>`]
      .map((a, i) => `<g class="walker" style="animation-delay:-${i * 0.23}s">${a}</g>`).join('');

    return `<svg class="animals" viewBox="0 0 400 150" aria-hidden="true">
      <ellipse cx="90" cy="150" rx="150" ry="34" fill="#e3ebe4"/><ellipse cx="300" cy="152" rx="170" ry="38" fill="#dbe6dc"/>
      <rect y="134" width="400" height="16" fill="#c4dab2"/>
      <g class="parade">${[0, -PARADE_GAP].map(dx => `<g transform="translate(${dx} 0)">${herd}</g>`).join('')}</g>
      ${grass}
    </svg>`;
  }

  // Bride (front left, red lehenga, bouquet) and groom (behind right, dark suit, bow tie); fades out at the knees
  function coupleArt() {
    const skinG = '#dca47c', skinB = '#e8b48c', hair = '#261813', gold = '#d9b45a', red = '#b8343f', suit = '#1f2937';
    const dots = (pts, r, fill) => pts.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"/>`).join('');
    const groom = `
      <path d="M90 360V190C90 164 106 152 124 147L146 147C166 152 186 164 186 192V360Z" fill="${suit}"/>
      <path d="M122 147L135 212L148 147Z" fill="#fff"/>
      <path d="M122 147L112 170L135 212ZM148 147L158 170L135 212Z" fill="#111827"/>
      ${dots([[135, 178], [135, 192]], 1.600, '#1f2937')}
      <rect x="127" y="126" width="16" height="24" fill="${skinG}"/>
      <path d="M135 153L123 146V160ZM135 153L147 146V160Z" fill="#0b0f17"/><circle cx="135" cy="153" r="2.600" fill="#0b0f17"/>
      ${dots([[110, 108], [160, 108]], 5, skinG)}
      <ellipse cx="135" cy="104" rx="24" ry="29" fill="${skinG}"/>
      <path d="M111 104C113 132 126 138 135 138C145 138 157 132 159 104C155 119 147 123 135 123C123 123 115 119 111 104Z" fill="${hair}"/>
      <path d="M109 100C104 70 124 58 140 60C160 60 168 80 161 102C158 90 152 82 138 82C124 82 115 88 109 100Z" fill="${hair}"/>
      <path d="M121 97h10M140 97h10" stroke="${hair}" stroke-width="2.400" stroke-linecap="round"/>
      ${dots([[126, 104], [145, 104]], 2, '#1b1210')}
      <path d="M127 115Q135 123 143 115Q135 118 127 115Z" fill="#fff"/>`;
    const bride = `
      <ellipse cx="72" cy="130" rx="27" ry="29" fill="${hair}"/><circle cx="72" cy="100" r="11" fill="${hair}"/>
      ${dots([[66, 96], [72, 92], [78, 96]], 2.600, '#f7dfe0')}
      <rect x="65" y="158" width="14" height="18" fill="${skinB}"/>
      <path d="M38 196C38 180 52 174 64 172L80 172C92 174 106 180 106 196V250H38Z" fill="${skinB}"/>
      <path d="M42 198C52 190 62 204 72 204C82 204 92 190 102 198V238H42Z" fill="${red}"/><rect x="42" y="234" width="60" height="4" fill="${gold}"/>
      <path d="M40 252C28 300 20 336 16 360H128C124 336 116 300 104 252Z" fill="#c4424d"/>
      <rect x="40" y="248" width="64" height="7" rx="2" fill="${gold}"/>
      ${dots([[40, 290], [58, 284], [76, 290], [94, 284], [34, 320], [52, 314], [70, 320], [88, 314], [106, 320], [46, 346], [64, 340], [82, 346], [100, 340], [118, 346]], 2.200, gold)}
      <path d="M100 196C108 232 104 300 122 360H128C116 300 112 236 106 194Z" fill="#d9606a" opacity=".85"/>
      <ellipse cx="72" cy="138" rx="20.500" ry="24" fill="${skinB}"/>
      <path d="M51 132C54 116 62 110 72 110C82 110 90 116 93 132C88 122 80 118 72 118C64 118 56 122 51 132Z" fill="${hair}"/>
      <path d="M72 108V120" stroke="${gold}" stroke-width="1.600"/><circle cx="72" cy="122" r="2.800" fill="${gold}"/><circle cx="72" cy="122" r="1.100" fill="${red}"/>
      ${dots([[51, 148], [93, 148]], 3.200, gold)}${dots([[51, 154], [93, 154]], 2, gold)}
      <path d="M60 134q4-3 8 0M76 134q4-3 8 0" fill="none" stroke="${hair}" stroke-width="1.600" stroke-linecap="round"/>
      ${dots([[64, 139], [80, 139]], 1.900, '#1b1210')}
      <path d="M65 150Q72 157 79 150Q72 152.500 65 150Z" fill="#c0392b"/>
      <path d="M56 178Q72 196 88 178" fill="none" stroke="${gold}" stroke-width="3"/>${dots([[64, 186], [72, 189], [80, 186]], 2.200, gold)}
      <path d="M40 200C40 230 52 254 70 262L76 252C62 244 52 226 50 200Z" fill="${skinB}"/>
      ${leaf(62, 268, 200, 0.6, GREENS[2])}${leaf(96, 270, -20, 0.6, GREENS[3])}${leaf(80, 282, 80, 0.5, GREENS[2])}
      ${dots([[70, 262], [86, 258], [94, 270], [78, 274]], 9, '#f3c9cf')}${dots([[80, 264], [68, 272], [90, 262]], 7, '#fbe9ea')}${dots([[72, 263], [86, 259], [93, 270], [79, 273], [81, 265]], 2, '#e79aa6')}`;
    return `<svg viewBox="0 0 200 360" aria-hidden="true">
      <defs>
        <linearGradient id="coupleFade" x1="0" y1="0" x2="0" y2="1"><stop offset=".82" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
        <mask id="coupleMask"><rect width="200" height="360" fill="url(#coupleFade)"/></mask>
      </defs>
      <g mask="url(#coupleMask)">${groom}${bride}</g>
    </svg>`;
  }

  // River between two grassy banks, with rocks and reeds in the near corners
  function river() {
    const r = rng(17);
    let reeds = '';
    for (let i = 0; i < 34; i++) {
      const left = i % 2 === 0;
      const x = left ? r() * 78 - 4 : 326 + r() * 78;
      const h = 50 + r() * 80, lean = (r() - 0.5) * 36;
      reeds += `<path d="M${f(x)} 222Q${f(x + lean * 0.2)} ${f(222 - h * 0.6)} ${f(x + lean)} ${f(222 - h)}" fill="none" stroke="${GREENS[Math.floor(r() * 3)]}" stroke-width="${f(1.6 + r() * 1.6)}" stroke-linecap="round"/>`;
      if (i % 6 === 0) reeds += `<ellipse cx="${f(x + lean)}" cy="${f(222 - h)}" rx="2.600" ry="8" fill="#8a5a3a" transform="rotate(${f(lean * 0.6)} ${f(x + lean)} ${f(222 - h)})"/>`;
    }
    const ripples = [[110, 112, 34], [190, 100, 26], [236, 128, 40], [150, 150, 30], [214, 172, 44], [128, 190, 28], [262, 154, 22], [176, 206, 36]]
      .map(([x, y, w]) => `<path d="M${x} ${y}h${w}"/>`).join('');
    return `<svg class="river" viewBox="0 0 400 220" aria-hidden="true">
      <path d="M0 52C70 30 150 44 230 34C300 26 360 38 400 30V220H0Z" fill="#a9c27a"/>
      <path d="M0 96C60 78 130 90 200 82C280 72 340 86 400 76V220H0Z" fill="#9ad8e6"/>
      <path d="M0 130C70 116 140 126 210 120C290 112 350 124 400 116V220H0Z" fill="#aee2ec" opacity=".7"/>
      <g class="ripples" fill="none" stroke="#fff" stroke-width="2.200" stroke-linecap="round" opacity=".8">${ripples}</g>
      <path d="M262 82C270 62 316 58 338 72C350 82 342 96 316 98C290 100 264 96 262 82Z" fill="#5f6b70"/>
      <path d="M272 78C282 68 310 66 326 74C312 72 290 72 272 78Z" fill="#8a979b"/>
      <path d="M400 96C352 100 304 128 292 170C286 196 300 220 300 220H400Z" fill="#88ad58"/>
      <path d="M0 122C40 112 92 132 120 172C132 194 112 220 112 220H0Z" fill="#7fa653"/>
      <path d="M0 132C10 110 42 108 58 126C68 140 60 162 40 166C20 170 4 162 0 152Z" fill="#5f6b70"/>
      <path d="M6 132C16 120 38 118 50 128C36 126 20 126 6 132Z" fill="#8a979b"/>
      ${reeds}
    </svg>`;
  }

  // Butterflies dangling on strings from the top edge of a section
  function butterflies() {
    const set = [[18, 44, 0.9, '#4f9bd6', '#2f6fb0', -8], [68, 52, 1.1, '#f08a4b', '#f5c04a', 10], [158, 50, 1.5, '#8dc26a', '#f0a23c', -4],
      [282, 26, 0.8, '#e2566a', '#f29aa6', 6], [330, 72, 1.2, '#4a86c8', '#f0a23c', -12], [384, 46, 1.2, '#9ccf6e', '#f5c04a', 8]];
    const one = ([x, len, s, c1, c2, rot], i) => `
      <g class="hang" style="transform-origin:${x}px 0px;animation-delay:-${f(i * 0.7)}s">
        <path d="M${x} 0V${len - 8 * s}" stroke="#8a8a78" stroke-width=".8"/>
        <g transform="translate(${x} ${len}) rotate(${rot}) scale(${s})">
          <g class="wings" style="animation-delay:-${f(i * 0.13)}s">
            <path d="M0 0C-6-14-22-14-22-4C-22 4-10 6 0 2ZM0 0C6-14 22-14 22-4C22 4 10 6 0 2Z" fill="${c1}"/>
            <path d="M0 2C-8 4-16 10-12 16C-8 20-2 12 0 4ZM0 2C8 4 16 10 12 16C8 20 2 12 0 4Z" fill="${c2}"/>
            <circle cx="-15" cy="-5" r="2" fill="#fff" opacity=".7"/><circle cx="15" cy="-5" r="2" fill="#fff" opacity=".7"/>
          </g>
          <path d="M0-5Q-3-11-6-12M0-5Q3-11 6-12" fill="none" stroke="#3a2a20" stroke-width=".8"/>
          <ellipse cx="0" cy="2" rx="1.700" ry="8" fill="#3a2a20"/>
        </g>
      </g>`;
    return `<svg class="hangers" viewBox="0 0 400 110" aria-hidden="true">${set.map(one).join('')}</svg>`;
  }

  // Fan of grass with red and yellow flowers, sized to sit on the top edge of a card
  function tuft() {
    const r = rng(29);
    let blades = '', flowers = '';
    const N = 15;
    for (let i = 0; i < N; i++) {
      const a = (-66 + (132 / (N - 1)) * i) * Math.PI / 180;
      const L = 44 + r() * 22, bx = 80 + Math.sin(a) * 14;
      const tx = bx + Math.sin(a) * L, ty = 84 - Math.cos(a) * L;
      const mx = (bx + tx) / 2 + Math.cos(a) * 3, my = (84 + ty) / 2 + Math.sin(a) * 3;
      blades += `<path d="M${f(bx - 3.5)} 84Q${f(mx - 3)} ${f(my)} ${f(tx)} ${f(ty)}Q${f(mx + 3)} ${f(my)} ${f(bx + 3.5)} 84Z" fill="${GREENS[1 + (i % 3)]}"/>`;
    }
    [[-62, 74, '#d8433f'], [-30, 82, '#f0b429'], [34, 84, '#f0b429'], [60, 76, '#d8433f'], [4, 70, '#d8433f']].forEach(([deg, L, c], k) => {
      const a = deg * Math.PI / 180, x = 80 + Math.sin(a) * (L + 14), y = 84 - Math.cos(a) * L;
      const size = k === 4 ? 0.8 : 1;
      flowers += `<path d="M${f(80 + Math.sin(a) * 14)} 84L${f(x)} ${f(y)}" stroke="${GREENS[1]}" stroke-width="1.400"/>` +
        `<g transform="translate(${f(x)} ${f(y)}) scale(${size})">${[0, 45, 90, 135, 180, 225, 270, 315].map(p => `<circle cx="0" cy="-5.500" r="3.200" fill="${c}" transform="rotate(${p})"/>`).join('')}<circle r="3.400" fill="${c === '#f0b429' ? '#d8433f' : '#f0b429'}"/></g>`;
    });
    return `<svg class="tuft" viewBox="-10 0 180 86" aria-hidden="true">${blades}${flowers}</svg>`;
  }

  // Faint palm fronds and a bamboo stalk, meant to sit washed-out behind a section heading
  function fronds() {
    const frond = (x0, y0, cx, cy, x1, y1, n, s) => {
      let o = `<path d="M${x0} ${y0}Q${cx} ${cy} ${x1} ${y1}" fill="none" stroke="#7fae7c" stroke-width="2"/>`;
      for (let i = 1; i <= n; i++) {
        const t = i / (n + 1), u = 1 - t;
        const x = u * u * x0 + 2 * u * t * cx + t * t * x1, y = u * u * y0 + 2 * u * t * cy + t * t * y1;
        const ang = Math.atan2(2 * u * (cy - y0) + 2 * t * (y1 - cy), 2 * u * (cx - x0) + 2 * t * (x1 - cx)) * 180 / Math.PI;
        const k = s * (0.5 + Math.sin(Math.PI * t) * 0.9);
        o += leaf(x, y, ang + 55, k, '#8fb98a') + leaf(x, y, ang - 55, k, '#a5c79f');
      }
      return o;
    };
    const bamboo = `<rect x="366" y="0" width="13" height="220" fill="#9cc39a"/>` + [38, 84, 132, 178].map(y => `<rect x="364" y="${y}" width="17" height="4" rx="2" fill="#7fae7c"/>`).join('');
    return `<svg class="fronds" viewBox="0 0 400 220" aria-hidden="true">
      ${bamboo}${frond(-10, 10, 90, 40, 190, 150, 12, 1.3)}${frond(410, -10, 300, 30, 230, 170, 13, 1.4)}${frond(120, -10, 200, 30, 300, 90, 10, 1.1)}${frond(-10, 120, 50, 130, 110, 210, 8, 1)}
    </svg>`;
  }

  // Twisted vine across the top of a section with two thatched bird houses hanging from it
  function vine() {
    const VG = ['#4f8a3a', '#6aa84f', '#8bc34a'];
    const r = rng(41);
    let leaves = '';
    for (let i = 0; i < 28; i++) {
      const x = r() * 400;
      leaves += leaf(x, 20 + Math.sin(x / 32) * 8, 40 + r() * 100, 1 + r() * 0.9, VG[i % 3]);
    }
    const robin = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})">
      <ellipse cx="0" cy="0" rx="6.500" ry="5" fill="#8a7460"/><circle cx="5" cy="-4" r="3.800" fill="#8a7460"/>
      <ellipse cx="3" cy="1" rx="3.800" ry="3.400" fill="#e8823a"/>
      <path d="M8.500-4.500l3.500 1l-3.500 1z" fill="#d9a441"/><circle cx="6" cy="-4.800" r=".8" fill="#1b1210"/>
      <path d="M-6 0l-6 2l5 2z" fill="#6d5a4a"/>
    </g>`;
    const house = (x, drop, flip, i) => `<g class="hang" style="transform-origin:${x}px 26px;animation-delay:-${i * 1.6}s">
      <path d="M${x} 26V${drop}" stroke="#8a6a45" stroke-width="1.200"/>
      <g transform="translate(${x} ${drop})${flip ? ' scale(-1 1)' : ''}">
        <rect x="-17" y="20" width="34" height="31" rx="6" fill="#c9a36a"/>
        <path d="M-17 31h34M-17 41h34" stroke="#a9834f" stroke-width="1"/>
        <circle cx="0" cy="35" r="8.500" fill="#5a3d24"/>
        ${robin(-1, 37, 0.85)}
        <rect x="-21" y="49" width="42" height="4.500" rx="2" fill="#a9834f"/>
        <path d="M-26 22L0-2L26 22Z" fill="#dcc08a"/>
        <path d="M-17 22L-4 6M-7 22L0 6M4 22L3 6M15 22L6 8" stroke="#b9975a" stroke-width="1"/>
        <path d="M-27 22h54" stroke="#b9975a" stroke-width="3.500" stroke-linecap="round"/>
        ${robin(-13, 6, 0.9)}
      </g>
    </g>`;
    return `<svg class="vine" viewBox="0 0 400 130" aria-hidden="true">
      ${house(46, 64, false, 0)}${house(352, 58, true, 1)}
      <path d="M-10 30C50 44 90 8 140 26S230 42 280 20S370 8 410 30" fill="none" stroke="#d19a3c" stroke-width="5" stroke-linecap="round"/>
      <path d="M-10 20C40 4 80 40 130 22S220 6 270 24S360 40 410 18" fill="none" stroke="#8a5a2b" stroke-width="7" stroke-linecap="round"/>
      ${leaves}
    </svg>`;
  }

  // Leafy creeper climbing straight up; meant to peek out from behind the left edge of a card
  function sideVine() {
    const VG = ['#4f8a3a', '#6aa84f', '#8bc34a', '#a4d65e'];
    const strand = phase => { let d = ''; for (let y = 640; y >= 34; y -= 8) d += `${d ? 'L' : 'M'}${f(24 + 9 * Math.sin(y / 50 + phase))} ${y}`; return d; };
    const r = rng(53);
    let leaves = '';
    for (let y = 610, i = 0; y >= 50; y -= 30, i++) {
      const x = 24 + 9 * Math.sin(y / 50), right = i % 2 === 0;
      // Right-hand leaves lie over the card, so they stay short enough to clear the form's text
      leaves += leaf(x, y, right ? -40 + r() * 30 : 215 - r() * 30, right ? 0.8 + r() * 0.25 : 1.4 + r() * 0.8, VG[i % 4]);
      if (i % 3 === 0) leaves += leaf(x, y + 8, right ? 15 + r() * 20 : 160 - r() * 20, right ? 0.7 + r() * 0.2 : 0.9 + r() * 0.5, VG[(i + 2) % 4]);
    }
    return `<svg class="side-vine" viewBox="0 0 90 640" aria-hidden="true">
      <path d="${strand(2.2)}" fill="none" stroke="#c8963e" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="${strand(0)}" fill="none" stroke="#8a5a2b" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
      ${leaves}${leaf(22, 36, -70, 1.8, VG[2])}${leaf(22, 36, -130, 1.2, VG[1])}
    </svg>`;
  }

  // Long pointed blade growing from (x, y) at the given angle (0 = right, -90 = straight up)
  const blade = (x, y, deg, L, w, fill) =>
    `<path transform="translate(${f(x)} ${f(y)}) rotate(${f(deg)})" d="M0 0Q${f(L * 0.45)} ${f(-w)} ${f(L)} 0Q${f(L * 0.45)} ${f(w)} 0 0Z" fill="${fill}"/>`;

  // Jungle floor: palms, broad leaves, rocks and a tree up the right-hand side (ground line at y=440)
  function jungle() {
    const JG = ['#3f7d34', '#5a9a3a', '#7cc043', '#9ad15a', '#2f6a3a'];
    const r = rng(77);
    const fan = (x, y, n, L, w, spread, tilt = 0) => {
      let o = '';
      for (let i = 0; i < n; i++) o += blade(x, y, -90 + tilt - spread / 2 + (spread / (n - 1)) * i + (r() - 0.5) * 6, L * (0.75 + r() * 0.35), w, JG[Math.floor(r() * JG.length)]);
      return o;
    };
    const burst = (x, y, n, s, c) => Array.from({ length: n }, (_, i) => leaf(x, y, (360 / n) * i + r() * 20, s * (0.8 + r() * 0.4), c)).join('');
    const trunk = ph => { let d = ''; for (let y = 440; y >= 30; y -= 10) d += `${d ? 'L' : 'M'}${f(378 + 9 * Math.sin(y / 46 + ph))} ${y}`; return d; };
    let tree = `<path d="${trunk(2)}" fill="none" stroke="#b9853a" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="${trunk(0)}" fill="none" stroke="#8a5a2b" stroke-width="13" stroke-linecap="round" stroke-linejoin="round"/>`;
    [[366, 34, 9, 1.5, JG[3]], [390, 70, 8, 1.3, JG[2]], [350, 96, 8, 1.2, JG[1]], [384, 150, 8, 1.3, JG[3]], [362, 196, 7, 1.1, JG[2]], [392, 236, 7, 1.2, JG[1]]]
      .forEach(([x, y, n, s, c]) => { tree += burst(x, y, n, s, c); });
    const rocks = [[168, 426, 26, 13], [214, 430, 20, 10], [286, 428, 24, 12]]
      .map(([x, y, w, h]) => `<ellipse cx="${x}" cy="${y}" rx="${w}" ry="${h}" fill="#7f8a84"/><ellipse cx="${x - w * 0.2}" cy="${y - h * 0.35}" rx="${w * 0.5}" ry="${h * 0.3}" fill="#a3ada7"/>`).join('');
    const bush = [[322, 392, 30, 13], [300, 372, 26, 12], [330, 356, 24, 11], [310, 338, 20, 10]]
      .map(([x, y, w, h], i) => `<ellipse cx="${x}" cy="${y}" rx="${w}" ry="${h}" fill="${i % 2 ? '#7fb56a' : '#6aa35a'}"/>`).join('');
    return `<svg class="jungle" viewBox="0 0 400 440" aria-hidden="true">
      ${tree}
      ${fan(70, 432, 11, 120, 9, 150)}${fan(200, 434, 11, 110, 8, 150, 6)}${bush}
      ${fan(18, 436, 7, 90, 15, 110, 20)}${fan(128, 436, 8, 70, 13, 120)}${fan(260, 436, 8, 80, 14, 120, -8)}${fan(352, 436, 7, 76, 14, 110, -16)}
      ${rocks}
      ${fan(96, 440, 9, 40, 5, 130)}${fan(236, 440, 9, 36, 5, 130)}${fan(318, 440, 9, 38, 5, 130)}
      <rect y="430" width="400" height="10" fill="#4f8a35"/><rect y="430" width="400" height="3" fill="#3f7230"/>
    </svg>`;
  }

  // Monkey hanging by one arm from a vine that drops in from the top right
  function monkey() {
    const fur = '#7a4a2a', skin = '#ecc8a2';
    return `<svg class="monkey" viewBox="0 0 160 130" aria-hidden="true">
      <path d="M152-4C142 20 126 36 113 46C104 54 100 72 104 100" fill="none" stroke="#5f9a48" stroke-width="3" stroke-linecap="round"/>
      ${leaf(140, 16, 40, 0.5, '#7cc043')}${leaf(126, 34, 200, 0.5, '#5a9a3a')}${leaf(103, 74, 150, 0.5, '#7cc043')}${leaf(104, 96, 20, 0.45, '#5a9a3a')}
      <path d="M52 80C30 84 20 66 30 56C37 50 46 56 41 63" fill="none" stroke="${fur}" stroke-width="5" stroke-linecap="round"/>
      <path d="M58 92C46 100 44 110 52 116M86 94C98 100 100 110 92 116" fill="none" stroke="${fur}" stroke-width="9" stroke-linecap="round"/>
      <ellipse cx="50" cy="119" rx="9" ry="4.500" fill="${skin}"/><ellipse cx="94" cy="119" rx="9" ry="4.500" fill="${skin}"/>
      <path d="M56 68C46 72 42 82 46 90" fill="none" stroke="${fur}" stroke-width="8" stroke-linecap="round"/><circle cx="46" cy="91" r="5" fill="${skin}"/>
      <ellipse cx="72" cy="78" rx="22" ry="23" fill="${fur}"/><ellipse cx="74" cy="82" rx="13" ry="15" fill="${skin}"/>
      <path d="M88 66C98 58 106 52 112 46" fill="none" stroke="${fur}" stroke-width="8" stroke-linecap="round"/><circle cx="113" cy="45" r="5.500" fill="${skin}"/>
      <circle cx="54" cy="42" r="8" fill="${fur}"/><circle cx="54" cy="42" r="4.500" fill="${skin}"/>
      <circle cx="94" cy="42" r="8" fill="${fur}"/><circle cx="94" cy="42" r="4.500" fill="${skin}"/>
      <circle cx="74" cy="42" r="19" fill="${fur}"/>
      <ellipse cx="67.500" cy="39" rx="7" ry="7.500" fill="${skin}"/><ellipse cx="80.500" cy="39" rx="7" ry="7.500" fill="${skin}"/>
      <ellipse cx="74" cy="50" rx="13" ry="9" fill="${skin}"/>
      <circle cx="68.500" cy="39.500" r="2.200" fill="#1b1210"/><circle cx="79.500" cy="39.500" r="2.200" fill="#1b1210"/>
      <path d="M66 50Q74 60 82 50Z" fill="#8a2f2f"/><path d="M72 46.500h.1M76 46.500h.1" stroke="#7a4a2a" stroke-width="1.600" stroke-linecap="round"/>
    </svg>`;
  }

  const birds = () => `<svg class="birds" viewBox="0 0 120 50" aria-hidden="true" fill="none" stroke="#2f3e36" stroke-width="1.6" stroke-linecap="round">
    ${[[8, 30, 1], [30, 16, .9], [52, 34, .8], [70, 20, 1], [92, 30, .7], [104, 12, .6]].map(([x, y, s]) =>
      `<path transform="translate(${x} ${y}) scale(${s})" d="M0 0Q4-6 8 0Q12-6 16 0"/>`).join('')}
  </svg>`;

  const sprig = (cls = '') => `<svg class="sprig ${cls}" viewBox="0 0 120 70" aria-hidden="true">
    <path d="M4 62Q46 46 112 10" fill="none" stroke="#7da56c" stroke-width="1.6"/>
    ${[[20, 56, -70], [24, 55, 40], [42, 47, -75], [46, 46, 35], [64, 37, -80], [68, 35, 30], [86, 25, -85], [90, 23, 25], [108, 12, -30]]
      .map(([x, y, a], i) => leaf(x, y, a, 0.7, GREENS[(i % 3) + 2])).join('')}
  </svg>`;

  const lotus = () => `<svg viewBox="-70 -62 140 92" aria-hidden="true">
    <defs><linearGradient id="lotusG" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#b8904a"/><stop offset="1" stop-color="#f6e2b3"/></linearGradient></defs>
    <g fill="url(#lotusG)" stroke="#a8843f" stroke-width="1">
      ${[-72, 72, -48, 48, -24, 24, 0].map(a => `<path transform="rotate(${a} 0 10)" d="M0-52C16-30 16-8 0 10C-16-8-16-30 0-52Z"/>`).join('')}
    </g>
    <path d="M-52 20Q0 34 52 20" fill="none" stroke="#a8843f" stroke-width="1.4"/>
  </svg>`;

  const ICONS = {
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    pin: '<path d="M12 21s7-6.1 7-11a7 7 0 1 0-14 0c0 4.900 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>',
    calendar: '<rect x="3.500" y="5" width="17" height="15" rx="2"/><path d="M3.500 10h17M8 3v4M16 3v4"/>',
    sparkles: '<path d="M11 4l1.800 5.200L18 11l-5.200 1.800L11 18l-1.800-5.200L4 11l5.200-1.800z"/><path d="M19 15v4M17 17h4"/>',
    music: '<path d="M9 18V6l10-2v12"/><circle cx="6.500" cy="18" r="2.500"/><circle cx="16.500" cy="16" r="2.500"/>',
    heart: '<path d="M12 20s-7-4.400-7-10a4 4 0 0 1 7-2.600A4 4 0 0 1 19 10c0 5.600-7 10-7 10z"/>',
    gift: '<rect x="4" y="11" width="16" height="9" rx="1.500"/><path d="M3 7.500h18V11H3zM12 7.500V20M12 7.500C10 3 6 4.500 8 7.500M12 7.500C14 3 18 4.500 16 7.500"/>',
    rings: '<circle cx="9" cy="14.500" r="5"/><circle cx="15" cy="14.500" r="5"/><path d="M7.500 6.500l1.500-2.500 1.500 2.500z"/>',
    glass: '<path d="M7 3h10l-1 7a4 4 0 0 1-8 0zM12 14v6M8.500 20h7"/>',
    down: '<path d="M6 9l6 6 6-6"/>',
    close: '<path d="M6 6l12 12M18 6L6 18"/>',
    left: '<path d="M15 6l-6 6 6 6"/>',
    right: '<path d="M9 6l6 6-6 6"/>',
    copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>',
    send: '<path d="M21 3L10 14M21 3l-7 18-4-7-7-4z"/>'
  };
  const icon = name => `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ICONS.calendar}</svg>`;

  // Drawing helpers shared with the other art themes (js/art-traditional.js)
  window.ART_HELPERS = { f, rng, leaf, blade, arch };
  window.ART = { canopy, palace, gate, cage, perchBird, animals, coupleArt, river, butterflies, tuft, fronds, vine, sideVine, jungle, monkey, birds, sprig, lotus, icon };
})();
