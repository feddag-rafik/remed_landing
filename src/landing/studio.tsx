import { demoDimensions } from './demoData';
import React from 'react';
import { Composition, registerRoot } from 'remotion';
import { DemoComposition } from './composition';
import { compositions } from './demoData';
// Studio is standalone. Production previews receive extracted theme tokens from the host.
import '../styles/remed-theme.css';
import './productPreview.css';

function RemedDemoStudio() {
  return <>{compositions.map(demo => <Composition
    key={demo.id}
    id={demo.id}
    component={DemoComposition}
    defaultProps={{ id: demo.id }}
    durationInFrames={demo.durationInFrames}
    fps={demo.fps}
    width={demoDimensions(demo.id).width}
    height={demoDimensions(demo.id).height}
  />)}</>;
}

registerRoot(RemedDemoStudio);
