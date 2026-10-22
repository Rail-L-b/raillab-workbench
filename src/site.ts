import { startRouter, type Route, type Router } from "./router.ts";
import { buildShell } from "./shell.ts";
import { appPage } from "./pages/app-page.ts";
import { landingPage } from "./pages/landing.ts";
import { docsPage } from "./pages/docs.ts";
import { aboutPage } from "./pages/about.ts";
import { privacyPage } from "./pages/privacy.ts";
import { termsPage } from "./pages/terms.ts";
import { scenariosPage } from "./pages/scenarios.ts";
import { rulesPage } from "./pages/rules.ts";
import { notFoundPage } from "./pages/notfound.ts";

export const ROUTES: Route[] = [landingPage, appPage, scenariosPage, rulesPage, docsPage, aboutPage, privacyPage, termsPage];


export function boot(root: HTMLElement): Router {
  const shell = buildShell(root);
  return startRouter({ routes: ROUTES, main: shell.main, notFound: notFoundPage, onNavigate: (p) => shell.setCurrent(p) });
}
