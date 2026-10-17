import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { bi, type Calculator, type CalcResult, type Lang } from '../engine';
import { resultUnit } from '../engine/format';
import { valueLabel } from '../data/strings';
export function ProductComparison({spec,result,lang,basis}:{spec:Calculator;result:CalcResult;lang:Lang;basis:'batch'|'hour'}){
 const keys=spec.id===5?['nbTheoretical','nbActual','loss']:['anTheoretical','anActual','loss'];
 const data=keys.map(key=>({label:spec.metrics.find(m=>m.key===key)!.label[lang],value:Number(result.values[key])}));
 const colors=['#28332D','#50663B','#A56E25'];const unit=resultUnit('kg',basis);
 return <section className="panel product-comparison" data-testid="yield-comparison"><h3>{bi('Theoretical & isolated product','المنتج النظري والمعزول')[lang]}</h3><div dir="ltr" style={{height:260,width:'100%'}}><ResponsiveContainer width="100%" height="100%"><BarChart data={data} margin={{left:5,right:16,top:10,bottom:15}}><CartesianGrid vertical={false} stroke="#dce1d4"/><XAxis dataKey="label" axisLine={false} tickLine={false} tick={{fontSize:16,fill:'#4d5c48'}} interval={0} height={65} tickFormatter={(_,i)=>bi(['Theoretical','Actual pure','Shortfall'][i],['النظري','النقي الفعلي','الفارق'][i])[lang]}/><YAxis axisLine={false} tickLine={false} width={60} tick={{fontSize:16}} tickFormatter={v=>valueLabel(v,lang)}/><Tooltip formatter={v=>[valueLabel(Number(v),lang)+' '+unit,bi('Product mass','كتلة المنتج')[lang]]} contentStyle={{borderRadius:10,fontSize:16}}/><Bar dataKey="value" maxBarSize={70} radius={[5,5,0,0]} isAnimationActive={false}>{data.map((d,i)=><Cell key={d.label} fill={colors[i]}/>)}</Bar></BarChart></ResponsiveContainer></div><p className="small-copy" dir="ltr">{unit}</p></section>;
}
