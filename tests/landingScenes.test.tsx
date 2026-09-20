import { describe, expect, test } from 'bun:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { readFileSync } from 'node:fs';
import { compositions, demos, heroDemo } from '../src/landing/demoData';
import { ProductPreview, type ProductPreviewKind } from '../src/landing/ProductPreview';

const landing = new URL('../src/landing/', import.meta.url);
const source = (path: string) => readFileSync(new URL(path, landing), 'utf8');
const render = (kind: ProductPreviewKind, frame?: number, compact = false) => renderToStaticMarkup(<ProductPreview kind={kind} frame={frame} compact={compact} />);
const text = (html: string) => html.replace(/<[^>]*>/g, '').replace(/&#x27;/g, "'").replace(/&gt;/g, '>').replace(/&amp;/g, '&');
const fieldText = (html: string, label: string) => html.split(`data-field="${label}"`)[1]?.split('</section>')[0] ?? '';
const kinds: ProductPreviewKind[] = ['hero', 'patient-records', 'prescriptions', 'calendar', 'accounting', 'waiting-room', 'medical-imaging', 'document', 'voice', 'assistant'];

describe('landing demo contract and pure SSR', () => {
  test('players and studio share the required order, fps and durations', () => {
    expect(demos.map(({ id, durationInFrames, fps }) => ({ id, durationInFrames, fps }))).toEqual([
      { id: 'document', durationInFrames: 1050, fps: 30 },
      { id: 'voice', durationInFrames: 720, fps: 30 },
      { id: 'assistant', durationInFrames: 600, fps: 30 },
    ]);
    expect(heroDemo).toMatchObject({ id: 'hero', fps: 60, durationInFrames: 937, loop: false });
    for (const demo of compositions) {
      expect(demo.title.length).toBeGreaterThan(0);
      expect(demo.description.length).toBeGreaterThan(0);
      expect(demo.posterFrame).toBeGreaterThanOrEqual(0);
      expect(demo.posterFrame).toBeLessThan(demo.durationInFrames);
      expect(render(demo.id)).toBe(render(demo.id, demo.posterFrame));
    }
  });

  test.each(kinds)('%s renders in SSR with fictional data and decorative controls', kind => {
    const html = render(kind);
    expect(html).toContain(`data-preview-kind="${kind}"`);
    if (kind === 'hero' || kind === 'document') expect(html).not.toContain('Données fictives');
    else expect(html).toContain('Données fictives');
    expect(html).toContain('lang="fr"');
    expect(html).not.toMatch(/<(button|input|textarea|select|iframe|audio|video)\b/);
    expect(html).not.toMatch(/\s(?:onclick|contenteditable|autoplay|tabindex)=/i);
    expect(html).not.toMatch(/(?:NaN|Infinity)/);
    expect(render(kind)).toBe(html);
    expect(render(kind, undefined, true)).toContain('product-preview is-compact');
  });

  test('static scenes ignore frame changes and out-of-range animation frames clamp', () => {
    for (const kind of kinds.filter(kind => !compositions.some(demo => demo.id === kind))) expect(render(kind, 719)).toBe(render(kind, 0));
    for (const demo of compositions) {
      expect(render(demo.id, -10)).toBe(render(demo.id, 0));
      expect(render(demo.id, 99999)).toBe(render(demo.id, demo.durationInFrames - 1));
      expect(render(demo.id, Number.NaN)).toBe(render(demo.id, 0));
    }
  });

  test('navigation matches the actual permission labels', () => {
    const html = text(render('hero'));
    for (const title of ['Dossiers', 'Hospitalisations', "Salles d'attente", 'Examens', 'Agenda', 'Blocs', 'Planning bloc', 'Mon Profil', 'Déconnexion']) expect(html).toContain(title);
    const otherScene = text(render('patient-records'));
    for (const title of ['Comptabilité', 'Notifications']) expect(otherScene).toContain(title);
    expect(html).not.toContain('Aide & assistance');
    expect(html).not.toContain('Paramètres');
  });
});

describe('semantic document keyframes', () => {
  const documentAt = (frame: number) => render('document', Math.ceil(frame / 1.2));
  const section = (frame: number, name: string) => documentAt(frame).split('data-document-section="' + name + '"')[1].split('</section>')[0];
  test('starts closed, opens with an inactive orb, then enables dictation', () => {
    expect(documentAt(0)).toContain('data-panel-open="false"');
    expect(documentAt(110)).toContain('data-recording="false"');
    expect(documentAt(110)).toContain('Commencer');
    expect(documentAt(180)).not.toContain('Commencer');
    expect(documentAt(180)).toContain('Arrêter l’enregistrement');
  });
  test('selects and clears the long history before cascading its summary', () => {
    expect(section(360, 'history')).toContain('pp-text-selection');
    expect(section(360, 'history')).toContain('La patiente consulte');
    expect(section(400, 'history')).not.toContain('La patiente consulte');
    expect(section(400, 'history')).toContain('pp-rewrite-caret');
    expect(section(410, 'history')).toContain('opacity:0');
    expect(section(520, 'history')).not.toContain('opacity:0');
    expect(text(section(520, 'history'))).toContain('sommeil fragmenté et non réparateur');
    expect(text(section(520, 'history')).length).toBeLessThan(text(section(360, 'history')).length / 2);
  });
  test('replaces the request bubble and updates only the plan in the second edit', () => {
    const first = documentAt(280);
    const second = documentAt(855);
    expect(text(first)).toContain("Résume moi l'histoire de la maladie de la patiente");
    expect(second).not.toContain('Résume');
    expect(text(second)).toContain('Pour la conduite à tenir, ajoute un rendez-vous dans 3 mois');
    expect(second).not.toContain('À votre écoute');
    expect(section(980, 'plan')).toContain('pp-text-selection');
    expect(section(1020, 'plan')).toContain('pp-rewrite-caret');
    const final = text(section(1180, 'plan'));
    expect(final).toContain('Rendez-vous de contrôle dans 3 mois.');
    expect(final).toContain('clinique Al Azhar');
    expect(final).toContain('échographie trans-thoracique et un bilan biologique complet');
    expect(section(1180, 'history')).toBe(section(520, 'history'));
  });
});

describe('voice and patient assistant workflows', () => {
  test('ambient transcript precedes filling the motif and history', () => {
    expect(render('voice', 0)).toContain('data-step="ambient"');
    expect(render('voice', 0)).not.toContain('Je suis fatiguée depuis une semaine');
    expect(render('voice', 55)).toContain('Je suis fatiguée depuis une semaine');
    expect(fieldText(render('voice', 209), 'Motif')).toContain('Ajouter un motif');
    expect(fieldText(render('voice', 210), 'Motif')).toContain('Consultation de suivi');
    expect(fieldText(render('voice', 210), 'Observations')).toContain('Sommeil perturbé');
    expect(fieldText(render('voice', 210), 'Examen')).toContain('Renseigner les observations');
  });

  test('direct dictation populates the exam while preserving the ambient fields', () => {
    expect(render('voice', 360)).toContain('data-step="direct"');
    expect(render('voice', 420)).toContain('Examen clinique : bon état général');
    expect(fieldText(render('voice', 509), 'Examen')).toContain('Renseigner les observations');
    const after = render('voice', 510);
    expect(fieldText(after, 'Examen')).toContain('Auscultation cardio-pulmonaire sans particularité');
    expect(fieldText(after, 'Observations')).toContain('Sommeil perturbé');
    expect(after).toContain('Capture ambiante conservée');
    expect(render('voice', 630)).toContain('Transcription terminée');
  });

  test('clinical discussion uses treatment, allergies and exams for contextual questions', () => {
    expect(render('assistant', 0)).toContain('Dossier de Nora Mansouri');
    expect(render('assistant', 0)).toContain('Discussion avec l’IA');
    expect(text(render('assistant', 0))).toContain('Quels points vérifier avant d’adapter son traitement ?');
    expect(render('assistant', 149)).not.toContain('Points à vérifier pour Nora');
    expect(render('assistant', 150)).toContain('Points à vérifier pour Nora');
    expect(render('assistant', 150)).toContain('Paracétamol 500 mg');
    expect(render('assistant', 150)).toContain('Aucune allergie déclarée');
    expect(render('assistant', 150)).toContain('data-topic="reconciliation"');
    expect(render('assistant', 299)).not.toContain('data-topic="interactions"');
    expect(render('assistant', 300)).toContain('data-topic="interactions"');
    expect(render('assistant', 450)).toContain('data-topic="exams"');
    expect(render('assistant', 599)).toContain('Sources : ordonnance · allergies · bilan du dossier');
    for (const label of ['Recommandations adaptées', 'Interactions médicamenteuses', 'Questions sur le traitement']) expect(render('assistant', 599)).toContain(label);
    expect(render('assistant', 599)).not.toContain('data-generated=');
  });

  test('imaging is a coded SVG with no image acquisition or external patient image', () => {
    const html = render('medical-imaging');
    expect(html).toContain('Tracé ECG synthétique de démonstration');
    expect(html).toContain('<svg');
    expect(html).not.toMatch(/<(img|image)\b/);
    expect(html).not.toContain('src=');
  });
});

describe('preview dependency boundary and sizing', () => {
  test('visual code only imports pure presentation, icon, data, and CSS modules', () => {
    const preview = source('ProductPreview.tsx');
    const imports = [...preview.matchAll(/(?:from\s*|import\s*)['"]([^'"]+)['"]/g)].map(match => match[1]);
    expect(imports.sort()).toEqual([
      'react', 'lucide-react', '../components/remedUiScope', '../components/pageHeader',
      '../components/encounterPage.module.css', './demoData', './productPreview.css', './HeroPatientDemo', './HeroMobileDemo', './heroTimeline',
    ].sort());
    const executable = preview.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/[^\n]*/g, '');
    expect(executable).not.toMatch(/\b(?:use[A-Z]\w*|fetch|setTimeout|setInterval|requestAnimationFrame|getUserMedia|MediaRecorder)\s*\(/);
    expect(/\b(?:window|navigator|localStorage|sessionStorage|api|USER)\s*\./.test(executable)).toBe(false);
    expect(executable).not.toMatch(/\b(?:Math\.random|Date\.now|new Date)\s*\(/);
    expect(executable).not.toMatch(/\bimport\s*\(/);
    expect(source('composition.tsx')).toContain('const frame = useCurrentFrame()');
    expect(source('composition.tsx')).toContain('<ProductPreview kind={id} frame={frame} compact={compact}');
    // The two shared components are presentation-only; their imports must not grow a business dependency.
    for (const file of ['../components/remedUiScope.tsx', '../components/pageHeader.tsx']) {
      const shared = source(file);
      const deps = [...shared.matchAll(/(?:from\s*|import\s*)['"]([^'"]+)['"]/g)].map(match => match[1]);
      expect(deps.every(dep => dep === 'react' || dep.endsWith('.module.css'))).toBe(true);
    }
  });

  test('fixed artboard has container scaling and scoped mobile poster adaptation', () => {
    const css = source('productPreview.css');
    expect(css).toContain('width: 1000px; height: 650px');
    expect(css).toContain('atan2(100cqw, 1000px)');
    expect(css).toContain('atan2(100cqw, 740px)');
    expect(css).toContain('aspect-ratio: 740 / 650');
    expect(css).toContain('.ld-demo-slot > .product-preview');
    expect(css).toContain('.landing-player-poster > .product-preview');
    expect(css).not.toMatch(/@keyframes|animation\s*:|url\(/);
    const studio = source('studio.tsx');
    expect(studio).toContain('width={demoDimensions(demo.id).width}');
    expect(studio).toContain('height={demoDimensions(demo.id).height}');
    expect(studio).toContain('compositions.map');
    expect(studio).toContain('registerRoot(RemedDemoStudio)');
  });
});
