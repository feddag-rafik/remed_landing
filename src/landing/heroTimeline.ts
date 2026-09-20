import type { CSSProperties } from 'react';

/** All scene state is derived from this clock, including reverse seeks and loops. */
export const heroTiming = {
  // At 60 fps, starts are 100 ms apart while each entrance lasts 800 ms.
  patients: [12, 18, 24, 30, 36],
  patientClick: 108,
  identity: 120,
  antecedents: 126,
  chips: 132,
  overview: [138, 144, 150],
  drawer: 198,
  hypertension: 267,
  dyslipidemia: 327,
  confirm: 378,
  drawerClosed: 398,
  added: [405, 411],
  mobile: 420,
  mobilePatient: 528,
  mobilePicker: 624,
  mobileChoice: 720,
  mobileSecondChoice: 804,
  mobileConfirm: 864,
  mobileAdded: 888,
  end: 936,
} as const;

export const progress = (frame: number, start: number, duration = 18) => Math.max(0, Math.min(1, (frame - start) / duration));
export const easeOutCubic = (value: number) => 1 - (1 - value) ** 3;
// Minimum-jerk motion: zero velocity and acceleration at both ends.
const easeInOut = (value: number) => value ** 3 * (value * (value * 6 - 15) + 10);
const settle = (value: number) => value === 1 ? 1 : 1 - Math.exp(-8 * value) * Math.cos(8 * value);

export function entrance(frame: number, start: number): CSSProperties {
  // Only the cascading UI entrances slow down; cursor and click clocks stay independent.
  const time = progress(frame, start, 48);
  const position = settle(time);
  return {
    opacity: easeOutCubic(time),
    transform: `translateY(${(1 - position) * 14}px) scale(${0.985 + position * 0.015})`,
  };
}

export function heroState(frame: number) {
  return {
    selected: frame >= heroTiming.patientClick,
    drawerVisible: frame >= heroTiming.drawer && frame < heroTiming.drawerClosed,
    hypertension: frame >= heroTiming.hypertension,
    dyslipidemia: frame >= heroTiming.dyslipidemia,
    confirmed: frame >= heroTiming.confirm,
    drawerProgress: (1 - (1 - progress(frame, heroTiming.drawer, 20)) ** 5) * (1 - easeInOut(progress(frame, heroTiming.confirm, 20))),

  };
}

// Coordinates are relative to the scene, so the desktop navigation never offsets
// clicks. Both layouts keep all targets visible without scrolling or cropping.
export function heroCursor(frame: number, compact: boolean) {
  const width = compact ? 740 : 836;
  const patient = { x: compact ? 106 : 118, y: 91 };
  const add = { x: width - 60, y: 45 };
  const hypertension = { x: width / 2 + 12, y: 195 };
  const dyslipidemia = { x: width / 2 + 12, y: 237 };
  const confirm = { x: width - 76, y: 605 };
  const home = { x: width - 130, y: 190 };
  // Leave the patient 460 ms after the click; the dossier animates during travel.
  const path = [
    { frame: 0, ...home }, { frame: 60, ...home },
    { frame: 96, ...patient }, { frame: 135.6, ...patient },
    { frame: 177.6, ...add }, { frame: 225, ...add },
    { frame: 255, ...hypertension }, { frame: 294, ...hypertension },
    { frame: 315, ...dyslipidemia }, { frame: 335, ...dyslipidemia },
    { frame: 366, ...confirm }, { frame: 396, ...confirm },

  ];
  const cursor = cursorMotion(Math.min(frame, 396), path, [heroTiming.patientClick, heroTiming.drawer, heroTiming.hypertension, heroTiming.dyslipidemia, heroTiming.confirm]);
  return { ...cursor, opacity: 1 - progress(frame, heroTiming.drawerClosed - 4, 4) };
}

/** Shared natural motion for desktop and phone, derived entirely from the clock. */
export function cursorMotion(frame: number, path: { frame: number; x: number; y: number }[], clicks: number[]) {
  const nextIndex = path.findIndex(point => point.frame > frame);
  const next = nextIndex < 0 ? path[path.length - 1]! : path[nextIndex]!;
  const previous = path[Math.max(0, nextIndex < 0 ? path.length - 1 : nextIndex - 1)]!;
  const time = progress(frame, previous.frame, Math.max(1, next.frame - previous.frame));
  // Each gesture has a slightly different acceleration and asymmetric bend.
  // Positions still meet exactly at the waypoints, without a random frame clock.
  const bias = Math.sin(previous.frame * 0.07) * 0.14;
  const amount = easeInOut(time + bias * Math.sin(Math.PI * time));
  const dx = next.x - previous.x;
  const dy = next.y - previous.y;
  const distance = Math.hypot(dx, dy);
  const bend = Math.sin(previous.frame * 0.043 + 0.7);
  const arc = Math.sin(Math.PI * amount) * Math.min(38, distance * 0.1)
    * (bend + 0.3 * Math.sin(Math.PI * amount * 2));
  const click = clicks.find(start => frame >= start && frame < start + 16);
  // A quiet, continuous hand drift also runs during reading pauses.
  // Near clicks, steady the hand without ever freezing it or missing the target.
  const phase = frame / 540 * Math.PI * 2;
  const clickDistance = Math.min(...clicks.map(start => Math.abs(frame - start)));
  const steadiness = 0.3 + 0.7 * easeInOut(Math.min(1, clickDistance / 14));
  const driftX = (2.6 * Math.sin(phase * 5 + 0.4) + 1.3 * Math.sin(phase * 11 + 1.6)) * steadiness * 0.1;
  const driftY = (2.2 * Math.sin(phase * 4 + 1.1) + Math.sin(phase * 9 + 0.3)) * steadiness * 0.1;
  return {
    x: previous.x + dx * amount - dy / (distance || 1) * arc + driftX,
    y: previous.y + dy * amount + dx / (distance || 1) * arc + driftY,
    opacity: 1,
    clickProgress: click === undefined ? null : progress(frame, click, 16),
  };
}

/** Phone-local coordinates shared by both composition sizes. */
export function mobileHeroState(frame: number) {
  return {
    visible: frame >= heroTiming.mobile,
    consultation: frame >= heroTiming.mobilePatient,
    picker: frame >= heroTiming.mobilePicker && frame < heroTiming.mobileAdded,
    secondChosen: frame >= heroTiming.mobileSecondChoice,
    chosen: frame >= heroTiming.mobileChoice,
    added: frame >= heroTiming.mobileAdded,
  };
}

export function mobileHeroCursor(frame: number) {
  const path = [
    { frame: 420, x: 232, y: 180 }, { frame: 492, x: 232, y: 180 },
    { frame: 516, x: 130, y: 83 }, { frame: 576, x: 130, y: 83 },
    { frame: 612, x: 268, y: 84 }, { frame: 672, x: 268, y: 84 },
    { frame: 708, x: 125, y: 221 }, { frame: 774, x: 125, y: 221 },
    { frame: 792, x: 125, y: 264 }, { frame: 816, x: 125, y: 264 },
    { frame: 852, x: 205, y: 466 }, { frame: 888, x: 205, y: 466 },
    { frame: 924, x: 244, y: 150 },
  ];
  const cursor = cursorMotion(Math.min(frame, heroTiming.end), path, [heroTiming.mobilePatient, heroTiming.mobilePicker, heroTiming.mobileChoice, heroTiming.mobileSecondChoice, heroTiming.mobileConfirm]);
  return { ...cursor,
    opacity: easeOutCubic(progress(frame, heroTiming.mobile + 36, 18)) * (1 - progress(frame, heroTiming.end - 12, 12)),
  };
}
