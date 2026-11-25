# Project Brief: firnbrowser.com

The website for **Firn**, a calm, minimalist browser (the app lives in
the separate `dwurgy/firn` repo). Built by David with Claude. David is not a
professional developer: explain decisions in plain language, keep changes
small, and stop after each step so he can look at it.

Firn came out as an Electron app (0.1.0 on October 8, 2026, for macOS and
Windows). The Electron app ended at 0.11.0, and Windows stopped there. Firn
1.0.0 (October 27, 2026) is the native Mac app (Swift, WebKit), a fresh
start that brings nothing over from the old Firn. An iPhone and iPad app is
on the way (not on the App Store yet). The site is a one-screen home page
(the logo, the lens, one line, one Download pill), plus release notes,
support, FAQ, privacy, tip jar, press kit, and `/mac` (the farewell to
Electron and Windows, kept as written but no longer linked).

**App facts** for copy (what syncs, what Firn sends, what is coming): `docs/FIRN-FACTS.md`, checked against the app 2026-11-14. Read it before changing Privacy, FAQ, or feature copy.

**Reasons and history** from the First light and Sunrise days (scroll
performance, the iPhone strip, why `?v=N` exists, the Cloudflare setup, the
link preview, the Windows note) are in `docs/DESIGN-NOTES.md`. It is not
loaded automatically: read it only when you change one of those things.

---

## The design is decided: follow it

The current design is **Frost** (approved 2026-11-24, made in Claude
Design). It replaces First light and Sunrise. It is final unless David
changes it.

- `design/frost/` is the source of truth for layout, sizes, spacing,
  colours, copy, and the lens and snow behaviour. Read `README.md` first,
  then `BRAND.md` (every value written out).
- `design/frost/pages/*.dc.html` are exports from the design tool:
  reference, never shipped. The README says how to read them. Rewrite their
  scripts as plain JavaScript and keep the numbers.
- **Three substitutions** when building from them: Gooper Deck for Fraunces
  (Fraunces 300 → Gooper Deck 400, Fraunces 500 → 600); the real logo files
  in `public/assets/` for the `/_blob/…` images; clean relative links for
  the full `https://firnbrowser.com/…` ones.
- **Replaced, reference only, don't build from them:** `design/first-light/`,
  `design/firn-sunrise/` (Sunrise and dig down), `design/about/`.

**Where the rebuild stands** (keep this list current; next one first):

- ~~Home page rebuilt as Frost (`public/index.html`, `home.css`, `home.js`)~~ done 2026-11-25.

- ~~Unused home files removed~~ done 2026-11-25 (old screenshot, snow-layer SVGs, `snow-fresh.webp`; `/about` now goes to `/`).

- ~~Inner pages step 1: `public/inner.css` (the shared Frost look) and Tip jar~~ done 2026-11-25.

- ~~Support with the FAQ; `/faq` redirects to `/support`~~ done 2026-11-25.

