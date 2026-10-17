# Assumptions and limitations

- One consistent material/time basis is required. Batch values are amounts; hourly values are rates. Switching the basis does not convert between a batch duration and hourly production because no batch time is entered.
- Mass units denote gross feed where a mass-purity field exists. Mole units denote the named pure species; gross mass is inferred using the stated mass purity. Solution-water amounts are calculated only where acid solutions are explicitly modeled.
- Concentrations, conversions, selectivities, splits and recovery fractions are provided by the user. No kinetic coefficients, experimental data, optimal acid ratios, equilibrium compositions or catalyst performance are fabricated.
- Nitration is selective benzene mononitration. HNO3 demand is one mole per mole benzene converted; water formation is one mole per mole converted. Net H2SO4 consumption is zero.
- Requested conversion is rejected if its co-reactant requirement exceeds the available pure feed. The app never creates product by silently ignoring an acid or hydrogen shortage.
- The conventional DVS and literal lecture denominator are kept separate. The slide's numerical discrepancy is documented, and no numerical factor is introduced to reproduce 3.52.
- Spent-acid calculations place all acid components and water in the aqueous phase and exclude organics from the acid composition denominator. Evaporation, mutual solubility and acid transfer are neglected there. The separate liquid splitter accepts explicit entrainment fractions.
- The liquid splitter is not a liquid–liquid equilibrium model. Its independently supplied split fractions determine phase allocation. It cannot predict decanter size, residence time, phase densities or a distribution coefficient.
- Repeated washing assumes identical fractional product loss per stage. It does not calculate the wash-water demand, acid neutralization, pH, solubility or effluent treatment.
- Selective hydrogenation consumes three moles H2 per mole aniline. Calculators 17 and 20 use a declared two-product AN/CHA model when aniline selectivity is below 100%. CHA formation consumes six moles H2 per mole NB in that branch. Real additional byproducts are excluded.
- The recycle model assumes steady state and nitrogen as the only fresh-gas impurity. N2 is fully retained in the dry gas before a common purge. H2 not recovered by the separator leaves a specified loss stream. No purge with a positive fresh inert input has no finite steady state. Zero fresh inerts and zero purge use a selected zero initial inert inventory.
- The integrated model is once-through, with no internal recycle. It uses pure reactant inputs and separate H2SO4 and inlet water amounts. Intermediate NB is not counted again as external feed. All separation/product losses remain in explicit external streams.
- Yield denominators are stated separately: calculators 05 and 18 use theoretical product; calculator 20 uses inlet benzene moles. Yield, conversion and selectivity cannot be interchanged.
- Gas volume, compressor power, heat duty, heat release, pressure drop, reactor sizing, runaway behavior and plant safety design are outside scope.

The calculations support university learning. They do not validate a plant design, an operating recipe or a catalyst selection.
