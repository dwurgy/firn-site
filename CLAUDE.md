# Project Brief: firnbrowser.com

The website for **Firn**, a calm, minimalist desktop browser (the app lives in
the separate `dwurgy/firn` repo). Built by David with Claude. David is not a
professional developer: explain decisions in plain language, keep changes
small, and stop after each step so he can look at it.

Right now this is a **coming-soon site**: a home page that says what Firn is,
shows what it looks like, and collects emails from people who want to try it,
plus a release notes page and a support page. A fuller site (download button,
privacy page) comes later, when Firn has an installer ready for testers.

---

## The design is decided: follow it

The current design is **First light**, made in Claude Design. It is final
unless David changes it.

- `design/first-light/`: the finished design. `index.html`,
  `release-notes.html` and `support.html` with one shared `site.css`, the
  assets they use, a short `README.md`, and `shots/` with every page at
  1440px and 393px in light and dark. It's the source of truth for layout,
  sizes, spacing, colours and copy.
- The live site is built from it: `public/site.css` is the design's
  `site.css` (minus its `.theme-dark` block, which only exists for the
  design tool) plus a few live-site additions at the end. The live pages
  use the design's markup with the real head (favicons, Open Graph), clean
  links and the working sign-up form. At 1440px and 393px they render
  pixel for pixel like the design files.
- `design/share-preview-reference.html` and `assets/firn-share-preview-v3.png`:
  the 1200×630 image shown when someone shares the link (Open Graph / Twitter
  card). It keeps the earlier snow art (`design/assets/firn-snow-layers.svg`).

**Copy is final**, as written in the design files (including the line break
in the home subhead). Don't rewrite headlines or reword claims. Every privacy
claim on the site has been checked to be true; changing the wording can make
it untrue.

### First light: the idea (so new parts fit)

Sunrise in a snowy cabin near Sisters, Oregon, with a fresh cup of coffee in
hand. Cool glacier light high up, warm sunrise low.

- **Edge to edge.** No frame around the page any more: the page colour runs
  to the window edges.
- **Sky glow.** Each page starts with a soft morning sky (`.sky`): cool
  glacier blue at the top, warm peach and rose glows lower down, fading out
  as you scroll. Inner pages use a shorter sky (`.sky.short`).
- **Paper grain.** A faint warm noise texture over the whole page
  (`.sheet::after`, an inline SVG filter, no image file).
- **Frosted glass.** The window mockup, the footer pills, the support cards
  and the release-note badges are semi-clear panels with a soft edge and a
  `backdrop-filter` blur. Where a browser can't blur, the semi-opaque
  background alone still reads fine.
- **Colour light behind the window.** On the home page, blurred patches of
  glacier, sunrise, sage and lilac light (`.light`) sit behind the frosted
  window mockup.
- **Sunrise snow footer ("dawn").** Every page ends in the snow layers with
  the sun rising behind them (`.dawn`, `.sun`, `.snow`). The snow art is
  the "clear" version (`firn-snow-layers-clear.svg`, dark:
  `firn-snow-layers-dark-clear.svg`), without its own sky, so the glow shows
  through. Two frosted pills sit on the snow: "Free and open source, MPL 2.0"
  and the footer links (GitHub, Reddit, Release notes, Support).
- **Drifting flakes.** A few faint Firn flakes float in the home hero
  (`.fl`). They're hidden below 1000px wide, where they would land on text.
  No crystal or flake may sit on text.
- **Blue is for branding only.** Logo, snow, flakes, glows. Buttons, links
  and text stay in warm neutrals. The main button is ink with page-white text.
- **Calm.** Generous space; motion is only small 200ms hover/focus
  transitions, switched off for `prefers-reduced-motion`. No carousels,
  pop-ups, cookie banners, chat widgets or stock photos.

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

### Dark mode: "blue hour"

Follows the visitor's system setting (`prefers-color-scheme: dark`), the same
way Firn follows the OS. No toggle. Same layout and copy; the sky turns to a
dim blue-hour glow, glass darkens, the sun is a low ember behind dark snow,
the grain switches to a soft-light blend, and the header logo swaps to
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
- Email sign-ups are stored on David's own Cloudflare account (a small Worker
  plus a D1 database), never a third-party form or mailing-list service. Store
  only the email address and the date. Add a simple way for David to export
  the list. Basic protection against spam (rate limit, honeypot field).

---

## Hosting

- Cloudflare Pages, connected to this GitHub repo, so every push publishes.
- The domain firnbrowser.com is already on David's Cloudflare account (his
  personal site is there too). Walk him through connecting the custom domain
  step by step, in plain words.
- Keep it a simple static site: plain HTML and CSS, plus the one Worker for
  sign-ups. No framework unless there's a strong reason; ask first.

## Cloudflare setup

These settings live in David's Cloudflare dashboard, not in this repo. They're
written down here so the setup can be understood or rebuilt. Never put the
export password (or any other secret) in this repo.

