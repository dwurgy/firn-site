/* Home page only: the try-it window (Sunrise, step 3). A made-up Firn
   window drawn from the data below: three spaces, Basecamp tiles, tabs,
   Lookout, and split view with a draggable gap. Only made-up sites. Nothing
   is stored or sent anywhere; it runs only when someone clicks. */
(function () {
  var win = document.getElementById('win');
  if (!win) return;

  // [title, domain, site, nav, kicker, headline, body, link, sky top, sky bottom, hill 1, hill 2]
  function P(a) { return { title: a[0], domain: a[1], site: a[2], nav: a[3], kicker: a[4], h1: a[5], body: a[6], link: a[7], s1: a[8], s2: a[9], c1: a[10], c2: a[11] }; }
  var D = [
    { name: 'Personal', color: '#7F9CB0', group: 'Cabin weekend',
      tiles: [['Mail', 'M', '#7F9CB0'], ['Calendar', 'C', '#B07F6A'], ['Photos', 'P', '#C4A95B'], ['Weather', 'W', '#B88A9E']],
      pages: [
        P(['Cabin weekend: packing list', 'notes.cabinweekend.page', 'Cabin Weekend', 'Lists   Trips', 'Saturday', 'What to pack for the cabin', 'Wool socks, the good coffee, the pour-over, and one book you’ll actually finish. Chains for the car, just in case.', 'Road conditions over the pass', '#E8DED3', '#F3EEE8', '#CDBBA6', '#B39E86']),
        P(['Pour-over, slowly', 'morningcup.blog', 'Morning Cup', 'Brewing   Beans', 'Brewing', 'Pour-over, slowly', 'Thirty grams, half a liter of water just off the boil, and four minutes you don’t spend looking at your phone.', 'Choosing a hand grinder', '#EADCCF', '#F6EFE8', '#D5BBA3', '#BE9C80']),
        P(['Snow report', 'slowsnow.news', 'Slow Snow', 'Reports   Maps   About', 'This morning', 'Fourteen inches, and still settling', 'A quiet storm overnight. The new snow is light on top and already packing down below, the slow start of next year’s firn.', 'How snow turns into firn', '#D9E3EA', '#EEF2F4', '#C6D5DF', '#AFC4D2'])
      ] },
    { name: 'Work', color: '#8FAE8B', group: 'Planning',
      tiles: [['Inbox', 'I', '#8FAE8B'], ['Calendar', 'C', '#B07F6A'], ['Docs', 'D', '#6FA3A0'], ['Chat', 'T', '#8E8FB8']],
      pages: [
        P(['Q1 roadmap', 'docs.northpine.work', 'Northpine Docs', 'Docs   Shared', 'Planning', 'Q1: three things, not twelve', 'Ship the small fixes first. Then the one big thing. Then take a breath before the next one.', 'Last quarter’s notes', '#DDE6DA', '#F0F3EE', '#C3D3BF', '#A9BFA4']),
        P(['Design review: settings', 'docs.northpine.work', 'Northpine Docs', 'Docs   Shared', 'Review', 'The new settings, reviewed', 'Shorter menus and plainer words. Two choices where there used to be five.', 'Before and after', '#E2E5EE', '#F1F2F6', '#C8CBDD', '#ADB0CB']),
        P(['Thursday standup', 'team.northpine.work', 'Northpine Team', 'Standups   People', 'Thursday', 'Standup, Thursday', 'Yesterday: fixed the export bug. Today: the onboarding copy. Blocked: nothing, for once.', 'Open tickets', '#DCE9E7', '#EFF5F4', '#BCD6D3', '#9DC1BE'])
      ] },
    { name: 'Kitchen', color: '#C9A27E', group: 'Weekend cooking',
      tiles: [['Recipes', 'R', '#C9A27E'], ['Market', 'M', '#8FAE8B'], ['Notes', 'N', '#7F9CB0'], ['Timer', 'T', '#B07F6A']],
      pages: [
        P(['Sourdough, slowly', 'thepatientloaf.com', 'The Patient Loaf', 'Bread   Starters', 'Bread', 'Sourdough, slowly', 'Feed the starter tonight, mix in the morning, and let the dough take its time. It knows what it’s doing.', 'Shaping a round loaf', '#EFE2D3', '#F7F1EA', '#DCC3A8', '#C8A784']),
        P(['One-pot cabin chili', 'thepatientloaf.com', 'The Patient Loaf', 'Bread   Starters', 'Dinner', 'One-pot cabin chili', 'Two kinds of beans, one pot, and the cornbread from the back of the cookbook while it simmers.', 'Cornbread from scratch', '#F0DDD3', '#F8EFEA', '#DDBBA8', '#C69A84']),
        P(['Shopping list', 'notes.cabinweekend.page', 'Cabin Weekend', 'Lists   Trips', 'Saturday', 'Shopping list', 'Flour, butter, onions, and the good salt. Coffee, obviously.', 'What’s in season', '#E6E7D8', '#F3F3EC', '#CBCDB0', '#B1B493'])
      ] }
  ];
  var GROUPED = 2; // the first two tabs of each space sit in its group

  // Basecamp pages: one per tile (made-up, on example.com).
  function tilePage(t, s) {
    return { title: t[0], domain: t[0].toLowerCase() + '.example.com', site: t[0], nav: '', kicker: s.name, h1: t[0],
      body: 'One of your everyday sites, pinned in Basecamp at the top of this space. Every space has its own.',
      link: 'Something worth a glance', s1: '#E9E3DA', s2: '#F4F1EC', c1: '#D9D0C4', c2: '#C7BBAC', letter: t[1], fav: t[2] };
  }

  var st = { space: 0, active: 2, lookout: false, split: false, frac: 0.5, open: [true, true, true], extra: [[], [], []], tour: -1 };
  var phone = window.matchMedia('(max-width: 600px)');

  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function tabsOf(i) { return D[i].pages.concat(st.extra[i]); }
  function pageAt(i) {
    var s = D[st.space], tabs = tabsOf(st.space);
    return i < tabs.length ? tabs[i] : tilePage(s.tiles[i - tabs.length], s);
  }
  function fav(p) { return '<span class="fav" style="background:' + (p.fav || p.c2) + '">' + esc((p.letter || p.site).charAt(0)) + '</span>'; }
  function partner() { var n = tabsOf(st.space).length; return (st.active + 1) % n; }

  var ICON = {
    side: '<svg viewBox="0 0 16 16" width="15" height="15"><rect x="1.5" y="2.5" width="13" height="11" rx="2.5" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M6 3v10" stroke="currentColor" stroke-width="1.3"/></svg>',
    back: '<svg viewBox="0 0 16 16" width="14" height="14"><path d="M10 3 5 8l5 5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    fwd: '<svg viewBox="0 0 16 16" width="14" height="14"><path d="m6 3 5 5-5 5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    reload: '<svg viewBox="0 0 16 16" width="13" height="13"><path d="M13 8a5 5 0 1 1-1.6-3.7M13 2.5v3h-3" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    chev: '<svg viewBox="0 0 16 16" width="10" height="10"><path d="m4 6 4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    plus: '<svg viewBox="0 0 16 16" width="12" height="12"><path d="M8 3v10M3 8h10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
    archive: '<svg viewBox="0 0 16 16" width="15" height="15"><rect x="2" y="3" width="12" height="3" rx="1" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M3 6v6.5A1.5 1.5 0 0 0 4.5 14h7a1.5 1.5 0 0 0 1.5-1.5V6M6.5 9h3" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>',
    keep: '<svg viewBox="0 0 16 16" width="12" height="12"><path d="M9.5 2.5h4v4M13.5 2.5 9 7M6.5 13.5h-4v-4M2.5 13.5 7 9" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  };

  function tabBtn(p, i, extraCls) {
    var on = i === st.active || (st.split && i === partner());
    return '<button type="button" class="tab' + (on ? ' on' : '') + (extraCls || '') + '" data-act="tab" data-i="' + i + '" data-k="tab' + i + '"' +
      (i === st.active ? ' aria-current="page"' : '') + '>' + fav(p) + '<span class="tn">' + esc(p.title) + '</span></button>';
  }
  function tabRow(tabs, i) {
    if (st.split && i === partner()) return '';
    if (st.split && i === st.active) {
      var j = partner();
      return '<div class="tab pair on">' + tabBtn(tabs[i], i, ' half') + tabBtn(tabs[j], j, ' half') + '</div>';
    }
    return tabBtn(tabs[i], i);
  }

  function sidebar() {
    var s = D[st.space], tabs = tabsOf(st.space), n = tabs.length, cur = pageAt(st.active), h = '';
    h += '<div class="bar" aria-hidden="true"><i></i><i></i><i></i><span class="ic sb">' + ICON.side + '</span><span class="ic bk">' + ICON.back + '</span><span class="ic">' + ICON.fwd + '</span></div>';
    h += '<div class="addr"><span>' + esc(cur.domain) + '</span><span class="ic" aria-hidden="true">' + ICON.reload + '</span></div>';
    h += '<div class="bc" role="group" aria-label="Basecamp">';
    s.tiles.forEach(function (t, k) {
      var i = n + k;
      h += '<button type="button" class="tile' + (st.active === i ? ' on' : '') + '" data-act="tab" data-i="' + i + '" data-k="tile' + k + '" aria-label="' + t[0] + '" title="' + t[0] + '"' + (st.active === i ? ' aria-current="page"' : '') + '>' + fav(tilePage(t, s)) + '</button>';
    });
    h += '</div><div class="list">';
    var open = st.open[st.space];
    h += '<div class="grp"><button type="button" class="gh" data-act="fold" data-k="fold" aria-expanded="' + open + '">' + esc(s.group) + '<span class="ic">' + ICON.chev + '</span></button>';
    if (open) for (var i = 0; i < GROUPED; i++) h += tabRow(tabs, i);
    h += '</div>';
    for (var k = GROUPED; k < n; k++) h += tabRow(tabs, k);
    h += '<div class="new" aria-hidden="true">' + ICON.plus + 'New tab</div></div>';
    h += '<div class="sfoot"><span class="ic arc" aria-hidden="true">' + ICON.archive + '</span><div class="spc"><span class="sn">' + s.name + '</span><span class="dots">';
    D.forEach(function (d, i) {
      h += '<button type="button" class="dot' + (i === st.space ? ' on' : '') + '" data-act="space" data-i="' + i + '" data-k="dot' + i + '" aria-label="Switch to the ' + d.name + ' space"' + (i === st.space ? ' aria-current="true"' : '') + '><i style="background:' + d.color + '"></i></button>';
    });
    return h + '</span></div></div>';
  }

  function hills(p) {
    return '<div class="pv" style="background:linear-gradient(180deg,' + p.s1 + ',' + p.s2 + ')"><svg viewBox="0 0 600 150" preserveAspectRatio="none" aria-hidden="true"><path d="M0 95C120 70 220 110 330 88S520 92 600 78V150H0Z" fill="' + p.c1 + '"/><path d="M0 120C140 100 260 132 380 112S540 118 600 108V150H0Z" fill="' + p.c2 + '"/></svg></div>';
  }
  function page(p, cls, label) {
    return '<div class="pg' + cls + '" role="group" aria-label="' + esc(label) + '"><div class="ph"><b>' + esc(p.site) + '</b><span>' + esc(p.nav) + '</span></div>' + hills(p) +
      '<div class="pb"><p class="k">' + esc(p.kicker) + '</p><h3>' + esc(p.h1) + '</h3><p>' + esc(p.body) + '</p>' +
      '<button type="button" class="lk" data-act="look" data-k="look' + cls + '">' + esc(p.link) + '</button></div></div>';
  }
  function area() {
    var cur = pageAt(st.active), h = '';
    if (st.split) {
      var other = tabsOf(st.space)[partner()];
      h += '<div class="panes split">' + page(cur, ' a', 'Left page: ' + cur.title).replace('class="pg a"', 'class="pg a" style="flex:' + st.frac + ' 1 0"') +
        '<div class="gap" role="separator" tabindex="0" aria-orientation="vertical" aria-label="Split view divider: drag, or use the arrow keys" aria-valuemin="25" aria-valuemax="75" aria-valuenow="' + Math.round(st.frac * 100) + '" data-k="gap"><i></i></div>' +
        page(other, ' b', 'Right page: ' + other.title).replace('class="pg b"', 'class="pg b" style="flex:' + (1 - st.frac) + ' 1 0"') + '</div>';
    } else {
      h += '<div class="panes">' + page(cur, '', 'Page: ' + cur.title) + '</div>';
    }
    if (st.lookout) {
      h += '<div class="lo-dim" data-act="close"></div><div class="lo" role="dialog" aria-label="Lookout: ' + esc(cur.link) + '">' +
        '<div class="lo-ctl"><button type="button" class="keep" data-act="keep" data-k="keep">' + ICON.keep + 'Keep as tab</button>' +
        '<button type="button" class="x" data-act="close" data-k="x" aria-label="Close Lookout">×</button></div>' +
        '<div class="lo-pg"><p class="k">' + esc(cur.site) + '</p><h3>' + esc(cur.link) + '</h3><p>A quick look without leaving your page. Keep it as a tab, or close it and carry on where you were.</p>' +
        '<span class="ln" style="width:92%"></span><span class="ln" style="width:84%"></span><span class="ln" style="width:66%"></span></div></div>';
    }
    return h;
  }

  function render(focusKey) {
    var a = document.activeElement, key = focusKey || (a && win.contains(a) ? a.getAttribute('data-k') : null);
    win.style.setProperty('--sc', D[st.space].color);
    // The finale snow and the footer ice take this space's colours (home.css).
    if (document.documentElement.getAttribute('data-space') !== String(st.space)) document.documentElement.setAttribute('data-space', st.space);
    win.innerHTML = '<div class="side">' + sidebar() + '</div><div class="area">' + area() + '</div>';
    if (key) { var f = win.querySelector('[data-k="' + key + '"]'); if (f) f.focus(); }
    var tc = document.querySelectorAll('.tc');
    for (var i = 0; i < tc.length; i++) {
      tc[i].classList.toggle('on', i === st.tour);
      if (tc[i].hasAttribute('aria-pressed')) tc[i].setAttribute('aria-pressed', String(i === 2 ? st.lookout : st.split));
    }
    var sa = document.querySelector('.tc-split .ta'); if (sa) sa.textContent = st.split ? 'Back to one →' : 'Split it →';
    var dot = document.querySelector('.tc em'); if (dot) dot.style.background = D[st.space].color;
  }

  function act(name, i) {
    var n = tabsOf(st.space).length;
    if (name === 'tab') { st.active = i; st.lookout = false; if (i >= n) { st.split = false; st.tour = 1; } }
    else if (name === 'space') { st.space = i; st.active = GROUPED; st.lookout = false; st.split = false; st.tour = 0; }
    else if (name === 'fold') st.open[st.space] = !st.open[st.space];
    else if (name === 'look') { st.lookout = true; st.tour = 2; render('keep'); return; }
    else if (name === 'close') { st.lookout = false; render('look'); return; }
    else if (name === 'keep') {
      var cur = pageAt(st.active);
      var p = Object.assign({}, cur, { title: cur.link, h1: cur.link, kicker: cur.site, body: 'Kept from Lookout. It’s a tab now, in this space, like any other.' });
      st.extra[st.space].push(p); st.active = tabsOf(st.space).length - 1; st.lookout = false; st.split = false;
      render('tab' + st.active); return;
    }
    render();
  }

  win.addEventListener('click', function (e) {
    var b = e.target.closest('[data-act]');
    if (b && win.contains(b)) act(b.getAttribute('data-act'), +b.getAttribute('data-i'));
  });
  win.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && st.lookout) { act('close'); return; }
    if (e.target.classList && e.target.classList.contains('gap') && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
      e.preventDefault(); setFrac(st.frac + (e.key === 'ArrowLeft' ? -0.05 : 0.05));
    }
  });

  // The split view gap: drag it (mouse, pen, or touch) or use the arrow keys.
  function setFrac(f) {
    st.frac = Math.max(0.25, Math.min(0.75, f));
    var a = win.querySelector('.pg.a'), b = win.querySelector('.pg.b'), g = win.querySelector('.gap');
    if (a && b) { a.style.flex = st.frac + ' 1 0'; b.style.flex = (1 - st.frac) + ' 1 0'; }
    if (g) g.setAttribute('aria-valuenow', Math.round(st.frac * 100));
  }
  win.addEventListener('pointerdown', function (e) {
    var g = e.target.closest('.gap'); if (!g) return;
    e.preventDefault(); g.setPointerCapture(e.pointerId); g.classList.add('drag');
    var box = win.querySelector('.panes').getBoundingClientRect();
    function move(ev) { setFrac((ev.clientX - box.left) / box.width); }
    function up() { g.classList.remove('drag'); g.removeEventListener('pointermove', move); g.removeEventListener('pointerup', up); g.removeEventListener('pointercancel', up); }
    g.addEventListener('pointermove', move); g.addEventListener('pointerup', up); g.addEventListener('pointercancel', up);
  });

  // Tour cards: each one does its thing in the window.
  document.querySelectorAll('.tc').forEach(function (c) {
    c.addEventListener('click', function () {
      var t = c.getAttribute('data-tour'), n = tabsOf(st.space).length;
      if (t === 'space') { act('space', (st.space + 1) % D.length); return; }
      if (t === 'basecamp') { st.active = n + ((st.active >= n ? st.active - n + 1 : 0) % D[st.space].tiles.length); st.lookout = false; st.split = false; st.tour = 1; }
      else if (t === 'lookout') { st.lookout = !st.lookout; st.tour = 2; }
      else if (t === 'split') { if (st.active >= n) st.active = GROUPED; st.split = !st.split; st.lookout = false; st.tour = 3; }
      render();
    });
  });

  // Phones have no split view.
  phone.addEventListener('change', function () { if (phone.matches && st.split) { st.split = false; render(); } });

  document.documentElement.classList.add('try-ready');
  render();
})();

