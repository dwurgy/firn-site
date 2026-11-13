// node shot.js /folder/with/header.html+assets  → firn-appstore-5244x2950.png, -3840x1646.png
const {chromium}=require('playwright');(async()=>{const d=process.argv[2];const b=await chromium.launch();
for(const [w,h] of [[5244,2950],[3840,1646]]){const p=await b.newPage({viewport:{width:w/2,height:h/2},deviceScaleFactor:2});
await p.goto(`file://${d}/header.html?w=${w/2}&h=${h/2}`);await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(400);
await p.screenshot({path:`${d}/firn-appstore-${w}x${h}.png`});await p.close();}
await b.close()})();
