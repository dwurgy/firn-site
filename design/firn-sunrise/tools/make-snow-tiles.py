# Snow texture tiles for the home page's "dig down" layers.
# Run from the repo root:  python3 -I design/firn-sunrise/tools/make-snow-tiles.py
#
# Each tile is white with only the alpha changing, so one tile can sit on
# any layer colour (space tinting still works) and compresses small. CSS
# puts it over a slightly darker base colour: where the tile is clear you see
# the shadowed grain, where it's opaque the sunlit crystals.
#
# 1. Crop the photo and turn it grey.
# 2. High-pass it (photo minus a blurred copy): keeps the crystals and
#    ripples, drops the photo's own lighting.
# 3. Add a little relief: the grain read as a height map, lit from the low
#    sun (upper left), so the bumps have a bright and a shadow side.
# 4. Make it seamless: cross-fade with a copy shifted half a tile.
# 5. A few crisp glints (the brightest crystals) for sparkle.
from PIL import Image, ImageFilter
import numpy as np

IMG = 'design/firn-sunrise/photos/'
OUT = 'public/assets/'


def tile(src, box, name, T=512, blur=22, relief=0.55, base=0.26, gain=0.27,
         glints=0.0, q=50):
    im = Image.open(IMG + src).convert('L').crop(box).resize((T, T), Image.LANCZOS)
    a = np.asarray(im).astype(np.float32)
    lo = np.asarray(im.filter(ImageFilter.GaussianBlur(blur))).astype(np.float32)
    hp = a - lo
    hp /= np.std(hp) + 1e-6
    # Relief: slope of a softened height map, lit from the upper left.
    h = np.asarray(Image.fromarray(np.clip(hp * 40 + 128, 0, 255).astype(np.uint8))
                   .filter(ImageFilter.GaussianBlur(1.2))).astype(np.float32)
    gy, gx = np.gradient(h)
    lit = -(gx * 0.8 + gy * 0.6)
    lit /= np.std(lit) + 1e-6
    t = hp * (1 - relief) + lit * relief
    # Seamless: centre from the original, edges from a half-shifted copy.
    sh = np.roll(np.roll(t, T // 2, 0), T // 2, 1)
    x = np.abs(np.linspace(-1, 1, T))
    w = np.clip((1 - np.maximum.outer(x, x)) * 2.2, 0, 1)
    w = w * w * (3 - 2 * w)
    t = t * w + sh * (1 - w)
    t /= np.std(t) + 1e-6
    al = base + gain * np.tanh(t / 2.2) * 1.0
    if glints:
        g = np.clip((t - 3.0) / 1.0, 0, 1)
        al = np.where(g > 0, np.maximum(al, base + gain + glints * g), al)
    al = np.clip(al, 0, 1)
    out = np.zeros((T, T, 4), np.uint8)
    out[..., :3] = 255
    out[..., 3] = (al * 255).round().astype(np.uint8)
    Image.fromarray(out, 'RGBA').save(OUT + name + '.webp', quality=q, method=6,
                                      alpha_quality=15)
    print(name, round(al.mean(), 3))


FRESH = ('sugary-sunlit.jpg', (250, 350, 1050, 1150))
PACKED = ('wind-packed.jpg', (760, 1180, 1460, 1880))
tile(*FRESH, 'snow-fresh', glints=0.35)
tile(*PACKED, 'snow-packed', blur=26, relief=0.65)
