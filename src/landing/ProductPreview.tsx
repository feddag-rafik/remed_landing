import React, { type CSSProperties, type ReactNode } from 'react';
import {
  BedDouble, BookHeart, CalendarRange, CircleUserRound, FolderOpen, MonitorUp,
  Activity, AlignLeft, ArrowDownToLine, ArrowLeft, ArrowRight, Bell, Bold,
  CalendarDays, Check, CheckCheck, ChevronDown, ChevronLeft, ChevronRight,
  ClipboardList, Clock3, FileText, HeartPulse,
  History, Image, Italic, List, LogOut, Maximize2, Mic, MoreHorizontal, Paperclip,
  Pill, Plus, Printer, Redo2, Save, Search, Send, ShieldCheck, Sparkles,
  Stethoscope, Underline, Undo2, Users, Wallet, Bot, FileUp, Link, Table2, Ruler, Square, X, Strikethrough,
  type LucideIcon,
} from 'lucide-react';
import { RemedUiScope } from '../components/remedUiScope';
import PageHeader from '../components/pageHeader';
import encounterStyles from '../components/encounterPage.module.css';
import { compositions, type DemoId } from './demoData';
import './productPreview.css';
import { HeroPatientDemo } from './HeroPatientDemo';
import { HeroMobileDemo } from './HeroMobileDemo';
import { heroState, cursorMotion, progress, easeOutCubic } from './heroTimeline';

export type ProductPreviewKind = 'hero' | 'patient-records' | 'prescriptions'
  | 'calendar' | 'accounting' | 'waiting-room' | 'medical-imaging' | DemoId;

export interface ProductPreviewProps {
  kind: ProductPreviewKind;
  frame?: number;
  compact?: boolean;
  /** Build-time high-frame-rate exports may sample between source frames. */
  allowFractionalFrames?: boolean;
}

// Fictional fixtures only. This module deliberately imports no clinical runtime.
const patient = { name: 'Nora Mansouri', initials: 'NM', birth: '18 juin 1982', age: '44 ans', record: 'DEMO-0248' };
const patients = [patient.name, 'Yacine Belkacem', 'Lina Amrani', 'Sami Haddad', 'Inès Rahmani'];
const documentSpeech = [
  "Résume moi l'histoire de la maladie de la patiente",
  "Pour la conduite à tenir, ajoute un rendez-vous dans 3 mois, réorientation à la clinique Al Azhar pour Echographie trans-thoracique et bilan biologique complet.",
];
const originalHistory = "La patiente consulte pour une fatigue apparue il y a environ une semaine, ressentie progressivement au cours de la journée et plus marquée le soir. Elle explique avoir des difficultés à s’endormir et se réveiller plusieurs fois pendant la nuit. Au réveil, elle a la sensation de ne pas avoir récupéré malgré un temps passé au lit habituel. Cette fatigue gêne ses activités quotidiennes, sans l’empêcher de les poursuivre. Elle ne rapporte pas de fièvre, de frissons, de perte d’appétit ni de perte de poids récente. Elle ne décrit pas de douleur thoracique, de palpitations ou de gêne respiratoire. Aucun épisode similaire prolongé n’est rapporté. La consultation est l’occasion de faire le point sur l’évolution de ces symptômes et sur la qualité de son sommeil.";
const summarizedHistory = "Asthénie depuis une semaine, majorée en fin de journée, associée à un sommeil fragmenté et non réparateur. Retentissement modéré sur les activités quotidiennes. Absence de fièvre, d’amaigrissement et de symptômes cardio-respiratoires.";
const updatedPlan = "Rendez-vous de contrôle dans 3 mois. Réorientation à la clinique Al Azhar pour une échographie trans-thoracique et un bilan biologique complet.";

function AnimatedWords({ text, frame, start, stagger = 2, duration = 24, revealLayout = false }: { text: string; frame: number; start: number; stagger?: number; duration?: number; revealLayout?: boolean }) {
  return <>{text.split(' ').map((word, index) => {
    if (revealLayout && frame < start + index * stagger) return null;
    const amount = easeOutCubic(progress(frame, start + index * stagger, duration));
    return <React.Fragment key={index}><span className="pp-cascade-word" style={{ opacity: amount, transform: 'translateY(' + (-5 * (1 - amount)) + 'px)' }}>{word}</span>{' '}</React.Fragment>;
  })}</>;
}

function Icon({ icon: Component, size = 16 }: { icon: LucideIcon; size?: number }) {
  return <Component size={size} strokeWidth={1.7} aria-hidden="true" />;
}

/** Decorative app controls: no fake interactive buttons or keyboard stops. */
function Control({ children, icon, primary = false, className = '', label }: { children?: ReactNode; icon?: LucideIcon; primary?: boolean; className?: string; label?: string }) {
  return <span className={`pp-control ${primary ? 'pp-primary' : ''} ${className}`} title={label} aria-label={label} role={label ? 'img' : undefined}>
    {icon && <Icon icon={icon} />}{children}
  </span>;
}

function Badge({ children, tone = 'blue' }: { children: ReactNode; tone?: 'blue' | 'green' | 'amber' | 'purple' }) {
  return <span className={`pp-badge pp-${tone}`}>{children}</span>;
}

function Card({ title, icon, children, action, className = '' }: { title: string; icon?: LucideIcon; children: ReactNode; action?: ReactNode; className?: string }) {
  return <section className={`pp-card ${className}`}>
    <header className="pp-card-heading"><h3>{icon && <Icon icon={icon} />}{title}</h3>{action ?? <Icon icon={MoreHorizontal} />}</header>
    {children}
  </section>;
}

function Brand() {
  return <span className="pp-brand"><span className="pp-brand-mark"><Icon icon={HeartPulse} size={23} /></span>REMED<span className="pp-brand-dot">.</span></span>;
}

const navigation: { title: string; icon: LucideIcon; kind: ProductPreviewKind }[] = [
  { title: 'Dossiers', icon: Users, kind: 'patient-records' },
  { title: "Salles d'attente", icon: Clock3, kind: 'waiting-room' },
  { title: 'Examens', icon: Activity, kind: 'medical-imaging' },
  { title: 'Agenda', icon: CalendarDays, kind: 'calendar' },
  { title: 'Comptabilité', icon: Wallet, kind: 'accounting' },
];

