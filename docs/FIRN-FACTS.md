<!-- Facts about the Firn app for the site's copy, checked against the app's code
     by David's app session on 2026-11-14. Every claim on the site must match this.
     Replace it when the app session sends a newer version. -->

# Firn: facts for firnbrowser.com

**Newer (2026-11-25, from David, straight from the app's code):** the Privacy page's sync, history, iPhone and iPad, summaries, tips, feedback, and crash-report text is newer than this file and wins where they differ. In short: sync is off by default and sends only spaces, open tabs' addresses and titles, and tabs sent to another device, encrypted on the device; groups, Basecamp, history, settings, sign-ins, and passwords don't sync. Apple may share crash reports if the person opted in to share analytics with developers.

These are checked against Firn's code and its plans (2026-11-14). Every claim on the site must stay literally true. Where something is planned rather than built, the site describes it as coming, without a version number or date. Use the serial comma everywhere.

## Ground rules for wording

- Firn has no account, no analytics, no telemetry, no crash reporting of its own, and no Firn server for your data.
- The only server Firn's maker runs that the app talks to is firnbrowser.com, and only for Mac update checks.
- Don't say "your data never leaves your Mac." Say "stays on your device unless you turn on iCloud sync," because sync is coming.
- Firn is coming to iPhone and iPad. The Mac app is out now.

## Shipped on the Mac today (1.0.x)

Every space is its own browser, with its own sign-ins, cookies, site data, history, Basecamp, groups, and tabs. Also: groups, Tidied away, Lookout, split view, the command bar (⌘T), saved passwords in the Mac's Keychain (with import from a CSV file), import from Arc, ad and tracker blocking, scam warnings, History (⌘Y), the ⌃Tab switcher, search suggestions (off by default), find in page, the mini player, downloads, zoom, and automatic updates.

## Coming

- **Firn for iPhone and iPad**, together with iCloud sync.
- **Reader** and **Summarize**, on Mac and iPhone.
- **Groups that name themselves**, on Mac and iPhone.
- **Links that make groups.** A link opened from a loose tab makes a group of the two.

## iCloud sync (coming, with the iPhone and iPad app)

**Off until you choose it.** The welcome asks once ("Use iCloud" or "Not Now"), and Settings › Sync has the switch. It's never turned on quietly.

**Two switches, nothing more.** "Sync with iCloud", and "Passwords" just under it. Passwords can be turned off on its own, for people who use another password manager.

**What syncs** (2026-11-25): spaces, your open tabs' addresses and titles, and any tab you send to another device. Turning sync off asks iCloud to remove that device's list of open tabs.

**What doesn't sync** (2026-11-25): groups, Basecamp, history, settings, sign-ins, and passwords.

**Where it goes:** only your own private iCloud (CloudKit's private database and iCloud Keychain). Never to Firn or any server of ours, and never a shared or public database.

**Encryption:** end-to-end for everyone, not only people with Advanced Data Protection. Firn encrypts everything on your device before it goes to iCloud, with a key kept in iCloud Keychain. Apple can't read your spaces, groups, tabs, or history. It can see only that Firn stores records, how many, and when they change.

**Not signed in to iCloud:** sync can't be turned on, and everything stays on your device. Signing out of iCloud turns sync off.

**With sync off, nothing leaves your device.** Turning it off keeps everything on your device. A "Turn off and delete from iCloud" choice is coming with sync.

**Handoff** (coming): pick up the page you're on, on another device. It works with sync on or off and stores nothing in iCloud.

## Reader (coming, Mac and iPhone)

- A calm, text-only view of an article.
- Opens only when you ask: View › Show Reader (⇧⌘R), the book button, or the command bar on the Mac; the page menu or the command bar on iPhone. On iPhone, "Reader available" shows briefly as a hint, but Reader never opens by itself.
- The article's text comes from the page you already have open and is read on your device. The article's pictures load from the site they belong to, with ads and trackers still blocked. Don't claim Reader makes no network requests.
- Built on Mozilla's open-source Readability, bundled with the app.

## Summarize (coming, Mac and iPhone)

- A few calm sentences at the top of an article, in Reader.
- Only when you ask, never automatically.
- Made on your device by Apple's on-device model (Apple's Foundation Models framework). Firn never sends the article anywhere. Firn uses only Apple's on-device model; it has no cloud option. (That the model itself stays on the device is Apple's guarantee.)
- Never saved, synced, or logged. It's gone when you close Reader.
- Needs macOS 26 or iOS 26 with Apple Intelligence turned on. Elsewhere, Summarize simply doesn't appear.

## Ad and tracker blocking (Mac now; iPhone and iPad coming)

- On by default, from the moment you open Firn.
- Uses the public EasyList and EasyPrivacy lists, built into the app. Firn never downloads them; they're updated when Firn updates.
- Turn it off everywhere in Settings, or for one site with Stop Blocking (the View menu or command bar on the Mac, the page menu on iPhone). Each space keeps its own choices.
- No list catches everything.

## Groups that name themselves (coming, Mac and iPhone)

- Each new group is named by Apple's on-device model from its tabs' titles and sites. Nothing leaves your device.
- The name keeps up as tabs join and leave the group.
- Rename a group yourself and its name never changes again.
- Always on, no setting. Needs macOS 26 or iOS 26 with Apple Intelligence; otherwise a group is called "New Group" until you rename it.

## Everything Firn sends, besides the sites you visit

1. **Site icons.** Firn asks the same site you're visiting for its icon, without its cookies or your sign-ins.
2. **The welcome's suggested sites.** Their icons are fetched the same way (Mac now; iPhone with its welcome).
3. **Search suggestions, only if you turn them on.** Off by default. Your search engine sees what you type, without your cookies or sign-ins. Engines: Google (default), Bing, DuckDuckGo, Ecosia, or Yahoo. (Mac now; iPhone coming.)
4. **Scam checks.** Apple's Safe Browsing service, the same one Safari uses (Mac now; iPhone coming).
5. **Update checks, Mac only.** Firn checks firnbrowser.com for a new version (it asks on the second launch whether to check automatically, and you can turn it off in Settings). Updates download from GitHub and install only if signed with Firn's key. On iPhone and iPad, the App Store handles updates.
6. **iCloud, only if you turn on sync** (coming).
7. **Reader's pictures**, from the article's own site, only when you open Reader (coming).

Nothing else. No analytics and no Firn server for your data.

## Saved passwords

- Mac now: kept in your Mac's Keychain, separately for each space, encrypted, and never synced today.
- Coming: on iPhone and iPad, and, if you choose, synced through iCloud Keychain (end-to-end encrypted).

## Platforms

- Mac: macOS 14 or later, out now, from firnbrowser.com.
- iPhone and iPad: coming (iOS 26), from the App Store.

## Corrections for the current privacy page

- Remove "no update checks yet". The Mac checks firnbrowser.com for updates (see above).
- Add Yahoo to the list of search engines.
- "What Firn does on your Mac" wording will need to cover iPhone and iPad, and sync, when they arrive.
