# Project Brief: firnbrowser.com

The website for **Firn**, a calm, minimalist desktop browser (the app lives in
the separate `dwurgy/firn` repo). Built by David with Claude. David is not a
professional developer: explain decisions in plain language, keep changes
small, and stop after each step so he can look at it.

Firn is out (0.1.0 on October 8, 2026, for macOS and Windows). The site is a
home page that says what Firn is, shows what it looks like, and has the
download button, plus About, release notes and support pages. A privacy page
(what Firn does and doesn't collect, in plain words) may come later.

---

## The design is decided: follow it

The current design is **First light**, made in Claude Design. It is final
unless David changes it.

- `design/first-light/`: the finished design. `index.html`,
  `release-notes.html` and `support.html` with one shared `site.css`, the
  assets they use, a short `README.md`, and `shots/` with every page at
  1440px and 393px in light and dark. It's the source of truth for layout,
  sizes, spacing, colours and copy.
- `design/about/`: the About page, designed later in the same style:
  `about.html`, its CSS (`about.css-snippet.css`, added to `site.css` just
  before the dawn section) and `reference/` shots at 1440px and 393px in
  light and dark. The live page matches them, apart from the phone footer
  links (see "Footer" below).
- The live site is built from it: `public/site.css` is the design's
  `site.css` (minus its `.theme-dark` block, which only exists for the
  design tool) plus a few live-site additions at the end. The live pages
  use the design's markup with the real head (favicons, Open Graph), clean
  links and, on home, the download button in place of the design's email
  sign-up (that was removed when Firn came out). At 1440px and 393px they render
  the same as the design files, apart from the scroll-performance changes
  below (no pixel differs by more than 9/255, which is invisible).
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

**Copy is final**, as written in the design files (including the line break
in the home subhead). Don't rewrite headlines or reword claims. Every privacy
claim on the site has been checked to be true; changing the wording can make
it untrue.

### Voice

- **Serial (Oxford) comma, always.** In a list of three or more, put a
  comma before the final "and" or "or": "Coming soon to macOS, Windows,
  and Linux", "Vertical tabs, spaces, and split view". This applies
  everywhere: page copy, page titles, meta descriptions, Open Graph and
  Twitter text, alt text, and release notes. (Two items take no comma:
  "mail and calendar".)

### First light: the idea (so new parts fit)

Sunrise in a snowy cabin near Sisters, Oregon, with a fresh cup of coffee in
hand. Cool glacier light high up, warm sunrise low.

- **Edge to edge.** No frame around the page any more: the page colour runs
  to the window edges.
- **Sky glow.** Each page starts with a soft morning sky (`.sky`): cool
  glacier blue at the top, warm peach and rose glows lower down, fading out
  as you scroll. Inner pages use a shorter sky (`.sky.short`).
- **Paper grain.** A faint warm noise texture (`.sheet::after`, an inline
  SVG filter, no image file). On the live site it sits on the scenery (sky,
  glows, snow) under the content, not on top of everything; see "Keep
  scrolling smooth" below.
- **Frosted glass.** The window mockup, the footer pills, the support cards
  and the release-note badges are semi-clear panels with a soft edge. The
  pills and cards use a real `backdrop-filter` blur; the big window mockup
  doesn't (see below), it only looks frosted because of its semi-clear
  colour over the already-soft glows. Where a browser can't blur, the
  semi-opaque background alone still reads fine.
- **Colour light behind the window.** On the home page, blurred patches of
  glacier, sunrise, sage and lilac light (`.light`) sit behind the frosted
  window mockup.
- **Sunrise snow footer ("dawn").** Every page ends in the snow layers with
  the sun rising behind them (`.dawn`, `.sun`, `.snow`). The snow art is
  the "clear" version (`firn-snow-layers-clear.svg`, dark:
  `firn-snow-layers-dark-clear.svg`), without its own sky, so the glow shows
  through. Two frosted pills sit on the snow: "Free and open source, MPL 2.0"
  and the footer links (GitHub, Reddit, Email, About, Release notes, Support).
- **Drifting flakes.** A few faint Firn flakes float in the home hero
  (`.fl`). They're hidden below 1000px wide, where they would land on text.
  No crystal or flake may sit on text.
- **Blue is for branding only.** Logo, snow, flakes, glows. Buttons, links
  and text stay in warm neutrals. The main button is ink with page-white text.
- **Calm.** Generous space; motion is only small 200ms hover/focus
  transitions, switched off for `prefers-reduced-motion`. No carousels,
  pop-ups, cookie banners, chat widgets or stock photos.

### Keep scrolling smooth

A live `backdrop-filter` blur on a big element, combined with a full-page
layer that blends (`mix-blend-mode`) on top of it, makes the browser redo a
large blur and blend on every scroll frame. On the home page that dropped
scrolling over the haze to about 20 frames per second. So, at the end of
`public/site.css`: the window mockup has no backdrop blur, and the grain
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

### Colours and type

All colours are CSS variables at the top of `public/site.css`; the
`prefers-color-scheme: dark` block redefines them for dark mode.

```
Light   page #FBFAF8 · ink #241F1B · muted #5E564E · faint #9D9389
        frame/sand #E9E3DA · sky top #F4F6F7 · frost rgba(130,168,190,.45)
Dark    page #2B2826 · ink #F5F1EC · muted #D4CDC5 · faint #958D85
        frame #3A3734 · sky top #2E2F31 · frost rgba(160,196,214,.45)
Space colours (mockup dots, feature dots): Sage #8FAE8B, Sand #C9A27E,
        Lagoon #6FA3A0, Glacier #7F9CB0, Lilac #8E8FB8
Type    Headlines: Fraunces, soft corners on, wonky letters off
        ('SOFT' 100, 'WONK' 0, optical sizing auto), weight 360–400.
        Everything else: system-ui, -apple-system, 'Segoe UI', sans-serif.
```

**Emphasis in Fraunces headlines is weight, never color: base 360, emphasis
600, never heavier; blue and colored text fail contrast against the morning
sky.** On the home page the headline is
`A calm browser <span class="em">for everyone.</span>`, with
`.hero h1 .em { font-weight: 600; white-space: nowrap; }`: the period sits
inside the span, so "for everyone." always stays together on one line. 600
is a real weight of the variable font (the `@font-face` declares
`font-weight: 100 900`, so the browser never fakes bold). Below 340px wide the
headline drops from 46px to 44px so the bold phrase fits inside the side
margins on the smallest phones.

### Dark mode: "blue hour"

Follows the visitor's system setting (`prefers-color-scheme: dark`), the same
way Firn follows the OS. No toggle. Same layout and copy; the sky turns to a
dim blue-hour glow, glass darkens, the sun is a low ember behind dark snow,
the grain turns a faint near-black, and the header logo swaps to
`firn-lockup-on-dark.svg`. theme-color: #F4F6F7 light, #2E2F31 dark.

### Fonts

Self-host Fraunces from `assets/fonts/fraunces.woff2` (a variable font; keep
`Fraunces-OFL.txt` next to it, the license requires it). The reference file
loads it from Google Fonts only for convenience: the real site must not call
Google or any other third party.

### Logo and icons

Use only the files in `assets/`. They're final; never redraw or re-type the
logo. `firn-lockup.svg` is the header logo (about 34px tall). Favicons are in
`assets/favicon/`.

Tab favicon = bare flake (glacier-deep, lighter on dark). Home-screen icons
(180/192/512) = glacier tile.
The 180 icon is the iPhone home-screen icon (`apple-touch-icon`); 192 and 512
are listed in `public/site.webmanifest` for Android. They're marked
`purpose: any` (not maskable), because the flake reaches too close to the
edges to survive Android's circle crop.

---

## Privacy rules (non-negotiable)

Firn's promise is privacy, so the website keeps it too:

- No third-party scripts, fonts, trackers, embeds or analytics. Everything
  loads from firnbrowser.com.
- Visitor counts, if any, only via Cloudflare Web Analytics (cookieless).
  Ask David before turning it on.
- No cookies.
- No forms that collect anything. (Until Firn came out the home page had an
  email sign-up, stored only on David's Cloudflare account. It was removed;
  David exported the list to send the one promised email.)
- Downloads come straight from Firn's GitHub releases (see "Download").

---

## Hosting

- Cloudflare Pages, connected to this GitHub repo, so every push publishes.
- The domain firnbrowser.com is already on David's Cloudflare account (his
  personal site is there too). Walk him through connecting the custom domain
  step by step, in plain words.
