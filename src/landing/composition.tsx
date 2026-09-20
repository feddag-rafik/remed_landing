import React from 'react';
import { useCurrentFrame } from 'remotion';
import { ProductPreview } from './ProductPreview';
import type { DemoId } from './demoData';

export type DemoCompositionProps = {
  id: DemoId;
  compact?: boolean;
};

/** The sole animation hook lives here; ProductPreview also renders without Remotion. */
export function DemoComposition({ id, compact = false }: DemoCompositionProps) {
  const frame = useCurrentFrame();
  return <ProductPreview kind={id} frame={frame} compact={compact} />;
}

export default DemoComposition;
