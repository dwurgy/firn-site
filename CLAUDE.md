# Project Brief: firnbrowser.com

The website for **Firn**, a calm, minimalist desktop browser (the app lives in
the separate `dwurgy/firn` repo). Built by David with Claude. David is not a
professional developer: explain decisions in plain language, keep changes
small, and stop after each step so he can look at it.

Firn came out as an Electron app (0.1.0 on October 8, 2026, for macOS and
Windows). The Electron app ended at 0.11.0, and Windows stopped there. Firn
1.0.0 (October 27, 2026) is the native Mac app (Swift, WebKit), Mac only, a
fresh start that brings nothing over from the old Firn. The site is a home
page that says what Firn is, shows what it looks like and has the download
button, plus About, release notes, support, privacy, and `/mac` (the farewell to
Electron and Windows, kept as written but no longer linked).

**Reasons and history** behind the rules below (the scroll-performance
investigation, the iPhone strip, the home screenshot and videos, why `?v=N`
exists, the Cloudflare setup, the link preview, the Windows note) are in
`docs/DESIGN-NOTES.md`. It is not loaded automatically: read it only when
you change one of those things.

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
  links and, on home, a link to `/mac` in place of the design's email
  sign-up (later the download buttons; see "Download"). At 1440px and 393px they render
  the same as the design files, apart from the scroll-performance changes
  below (no pixel differs by more than 9/255, which is invisible).
  The one planned difference: on home, the design's sketched window is
  now a real screenshot of Firn (see "Home screenshot").
- `public/assets/firn-share-preview-v7.png`: the 1200×630 link preview (Open
  Graph / Twitter card), light in both modes. v7 (2026-11-11) is v6
  redrawn with the Gooper Condensed logo and a Gooper Deck headline ("A calm
  browser, made for Mac."), rendered from `design/share-preview/og.html`;
  used by every page (v5 and v6 stay in assets for old shared links). Keep it
  a PNG, don't recompress it, and keep it small (about 300 KB; WhatsApp skips
  images over about 600 KB). Each page's `og:image` and `twitter:image` use
  the full URL, e.g. `https://firnbrowser.com/assets/firn-share-preview-v7.png`.
  When it changes, use a new file name (v8, …) so apps fetch the new
  picture. (More: `docs/DESIGN-NOTES.md`, "Link preview image".)

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

### Home page: "Sunrise" (being built, 2026-11)

