// Home page feature loops. Each video plays only while at least half of it
// is on screen and pauses when it scrolls away, so nothing plays (or
// downloads) unseen. With reduced motion turned on, none of them play:
// the poster (the video's first frame) stays. Without JavaScript the
// posters show too.

const still = matchMedia('(prefers-reduced-motion: reduce)');
const clips = document.querySelectorAll('video.clip');

const watch = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (e.intersectionRatio >= 0.5 && !still.matches) {
      e.target.play().catch(() => {});
    } else {
      e.target.pause();
    }
  }
}, { threshold: [0, 0.5] });

clips.forEach((v) => watch.observe(v));

// Reduced motion switched on while the page is open: stop everything.
still.addEventListener('change', () => {
  if (still.matches) clips.forEach((v) => v.pause());
});
