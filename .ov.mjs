import { chromium } from 'playwright';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const c = await b.newContext({ viewport:{width:1440,height:900} });
const p = await c.newPage();
await p.goto('http://127.0.0.1:4437/',{waitUntil:'domcontentloaded',timeout:120000});
await p.waitForTimeout(8000);
const r = await p.evaluate(async () => {
  const stage=[...document.querySelectorAll('.cinematic-stage-overlay')].find(s=>s.querySelector('h1,h2,h3,p'));
  const L=[...stage.children].filter(e=>e.tagName==='DIV'&&e.style.opacity!=='');
  const travel=document.body.scrollHeight-innerHeight;
  let peakBoth=0, peakAt=0, emptyRun=0, worstEmpty=0, N=1200;
  for(let i=0;i<=N;i++){
    const sp=i/N;
    window.scrollTo(0,Math.round(sp*travel));
    await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
    const ops=L.map(e=>parseFloat(e.style.opacity||1));
    const sorted=[...ops].sort((a,z)=>z-a);
    const second=sorted[1];              // how strong is the 2nd-most-visible chapter
    if(second>peakBoth){peakBoth=second;peakAt=sp;}
    if(sorted[0]<0.02){emptyRun++; if(emptyRun>worstEmpty)worstEmpty=emptyRun;} else emptyRun=0;
  }
  return {peakBoth:+peakBoth.toFixed(3), peakAt:+peakAt.toFixed(4),
    emptyPx: Math.round(worstEmpty/N*travel), travel};
});
console.log(`peak simultaneous 2nd-chapter opacity: ${r.peakBoth}  (at sp ${r.peakAt})`);
console.log(`longest window with NO chapter above 2%: ${r.emptyPx}px  (was 90px at 0.46/0.54, 54px at 0.50/0.50)`);
await b.close();
