# Hand-cut snow edges for the home page's "dig down" layers.
# Run from the repo root:  python3 -I design/firn-sunrise/tools/make-snow-edges.py
#
# snow-edges.json holds the five edge curves from step 5's snow art: x in %
# and y from 0 (highest point) to 1 (lowest), scaled in CSS by the layer's
# edge height --ea. This script writes, all static (nothing moves on scroll):
#   - home.css, between "edges:start" and "edges:end": each layer's
#     clip-path, the cut top edge;
#   - index.html, inside <svg class="crest" data-e="N"> (top of layer N):
#     the sunlit lip, a thin light line along the edge and a few soft bands
#     just under it, so the snow has a rounded, lit top face;
#   - index.html, inside <svg class="sh" data-e="N"> (bottom of the layer
#     above N): the shadow layer N casts on the one behind it, a few copies
#     of N's edge shifted up at very low alpha (cut paper).
import json, re

T = 'design/firn-sunrise/tools/'
edges = json.load(open(T + 'snow-edges.json'))


def f(v):
    return ('%.3f' % v).rstrip('0').rstrip('.')


def clip(pts):
    p = ','.join('%s%% calc(var(--ea)*%s)' % (f(x), f(y)) for x, y in pts)
    return 'polygon(0 100%%,%s,100%% 100%%)' % p


def line(pts, dy=0.0):
    return ' '.join('%s,%s' % (f(x), f(y + dy)) for x, y in pts)


# Crest strip: viewBox 0 0 100 1.6, laid over the layer's top 1.6 x --ea.
# One copy of the edge, reused (<use>) a little lower for each lip band.
LIP = [0.05, 0.11, 0.19, 0.3, 0.45]


def crest(n, pts):
    uses = ''.join('<use href="#cr%d" y="%s"/>' % (n, f(k)) for k in LIP)
    return ('<svg class="crest" data-e="%d" aria-hidden="true" viewBox="0 0 100 1.6" '
            'preserveAspectRatio="none"><defs><path id="cr%d" d="M0,-1L%sL100,-1Z"/></defs><g class="lip">%s</g>'
            '<polyline class="rim" points="%s"/></svg>') % (n, n, line(pts).replace(' ', 'L'), uses, line(pts))


# Shadow strip: viewBox 0 -0.6 100 1.6, the bottom of the layer above,
# where 0..1 is the overlap the next layer's edge covers. Many faint copies,
# spaced closer near the edge, so the shadow fades smoothly.
CAST = [round(0.6 * (i / 10) ** 1.6, 3) for i in range(1, 11)]


def shadow(n, pts):
    uses = ''.join('<use href="#sh%d" y="%s"/>' % (n, f(-k)) for k in CAST)
    return ('<svg class="sh" data-e="%d" aria-hidden="true" viewBox="0 -0.6 100 1.6" '
            'preserveAspectRatio="none"><defs><path id="sh%d" d="M%sL100,2L0,2Z"/></defs>%s</svg>') % (
        n, n, line(pts).replace(' ', 'L'), uses)


css = '\n'.join('.l%d{clip-path:%s}' % (n, clip(edges['l%d' % n])) for n in range(1, 6))
p = 'public/home.css'
s = open(p).read()
s = re.sub(r'(/\* edges:start[^*]*\*/)\n?.*?\n?(/\* edges:end \*/)',
           lambda m: m.group(1) + '\n' + css + '\n' + m.group(2), s, flags=re.S)
open(p, 'w').write(s)

p = 'public/index.html'
s = open(p).read()
for n in range(1, 6):
    pts = edges['l%d' % n]
    s = re.sub(r'<svg class="crest" data-e="%d".*?</svg>' % n,
               lambda m: crest(n, pts), s, flags=re.S)
    s = re.sub(r'<svg class="sh" data-e="%d".*?</svg>' % n,
               lambda m: shadow(n, pts), s, flags=re.S)
open(p, 'w').write(s)
print('edges written')
