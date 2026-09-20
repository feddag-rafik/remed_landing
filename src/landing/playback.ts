/** Playback policy without React, browser APIs, timers, or media dependencies. */
export function createPlaybackCoordinator() {
  type Entry = {
    automatic: boolean;
    ready: boolean;
    visible: boolean;
    intent: "auto" | "manual" | "paused" | "ended";
    playing: boolean;
    onPlaying: (playing: boolean) => void;
  };
  const entries = new Set<Entry>();
  let hidden = false;
  let overlay = false;
  let reducedMotion = false;
  let active: Entry | undefined;

  function reconcile() {
    const eligible = (entry: Entry) =>
      !hidden && entry.ready && entry.visible &&
      !(overlay && entry.automatic) &&
      (entry.intent === "manual" ||
        (entry.intent === "auto" && entry.automatic && !reducedMotion));
    const next = [...entries].find(entry => eligible(entry) && entry.intent === "manual") ??
      (active && eligible(active) ? active : [...entries].find(eligible));
    active = next;
    // Pause the old owner before granting playback to the next one.
    for (const entry of entries) {
      if (entry.playing && entry !== next) {
        entry.playing = false;
        entry.onPlaying(false);
      }
    }
    if (next && !next.playing) {
      next.playing = true;
      next.onPlaying(true);
    }
  }

  return {
    setEnvironment(patch: { hidden?: boolean; overlay?: boolean; reducedMotion?: boolean }) {
      hidden = patch.hidden ?? hidden;
      overlay = patch.overlay ?? overlay;
      reducedMotion = patch.reducedMotion ?? reducedMotion;
      reconcile();
    },
    register(options: { automatic: boolean; onPlaying: (playing: boolean) => void }) {
      const entry: Entry = {
        ...options, ready: false, visible: false, playing: false,
        intent: options.automatic ? "auto" : "paused",
      };
      entries.add(entry);
      let disposed = false;
      const change = (action: () => void) => {
        if (disposed) return;
        action();
        reconcile();
      };
      return {
        update(patch: { ready?: boolean; visible?: boolean }) {
          change(() => Object.assign(entry, patch));
        },
        play() {
          change(() => {
            for (const other of entries) {
              if (other !== entry && other.intent === "manual") other.intent = "paused";
            }
            entry.intent = "manual";
          });
        },
        pause() { change(() => { entry.intent = "paused"; }); },
        ended() { change(() => { entry.intent = "ended"; }); },
        dispose() {
          if (disposed) return;
          disposed = true;
          entries.delete(entry);
          if (active === entry) active = undefined;
          if (entry.playing) entry.onPlaying(false);
          entry.playing = false;
          reconcile();
        },
      };
    },
  };
}
