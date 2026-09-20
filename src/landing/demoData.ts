export type DemoId = 'hero' | 'document' | 'voice' | 'assistant';

export interface DemoDefinition {
  id: DemoId;
  title: string;
  description: string;
  durationInFrames: number;
  fps: number;
  posterFrame: number;
  loop?: boolean;
}

export const heroDemo: DemoDefinition = {
  id: 'hero',
  title: 'Le dossier patient, simplement',
  description: 'Du dossier desktop à la consultation mobile.',
  durationInFrames: 937,
  fps: 60,
  posterFrame: 936,
  loop: false,
};

/** Shared by the players, server-rendered posters and Remotion studio. */
export const demos: DemoDefinition[] = [
  {
    id: 'document',
    title: 'Vos documents, assistés par REMED',
    description: 'Ajouter, modifier, reformuler et compléter un document dans votre éditeur.',
    durationInFrames: 1050,
    fps: 30,
    posterFrame: 0,
  },
  {
    id: 'voice',
    title: 'La consultation devient un compte rendu',
    description: 'Capture ambiante ou dictée directe : retrouvez les informations dans les champs de la consultation.',
    durationInFrames: 720,
    fps: 30,
    posterFrame: 570,
  },
  {
    id: 'assistant',
    title: 'Discussion avec l’IA',
    description: 'Interrogez le dossier : recommandations adaptées, interactions à vérifier et questions sur le traitement.',
    durationInFrames: 600,
    fps: 30,
    posterFrame: 510,
  },
];

/** The video picker keeps its three AI demos; the hero is inline only. */
export const compositions: DemoDefinition[] = [heroDemo, ...demos];

/** Includes the mobile window overhang for hero posters, playback and exports. */
export function demoDimensions(id: string, compact = false) {
  return { width: (compact ? 740 : 1000) + (id === 'hero' && !compact ? 100 : 0), height: id === 'hero' ? 820 : 650 };
}
