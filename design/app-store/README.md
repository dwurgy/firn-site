# App Store header art

`header.html` draws Firn's App Store header in the Sunrise style: the link
preview's scene (`design/share-preview/og.html`) with light mode's
first-light sky, stretched to any size. `shot.js` renders the two sizes Apple
accepts, 5244×2950 and 3840×1646 (PNG).

To rebuild: copy `header.html` and `shot.js` into a scratch folder with
`firn-lockup-on-dark.svg`, `firn-mark.svg` and `snow-fresh.webp` from
`public/assets/`, plus `GooperDeck-Regular.woff2` and `-SemiBold.woff2` from
fonts.firnbrowser.com (never commit the fonts), then run
`node shot.js /that/folder`.
