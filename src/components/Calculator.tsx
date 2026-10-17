import { useEffect, useRef, useState } from 'react';
import { AlertCircle, ArrowLeft, BookOpen, Check, ChevronRight, Copy, Download, FileText, FlaskConical, LoaderCircle, RotateCcw, ArrowRight, Search } from 'lucide-react';
import { CALCULATORS, GROUPS, example } from '../data/calculators';
import { ERROR_TEXT, t, valueLabel } from '../data/strings';
import { calculate, feed, fromKmol, massToKg, ScienceError, type Calculator as Spec, type Field, type Lang, type QuantityUnit, type Values } from '../engine';
import { Equation, Molecule, StageIllustration } from './Chemistry';
import { Sensitivity, resultUnit, stepTex } from './Sensitivity';
import { BalanceTable, ComponentTable, PDFReport, SourceList } from './Report';
import { chartPNG, copyReport, exportCSV, exportPDF } from './exports';
import { ProcessDiagram } from './ProcessDiagram';
import { ProductComparison } from './ProductComparison';
import { ATELIER as A } from '../data/atelier';
function purityKey(id:number,key:string){if([1,2,4,6,8].includes(id)&&key==='benzene')return 'bp';if([1,2].includes(id)&&key==='nitric')return 'np';if(id===5&&key==='actual'||id===18&&key==='actualAniline')return 'productPurity';return undefined;}
export function Calculator({spec,lang}:{spec:Spec;lang:Lang}){
 const [form,setForm]=useState<Values>(()=>example(spec));const [committed,setCommitted]=useState<Values>(()=>example(spec));
 const [result,setResult]=useState(()=>calculate(spec.id,example(spec)) as ReturnType<typeof calculate>|null);
 const [basis,setBasis]=useState<'batch'|'hour'>('batch');const [dirty,setDirty]=useState(false),[status,setStatus]=useState<'ready'|'updated'>('ready');
 const [error,setError]=useState<ScienceError|null>(null),[busy,setBusy]=useState(false),[toast,setToast]=useState('');
 const chartRef=useRef<HTMLDivElement>(null),reportRef=useRef<HTMLDivElement>(null),resultsRef=useRef<HTMLDivElement>(null);
 useEffect(()=>{if(toast){const id=setTimeout(()=>setToast(''),4500);return()=>clearTimeout(id);}},[toast]);
 function edit(key:string,value:number|string){setForm(f=>({...f,[key]:value}));setDirty(true);setError(null);}
 function changeUnit(f:Field,unit:QuantityUnit){try{
   if(form[f.key]===''){setForm(a=>({...a,[f.key+'Unit']:unit}));return;}
   const old=String(form[f.key+'Unit']??'kg');let value:number;
   if(f.kind==='mass'){const kg=massToKg(Number(form[f.key]),old);value=unit==='g'?kg*1000:unit==='t'?kg/1000:kg;}
   else {const pk=purityKey(spec.id,f.key);if(pk&&Number(form[pk])===0)throw new ScienceError('purityZero',pk);const a=feed(form,f.key,f.species!,pk);value=unit==='mol'||unit==='kmol'?fromKmol(a.n,unit,f.species!):unit==='g'?a.total*1000:unit==='t'?a.total/1000:a.total;}
   setForm(a=>({...a,[f.key]:Number(value.toPrecision(14)),[f.key+'Unit']:unit}));setDirty(true);setError(null);
 }catch(e){setError(e instanceof ScienceError?e:new ScienceError('unit',f.key));}}
 function run(values=form){try{const r=calculate(spec.id,values);setResult(r);setCommitted({...values});setDirty(false);setStatus('updated');setError(null);}catch(e){setError(e instanceof ScienceError?e:new ScienceError('overflow'));}}
 function reset(){const fresh=example(spec);for(const f of spec.fields)if(f.kind!=='select')fresh[f.key]='';setForm(fresh);setResult(null);setDirty(false);setError(null);}
 function load(){const values=example(spec);setForm(values);run(values);}
 async function output(kind:'copy'|'csv'|'pdf'|'png'){
   if(!result||dirty)return;setBusy(true);
   try {const context={spec,values:committed,result,lang,basis};if(kind==='copy'){await copyReport(context);setToast(t('copied',lang));}else if(kind==='csv'){exportCSV(context);setToast(t('downloaded',lang));}else if(kind==='pdf'){await exportPDF(reportRef.current!,spec.id,lang);setToast(t('downloaded',lang));}else{await chartPNG(chartRef.current!,spec.id,lang);setToast(t('downloaded',lang));}}
   catch{setToast(t('exportError',lang));}finally{setBusy(false);}
 }
 const [navigationQuery,setNavigationQuery]=useState('');
 const errorField=spec.fields.find(f=>f.key===error?.field);
 const visibleNavigation=CALCULATORS.filter(c=>(c.title.en+' '+c.title.ar+' '+String(c.id).padStart(2,'0')).toLowerCase().includes(navigationQuery.toLowerCase()));
 function jump(id:string){const target=document.getElementById(id);target?.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});target?.focus({preventScroll:true});}
 useEffect(()=>{if(error?.field)document.getElementById('field-'+error.field)?.focus();},[error]);
 return <div className={'workbench wrap workspace-group-'+spec.group}>
  <aside className="lab-sidebar"><a href="#/" className="back-link"><ArrowLeft size={20}/>{t('back',lang)}</a><div className="sidebar-title"><span className="eyebrow">{A.workspace[lang]}</span><strong>AnilineProduction Lab</strong></div><div className="sidebar-search"><Search size={20}/><input type="search" value={navigationQuery} onChange={e=>setNavigationQuery(e.target.value)} aria-label={A.navSearch[lang]} placeholder={A.navSearch[lang]}/></div>
   <nav aria-label={t('calculators',lang)}>{GROUPS.map(g=>{const entries=visibleNavigation.filter(c=>c.group===g.id);return entries.length?<div className="sidebar-group" key={g.id}><h3><bdi>0{g.id}</bdi>{g.title[lang]}</h3>{entries.map(c=><a key={c.id} className={c.id===spec.id?'active':''} href={`#/calculator/${c.id}`} aria-current={c.id===spec.id?'page':undefined}><span>{String(c.id).padStart(2,'0')}</span><span>{c.title[lang]}</span></a>)}</div>:null;})}</nav>{visibleNavigation.length===0&&<p className="sidebar-empty">{A.navEmpty[lang]}</p>}
   <div className="sidebar-note"><Molecule kind="aniline" lang={lang} decorative/><p>{A.referenceNote[lang]}</p></div>
  </aside>
  <main className="lab-main" id="main-content" tabIndex={-1}>
   <div className="mobile-selector"><label htmlFor="calculator-picker">{A.navSearch[lang]}</label><select id="calculator-picker" value={spec.id} onChange={e=>{window.location.hash=`/calculator/${e.target.value}`;}}>{GROUPS.map(g=><optgroup label={g.title[lang]} key={g.id}>{CALCULATORS.filter(c=>c.group===g.id).map(c=><option value={c.id} key={c.id}>{String(c.id).padStart(2,'0')} · {c.title[lang]}</option>)}</optgroup>)}</select></div>
   <div className="lab-breadcrumb"><a href="#/">RagabLabs</a><ChevronRight size={17}/><span>{GROUPS[spec.group-1].title[lang]}</span></div>
   <header className="lab-heading"><div className="lab-heading-copy"><div className="eyebrow">{A.record[lang]} <bdi>{String(spec.id).padStart(2,'0')} / 20</bdi></div><h1>{spec.title[lang]}</h1><p>{spec.intro[lang]}</p></div><StageIllustration group={spec.group} lang={lang}/></header>
   <nav className="workspace-wayfinding" aria-label={A.workspace[lang]}><button onClick={()=>jump('research-inputs')}><bdi>01</bdi>{A.jumpInputs[lang]}</button><button onClick={()=>jump('research-results')}><bdi>02</bdi>{A.jumpResults[lang]}</button><button onClick={()=>jump('research-chart')}><bdi>03</bdi>{A.jumpChart[lang]}</button><button onClick={()=>jump('research-notes')}><bdi>04</bdi>{A.jumpNotes[lang]}</button></nav>
   <section className="reaction-strip" aria-label={A.equation[lang]}><div className="reaction-caption"><span className="eyebrow">{A.equation[lang]}</span><span aria-hidden="true">Σ</span></div>{spec.equations.map((tex,i)=><Equation tex={tex} key={i}/>)}</section>
   {spec.id===20&&<ProcessDiagram lang={lang}/>}
   <section className="basis-bar" aria-label={t('basis',lang)}><div><strong>{t('basis',lang)}</strong><p>{t('basisHelp',lang)}</p></div><div className="segmented" role="group" aria-label={t('basis',lang)}><button aria-pressed={basis==='batch'} className={basis==='batch'?'active':''} onClick={()=>setBasis('batch')}>{t('batch',lang)}</button><button aria-pressed={basis==='hour'} className={basis==='hour'?'active':''} onClick={()=>setBasis('hour')}>{t('hour',lang)}</button></div></section>
   <div className="calculation-layout">
    <div className="input-column"><form className="panel input-panel" id="research-inputs" tabIndex={-1} noValidate onSubmit={e=>{e.preventDefault();run();}}>
     <div className="panel-heading"><div><span className="eyebrow">01 / {A.dataEntry[lang]}</span><h2>{t('parameters',lang)}</h2></div><span className="section-symbol" aria-hidden="true"><FlaskConical size={28}/></span></div>
     <div className="input-actions"><button type="button" onClick={load} data-testid="load-example"><BookOpen size={19}/>{t('load',lang)}</button><button type="button" onClick={reset} data-testid="reset"><RotateCcw size={19}/>{t('reset',lang)}</button></div>
     <div className="fields">{spec.fields.map((f,index)=><div className={'field'+(error?.field===f.key?' field-error':'')} key={f.key}><label htmlFor={'field-'+f.key}><span className="field-label"><span className="field-index" aria-hidden="true">{String(index+1).padStart(2,'0')}</span>{f.label[lang]}</span>{f.kind==='percent'&&<bdi className="field-percent">%</bdi>}</label>{f.kind==='select'?<select id={'field-'+f.key} data-testid={'field-'+f.key} value={form[f.key]} onChange={e=>edit(f.key,e.target.value)} aria-invalid={error?.field===f.key} aria-describedby={error?.field===f.key?'calculation-error':undefined}>{f.options?.map(o=><option key={o.value} value={o.value}>{o.label[lang]}</option>)}</select>:<div className="quantity-input"><input id={'field-'+f.key} data-testid={'field-'+f.key} type="number" inputMode="decimal" step={f.integer?1:'any'} min={f.min??0} max={f.max} value={form[f.key]} onChange={e=>edit(f.key,e.target.value===''?'':Number(e.target.value))} aria-invalid={error?.field===f.key} aria-describedby={error?.field===f.key?'calculation-error':undefined} dir="ltr"/>{f.unit&&<select data-testid={'unit-'+f.key} aria-label={f.label[lang]+' · '+t('unit',lang)} value={form[f.key+'Unit']??f.unit} onChange={e=>changeUnit(f,e.target.value as QuantityUnit)} dir="ltr">{(f.kind==='mass'?['g','kg','t']:['g','kg','t','mol','kmol']).map(u=><option key={u} value={u}>{resultUnit(u,basis)}</option>)}</select>}</div>}</div>)}</div>
     {error&&<div className="error-message" role="alert" id="calculation-error" data-testid="calculation-error"><AlertCircle size={23}/><div>{errorField&&<strong>{errorField.label[lang]}: </strong>}{ERROR_TEXT[error.code as keyof typeof ERROR_TEXT]?.[lang]??t('exportError',lang)}</div></div>}
     <button className="button primary calculate-button" type="submit" data-testid="calculate"><FlaskConical size={22}/>{t('calculate',lang)}</button>
     {result&&<button type="button" className="view-results-button" disabled={dirty} onClick={()=>jump('research-results')}>{A.jumpResults[lang]}<ArrowRight size={20}/></button>}
    </form><div className="model-note"><span className="note-dot"/><div><strong>{t('assumed',lang)}</strong><p>{t('notice',lang)}</p></div></div></div>
    <div className="result-column" ref={resultsRef}>
     <section className="result-dossier" id="research-results" tabIndex={-1}><div className="result-top"><div><span className="eyebrow">02 / {A.reading[lang]}</span><h2>{t('result',lang)}</h2><p>{A.resultsIntro[lang]}</p></div><span className={'result-status'+(dirty?' pending':'')} aria-live="polite">{dirty?<AlertCircle size={18}/>:<Check size={19}/>}<span>{dirty?t('dirty',lang):result?t(status,lang):''}</span></span></div>
     {result?<><div className={'result-grid'+(dirty?' stale':'')} data-testid="result-grid">{[...spec.metrics.filter(m=>m.primary),...spec.metrics.filter(m=>!m.primary)].map(m=><div className={'metric-card'+(m.primary?' primary':'')} key={m.key}><span>{m.label[lang]}</span><div className="metric-value" data-testid={'result-'+m.key}><bdi>{valueLabel(result.values[m.key],lang)}</bdi><small dir="ltr">{resultUnit(m.unit,basis)}</small></div></div>)}</div>
     <div className="export-panel"><h3>{A.export[lang]}</h3><div className="export-bar"><button onClick={()=>output('copy')} disabled={dirty||busy} data-testid="export-copy"><Copy size={20}/>{t('copy',lang)}</button><button onClick={()=>output('csv')} disabled={dirty||busy} data-testid="export-csv"><Download size={20}/>{t('csv',lang)}</button><button onClick={()=>output('pdf')} disabled={dirty||busy} data-testid="export-pdf"><FileText size={20}/>{t('pdf',lang)}</button><button onClick={()=>output('png')} disabled={dirty||busy} data-testid="export-png"><Download size={20}/>{t('png',lang)}</button></div></div>{busy&&<div className="export-progress" role="status"><LoaderCircle size={21} className="spin"/>{t('exporting',lang)}</div>}</>:<div className="empty-result"><FlaskConical size={52}/><p>{t('empty',lang)}</p></div>}</section>
     {result?<>
      {[5,18].includes(spec.id)&&<ProductComparison spec={spec} result={result} lang={lang} basis={basis}/>}
      <div id="research-chart" tabIndex={-1}><Sensitivity key={JSON.stringify(committed)} spec={spec} values={committed} lang={lang} basis={basis} exportRef={chartRef}/></div>
      <BalanceTable result={result} lang={lang} basis={basis}/><ComponentTable result={result} lang={lang} basis={basis}/>
      <section className="panel solution-panel"><div className="panel-heading"><div><span className="eyebrow">{A.record[lang]} / Σ</span><h3>{t('step',lang)}</h3></div><span className="section-symbol" aria-hidden="true"><BookOpen size={26}/></span></div><ol className="solution-steps">{result.steps.map((s,i)=><li key={i}><span className="solution-number">{String(i+1).padStart(2,'0')}</span><div><h4>{s.label[lang]}</h4><Equation tex={stepTex(s.tex,basis)}/></div></li>)}</ol></section>
      <section className="interpretation-panel"><FlaskConical size={28}/><div><h3>{t('interpretation',lang)}</h3><p>{spec.interpretation[lang]}</p></div></section>
      <PDFReport spec={spec} values={committed} result={result} lang={lang} basis={basis} reportRef={reportRef}/>
     </>:null}
     <div className="research-notes" id="research-notes" tabIndex={-1}><section className="panel assumptions-panel"><div className="eyebrow">{A.notes[lang]}</div><h3>{t('assumptions',lang)}</h3><ul>{spec.notes.map((n,i)=><li key={i}>{n[lang]}</li>)}</ul></section><section className="panel references-panel"><h3>{t('references',lang)}</h3><SourceList keys={spec.references} lang={lang}/></section></div>
    </div>
   </div>
  </main>{toast&&<div className="toast" role="status">{toast}<button aria-label={t('clear',lang)} onClick={()=>setToast('')}>×</button></div>}
 </div>;
}
