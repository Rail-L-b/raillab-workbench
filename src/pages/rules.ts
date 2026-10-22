import { appHref, RULES, RULE_SCENARIO, SCENARIO_CARDS } from "../catalog.ts";
import { h } from "../dom.ts";
import { link } from "../links.ts";
import type { Route } from "../router.ts";
import { pageHead } from "./common.ts";

export const rulesPage: Route = {
  path: "/rules",
  title: "Rules",
  description: "The eight rules RailLab checks a SEP-24 client against, each labelled SEP-24 requirement or application policy.",
  render(main) {
    const items = RULES.map((r) => {
      const sc = SCENARIO_CARDS.find((s) => s.name === RULE_SCENARIO[r.id]);
      return h(
        "article",
        { class: "card", "data-rule": r.id, "data-kind": r.kind },
        h("p", {}, h("span", { class: `kind-tag kind-${r.kind}` }, r.kind === "sep" ? "SEP-24 requirement" : "Application policy")),
        h("h2", {}, r.title),
        h("p", { class: "mono-id" }, r.id),
        h("p", {}, r.basis),
        sc && h("p", {}, "Exercised by: ", link(appHref(sc.name), sc.title)),
      );
    });
    main.append(
      h(
        "div",
        { class: "wrap" },
        pageHead("Rules", `The engine checks every run against ${RULES.length} rules. A SEP-24 requirement follows from the specification text. An application policy is a choice about robust behavior that no standard requires, so you can tell a bug from a preference.`),
        h("div", { class: "card-grid" }, ...items),
      ),
    );
  },
};
