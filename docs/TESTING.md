# Verification and test instructions — UI 2.0.0

## Executed release results — 2026-10-16 UTC

| Check | Executed result |
| --- | --- |
| Original Vitest scientific suite | **156 passed, 0 failed**; original file unchanged |
| Exact v1/v2 preservation comparisons | **1170 passed, 0 failed** |
| All Vitest cases | **1326 passed, 0 failed** |
| Original browser cases | **104 passed**; original file unchanged |
| Additional redesign browser cases | **44 passed** |
| Complete Playwright run | **148 passed, 0 failed, 0 skipped** |
| TypeScript and Vite production build | Passed |
| SHA-256 preservation check | 17 original files and 3 calculation/data fragments unchanged; baseline fixture verified |
| Responsive matrix | 360, 390, 768, 1024 and 1440 px; Arabic and English |
| Automated WCAG-tagged audits | 36 page audits; 0 reported violations |
| 200% zoom-equivalent reflow | Passed at physical widths 1024/1440 px, CSS widths 512/720 px, DPR 2 |
| CSV, PNG, Arabic PDF, clipboard | Passed; real downloads and contents/signatures checked |
| All 20 PDF layouts | Passed in both languages; equations fit print width and report blocks fit pages |
| Production subpath and assets | Passed under `/AnilineProduction-Lab/`; JS, CSS and fonts load |
| Clean extraction and install | Passed: fresh `npm ci`, preservation check, 1326 tests and 86 byte-identical production files |

The final full browser run took approximately 124 seconds. Individual executed case names, statuses, audit records, contrast pairs and production file hashes are in [UI-VALIDATION-RESULTS.json](UI-VALIDATION-RESULTS.json). [VALIDATION_RESULTS.json](VALIDATION_RESULTS.json) is the retained historical v1 record.

## Environment and coverage

Node 24.19.0; Chromium 153.0.8010.0. The original suite uses desktop 1440×1000 and Pixel 7 mobile emulation at 390×844. The added matrix explicitly sets 360, 390, 768, 1024 and 1440 px in both projects and both languages.

Every original calculator is calculated in both languages on desktop and mobile. The additional width matrix covers the homepage, scientific basis and calculators 1, 7, 11, 15 and 20, plus comparison charts in calculators 5 and 18. It checks primary values, chart paths, equations, control/result typography and text/control bounds, including negative-side RTL overflow.

Actual downloads are tested for CSV, PNG and the integrated Arabic PDF. CSV values and provenance are checked; PNG/PDF signatures and sizes are checked. A six-page Arabic report was rendered and visually inspected. Export routines are unchanged; PDF text remains image-based as in v1. CSS now wraps long print equations at KaTeX boundaries.

## Scientific preservation

The existing 156 independent reference, boundary, unit and conservation tests are unchanged. The redesign adds a fixture captured from v1 **before UI edits**, with 1170 complete results or validation-error codes. It includes defaults, all 51 sensitivity points per calculator, negative/over-100% inputs where applicable and mass/quantity unit scenarios. Comparing these records does not replace the original independent scientific tests.

The reproducible preservation script checks engine files, calculator definitions, exports, report components, original tests and deployment configuration against retained SHA-256 values. It also checks unchanged input/conversion/calculation/export handlers, chart data generation and comparison data mapping. No calculator was added or removed.

## Accessibility and zoom scope

axe-core/playwright 4.14.0 ran the WCAG 2 A/AA, 2.1 AA and 2.2 AA tag sets on the homepage, scientific basis and seven representative workspaces in both languages and both viewport projects: **36 scans with no reported violations**.

Some complex rendered notation/graphics require manual color-contrast review; axe's `color-contrast` incomplete records are retained in the JSON. The primary text, supporting text, links, buttons, result ink, control borders and darker amber graph marks have separately calculated contrast ratios. Focus order, skip navigation, stage buttons, grouped navigation, invalid-field focus, local equation scrolling and reduced-motion behavior have browser interaction checks. The hidden export report is inert. This is an automated audit with targeted visual/keyboard review, not a complete WCAG conformance certification or a screen-reader user study.

The 200% tests use CDP device metrics to halve the CSS viewport and double DPR. They exercise the same reflow space as desktop browser zoom at 200%, verify effective width/DPR, check clipping and calculate results. They do not operate Chrome's native zoom menu. No Firefox, Safari or physical-device tests were performed.

## Repeat locally

```bash
npm ci
npm test
npm run check
npm run verify:preservation
npm run build
npx playwright install --with-deps chromium
npm run test:e2e
```

Build before browser tests. Playwright starts a production preview at `http://127.0.0.1:4173/AnilineProduction-Lab/` with two workers. Raw browser results and downloads are temporary and excluded from the archive.

For a preinstalled compatible Chromium, set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` to the binary. This environment used Chromium 153 from a separate temporary runtime through that override. The runtime and its executable are not application dependencies and are excluded from the ZIP.

The preserved GitHub Actions workflow was not executed remotely, and no public Pages deployment was performed. Local production-subpath loading and build output were verified.
