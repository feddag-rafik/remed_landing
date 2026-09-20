import { demoDimensions } from './demoData';
"use client";

import React, { Component, useCallback, useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { Player, type PlayerRef } from "@remotion/player";
import { Dialog as DialogPrimitive } from "radix-ui";
const { Root: Dialog, Portal: DialogPortal, Overlay: DialogOverlay, Title: DialogTitle, Description: DialogDescription, Close: DialogClose } = DialogPrimitive;
import { compositions, demos, type DemoId } from "./demoData";
import { createPlaybackCoordinator } from "./playback";

type Status = "loading" | "ready" | "error";
type Ticket = ReturnType<ReturnType<typeof createPlaybackCoordinator>["register"]>;
const playback = createPlaybackCoordinator();
const mounts = new WeakMap<HTMLElement, () => void>();
let environmentUsers = 0;
let releaseEnvironment = () => {};
let externalOverlay = false;
let videosOpen = false;
let dispatchingOverlay = false;
let currentVideos: { focus: () => void } | undefined;

function acquireEnvironment() {
  if (environmentUsers++ === 0) {
    externalOverlay = false;
    const motion = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    const sync = () => playback.setEnvironment({
      hidden: document.visibilityState === "hidden",
      reducedMotion: motion?.matches ?? false,
      overlay: externalOverlay || videosOpen,
    });
    const onOverlay = (event: Event) => {
      if (dispatchingOverlay || typeof (event as CustomEvent).detail !== "boolean") return;
      externalOverlay = (event as CustomEvent<boolean>).detail;
      sync();
    };
    document.addEventListener("visibilitychange", sync);
    window.addEventListener("remed:landing-overlay", onOverlay);
    motion?.addEventListener("change", sync);
    sync();
    releaseEnvironment = () => {
      document.removeEventListener("visibilitychange", sync);
      window.removeEventListener("remed:landing-overlay", onOverlay);
      motion?.removeEventListener("change", sync);
    };
  }
  let released = false;
  return () => {
    if (released) return;
    released = true;
    if (--environmentUsers === 0) releaseEnvironment();
  };
}

function setVideosOpen(open: boolean) {
  videosOpen = open;
  const overlay = externalOverlay || open;
  playback.setEnvironment({ overlay });
  dispatchingOverlay = true;
  try {
    window.dispatchEvent(new CustomEvent("remed:landing-overlay", { detail: overlay }));
  } finally {
    dispatchingOverlay = false;
  }
}

function Failure({ retry }: { retry: () => void }) {
  return <div className="landing-player-error" role="alert">
    <p>La démonstration n’a pas pu être chargée.</p>
    <button type="button" className="landing-player-retry" onClick={retry}>Réessayer</button>
  </div>;
}

class PlayerBoundary extends Component<{
  children: React.ReactNode;
  onStatus?: (status: Status) => void;
}, { failed: boolean; attempt: number }> {
  state = { failed: false, attempt: 0 };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onStatus?.("error"); }
  render() {
    if (this.state.failed) return <Failure retry={() => {
      this.props.onStatus?.("loading");
      this.setState(({ attempt }) => ({ failed: false, attempt: attempt + 1 }));
    }} />;
    return <React.Fragment key={this.state.attempt}>{this.props.children}</React.Fragment>;
  }
}

function Rethrow({ error }: { error: Error }): never { throw error; }

type CompositionProps = { id: DemoId; compact?: boolean; onReady: () => void };
type LoadedComposition = React.ComponentType<CompositionProps>;

