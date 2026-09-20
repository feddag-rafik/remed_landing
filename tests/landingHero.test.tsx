import { describe, expect, test } from 'bun:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { JSDOM } from 'jsdom';
import { readFileSync } from 'node:fs';
import { demoDimensions, heroDemo } from '../src/landing/demoData';
import { ProductPreview } from '../src/landing/ProductPreview';
import { entrance, heroCursor, heroTiming, mobileHeroCursor } from '../src/landing/heroTimeline';

function scene(frame: number, compact = false) {
  return new JSDOM(renderToStaticMarkup(<ProductPreview kind="hero" frame={frame} compact={compact} />)).window.document;
}
const opacity = (document: Document, selector: string) => Number(document.querySelector<HTMLElement>(selector)!.style.opacity);

describe('patient record hero sequence', () => {
  test('starts empty and reveals the patients in order before opening a dossier', () => {
    const initial = scene(0);
    expect(initial.querySelector('.hp-empty')!.textContent).toContain('Aucun patient choisi');
    expect(initial.querySelector('.hp-summary')).toBeNull();
    expect(initial.querySelector('.hp-patient.is-selected')).toBeNull();
    expect([...initial.querySelectorAll<HTMLElement>('[data-patient]')].every(row => row.style.opacity === '0')).toBe(true);
    const cascade = scene(31);
    const values = [...cascade.querySelectorAll<HTMLElement>('[data-patient]')].map(row => Number(row.style.opacity));
    expect(values[0]).toBeLessThan(1);
    expect(values[0]).toBeGreaterThan(values[2]!);
    expect(values[2]).toBeGreaterThan(0);
    expect(values[2]).toBeLessThan(1);
    expect(values[3]).toBeGreaterThan(0);
    expect(values[3]).toBeLessThan(values[2]!);
    expect(values[4]).toBe(0);
    expect(scene(107).querySelector('.hp-summary')).toBeNull();
    expect(scene(108).querySelector('.hp-patient.is-selected')!.textContent).toContain('Nora Mansouri');
  });

  test('overlaps the dossier entrances while preserving the cascade order', () => {
    const summary = scene(133);
    const sections = ['identity', 'antecedents', 'chips'].map(id => opacity(summary, `[data-hero-section="${id}"]`));
    for (const value of sections) {
      expect(value).toBeGreaterThan(0);
      expect(value).toBeLessThan(1);
    }
    expect(sections[0]).toBeGreaterThan(sections[1]!);
    expect(sections[1]).toBeGreaterThan(sections[2]!);
    expect(opacity(summary, '[data-hero-event="0"]')).toBe(0);
    const cards = scene(151);
    const values = [0, 1, 2].map(index => opacity(cards, `[data-hero-event="${index}"]`));
    for (const value of values) {
      expect(value).toBeGreaterThan(0);
      expect(value).toBeLessThan(1);
    }
    expect(values[0]).toBeGreaterThan(values[1]!);
    expect(values[1]).toBeGreaterThan(values[2]!);
    expect(opacity(scene(198), '[data-hero-event="2"]')).toBe(1);
  });

  test('selects two distinct antecedents and adds them only after confirmation and drawer exit', () => {
    expect(scene(197).querySelector('.hp-drawer')).toBeNull();
    const opened = scene(234);
    expect(opened.querySelector('.hp-drawer')).not.toBeNull();
    expect(opened.querySelectorAll('.hp-choice.is-selected')).toHaveLength(1);
    const first = scene(267);
    expect(first.querySelector('[data-hero-target="hypertension"]')!.getAttribute('data-selected')).toBe('true');
    expect(first.querySelector('[data-hero-target="dyslipidemia"]')!.getAttribute('data-selected')).toBe('false');
    const both = scene(327);
    expect(both.querySelectorAll('.hp-choice.is-selected')).toHaveLength(3);
    expect(both.querySelectorAll('[data-record-antecedent]')).toHaveLength(1);
    expect(scene(377).querySelectorAll('[data-record-antecedent]')).toHaveLength(1);
    expect(scene(398).querySelector('.hp-drawer')).toBeNull();
    expect(scene(406).querySelectorAll('[data-record-antecedent]')).toHaveLength(2);
    const additions = scene(412);
    for (const id of ['hypertension', 'dyslipidemia']) {
      const value = opacity(additions, `[data-record-antecedent="${id}"]`);
      expect(value).toBeGreaterThan(0);
      expect(value).toBeLessThan(1);
    }
    const final = scene(480);
    expect(final.querySelectorAll('[data-record-antecedent]')).toHaveLength(3);
    for (const id of ['appendectomy', 'hypertension', 'dyslipidemia']) expect(final.querySelectorAll(`[data-record-antecedent="${id}"]`)).toHaveLength(1);
    expect(scene(0).querySelectorAll('[data-record-antecedent]')).toHaveLength(0);
    expect(scene(160).querySelectorAll('[data-record-antecedent]')).toHaveLength(1);
  });

  test.each([false, true])('mobile opens a consultation, selects two motives and holds the final state (compact=%s)', compact => {
    expect(scene(419, compact).querySelector('.hm-window')).toBeNull();
    expect(scene(468, compact).querySelector('[data-mobile-scene="patients"]')).not.toBeNull();
    expect(opacity(scene(468, compact), '[data-hero-cursor]')).toBe(0);
    expect(scene(527, compact).querySelector('.hm-consultation')).toBeNull();
    expect(scene(576, compact).querySelector('.hm-heading')!.textContent).toContain('MANSOURI Nora');
    expect([...scene(576, compact).querySelectorAll('[data-mobile-antecedent]')].map(item => item.textContent)).toEqual(['Appendicectomie', 'Hypertension artérielle', 'Dyslipidémie']);
    expect(scene(623, compact).querySelector('.hm-picker')).toBeNull();
    expect(scene(672, compact).querySelector('.hm-picker')).not.toBeNull();
    expect(scene(720, compact).querySelector('[data-mobile-target="motive"].is-selected')).not.toBeNull();
    expect(scene(743, compact).querySelector('[data-mobile-motive]')).toBeNull();
    // Both choices happen during one uninterrupted dialog session.
    for (const frame of [744, 768, 792, 804, 839]) {
      const during = scene(frame, compact);
      expect(during.querySelectorAll('.hm-picker')).toHaveLength(1);
      expect(opacity(during, '.hm-picker')).toBe(1);
      expect(during.querySelector('[data-mobile-target="motive"].is-selected')).not.toBeNull();
      expect(during.querySelectorAll('[data-mobile-motive]')).toHaveLength(0);
    }
    expect(scene(804, compact).querySelector('[data-mobile-target="second-motive"].is-selected')).not.toBeNull();
    expect(scene(heroTiming.mobileAdded, compact).querySelector('.hm-picker')).toBeNull();
    expect(scene(heroTiming.mobileAdded, compact).querySelectorAll('[data-mobile-motive]')).toHaveLength(2);
    const pending = scene(heroTiming.mobileConfirm - 1, compact);
    expect(pending.querySelectorAll('.hm-option.is-selected')).toHaveLength(2);
    expect(pending.querySelectorAll('[data-mobile-motive]')).toHaveLength(0);
    expect(pending.querySelector('.hm-picker-footer')!.textContent).toBe('AnnulerConfirmer');
    expect(scene(heroTiming.mobileConfirm, compact).querySelector('[data-mobile-target="confirm"]')).not.toBeNull();
    expect(scene(heroTiming.mobileAdded - 1, compact).querySelectorAll('[data-mobile-motive]')).toHaveLength(0);
    const end = scene(heroTiming.end, compact);
    expect(end.querySelector('.hm-picker')).toBeNull();
    expect(end.querySelector('[data-mobile-motive="asthenia"]')!.textContent).toBe('Asthénie');
    expect(opacity(end, '[data-mobile-motive="asthenia"]')).toBe(1);
    expect(end.querySelectorAll('[data-mobile-motive]')).toHaveLength(2);
    expect(end.querySelector('[data-mobile-motive]')!.textContent).toBe('Douleur thoracique');
    expect(opacity(end, '[data-mobile-motive]')).toBe(1);
    expect(end.querySelectorAll('[data-record-antecedent]')).toHaveLength(3);
    expect(end.querySelector('.hp-reset')).toBeNull();
    expect(opacity(end, '[data-mobile-cursor]')).toBe(0);
    expect(end.body.innerHTML).toBe(scene(10000, compact).body.innerHTML);
    // Seeking backwards must restore the original state without retained mobile data.
    expect(scene(0, compact).querySelector('.hm-window')).toBeNull();
  });

  test('phone clicks land in the patient row, motive plus and first picker option', () => {
    for (const [frame, left, top, right, bottom] of [[528, 8, 54, 290, 114], [624, 256, 66, 285, 98], [720, 34, 203, 262, 240], [804, 34, 246, 262, 283], [heroTiming.mobileConfirm, 152, 449, 262, 484]]) {
      const cursor = mobileHeroCursor(frame!);
      expect(cursor.clickProgress).toBe(0);
      expect(cursor.x).toBeGreaterThan(left!); expect(cursor.x).toBeLessThan(right!);
      expect(cursor.y).toBeGreaterThan(top!); expect(cursor.y).toBeLessThan(bottom!);
    }
    expect(heroDemo.loop).toBe(false);
    expect(heroDemo.posterFrame).toBe(heroDemo.durationInFrames - 1);
    for (const compact of [false, true]) {
      const bounds = demoDimensions('hero', compact);
      expect((compact ? 420 : 760) + 300).toBeLessThan(bounds.width);
      expect(260 + 530).toBeLessThan(bounds.height);
    }
  });

  test.each([false, true])('cursor clicks remain inside the visible targets (compact=%s)', compact => {
    const width = compact ? 740 : 836;
    const listWidth = compact ? 184 : 204;
    for (const frame of [108, 198, 267, 327, 378]) {
      const cursor = heroCursor(frame, compact);
      expect(cursor.opacity).toBe(1);
      expect(cursor.clickProgress).toBe(0);
      expect(cursor.x).toBeGreaterThan(0);
      expect(cursor.x).toBeLessThan(width);
      expect(cursor.y).toBeGreaterThan(0);
      expect(cursor.y).toBeLessThan(650);
    }
    expect(heroCursor(108, compact).x).toBeLessThan(listWidth);
    expect(scene(480, compact).querySelectorAll('[data-patient]')).toHaveLength(5);
    expect(scene(480, compact).querySelectorAll('[data-hero-event]')).toHaveLength(3);
  });
});

