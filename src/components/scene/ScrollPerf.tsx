import {useEffect,useRef} from 'react';
/** Opt-in, local-only diagnostic. It sends no measurements anywhere. */
export default function ScrollPerf(){
 const ref=useRef<HTMLPreElement>(null);
 useEffect(()=>{
  if(new URLSearchParams(location.search).get('perf')!=='1')return;
  const el=ref.current;if(!el)return;el.hidden=false;
  let raf=0,last=0,start=performance.now(),count=0,longFrames=0,worst=0,longTasks=0;
  const observer=typeof PerformanceObserver!=='undefined'?new PerformanceObserver(list=>{longTasks+=list.getEntries().length}):null;
  try{observer?.observe({type:'longtask',buffered:false})}catch{}
  const tick=(t:number)=>{
   if(last){const ms=t-last;worst=Math.max(worst,ms);if(ms>50)longFrames++}last=t;count++;
   if(t-start>=1000){
    const canvas=document.querySelector<HTMLCanvasElement>('canvas[data-target]');
    const frame=canvas?.dataset.frame??'?';const target=canvas?.dataset.target??'?';
    el.textContent=`SCROLL CHECK · build 2\n${Math.round(count*1000/(t-start))} fps · >50ms: ${longFrames} · worst: ${Math.round(worst)}ms\nLong tasks: ${longTasks} · frame ${frame}/${target}\nViewport ${innerWidth}×${innerHeight} · DPR ${devicePixelRatio}\nCanvas ${canvas?.width??'?'}×${canvas?.height??'?'}\n${navigator.userAgent}\nReload this tab after an update. Local only.`;
    count=0;start=t;worst=0;
   }
   raf=requestAnimationFrame(tick);
  };raf=requestAnimationFrame(tick);
  return()=>{cancelAnimationFrame(raf);observer?.disconnect()};
 },[]);
 return <pre ref={ref} hidden aria-live="off" style={{position:'fixed',bottom:10,left:10,zIndex:99999,maxWidth:'min(550px,95vw)',padding:10,margin:0,font:'11px/1.4 monospace',whiteSpace:'pre-wrap',color:'#fff',background:'rgba(0,0,0,.88)',border:'1px solid #aaa',pointerEvents:'none'}}/>;
}