function SeekControl({ player, duration, fps, ready, onSeek }: {
  player: React.RefObject<PlayerRef>; duration: number; fps: number;
  ready: boolean; onSeek: (frame: number) => void;
}) {
  const [frame, setFrame] = useState(0);
  useEffect(() => {
    const ref = player.current;
    if (!ref || !ready) return;
    const update = () => setFrame(ref.getCurrentFrame());
    update();
    ref.addEventListener("frameupdate", update);
    ref.addEventListener("seeked", update);
    return () => {
      ref.removeEventListener("frameupdate", update);
      ref.removeEventListener("seeked", update);
    };
  }, [player, ready]);
  const time = (value: number) => `${Math.floor(value / fps / 60)}:${String(Math.floor(value / fps) % 60).padStart(2, "0")}`;
  return <label className="landing-player-seek">
    <span>Position</span>
    <input type="range" min={0} max={duration - 1} step={1} value={frame} disabled={!ready}
      aria-label="Position dans la démonstration" aria-valuetext={`${time(frame)} sur ${time(duration)}`}
      onChange={event => { const value = Number(event.target.value); setFrame(value); onSeek(value); }} />
    <span className="landing-player-time">{time(frame)} / {time(duration)}</span>
  </label>;
}

function DemoPlayer({ id, inline, onStatus }: {
  id: DemoId; inline: boolean; onStatus?: (status: Status) => void;
}) {
  const demo = compositions.find(item => item.id === id)!;
  const container = useRef<HTMLDivElement>(null);
  const player = useRef<PlayerRef>(null);
  const ticket = useRef<Ticket>();
  const started = useRef(false);
  const [composition, setComposition] = useState<LoadedComposition | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [ended, setEnded] = useState(false);
  const [compact, setCompact] = useState(() => window.matchMedia?.("(max-width: 600px)").matches ?? false);
  const alive = useRef(true);
  const readyPending = useRef(false);
  const readyFrame = useRef<number>();

  useEffect(() => {
    const media = window.matchMedia?.("(max-width: 600px)");
    if (!media) return;
    const update = () => setCompact(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    alive.current = true;
    onStatus?.("loading");
    import("./composition").then(({ DemoComposition }) => {
      if (!alive.current) return;
      const Loaded = ({ id, compact, onReady }: CompositionProps) => {
        useEffect(onReady, [onReady]);
        return <DemoComposition id={id} compact={compact} />;
      };
      setComposition(() => Loaded);
    }).catch(reason => {
      if (alive.current) setError(reason instanceof Error ? reason : new Error(String(reason)));
    });
    return () => {
      alive.current = false;
      if (readyFrame.current !== undefined) cancelAnimationFrame(readyFrame.current);
    };
  }, [onStatus]);

  useEffect(() => {
    const registration = playback.register({
      automatic: inline,
      onPlaying: next => {
        const ref = player.current;
        if (!ref) return;
        if (next) {
          if (!started.current) { ref.seekTo(0); started.current = true; }
          ref.play();
        } else ref.pause();
        setPlaying(next);
      },
    });
    ticket.current = registration;
    const element = container.current!;
    const observer = inline && typeof IntersectionObserver !== "undefined"
      ? new IntersectionObserver(entries => {
        for (const entry of entries) {
          if (entry.target === element) registration.update({
            visible: entry.isIntersecting && entry.intersectionRatio >= 0.25,
          });
        }
      }, { threshold: [0, 0.25] }) : undefined;
    if (observer) observer.observe(element);
    else registration.update({ visible: true });
    return () => {
      observer?.disconnect();
      registration.dispose();
      player.current?.pause();
      ticket.current = undefined;
    };
  }, [inline]);

  useEffect(() => { ticket.current?.update({ ready }); }, [ready]);

  const onReady = useCallback(() => {
    if (readyPending.current) return;
    readyPending.current = true;
    // Keep the original DOM poster through composition commit, font/image loading,
    // and the next paint. No business APIs or remote media are requested here.
    const images = [...(container.current?.querySelectorAll("img") ?? [])];
    Promise.all([
      document.fonts?.ready,
      ...images.map(image => image.decode?.()),
    ]).then(() => {
      if (!alive.current) return;
      readyFrame.current = requestAnimationFrame(() => {
        if (!alive.current) return;
        setReady(true);
        onStatus?.("ready");
      });
    }).catch(reason => {
      if (alive.current) setError(reason instanceof Error ? reason : new Error(String(reason)));
    });
  }, [onStatus]);

  useEffect(() => {
    const ref = player.current;
    if (!ref || demo.loop) return;
    const finish = () => {
      ref.pause();
      // moveToBeginningWhenEnded=false already holds the last frame. Seeking to
      // the final frame here would synchronously emit another ended event.
      setPlaying(false);
      setEnded(true);
      ticket.current?.ended();
    };
    ref.addEventListener("ended", finish);
    return () => { ref.removeEventListener("ended", finish); ref.pause(); };
  }, [composition, demo.durationInFrames, demo.loop]);

  useEffect(() => {
    if (id !== "hero") return;
    const media = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    const update = () => {
      if (!media?.matches) return;
      ticket.current?.pause();
      player.current?.seekTo(demo.posterFrame);
      started.current = false;
      setEnded(false);
    };
    media?.addEventListener("change", update);
    return () => media?.removeEventListener("change", update);
  }, [id, demo.posterFrame]);

  if (error) throw error;
  const play = (replay = false) => {
    if (!ready) return;
    if (replay || ended) { player.current?.seekTo(0); started.current = true; }
    setEnded(false);
    ticket.current?.play();
  };
  return <div ref={container} className={`landing-player ${inline ? "landing-player-inline" : "landing-player-dialog"}`}
    data-demo-id={id} data-state={!ready ? "loading" : ended ? "ended" : playing ? "playing" : "paused"}
    aria-busy={!ready}>
    <div className="landing-player-stage" style={{ aspectRatio: `${demoDimensions(id, compact).width} / ${demoDimensions(id, compact).height}`, width: "100%" }}>
      {composition && <Player ref={player} component={composition}
        inputProps={{ id, compact, onReady }}
        compositionWidth={demoDimensions(id, compact).width} compositionHeight={demoDimensions(id, compact).height}
        fps={demo.fps} durationInFrames={demo.durationInFrames} initialFrame={inline ? demo.posterFrame : 0}
        style={{ width: "100%" }} className="landing-player-canvas" overflowVisible={id === "hero"}
        autoPlay={false} loop={demo.loop ?? false} controls={false} clickToPlay={false}
        doubleClickToFullscreen={false} spaceKeyToPlayOrPause={false}
        moveToBeginningWhenEnded={false} numberOfSharedAudioTags={0}
        initiallyMuted initialVolume={0} browserMediaControlsBehavior={{ mode: "do-nothing" }}
        errorFallback={({ error }) => <Rethrow error={error} />} />}
      {!ready && !inline && <p className="landing-player-loading" role="status">Chargement de la démonstration…</p>}
    </div>
    {!inline && <SeekControl player={player} duration={demo.durationInFrames} fps={demo.fps} ready={ready}
      onSeek={frame => {
        ticket.current?.pause();
        started.current = true;
        setEnded(false);
        player.current?.seekTo(frame);
      }} />}
    {id !== "hero" && !(inline && id === "document") && <div className="landing-player-controls" role="group" aria-label={`Lecture : ${demo.title}`}>
      <button type="button" className="landing-player-toggle" disabled={!ready}
        aria-label={playing ? "Mettre en pause" : ended ? "Rejouer la démonstration" : "Lire la démonstration"}
        onClick={() => playing ? ticket.current?.pause() : play()}>
        {playing ? "Pause" : ended ? "Rejouer" : "Lire"}
      </button>
      <button type="button" className="landing-player-replay" disabled={!ready} onClick={() => play(true)}>Rejouer</button>
    </div>}
  </div>;
}

/** The host's existing children are its static poster; cleanup restores those nodes. */
export function mountDemo(element: HTMLElement, id: DemoId): () => void {
  if (!compositions.some(demo => demo.id === id)) throw new Error(`Unknown landing demo: ${id}`);
  mounts.get(element)?.();
  const release = acquireEnvironment();
  const shell = document.createElement("div");
  shell.className = "landing-player-shell";
  shell.style.display = "grid";
  const poster = document.createElement("div");
  poster.className = "landing-player-poster";
  poster.style.gridArea = "1 / 1";
  poster.append(...element.childNodes);
  const node = document.createElement("div");
  node.className = "landing-player-mount";
  node.style.gridArea = "1 / 1";
  node.style.minWidth = "0";
  node.style.visibility = "hidden";
  shell.append(poster, node);
  element.append(shell);
  const root = createRoot(node);
  let disposed = false;
  const onStatus = (status: Status) => {
    if (disposed) return;
    poster.hidden = status === "ready";
    node.style.visibility = status === "loading" ? "hidden" : "visible";
    shell.dataset.state = status;
  };
  root.render(<PlayerBoundary onStatus={onStatus}><DemoPlayer id={id} inline onStatus={onStatus} /></PlayerBoundary>);
  const cleanup = () => {
    if (disposed) return;
    disposed = true;
    root.unmount();
    shell.before(...poster.childNodes);
    shell.remove();
    release();
    if (mounts.get(element) === cleanup) mounts.delete(element);
  };
  mounts.set(element, cleanup);
  return cleanup;
}

function VideosDialog({ trigger, close }: { trigger: HTMLElement; close: () => void }) {
  const [id, setId] = useState<DemoId>(demos[0]!.id);
  const demo = compositions.find(item => item.id === id)!;
  return <Dialog open onOpenChange={open => { if (!open) close(); }}>
    <DialogPortal>
      <div className="landing-videos-portal">
        <DialogOverlay className="landing-videos-overlay" />
        <DialogPrimitive.Content className="landing-videos-dialog"
          onCloseAutoFocus={event => { event.preventDefault(); if (trigger.isConnected) trigger.focus(); }}>
          <div className="landing-videos-header">
            <DialogTitle className="landing-videos-title">Découvrir Remed en action</DialogTitle>
            <DialogClose className="landing-videos-close" aria-label="Fermer les démonstrations">Fermer</DialogClose>
          </div>
          <DialogDescription className="landing-videos-description">Choisissez une démonstration, puis lancez la lecture.</DialogDescription>
          <div className="landing-videos-body">
            <div className="landing-videos-list" role="group" aria-label="Démonstrations">
              {demos.map(item => <button key={item.id} type="button" className="landing-videos-tab"
                aria-pressed={item.id === id} onClick={() => setId(item.id)}>{item.title}</button>)}
            </div>
            <section className="landing-videos-detail" aria-label={demo.title}>
              <h3 className="landing-videos-selected-title">{demo.title}</h3>
              <p className="landing-videos-caption">{demo.description}</p>
              <PlayerBoundary key={id}><DemoPlayer id={id} inline={false} /></PlayerBoundary>
            </section>
          </div>
        </DialogPrimitive.Content>
      </div>
    </DialogPortal>
  </Dialog>;
}

/** One modal at a time. Radix owns focus trapping, Escape, and outside dismissal. */
export function openVideos(trigger: HTMLElement): void {
  if (currentVideos) { currentVideos.focus(); return; }
  const release = acquireEnvironment();
  const node = document.createElement("div");
  node.className = "landing-videos-root";
  document.body.append(node);
  const root = createRoot(node);
  let closed = false;
  const session = { focus: () => document.querySelector<HTMLElement>(".landing-videos-close")?.focus() };
  currentVideos = session;
  setVideosOpen(true);
  const close = () => {
    if (closed) return;
    closed = true;
    // Unmount outside Radix's event/render stack; effect cleanup pauses the player.
    queueMicrotask(() => {
      root.unmount();
      node.remove();
      if (currentVideos === session) currentVideos = undefined;
      setVideosOpen(false);
      release();
      if (trigger.isConnected) trigger.focus();
    });
  };
  root.render(<VideosDialog trigger={trigger} close={close} />);
}
