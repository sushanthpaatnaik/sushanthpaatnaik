import http from "node:http";
const ORIGIN = "https://sushanthpaatnaik.com";
http.createServer(async (req,res)=>{ try{
  const up=await fetch(ORIGIN+req.url,{redirect:"follow"});
  const buf=Buffer.from(await up.arrayBuffer());
  const h={"content-length":buf.length};
  for(const k of ["content-type","cache-control"]){const v=up.headers.get(k); if(v)h[k]=v;}
  res.writeHead(up.status,h); res.end(buf);
}catch(e){res.writeHead(502);res.end(String(e.message));}}).listen(4500,"127.0.0.1");