- Keep it a simple static site: plain HTML and CSS and two small scripts, no
  server code. No framework unless there's a strong reason; ask first.

## Cloudflare setup

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
- The sign-up database (D1 `firn-signups`, bound as `DB`), the
  `EXPORT_PASSWORD` secret and the "Sign-up limit" rate limiting rule were
  only for the email sign-up. Once removed in the dashboard, nothing here
  needs them.
- **pages.dev redirect:** account-level Bulk Redirects. The list
  `pages_dev_redirect` sends `firn-site-e8s.pages.dev` to
  `https://firnbrowser.com` (301), with preserve query string, subpath
  matching and preserve path suffix on, and "include subdomains" off so
  preview addresses keep working. An enabled Bulk Redirect rule uses that
  list. This is done in the dashboard rather than in code so that static
  files don't count against the Functions request allowance.

## Pages, header and download

**Pages:** `/` (home), `/about`, `/release-notes`, and `/support`. Cloudflare
serves them without `.html`; links use the clean addresses.

**Header (every page):** logo on the left; "About", "Release notes" and
"Support" on the right, with `aria-current="page"` on the current page.

**Footer (every page):** the dawn snow section with its two pills, always at
the bottom of the page. The links pill: GitHub, Reddit, Email
(`mailto:hello@firnbrowser.com`), About, Release notes, Support. Text in a
pill never wraps. Below 900px wide the two pills stack, centred; on phones
the links pill wraps into two rows, "GitHub | Reddit | Email" and "About |
Release notes | Support" (the third divider becomes the line break), so no
divider is left dangling at the end of a row.