The home page is being rebuilt as **Sunrise**, one long scroll that is one
sunrise: `design/firn-sunrise/SUNRISE-BRIEF.md` (the brief and its nine
steps) and `sunrise-mockup.dc.html` (reference only). Its styles live in
`public/home.css` (home only, loaded after `site.css`); other pages keep
First light. Built so far: step 1, the sky (`.sunsky`, one plain gradient,
two `.wg` warm glows); no page grain on home (dig down moved all texture
into the snow). Home's theme-color
and top background are blue hour (#1C2130 light, #1A1F2D dark).
Step 2: header and hero always light text on the dark top (on-dark logo,
`.hdl` Download pill, pill eyebrow, light `.btn`, `.try` link to `#try`,
small print adds "Signed and notarized by Apple.", checked in the app's
`scripts/release.sh`); phones get two `.dl-mobile` lines instead.
Step 3: `section.tryit` (#try): the try-it window `#win`, drawn by
`public/home.js` (three made-up spaces, Basecamp, a group, Lookout, split
view with a draggable gap; sidebar tinted by `--sc`, matched to the app's
`docs/screenshots`), four `.tc` tour cards, then the real screenshot
(`.stage`). Without JS only the screenshot shows. Spaces card says "tabs
and color" (spaces lost icons in the app, 2026-10-26). The sidebar button hides the
sidebar and the left edge peeks it, as in the app (`BrowserWindow.swift`); off on phones.
Step 4: `section.arc` (card and three mappings, checked against the app's
`ArcImport.swift` and File menu), "Less, on purpose." open on the sky (no
box), `section.maker` and the finale `section.fin` (#download).
Step 5, rebuilt as **dig down** (`design/firn-sunrise/DIG-DOWN-PLAN.md`,
2026-11-12): under the screenshot `.sunrise` (sun rises over the surface;
`--r` from scroll in `home.js`, risen without JS or with reduced motion;
dark: a cap behind the snow), then `div.lay.l1`–`.l4` (why Firn + Arc, Less
on purpose, maker, finale) and `footer.ice.lay.l5` (keeps `nav.social` for
`edges.js`), each one layer deeper. Edges, crests and shadows are generated
by `tools/make-snow-edges.py`; the grain tiles `assets/snow-fresh.webp` and
`snow-packed.webp` by `tools/make-snow-tiles.py` (both in
`design/firn-sunrise/`, run from the repo root with `python3 -I`). Photos are
allowed here only as snow texture (the "no stock photos" exception).
Snow and ice colours `--s1`–`--s5` follow the try-it space (`data-space`
on `<html>`; both modes only turn Personal's hue a little). The footer uses the on-dark lockup in both modes (the light
lockup's flake is the same blue as the Personal ice).
Step 7, mouse effects (`home.js`, end; mouse only, off with reduced motion): sun
glints on `.l1`, the sky leans toward the cursor with a trailing light (`.wg3`),
frost breath on the footer ice (`.breath`). Step 6, the drift, is dropped.
**Next:** step 8 (phone, dark, reduced-motion, accessibility, performance pass).

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
- **Frosted glass.** The menu card and circle, the support cards and the
  release-note badges are semi-clear panels with a soft edge. The menu and
  cards use a real `backdrop-filter` blur. Where a browser can't blur, the
  semi-opaque background alone still reads fine.
- **Screenshot on colour light.** On the home page, blurred patches of
  glacier, sunrise, sage and lilac light (`.light`) sit behind a real
  screenshot of Firn (`.shot`, see "Home screenshot" below), where the
  design had a sketched, frosted window.
- **Sunrise snow footer ("dawn").** Every page ends in the snow layers with
  the sun rising behind them (`.dawn`, `.sun`, `.snow`). The snow art is
  the "clear" version (`firn-snow-layers-clear.svg`, dark:
  `firn-snow-layers-dark-clear.svg`), without its own sky, so the glow shows
  through. The footer links sit on the sunrise just above the snow (see
  "Footer" below).
- **Drifting flakes.** A few faint Firn flakes float in the home hero
  (`.fl`). They're hidden below 1000px wide, where they would land on text.
  No crystal or flake may sit on text.
- **Blue is for branding only.** Logo, snow, flakes, glows. Buttons, links
  and text stay in warm neutrals. The main button is ink with page-white text.
- **Calm.** Generous space; motion is only small 200ms hover/focus
  transitions, switched off for `prefers-reduced-motion`, and (when they
  return) the home feature videos, which play only while on screen and
  never with reduced motion (see "Home features"). Besides those, the
  footer sun rises once on first view (about 2s, `transform` and `opacity`
  only, off with reduced motion; `edges.js`, see "Footer sunrise" in
  `docs/DESIGN-NOTES.md`). No carousels,
  pop-ups, cookie banners, chat widgets or stock photos.

### Keep scrolling smooth

Rules (the investigation, numbers and history are in `docs/DESIGN-NOTES.md`,
"Scrolling"):

- No large `backdrop-filter` panels. Small glass pieces (menu, cards) are
  fine. The window (the screenshot) has none.
- No large `filter: blur()`, image masks, or see-through groups on anything
  that scrolls; use plain gradients or images. Each `.light` is a plain radial
  gradient (`--g`, `closest-side`; its colour `--c` is set inline in
  `index.html`) with no filter and no opacity.
- No `mix-blend-mode` on anything big, and no full-page blended layer above
  blurred pieces. The grain is a plain see-through texture under the content
  (`.sheet::after{z-index:0}`, at the end of `public/site.css`).

### Colours and type

All colours are CSS variables at the top of `public/site.css`; the
`prefers-color-scheme: dark` block redefines them for dark mode.

```
Light   page #FBFAF8 · ink #241F1B · muted #5E564E · faint #9D9389
        frame/sand #E9E3DA · sky top #F4F6F7 · frost rgba(130,168,190,.45)
Dark    page #2B2826 · ink #F5F1EC · muted #D4CDC5 · faint #958D85
        frame #3A3734 · sky top #2E2F31 · frost rgba(160,196,214,.45)
Space colours (feature dots): Sage #8FAE8B, Sand #C9A27E,
        Lagoon #6FA3A0, Glacier #7F9CB0, Lilac #8E8FB8
Type    Headlines (.serif): "Gooper Deck", Georgia, serif;
        weight 400, emphasis 600.
        Everything else: system-ui, -apple-system, 'Segoe UI', sans-serif.
```

**Emphasis in headlines is weight, never color: base 400, emphasis 600,
never heavier; blue and colored text fail contrast against the morning
sky.** On the home page the headline is
`A calm browser, <span class="em">made for Mac.</span>`, with
`.hero h1 .em { font-weight: 600; white-space: nowrap; }`: the period sits
inside the span, so the phrase always stays on one line. On phones the
headline is `min(46px, (100vw - 48px) / 7.4)`, so the bold phrase fits
inside the side margins on small phones.

### Dark mode: "blue hour"

Follows the visitor's system setting (`prefers-color-scheme: dark`), the same
way Firn follows the OS. No toggle. Same layout and copy; the sky turns to a
dim blue-hour glow, glass darkens, the sun is a low ember behind dark snow,
the grain turns a faint near-black, and the header logo swaps to
`firn-lockup-on-dark.svg`. theme-color: #F4F6F7 light, #2E2F31 dark.

### Fonts

Headlines (everything `.serif`, plus About's quote, definition word,
signature and diagram labels) use Gooper Deck: 400, emphasis 600, never
heavier. It's licensed and can't be shared, so **the font files must never
be committed** (`.gitignore` blocks `*.woff2`, `*.woff`, `*.otf`, `*.ttf`).
They load from `https://fonts.firnbrowser.com/GooperDeck-Regular.woff2` and
`-SemiBold.woff2`, the `firn-fonts` R2 bucket on David's Cloudflare account
(setup: `docs/DESIGN-NOTES.md`, "Cloudflare setup"): `@font-face` at the top
of `site.css` (`font-display: swap`), both preloaded with `crossorigin` in
every page's `<head>`. The fallback is Georgia. A changed font gets a new
file name (browsers keep these for a year). Never call Google Fonts or any
other third party.

### Logo and icons

Use only the files in `assets/`. They're final; never redraw or re-type the
logo. The wordmark is Gooper Condensed Medium (Very Cool Studio), delivered
only as outlined SVGs; never add the font files to this repo, because the
license doesn't allow sharing them. `firn-lockup.svg` (5353 × 2595.2) is the
header logo (40px tall on wide screens, 30px on phones; the HTML keeps `width="70" height="34"`). Favicons are in
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

- Cloudflare Web Analytics is ON (one-click setup in the dashboard, since
  2026-11): Cloudflare injects `beacon.min.js` from
  static.cloudflareinsights.com. Cookieless, no storage, no fingerprinting.
  It's the only third-party script; the Privacy page's "What this website
  collects" says what it records. Keep that section true if the setup changes.
- Anything else third-party (scripts, fonts, trackers, embeds, analytics)
  needs David's OK first. Everything else loads from firnbrowser.com (the
  headline fonts from fonts.firnbrowser.com, David's own domain).
- No cookies of our own.
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

These settings live in David's Cloudflare dashboard, not in this repo (written
down in `docs/DESIGN-NOTES.md`, "Cloudflare setup", so they can be rebuilt).
Never put a password or any other secret in this repo.

- **Pages project** `firn-site`, connected to GitHub `dwurgy/firn-site` (the
  Cloudflare GitHub app only has access to this repo). Production branch
  `main`, framework preset None, no build command, build output directory
  `public`. Every merge to `main` publishes; other branches get preview
  addresses.
- **Domains:** firnbrowser.com and www.firnbrowser.com. The project's own
  address, `firn-site-e8s.pages.dev`, redirects to firnbrowser.com with a Bulk
  Redirect in the dashboard, not in code, so static files don't count against
  the Functions request allowance.
- **Fonts:** R2 bucket `firn-fonts` on fonts.firnbrowser.com, with a CORS
  rule and a one-year cache (details in `docs/DESIGN-NOTES.md`).
- **Web Analytics:** on for firnbrowser.com, one-click setup (Cloudflare adds
  the beacon at the edge; it's not in this repo).
- The email sign-up's database, secret and rate-limiting rule were removed
  from the dashboard.

## Pages, header and download

**Pages:** `/` (home), `/about`, `/release-notes`, `/tip-jar`, `/support` (how to report a bug or ask: email, GitHub Issues, Discord; was the Tip jar's old address until 2026-11-09), `/privacy` and `/faq` (one-column `.post` pages, linked only from the footer; FAQ answers must stay literally true), and `/mac`
(one-column `.post` page, not linked from any page), plus `404.html`
(shown by Cloudflare for any missing address, so every link and file in it
starts with `/`; `noindex`). Cloudflare
serves them without `.html`; links use the clean addresses.

**Header (every page):** logo on the left; "About", "Release notes",
"Support" and "Tip jar" on the right, with `aria-current="page"` on the current page.
A "Home" link (`a.home`, first in `nav.top`) shows only inside the menus
(phone menu and floating card), never in the header row; bold on home.
Also menu-only: FAQ and Privacy (`a.more`, smaller and muted under a line)
and, on wide screens only, a "Download for Mac" ink button (`a.dl`, same
link as home); "Menu extras" at the end of `site.css`.
On phones (600px and narrower, with JavaScript) the links hide behind a
two-line menu button that opens them as a frosted glass card, with the footer's
social logos copied in below a line (`edges.js` + "Phone menu" at the end of
`site.css`; without JavaScript the links show as before).
After 10px of scrolling the button stops top-right and turns into a frosted
glass circle (`.float-menu` on `<html>`, set by `edges.js`), all the way down;
an open menu stays open and doesn't move.
Wider screens keep the links in the header; once it scrolls out of view the same
glass circle appears top-right (in line with the column) and opens a small glass
card of the links and social logos (end of `site.css`).

**Footer (every page but home, which has `footer.ice`):** the dawn section (sun and snow), always at the
bottom of the page, with plain link columns (no glass) on the sunrise just
above the snow, so the flakes drawn in the snow's top edge never sit on
text: **Firn** (About, Release notes, Privacy), **Community** (`nav.social`:
GitHub, Discord `discord.gg/rZsVbT7794` (the David Wurgler Apps server),
Threads, each an inline Simple Icons SVG (CC0) plus its name; `edges.js`
copies these into the menu, logos only) and **Support** (Support, FAQ, Email,
Tip jar). The Firn flake (`firn-mark.svg`) sits on the
right on wide screens, hidden on phones. Under a thin line: "Firn · A
<a>David Wurgler</a> app · © 2026" (links to davidwurgler.com, David's
portfolio) and "Free and open source, MPL-2.0". Styles: "Footer" at the end
of `site.css`. Same markup on every page (links start with `/`).

**Contact:** hello@firnbrowser.com, forwarded to David by Cloudflare Email
Routing. Linked as "Email" in the footer, on the Support page and as "Say hello" in the Tip jar
page's "Other ways to help". Cloudflare's Email Address Obfuscation stays
off (it adds a script and breaks the link without JavaScript).

**When links get too many:** on wide screens the header has room for a few
more links; on phones they go in the menu panel. A new social account gets a
line in the Community column; keep the columns short (four or five links).

**About:** the story in `<article class="part">` blocks (heading on the
left, text on the right; stacked on phones), with the frosted definition
card `.def`, the promise list `.promises`, and under the `.def` card in "The
word" the snow-to-ice layers diagram (`<figure class="layers">`, bands
`.ly1`–`.ly4`; colours `--l1`–`--l4`, `--gl-a` and `--gl-b` at the top of
`site.css`; details in `docs/DESIGN-NOTES.md`, "About page"). The copy is
David's; use it as written.

**Release notes:** entries are `<article class="entry">` blocks, newest on
top, copied from `CHANGELOG.md` in `dwurgy/firn` in its own words: the
bold first line is the heading, then the paragraph and the list (bold
lead-ins in ink). The left column has the version, the release date and one
badge per platform it's for (`<span class="badge">Mac</span>`, also
"iPhone", "iPad"); every entry gets at least one. Only 1.0.0 and later are
listed (the Electron 0.x notes were removed on 2026-11-05). A "### New" (or Better, Fixed) heading in the
CHANGELOG becomes an `<h3>`. Each entry has its own address: the
`<article>` has the version as its `id` (`id="0.5.0"`) and the version name
in the left column links to it (`href="#0.5.0"`, ink, underlined on hover),
so `firnbrowser.com/release-notes#0.5.0` opens the page at that entry. Every release gets an entry, small ones too:
David likes showing all updates. When David says a new version is out,
add it and open the PR right away, without asking first (he asked for
that). To add a version, copy
the block (see the comment in the file), put it at the top and change the
text, including the version in its `id` and link.
Also add it to `public/release-notes.xml` (the RSS feed for feed reader apps, linked from the page's head): copy the top `<item>`, change it, and update `lastBuildDate`.

**Tip jar** (`tip-jar.html`; renamed from Support): call it a tip jar and
tips, never "donate" or "donation". The main (ink) button is "Leave a tip on
Ko-fi" (`ko-fi.com/dwurgy`, David's tip page for all his apps); under it a
lighter outlined `.btn.alt`, "Sponsor on GitHub" (`github.com/sponsors/dwurgy`).
"No account needed" is said only for one-time Ko-fi tips (not checked for monthly).
"Other ways to help" ends with "Say hello" (hello@firnbrowser.com). It lists both
Threads accounts: @firnbrowser (major releases; also the footer logo) and
David's @dwurgy (day to day). Reddit is gone (it points to Discord now).

**Privacy:** from `docs/privacy-page.md` in `dwurgy/firn`, checked against
the app's code, plus a "What this website collects" section. Every line must be literally
true. When the app starts sending something new (e.g. passwords syncing via
iCloud Keychain once the iOS app ships), update this page first.

**Copy notes (home):**
- Eyebrow: "Firn 1.0 is here".
- Subhead: "Vertical tabs, spaces, and split view, without the learning
  curve.<br> Your data stays on your device." (the line break is
  intentional and hidden on phones).
- "Less, on purpose." cards: "Nothing loud." ends "Ads are blocked from the
  start, so nothing competes for your attention."; "Nothing collected." starts
  "No tracking, no telemetry, no account required, and trackers are blocked
  by default." (added when Firn's ad and tracker blocking shipped; "by
  default" so it doesn't repeat "from the start" from the card before).
- Page description (meta, Open Graph, Twitter): "A calm, minimalist browser
  with vertical tabs, spaces, and split view. Now available for Mac."

**Download:** under the subhead, `.get` holds one ink `.btn`, "Download for
Mac", linked to
`https://github.com/dwurgy/firn/releases/latest/download/Firn.dmg` (always
the newest version: never put a version number in it), and under it
"Free. Needs macOS 14 or later." Phones (600px and narrower) see "Visit
firnbrowser.com on your Mac to download it." instead (CSS only, no script).
`github.com/dwurgy/firn-legacy` (linked from `/mac`) must be public and hold
the Windows code.

**Update feed:** `public/_redirects` sends `/appcast.xml` (302) to
`raw.githubusercontent.com/dwurgy/firn/main/appcast.xml`, where installed
copies of Firn check for updates. No copy of the feed lives on the site.

**Phone (max-width: 600px):** the design's phone block at the end of
`site.css`: tighter header and hero, h1 up to 46px, features stacked (text above video) and single-column
statement, footer columns side by side and the bottom line centred. The home screenshot is cropped rather
than shrunk (see below).

**Home screenshot:** under the hero, in the design's window spot (max
1040px wide, on the colour light), a real screenshot of Firn on a Mac,
cropped 2px inside the window's edge, in light and dark:
`public/assets/screens/firn-hero-v4-light.webp` / `-dark.webp` (1440×898)
and `@2x` (2080 wide), in a `<picture class="shot">` (a dark `<source
media="(prefers-color-scheme: dark)">`, `srcset` 1x and 2x) with
`width`/`height` set (1440×898) and `loading="eager"`. CSS: 12px corners,
`overflow: hidden`, `--shadow-win`, no backdrop blur. Source PNGs:
`design/screens-2026-10-26/` (window at 112,76, 2880×1800). On phones it shows only the top-left part in a 4:3 frame (the image
drawn 2.25× the frame's width, `object-fit: cover`,
`object-position: left top`). Alt text: "Firn on a Mac: a sidebar with
Basecamp shortcuts, a Weekend cooking folder, and tabs on the left, the Snow
Peak website with a tent in a grassy field at dusk on the right." A new
picture gets a new file name (v5, …); update the HTML, its size and the alt
text to match. (History and why: `docs/DESIGN-NOTES.md`, "Home screenshot".)

**Home features:** replaced by the try-it window and tour cards (Sunrise
step 3, 2026-11-12); the old videos, `loops.js` and feature stills are gone.

**iPhone details** (why: `docs/DESIGN-NOTES.md`, "iPhone"): on phones (600px
and narrower) `html`/`body` and the phone-only theme-color tags use #DDE3E7
light / #383D42 dark (wider screens: the sky's top colour, #F4F6F7 /
#2E2F31), the same on every page. `edges.js` (on every page) adds `.at-end`
to `<html>` near the end of a scrolled page, and `site.css` then switches the
page background to #6B94AD light / #536573 dark. Every page has
`viewport-fit=cover`; the header adds `env(safe-area-inset-top)` and keeps clear of the notch in
landscape (the footer links sit high above the home indicator). iOS text autosizing is off (`-webkit-text-size-adjust: 100%`).

## Must-haves

- Works and looks right at phone width (see `design/first-light/shots/`).
  On phones the home screenshot is cropped to its left part rather than
  shrunk until it's unreadable.
- Accessible: visible
  focus ring (frost), good contrast, alt text on the logo, `aria-current`
  on the current page, decorative pieces `aria-hidden`.
- Page title, description, Open Graph and Twitter tags on every page, using
  the `firn-share-preview-v7.png` image (see above).
- Fast: no build step; no JavaScript needed for the look.

## Project layout

The published site lives in `public/` (so the assets above are at
`public/assets/`): the five pages, `site.css`, `edges.js`,
`home.css`, `home.js`, `site.webmanifest`, `robots.txt` and `sitemap.xml`. There is no server code. See README.md.

**Search engines:** `/mac` and `404.html` carry `<meta name="robots" content="noindex">`; `robots.txt` blocks nothing (a block would hide that tag); `sitemap.xml` lists every other page. A new page gets a line in `sitemap.xml`.

**Old copies in browsers:** every page links `site.css?v=N` and
`edges.js?v=N` (home also `home.css?v=N` and `home.js?v=N`): when you change one of those
files, raise its `N` on every page that links it, so browsers fetch the new
copy. `public/_headers` also tells browsers to check for a newer CSS or JS
file on every visit. (Why: `docs/DESIGN-NOTES.md`, "Old copies in browsers".)

## How to work

- Small steps, one at a time. After each, say in plain words what changed and
  how to check it.
- Ask before adding any dependency or service.
- Commit to Git after each working step with a clear message.

- **Model:** always Opus. Never suggest switching to Sonnet or ask which model a task needs.

- **Spend David's budget carefully** (Pro plan). The aim is less bloat and less rehashing, never lower quality. Never save budget by skipping these: reading the code before editing it, checking the result at 1440px and 393px in light and dark, the privacy rules (no third-party anything, every claim literally true), the serial comma, or asking David when something is a real fork.
  - **Read less.** Find with Grep and Glob, then Read only the part you need (offset and limit). `public/site.css` is long: read the section you're changing, not the file. Don't re-read a file already read in this conversation unless it changed.
  - **Images cost the most.** Don't open the design's screenshots (`design/first-light/shots/`, `design/about/reference/`) unless the task is matching the design, and then only the one you need. Look at your own result once per step, not after every small edit.
  - **Keep searching out of this conversation.** For broad questions ("where is X used", "which pages link Y"), use the Explore agent. Don't spawn agents for anything else (each starts cold).
  - **Plan before multi-page work.** Say the plan in a few lines and wait for my OK.
  - **One task per conversation, small steps.** A long conversation is re-read on every message, so its cost grows with every reply.
  - **Checkpoints.** When a step works and is committed, say so and tell me which fits: "/clear" (next task is unrelated) or "/compact" (same work continues). You can't run these yourself, so tell me. Before I clear, anything worth keeping must be committed or in CLAUDE.md as a short note, not only in the chat.
  - **Short replies.** After a change: what changed, where, and how to check it, in a few lines. Don't recap the diff, repeat my request back, or paste whole files. Use Edit for changes, not rewriting a file.
  - **Quiet output.** Pipe long command output through tail or grep.
  - **Stuck rule.** After two failed attempts at the same fix, stop. Say what's known, what's been ruled out, and whether a fresh session or Opus would help. Don't try a third time.
  - **Breaks.** The conversation's saved copy goes cold after about 5 minutes idle, so resuming a long one costs a full re-read. Finish and commit a step before I step away, and suggest /clear if it's a good moment.
  - **Keep CLAUDE.md lean.** New notes are 1 to 3 lines: what changed, where, how to check it. The reasoning belongs in the commit message.
