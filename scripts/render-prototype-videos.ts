// Prototype: render lossless PNGs once, compare encoders from the same frames.
import {bundle} from '@remotion/bundler';
import {selectComposition, renderFrames} from '@remotion/renderer';
import {mkdir, readFile, writeFile, readdir, stat} from 'node:fs/promises';
import {resolve} from 'node:path';
import {createHash} from 'node:crypto';
import {compositions} from '../src/landing/demoData';

process.chdir(resolve(import.meta.dir,'..'));
const output=resolve('public/landing/prototype-videos');
await mkdir(output,{recursive:true});
const serveUrl=await bundle({entryPoint:resolve('src/landing/video-render.tsx'),outDir:resolve('.landing-build/video-renderer'),publicDir:resolve('public'),enableCaching:true,
  webpackOverride:config=>({...config,resolve:{...config.resolve,alias:{...config.resolve?.alias,'/landing/fonts/inter/inter-latin-variable.woff2':resolve('public/landing/fonts/inter/inter-latin-variable.woff2')}}})});
const browserExecutable=process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const manifest: Record<string,any>={};
try{Object.assign(manifest,JSON.parse(await readFile(resolve(output,'manifest.json'),'utf8')));}catch{}
async function encode(args:string[]){const p=Bun.spawn(['ffmpeg','-hide_banner','-loglevel','error','-y',...args],{stdout:'inherit',stderr:'inherit'});if(await p.exited)throw Error('ffmpeg failed');}
for(const demo of compositions)for(const compact of [false,true]){
  const id=`${demo.id}-${compact?'compact':'desktop'}`;
  if(process.env.VIDEO_ONLY && !id.includes(process.env.VIDEO_ONLY))continue;
  if(manifest[id]?.fps===60&&!process.env.RENDER_VIDEOS_AGAIN){console.log(`Cached ${id}`);continue;}
  const composition=await selectComposition({serveUrl,id,browserExecutable});
  const frames=resolve('.landing-build/video-frames-60fps',id);
  await mkdir(frames,{recursive:true});
  if(!process.env.REUSE_VIDEO_FRAMES){
    await renderFrames({serveUrl,composition,browserExecutable,outputDir:frames,imageFormat:'png',inputProps:composition.props,concurrency:2,
      onStart:()=>console.log(`Rendering ${id}: ${composition.durationInFrames} frames`),
      onFrameUpdate:n=>{if(n%100===0)console.log(`${id}: ${n}/${composition.durationInFrames}`);}});
  }
  const names=(await readdir(frames)).filter(n=>n.endsWith('.png')).sort();
  const digits=names[0]!.match(/(\d+)\.png$/)![1]!.length;
  const input=['-framerate',String(composition.fps),'-i',resolve(frames,`element-%0${digits}d.png`),'-frames:v',String(composition.durationInFrames),'-an','-threads','2'];
  const variants:Record<string,any>={};
  for(const codec of ['vp9','h264',...(demo.id==='hero'?[]:['av1'])]){
    const extension=codec==='h264'?'mp4':'webm';
    const temporary=resolve('.landing-build',`${id}-${codec}.${extension}`);
    const start=performance.now();
    const options=codec==='vp9'?['-c:v','libvpx-vp9','-b:v','0','-crf','32','-cpu-used','4','-row-mt','1','-pix_fmt',demo.id==='hero'?'yuva420p':'yuv420p']:
      codec==='av1'?['-c:v','libsvtav1','-crf','32','-preset','8','-svtav1-params','lp=2','-pix_fmt','yuv420p']:
      ['-c:v','libx264','-crf','23','-preset','medium','-pix_fmt','yuv420p','-movflags','+faststart'];
    // Alpha cannot survive H.264. A pale matte is an explicit fallback tradeoff.
    const matte=demo.id==='hero'&&codec==='h264'?['-filter_complex',`color=c=0xeff6fb:s=${composition.width}x${composition.height}:r=${composition.fps}[bg];[bg][0:v]overlay=shortest=1:format=auto`]:[];
    console.log(`Encoding ${id} ${codec}`);
    await encode([...input,...matte,...options,'-g',String(composition.fps*2),temporary]);
    const bytes=await readFile(temporary);
    const hash=createHash('sha256').update(bytes).digest('hex').slice(0,12);
    const filename=`${id}-${codec}-${hash}.${extension}`;
    await writeFile(resolve(output,filename),bytes);
    variants[codec]={src:`/landing/prototype-videos/${filename}`,bytes:bytes.length,encodeSeconds:Math.round((performance.now()-start)/100)/10};
  }
  manifest[id]={width:composition.width,height:composition.height,fps:composition.fps,duration:composition.durationInFrames/composition.fps,alpha:demo.id==='hero',variants};
  await writeFile(resolve(output,'manifest.json'),JSON.stringify(manifest,null,2)+'\n');
  console.log(`Finished ${id}: ${JSON.stringify(variants)}`);
}