// The sunrise over the snow's surface (dig down): as it scrolls into view
// the sun rises about 300px and the warm band brightens (home.css reads --r, 0 to 1). Scroll is
// only listened to while the snow is on screen, so there's no work at idle
// or elsewhere on the page. With reduced motion it stays risen (CSS default).
(function () {
  var el = document.querySelector('.sunrise');
  if (!el || !('IntersectionObserver' in window)) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var queued = false, last = -1;
  function update() {
    queued = false;
    var b = el.getBoundingClientRect(), vh = window.innerHeight;
    var r = Math.max(0, Math.min(1, (vh - b.top) / (b.height * 0.85)));
    r = Math.round(r * 200) / 200;
    if (r !== last) { last = r; el.style.setProperty('--r', r); }
  }
  function onScroll() { if (!queued) { queued = true; requestAnimationFrame(update); } }
  update();
  new IntersectionObserver(function (es) {
    if (es[0].isIntersecting) { window.addEventListener('scroll', onScroll, { passive: true }); onScroll(); }
    else { window.removeEventListener('scroll', onScroll); onScroll(); }
  }).observe(el);
})();

// Sun glints (Sunrise step 7): moving the mouse over the snow's surface
// lights a few tiny sparkles near it, like low sun on fresh snow. Only in
// the band above the text (no glint sits on text), more of them near the
// sun. Mouse only (fine pointer that can hover), off with reduced motion.
// Each glint is a CSS animation that removes itself: nothing runs when the
// mouse is still. The pointer position is used here only, never stored or sent.
(function () {
  var l1 = document.querySelector('.lay.l1');
  if (!l1 || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var box = document.createElement('div');
  box.className = 'glints'; box.setAttribute('aria-hidden', 'true');
  l1.insertBefore(box, l1.firstChild);
  var lx = null, ly = 0, alive = 0;
  l1.addEventListener('pointermove', function (e) {
    if (e.pointerType !== 'mouse') return;
    var b = l1.getBoundingClientRect(), x = e.clientX - b.left, y = e.clientY - b.top;
    var band = parseFloat(getComputedStyle(l1).paddingTop) - 16;
    if (y > band + 40) { lx = null; return; }
    if (lx !== null && Math.hypot(x - lx, y - ly) < 18) return;
    lx = x; ly = y;
    var near = 1 - Math.min(1, Math.abs(x / b.width - 0.62) / 0.5);
    var n = Math.random() < 0.35 + 0.5 * near ? 2 : 1;
    for (var i = 0; i < n && alive < 24; i++) {
      var gx = x + (Math.random() - 0.5) * 70, gy = y + (Math.random() - 0.5) * 50;
      if (gy > band || gy < 4) continue;
      var g = document.createElement('i');
      var s = 10 + Math.random() * 8 + 6 * near;
      g.style.cssText = 'left:' + gx.toFixed(1) + 'px;top:' + gy.toFixed(1) + 'px;--gs:' + s.toFixed(1) +
        'px;--gd:' + (900 + Math.random() * 600 | 0) + 'ms;--ga:' + (0.75 + 0.25 * near).toFixed(2) +
        ';--gr:' + (Math.random() * 40 - 20 | 0) + 'deg';
      g.addEventListener('animationend', function () { this.remove(); alive--; });
      box.appendChild(g); alive++;
    }
  });
})();

// The sky leans toward you (Sunrise step 7): the two warm glows drift a
// little toward the mouse (up to about 40px, the smaller one a bit more, so
// they part like light at different depths) and settle back when it leaves
// the sky. Eased with requestAnimationFrame that stops once they're still:
// nothing runs at idle. Transform only. Mouse only, off with reduced motion.
// The pointer position is used here only, never stored or sent.
(function () {
  var sky = document.querySelector('.sunsky'), sun = document.querySelector('.sunrise');
  if (!sky || !sun || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var gs = [{ el: sky.querySelector('.wg1'), max: 40 }, { el: sky.querySelector('.wg2'), max: 56 }]
    .filter(function (g) { return g.el; });
  gs.forEach(function (g) { g.x = g.y = g.tx = g.ty = 0; });
  var running = false;
  function tick() {
    var moving = false;
    gs.forEach(function (g) {
      g.x += (g.tx - g.x) * 0.06; g.y += (g.ty - g.y) * 0.06;
      if (Math.abs(g.tx - g.x) < 0.1 && Math.abs(g.ty - g.y) < 0.1) { g.x = g.tx; g.y = g.ty; }
      else moving = true;
      g.el.style.transform = 'translate3d(' + g.x.toFixed(2) + 'px,' + g.y.toFixed(2) + 'px,0)';
    });
    running = moving;
    if (moving) requestAnimationFrame(tick);
  }
  function aim(e) {
    var inSky = e && e.pointerType === 'mouse' && e.clientY < sun.getBoundingClientRect().bottom;
    gs.forEach(function (g) {
      if (!inSky) { g.tx = g.ty = 0; return; }
      var b = g.el.getBoundingClientRect();
      var dx = (e.clientX - (b.left + b.width / 2)) / (b.width / 2);
      var dy = (e.clientY - (b.top + b.height / 2)) / (b.height / 2);
      var d = Math.hypot(dx, dy), k = d > 1 ? 1 / d : 1;   // full lean at the glow's edge and beyond
      g.tx = dx * k * g.max; g.ty = dy * k * g.max * 0.6;
    });
    if (!running) { running = true; requestAnimationFrame(tick); }
  }
  document.addEventListener('pointermove', aim, { passive: true });
  document.documentElement.addEventListener('pointerleave', function () { aim(null); });
})();
