# Hybrid WebP prototype

Throwaway performance experiment on `codex/hybrid-webp-prototype`.

Question: how much initial DOM and rendering work can raster posters remove while retaining viewport-triggered Remotion playback?

All ten product illustrations start as responsive WebP images. The hero is eager; the other nine are lazy. The four animated demos retain their viewport trigger and manual video dialog. Poster images are removed from the live DOM when the player is ready, and restored on player error or cleanup.

The original checkout is unchanged. This worktree includes its pending static CSS/JS minification changes for a comparable baseline.

## Run

Run `bun install` in a fresh checkout, then `bun run prototype`. It builds and serves at http://localhost:43125. Override the port with `PORT=43126 bun run prototype`.

The twenty WebPs and their content-keyed manifest are checked in. Unchanged builds need no browser. Changes to the rendered components or capture CSS regenerate them through an isolated, headless Chrome DevTools MCP process. This requires Chrome and `bunx chrome-devtools-mcp@1.8.0`. Set `CHROME_DEVTOOLS_MCP_ENTRY` to an existing MCP JavaScript entry point to avoid downloading it. `REGENERATE_POSTERS=1 bun run build` forces capture. The capture process uses local debugging port 48181.

The initial CSS contains theme tokens and landing layout only. The full component/player stylesheet loads with the player import, before mounting. `data-state` on `.landing-player-shell` shows loading, ready, or error; the inner `.landing-player` also exposes its playback state.

## What this prototype answers

Chrome DevTools MCP checks on September 23, 2026, with a 1440×900 desktop viewport, DPR 1, local uncompressed server, cold browser contexts, and no CPU/network throttling. These are single-run checks against the earlier baseline, not a repeated performance study. Normal-motion counts were sampled roughly six seconds after navigation and vary with animation frame.

| Desktop metric | Previous baseline | Hybrid prototype |
| --- | ---: | ---: |
| Initial elements, reduced motion | 2,722 | 521 |
| Elements with hero playing | 3,161 | 957 |
| Elements after scrolling through all demos | 3,853 | 1,635 |
| HTML, uncompressed | 219,749 B | 78,116 B |
| HTML, gzip estimate | 31,535 B | 13,743 B |
| Initial CSS, uncompressed | 169,848 B | 56,319 B |
| Initial transfer, reduced motion | 503 kB | 386 kB |
| Initial transfer, normal motion | 1.635 MB | 1.642 MB |

The initial DOM is 81% smaller. Each image preview uses four elements including its slot. The six permanent previews now use 24 elements instead of 1,115.

This does **not** reduce the animated runtime bundle. Near-viewport autoplay still loads React, Remotion and the composition modules immediately for the hero. The reduced-motion path avoids those modules and the component stylesheet until a manual video request. After a complete desktop scroll, total transfer reaches about 751 kB with reduced motion or 2.007 MB with normal motion, because all ten raster images have then downloaded. Native image lazy-loading may fetch images before they enter the viewport.

WebPs use quality 90 at the composition's native artboard dimensions, with alpha preserved for the hero. Desktop images total about 500 kB; compact images total about 428 kB. Only the matching responsive variant is requested. Image decoding and bitmap memory replace some DOM/style/layout work; this check does not quantify that memory or claim a paint/CPU improvement. Repeat the earlier trace and native-memory benchmark before making a production decision, especially with HTTP compression enabled.

## Verification and limits

- Checked desktop and 390×844 mobile at DPR 2, with normal and reduced motion. Both select the correct image variants and have no horizontal overflow.
- All ten images load on a full reduced-motion scroll. No player CSS or runtime loads before manual activation.
- Normal-motion scrolling mounts the four players, removes their images from live DOM, and leaves the six static previews as images.
- The video dialog opens and renders correctly under reduced motion. Existing tests verify manual playback, responsive player sizing, error recovery, cleanup and focus restoration.
- Existing test suite passes, 58 tests. Only existing assertions tied to SSR markup and hidden posters were updated for the new contract.
- `bun run check` still reports four pre-existing React ref typing errors in `players.tsx` with this workspace's installed React types. No new type errors remain.
- No deployment, PR, or changes to the original checkout. This is a throwaway branch, not a production recommendation.
