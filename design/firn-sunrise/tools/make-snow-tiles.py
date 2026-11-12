from PIL import Image, ImageFilter
import numpy as np
IMG='design/firn-sunrise/photos/'
OUT='public/assets/'
def tile(src, box, name, T=512, hiA=130, loA=85, hi_rgb=(255,255,255), lo_rgb=(36,48,60), q=72):
    im=Image.open(IMG+src).convert('L').crop(box).resize((T,T),Image.LANCZOS)
    a=np.asarray(im).astype(np.float32)
    blur=np.asarray(im.filter(ImageFilter.GaussianBlur(24))).astype(np.float32)
    hp=a-blur
    sh=np.roll(np.roll(hp,T//2,0),T//2,1)
    x=np.abs(np.linspace(-1,1,T)); w=np.clip((1-np.maximum.outer(x,x))*2.2,0,1)
    t=hp*w+sh*(1-w); t=t/(np.std(t)+1e-6)
    v=np.clip(t/2.6,-1,1)
    out=np.zeros((T,T,4),np.uint8)
    pos=v>0
    out[pos,:3]=hi_rgb; out[~pos,:3]=lo_rgb
    out[...,3]=np.where(pos, v*hiA, -v*loA).astype(np.uint8)
    Image.fromarray(out,'RGBA').save(OUT+name+'.webp',quality=q,method=6,alpha_quality=70)
tile('sugary-sunlit.jpg',(250,350,1050,1150),'snow-fresh')
tile('wind-packed.jpg',(760,1180,1460,1880),'snow-packed',hiA=120,loA=95)
tile('sugary-sunlit.jpg',(250,350,1050,1150),'snow-fresh-dark',hiA=70,loA=90,lo_rgb=(8,12,18))
tile('wind-packed.jpg',(760,1180,1460,1880),'snow-packed-dark',hiA=60,loA=100,lo_rgb=(8,12,18))
