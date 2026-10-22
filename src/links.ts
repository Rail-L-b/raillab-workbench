import { h } from "./dom.ts";

export const URLS = {
  production: "https://raillab-workbench-anasamasama.vercel.app",
  engineRepo: "https://github.com/Rail-L-b/raillab-engine",
  appRepo: "https://github.com/Rail-L-b/raillab-workbench",
  engineIssues: "https://github.com/Rail-L-b/raillab-engine/issues",
  appIssues: "https://github.com/Rail-L-b/raillab-workbench/issues",
  goodFirst: "https://github.com/Rail-L-b/raillab-workbench/labels/good%20first%20issue",
  discussions: "https://github.com/Rail-L-b/raillab-workbench/discussions",
  engineDocs: "https://stellar-developer-tools.gitbook.io/raillab-engine/",
  appDocs: "https://stellar-developer-tools.gitbook.io/raillab-workbench/",
  npm: "https://www.npmjs.com/package/@anas.abubakar/raillab-engine",
  license: "https://github.com/Rail-L-b/raillab-workbench/blob/main/LICENSE",
  contributing: "https://github.com/Rail-L-b/raillab-workbench/blob/main/CONTRIBUTING.md",
  security: "https://github.com/Rail-L-b/raillab-workbench/blob/main/SECURITY.md",
  changelog: "https://github.com/Rail-L-b/raillab-workbench/blob/main/CHANGELOG.md",
  releases: "https://github.com/Rail-L-b/raillab-workbench/releases",
  contract: "https://github.com/Rail-L-b/raillab-engine/blob/main/docs/CONSUMER-CONTRACT.md",
  sep24: "https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0024.md",
  vercelPrivacy: "https://vercel.com/legal/privacy-policy",
} as const;

/** Internal link: the router intercepts clicks on these. */
export function link(href: string, text: string, cls?: string): HTMLAnchorElement {
  return h("a", { href, class: cls }, text);
}

/** External link: plain navigation, no opener. */
export function ext(href: string, text: string, cls?: string): HTMLAnchorElement {
  return h("a", { href, class: cls, rel: "noopener noreferrer" }, text);
}
