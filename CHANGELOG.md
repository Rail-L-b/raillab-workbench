# Changelog

## 0.2.0
- The workbench is now a navigable product site. Routes: `/` (landing), `/app` (the workbench, unchanged in behavior), `/scenarios` (gallery of the seven bundled scenarios), `/rules` (the eight engine rules with their SEP-24 requirement or application policy label), `/docs`, `/about`, `/privacy`, `/terms`, and a 404 page. Client-side History API router with a Vercel SPA rewrite.
- `/app` accepts `?scenario=<id>&client=<id>&seed=<n>` to preselect a bundled scenario, client and seed; unknown values are ignored.
- Shared header, mobile menu, skip link and footer; SVG logo, favicon, Open Graph image, robots.txt and sitemap.xml.
- No new network access: `connect-src 'self'` is unchanged. Tests check that the CSP meta tag and `vercel.json` match.

## 0.1.1
- Saved sessions are now verified by recomputing their assertions, verdict and timeline fingerprint; inconsistent files are rejected. Re-paired with the published 0.1.1 release of its core (`compat.json` and the vendor stamp record the version and commit). Recorded real-run samples keep the version that recorded them.

## 0.1.0 (unreleased)
- Workbench running the real raillab-engine in the browser: scenarios, clients (corrected, defective, per-rule mutants), seed, side-by-side comparison.
- Rule results labelled SEP-24 requirement or application policy, with evidence; swimlane diagram; full timeline.
- Scenario JSON editor, session save and open with schema validation.
- Engine pinned as a committed release artifact with a stamped hash.
