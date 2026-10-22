import { h } from "../dom.ts";
import { ext, URLS } from "../links.ts";
import type { Route } from "../router.ts";
import { pageHead, sec, ul } from "./common.ts";

export const privacyPage: Route = {
  path: "/privacy",
  title: "Privacy",
  description: "Privacy policy for the RailLab workbench: what runs in your browser, what is sent, and what is not.",
  render(main) {
    main.append(
      h(
        "div",
        { class: "wrap narrow legal" },
        pageHead("Privacy policy", "Last updated 22 October 2026."),
        sec("who", "Who runs this", h("p", {}, "The RailLab maintainers named on the ", ext(URLS.appRepo, "repository README"), " (Anas Abubakar and Abdulbasit Fazazi). Contact is through ", ext(URLS.appIssues, "the repository's issues"), ". Security reports go through ", ext(URLS.security, "SECURITY.md"), ".")),
        sec(
          "data",
          "What the app does with your data",
          ul(
            ["Scenarios you edit and session files you open are processed in your browser. The app does not upload them anywhere."],
            ["There are no accounts, no cookies, no analytics and no advertising."],
            ["The app does not use localStorage or sessionStorage. Nothing is kept after you close or reload the tab."],
            ["Download first session as JSON creates a file in your browser and saves it through your browser's download. It is not sent anywhere."],
            ["The Copy buttons write the visible command text to your clipboard when you press them."],
          ),
        ),
        sec("network", "Network requests", h("p", {}, "The app makes requests only to its own origin, to load its files. It has no feature that contacts any other host, and its Content-Security-Policy allows connections to its own origin only.")),
        sec("hosting", "Hosting", h("p", {}, "The site is served by Vercel. Vercel may process standard request data such as IP address and user agent in its server logs, under ", ext(URLS.vercelPrivacy, "its own privacy policy"), ".")),
        sec("chain", "Public blockchain data", h("p", {}, "The app does not read from the Stellar network. Everything the simulated anchor does is simulated.")),
        sec("changes", "Changes", h("p", {}, "Changes to this policy are made through the public repository, and its history is the record.")),
      ),
    );
  },
};
