# Calculator equations

Amounts below are kmol and masses kg; under hourly basis use kmol/h and kg/h throughout. `M_i` is a formula mass; percentages entered in the interface are divided by 100 for formulas. `B,N,S,W,NB,H,AN,CHA` identify benzene, HNO3, H2SO4, water, nitrobenzene, H2, aniline and cyclohexylamine. Fractions x, s, r and p range from 0 to 1 unless stated otherwise.

| No. | Main equations and denominator basis |
| --- | --- |
| 01 | `e=nB xB`; require `e≤nN`; `eMax=min(nB,nN)`; `mNB=e MNB`; `mW=e MW`; remaining feeds retain their species and feed impurities remain inert. |
| 02 | `e=min(nB,nN)`; excess `% = 100[max(nB,nN)/e−1]` when `e>0`; stoichiometric HNO3 for all B is `nB MN`; stoichiometric B for all HNO3 is `nN MB`. |
| 03 | `xB=(nB,in−nB,out)/nB,in`; `nNB=nB,in−nB,out`. The NB inference assumes selective mononitration. |
| 04 | With sufficient HNO3, `nNB,theory=nB,pure`; `mNB/mB,pure=MNB/MB`. |
| 05 | `Y=mNB,actual,pure/mNB,theory`; shortfall `mTheory−mActual`. The theoretical input is independently specified. |
| 06 | `mN,st=nB xB MN`; `mN,feed=mN,st(1+E)`; `mSolution=mN,feed/wN`; `mW,feed=mSolution−mN,feed`. E may exceed 1. |
| 07 | `mN=mN,solution wN`; `mS=mS,solution wS`; `mW=mN,solution(1−wN)+mS,solution(1−wS)+mW,added`; `wi=mi/Σmi`. |
| 08 | `Rm=mMixedAcid/mB,pure`; `Rn=nSelectedAcid/nB`; selected acid may be HNO3, H2SO4 or the sum of their molecular amounts. This is not proton equivalence. |
| 09 | `e=nB xB≤nN`; `mW,rxn=e MW`; `mW,final=mW,feed+mW,rxn`; final water fraction uses the spent-acid aqueous mass denominator. |
| 10 | `mN,left=mN,in−e MN`; `mSpent=mN,left+mS+mW,final`; spent-acid fractions are each component mass divided by mSpent. |
| 11 | `DVS,literal=mS/mW,rxn`; `DVS,spent=mS/(mW,feed+mW,rxn)`; `mW,rxn=nN,cons MW`. Zero denominator gives undefined. |
| 12 | `η=mNB,recovered/mNB,available`; `mLost=mAvailable−mRecovered`. |
| 13 | Each component: `mi,organic=fi mi,feed`; `mi,aqueous=(1−fi)mi,feed`. Each fi is a user-supplied split. |
| 14 | `mBeforeWash=m0 ηSep`; `mAfterWash=mBeforeWash(1−fWash)^N`; `ηOverall=ηSep(1−fWash)^N`; N is an integer from 0 to 20. |
| 15 | `e=nNB xNB`; require `3e≤nH`; `nAN=e`; `nW=2e`; unreacted `nNB−e`, `nH−3e`. |
| 16 | `nH,st=3 nAN,target`; `mH,st=3nAN MH`; `nH,feed=nH,st(1+E)`; demand per kg AN `3MH/MAN`. |
| 17 | `e=nNB,in−nNB,out`; `x=e/nNB,in`; `nAN=s e`; `nCHA=(1−s)e`; required `nH=(6−3s)e`; `nW=2e`. |
| 18 | `mAN,theory=nNB,in MAN`; `Y=mAN,isolated,pure/mAN,theory`; sufficient H2 and fully selective conversion define the theoretical benchmark. |
| 19 | `C=3nNB x`; `T=C(1+E)`; `U=T−C`; `R=(1−p)rU`; `PH=prU`; `LH=(1−r)U`; `FH=T−R=C+PH+LH`; `FN2=FH(1−y)/y`; `I=FN2/p`; `PN2=pI=FN2`; `RN2=(1−p)I`; H2 recycle ratio `R/FH`. |
| 20 | `e1=nB x1`; `nNB,stage2=e1 rNB`; `e2=e1 rNB x2`; `nAN,formed=s e2`; `nAN,isolated=s e2 rAN`; `nCHA=(1−s)e2`; `nH,cons=(6−3s)e2`; `nW,rxn=e1+2e2`; `YB=nAN,isolated/nB,in=x1 rNB x2 s rAN`. |

## Purity and unit semantics

For a mass-unit input with purity `p`, pure amount is `n=mGross p/M`. For a molar-unit input, entered moles are pure species; gross mass is inferred as `mGross=nM/p`. The inactive mass is `mGross−nM`. This definition keeps w/w purity distinct from mole fraction. A positive pure molar amount at zero purity is rejected. Unit switching in the UI preserves the physical amount with this correction.

Gas fresh-feed purity in calculator 19 is a **mole fraction**, explicitly labeled and distinct from the mass purities elsewhere.

## Balance closure

For reported physical ledgers, `error=ΣmExternal,out−ΣmExternal,in`. A recovery loss is an outlet, not vanishing mass. Chemical consumption moves atoms between species rather than removing mass. Calculator 06's ledger is the commercial-acid component decomposition; calculator 11's ledger is the water component balance; neither purports to be a full nitrator ledger. Calculators 03, 04, 05, 08, 16 and 18 do not display a physical ledger from insufficiently specified external streams.
