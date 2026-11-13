// node shot.js /folder/with/header.html+assets  → firn-appstore-3840x1646.png and -logo-only.png (crops best)
const {chromium}=require('playwright');(async()=>{const d=process.argv[2];const b=await chromium.launch();
for(const [w,h] of [[3840,1646]]){const p=await b.newPage({viewport:{width:w/2,height:h/2},deviceScaleFactor:2});
for(const v of ['','logo-only']){await p.goto(`file://${d}/header.html?w=${w/2}&h=${h/2}${v?'&logo=only':''}`);await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(400);
await p.screenshot({path:`${d}/firn-appstore-${w}x${h}${v?'-'+v:''}.png`});}await p.close();}
await b.close()})();
