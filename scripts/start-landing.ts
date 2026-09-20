import { resolve } from "node:path";

const root = resolve(import.meta.dir, "..");
const dist = resolve(root, "dist");
const index = Bun.file(resolve(dist, "index.html"));

if (!await index.exists()) {
  console.error("Landing build not found. Run `bun run build` before `bun run start`.");
  process.exit(1);
}

const server = Bun.serve({
  port: Number(process.env.PORT || 3001),
  routes: {
    "/": index,
    "/home": index,
    "/home/": index,
    "/landing/*": { dir: resolve(dist, "landing") },
  },
  fetch: () => new Response("Not found", { status: 404 }),
});

console.log(`Landing: ${server.url} (also /home)`);
