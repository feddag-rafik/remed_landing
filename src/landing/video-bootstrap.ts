// Native-video prototype. This dependency graph must stay free of React/Remotion.
import {createPlaybackCoordinator} from './playback';
import {demos, type DemoId} from './demoData';

type Asset={width:number;height:number;duration:number;alpha:boolean;variants:Record<string,{src:string;bytes:number}>};
const assets=JSON.parse(document.getElementById('video-manifest')!.textContent!) as Record<string,Asset>;
const motion=matchMedia('(prefers-reduced-motion: reduce)');
const compact=matchMedia('(max-width:600px)');
const coordinator=createPlaybackCoordinator();
const codec=new URLSearchParams(location.search).get('codec')||'auto';
let modalOpen=false, externalOverlay=false;
const sync=()=>coordinator.setEnvironment({hidden:document.hidden,reducedMotion:motion.matches,overlay:modalOpen||externalOverlay});
document.addEventListener('visibilitychange',sync);
window.addEventListener('remed:landing-overlay',event=>{externalOverlay=Boolean((event as CustomEvent).detail);sync();});
sync();

function mount(host:HTMLElement,id:DemoId,automatic:boolean){
  const picture=host.querySelector('picture');
  const video=document.createElement('video');
  video.className='pv-video';video.muted=true;video.defaultMuted=true;video.playsInline=true;video.preload='auto';
  video.setAttribute('aria-label',id==='hero'?'Démonstration du dossier patient':demos.find(d=>d.id===id)!.title);
  video.controls=!automatic;
  const controls=document.createElement('div');controls.className='pv-controls';
  const button=document.createElement('button');button.type='button';button.textContent='Lire';
  const replay=document.createElement('button');replay.type='button';replay.textContent='Rejouer';
  const status=document.createElement('span');status.className='pv-status';status.setAttribute('role','status');
  controls.append(button,replay,status);host.append(video,controls);
  let wanted=false, disposed=false, failed=false, index=0, urls:{codec:string;src:string}[]=[], restoreTime=0;
  const registration=coordinator.register({automatic,onPlaying(playing){
    wanted=playing;
    if(playing){
      void video.play().catch(()=>{if(disposed||!wanted)return;registration.pause();host.dataset.state='blocked';status.textContent='Appuyez sur Lire pour démarrer.';});
    }else video.pause();
  }});
  function reveal(){if(picture?.isConnected)picture.remove();video.style.visibility='visible';}
  function chooseSources(){
    const asset=assets[`${id}-${compact.matches?'compact':'desktop'}`];
    host.style.aspectRatio=`${asset.width}/${asset.height}`;
    // canPlayType does not test alpha. Use an opaque MP4 on WebKit engines.
    const webkit=/AppleWebKit/.test(navigator.userAgent)&&!/Chrome|Chromium|Edg|Firefox/.test(navigator.userAgent);
    const preference=asset.alpha&&webkit?['h264']:codec==='h264'||(!asset.alpha&&codec==='auto')?['h264','vp9']:codec==='av1'?['av1','vp9','h264']:['vp9','h264'];
    const types:Record<string,string>={vp9:'video/webm; codecs="vp9"',av1:'video/webm; codecs="av01.0.08M.08"',h264:'video/mp4; codecs="avc1.640028"'};
    urls=preference.filter(c=>asset.variants[c]&&video.canPlayType(types[c]!)).map(c=>({codec:c,src:asset.variants[c]!.src}));index=0;
  }
  function load(){
    failed=false;status.textContent='';registration.update({ready:false});
    if(picture&&!picture.isConnected)host.prepend(picture);
    video.style.visibility='hidden';host.dataset.state='loading';
    if(!urls[index]){failed=true;host.dataset.state='error';status.textContent='Vidéo indisponible. Réessayez.';return;}
    host.dataset.codec=urls[index]!.codec;video.src=urls[index]!.src;video.load();
  }
  video.addEventListener('loadeddata',()=>{
    if(disposed)return;
    if(restoreTime){video.currentTime=Math.min(restoreTime,video.duration-.05);restoreTime=0;}
    reveal();host.dataset.state='ready';registration.update({ready:true});
  });
  video.addEventListener('playing',()=>{reveal();host.dataset.state='playing';button.textContent='Pause';status.textContent='';});
  video.addEventListener('play',()=>{if(!wanted)registration.play();});
  video.addEventListener('pause',()=>{button.textContent='Lire';if(wanted&&!video.ended)registration.pause();if(host.dataset.state==='playing')host.dataset.state='paused';});
  video.addEventListener('ended',()=>{registration.ended();host.dataset.state='ended';button.textContent='Rejouer';});
  video.addEventListener('error',()=>{if(disposed)return;if(++index<urls.length){load();return;}failed=true;registration.update({ready:false});host.dataset.state='error';video.style.visibility='hidden';if(picture&&!picture.isConnected)host.prepend(picture);status.textContent='Vidéo indisponible. Réessayez.';});
  const play=()=>{if(failed){chooseSources();load();}if(video.ended)video.currentTime=0;registration.play();};
  button.onclick=()=>wanted?registration.pause():play();
  replay.onclick=()=>{video.currentTime=0;play();};
  const observer=new IntersectionObserver(entries=>registration.update({visible:!automatic||entries[0]!.isIntersecting}),{threshold:0.15});
  if(automatic)observer.observe(host);else registration.update({visible:true});
  const resize=()=>{restoreTime=video.currentTime;chooseSources();load();};
  compact.addEventListener('change',resize);
  chooseSources();load();
  return ()=>{disposed=true;observer.disconnect();compact.removeEventListener('change',resize);registration.dispose();video.pause();video.removeAttribute('src');video.load();video.remove();controls.remove();if(picture&&!picture.isConnected)host.prepend(picture);delete host.dataset.state;};
}

