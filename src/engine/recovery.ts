import { type CalcResult, type Values } from './types';
import { balance, feed, fmt, fraction, mass, number, requireAtMost, requirePositive, st, stream } from './chemistry';
export function calc12(v:Values):CalcResult {
  const initial=feed(v,'nitrobenzene','NB').pure,recovered=feed(v,'recovered','NB').pure;
  requirePositive(initial,'nitrobenzene');requireAtMost(recovered,initial,'recoveryAbove','recovered');
  const lost=Math.max(0,initial-recovered),eff=100*recovered/initial;
  return {values:{recovered,lost,efficiency:eff,lossPercent:100-eff},steps:[st('Put both streams on a pure-product mass basis','توحيد التيارين على أساس كتلة المنتج النقي',`m_{in}=${fmt(initial)},\\quad m_{rec}=${fmt(recovered)}\\;\\mathrm{kg}`),st('Evaluate the recovered fraction','حساب الجزء المسترجع',`\\eta=100\\frac{m_{rec}}{m_{in}}=${fmt(eff)}\\%`),st('Close the product balance','إغلاق ميزان المنتج',`m_{loss}=m_{in}-m_{rec}=${fmt(lost)}\\;\\mathrm{kg}`)],balance:balance([stream('Available nitrobenzene','النيتروبنزين المتاح',initial,'in'),stream('Recovered nitrobenzene','النيتروبنزين المسترجع',recovered,'out'),stream('Nitrobenzene in loss stream','النيتروبنزين في تيار الفقد',lost,'out')])};
}
export function calc13(v:Values):CalcResult {
  const defs=[['nitrobenzene','C₆H₅NO₂','nbRecovery'],['benzene','C₆H₆','bRecovery'],['nitric','HNO₃','nCarry'],['sulfuric','H₂SO₄','sCarry'],['feedWater','H₂O','wCarry']];
  const components=defs.map(([key,component,split])=>{const m=mass(v,key);return {component,feed:m,organic:m*fraction(v,split),aqueous:m*(1-fraction(v,split))};});
  const feedMass=components.reduce((a,c)=>a+c.feed,0),organicMass=components.reduce((a,c)=>a+c.organic,0),aqueousMass=components.reduce((a,c)=>a+c.aqueous,0);
  requirePositive(feedMass,'nitrobenzene');
  return {values:{feedMass,organicMass,aqueousMass,recovered:components[0].organic,lost:components[0].aqueous,efficiency:components[0].feed>0?100*components[0].organic/components[0].feed:null},components,
    steps:[st('Specify component mass splits into the organic phase','تحديد جزء كل مكوّن المنتقل إلى الطور العضوي',String.raw`m_{i,org}=f_i\,m_{i,feed}`),st('Send each remainder to the acid phase','توجيه باقي كل مكوّن إلى الطور الحمضي',String.raw`m_{i,aq}=(1-f_i)m_{i,feed}`),st('Sum each outlet phase','جمع مكونات كل طور خارج',`m_{org}=${fmt(organicMass)},\\quad m_{aq}=${fmt(aqueousMass)}\\;\\mathrm{kg}`),st('Check each component and the overall split','فحص ميزان كل مكوّن والميزان الكلي',`m_{feed}-m_{org}-m_{aq}=${fmt(feedMass-organicMass-aqueousMass)}\\;\\mathrm{kg}`)],balance:balance([stream('Two-phase feed','التغذية ذات الطورين',feedMass,'in'),stream('Organic phase','الطور العضوي',organicMass,'out'),stream('Acid phase','الطور الحمضي',aqueousMass,'out')])};
}
export function calc14(v:Values):CalcResult {
  const input=feed(v,'nitrobenzene','NB').pure,r=fraction(v,'preRecovery'),l=fraction(v,'washLoss'),n=number(v,'stages');
  const before=input*r,after=before*Math.pow(1-l,n),washRecovery=100*Math.pow(1-l,n);
  return {values:{beforeWash:before,afterWash:after,loss:Math.max(0,before-after),sepLoss:input-before,washRecovery,overallRecovery:r*washRecovery},steps:[st('Apply the upstream separation recovery','تطبيق استرجاع الفصل السابق',`m_{wash,in}=m_0\\eta_{sep}=${fmt(before)}\\;\\mathrm{kg}`),st('Apply identical fractional loss at each wash','تطبيق الفقد النسبي نفسه في كل غسلة',`m_{wash,out}=m_{wash,in}(1-f)^{N}=${fmt(after)}\\;\\mathrm{kg}`),st('Calculate wash-only and overall recovery','حساب استرجاع الغسيل والاسترجاع الكلي',`\\eta_{wash}=100(1-f)^N=${fmt(washRecovery)}\\%,\\quad\\eta_{overall}=${fmt(r*washRecovery)}\\%`),st('Account for all product leaving in loss streams','حساب المنتج الخارج في جميع تيارات الفقد',`m_0=m_{wash,out}+m_{wash,loss}+m_{sep,loss}`)],balance:balance([stream('Nitrobenzene before separation','النيتروبنزين قبل الفصل',input,'in'),stream('Final washed nitrobenzene','النيتروبنزين المغسول النهائي',after,'out'),stream('Wash loss','فقد الغسيل',before-after,'out'),stream('Separation loss','فقد الفصل',input-before,'out')])};
}
export const recoveryCalculators:Record<number,(v:Values)=>CalcResult>={12:calc12,13:calc13,14:calc14};
