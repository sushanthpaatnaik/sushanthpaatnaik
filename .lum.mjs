import { chromium } from 'playwright';
import { PNG } from 'pngjs';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const c = await b.newContext({ viewport:{width:1440,height:900} });
const p = await c.newPage();
await p.goto('http://127.0.0.1:4415/',{waitUntil:'domcontentloaded',timeout:90000});
await p.waitForTimeout(7000);
const travel = await p.evaluate(()=>document.body.scrollHeight-innerHeight);
const rows=[];
for (let i=0;i<=44;i++){
  const sp = 0.660 + (i/44)*0.180;                 // 0.660 -> 0.840
  await p.evaluate(y=>window.scrollTo(0,y), Math.round(sp*travel));
  await p.waitForTimeout(170);
  const buf = await p.screenshot({ clip:{x:0,y:120,width:1440,height:700} });
  const png = PNG.sync.read(buf);
  let s=0, n=0;
  for (let k=0;k<png.data.length;k+=4){ s += 0.2126*png.data[k]+0.7152*png.data[k+1]+0.0722*png.data[k+2]; n++; }
  // also read the two shields' effective opacity
  const shields = await p.evaluate(()=>{
    const stage=[...document.querySelectorAll('.cinematic-stage-overlay')].find(s=>s.querySelector('h1,h2,h3,p'));
    const layers=[...stage.children].filter(e=>e.tagName==='DIV'&&e.style.opacity!=='');
    return layers.map(L=>+parseFloat(L.style.opacity||1).toFixed(3));
  });
  rows.push({sp:+sp.toFixed(4), lum:+(s/n).toFixed(2), op3:shields[3], op4:shields[4]});
}
const base = rows[0].lum;
console.log('  sp      meanLum   vs start   op3    op4');
for (const r of rows) console.log(`  ${r.sp.toFixed(4)}  ${String(r.lum).padStart(7)}   ${((r.lum/base-1)*100).toFixed(1).padStart(6)}%   ${String(r.op3).padStart(5)} ${String(r.op4).padStart(6)}`);
const peak = rows.reduce((a,r)=>r.lum>a.lum?r:a);
const lo   = rows.reduce((a,r)=>r.lum<a.lum?r:a);
console.log(`\n  brightest ${peak.lum} at sp=${peak.sp}   darkest ${lo.lum} at sp=${lo.sp}   swing ${(peak.lum-lo.lum).toFixed(1)} (${((peak.lum/lo.lum-1)*100).toFixed(0)}%)`);
await b.close();
