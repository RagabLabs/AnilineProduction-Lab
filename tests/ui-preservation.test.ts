import { expect, it } from 'vitest';
import baseline from './fixtures/ui-v1-scientific-baseline.json';
import { calculate, ScienceError, type Values } from '../src/engine';
for(const c of baseline)it(`v1 → v2 scientific identity · ${c.id} · ${c.name}`,()=>{
 let actual:unknown;
 try{actual={result:calculate(c.id,c.inputs as Values)};}catch(e){actual={error:e instanceof ScienceError?e.code:'unexpected'};}
 expect(JSON.parse(JSON.stringify(actual))).toEqual(c.expected);
});
