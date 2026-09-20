// Landing entry: no application or authentication runtime.
let runtime: Promise<typeof import("./players")> | undefined;
const loadPlayers = () => runtime ||= import("./players").catch(error => {
  runtime = undefined;
  throw error;
});

let opening = false;
document.addEventListener("click", async event => {
  const trigger = event.target instanceof Element ? event.target.closest<HTMLElement>("[data-landing-videos]") : null;
  if (!trigger || !(event instanceof MouseEvent) || event.button || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  if (opening) return;
  opening = true;
  trigger.setAttribute("aria-busy", "true");
  const status = document.createElement("span");
  status.className = "ld-open-status";
  status.setAttribute("role", "status");
  status.textContent = "Chargement des vidéos…";
  trigger.after(status);
  try {
    const { openVideos } = await loadPlayers();
    await openVideos(trigger);
  } catch {
    status.textContent = "Chargement impossible. Cliquez à nouveau pour réessayer.";
    setTimeout(() => status.remove(), 8000);
  } finally {
    if (status.textContent === "Chargement des vidéos…") status.remove();
    trigger.removeAttribute("aria-busy");
    opening = false;
  }
});

const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting || reducedMotion.matches) continue;
      const element = entry.target as HTMLElement;
      observer.unobserve(element);
      void loadPlayers().then(({ mountDemo }) => {
        const id = element.dataset.landingDemo;
        if (id === "hero" || id === "document" || id === "voice" || id === "assistant") mountDemo(element, id);
      }).catch(() => {
        // The complete coded poster remains visible; manual video links retry.
      });
    }
  }, { rootMargin: "160px 0px" });
  const observe = () => document.querySelectorAll<HTMLElement>("[data-landing-demo]").forEach(element => observer.observe(element));
  observe();
  reducedMotion.addEventListener("change", event => { if (!event.matches) observe(); });
}
