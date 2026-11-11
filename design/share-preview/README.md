# Link preview (v7)

`og.html` draws the 1200×630 link preview. To rebuild it, copy into this
folder `firn-lockup.svg`, `firn-mark.svg` and `firn-snow-layers-clear.svg`
from `public/assets/`, plus `GooperDeck-Regular.woff2` and
`-SemiBold.woff2` from fonts.firnbrowser.com (never commit the fonts), then
run `node shot.js "$PWD"`. It writes `v7.png`; give the new image a new
version number in `public/assets/`.
