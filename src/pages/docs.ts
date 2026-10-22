import { h } from "../dom.ts";
import { ext, link, URLS } from "../links.ts";
import type { Route } from "../router.ts";
import { PAIRING } from "../state.ts";
import { copyBlock, pageHead, sec, ul } from "./common.ts";

export const docsPage: Route = {
  path: "/docs",
  title: "Docs",
  description: "Getting started with RailLab: run the engine locally, run this workbench, load your own scenarios and sessions.",
  render(main) {
    main.append(
      h(
        "div",
        { class: "wrap narrow" },
        pageHead("Docs", "Getting started on one page. The full documentation is on GitBook."),
        sec(
          "need",
          "What you need",
          ul(["Node 22 or newer."], ["pnpm."], ["Git, to clone the repositories."]),
          h("p", {}, "To use the workbench you only need a browser: open ", link("/app", "the app"), "."),
        ),
        sec(
          "core",
          "Run the engine locally",
          h("p", {}, "These commands are from the engine README. The first run fails (exit 1), the second passes (exit 0)."),
          copyBlock(
            "git clone https://github.com/Rail-L-b/raillab-engine.git && cd raillab-engine\npnpm install --frozen-lockfile && pnpm build\n\nnode dist/node/cli.js run baseline-withdrawal --consumer defective\nnode dist/node/cli.js run baseline-withdrawal --consumer corrected",
            "Commands to run the engine",
          ),
          h("p", {}, "Other commands: raillab list, raillab rules, raillab validate <file>, raillab run, raillab test, raillab serve."),
        ),
        sec(
          "workbench",
          "Run the workbench locally",
          copyBlock("git clone https://github.com/Rail-L-b/raillab-workbench.git\ncd raillab-workbench\npnpm install --frozen-lockfile\npnpm dev", "Commands to run the workbench"),
          h("p", {}, `The engine is installed from a committed release artifact, ${PAIRING.package} ${PAIRING.version}, so a clean clone installs exactly that code.`),
        ),
        sec(
          "load",
          "Load your own data into the workbench",
          ul(
            ["Edit the scenario. Open ", h("em", {}, "Scenario JSON"), " in ", link("/app", "the app"), " and change it. The text is checked against the engine's scenario schema before anything runs."],
            ["Open a saved session. Use ", h("em", {}, "Open a saved session"), " to load a session JSON. The file is read in your browser, and its assertions, verdict and fingerprint are recomputed before it is shown."],
            ["Link to a setup. ", h("code", {}, "/app?scenario=<id>&client=<id>&seed=<n>"), " preselects a bundled scenario, client and seed. Unknown values are ignored. Example: ", link("/app?scenario=transient-outage&client=mutant%3AretryTransient&seed=1", "transient outage, client without retry"), "."],
          ),
        ),
        sec(
          "own-client",
          "Test your own client",
          h("p", {}, "The hosted page does not run user code. To test your own wallet code in any language, use the engine CLI:"),
          copyBlock("node dist/node/cli.js test stale-authentication --seed 3 -- node my-wallet.js", "Test your own client"),
          h("p", {}, "Your command gets RAILLAB_BASE_URL and RAILLAB_EVENTS_URL. See the ", ext(URLS.contract, "consumer contract"), "."),
        ),
        sec("more", "Full documentation", ul([ext(URLS.engineDocs, "RailLab engine docs")], [ext(URLS.appDocs, "RailLab workbench docs")], [link("/scenarios", "Bundled scenarios")], [link("/rules", "The eight rules")])),
      ),
    );
  },
};
