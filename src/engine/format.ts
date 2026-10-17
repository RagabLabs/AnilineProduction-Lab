export function resultUnit(unit:string,basis:'batch'|'hour'){return basis==='hour'&&['kg','kmol'].includes(unit)?unit+'/h':unit;}
export function stepTex(tex:string,basis:'batch'|'hour'){return basis==='hour'?tex.replaceAll('\\mathrm{kg}','\\mathrm{kg\\,h^{-1}}').replaceAll('\\mathrm{kmol}','\\mathrm{kmol\\,h^{-1}}'):tex;}
