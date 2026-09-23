// Build-time only. No Remotion code from this file enters the landing bundle.
import React, {useEffect, useState} from 'react';
import {Composition, registerRoot, useCurrentFrame, delayRender, continueRender, staticFile} from 'remotion';
import {ProductPreview} from './ProductPreview';
import {compositions, demoDimensions, type DemoId} from './demoData';
import '../styles/remed-theme.css';

function VideoScene({id, compact}: {id:DemoId;compact:boolean}) {
  const frame=useCurrentFrame();
  const demo=compositions.find(d=>d.id===id)!;
  const [handle]=useState(()=>delayRender('Load local Inter font'));
  useEffect(()=>{document.fonts.load('500 16px Inter').then(()=>document.fonts.ready).then(()=>continueRender(handle));},[handle]);
  return <><style>{`@font-face{font-family:Inter;src:url('${staticFile('landing/fonts/inter/inter-latin-variable.woff2')}') format('woff2');font-weight:100 900}html,body{background:transparent!important;margin:0}`}</style><div className="ld-demo-slot"><ProductPreview kind={id} compact={compact} allowFractionalFrames frame={Math.min(demo.durationInFrames-1,frame*(demo.fps/60))}/></div></>;
}
function Root(){return <>{compositions.flatMap(demo=>[false,true].map(compact=><Composition key={`${demo.id}-${compact}`} id={`${demo.id}-${compact?'compact':'desktop'}`} component={VideoScene} defaultProps={{id:demo.id,compact}} fps={60} durationInFrames={Math.ceil(demo.durationInFrames*60/demo.fps)} {...demoDimensions(demo.id,compact)}/>))}</>;}
registerRoot(Root);
