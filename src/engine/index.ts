import { getCalculator } from '../data/calculators';
import { ScienceError, type CalcResult, type Values } from './types';
import { nitrationCalculators } from './nitration';
import { acidCalculators } from './acids';
import { recoveryCalculators } from './recovery';
import { hydrogenationCalculators } from './hydrogenation';
import { calc20 } from './integrated';
const engines:Record<number,(v:Values)=>CalcResult>={...nitrationCalculators,...acidCalculators,...recoveryCalculators,...hydrogenationCalculators,20:calc20};
export function calculate(id:number,v:Values):CalcResult {
  const spec=getCalculator(id);
  for(const f of spec.fields){
    const a=v[f.key];
    if(f.kind==='select') { if(!f.options?.some(o=>o.value===a)) throw new ScienceError('choice',f.key);continue; }
    if(typeof a!=='number'||!Number.isFinite(a))throw new ScienceError('finite',f.key);
    if(a<0)throw new ScienceError('nonnegative',f.key);
    if(a>1e12)throw new ScienceError('tooLarge',f.key);
    if(f.positive&&a<=0)throw new ScienceError('positive',f.key);
    if(f.min!==undefined&&a<f.min||f.max!==undefined&&a>f.max)throw new ScienceError(f.kind==='percent'?'percent':'range',f.key);
    if(f.integer&&!Number.isInteger(a))throw new ScienceError('integer',f.key);
    if(f.kind==='mass'||f.kind==='quantity'){
      const units=f.kind==='mass'?['kg','g','t']:['kg','g','t','mol','kmol'];
      if(!units.includes(String(v[f.key+'Unit']??'kg')))throw new ScienceError('unit',f.key);
    }
  }
  const result=engines[id](v);
  if(Object.values(result.values).some(x=>typeof x==='number'&&!Number.isFinite(x)))throw new ScienceError('overflow');
  if(result.balance && (!Number.isFinite(result.balance.input)||!Number.isFinite(result.balance.output)))throw new ScienceError('overflow');
  return result;
}
export * from './types';
export * from './chemistry';
