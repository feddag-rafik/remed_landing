import React, { type CSSProperties, type ReactNode } from 'react';
import {
  Activity, ArrowUpRight, Check, ChevronDown, ChevronLeft, FolderOpen, TriangleAlert, Filter,
  MoreHorizontal, Plus, Search,
  Stethoscope, UserRound, X, type LucideIcon,
} from 'lucide-react';
import { PatientHistoryIcon } from '../components/patientHistoryIcon';
import { easeOutCubic, entrance, heroCursor, heroState, heroTiming } from './heroTimeline';
import './heroPatientDemo.css';

export const patients = [
  { name: 'Nora Mansouri', initials: 'NM', age: 44, female: true },
  { name: 'Yacine Belkacem', initials: 'YB', age: 38, female: false },
  { name: 'Lina Amrani', initials: 'LA', age: 29, female: true },
  { name: 'Sami Haddad', initials: 'SH', age: 52, female: false },
  { name: 'Inès Rahmani', initials: 'IR', age: 34, female: true },
];
const history = [
  { label: 'Vue d’ensemble', kind: 'overview', count: 0 },
  { label: 'Consultations', kind: 'consultation', count: 2 },
  { label: 'Hospitalisations', kind: 'hospitalisation', count: 0 },
  { label: 'Examens', kind: 'exam', count: 1 },
  { label: 'Chirurgies', kind: 'intervention', count: 0 },
  { label: 'Rendez-vous', kind: 'appointment', count: 0 },
  { label: 'Ordonnances', kind: 'ordonnance', count: 0 },
  { label: 'Mesures', kind: 'mesure', count: 0 },
  { label: 'Documents', kind: 'document', count: 0 },
  { label: 'Fichiers', kind: 'upload', count: 0 },
  { label: 'Cures', kind: 'cure', count: 0 },
] as const;
const events = [
  { date: '10 sept. 2026', category: 'Consultation', title: 'Suivi cardiovasculaire', summary: 'Suivi de la tension et du bilan lipidique.', icon: Stethoscope },
  { date: '06 août 2026', category: 'Examen', title: 'Bilan lipidique', summary: 'Cholestérol total · HDL · LDL · Triglycérides', icon: Activity },
  { date: '04 août 2026', category: 'Consultation', title: 'Consultation de suivi', summary: 'Bilan biologique prescrit. Contrôle programmé.', icon: Stethoscope },
];

function Header({ icon: Icon, title, children }: { icon: LucideIcon; title: string; children?: ReactNode }) {
  return <header className="hp-card-header"><h3><Icon size={16} />{title}</h3>{children ?? <MoreHorizontal size={16} />}</header>;
}

function Tile({ label, selected = false, target }: { label: string; selected?: boolean; target?: string }) {
  return <div className={`hp-choice ${selected ? 'is-selected' : ''}`} data-hero-target={target} data-selected={selected}>
    {selected && <X size={12} />}<strong>{label}</strong>{selected && <ChevronDown size={12} />}
  </div>;
}

function DrawerCategory({ title, children, search = false }: { title: string; children: ReactNode; search?: boolean }) {
  return <section className="hp-drawer-category"><h4>{title}</h4>{search && <div className="hp-search"><Search size={13} /><span>Rechercher…</span></div>}{children}</section>;
}

