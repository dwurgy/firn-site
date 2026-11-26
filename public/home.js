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
  main.classList.add('live');   /* home.css: touches move the spot, not the page */
  var soft = main.querySelector('.soft');
  var sharpSky = document.getElementById('sharp-sky');
  /* Up close (home only; the 404 has none of these) */
  var up = document.getElementById('up-close');
  var logoLink = document.getElementById('logo-link');
  var longsky = document.getElementById('longsky');
  var upLogo = document.getElementById('up-logo');
  var spacer = document.getElementById('up-spacer');
  var hero = document.getElementById('up-hero');
  var rest = document.getElementById('up-rest');
  var backHome = document.getElementById('back-home');
  var scroll = !!(up && logoLink && longsky && upLogo && spacer && hero && rest && backHome);
  function each(sel, fn) { Array.prototype.forEach.call(document.querySelectorAll(sel), fn); }

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

  /* Both pills (the strip's and the scroll's) swap; the 404 has none */
  if (ios && document.querySelector('.get-mac')) {
    var store = APP_STORE_URL.trim();
    each('.get-mac', function (el) { el.hidden = true; });
    if (/^https:\/\//.test(store)) {
      each('.app-store-link', function (a) { a.href = store; });
      each('.get-ios', function (el) { el.hidden = false; });
      if (!/iPhone|iPod/.test(navigator.userAgent))   /* an iPad */
        each('.ios-needs', function (el) { el.textContent = 'On the App Store. Needs iPadOS 26 or later.'; });
    } else {
      each('.get-soon', function (el) { el.hidden = false; });
    }
  }

  /* The scroll goes inside the page, over it (home.css .page > .up). Its
     pictures start loading once the visitor points, taps, or tabs. */
  if (scroll) {
    main.appendChild(up);
    var ready = function () {
      main.classList.add('ready');
      ['pointermove', 'pointerdown', 'focusin'].forEach(function (t) { main.removeEventListener(t, ready); });
    };
    ['pointermove', 'pointerdown', 'focusin'].forEach(function (t) { main.addEventListener(t, ready); });
  }

  var ctx = canvas.getContext('2d');
  var darkMq = matchMedia('(prefers-color-scheme: dark)');
  var stillMq = matchMedia('(prefers-reduced-motion: reduce)');

  /* The spot: its centre (sx, sy), how clear it is (f, 0 to 1), and where
     and when the pointer last was (px, py, pt). Kept across restarts. */
  var sx = null, sy = null, f = 0, px = null, py = null, pt = -1e9;
  var born = performance.now();
  /* Up close: open or not, the running clearing or closing, where it opened */
  var opened = false, melt = 0, openAt = null;
  /* When the scroll last moved: the snow holds still while it does */
  var scrolled = -1e9;

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
      main.style.setProperty('--pw', w + 'px'); main.style.setProperty('--ph', h + 'px');
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
      if (opened) { spacer.style.height = Math.round(H * 0.72) + 'px'; fitSky(); }
      else place();
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
      if (opened || (e.target.closest && e.target.closest('.strip a, .up'))) return;
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

    /* ----- Up close ----- */
    /* The spot at any size: the window is 2 x cr square, soft from ci% out;
       dy lifts the sharp logo inside it as the scroll moves. */
    function setSpot(cr, ci, fo, x, y, dy) {
      spot.style.width = spot.style.height = (cr * 2).toFixed(1) + 'px';
      spot.style.setProperty('--ci', ci.toFixed(1) + '%');
      spot.style.transform = 'translate3d(' + (x - cr).toFixed(1) + 'px,' + (y - cr).toFixed(1) + 'px,0)';
      sharp.style.transform = 'translate3d(' + (cr - x).toFixed(1) + 'px,' + (cr - y - dy).toFixed(1) + 'px,0)';
      /* only the logo rises with the scroll: the sky stays put, or its bottom
         edge shows as a line across the screen while the scroll glides home */
      sharpSky.style.transform = dy ? 'translate3d(0,' + dy.toFixed(1) + 'px,0)' : '';
      spot.style.opacity = fo.toFixed(3);
      shown.x = shown.f = NaN;
    }
    /* The same soft spot takes the strip's words with it */
    function maskStrip(cr, ci, x, y) {
      var m = 'radial-gradient(circle ' + Math.max(1, cr).toFixed(1) + 'px at ' + (x - strip.offsetLeft).toFixed(1) + 'px ' +
        (y - strip.offsetTop).toFixed(1) + 'px, transparent ' + ci.toFixed(1) + '%, #000 100%)';
      strip.style.webkitMaskImage = m; strip.style.maskImage = m;
    }
    /* The long sky is as tall as the scroll. --travel is how far it moves. */
    var skyH = -1, skyTravel = -1;
    function fitSky() {
      var h = up.scrollHeight, tr = Math.max(0, h - up.clientHeight);
      if (h !== skyH) { skyH = h; longsky.style.height = h + 'px'; }
      if (tr !== skyTravel) { skyTravel = tr; longsky.style.setProperty('--travel', tr + 'px'); }
    }
    /* Where the browser can (home.css, "scroll-linked"), the long sky moves
       with the scroll on its own, off the main thread. Elsewhere this does. */
    var linked = !!(window.CSS && CSS.supports && CSS.supports('timeline-scope', '--up') &&
      CSS.supports('animation-timeline', '--up'));
    if (linked) main.classList.add('linked');
    function onUpScroll() {
      scrolled = performance.now();
      fitSky();
      if (!linked) longsky.style.transform = 'translate3d(0,' + (-up.scrollTop) + 'px,0)';
    }
    /* Open: the spot grows from where it is until the frost is gone (1.2 s,
       ease-out), the sky becomes the long one, and the opener rises */
    function enter() {
      opened = true;
      main.classList.add('ready', 'open');
      strip.setAttribute('inert', ''); logoLink.setAttribute('inert', '');
      spacer.style.height = Math.round(H * 0.72) + 'px';
      up.scrollTop = 0; up.style.opacity = '';
      fitSky();
      up.addEventListener('scroll', onUpScroll, { passive: true });
      up.focus({ preventScroll: true });
      /* the sharp logo now lives in the scroll, so it scrolls away natively */
      function settle() {
        soft.style.opacity = '0'; sharpSky.style.opacity = '0'; longsky.style.opacity = '1';
        strip.style.visibility = 'hidden';
        upLogo.style.visibility = 'visible'; spot.style.opacity = '0'; shown.f = NaN;
      }
      var ox = sx, oy = sy; openAt = { x: ox, y: oy };
      if (still) { settle(); return; }
      var far = Math.hypot(Math.max(ox, W - ox), Math.max(oy, H - oy));
      var cr0 = CR, ci0 = 22, f0 = f, crEnd = far * 1.25, ciEnd = 78;
      var t0 = performance.now(), dur = 1200;
      function grow(now) {
        var k = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - k, 3);
        var cr = cr0 + (crEnd - cr0) * e, ci = ci0 + (ciEnd - ci0) * e;
        f = f0 + (1 - f0) * Math.min(1, e * 1.6);
        setSpot(cr, ci, f, ox, oy, 0);
        maskStrip(cr, ci, ox, oy);
        /* as the spot finishes, the sky settles to the new, longer page */
        var late = Math.max(0, Math.min(1, (k - 0.55) / 0.45)), l = late * late * (3 - 2 * late);
        soft.style.opacity = (0.85 * (1 - l)).toFixed(3); sharpSky.style.opacity = (1 - l).toFixed(3);
        longsky.style.opacity = l.toFixed(3);
        if (k < 1) melt = requestAnimationFrame(grow); else settle();
      }
      melt = requestAnimationFrame(grow);
      /* the opener rises from below and stops half in view: there is more below */
      var from = { opacity: 0, transform: 'translateY(' + Math.round(H * 0.35) + 'px)' }, to = { opacity: 1, transform: 'none' };
      if (hero.animate) {
        hero.animate([from, to], { duration: 1300, delay: 650, easing: 'cubic-bezier(.16,.8,.24,1)', fill: 'backwards' });
        rest.animate([from, to], { duration: 1300, delay: 800, easing: 'cubic-bezier(.16,.8,.24,1)', fill: 'backwards' });
      }
    }
    /* Back home: the scroll glides to the top as its rows fade, then the
       frost closes back in toward where it opened, the mirror of opening */
    function leave() {
      cancelAnimationFrame(melt); pt = -1e9;
      var at = openAt || { x: W / 2, y: H / 2 };
      var y0 = up.scrollTop;
      function finish() {
        up.removeEventListener('scroll', onUpScroll);
        longsky.style.transform = ''; soft.style.transform = ''; sharpSky.style.transform = '';
        strip.style.webkitMaskImage = strip.style.maskImage = ''; strip.style.visibility = '';
        strip.removeAttribute('inert'); logoLink.removeAttribute('inert');
        soft.style.opacity = ''; sharpSky.style.opacity = ''; longsky.style.opacity = ''; up.style.opacity = '';
        upLogo.style.visibility = '';
        main.classList.remove('open'); opened = false; up.scrollTop = 0;
        f = 0; sx = at.x; sy = at.y;
        spot.style.removeProperty('--ci'); spot.style.width = spot.style.height = (CR * 2) + 'px';
        place();
        if (up.contains(document.activeElement) || document.activeElement === document.body) logoLink.focus({ preventScroll: true });
      }
      if (still) { finish(); return; }
      var far = Math.hypot(Math.max(at.x, W - at.x), Math.max(at.y, H - at.y));
      var crTop = far * 1.25, ciTop = 78, crLow = 0, ciLow = 22;
      var upDur = y0 > 0 ? Math.min(1100, 500 + y0 * 0.12) : 0;
      function inout(k) { return k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2; }
      var t0 = performance.now(), frost = 1500;
      /* the spot takes the sharp logo back from the scroll, in the same place */
      setSpot(crTop, ciTop, 1, at.x, at.y, y0);
      upLogo.style.visibility = '';
      strip.style.visibility = '';
      function step(now) {
        var t = now - t0;
        var ku = upDur ? Math.min(1, t / upDur) : 1, y = y0 * (1 - inout(ku));
        if (upDur) { up.scrollTop = y; onUpScroll(); }
        up.style.opacity = (1 - Math.min(1, t / Math.max(400, upDur * 0.8))).toFixed(3);
        var kf = Math.max(0, Math.min(1, (t - upDur * 0.6) / frost)), e = inout(kf);
        var cr = crTop + (crLow - crTop) * e, ci = ciTop + (ciLow - ciTop) * e;
        setSpot(Math.max(0, cr), ci, 1, at.x, at.y, y);
        soft.style.transform = y ? 'translate3d(0,' + (-y).toFixed(1) + 'px,0)' : '';
        maskStrip(cr, ci, at.x, at.y);
        var early = Math.min(1, kf / 0.4), l = early * early * (3 - 2 * early);
        soft.style.opacity = (0.85 * l).toFixed(3); sharpSky.style.opacity = l.toFixed(3);
        longsky.style.opacity = (1 - l).toFixed(3);
        if (kf < 1) melt = requestAnimationFrame(step); else finish();
      }
      melt = requestAnimationFrame(step);
    }
    /* The logo opens the scroll on a click. On a touch screen a press
       anywhere above the strip (the logo and the sky, not the links or the
       pill) opens it the moment the finger lifts, after a tap, a hold, or a
       drag, clearing from where the finger was. */
    var touch = false, touched = -1e9, going = false;
    function go() {
      if (going || opened) return;
      going = true; main.classList.add('ready');
      requestAnimationFrame(function () { going = false; enter(); });
    }
    function press(e) {
      touch = e.pointerType === 'touch' && !opened && !(e.target.closest && e.target.closest('.strip, .up')) &&
        e.clientY < strip.getBoundingClientRect().top;
    }
    function release(e) {
      if (!touch || e.pointerType !== 'touch') return;
      touch = false; touched = performance.now();
      if (px !== null) { sx = px; sy = py; }
      go();
    }
    function open(e) {
      e.preventDefault();
      /* the click a touch makes after lifting: the lift has already decided */
      if (performance.now() - touched < 1000) return;
      go();
    }
    function noMenu(e) { e.preventDefault(); }
    function back(e) { e.preventDefault(); if (opened) leave(); }
    if (scroll) {
      main.addEventListener('pointerdown', press);
      main.addEventListener('pointerup', release);
      logoLink.addEventListener('contextmenu', noMenu);
      logoLink.addEventListener('click', open);
      backHome.addEventListener('click', back);
    }

    size();
    if (window.ResizeObserver) { ro = new ResizeObserver(size); ro.observe(canvas); ro.observe(strip); }
    else window.addEventListener('resize', size);

    main.addEventListener('pointermove', move);
    main.addEventListener('pointerdown', move);
    /* Reduce Motion: the snow is drawn once, and nothing clears on arrival */
    if (still && !opened) { f = 0; place(); }
    else {
      var last = performance.now(), st = last / 1000;
      var tick = function (now) {
        var dt = Math.min(0.05, (now - last) / 1000); last = now;
        if (!opened) clearing(now, dt);
        /* While the scroll is moving, the snow holds still and is not redrawn
           (redrawing it each frame under the scrolling pictures made the
           scroll stutter); it drifts on 0.2 s after the scroll stops. */
        if (opened && now - scrolled < 200) { raf = requestAnimationFrame(tick); return; }
        st += dt;
        for (var i = 0; i < flakes.length; i++) {
          var p = flakes[i]; p.y += p.v * dt; p.x += 3 * dt;
          if (p.y - p.r > H) flakes[i] = make(false);
        }
        draw(st);
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }

    return function stop() {
      cancelAnimationFrame(raf); clearTimeout(timer);
      if (ro) ro.disconnect(); else window.removeEventListener('resize', size);
      main.removeEventListener('pointermove', move);
      main.removeEventListener('pointerdown', move);
      if (scroll) {
        main.removeEventListener('pointerdown', press);
        main.removeEventListener('pointerup', release);
        logoLink.removeEventListener('contextmenu', noMenu);
        logoLink.removeEventListener('click', open);
        backHome.removeEventListener('click', back);
      }
    };
  }

  var stop = start();
  /* If the visitor switches dark mode or Reduce Motion while the page is open */
  function restart() { stop(); stop = start(); }
  [darkMq, stillMq].forEach(function (mq) {
    if (mq.addEventListener) mq.addEventListener('change', restart);
  });
})();
