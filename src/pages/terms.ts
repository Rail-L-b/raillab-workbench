import { h } from "../dom.ts";
import { ext, link, URLS } from "../links.ts";
import type { Route } from "../router.ts";
import { pageHead, sec, ul } from "./common.ts";

export const termsPage: Route = {
  path: "/terms",
  title: "Terms",
  description: "Terms of use for the RailLab workbench: open source, provided as is, an engineering tool and not advice.",
  render(main) {
    main.append(
      h(
        "div",
        { class: "wrap narrow legal" },
        pageHead("Terms of use", "Last updated 22 October 2026."),
        sec(
          "terms",
          "Terms",
          ul(
            ["The software is open source under the MIT License. See ", ext(URLS.license, "LICENSE"), "."],
            ["It is provided as is, without warranty, as the license states."],
            ["It is an engineering and diagnostic tool. It is not financial, legal, investment, compliance or security advice. It is not an audit, and its results are not a guarantee of anything about a wallet, anchor, payment or network."],
            ["Everything the workbench shows is simulated. Sample and bundled scenarios are labelled as such, and results from a simulated anchor say nothing about a real anchor or about testnet or mainnet."],
            ["You are responsible for what you load into the page. The workbench contacts no network endpoint."],
            ["There are no accounts and no fees."],
            ["Contact is through ", ext(URLS.appIssues, "the GitHub repository"), ". See also the ", link("/privacy", "privacy policy"), "."],
          ),
        ),
      ),
    );
  },
};
