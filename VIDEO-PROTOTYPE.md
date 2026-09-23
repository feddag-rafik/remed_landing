# Prerendered video prototype

Throwaway branch `codex/prerendered-video-prototype`, based on the separate WebP hybrid experiment. Neither the original checkout nor the hybrid worktree is changed.

Question: can build-time rendering replace browser-side React/Remotion animation, and what moves from CPU/DOM cost into video transfer and decoding?

## Run and compare

`bun run prototype` builds and serves at http://localhost:43126. The rendered WebPs and videos are checked in, so previewing does not need a renderer or FFmpeg.

- `/` chooses transparent VP9 for the hero and H.264 for opaque demos.
- `/?codec=vp9` requests VP9/WebM.
- `/?codec=av1` requests AV1 for the three opaque demos. The hero stays VP9 because it needs alpha.
- `/?codec=h264` requests MP4, including an opaque hero fallback.

Unsupported codecs fall back to the next supported source. A failed VP9/AV1 load retries H.264. WebKit engines use the opaque hero fallback because codec support alone does not establish alpha support. This browser detection is a prototype compromise and needs real Safari/iOS testing.

## What changed

The six static previews remain responsive WebP images. The four animated previews become native `video` elements when near the viewport. Their source URLs are not assigned in reduced-motion mode until the visitor opens a video manually. Posters remain visible through loading and return on an unrecoverable media error. Only one video plays at a time. Visibility, overlays, user pause, completion and responsive source changes use the existing framework-free playback coordinator.

The picker is a native `dialog`, with native media controls for seeking, keyboard access and fullscreen. It defaults to the document demo without autoplay. Closing it releases its video source and restores focus. Inline controls provide pause and replay; hero controls appear on hover/focus. State and selected codec are exposed on each host as `data-state` and `data-codec`.

The landing build bundles only `video-bootstrap.ts`, demo metadata and the pure playback coordinator. A build guard rejects any React/ReactDOM/Remotion dependency in the browser graph. The component/player stylesheet is not shipped. The old React player source remains in the repository as reference, not as a browser dependency.

## Rendering and codec choices

Run `bun run render:videos` to render missing assets. It needs Chrome, FFmpeg with libvpx-vp9/libx264/libsvtav1, and the existing Remotion build dependencies. Set `CHROME_PATH` for nonstandard Chrome locations. The default path is the macOS Chrome application.

The renderer produces lossless PNG sequences once per composition/aspect, then encodes each codec from those same frames. All videos use 30 fps. The hero's original 60 fps timeline is sampled every two frames, retaining its end state at a duration of 15.633 seconds. The other durations remain 35, 24 and 20 seconds. Desktop dimensions are 1100×820 for the hero and 1000×650 for the demos; compact dimensions are 740×820 and 740×650.

VP9 uses CRF 32, CPU-used 4, and alpha for the hero. H.264 uses CRF 23, medium preset and faststart. AV1 uses SVT-AV1 CRF 32, preset 8. Keyframes are at most two seconds apart. No audio track is included. The MP4 hero composites transparency over a pale `#eff6fb` matte; it does not look identical to the transparent hero.

These CRF settings are not quality-equivalent across codecs. The asset table is an experiment, not a general claim that one codec compresses better. The defaults favor alpha for the hero and broadly compatible H.264 for opaque demos. H.264 was smaller than VP9 on the first opaque clips; AV1 was smallest on the voice clip. AV1 remains selectable for comparison; hardware decoding and battery cost need device testing.

Rendered assets are a manual cache for this experiment. Set `RENDER_VIDEOS_AGAIN=1` after changing a composition. `VIDEO_ONLY=document` limits rendering to a demo, and `REUSE_VIDEO_FRAMES=1 RENDER_VIDEOS_AGAIN=1` re-encodes the existing frames. Only reuse frames when the composition itself is unchanged. PNG intermediates stay under ignored `.landing-build/video-frames`.

## Encoded assets

Whole-file sizes in decimal MB, from the checked-in manifest. These are not initial network-transfer measurements or quality-matched codec scores.

