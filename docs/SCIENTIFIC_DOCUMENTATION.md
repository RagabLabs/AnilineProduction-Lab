# Scientific documentation

## Provenance and scope

Primary teaching reference: *Aniline Production (Nitration and Reduction)*, Associate Prof. Dr. Ghada Kadry, supplied as a 45-slide PPTX. All slide text and rendered diagrams were reviewed. The source deck remains outside the delivered application.

| Lecture material | Location | Application use |
| --- | --- | --- |
| Benzene nitration and nitrobenzene reduction | 2, 18, 39 | Balanced net reactions |
| Acid dilution, sulfuric acid and water | 11–17 | Composition and water balances; no fitted kinetics |
| Mixed acid, DVS and acid ratio | 19 | Explicit basis and discrepancy notes |
| Settling, extraction, washing and losses | 28–38 | User-specified component splits and recoveries |
| Catalytic hydrogenation and recycle | 39–45 | Stoichiometry and a declared steady-state recycle model |
| Equipment and operating descriptions | 21–27, 40–45 | Conceptual context, not equipment-sizing or operating recommendations |
| Egypt market and capacity claims | 3–9 | Not imported into calculations or treated as current verified market data |

## Atomic basis and precision

CIAAW abridged central values: H 1.008, C 12.011, N 14.007, O 15.999, S 32.06. All formula masses are computed from this same set rather than copied as independently rounded values. These are conventional average molecular masses, not isotopologue exact masses.

| Species | Formula | kg/kmol (= g/mol numerically) |
| --- | --- | ---: |
| Benzene | C6H6 | 78.114 |
| Nitric acid | HNO3 | 63.012 |
| Sulfuric acid | H2SO4 | 98.072 |
| Water | H2O | 18.015 |
| Nitrobenzene | C6H5NO2 | 123.111 |
| Hydrogen | H2 | 2.016 |
| Aniline | C6H7N | 93.129 |
| Cyclohexylamine | C6H13N | 99.177 |
| Nitrogen | N2 | 28.014 |

Some NIST WebBook molecular masses differ slightly because of their underlying atomic-weight values/rounding. NIST is used as an independent formula/identity check, not mixed into the engine's atomic basis. Internal arithmetic uses JavaScript double precision; display rounding never feeds back into the chemistry. Small floating-point closure errors are reported with a numerical tolerance, not interpreted as physical losses.

## Common stoichiometric engine

Nitration: `B + N → NB + W`.

Selective hydrogenation: `NB + 3 H2 → AN + 2 W`.

Declared overhydrogenation branch: `NB + 6 H2 → CHA + 2 W`.

All three conserve C, H, N and O. H2SO4 remains a nonreacting component in the net balances. The model does not imply that sulfuric acid is absent from the chemistry or unaffected by dilution.

Conversion in calculators 01/06/09/10/20 is based on inlet benzene. Hydrogenation conversion is based on inlet nitrobenzene to that stage. Requested extents are checked against available co-reactant; the engine rejects shortages instead of silently clipping conversion.

## Selectivity model

Calculators 17 and 20 support aniline selectivity `s` on a mol/mol consumed-NB basis. For extent `e`, `nAN = s e`, `nCHA = (1−s)e`, `nH2,cons = (6−3s)e`, `nW = 2e`. The existence of overhydrogenation to CHA is supported by primary literature. Restricting all non-aniline conversion to CHA is an explicit educational simplification introduced by this application, not a claim made by the lecture, a fitted product distribution or an exhaustive industrial reaction network.

## DVS ambiguity

Slide 19 prints a sulfuric-acid/water-produced ratio and reports 3.52 for a 60/32/8 H2SO4/HNO3/H2O mixture. If the entire 32 kg HNO3 reacts, reaction water is `32 × 18.015 / 63.012 = 9.1487335746 kg`.

- Literal reaction-water-only ratio: `60 / 9.1487335746 = 6.5582847627`.
- Conventional final-water DVS: `60 / (8 + 9.1487335746) = 3.4988006397`.

The lecture's 3.52 is neither used as a constant nor forced by altering stoichiometry. Both definitions are displayed; the final-water convention is supported separately by the Beilstein reference. With no water in the relevant denominator, the ratio is undefined. The displayed H2SO4/water composition excludes residual HNO3.

## Recycle and external boundaries

Calculator 19 assumes a dry recycle gas, nonreacting N2 impurity, fixed selective NB conversion, user-set H2 excess, an H2 recovery fraction before a common gas purge, and complete retention of N2 in that gas before the purge. Unrecovered H2 leaves a separate separator-loss stream. With total reactor H2 feed `T` and consumption `C`, `U=T−C`, `R=(1−p)rU`, `F=T−R`. Nitrogen satisfies `Ireactor=FN2/p` when `p>0`. Fresh inerts without purge are rejected because no finite steady state exists. At zero fresh inerts and zero purge the selected initial inert inventory is zero.

Calculator 20 is once-through. Recovered NB transfers internally between stages; all unrecovered NB and AN remain explicit external loss streams. Its global ledger counts only external inputs/outputs, avoiding double-counting intermediate product.

## Sensitivity charts

Each chart varies one actual calculator input across 51 points while retaining the committed values of all other inputs. It calls the same validated engine for each point. Infeasible points are gaps, not guessed results. Hover values and the scenario slider use calculated values. The slider is exploratory and does not overwrite the committed calculation.

## Export semantics

CSV and clipboard output include committed inputs, units, outputs, steps, assumptions and sources. Exports are disabled after an input edit until recalculation. The selected batch/hour basis is explicit throughout the report. PDF uses locally rendered report blocks to preserve Arabic, equations and source text; chart PNG is a separate image export. Export does not require a network service.
