export type Lang = 'en' | 'ar';
export type Bilingual = Record<Lang, string>;
export const bi = (en: string, ar: string): Bilingual => ({ en, ar });
export type Values = Record<string, number | string>;
export type Species = 'B' | 'N' | 'S' | 'W' | 'NB' | 'H2' | 'AN' | 'CHA' | 'N2';
export type QuantityUnit = 'g' | 'kg' | 't' | 'mol' | 'kmol';
export type Field = {
  key: string; label: Bilingual; kind: 'quantity' | 'mass' | 'percent' | 'number' | 'select';
  value: number | string; species?: Species; unit?: QuantityUnit;
  min?: number; max?: number; integer?: boolean; positive?: boolean;
  options?: { value: string; label: Bilingual }[];
};
export type Metric = { key: string; label: Bilingual; unit: string; primary?: boolean };
export type Calculator = {
  id: number; group: number; title: Bilingual; intro: Bilingual;
  equations: string[]; fields: Field[]; metrics: Metric[];
  notes: Bilingual[]; interpretation: Bilingual; references: string[];
  chart: { vary: string; output: string; secondary?: string };
};
export type Step = { label: Bilingual; tex: string };
export type Stream = { label: Bilingual; mass: number; side: 'in' | 'out' };
export type ComponentRow = { component: string; feed: number; organic: number; aqueous: number };
export type Balance = { input: number; output: number; error: number; relativeError: number; streams: Stream[] };
export type CalcResult = { values: Record<string, number | string | null>; steps: Step[]; balance?: Balance; components?: ComponentRow[] };
export class ScienceError extends Error {
  code: string; field?: string;
  constructor(code: string, field?: string) { super(code); this.code = code; this.field = field; }
}
