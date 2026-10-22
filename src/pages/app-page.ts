import { h } from "../dom.ts";
import type { Route } from "../router.ts";
import { mountApp } from "./app.ts";

export const appPage: Route = {
  path: "/app",
  title: "Workbench",
  description: "Run SEP-24 withdrawal incident scenarios against reference wallet clients in your browser. Simulated anchor; nothing real is involved.",
  render(main, url) {
    const host = h("div", { id: "app", class: "app-host" });
    main.append(host);
    mountApp(host, url.search);
  },
};
