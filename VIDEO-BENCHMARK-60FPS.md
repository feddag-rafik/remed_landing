# 60 fps native-video benchmark

Measured September 23, 2026 on the `beta-pre-rendered` worktree, with native media controls disabled and inline overlay controls hidden. Default codecs: transparent VP9 hero, H.264 opaque demos.

## Method

Same Chrome DevTools MCP collector and six-second-from-navigation trace analysis as the previous benchmark. Three cold browser contexts per device, normal motion, local uncompressed server at http://localhost:43126/, no network throttling. Desktop: 1440×900, DPR 1, native CPU. Mobile emulation: 390×844, DPR 2, 4× CPU throttling. Mobile emulation does not represent a physical phone or its video decoder. Table values are medians unless noted.

Historical comparisons were collected separately, not as interleaved A/B trials. Timing variation is substantial. The new version also hides controls, so this is a version comparison, not an isolated frame-rate experiment.

## Initial load

| Metric | Original DOM desktop | WebP hybrid desktop | Native 30 fps desktop | Native 60 fps desktop | Native 60 fps mobile |
|---|---:|---:|---:|---:|---:|
| Document elements | 3,161 | 957 | 523 | 523 | 523 |
| Document nodes | 4,555 | 1,734 | 1,211 | 1,211 | 1,211 |
| JS response bodies, kB | 1,133.7 | 1,134.6 | 9.0 | 9.0 | 9.0 |
| Estimated transferred, kB | 1,634.6 | 1,641.6 | 1,770.7 | 1,871.6 | 1,533.3 |
| Resource requests | 11 | 14 | 11 | 11 | 10 |
| Style recalculation, ms | 74.0 | 89.1 | 39.0 | 13.1 | 59.9 |
| Layout, ms | 141.6 | 136.3 | 101.4 | 28.5 | 383.2 |
| Paint recording, ms | 52.1 | 40.6 | 6.3 | 4.2 | 17.0 |
| Layerize, ms | 96.4 | 55.1 | 1.9 | 1.3 | 6.2 |
| Main-thread RunTask, ms | 1,119.7 | 1,064.0 | 335.5 | 107.2 | 726.3 |
| CLS | 0.0005 | 0.0005 | 0 | 0 | 0 |

Transfer is the sum of Resource Timing `transferSize`, including the navigation. It is a browser estimate, not packet-level traffic. Streaming, byte ranges and buffering can change it. Main-thread RunTask includes nested layout and paint; do not add these columns together. Decode/GPU work is not comprehensively included. Lower main-thread times in this run are not evidence that raising the frame rate improves performance.

## Run variation and paint timing caveat

| Run | FCP, ms | LCP, ms | Main-thread, ms | Style, ms | Layout, ms |
|---|---:|---:|---:|---:|---:|
| Desktop 1 | 176 | 176 | 219.8 | 27.1 | 45.6 |
| Desktop 2 | 480 | 84 | 107.2 | 12.5 | 28.5 |
| Desktop 3 | 492 | 108 | 107.1 | 13.1 | 26.3 |
| Mobile 1 | 1,040 | 1,236 | 726.3 | 59.9 | 383.2 |
| Mobile 2 | 708 | 908 | 433.3 | 49.0 | 157.1 |
| Mobile 3 | 1,116 | 1,300 | 811.9 | 62.5 | 438.9 |

The collector reports LCP before FCP in two desktop runs, an inconsistent result also seen in earlier captures. Those values are retained for transparency but should not be used for a paint-timing improvement claim without investigating the measurement. Trace RunTask and the injected Long Tasks observer also cover different activity; the observer reported zero desktop long tasks and one per mobile run, while trace tasks include navigation work.

## DOM and memory

Single desktop post-GC heap snapshot with hero mounted. Decimal MB, shallow allocations, not retained sizes or process RSS.

| Snapshot subset | Original DOM | WebP hybrid | Native 30 fps | Native 60 fps |
|---|---:|---:|---:|---:|
| DOM nodes | 0.47 | 0.19 | 0.16 | 0.158 |
| Style | 3.42 | 2.28 | 1.12 | 1.095 |
| Layout | 2.18 | 0.83 | 0.46 | 0.461 |
| All snapshot native allocations | 12.17 | 7.52 | 3.60 | 3.575 |
| JavaScript | 4.64 | 4.63 | 0.60 | 0.597 |

These subsets are not all video memory. Decoded frames, decoder buffers and GPU textures are not comprehensively represented. Native control/shadow internals can appear in snapshots without appearing in document element counts.

After scripted scrolling and mounting all four videos: 529 elements, 1,223 document nodes. Snapshot allocations: DOM 0.222 MB, style 1.291 MB, layout 0.459 MB, native total 4.079 MB, JavaScript 0.595 MB. Hidden controls remain in the DOM, explaining the unchanged element count.

## Playback and scrolling

Single warm-cache captures, not medians. The playback trace spans 19.0 seconds around an 18-second wait and records 156.6 ms main-thread work, 11.3 ms style, 0.6 ms layout and 4.7 ms paint. The scripted scroll trace spans 9.4 seconds with 557.4 ms main-thread work, 78.6 ms style, 28.9 ms layout, and 27.5 ms paint. Different trace lengths and scrolling activation make raw totals unsuitable as strict A/B scores. The prior 30 fps playback capture recorded 135.1 ms main-thread work, and its 11.2-second scroll recorded 399.4 ms.

## Size and conclusion

All 22 encoded files verify as 60 fps. Full default desktop video set: 5.95 MB versus 5.76 MB at 30 fps, +3.3%. Compact: 5.41 MB versus 5.02 MB, +7.9%. These totals are not initial-transfer estimates. Initial desktop transfer increased about 5.7% in this benchmark.

The 60 fps version retains the native-video implementation's small DOM and framework-free 9,009-byte browser JS payload. The main tradeoff remains media bytes and native decoding, not JavaScript or DOM animation. Real-device frame pacing, decoder/GPU memory and battery cost still need measurement.

Raw traces, heap snapshots, per-run metrics, collector and analysis are saved in the task artifact directory `remed-video-60fps-performance`. All 59 tests pass. Type checking still has the four inherited errors in the unused React `players.tsx` implementation.
