import { readFileSync } from "node:fs";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { RULES, RULE_SCENARIO, SCENARIO_CARDS } from "../src/catalog.ts";
import { runConfig, SCENARIOS } from "../src/state.ts";

const flush = () => new Promise((r) => setTimeout(r, 0));

async function boot(path: string) {
  document.body.innerHTML = '<div id="root"></div>';
  window.history.replaceState(null, "", path);
  window.scrollTo = vi.fn() as unknown as typeof window.scrollTo;
  vi.resetModules();
  const { boot: start } = await import("../src/site.ts");
  return start(document.getElementById("root")!);
}
const h1 = () => document.querySelector("h1")?.textContent;

describe("router", () => {
  beforeEach(() => document.body.replaceChildren());

  it.each([
    ["/", "RailLab"],
    ["/app", "RailLab workbench"],
    ["/scenarios", "Scenarios"],
    ["/rules", "Rules"],
    ["/docs", "Docs"],
    ["/about", "About RailLab"],
    ["/privacy", "Privacy policy"],
    ["/terms", "Terms of use"],
  ])("%s renders one h1 and a titled document", async (path, heading) => {
    await boot(path);
    expect(document.querySelectorAll("h1").length).toBe(1);
    expect(h1()).toBe(heading);
    expect(document.title).toMatch(/ · /);
    expect(document.querySelector('meta[name="description"]')?.getAttribute("content")?.length).toBeGreaterThan(20);
    expect(document.querySelector("header")).not.toBeNull();
    expect(document.querySelector("nav")).not.toBeNull();
    expect(document.querySelector("main")).not.toBeNull();
    expect(document.querySelector("footer")).not.toBeNull();
    expect(document.querySelector("a.skip")).not.toBeNull();
  });

  it("renders the 404 page inside the shell for unknown paths", async () => {
    await boot("/nope");
    expect(h1()).toBe("Page not found");
    expect(document.querySelector("main a[href='/']")).not.toBeNull();
    expect(document.querySelector("main a[href='/app']")).not.toBeNull();
    expect(document.querySelector("footer")).not.toBeNull();
  });

  it("navigates on internal link clicks without reloading, sets aria-current, moves focus and handles back", async () => {
    await boot("/");
    const marker = document.createElement("i");
    document.body.append(marker);
    document.querySelector<HTMLAnchorElement>('.site-nav a[href="/docs"]')!.click();
    await flush();
    expect(window.location.pathname).toBe("/docs");
    expect(h1()).toBe("Docs");
    expect(marker.isConnected).toBe(true);
    expect(document.querySelector('.site-nav a[aria-current="page"]')?.getAttribute("href")).toBe("/docs");
    expect(document.querySelectorAll('[aria-current="page"]').length).toBe(1);
    expect(document.activeElement).toBe(document.querySelector("h1"));
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
    window.history.back();
    await new Promise((r) => setTimeout(r, 50));
    expect(h1()).toBe("RailLab");
  });

  it("does not intercept external links", async () => {
    await boot("/");
    const a = document.querySelector<HTMLAnchorElement>('a[href^="https://github.com"]')!;
    const ev = new MouseEvent("click", { bubbles: true, cancelable: true, button: 0 });
    a.addEventListener("click", (e) => e.preventDefault(), { once: true });
    a.dispatchEvent(ev);
    expect(window.location.pathname).toBe("/");
  });
});

describe("shell", () => {
  it("toggles the mobile menu with aria-expanded and closes it on Escape", async () => {
    await boot("/");
    const btn = document.querySelector<HTMLButtonElement>(".menu-btn")!;
    const nav = document.getElementById("site-nav")!;
    expect(btn.getAttribute("aria-expanded")).toBe("false");
    btn.click();
    expect(btn.getAttribute("aria-expanded")).toBe("true");
    expect(nav.classList.contains("is-open")).toBe(true);
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    expect(btn.getAttribute("aria-expanded")).toBe("false");
    btn.click();
    nav.querySelector<HTMLAnchorElement>('a[href="/about"]')!.click();
    expect(btn.getAttribute("aria-expanded")).toBe("false");
  });

  it("footer carries the legal links, the package version and the Stellar line", async () => {
    await boot("/");
    const f = document.querySelector("footer")!;
    expect(f.querySelector('a[href="/privacy"]')).not.toBeNull();
    expect(f.querySelector('a[href="/terms"]')).not.toBeNull();
    const pkg = JSON.parse(readFileSync("package.json", "utf8"));
    expect(f.textContent).toContain(`Version ${pkg.version}`);
    expect(f.textContent).toContain("MIT licensed");
    expect(f.textContent).toContain("Built for the Stellar network");
  });
});

