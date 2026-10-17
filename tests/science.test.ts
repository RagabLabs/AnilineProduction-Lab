import { describe, expect, it } from 'vitest';
import { CALCULATORS, example, getCalculator } from '../src/data/calculators';
import { ATOMIC, ATOMS, MW, REACTIONS, calculate, fromKmol, toKmol, type CalcResult, type Values } from '../src/engine';
const run=(id:number,v:Values={})=>calculate(id,{...example(getCalculator(id)),...v});
function num(r:CalcResult,key:string,value:number){expect(r.values[key],key).toBeCloseTo(value,8);}
function closed(r:CalcResult){expect(r.balance).toBeDefined();expect(r.balance!.output).toBeCloseTo(r.balance!.input,8);}
function equivalent(a:CalcResult,b:CalcResult){for(const key of Object.keys(a.values)){const x=a.values[key],y=b.values[key];if(typeof x==='number')expect(y,key).toBeCloseTo(x,8);else expect(y,key).toBe(x);}}
const oneB={benzene:1,benzeneUnit:'kmol',bp:100};
const oneNB={nitrobenzene:1,nitrobenzeneUnit:'kmol'};
const acids={...oneB,x:100,nitricSolution:63.012,nConc:100,sulfuricSolution:98.072,sConc:100,addedWater:10};
const integrated={...oneB,nitric:1,nitricUnit:'kmol',hydrogen:3,hydrogenUnit:'kmol',x:100,nbRecovery:100,xh:100,selectivity:100,finalRecovery:100,sulfuric:0,feedWater:0};
// Oracles below use independently specified stoichiometric quantities and
// hard-coded molecular masses. They do not call implementation helpers to
// compute expected reaction products.
describe('01 · Benzene nitration stoichiometry',()=>{
 it('1 kmol B + 2 kmol HNO₃ produces 123.111 kg NB and 18.015 kg water',()=>{const r=run(1,{...oneB,nitric:2,nitricUnit:'kmol',x:100});num(r,'nbActual',123.111);num(r,'water',18.015);num(r,'nRemaining',63.012);closed(r);});
 it('zero conversion retains both reactants',()=>{const r=run(1,{...oneB,nitric:1,nitricUnit:'kmol',x:0});num(r,'nbActual',0);num(r,'bRemaining',78.114);closed(r);});
 it('rejects requested conversion above the nitric-acid limit',()=>expect(()=>run(1,{...oneB,nitric:.5,nitricUnit:'kmol',x:60})).toThrow('acidShortage'));
 it('50 wt% feed retains the inert half of the mass',()=>{const r=run(1,{benzene:78.114,bp:50,nitric:63.012,x:100});num(r,'nbActual',61.5555);num(r,'inert',39.057);closed(r);});
 it('gross kg and g feeds give the same result',()=>equivalent(run(1,{benzene:78.114}),run(1,{benzene:78114,benzeneUnit:'g'})));
});
describe('02 · Limiting reactant',()=>{
 it('1:1.25 feeds give 25% HNO₃ excess',()=>{const r=run(2,{...oneB,nitric:1.25,nitricUnit:'kmol'});expect(r.values.limiter).toBe('benzene');num(r,'excessPercent',25);num(r,'nRemaining',15.753);closed(r);});
 it('zero limiting feed makes excess percentage undefined',()=>{const r=run(2,{...oneB,nitric:0});expect(r.values.excessPercent).toBeNull();expect(r.values.limiter).toBe('nitric');num(r,'nbTheoretical',0);});
 it('rejects purity greater than 100%',()=>expect(()=>run(2,{np:101})).toThrow('percent'));
 it('fractional mole feeds give an independently calculated 60% excess',()=>{const r=run(2,{...oneB,benzene:.25,nitric:.4,nitricUnit:'kmol'});num(r,'excessPercent',60);num(r,'requiredNitric',15.753);});
 it('kg and mol feeds preserve the limiting species and product',()=>equivalent(run(2,{benzene:78.114,nitric:63.012}),run(2,{benzene:1000,benzeneUnit:'mol',nitric:1000,nitricUnit:'mol'})));
});
describe('03 · Benzene conversion',()=>{
 it('1 kmol inlet and 0.25 kmol outlet give 75% conversion',()=>{const r=run(3,{...oneB,benzeneOut:.25,benzeneOutUnit:'kmol'});num(r,'x',75);num(r,'nbActual',92.33325);});
 it('zero inlet has no defined conversion',()=>expect(()=>run(3,{benzene:0,benzeneOut:0})).toThrow('positive'));
 it('rejects outlet exceeding inlet',()=>expect(()=>run(3,{benzene:10,benzeneOut:11})).toThrow('outGreater'));
 it('1.25 to 0.875 kmol gives 30% conversion',()=>{const r=run(3,{benzene:1.25,benzeneUnit:'kmol',benzeneOut:.875,benzeneOutUnit:'kmol'});num(r,'x',30);num(r,'nbActual',46.166625);});
 it('independent inlet and outlet unit conversions agree',()=>equivalent(run(3,{benzene:78.114,benzeneOut:15.6228}),run(3,{benzene:1,benzeneUnit:'kmol',benzeneOut:200,benzeneOutUnit:'mol'})));
});
describe('04 · Nitrobenzene theoretical yield',()=>{
 it('one kmol benzene gives one kmol theoretical nitrobenzene',()=>{const r=run(4,oneB);num(r,'nbTheoretical',123.111);num(r,'nbKmol',1);num(r,'requiredNitric',63.012);});
 it('zero feed gives zero product',()=>num(run(4,{benzene:0}),'nbTheoretical',0));
 it('rejects negative purity',()=>expect(()=>run(4,{bp:-1})).toThrow('nonnegative'));
 it('8 kg pure B in a 10 kg sample gives the correct fractional yield',()=>num(run(4,{benzene:10,bp:80}),'nbTheoretical',8*123.111/78.114));
 it('tonnes and kg are equivalent',()=>equivalent(run(4,{benzene:125}),run(4,{benzene:.125,benzeneUnit:'t'})));
});
describe('05 · Nitrobenzene actual yield',()=>{
 it('80 kg at 75% purity is 60 kg product against a 100 kg theory',()=>{const r=run(5,{theoretical:100,actual:80,productPurity:75});num(r,'nbActual',60);num(r,'yield',60);num(r,'loss',40);});
 it('zero isolated product gives zero yield',()=>num(run(5,{actual:0}),'yield',0));
 it('rejects a pure yield above 100%',()=>expect(()=>run(5,{theoretical:100,actual:101,productPurity:100})).toThrow('yieldAbove'));
 it('decimal amounts retain the purity correction',()=>{const r=run(5,{theoretical:12.5,actual:10.8,productPurity:80});num(r,'nbActual',8.64);num(r,'yield',69.12);});
 it('product units may be independently changed',()=>equivalent(run(5,{theoretical:100,actual:80,productPurity:100}),run(5,{theoretical:100000,theoreticalUnit:'g',actual:.08,actualUnit:'t',productPurity:100})));
});
describe('06 · Nitric acid requirement',()=>{
 it('one kmol B with 20% excess needs 126.024 kg of 60 wt% acid',()=>{const r=run(6,{...oneB,x:100,excess:20,nConc:60});num(r,'requiredNitric',63.012);num(r,'pureN',75.6144);num(r,'commercialAcid',126.024);num(r,'feedWater',50.4096);closed(r);});
 it('zero conversion has no acid requirement',()=>num(run(6,{x:0}),'commercialAcid',0));
 it('rejects zero commercial concentration',()=>expect(()=>run(6,{nConc:0})).toThrow('positive'));
 it('fractional converted feed and 10% excess give 27.72528 kg solution',()=>num(run(6,{...oneB,benzene:.25,x:80,excess:10,nConc:50}),'commercialAcid',27.72528));
 it('kg and kmol benzene inputs agree',()=>equivalent(run(6,{benzene:78.114}),run(6,oneB)));
});
describe('07 · Mixed acid composition',()=>{
 it('reconstructs the 60/32/8 lecture mass composition',()=>{const r=run(7);num(r,'totalMixture',100);num(r,'nFraction',32);num(r,'sFraction',60);num(r,'wFraction',8);closed(r);});
 it('rejects an empty mixture denominator',()=>expect(()=>run(7,{nitricSolution:0,sulfuricSolution:0,addedWater:0})).toThrow('positive'));
 it('rejects concentration above 100%',()=>expect(()=>run(7,{sConc:101})).toThrow('percent'));
 it('decimal solution masses conserve 45 kg and 6.5 kg water',()=>{const r=run(7,{nitricSolution:12.5,nConc:68,sulfuricSolution:31.25,sConc:96,addedWater:1.25});num(r,'totalMixture',45);num(r,'feedWater',6.5);closed(r);});
 it('each solution mass can use g independently',()=>equivalent(run(7),run(7,{nitricSolution:40000,nitricSolutionUnit:'g',sulfuricSolution:60000,sulfuricSolutionUnit:'g'})));
});
describe('08 · Acid-to-benzene ratio',()=>{
 it('uses full mixture mass but only selected HNO₃ molecules',()=>{const r=run(8,{...oneB,mixedAcid:100,acidBasis:'nitric'});num(r,'acidRatio',100/78.114);num(r,'molarRatio',32/63.012);});
 it('zero acid gives zero ratios',()=>{const r=run(8,{mixedAcid:0});num(r,'acidRatio',0);num(r,'molarRatio',0);});
 it('rejects component fractions totaling more than 100%',()=>expect(()=>run(8,{nFraction:80,sFraction:30})).toThrow('composition'));
 it('sulfuric-only molar denominator is correctly defined',()=>num(run(8,{...oneB,benzene:.5,mixedAcid:50,nFraction:40,sFraction:50,acidBasis:'sulfuric'}),'molarRatio',50/98.072));
 it('mixture mass and feed quantity support distinct unit conversions',()=>equivalent(run(8,{...oneB,mixedAcid:100}),run(8,{benzene:78114,benzeneUnit:'g',mixedAcid:.1,mixedAcidUnit:'t'})));
});
describe('09 · Water formation & accumulation',()=>{
 it('one kmol nitration adds 18.015 kg water to 10 kg inlet water',()=>{const r=run(9,acids);num(r,'water',18.015);num(r,'totalWater',28.015);num(r,'spentAcid',126.087);closed(r);});
 it('zero conversion leaves only the initial water',()=>{const r=run(9,{...acids,x:0});num(r,'water',0);num(r,'totalWater',10);closed(r);});
 it('rejects water production demanding unavailable nitric acid',()=>expect(()=>run(9,{...acids,nitricSolution:1})).toThrow('acidShortage'));
 it('0.125 kmol extent gives 2.251875 kg new water',()=>num(run(9,{...acids,benzene:.5,x:25}),'water',2.251875));
 it('mixed mass and mole unit bases agree',()=>equivalent(run(9,acids),run(9,{...acids,benzene:78.114,benzeneUnit:'kg',nitricSolution:63012,nitricSolutionUnit:'g'})));
});
describe('10 · Spent acid composition',()=>{
 it('1.5 kmol acid minus 1 kmol reacted retains 31.506 kg HNO₃',()=>{const r=run(10,{...acids,nitricSolution:94.518});num(r,'nRemaining',31.506);num(r,'pureS',98.072);num(r,'spentAcid',157.593);closed(r);});
 it('zero conversion conserves all acid feed',()=>{const r=run(10,{...acids,x:0});num(r,'nRemaining',63.012);closed(r);});
 it('rejects a nonphysical acid concentration',()=>expect(()=>run(10,{nConc:100.01})).toThrow('percent'));
 it('fractional extent changes acid and water by different molar masses',()=>{const r=run(10,{...acids,nitricSolution:94.518,benzene:.25,x:60});num(r,'nRemaining',85.0662);num(r,'totalWater',12.70225);closed(r);});
 it('tonne solution masses retain composition',()=>equivalent(run(10,acids),run(10,{...acids,sulfuricSolution:.098072,sulfuricSolutionUnit:'t'})));
});
describe('11 · Dehydration value',()=>{
 it('distinguishes conventional and literal lecture water denominators',()=>{const r=run(11);num(r,'dvsTotal',3.4988006396588487);num(r,'dvsReaction',6.5582847626977525);expect(r.values.dvsTotal).not.toBe(3.52);closed(r);});
 it('zero reaction and initial water produces undefined ratios',()=>{const r=run(11,{nitricConsumed:0,feedWater:0});expect(r.values.dvs).toBeNull();expect(r.values.dvsReaction).toBeNull();});
 it('rejects negative initial water',()=>expect(()=>run(11,{feedWater:-1})).toThrow('nonnegative'));
 it('decimal molar acid consumption gives the independently calculated water',()=>{const r=run(11,{sulfuric:12.5,nitricConsumed:.25,nitricConsumedUnit:'kmol',feedWater:1.25});num(r,'water',4.50375);num(r,'dvs',12.5/5.75375);});
 it('molar and mass consumed-HNO₃ inputs agree and can select the literal convention',()=>equivalent(run(11,{nitricConsumed:63.012,dvsBasis:'reaction'}),run(11,{nitricConsumed:1,nitricConsumedUnit:'kmol',dvsBasis:'reaction'})));
});
describe('12 · Nitrobenzene recovery',()=>{
 it('80 kg recovered from 100 kg closes at 80%',()=>{const r=run(12,{nitrobenzene:100,recovered:80});num(r,'efficiency',80);num(r,'lost',20);closed(r);});
 it('zero recovered product means 100% recovery loss',()=>num(run(12,{recovered:0}),'lossPercent',100));
 it('rejects recovered mass above available mass',()=>expect(()=>run(12,{nitrobenzene:100,recovered:101})).toThrow('recoveryAbove'));
 it('12.5 kg input and 10.25 kg recovery give 82%',()=>{const r=run(12,{nitrobenzene:12.5,recovered:10.25});num(r,'efficiency',82);num(r,'lost',2.25);});
 it('recovered and available amounts support independent units',()=>equivalent(run(12,{nitrobenzene:123.111,recovered:61.5555}),run(12,{...oneNB,recovered:500,recoveredUnit:'mol'})));
});
describe('13 · Liquid separation splitter',()=>{
 const v={nitrobenzene:100,benzene:10,nitric:2,sulfuric:50,feedWater:20,nbRecovery:90,bRecovery:100,nCarry:10,sCarry:2,wCarry:5};
 it('specified component splits give 102.2 kg organic and 79.8 kg aqueous',()=>{const r=run(13,v);num(r,'organicMass',102.2);num(r,'aqueousMass',79.8);r.components!.forEach(c=>expect(c.organic+c.aqueous).toBeCloseTo(c.feed,10));closed(r);});
 it('all zero organic splits send every component to aqueous',()=>{const r=run(13,{...v,nbRecovery:0,bRecovery:0,nCarry:0,sCarry:0,wCarry:0});num(r,'organicMass',0);num(r,'aqueousMass',182);closed(r);});
 it('rejects a split over 100%',()=>expect(()=>run(13,{nbRecovery:101})).toThrow('percent'));
 it('decimal component splits retain independent closure',()=>{const r=run(13,{nitrobenzene:12.5,benzene:.5,nitric:.25,sulfuric:1.75,feedWater:2.5,nbRecovery:80,bRecovery:50,nCarry:20,sCarry:10,wCarry:10});num(r,'organicMass',10.725);num(r,'aqueousMass',6.775);closed(r);});
 it('all component masses can be supplied in grams',()=>{const g:Values={...v};for(const key of ['nitrobenzene','benzene','nitric','sulfuric','feedWater']){g[key]=Number(g[key])*1000;g[key+'Unit']='g';}equivalent(run(13,v),run(13,g));});
});
describe('14 · Repeated washing loss',()=>{
 it('two 10% losses after 80% separation recover 64.8 kg of 100 kg',()=>{const r=run(14,{nitrobenzene:100,preRecovery:80,washLoss:10,stages:2});num(r,'afterWash',64.8);num(r,'washRecovery',81);num(r,'loss',15.2);closed(r);});
 it('zero stages retain the complete pre-wash product',()=>{const r=run(14,{nitrobenzene:100,preRecovery:80,washLoss:100,stages:0});num(r,'afterWash',80);num(r,'washRecovery',100);});
 it('rejects fractional stages',()=>expect(()=>run(14,{stages:2.5})).toThrow('integer'));
 it('small decimal fractional losses multiply rather than add',()=>num(run(14,{nitrobenzene:12.5,preRecovery:98,washLoss:1.25,stages:3}),'afterWash',12.25*Math.pow(.9875,3)));
 it('kg and kmol product quantities are equivalent',()=>equivalent(run(14,{nitrobenzene:123.111}),run(14,oneNB)));
});
describe('15 · Nitrobenzene hydrogenation',()=>{
 it('one kmol NB consumes 3 kmol H₂ and produces 93.129 kg aniline',()=>{const r=run(15,{...oneNB,hydrogen:4,hydrogenUnit:'kmol',xh:100});num(r,'anActual',93.129);num(r,'water',36.03);num(r,'hydrogenConsumed',6.048);num(r,'hRemaining',2.016);closed(r);});
 it('zero conversion keeps hydrogen and nitrobenzene unreacted',()=>{const r=run(15,{...oneNB,hydrogen:3,hydrogenUnit:'kmol',xh:0});num(r,'anActual',0);num(r,'nbRemaining',123.111);closed(r);});
 it('rejects H₂ short of the 3:1 requirement',()=>expect(()=>run(15,{...oneNB,hydrogen:2,hydrogenUnit:'kmol',xh:100})).toThrow('hydrogenShortage'));
 it('fractional kmol conversion gives 18.6258 kg aniline',()=>{const r=run(15,{...oneNB,nitrobenzene:.25,hydrogen:1,hydrogenUnit:'kmol',xh:80});num(r,'anActual',18.6258);num(r,'water',7.206);closed(r);});
 it('independent hydrogen and NB quantity units give identical results',()=>equivalent(run(15,{...oneNB,hydrogen:3,hydrogenUnit:'kmol'}),run(15,{nitrobenzene:123.111,hydrogen:6048,hydrogenUnit:'g'})));
});
describe('16 · Hydrogen requirement',()=>{
 it('one kmol aniline with 20% H₂ excess requires a 3.6 kmol feed',()=>{const r=run(16,{anilineTarget:1,anilineTargetUnit:'kmol',excess:20});num(r,'hydrogenMass',6.048);num(r,'totalHydrogenKmol',3.6);num(r,'totalHydrogenMass',7.2576);});
 it('zero aniline target gives zero H₂ demand',()=>num(run(16,{anilineTarget:0}),'hydrogenMass',0));
 it('rejects a negative excess',()=>expect(()=>run(16,{excess:-1})).toThrow('nonnegative'));
 it('0.125 kmol target needs 0.756 kg stoichiometric hydrogen',()=>{const r=run(16,{anilineTarget:.125,anilineTargetUnit:'kmol',excess:50});num(r,'hydrogenMass',.756);num(r,'totalHydrogenKmol',.5625);});
 it('target kg and mol are equivalent',()=>equivalent(run(16,{anilineTarget:93.129}),run(16,{anilineTarget:1000,anilineTargetUnit:'mol'})));
});
describe('17 · Reduction conversion and selectivity',()=>{
 it('80% conversion with 75% selectivity gives 0.6 kmol AN and 0.2 kmol CHA',()=>{const r=run(17,{...oneNB,nbOut:.2,nbOutUnit:'kmol',selectivity:75});num(r,'xh',80);num(r,'anActual',55.8774);num(r,'cha',19.8354);num(r,'hydrogenConsumed',6.048);closed(r);});
 it('equal inlet and outlet gives zero conversion',()=>{const r=run(17,{...oneNB,nbOut:1,nbOutUnit:'kmol'});num(r,'xh',0);num(r,'anActual',0);closed(r);});
 it('rejects outlet above inlet',()=>expect(()=>run(17,{nitrobenzene:10,nbOut:11})).toThrow('outGreater'));
 it('decimal two-branch products conserve mass and require 1.575 kmol H₂',()=>{const r=run(17,{...oneNB,nitrobenzene:.5,nbOut:.125,nbOutUnit:'kmol',selectivity:60});num(r,'anActual',20.954025);num(r,'hydrogenConsumed',3.1752);closed(r);});
 it('pure mass and molar inlet/outlet units are equivalent',()=>equivalent(run(17,{nitrobenzene:123.111,nbOut:24.6222}),run(17,{...oneNB,nbOut:200,nbOutUnit:'mol'})));
});
describe('18 · Aniline yield',()=>{
 it('46.5645 kg isolated AN from one kmol NB is a 50% yield',()=>{const r=run(18,{...oneNB,actualAniline:46.5645,productPurity:100});num(r,'yield',50);num(r,'anTheoretical',93.129);});
 it('zero isolated aniline gives zero yield',()=>num(run(18,{actualAniline:0}),'yield',0));
 it('rejects aniline above the stoichiometric maximum',()=>expect(()=>run(18,{...oneNB,actualAniline:100,productPurity:100})).toThrow('yieldAbove'));
 it('purity-corrected decimal sample gives 18 kg actual aniline',()=>{const r=run(18,{...oneNB,nitrobenzene:.25,actualAniline:20,productPurity:90});num(r,'anActual',18);num(r,'yield',1800/23.28225);});
 it('grams and tonnes preserve the isolated yield',()=>equivalent(run(18,{nitrobenzene:123.111,actualAniline:80,productPurity:100}),run(18,{nitrobenzene:123111,nitrobenzeneUnit:'g',actualAniline:.08,actualAnilineUnit:'t',productPurity:100})));
});
describe('19 · Hydrogen recycle with inerts',()=>{
 const v={...oneNB,xh:100,hExcess:100,hRecovery:100,purge:10,hPurity:90};
 it('fresh H₂ replaces 3 kmol consumption plus 0.3 kmol purge',()=>{const r=run(19,v);num(r,'freshHydrogen',3.3);num(r,'recycledHydrogen',2.7);num(r,'purgeHydrogen',.3);num(r,'inertFresh',11/30);num(r,'inertPurge',11/30);closed(r);});
 it('pure fresh H₂ allows zero purge and zero selected inert inventory',()=>{const r=run(19,{...v,hPurity:100,purge:0});num(r,'freshHydrogen',3);num(r,'recycledHydrogen',3);num(r,'inertRecycle',0);closed(r);});
 it('no purge with fresh N₂ has no finite steady state',()=>expect(()=>run(19,{...v,purge:0,hPurity:99})).toThrow('noSteadyState'));
 it('separator recovery and purge are separate outlet losses',()=>{const r=run(19,{...oneNB,nitrobenzene:.25,xh:80,hExcess:50,hRecovery:80,purge:25,hPurity:100});num(r,'freshHydrogen',.72);num(r,'recycledHydrogen',.18);num(r,'purgeHydrogen',.06);num(r,'separatorHydrogenLoss',.06);closed(r);});
 it('NB molar and mass feeds preserve H₂ component flows',()=>equivalent(run(19,v),run(19,{...v,nitrobenzene:123.111,nitrobenzeneUnit:'kg'})));
});
describe('20 · Integrated process',()=>{
 it('one kmol benzene yields 93.129 kg AN plus 54.045 kg water at full recovery',()=>{const r=run(20,integrated);num(r,'anActual',93.129);num(r,'water',54.045);num(r,'overallYield',100);num(r,'massInput',147.174);closed(r);});
 it('zero NB recovery sends all intermediate product to its loss stream',()=>{const r=run(20,{...integrated,nbRecovery:0});num(r,'anActual',0);num(r,'nbSeparationLoss',123.111);num(r,'hRemaining',6.048);closed(r);});
 it('rejects infeasible hydrogen supply rather than creating product',()=>expect(()=>run(20,{...integrated,hydrogen:0})).toThrow('hydrogenShortage'));
 it('fractional conversion, both recoveries and selectivity yield 8% on inlet B',()=>{const r=run(20,{...integrated,benzene:.5,nitric:.5,x:80,nbRecovery:50,xh:50,selectivity:50,finalRecovery:80});num(r,'anActual',3.72516);num(r,'overallYield',8);num(r,'water',10.809);num(r,'cha',4.95885);closed(r);});
 it('all three feed units can change without double-counting intermediate NB',()=>equivalent(run(20,integrated),run(20,{...integrated,benzene:78.114,benzeneUnit:'kg',nitric:63012,nitricUnit:'g',hydrogen:3000,hydrogenUnit:'mol'})));
});
describe('All calculator contracts',()=>{
 for(const spec of CALCULATORS)it(`${String(spec.id).padStart(2,'0')} default example exposes every requested metric and a full solution`,()=>{const r=run(spec.id);expect(r.steps.length).toBeGreaterThanOrEqual(3);for(const metric of spec.metrics){expect(r.values).toHaveProperty(metric.key);if(typeof r.values[metric.key]==='number')expect(Number.isFinite(r.values[metric.key])).toBe(true);}if(r.balance)closed(r);});
});
describe('Stoichiometric conservation and unit utilities',()=>{
 for(const [name,reaction] of Object.entries(REACTIONS))it(`${name} conserves every atom and therefore mass`,()=>{for(const element of Object.keys(ATOMIC)){let delta=0;for(const [species,coefficient] of Object.entries(reaction)){delta+=coefficient*Number((ATOMS[species as keyof typeof ATOMS] as Record<string,number>)[element]??0);}expect(delta,element).toBe(0);}expect(Object.entries(reaction).reduce((a,[s,k])=>a+k*MW[s as keyof typeof MW],0)).toBeCloseTo(0,10);});
 for(const unit of ['g','kg','t','mol','kmol'] as const)it(`round trips ${unit} through kmol without loss of quantity`,()=>{const amount=fromKmol(.125,unit,'NB');expect(toKmol(amount,unit,'NB')).toBeCloseTo(.125,12);});
 it('rejects unsupported quantity units',()=>expect(()=>run(1,{benzeneUnit:'litre'})).toThrow('unit'));
 it('rejects NaN before scientific arithmetic',()=>expect(()=>run(20,{benzene:NaN})).toThrow('finite'));
 it('rejects Infinity before scientific arithmetic',()=>expect(()=>run(19,{purge:Infinity})).toThrow('finite'));
 for(let i=1;i<=25;i++)it(`integrated conservation across losses and two product branches, sample ${i}`,()=>{const r=run(20,{...integrated,benzene:.3+i*.073,nitric:3,hydrogen:20,x:(i*13)%101,xh:(i*17)%101,nbRecovery:(i*19)%101,selectivity:(i*23)%101,finalRecovery:(i*29)%101,sulfuric:i*.625,feedWater:i*.125});closed(r);expect(Number(r.values.overallYield)).toBeLessThanOrEqual(100);expect(Number(r.values.anActual)).toBeLessThanOrEqual(Number(r.values.anGenerated)+1e-9);});
});