Inner pages, agreed plan (David, 2026-11-25: follow the design everywhere,
one step per commit, each page moves from `site.css` + `page.css` +
`edges.js` to `inner.css`; copy Tip jar's head, logo, and footer):

1. Release notes: month rail, text filter, date, headline, tags. Keep the
   `#1.0.1` addresses and `?for=iphone`.
2. Privacy, Press kit, `/mac`: no design, same pattern, words untouched.
3. 404: home with "Nothing here. **Just snow.**" and "Back home".
4. Link preview v10 on every page (`design/frost/`), then delete `site.css`,
   `page.css`, `edges.js`, and rewrite "Inner pages" below.

**Copy is final**, as written in the design files. Don't rewrite headlines
or reword claims. Every privacy claim on the site has been checked to be
true; changing the wording can make it untrue.

### Voice

- **Serial (Oxford) comma, always.** In a list of three or more, put a
  comma before the final "and" or "or": "A calm browser for Mac, iPhone,
  and iPad." This applies everywhere: page copy, page titles, meta
  descriptions, Open Graph and Twitter text, alt text, and release notes.
  (Two items take no comma: "mail and calendar".)
- **Very few words.** Firn sells the feeling, not the feature list.

### The idea (so new parts fit)

A frosted window on a snowy morning. Everything outside is soft and out of
focus, and one clear lens brings it into focus. Quiet, cold air, and a hair
of warm light low on the horizon. A lot of empty sky.

- **One pill per screen** (frosted glass, text in ink). Everything else is a
  plain underlined text link.
- **The horizon** (the faint warm band along the bottom) is light mode only.
- **Snow** is soft round out-of-focus flakes, never snowflake shapes.
- **Calm.** Everything that moves is off for `prefers-reduced-motion`. No
  carousels, pop-ups, cookie banners, chat widgets, or stock photos.

### Home page (Frost)

One screen, no scrolling: no header, no menu, no footer.

- **Markup:** one `<main>`: the blurred logo, the strip at the bottom (left:
  the tagline as the `<h1>`, "A calm browser **for Mac, iPhone, and iPad.**",
  and the links Privacy, Release notes, Tip jar; right: the frosted
  "Download" pill and "Free. Needs macOS 14 or later."), the sharp layer the
  lens shows, the snow canvas, and the lens ring.
- **Files:** `home.css` stands alone (its own `@font-face`); home does not
  load `site.css` or `edges.js`. `home.js` is the design's script in plain
  JavaScript: the lens follows the pointer slowly and drifts along the name
  after 5 seconds idle; tap or drag moves it on a phone.
- **Approved numbers:** magnify 0.35, edge light 0.7, lens speed 0.8, snow
  density 0.3.
- **iPhone and iPad:** `home.js` swaps the pill for "Firn is on the Mac
  today. iPhone and iPad are on the way." When the app is on the App Store,
  put its link in `APP_STORE_URL` at the top of `home.js`; that shows the
  design's "Download / On the App Store." pill instead.
- **JavaScript off:** the blurred logo, the text, the Mac download link, and
  the lens resting on the name (placed by CSS). No snow.
- **Reduce Motion:** snow drawn once and still; the lens stays on the name
  and does not follow the pointer (David, 2026-11-25; stricter than the
  design).
- The pointer position is used on the page only: never stored, never sent.
- theme-color and top background: #D3DBDF light, #151A27 dark.

### Inner pages (old look, until they are rebuilt as Frost)

Still the "business corner" from before Frost: `site.css` + `page.css`,
plain paper, the First light header (logo, Release notes, Support, Tip jar,
the `.hdl` Download pill, the phone and floating menus from `edges.js`), and
the glacier-ice footer (`footer.ice`) with its columns. Don't restyle them
piecemeal: they get rebuilt from `design/frost/pages/` in one go. Until
then, a header or footer change goes in every inner page.

### Keep it smooth

- No live blur on anything large that scrolls or moves. Home's blurred logo
  is a still layer on a page that doesn't scroll.
- When nothing moves, nothing runs.
- The only `backdrop-filter` is the small frosted pill.
- No `mix-blend-mode` on anything big.

### Colours and type

Frost's values are in `design/frost/BRAND.md` and at the top of
`public/home.css`. (Inner pages still use the old palette at the top of
`site.css` until they are rebuilt.)

```
Light   sky #D3DBDF → #E9ECEA · ink #241F1B · muted #5E564E
        horizon rgba(242,196,160,.20) → rgba(236,206,186,.11) at 24% → clear at 58%
        frosted pill rgba(255,255,255,.5)
Dark    sky #151A27 → #232B3F · ink #E9E3DA · muted #B9B2AA
        no horizon · frosted pill rgba(44,53,76,.5)
Type    Headlines: "Gooper Deck", Georgia, serif; weight 400, emphasis 600.
        Everything else: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif.
```

**Emphasis in headlines is weight, never colour: base 400, emphasis 600,
never heavier.**

### Dark mode: "blue hour"

Follows the visitor's system setting (`prefers-color-scheme: dark`), the same
way Firn follows the OS. No toggle. Same layout and copy. The logo is always
cream on dark (`firn-lockup-on-dark.svg`).

### Fonts

Headlines use Gooper Deck: 400, emphasis 600, never heavier. It's licensed
and can't be shared, so **the font files must never be committed**
(`.gitignore` blocks `*.woff2`, `*.woff`, `*.otf`, `*.ttf`). They load from
`https://fonts.firnbrowser.com/GooperDeck-Regular.woff2` and
`-SemiBold.woff2`, the `firn-fonts` R2 bucket on David's Cloudflare account
(setup: `docs/DESIGN-NOTES.md`, "Cloudflare setup"): `@font-face` at the top
of `site.css` and `home.css` (`font-display: swap`), both preloaded with
`crossorigin` in every page's `<head>`. The fallback is Georgia. A changed
font gets a new file name (browsers keep these for a year). Never call
Google Fonts or any other third party.

### Logo and icons

Use only the files in `assets/`. They're final; never redraw or re-type the
logo. The wordmark is Gooper Condensed Medium (Very Cool Studio), delivered
only as outlined SVGs; never add the font files to this repo, because the
license doesn't allow sharing them. `firn-lockup.svg` (5353 × 2595.2) is the
full-colour lockup; `firn-lockup-on-dark.svg` is the cream one. Favicons are
in `assets/favicon/`.

Tab favicon = bare flake (glacier-deep, lighter on dark). Home-screen icons
(180/192/512) = glacier tile. The 180 icon is the iPhone home-screen icon
(`apple-touch-icon`); 192 and 512 are listed in `public/site.webmanifest`
for Android, marked `purpose: any` (not maskable), because the flake reaches
too close to the edges to survive Android's circle crop.

### Link preview

Every page uses `public/assets/firn-share-preview-v9.png` (1200×630, the
Sunrise-era picture) until the Frost one, v10, is installed (see the list
above). Keep it a PNG, don't recompress it, and keep it small
(WhatsApp skips images over about 600 KB). `og:image` and `twitter:image`
use the full URL. A new picture gets a new file name so apps fetch it; old
versions stay in assets for old shared links.

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
- Home's lens uses the pointer position on the page only: never stored or
  sent.

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

## Pages and download

**Pages:** `/` (home), `/release-notes`, `/tip-jar`, `/support` (five questions, then email or GitHub Issues only, no Discord or Reddit since 2026-11-20; the answers must stay literally true; `/faq` redirects here; add iPhone and iPad requirements to "What does it run on?" when the app is out), `/privacy` (one-column `.post` page), `/press` (press kit: fact sheet, David's bio and headshot, and `assets/press/firn-press-kit.zip`, 25 MB (Cloudflare caps files at 25 MiB; iPhone shots are JPEG to fit), built from `design/screens-2026-10-26`, David's iPhone shots, `assets/` logos and the app repo's icon; its `README.txt` repeats the page text, so change both), and `/mac`
(one-column `.post` page, not linked from any page), plus `404.html`
(shown by Cloudflare for any missing address, so every link and file in it
starts with `/`; `noindex`). Cloudflare serves them without `.html`; links
use the clean addresses.

**Download:** home's "Download" pill links to
`https://github.com/dwurgy/firn/releases/latest/download/Firn.dmg` (always
the newest version: never put a version number in it), with "Free. Needs
macOS 14 or later." under it. iPhone and iPad: see "Home page (Frost)".
`github.com/dwurgy/firn-legacy` (linked from `/mac`) must be public and hold
the Windows code.

**Update feed:** `public/_redirects` sends `/appcast.xml` (302) to
`raw.githubusercontent.com/dwurgy/firn/main/appcast.xml`, where installed
copies of Firn check for updates. No copy of the feed lives on the site.

**Contact:** hello@firnbrowser.com, forwarded to David by Cloudflare Email
Routing. Cloudflare's Email Address Obfuscation stays off (it adds a script
and breaks the link without JavaScript).

**Release notes:** entries are `<article class="entry">` blocks, newest on
top, copied from `CHANGELOG.md` in `dwurgy/firn` in its own words: the
bold first line is the heading, then the paragraph and the list (bold
lead-ins in ink). The left column has "Firn for Mac 1.0.1" or "Firn for iPhone and iPad 1.0.1" (one
app, one version number) and the release date. Only 1.0.0 and later are
listed. A "### New" (or Better, Fixed) heading in the
CHANGELOG becomes an `<h3>`. Each entry has its own address: the
`<article>` has the version as its `id` (Mac: `id="1.0.1"`; iPhone and iPad:
`id="iphone-1.0.1"`) and `data-for="mac"` or `"iphone"` for the filter pills (All, Mac,
iPhone and iPad; inline script, `?for=iphone` picks one; `page.css`) and the name in the left column links
to it, so `firnbrowser.com/release-notes#1.0.1`
opens the page at that entry. Every release gets an entry, small ones too:
David likes showing all updates. When David says a new version is out,
add it and open the PR right away, without asking first (he asked for
that). To add a version, copy
the block (see the comment in the file), put it at the top and change the
text, including the version in its `id` and link.
Also add it to `public/release-notes.xml` (the RSS feed for feed reader apps, linked from the page's head): copy the top `<item>`, change it, and update `lastBuildDate`.

**Tip jar** (`tip-jar.html`): call it a tip jar and
tips, never "donate" or "donation". The main button is "Leave a tip on
Ko-fi" (`ko-fi.com/dwurgy`, David's tip page for all his apps); under it
"Sponsor on GitHub" (`github.com/sponsors/dwurgy`).
"No account needed" is said only for one-time Ko-fi tips (not checked for monthly).
"Other ways to help" ends with "Say hello" (hello@firnbrowser.com). It lists both
Threads accounts: @firnbrowser (major releases) and
David's @dwurgy (day to day). Feedback is GitHub Issues and email.

**Privacy:** from `docs/privacy-page.md` in `dwurgy/firn`, checked against
the app's code, plus a "What this website collects" section. Every line must be literally
true. When the app starts sending something new (e.g. passwords syncing via
iCloud Keychain once the iOS app ships), update this page first.

**Page description** (meta, Open Graph, Twitter), until the design says
otherwise: "A calm, minimalist browser with vertical tabs, spaces, and split
view. Now available for Mac."

**iPhone details** (why: `docs/DESIGN-NOTES.md`, "iPhone"): `html`/`body`
match the page top, as do the theme-color tags. Every page has
`viewport-fit=cover` and keeps clear of the notch and home bar
(`env(safe-area-inset-*)`). iOS text autosizing is off
(`-webkit-text-size-adjust: 100%`). Inner pages: `edges.js` adds `.at-end`
to `<html>` near the end of a scrolled page, and the background turns to the
footer's ice (`page.css`).

## Must-haves

- Works and looks right at phone width (393px) and at 1440px, in light and
  dark, matching `design/frost/pages/`.
- Accessible: visible focus ring, good contrast, alt text on the logo,
  decorative pieces `aria-hidden`.
- Page title, description, Open Graph and Twitter tags on every page.
- Fast: no build step; the page looks right with JavaScript off.

## Project layout

The published site lives in `public/` (so the assets above are at
`public/assets/`): the pages, `home.css` and `home.js` (home only),
`site.css`, `page.css` and `edges.js` (inner pages), `site.webmanifest`,
`robots.txt` and `sitemap.xml`. There is no server code. See README.md.

**Search engines:** `/mac` and `404.html` carry `<meta name="robots" content="noindex">`; `robots.txt` blocks nothing (a block would hide that tag); `sitemap.xml` lists every other page. A new page gets a line in `sitemap.xml`.

**Old copies in browsers:** every page links its CSS and JS as `file?v=N`:
when you change one of those files, raise its `N` on every page that links
it, so browsers fetch the new copy. `public/_headers` also tells browsers to
check for a newer CSS or JS file on every visit. (Why:
`docs/DESIGN-NOTES.md`, "Old copies in browsers".)

## How to work

- Small steps, one at a time. After each, say in plain words what changed and
  how to check it.
- Ask before adding any dependency or service.
- Commit to Git after each working step with a clear message.

- **Model:** always Opus. Never suggest switching to Sonnet or ask which model a task needs.

- **Spend David's budget carefully** (Pro plan). The aim is less bloat and less rehashing, never lower quality. Never save budget by skipping these: reading the code before editing it, checking the result at 1440px and 393px in light and dark, the privacy rules (no third-party anything, every claim literally true), the serial comma, or asking David when something is a real fork.
  - **Read less.** Find with Grep and Glob, then Read only the part you need (offset and limit). `public/site.css` is long: read the section you're changing, not the file. Don't re-read a file already read in this conversation unless it changed.
  - **Images cost the most.** Don't open old designs' screenshots (`design/first-light/shots/`, `design/about/reference/`). Look at your own result once per step, not after every small edit.
  - **Keep searching out of this conversation.** For broad questions ("where is X used", "which pages link Y"), use the Explore agent. Don't spawn agents for anything else (each starts cold).
  - **Plan before multi-page work.** Say the plan in a few lines and wait for my OK.
  - **One task per conversation, small steps.** A long conversation is re-read on every message, so its cost grows with every reply.
  - **Checkpoints.** When a step works and is committed, say so and say it's a good moment to /clear. Never suggest /compact: David always clears. Keep the "Where the rebuild stands" list current (done items struck, next one first) so a fresh conversation can pick up from "Go". Before I clear, anything worth keeping must be committed or in CLAUDE.md as a short note, not only in the chat.
  - **Short replies.** After a change: what changed, where, and how to check it, in a few lines. Don't recap the diff, repeat my request back, or paste whole files. Use Edit for changes, not rewriting a file.
  - **Quiet output.** Pipe long command output through tail or grep.
  - **Stuck rule.** After two failed attempts at the same fix, stop. Say what's known, what's been ruled out, and whether a fresh session or Opus would help. Don't try a third time.
  - **Breaks.** The conversation's saved copy goes cold after about 5 minutes idle, so resuming a long one costs a full re-read. Finish and commit a step before I step away, and suggest /clear if it's a good moment.
  - **Keep CLAUDE.md lean.** New notes are 1 to 3 lines: what changed, where, how to check it. The reasoning belongs in the commit message.
