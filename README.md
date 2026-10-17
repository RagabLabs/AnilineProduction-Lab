# AnilineProduction Lab — RagabLabs

**Benzene Nitration & Aniline Synthesis · UI v2.0.0**

A working bilingual browser laboratory with 20 independent calculators for benzene nitration, mixed acids, nitrobenzene separation, hydrogenation, hydrogen recycle and the integrated benzene-to-aniline process. Arabic RTL and English LTR, IBM Plex Sans Arabic/Inter fonts and KaTeX are bundled locally. No account, API key or calculation server is required.

## Organic Synthesis Atelier

The existing laboratory now uses an editorial research index, an interactive benzene-to-aniline reaction notebook, original molecular SVGs and a Synthesis Research Workspace with larger inputs and primary results. All 20 calculators and the scientific engine are retained.

Read the [UI redesign changelog](UI-REDESIGN-CHANGELOG.md), [design system](docs/DESIGN_SYSTEM.md) and [scientific preservation manifest](docs/UI-SCIENTIFIC-PRESERVATION.json).

## التشغيل السريع

1. ثبّت Node.js 24، ثم افتح مجلد المشروع في الطرفية.
2. نفّذ `npm ci` ثم `npm run dev` وافتح العنوان الذي يظهر، مع المسار `/AnilineProduction-Lab/`.
3. اختر الحاسبة، ثم «تحميل مثال» أو أدخل بياناتك واضغط «احسب النتائج».
4. اختر أساس الدفعة أو التدفقات بالساعة. جميع الكميات تستخدم الأساس نفسه؛ تبديل الأساس لا يغيّر الأرقام تلقائيًا.
5. استخدم نسخ النتائج، CSV، PDF أو PNG للرسم. إذا تغيّرت المدخلات يجب إعادة الحساب قبل التصدير.

للنشر: اتبع [تعليمات النشر](docs/DEPLOYMENT.md). الرابط التالي **متوقع بعد أن تنشر المشروع** ولم يُنشر خلال هذا التسليم:

`https://ragablabs.github.io/AnilineProduction-Lab/`

## Local development

```bash
npm ci
npm run dev
```

Open the URL Vite prints, with `/AnilineProduction-Lab/`. Production:

```bash
npm run build
npm run preview
```

Do not open `dist/index.html` with `file://`; the repository base path needs an HTTP server. The included `dist/` is a verified production build, and the source plus lockfile can reproduce it.

## Verification

```bash
npm test
npm run check
npm run verify:preservation
npm run build
npx playwright install --with-deps chromium
npm run test:e2e
```

The scientific suite retains 156 original cases and adds 1170 exact before/after preservation comparisons. It includes at least five dedicated cases for every calculator plus default-example, unit and atom/mass-conservation checks. Browser tests cover every calculator in both languages on desktop and mobile, export downloads, language persistence, input validation, reset, unit conversion and the GitHub Pages subpath. See [test instructions and recorded results](docs/TESTING.md) for the exact executed results and browser environment.

## The 20 calculators

| Module | Calculators |
| --- | --- |
| Benzene nitration | 01 Stoichiometry; 02 Limiting reactant; 03 Conversion; 04 Theoretical yield; 05 Actual yield |
| Mixed acids | 06 HNO₃ requirement; 07 Composition; 08 Acid/benzene ratio; 09 Water formation; 10 Spent acid |
| Separation and recovery | 11 DVS; 12 Recovery efficiency; 13 Liquid splitter; 14 Washing loss |
| Aniline synthesis | 15 Hydrogenation stoichiometry; 16 H₂ requirement; 17 Conversion/selectivity; 18 Aniline yield; 19 H₂ recycle |
| Integrated process | 20 Benzene → nitrobenzene → aniline |

## Scientific basis

The supplied 45-slide lecture by Associate Prof. Dr. Ghada Kadry is the educational process reference. It is attributed but not redistributed. Molecular masses use a single CIAAW abridged-atomic-weight basis, which conserves mass across balanced reactions. Additional sources and model extensions are identified separately.

Two details are deliberately visible:

- Slide 19's DVS denominator and listed numerical example are not fully consistent. Both the literal reaction-water ratio and conventional total-water DVS are shown, with the discrepancy documented.
- Selectivity below 100% uses an explicit balanced cyclohexylamine branch. This is a declared two-product teaching model, not a prediction of all real industrial byproducts.

Read [scientific documentation](docs/SCIENTIFIC_DOCUMENTATION.md), [calculator equations](docs/CALCULATOR_EQUATIONS.md), [assumptions](docs/ASSUMPTIONS.md), [references](docs/REFERENCES.md) and [worked examples](docs/EXAMPLE_PROBLEMS.md).

## Project structure

- `src/engine/`: pure TypeScript chemistry, common stoichiometry, units and five calculation groups.
- `src/data/`: complete bilingual calculator definitions and interface strings.
- `src/components/`: input workbench, SVG molecules, charts, ledgers and export reports.
- `tests/science.test.ts`: independent scientific reference and conservation cases.
- `tests/browser/`: unchanged original Playwright suite plus responsive, accessibility, keyboard, print-layout and zoom-equivalent checks.
- `tests/fixtures/ui-v1-scientific-baseline.json`: outputs captured from v1 before the redesign.
- `scripts/verify-scientific-preservation.mjs`: reproducible hashes for the original engine, exports, tests, deployment files and calculation fragments.
- `docs/`: scientific basis, references, examples, deployment and executed validation.
- `.github/workflows/pages.yml`: test, build and deploy to Pages.
- `dist/`: production assets, including fonts; no runtime CDN dependency.

React, TypeScript, Vite, Tailwind CSS, Recharts, KaTeX, Lucide, Vitest and Playwright are used. PDF and PNG export modules are loaded only when requested. PDF pages contain rendered text/equations to preserve Arabic shaping; that PDF content is image-based rather than selectable text. CSV contains full numerical output and provenance.

The UI version is 2.0.0. Export routines and their original v1.0.0 report-format identifier remain unchanged.

The application is for university education and material-balance exploration. It does not certify plant design, operating conditions or reactor performance. Code is MIT-licensed; see [LICENSE](LICENSE) and [third-party notices](THIRD_PARTY_NOTICES.md).
