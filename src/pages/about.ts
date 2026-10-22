import pkg from "../../package.json";
import { h } from "../dom.ts";
import { ext, URLS } from "../links.ts";
import type { Route } from "../router.ts";
import { PAIRING } from "../state.ts";
import { pageHead, sec } from "./common.ts";

export const aboutPage: Route = {
  path: "/about",
  title: "About",
  description: "What RailLab is, why it exists, who maintains it and how to contribute.",
  render(main) {
    const row = (name: string, role: string, handle: string) => h("tr", {}, h("td", {}, name), h("td", {}, role), h("td", {}, ext(`https://github.com/${handle}`, `@${handle}`)));
    main.append(
      h(
        "div",
        { class: "wrap narrow" },
        pageHead("About RailLab", "A deterministic SEP-24 anchor simulator, and a browser workbench built on it."),
        sec("what", "What it is", h("p", {}, "RailLab is a scenario server with a virtual clock, seeded faults and assertions. It serves a documented subset of SEP-24 withdrawal polling and checks what a wallet client did against eight rules. The same scenario and seed give the same timeline.")),
        sec("why", "Why it exists", h("p", {}, "Wallet bugs in withdrawal polling show up when an anchor is late, repeats itself, answers out of order or fails for a moment. Those moments are hard to cause on demand and hard to reproduce. RailLab causes them deliberately and says which rules a failure breaks, and whether each rule comes from SEP-24 or from an application policy.")),
        sec(
          "fit",
          "How the core and the app fit together",
          h("p", {}, "The ", ext(URLS.engineRepo, "core"), " (", ext(URLS.npm, "@anas.abubakar/raillab-engine"), ") holds the scenario server, the reference clients, the rules and the CLI. This ", ext(URLS.appRepo, "workbench"), ` runs that same engine in the browser. It installs a pinned release artifact (version ${PAIRING.version}) and decides nothing itself: every outcome comes from the engine's runSession.`),
        ),
        sec(
          "maintainers",
          "Maintainers",
          h("div", { class: "table-wrap" }, h("table", { class: "plain-table" }, h("thead", {}, h("tr", {}, h("th", { scope: "col" }, "Maintainer"), h("th", { scope: "col" }, "Role"), h("th", { scope: "col" }, "GitHub"))), h("tbody", {}, row("Anas Abubakar", "Lead maintainer", "Anasabubakar"), row("Abdulbasit Fazazi", "Co-maintainer", "fazaziishola-coder")))),
        ),
        sec("license", "License", h("p", {}, "MIT. See ", ext(URLS.license, "LICENSE"), ".")),
        sec(
          "contribute",
          "How to contribute",
          h("p", {}, "Open issues are scoped so one person can finish one in a single cycle, and each lists acceptance criteria. Read ", ext(URLS.contributing, "CONTRIBUTING.md"), ", pick an issue from the ", ext(URLS.appIssues, "issue list"), " and say you are taking it. Ask questions in ", ext(URLS.discussions, "Discussions"), ". Security reports go through ", ext(URLS.security, "SECURITY.md"), "."),
        ),
        sec("release", "Current release", h("p", {}, `Workbench version ${pkg.version}, paired with engine ${PAIRING.version}. `, ext(URLS.changelog, "Changelog"), " · ", ext(URLS.releases, "Releases"), ".")),
        sec("status", "Status", h("p", {}, "No wallet or anchor maintainer has reviewed the scenarios or the rules.")),
      ),
    );
  },
};
