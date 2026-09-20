// Run in its own process: bun test tests/landingPlayers.test.tsx
// Bun's composition mock and this file's jsdom globals must not leak into other suites.
import { afterEach, beforeEach, describe, expect, mock, spyOn, test } from "bun:test";
import { JSDOM } from "jsdom";
import React, { useEffect } from "react";
import { createPlaybackCoordinator } from "../src/landing/playback";

describe("landing playback policy", () => {
  function setup() {
    const coordinator = createPlaybackCoordinator();
    const events: string[] = [];
    const add = (name: string, automatic = true) => {
      const entry = coordinator.register({ automatic, onPlaying: value => events.push(`${name}:${value}`) });
      return entry;
    };
    return { coordinator, events, add };
  }
  test("waits for visibility and readiness and pauses before transferring ownership", () => {
    const { events, add } = setup();
    const a = add("a"), b = add("b");
    a.update({ visible: true }); b.update({ ready: true });
    expect(events).toEqual([]);
    a.update({ ready: true }); b.update({ visible: true });
    expect(events).toEqual(["a:true"]);
    a.update({ visible: false });
    expect(events).toEqual(["a:true", "a:false", "b:true"]);
  });
  test("an automatic demo runs once; completing all demos leaves no animation", () => {
    const { events, add } = setup();
    const a = add("a"), b = add("b");
    a.update({ ready: true, visible: true }); b.update({ ready: true, visible: true });
    a.ended(); b.ended();
    a.update({ visible: false }); a.update({ visible: true });
    expect(events).toEqual(["a:true", "a:false", "b:true", "b:false"]);
    a.play(); expect(events.at(-1)).toBe("a:true");
  });
  test("reduced motion blocks auto but permits manual play and explicit pause persists", () => {
    const { coordinator, events, add } = setup();
    coordinator.setEnvironment({ reducedMotion: true });
    const a = add("a"); a.update({ ready: true, visible: true });
    expect(events).toEqual([]);
    a.play(); a.pause();
    coordinator.setEnvironment({ reducedMotion: false, hidden: true });
    coordinator.setEnvironment({ hidden: false });
    expect(events).toEqual(["a:true", "a:false"]);
  });
  test("visibility suspends and resumes; overlays block inline manual and auto but allow modal manual", () => {
    const { coordinator, events, add } = setup();
    const a = add("a"); a.update({ ready: true, visible: true });
    coordinator.setEnvironment({ hidden: true }); coordinator.setEnvironment({ hidden: false });
    expect(events).toEqual(["a:true", "a:false", "a:true"]);
    coordinator.setEnvironment({ overlay: true }); a.play();
    const modal = add("modal", false); modal.update({ ready: true, visible: true });
    expect(events.at(-1)).toBe("a:false");
    modal.play(); expect(events.at(-1)).toBe("modal:true");
    coordinator.setEnvironment({ hidden: true }); expect(events.at(-1)).toBe("modal:false");
  });
  test("manual selection preempts auto and disposal is idempotent", () => {
    const { events, add } = setup();
    const a = add("a"), b = add("b");
    a.update({ ready: true, visible: true }); b.update({ ready: true, visible: true });
    b.play(); b.dispose(); b.dispose(); b.play(); b.update({ visible: true });
    expect(events).toEqual(["a:true", "a:false", "b:true", "b:false", "a:true"]);
  });
});