| Clip | VP9/WebM | H.264/MP4 | AV1/WebM |
|---|---:|---:|---:|
| hero-desktop | 1.37 | 1.17 | Not encoded: alpha |
| hero-compact | 0.97 | 0.77 | Not encoded: alpha |
| document-desktop | 3.85 | 2.96 | 3.14 |
| document-compact | 3.49 | 2.76 | 2.92 |
| voice-desktop | 0.83 | 0.78 | 0.75 |
| voice-compact | 0.76 | 0.74 | 0.70 |
| assistant-desktop | 0.70 | 0.64 | 0.61 |
| assistant-compact | 0.57 | 0.55 | 0.50 |

The default desktop set totals 5.76 MB across all four full videos, versus a shared animated JavaScript runtime of about 1.13 MB in the hybrid. The compact set totals 5.02 MB. Visitors only request clips when activated; seeking and browser buffering affect actual transferred bytes.

## Desktop measurements

Three cold normal-motion desktop runs, 1440×900 DPR 1, native CPU, local uncompressed server. Same six-second trace window as the prior benchmark, collected later rather than as interleaved A/B trials. The hero now runs at 30 fps rather than 60 fps, so workload is not identical.

| Metric | WebP hybrid | Native video |
|---|---:|---:|
| Browser JavaScript bodies | 1,134.6 kB | 9.0 kB |
| Initial estimated transfer | 1,641.6 kB | 1,770.7 kB |
| Elements with hero active | 957 | 523 |
| Main-thread task time | 1,064.0 ms | 335.5 ms |
| Style recalculation | 89.1 ms | 39.0 ms |
| Layout | 136.3 ms | 101.4 ms |
| Paint recording | 40.6 ms | 6.3 ms |
| Post-GC JS shallow allocation | 4.63 MB | 0.60 MB |
| Snapshot native allocations | 7.52 MB | 3.60 MB |

Main-thread task time falls about 68%, while initial transfer rises about 8%. These measurements do not count all decoder/GPU work or video-buffer memory. This prototype moves work to the native media pipeline; it does not eliminate that work. A separate functional desktop sample recorded 10 dropped hero frames out of 193, while mobile emulation recorded zero. Real-device smoothness and battery use remain open questions.

The full traces and comparison are saved with the task's `remed-video-performance/benchmark.md` artifact. Built HTML SHA-256: `67c86d360f14b86a8e052baa242c35b8f30408df559c3e45b87b767065189ce0`.

## Verification

- Built assets have one 7,393-byte native-player bundle, plus the existing 1,616-byte page script. The bundle metadata contains only `playback.ts`, `demoData.ts` and `video-bootstrap.ts`.
- Chrome DevTools MCP verified desktop and mobile, normal and reduced motion. No framework chunks or component CSS were requested. Reduced-motion full-page scrolling requested no video.
- All nine desktop opaque codec/demo combinations played and sought to 12 seconds. All three codecs switched to the compact source on resize while preserving position.
- An intentionally failed WebM request recovered to H.264 and resumed playback. Closing the dialog released it and restored trigger focus.
- Normal playback has 523 document elements; all four mounted clips have 529. The hybrid had about 957 and 1,637 respectively. These counts exclude browser-native control internals.
- The server returns HTTP 206 and `Accept-Ranges: bytes` for media range requests.
- All 58 existing tests pass after updating the browser-entry filename expectation. The new native runtime was checked in-browser, not covered by new automated unit tests.
- Type checking still reports the four inherited React-ref errors in the unused `players.tsx` reference implementation. No new type errors were introduced.

## Limits

Native video removes DOM animation work, not all rendering work. Decoding, compositing, decoded frames and GPU buffers still cost CPU/memory. Total media transfer may exceed the previous shared JavaScript bundle, particularly when several long clips are viewed. The prototype retains near-viewport autoplay so that comparison does not silently remove animation.

This is not production-hardened. Safari/iOS alpha fallback, autoplay policies, real network behavior, visual quality at high DPR, battery use, and accessibility need a broader device pass. Existing React player tests are historical coverage, not tests of the new native player. No deployment or PR is created.

Format references: [Remotion transparent-video rendering](https://www.remotion.dev/docs/transparent-videos), [MDN video codec guide](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Formats/Video_codecs).
