import { ScienceError, type CalcResult, type Values } from './types';
import { MW, balance, feed, fmt, fraction, mass, nitration, number, requirePositive, st, stream } from './chemistry';
export function calc06(v:Values):CalcResult {
  const b=feed(v,'benzene','B','bp'),x=fraction(v,'x'),c=fraction(v,'nConc'),ex=fraction(v,'excess');requirePositive(c,'nConc');
  const stoich=b.n*x*MW.N,charged=stoich*(1+ex),solution=charged/c,w=solution-charged;
  return {values:{requiredNitric:stoich,pureN:charged,commercialAcid:solution,feedWater:w,excessPercent:ex*100,nRemaining:charged-stoich},steps:[st('Base consumption on benzene converted','حساب الاستهلاك من البنزين المتحوّل',`n_{N,st}=n_B X_B=${fmt(b.n*x)}\\;\\mathrm{kmol}`),st('Add the specified excess','إضافة الفائض المحدد',`m_{N,feed}=m_{N,st}(1+E)=${fmt(charged)}\\;\\mathrm{kg}`),st('Correct for commercial acid strength','التصحيح بتركيز الحمض التجاري',`m_{solution}=\\frac{m_{N,feed}}{w_N}=${fmt(solution)}\\;\\mathrm{kg}`),st('Account for solution water','حساب ماء المحلول',`m_{W,feed}=m_{solution}-m_{N,feed}=${fmt(w)}\\;\\mathrm{kg}`)],balance:balance([stream('Commercial HNO₃ solution','محلول حمض النيتريك التجاري',solution,'in'),stream('Pure HNO₃ charged','حمض النيتريك النقي المغذّى',charged,'out'),stream('Solution water','ماء المحلول',w,'out')])};
}
export function mixed(v:Values) {
  const ns=mass(v,'nitricSolution'),ss=mass(v,'sulfuricSolution'),added=mass(v,'addedWater');
  const n=ns*fraction(v,'nConc'),s=ss*fraction(v,'sConc');
  return { n,s,w:ns-n+ss-s+added,total:ns+ss+added,ns,ss,added };
}
export function calc07(v:Values):CalcResult {
  const m=mixed(v);requirePositive(m.total,'nitricSolution');
  return {values:{pureN:m.n,pureS:m.s,feedWater:m.w,totalAcid:m.n+m.s,totalMixture:m.total,nFraction:100*m.n/m.total,sFraction:100*m.s/m.total,wFraction:100*m.w/m.total},steps:[st('Resolve each binary aqueous feed','تحليل كل تغذية مائية ثنائية',`m_N=${fmt(m.n)},\\quad m_S=${fmt(m.s)}\\;\\mathrm{kg}`),st('Sum water from both solutions and makeup','جمع ماء المحلولين والماء المضاف',`m_W=m_{N,sol}(1-w_N)+m_{S,sol}(1-w_S)+m_{W,add}=${fmt(m.w)}\\;\\mathrm{kg}`),st('Compute mixture mass','حساب كتلة الخليط',`m_T=m_N+m_S+m_W=${fmt(m.total)}\\;\\mathrm{kg}`),st('Normalize each component','حساب الكسر الكتلي لكل مكوّن',`w_i=\\frac{m_i}{m_T},\\qquad \\sum_i w_i=1`)],balance:balance([stream('HNO₃ solution','محلول حمض النيتريك',m.ns,'in'),stream('H₂SO₄ solution','محلول حمض الكبريتيك',m.ss,'in'),stream('Added water','الماء المضاف',m.added,'in'),stream('HNO₃','حمض النيتريك',m.n,'out'),stream('H₂SO₄','حمض الكبريتيك',m.s,'out'),stream('Water','الماء',m.w,'out')])};
}
export function calc08(v:Values):CalcResult {
  const b=feed(v,'benzene','B','bp');requirePositive(b.n,'benzene');
  const mix=mass(v,'mixedAcid'),nf=fraction(v,'nFraction'),sf=fraction(v,'sFraction');
  if(nf+sf>1+1e-12) throw new ScienceError('composition','nFraction');
  const basis=String(v.acidBasis),moles=basis==='nitric'?mix*nf/MW.N:basis==='sulfuric'?mix*sf/MW.S:mix*nf/MW.N+mix*sf/MW.S;
  const ratio=mix/b.pure;
  return {values:{acidRatio:ratio,molarRatio:moles/b.n,totalAcid:mix,ratioDifference:ratio-number(v,'referenceRatio'),acidBasis:basis},steps:[st('Use pure benzene as denominator','استخدام البنزين النقي في المقام',`m_B=${fmt(b.pure)}\\;\\mathrm{kg},\\quad n_B=${fmt(b.n)}\\;\\mathrm{kmol}`),st('Compute the mixture-to-benzene mass ratio','حساب النسبة الكتلية للخليط إلى البنزين',`R_m=\\frac{m_{mixed\\ acid}}{m_{B,pure}}=${fmt(ratio)}`),st('Sum only the selected acid species','جمع مولات الأنواع الحمضية المختارة فقط',`n_{acid,selected}=${fmt(moles)}\\;\\mathrm{kmol}`),st('Calculate the explicitly defined molar ratio','حساب النسبة المولية ذات الأساس المحدد',`R_n=\\frac{n_{acid,selected}}{n_B}=${fmt(moles/b.n)}`)]};
}
export function acidReaction(v:Values):CalcResult {
  const m=mixed(v),b=feed(v,'benzene','B'),r=nitration(b.n,m.n/MW.N,fraction(v,'x'));
  const water=r.water*MW.W,totalWater=m.w+water,nRemain=r.nLeft*MW.N,spent=nRemain+m.s+totalWater;
  requirePositive(spent,'nitricSolution');
  return {values:{water,feedWater:m.w,totalWater,waterFraction:100*totalWater/spent,nRemaining:nRemain,pureS:m.s,spentAcid:spent,nFraction:100*nRemain/spent,sFraction:100*m.s/spent,wFraction:100*totalWater/spent},steps:[st('Resolve acid feed components','حساب مكونات تغذية الأحماض',`m_{N,in}=${fmt(m.n)},\\quad m_S=${fmt(m.s)},\\quad m_{W,in}=${fmt(m.w)}\\;\\mathrm{kg}`),st('Set the reaction extent from benzene conversion','تحديد امتداد التفاعل من تحويل البنزين',`\\xi=n_B X_B=${fmt(r.extent)}\\;\\mathrm{kmol}`),st('Calculate generated and total water','حساب ماء التفاعل والماء الكلي',`m_{W,rxn}=\\xi M_W=${fmt(water)},\\quad m_{W,total}=${fmt(totalWater)}\\;\\mathrm{kg}`),st('Define the spent-acid mass basis','تحديد الأساس الكتلي للحمض المستهلك',`m_{spent}=m_{N,in}-\\xi M_N+m_S+m_{W,total}=${fmt(spent)}\\;\\mathrm{kg}`),st('Normalize on the aqueous acid phase','حساب الكسور على أساس الطور الحمضي المائي',`w_{W,spent}=100\\frac{m_{W,total}}{m_{spent}}=${fmt(100*totalWater/spent)}\\%`)],balance:balance([stream('Benzene','البنزين',b.total,'in'),stream('Nitric solution','محلول النيتريك',m.ns,'in'),stream('Sulfuric solution','محلول الكبريتيك',m.ss,'in'),stream('Added water','الماء المضاف',m.added,'in'),stream('Organic nitrobenzene','النيتروبنزين العضوي',r.nb*MW.NB,'out'),stream('Remaining benzene','البنزين المتبقي',r.bLeft*MW.B,'out'),stream('Remaining HNO₃ in spent acid','حمض النيتريك المتبقي في الطور الحمضي',nRemain,'out'),stream('H₂SO₄ in spent acid','حمض الكبريتيك في الطور الحمضي',m.s,'out'),stream('Water in spent acid','الماء في الطور الحمضي',totalWater,'out')])};
}
export function calc11(v:Values):CalcResult {
  const s=mass(v,'sulfuric'),n=feed(v,'nitricConsumed','N'),fw=mass(v,'feedWater');
  const rw=n.n*MW.W,tw=fw+rw;const literal=rw>0?s/rw:null,conventional=tw>0?s/tw:null;
  const denominator=v.dvsBasis==='reaction'?rw:tw;
  const total=s+tw;
  return {values:{dvs:denominator>0?s/denominator:null,dvsReaction:literal,dvsTotal:conventional,water:rw,feedWater:fw,totalWater:tw,sFraction:total>0?100*s/total:null,wFraction:total>0?100*tw/total:null},steps:[st('Use HNO₃ consumed, not acid solution charged','استخدام حمض النيتريك المستهلك لا كتلة محلوله',`n_{N,cons}=${fmt(n.n)}\\;\\mathrm{kmol}`),st('Compute reaction water using the 1:1 ratio','حساب ماء التفاعل بالنسبة المولية 1:1',`m_{W,rxn}=n_{N,cons}M_W=${fmt(rw)}\\;\\mathrm{kg}`),st('Include inlet water for the spent-water convention','إضافة ماء التغذية لتعريف ماء الحمض النهائي',`m_{W,total}=m_{W,in}+m_{W,rxn}=${fmt(tw)}\\;\\mathrm{kg}`),st('Keep the two definitions distinct','الفصل بين التعريفين',String.raw`DVS_{literal}=\frac{m_S}{m_{W,rxn}},\qquad DVS_{spent}=\frac{m_S}{m_{W,in}+m_{W,rxn}}`)],balance:balance([stream('Inlet water','ماء التغذية',fw,'in'),stream('Reaction water generated','ماء التفاعل المتولد',rw,'in'),stream('Final water inventory','الماء النهائي',tw,'out')])};
}
export const acidCalculators:Record<number,(v:Values)=>CalcResult>={6:calc06,7:calc07,8:calc08,9:acidReaction,10:acidReaction,11:calc11};
