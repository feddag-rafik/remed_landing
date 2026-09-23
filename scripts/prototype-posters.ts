// Throwaway build-time capture through Chrome DevTools MCP.
import { spawn } from 'node:child_process';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';

export async function rasterPosters(desktop: Record<string,string>, compact: Record<string,string>, css: string) {
  const directory = resolve('public/landing/prototype-posters');
  await mkdir(directory, {recursive:true});
  const key = createHash('sha256').update(JSON.stringify({desktop,compact,css,version:1})).digest('hex').slice(0,12);
  const manifestPath = resolve(directory, 'manifest.json');
  try {
    const cached = JSON.parse(await readFile(manifestPath,'utf8'));
    if(cached.key === key && !process.env.REGENERATE_POSTERS) return cached.images as Record<string,string>;
  } catch {}
  const pages = new Map<string,string>();
  const server = Bun.serve({port:0, async fetch(request) {
    const path = new URL(request.url).pathname;
    if(pages.has(path)) return new Response(pages.get(path),{headers:{'Content-Type':'text/html'}});
    const file = Bun.file(resolve('dist', '.' + path));
    return await file.exists() ? new Response(file) : new Response('Not found',{status:404});
  }});
  const entry = process.env.CHROME_DEVTOOLS_MCP_ENTRY;
  const proc = spawn(entry ? 'node' : 'bunx', [...(entry ? [entry] : ['--yes','chrome-devtools-mcp@1.8.0']), '--isolated','--headless','--no-usage-statistics','--no-performance-crux','--allow-unrestricted-paths','--chromeArg=--remote-debugging-port=48181'], {stdio:['pipe','pipe','inherit']});
  let seq=0, buffer='';
  const pending = new Map<number,(value:any)=>void>();
  proc.stdout.on('data',chunk=>{buffer+=chunk; while(buffer.includes('\n')) {const index=buffer.indexOf('\n');const line=buffer.slice(0,index);buffer=buffer.slice(index+1);try{const message=JSON.parse(line);pending.get(message.id)?.(message);pending.delete(message.id);}catch{}}});
  function rpc(method:string,params:any) {return new Promise<any>(resolve=>{const id=++seq;pending.set(id,resolve);proc.stdin.write(JSON.stringify({jsonrpc:'2.0',id,method,params})+'\n');});}
  async function call(name:string,args:any) {const reply=await rpc('tools/call',{name,arguments:args});if(reply.error || reply.result?.isError) throw Error(JSON.stringify(reply));return reply.result;}
  let socket: WebSocket | undefined;
  try {
    await rpc('initialize',{protocolVersion:'2024-11-05',capabilities:{},clientInfo:{name:'remed-poster-prototype',version:'1'}});
    proc.stdin.write(JSON.stringify({jsonrpc:'2.0',method:'notifications/initialized'})+'\n');
    const page=await call('new_page',{url:'about:blank'});
    const pageId=Number(page.content.map((item:any)=>item.text||'').join('\n').match(/(?:^|\n)(\d+):[^\n]*\[selected\]/)[1]);
    // Preserve alpha around the hero's floating phone and backdrop.
    const targets:any = await (await fetch('http://localhost:48181/json/list')).json();
    const target=targets.find((item:any)=>item.type==='page');
    socket = new WebSocket(target.webSocketDebuggerUrl);
    await new Promise<void>((resolve,reject)=>{socket!.onopen=()=>socket!.send(JSON.stringify({id:1,method:'Emulation.setDefaultBackgroundColorOverride',params:{color:{r:0,g:0,b:0,a:0}}}));socket!.onmessage=()=>resolve();socket!.onerror=reject;});
    const images:Record<string,string>={};
    for(const [mode,posters] of Object.entries({desktop,compact})) {
      for(const [id,markup] of Object.entries(posters)) {
        const width=mode==='compact'?740:id==='hero'?1100:1000;
        const height=id==='hero'?820:650;
        const path=`/${id}-${mode}`;
        pages.set(path,`<!doctype html><html lang="fr"><head><meta charset="utf-8"><style>${css}\nhtml,body{margin:0;background:transparent}body{width:${width}px;height:${height}px}.ld-demo-slot{width:100%;height:100%;}</style></head><body><div class="ld-demo-slot">${markup}</div></body></html>`);
        await call('emulate',{pageId,viewport:`${width}x${height}x1`});
        await call('navigate_page',{pageId,url:`http://localhost:${server.port}${path}`});
        await call('evaluate_script',{pageId,function:'async()=>{await document.fonts.ready; await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));return document.fonts.status}'});
        const filename=`${id}-${mode}-${key}.webp`;
        await call('take_screenshot',{pageId,format:'webp',quality:90,filePath:resolve(directory,filename)});
        images[`${id}-${mode}`]=filename;
        console.log(`Poster: ${id} ${mode}`);
      }
    }
    await writeFile(manifestPath,JSON.stringify({key,images},null,2)+'\n');
    return images;
  } finally {socket?.close();proc.kill();server.stop(true);}
}
