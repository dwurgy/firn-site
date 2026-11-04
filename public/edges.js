// Safari fills the strips beyond the page (behind the status bar at the top
// and behind its toolbar at the bottom) with the page background colour.
// site.css makes that the sky's colour, which suits the top. Once you've
// scrolled to near the end of a page, this switches it to the deepest snow
// colour, so the snow seems to run to the bottom edge of the screen.
// Without JavaScript the page looks the same; only that strip stays sky.

const root = document.documentElement;

function update() {
  const scrolled = window.scrollY > window.innerHeight / 2;
  const left = root.scrollHeight - (window.scrollY + window.innerHeight);
  root.classList.toggle('at-end', scrolled && left < window.innerHeight / 2);
}

addEventListener('scroll', update, { passive: true });
addEventListener('resize', update);
update();

// One-time sunrise in the footer. The sun's finished spot is the default in
// site.css, so without JavaScript or with reduced motion it simply sits there.
// Otherwise the sun starts a little lower and dimmer (.sun-wait) and rises
// once (.sun-rise, about 2s) the first time 40% of the footer is on screen.
// The observer then stops, so nothing replays or keeps running.
const dawn = document.querySelector('.dawn');
if (dawn && 'IntersectionObserver' in window &&
    !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  dawn.classList.add('sun-wait');
  const watch = new IntersectionObserver((entries) => {
    if (!entries.some((e) => e.isIntersecting)) return;
    watch.disconnect();
    dawn.classList.replace('sun-wait', 'sun-rise');
  }, { threshold: 0.4 });
  watch.observe(dawn);
}

// Phone menu. On phones (600px and narrower) the header shows only the logo
// and a two-line button; tapping it opens the page links as a soft panel,
// with the footer's social logos copied in at the bottom. site.css does the
// look and motion. Without JavaScript the button stays hidden and the three
// links show in the header as before.
const header = document.querySelector('header');
const menuBtn = header && header.querySelector('.menu-btn');
const menu = header && header.querySelector('nav.top');
if (menuBtn && menu) {
  const social = document.querySelector('nav.pill.social');
  if (social) {
    const row = document.createElement('div');
    row.className = 'menu-social';
    row.innerHTML = social.innerHTML;
    menu.append(row);
  }
  // quiet: close without the fade (wider screens, when the links go back
  // into the header at the top of the page).
  const setOpen = (open, quiet) => {
    if (!open && !quiet && header.classList.contains('open')) {
      header.classList.add('closing');
      setTimeout(() => header.classList.remove('closing'), 400);
    }
    header.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', open);
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Menu');
  };
  // On phones, once the page has scrolled 10px, the button glides into the
  // top-right corner and turns into a glass circle (.float-menu, see
  // site.css), so the menu is always within reach. The button is always fixed
  // to the screen, so this only fades and slides it. On wider screens the
  // header keeps its links, and the circle fades in only once the header has
  // scrolled out of view; back at the top, an open menu closes.
  const phone = matchMedia('(max-width: 600px)');
  const float = () => {
    const on = window.scrollY > (phone.matches ? 10 : header.offsetHeight);
    root.classList.toggle('float-menu', on);
    if (!on && !phone.matches && header.classList.contains('open')) setOpen(false, true);
  };
  addEventListener('scroll', float, { passive: true });
  float();
  menuBtn.addEventListener('click', () => setOpen(!header.classList.contains('open')));
  addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && header.classList.contains('open')) { setOpen(false); menuBtn.focus(); }
  });
  addEventListener('click', (e) => {
    if (header.classList.contains('open') && !header.contains(e.target)) setOpen(false);
  });
  phone.addEventListener('change', () => { setOpen(false, true); float(); });
}
