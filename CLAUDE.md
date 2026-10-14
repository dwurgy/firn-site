# Project Brief: firnbrowser.com

The website for **Firn**, a calm, minimalist desktop browser (the app lives in
the separate `dwurgy/firn` repo). Built by David with Claude. David is not a
professional developer: explain decisions in plain language, keep changes
small, and stop after each step so he can look at it.

Firn is out (0.1.0 on October 8, 2026, for macOS and Windows). The site is a
home page that says what Firn is, shows what it looks like, and has the
download button, plus About, release notes and support pages. A privacy page
(what Firn does and doesn't collect, in plain words) may come later.

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
  links and, on home, the download button in place of the design's email
  sign-up (that was removed when Firn came out). At 1440px and 393px they render
  the same as the design files, apart from the scroll-performance changes
  below (no pixel differs by more than 9/255, which is invisible).
  The one planned difference: on home, the design's sketched window is
  now a real screenshot of Firn (see "Home screenshot").
- `public/assets/firn-share-preview-v5.png`: the 1200×630 link preview (Open
  Graph / Twitter card), made in Claude Design, light in both modes. Keep it
  a PNG, don't recompress it, and keep it small (about 270 KB; WhatsApp skips
  images over about 600 KB). Every page's `og:image` and `twitter:image` use
  the full URL `https://firnbrowser.com/assets/firn-share-preview-v5.png`.
  When it changes, use a new file name (v6, …) so apps fetch the new
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
- **Frosted glass.** The footer pills, the support cards and the
  release-note badges are semi-clear panels with a soft edge. The pills and
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
  through. Two frosted pills sit on the snow: "Free and open source, MPL 2.0"
  and the footer links (GitHub, Reddit, Email, About, Release notes, Support).
- **Drifting flakes.** A few faint Firn flakes float in the home hero
  (`.fl`). They're hidden below 1000px wide, where they would land on text.
  No crystal or flake may sit on text.
- **Blue is for branding only.** Logo, snow, flakes, glows. Buttons, links
  and text stay in warm neutrals. The main button is ink with page-white text.
- **Calm.** Generous space; motion is only small 200ms hover/focus
  transitions, switched off for `prefers-reduced-motion`, and the home
  feature videos, which play only while on screen and never with reduced
  motion (see "Home features"). No carousels,
  pop-ups, cookie banners, chat widgets or stock photos.

### Keep scrolling smooth

Rules (the investigation, numbers and history are in `docs/DESIGN-NOTES.md`,
"Scrolling"):

- No large `backdrop-filter` panels. Small glass pieces (pills, cards) are
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
- Keep it a simple static site: plain HTML and CSS and three small scripts, no
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
- The email sign-up's database, secret and rate-limiting rule were removed
  from the dashboard.

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
card `.def`, the promise list `.promises`, and under the `.def` card in "The
word" the snow-to-ice layers diagram (`<figure class="layers">`, bands
`.ly1`–`.ly4`; colours `--l1`–`--l4`, `--gl-a` and `--gl-b` at the top of
`site.css`; details in `docs/DESIGN-NOTES.md`, "About page"). The copy is
David's; use it as written.

**Release notes:** entries are `<article class="entry">` blocks, newest on
top, copied from `CHANGELOG.md` in `dwurgy/firn` in its own words: the
bold first line is the heading, then the paragraph and the list (bold
lead-ins in ink). The left column has the version, the release date and a
badge with the "For …" line ("For Windows and Mac"; no badge when the
version has no such line). A "### New" (or Better, Fixed) heading in the
CHANGELOG becomes an `<h3>`. Each entry has its own address: the
`<article>` has the version as its `id` (`id="0.5.0"`) and the version name
in the left column links to it (`href="#0.5.0"`, ink, underlined on hover),
so `firnbrowser.com/release-notes#0.5.0` opens the page at that entry. Every release gets an entry, small ones too:
David likes showing all updates. When David says a new version is out,
add it and open the PR right away, without asking first (he asked for
that). To add a version, copy
the block (see the comment in the file), put it at the top and change the
text, including the version in its `id` and link.

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
- "Less, on purpose." cards: "Nothing loud." ends "Ads are blocked from the
  start, so nothing competes for your attention."; "Nothing collected." starts
  "No tracking, no telemetry, no account required, and trackers are blocked
  by default." (added when Firn's ad and tracker blocking shipped; "by
  default" so it doesn't repeat "from the start" from the card before).
- Page description (meta, Open Graph, Twitter): "A calm, minimalist browser
  with vertical tabs, spaces, and split view. Now available for macOS and
  Windows, Linux coming soon."

