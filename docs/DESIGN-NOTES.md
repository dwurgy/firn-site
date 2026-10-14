# Design notes

The reasons, history and details behind the rules in `CLAUDE.md`. Nothing here
is a new rule: each section is the original text, moved out of `CLAUDE.md` so
that file stays short. `CLAUDE.md` loads in every session; this file is not
loaded automatically, so read the section you need when you change that
thing. Not published (it is outside `public/`).

## Scrolling

_Moved word for word from CLAUDE.md ("Keep scrolling smooth"). The rule is kept in CLAUDE.md._

A live `backdrop-filter` blur on a big element, combined with a full-page
layer that blends (`mix-blend-mode`) on top of it, makes the browser redo a
large blur and blend on every scroll frame. On the home page that dropped
scrolling over the haze to about 20 frames per second. So, at the end of
`public/site.css`: the window (now the screenshot) has no backdrop blur, and the grain
sits under the content (`z-index: 0`) instead of over it. After that every
page scrolls at about 60 fps. When adding new parts: no large
`backdrop-filter` panels, and no full-page blended layer above blurred
ones. Small glass pieces (pills, cards) are fine.

Firefox-based browsers (Firefox, Zen) were still slow over the haze: Gecko
redoes a `filter: blur()` on every scroll frame, and the colour light behind
the window was four big `filter: blur(70px)` patches. A first fix drew them
through a soft SVG mask, which was still choppy in Zen. Now each `.light`
has no filter and no opacity; its `::before` is a plain radial gradient
(`--g`, `closest-side`), its colour (`--c`, set inline in index.html) fading
along the measured curve of the old blur, with the light's strength (`--o`)
built into the colours via `color-mix`. It reaches 175px (110px on phones)
past the patch. Renders within 5/255 of the old blur. So also: no large
`filter: blur()`, image masks or see-through groups on anything that
scrolls; use plain gradients or images.

The grain doesn't blend any more either: Gecko also redoes a full-page
`mix-blend-mode` layer on every scroll frame. It's a plain see-through
texture now: light mode the same grain at the same strength (within 5/255
of the old multiply blend); dark mode a faint near-black grain at .15
(the old soft-light blend barely showed, and this matches it within 4/255).
So: no `mix-blend-mode` on anything big.

## iPhone

_Moved word for word from CLAUDE.md ("iPhone details"). The rule is kept in CLAUDE.md._

**iPhone details:** in normal Safari browsing the strip behind the clock
and Dynamic Island is not part of the page: the page starts below it, and
Safari paints the strip with one flat colour taken from the page background
(`html`/`body`; older Safari uses theme-color). No website can draw its glow
up there, so the strip's colour is matched to the sky's top edge instead.
On phones (600px and narrower) that edge is a little bluer than `--sky-top`
because the cool glow is strongest there, so `html`/`body` and phone-only
theme-color tags use the measured colour: #DDE3E7 light, #383D42 dark (the
same on every page, within a few shades across the width). Wider screens
keep the sky's top colour, #F4F6F7 / #2E2F31. The same colour also fills
the strip below the page, behind Safari's bottom toolbar, once you scroll to
the end. So `edges.js` (on every page) adds `.at-end` to `<html>` when you're
near the end of a page you've scrolled, and `site.css` then switches the page
background to the snow's deepest colour, #6B94AD light, #536573 dark, so the
snow seems to run to the bottom edge. Pages too short to scroll keep the sky
colour. Without JavaScript only that strip differs. Every page also has
`viewport-fit=cover`. The header adds
`env(safe-area-inset-top)` to its top padding, the footer pills add
`env(safe-area-inset-bottom)`, and both keep clear of the notch in
landscape. iOS text autosizing is off (`-webkit-text-size-adjust: 100%`).

## Home screenshot

_Moved word for word from CLAUDE.md ("Home screenshot"). The rule is kept in CLAUDE.md._

**Home screenshot:** under the hero, in the design's window spot (max
1040px wide, on the colour light), a real screenshot of Firn on a Mac (the
Weekend space, Basecamp with calendar, Gmail, YouTube, and GitHub, and a
website with a leafy tree and a church roof), cropped 2px inside the
window's edge: `public/assets/screens/firn-hero-v3.webp` (1440×910),
`firn-hero-v3@2x.webp` (1947×1230, the full crop, for sharp screens) and
`firn-hero-v3.jpg` (fallback), in a `<picture class="shot">` (`srcset` 1x
and 2x) with `width`/`height` set (1440×910) so nothing jumps while it
loads, and `loading="eager"` (it's near the top). CSS rounds its corners
(12px, `overflow: hidden`), which hides the bit of desktop in the window's
corners, and gives it the window's soft warm shadow (`--shadow-win`); no
backdrop blur. It stays light in dark mode: it's a real capture. On phones
the whole picture would be too small to read, so it shows only the
top-left part (sidebar and start of the page) in a 4:3 frame: the image is
drawn 2.25× the frame's width with `object-fit: cover` and
`object-position: left top`. Earlier versions: a white Wikipedia page
(too bright), then a still frame from the Split view clip (too soft).
Alt text: "Firn on a Mac: a sidebar with Basecamp shortcuts, a Weekend
space, and tabs on the left, a website with a leafy tree and a tiled
church roof against a blue sky on the right." A new picture gets a new
file name (v4, …) so browsers don't keep showing a saved copy of the old
one; update the HTML, its size and the alt text to match.

## Home features

_Moved word for word from CLAUDE.md ("Home features"). The rule is kept in CLAUDE.md._

**Home features:** under "All the good ideas. None of the homework.", four
rows (Spaces, Basecamp, Lookout, Split view), 96px apart (56px on phones).
Each has the feature's dot, title and description (the design's copy, as
written) on one side and a looping video of it on the other, 60% of the
content width; the sides switch each row (text first on odd rows). The
videos are real recordings of Firn on a Mac, silent, 1440×900 H.264:
`public/assets/screens/firn-spaces.mp4`, `firn-basecamp.mp4`,
`firn-lookout.mp4` and `firn-split-view.mp4`, each with a first-frame
poster (`…-poster.webp`). Markup: `<video class="clip" muted loop
playsinline preload="none" width="1440" height="900" poster="…"
aria-label="…">` with an mp4 `<source>`; no controls. Like the hero
screenshot: 12px rounded corners, `overflow: hidden`, `--shadow-win`, no
backdrop blur. `loops.js` (home only, `defer`) plays a video only while at
least half of it is on screen (IntersectionObserver) and pauses it when it
leaves; with `prefers-reduced-motion` on it never plays, so only the
poster shows (also the case without JavaScript). On phones the text sits
above a full-width video, same rule. The aria-labels say what happens in
each clip, e.g. "Switching between three spaces in Firn".

