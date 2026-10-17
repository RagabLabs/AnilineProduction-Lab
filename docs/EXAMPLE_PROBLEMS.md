# Worked examples

All values here use the application's atomic-weight basis and a batch basis. The same numeric examples can be interpreted consistently as hourly flow rates by selecting hourly basis; no batch duration is inferred.

## 1. Selective nitration from one kmol benzene

Calculator 01: benzene 1 kmol, HNO3 2 kmol, both mass purities 100%, benzene conversion 100%.

- Limiting reactant: benzene.
- Nitrobenzene: 1 kmol = 123.111 kg.
- Reaction water: 1 kmol = 18.015 kg.
- HNO3 remaining: 1 kmol = 63.012 kg.
- Mass input: 78.114 + 126.024 = 204.138 kg.
- Mass output: 123.111 + 18.015 + 63.012 = 204.138 kg.

## 2. Commercial nitric acid requirement

Calculator 06: benzene 1 kmol, conversion 100%, HNO3 excess 20%, commercial concentration 60 wt%.

- Stoichiometric HNO3 consumed: 63.012 kg.
- Pure HNO3 charged: 75.6144 kg.
- Commercial solution: 126.024 kg.
- Inlet water: 50.4096 kg.
- HNO3 not consumed: 12.6024 kg.

Excess is on the stoichiometric consumed-acid basis, not a claim that all charged acid reacts.

## 3. Lecture mixed-acid composition and DVS

Calculator 07's example: 40 kg of 80 wt% HNO3 solution, 60 kg of 100 wt% H2SO4, no extra water. This is a mathematical composition example, not a mixing instruction.

The resulting 100 kg mixture contains 32 kg HNO3, 60 kg H2SO4 and 8 kg water. In calculator 11, assume all 32 kg pure HNO3 is consumed. Reaction water is about 9.1487336 kg. Total-water DVS is 3.4988006; the literal reaction-water-only ratio is 6.5582848. The lecture's listed 3.52 is not forced into the model.

## 4. Repeated wash loss

Calculator 14: 100 kg NB before separation, 80% separation recovery, two washes with 10% product loss in each wash.

- Before washing: 80 kg.
- After washing: `80 × 0.9² = 64.8 kg`.
- Wash loss: 15.2 kg.
- Separation loss: 20 kg.
- Overall recovery: 64.8%.
- Product ledger: 100 = 64.8 + 15.2 + 20 kg.

## 5. Hydrogen recycle with nitrogen impurity

Calculator 19: NB 1 kmol, conversion 100%, reactor H2 excess 100%, separator H2 recovery 100%, purge 10%, fresh gas 90 mol% H2.

- H2 consumed C = 3 kmol.
- Reactor H2 feed T = 6 kmol.
- Unreacted H2 U = 3 kmol.
- Recycled H2 R = 2.7 kmol.
- H2 purge = 0.3 kmol.
- Fresh H2 = 3.3 kmol.
- Fresh N2 = N2 purge = 0.3666667 kmol.
- Reactor-inlet N2 = 3.6666667 kmol.

Setting purge to zero with this nonzero fresh N2 input correctly produces an error; a finite steady state cannot close.

## 6. Fully selective integrated process

Calculator 20: benzene 1 kmol, pure HNO3 1 kmol, H2 3 kmol, both stage conversions 100%, both recoveries 100%, aniline selectivity 100%, no H2SO4/water spectators.

- Isolated aniline: 93.129 kg.
- Water: 54.045 kg across both reactions.
- Overall benzene-feed molar yield: 100%.
- Mass input = mass output = 147.174 kg.

## 7. Integrated selectivity and recovery losses

Calculator 20: B 0.5 kmol, HNO3 0.5 kmol, H2 3 kmol, nitration conversion 80%, NB recovery 50%, hydrogenation conversion 50%, aniline selectivity 50%, aniline recovery 80%, no spectators.

- Stage-one NB formed: 0.4 kmol.
- NB to stage two: 0.2 kmol; NB separation loss: 0.2 kmol.
- NB converted in stage two: 0.1 kmol; NB left: 0.1 kmol.
- AN formed: 0.05 kmol; CHA modeled: 0.05 kmol.
- AN isolated: 0.04 kmol = 3.72516 kg; AN recovery loss: 0.01 kmol.
- Overall yield: 8% of inlet benzene moles.
- H2 consumed: 0.45 kmol; total reaction water: 0.6 kmol = 10.809 kg.

All unreacted species and losses remain in the global mass balance.