describe("legal pages", () => {
  it.each(["/privacy", "/terms"])("%s carries the dated heading", async (path) => {
    await boot(path);
    expect(document.querySelector("main")!.textContent).toContain("Last updated 22 October 2026");
  });
});

describe("workbench query parameters", () => {
  it("preselects a bundled scenario, client and seed", async () => {
    await boot("/app?scenario=transient-outage&client=mutant%3AretryTransient&seed=7");
    expect((document.getElementById("scenario") as HTMLSelectElement).value).toBe("transient-outage");
    expect((document.getElementById("client") as HTMLSelectElement).value).toBe("mutant:retryTransient");
    expect((document.getElementById("seed") as HTMLInputElement).value).toBe("7");
  });

  it("ignores unknown or malformed values", async () => {
    await boot("/app?scenario=<script>&client=nope&seed=-1");
    expect((document.getElementById("scenario") as HTMLSelectElement).value).toBe(SCENARIOS[0]!.name);
    expect((document.getElementById("client") as HTMLSelectElement).value).toBe("defective");
    expect((document.getElementById("seed") as HTMLInputElement).value).toBe("1");
    await boot("/app?seed=99999999999");
    expect((document.getElementById("seed") as HTMLInputElement).value).toBe("1");
  });
});

describe("gallery and rules", () => {
  it("lists every bundled scenario with a link that preselects it", async () => {
    await boot("/scenarios");
    const cards = [...document.querySelectorAll("[data-scenario]")];
    expect(cards.map((c) => c.getAttribute("data-scenario"))).toEqual(SCENARIOS.map((s) => s.name));
    for (const c of cards) expect(c.querySelector("a")!.getAttribute("href")).toBe(`/app?scenario=${c.getAttribute("data-scenario")}`);
  });

  it("lists every engine rule with its label", async () => {
    await boot("/rules");
    const cards = [...document.querySelectorAll("[data-rule]")];
    expect(cards.length).toBe(RULES.length);
    expect(cards.map((c) => c.getAttribute("data-kind"))).toEqual(RULES.map((r) => r.kind));
    expect(document.querySelector("main")!.textContent).toMatch(/SEP-24 requirement/);
    expect(document.querySelector("main")!.textContent).toMatch(/Application policy/);
  });

  it("each rule's linked scenario really exercises it (rule is not 'not applicable' for the corrected client)", async () => {
    expect(Object.keys(RULE_SCENARIO).sort()).toEqual(RULES.map((r) => r.id).sort());
    for (const [rule, scenario] of Object.entries(RULE_SCENARIO)) {
      expect(SCENARIO_CARDS.some((s) => s.name === scenario)).toBe(true);
      const r = await runConfig({ scenarioText: SCENARIOS.find((s) => s.name === scenario)!.json, seed: 1, clientId: "corrected" });
      if (!r.ok) throw new Error(r.error);
      const outcome = r.session.result.assertions.find((a) => a.id === rule)!.outcome;
      expect(outcome, `${rule} in ${scenario}`).not.toBe("not_applicable");
    }
  });
});

describe("network and CSP", () => {
  it("makes no fetch call on any route", async () => {
    const spy = vi.fn();
    vi.stubGlobal("fetch", spy);
    for (const p of ["/", "/app", "/scenarios", "/rules", "/docs", "/about", "/privacy", "/terms", "/x"]) await boot(p);
    expect(spy).not.toHaveBeenCalled();
    vi.unstubAllGlobals();
  });

  it("the CSP meta tag and vercel.json carry the same policy, with no unsafe-* and connect-src 'self' only", () => {
    const html = readFileSync("index.html", "utf8");
    const meta = /http-equiv="Content-Security-Policy" content="([^"]+)"/.exec(html)![1]!;
    const vercel = JSON.parse(readFileSync("vercel.json", "utf8"));
    const header = vercel.headers[0].headers.find((x: { key: string }) => x.key === "Content-Security-Policy").value;
    expect(meta).toBe(header);
    expect(meta).toContain("connect-src 'self';");
    expect(meta).not.toMatch(/unsafe-/);
  });

  it("vercel.json has the SPA fallback rewrite", () => {
    const vercel = JSON.parse(readFileSync("vercel.json", "utf8"));
    expect(vercel.rewrites[0].destination).toBe("/index.html");
  });
});