## Old copies in browsers

_Moved word for word from CLAUDE.md ("Project layout"). The rule is kept in CLAUDE.md._

**Old copies in browsers:** Zen once kept showing an old `site.css` after a
change (the new download button looked unstyled, and the old slow blur and
grain came back). So every page links `site.css?v=N`, `edges.js?v=N` and
`download.js?v=N` (home also `loops.js?v=N`): when you change one of those files, raise its `N` on every
page that links it, so browsers fetch the new copy. `public/_headers` also
tells browsers to check for a newer CSS or JS file on every visit.

## Cloudflare setup

_Moved word for word from CLAUDE.md ("Cloudflare setup"). The rule is kept in CLAUDE.md._

These settings live in David's Cloudflare dashboard, not in this repo. They're
written down here so the setup can be understood or rebuilt. Never put a
password or any other secret in this repo.

- **Pages project** `firn-site`, connected to GitHub `dwurgy/firn-site` (the
  Cloudflare GitHub app only has access to this repo). Production branch
  `main`, framework preset None, no build command, build output directory
  `public`. Every merge to `main` publishes; other branches get preview
  addresses.
- **Domains:** firnbrowser.com and www.firnbrowser.com, added under the
  project's Custom domains. The project's own address,
  `firn-site-e8s.pages.dev`, redirects to firnbrowser.com (see below).
- The sign-up database (D1 `firn-signups`), its `DB` binding, the
  `EXPORT_PASSWORD` secret and the "Sign-up limit" rate limiting rule were
  only for the email sign-up. David removed them all from the dashboard.
- **pages.dev redirect:** account-level Bulk Redirects. The list
  `pages_dev_redirect` sends `firn-site-e8s.pages.dev` to
  `https://firnbrowser.com` (301), with preserve query string, subpath
  matching and preserve path suffix on, and "include subdomains" off so
  preview addresses keep working. An enabled Bulk Redirect rule uses that
  list. This is done in the dashboard rather than in code so that static
  files don't count against the Functions request allowance.

## About page

_Moved word for word from CLAUDE.md ("About"). The rule is kept in CLAUDE.md._

**About:** the story in `<article class="part">` blocks (heading on the
left, text on the right; stacked on phones), with the frosted definition
card `.def` and the promise list `.promises`. Under the `.def` card in "The
word": the snow-to-ice layers diagram (`<figure class="layers">`): four
bands with wavy top edges (`.ly1`–`.ly4`: Fresh snow, Settled snow, Firn in
weight 600, Glacier ice), each with a small glyph (the Firn row uses the
page's `#flake` symbol), labels in ink, and a caption. Band and glyph
colours are `--l1`–`--l4`, `--gl-a` and `--gl-b` at the top of `site.css`
(light and dark). The copy is David's; use it as written.

## Windows download note

_Moved word for word from CLAUDE.md ("Download"). The rule is kept in CLAUDE.md._

Firn for Windows is signed since 0.7.3, but Windows keeps showing its "Windows protected your PC" screen for a new signature until enough people have downloaded it; remove the note once a fresh download on Windows shows no warning.

## Link preview image

_Moved word for word from CLAUDE.md ("The design is decided"). The rule is kept in CLAUDE.md._

- `public/assets/firn-share-preview-v5.png`: the link preview, the 1200×630
  image shown when someone shares a firnbrowser.com link (Open Graph /
  Twitter card), in the First light style: logo, "A calm browser **for
  everyone.**" (the emphasis in weight 600, matching the home headline),
  firnbrowser.com, snow at sunrise. Made in Claude Design as a
  finished image, exported without the paper grain so the PNG stays small
  (about 270 KB; WhatsApp skips preview images over about 600 KB). Keep
  it a PNG and don't recompress it. It stays light in both modes, because
  it shows up in other people's apps. Every page's `og:image` and `twitter:image` use the
  full URL `https://firnbrowser.com/assets/firn-share-preview-v5.png`. When
  it changes, use a new file name (v6, …) so apps fetch the new picture.
