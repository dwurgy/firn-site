# First light: the firnbrowser.com design

Open index.html, release-notes.html and support.html in a browser. They are the
finished design: one shared stylesheet (site.css), light mode ("first light")
and dark mode ("blue hour") via prefers-color-scheme, and a phone layout below
600px. Pages run edge to edge: no frame around the page. shots/ has every page
at 1440px and 393px in both modes.

The feeling: sunrise in a snowy cabin near Sisters, Oregon, with a fresh cup of
coffee in hand. Cool glacier light high up, warm sunrise low, warm paper grain,
frosted glass over colour, and every page ending in snow with the sun rising
behind it.

The `.theme-dark` class in site.css only exists so the design tool can show
dark mode side by side; the real site needs just the prefers-color-scheme block.
