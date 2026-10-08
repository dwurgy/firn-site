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