const dom = new JSDOM("<!doctype html><html><body></body></html>", {
  url: "https://remed.test", pretendToBeVisual: true,
});
for (const key of ["window", "document", "navigator", "HTMLElement", "HTMLButtonElement", "HTMLInputElement", "Element", "Node", "NodeFilter", "CustomEvent", "MutationObserver", "Event", "MouseEvent", "KeyboardEvent", "HTMLVideoElement"]) {
  Object.defineProperty(globalThis, key, { value: key === "window" ? dom.window : (dom.window as any)[key], configurable: true });
}
Object.defineProperty(globalThis, "getComputedStyle", { value: dom.window.getComputedStyle.bind(dom.window), configurable: true });
Object.defineProperty(globalThis, "IS_REACT_ACT_ENVIRONMENT", { value: true, configurable: true });
Object.defineProperty(globalThis, "requestAnimationFrame", { value: dom.window.requestAnimationFrame.bind(dom.window), configurable: true });
Object.defineProperty(globalThis, "cancelAnimationFrame", { value: dom.window.cancelAnimationFrame.bind(dom.window), configurable: true });
let reducedMotion = false;
let mobile = false;
const motionEvents = new dom.window.EventTarget();
const viewportEvents = new dom.window.EventTarget();
Object.defineProperty(window, "matchMedia", { value: (query: string) => {
  const events = query.includes("reduced-motion") ? motionEvents : viewportEvents;
  return {
    get matches() { return query.includes("reduced-motion") ? reducedMotion : mobile; },
    addEventListener: events.addEventListener.bind(events),
    removeEventListener: events.removeEventListener.bind(events),
  };
}, configurable: true });
class Observer {
  static instances = new Set<Observer>();
  target?: Element;
  constructor(private callback: (entries: any[]) => void) { Observer.instances.add(this); }
  observe(target: Element) { this.target = target; }
  disconnect() { Observer.instances.delete(this); }
  intersect(visible: boolean) { this.callback([{ target: this.target, isIntersecting: visible, intersectionRatio: visible ? 1 : 0 }]); }
}
Object.defineProperty(globalThis, "IntersectionObserver", { value: Observer, configurable: true });
Object.defineProperty(window, "IntersectionObserver", { value: Observer, configurable: true });
class ResizeObserverStub { observe() {} unobserve() {} disconnect() {} }
Object.defineProperty(globalThis, "ResizeObserver", { value: ResizeObserverStub, configurable: true });
Object.defineProperty(window, "ResizeObserver", { value: ResizeObserverStub, configurable: true });

const { act } = await import("react-dom/test-utils");
const { useCurrentFrame } = await import("remotion");
let failComposition = false;
const liveCompositions = new Set<string>();
// Only the visual composition is substituted; React, Remotion Player, and Radix run for real.
mock.module("../src/landing/composition", () => ({
  DemoComposition: ({ id, compact }: { id: string; compact?: boolean }) => {
    const frame = useCurrentFrame();
    useEffect(() => { liveCompositions.add(id); return () => { liveCompositions.delete(id); }; }, [id]);
    if (failComposition) throw new Error("Intentional composition failure");
    return <div data-composition={id} data-frame={frame} data-compact={compact}>Demo {id}</div>;
  },
}));
const { compositions, demos } = await import("../src/landing/demoData");
const { mountDemo, openVideos } = await import("../src/landing/players");
const definitions = compositions.map(demo => ({ ...demo }));
const cleanups: Array<() => void> = [];
const flush = async (ms = 35) => { await act(async () => { await new Promise(resolve => setTimeout(resolve, ms)); }); };
const visible = (value: boolean) => act(() => { for (const observer of Observer.instances) observer.intersect(value); });
const overlay = (value: boolean) => act(() => window.dispatchEvent(new CustomEvent("remed:landing-overlay", { detail: value })));
const host = () => {
  const element = document.createElement("div");
  element.innerHTML = '<div data-static-poster="true">Original poster</div>';
  document.body.append(element);
  return element;
};
const click = (selector: string, scope: ParentNode = document) => act(() => scope.querySelector<HTMLButtonElement>(selector)!.click());

beforeEach(() => {
  failComposition = false; reducedMotion = false; mobile = false;
  Object.defineProperty(document, "visibilityState", { value: "visible", configurable: true });
  for (const demo of compositions) { demo.durationInFrames = 8; demo.posterFrame = 2; }
});
afterEach(async () => {
  if (document.querySelector(".landing-videos-close")) click(".landing-videos-close");
  await flush();
  act(() => { cleanups.splice(0).forEach(cleanup => cleanup()); });
  overlay(false);
  document.body.replaceChildren();
  await flush();
  compositions.forEach((demo, index) => Object.assign(demo, definitions[index]));
});

test("keeps the exact static poster through loading and restores it on idempotent cleanup", async () => {
  const element = host();
  const original = element.firstElementChild;
  let releaseFonts!: () => void;
  Object.defineProperty(document, "fonts", { value: { ready: new Promise<void>(resolve => { releaseFonts = resolve; }) }, configurable: true });
  let cleanup!: () => void;
  act(() => { cleanup = mountDemo(element, "document"); cleanups.push(cleanup); });
  await flush();
  expect(element.querySelector("[data-static-poster]")).toBe(original);
  expect(element.querySelector<HTMLElement>(".landing-player-poster")!.hidden).toBe(false);
  expect(element.querySelector<HTMLElement>(".landing-player-mount")!.style.visibility).toBe("hidden");
  expect(element.querySelector(".landing-player-controls")).toBeNull();
  releaseFonts(); await flush(); await flush();
  expect(element.querySelector<HTMLElement>(".landing-player-poster")!.hidden).toBe(true);
  act(() => { cleanup(); cleanup(); });
  expect(element.firstChild).toBe(original);
  expect(Observer.instances.size).toBe(0);
  expect(liveCompositions.size).toBe(0);
});

