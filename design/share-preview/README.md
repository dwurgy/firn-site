# Link preview (v8)

`og.html` draws the 1200×630 link preview in the Sunrise style. To rebuild
it, copy into this folder `firn-lockup-on-dark.svg`, `firn-mark.svg` and
`snow-fresh.webp` from `public/assets/`, plus `GooperDeck-Regular.woff2` and `-SemiBold.woff2` from
fonts.firnbrowser.com (never commit the fonts), then run
`node shot.js "$PWD"`. It writes `v8.png`; give the new image a new version
number in `public/assets/`. The snow is home's top layer (`.l1`): its edge
(the `.rim` points under `div.lay.l1` in `public/index.html`), warm rim and
fresh-snow texture, with the sun in the dip at 62%.
