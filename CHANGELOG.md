# UI 2.0.0 — 2026-10-16

Complete Organic Synthesis Atelier redesign of the existing laboratory. Scientific calculations and all 20 calculators are retained. See [UI-REDESIGN-CHANGELOG.md](UI-REDESIGN-CHANGELOG.md) for design changes and executed verification.

# Changelog

## 1.0.0 — 2026-10-16

- Implemented 20 scientific calculators in five isolated TypeScript engine modules sharing one stoichiometric and unit-conversion basis.
- Added Arabic RTL / English LTR interface, saved language, self-hosted Cairo/Inter, KaTeX equations and original SVG chemistry diagrams.
- Added actual-calculation sensitivity charts, full solution steps, interpretation, assumptions, sources, component split tables and external material ledgers.
- Added working CSV, PDF, clipboard and chart PNG exports with a stale-input guard.
- Documented the lecture DVS discrepancy and explicit alternative water definitions.
- Added a balanced educational AN/CHA selectivity model and a steady-state hydrogen recycle with explicit N2 purge and H2 separator loss.
- Added scientific and Playwright suites, deployment workflow and a complete production build.
