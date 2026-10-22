import pkg from "../package.json";
import { h } from "./dom.ts";
import { ext, link, URLS } from "./links.ts";

const NS = "http://www.w3.org/2000/svg";

export function logoMark(): SVGSVGElement {
  const svg = document.createElementNS(NS, "svg");
  svg.setAttribute("viewBox", "0 0 32 32");
  svg.setAttribute("width", "28");
  svg.setAttribute("height", "28");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("focusable", "false");
  const add = (tag: string, attrs: Record<string, string>) => {
    const el = document.createElementNS(NS, tag);
    for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
    svg.append(el);
  };
  add("rect", { width: "32", height: "32", rx: "7", fill: "#14532d" });
  add("path", { d: "M11 5 8 27M21 5l3 22", stroke: "#fff", "stroke-width": "2.6", "stroke-linecap": "round", fill: "none" });
  add("path", { d: "M10 11h12M9 17h14M8.4 23h15.2", stroke: "#7bd9a0", "stroke-width": "2.2", "stroke-linecap": "round", fill: "none" });
  return svg;
}

export const NAV: Array<{ href: string; label: string }> = [
  { href: "/", label: "Product" },
  { href: "/app", label: "App" },
  { href: "/scenarios", label: "Scenarios" },
  { href: "/rules", label: "Rules" },
  { href: "/docs", label: "Docs" },
  { href: "/about", label: "About" },
];

export interface Shell {
  main: HTMLElement;
  setCurrent(path: string): void;
}

export function buildShell(root: HTMLElement): Shell {
  const menu = h("button", { type: "button", class: "menu-btn", "aria-expanded": "false", "aria-controls": "site-nav" }, "Menu");
  const nav = h("nav", { id: "site-nav", class: "site-nav", "aria-label": "Main" });
  const links = NAV.map((n) => link(n.href, n.label));
  nav.append(...links, ext(URLS.appRepo, "GitHub"));

  const setOpen = (open: boolean) => {
    menu.setAttribute("aria-expanded", String(open));
    nav.classList.toggle("is-open", open);
  };
  menu.addEventListener("click", () => setOpen(menu.getAttribute("aria-expanded") !== "true"));
  nav.addEventListener("click", (e) => {
    if ((e.target as Element).closest("a")) setOpen(false);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menu.getAttribute("aria-expanded") === "true") {
      setOpen(false);
      menu.focus();
    }
  });

  const brand = h("a", { href: "/", class: "brand" }, logoMark() as unknown as Node, h("span", {}, "RailLab"));
  const header = h("header", { class: "site-header" }, h("div", { class: "bar" }, brand, menu, nav));

  const main = h("main", { id: "main", class: "page" });
  const col = (title: string, ...items: HTMLElement[]) => h("div", { class: "foot-col" }, h("h2", {}, title), h("ul", {}, ...items.map((i) => h("li", {}, i))));
  const footer = h(
    "footer",
    { class: "site-footer" },
    h(
      "div",
      { class: "foot-grid" },
      col("Product", link("/app", "App"), link("/scenarios", "Scenarios"), link("/rules", "Rules"), link("/docs", "Docs"), link("/about", "About")),
      col("Open source", ext(URLS.engineRepo, "Core repository"), ext(URLS.appRepo, "App repository"), ext(URLS.appIssues, "Issues"), ext(URLS.discussions, "Discussions"), ext(URLS.npm, "Package on npm")),
      col("Documentation", ext(URLS.engineDocs, "RailLab engine docs"), ext(URLS.appDocs, "RailLab workbench docs")),
      col("Legal", link("/privacy", "Privacy"), link("/terms", "Terms"), ext(URLS.license, "MIT License")),
    ),
    h("p", { class: "foot-line" }, `MIT licensed · Version ${pkg.version} · Built for the Stellar network`),
  );

  root.replaceChildren(h("a", { class: "skip", href: "#main" }, "Skip to content"), header, main, footer);
  // The skip link must not go through the router.
  root.querySelector(".skip")!.addEventListener("click", (e) => {
    e.preventDefault();
    main.setAttribute("tabindex", "-1");
    main.focus();
  });

  return {
    main,
    setCurrent(path) {
      for (const a of links) {
        if (a.getAttribute("href") === path) a.setAttribute("aria-current", "page");
        else a.removeAttribute("aria-current");
      }
      setOpen(false);
    },
  };
}
