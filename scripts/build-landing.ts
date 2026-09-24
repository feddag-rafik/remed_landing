import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { resolve, basename } from "node:path";
import { createHash } from "node:crypto";
import { build } from "esbuild";

const root = resolve(import.meta.dir, "..");
process.chdir(root);
const output = resolve(root, "dist/landing/generated");
const landingOutput = resolve(root, "dist/landing");
const temporary = resolve(root, ".landing-build");
await mkdir(output, { recursive: true });
await Promise.all([
  rm(resolve(landingOutput, "landing.css"), { force: true }),
  rm(resolve(landingOutput, "landing.js"), { force: true }),
]);
await cp(resolve(root, "public/landing"), landingOutput, {
  recursive: true,
  filter: source => !["landing.css", "landing.js"].includes(basename(source)),
});
await mkdir(temporary, { recursive: true });

// Bun remains the runtime. Its 1.2 CSS splitting emits imports of .css instead
// of the corresponding JS chunks; use esbuild for portable, correct ESM output.
// Keep CSS identifiers stable between the independently compiled posters/player.
const common = {
  bundle: true,
  format: "esm" as const,
  minifySyntax: true,
  minifyWhitespace: true,
  minifyIdentifiers: false,
  external: ["/landing/fonts/*"],
  define: { "process.env.NODE_ENV": JSON.stringify("production") },
};
const staticAssets = await build({
  entryPoints: ["public/landing/landing.css", "public/landing/landing.js"],
  outdir: landingOutput,
  bundle: true,
  minify: true,
  platform: "browser",
  target: ["es2022"],
  entryNames: "[name]-[hash]",
  external: ["/landing/*"],
  metafile: true,
});
const browser = await build({
  ...common,
  entryPoints: ["src/landing/bootstrap.ts"],
  outdir: output,
  platform: "browser",
  target: ["es2022"],
  splitting: true,
  entryNames: "[name]-[hash]",
  chunkNames: "[name]-[hash]",
  assetNames: "[name]-[hash]",
  metafile: true,
});
await build({
  ...common,
  entryPoints: ["src/landing/renderPosters.tsx"],
  outdir: temporary,
  platform: "node",
  target: "es2022",
  external: [...common.external, "react", "react-dom/server"],
});
const { renderPosters } = await import(resolve(temporary, "renderPosters.js"));
const posters: Record<string, string> = renderPosters();
const appUrl = process.env.LANDING_APP_URL?.trim();
const loginHref = appUrl ? new URL("login", appUrl.replace(/\/?$/, "/")).href : "/login";
if (appUrl && !/^https?:\/\//.test(loginHref)) throw new Error("LANDING_APP_URL must use HTTP or HTTPS");
const escapedLoginHref = loginHref.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
let html = await readFile("src/landing/home.template.html", "utf8");
const staticOutputs = Object.entries(staticAssets.metafile.outputs);
const landingCss = staticOutputs.find(([path, meta]) => meta.entryPoint === "public/landing/landing.css" && path.endsWith(".css"));
const landingScript = staticOutputs.find(([path, meta]) => meta.entryPoint === "public/landing/landing.js" && path.endsWith(".js"));
if (!landingCss || !landingScript) throw new Error("Optimized landing assets missing");
html = html
  .replace('/landing/landing.css', `/landing/${basename(landingCss[0])}`)
  .replace('/landing/landing.js', `/landing/${basename(landingScript[0])}`);
html = html.replaceAll('href="/login"', `href="${escapedLoginHref}"`);
html = html.replace(/<!-- landing-(preview|demo):([\w-]+) -->/g, (_match, type, id) => {
  if (!posters[id]) throw new Error(`Missing landing poster: ${id}`);
  return `<div class="ld-demo-slot" ${type === "demo" ? `data-landing-demo="${id}"` : `data-product-preview="${id}"`}>${posters[id]}</div>`;
});

// Extract the single source of truth, without loading application global CSS.
const theme = await readFile("src/styles/remed-theme.css", "utf8");
const tokens = theme.match(/:root\s*\{[\s\S]*?\n\}/)?.[0];
if (!tokens) throw new Error("Remed theme token block not found");
const assets = Object.entries(browser.metafile.outputs);
const compiledStyles = await Promise.all(assets.filter(([path]) => path.endsWith(".css")).map(([path]) => readFile(path, "utf8")));
if (!compiledStyles.length) throw new Error("Landing component CSS missing");
const css = [tokens, ...new Set(compiledStyles), await readFile("src/landing/landingDemos.css", "utf8"), await readFile("src/landing/players.css", "utf8")].join("\n");
const cssFile = `landing-demos-${createHash("sha256").update(css).digest("hex").slice(0,12)}.css`;
await writeFile(resolve(output, cssFile), css);
const entry = assets.find(([path, meta]) => meta.entryPoint === "src/landing/bootstrap.ts" && path.endsWith(".js"));
if (!entry) throw new Error("Landing entry missing");
html = html.replace("<!-- landing-styles -->", `<link rel="stylesheet" href="/landing/generated/${cssFile}">`)
  .replace("<!-- landing-script -->", `<script type="module" src="/landing/generated/${basename(entry[0])}"></script>`);
if (/<!-- landing-(preview|demo|styles|script)/.test(html)) throw new Error("Unresolved landing template markers");
await writeFile("dist/index.html", html.replace(/[\t ]+$/gm, ""));

// Keep previous immutable hashes: already-open pages may only request their
// deferred chunks after a rebuild. Artifact cleanup belongs to release retention.
await writeFile(resolve(temporary, "bundle-report.json"), JSON.stringify(browser.metafile, null, 2));
console.log(`Landing: 6 product previews, 1 desktop/mobile hero, 3 IA demos. Initial script: ${entry[1].bytes} bytes. ${assets.length} assets.`);
