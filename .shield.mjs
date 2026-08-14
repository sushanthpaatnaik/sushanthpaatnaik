import { chromium } from 'playwright';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const c = await b.newContext({ viewport:{width:1440,height:900} });
const p = await c.newPage();
await p.goto('http://127.0.0.1:4415/',{waitUntil:'domcontentloaded',timeout:90000});
await p.waitForTimeout(7000);
console.log(await p.evaluate(async () => {
  const stage=[...document.querySelectorAll('.cinematic-stage-overlay')].find(s=>s.querySelector('h1,h2,h3,p'));
  const layers=[...stage.children].filter(e=>e.tagName==='DIV'&&e.style.opacity!=='');
  // ContentShield = an aria-hidden absolute inset-0 div whose background is an rgba(0,0,0,..) gradient
  const shieldOf = (L) => [...L.querySelectorAll('div[aria-hidden]')].find(d => /rgba\(0, ?0, ?0/.test(getComputedStyle(d).backgroundImage||''));
  const eff = (e) => { let n=e,o=1; while(n&&n!==document.body){const cs=getComputedStyle(n); if(cs.display==='none')return 0; o*=parseFloat(cs.opacity); n=n.parentElement;} return o; };
  const s3 = shieldOf(layers[3]), s4 = shieldOf(layers[4]);
  if (!s3 || !s4) return 'shield not found: ' + [!!s3, !!s4];
  const travel = document.body.scrollHeight - innerHeight;
  const out = [];
  for (let i=0;i<=36;i++){
    const sp = 0.660 + (i/36)*0.180;
    window.scrollTo(0, Math.round(sp*travel));
    await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
    out.push([+sp.toFixed(4), +eff(s3).toFixed(3), +eff(s4).toFixed(3)]);
  }
  return out;
}));
await b.close();
