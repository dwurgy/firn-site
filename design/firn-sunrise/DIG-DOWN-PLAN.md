# Sunrise, revised: "Dig down" (plan, 2026-11-12)

David approved this in chat. It replaces parts of `SUNRISE-BRIEF.md` (noted
below). Mockup: `dig-down-mockup.jpg` (whole page light | dark, plus a
Retina close-up). Goal in David's words: "Really make that texture amazing
and tactile. I want people to want to touch it."

## Where things stand

- Steps 1 to 5 of the brief are built and pushed (branch
  `claude/zealous-bardeen-k0odq3`, last commit "Home, Sunrise step 5").
- **Built 2026-11-12** (commit "Home, dig down"). Differences from the
  plan: one white-only tile per material (alpha carries the grain), so
  there are no separate dark tiles: dark mode lays a veil of the layer's
  own colour over the grain instead (`--veil`). Total about 83 KB. The
  layer-1 shadow is left out (it would fall on the sky); the surface gets
  a warm wash where the sun rises. Photo sources: see `docs/DESIGN-NOTES.md`,
  "Snow texture photos". Step 6 (the drift) is dropped.

## Changes to the brief

1. **No page grain.** Remove the home grain (`.sheet::after` in
   `home.css`); the sky is a clean gradient. All texture lives in the snow.
   (The brief said "grain everywhere, about 45%". David dropped it.)
2. **Dig down.** The hero, try-it window and screenshot stay in the
   blue-hour sky. Below them the **sun rises over the snow's surface**
   (the sunrise moves to mid-page). From there each section sits one layer
   deeper:
   - layer 1 (fresh snow, `--s1`): "Why it's called Firn." card + Arc
   - layer 2 (settled, `--s2`): "Less, on purpose."
   - layer 3 (firn, `--s3`): Who's making it
   - layer 4 (deep firn, `--s4`): "Here comes the morning." finale
   - layer 5 (glacier ice, `--s5`): the footer (`footer.ice`, already built)
3. **The step 6 drift is probably dropped** (the page is already snow).
   Confirm with David when you reach it.
4. **Real snow texture from photos** (Unsplash/Pexels, David chose them;
   in `photos/`). CLAUDE.md's "no stock photos" rule gets an exception:
   photos used only as snow texture. **Ask David for the source links** and
   record them with their licences in `docs/DESIGN-NOTES.md`.

## How to build it

- **Layers:** wrap each section in a full-width `div.lay` (`.l1`–`.l4`)
  with `background: <texture tile>, var(--sN)`. Each wrapper overlaps the
  one above by its edge height (`margin-top: calc(-1 * var(--ea))`) and has
  a hand-cut top edge as a static `clip-path: polygon(...)`: x in %, y as
  `calc(var(--ea) * n)`, so phones can use a smaller `--ea` (desktop about
  60px, the surface layer about 90px; phone about 30 to 45px). Edge shapes:
  the five curves in step 5's code (`LAYERS` in the mockup), plus a little
  wobble. Give each wrapper enough bottom padding (about 110px) that the
  next edge never covers text.
- **Depth at every edge (cut paper):** a soft shadow on the layer behind,
  just above each edge: an SVG strip at the bottom of the previous wrapper
  (`preserveAspectRatio="none"`, same viewBox mapping as the polygon) with
  4 or 5 copies of the next edge shifted up a few units, flat fill at very
  low alpha. **Sunlit crest:** a thin light line along each edge (an SVG
  strip at the top of the wrapper, `vector-effect: non-scaling-stroke`);
  warm on the surface layer.
- **Shading:** each layer a little brighter at its crest, deeper lower
  down (a plain gradient on top of the texture). Deeper layers bluer.
- **Texture tiles:** `tools/make-snow-tiles.py` (run from the repo root
  with `python3 -I`) turns `photos/sugary-sunlit.jpg` (fresh, layers 1 and
  2) and `photos/wind-packed.jpg` (packed, layers 3 to 5) into seamless
  512px tiles: high-pass the photo (keep the grain, drop the lighting),
  cross-fade a half-offset copy so it tiles, then one RGBA tile that
  lightens (white) and darkens (cool dark) the layer colour, so space
  tinting still works. Shown at 256 CSS px (true 2x on Retina). Separate
  softer `-dark` tiles for dark mode. **Size budget: about 150 KB total**
  (the first run made 220 to 250 KB per tile: try 384px tiles, lower
  quality, or a grayscale+alpha trick). The 200px-tile mockup used the
  older two-tile version; the sugary crop read best (the sparkly crop
  `fresh-sparkle.jpg` read like rippling water at page scale).
- **Sunrise:** `.sunrise` moves just above layer 1. Sun disc, warm band
  and halo stay (`--r` from `home.js`, as now). The sun starts hidden below
  the surface and rises about 300px. Dark mode: it stays low, a cap
  peeking over the edge. **Fix found:** in dark mode the sun's big
  `box-shadow` glow shows a square box; replace it with a radial-gradient
  glow element.
- **Remove:** the `.snowx` SVG, the `.sp` specks and
  `assets/snow-specks.png`.
- **Keep:** space tinting (`data-space` on `<html>` sets `--s1`–`--s5`,
  light and dark); `footer.ice` (gets the packed texture and an edge).
- **Contrast:** check text on every layer in all three space colours,
  light and dark, with the texture on (muted text likely needs to be
  darker on layers 3 and 4 in light, lighter in dark).
- **Performance:** plain backgrounds, static clip-paths and static SVGs
  only; no filters, masks, blend modes or opacity groups. The only scroll
  work is the existing `--r` sunrise listener (runs only while it's on
  screen).

## Ideas to offer later (step 7 or 9, not now)

- Glints on the top layer that shimmer as you scroll (or as the mouse
  passes), like sun on real snow.
- The dry grass from `photos/grass.jpg`, cut out, poking through at the
  surface near the sunrise. David: "don't force it".
- David can send more photos if needed.

## Then

Check at 1440px and 393px, light and dark, all three spaces; raise `?v=N`
(`home.css` is v5, `home.js` v2 now); update CLAUDE.md's Sunrise notes
(grain gone, dig down, the photo exception); commit, push, report, and
wait for "next". Remaining brief steps after this: 7 (mouse effects),
8 (phone, dark, reduced-motion, accessibility, performance pass and the
cleanups listed in CLAUDE.md), 9 (creative pass).