**Download:** in the hero, under the subhead (`.get`), the ink `.btn` from
the Support page with a download arrow: "Download for Mac"
(`https://github.com/dwurgy/firn/releases/latest/download/Firn.for.Mac.zip`)
and "Download for Windows"
(`https://github.com/dwurgy/firn/releases/latest/download/Firn.Setup.exe`).
Both links always fetch the newest release, so they never need updating.
Under them: "If Windows shows a warning, click More info, then Run
anyway." Remove this note once a fresh download on Windows shows no
warning (why it's there: `docs/DESIGN-NOTES.md`, "Windows download
note"). `download.js`, loaded
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
`site.css`: tighter header and hero, h1 46px, features stacked (text above video) and single-column
statement, footer pills stacked. The home screenshot is cropped rather
than shrunk (see below).

**Home screenshot:** under the hero, in the design's window spot (max
1040px wide, on the colour light), a real screenshot of Firn on a Mac,
cropped 2px inside the window's edge: `public/assets/screens/firn-hero-v3.webp`
(1440×910), `firn-hero-v3@2x.webp` (1947×1230) and `firn-hero-v3.jpg`
(fallback), in a `<picture class="shot">` (`srcset` 1x and 2x) with
`width`/`height` set (1440×910) and `loading="eager"`. CSS: 12px corners,
`overflow: hidden`, `--shadow-win`, no backdrop blur; it stays light in dark
mode. On phones it shows only the top-left part in a 4:3 frame (the image
drawn 2.25× the frame's width, `object-fit: cover`,
`object-position: left top`). Alt text: "Firn on a Mac: a sidebar with
Basecamp shortcuts, a Weekend space, and tabs on the left, a website with a
leafy tree and a tiled church roof against a blue sky on the right." A new
picture gets a new file name (v4, …); update the HTML, its size and the alt
text to match. (History and why: `docs/DESIGN-NOTES.md`, "Home screenshot".)

**Home features:** under "All the good ideas. None of the homework.", four
rows (Spaces, Basecamp, Lookout, Split view), 96px apart (56px on phones):
the feature's dot, title and description (the design's copy, as written) on
one side and a looping video on the other (60% of the content width, sides
switching each row; on phones the text sits above a full-width video). The
videos are silent 1440×900 H.264 recordings:
`public/assets/screens/firn-spaces.mp4`, `firn-basecamp.mp4`,
`firn-lookout.mp4` and `firn-split-view.mp4`, each with a first-frame
poster (`…-poster.webp`). Markup: `<video class="clip" muted loop
playsinline preload="none" width="1440" height="900" poster="…"
aria-label="…">` with an mp4 `<source>`; no controls; the hero screenshot's
corners and shadow, no backdrop blur. `loops.js` (home only, `defer`) plays a
video only while at least half of it is on screen and never with
`prefers-reduced-motion` (then only the poster shows). Each aria-label says
what happens in its clip. (Details: `docs/DESIGN-NOTES.md`, "Home features".)

**iPhone details** (why: `docs/DESIGN-NOTES.md`, "iPhone"): on phones (600px
and narrower) `html`/`body` and the phone-only theme-color tags use #DDE3E7
light / #383D42 dark (wider screens: the sky's top colour, #F4F6F7 /
#2E2F31), the same on every page. `edges.js` (on every page) adds `.at-end`
to `<html>` near the end of a scrolled page, and `site.css` then switches the
page background to #6B94AD light / #536573 dark. Every page has
`viewport-fit=cover`; the header adds `env(safe-area-inset-top)`, the footer
pills add `env(safe-area-inset-bottom)`, and both keep clear of the notch in
landscape. iOS text autosizing is off (`-webkit-text-size-adjust: 100%`).

## Must-haves

- Works and looks right at phone width (see `design/first-light/shots/`).
  On phones the home screenshot is cropped to its left part rather than
  shrunk until it's unreadable.
- Accessible: visible
  focus ring (frost), good contrast, alt text on the logo, `aria-current`
  on the current page, decorative pieces `aria-hidden`.
- Page title, description, Open Graph and Twitter tags on every page, using
  `assets/firn-share-preview-v5.png`.
- Fast: no build step; no JavaScript needed for the look.

## Placeholders to fill later

- The eyebrow's "Linux coming soon" changes when Linux is ready.

## Project layout

The published site lives in `public/` (so the assets above are at
`public/assets/`): the four pages, `site.css`, `download.js`, `edges.js`,
`loops.js` and `site.webmanifest`. There is no server code. See README.md.

**Old copies in browsers:** every page links `site.css?v=N`, `edges.js?v=N`
and `download.js?v=N` (home also `loops.js?v=N`): when you change one of those
files, raise its `N` on every page that links it, so browsers fetch the new
copy. `public/_headers` also tells browsers to check for a newer CSS or JS
file on every visit. (Why: `docs/DESIGN-NOTES.md`, "Old copies in browsers".)

## How to work

- Small steps, one at a time. After each, say in plain words what changed and
  how to check it.
- Ask before adding any dependency or service.
- Commit to Git after each working step with a clear message.

- **Pick the model before starting** (David is on the Pro plan and wants his limits to last the week). Before starting any task, say in one line which model it needs and why: "Sonnet is fine: <reason>" or "This needs Opus: <reason>. Switch with /model, then say go." If it needs Opus and you're running Sonnet, stop and wait. If you're running Opus and Sonnet would do, say so and wait, so David can switch. Don't start the work until the model fits. If a Sonnet task turns out harder than it looked (the first fix didn't work, the cause isn't clear, it spreads across many files), stop and say so rather than guessing on.
  - **Sonnet:** a release notes entry, copy and wording changes, a small CSS tweak, raising a `?v=N`, swapping a screenshot or clip for a new file name, alt text, meta tags, adding a link, answering questions about the site.
  - **Opus:** anything touching the privacy rules (scripts, headers, analytics, third-party anything), Cloudflare setup, scroll performance or rendering differences between browsers (Safari, Firefox, Zen), a new page or section that has to match the design across light, dark, and phone, and changes to `download.js`, `edges.js`, or `loops.js`.
  - When unsure, say which way it leans and why, in one line, and let David pick.

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
