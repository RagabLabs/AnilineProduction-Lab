import { REFERENCES } from '../data/calculators';
import { t, valueLabel } from '../data/strings';
import { type Calculator, type CalcResult, type Lang, type Values } from '../engine';
import { resultUnit } from '../engine/format';
type Context={spec:Calculator;values:Values;result:CalcResult;lang:Lang;basis:'batch'|'hour'};
function rows({spec,values,result,lang,basis}:Context):(number|string)[][]{
 const data:(number|string)[][]=[['RagabLabs · AnilineProduction Lab v1.0.0'],[spec.title[lang]],['UTC',new Date().toISOString()],[t('basis',lang),t(basis,lang)],[],[t('parameters',lang),t('value',lang),t('unit',lang)]];
 spec.fields.forEach(f=>{const value=values[f.key];data.push([f.label[lang],f.kind==='select'?f.options?.find(o=>o.value===value)?.label[lang]??String(value):value,f.unit?resultUnit(String(values[f.key+'Unit']??f.unit),basis):f.kind==='percent'?'%':'']);});
 data.push([],[t('result',lang),t('value',lang),t('unit',lang)]);
 spec.metrics.forEach(m=>{const value=result.values[m.key];data.push([m.label[lang],typeof value==='number'?value:valueLabel(value,lang),resultUnit(m.unit,basis)]);});
 if(result.balance){data.push([],[t('balance',lang)],[t('input',lang),result.balance.input,resultUnit('kg',basis)],[t('output',lang),result.balance.output,resultUnit('kg',basis)],[t('closure',lang),result.balance.error,resultUnit('kg',basis)]);for(const s of result.balance.streams)data.push([s.label[lang],s.mass,t(s.side,lang)]);}
 if(result.components){data.push([],[t('component',lang),t('feed',lang),t('organic',lang),t('aqueous',lang)]);for(const c of result.components)data.push([c.component,c.feed,c.organic,c.aqueous]);}
 data.push([],[t('step',lang)]);result.steps.forEach(s=>data.push([s.label[lang],s.tex]));
 data.push([],[t('interpretation',lang),spec.interpretation[lang]],[],[t('assumptions',lang)]);spec.notes.forEach(n=>data.push([n[lang]]));
 data.push([],[t('references',lang)]);spec.references.forEach(k=>data.push([REFERENCES[k].title,REFERENCES[k].url??'',REFERENCES[k].description[lang]]));
 return data;
}
export function reportText(c:Context){return rows(c).map(r=>r.join('\t')).join('\n');}
export function saveBlob(blob:Blob,filename:string){const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=filename;a.click();setTimeout(()=>URL.revokeObjectURL(url),2000);}
export function exportCSV(c:Context){const csv=rows(c).map(row=>row.map(cell=>'"'+String(cell).replaceAll('"','""')+'"').join(',')).join('\r\n');saveBlob(new Blob(['\ufeff'+csv],{type:'text/csv;charset=utf-8'}),`AnilineLab-${String(c.spec.id).padStart(2,'0')}-${c.lang}.csv`);}
export async function copyReport(c:Context){const text=reportText(c);try{await navigator.clipboard.writeText(text);}catch{const a=document.createElement('textarea');a.value=text;a.style.position='fixed';a.style.opacity='0';document.body.append(a);a.select();const ok=document.execCommand('copy');a.remove();if(!ok)throw new Error('clipboard');}}
export async function chartPNG(node:HTMLElement,id:number,lang:Lang){await document.fonts.ready;const {toBlob}=await import('html-to-image');const b=await toBlob(node,{backgroundColor:'#ffffff',pixelRatio:2});if(!b)throw new Error('png');saveBlob(b,`AnilineLab-chart-${String(id).padStart(2,'0')}-${lang}.png`);}
export async function exportPDF(node:HTMLElement,id:number,lang:Lang){
 await document.fonts.ready;
 const [{jsPDF},{toCanvas,getFontEmbedCSS}]=await Promise.all([import('jspdf'),import('html-to-image')]);
 const pdf=new jsPDF({unit:'pt',format:'a4'});pdf.setProperties({title:`AnilineProduction Lab · ${id}`,author:'RagabLabs',subject:'Educational scientific calculation report'});
 const css=await getFontEmbedCSS(node);let y=34;const pageW=pdf.internal.pageSize.getWidth(),pageH=pdf.internal.pageSize.getHeight(),margin=34,usable=pageW-2*margin;
 const blocks=Array.from(node.querySelectorAll<HTMLElement>('.pdf-block'));
 for(const block of blocks){const canvas=await toCanvas(block,{backgroundColor:'#ffffff',pixelRatio:1.4,fontEmbedCSS:css});const height=canvas.height*usable/canvas.width;
   if(height>pageH-2*margin)throw new Error('Report block exceeds a page');
   if(y+height>pageH-margin){pdf.addPage();y=margin;}
   pdf.addImage(canvas.toDataURL('image/png'),'PNG',margin,y,usable,height,undefined,'FAST');y+=height+8;
 }
 const total=pdf.getNumberOfPages();for(let i=1;i<=total;i++){pdf.setPage(i);pdf.setFontSize(9);pdf.setTextColor('#536b7d');pdf.text(`RagabLabs | AnilineProduction Lab v1.0.0 | ${i} / ${total}`,margin,pageH-16);}
 saveBlob(pdf.output('blob'),`AnilineLab-${String(id).padStart(2,'0')}-${lang}.pdf`);
}
