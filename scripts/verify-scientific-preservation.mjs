import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {resolve,dirname} from 'node:path';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const read=path=>readFile(resolve(root,path));
const sha=data=>createHash('sha256').update(data).digest('hex');
const manifest=JSON.parse(await read('docs/UI-SCIENTIFIC-PRESERVATION.json'));
const failures=[];
for(const [file,expected] of Object.entries(manifest.protected_files_unchanged)){
 if(sha(await read(file))!==expected)failures.push(file);
}
if(sha(await read('tests/fixtures/ui-v1-scientific-baseline.json'))!==manifest.baseline_fixture_sha256)failures.push('scientific baseline fixture');
const sections=[
 ['src/components/Sensitivity.tsx',' const {vary,output,secondary}',' const palette=','Sensitivity calculation and chart data'],
 ['src/components/Calculator.tsx','function purityKey',' const [navigationQuery','Calculator input state, conversion, validation, calculation and export callbacks'],
 ['src/components/ProductComparison.tsx',' const keys=',' const colors=','Product comparison data mapping'],
];
for(const [file,start,end,key] of sections){
 const source=(await read(file)).toString();
 const begin=source.indexOf(start),finish=source.indexOf(end,begin);
 if(begin<0||finish<0||sha(source.slice(begin,finish))!==manifest.shared_calculation_fragments_unchanged[key])failures.push(key);
}
if(failures.length){console.error('Scientific preservation verification failed:',failures);process.exitCode=1;}
else console.log('Preserved: 17 original files, 3 calculation/data fragments, and the 1170-case v1 baseline fixture.');
