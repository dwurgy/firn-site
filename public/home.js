/* Firn home page ("Frost", with "ClearScroll"): the soft spot where the
   frost clears, the snow, and telling an iPhone or iPad from a Mac. The
   design's script (design/frost/pages/clear-scroll.dc.html) as plain
   JavaScript, with its numbers. Nothing here stores or sends anything: the
   pointer position only moves the soft spot on this page. */
(function () {
  'use strict';

  /* ===== THE APP STORE LINK GOES HERE =====
     When Firn for iPhone and iPad is on the App Store, paste its full
     address between the quotes (it must start with https://). iPhones and
     iPads then get a "Download" pill that opens it. While it is empty they
     see "Firn is on the Mac today. iPhone and iPad are on the way." */
  var APP_STORE_URL = 'https://apps.apple.com/us/app/firn-browser/id6829053602';

  /* Approved values (design/frost/README.md) */
  var DENSITY = 0.3;
  var LINGER_MS = 1400;   /* the spot frosts back this long after the pointer stops */

  var main = document.getElementById('page');
  var canvas = document.getElementById('snow');
  var strip = document.getElementById('strip');
  var spot = document.getElementById('spot');
  var sharp = document.getElementById('sharp');
  if (!main || !canvas || !strip || !spot || !sharp) return;

  /* --- iPhone or iPad? (iPads say they are Macs, but have a touch screen) --- */
  var ios = /iPhone|iPad|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  /* --- iPhone Safari: the page gets extra sky above and below (home.css
         .tuck) and starts scrolled down by the top part, so the sky reaches
         behind the clock and the home bar like scrolled content. --- */
  var tuck = /iPhone|iPod/.test(navigator.userAgent);
  function tuckTop() { return tuck ? parseFloat(getComputedStyle(main).getPropertyValue('--top')) || 0 : 0; }
  function tuckScroll() { if (tuck) window.scrollTo(0, tuckTop()); }
  if (tuck) {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    document.documentElement.classList.add('tuck');
    tuckScroll();
    window.addEventListener('load', tuckScroll);
    window.addEventListener('pageshow', tuckScroll);
  }

  if (ios && document.getElementById('get-mac')) {   /* the 404 page has no download */
    var store = APP_STORE_URL.trim();
    document.getElementById('get-mac').hidden = true;
    if (/^https:\/\//.test(store)) {
      document.getElementById('app-store-link').href = store;
      document.getElementById('get-ios').hidden = false;
      if (!/iPhone|iPod/.test(navigator.userAgent))   /* an iPad */
        document.getElementById('ios-needs').textContent = 'On the App Store. Needs iPadOS 26 or later.';
    } else {
      document.getElementById('get-soon').hidden = false;
    }
  }

  var ctx = canvas.getContext('2d');
  var darkMq = matchMedia('(prefers-color-scheme: dark)');
  var stillMq = matchMedia('(prefers-reduced-motion: reduce)');

  /* The spot: its centre (sx, sy), how clear it is (f, 0 to 1), and where
     and when the pointer last was (px, py, pt). Kept across restarts. */
  var sx = null, sy = null, f = 0, px = null, py = null, pt = -1e9;
  var born = performance.now();

  function start() {
    var dark = darkMq.matches;
    var still = stillMq.matches;
    var rgb = dark ? '233,227,218' : '255,255,255';

    /* Three soft dots: tiny and sharp, medium, large and very blurred */
    function sprite(soft) {
      var s = document.createElement('canvas'); s.width = s.height = 64;
      var g = s.getContext('2d'); var gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
      gr.addColorStop(0, 'rgba(' + rgb + ',1)');
      gr.addColorStop(1 - soft, 'rgba(' + rgb + ',1)');
      gr.addColorStop(1, 'rgba(' + rgb + ',0)');
      g.fillStyle = gr; g.fillRect(0, 0, 64, 64); return s;
    }
    var sprites = [sprite(0.55), sprite(0.8), sprite(0.98)];
    var W = 0, H = 0, lift = 0, CR = 0, flakes = [], raf = 0, ro = null, timer = 0;
    var shown = { x: NaN, y: NaN, f: NaN };

    function make(anywhere) {
      var k = Math.random(); var layer = k < 0.6 ? 0 : k < 0.9 ? 1 : 2;
      var r = layer === 0 ? 1 + Math.random() * 1.4 : layer === 1 ? 2.5 + Math.random() * 3 : 9 + Math.random() * 16;
      return {
        layer: layer, r: r, x: Math.random() * W, y: anywhere ? Math.random() * H : -r * 2,
        v: (layer === 0 ? 9 : layer === 1 ? 18 : 34) * (0.7 + Math.random() * 0.6),
        a: (layer === 0 ? 0.75 : layer === 1 ? 0.5 : 0.2) * (dark ? 0.55 : 1) * (0.6 + Math.random() * 0.4),
        ph: Math.random() * 6.28, f: 0.15 + Math.random() * 0.25, amp: 6 + Math.random() * 14 * (layer + 1)
      };
    }
    /* The centre of the flake in the logo: where the spot clears on arrival */
    function flake() {
      var lw = Math.min(W * 1.04, 1560), lh = lw * 2595.2 / 5353;
      return { x: (W - lw) / 2 - lw * 0.025 + lw * 0.2417, y: H / 2 - lift + lh * 0.0068 };
    }
    /* Show the spot: the window slides to it and the sharp page inside slides
       the other way. Only writes when something changed. */
    function place() {
      if (!(Math.abs(sx - shown.x) <= 0.05 && Math.abs(sy - shown.y) <= 0.05)) {
        shown.x = sx; shown.y = sy;
        spot.style.transform = 'translate3d(' + (sx - CR).toFixed(2) + 'px,' + (sy - CR).toFixed(2) + 'px,0)';
        sharp.style.transform = 'translate3d(' + (CR - sx).toFixed(2) + 'px,' + (CR - sy).toFixed(2) + 'px,0)';
      }
      if (!(Math.abs(f - shown.f) <= 0.002)) { shown.f = f; spot.style.opacity = f.toFixed(3); }
    }
    function draw(t) {
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < flakes.length; i++) {
        var p = flakes[i];
        var x = p.x + Math.sin(t * p.f + p.ph) * p.amp;
        ctx.globalAlpha = p.a;
        ctx.drawImage(sprites[p.layer], x - p.r, p.y - p.r, p.r * 2, p.r * 2);
      }
    }
    function size() {
      var w = canvas.clientWidth, h = canvas.clientHeight;
      /* the logo sits centred in the open space above the strip (on iPhone,
         below the extra sky at the top) */
      lift = (h - strip.offsetTop - tuckTop()) / 2;
      tuckScroll();
      main.style.setProperty('--lift', lift.toFixed(1) + 'px');
      if (w !== W || h !== H) {
        W = w; H = h;
        sharp.style.width = W + 'px'; sharp.style.height = H + 'px';
        CR = Math.min(220, Math.max(130, W * 0.13));
        spot.style.width = spot.style.height = (CR * 2) + 'px';
        shown.x = NaN;
        var dpr = W * H > 2000000 ? 1 : Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        var n = Math.min(160, Math.round(W * H / 16000 * DENSITY));
        flakes = []; for (var i = 0; i < n; i++) flakes.push(make(true));
      }
      if (sx === null) { var fl = flake(); sx = fl.x; sy = fl.y; }
      place();
      if (still) draw(0);
    }
    /* Each frame: about a second after arrival the spot clears once over the
       flake, then settles back. After that it clears where the pointer is,
       trails it slowly, and frosts back 1.4 s after the pointer stops. */
    function clearing(now, dt) {
      var t = now - born, gx, gy, goal = 0;
      if (px === null) {
        var fl = flake(); gx = fl.x; gy = fl.y;
        if (t > 1000 && t < 3600) goal = 1;
      } else {
        gx = px; gy = py;
        if (now - pt < LINGER_MS) goal = 1;
      }
      var k = 1 - Math.exp(-dt * 2.2);
      sx += (gx - sx) * k; sy += (gy - sy) * k;
      f += (goal - f) * (1 - Math.exp(-dt * (goal > f ? 1.8 : 0.7)));
      place();
    }
    function move(e) {
      if (e.target.closest && e.target.closest('.strip a')) return;
      /* browsers send a still "move" when the page loads under a resting cursor */
      if (e.type === 'pointermove' && e.pointerType === 'mouse' && !e.movementX && !e.movementY) return;
      var r = main.getBoundingClientRect();
      px = e.clientX - r.left; py = e.clientY - r.top; pt = performance.now();
      if (still) {
        /* Reduce Motion: the spot clears and frosts back at once, no motion */
        sx = px; sy = py; f = 1; place();
        clearTimeout(timer);
        timer = setTimeout(function () { f = 0; place(); }, LINGER_MS);
      }
    }

    size();
    if (window.ResizeObserver) { ro = new ResizeObserver(size); ro.observe(canvas); ro.observe(strip); }
    else window.addEventListener('resize', size);

    main.addEventListener('pointermove', move);
    main.addEventListener('pointerdown', move);
    /* Reduce Motion: the snow is drawn once, and nothing clears on arrival */
    if (still) { f = 0; place(); }
    else {
      var last = performance.now();
      var tick = function (now) {
        var dt = Math.min(0.05, (now - last) / 1000); last = now;
        clearing(now, dt);
        for (var i = 0; i < flakes.length; i++) {
          var p = flakes[i]; p.y += p.v * dt; p.x += 3 * dt;
          if (p.y - p.r > H) flakes[i] = make(false);
        }
        draw(now / 1000);
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }

    return function stop() {
      cancelAnimationFrame(raf); clearTimeout(timer);
      if (ro) ro.disconnect(); else window.removeEventListener('resize', size);
      main.removeEventListener('pointermove', move);
      main.removeEventListener('pointerdown', move);
    };
  }

  var stop = start();
  /* If the visitor switches dark mode or Reduce Motion while the page is open */
  function restart() { stop(); stop = start(); }
  [darkMq, stillMq].forEach(function (mq) {
    if (mq.addEventListener) mq.addEventListener('change', restart);
  });
})();
