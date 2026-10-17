import { type RefObject } from 'react';
import { REFERENCES } from '../data/calculators';
import { t, valueLabel } from '../data/strings';
import { type Calculator, type CalcResult, type Lang, type Values } from '../engine';
import { Equation } from './Chemistry';
import { resultUnit, stepTex } from '../engine/format';
export function SourceList({keys,lang}:{keys:string[];lang:Lang}){return <ol className="source-list">{keys.map(key=>{const r=REFERENCES[key];return <li key={key}>{r.url?<a href={r.url} target="_blank" rel="noreferrer">{r.title}<span aria-hidden="true"> ↗</span></a>:<strong>{r.title}</strong>}<p>{r.description[lang]}</p></li>;})}</ol>;}
export function BalanceTable({result,lang,basis}:{result:CalcResult;lang:Lang;basis:'batch'|'hour'}){
 const bal=result.balance;if(!bal)return null;
 return <section className="panel balance-panel"><div className="panel-heading"><h3>{t('balance',lang)}</h3><span className="closed-badge" dir="ltr">Δm ≈ {valueLabel(Math.abs(bal.error)<1e-8?0:bal.error,lang)} {resultUnit('kg',basis)}</span></div><div className="balance-totals"><div><span>{t('input',lang)}</span><b dir="ltr">{valueLabel(bal.input,lang)} <small>{resultUnit('kg',basis)}</small></b></div><div><span>{t('output',lang)}</span><b dir="ltr">{valueLabel(bal.output,lang)} <small>{resultUnit('kg',basis)}</small></b></div></div><div className="table-scroll"><table><thead><tr><th>{t('stream',lang)}</th><th>{t('direction',lang)}</th><th>{t('mass',lang)} <bdi>({resultUnit('kg',basis)})</bdi></th></tr></thead><tbody>{bal.streams.map((s,i)=><tr key={i}><td>{s.label[lang]}</td><td><span className={'flow-badge '+s.side}>{t(s.side,lang)}</span></td><td dir="ltr">{valueLabel(s.mass,lang)}</td></tr>)}</tbody></table></div><p className="balance-error">{t('closure',lang)}: <bdi>{valueLabel(bal.error,lang)} {resultUnit('kg',basis)}</bdi></p></section>;
}
export function ComponentTable({result,lang,basis}:{result:CalcResult;lang:Lang;basis:'batch'|'hour'}){
 if(!result.components)return null;
 return <section className="panel"><h3>{t('componentBalance',lang)}</h3><div className="table-scroll"><table><thead><tr><th>{t('component',lang)}</th><th>{t('feed',lang)}</th><th>{t('organic',lang)}</th><th>{t('aqueous',lang)}</th></tr></thead><tbody>{result.components.map(c=><tr key={c.component}><td dir="ltr">{c.component}</td><td>{valueLabel(c.feed,lang)}</td><td>{valueLabel(c.organic,lang)}</td><td>{valueLabel(c.aqueous,lang)}</td></tr>)}</tbody></table></div><p className="small-copy" dir="ltr">{resultUnit('kg',basis)} · Σ feed = Σ organic + Σ aqueous</p></section>;
}
function chunks<T>(array:T[],count:number){return Array.from({length:Math.ceil(array.length/count)},(_,i)=>array.slice(i*count,(i+1)*count));}
export function PDFReport({spec,values,result,lang,basis,reportRef}:{spec:Calculator;values:Values;result:CalcResult;lang:Lang;basis:'batch'|'hour';reportRef:RefObject<HTMLDivElement|null>}){
 return <div className="pdf-report" aria-hidden="true" ref={reportRef} lang={lang} dir={lang==='ar'?'rtl':'ltr'}>
  <div className="pdf-block"><b className="pdf-brand">RagabLabs / AnilineProduction Lab</b><h1>{String(spec.id).padStart(2,'0')} · {spec.title[lang]}</h1><p>{t('basis',lang)}: {t(basis,lang)}</p><p>{t('notice',lang)}</p></div>
  {spec.equations.map((tex,i)=><div className="pdf-block" key={'eq'+i}><Equation tex={tex}/></div>)}
  {chunks(spec.fields,8).map((fields,i)=><div className="pdf-block" key={'inputs'+i}><h2>{t('pdfInputs',lang)}</h2><table><tbody>{fields.map(f=><tr key={f.key}><td>{f.label[lang]}</td><td>{f.kind==='select'?f.options?.find(o=>o.value===values[f.key])?.label[lang]:valueLabel(values[f.key],lang)}</td><td>{f.unit?resultUnit(String(values[f.key+'Unit']??f.unit),basis):f.kind==='percent'?'%':''}</td></tr>)}</tbody></table></div>)}
  {chunks(spec.metrics,8).map((metrics,i)=><div className="pdf-block" key={'results'+i}><h2>{t('result',lang)}</h2><table><tbody>{metrics.map(m=><tr key={m.key}><td>{m.label[lang]}</td><td>{valueLabel(result.values[m.key],lang)}</td><td>{resultUnit(m.unit,basis)}</td></tr>)}</tbody></table></div>)}
  {result.balance&&<><div className="pdf-block"><h2>{t('balance',lang)}</h2><p>{t('input',lang)}: {valueLabel(result.balance.input,lang)} <bdi>{resultUnit('kg',basis)}</bdi></p><p>{t('output',lang)}: {valueLabel(result.balance.output,lang)} <bdi>{resultUnit('kg',basis)}</bdi></p><p>{t('closure',lang)}: {valueLabel(result.balance.error,lang)} <bdi>{resultUnit('kg',basis)}</bdi></p></div>{chunks(result.balance.streams,8).map((streams,i)=><div className="pdf-block" key={'streams'+i}><table><tbody>{streams.map((s,j)=><tr key={j}><td>{s.label[lang]}</td><td>{t(s.side,lang)}</td><td>{valueLabel(s.mass,lang)} <bdi>{resultUnit('kg',basis)}</bdi></td></tr>)}</tbody></table></div>)}</>}
  {result.components&&<div className="pdf-block"><ComponentTable result={result} lang={lang} basis={basis}/></div>}
  {result.steps.map((s,i)=><div className="pdf-block" key={'step'+i}><h3>{i+1}. {s.label[lang]}</h3><Equation tex={stepTex(s.tex,basis)}/></div>)}
  <div className="pdf-block"><h2>{t('interpretation',lang)}</h2><p>{spec.interpretation[lang]}</p></div>
  {spec.notes.map((note,i)=><div className="pdf-block" key={'note'+i}>{i===0&&<h2>{t('assumptions',lang)}</h2>}<p>{note[lang]}</p></div>)}
  {spec.references.map((key,i)=><div className="pdf-block" key={key}>{i===0&&<h2>{t('references',lang)}</h2>}<SourceList keys={[key]} lang={lang}/></div>)}
 </div>;
}
