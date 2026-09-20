import React from 'react';
import { Activity, BedDouble, ChevronLeft, ClipboardPlus, Filter, FolderOpen, History, Info, Menu, MessageCircle, Mic, Monitor, Plus, Search, TestTube, TriangleAlert, UserRound } from 'lucide-react';
import { patients } from './HeroPatientDemo';
import { easeOutCubic, entrance, heroTiming, mobileHeroCursor, mobileHeroState } from './heroTimeline';

/** A presentation-only replica; all clicks and navigation follow the shared clock. */
export function HeroMobileDemo({ frame }: { frame: number }) {
  const state = mobileHeroState(frame);
  const cursor = mobileHeroCursor(frame);
  if (!state.visible) return null;
  const compartments = [
    { title: 'Motif(s)', icon: MessageCircle, empty: 'Aucun motif ajouté' },
    { title: 'Histoire de la maladie', icon: History, empty: 'Aucun élément trouvé' },
    { title: 'Antécédents et FDR', icon: TriangleAlert, empty: 'Aucun élément trouvé' },
    { title: 'Diagnostic(s)', icon: ClipboardPlus, empty: 'Aucun diagnostic ajouté' },
    { title: 'Événements', icon: Activity, empty: 'Examen clinique initial' },
  ];
  return <section className="hm-window" aria-label="Démonstration de consultation mobile" data-mobile-scene={state.picker ? 'picker' : state.added ? 'added' : state.consultation ? 'consultation' : 'patients'} style={entrance(frame, heroTiming.mobile)}>
    <div className="hp-backdrop hm-backdrop" aria-hidden="true"><span className="hp-orb" /><span className="hp-orb hp-orb-lavender" /><span className="hp-orb hp-orb-peach" /></div>
    {!state.consultation ? <div className="hm-patients">
      <div className="hm-toolbar"><span className="hm-search"><Search size={14} />Rechercher</span><span className="hm-filter"><Filter size={14} /></span><span className="hm-primary">Ajouter</span></div>
      {patients.map((patient, index) => <div className="hm-patient" key={patient.initials} data-mobile-target={index === 0 ? 'patient' : undefined}>
        <span className="hp-avatar"><UserRound size={18} /></span><div><strong>{patient.name}</strong><small>{patient.age} ans</small></div>
      </div>)}
    </div> : <>
      <header className="hm-heading"><ChevronLeft size={19} /><strong>MANSOURI Nora <small>44 ans</small></strong><span className="hm-invoice">Créer une facture</span><Mic size={15} /></header>
      <div className="hm-consultation" style={entrance(frame, heroTiming.mobilePatient)}>
        {compartments.map(({ title, icon: Icon, empty }, index) => <section className="hm-card" key={title}>
          <header><h3><Icon size={15} />{title}</h3>{index !== 2 && <span className="hm-history"><History size={15} /></span>}<span className="hm-plus" data-mobile-target={index === 0 ? 'add' : undefined}><Plus size={17} /></span></header>
          {index === 0 && state.added ? <div className="hm-motives"><span className="hm-motive" data-mobile-motive="chest-pain" style={entrance(frame, heroTiming.mobileAdded)}>Douleur thoracique</span><span className="hm-motive" data-mobile-motive="asthenia" style={entrance(frame, heroTiming.mobileAdded)}>Asthénie</span></div> : index === 2 ? <div className="hm-antecedents">
            {['Appendicectomie', 'Hypertension artérielle', 'Dyslipidémie'].map(label => <span className="hm-antecedent" data-mobile-antecedent key={label}>{label}</span>)}
          </div> : <p>{empty}</p>}
        </section>)}
      </div>
      <footer className="hm-actions"><span>Annuler</span><span className="hm-primary">Confirmer</span></footer>
    </>}
    <nav className="hm-nav" aria-label="Navigation mobile de démonstration">{[{ icon: FolderOpen, label: 'Dossiers' }, { icon: BedDouble, label: 'Hospitalisations' }, { icon: Monitor, label: "Salles d’attente" }, { icon: TestTube, label: 'Examens' }, { icon: Menu, label: '' }].map(({ icon: Icon, label }, index) => <span key={index} className={index === 0 ? 'is-active' : ''}><Icon size={18} />{label}</span>)}</nav>
    {state.picker && <div className="hm-scrim"><section className="hm-picker" aria-label="Choisir un motif" style={entrance(frame, heroTiming.mobilePicker)}>
      <div className="hm-picker-body"><header><ChevronLeft size={20} /><strong>Choisir un motif</strong></header>
      <div className="hm-search"><Search size={16} />Rechercher un élément…</div>
      <div className="hm-option hm-other">Autre</div><p>Éléments les plus fréquents</p>
      {['Douleur thoracique', 'Asthénie', 'Constipation', 'Palpitations', 'Fièvre', 'Toux'].map((label, index) => <div key={label} className={`hm-option ${((index === 0 && state.chosen) || (index === 1 && state.secondChosen)) ? 'is-selected' : ''}`} data-mobile-target={index === 0 ? 'motive' : index === 1 ? 'second-motive' : undefined}>{label}<Info size={15} /></div>)}
      </div>
      <footer className="hm-picker-footer"><span>Annuler</span><span className="hm-primary" data-mobile-target="confirm">Confirmer</span></footer>
    </section></div>}
    <div className="hp-cursor" data-mobile-cursor aria-hidden="true" style={{ left: cursor.x, top: cursor.y, opacity: cursor.opacity }}>
      {cursor.clickProgress !== null && <span className="hp-click" style={{ opacity: 1 - easeOutCubic(cursor.clickProgress), transform: `scale(${0.4 + easeOutCubic(cursor.clickProgress) * 1.4})` }} />}
      <svg width="22" height="28" viewBox="0 0 26 32" style={{ transform: `scale(${cursor.clickProgress === null ? 1 : 1 - Math.sin(Math.PI * cursor.clickProgress) * 0.12})` }}><path d="M2 2v24l6-6 5 10 5-3-5-9h10Z" fill="var(--remed-text)" stroke="white" strokeWidth="2" strokeLinejoin="round" /></svg>
    </div>
  </section>;
}
