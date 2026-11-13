# App Store header art

`header.html` draws Firn's App Store header (iPhone app) in the Sunrise style: the link
preview's scene (`design/share-preview/og.html`) with light mode's
first-light sky, stretched to any size. `shot.js` renders it at 3840×1646 (PNG), the
size of Apple's two that crops best; the line is "A calm browser."
`header.html?logo=only` (also rendered, `-logo-only.png`) drops the line
and draws the logo larger.

To rebuild: copy `header.html` and `shot.js` into a scratch folder with
`firn-lockup-on-dark.svg`, `firn-mark.svg` and `snow-fresh.webp` from
`public/assets/`, plus `GooperDeck-Regular.woff2` and `-SemiBold.woff2` from
fonts.firnbrowser.com (never commit the fonts), then run
`node shot.js /that/folder`.
