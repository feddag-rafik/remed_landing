import { expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { JSDOM } from "jsdom";

const root = resolve(import.meta.dir, "..");
async function build(appUrl: string) {
  const child = Bun.spawn(["bun", "run", "build"], {
    cwd: root, env: { ...process.env, LANDING_APP_URL: appUrl }, stdout: "ignore", stderr: "inherit",
  });
  expect(await child.exited).toBe(0);
  return new JSDOM(readFileSync(resolve(root, "dist/index.html"), "utf8")).window.document;
}
test("build emits configurable native login links and self-contained assets", async () => {
  try {
    const document = await build("https://app.example.test/workspace/");
    const links = document.querySelectorAll('a[href="https://app.example.test/workspace/login"]');
    expect(links.length).toBeGreaterThanOrEqual(5);
    expect(document.querySelector("iframe")).toBeNull();
    for (const node of document.querySelectorAll("[src], link[href]")) {
      const url = node.getAttribute("src") || node.getAttribute("href")!;
      if (!url.startsWith("/")) continue;
      expect(url).toStartWith("/landing/");
      expect(await Bun.file(resolve(root, "dist", url.slice(1))).exists()).toBe(true);
    }
    const stylesheet = document.querySelector<HTMLLinkElement>('link[href^="/landing/landing-"]')?.getAttribute("href");
    const script = document.querySelector<HTMLScriptElement>('script[src^="/landing/landing-"]')?.getAttribute("src");
    expect(stylesheet).toMatch(/^\/landing\/landing-[A-Z0-9]+\.css$/);
    expect(script).toMatch(/^\/landing\/landing-[A-Z0-9]+\.js$/);
    expect(existsSync(resolve(root, "dist/landing/landing.css"))).toBe(false);
    expect(existsSync(resolve(root, "dist/landing/landing.js"))).toBe(false);
    const css = readFileSync(resolve(root, "dist", stylesheet!.slice(1)), "utf8");
    expect(css).toContain("/landing/fonts/inter/inter-latin-variable.woff2");
    expect(css.trim()).not.toContain("\n");
    expect(readFileSync(resolve(root, "dist", script!.slice(1)), "utf8").trim()).not.toContain("\n");
    expect(await Bun.file(resolve(root, "dist/landing/fonts/inter/inter-latin-variable.woff2")).exists()).toBe(true);
    const report = readFileSync(resolve(root, ".landing-build/bundle-report.json"), "utf8");
    expect(report).not.toContain("remed_web");
    expect(report).not.toContain("src/app/");
  } finally {
    const document = await build("");
    expect(document.querySelectorAll('a[href="/login"]').length).toBeGreaterThanOrEqual(5);
  }
}, 30000);
