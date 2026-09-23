// Throwaway native-video prototype. Uses the checked-in prerendered assets.
export {};
const build = Bun.spawn(["bun", "run", "build"], { stdout: "inherit", stderr: "inherit" });
if (await build.exited) process.exit(1);
const server = Bun.spawn(["bun", "run", "start"], {
  env: { ...process.env, PORT: process.env.PORT || "43126" }, stdout: "inherit", stderr: "inherit",
});
process.on("SIGINT", () => server.kill());
process.on("SIGTERM", () => server.kill());
process.exit(await server.exited);
