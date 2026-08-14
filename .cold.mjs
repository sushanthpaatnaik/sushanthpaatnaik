import { chromium } from 'playwright';
const URL = process.argv[2], LABEL = process.argv[3];
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const c = await b.newContext({ viewport:{width:1440,height:900}, bypassCSP:true });
const p = await c.newPage();
const cdp = await c.newCDPSession(p);
await cdp.send('Network.enable');
await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
// deliberately slow: ~400kbps down, 300ms RTT — frames will NOT be resident
await cdp.send('Network.emulateNetworkConditions',
  { offline:false, downloadThroughput: 400*1024/8, uploadThroughput: 400*1024/8, latency: 300 });

await p.goto(URL, { waitUntil:'domcontentloaded', timeout:180000 });
await p.waitForTimeout(1200);            // start scrolling almost immediately

const travel = await p.evaluate(()=>document.body.scrollHeight-innerHeight);
const LAST = 475;
const res = [];
// scrub hard through the whole film while it is still downloading
for (let k=0; k<=18; k++) {
  const sp = (k%2===0) ? k/18 : 1-(k/18);     // zig-zag: forces reversals
  await p.evaluate(y=>window.scrollTo(0,y), Math.round(sp*travel));
  await p.waitForTimeout(160);
  const r = await p.evaluate(async (LAST) => {
    const cv=[...document.querySelectorAll('canvas')].find(c=>{try{return !!c.getContext('2d')}catch{return false}});
    const travel=document.body.scrollHeight-innerHeight;
    const sp = Math.max(0,Math.min(1, scrollY/travel));
    const want = Math.round(sp*LAST);
    // what is actually painted
    const t=document.createElement('canvas'); t.width=32;t.height=20;
    const g=t.getContext('2d'); g.drawImage(cv,0,0,32,20);
    const drawn=[...g.getImageData(0,0,32,20).data];
    // what SHOULD be painted, fetched independently at full fidelity
    const idx=String(want+1).padStart(4,'0');
    const img=new Image(); img.src=`/sequences/founder-film/frame_${idx}.webp`;
    try { await img.decode(); } catch { return {want, skip:1}; }
    const t2=document.createElement('canvas'); t2.width=32;t2.height=20;
    const g2=t2.getContext('2d');
    // same object-fit:cover geometry as the real draw
    const s=Math.max(32/img.width,20/img.height), dw=img.width*s, dh=img.height*s;
    g2.drawImage(img,(32-dw)/2,(20-dh)/2,dw,dh);
    const ref=[...g2.getImageData(0,0,32,20).data];
    let sum=0,n=0;
    for(let i=0;i<drawn.length;i+=4){
      sum+=(Math.abs(drawn[i]-ref[i])+Math.abs(drawn[i+1]-ref[i+1])+Math.abs(drawn[i+2]-ref[i+2]))/3; n++;
    }
    return {want, diff:+(sum/n).toFixed(1)};
  }, LAST);
  if(!r.skip) res.push(r);
}
const bad = res.filter(r=>r.diff>28);
console.log(`\n===== ${LABEL} =====`);
console.log(`  samples ${res.length}  (throttled 400kbps/300ms, cache disabled, scrubbing during download)`);
console.log(`  drawn-vs-correct-frame difference:  max ${Math.max(...res.map(r=>r.diff))}  median ${res.map(r=>r.diff).sort((a,z)=>a-z)[Math.floor(res.length/2)]}`);
console.log(`  samples showing UNRELATED imagery (diff>28): ${bad.length}${bad.length?'  '+JSON.stringify(bad.slice(0,6)):''}`);
await b.close();