const heroNavigation: { title: string; icon: LucideIcon; kind: ProductPreviewKind }[] = [
  { title: 'Dossiers', icon: FolderOpen, kind: 'patient-records' },
  { title: 'Hospitalisations', icon: BedDouble, kind: 'patient-records' },
  { title: "Salles d'attente", icon: MonitorUp, kind: 'waiting-room' },
  { title: 'Examens', icon: Activity, kind: 'medical-imaging' },
  { title: 'Agenda', icon: CalendarDays, kind: 'calendar' },
  { title: 'Blocs', icon: BookHeart, kind: 'patient-records' },
  { title: 'Planning bloc', icon: CalendarRange, kind: 'calendar' },
  { title: 'Mon Profil', icon: CircleUserRound, kind: 'patient-records' },
];

function AppShell({ kind, children, drawerOpacity = 0 }: { kind: ProductPreviewKind; children: ReactNode; drawerOpacity?: number }) {
  const selected = ['hero', 'voice', 'assistant', 'prescriptions'].includes(kind) ? 'patient-records' : kind;
  return <div className="pp-app">
    <aside className="pp-nav" aria-label="Navigation REMED">
      <span className="pp-nav-logo"><Icon icon={HeartPulse} size={34} /></span>
      <strong className="pp-nav-doctor">Dr Salma Latif</strong>
      <Badge>Médecin</Badge>
      <div className="pp-practice">Médecine générale<br />Cabinet des Oliviers</div>
      <div className="pp-nav-links">{(kind === 'hero' ? heroNavigation : navigation).map(item => <span key={item.title} className={`pp-nav-item ${(kind === 'hero' ? item.title === 'Dossiers' : selected === item.kind) ? 'is-active' : ''}`}>
        <Icon icon={item.icon} />{item.title}{kind !== 'hero' && item.kind === 'waiting-room' && <small>4</small>}
      </span>)}{kind !== 'hero' && <span className="pp-nav-item"><Icon icon={Bell} />Notifications</span>}</div>
      <div className="pp-nav-bottom"><span className="pp-nav-item"><Icon icon={LogOut} />Déconnexion</span></div>
    </aside>
    <div className="pp-app-main">
      {children}
    </div>
    {kind === 'hero' && <div className="hp-nav-scrim" aria-hidden="true" style={{ opacity: drawerOpacity }} />}
  </div>;
}

function PatientStrip() {
  return <div className="pp-patient-strip"><Icon icon={ArrowLeft} /><span className="pp-avatar pp-avatar-small">{patient.initials}</span><div><strong>{patient.name}</strong><small>{patient.age} · Femme · {patient.record}</small></div><Badge>Consultation en cours</Badge><span className="pp-push"><Icon icon={MoreHorizontal} /></span></div>;
}

function EncounterHeading({ voice = false }: { voice?: boolean }) {
  // Reuse presentation CSS; EncounterPage itself calls useId, so keep this replica hook-free.
  return <header className={`${encounterStyles.header} pp-encounter-heading`}>
    <div className={encounterStyles.heading}><span className={encounterStyles.icon}><Icon icon={Stethoscope} size={22} /></span><div><h2>Consultation</h2><p>Données cliniques, examens et prescriptions</p></div></div>
    <Control icon={voice ? Mic : Check} primary>{voice ? 'Assistant vocal' : 'Enregistrer'}</Control>
  </header>;
}

function Field({ label, children, active = false, empty = false }: { label: string; children: ReactNode; active?: boolean; empty?: boolean }) {
  return <div className={`pp-field ${active ? 'is-filled' : ''}`} data-field={label}><span className="pp-field-label">{label}{active && <Icon icon={Sparkles} size={12} />}</span><div className={`pp-field-value ${empty ? 'is-empty' : ''}`}>{children}</div></div>;
}

function ClinicalFields({ frame = 719, voice = false }: { frame?: number; voice?: boolean }) {
  const ambientReady = !voice || frame >= 210;
  const directReady = !voice || frame >= 510;
  return <div className="pp-clinical-grid">
    <Card title="Motif de consultation" icon={ClipboardList} action={<Control icon={Plus} />}>
      <Field label="Motif" active={voice && ambientReady} empty={!ambientReady}>{ambientReady ? 'Consultation de suivi · Fatigue' : 'Ajouter un motif de consultation…'}</Field>
    </Card>
    <Card title="Mesures et scores" icon={HeartPulse} action={<Control icon={Plus} />}>
      <div className="pp-vitals"><div><small>TA</small><strong>120<span>/80</span></strong><small>mmHg</small></div><div><small>Fréquence</small><strong>72</strong><small>bpm</small></div><div><small>Température</small><strong>36,8</strong><small>°C</small></div></div>
    </Card>
    <Card title="Histoire de la maladie" icon={AlignLeft} className="pp-wide">
      <Field label="Observations" active={voice && ambientReady} empty={!ambientReady}>{ambientReady ? 'Fatigue depuis une semaine, surtout en fin de journée. Sommeil perturbé. Pas de fièvre rapportée.' : 'Renseigner l’histoire de la maladie…'}</Field>
    </Card>
    <Card title="Examen clinique" icon={Stethoscope} className="pp-wide">
      <Field label="Examen" active={voice && directReady} empty={!directReady}>{directReady ? 'Bon état général. Auscultation cardio-pulmonaire sans particularité.' : 'Renseigner les observations cliniques…'}</Field>
    </Card>
    <Card title="Conduite à tenir" icon={ClipboardList} className="pp-wide">
      <div className="pp-plan-row"><span><Icon icon={CalendarDays} />Contrôle dans 4 semaines</span><Badge>À planifier</Badge></div>
    </Card>
  </div>;
}