test("real players coordinate intersection, overlays, tab visibility, and manual pause", async () => {
  const a = host(), b = host();
  act(() => { cleanups.push(mountDemo(a, "voice"), mountDemo(b, "document")); });
  await flush(); await flush(); visible(true);
  expect(document.querySelectorAll('[data-state="playing"]')).toHaveLength(1);
  overlay(true); expect(document.querySelectorAll('[data-state="playing"]')).toHaveLength(0);
  overlay(false); expect(document.querySelectorAll('[data-state="playing"]')).toHaveLength(1);
  act(() => {
    Object.defineProperty(document, "visibilityState", { value: "hidden", configurable: true });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  expect(document.querySelectorAll('[data-state="playing"]')).toHaveLength(0);
  act(() => {
    Object.defineProperty(document, "visibilityState", { value: "visible", configurable: true });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  click(".landing-player-toggle", a);
  expect(a.querySelector(".landing-player")!.getAttribute("data-state")).toBe("paused");
  visible(false); visible(true);
  expect(a.querySelector(".landing-player")!.getAttribute("data-state")).toBe("paused");
});

test("inline and modal artboards follow the mobile media query and update on resize", async () => {
  const element = host();
  act(() => { cleanups.push(mountDemo(element, "document")); });
  await flush(); await flush();
  expect(element.querySelector<HTMLElement>(".landing-player-stage")!.style.aspectRatio).toBe("1000 / 650");
  expect(element.querySelector("[data-composition]")!.getAttribute("data-compact")).toBe("false");
  act(() => { mobile = true; viewportEvents.dispatchEvent(new Event("change")); });
  expect(element.querySelector<HTMLElement>(".landing-player-stage")!.style.aspectRatio).toBe("740 / 650");
  expect(element.querySelector("[data-composition]")!.getAttribute("data-compact")).toBe("true");
  const trigger = document.createElement("button"); document.body.append(trigger);
  act(() => openVideos(trigger));
  await flush(); await flush();
  expect(document.querySelector<HTMLElement>(".landing-player-dialog .landing-player-stage")!.style.aspectRatio).toBe("740 / 650");
  act(() => { mobile = false; viewportEvents.dispatchEvent(new Event("change")); });
  for (const stage of document.querySelectorAll<HTMLElement>(".landing-player-stage")) expect(stage.style.aspectRatio).toBe("1000 / 650");
});

test("reduced motion remains static until manual play, holds the last frame, and replays", async () => {
  reducedMotion = true;
  const element = host();
  act(() => { cleanups.push(mountDemo(element, "voice")); });
  await flush(); await flush(); visible(true);
  expect(element.querySelector("[data-composition]")!.getAttribute("data-frame")).toBe("2");
  expect(element.querySelector(".landing-player")!.getAttribute("data-state")).toBe("paused");
  click(".landing-player-toggle", element);
  expect(element.querySelector(".landing-player")!.getAttribute("data-state")).toBe("playing");
  for (let frame = 0; frame < 15; frame++) await flush();
  expect(element.querySelector(".landing-player")!.getAttribute("data-state")).toBe("ended");
  expect(element.querySelector("[data-composition]")!.getAttribute("data-frame")).toBe("7");
  visible(false); visible(true);
  expect(element.querySelector("[data-composition]")!.getAttribute("data-frame")).toBe("7");
  click(".landing-player-replay", element);
  expect(element.querySelector(".landing-player")!.getAttribute("data-state")).toBe("playing");
  expect(Number(element.querySelector("[data-composition]")!.getAttribute("data-frame"))).toBeLessThan(3);
});

test("dialog defaults to first, never autoplays, unmounts on switch, closes on Escape and restores focus", async () => {
  const trigger = document.createElement("button");
  trigger.dataset.landingVideos = "assistant";
  document.body.append(trigger); trigger.focus();
  act(() => { openVideos(trigger); openVideos(trigger); });
  await flush(); await flush();
  expect(document.querySelectorAll('[role="dialog"]')).toHaveLength(1);
  expect(document.querySelector("[data-composition]")!.getAttribute("data-composition")).toBe("document");
  expect(document.querySelector(".landing-player")!.getAttribute("data-state")).toBe("paused");
  expect(document.querySelector(".landing-videos-selected-title")!.textContent).toBe(demos[0]!.title);
  expect(document.querySelector('input[type="range"]')).not.toBeNull();
  const seek = document.querySelector<HTMLInputElement>('input[type="range"]')!;
  expect(seek.value).toBe("0");
  act(() => {
    Object.getOwnPropertyDescriptor(dom.window.HTMLInputElement.prototype, "value")!.set!.call(seek, "5");
    seek.dispatchEvent(new Event("input", { bubbles: true }));
  });
  expect(document.querySelector("[data-composition]")!.getAttribute("data-frame")).toBe("5");
  click(".landing-player-toggle");
  click(".landing-videos-tab:nth-child(2)");
  await flush(); await flush();
  expect([...liveCompositions]).toEqual(["voice"]);
  expect(document.querySelector<HTMLInputElement>('input[type="range"]')!.value).toBe("0");
  expect(document.querySelector(".landing-player")!.getAttribute("data-state")).toBe("paused");
  act(() => document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true })));
  await flush();
  expect(document.querySelector('[role="dialog"]')).toBeNull();
  expect(document.querySelector(".landing-videos-root")).toBeNull();
  expect(liveCompositions.size).toBe(0);
  expect(document.activeElement).toBe(trigger);
});

test("composition failure preserves the poster and retry creates a working player", async () => {
  const errors = spyOn(console, "error").mockImplementation(() => {});
  try {
    failComposition = true;
    const element = host();
    act(() => { cleanups.push(mountDemo(element, "assistant")); });
    await flush();
    expect(element.querySelector('[role="alert"]')).not.toBeNull();
    expect(element.querySelector<HTMLElement>(".landing-player-poster")!.hidden).toBe(false);
    failComposition = false;
    click(".landing-player-retry", element);
    await flush(); await flush(); visible(true);
    expect(element.querySelector('[role="alert"]')).toBeNull();
    expect(element.querySelector(".landing-player")!.getAttribute("data-state")).toBe("playing");
  } finally { errors.mockRestore(); }
});


test("hero ends without visible controls and respects visibility and reduced motion", async () => {
  const element = host();
  act(() => { cleanups.push(mountDemo(element, "hero")); });
  await flush(); await flush(); visible(true);
  const frames: number[] = [];
  for (let i = 0; i < 24; i++) {
    await flush();
    frames.push(Number(element.querySelector("[data-composition]")!.getAttribute("data-frame")));
  }
  expect(frames.some((frame, index) => index > 0 && frame < frames[index - 1]!)).toBe(false);
  expect(element.querySelector(".landing-player")!.getAttribute("data-state")).toBe("ended");
  expect(element.querySelector(".landing-player-controls")).toBeNull();
  const lastFrame = frames.at(-1)!;
  visible(false); visible(true); await flush();
  expect(element.querySelector(".landing-player")!.getAttribute("data-state")).toBe("ended");
  expect(Number(element.querySelector("[data-composition]")!.getAttribute("data-frame"))).toBe(lastFrame);
  act(() => { reducedMotion = true; motionEvents.dispatchEvent(new Event("change")); });
  expect(element.querySelector(".landing-player")!.getAttribute("data-state")).toBe("paused");
  expect(element.querySelector("[data-composition]")!.getAttribute("data-frame")).toBe("2");
  await flush(100);
  expect(element.querySelector("[data-composition]")!.getAttribute("data-frame")).toBe("2");
});

test("hero starts on its completed poster for reduced motion and does not join the video picker", async () => {
  reducedMotion = true;
  const element = host();
  act(() => { cleanups.push(mountDemo(element, "hero")); });
  await flush(); await flush(); visible(true);
  expect(element.querySelector("[data-composition]")!.getAttribute("data-frame")).toBe("2");
  expect(element.querySelector(".landing-player")!.getAttribute("data-state")).toBe("paused");
  const trigger = document.createElement("button"); document.body.append(trigger);
  act(() => openVideos(trigger));
  await flush(); await flush();
  expect(document.querySelectorAll(".landing-videos-tab")).toHaveLength(3);
  expect(document.querySelector('.landing-player-dialog[data-demo-id="hero"]')).toBeNull();
});
