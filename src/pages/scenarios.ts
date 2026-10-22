import { appHref, FAULT_LABEL, SCENARIO_CARDS } from "../catalog.ts";
import { h } from "../dom.ts";
import { link } from "../links.ts";
import type { Route } from "../router.ts";
import { pageHead } from "./common.ts";

export const scenariosPage: Route = {
  path: "/scenarios",
  title: "Scenarios",
  description: "The seven bundled RailLab scenarios: what the simulated anchor does in each and which faults it injects.",
  render(main) {
    const cards = SCENARIO_CARDS.map((s) =>
      h(
        "article",
        { class: "card", "data-scenario": s.name },
        h("h2", {}, s.title),
        h("p", { class: "mono-id" }, s.name),
        h("p", {}, s.description),
        h("p", { class: "meta" }, h("strong", {}, "Faults: "), s.faultTypes.length === 0 ? "none" : s.faultTypes.map((f) => FAULT_LABEL[f] ?? f).join(", ")),
        h("p", { class: "meta" }, `Polling budget: ${s.polls} status requests.`),
        h("p", {}, link(appHref(s.name), "Run in the workbench", "btn btn-primary")),
      ),
    );
    main.append(
      h(
        "div",
        { class: "wrap" },
        pageHead("Scenarios", "Seven scenarios ship with the engine. Each is a simulated anchor timeline plus a list of faults. Run one in the workbench, or edit its JSON there to build your own."),
        h("div", { class: "card-grid" }, ...cards),
      ),
    );
  },
};
