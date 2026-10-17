import { bi, ScienceError, type Balance, type QuantityUnit, type Species, type Stream, type Values } from './types';

// CIAAW abridged standard atomic weights 2024, conventional central values.
// One consistent atomic basis avoids reaction imbalance from rounded molecular masses.
export const ATOMIC = { C: 12.011, H: 1.008, N: 14.007, O: 15.999, S: 32.06 } as const;
export const ATOMS = {
  B: { C: 6, H: 6 }, N: { H: 1, N: 1, O: 3 }, S: { H: 2, S: 1, O: 4 },
  W: { H: 2, O: 1 }, NB: { C: 6, H: 5, N: 1, O: 2 }, H2: { H: 2 },
  AN: { C: 6, H: 7, N: 1 }, CHA: { C: 6, H: 13, N: 1 }, N2: { N: 2 },
} as const;
export const MW: Record<Species, number> = Object.fromEntries(Object.entries(ATOMS).map(([id, atoms]) => [id,
  Object.entries(atoms).reduce((sum, [e, n]) => sum + ATOMIC[e as keyof typeof ATOMIC] * n, 0),
])) as Record<Species, number>;
export const FORMULA: Record<Species, string> = { B:'C₆H₆', N:'HNO₃', S:'H₂SO₄', W:'H₂O', NB:'C₆H₅NO₂', H2:'H₂', AN:'C₆H₇N', CHA:'C₆H₁₃N', N2:'N₂' };
export const REACTIONS = {
  nitration: { B: -1, N: -1, NB: 1, W: 1 },
  hydrogenation: { NB: -1, H2: -3, AN: 1, W: 2 },
  overhydrogenation: { NB: -1, H2: -6, CHA: 1, W: 2 },
} as const;
export const NITRATION = String.raw`\mathrm{C_6H_6 + HNO_3 \longrightarrow C_6H_5NO_2 + H_2O}`;
export const HYDROGENATION = String.raw`\mathrm{C_6H_5NO_2 + 3H_2 \longrightarrow C_6H_7N + 2H_2O}`;
export const SIDE_REACTION = String.raw`\mathrm{C_6H_5NO_2 + 6H_2 \longrightarrow C_6H_{13}N + 2H_2O}`;
export const number = (v: Values, key: string): number => {
  if (typeof v[key] !== 'number' || !Number.isFinite(v[key])) throw new ScienceError('finite', key);
  return v[key] as number;
};
export const fraction = (v: Values, key: string) => number(v,key)/100;
export function massToKg(value: number, unit: string = 'kg'): number {
  if (!Number.isFinite(value) || value < 0) throw new ScienceError('nonnegative');
  if (unit === 'kg') return value;
  if (unit === 'g') return value/1000;
  if (unit === 't') return value*1000;
  throw new ScienceError('unit');
}
export function toKmol(value: number, unit: string, species: Species): number {
  if (!Number.isFinite(value) || value < 0) throw new ScienceError('nonnegative');
  if (unit === 'kmol') return value;
  if (unit === 'mol') return value/1000;
  return massToKg(value,unit)/MW[species];
}
export function fromKmol(value: number, unit: QuantityUnit, species: Species): number {
  if (unit === 'kmol') return value;
  if (unit === 'mol') return value*1000;
  const kg = value*MW[species];
  return unit === 'kg' ? kg : unit === 'g' ? kg*1000 : kg/1000;
}
export function feed(v: Values, key: string, species: Species, purityKey?: string) {
  const value=number(v,key); const unit=String(v[key+'Unit']??'kg');
  const p=purityKey ? fraction(v,purityKey) : 1;
  if(p<0 || p>1) throw new ScienceError('percent',purityKey);
  if (unit==='mol'||unit==='kmol') {
    const n=toKmol(value,unit,species);
    if (p===0 && n>0) throw new ScienceError('purityZero',purityKey);
    const pure=n*MW[species]; const total=p===0?0:pure/p;
    return { n, pure, total, inert: total-pure };
  }
  const total=massToKg(value,unit);const pure=total*p;
  return { n:pure/MW[species], pure, total, inert:total-pure };
}
export const mass = (v:Values,key:string) => massToKg(number(v,key),String(v[key+'Unit']??'kg'));
export function requirePositive(n:number,field?:string) { if(n<=0) throw new ScienceError('positive',field); }
export function requireAtMost(a:number,b:number,code:string,field?:string) {
  if(a>b+1e-10*Math.max(1,Math.abs(b))) throw new ScienceError(code,field);
}
export function nitration(b:number,n:number,x:number) {
  const extent=b*x;requireAtMost(extent,n,'acidShortage','x');
  return { extent, bLeft:Math.max(0,b-extent), nLeft:Math.max(0,n-extent), nb:extent, water:extent };
}
export function hydrogenation(nb:number,h:number,x:number,s=1) {
  const extent=nb*x; const hConsumed=extent*(6-3*s);
  requireAtMost(hConsumed,h,'hydrogenShortage','xh');
  return { extent, hConsumed, nbLeft:Math.max(0,nb-extent), hLeft:Math.max(0,h-hConsumed), an:extent*s, cha:extent*(1-s), water:2*extent };
}
export function stream(en:string,ar:string,mass:number,side:'in'|'out'):Stream { return { label:bi(en,ar), mass:Math.abs(mass)<1e-14?0:mass,side }; }
export function balance(streams:Stream[]):Balance {
  const input=streams.filter(s=>s.side==='in').reduce((a,s)=>a+s.mass,0);
  const output=streams.filter(s=>s.side==='out').reduce((a,s)=>a+s.mass,0);
  const error=output-input;
  return {input,output,error,relativeError:input>0?100*error/input:0,streams};
}
export const fmt=(n:number)=>Number(n.toPrecision(8)).toString();
export const st=(en:string,ar:string,tex:string)=>({label:bi(en,ar),tex});
