import {cp,mkdir,readFile,writeFile} from 'node:fs/promises';
import {resolve,basename} from 'node:path';
import {createHash} from 'node:crypto';
import {build,transform} from 'esbuild';
import {compositions} from '../src/landing/demoData';

process.chdir(resolve(import.meta.dir,'..'));
const output=resolve('dist/landing/generated');
await mkdir(output,{recursive:true});
const posters=JSON.parse(await readFile('public/landing/prototype-posters/manifest.json','utf8')).images as Record<string,string>;
const videos=JSON.parse(await readFile('public/landing/prototype-videos/manifest.json','utf8'));
for(const demo of compositions)for(const mode of ['desktop','compact']){
  const asset=videos[`${demo.id}-${mode}`];
  if(!asset)throw Error(`Missing ${demo.id}-${mode}. Run bun run render:videos`);
  for(const variant of Object.values(asset.variants) as {src:string}[]){if(!await Bun.file('public'+variant.src).exists())throw Error(`Missing video: ${variant.src}`);}
}
await cp('public/landing','dist/landing',{recursive:true,filter:path=>!['landing.css','landing.js','generated'].includes(basename(path))});
const page=await build({entryPoints:['public/landing/landing.css','public/landing/landing.js'],outdir:'dist/landing',bundle:true,minify:true,platform:'browser',target:'es2022',entryNames:'[name]-[hash]',external:['/landing/*'],metafile:true});
const browser=await build({entryPoints:['src/landing/video-bootstrap.ts'],outdir:output,bundle:true,minify:true,format:'esm',platform:'browser',target:'es2022',entryNames:'[name]-[hash]',metafile:true});
for(const path of Object.keys(browser.metafile.inputs))if(/node_modules\/(react|react-dom|remotion|@remotion)\//.test(path))throw Error(`Browser framework dependency: ${path}`);
const theme=await readFile('src/styles/remed-theme.css','utf8');
const tokens=theme.match(/:root\s*\{[\s\S]*?\n\}/)?.[0];
if(!tokens)throw Error('Theme tokens missing');
const css=(await transform([tokens,...await Promise.all(['src/landing/landingDemos.css','src/landing/prototype-posters.css','src/landing/video-prototype.css'].map(path=>readFile(path,'utf8')))].join('\n'),{loader:'css',minify:true})).code;
const cssFile=`native-video-${createHash('sha256').update(css).digest('hex').slice(0,12)}.css`;
await writeFile(resolve(output,cssFile),css);
const staticEntries=Object.entries(page.metafile.outputs);
const landingCss=staticEntries.find(([path])=>path.endsWith('.css'))![0];
const landingJs=staticEntries.find(([path])=>path.endsWith('.js'))![0];
const entry=Object.entries(browser.metafile.outputs).find(([path])=>path.endsWith('.js'))!;
let html=await readFile('src/landing/home.template.html','utf8');
const appUrl=process.env.LANDING_APP_URL?.trim();
const login=appUrl?new URL('login',appUrl.replace(/\/?$/,'/')).href:'/login';
if(appUrl&&!/^https?:\/\//.test(login))throw Error('LANDING_APP_URL must use HTTP or HTTPS');
html=html.replaceAll('href="/login"',`href="${login.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;')}"`)
  .replace('/landing/landing.css',`/landing/${basename(landingCss)}`).replace('/landing/landing.js',`/landing/${basename(landingJs)}`);
const labels:Record<string,string>={hero:'Dossier patient sur ordinateur et mobile','patient-records':'Gestion des dossiers patients',prescriptions:'Ordonnance médicale',calendar:'Agenda du cabinet',accounting:'Comptabilité du cabinet','waiting-room':"Gestion des salles d’attente",'medical-imaging':'Consultation des examens médicaux',document:'Rédaction assistée du compte rendu',voice:'Transcription de la consultation',assistant:'Assistant IA dans le dossier patient'};
html=html.replace(/<!-- landing-(preview|demo):([\w-]+) -->/g,(_,type,id)=>{
  const width=id==='hero'?1100:1000,height=id==='hero'?820:650;
  if(!posters[id+'-desktop'])throw Error(`Missing poster ${id}`);
  return `<div class="ld-demo-slot" ${type==='demo'?`data-landing-demo="${id}"`:`data-product-preview="${id}"`}><picture class="ld-raster"><source media="(max-width:600px)" srcset="/landing/prototype-posters/${posters[id+'-compact']}" width="740" height="${height}"><img class="ld-raster-image" src="/landing/prototype-posters/${posters[id+'-desktop']}" width="${width}" height="${height}" loading="${id==='hero'?'eager':'lazy'}" decoding="async" ${id==='hero'?'fetchpriority="high" ':''}alt="${labels[id]} · données fictives"></picture></div>`;
});
html=html.replace('<!-- landing-styles -->',`<link rel="stylesheet" href="/landing/generated/${cssFile}">`)
  .replace('<!-- landing-script -->',`<script id="video-manifest" type="application/json">${JSON.stringify(videos).replaceAll('<','\\u003c')}</script><script type="module" src="/landing/generated/${basename(entry[0])}"></script>`);
if(/<!-- landing-(preview|demo|styles|script)/.test(html))throw Error('Unresolved template marker');
await writeFile('dist/index.html',html.replace(/[\t ]+$/gm,''));
await mkdir('.landing-build',{recursive:true});
await writeFile('.landing-build/bundle-report.json',JSON.stringify(browser.metafile,null,2));
console.log(`Native-video prototype: ${entry[1].bytes} bytes of player JS. No React/Remotion browser dependencies.`);
