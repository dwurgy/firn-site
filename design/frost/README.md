# Frost: the approved design for firnbrowser.com

Approved 24 Nov 2026. It replaces First light and Sunrise. This folder is the
source of truth for the redesign: layout, sizes, colours, copy, and the soft
spot, snow, and up-close behaviour. Since 26 Nov 2026 the home page and the
404 follow ClearScroll (`clear-scroll.dc.html`); the lens in the older
home files is replaced on the website.

## What's here

- `BRAND.md`: the Frost brand sheet, with every value written out.
- `pages/`: the approved designs, exported from the design canvas.
  - `clear-scroll.dc.html`, `clear-scroll-phone.dc.html`: the home page as
    built. The soft spot where the frost clears, snow, the up-close scroll
    the logo opens, and download-by-device logic.
  - `home.dc.html`: the home page before ClearScroll, with the lens. Reference
    for layout and copy only.
  - `home-dark.dc.html`: the same page forced to dark, for reference only.
  - `home-phone.dc.html`: the same page at 390 px wide, for reference only.
  - `404.dc.html`: the home page with "Nothing here. Just snow."
  - `release-notes.dc.html`, `release-notes-phone.dc.html`: the inner-page
    pattern, plus the month rail, filter, and tags.
  - `support.dc.html`: Support with the FAQ.
  - `tip-jar.dc.html`: Tip jar.
  - `link-preview.dc.html`: the 1200 × 630 link preview as designed.
- `link-preview.html`: the link preview as plain HTML in Gooper Deck. To
  rebuild the PNG, put `firn-lockup-on-dark.svg` and the two Gooper Deck
  `.woff2` files next to it and screenshot it at 1200 × 630. Never commit
  the fonts.
- `firn-share-preview-v10.png`: the finished link preview, ready for
  `public/assets/`.

## How to read the `.dc.html` files

They come from a design tool. They are reference, not files to ship.

- The page's markup is between `<x-dc>` and `</x-dc>`. Styles are in
  `<helmet><style>` and in inline `style="…"` attributes.
- `<script src="./support.js">` is the design tool's runtime. Don't ship it,
  and don't look for it.
- `{{ name }}` is a value filled in by `renderVals()` in the script at the
  bottom. `<sc-if value="{{ x }}">` shows its content when `x` is true.
  `ref`, `onPointerMove`, and `onPointerDown` attach the script to elements.
- The script at the bottom is a class with the real logic (the soft spot,
  the snow, the scroll, telling a phone from a Mac). Rewrite it as plain
  JavaScript for the live site; keep the numbers.
- Tweak defaults in `data-props` are the approved values. ClearScroll: clear
  "Where you point", snow density 0.3.

## Three substitutions

1. **Font.** The designs use Fraunces from Google Fonts as a stand-in. The
   live site uses Gooper Deck from fonts.firnbrowser.com, as it does today,
   and loads nothing from Google. Fraunces weight 300 becomes Gooper Deck
   400 (Regular); Fraunces 500 becomes Gooper Deck 600 (SemiBold).
2. **Logo images.** `/_blob/e3257822c0cdfdb203c0d94f102011b7` is
   `public/assets/firn-lockup.svg`. `/_blob/496d69a1add44227891bb3a27f4531ad`
   is `public/assets/firn-lockup-on-dark.svg`.
3. **Links.** The designs use full `https://firnbrowser.com/…` addresses.
   The live site uses its usual clean relative links.
