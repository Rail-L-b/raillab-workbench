export interface Route {
  path: string;
  title: string;
  description: string;
  /** Fill the main element. Must put exactly one h1 in it. */
  render(main: HTMLElement, url: URL): void;
}

export interface RouterOptions {
  routes: Route[];
  main: HTMLElement;
  notFound: Route;
  /** Called after every navigation (the shell uses it to update aria-current and close the menu). */
  onNavigate?(path: string): void;
}

export interface Router {
  navigate(href: string): void;
  current(): string;
}

function setMeta(description: string): void {
  let m = document.querySelector<HTMLMetaElement>('meta[name="description"]');
  if (!m) {
    m = document.createElement("meta");
    m.name = "description";
    document.head.append(m);
  }
  m.content = description;
}

/** Same-origin, unmodified, left-click links to an app path are handled here; everything else is left to the browser. */
function internalPath(a: HTMLAnchorElement, e: MouseEvent): string | null {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return null;
  if (a.target && a.target !== "_self") return null;
  if (a.hasAttribute("download")) return null;
  const href = a.getAttribute("href");
  if (!href || !href.startsWith("/") || href.startsWith("//")) return null;
  return href;
}

// Kept on window so that a second start (hot reload, tests) removes the first router's listeners.
const SLOT = Symbol.for("raillab.router.teardown");
type Slot = { [SLOT]?: () => void };

export function startRouter(opts: RouterOptions): Router {
  (window as unknown as Slot)[SLOT]?.();
  const find = (p: string) => opts.routes.find((r) => r.path === p) ?? opts.notFound;

  function show(href: string, moveFocus: boolean): void {
    const url = new URL(href, window.location.origin);
    const route = find(url.pathname.length > 1 ? url.pathname.replace(/\/+$/, "") : url.pathname);
    opts.main.replaceChildren();
    route.render(opts.main, url);
    document.title = route === opts.notFound ? "Page not found · RailLab" : `${route.title} · RailLab`;
    setMeta(route.description);
    opts.onNavigate?.(route === opts.notFound ? "" : route.path);
    if (moveFocus) {
      window.scrollTo(0, 0);
      opts.main.querySelector<HTMLElement>("h1")?.focus({ preventScroll: true });
    }
  }

  function navigate(href: string): void {
    window.history.pushState(null, "", href);
    show(href, true);
  }

  const onClick = (e: MouseEvent) => {
    const a = (e.target as Element | null)?.closest?.("a");
    if (!a) return;
    const path = internalPath(a as HTMLAnchorElement, e);
    if (path === null) return;
    e.preventDefault();
    navigate(path);
  };
  const onPop = () => show(window.location.pathname + window.location.search, true);
  document.addEventListener("click", onClick);
  window.addEventListener("popstate", onPop);
  (window as unknown as Slot)[SLOT] = () => {
    document.removeEventListener("click", onClick);
    window.removeEventListener("popstate", onPop);
  };

  show(window.location.pathname + window.location.search, false);
  return { navigate, current: () => window.location.pathname };
}
