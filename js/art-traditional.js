/* Traditional (temple) artwork. Each function here replaces the garden drawing of the same name in art.js,
   and keeps the same CSS class so the page layout does not change. Switched on per wedding with  style: "traditional". */
(function () {
  'use strict';

  const { f, rng, leaf, blade, arch } = window.ART_HELPERS;
  const GOLD = '#d4a13c', GOLD_D = '#a8782a', GOLD_L = '#f3d68f';
  const MANGO = ['#3f7d34', '#4f9a3c', '#2f6a2c'];
  const MARI = ['#f59e0b', '#f97316', '#fbbf24'];
  const circle = (x, y, r, fill, extra = '') => `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}" fill="${fill}" ${extra}/>`;

  // ---------- small motifs ----------
  const marigold = (x, y, r, c) => circle(x, y, r, c) + circle(x, y, r * 0.62, '#000', 'opacity=".1"') + circle(x, y, r * 0.3, '#fff3c4', 'opacity=".85"');

  // Mango leaf hanging down from (x, y)
  const mangoLeaf = (x, y, len, rot, c) => {
    const w = len * 0.2;
    return `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(rot)})"><path d="M0 0C${f(w)} ${f(len * 0.3)} ${f(w * 0.8)} ${f(len * 0.75)} 0 ${f(len)}C${f(-w * 0.8)} ${f(len * 0.75)} ${f(-w)} ${f(len * 0.3)} 0 0Z" fill="${c}"/><path d="M0 2V${f(len - 3)}" stroke="#cfe6a8" stroke-width=".7" opacity=".7"/></g>`;
  };

  // Thoranam: a rope of mango leaves with marigolds between them
  function thoranam(x0, x1, y) {
    let o = `<path d="M${x0} ${y}H${x1}" stroke="#8a5a2b" stroke-width="2.200"/>`, i = 0;
    for (let x = x0 + 6; x <= x1 - 6; x += 12, i++) o += mangoLeaf(x, y, 22 + (i % 3) * 5, i % 2 ? 7 : -7, MANGO[i % 3]);
    i = 0;
    for (let x = x0 + 12; x <= x1 - 6; x += 24, i++) o += marigold(x, y, 5.2, MARI[i % 3]);
    return o;
  }

  // One hanging string of marigolds with a white flower every fourth bead
  function garland(x, y0, len, k = 0) {
    let o = `<path d="M${x} ${y0}V${y0 + len}" stroke="#8a5a2b" stroke-width="1"/>`, i = 0;
    for (let y = y0 + 6; y <= y0 + len; y += 9, i++) o += marigold(x, y, 5, i % 4 === 3 ? '#fff7e0' : MARI[(i + k) % 3]);
    return o + mangoLeaf(x, y0 + len + 2, 13, 0, MANGO[0]);
  }

  // The flicker animation sets a CSS transform, which would replace a transform attribute on the same element — hence two groups
  const flame = (x, y, s = 1) => `<g transform="translate(${f(x)} ${f(y)}) scale(${s})"><g class="flame"><path d="M0 0C-5-6-3-12 0-18C3-12 5-6 0 0Z" fill="#f59e0b"/><path d="M0-1C-2.500-5-1.500-8 0-12C1.500-8 2.500-5 0-1Z" fill="#fff1a8"/></g></g>`;

  // Small clay lamp
  const diya = (x, y, s = 1) => `<g transform="translate(${f(x)} ${f(y)}) scale(${s})"><path d="M-13-4Q0 9 13-4L15-7H-15Z" fill="#b5562c"/><path d="M-15-7H15" stroke="#e08a4e" stroke-width="1.600"/></g>` + flame(x, y - 7 * s, s * 0.9);

  // Tall brass lamp (kuthu vilakku) standing on (x, y)
  const vilakku = (x, y, s = 1) => `<g transform="translate(${f(x)} ${f(y)}) scale(${s})">
      <ellipse cx="0" cy="-2" rx="17" ry="4.500" fill="${GOLD_D}"/><path d="M-12-4Q0-12 12-4Z" fill="${GOLD}"/>
      <rect x="-2.500" y="-58" width="5" height="52" fill="${GOLD}"/>
      ${[-20, -34, -48].map(cy => `<ellipse cx="0" cy="${cy}" rx="6" ry="3.500" fill="${GOLD_L}" stroke="${GOLD_D}" stroke-width=".8"/>`).join('')}
      <path d="M-20-62Q0-48 20-62L17-66H-17Z" fill="${GOLD}" stroke="${GOLD_D}" stroke-width=".8"/>
      <path d="M0-66V-80" stroke="${GOLD_D}" stroke-width="2.400"/><path d="M-4-80Q0-90 4-80Z" fill="${GOLD_L}"/>
    </g>` + [-15, 0, 15].map(dx => flame(x + dx * s, y - 66 * s, s * 0.8)).join('');

  // Rangoli / kolam rosette
  function kolam(x, y, r, c = GOLD) {
    const petals = n => Array.from({ length: n }, (_, i) => `<ellipse cx="0" cy="${f(-r * 0.62)}" rx="${f(r * 0.17)}" ry="${f(r * 0.36)}" transform="rotate(${(360 / n) * i})"/>`).join('');
    return `<g transform="translate(${x} ${y})" fill="none" stroke="${c}" stroke-width="1.300">
      <circle r="${r}"/><circle r="${f(r * 0.26)}"/>${petals(8)}
      ${Array.from({ length: 8 }, (_, i) => `<circle cx="0" cy="${f(-r * 1.14)}" r="1.600" fill="${c}" stroke="none" transform="rotate(${22.5 + 45 * i})"/>`).join('')}
    </g>`;
  }

  // Purna kalasam: brass pot, mango leaves and a coconut, standing on (x, y)
  const kalasam = (x, y, s = 1) => `<g transform="translate(${f(x)} ${f(y)}) scale(${s})">
      ${[-58, -28, 0, 28, 58].map((a, i) => mangoLeaf(0, -34, 24, 180 + a, MANGO[i % 3])).join('')}
      <circle cx="0" cy="-42" r="9" fill="#8a5a2b"/><path d="M0-51l-3-8h6z" fill="#6d4420"/>
      <path d="M-9-34H9L11-30H-11Z" fill="${GOLD_D}"/>
      <path d="M-11-30C-24-24-24-6-12 0H12C24-6 24-24 11-30Z" fill="${GOLD}"/>
      <path d="M-19-18Q0-12 19-18" fill="none" stroke="#b3202a" stroke-width="2.600"/><path d="M-18-12Q0-6 18-12" fill="none" stroke="#fff7e0" stroke-width="1.400"/>
      <ellipse cx="0" cy="1" rx="13" ry="3" fill="${GOLD_D}"/>
    </g>`;

  const bellShape = (x, y, s = 1) => `<g transform="translate(${f(x)} ${f(y)}) scale(${s})">
      <circle cx="0" cy="-2" r="3" fill="none" stroke="${GOLD_D}" stroke-width="1.600"/>
      <path d="M-11 22C-9 6-8 2 0 1C8 2 9 6 11 22L15 27H-15Z" fill="${GOLD}"/><path d="M-15 27H15" stroke="${GOLD_D}" stroke-width="2.400" stroke-linecap="round"/>
      <path d="M-5 6C-6 12-7 18-8 23" stroke="${GOLD_L}" stroke-width="1.600" fill="none" stroke-linecap="round"/>
      <circle cx="0" cy="31" r="3.200" fill="${GOLD_D}"/>
    </g>`;

  // ---------- opening screen: carved temple door ----------
  function gate(id) {
    const doorD = 'M30 782V236C30 112 370 112 370 236V782Z';
    let panels = '';
    [34, 206].forEach(x0 => {
      for (let y = 262; y < 720; y += 116) for (let c = 0; c < 2; c++) {
        const px = x0 + 7 + c * 79, cx = px + 34, cy = y + 50;
        panels += `<rect x="${px}" y="${y}" width="68" height="100" fill="#48200f" stroke="#8a4a22" stroke-width="1.400"/>
          <rect x="${px + 8}" y="${y + 8}" width="52" height="84" fill="none" stroke="${GOLD}" stroke-opacity=".45" stroke-width="1"/>
          ${circle(cx, cy, 6.5, GOLD)}${circle(cx - 1.6, cy - 1.8, 2.2, GOLD_L)}
          ${[[-17, -30], [17, -30], [-17, 30], [17, 30]].map(([dx, dy]) => circle(cx + dx, cy + dy, 2.2, GOLD)).join('')}`;
      }
    });
    const sun = `<g transform="translate(200 186)" fill="none" stroke="${GOLD}" stroke-width="1.600">
        <circle r="34"/><circle r="9" fill="${GOLD}" fill-opacity=".7"/>
        ${Array.from({ length: 12 }, (_, i) => `<ellipse cx="0" cy="-21" rx="5.500" ry="11" transform="rotate(${30 * i})"/>`).join('')}
        ${Array.from({ length: 12 }, (_, i) => `<path d="M0-38V-46" transform="rotate(${15 + 30 * i})"/>`).join('')}
      </g>`;
    return `<svg viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="wood${id}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#57260f"/><stop offset=".5" stop-color="#6f3519"/><stop offset="1" stop-color="#57260f"/></linearGradient>
        <filter id="tgrain${id}" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency=".02 .5" numOctaves="2" seed="5"/>
          <feColorMatrix type="matrix" values="0 0 0 0 .12  0 0 0 0 .05  0 0 0 0 .02  0 0 0 .55 0"/>
          <feComposite in2="SourceGraphic" operator="in" result="g"/>
          <feMerge><feMergeNode in="SourceGraphic"/><feMergeNode in="g"/></feMerge>
        </filter>
        <radialGradient id="tvig${id}" cx=".5" cy=".5" r=".75"><stop offset=".5" stop-color="#1a0a04" stop-opacity="0"/><stop offset="1" stop-color="#1a0a04" stop-opacity=".55"/></radialGradient>
      </defs>
      <rect width="400" height="800" fill="#ecdab4"/>
      ${kolam(46, 70, 22, GOLD_D)}${kolam(354, 70, 22, GOLD_D)}
      <path d="M16 800V236C16 92 384 92 384 236V800" fill="none" stroke="${GOLD_D}" stroke-width="3"/>
      <path d="${doorD}" fill="url(#wood${id})" filter="url(#tgrain${id})"/>
      <path d="${doorD}" fill="none" stroke="${GOLD}" stroke-width="7"/>
      <path d="M42 782V240C42 128 358 128 358 240" fill="none" stroke="${GOLD}" stroke-opacity=".5" stroke-width="1.200"/>
      ${sun}${panels}
      <path d="M200 143V782" stroke="#241008" stroke-width="2"/>
      ${[178, 222].map(x => `<circle cx="${x}" cy="590" r="6" fill="${GOLD}"/><circle cx="${x}" cy="606" r="13" fill="none" stroke="${GOLD}" stroke-width="3.500"/>`).join('')}
      ${[112, 288].map(x => `<path d="M${x} 150V190" stroke="${GOLD_D}" stroke-width="1.400"/>${bellShape(x, 192, 0.9)}`).join('')}
      <rect y="782" width="400" height="18" fill="#c9a26a"/><rect y="782" width="400" height="3" fill="#a8782a"/>
      ${diya(62, 782, 1)}${diya(338, 782, 1)}
      ${garland(10, 14, 430)}${garland(26, 14, 300, 1)}${garland(390, 14, 430, 2)}${garland(374, 14, 300)}
      ${thoranam(0, 400, 14)}
      <rect width="400" height="800" fill="url(#tvig${id})"/>
    </svg>`;
  }

  // ---------- names screen ----------
  const canopy = () => `<svg class="canopy" viewBox="0 0 400 150" aria-hidden="true">
      ${garland(6, 8, 118)}${garland(394, 8, 118, 1)}${garland(92, 8, 44, 2)}${garland(308, 8, 44)}${garland(118, 8, 26, 1)}${garland(282, 8, 26, 2)}
      ${thoranam(0, 400, 8)}
    </svg>`;

  // Replaces the bird cages: brass temple bells on chains. They hang on shorter chains than the cages so they stay clear of the names.
  const cage = (side, long, drop = Math.round(long * 0.4)) => `<svg class="cage cage-${side}" viewBox="0 0 60 ${drop + 96}" aria-hidden="true">
      <path d="M30 0V${drop - 4}" stroke="${GOLD_D}" stroke-width="1.400" stroke-dasharray="3 2"/>
      ${bellShape(30, drop, 1.5)}
    </svg>`;

  // Replaces the flock of birds: drifting clouds
  function birds() {
    const cloud = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})" fill="#fff"><ellipse cx="0" cy="0" rx="46" ry="15"/><ellipse cx="-20" cy="-9" rx="22" ry="15"/><ellipse cx="12" cy="-14" rx="26" ry="18"/><ellipse cx="36" cy="-4" rx="18" ry="11"/></g>`;
    return `<svg class="clouds" viewBox="0 0 400 420" aria-hidden="true" opacity=".88">${cloud(84, 70, 1.2)}${cloud(320, 150, 1.5)}${cloud(60, 250, 1)}${cloud(300, 330, 1.1)}</svg>`;
  }

  // Coconut palm behind the temple wall; the trunk leans by `lean` as it rises to `topY`
  function palm(x, topY, lean) {
    const tx = x + lean, r = rng(x);
    let o = `<path d="M${x} 520Q${f(x + lean * 0.2)} ${f((520 + topY) / 2)} ${tx} ${topY}" fill="none" stroke="#8f6f4a" stroke-width="7" stroke-linecap="round"/>
      <path d="M${x} 520Q${f(x + lean * 0.2)} ${f((520 + topY) / 2)} ${tx} ${topY}" fill="none" stroke="#6f5436" stroke-width="7" stroke-dasharray="1.500 9" opacity=".6"/>`;
    [-172, -150, -128, -104, -82, -58, -34, -12, 14, 166].forEach((a, i) => { o += blade(tx, topY, a + (r() - 0.5) * 8, 50 + r() * 16, 6.5, MANGO[i % 3]); });
    return o + circle(tx - 4, topY + 5, 4, '#7a5a2e') + circle(tx + 4, topY + 6, 4, '#6d4f27') + circle(tx, topY + 9, 3.6, '#84622f');
  }

  // Replaces the palace: a South Indian temple gateway tower (gopuram) behind its red-and-white striped wall.
  // Built bottom-up: granite base with the doorway, seven tapering storeys of niches and figures, then the barrel roof.
  function palace() {
    const W = [236, 214, 192, 170, 150, 130, 112], H = [46, 42, 38, 35, 32, 29, 26];
    const TINT = ['#7fc8be', '#f2a1b8', '#f5d06b', '#8fb8e8', '#f2a1b8', '#7fc8be', '#f5d06b'];
    const FIG = ['#3f7fbf', '#d9534f', '#3a9a6a', '#e0903a', '#8a5ab8', '#d94f8a'];
    const rect = (x, y, w, h, fill, extra = '') => `<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" fill="${fill}" ${extra}/>`;
    let o = '', clip = '';

    // palms and the striped compound wall (drawn wider than the picture so it reaches the screen edges at any size)
    o += palm(34, 292, 16) + palm(368, 262, -14) + palm(84, 356, -10) + palm(322, 340, 10);
    for (let x = -200, i = 0; x < 600; x += 14, i++) o += rect(x, 476, 14, 44, i % 2 ? '#b8452f' : '#f7efe0');
    o += rect(-200, 469, 800, 8, '#d9c39a') + rect(-200, 466, 800, 4, '#b99a66') + rect(-200, 514, 800, 6, '#a98d5f');

    // granite base
    o += rect(78, 430, 244, 90, '#dccba8'); clip += rect(78, 430, 244, 90, '#000');
    [90, 112, 134, 258, 280, 302].forEach(x => { o += rect(x, 438, 8, 76, '#c9b68e'); });
    [101, 123, 269, 291].forEach(x => { o += arch(x - 5, 482, 10, 22, '#a98d5f', 'opacity=".7"'); });
    o += rect(72, 428, 256, 9, '#c2ab7d', 'rx="2"') + rect(76, 470, 248, 4, '#c9b68e') + rect(70, 512, 260, 8, '#b59c6c');
    o += arch(164, 438, 72, 82, GOLD_D) + arch(169, 444, 62, 76, GOLD) + arch(174, 450, 52, 70, '#3a1a0e');
    o += `<path d="M200 452V520" stroke="#1f0c05" stroke-width="1.200"/>` + [470, 486, 502].map(y => circle(190, y, 1.6, GOLD) + circle(210, y, 1.6, GOLD)).join('');
    o += rect(156, 514, 88, 6, '#c9b68e');

    // the storeys
    let y = 430;
    W.forEach((w, i) => {
      const h = H[i], x = 200 - w / 2, top = y - h, bay = w * 0.17, side = (w - bay) / 2;
      const n = Math.max(2, Math.round(side / 24)), gap = side / n;
      clip += rect(x - 9, top, w + 18, h, '#000');
      o += rect(x, top, w, h, '#f7ecd4') + rect(x, top + h * 0.8, w, h * 0.2, TINT[i]) + rect(x, top + h * 0.78, w, 1.6, '#b9822e');
      for (let k = 0; k < n; k++) [-1, 1].forEach(s => {
        const cx = 200 + s * (bay / 2 + gap * (k + 0.5));
        o += arch(cx - gap * 0.32, top + h * 0.3, gap * 0.64, h * 0.48, TINT[(i + k + 1) % TINT.length]);
        o += `<path d="M${f(cx - gap * 0.17)} ${f(top + h * 0.78)}L${f(cx)} ${f(top + h * 0.5)}L${f(cx + gap * 0.17)} ${f(top + h * 0.78)}Z" fill="${FIG[(i * 3 + k + (s > 0 ? 2 : 0)) % FIG.length]}"/>` + circle(cx, top + h * 0.47, gap * 0.085, '#f3c9a0');
        o += rect(cx - s * gap / 2 - 1, top + h * 0.26, 2, h * 0.52, '#d2b98a');
      });
      // central opening, one above the other all the way up
      o += arch(200 - bay / 2 - 2.5, top + h * 0.17, bay + 5, h * 0.83, GOLD_D) + arch(200 - bay / 2 + 1, top + h * 0.27, bay - 2, h * 0.73, '#4a2110');
      // overhanging cornice with its row of horseshoe windows
      o += `<path d="M${f(x - 9)} ${f(top + h * 0.21)}Q${f(x - 9)} ${f(top + h * 0.02)} ${f(x + 2)} ${f(top + h * 0.02)}H${f(x + w - 2)}Q${f(x + w + 9)} ${f(top + h * 0.02)} ${f(x + w + 9)} ${f(top + h * 0.21)}Z" fill="#e6b54e"/>` + rect(x - 7, top + h * 0.2, w + 14, 2, '#b07a28');
      for (let m = Math.round(w / 22), k = 0; k < m; k++) { const kx = x + (w / m) * (k + 0.5); o += circle(kx, top + h * 0.12, 3, '#c9744a') + circle(kx, top + h * 0.12, 1.3, '#ffe9b8'); }
      // little domed shrines on the corners of each step
      [-1, 1].forEach(s => {
        const cx = 200 + s * (w / 2 - 5);
        o += `<path d="M${f(cx - 7)} ${f(top + h * 0.03)}Q${f(cx - 7)} ${f(top - h * 0.2)} ${f(cx)} ${f(top - h * 0.25)}Q${f(cx + 7)} ${f(top - h * 0.2)} ${f(cx + 7)} ${f(top + h * 0.03)}Z" fill="${TINT[(i + 2) % TINT.length]}"/>` + circle(cx, top - h * 0.28, 1.7, GOLD);
      });
      y = top;
    });

    // barrel roof, its horseshoe gables and the row of kalasams
    const roof = `M144 ${y}C144 ${y - 58} 256 ${y - 58} 256 ${y}Z`;
    clip += `<path d="${roof}"/>`;
    o += rect(148, y - 5, 104, 7, '#e6b54e') + `<path d="${roof}" fill="#7fc8be"/>`;
    [160, 172, 186, 214, 228, 240].forEach(x => { o += `<path d="M${x} ${y - 4}V${f(y - 43 + Math.pow((x - 200) / 56, 2) * 20)}" stroke="#58a89c" stroke-width="1"/>`; });
    [146, 254].forEach(x => { o += circle(x, y - 15, 16, '#f2a1b8', `stroke="${GOLD}" stroke-width="2.600"`) + circle(x, y - 15, 9, '#fbe3ea') + circle(x, y - 15, 4.5, GOLD); });
    o += circle(200, y - 17, 15, GOLD_D) + circle(200, y - 17, 12, '#f5d06b') + arch(194, y - 26, 12, 19, '#4a2110');
    [164, 182, 200, 218, 236].forEach(x => {
      const ry = y - 43 + Math.pow((x - 200) / 56, 2) * 20;
      o += circle(x, ry - 3, 3.6, GOLD) + `<path d="M${x} ${f(ry - 6)}v-8" stroke="${GOLD_D}" stroke-width="1.800"/>` + circle(x, ry - 15, 1.8, GOLD_L);
    });

    return `<svg class="palace" viewBox="0 0 400 520" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
      <defs>
        <clipPath id="gpClip">${clip}</clipPath>
        <linearGradient id="gpShade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset=".42" stop-color="#fff" stop-opacity="0"/>
          <stop offset=".6" stop-color="#3a1a0e" stop-opacity="0"/><stop offset="1" stop-color="#3a1a0e" stop-opacity=".3"/>
        </linearGradient>
      </defs>
      ${o}
      <rect x="60" y="100" width="280" height="420" fill="url(#gpShade)" clip-path="url(#gpClip)"/>
    </svg>`;
  }

  // ---------- section decorations ----------
  // Top corners get a quarter kolam, bottom corners a cluster of clay lamps
  function sprig(cls = '') {
    if (/\bb[lr]\b/.test(cls)) return `<svg class="sprig ${cls}" viewBox="0 0 120 70" aria-hidden="true">${diya(34, 62, 1)}${diya(66, 66, 1.15)}${diya(96, 60, 0.9)}</svg>`;
    return `<svg class="sprig ${cls}" viewBox="0 0 120 70" aria-hidden="true"><g fill="none" stroke="${GOLD}" stroke-width="1.300">
      <circle cx="0" cy="70" r="20"/><circle cx="0" cy="70" r="34"/><circle cx="0" cy="70" r="50"/>
      ${[8, 30, 52, 74].map(a => `<ellipse cx="0" cy="-64" rx="6" ry="13" transform="translate(0 70) rotate(${a})"/>`).join('')}
      ${[19, 41, 63].map(a => `<circle cx="0" cy="-84" r="2" fill="${GOLD}" stroke="none" transform="translate(0 70) rotate(${a})"/>`).join('')}
    </g></svg>`;
  }

  // Replaces the flower tuft on the quote card
  const tuft = () => `<svg class="tuft" viewBox="-10 0 180 86" aria-hidden="true">${kalasam(80, 82, 1.35)}</svg>`;

  // Replaces the river: brass lamps either side of a kolam
  const river = () => `<svg class="river" viewBox="0 0 400 220" aria-hidden="true">
      ${kolam(200, 164, 38)}${vilakku(46, 208, 1.5)}${vilakku(354, 208, 1.5)}${diya(122, 206, 1.1)}${diya(278, 206, 1.1)}
    </svg>`;

  // Marigold strings hanging in an arch; used at the top of the story and the gallery
  function hangingGarlands(cls) {
    let o = '';
    [10, 34, 58, 86, 118, 282, 314, 342, 366, 390].forEach((x, i) => { const e = Math.abs(x - 200) / 200; o += garland(x, 8, Math.round(18 + 72 * e * e), i); });
    return `<svg class="${cls}" viewBox="0 0 400 110" aria-hidden="true">${o}${thoranam(0, 400, 8)}</svg>`;
  }
  const butterflies = () => hangingGarlands('hangers');
  const fronds = () => hangingGarlands('fronds');

  // Replaces the vine and bird houses: thoranam with two temple bells
  const vine = () => `<svg class="vine" viewBox="0 0 400 130" aria-hidden="true">
      ${[[46, 60], [352, 52]].map(([x, d], i) => `<g class="hang" style="transform-origin:${x}px 10px;animation-delay:-${i * 1.6}s"><path d="M${x} 10V${d}" stroke="${GOLD_D}" stroke-width="1.400"/>${bellShape(x, d, 1.5)}</g>`).join('')}
      ${garland(6, 10, 96)}${garland(394, 10, 96, 1)}
      ${thoranam(0, 400, 10)}
    </svg>`;

  // Replaces the creeper beside the form: a marigold and jasmine garland
  function sideVine() {
    let o = '<path d="M24 0V640" stroke="#8a5a2b" stroke-width="1.200"/>';
    for (let y = 8, i = 0; y < 636; y += 13, i++) {
      if (i % 5 === 4) o += leaf(24, y, 200, 0.6, MANGO[1]) + leaf(24, y, -20, 0.6, MANGO[0]);
      o += marigold(24, y, 8, i % 5 === 2 ? '#fff7e0' : MARI[i % 3]);
    }
    return `<svg class="side-vine" viewBox="0 0 90 640" aria-hidden="true">${o}</svg>`;
  }

  // Replaces the row of animals: two caparisoned elephants facing a kalasam
  function animals() {
    const g = '#9aa0aa', gd = '#858b96';
    const elephant = `
      ${[26, 44, 70, 86].map(x => `<rect x="${x}" y="108" width="13" height="27" rx="5" fill="${gd}"/><rect x="${x}" y="126" width="13" height="3" fill="${GOLD}"/>`).join('')}
      <path d="M20 92C12 96 12 106 15 112" fill="none" stroke="${gd}" stroke-width="2.600" stroke-linecap="round"/>
      <ellipse cx="60" cy="98" rx="42" ry="27" fill="${g}"/>
      <path d="M34 80Q60 64 88 78L86 114Q60 120 36 114Z" fill="#b3202a" stroke="${GOLD}" stroke-width="2"/>
      ${[[48, 90], [60, 88], [72, 90], [54, 102], [66, 102]].map(([x, y]) => circle(x, y, 2, GOLD_L)).join('')}
      <circle cx="102" cy="86" r="20" fill="${g}"/>
      <path d="M114 84C128 90 128 112 120 124C116 130 124 134 128 128" fill="none" stroke="${g}" stroke-width="9" stroke-linecap="round"/>
      <path d="M112 98C116 104 118 108 122 110" fill="none" stroke="#fff" stroke-width="2.600" stroke-linecap="round"/>
      <ellipse cx="88" cy="88" rx="12" ry="17" fill="${gd}"/><ellipse cx="88" cy="89" rx="7" ry="11" fill="#e6c6c6"/>
      <path d="M103 67Q112 72 114 82L116 98L112.500 98Q111 84 101 74Z" fill="${GOLD}" stroke="${GOLD_D}" stroke-width=".8"/>
      <circle cx="104" cy="86" r="1.700" fill="#2a2a2a"/>`;
    return `<svg class="animals" viewBox="0 0 400 150" aria-hidden="true">
      <rect y="134" width="400" height="16" fill="#efe0c0"/><rect y="134" width="400" height="2" fill="${GOLD}"/>
      <g transform="translate(18 0)">${elephant}</g><g transform="translate(382 0) scale(-1 1)">${elephant}</g>
      ${kolam(200, 124, 22)}${kalasam(200, 132, 1.5)}
    </svg>`;
  }

  // Replaces the jungle: lamps and a kolam along the bottom of the reply section
  const jungle = () => `<svg class="jungle" viewBox="0 0 400 150" aria-hidden="true">
      ${kolam(200, 104, 34)}${vilakku(44, 142, 1.45)}${vilakku(356, 142, 1.45)}${diya(116, 140, 1.1)}${diya(284, 140, 1.1)}
    </svg>`;

  // The garden-only creatures have no traditional counterpart
  const none = () => '';

  window.ART_TRADITIONAL = { gate, canopy, cage, birds, palace, sprig, tuft, river, butterflies, fronds, vine, sideVine, animals, jungle, perchBird: none, monkey: none };
})();
