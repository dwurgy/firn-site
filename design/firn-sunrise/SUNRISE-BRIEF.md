# Home page redesign: "Sunrise" (brief for the firnbrowser.com session)

Approved by David on 12 Nov 2026. This folder (`design/sunrise/`) holds the design reference:

- `SUNRISE-BRIEF.md`: this file. What to build, the numbers, and the rules.
- `sunrise-mockup.dc.html`: the working mockup from Claude Design. It is a **reference, not code to copy**: it runs on the design tool's own runtime (`support.js`, `{{holes}}`, `class Component extends DCLogic`), so it won't open on its own. Read its markup, CSS, and the logic in the `<script type="text/x-dc">` block for exact values and behaviour. Where it uses New York or Georgia for headlines, the real site keeps **Gooper Deck**.
- `grain-warm.png` and `grain-light.png`: 256 × 256 seamless grain tiles (light mode and dark mode).

David also has the live mockup on claude.ai if you need to ask him how something should feel.

---

## The idea in one line

The home page becomes **one long scroll that is one sunrise**: it starts at blue hour behind the headline, warms through dawn as you read, and the sun clears the snow at the download button. The page has texture you can feel: soft snow grain everywhere, and the cursor leaves footprints in it.

Calm stays the rule. Everything moves only because the visitor scrolls or moves the mouse. Nothing loops, nothing pins the scroll, nothing makes anyone wait.

---

## Page order (desktop)

1. **Header**: on-dark lockup; About, Release notes, Support, Tip jar; small Download pill.
2. **Hero** (blue hour): "Firn 1.0 is here" pill; headline and subhead as live; Download for Mac; "Or try it right here ↓"; small print: "Free. Needs macOS 14 or later. Signed and notarized by Apple."
3. **Try it**: "All the good ideas. None of the homework." + "Made-up pages, real layout. Go on, click around." An interactive Firn window, then four tour cards (Spaces, Basecamp, Lookout, Split view) using the live site's feature copy. Clicking a card does the thing in the window.
4. **The real thing**: keep the current hero screenshot (the real app, light and dark) as a still image under the try-it section, so visitors see the real app as well as the demo. (Not in the mockup; David approved it in chat.)
5. **Coming from Arc? Bring it along.** Copy and the three mappings exactly as in the mockup.
6. **Less, on purpose.** The live section, unchanged in words.
7. **Who's making it**: copy exactly as in the mockup, ending with "More about me" → /about.
8. **Finale**: "Here comes the morning." + Download + small print, then the snow cross-section with the sun rising behind it, the "Why it's called Firn." card on the top layer.
9. **Footer** in the bottom ice layer (same colour as the deepest snow layer): Firn / Community / Support columns as live, "Built with" note, and "Firn · A David Wurgler app · © 2026".

The current four feature rows (still screenshots) are replaced by the try-it window and tour cards. Release notes, About, Support, FAQ, Privacy, Tip jar, and /mac stay their own pages.

