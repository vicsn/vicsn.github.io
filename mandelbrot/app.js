/* ============================================================
   Die Mathe-Hecke / The Maths Hedge

   One graph, five cuts. Two stacked canvases:
     #hedge  a see-through hedge, painted procedurally
     #graph  grid, axes, the four points and the cut line

   When a step opens:   point 1..4 appear one second apart,
                        then the full line is drawn,
                        then the part of the hedge it cuts away fades.
   ============================================================ */
(function () {
  'use strict';

  var TAU = Math.PI * 2;
  var root = document.documentElement;
  function $(s, r) { return (r || document).querySelector(s); }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function easeInOut(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function easeOutBack(t) { var c = 1.9; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); }
  function rng(seed) {                       // small seeded PRNG: the hedge looks the same every visit
    return function () {
      seed = (seed + 0x6D2B79F5) | 0;
      var t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /* ---------------------------------------------------------- timing */

  var POINTS     = 4;
  var POINT_FIRST = 500;                      // ms after the step opens: first point
  var POINT_GAP   = 1000;                     // ms between points
  var LINE_AT     = POINT_FIRST + POINTS * POINT_GAP;   // one more gap after the 4th point
  var LINE_DUR    = 1100;                     // the line being drawn
  var CUT_DUR     = 900;                      // the cut-away part of the hedge fading
  var POP_DUR     = 380;                      // a point popping in
  var PULSE_DUR   = 800;
  var GHOST       = 0.86;                     // how much of the cut-away hedge disappears

  // step 5 only: the zoom waits for two things. The whole set must be drawn for a second,
  // and the page's text must have been read out. Then we zoom in on its edge.
  var ZOOM_WAIT   = 1000;
  var TEXT_GAP    = 700;                      // a breath between the last word and the first bit of zoom
  var ZOOM_DUR    = 16000;
  var ZOOM_MAX    = 1200;                     // deep enough for swirls on swirls, well inside what 32-bit GPU numbers can show
  var ZOOM_TARGET = [-0.743643887037151, 0.131825904205330];   // Seahorse Valley, right on the edge
  var FURNITURE_FADE = 700;                   // grid, numbers and points fade out as the zoom starts

  /* ---------------------------------------------------------- the world */

  var HALF_W = 3.4, HALF_H = 2.7;             // this much of the graph is always visible
  var HEDGE_TOP = 2.4;                        // the top of the hedge sits at y = 2.4

  /* ---------------------------------------------------------- text */

  var TEXT = {
    de: {
      docTitle: 'Die Mathe-Hecke',
      desc: 'Wie schneidet man mit Mathe eine Hecke? Fünf Schnitte auf einem Graphen – bis hin zur Mandelbrot-Menge.',
      brand: 'Die Mathe-Hecke',
      stepOf: 'Schritt {n} von {total}',
      prev: 'Zurück', next: 'Weiter',
      pause: 'Pause', pauseAria: 'Animation anhalten',
      start: 'Los geht’s', startHint: 'Mit Ton: einmal tippen zum Starten',
      reset: 'Zurücksetzen', resetAria: 'Zurücksetzen und diese Animation neu starten',
      voice: 'Vorlesen',
      zoom: 'Vergrößerung ×{n}',
      closing: 'Wir können unendlich weit hineinzoomen, und mit dieser Methode bekommen wir unendlich viel Komplexität.',
      // how a sentence is turned into something a speech engine reads properly
      voiceLang: 'de-DE',
      piper: 'de_DE-thorsten-medium',            // a native German neural voice (see tts-worker.js)
      say: { squared: ' hoch zwei', equals: ' gleich ', plus: ' plus ', minus: 'minus ', times: ' mal ', pair: ' und ' },
      goTo: 'Zu Schritt {n}',
      pager: 'Schritte',
      other: 'English', otherCode: 'en',
      toDark: 'Dunkel', toLight: 'Hell',
      themeAria: 'Zwischen hell und dunkel wechseln',
      and: 'und',
      graphAria: 'Graph mit einer Hecke und der Schnittlinie {eq}',
      point: function (x, y) { return '(' + x + ' | ' + y + ')'; },
      decimal: ',',
      steps: [
        { title: 'Eine schräge Linie',
          text: 'Bei y = x gehst du immer genauso weit nach oben, wie du nach rechts gegangen bist. ' +
                'Das gibt eine schräge Linie – und eine ziemlich komische Hecke! Probieren wir etwas Nützlicheres.' },
        { title: 'Oben abschneiden',
          text: 'Bei y = 2 ist jeder Punkt genau 2 Schritte hoch, egal wie weit rechts. ' +
                'Das gibt eine gerade Linie, und damit schneiden wir die Hecke oben sauber ab.' },
        { title: 'Eine Tür in der Hecke',
          text: 'Bei x = −1 sind alle Punkte 1 Schritt nach links gegangen, egal wie hoch. ' +
                'Bei x = 1 ist es 1 Schritt nach rechts. Zwischen den beiden Linien schneiden wir eine Tür in die Hecke.' },
        { title: 'Ein Loch in der Hecke',
          text: 'Bei x² + y² = 1 sind alle Punkte genau 1 Schritt vom Mittelpunkt entfernt. ' +
                'Das gibt einen Kreis, und damit schneiden wir ein rundes Loch in die Hecke.' },
        { title: 'Die Mandelbrot-Menge',
          // [like this] is picked out in colour; {#id} marks where the point id is mentioned (it appears then)
          text: 'Zum Schluss ein wildes Loch! Wir prüfen jeden Punkt im Graphen einzeln und nennen ihn [C]. ' +
                'Als Beispiel nehmen wir {#C}[C] = (0 | 1), also [C_{x}] = 0 und [C_{y}] = 1. ' +
                'Dazu kommt ein zweiter Punkt [Z], der hüpft. Er startet bei {#Z_1}[Z_{1}] = (0 | 0), also [Z_{x_{1}}] = 0 und [Z_{y_{1}}] = 0. ' +
                'Den nächsten Punkt rechnen wir so aus: [Z_{x_{2}}] = [Z_{x_{1}}²] − [Z_{y_{1}}²] + [C_{x}] ' +
                'und [Z_{y_{2}}] = 2 · [Z_{x_{1}}] · [Z_{y_{1}}] + [C_{y}]. ' +
                'Das gibt {#Z_2}[Z_{2}] = (0 | 1). Genauso wird aus [Z_{2}] der Punkt {#Z_3}[Z_{3}] = (−1 | 1), dann {#Z_4}[Z_{4}] = (0 | −1), dann wieder {#Z_5}[Z_{5}] = (−1 | 1) und immer so weiter. ' +
                '[Z] bleibt in der Nähe, darum schneiden wir bei [C] ein Loch in die Hecke. Würde [Z] davonrennen, bliebe die Hecke stehen.' }
      ]
    },
    en: {
      docTitle: 'The Maths Hedge',
      desc: 'How do you trim a hedge with maths? Five cuts on a graph, all the way to the Mandelbrot set.',
      brand: 'The Maths Hedge',
      stepOf: 'Step {n} of {total}',
      prev: 'Previous', next: 'Next',
      pause: 'Pause', pauseAria: 'Pause the animation',
      start: 'Start', startHint: 'With sound: tap once to begin',
      reset: 'Reset', resetAria: 'Reset and replay this animation',
      voice: 'Read aloud',
      zoom: 'Zoom ×{n}',
      closing: 'We can zoom in infinitely, and this method gives us infinite complexity.',
      voiceLang: 'en-GB',
      piper: null,                               // English uses the voices the browser already has
      say: { squared: ' squared', equals: ' equals ', plus: ' plus ', minus: 'minus ', times: ' times ', pair: ' and ' },
      goTo: 'Go to step {n}',
      pager: 'Steps',
      other: 'Deutsch', otherCode: 'de',
      toDark: 'Dark', toLight: 'Light',
      themeAria: 'Switch between light and dark',
      and: 'and',
      graphAria: 'Graph with a hedge and the cut line {eq}',
      point: function (x, y) { return '(' + x + ', ' + y + ')'; },
      decimal: '.',
      steps: [
        { title: 'A slanted line',
          text: 'With y = x, you always go up exactly as far as you went right. ' +
                'That makes a slanted line — and a pretty weird hedge! Let\u2019s try something more useful.' },
        { title: 'Cut off the top',
          text: 'With y = 2, every point is exactly 2 steps up, no matter how far right. ' +
                'That makes a flat line, and it cleanly cuts the top off the hedge.' },
        { title: 'A door in the hedge',
          text: 'On x = −1, every point is 1 step to the left, however high up. ' +
                'On x = 1, it is 1 step to the right. Between the two lines we cut a door into the hedge.' },
        { title: 'A hole in the hedge',
          text: 'With x² + y² = 1, every point is exactly 1 step away from the middle. ' +
                'That makes a circle, and we use it to cut a round hole in the hedge.' },
        { title: 'The Mandelbrot set',
          text: 'To finish, a wild hole! We check every point on the graph one by one and call it [C]. ' +
                'As an example we take {#C}[C] = (0, 1), so [C_{x}] = 0 and [C_{y}] = 1. ' +
                'Then comes a second point [Z] that hops. It starts at {#Z_1}[Z_{1}] = (0, 0), so [Z_{x_{1}}] = 0 and [Z_{y_{1}}] = 0. ' +
                'We work out the next point like this: [Z_{x_{2}}] = [Z_{x_{1}}²] − [Z_{y_{1}}²] + [C_{x}] ' +
                'and [Z_{y_{2}}] = 2 · [Z_{x_{1}}] · [Z_{y_{1}}] + [C_{y}]. ' +
                'That gives {#Z_2}[Z_{2}] = (0, 1). In the same way [Z_{2}] turns into {#Z_3}[Z_{3}] = (−1, 1), then {#Z_4}[Z_{4}] = (0, −1), then {#Z_5}[Z_{5}] = (−1, 1) again, and so on forever. ' +
                '[Z] stays close, so we cut a hole in the hedge at [C]. If [Z] ran away, the hedge would stay.' }
      ]
    }
  };

  /* ---------------------------------------------------------- the five cuts

     pts     [x, y, where the label sits]  — shown one second apart
     curves  the line to draw, as polylines in graph units (clipped to what is visible)
     cut     the part of the hedge that gets cut away (a path in graph units)
     mandel  step 5 is not a simple line: it is traced pixel by pixel (see below)         */

  function seg(a, b) { return [a, b]; }
  function circle(r) {
    var out = [];
    for (var i = 0; i <= 180; i++) out.push([r * Math.cos(i / 180 * TAU), r * Math.sin(i / 180 * TAU)]);
    return out;
  }
  var BIG = 400;                              // "far enough off screen"

  var STEPS = [
    { // y = x : a slanted cut, so the hedge ends up lopsided
      eq: ['y = x'],
      pts: [[-2, -2, 'se'], [-1, -1, 'se'], [1, 1, 'se'], [2, 2, 'se']],
      curves: function (v) {
        var a = Math.max(v.xmin, v.ymin) - 0.5, b = Math.min(v.xmax, v.ymax) + 0.5;
        return [seg([a, a], [b, b])];
      },
      cut: function (g) { poly(g, [[-BIG, -BIG], [BIG, BIG], [-BIG, BIG]]); }
    },
    { // y = 2 : the top comes off
      eq: ['y = 2'],
      pts: [[-3, 2, 'n'], [-1, 2, 'n'], [1, 2, 'n'], [3, 2, 'n']],
      curves: function (v) { return [seg([v.xmin - 0.5, 2], [v.xmax + 0.5, 2])]; },
      cut: function (g) { poly(g, [[-BIG, 2], [BIG, 2], [BIG, BIG], [-BIG, BIG]]); }
    },
    { // x = -1 and x = 1 : a door
      eq: ['x = \u22121', 'x = 1'],
      pts: [[-1, 1, 'w'], [-1, -2, 'w'], [1, 2, 'e'], [1, -1, 'e']],
      curves: function (v) {
        return [seg([-1, v.ymin - 0.5], [-1, v.ymax + 0.5]), seg([1, v.ymin - 0.5], [1, v.ymax + 0.5])];
      },
      cut: function (g) { poly(g, [[-1, -BIG], [1, -BIG], [1, BIG], [-1, BIG]]); }
    },
    { // x^2 + y^2 = 1 : a round hole
      eq: ['x\u00B2 + y\u00B2 = 1'],
      pts: [[1, 0, 'ne'], [0, 1, 'ne'], [-1, 0, 'nw'], [0, -1, 'se']],
      curves: function () { return [circle(1)]; },
      cut: function (g) { g.beginPath(); g.arc(X(0), Y(0), view.s, 0, TAU); }
    },
    { // Mandelbrot : all four points sit exactly on its edge
      eq: ['Z \u2192 Z\u00B2 + C'],
      // the points from the text; each name appears when the voice says it, and Z lands on some spots twice
      pts: [[0, 1, 'ne', ['C', 'Z_2']], [0, 0, 'sw', ['Z_1']], [-1, 1, 'nw', ['Z_3', 'Z_5']], [0, -1, 'se', ['Z_4']]],
      cued: true,
      mandel: true
    }
  ];

  /* ---------------------------------------------------------- state */

  var lang = 'de';
  try { var saved = localStorage.getItem('hedge-lang'); if (saved === 'de' || saved === 'en') lang = saved; } catch (e) {}
  var T = TEXT[lang];
  var step = 0;
  var anim = null;
  var reduceMotion = false;

  var stage   = $('#stage');
  var hedgeCv = $('#hedge');
  var graphCv = $('#graph');
  var fractalCv = $('#fractal');
  var zoomTag = $('#zoomtag');
  var hctx = hedgeCv.getContext('2d');
  var gctx = graphCv.getContext('2d');
  var hedgeBase = document.createElement('canvas');   // the whole, uncut hedge

  var view = { W: 0, H: 0, dpr: 1, s: 1, cx: 0, cy: 0, xmin: 0, xmax: 0, ymin: 0, ymax: 0, key: '' };
  function X(x) { return view.cx + x * view.s; }
  function Y(y) { return view.cy - y * view.s; }
  function poly(g, pts) {
    g.beginPath();
    for (var i = 0; i < pts.length; i++) g[i ? 'lineTo' : 'moveTo'](X(pts[i][0]), Y(pts[i][1]));
    g.closePath();
  }

  /* ---------------------------------------------------------- palette (from CSS, so dark mode just works) */

  var PAL = {};
  function readPalette() {
    var cs = getComputedStyle(root);
    function g(n) { return cs.getPropertyValue(n).trim(); }
    PAL.ink = g('--ink'); PAL.ink2 = g('--ink-2'); PAL.surface = g('--surface');
    PAL.grid = g('--grid-line'); PAL.axis = g('--axis-line'); PAL.cut = g('--cut');
    PAL.leaf = g('--hedge').split(',').map(function (s) { return s.trim(); });
    PAL.base = g('--hedge-base'); PAL.deep = g('--hedge-deep');
    PAL.sans = g('--sans');
  }
  function hexRGB(h) {
    h = h.replace('#', '');
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
  }

  /* ---------------------------------------------------------- number formatting */

  function num(n) {
    var s = String(Math.round(n * 100) / 100).replace('-', '\u2212');
    return T.decimal === ',' ? s.replace('.', ',') : s;
  }

  /* ---------------------------------------------------------- layout */

  var raf = 0;
  function requestFrame() { if (!raf) raf = requestAnimationFrame(frame); }

  function layout() {
    var W = stage.clientWidth, H = stage.clientHeight;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    if (!W || !H) return;
    if (W === view.W && H === view.H && dpr === view.dpr) return;

    view.W = W; view.H = H; view.dpr = dpr;
    view.s = Math.min(W / (2 * HALF_W), H / (2 * HALF_H));    // fit the whole window, centred on (0, 0)
    view.cx = W / 2; view.cy = H / 2;
    view.xmin = -view.cx / view.s; view.xmax = (W - view.cx) / view.s;
    view.ymax = view.cy / view.s;  view.ymin = (view.cy - H) / view.s;
    view.key = W + 'x' + H + '@' + dpr;

    [hedgeCv, graphCv].forEach(function (cv) {
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    });
    if (fractal) fractal.resize(W, H, dpr);
    paintHedge();
    hedgeShown = -1;
    if (STEPS[step].mandel && !fractal) startMandel();
    requestFrame();
  }

  /* ---------------------------------------------------------- the hedge
     The leafy body is one seamless tile, repeated. That is what lets the hedge zoom forever:
     two copies of the tile at neighbouring sizes are faded into each other, so leaves keep
     growing and new small ones keep appearing, and nothing ever pops.
     renderHedge() draws the whole hedge at any zoom; at zoom 1 it is the ordinary hedge.   */

  var TILE = 640;                              // CSS px before the leaf pattern repeats
  var tileCv = document.createElement('canvas');
  var fringeCv = document.createElement('canvas');   // the fuzzy leaves along the top edge

  function hedgeEdge(x) {                      // a gently wobbling top edge, in graph-at-zoom-1 pixels
    return Y(HEDGE_TOP) + 4.5 * Math.sin(x * 0.023 + 0.8) + 3 * Math.sin(x * 0.071 + 2.2) + 1.8 * Math.sin(x * 0.17 + 0.4);
  }
  function rgba(hex, a) { var c = hexRGB(hex); return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + a + ')'; }

  function leafShape(rnd) { return { a: rnd() * Math.PI, rx: 5.5 + rnd() * 6, ry: 2.2 + rnd() * 2.2, alpha: 0.55 + rnd() * 0.3 }; }
  function drawLeaf(g, dpr, x, y, lf, color) {
    var ca = Math.cos(lf.a) * dpr, sa = Math.sin(lf.a) * dpr;
    g.setTransform(ca, sa, -sa, ca, x * dpr, y * dpr);
    g.fillStyle = color; g.globalAlpha = lf.alpha;
    g.beginPath();
    g.moveTo(-lf.rx, 0); g.quadraticCurveTo(0, -lf.ry * 1.7, lf.rx, 0); g.quadraticCurveTo(0, lf.ry * 1.7, -lf.rx, 0);
    g.fill();
  }
  function leafColor(tone) { var L = PAL.leaf; return L[Math.min(L.length - 1, Math.floor(tone * L.length))]; }

  function paintTile() {
    var dpr = view.dpr, n = Math.round(TILE * dpr);
    tileCv.width = n; tileCv.height = n;
    var g = tileCv.getContext('2d'), rnd = rng(20241011);
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.fillStyle = PAL.base; g.fillRect(0, 0, TILE, TILE);   // opaque, so two layers fade cleanly; the canvas itself is see-through
    var count = Math.round(TILE * TILE / 52), R = 14;
    for (var k = 0; k < count; k++) {
      var x = rnd() * TILE, y = rnd() * TILE, lf = leafShape(rnd), col = leafColor(0.1 + rnd() * 0.8);
      // a leaf near an edge is also drawn on the far side, so the tile joins up with itself
      for (var ox = -1; ox <= 1; ox++) for (var oy = -1; oy <= 1; oy++) {
        var px = x + ox * TILE, py = y + oy * TILE;
        if (px > -R && px < TILE + R && py > -R && py < TILE + R) drawLeaf(g, dpr, px, py, lf, col);
      }
    }
  }

  function paintFringe() {
    var W = view.W, H = view.H, dpr = view.dpr, rnd = rng(77);
    fringeCv.width = Math.round(W * dpr); fringeCv.height = Math.round(H * dpr);
    var g = fringeCv.getContext('2d');
    for (var fx = -4; fx < W + 4; fx += 2.2) drawLeaf(g, dpr, fx, hedgeEdge(fx) + rnd() * 9 - 3, leafShape(rnd), leafColor(0.45 + rnd() * 0.55));
  }

  // Draw the hedge into g (a canvas the size of the stage) as it looks at zoom Z, when the point we
  // zoom towards has glided to (Px, Py) on screen. Z = 1 gives the ordinary hedge.
  function renderHedge(g, Z, Px, Py) {
    var W = view.W, H = view.H, dpr = view.dpr;
    var p0x = X(ZOOM_TARGET[0]), p0y = Y(ZOOM_TARGET[1]);          // where that point is at zoom 1
    function at(m) { g.setTransform(dpr * m, 0, 0, dpr * m, dpr * (Px - p0x * m), dpr * (Py - p0y * m)); }

    g.save();
    // only the part below the top edge is hedge (the edge zooms too, and soon leaves the screen)
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.beginPath(); g.moveTo(-10, H + 10);
    for (var sx = -10; sx <= W + 10; sx += 6) g.lineTo(sx, Py + (hedgeEdge(p0x + (sx - Px) / Z) + 5 - p0y) * Z);
    g.lineTo(W + 10, H + 10); g.closePath(); g.clip();

    // leaves: tile copies at two neighbouring sizes, faded into each other
    var pat = g.createPattern(tileCv, 'repeat');
    if (pat.setTransform) pat.setTransform(new DOMMatrix([1 / dpr, 0, 0, 1 / dpr, 0, 0]));   // one tile = TILE CSS px
    var phi = Math.log(Z) / Math.LN2; phi -= Math.floor(phi);
    var layers = [[Math.pow(2, phi), 1], [Math.pow(2, phi - 1), Math.pow(Math.sin(Math.PI * phi / 2), 2)]];
    g.fillStyle = pat;
    layers.forEach(function (l) {
      if (l[1] < 0.004) return;
      var m = l[0]; at(m); g.globalAlpha = l[1];
      g.fillRect(p0x - Px / m, p0y - Py / m, W / m, H / m);
    });

    // light at the very top, deeper shade lower down; both belong to the hedge, so they zoom with it
    at(Z); g.globalAlpha = 1;
    var topY = Y(HEDGE_TOP), x0 = p0x - Px / Z, y0 = p0y - Py / Z, w = W / Z, h = H / Z;
    var shade = g.createLinearGradient(0, topY, 0, H);
    shade.addColorStop(0, rgba(PAL.deep, 0)); shade.addColorStop(1, rgba(PAL.deep, 0.5));
    g.fillStyle = shade; g.fillRect(x0, y0, w, h);
    var sun = g.createLinearGradient(0, topY, 0, topY + 240);
    sun.addColorStop(0, rgba(PAL.leaf[PAL.leaf.length - 1], 0.4)); sun.addColorStop(1, rgba(PAL.leaf[PAL.leaf.length - 1], 0));
    g.fillStyle = sun; g.fillRect(x0, y0, w, h);
    g.restore();

    // the fuzzy top edge, for as long as it is still on screen
    if (Z < 6) {
      g.save(); at(Z); g.globalAlpha = clamp(1 - (Z - 1) / 4, 0, 1);
      g.drawImage(fringeCv, 0, 0, W, H);
      g.restore();
    }
    g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1;
  }

  // The ordinary hedge, painted once and kept: steps 1 to 5 start from this.
  function paintHedge() {
    var dpr = view.dpr;
    paintTile(); paintFringe();
    hedgeBase.width = Math.round(view.W * dpr); hedgeBase.height = Math.round(view.H * dpr);
    var g = hedgeBase.getContext('2d');
    g.clearRect(0, 0, hedgeBase.width, hedgeBase.height);
    renderHedge(g, 1, X(ZOOM_TARGET[0]), Y(ZOOM_TARGET[1]));
  }

  // During the zoom the hedge is redrawn every frame at the current zoom.
  function drawHedgeZoomed(Z, Px, Py) {
    var g = hctx;
    g.setTransform(1, 0, 0, 1, 0, 0);
    g.globalCompositeOperation = 'source-over'; g.globalAlpha = 1;
    g.clearRect(0, 0, hedgeCv.width, hedgeCv.height);
    renderHedge(g, Z, Px, Py);
    hedgeShown = -1;                          // so the ordinary hedge is redrawn when we leave
  }

  // Draw the hedge, with the cut-away part faded to a ghost (cp = 0..1).
  var hedgeShown = -1;
  function drawHedge(cp) {
    if (cp === hedgeShown) return;
    hedgeShown = cp;
    var g = hctx, dpr = view.dpr;
    g.setTransform(1, 0, 0, 1, 0, 0);
    g.globalCompositeOperation = 'source-over'; g.globalAlpha = 1;
    g.clearRect(0, 0, hedgeCv.width, hedgeCv.height);
    g.drawImage(hedgeBase, 0, 0);
    if (cp <= 0) return;

    var st = STEPS[step];
    g.globalCompositeOperation = 'destination-out';
    g.globalAlpha = GHOST * cp;
    if (st.mandel) {
      // with WebGL the hole is laid over the hedge by the shader instead
      if (!fractal && isMandelReady()) {
        g.drawImage(mandel.maskCv, mandel.left * dpr, mandel.top * dpr, mandel.wCss * dpr, mandel.hCss * dpr);
      }
    } else {
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      st.cut(g);
      g.fillStyle = '#000'; g.fill();
    }
    g.setTransform(1, 0, 0, 1, 0, 0);
    g.globalCompositeOperation = 'source-over'; g.globalAlpha = 1;
  }

  /* ---------------------------------------------------------- the Mandelbrot set
     Every pixel near the set is tested: square, add c, repeat. Two results are kept:
       inside  pixels that never ran away  -> the hole that gets cut
       line    pixels just outside the edge, found with the distance estimate
               d = |z| ln|z| / |dz|, which gives a clean, even outline
     The work is done in short slices so the page stays smooth.                    */

  var MX0 = -2.25, MX1 = 0.75, MY0 = -1.3, MY1 = 1.3, MAXIT = 500;
  var LINE_IN = 0.9, LINE_OUT = 2.0;          // outline thickness in CSS px (fully on -> fully off)
  var mandel = null, mandelJob = 0;

  function isMandelReady() { return !!(mandel && mandel.ready && mandel.key === view.key); }

  function startMandel() {
    if (mandel && mandel.key === view.key) return;
    var job = ++mandelJob, s = view.s, dpr = view.dpr;
    var wCss = (MX1 - MX0) * s, hCss = (MY1 - MY0) * s;
    var f = dpr;
    if (wCss * hCss * f * f > 2.4e6) f = Math.sqrt(2.4e6 / (wCss * hCss));   // keep huge screens quick
    var w = Math.max(2, Math.round(wCss * f)), h = Math.max(2, Math.round(hCss * f));
    var m = mandel = {
      key: view.key, ready: false, readyAt: 0, w: w, h: h,
      left: view.cx + MX0 * s, top: view.cy - MY1 * s, wCss: wCss, hCss: hCss,
      line: new Uint8ClampedArray(w * h), inside: new Uint8ClampedArray(w * h),
      maskCv: null, lineCv: null, lineColor: ''
    };
    var dx = (MX1 - MX0) / w, dy = (MY1 - MY0) / h, j = 0;

    function row(j) {
      var ci = MY1 - (j + 0.5) * dy;
      for (var i = 0; i < w; i++) {
        var cr = MX0 + (i + 0.5) * dx, idx = j * w + i;
        // skip the big round parts, which are known to stay home
        var q = (cr - 0.25) * (cr - 0.25) + ci * ci;
        if (q * (q + (cr - 0.25)) <= 0.25 * ci * ci || (cr + 1) * (cr + 1) + ci * ci <= 0.0625) { m.inside[idx] = 255; continue; }
        var zr = 0, zi = 0, dr = 0, di = 0, n = 0;
        for (; n < MAXIT; n++) {
          var ndr = 2 * (zr * dr - zi * di) + 1;
          di = 2 * (zr * di + zi * dr); dr = ndr;
          var t = zr * zr - zi * zi + cr; zi = 2 * zr * zi + ci; zr = t;
          if (zr * zr + zi * zi > 1e6) break;
        }
        if (n >= MAXIT) { m.inside[idx] = 255; continue; }
        var mz = Math.sqrt(zr * zr + zi * zi), md = Math.sqrt(dr * dr + di * di);
        var d = mz * Math.log(mz) / md * s;                        // distance to the set, in CSS px
        m.line[idx] = d <= LINE_IN ? 255 : d >= LINE_OUT ? 0 : Math.round(255 * (LINE_OUT - d) / (LINE_OUT - LINE_IN));
      }
    }

    (function chunk() {
      if (job !== mandelJob) return;                               // a newer size took over
      var t0 = performance.now();
      while (j < h && performance.now() - t0 < 10) row(j++);
      if (j < h) { setTimeout(chunk, 0); return; }
      var cv = document.createElement('canvas'); cv.width = w; cv.height = h;
      var c = cv.getContext('2d'), img = c.createImageData(w, h);
      for (var p = 0; p < w * h; p++) img.data[p * 4 + 3] = m.inside[p];
      c.putImageData(img, 0, 0);
      m.maskCv = cv; m.ready = true; m.readyAt = performance.now();
      hedgeShown = -1;
      requestFrame();
    })();
  }

  function mandelLineCanvas() {                                    // tinted with the current cut colour
    var m = mandel;
    if (m.lineCv && m.lineColor === PAL.cut) return m.lineCv;
    var rgb = hexRGB(PAL.cut);
    var cv = m.lineCv || document.createElement('canvas');
    cv.width = m.w; cv.height = m.h;
    var c = cv.getContext('2d'), img = c.createImageData(m.w, m.h);
    for (var p = 0; p < m.w * m.h; p++) {
      img.data[p * 4] = rgb[0]; img.data[p * 4 + 1] = rgb[1]; img.data[p * 4 + 2] = rgb[2];
      img.data[p * 4 + 3] = m.line[p];
    }
    c.putImageData(img, 0, 0);
    m.lineCv = cv; m.lineColor = PAL.cut;
    return cv;
  }

  /* ---------------------------------------------------------- the Mandelbrot set, on the GPU
     Same maths as above, but done per pixel in a shader, so the zoom runs in real time.
     It draws two things on a transparent layer between the hedge and the graph:
       the hole    the surface colour laid over the hedge wherever z never runs away
                   (looks exactly like cutting the hedge away, since the hedge is see-through)
       the line    the cut colour just outside the edge
     If WebGL is missing, fractal stays null and the canvas version above is used (no zoom). */

  var fractal = null;
  var FRAG_MAX_ITER = 800;                    // loop bound the shader is compiled with

  var VERT = 'attribute vec2 a; void main() { gl_Position = vec4(a, 0.0, 1.0); }';
  var FRAG = [
    'precision highp float;',
    'uniform vec2 uT;          // the point we zoom towards, in graph units',
    'uniform vec2 uP;          // where that point sits on screen (CSS px, from top left)',
    'uniform float uS;         // CSS px per graph unit',
    'uniform float uRes;       // canvas pixels per CSS px',
    'uniform float uH;         // canvas height in pixels',
    'uniform float uMax;       // how many times to square and add',
    'uniform float uSweep;     // the line is only drawn left of this x (CSS px)',
    'uniform float uGhost;     // how strongly the hole is cut',
    'uniform float uLineIn, uLineOut;',
    'uniform vec3 uSurface, uCut;',
    'void main() {',
    '  vec2 css = vec2(gl_FragCoord.x, uH - gl_FragCoord.y) / uRes;',
    '  vec2 c = uT + vec2(css.x - uP.x, uP.y - css.y) / uS;',
    '  float inside = 0.0, line = 0.0;',
    '  float q = (c.x - 0.25) * (c.x - 0.25) + c.y * c.y;',
    '  if (q * (q + (c.x - 0.25)) <= 0.25 * c.y * c.y || (c.x + 1.0) * (c.x + 1.0) + c.y * c.y <= 0.0625) {',
    '    inside = 1.0;                                  // the big round parts stay home, no need to count',
    '  } else {',
    '    vec2 z = vec2(0.0), dz = vec2(0.0);',
    '    float gone = 0.0;',
    '    for (int i = 0; i < ' + FRAG_MAX_ITER + '; i++) {',
    '      if (float(i) >= uMax) break;',
    '      // dz can grow huge; freeze it before it overflows (a huge dz just means "right on the edge")',
    '      if (dot(dz, dz) < 1.0e30) dz = 2.0 * vec2(z.x * dz.x - z.y * dz.y, z.x * dz.y + z.y * dz.x) + vec2(1.0, 0.0);',
    '      z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + c;',
    '      if (dot(z, z) > 1.0e5) { gone = 1.0; break; }',
    '    }',
    '    if (gone < 0.5) {',
    '      inside = 1.0;',
    '    } else {',
    '      float mz = length(z), md = length(dz);',
    '      float d = mz * log(mz) / md * uS;            // distance to the edge, in CSS px',
    '      line = 1.0 - smoothstep(uLineIn, uLineOut, d);',
    '    }',
    '  }',
    '  float aLine = line * step(css.x, uSweep);',
    '  float aHole = inside * uGhost;',
    '  gl_FragColor = vec4(uCut * aLine + uSurface * aHole * (1.0 - aLine), aLine + aHole * (1.0 - aLine));',
    '}'
  ].join('\n');

  function createFractal(cv) {
    var gl = null;
    try { gl = cv.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: false }); } catch (e) {}
    if (!gl) return null;
    var hp = gl.getShaderPrecisionFormat && gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT);
    if (!hp || !hp.precision) return null;                   // zooming needs high precision numbers

    function shader(type, src) {
      var s = gl.createShader(type);
      gl.shaderSource(s, src); gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { console.warn('shader:', gl.getShaderInfoLog(s)); return null; }
      return s;
    }
    var vs = shader(gl.VERTEX_SHADER, VERT), fs = shader(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return null;
    var prog = gl.createProgram();
    gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { console.warn('program:', gl.getProgramInfoLog(prog)); return null; }
    gl.useProgram(prog);

    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);   // one big triangle
    var loc = gl.getAttribLocation(prog, 'a');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    gl.disable(gl.BLEND);

    var u = {};
    ['uT', 'uP', 'uS', 'uRes', 'uH', 'uMax', 'uSweep', 'uGhost', 'uLineIn', 'uLineOut', 'uSurface', 'uCut']
      .forEach(function (n) { u[n] = gl.getUniformLocation(prog, n); });

    var f = { cv: cv, res: 1 };

    // A big screen would be slow to fill every frame, so cap the pixel count.
    f.resize = function (W, H, dpr) {
      f.res = Math.min(dpr, Math.sqrt(1.4e6 / (W * H)));
      cv.width = Math.max(1, Math.round(W * f.res)); cv.height = Math.max(1, Math.round(H * f.res));
    };
    f.draw = function (p) {
      var s = hexRGB(PAL.surface), c = hexRGB(PAL.cut);
      gl.viewport(0, 0, cv.width, cv.height);
      gl.uniform2f(u.uT, p.tx, p.ty);
      gl.uniform2f(u.uP, p.px, p.py);
      gl.uniform1f(u.uS, p.s);
      gl.uniform1f(u.uRes, f.res);
      gl.uniform1f(u.uH, cv.height);
      gl.uniform1f(u.uMax, p.maxIter);
      gl.uniform1f(u.uSweep, p.sweep);
      gl.uniform1f(u.uGhost, p.ghost);
      gl.uniform1f(u.uLineIn, p.lineIn);
      gl.uniform1f(u.uLineOut, p.lineOut);
      gl.uniform3f(u.uSurface, s[0] / 255, s[1] / 255, s[2] / 255);
      gl.uniform3f(u.uCut, c[0] / 255, c[1] / 255, c[2] / 255);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    return f;
  }

  /* ---------------------------------------------------------- the graph */

  function halo(g, text, x, y) {
    g.lineWidth = 3.5; g.lineJoin = 'round'; g.strokeStyle = PAL.surface; g.globalAlpha = 0.9;
    g.strokeText(text, x, y); g.globalAlpha = 1;
    g.fillText(text, x, y);
  }

  function drawGrid(g) {
    var v = view, x, y, i;
    g.lineWidth = 1; g.strokeStyle = PAL.grid;
    g.beginPath();
    for (x = Math.ceil(v.xmin); x <= Math.floor(v.xmax); x++) { if (!x) continue; i = Math.round(X(x)) + 0.5; g.moveTo(i, 0); g.lineTo(i, v.H); }
    for (y = Math.ceil(v.ymin); y <= Math.floor(v.ymax); y++) { if (!y) continue; i = Math.round(Y(y)) + 0.5; g.moveTo(0, i); g.lineTo(v.W, i); }
    g.stroke();

    // axes with little arrowheads
    var ox = X(0), oy = Y(0), A = 9;
    g.strokeStyle = PAL.axis; g.fillStyle = PAL.axis; g.lineWidth = 1.75;
    g.beginPath(); g.moveTo(0, oy); g.lineTo(v.W - 2, oy); g.moveTo(ox, v.H); g.lineTo(ox, 2); g.stroke();
    g.beginPath();
    g.moveTo(v.W - 1, oy); g.lineTo(v.W - 1 - A, oy - A / 2.2); g.lineTo(v.W - 1 - A, oy + A / 2.2);
    g.moveTo(ox, 1); g.lineTo(ox - A / 2.2, 1 + A); g.lineTo(ox + A / 2.2, 1 + A);
    g.fill();
  }

  // The numbers go on top of the cut line, so a line like y = 2 never hides its own label.
  function drawTicks(g) {
    var v = view, x, y, ox = X(0), oy = Y(0);
    g.font = '600 13px ' + PAL.sans;
    g.fillStyle = PAL.ink2;
    g.textAlign = 'center'; g.textBaseline = 'top';
    for (x = Math.ceil(v.xmin); x <= Math.floor(v.xmax); x++) { if (x) { g.fillStyle = PAL.ink2; halo(g, num(x), X(x), oy + 8); } }
    g.textAlign = 'right'; g.textBaseline = 'middle';
    for (y = Math.ceil(v.ymin); y <= Math.floor(v.ymax); y++) { if (y) { g.fillStyle = PAL.ink2; halo(g, num(y), ox - 9, Y(y)); } }
    g.textAlign = 'left'; g.textBaseline = 'top'; g.fillStyle = PAL.ink2; halo(g, '0', ox + 9, oy + 8);   // lower right: y = x never covers it

    g.font = 'italic 700 16px ' + PAL.sans;
    g.fillStyle = PAL.ink; g.textAlign = 'right'; g.textBaseline = 'bottom'; halo(g, 'x', v.W - 16, oy - 8);
    g.textAlign = 'left'; g.textBaseline = 'top'; halo(g, 'y', ox + 12, 12);
  }

  // Stroke a polyline (given in CSS px) only as far as fraction p of its length.
  function strokePartial(g, pts, p) {
    var total = 0, lens = [], i;
    for (i = 1; i < pts.length; i++) { var l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); lens.push(l); total += l; }
    var target = total * p, acc = 0;
    g.beginPath(); g.moveTo(pts[0][0], pts[0][1]);
    for (i = 1; i < pts.length; i++) {
      var len = lens[i - 1];
      if (acc + len <= target) { g.lineTo(pts[i][0], pts[i][1]); acc += len; continue; }
      var f = len ? (target - acc) / len : 0;
      g.lineTo(pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * f, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * f);
      break;
    }
    g.stroke();
  }

  function drawCurves(g, st, p) {
    if (p <= 0) return;
    g.lineCap = 'round'; g.lineJoin = 'round';
    if (st.mandel) {
      if (fractal || !isMandelReady()) return;       // with WebGL the shader draws the line
      var m = mandel;
      g.save();
      g.beginPath(); g.rect(m.left, m.top - 2, m.wCss * p + 1, m.hCss + 4); g.clip();     // sweep left to right
      g.drawImage(mandelLineCanvas(), m.left, m.top, m.wCss, m.hCss);
      g.restore();
      return;
    }
    var lines = st.curves(view).map(function (pl) { return pl.map(function (q) { return [X(q[0]), Y(q[1])]; }); });
    g.strokeStyle = PAL.surface; g.globalAlpha = 0.8; g.lineWidth = 8;       // a pale edge so the line reads on the leaves
    lines.forEach(function (pl) { strokePartial(g, pl, p); });
    g.globalAlpha = 1; g.strokeStyle = PAL.cut; g.lineWidth = 4;
    lines.forEach(function (pl) { strokePartial(g, pl, p); });
  }

  // "Z_2" or "Z_{2}" -> "Z₂" (canvas text has no <sub>)
  function subscript(name) {
    return name.replace(/_\{?(\d+)\}?/g, function (_, d) { return d.replace(/\d/g, function (c) { return '₀₁₂₃₄₅₆₇₈₉'.charAt(+c); }); });
  }

  function roundRect(g, x, y, w, h, r) {
    g.beginPath();
    g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r);
    g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath();
  }

  // age: ms since the point appeared; names: what to call it ("C", "Z_2"); pulse: ms since the last name was added
  function drawPoint(g, pt, age, names, pulse) {
    var px = X(pt[0]), py = Y(pt[1]);
    var k = reduceMotion ? 1 : clamp(age / POP_DUR, 0, 1);
    if (pulse === undefined) pulse = age;

    if (!reduceMotion && pulse < PULSE_DUR) {                                 // a ring that spreads out
      var q = pulse / PULSE_DUR;
      g.globalAlpha = (1 - q) * 0.55; g.strokeStyle = PAL.cut; g.lineWidth = 3;
      g.beginPath(); g.arc(px, py, 8 + 26 * easeInOut(q), 0, TAU); g.stroke();
      g.globalAlpha = 1;
    }
    var r = 8 * Math.max(0, easeOutBack(k));
    g.beginPath(); g.arc(px, py, r, 0, TAU);
    g.fillStyle = PAL.cut; g.fill();
    g.lineWidth = 3; g.strokeStyle = PAL.surface; g.stroke();

    // its coordinates
    var label = (names && names.length ? names.map(subscript).join(' = ') + ' = ' : '') + T.point(num(pt[0]), num(pt[1]));
    g.font = '650 14px ' + PAL.sans;
    var tw = g.measureText(label).width, bw = tw + 18, bh = 26, d = 14, dir = pt[2], bx, by;
    var dd = d * 0.72;
    if (dir === 'n')       { bx = px - bw / 2; by = py - d - bh; }
    else if (dir === 's')  { bx = px - bw / 2; by = py + d; }
    else if (dir === 'e')  { bx = px + d;      by = py - bh / 2; }
    else if (dir === 'w')  { bx = px - d - bw; by = py - bh / 2; }
    else if (dir === 'ne') { bx = px + dd;      by = py - dd - bh; }
    else if (dir === 'nw') { bx = px - dd - bw; by = py - dd - bh; }
    else if (dir === 'se') { bx = px + dd;      by = py + dd; }
    else                   { bx = px - dd - bw; by = py + dd; }
    bx = clamp(bx, 6, view.W - bw - 6); by = clamp(by, 6, view.H - bh - 6);
    g.globalAlpha = k;
    roundRect(g, bx, by, bw, bh, 13);
    g.fillStyle = PAL.surface; g.fill();
    g.lineWidth = 1.5; g.strokeStyle = PAL.cut; g.stroke();
    g.fillStyle = PAL.ink; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText(label, bx + bw / 2, by + bh / 2 + 0.5);
    g.globalAlpha = 1;
  }

  /* ---------------------------------------------------------- reading aloud
     Each page reads its title and text. On step 5 the zoom waits until the reading is done.
     German is spoken by Piper (a neural voice with a real German speaker, run in the browser in a
     worker thread, see tts-worker.js). Browsers rarely ship a good German voice of their own.
     English, and German if Piper cannot run, use the browser's built-in speech (Web Speech API).
     Where speech is missing, switched off, or blocked by the browser until the first click,
     "done" is estimated from how long the text takes to read, so the zoom still comes. */

  var READ_MS = 42;                                   // per character, for the estimate
  var voice = {
    ok: !!(window.speechSynthesis && window.SpeechSynthesisUtterance),     // the browser's own speech
    on: true, token: 0, keep: null, watch: 0, delay: 0, cueTimers: [], blocked: false, list: []
  };
  // (a new key: an old "off" saved by an earlier version must not keep the voice off)
  try { voice.on = localStorage.getItem('hedge-voice-v2') !== 'off'; } catch (e) {}
  var voiceBtn = $('#voicebtn'), voiceLabel = voiceBtn.querySelector('[data-i18n="voice"]'), closingEl = $('#closing');

  if (voice.ok) {
    var loadVoices = function () { voice.list = speechSynthesis.getVoices() || []; };
    loadVoices();
    if (speechSynthesis.addEventListener) speechSynthesis.addEventListener('voiceschanged', loadVoices);
    else speechSynthesis.onvoiceschanged = loadVoices;
  }

  /* --- Piper: the neural voice --- */

  var piper = { worker: null, state: 'idle', pct: 0, nextId: 1, wait: {}, cache: {}, audio: null };   // state: idle | loading | ready | failed

  function usesPiper() { return !!(T.piper && window.Worker && piper.state !== 'failed'); }
  function canSpeak() { return usesPiper() || voice.ok; }

  function paintVoiceLabel() {
    var loading = usesPiper() && piper.state === 'loading' && voice.on;
    voiceLabel.textContent = T.voice + (loading && piper.pct ? ' ' + piper.pct + ' %' : loading ? ' …' : '');
    voiceBtn.setAttribute('aria-busy', loading ? 'true' : 'false');
  }

  function piperFail(why) {
    piper.state = 'failed';
    if (piper.worker) { try { piper.worker.terminate(); } catch (e) {} piper.worker = null; }
    Object.keys(piper.wait).forEach(function (id) { piper.wait[id].reject(new Error(why)); });
    piper.wait = {};
    syncVoiceButton();
  }

  function piperSend(msg) {
    return new Promise(function (resolve, reject) {
      msg.id = piper.nextId++; msg.voiceId = T.piper;
      piper.wait[msg.id] = { resolve: resolve, reject: reject };
      piper.worker.postMessage(msg);
    });
  }

  // start the worker and the voice download (does nothing if it is running already)
  function piperStart() {
    if (!usesPiper() || piper.worker) return;
    try { piper.worker = new Worker('tts-worker.js', { type: 'module' }); } catch (e) { piperFail('no worker'); return; }
    piper.state = 'loading'; paintVoiceLabel();
    piper.worker.onerror = function () { piperFail('worker error'); };
    piper.worker.onmessage = function (ev) {
      var m = ev.data, w = piper.wait[m.id];
      if (m.type === 'progress') {
        if (m.total > 2e6) { piper.pct = Math.min(99, Math.floor(100 * m.loaded / m.total)); paintVoiceLabel(); }   // the big file is the voice
        return;
      }
      if (m.type === 'log') return;
      if (m.id === -1) {                                // a failure the library did not report properly
        Object.keys(piper.wait).forEach(function (id) { piper.wait[id].reject(new Error(m.message)); });
        piper.wait = {};
        return;
      }
      delete piper.wait[m.id];
      if (!w) return;
      if (m.type === 'error') w.reject(new Error(m.message)); else w.resolve(m);
    };
    piperSend({ type: 'load' }).then(function () { piper.state = 'ready'; piper.pct = 100; paintVoiceLabel(); }, function () { piperFail('load'); });
  }

  // the sound for one sentence, as a promise of an object URL (kept, so saying it twice costs nothing)
  function piperSound(text) {
    if (!piper.cache[text]) {
      piper.cache[text] = piperSend({ type: 'predict', text: text }).then(function (m) {
        return URL.createObjectURL(new Blob([m.buf], { type: 'audio/wav' }));
      });
      piper.cache[text].catch(function () { delete piper.cache[text]; });
    }
    return piper.cache[text];
  }

  // one audio element for everything, so a single click anywhere on the page can unlock it for good
  function piperAudio() {
    if (!piper.audio) piper.audio = new Audio();
    return piper.audio;
  }
  // a tenth of a second of silence, as a real WAV file (an empty one is refused by some browsers)
  var SILENCE = (function () {
    var n = 800, b = new Uint8Array(44 + n), v = new DataView(b.buffer);
    function tag(at, str) { for (var i = 0; i < 4; i++) b[at + i] = str.charCodeAt(i); }
    tag(0, 'RIFF'); v.setUint32(4, 36 + n, true); tag(8, 'WAVE');
    tag(12, 'fmt '); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
    v.setUint32(24, 8000, true); v.setUint32(28, 8000, true); v.setUint16(32, 1, true); v.setUint16(34, 8, true);
    tag(36, 'data'); v.setUint32(40, n, true);
    b.fill(128, 44);
    return URL.createObjectURL(new Blob([b], { type: 'audio/wav' }));
  })();
  function unlockAudio() {
    var a = piperAudio();
    if (a.dataset.unlocked) return;
    a.dataset.unlocked = '1';
    a.src = SILENCE;
    var p = a.play(); if (p && p.catch) p.catch(function () { a.dataset.unlocked = ''; });
  }

  // Can this page play sound before anyone has clicked? (After a refresh, browsers usually say no.)
  function probeAutoplay(cb) {
    if (navigator.userActivation && navigator.userActivation.hasBeenActive) { cb(true); return; }
    var a = piperAudio(), p;
    a.src = SILENCE;
    try { p = a.play(); } catch (e) { cb(false); return; }
    if (!p || !p.then) { cb(false); return; }
    p.then(function () { a.dataset.unlocked = '1'; cb(true); }, function () { cb(false); });
  }

  function speakPiper(parts, token, done, onCue) {
    var i = 0, audio = piperAudio();
    piperStart();
    function next() {
      if (token !== voice.token) return;
      if (i >= parts.length) { done(true); return; }
      var k = i++, part = parts[k], sound = piperSound(part.text);
      if (i < parts.length) piperSound(parts[i].text).catch(function () {});     // make the next sentence while this one plays
      sound.then(function (url) {
        if (token !== voice.token) return;
        audio.onended = function () { part.cues.forEach(function (c) { onCue(c.id); }); next(); };
        audio.onerror = function () { if (token === voice.token) done(false); };
        audio.src = url;
        var p = audio.play();
        if (p && p.then) p.then(function () {
          if (token !== voice.token) return;
          var ms = isFinite(audio.duration) && audio.duration > 0 ? audio.duration * 1000 : part.text.length * NATIVE_MS_PER_CHAR;
          cueTimers(part, ms, token, onCue);
        }, function (err) {
          if (token !== voice.token) return;
          if (err && err.name === 'NotAllowedError') voice.blocked = true;
          done(false);
        });
      }, function () {
        if (token !== voice.token) return;
        // Piper did not work: carry on with the browser's own voice (or just the estimate if it has none)
        piperFail('predict');
        if (voice.ok) speakNative(parts.slice(k), token, done, onCue); else done(false);
      });
    }
    next();
  }

  // A mention partway through a sentence is timed by its place in the sentence: halfway through the
  // letters is about halfway through the sound.
  var NATIVE_MS_PER_CHAR = 75;
  function cueTimers(part, ms, token, onCue, still) {
    var len = Math.max(1, part.text.length);
    part.cues.forEach(function (c) {
      voice.cueTimers.push(setTimeout(function () {
        if (token === voice.token && (!still || still())) onCue(c.id);
      }, ms * c.at / len));
    });
  }

  /* --- the browser's own voices --- */

  // The best installed voice that is native to the page language. A voice from another language is never
  // used (it would read German with an English accent). Within the language: the exact region first
  // (de-DE, en-GB), then the nicer-sounding voices (premium / neural / natural ones, Google's, Apple's Anna).
  function pickVoice() {
    if (voice.ok) { try { voice.list = speechSynthesis.getVoices() || voice.list; } catch (e) {} }
    var want = T.voiceLang.toLowerCase(), best = null, score = 0;
    voice.list.forEach(function (v) {
      var l = (v.lang || '').toLowerCase().replace('_', '-');
      if (l.slice(0, 2) !== want.slice(0, 2)) return;               // not this language: skip
      var s = 10 + (l === want ? 4 : 0) + (v.localService ? 1 : 0);
      var name = (v.name || '').toLowerCase();
      if (/premium|enhanced|neural|natural|wavenet/.test(name)) s += 3;
      if (/google|anna|petra|marlene|vicki|hans/.test(name)) s += 2;
      if (/multilingual/.test(name)) s -= 5;                        // a voice that speaks everything is native to nothing
      if (s > score) { score = s; best = v; }
    });
    return best;
  }

  function speakNative(parts, token, done, onCue) {
    var i = 0, chosen = null, tries = 0;
    function start() {
      if (token !== voice.token) return;
      chosen = pickVoice();
      // browsers load their voice list a moment after the page; give a voice of the right language up to ~1.5 s to show up
      if (!chosen && tries++ < 10) { voice.delay = setTimeout(start, 150); return; }
      next();
    }
    function next() {
      if (token !== voice.token) return;
      if (i >= parts.length) { done(true); return; }
      var part = parts[i++], u = new SpeechSynthesisUtterance(part.text), v = chosen, exact = false;
      u.lang = T.voiceLang; if (v) u.voice = v;
      u.rate = 0.92; u.pitch = 1.05;
      // voices that report each word say exactly when a point is mentioned; for the others, estimate it
      u.onstart = function () { cueTimers(part, part.text.length * NATIVE_MS_PER_CHAR, token, onCue, function () { return !exact; }); };
      u.onboundary = function (ev) {
        if (token !== voice.token) return;
        exact = true;
        part.cues.forEach(function (c) { if (c.at <= ev.charIndex + 1) onCue(c.id); });
      };
      u.onend = function () {
        if (token !== voice.token) return;
        part.cues.forEach(function (c) { onCue(c.id); });
        next();
      };
      u.onerror = function (ev) {
        if (token !== voice.token) return;
        var why = ev && ev.error;
        if (why === 'canceled' || why === 'interrupted') return;
        if (why === 'not-allowed') voice.blocked = true;
        done(false);
      };
      voice.keep = u;                                  // keep a reference, or it can be collected mid-sentence
      try { speechSynthesis.speak(u); } catch (e) { done(false); }
    }
    voice.delay = setTimeout(start, 60);              // cancel() then speak() straight away can swallow the speech
  }

  /* --- reading a page --- */

  // written maths -> words a speech engine says properly: "(0 | 1)" becomes "0 and 1", "Z_{x_{1}}" "Z x 1"
  function toSpeech(str) {
    var S = T.say;
    return str
      .replace(/\{#[^}]+\}/g, '')
      .replace(/[\[\]]/g, '')
      .replace(/_\{?/g, ' ').replace(/[{}]/g, '')
      .replace(/\(\s*(−?\d+)\s*[|,]\s*(−?\d+)\s*\)/g, '$1' + S.pair + '$2')
      .replace(/²/g, S.squared)
      .replace(/\s*=\s*/g, S.equals)
      .replace(/\s\+\s/g, S.plus)
      .replace(/\s*·\s*/g, S.times)
      .replace(/−/g, S.minus)
      .replace(/\s+/g, ' ')
      .replace(/^\s+|\s+$/g, '');
  }
  function sentences(str) { return (str.match(/[^.!?]+[.!?]*/g) || [str]).map(function (s) { return s.replace(/^\s+|\s+$/g, ''); }).filter(Boolean); }

  // What a page says, sentence by sentence: { text, cues: [{ at: letter position, id: point name }] }
  function speechParts(s) {
    var parts = [{ text: toSpeech(s.title) + '.', cues: [] }];
    sentences(s.text).forEach(function (raw) {
      var text = '', cues = [];
      raw.split(/(\{#[^}]+\})/).forEach(function (bit) {
        var m = /^\{#([^}]+)\}$/.exec(bit);
        if (m) { cues.push({ at: text.length + (text ? 1 : 0), id: m[1] }); return; }
        var t = toSpeech(bit);
        if (t) text += (text ? ' ' : '') + t;
      });
      if (text) parts.push({ text: text, cues: cues });
    });
    return parts;
  }

  // Without a voice, each point appears at the moment a reader would get to it.
  function estimateCues(a, s, t0) {
    var re = /\{#([^}]+)\}/g, m, skipped = 0;
    while ((m = re.exec(s.text))) {
      if (a.cueAt[m[1]] == null) a.cueAt[m[1]] = t0 + (s.title.length + m.index - skipped) * READ_MS;
      skipped += m[0].length;
    }
    requestFrame();
  }

  function stopVoice() {
    voice.token++;
    clearTimeout(voice.watch); clearTimeout(voice.delay);
    voice.cueTimers.forEach(clearTimeout); voice.cueTimers = [];
    if (piper.audio) { piper.audio.onended = null; piper.audio.onerror = null; try { piper.audio.pause(); } catch (e) {} }
    if (voice.ok) { try { speechSynthesis.cancel(); } catch (e) {} }
  }

  // one sentence at a time (long utterances get cut off by some browsers); done(true) only if all were spoken
  // parts: strings, or { text, cues } from speechParts; onCue(id) runs when point id is mentioned
  function speakParts(parts, done, onCue) {
    var token = voice.token;
    parts = parts.map(function (p) { return typeof p === 'string' ? { text: p, cues: [] } : p; });
    onCue = onCue || function () {};
    if (usesPiper()) speakPiper(parts, token, done, onCue);
    else if (voice.ok) speakNative(parts, token, done, onCue);
    else done(false);
  }

  function readTime() { var s = T.steps[step]; return (s.title.length + s.text.length) * READ_MS; }

  // Read this page's title and text. a.textDoneAt becomes the moment the reading is over.
  function narrate(a) {
    if (a.zoomT0 !== null) return;                     // the zoom is already running: nothing left to wait for
    stopVoice();
    a.textDoneAt = null;
    var s = T.steps[step], t0 = performance.now(), est = readTime();
    a.narrT0 = t0;
    function finish(spoken) {
      if (anim !== a || a.textDoneAt !== null) return;
      a.textDoneAt = spoken ? performance.now() : Math.max(performance.now(), t0 + est);
      if (!spoken) estimateCues(a, s, t0);            // any point the voice did not get to comes at reading pace
      requestFrame();
    }
    function cue(id) {
      if (anim !== a || a.cueAt[id] != null) return;
      a.cueAt[id] = performance.now();
      requestFrame();
    }
    if (!voice.on || !canSpeak()) { a.textDoneAt = t0 + est; estimateCues(a, s, t0); return; }
    var token = voice.token, download = usesPiper() && piper.state !== 'ready' ? 90000 : 0;   // the first visit fetches the voice
    voice.watch = setTimeout(function () { if (token === voice.token) finish(false); }, est * 2.2 + 6000 + download);
    speakParts(speechParts(s), finish, cue);
  }

  // the line said while we zoom in
  function sayClosing() {
    closingEl.textContent = T.closing; closingEl.hidden = false;
    if (voice.on && canSpeak()) { stopVoice(); speakParts([toSpeech(T.closing)], function () {}); }
  }

  // say it again (language switched, voice turned on, or the browser finally allowed speech)
  function retell() {
    if (!anim || anim.paused) return;
    if (anim.zoomT0 !== null) { if (anim.closingShown) sayClosing(); }
    else narrate(anim);
  }

  function syncVoiceButton() {
    voiceBtn.hidden = !canSpeak();
    voiceBtn.setAttribute('aria-pressed', voice.on ? 'true' : 'false');
    paintVoiceLabel();
  }

  /* ---------------------------------------------------------- the timeline */

  function startStep() {
    reduceMotion = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
    gate.hidden = true;
    anim = { t0: performance.now(), lineT0: null, zoomT0: null, textDoneAt: null, closingShown: false,
             paused: false, pausedAt: 0, done: false, cueAt: {} };
    hedgeShown = -1;
    syncPrevButton();
    // put the page back the way it was at the start (this is also what the reset button does)
    fractalCv.hidden = !(fractal && STEPS[step].mandel);
    zoomTag.hidden = true; zoomTag.textContent = '';
    closingEl.hidden = true; closingEl.textContent = '';
    graphCv.style.opacity = '';
    if (STEPS[step].mandel && !fractal) startMandel();
    narrate(anim);
    requestFrame();
  }

  // While a page is still animating, the back button is a pause button. Pausing freezes the picture
  // and stops the voice; after that (or once the animation is done) the button goes back a page.
  function prevIsPause() { return !!(anim && !anim.paused && !anim.done); }
  function pauseStep() {
    if (!prevIsPause()) return;
    anim.paused = true; anim.pausedAt = performance.now();
    stopVoice();
    syncPrevButton();
  }
  function syncPrevButton() {
    var pause = prevIsPause(), b = $('#prev');
    $('#prev-pause').hidden = !pause;
    $('#prev-back').hidden = pause;
    b.disabled = !pause && step === 0;
    if (pause) b.setAttribute('aria-label', T.pauseAria); else b.removeAttribute('aria-label');
  }
  // The first page waits, unmoving, until the start button is pressed (that press is what lets the sound play).
  var gate = $('#startgate');
  function holdForStart() {
    anim.paused = true; anim.pausedAt = anim.t0;
    stopVoice(); syncPrevButton(); requestFrame();
  }
  function back() { if (prevIsPause()) pauseStep(); else show(step - 1); }

  function easeSine(t) { return 0.5 - 0.5 * Math.cos(Math.PI * t); }

  // On a cued step a point appears with the first of its names to be spoken, and pulses again for each later one.
  function drawCuedPoint(g, pt, now) {
    var names = [], first = Infinity, last = -Infinity;
    for (var n = 0; n < pt[3].length; n++) {
      var t = anim.cueAt[pt[3][n]];
      if (t == null || t > now) continue;
      names.push(pt[3][n]); first = Math.min(first, t); last = Math.max(last, t);
    }
    if (names.length) drawPoint(g, pt, now - first, names, now - last);
  }
  function pointsSettled(st, now, e) {
    if (!st.cued) return e > POINT_FIRST + (POINTS - 1) * POINT_GAP + PULSE_DUR;
    return st.pts.every(function (pt) {
      return pt[3].every(function (id) { var t = anim.cueAt[id]; return t != null && now - t > PULSE_DUR; });
    });
  }

  function frame(now) {
    raf = 0;
    if (!view.W || !anim) return;
    if (anim.paused) now = anim.pausedAt;          // a paused page is redrawn (resize, theme) exactly as it was
    var st = STEPS[step];
    var gl = !!(st.mandel && fractal);
    var e = now - anim.t0;
    var ready = !st.mandel || gl || isMandelReady();

    // the line starts one gap after the 4th point (and, without WebGL on step 5, once the computer is done)
    if (anim.lineT0 === null && e >= LINE_AT && ready) {
      anim.lineT0 = Math.max(anim.t0 + LINE_AT, st.mandel && !gl ? mandel.readyAt : 0);
    }
    var lp = 0, cp = 0, zt = -1;                 // zt: ms since the zoom began, -1 while it hasn't
    if (anim.lineT0 !== null) {
      lp = reduceMotion ? 1 : clamp((now - anim.lineT0) / LINE_DUR, 0, 1);
      cp = reduceMotion ? 1 : clamp((now - anim.lineT0 - LINE_DUR) / CUT_DUR, 0, 1);
      // The zoom starts once the set has been whole for a second AND the text has been read out.
      if (gl && !reduceMotion) {
        if (anim.zoomT0 === null && anim.textDoneAt !== null) {
          var startAt = Math.max(anim.lineT0 + LINE_DUR + CUT_DUR + ZOOM_WAIT, anim.textDoneAt + TEXT_GAP);
          if (now >= startAt) anim.zoomT0 = startAt;
        }
        if (anim.zoomT0 !== null) zt = Math.max(-1, now - anim.zoomT0);
      }
    }
    if (zt > 0 && !anim.closingShown) { anim.closingShown = true; sayClosing(); }
    var zp = zt > 0 ? clamp(zt / ZOOM_DUR, 0, 1) : 0;
    var furniture = zt > 0 ? 1 - clamp(zt / FURNITURE_FADE, 0, 1) : 1;     // grid, numbers, points

    var u = easeSine(zp), Z = Math.exp(u * Math.log(ZOOM_MAX));
    var px = X(ZOOM_TARGET[0]), py = Y(ZOOM_TARGET[1]);         // where the target sits before any zooming
    var pvx = px + (view.cx - px) * u, pvy = py + (view.cy - py) * u;   // ...and where it has glided to (the middle)

    // the hedge zooms along with the set; before the zoom it is the ordinary, cached hedge
    if (gl && zt > 0) drawHedgeZoomed(Z, pvx, pvy);
    else drawHedge(Math.round(easeInOut(cp) * 200) / 200);

    if (gl) {
      fractal.draw({
        tx: ZOOM_TARGET[0], ty: ZOOM_TARGET[1],
        px: pvx, py: pvy,
        s: view.s * Z,
        maxIter: Math.min(FRAG_MAX_ITER, 250 + 55 * Math.log(Z) / Math.LN2),
        lineIn: LINE_IN * (1 - 0.6 * u), lineOut: LINE_OUT * (1 - 0.6 * u),   // a finer pen as the detail gets finer
        sweep: zt >= 0 ? 1e9 : X(MX0) + (X(MX1) - X(MX0)) * easeInOut(lp),
        ghost: GHOST * easeInOut(cp)
      });
      zoomTag.hidden = zt <= 0;
      if (zt > 0) {
        var label = fill(T.zoom, { n: Math.round(Z).toLocaleString(lang) });
        if (zoomTag.textContent !== label) zoomTag.textContent = label;
      }
    }

    var g = gctx, dpr = view.dpr;
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.clearRect(0, 0, view.W, view.H);
    if (furniture > 0) {
      graphCv.style.opacity = furniture < 1 ? furniture : '';
      drawGrid(g);
      drawCurves(g, st, easeInOut(lp));
      drawTicks(g);
      for (var i = 0; i < st.pts.length; i++) {
        if (st.cued) drawCuedPoint(g, st.pts[i], now);
        else {
          var age = e - (POINT_FIRST + i * POINT_GAP);
          if (age >= 0) drawPoint(g, st.pts[i], age);
        }
      }
    }

    var settled = lp >= 1 && cp >= 1 && pointsSettled(st, now, e) &&
                  (!gl || reduceMotion || zp >= 1);
    if (anim.done !== settled) { anim.done = settled; syncPrevButton(); }
    if (!anim.paused && !settled && (ready || e < LINE_AT)) requestFrame();   // (step 5 without WebGL wakes itself when the computer finishes)
  }

  /* ---------------------------------------------------------- the words */

  var slidesEl = $('#slides'), dotsEl = $('#dots');
  var metaDesc = $('meta[name="description"]');
  var firstShow = true;

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text) n.textContent = text;
    return n;
  }

  function fill(str, vars) {
    return str.replace(/\{(\w+)\}/g, function (_, k) { return vars[k]; });
  }

  // "a [b] c" -> a <span class="var">b</span> c   (picks out C, Z, x and y in a sentence)
  function richText(p, str) {
    str.replace(/\{#[^}]+\}/g, '').split(/(\[[^\]]+\])/).forEach(function (part) {
      if (!part) return;
      if (part.charAt(0) === '[') { var v = el('span', 'var'); appendTex(v, part.slice(1, -1)); p.appendChild(v); }
      else p.appendChild(document.createTextNode(part));
    });
    return p;
  }

  // subscripts written like LaTeX: "Z_{x_{1}}" -> Z<sub>x<sub>1</sub></sub>, "C_x" -> C<sub>x</sub>
  function appendTex(parent, tex) {
    var i = 0, plain = '';
    function flush() { if (plain) { parent.appendChild(document.createTextNode(plain)); plain = ''; } }
    while (i < tex.length) {
      if (tex.charAt(i) !== '_') { plain += tex.charAt(i++); continue; }
      flush();
      var inner, sub = document.createElement('sub');
      if (tex.charAt(i + 1) === '{') {
        var depth = 0, j = i + 1;
        for (; j < tex.length; j++) {
          if (tex.charAt(j) === '{') depth++;
          else if (tex.charAt(j) === '}' && --depth === 0) break;
        }
        inner = tex.slice(i + 2, j); i = j + 1;
      } else { inner = tex.charAt(i + 1); i += 2; }
      appendTex(sub, inner);
      parent.appendChild(sub);
    }
    flush();
  }

  function buildSlides() {
    slidesEl.textContent = '';
    T.steps.forEach(function (s, i) {
      var slide = el('div', 'slide');
      var row = el('div', 'titlerow');
      row.appendChild(el('h1', '', s.title));
      var eqs = el('p', 'eqs');
      STEPS[i].eq.forEach(function (q, k) {
        if (k) eqs.appendChild(el('span', 'and', T.and));
        eqs.appendChild(el('code', 'eq', q));
      });
      row.appendChild(eqs);
      slide.appendChild(row);
      slide.appendChild(richText(el('p', 'text'), s.text));
      slidesEl.appendChild(slide);
    });
  }

  function buildDots() {
    dotsEl.textContent = '';
    STEPS.forEach(function (_, i) {
      var li = document.createElement('li'), b = document.createElement('button');
      b.type = 'button';
      b.addEventListener('click', function () { show(i); });
      li.appendChild(b); dotsEl.appendChild(li);
    });
  }

  function applyLanguage() {
    T = TEXT[lang];
    root.lang = lang;
    document.title = T.docTitle;
    if (metaDesc) metaDesc.setAttribute('content', T.desc);
    $('#brand').textContent = T.brand;
    $('#langlabel').textContent = T.other;
    $('#langbtn').setAttribute('lang', T.otherCode);
    $('#pager').setAttribute('aria-label', T.pager);
    $('#themebtn').setAttribute('aria-label', T.themeAria);
    $('#resetbtn').setAttribute('aria-label', T.resetAria);
    $('#announce').textContent = '';          // don't leave the old language sitting in the live region
    var labels = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < labels.length; i++) labels[i].textContent = T[labels[i].getAttribute('data-i18n')];
    buildSlides();
    syncTheme();
    syncVoiceButton();
    if (voice.on) piperStart();    // fetch the German voice right away, so it is ready when the first page wants to talk
    syncStepText();
    layout();                      // the header may have changed height
    requestFrame();
  }

  function syncStepText() {
    var slides = slidesEl.children;
    for (var i = 0; i < slides.length; i++) slides[i].classList.toggle('on', i === step);
    $('#stepof').textContent = fill(T.stepOf, { n: step + 1, total: STEPS.length });
    syncPrevButton();
    $('#next').disabled = step === STEPS.length - 1;
    var dots = dotsEl.children;
    for (var d = 0; d < dots.length; d++) {
      var b = dots[d].firstChild;
      b.setAttribute('aria-label', fill(T.goTo, { n: d + 1 }));
      if (d === step) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current');
    }
    graphCv.setAttribute('aria-label', fill(T.graphAria, { eq: STEPS[step].eq.join(' ' + T.and + ' ') }));
  }

  function show(i) {
    if (i < 0 || i >= STEPS.length) return;
    step = i;
    syncStepText();
    if (!firstShow && !(voice.on && canSpeak())) {      // with the voice on, the page is read out already
      var s = T.steps[i];
      $('#announce').textContent = toSpeech(s.title) + '. ' + toSpeech(s.text);
    }
    firstShow = false;
    startStep();
  }

  /* ---------------------------------------------------------- controls */

  $('#prev').addEventListener('click', back);
  $('#next').addEventListener('click', function () { show(step + 1); });
  $('#resetbtn').addEventListener('click', startStep);
  $('#startbtn').addEventListener('click', startStep);       // the first click: unlocks the sound, starts the page        // replay this page's animation from the start
  $('#langbtn').addEventListener('click', function () {
    lang = lang === 'de' ? 'en' : 'de';
    try { localStorage.setItem('hedge-lang', lang); } catch (e) {}
    applyLanguage();
    retell();                      // read the page again, in the new language
  });
  voiceBtn.addEventListener('click', function () {
    voice.on = !voice.on;
    try { localStorage.setItem('hedge-voice-v2', voice.on ? 'on' : 'off'); } catch (e) {}
    syncVoiceButton();
    if (voice.on) { retell(); return; }
    stopVoice();
    // someone who switches the voice off reads on their own: the zoom waits for a normal reading time
    if (anim && anim.zoomT0 === null && anim.textDoneAt === null) { anim.textDoneAt = Math.max(performance.now(), anim.t0 + readTime()); requestFrame(); }
    if (anim) estimateCues(anim, T.steps[step], anim.narrT0 || anim.t0);
  });
  // browsers keep speech silent until the page has been clicked or typed on; when the first one comes, start reading
  ['click', 'keydown'].forEach(function (name) {
    document.addEventListener(name, function () {
      if (voice.on && usesPiper()) unlockAudio();           // a first click lets this page play sound for good
      if (voice.blocked && voice.on) { voice.blocked = false; retell(); }
    }, true);
  });
  document.addEventListener('keydown', function (ev) {
    if (ev.altKey || ev.ctrlKey || ev.metaKey || ev.shiftKey) return;
    if (ev.key === 'ArrowLeft') back();
    else if (ev.key === 'ArrowRight') show(step + 1);
  });

  /* ---------------------------------------------------------- light / dark */

  function effectiveTheme() {
    var t = root.getAttribute('data-theme');
    if (t) return t;
    return window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  function syncTheme() { $('#themelabel').textContent = effectiveTheme() === 'dark' ? T.toLight : T.toDark; }
  function repaintForTheme() {
    readPalette();
    syncTheme();
    if (view.W) { paintHedge(); hedgeShown = -1; requestFrame(); }
  }
  (function () {
    var stored; try { stored = localStorage.getItem('mx-theme'); } catch (e) {}
    if (stored) root.setAttribute('data-theme', stored);
    $('#themebtn').addEventListener('click', function () {
      var next = effectiveTheme() === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('mx-theme', next); } catch (e) {}
      repaintForTheme();
    });
    if (window.matchMedia) {
      var mq = matchMedia('(prefers-color-scheme: dark)');
      var onChange = function () { if (!root.getAttribute('data-theme')) repaintForTheme(); };
      if (mq.addEventListener) mq.addEventListener('change', onChange); else if (mq.addListener) mq.addListener(onChange);
    }
  })();

  /* ---------------------------------------------------------- go */

  readPalette();
  fractal = createFractal(fractalCv);
  fractalCv.addEventListener('webglcontextlost', function (ev) {      // rare: fall back to the canvas version
    ev.preventDefault();
    fractal = null; fractalCv.hidden = true;
    hedgeShown = -1;
    if (STEPS[step].mandel) startMandel();
    requestFrame();
  });
  buildDots();
  buildSlides();
  syncTheme();
  if (window.ResizeObserver) new ResizeObserver(layout).observe(stage);
  window.addEventListener('resize', layout);
  layout();
  applyLanguage();                 // sets the document language and text
  show(0);
  if (voice.on && canSpeak()) {
    holdForStart();
    probeAutoplay(function (ok) {
      if (!anim.paused || anim.pausedAt !== anim.t0) return;       // someone already started or moved on
      if (ok) startStep(); else { gate.hidden = false; $('#startbtn').focus(); }
    });
  }
})();
