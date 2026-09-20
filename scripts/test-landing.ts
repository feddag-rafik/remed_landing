export {};
// Each file gets its own DOM/module-mock registry, as do the existing login tests.
for (const file of [
  "tests/landingIntegration.test.ts",
  "tests/landingScenes.test.tsx",
  "tests/landingHero.test.tsx",
  "tests/landingPlayers.test.tsx",
  "tests/landingBuild.test.ts",
]) {
  const test = Bun.spawn(["bun", "test", file], { stdout: "inherit", stderr: "inherit" });
  const code = await test.exited;
  if (code) process.exit(code);
}