export function HeroPatientDemo({ frame, compact }: { frame: number; compact: boolean }) {
  const state = heroState(frame);
  const cursor = heroCursor(frame, compact);
  return <div className="hp-scene" data-scene="hero" data-patient-selected={state.selected}>
    <aside className="hp-list">
      <div className="hp-list-toolbar">
        <div className="hp-search"><Search size={14} /><span>Rechercher</span></div>
        <span className="hp-filter"><Filter size={14} /></span>
        <span className="hp-add-patient">Ajouter</span>
      </div>
      <div className="hp-patients">{patients.map((patient, index) => <div key={patient.initials}
        className={`hp-patient ${state.selected && index === 0 ? 'is-selected' : ''}`}
        data-hero-target={index === 0 ? 'patient' : undefined} data-patient={index}
        style={{ ...entrance(frame, heroTiming.patients[index]!), opacity: Number(entrance(frame, heroTiming.patients[index]!).opacity) }}>
        <span className="hp-avatar"><UserRound size={18} /></span>
        <div><strong>{patient.name}</strong><small>{patient.age} ans</small></div>
      </div>)}</div>
    </aside>

    <main className="hp-main">
      {!state.selected ? <EmptyState /> : <div className="hp-dossier">
        <div className="hp-summary">
          <section className="hp-card hp-identity" data-hero-section="identity" style={entrance(frame, heroTiming.identity)}>
            <Header title="État civil" icon={UserRound}><span className="hp-edit">Modifier</span></Header>
            <div className="hp-identity-person"><span className="hp-avatar"><UserRound size={32} /></span><strong>MANSOURI Nora <span className="hp-female">♀</span></strong><small>18 juin 1982 (44 ans)</small></div>
            <p className="hp-created">Créé le 14 janvier 2025</p>
          </section>
          <section className="hp-card hp-antecedents" data-hero-section="antecedents" style={entrance(frame, heroTiming.antecedents)}>
            <Header title="Antécédents et FDR" icon={TriangleAlert}><span className="hp-add" data-hero-target="add"><Plus size={18} /></span></Header>
            <div className="hp-antecedent-list"><div className="hp-antecedent" data-record-antecedent="appendectomy"><strong>Appendicectomie</strong><small>2010 · Sans complication</small></div>
            {state.confirmed && heroTiming.added.map((start, index) => frame >= start && <div key={start}
              className="hp-antecedent hp-new-antecedent" data-record-antecedent={index === 0 ? 'hypertension' : 'dyslipidemia'} style={entrance(frame, start)}>
              <strong>{index === 0 ? 'Hypertension artérielle' : 'Dyslipidémie'}<Check size={12} /></strong>
            </div>)}</div>
          </section>
        </div>
        <div className="hp-history-chips" data-hero-section="chips" style={entrance(frame, heroTiming.chips)}>
          {history.map(({ label, kind, count }, index) => <div key={kind} className={`hp-history-tab ${index === 0 ? 'is-active' : ''}`}>
            <div className="hp-history-tab-content"><PatientHistoryIcon kind={kind} size={18} /><span>{label}</span></div>
            {count > 0 && <span className="hp-history-count">{count}</span>}
          </div>)}
        </div>
        <section className="hp-overview" aria-label="Vue d’ensemble du patient">
          <div className="hp-overview-heading" style={entrance(frame, heroTiming.overview[0])}><span>Actualiser</span></div>
          <ol>{events.map(({ date, category, title, summary, icon: Icon }, index) => <li key={date} data-hero-event={index} style={entrance(frame, heroTiming.overview[index]!)}>
            <time>{date}</time><span className="hp-rail"><i /></span><article className="hp-event">
              <div className="hp-event-top"><span><Icon size={14} />{category}</span><ArrowUpRight size={13} /></div><strong>{title}</strong><p>{summary}</p><span className="hp-status">Terminé</span>
            </article>
          </li>)}</ol>
        </section>
      </div>}
    </main>

    {state.drawerVisible && <div className="hp-drawer-layer" data-hero-section="drawer">
      <aside className="hp-drawer" aria-label="Antécédents et FDR" style={{ transform: `translateX(${(1 - state.drawerProgress) * 100}%)`, "--hp-scrim-opacity": state.drawerProgress * 0.3 } as CSSProperties}>
        <header className="hp-drawer-heading"><span className="hp-drawer-icon"><ChevronLeft size={22} /></span><h2>Antécédents et FDR</h2></header>
        <div className="hp-drawer-body">
          <DrawerCategory title="Facteurs de risques" search><Tile label="Diabète" /><Tile label="Obésité connue" /><Tile label="Tabagisme" /><Tile label="Sédentarité" /><Tile label="Apnées du sommeil" /><Tile label="HTA" /><Tile label="Surpoids" /></DrawerCategory>
          <DrawerCategory title="Antécédents physiologiques" search><Tile label="Naissance" /><Tile label="Grossesse" /><Tile label="Ménopause" /><Tile label="Consanguinité" /><Tile label="Projet de grossesse" /><Tile label="Allaitement" /><Tile label="Prématurité" /></DrawerCategory>
          <DrawerCategory title="Antécédents pathologiques" search>
            <Tile label="Hypertension artérielle" selected={state.hypertension} target="hypertension" />
            <Tile label="Dyslipidémie" selected={state.dyslipidemia} target="dyslipidemia" />
            <Tile label="Asthme" /><Tile label="Myopie" /><Tile label="Hypothyroïdie" /><Tile label="Diabète connu" /><Tile label="Maladie rénale" />
          </DrawerCategory>
          <DrawerCategory title="Antécédents chirurgicaux" search><Tile label="Appendicectomie" selected /><Tile label="Cholécystectomie" /><Tile label="Chirurgie cardiaque" /><Tile label="Angioplastie coronaire" /><Tile label="Prothèse valvulaire" /><Tile label="Césarienne" /><Tile label="Cure de hernie" /></DrawerCategory>
          <DrawerCategory title="Antécédents familiaux"><div className="hp-family-tree">Arbre généalogique</div><Tile label="Père" /><Tile label="Mère" /><Tile label="Grand-père" /><Tile label="Grand-mère" /><Tile label="Frère" /><Tile label="Sœur" /><Tile label="Fils" /></DrawerCategory>
        </div>
        <footer className="hp-drawer-footer"><span className="hp-cancel">Annuler</span><span className="hp-confirm" data-hero-target="confirm">Confirmer</span></footer>
      </aside>
    </div>}
    <div className="hp-cursor" aria-hidden="true" data-hero-cursor style={{ left: cursor.x, top: cursor.y, opacity: frame >= heroTiming.mobile ? 0 : cursor.opacity }}>
      {cursor.clickProgress !== null && <span className="hp-click" style={{ opacity: 1 - easeOutCubic(cursor.clickProgress), transform: `scale(${0.4 + easeOutCubic(cursor.clickProgress) * 1.4})` }} />}
      <svg width="26" height="32" viewBox="0 0 26 32" style={{ transform: `scale(${cursor.clickProgress === null ? 1 : 1 - Math.sin(Math.PI * cursor.clickProgress) * 0.12})` }}><path d="M2 2v24l6-6 5 10 5-3-5-9h10Z" fill="var(--remed-text)" stroke="white" strokeWidth="2" strokeLinejoin="round" /></svg>
    </div>
  </div>;
}

function EmptyState() {
  return <div className="hp-empty"><FolderOpen size={58} strokeWidth={1.25} /><strong>Aucun patient choisi</strong><p>Veuillez choisir un patient</p></div>;
}