**Contact:** hello@firnbrowser.com, forwarded to David by Cloudflare Email
Routing. Linked as "Email" in the footer and as "Say hello" in the Support
page's "Other ways to help". Cloudflare's Email Address Obfuscation stays
off (it adds a script and breaks the link without JavaScript).

**When links get too many:** the header (About, Release notes, Support) has
room for about one more link on a 320px phone; a fifth needs a menu button,
so tell David before adding one. The footer pill can take a few more links,
since it wraps into rows; keep its rows even.

**About:** the story in `<article class="part">` blocks (heading on the
left, text on the right; stacked on phones), with the frosted definition
card `.def` and the promise list `.promises`. The copy is David's; use it
as written.

**Release notes:** entries are `<article class="entry">` blocks, newest on
top, copied from `CHANGELOG.md` in `dwurgy/firn` in its own words: the
bold first line is the heading, then the paragraph and the list (bold
lead-ins in ink). The left column has the version, the release date and a
badge with the "For …" line ("For Windows and Mac"; no badge when the
version has no such line). A "### New" (or Better, Fixed) heading in the
CHANGELOG becomes an `<h3>`. Every release gets an entry, small ones too:
David likes showing all updates. To add a version, copy
the block (see the comment in the file), put it at the top and change the
text.

**Support:** the main button goes to GitHub Sponsors
(`github.com/sponsors/dwurgy`), so Sponsors must be set up on that account.
"Other ways to help" ends with "Say hello" (hello@firnbrowser.com).

**Copy notes (home):**
- Eyebrow: "Now available for macOS and Windows, Linux coming soon"; on
  phones "Now available for macOS and Windows" (the long line doesn't fit
  on one line there).
- Subhead: "Vertical tabs, spaces, and split view, without the learning
  curve.<br> Your data stays on your device." (the line break is
  intentional and hidden on phones).
- Page description (meta, Open Graph, Twitter): "A calm, minimalist browser
  with vertical tabs, spaces, and split view. Now available for macOS and
  Windows, Linux coming soon."

**Download:** in the hero, under the subhead (`.get`), the ink `.btn` from
the Support page with a download arrow: "Download for Mac"
(`https://github.com/dwurgy/firn/releases/latest/download/Firn.for.Mac.zip`)
and "Download for Windows"
(`https://github.com/dwurgy/firn/releases/latest/download/Firn.Setup.exe`).
Both links always fetch the newest release, so they never need updating.
Under them: "Windows may say “Windows protected your PC”. Click More info,
then Run anyway." (needed until Windows code signing). `download.js`, loaded
in `<head>` without `defer` so the right button shows from the first paint,
adds `.os-mac` or `.os-win` to `<html>`; then only that button shows (the
Windows note goes with the Windows button) plus an "Other platforms" button
that brings back both. Phones and tablets (iPads report themselves as
Macs, so a Mac with a touch screen counts as a tablet) can't install Firn, so
they get `.os-mobile`: no buttons, just the line "Visit firnbrowser.com on
your computer to download it. Coming to iOS." Linux and visitors without
JavaScript see both buttons and the note; on a phone without JavaScript the
buttons stack, full width up to 320px.

**Phone (max-width: 600px):** the design's phone block at the end of
`site.css`: tighter header and hero, h1 46px, single-column features and
statement, footer pills stacked. The window mockup is shrunk as one
picture: the design uses `zoom`, but in iPhone Safari that let the sidebar
text reflow, so the live site draws it at its full 1040×542px and scales
it with `transform: scale(var(--s))` inside a `.win-fit` wrapper that takes
the scaled size (`--s` is .335, .31 below 381px wide, .27 below 355px).

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

## Must-haves

- Works and looks right at phone width (see `design/first-light/shots/`).
  On phones the window mockup shrinks as one picture rather than squashing
  its sidebar. It will become a real screenshot image later.
- Accessible: visible
  focus ring (frost), good contrast, alt text on the logo, `aria-current`
  on the current page, decorative pieces `aria-hidden`.
- Page title, description, Open Graph and Twitter tags on every page, using
  `assets/firn-share-preview-v5.png`.
- Fast: no build step; no JavaScript needed for the look.

## Placeholders to fill later

- `[Screenshot of Firn goes here]` in the window mockup: David will provide a
  real screenshot.
- The eyebrow's "Linux coming soon" changes when Linux is ready.

## Project layout

The published site lives in `public/` (so the assets above are at
`public/assets/`): the four pages, `site.css`, `download.js`, `edges.js`
and `site.webmanifest`. There is no server code. See README.md.

**Old copies in browsers:** Zen once kept showing an old `site.css` after a
change (the new download button looked unstyled, and the old slow blur and
grain came back). So every page links `site.css?v=N`, `edges.js?v=N` and
`download.js?v=N`: when you change one of those files, raise its `N` on every
page that links it, so browsers fetch the new copy. `public/_headers` also
tells browsers to check for a newer CSS or JS file on every visit.

## How to work

- Small steps, one at a time. After each, say in plain words what changed and
  how to check it.
- Ask before adding any dependency or service.
- Commit to Git after each working step with a clear message.
