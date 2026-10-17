import { useState } from 'react';
import katex from 'katex';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { bi, type Lang } from '../engine/types';
import { HYDROGENATION, NITRATION } from '../engine/chemistry';
import { getCalculator } from '../data/calculators';
import { ATELIER as A } from '../data/atelier';
import { t } from '../data/strings';
export function Equation({tex,small=false}:{tex:string;small?:boolean}) {
  return <div className={'equation'+(small?' small':'')} dir="ltr" dangerouslySetInnerHTML={{__html:katex.renderToString(tex,{throwOnError:false,displayMode:!small,strict:'ignore',output:'htmlAndMathml'})}}/>;
}
export function Molecule({kind='benzene',decorative=false,lang='en'}:{kind?:'benzene'|'nitrobenzene'|'aniline';decorative?:boolean;lang?:Lang}) {
 const pts=[[58,48],[92,68],[92,108],[58,128],[24,108],[24,68]];
 return <svg direction="ltr" viewBox="0 0 190 160" className={'molecule '+kind} role={decorative?undefined:'img'} aria-hidden={decorative||undefined} aria-label={t(kind,lang)}>
  <g transform={kind==='benzene'?'translate(32 0)':undefined} fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><polygon points={pts.map(p=>p.join(',')).join(' ')}/><path d="M60 58 L83 72 M83 105 L60 118 M33 104 L33 72"/>
  {kind!=='benzene'&&<path d="M92 68 L116 54"/>}
  {kind==='nitrobenzene'&&<path d="M135 42 L151 30 M139 47 L155 35 M137 62 L155 74"/>}
  {kind==='aniline'&&<path d="M136 43 L151 30 M137 63 L154 75"/>}
  </g>
  {kind==='nitrobenzene'&&<g fill="currentColor" fontFamily="Inter,sans-serif" fontSize="22" fontWeight="500"><text x="118" y="61">N<tspan dy="-10" fontSize="15">+</tspan></text><text x="158" y="34">O</text><text x="158" y="89">O<tspan dy="-10" fontSize="15">−</tspan></text></g>}
  {kind==='aniline'&&<g fill="currentColor" fontFamily="Inter,sans-serif" fontSize="22" fontWeight="500"><text x="118" y="61">N</text><text x="157" y="33">H</text><text x="157" y="90">H</text></g>}
 </svg>;
}
export function ReagentMolecule({kind,lang='en'}:{kind:'nitric'|'sulfuric'|'hydrogen';lang?:Lang}){
 return <svg direction="ltr" className={'reagent-molecule '+kind} viewBox="0 0 260 130" role="img" aria-label={A[kind][lang]}>
  {kind==='hydrogen'?<><path d="M108 69H151" fill="none" stroke="currentColor" strokeWidth="2.8"/><g fill="currentColor" fontFamily="Inter,sans-serif" fontSize="25"><text x="83" y="78">H</text><text x="157" y="78">H</text></g></>:kind==='nitric'?<><g fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M37 75H55 M81 75H112 M139 75H199 M126 57V28 M133 57V28"/></g><g fill="currentColor" fontFamily="Inter,sans-serif" fontSize="23"><text x="14" y="83">H</text><text x="60" y="83">O</text><text x="116" y="83">N<tspan dy="-12" fontSize="15">+</tspan></text><text x="121" y="22">O</text><text x="205" y="83">O<tspan dy="-12" fontSize="15">−</tspan></text></g></>:<><g fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M36 68H54 M80 68H111 M140 68H182 M209 68H225 M123 50V27 M130 50V27 M123 83V99 M130 83V99"/></g><g fill="currentColor" fontFamily="Inter,sans-serif" fontSize="23"><text x="13" y="76">H</text><text x="59" y="76">O</text><text x="117" y="77">S</text><text x="187" y="76">O</text><text x="230" y="76">H</text><text x="119" y="23">O</text><text x="119" y="121">O</text></g></>}
 </svg>;
}
export function SeparationGlyph({lang='en'}:{lang?:Lang}){return <svg direction="ltr" className="separation-glyph" viewBox="0 0 260 170" role="img" aria-label={bi('Organic and acid phase separation','فصل الطور العضوي عن الطور الحمضي')[lang]}><g fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M91 18H169 M105 18V51L70 92V126Q70 145 130 145Q190 145 190 126V92L155 51V18"/><path d="M81 100H179"/><path d="M115 145V159M145 145V159"/></g><path d="M80 105H180V126Q180 135 130 135Q80 135 80 126Z" fill="#E8EDE2"/><path d="M80 95 113 57H147L180 95Z" fill="#F1E2C9"/><g fill="currentColor" fontSize="15" fontFamily="Inter,IBM Plex Sans Arabic,sans-serif"><text x="199" y="96">α</text><text x="199" y="128">β</text></g></svg>;}
export function StageIllustration({group,lang}:{group:number;lang:Lang}){
 return <div className={'stage-illustration stage-'+group} aria-hidden="true">{group===2?<div className="acid-structures"><ReagentMolecule kind="nitric" lang={lang}/><ReagentMolecule kind="sulfuric" lang={lang}/></div>:group===3?<SeparationGlyph lang={lang}/>:group===5?<svg direction="ltr" viewBox="0 0 330 160" className="integrated-glyph"><g fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M45 59 69 73V101L45 115 21 101V73Z M150 59 174 73V101L150 115 126 101V73Z M255 59 279 73V101L255 115 231 101V73Z"/><path d="M44 68 61 78 M61 96 45 106 M29 97V78 M149 68 166 78 M166 96 150 106 M134 97V78 M254 68 271 78 M271 96 255 106 M239 97V78"/><path d="M82 87H111 M104 80 111 87 104 94 M187 87H216 M209 80 216 87 209 94 M174 73 192 61 M279 73 297 61"/></g><g fill="currentColor" fontFamily="Inter,sans-serif" fontSize="18"><text x="182" y="52">NO₂</text><text x="287" y="52">NH₂</text></g></svg>:<Molecule kind={group===4?'aniline':'nitrobenzene'} lang={lang} decorative/>}</div>;
}
export function BrandMark(){return <svg width="35" height="39" viewBox="0 0 35 39" aria-hidden="true"><path d="M17.5 2 33 11v17L17.5 37 2 28V11Z" fill="none" stroke="currentColor" strokeWidth="2.5"/><path d="m12 12 11 7-11 8m0-15v15m6-11v9" fill="none" stroke="currentColor" strokeWidth="2.2"/></svg>;}
export function Pathway({lang,compact=false}:{lang:Lang;compact?:boolean}) {
 const [phase,setPhase]=useState<1|2>(1);const first=phase===1?'benzene':'nitrobenzene',second=phase===1?'nitrobenzene':'aniline';
 const formulas={benzene:'C₆H₆',nitrobenzene:'C₆H₅NO₂',aniline:'C₆H₇N'};
 const related=phase===1?[1,3,7]:[15,16,19];
 return <section className={'pathway reaction-notebook'+(compact?' compact':'')} aria-labelledby="notebook-heading" data-testid="reaction-notebook"><div className="notebook-heading"><div><span className="eyebrow">{A.scheme[lang]} / 0{phase}</span><h2 id="notebook-heading">{A.notebook[lang]}</h2></div><span className="notebook-seal" aria-hidden="true">R<span>LAB</span></span></div>
  <div className="route-overview" dir="ltr"><bdi>{t('benzene',lang)}</bdi><ArrowRight size={19} aria-hidden="true"/><bdi>{t('nitrobenzene',lang)}</bdi><ArrowRight size={19} aria-hidden="true"/><bdi>{t('aniline',lang)}</bdi></div>
  <div className="reaction-tabs" role="group" aria-label={A.scheme[lang]}>{([1,2] as const).map(s=><button type="button" key={s} onClick={()=>setPhase(s)} aria-pressed={s===phase} className={s===phase?'active':''} data-testid={'reaction-stage-'+s}><span>0{s}</span>{s===1?A.step1[lang]:A.step2[lang]}</button>)}</div>
  <div className="scheme-visual" dir="ltr"><div className="scheme-compound"><Molecule kind={first} lang={lang}/><strong>{t(first,lang)}</strong><span>{formulas[first]}</span></div><div className="scheme-transfer"><span>{phase===1?'HNO₃':'3 H₂'}</span><ArrowRight size={45}/><span>{phase===1?'H₂SO₄':''}</span></div><div className="scheme-compound product"><Molecule kind={second} lang={lang}/><strong>{t(second,lang)}</strong><span>{formulas[second]}</span></div></div>
  <div className="notebook-equation"><Equation tex={phase===1?NITRATION:HYDROGENATION}/></div>
  <div className="scheme-reading" aria-live="polite"><p>{phase===1?A.phase1[lang]:A.phase2[lang]}</p><div className="related-calculators"><span>{A.related[lang]}</span>{related.map(id=><a href={`#/calculator/${id}`} key={id}>{getCalculator(id).title[lang]}<ArrowUpRight size={17}/></a>)}</div></div>
 </section>;
}
