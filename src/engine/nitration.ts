import { bi, type CalcResult, type Values } from './types';
import { MW, balance, feed, fmt, fraction, nitration, requireAtMost, requirePositive, st, stream } from './chemistry';

function limiter(b:number,n:number) {
  if(b===0 && n===0) return 'none';
  if(Math.abs(b-n)<=1e-10*Math.max(b,n)) return 'stoichiometric';
  return b<n?'benzene':'nitric';
}
export function calc01(v:Values):CalcResult {
  const b=feed(v,'benzene','B','bp'),n=feed(v,'nitric','N','np'),x=fraction(v,'x');
  const r=nitration(b.n,n.n,x);const theoretical=Math.min(b.n,n.n);
  return {values:{limiter:limiter(b.n,n.n),nbTheoretical:theoretical*MW.NB,nbActual:r.nb*MW.NB,nbKmol:r.nb,water:r.water*MW.W,bRemaining:r.bLeft*MW.B,nRemaining:r.nLeft*MW.N,bConsumed:r.extent*MW.B,nConsumed:r.extent*MW.N,inert:b.inert+n.inert},
    steps:[st('Convert the pure feeds to kmol','تحويل التغذيات النقية إلى كيلومول',`n_B=${fmt(b.n)},\\quad n_N=${fmt(n.n)}\\;\\mathrm{kmol}`),
      st('Maximum stoichiometric extent','أقصى امتداد ستوكيومتري',`\\xi_{max}=\\min(n_B,n_N)=${fmt(theoretical)}\\;\\mathrm{kmol}`),
      st('Benzene-based conversion','التحويل على أساس البنزين',`\\xi=n_B X_B=${fmt(b.n)}\\times${fmt(x)}=${fmt(r.extent)}\\;\\mathrm{kmol}`),
      st('Product and reaction water','المنتج وماء التفاعل',`m_{NB}=\\xi M_{NB}=${fmt(r.nb*MW.NB)}\\;\\mathrm{kg},\\quad m_W=${fmt(r.water*MW.W)}\\;\\mathrm{kg}`)],
    balance:balance([stream('Benzene feed','تغذية البنزين',b.total,'in'),stream('Nitric feed','تغذية حمض النيتريك',n.total,'in'),stream('Nitrobenzene','النيتروبنزين',r.nb*MW.NB,'out'),stream('Reaction water','ماء التفاعل',r.water*MW.W,'out'),stream('Unreacted benzene','البنزين غير المتفاعل',r.bLeft*MW.B,'out'),stream('Unreacted HNO₃','حمض النيتريك غير المتفاعل',r.nLeft*MW.N,'out'),stream('Feed impurities','شوائب التغذية',b.inert+n.inert,'out')]) };
}
export function calc02(v:Values):CalcResult {
  const b=feed(v,'benzene','B','bp'),n=feed(v,'nitric','N','np');
  const lim=limiter(b.n,n.n),e=Math.min(b.n,n.n);
  const excess=lim==='benzene'?'nitric':lim==='nitric'?'benzene':lim;
  const excessPercent=e>0?100*(Math.max(b.n,n.n)/e-1):null;
  return {values:{limiter:lim,excessSpecies:excess,excessPercent,nbTheoretical:e*MW.NB,requiredNitric:b.n*MW.N,requiredBenzene:n.n*MW.B,bRemaining:(b.n-e)*MW.B,nRemaining:(n.n-e)*MW.N},
    steps:[st('Use the balanced 1:1 molar ratio','استخدام النسبة المولية الموزونة 1:1',`n_B=${fmt(b.n)},\\quad n_N=${fmt(n.n)}`),st('Determine the limiting extent','تحديد امتداد المتفاعل المحدِّد',`\\xi=\\min(n_B,n_N)=${fmt(e)}\\;\\mathrm{kmol}`),st('Calculate stoichiometric requirements','حساب الاحتياجات الستوكيومترية',`m_{N,req}=n_B M_N=${fmt(b.n*MW.N)}\\;\\mathrm{kg}`),st('Excess is relative to the limiting feed','الفائض نسبة إلى تغذية المتفاعل المحدِّد',e>0?`E=100\\left(\\frac{\\max(n_B,n_N)}{\\min(n_B,n_N)}-1\\right)=${fmt(excessPercent!)}\\%`:'E=\\frac{\\max(n_B,n_N)-0}{0}')],
    balance:calc01({...v,x: b.n>0?100*e/b.n:0}).balance};
}
export function calc03(v:Values):CalcResult {
  const b=feed(v,'benzene','B').n,out=feed(v,'benzeneOut','B').n;
  requirePositive(b,'benzene'); requireAtMost(out,b,'outGreater','benzeneOut');
  const e=Math.max(0,b-out),x=100*e/b;
  return {values:{x,bConsumed:e*MW.B,bRemaining:out*MW.B,nbActual:e*MW.NB,nbKmol:e},
    steps:[st('Normalize inlet and outlet','توحيد وحدات الدخول والخروج',`n_{B,in}=${fmt(b)},\\quad n_{B,out}=${fmt(out)}\\;\\mathrm{kmol}`),st('Find the consumed benzene','حساب البنزين المستهلك',`\\Delta n_B=n_{B,in}-n_{B,out}=${fmt(e)}\\;\\mathrm{kmol}`),st('Evaluate conversion','حساب التحويل',`X_B=100\\frac{\\Delta n_B}{n_{B,in}}=${fmt(x)}\\%`),st('Apply 1:1 product stoichiometry','تطبيق ستوكيومترية المنتج 1:1',`m_{NB}=\\Delta n_B M_{NB}=${fmt(e*MW.NB)}\\;\\mathrm{kg}`)]};
}
export function calc04(v:Values):CalcResult {
  const b=feed(v,'benzene','B','bp');
  return {values:{nbTheoretical:b.n*MW.NB,nbKmol:b.n,massRatio:MW.NB/MW.B,requiredBenzene:b.pure,grossBenzene:b.total,requiredNitric:b.n*MW.N},
    steps:[st('Correct benzene feed for mass purity','تصحيح تغذية البنزين بالنقاوة الكتلية',`n_B=${fmt(b.n)}\\;\\mathrm{kmol}`),st('Assume complete conversion and sufficient HNO₃','افتراض تحويل كامل وتوافر حمض النيتريك',`n_{NB,theory}=n_B=${fmt(b.n)}\\;\\mathrm{kmol}`),st('Convert product amount to mass','تحويل كمية المنتج إلى كتلة',`m_{NB,theory}=n_B M_{NB}=${fmt(b.n*MW.NB)}\\;\\mathrm{kg}`),st('Obtain the stoichiometric mass ratio','حساب النسبة الكتلية الستوكيومترية',`\\frac{m_{NB}}{m_{B,pure}}=\\frac{${fmt(MW.NB)}}{${fmt(MW.B)}}=${fmt(MW.NB/MW.B)}`)]};
}
export function calc05(v:Values):CalcResult {
  const theory=feed(v,'theoretical','NB').pure,actual=feed(v,'actual','NB','productPurity').pure;
  requirePositive(theory,'theoretical');requireAtMost(actual,theory,'yieldAbove','actual');
  const y=100*actual/theory;
  return {values:{nbActual:actual,nbTheoretical:theory,yield:y,loss:Math.max(0,theory-actual)},steps:[st('Specify the independent theoretical product','تحديد كمية المنتج النظرية المستقلة',`m_{theory}=${fmt(theory)}\\;\\mathrm{kg}`),st('Correct the isolated product for purity','تصحيح المنتج المعزول بالنقاوة',`m_{actual,pure}=${fmt(actual)}\\;\\mathrm{kg}`),st('Evaluate isolated yield','حساب مردود العزل',`Y=100\\frac{m_{actual,pure}}{m_{theory}}=${fmt(y)}\\%`),st('Quantify the theoretical shortfall','حساب الفارق عن المردود النظري',`\\Delta m=m_{theory}-m_{actual,pure}=${fmt(Math.max(0,theory-actual))}\\;\\mathrm{kg}`)]};
}
export const nitrationCalculators:Record<number,(v:Values)=>CalcResult>={1:calc01,2:calc02,3:calc03,4:calc04,5:calc05};
