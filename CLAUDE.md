# Project Brief: firnbrowser.com

The website for **Firn**, a calm, minimalist desktop browser (the app lives in
the separate `dwurgy/firn` repo). Built by David with Claude. David is not a
professional developer: explain decisions in plain language, keep changes
small, and stop after each step so he can look at it.

Right now this is a **coming-soon page**: one page that says what Firn is,
shows what it looks like, and collects emails from people who want to try it.
A fuller site (download button, features, privacy page) comes later, when Firn
has an installer ready for testers.

---

## The design is decided: follow it

The design was made in Claude Design and is final unless David changes it.

- `design/coming-soon-reference.html`: the page as plain HTML with inline
  styles. It's the source of truth for layout, sizes, spacing, colors and copy.
  Rebuild it cleanly (move styles into a stylesheet), but the result should
  look identical.
- `design/coming-soon-desktop.png` and `design/coming-soon-phone.png`: how it
  should look at 1440px and at phone width.
- `design/share-preview-reference.html` and `assets/firn-share-preview.png`:
  the 1200×630 image shown when someone shares the link (Open Graph / Twitter
  card).

**Copy is final.** Don't rewrite headlines or reword claims. Every privacy
claim on the page has been checked to be true; changing the wording can make it
untrue.

### The idea behind it (so new parts fit)

- **The site is a Firn window.** A warm sand frame (`#E9E3DA`) surrounds a
  page-white sheet (`#FBFAF8`) that floats inside it: 12px inset, 14px corners,
  Firn's warm-brown shadow. Same as a web page inside the app.
- **The snow layers** (`assets/firn-snow-layers.svg`) are the snow-to-firn-to-ice
  cross-section in five glacier tints. They sit at the bottom of the hero,
  full width, at their natural height (`background-size: 100% auto`, pinned to
  the bottom), never stretched to cover the hero. The window mockup overlaps
  them so it looks like it's resting on the snow. The few faint crystals in
  that art must not sit on top of text: adjust the hero spacing if one does.
- **Blue is for branding only.** It appears in the logo, the snow layers and
  the link preview. Buttons, links and text stay in warm neutrals. The main
  button is ink (`#241F1B`) with page-white text.
- **Calm.** Generous space, nothing busy, no animations beyond a gentle 200ms
  ease-out on hover/focus. No carousels, pop-ups, cookie banners (there are no
  cookies), chat widgets or stock photos.

### Tokens

```
Colors   frame #E9E3DA · page #FBFAF8 · ink #241F1B · ink-muted #5E564E
         ink-faint #9D9389 (placeholders only) · glacier #7F9CB0
         glacier-deep #6E98B2 · frost rgba(130,168,190,0.45) (focus ring)
         space colors (used in the window mockup): Sage #8FAE8B,
         Sand #C9A27E, Lagoon #6FA3A0, Glacier #7F9CB0
Type     Headlines: Fraunces with soft corners on and wonky letters off
         (font-variation-settings 'SOFT' 100, 'WONK' 0; optical sizing auto),
         weight 360–400. Everything else: system-ui, -apple-system,
         'Segoe UI', sans-serif.
Radius   10px fields and buttons · 12px the floating page · 14px cards/panels
Shadows  page: 0 1px 3px rgba(60,40,20,.14), 0 6px 20px rgba(60,40,20,.2)
         window: 0 2px 8px rgba(40,28,16,.14), 0 18px 48px rgba(40,28,16,.22)
```

### Fonts

Self-host Fraunces from `assets/fonts/fraunces.woff2` (a variable font; keep
`Fraunces-OFL.txt` next to it, the license requires it). The reference file
loads it from Google Fonts only for convenience: the real site must not call
Google or any other third party.

### Logo and icons

Use only the files in `assets/`. They're final; never redraw or re-type the
logo. `firn-lockup.svg` is the header logo (about 34px tall). Favicons are in
`assets/favicon/`.

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

## Must-haves

- Works and looks right at phone width (see the phone screenshot). On phones,
  the window mockup should shrink as one picture rather than squash its
  sidebar. It will become a real screenshot image later.
- Accessible: real `<label>` for the email field, visible focus ring (frost),
  good contrast, alt text on the logo.
- Page title, description, Open Graph and Twitter tags using
  `assets/firn-share-preview.png`.
- Fast: no build step needed to view it; images and fonts sized sensibly.

## Placeholders to fill later

- `[Screenshot of Firn goes here]` in the window mockup: David will provide a
  real screenshot.
- The "Coming soon to Windows, then macOS and Linux" line may change.

## Project layout

The published site lives in `public/` (so the assets above are at
`public/assets/`). Sign-up code is in `functions/` (Cloudflare Pages
Functions, D1 database bound as `DB`), the database setup in `migrations/`.
See README.md.

## How to work

- Small steps, one at a time. After each, say in plain words what changed and
  how to check it.
- Ask before adding any dependency or service.
- Commit to Git after each working step with a clear message.
