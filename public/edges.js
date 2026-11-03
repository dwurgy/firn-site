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
