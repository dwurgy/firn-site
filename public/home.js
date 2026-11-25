/* Firn home page ("Frost"): the lens, the snow, and telling an iPhone or
   iPad from a Mac. The design's script (design/frost/pages/home.dc.html) as
   plain JavaScript, with its numbers. Nothing here stores or sends anything:
   the pointer position only moves the lens on this page. */
(function () {
  'use strict';

  /* ===== THE APP STORE LINK GOES HERE =====
     When Firn for iPhone and iPad is on the App Store, paste its full
     address between the quotes (it must start with https://). iPhones and
     iPads then get a "Download" pill that opens it. While it is empty they
     see "Firn is on the Mac today. iPhone and iPad are on the way." */
  var APP_STORE_URL = '';

  /* Approved values (design/frost/README.md). Magnify (0.35) and edge light
     (0.7) live in home.css as --z and --e. */
  var LENS_SPEED = 0.8;
  var DENSITY = 0.3;
  var IDLE_MS = 5000;

  var main = document.getElementById('page');
  var canvas = document.getElementById('snow');
  var strip = document.getElementById('strip');
  var mirror = document.getElementById('mirror');
  if (!main || !canvas || !strip || !mirror) return;

  /* --- iPhone or iPad? (iPads say they are Macs, but have a touch screen) --- */
  var ios = /iPhone|iPad|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  if (ios) {
    var store = APP_STORE_URL.trim();
    document.getElementById('get-mac').hidden = true;
    if (/^https:\/\//.test(store)) {
      document.getElementById('app-store-link').href = store;
      document.getElementById('get-ios').hidden = false;
    } else {
      document.getElementById('get-soon').hidden = false;
    }
  }

  /* --- A copy of the strip inside the lens, so text under it is sharp and
         magnified too. The copy can't be clicked, focused, or read aloud. --- */
  var copy = strip.cloneNode(true);
  copy.removeAttribute('id');
  Array.prototype.forEach.call(copy.querySelectorAll('[id]'), function (el) { el.removeAttribute('id'); });
  mirror.replaceChildren(copy);

  var ctx = canvas.getContext('2d');
  var darkMq = matchMedia('(prefers-color-scheme: dark)');
  var stillMq = matchMedia('(prefers-reduced-motion: reduce)');

  /* The lens's centre, speed, and where the pointer last was */
  var cx = null, cy = null, vx = 0, vy = 0, tx = null, ty = null, moved = -1e9;
  var t0 = performance.now() / 1000;
  var ph = Math.asin(0.085 / 0.38);

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
    var W = 0, H = 0, lift = 0, flakes = [], raf = 0, ro = null;

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
    function logo() {
      var lw = Math.min(W * 1.04, 1560);
      return { x: (W - lw) / 2 - lw * 0.025, w: lw, h: lw * 2595.2 / 5353 };
    }
    /* Where the lens rests: on the name */
    function rest() { var L = logo(); return { x: L.x + L.w * 0.585, y: H / 2 - lift }; }
    function place() {
      main.style.setProperty('--lx', cx.toFixed(1) + 'px');
      main.style.setProperty('--ly', cy.toFixed(1) + 'px');
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
      /* the logo sits centred in the open space above the strip */
      lift = (h - strip.offsetTop) / 2;
      main.style.setProperty('--lift', lift.toFixed(1) + 'px');
      if (w !== W || h !== H) {
        W = w; H = h;
        var dpr = W * H > 2000000 ? 1 : Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        var n = Math.min(160, Math.round(W * H / 16000 * DENSITY));
        flakes = []; for (var i = 0; i < n; i++) flakes.push(make(true));
      }
      if (still || cx === null) { var r0 = rest(); cx = r0.x; cy = r0.y; vx = vy = 0; place(); }
      if (still) draw(0);
    }
    function lens(now, dt) {
      var t = now / 1000 - t0; var L = logo(); var gx = tx, gy = ty;
      if (now - moved > IDLE_MS || gx === null) {
        /* left alone: drift along the name */
        gx = L.x + L.w * (0.5 + 0.38 * Math.sin(t * 0.11 + ph));
        gy = H / 2 - lift + L.h * 0.1 * Math.sin(t * 0.17);
      }
      var max = Math.max(W * 0.13, 120) * LENS_SPEED;
      var wx = (gx - cx) * 2, wy = (gy - cy) * 2;
      var wl = Math.hypot(wx, wy); if (wl > max) { wx *= max / wl; wy *= max / wl; }
      var ease = 1 - Math.exp(-dt * 3);
      vx += (wx - vx) * ease; vy += (wy - vy) * ease;
      cx += vx * dt; cy += vy * dt;
      place();
    }
    function move(e) {
      var r = main.getBoundingClientRect();
      tx = e.clientX - r.left; ty = e.clientY - r.top; moved = performance.now();
    }

    size();
    if (window.ResizeObserver) { ro = new ResizeObserver(size); ro.observe(canvas); ro.observe(strip); }
    else window.addEventListener('resize', size);

    /* Reduce Motion: the snow is drawn once and the lens stays on the name */
    if (!still) {
      main.addEventListener('pointermove', move);
      main.addEventListener('pointerdown', move);
      var last = performance.now();
      var tick = function (now) {
        var dt = Math.min(0.05, (now - last) / 1000); last = now;
        lens(now, dt);
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
      cancelAnimationFrame(raf);
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
