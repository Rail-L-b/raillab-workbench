import { h } from "../dom.ts";
import { link } from "../links.ts";
import type { Route } from "../router.ts";
import { pageHead } from "./common.ts";

export const notFoundPage: Route = {
  path: "*",
  title: "Page not found",
  description: "This page does not exist.",
  render(main) {
    main.append(h("div", { class: "wrap narrow" }, pageHead("Page not found", "There is nothing at this address."), h("p", {}, link("/", "Go to the home page"), " or ", link("/app", "open the workbench"), ".")));
  },
};