function IdentityCard() {
  return <Card title="État civil" action={<Control icon={MoreHorizontal} />} className="pp-identity">
    <span className="pp-avatar pp-avatar-large">{patient.initials}</span><h3>{patient.name} <span>♀</span></h3><p>{patient.birth} ({patient.age})</p><small>Créé le 14 janvier 2025</small>
    <dl>{[['Groupe sanguin', 'O+'], ['Wilaya', 'Alger'], ['Assurance', 'CNAS'], ['N° dossier papier', patient.record]].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
  </Card>;
}

function Timeline({ compact = false }: { compact?: boolean }) {
  return <div className={`pp-timeline ${compact ? 'is-compact' : ''}`}>
    {[
      { date: '10 sept. 2026', icon: Stethoscope, title: 'Consultation de suivi', body: 'Fatigue · Dr Salma Latif', status: 'En cours' },
      { date: '06 août 2026', icon: Activity, title: 'Bilan biologique', body: 'NFS · Glycémie à jeun · Créatinine', status: 'Terminé' },
      { date: '06 août 2026', icon: FileText, title: 'Compte rendu de consultation', body: 'Document · Dr Salma Latif', status: 'Document' },
    ].map(item => <div className="pp-timeline-item" key={item.title}><time>{item.date}</time><span className="pp-timeline-dot" /><div className="pp-timeline-card"><span><Icon icon={item.icon} /><strong>{item.title}</strong></span><p>{item.body}</p><Badge tone={item.status === 'Terminé' ? 'green' : 'blue'}>{item.status}</Badge></div></div>)}
  </div>;
}

function PatientRecords() {
  return <AppShell kind="patient-records"><div className="pp-records">
    <aside className="pp-patient-list"><div className="pp-list-title"><strong>Patients</strong><Control icon={Plus} primary /></div><div className="pp-search"><Icon icon={Search} />Rechercher un patient</div><small className="pp-muted">5 patients · Dossiers fictifs</small>{patients.map((name, index) => <div className={`pp-patient-list-item ${index === 0 ? 'is-active' : ''}`} key={name}><span className="pp-avatar pp-avatar-small">{name.split(' ').map(word => word[0]).join('')}</span><div><strong>{name}</strong><small>{[44, 38, 29, 52, 34][index]} ans · {index === 0 ? patient.record : `DEMO-025${index}`}</small></div></div>)}</aside>
    <div className="pp-record-main"><PageHeader className="pp-page-heading" title="Dossier patient" subTitle="Informations et parcours de soins" trailing={<Control icon={Plus} primary>Consultation</Control>} /><div className="pp-record-summary"><IdentityCard /><div><Card title="Antécédents" icon={History}><div className="pp-antecedent"><small>MÉDICAUX</small><strong>Aucun antécédent déclaré</strong></div><div className="pp-antecedent"><small>ALLERGIES</small><strong>Aucune allergie connue</strong></div><div className="pp-antecedent"><small>FAMILIAUX</small><strong>Non renseignés</strong></div></Card><div className="pp-record-note"><Icon icon={ShieldCheck} />Dossier suivi par Dr Salma Latif</div></div></div><div className="pp-tabs"><span className="is-active">Vue d’ensemble</span><span>Consultations</span><span>Examens</span><span>Documents</span></div><h3 className="pp-section-title">Parcours du patient</h3><Timeline compact /></div>
  </div></AppShell>;
}


function AssistantPanel({ children, title = 'Assistant REMED', subtitle = 'Compte rendu de consultation.docx', composer = 'Demandez une modification…', status = 'Prêt', className = '' }: { children: ReactNode; title?: string; subtitle?: string; composer?: string; status?: string; className?: string }) {
  return <aside className={`pp-agent ${className}`} aria-label={title}>
    <header className="pp-agent-heading"><span className="pp-agent-emblem"><Icon icon={Sparkles} size={18} /></span><div><strong>{title}</strong><small>{subtitle}</small></div><Icon icon={MoreHorizontal} /></header>
    <div className="pp-agent-context"><Icon icon={FileText} size={14} /><span>Contexte : <strong>{patient.name}</strong></span><Badge>Consultation</Badge></div>
    <div className="pp-messages">{children}</div>
    <div className="pp-composer"><div>{composer}</div><footer><span>{status}</span><span><Icon icon={Paperclip} /><Icon icon={Mic} /><span className="pp-send"><Icon icon={Send} size={15} /></span></span></footer></div>
  </aside>;
}

function Message({ children, user = false, applied = false }: { children: ReactNode; user?: boolean; applied?: boolean }) {
  return <div className={`pp-message ${user ? 'is-user' : ''}`}><small className="pp-message-author">{user ? 'Vous' : 'Assistant REMED'}</small><div>{children}</div>{applied && <small className="pp-applied"><Icon icon={CheckCheck} size={13} />DOCX mis à jour</small>}</div>;
}

function DocumentDemo({ frame: playbackFrame }: { frame: number }) {
  const frame = playbackFrame * 1.2;
  const recording = frame >= 180;
  const panelProgress = easeOutCubic(progress(frame, 72, 30));
  const focus = (start: number, end: number) => easeOutCubic(progress(frame, start, 30)) * (1 - easeOutCubic(progress(frame, end, 30)));
  const buttonZoom = easeOutCubic(progress(frame, 8, 20)) * (1 - easeOutCubic(progress(frame, 40, 22)));
  const historyZoom = focus(300, 520);
  const assistantZoom = focus(570, 870);
  const planZoom = focus(930, 1190);
  const zoom = buttonZoom * .65 + historyZoom * .55 + assistantZoom * .6 + planZoom * .6;
  const origin = frame < 130 ? '100% 30px' : frame < 560 ? '20px 330px' : frame < 915 ? '100% 320px' : '20px 405px';
  const secondRequest = frame >= 600;
  const speaking = (frame >= 190 && frame < 285) || (frame >= 610 && frame < 855);
  const historySelected = frame >= 345 && frame < 390;
  const planSelected = frame >= 970 && frame < 1010;
  const stage = frame < 180 ? 'intro' : frame < 300 ? 'history-request' : frame < 550 ? 'history-edit' : frame < 930 ? 'plan-request' : 'plan-edit';
  const cursor = cursorMotion(frame, [
    { frame: 0, x: -370, y: 170 }, { frame: 26, x: -370, y: 170 },
    { frame: 46, x: -182, y: 30 }, { frame: 140, x: -182, y: 30 },
    { frame: 160, x: -145, y: 366 }, { frame: 192, x: -145, y: 366 },
    { frame: 208, x: -80, y: 440 },
  ], [72, 180]);
  const sceneStyle = { '--panel-progress': panelProgress, transform: 'scale(' + (1 + zoom) + ')', transformOrigin: origin } as CSSProperties;
  const level = speaking ? (0.35 + 0.65 * Math.abs(Math.sin(frame * 0.39))) : 0;
  const orbStyle = { '--orb-scale': 1 + level * 0.22, '--orb-turn': (frame * 1.8) + 'deg', '--orb-glow': (18 + level * 22) + 'px' } as CSSProperties;
  return <div className="pp-document" style={sceneStyle} data-scene="document" data-step={stage} data-recording={recording} data-panel-open={frame >= 72}>
    <header className="pp-editor-header"><Control icon={ChevronLeft} /><div><strong>Compte rendu de consultation</strong><small>{patient.name} - {patient.age}</small></div><div className="pp-editor-actions"><Control icon={Undo2} label="Annuler" className="pp-editor-icon-action" /><Control icon={Redo2} label="Rétablir" className="pp-editor-icon-action" /><Control icon={FileUp} label="Importer" className="pp-editor-icon-action" /><Control icon={ArrowDownToLine} label="Enregistrer sous" className="pp-editor-icon-action" /><Control icon={Send} label="Envoyer au secrétariat" className="pp-editor-icon-action" /><Control icon={Printer} label="Imprimer" className="pp-editor-icon-action" /><Control icon={Bot} className="pp-assistant-toggle">Assistant vocal</Control><Control icon={Save} primary>Enregistrer</Control><Control icon={X} /></div></header>
    <div className="pp-editor-body"><div className="pp-editor-workspace">
      <div className="pp-word-toolbar"><span className="pp-zoom">100% <Icon icon={ChevronDown} size={10} /></span><span className="pp-font-picker">Arial <Icon icon={ChevronDown} size={10} /></span><i /><span className="pp-font-size">12 <Icon icon={ChevronDown} size={10} /></span><i /><Icon icon={Bold} /><Icon icon={Italic} /><Icon icon={Underline} /><Icon icon={Strikethrough} /><span className="pp-text-color">A</span><i /><Icon icon={Link} /><Icon icon={Image} /><Icon icon={Table2} /><i /><Icon icon={AlignLeft} /><Icon icon={List} /><Icon icon={Ruler} /><span className="pp-push"><Icon icon={Search} /></span></div>
      <div className="pp-paper-area"><div className="pp-ruler" aria-hidden="true">1<span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span><span>8</span></div>
        <article className="pp-paper"><div className="pp-letterhead"><div><strong>Dr Salma Latif</strong><span>Médecine générale</span><small>Cabinet des Oliviers · Alger</small></div><span className="pp-letterhead-symbol"><Icon icon={Stethoscope} size={26} /></span></div><div className="pp-paper-date">Alger, le 10 septembre 2026</div><h2>COMPTE RENDU DE CONSULTATION</h2><div className="pp-paper-patient"><strong>{patient.name}</strong><span>{patient.age} · Dossier {patient.record}</span></div>
          <section><h3>Motif de consultation</h3><p>Consultation de suivi. Fatigue évoluant depuis une semaine.</p></section>
          <section data-document-section="history"><h3>Histoire de la maladie</h3><p className={historySelected ? 'pp-text-selection' : ''} data-edit="history">
            {frame < 390 ? originalHistory : frame < 410 ? <span className="pp-rewrite-caret" /> : <AnimatedWords text={summarizedHistory} frame={frame} start={410} />}
          </p></section>
          <section><h3>Examen clinique</h3><p>Bon état général. TA : 120/80 mmHg. FC : 72 bpm.<br />Auscultation cardio-pulmonaire sans particularité.</p></section>
          <section data-document-section="plan"><h3>Conduite à tenir</h3><p className={planSelected ? 'pp-text-selection' : ''} data-edit="plan">
            {frame < 1010 ? 'Surveillance de l’évolution des symptômes.' : frame < 1030 ? <span className="pp-rewrite-caret" /> : <AnimatedWords text={updatedPlan} frame={frame} start={1030} stagger={2.5} />}
          </p></section>
          <div className="pp-signature">Dr Salma Latif</div><footer>Cabinet des Oliviers · Document de démonstration</footer>
        </article>
      </div>
    </div>
      <aside className="pp-document-voice" aria-label="Assistant vocal" aria-hidden={frame < 72} style={{ opacity: panelProgress, visibility: frame < 72 ? 'hidden' : 'visible' }}>
        <header className="pp-document-voice-heading"><span className="pp-agent-emblem"><Icon icon={Bot} size={20} /></span><div><strong>Assistant vocal</strong></div></header>
        <div className="pp-document-voice-session">
          <div className="pp-orb-stage"><div className="pp-voice-orb" style={orbStyle} aria-hidden="true"><div className="pp-orb-cloud" /><div className="pp-orb-shine" /></div></div>
          <>{recording ? <>
          <div className="pp-speech-bubble" style={{ opacity: secondRequest ? easeOutCubic(progress(frame, 600, 15)) : 1 - easeOutCubic(progress(frame, 555, 25)), transform: 'translateY(' + (secondRequest ? 6 * (1 - easeOutCubic(progress(frame, 600, 20))) : -6 * progress(frame, 555, 25)) + 'px)' }}>
            <span className="pp-speaker-tag">Vous<span className="pp-mini-waves" aria-hidden="true">{Array.from({ length: 9 }, (_, index) => <i key={index} style={{ height: speaking ? 3 + 12 * Math.abs(Math.sin(frame / 4 + index * 1.7)) : 3 }} />)}</span></span>
            <p><AnimatedWords text={documentSpeech[secondRequest ? 1 : 0]} frame={frame} start={secondRequest ? 610 : 190} stagger={8} duration={14} revealLayout /></p>
          </div>
          <div className="pp-document-voice-controls"><Control icon={Paperclip} className="pp-voice-attachment" label="Ajouter une pièce jointe" /><Control icon={Square} className="pp-voice-stop">Arrêter l’enregistrement</Control></div></> : <Control icon={Mic} className="pp-voice-start">Commencer</Control>}</>
        </div>
      </aside>
    </div>
    <div className="hp-cursor pp-document-cursor" aria-hidden="true" style={{ left: 'calc(100% + ' + cursor.x + 'px)', top: cursor.y, opacity: progress(frame, 10, 12) * (1 - progress(frame, 205, 15)) }}>
      {cursor.clickProgress !== null && <span className="hp-click" style={{ opacity: 1 - easeOutCubic(cursor.clickProgress), transform: 'scale(' + (0.4 + easeOutCubic(cursor.clickProgress) * 1.4) + ')' }} />}
      <svg width="26" height="32" viewBox="0 0 26 32" style={{ transform: 'scale(' + (cursor.clickProgress === null ? 1 : 1 - Math.sin(Math.PI * cursor.clickProgress) * 0.12) + ')' }}><path d="M2 2v24l6-6 5 10 5-3-5-9h10Z" fill="var(--remed-text)" stroke="white" strokeWidth="2" strokeLinejoin="round" /></svg>
    </div>
  </div>;
}

function Waveform({ frame, active }: { frame: number; active: boolean }) {
  return <div className="pp-waveform" aria-hidden="true">{Array.from({ length: 43 }, (_, index) => <span key={index} style={{ height: active ? `${7 + 25 * Math.abs(Math.sin(index * 1.73 + frame / 9)) * (0.4 + 0.6 * Math.abs(Math.cos(index * 0.4)))}px` : '5px' }} />)}</div>;
}

function VoiceDemo({ frame }: { frame: number }) {
  const direct = frame >= 360;
  const ready = frame >= 630;
  const stage = ready ? 'complete' : frame >= 510 ? 'direct-fields' : direct ? 'direct' : frame >= 210 ? 'ambient-fields' : 'ambient';
  return <AppShell kind="voice"><div data-scene="voice" data-step={stage}><PatientStrip /><div className="pp-workspace"><EncounterHeading voice /><div className="pp-voice-grid"><ClinicalFields frame={frame} voice />
    <aside className="pp-voice-panel"><header><span className="pp-blue-icon"><Icon icon={Mic} size={20} /></span><div><h3>Assistant vocal</h3><small>Consultation de {patient.name}</small></div></header><div className="pp-mode-tabs"><span className={!direct ? 'is-active' : ''}>Capture ambiante</span><span className={direct ? 'is-active' : ''}>Dictée directe</span></div>
      <div className="pp-recording"><div><span className={`pp-recording-dot ${ready ? 'is-idle' : ''}`} /><strong>{ready ? 'Transcription terminée' : direct ? 'Dictée en cours' : 'Écoute de la consultation'}</strong><time>00:{String(Math.min(23, Math.floor(frame / 30))).padStart(2, '0')}</time></div><Waveform frame={frame} active={!ready && (frame < 210 || (frame >= 360 && frame < 510))} /><small>{direct ? 'Dictée dans le champ « Examen clinique »' : 'La conversation est transcrite au fil de l’échange.'}</small></div>
      <div className="pp-transcript"><h4><Icon icon={AlignLeft} size={14} />Transcript <Badge>{direct ? 'Dictée' : 'Ambiant'}</Badge></h4>
        {!direct ? <><p><small>Dr Salma Latif · 00:01</small>Comment vous sentez-vous depuis notre dernier rendez-vous ?</p>{frame >= 55 && <p><small>Nora Mansouri · 00:03</small>Je suis fatiguée depuis une semaine, surtout en fin de journée.</p>}{frame >= 120 && <p><small>Nora Mansouri · 00:05</small>Je dors moins bien. Je n’ai pas de fièvre.</p>}</> : <><p><small>Dr Salma Latif · 00:13</small>{frame >= 420 ? 'Examen clinique : bon état général. Auscultation cardio-pulmonaire sans particularité.' : 'Examen clinique : bon état général…'}</p><div className="pp-transcript-source"><Icon icon={Check} size={13} />Capture ambiante conservée<small>Motif et histoire de la maladie renseignés</small></div></>}
      </div>
      <div className="pp-voice-result">{frame >= 210 && <><Icon icon={CheckCheck} /><span>{direct && frame >= 510 ? 'Examen clinique renseigné' : '2 champs renseignés'}<small>{direct && frame >= 510 ? 'Dictée directe · Consultation en cours' : 'Motif · Histoire de la maladie'}</small></span></>}</div>
      <div className="pp-voice-footer"><Control icon={ready ? Check : Mic} primary>{ready ? 'Informations intégrées' : 'Reconnaissance vocale'}</Control><span>F4</span></div>
    </aside>
  </div></div></div></AppShell>;
}

function PatientAssistantDemo({ frame }: { frame: number }) {
  const stage = frame < 150 ? 'context' : frame < 300 ? 'recommendations' : frame < 450 ? 'interactions' : 'treatment';
  const answered = frame >= 150;
  return <AppShell kind="assistant"><div data-scene="assistant" data-step={stage}><PatientStrip /><div className="pp-assistant-workspace"><div className="pp-assistant-patient"><PageHeader className="pp-page-heading" title="Parcours du patient" subTitle="Nora Mansouri · Consultation du 10 septembre" />
    <div className="pp-tabs"><span className="is-active">Vue d’ensemble</span><span>Traitements</span><span>Examens</span></div><Card title="Consultation en cours" icon={Stethoscope}><div className="pp-patient-context"><Badge>10 sept. 2026</Badge><span>Dr Salma Latif</span></div><Field label="Motif">Consultation de suivi · Fatigue</Field><p>Fatigue depuis une semaine. Sommeil perturbé. Examen clinique sans particularité.</p></Card>
    <Card title="Traitement renseigné" icon={Pill}><div className="pp-treatment-context"><strong>Paracétamol 500 mg</strong><span>Si douleur · Prescription de 3 jours</span><small>Prises réelles et automédication à confirmer</small></div></Card>
    <Card title="Allergies et examens" icon={ShieldCheck}><div className="pp-clinical-context-row"><strong>Aucune allergie déclarée</strong><small>À confirmer avec la patiente</small></div><div className="pp-clinical-context-row"><strong>Bilan biologique · 06 août 2026</strong><small>NFS · Glycémie · Créatinine</small><Badge tone="green">Résultats disponibles dans le dossier</Badge></div></Card>
  </div><AssistantPanel title="Discussion avec l’IA" subtitle="Dossier patient · Consultation en cours" composer="Posez une question sur le traitement…" status="Réponse à confronter au contexte clinique" className="pp-clinical-chat">
    <div className="pp-context-attached"><Icon icon={Paperclip} size={14} /><div><strong>Dossier de {patient.name}</strong><small>Paracétamol 500 mg · Aucune allergie déclarée · Bilan du 06 août</small></div><Icon icon={Check} size={13} /></div>
    <Message user>Quels points vérifier avant d’adapter son traitement ?</Message>
    {answered ? <Message><strong>Points à vérifier pour Nora</strong><ul><li data-topic="reconciliation"><strong>Conciliation.</strong> Confirmer les prises, l’automédication et les compléments.</li><li data-topic="allergies"><strong>Allergies.</strong> Aucune déclarée ; à confirmer avec Nora.</li>{frame >= 300 && <li data-topic="interactions"><strong>Interactions.</strong> Vérifier la liste complète dans la référence médicamenteuse.</li>}{frame >= 450 && <li data-topic="exams"><strong>Examens.</strong> Relire les valeurs et la date du bilan du 06 août.</li>}</ul><span className="pp-source-citation"><Icon icon={Paperclip} size={12} />Sources : ordonnance · allergies · bilan du dossier</span></Message> : <Message><span className="pp-thinking"><Icon icon={Sparkles} />Lecture du traitement, des allergies et des examens…</span></Message>}
    <div className="pp-clinical-suggestions" aria-label="Suggestions de discussion"><span className={stage === 'recommendations' ? 'is-active' : ''}><Icon icon={Sparkles} size={14} />Recommandations adaptées</span><span className={stage === 'interactions' ? 'is-active' : ''}><Icon icon={ShieldCheck} size={14} />Interactions médicamenteuses</span><span className={stage === 'treatment' ? 'is-active' : ''}><Icon icon={Pill} size={14} />Questions sur le traitement</span></div>
  </AssistantPanel></div></div></AppShell>;
}

function CalendarPreview() {
  const events = [
    { day: 0, top: 30, height: 70, title: 'Nora Mansouri', time: '08:30 – 09:00', type: 'Consultation', tone: 'blue' },
    { day: 0, top: 180, height: 100, title: 'Sami Haddad', time: '10:00 – 11:00', type: 'Suivi', tone: 'purple' },
    { day: 1, top: 80, height: 100, title: 'Lina Amrani', time: '09:00 – 10:00', type: 'Consultation', tone: 'blue' },
    { day: 2, top: 30, height: 70, title: 'Yacine Belkacem', time: '08:30 – 09:00', type: 'Contrôle', tone: 'green' },
    { day: 2, top: 230, height: 70, title: 'Inès Rahmani', time: '10:30 – 11:00', type: 'Consultation', tone: 'blue' },
    { day: 3, top: 130, height: 100, title: 'Nora Mansouri', time: '09:30 – 10:30', type: 'Consultation de suivi', tone: 'blue' },
    { day: 4, top: 80, height: 70, title: 'Lina Amrani', time: '09:00 – 09:30', type: 'Contrôle', tone: 'green' },
    { day: 4, top: 280, height: 100, title: 'Sami Haddad', time: '11:00 – 12:00', type: 'Consultation', tone: 'purple' },
  ];
  return <AppShell kind="calendar"><div className="pp-calendar"><aside className="pp-calendar-sidebar"><h3>Calendrier</h3><Control icon={Plus} primary>Rendez-vous</Control><div className="pp-mini-month"><header><strong>Septembre 2026</strong><Icon icon={ChevronLeft} size={12} /><Icon icon={ChevronRight} size={12} /></header><div className="pp-month-grid">{['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, index) => <small key={`day-${index}`}>{day}</small>)}{Array.from({ length: 35 }, (_, index) => <span key={index} className={index === 10 ? 'is-active' : index === 0 || index > 30 ? 'is-muted' : ''}>{index === 0 ? 31 : index > 30 ? index - 30 : index}</span>)}</div></div><h4>Praticiens</h4><div className="pp-practitioner"><span className="pp-check"><Icon icon={Check} size={10} /></span><span className="pp-avatar pp-avatar-small">SL</span><div><strong>Dr Salma Latif</strong><small>Médecine générale</small></div></div><div className="pp-calendar-legend"><span><i className="pp-blue" />Consultation</span><span><i className="pp-green" />Contrôle</span><span><i className="pp-purple" />Suivi</span></div></aside>
    <div className="pp-calendar-main"><div className="pp-calendar-heading"><div><h2>7 – 11 septembre 2026</h2><small>Agenda de Dr Salma Latif</small></div><Control icon={ChevronLeft} /><Control icon={ChevronRight} /></div><div className="pp-calendar-toolbar"><Control>Aujourd’hui</Control><div className="pp-tabs"><span>Jour</span><span className="is-active">Semaine</span><span>Mois</span></div></div><div className="pp-week-header"><span />{['LUN. 7', 'MAR. 8', 'MER. 9', 'JEU. 10', 'VEN. 11'].map((day, index) => <strong key={day} className={index === 3 ? 'is-active' : ''}>{day}</strong>)}</div><div className="pp-week-grid"><div className="pp-time-column">{['08:00', '09:00', '10:00', '11:00', '12:00'].map(time => <span key={time}>{time}</span>)}</div>{Array.from({ length: 5 }, (_, index) => <div className={`pp-day-column ${index === 3 ? 'is-today' : ''}`} key={index} />)}{events.map((event, index) => <div key={index} className={`pp-calendar-event pp-${event.tone}`} style={{ '--event-day': event.day, top: event.top, height: event.height } as CSSProperties}><small>{event.time}</small><strong>{event.title}</strong><span>{event.type}</span></div>)}<div className="pp-now-line"><span>09:42</span></div></div></div></div></AppShell>;
}

function AccountingPreview() {
  return <AppShell kind="accounting"><div className="pp-workspace pp-accounting"><PageHeader className="pp-page-heading" title="Comptabilité" subTitle="Gérez les paiements de vos patients" trailing={<Control icon={CalendarDays}>10 sept. 2026 <Icon icon={ChevronDown} size={12} /></Control>} />
    <div className="pp-statistics">{[{ title: 'Nombre de consultations', value: '5', icon: Users, tone: 'amber' }, { title: 'Encaissé', value: '12 000', icon: Wallet, tone: 'green' }, { title: 'En attente', value: '2 500', icon: Clock3, tone: 'blue' }, { title: 'Crédits', value: '500', icon: History, tone: 'purple' }].map((item, index) => <section className="pp-stat" key={item.title}><span className={`pp-stat-icon pp-${item.tone}`}><Icon icon={item.icon} size={20} /></span><small>{item.title}</small><strong>{item.value}{index > 0 && <span> DZD</span>}</strong></section>)}</div>
    <div className="pp-accounting-controls"><div className="pp-tabs"><span className="is-active">Tous</span><span>Encaissés</span><span>En attente</span><span>Crédits</span></div><Control icon={Plus} primary>Ajouter un paiement</Control></div>
    <Card title="Paiements du jour" icon={Wallet} action={<Control icon={ArrowDownToLine}>Exporter</Control>}><div className="pp-search"><Icon icon={Search} />Rechercher un patient ou un paiement</div><table className="pp-table"><thead><tr><th>Patient</th><th>Prestation</th><th>Montant</th><th>Statut</th><th>Heure</th></tr></thead><tbody>{patients.map((name, index) => <tr key={name}><td><span className="pp-table-patient"><span className="pp-avatar pp-avatar-small">{name.split(' ').map(word => word[0]).join('')}</span><span><strong>{name}</strong><small>FAC-2026-00{48 + index}</small></span></span></td><td>{index === 3 ? 'Contrôle' : 'Consultation'}</td><td className="pp-money">{['3 000', '3 500', '2 500', '3 000', '3 000'][index]} DZD</td><td><Badge tone={index === 2 ? 'amber' : 'green'}>{index === 2 ? 'En attente' : index === 4 ? 'Partiel' : 'Encaissé'}</Badge></td><td>{['09:42', '09:20', '09:00', '08:45', '08:30'][index]}</td></tr>)}</tbody></table><footer className="pp-table-footer"><span>5 paiements</span><strong>Total facturé <span>15 000 DZD</span></strong></footer></Card>
  </div></AppShell>;
}

function PrescriptionsPreview() {
  return <AppShell kind="prescriptions"><PatientStrip /><div className="pp-workspace"><PageHeader className="pp-page-heading" title="Ordonnance" subTitle="Consultation du 10 septembre 2026" trailing={<Control icon={Printer} primary>Imprimer</Control>} /><div className="pp-prescription-grid"><div><Card title="Médicaments prescrits" icon={Pill}><div className="pp-search"><Icon icon={Search} />Rechercher un médicament</div><div className="pp-medicine"><div><span className="pp-blue-icon"><Icon icon={Pill} /></span><strong>PARACÉTAMOL <small>500 mg · Comprimé</small></strong><Icon icon={MoreHorizontal} /></div><div className="pp-dose-grid"><Field label="Voie">Orale</Field><Field label="Durée">3 jours</Field></div><Field label="Posologie">1 comprimé si douleur, selon prescription</Field><Badge>1 boîte</Badge></div><Control icon={Plus}>Ajouter un médicament</Control></Card><Card title="Instructions" icon={ClipboardList}><p>Respecter les indications du prescripteur.</p><Badge tone="amber">Exemple fictif de prescription</Badge></Card></div><div className="pp-prescription-paper"><article className="pp-paper"><div className="pp-letterhead"><div><strong>Dr Salma Latif</strong><span>Médecine générale</span><small>Cabinet des Oliviers · Alger</small></div><Icon icon={Stethoscope} size={24} /></div><div className="pp-paper-date">Le 10 septembre 2026</div><h2>ORDONNANCE</h2><div className="pp-paper-patient"><strong>{patient.name}</strong><span>{patient.age} · {patient.record}</span></div><div className="pp-prescribed-item"><strong>01. PARACÉTAMOL 500 mg</strong><p>1 comprimé si douleur, selon prescription<br />Voie orale · 3 jours · 1 boîte</p></div><div className="pp-signature">Dr Salma Latif</div><footer>Prescription fictive · Démonstration de l’interface</footer></article></div></div></div></AppShell>;
}

function WaitingRoomPreview() {
  return <div className="pp-waiting-screen"><header><Brand /><div><strong>Cabinet des Oliviers</strong><span>Médecine générale · Salle d’attente</span></div><div className="pp-waiting-clock"><strong>09:42</strong><span>Jeudi 10 septembre 2026</span></div></header><div className="pp-waiting-welcome"><h2>Bienvenue au cabinet</h2><p>Veuillez patienter. Votre numéro s’affichera à l’écran.</p></div><div className="pp-waiting-boxes">{[{ box: 'Cabinet 01', doctor: 'Dr Salma Latif', ticket: 'A 024', next: ['A 025', 'A 026'] }, { box: 'Cabinet 02', doctor: 'Dr Rayan Cherif', ticket: 'B 012', next: ['B 013', 'B 014'] }].map((item, index) => <section className="pp-waiting-box" key={item.box}><header><span className="pp-blue-icon"><Icon icon={Stethoscope} size={23} /></span><div><h3>{item.box}</h3><small>{item.doctor}</small></div><Badge tone="green">En consultation</Badge></header><div className={`pp-ticket ${index === 0 ? 'is-called' : ''}`}><span>{index === 0 ? 'NUMÉRO APPELÉ' : 'EN CONSULTATION'}</span><strong>{item.ticket}</strong><p>{index === 0 ? 'Veuillez vous présenter au cabinet 01' : 'Merci de patienter'}</p></div><footer><span>Prochains numéros</span><div>{item.next.map(ticket => <strong key={ticket}>{ticket}</strong>)}</div></footer></section>)}</div><div className="pp-waiting-bottom"><span><Icon icon={Users} />4 patients en attente</span><span>Merci de respecter le calme de la salle d’attente.</span><Icon icon={HeartPulse} size={23} /></div></div>;
}

function SyntheticEcg() {
  const beat = 'l 16 0 5 -3 5 3 9 0 3 7 5 -42 5 63 4 -28 10 0 7 -8 8 0 7 8 18 0';
  return <svg className="pp-ecg" viewBox="0 0 660 360" role="img" aria-label="Tracé ECG synthétique de démonstration, sans données patient réelles">
    <rect width="660" height="360" fill="var(--remed-surface, #fff)" />
    <g stroke="var(--remed-danger, #b23f4b)" strokeWidth="0.5" opacity="0.16">{Array.from({ length: 67 }, (_, index) => <path key={`v${index}`} d={`M${index * 10} 0V360`} />)}{Array.from({ length: 37 }, (_, index) => <path key={`h${index}`} d={`M0 ${index * 10}H660`} />)}</g>
    <g fill="var(--remed-text-muted, #607086)" fontSize="10" fontFamily="Inter, sans-serif"><text x="20" y="21">ECG SYNTHÉTIQUE · 25 mm/s · 10 mm/mV</text><text x="20" y="63">I</text><text x="20" y="155">II</text><text x="20" y="247">V5</text></g>
    <g fill="none" stroke="var(--remed-text, #26364a)" strokeWidth="1.5" strokeLinejoin="round">{[83, 175, 267].map((y, index) => <path key={y} d={`M25 ${y} ${beat.repeat(5)}`} transform={`translate(${index * 3} 0)`} />)}</g>
    <text x="20" y="342" fill="var(--remed-text-muted, #607086)" fontSize="10" fontFamily="Inter, sans-serif">Illustration codée · Aucune acquisition médicale</text>
  </svg>;
}

function ImagingPreview() {
  return <AppShell kind="medical-imaging"><PatientStrip /><div className="pp-workspace"><PageHeader className="pp-page-heading" title="Examens et imagerie" subTitle="Documents, acquisitions et comptes rendus du patient" trailing={<Control icon={Plus} primary>Ajouter un examen</Control>} /><div className="pp-imaging-workspace"><aside><h3>Examens du patient</h3><div className="pp-image-series is-active"><Icon icon={Activity} size={25} /><strong>Électrocardiogramme</strong><small>10 sept. 2026 · 1 document</small><Badge>ECG synthétique</Badge></div><div className="pp-image-series"><Icon icon={FileText} size={25} /><strong>Bilan biologique</strong><small>06 août 2026 · 3 résultats</small><Badge tone="green">Terminé</Badge></div></aside><div className="pp-image-viewer"><header><div><Icon icon={Activity} /><strong>Électrocardiogramme</strong></div><span><Icon icon={Search} /><Icon icon={Maximize2} /><Icon icon={ArrowDownToLine} /></span></header><div className="pp-ecg-stage"><SyntheticEcg /></div><footer><span><Icon icon={Image} size={14} />Document 1 / 1</span><span>100 %</span><span><Icon icon={ChevronLeft} /><Icon icon={ChevronRight} /></span></footer><div className="pp-imaging-caption"><Icon icon={FileText} /><div><strong>Compte rendu</strong><p>Tracé de démonstration généré en SVG. Aucune interprétation médicale.</p></div><Badge>Document fictif</Badge></div></div></div></div></AppShell>;
}

/**
 * Fixed 1000 × 650 artboard. The CSS container scales the server-rendered markup
 * exactly like Remotion. Compact crops x=260…1000, y=0…650 (740 × 650).
 * The host owns theme tokens and Inter; no application stylesheet is imported.
 */
export function ProductPreview({ kind, frame, compact = false, allowFractionalFrames = false }: ProductPreviewProps) {
  const definition = compositions.find(demo => demo.id === kind);
  const requestedFrame = frame ?? definition?.posterFrame ?? 0;
  const safeFrame = Number.isFinite(requestedFrame) ? Math.max(0, Math.min(definition ? definition.durationInFrames - 1 : 0, allowFractionalFrames ? requestedFrame : Math.floor(requestedFrame))) : 0;
  let content: ReactNode;
  switch (kind) {
    case 'document': content = <DocumentDemo frame={safeFrame} />; break;
    case 'voice': content = <VoiceDemo frame={safeFrame} />; break;
    case 'assistant': content = <PatientAssistantDemo frame={safeFrame} />; break;
    case 'patient-records': content = <PatientRecords />; break;
    case 'prescriptions': content = <PrescriptionsPreview />; break;
    case 'calendar': content = <CalendarPreview />; break;
    case 'accounting': content = <AccountingPreview />; break;
    case 'waiting-room': content = <WaitingRoomPreview />; break;
    case 'medical-imaging': content = <ImagingPreview />; break;
    default: content = <AppShell kind="hero" drawerOpacity={heroState(safeFrame).drawerProgress}><HeroPatientDemo frame={safeFrame} compact={compact} /></AppShell>;
  }
  return <div className={`product-preview ${compact ? 'is-compact' : ''}`} data-preview-kind={kind} data-preview-frame={safeFrame}>
    <RemedUiScope uiVariant="remed" className="pp-artboard" lang="fr" aria-label={`Aperçu REMED — ${kind} — données fictives`}>
      {kind === 'hero' && <div className="hp-backdrop" aria-hidden="true"><span className="hp-orb" /><span className="hp-orb hp-orb-lavender" /><span className="hp-orb hp-orb-peach" /></div>}
      {content}{kind === 'hero' && <HeroMobileDemo frame={safeFrame} />}{kind !== 'hero' && kind !== 'document' && <div className="pp-fiction-label"><span />Données fictives</div>}
    </RemedUiScope>
  </div>;
}

export default ProductPreview;
