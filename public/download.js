// Shows the one download button that fits your computer: on a Mac the Mac
// button, on Windows the Windows button (with its note). "Other platforms"
// brings back both. Phones, tablets, Linux, and anything unclear get both
// buttons, and so does everyone with JavaScript off.
// Loaded in <head> without defer, so the right button shows from the start.

// In its own block, so its names don't clash with edges.js.
{
  const root = document.documentElement;
  const ua = navigator.userAgent;
  const platform = (navigator.userAgentData && navigator.userAgentData.platform) || navigator.platform || '';
  let os = '';
  if (/Android|iPhone|iPad|iPod/i.test(ua)) os = '';
  else if (/Win/i.test(platform)) os = 'win';
  // iPads say they're Macs; a real Mac has no touch screen.
  else if (/Mac/i.test(platform) && navigator.maxTouchPoints < 2) os = 'mac';
  if (os) root.classList.add('os-' + os);

  document.addEventListener('DOMContentLoaded', () => {
    const other = document.querySelector('.dl-other');
    if (!other || !os) return;
    other.hidden = false;
    other.addEventListener('click', () => {
      root.classList.remove('os-' + os);
      other.hidden = true;
    });
  });
}