**New copy** in the mockup (hero line, try-it lines, Arc section, Who's making it, finale, notarized line, phone lines) is approved. Everything else keeps the live wording. Serial comma everywhere.

---

## Behaviour and numbers

### Sky
- Light: one long vertical gradient over the whole page, from blue hour at the top to a pale warm morning at the bottom. Stops are in the mockup's `.sky` rule. Two soft apricot glows sit mid-page (`.warmglow`).
- Dark (follows the visitor's system): blue hour all the way down (`.sky.dark`). The sun never clears the snow; only a faint glow.
- Text colours change by section so contrast always passes (light text on the dark top, ink lower down). Check every section for 4.5:1.

### Grain (everywhere)
- A tiled grain layer under all content (`grain-warm.png` light, `grain-light.png` dark), at about 45% opacity. It must be a plain repeating image, never a live SVG filter over the page.

### Snow
- Snow layers use the brand's five glacier tints (dusk tints in dark mode), with a grainy speck texture and slightly uneven, hand-cut edges. In the real build, bake that texture into an image or a static layer; don't re-run filters while things move.
- **A Space's colour tints the snow.** Switching Space in the try-it window re-tints the bottom snow and the drift (light and dark). The sky never changes.

### Sunrise (finale)
- The sun (150px disc, warm apricot, soft glow) starts hidden behind the snow and rises about 300px as the finale scrolls into view. A warm band brightens the sky just above the snowline as it rises. Transform and opacity only.

### Drift
- A thin strip of snow along the bottom of the viewport. It appears after a little scrolling, grows from about 6px to 52px with scroll depth, and fades away as the finale snow arrives. `pointer-events: none`.

### Mouse: wading through snow (desktop, fine pointer only)
- **Snow edges** (drift and finale snow) dip under the cursor when it's near: a soft hollow about 64 units wide with slightly raised rims, deepest in the top layer (16, then 7, then 2.5). It follows quickly and refills slowly (about a second).
- **Grain**: a small clearing right under the cursor (about 6px clear, fading out by 20px) and a faint 56px rim of grain pushed outward. It trails the cursor slightly and settles back when the mouse stops.
- **Footprints**: every 66px of travel, a soft print (13 × 26px, toe and heel, no tread) alternates about 10px left and right of the path and points the way you're walking. Each fades over about 2.4s. A pressed hollow with light catching its lower edge, no outline (outlines made them read as rings). Visible in both light and dark. A new trail starts after the mouse rests for 0.6s.
- Off completely for `prefers-reduced-motion`, touch screens, and `(hover: none)`. When the mouse is still, nothing runs: zero CPU at idle.

### Try-it window
- Plain HTML, CSS, and vanilla JS (no framework). Three Spaces (Personal, Work, Kitchen), each with its own Basecamp tiles and tabs; tabs switch the page; links open Lookout ("Keep as tab" adds a tab); Split view shows two pages. The data and pages are in the mockup.
- **Make it look exactly like the real app**: the sidebar, spacing, radii, shadows, and dark mode. The real screenshots are in `dwurgy/firn` under `docs/screenshots/` (light and dark); match them more closely than the mockup does. Use made-up sites only: no real brands, no Wikipedia.
- Keyboard and screen-reader friendly: real buttons, a visible focus ring, sensible labels.

### Phone (600px and under, per CLAUDE.md)
- No download button. Instead: "Firn is for Mac. Open this page on your Mac to download it." and, in the hero, "iPhone and iPad are on the way."
- The try-it window stacks (sidebar on top, page below). No split view.
- One column throughout; smaller headlines.

---

## Creative freedom

David wants this to feel even more believable, tactile, and textured than the mockup, and he's happy for you to suggest better ways to get there. Ideas worth exploring:

- Light that feels real on the grain and snow: a slight sheen or shadow on the grain that follows the sun's position, so the texture has depth.
- Footprints and hollows that actually displace the grain (pressed in, with grains piled at the edges), not just a soft shadow.
- A small canvas or WebGL layer for the snow and prints, if it's clearly better and stays light.
- Subtle variation, so no two footprints look identical.

**Rules for that freedom:**
- Propose first: two or three options, each with how it looks, what it costs (size, CPU, battery), and the fallback. David picks before you build.
- Calm beats clever. If an effect draws the eye away from the words, it's too much.
- No dependencies, libraries, or services without asking (CLAUDE.md). Everything loads from firnbrowser.com or fonts.firnbrowser.com.
- Privacy: mouse position and scroll are used on the page only, never stored or sent anywhere.
- Performance budget: smooth 60fps scrolling on an older MacBook Air, zero work when nothing moves, total new JS under about 30 KB, and a full fallback (static grain, still snow) if WebGL or anything else isn't available.
- Keep CLAUDE.md's "Keep scrolling smooth" rules: no large backdrop blurs, no big blended layers, and no live filters on anything that scrolls.

---

## Suggested build steps (one at a time; stop after each for David to look)

1. Sky gradient (light and dark) and the tiled grain layer. Remove the old sky and glows.
2. Hero and header updates, including the phone-only lines.
3. The try-it window and tour cards (matching the real app), plus the real screenshot below it.
4. Arc section, Who's making it, and the finale's copy and layout.
5. Snow: the finale cross-section, footer in the ice layer, Space-tinted colours, and the sunrise on scroll.
6. ~~The drift.~~ Dropped (2026-11-12): with dig down the page is already snow.
7. Mouse effects: snow-edge hollows, grain clearing, and footprints.
8. Phone and dark-mode pass, reduced motion, accessibility, and performance check.
9. Creative pass: propose the tactile upgrades, then build the one David picks.

Update CLAUDE.md as you go (the design is no longer First light's original home page), and raise `?v=N` on every changed CSS and JS file.