- **Pages project** `firn-site`, connected to GitHub `dwurgy/firn-site` (the
  Cloudflare GitHub app only has access to this repo). Production branch
  `main`, framework preset None, no build command, build output directory
  `public`. Every merge to `main` publishes; other branches get preview
  addresses.
- **Domains:** firnbrowser.com and www.firnbrowser.com, added under the
  project's Custom domains. The project's own address,
  `firn-site-e8s.pages.dev`, redirects to firnbrowser.com (see below).
- **Database:** D1 database `firn-signups`, created by running
  `migrations/0001_create_signups.sql` in its Console. Bound to the project
  as `DB` (Settings → Bindings, Production only).
- **Export password:** secret `EXPORT_PASSWORD` (Settings → Variables and
  Secrets, Production only). It protects `/admin/export`; without it that page
  doesn't exist. To change it, edit the secret, then redeploy.
- Changes to bindings or secrets only take effect after a new deployment
  (Deployments → ⋯ → Retry deployment).
- Preview deployments have no database, so sign-ups there show an error.
  That's expected.
- **Spam limit:** a rate limiting rule on the firnbrowser.com zone
  (Security → WAF), named "Sign-up limit". When URI Path equals
  `/api/signup`, per IP, more than 5 requests in 10 seconds: block for 10
  seconds. The free plan allows one such rule.
- **pages.dev redirect:** account-level Bulk Redirects. The list
  `pages_dev_redirect` sends `firn-site-e8s.pages.dev` to
  `https://firnbrowser.com` (301), with preserve query string, subpath
  matching and preserve path suffix on, and "include subdomains" off so
  preview addresses keep working. An enabled Bulk Redirect rule uses that
  list. This is done in the dashboard rather than in code so that static
  files don't count against the Functions request allowance.

## Pages, header and sign-up

**Pages:** `/` (home), `/release-notes`, `/support`, and `/thanks` (only
seen after signing up with JavaScript off). Cloudflare serves them without
`.html`; links use the clean addresses.

**Header (every page):** logo on the left; "Release notes" and "Support" on
the right, with `aria-current="page"` on the current page.

**Footer (every page):** the dawn snow section with its two pills, always at
the bottom of the page.

**Release notes:** entries are `<article class="entry">` blocks, newest on
top. The current ones are marked "Sample entry". To add a version, copy one
block (see the comment in the file), put it at the top and change the text.

**Support:** the main button goes to GitHub Sponsors
(`github.com/sponsors/dwurgy`), so Sponsors must be set up on that account.

**Copy notes (home):**
- Eyebrow: "Coming soon to macOS, Windows and Linux"; on phones "Coming
  soon".
- Subhead: "Vertical tabs, spaces and split view, without the learning
  curve.<br> Your data stays on your device." (the line break is
  intentional and hidden on phones).
- Sign-up: placeholder "Your email"; visually hidden label "Email address,
  to hear once when Firn is ready".
- Thank-you: "Thank you. One email when Firn is ready, nothing else."
- Error for a mistyped address: "That doesn't look like an email address."
- Page description (meta, Open Graph, Twitter): "A calm, minimalist browser
  with vertical tabs, spaces and split view. Coming soon to macOS, Windows
  and Linux."

**Sign-up capsule:** one box (max 420px, 56px tall, radius 14px) holding the
borderless email field and the Notify me button. The whole box gets the
frost ring while it has focus. After a successful sign-up, `signup.js` hides
the form and un-hides the `.thanks` paragraph. The hidden "website" field is
the spam trap; `.signup-error` shows the error messages. Without JavaScript
the form posts normally and lands on `/thanks`.

**Phone (max-width: 600px):** the design's phone block at the end of
`site.css`: tighter header and hero, h1 46px, single-column features and
statement, the window mockup shrunk as one picture (`zoom`), footer pills
stacked.

## Must-haves

- Works and looks right at phone width (see `design/first-light/shots/`).
  On phones the window mockup shrinks as one picture rather than squashing
  its sidebar. It will become a real screenshot image later.
- Accessible: real `<label>` for the email field (visually hidden), visible
  focus ring (frost), good contrast, alt text on the logo, `aria-current`
  on the current page, decorative pieces `aria-hidden`.
- Page title, description, Open Graph and Twitter tags on every page, using
  `assets/firn-share-preview-v3.png`.
- Fast: no build step; no JavaScript needed for the look.

## Placeholders to fill later

- `[Screenshot of Firn goes here]` in the window mockup: David will provide a
  real screenshot.
- The "Coming soon to macOS, Windows and Linux" eyebrow (phone: "Coming
  soon") may change.
- The release notes entries are samples until the first real version.

## Project layout

The published site lives in `public/` (so the assets above are at
`public/assets/`): the three pages plus `thanks.html`, `site.css`,
`signup.js` and `site.webmanifest`. Sign-up code is in `functions/` (Cloudflare Pages
Functions, D1 database bound as `DB`), the database setup in `migrations/`.
See README.md.

## How to work

- Small steps, one at a time. After each, say in plain words what changed and
  how to check it.
- Ask before adding any dependency or service.
- Commit to Git after each working step with a clear message.
