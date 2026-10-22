import { RULE_CATALOG } from "@anas.abubakar/raillab-engine";
import { SCENARIO_DOCS } from "./state.ts";

export interface ScenarioCard {
  name: string;
  title: string;
  description: string;
  faultTypes: string[];
  polls: number;
}

export const SCENARIO_CARDS: ScenarioCard[] = SCENARIO_DOCS.map((s) => ({
  name: s.name,
  title: s.title,
  description: s.description,
  faultTypes: [...new Set((s.faults as Array<{ type: string }>).map((f) => f.type))],
  polls: s.maxPolls,
}));

export const RULES = RULE_CATALOG;

/**
 * A bundled scenario that creates the situation each rule is about. A test runs the corrected client on each one and
 * checks the rule is not "not applicable" there, so this list cannot drift from the engine.
 */
export const RULE_SCENARIO: Record<string, string> = {
  "no-early-completion": "baseline-withdrawal",
  "final-state-matches-anchor": "baseline-withdrawal",
  "keeps-pending-until-terminal": "delayed-payout",
  "no-status-regression": "reordered-and-repeated",
  "idempotent-business-actions": "reordered-and-repeated",
  "retries-transient-errors": "transient-outage",
  "reauthenticates-on-403": "stale-authentication",
  "ignores-mismatched-reference": "mismatched-reference",
};

export const FAULT_LABEL: Record<string, string> = {
  transient_error: "transient server error",
  duplicate_response: "exact repeat",
  stale_snapshot: "reordered (older) status",
  latency: "latency",
  mismatched_reference: "wrong transaction id",
  token_expiry: "token expiry (403)",
};

export function appHref(scenario: string, extra: Record<string, string> = {}): string {
  const q = new URLSearchParams({ scenario, ...extra });
  return `/app?${q.toString()}`;
}
