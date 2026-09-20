import { watch } from "node:fs";
import { resolve, sep } from "node:path";

const root = resolve(import.meta.dir, "..");
process.chdir(root);
let building = false;
let queued = false;
async function build(): Promise<number> {
  if (building) { queued = true; return 0; }
  building = true;
  const child = Bun.spawn(["bun", "run", "build"], { stdout: "inherit", stderr: "inherit" });
  const code = await child.exited;
  building = false;
  if (queued) { queued = false; return build(); }
  return code;
}
if (await build()) process.exit(1);
const dist = resolve(root, "dist");
const server = Bun.serve({
  port: Number(process.env.PORT || 3001),
  async fetch(request) {
    if (!["GET", "HEAD"].includes(request.method)) return new Response("Method not allowed", { status: 405 });
    let pathname: string;
    try { pathname = decodeURIComponent(new URL(request.url).pathname); }
    catch { return new Response("Invalid URL", { status: 400 }); }
    const home = ["/", "/home", "/home/"].includes(pathname);
    if (!home && !pathname.startsWith("/landing/")) return new Response("Not found", { status: 404 });
    const target = home ? resolve(dist, "index.html") : resolve(dist, "." + pathname);
    if (!target.startsWith(dist + sep)) return new Response("Not found", { status: 404 });
    const file = Bun.file(target);
    if (!await file.exists()) return new Response("Not found", { status: 404 });
    return new Response(request.method === "HEAD" ? null : file, { headers: { "Content-Type": file.type, "Cache-Control": "no-store" } });
  },
});
let timer: ReturnType<typeof setTimeout>;
const rebuild = () => { clearTimeout(timer); timer = setTimeout(() => void build(), 150); };
const watchers = [watch("src", { recursive: true }, rebuild), watch("public", { recursive: true }, rebuild)];
function stop() { clearTimeout(timer); watchers.forEach(w => w.close()); server.stop(); process.exit(0); }
process.on("SIGINT", stop);
process.on("SIGTERM", stop);
console.log(`Landing: ${server.url} (also /home). Set PORT to avoid conflicts with the backend.`);
