const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1200,height:630}});
await p.goto('file://'+process.argv[2]+'/og.html');await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(300);
console.log(await p.evaluate(()=>[...document.fonts].map(f=>f.weight+':'+f.status).join(' ')));
await p.screenshot({path:process.argv[2]+'/v7.png'});await b.close()})();