test('the hero stays deterministic and has no business or browser runtime dependency', () => {
  for (const file of ['HeroPatientDemo.tsx', 'HeroMobileDemo.tsx', 'heroTimeline.ts']) {
    const source = readFileSync(new URL(`../src/landing/${file}`, import.meta.url), 'utf8');
    const imports = [...source.matchAll(/(?:from\s*|import\s*)['"]([^'"]+)['"]/g)].map(match => match[1]);
    expect(imports.every(value => ['react', 'lucide-react', './HeroPatientDemo', './heroTimeline', './heroPatientDemo.css', '../components/patientHistoryIcon'].includes(value!))).toBe(true);
    expect(source).not.toMatch(/\b(?:fetch|setTimeout|setInterval|requestAnimationFrame|Math\.random|Date\.now)\s*\(/);
  }
});


test('history uses the application tab order, icon above label and separate counts', () => {
  const document = scene(210);
  const labels = [...document.querySelectorAll('.hp-history-tab-content > span')].map(tab => tab.textContent);
  expect(labels.slice(0, 6)).toEqual(['Vue d’ensemble', 'Consultations', 'Hospitalisations', 'Examens', 'Chirurgies', 'Rendez-vous']);
  for (const content of document.querySelectorAll('.hp-history-tab-content')) expect(content.firstElementChild?.tagName.toLowerCase()).toBe('svg');
  expect(document.querySelectorAll('.hp-history-count')).toHaveLength(2);
  expect(document.querySelector('.hp-history-tab.is-active')!.textContent).toBe('Vue d’ensemble');
  expect(document.body.textContent).not.toContain('Les informations essentielles');
  expect(document.body.textContent).not.toContain('Vos dossiers patients');
  expect(scene(334).body.textContent).not.toContain('nouveaux antécédents');
});

test('eased entrances settle exactly and cursor accelerates then decelerates', () => {
  expect(entrance(0, 0).opacity).toBe(0);
  expect(entrance(18, 0).opacity).toBeLessThan(1);
  expect(entrance(24, 0).opacity).toBeGreaterThan(0.5);
  expect(entrance(48, 0)).toEqual({ opacity: 1, transform: 'translateY(0px) scale(1)' });
  const at = (frame: number) => heroCursor(frame, false);
  const distance = (a: number, b: number) => Math.hypot(at(a).x - at(b).x, at(a).y - at(b).y);
  expect(distance(70, 74)).toBeGreaterThan(distance(60, 64));
  expect(distance(82, 86)).toBeGreaterThan(distance(92, 96));
  expect(distance(96, 108)).toBeGreaterThan(0);
  expect(distance(96, 108)).toBeLessThan(8);
});

test.each([false, true])('cursor stays visible and in motion through the desktop sequence (compact=%s)', compact => {
  const frames = Array.from({ length: 394 }, (_, frame) => heroCursor(frame, compact));
  const width = compact ? 740 : 836;
  expect(frames.every(cursor => cursor.opacity === 1 && cursor.x > 0 && cursor.x + 26 < width && cursor.y > 0 && cursor.y + 32 < 650)).toBe(true);
  const steps = frames.slice(1).map((point, index) => Math.hypot(point.x - frames[index]!.x, point.y - frames[index]!.y));
  expect(Math.min(...steps)).toBeGreaterThan(0.0001);
  expect(Math.max(...steps)).toBeLessThan(50);
  // A pause should read as a calm hand movement, not another travel gesture.
  const idle = frames.slice(176, 195);
  expect(Math.max(...idle.map(point => point.x)) - Math.min(...idle.map(point => point.x))).toBeLessThan(0.8);
  expect(Math.max(...idle.map(point => point.y)) - Math.min(...idle.map(point => point.y))).toBeLessThan(0.7);
  expect(Math.hypot(frames[135]!.x - (compact ? 106 : 118), frames[135]!.y - 91)).toBeLessThan(1);
  expect(frames[148]!.x).toBeGreaterThan((compact ? 106 : 118) + 50);
  expect(Math.hypot(frames[178]!.x - (width - 60), frames[178]!.y - 45)).toBeLessThan(1);
  for (const [frame, x, y] of [
    [108, compact ? 106 : 118, 91], [198, width - 60, 45],
    [267, width / 2 + 12, 195], [327, width / 2 + 12, 237], [378, width - 76, 605],
  ]) {
    expect(Math.hypot(frames[frame!]!.x - x!, frames[frame!]!.y - y!)).toBeLessThan(2);
  }
});


test('the hero matches the app identity layout and keeps the five drawer lists balanced', () => {
  const record = scene(480);
  expect(record.querySelector('.hp-identity-person > .hp-avatar svg')).not.toBeNull();
  expect(record.querySelector('.hp-identity dl')).toBeNull();
  expect(record.querySelector('.hp-edit')!.textContent).toBe('Modifier');
  expect(record.querySelectorAll('.hp-patient .hp-avatar svg')).toHaveLength(5);
  const drawer = scene(334);
  const categories = [...drawer.querySelectorAll('.hp-drawer-category')];
  expect(categories.map(category => category.querySelector('h4')!.textContent)).toEqual([
    'Facteurs de risques', 'Antécédents physiologiques', 'Antécédents pathologiques',
    'Antécédents chirurgicaux', 'Antécédents familiaux',
  ]);
  for (const category of categories) expect(category.querySelectorAll('.hp-choice')).toHaveLength(7);
  expect(drawer.querySelectorAll('.hp-choice.is-selected')).toHaveLength(3);
  expect(drawer.querySelectorAll('.hp-checkbox')).toHaveLength(0);
});


test('navigation dimming follows the drawer entrance and exit', () => {
  expect(opacity(scene(197), '.hp-nav-scrim')).toBe(0);
  expect(opacity(scene(208), '.hp-nav-scrim')).toBeGreaterThan(0);
  expect(opacity(scene(234), '.hp-nav-scrim')).toBe(1);
  expect(opacity(scene(388), '.hp-nav-scrim')).toBeGreaterThan(0);
  expect(opacity(scene(388), '.hp-nav-scrim')).toBeLessThan(1);
  expect(opacity(scene(398), '.hp-nav-scrim')).toBe(0);
});


test.each([false, true])('desktop cursor stops after confirmation and mobile starts during the final additions (compact=%s)', compact => {
  for (let frame = heroTiming.drawerClosed; frame <= heroTiming.mobile; frame++) {
    expect(heroCursor(frame, compact)).toEqual(heroCursor(heroTiming.drawerClosed, compact));
    expect(opacity(scene(frame, compact), '[data-hero-cursor]')).toBe(0);
  }
  expect(heroTiming.mobile).toBeLessThan(480);
  expect(heroTiming.mobile).toBeGreaterThan(heroTiming.added[1]);
});


test('mobile cursor has smooth curved travel, quiet hand drift and a stable ending', () => {
  const frames = Array.from({ length: heroTiming.end - 456 + 1 }, (_, index) => mobileHeroCursor(index + 456));
  const steps = frames.slice(1).map((point, index) => Math.hypot(point.x - frames[index]!.x, point.y - frames[index]!.y));
  expect(Math.min(...steps)).toBeGreaterThan(0.0001);
  expect(Math.max(...steps)).toBeLessThan(20);
  expect(frames.every(point => point.x > 0 && point.x + 22 < 300 && point.y > 0 && point.y + 28 < 530)).toBe(true);
  const distance = (a: number, b: number) => Math.hypot(mobileHeroCursor(a).x - mobileHeroCursor(b).x, mobileHeroCursor(a).y - mobileHeroCursor(b).y);
  expect(distance(500, 504)).toBeGreaterThan(distance(492, 496));
  expect(distance(500, 504)).toBeGreaterThan(distance(512, 516));
  const middle = mobileHeroCursor(588);
  expect(Math.abs(middle.y - (83 + (middle.x - 130) / 138))).toBeGreaterThan(1);
  const idle = frames.slice(60, 75);
  expect(Math.max(...idle.map(point => point.x)) - Math.min(...idle.map(point => point.x))).toBeLessThan(1);
  expect(mobileHeroCursor(heroTiming.end + 120)).toEqual(mobileHeroCursor(heroTiming.end));
});