const mounted=new WeakSet<HTMLElement>();
const near=new IntersectionObserver(entries=>{for(const entry of entries){
  const host=entry.target as HTMLElement;
  if(entry.isIntersecting&&!motion.matches&&!mounted.has(host)){
    mounted.add(host);near.unobserve(host);mount(host,host.dataset.landingDemo as DemoId,true);
  }
}},{rootMargin:'160px 0px'});
function observe(){document.querySelectorAll<HTMLElement>('[data-landing-demo]').forEach(host=>{if(!mounted.has(host))near.observe(host);});}
observe();motion.addEventListener('change',()=>{sync();observe();});

let dialog:HTMLDialogElement|undefined;
function openDialog(trigger:HTMLElement){
  if(dialog){dialog.focus();return;}
  dialog=document.createElement('dialog');dialog.className='pv-dialog';dialog.setAttribute('aria-labelledby','pv-title');
  const header=document.createElement('header');
  const title=document.createElement('h2');title.id='pv-title';title.textContent='Découvrir Remed en action';
  const close=document.createElement('button');close.type='button';close.textContent='Fermer';
  header.append(title,close);
  const description=document.createElement('p');description.textContent='Choisissez une démonstration, puis lancez la lecture.';
  const body=document.createElement('div');body.className='pv-dialog-body';
  const list=document.createElement('nav');list.setAttribute('aria-label','Démonstrations');
  const detail=document.createElement('section');
  let cleanup=()=>{};
  function select(id:DemoId){
    cleanup();detail.replaceChildren();
    const demo=demos.find(d=>d.id===id)!;
    const heading=document.createElement('h3');heading.textContent=demo.title;
    const caption=document.createElement('p');caption.textContent=demo.description;
    const host=document.createElement('div');host.className='pv-modal-stage';
    const original=document.querySelector(`[data-landing-demo="${id}"] picture`);
    if(original)host.append(original.cloneNode(true));
    detail.append(heading,caption,host);cleanup=mount(host,id,false);
    list.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.id===id)));
  }
  for(const demo of demos){const b=document.createElement('button');b.type='button';b.textContent=demo.title;b.dataset.id=demo.id;b.onclick=()=>select(demo.id);list.append(b);}
  body.append(list,detail);dialog.append(header,description,body);document.body.append(dialog);
  modalOpen=true;sync();dialog.showModal();select('document');
  close.onclick=()=>dialog?.close();
  dialog.addEventListener('click',event=>{if(event.target===dialog){const rect=dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)dialog.close();}});
  dialog.addEventListener('close',()=>{cleanup();dialog?.remove();dialog=undefined;modalOpen=false;sync();trigger.focus();},{once:true});
  close.focus();
}
document.addEventListener('click',event=>{
  const trigger=event.target instanceof Element?event.target.closest<HTMLElement>('[data-landing-videos]'):null;
  if(!trigger||event.button||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
  event.preventDefault();openDialog(trigger);
});
