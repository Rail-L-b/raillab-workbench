import { appHref, SCENARIO_CARDS, RULES } from "../catalog.ts";
import { h } from "../dom.ts";
import { ext, link, URLS } from "../links.ts";
import type { Route } from "../router.ts";
import { MUTANT_COUNT, PAIRING } from "../state.ts";
import { btn, copyBlock, pre, sec } from "./common.ts";

const INSTALL = "npm install @anas.abubakar/raillab-engine";
const CLI = "raillab test stale-authentication --seed 3 -- node my-wallet.js";

export const landingPage: Route = {
  path: "/",
  title: "SEP-24 incident simulator",
  description: "Reproduce SEP-24 wallet incidents with a deterministic anchor simulator. Same scenario and seed give the same timeline.",
  render(main) {
    const steps = [
      ["Pick a scenario.", "A scenario is a simulated anchor timeline plus a list of faults: transient errors, repeated or reordered responses, latency, token expiry, a wrong transaction id."],
      ["Choose a client and a seed.", "Use the corrected or defective reference client, or one of the per-rule mutants. The seed fixes every random choice."],
      ["The engine runs it.", "A scenario server with a virtual clock serves a documented subset of SEP-24 withdrawal polling and injects the faults. In the workbench this is the real engine, running in your tab."],
      ["Read the result.", "Eight rules are checked against what the client did. Each is labelled SEP-24 requirement or application policy, with evidence, a swimlane diagram and the full timeline."],
    ];
    const caps = [
      [`${SCENARIO_CARDS.length} bundled scenarios`, "Baseline, delayed payout, reordered and repeated responses, a 503 outage, token expiry, wrong-transaction responses and a seeded mix of all of them."],
      [`${RULES.length} labelled rules`, "Each result says whether it follows from the SEP-24 text or is an application policy, and shows the basis."],
      ["Same seed, same timeline", "A timeline fingerprint lets you check that two runs of a scenario and seed are identical."],
      [`${MUTANT_COUNT} per-rule mutants`, "The corrected client with exactly one behavior removed. Each should fail the matching rule and no other."],
      ["Save and open sessions", "Sessions download as JSON. On open, the assertions, verdict and fingerprint are recomputed and a file that disagrees is rejected."],
      ["Any language, through the CLI", "The engine's command contract lets a client in any language run against a scenario. The hosted page does not run your code."],
    ];
    main.append(
      h(
        "div",
        { class: "hero" },
        h(
          "div",
          { class: "wrap" },
          h("p", { class: "eyebrow" }, "SEP-24 withdrawal testing"),
          h("h1", { tabindex: "-1" }, "RailLab"),
          h("p", { class: "value" }, "Reproduce SEP-24 wallet incidents with a deterministic anchor simulator."),
          h("p", { class: "lead" }, "RailLab serves a documented subset of the SEP-24 withdrawal API from a virtual clock and a seeded fault scheduler, then checks what your wallet client did. The workbench runs the real engine in your browser, so you can watch a client fail and then pass."),
          h("p", { class: "cta" }, btn("/app", "Open the app", true), btn("/docs", "Read the docs", false)),
          h("p", { class: "runs-on" }, `Runs on: the real engine (${PAIRING.package} ${PAIRING.version}) in your browser. Simulated anchor, no network.`),
        ),
      ),
      h(
        "div",
        { class: "wrap" },
        sec(
          "problem",
          "The problem",
          h("p", {}, "A SEP-24 withdrawal is polled until it finishes. Real anchors answer late, answer twice, answer out of order, fail for a moment, let a token expire, or return another transaction's record."),
          h("p", {}, "A wallet that mishandles one of these tells the user the withdrawal is complete while the anchor is still at pending_anchor, repeats a side effect, or reports failure for a 503. You cannot ask a real anchor to do that on poll 6, and you cannot reproduce it the next day."),
          h("p", {}, "RailLab makes those moments happen on purpose and on repeat."),
        ),
        sec("how", "How it works", h("ol", { class: "steps" }, ...steps.map(([t, d]) => h("li", {}, h("strong", {}, t), " ", d!)))),
        sec("capabilities", "What you get", h("ul", { class: "cap-grid" }, ...caps.map(([t, d]) => h("li", {}, h("h3", {}, t!), h("p", {}, d!))))),
        sec(
          "example",
          "Example output",
          h("p", {}, "The defective reference client against the baseline scenario. This is the rule output the engine prints for that run (from the engine README)."),
          pre('FAIL  [sep] Does not tell the user the withdrawal is complete before the anchor says completed\n        At 70000 ms the user was told "completed" while the anchor status was "pending_anchor".', "Example rule failure"),
          h("p", {}, "The corrected client passes every applicable rule on the same scenario. ", link(appHref("baseline-withdrawal", { client: "defective", seed: "1" }), "Run it in the workbench"), "."),
        ),
        sec(
          "stellar",
          "Built on Stellar",
          h(
            "ul",
            { class: "bullets" },
            h("li", {}, h("strong", {}, "SEP-24 interactive withdrawal status polling. "), "Serves /info, /transactions/withdraw/interactive, /transaction and /transactions for withdrawals. ", ext(URLS.sep24, "SEP-24")),
            h("li", {}, h("strong", {}, "SEP-10 authentication outcome (simulated token). "), "POST /auth returns an opaque token. Challenge signing is not implemented, so a 403 authentication_required can be tested without a real SEP-10 flow."),
            h("li", {}, h("strong", {}, "The external consumer command contract. "), "A command in any language gets RAILLAB_BASE_URL and RAILLAB_EVENTS_URL and reports its decisions as JSON events. ", ext(URLS.contract, "Read the contract")),
          ),
        ),
        sec(
          "stack",
          "Use it in your stack",
          h("p", {}, "Install the engine from npm. It is browser-safe; its /node export adds the HTTP server and the command runner behind the raillab CLI."),
          copyBlock(INSTALL, "npm install command"),
          h("p", {}, "Run your own client against a scenario from the command line:"),
          copyBlock(CLI, "raillab test command"),
          h("p", {}, "Exit codes: 0 pass, 1 a rule failed, 3 inconclusive, 4 your command could not run or timed out, 2 invalid input."),
        ),
        sec(
          "limits",
          "What it does not do",
          h(
            "ul",
            { class: "bullets" },
            h("li", {}, "It covers SEP-24 interactive withdrawal only. No deposits, SEP-12, SEP-38 or SEP-6, no webhooks or KYC flow."),
            h("li", {}, "It does not implement SEP-10 challenge signing; the token is simulated."),
            h("li", {}, "It is not a conformance test for anchors and does not model any particular anchor."),
            h("li", {}, "Faults model response behavior, not network-level conditions."),
            h("li", {}, "Everything is simulated: the anchor, its bank, every identifier and every payment. Nothing touches a real bank or the Stellar network."),
            h("li", {}, "The hosted page runs reference clients only. It does not run your code."),
            h("li", {}, "No wallet or anchor maintainer has reviewed the scenarios or the rules."),
          ),
        ),
        sec(
          "open",
          "Open source",
          h("p", {}, "RailLab is MIT licensed and developed in public. The core is ", ext(URLS.engineRepo, "raillab-engine"), " and this app is ", ext(URLS.appRepo, "raillab-workbench"), ". Scoped work is labelled ", ext(URLS.goodFirst, "good first issue"), ". Read ", ext(URLS.contributing, "CONTRIBUTING.md"), " first, ask questions in ", ext(URLS.discussions, "Discussions"), ", and file bugs in ", ext(URLS.appIssues, "Issues"), "."),
        ),
      ),
    );
  },
};
