import { h } from "../dom.ts";

export type Kid = Node | string | null | undefined | false;

/** Page heading block: the only h1 on a page. */
export function pageHead(title: string, lead?: string): HTMLElement {
  return h("header", { class: "page-head" }, h("h1", { tabindex: "-1" }, title), lead ? h("p", { class: "lead" }, lead) : null);
}

export function sec(id: string, heading: string, ...kids: Kid[]): HTMLElement {
  return h("section", { class: "block", "aria-labelledby": id }, h("h2", { id }, heading), ...kids);
}

export function p(...kids: Kid[]): HTMLElement {
  return h("p", {}, ...kids);
}

export function ul(...items: Kid[][]): HTMLElement {
  return h("ul", { class: "bullets" }, ...items.map((i) => h("li", {}, ...i)));
}

export function code(text: string): HTMLElement {
  return h("code", {}, text);
}

export function pre(text: string, label: string): HTMLElement {
  return h("pre", { class: "snippet", tabindex: "0", "aria-label": label }, h("code", {}, text));
}

/** A code block with a copy button. Clipboard access needs the user's click; nothing is stored. */
export function copyBlock(text: string, label: string): HTMLElement {
  const status = h("span", { class: "copy-status", role: "status" });
  const btn = h("button", { type: "button", class: "btn btn-small" }, "Copy");
  btn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(text);
      status.textContent = "Copied";
    } catch {
      status.textContent = "Copy failed. Select the text and copy it by hand.";
    }
  });
  return h("div", { class: "copy-block" }, pre(text, label), h("div", { class: "copy-row" }, btn, status));
}

export function btn(href: string, text: string, primary: boolean, external = false): HTMLAnchorElement {
  return h("a", { href, class: primary ? "btn btn-primary" : "btn", rel: external ? "noopener noreferrer" : undefined }, text);
}
