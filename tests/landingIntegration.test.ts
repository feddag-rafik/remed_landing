import { expect, test } from "bun:test";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { gzipSync } from "node:zlib";
import { JSDOM } from "jsdom";

const root = resolve(import.meta.dir, "..");
const html = readFileSync(resolve(root, "dist/index.html"), "utf8");
const document = new JSDOM(html).window.document;

test("the exported landing contains six previews, a desktop/mobile hero and three readable AI posters without JS", () => {
  expect(document.querySelectorAll("[data-product-preview]").length).toBe(6);
  expect(document.querySelectorAll("[data-landing-demo]").length).toBe(4);
  const hero = document.querySelector('#hero [data-landing-demo="hero"]')!;
  expect(hero.querySelector('[data-record-antecedent="hypertension"]')).not.toBeNull();
  expect(hero.querySelector('[data-record-antecedent="dyslipidemia"]')).not.toBeNull();
  expect(hero.querySelector('[data-hero-section="drawer"]')).toBeNull();
  expect([...hero.querySelectorAll('[data-mobile-motive]')].map(item => item.textContent)).toEqual(['Douleur thoracique', 'Asthénie']);
  for (const slot of document.querySelectorAll(".ld-demo-slot")) {
    expect(slot.textContent!.length).toBeGreaterThan(80);
    expect(slot.querySelector("img[src^='/landing/assets/']")).toBeNull();
  }
  expect(document.querySelector("img[src^='/landing/assets/']")).toBeNull();
  expect(html).not.toContain("<!-- landing-");
});

test("login links preserve native navigation and videos have a useful fallback", () => {
  const logins = [...document.querySelectorAll<HTMLAnchorElement>('a[href="/login"]')];
  expect(logins.length).toBeGreaterThanOrEqual(5);
  expect(logins.some(link => link.textContent!.trim() === "Tester maintenant")).toBe(true);
  expect(document.querySelector<HTMLAnchorElement>("[data-landing-videos]")?.getAttribute("href")).toBe("#ai");
  expect(document.querySelector("iframe")).toBeNull();
});

test("the initial script stays lightweight and references only generated local assets", () => {
  expect(document.querySelector('link[href="/landing/landing.css"]')).toBeNull();
  expect(document.querySelector('script[src="/landing/landing.js"]')).toBeNull();
  expect(document.querySelector('link[href^="/landing/landing-"]')).not.toBeNull();
  expect(document.querySelector('script[src^="/landing/landing-"]')).not.toBeNull();
  const src = document.querySelector<HTMLScriptElement>('script[type="module"]')!.getAttribute("src")!;
  expect(src).toMatch(/^\/landing\/generated\/bootstrap-.*\.js$/);
  const script = readFileSync(resolve(root,"dist",src.slice(1)), "utf8");
  expect(gzipSync(script).length).toBeLessThan(12_000);
  expect(script).not.toMatch(/SuperDoc|FullCalendar|apiFetch|createRoot|react-dom/);
  for (const asset of document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]')) {
    expect(existsSync(resolve(root, "dist", asset.getAttribute("href")!.slice(1)))).toBe(true);
  }
});

test("split modules resolve to JavaScript and the eager dependency graph contains no application or animation runtime", () => {
  const report = JSON.parse(readFileSync(resolve(root, ".landing-build/bundle-report.json"), "utf8"));
  const outputs = report.outputs as Record<string, { imports: {path:string;kind:string;external?:boolean}[]; inputs: Record<string,unknown> }>;
  const entry = "dist" + document.querySelector<HTMLScriptElement>('script[type="module"]')!.getAttribute("src")!;
  const visited = new Set<string>();
  function visit(path: string) {
    if (visited.has(path)) return;
    visited.add(path);
    expect(outputs[path]).toBeDefined();
    for (const source of Object.keys(outputs[path]!.inputs)) {
      expect(source).not.toMatch(/node_modules\/(?:react|react-dom|remotion|@remotion)\//);
      expect(source).not.toMatch(/src\/(?:app|utils)\//);
    }
    for (const dep of outputs[path]!.imports) if (dep.kind !== "dynamic-import") visit(dep.path);
  }
  visit(entry);
  for (const [path, output] of Object.entries(outputs)) {
    if (!path.endsWith(".js")) continue;
    for (const dep of output.imports) {
      expect(dep.external).not.toBe(true);
      expect(dep.path).toEndWith(".js");
      expect(existsSync(resolve(root,dep.path))).toBe(true);
    }
  }
});
