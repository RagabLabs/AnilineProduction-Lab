import { test, expect } from '@playwright/test';
import { readFile, stat } from 'node:fs/promises';
import { CALCULATORS, example } from '../../src/data/calculators';
import { calculate, type Lang } from '../../src/engine';
import { t, valueLabel } from '../../src/data/strings';
for(const lang of ['en','ar'] as Lang[]){
 for(const spec of CALCULATORS){
  test(`${lang} · calculator ${String(spec.id).padStart(2,'0')} loads, calculates, plots and fits`,async({page})=>{
   const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
   await page.addInitScript(l=>localStorage.setItem('aniline-lab-language',l),lang);
   await page.goto(`#/calculator/${spec.id}`);
   await expect(page.locator('.lab-heading h1')).toHaveText(spec.title[lang]);
   await page.getByTestId('calculate').click();
   const expected=calculate(spec.id,example(spec));
   for(const m of spec.metrics.filter(m=>m.primary))await expect(page.getByTestId('result-'+m.key)).toContainText(valueLabel(expected.values[m.key],lang));
   await expect(page.locator('.solution-steps>li')).toHaveCount(expected.steps.length);
   await expect(page.locator('.katex-error')).toHaveCount(0);
   await expect(page.locator('[data-testid="sensitivity-chart"] .recharts-cartesian-grid')).toBeAttached();
   if([5,18].includes(spec.id))await expect(page.locator('[data-testid="yield-comparison"] .recharts-bar-rectangle')).toHaveCount(3);
   await expect(page.locator('[data-testid="sensitivity-chart"] .recharts-line-curve').first()).toBeAttached();
   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+2)).toBe(true);
   expect(errors).toEqual([]);
  });
 }
 test(`${lang} · CSV exports include inputs, numeric outputs, assumptions and references`,async({page},info)=>{
  await page.addInitScript(l=>localStorage.setItem('aniline-lab-language',l),lang);await page.goto('#/calculator/20');
  const download=page.waitForEvent('download');await page.getByTestId('export-csv').click();const file=await download;expect(file.suggestedFilename()).toBe(`AnilineLab-20-${lang}.csv`);
  const path=info.outputPath(`results-${lang}.csv`);await file.saveAs(path);const csv=await readFile(path,'utf8');
  expect(csv).toContain(t('parameters',lang));expect(csv).toContain(t('assumptions',lang));expect(csv).toContain(t('references',lang));expect(csv).toContain('CIAAW');expect(csv).toContain(String(calculate(20,example(CALCULATORS[19])).values.anActual));
 });
 test(`${lang} · chart PNG is a real downloadable image`,async({page},info)=>{
  await page.addInitScript(l=>localStorage.setItem('aniline-lab-language',l),lang);await page.goto('#/calculator/15');await page.evaluate(()=>document.fonts.ready);
  const download=page.waitForEvent('download');await page.getByTestId('export-png').click();const file=await download;const path=info.outputPath(`chart-${lang}.png`);await file.saveAs(path);const bytes=await readFile(path);expect([...bytes.subarray(0,8)]).toEqual([137,80,78,71,13,10,26,10]);expect(bytes.length).toBeGreaterThan(10000);
 });
}
test('Arabic PDF exports the full integrated report with embedded rendered text',async({page},info)=>{
 test.setTimeout(180000);await page.addInitScript(()=>localStorage.setItem('aniline-lab-language','ar'));await page.goto('#/calculator/20');
 const download=page.waitForEvent('download',{timeout:160000});await page.getByTestId('export-pdf').click();const file=await download;expect(file.suggestedFilename()).toBe('AnilineLab-20-ar.pdf');const path=info.outputPath('integrated-ar.pdf');await file.saveAs(path);expect((await readFile(path)).subarray(0,5).toString()).toBe('%PDF-');expect((await stat(path)).size).toBeGreaterThan(20000);
});
test('language selection persists and applies RTL / LTR',async({page})=>{
 await page.goto('#/calculator/1');await page.evaluate(()=>localStorage.setItem('aniline-lab-language','en'));await page.reload();await expect(page.locator('html')).toHaveAttribute('dir','ltr');await page.getByTestId('language-toggle').click();await expect(page.locator('html')).toHaveAttribute('dir','rtl');await page.reload();await expect(page.locator('html')).toHaveAttribute('lang','ar');await expect(page.locator('.lab-heading h1')).toHaveText(CALCULATORS[0].title.ar);
});
test('all 20 cards, group filters and search work on the library',async({page})=>{
 await page.addInitScript(()=>localStorage.setItem('aniline-lab-language','en'));await page.goto('#/');await expect(page.locator('.calculator-card')).toHaveCount(20);await page.getByRole('button',{name:'Mixed acids 5',exact:true}).click();await expect(page.locator('.calculator-card')).toHaveCount(5);await page.getByRole('button',{name:'All calculators 20',exact:true}).click();await page.getByRole('textbox',{name:t('search','en')}).fill('recycle');await expect(page.getByTestId('calculator-19')).toBeVisible();await page.getByRole('button',{name:'Clear search'}).click();await expect(page.locator('.calculator-card')).toHaveCount(20);
});
test('invalid input, stale export guard, reset and load-example all work',async({page})=>{
 await page.addInitScript(()=>localStorage.setItem('aniline-lab-language','en'));await page.goto('#/calculator/1');await page.getByTestId('field-benzene').fill('-1');await expect(page.getByTestId('export-csv')).toBeDisabled();await page.getByTestId('calculate').click();await expect(page.getByTestId('calculation-error')).toContainText('Negative');await page.getByTestId('load-example').click();await expect(page.getByTestId('calculation-error')).toHaveCount(0);await expect(page.getByTestId('export-csv')).toBeEnabled();await page.getByTestId('reset').click();await expect(page.getByTestId('result-grid')).toHaveCount(0);await expect(page.getByTestId('field-benzene')).toHaveValue('');await page.getByTestId('load-example').click();await expect(page.getByTestId('result-grid')).toBeVisible();
});
test('changing units preserves quantity even with a mass-purity correction',async({page})=>{
 await page.addInitScript(()=>localStorage.setItem('aniline-lab-language','en'));await page.goto('#/calculator/1');await page.getByTestId('field-bp').fill('80');await page.getByTestId('calculate').click();const original=await page.getByTestId('result-nbActual').textContent();await page.getByTestId('unit-benzene').selectOption('kmol');expect(Number(await page.getByTestId('field-benzene').inputValue())).toBeCloseTo(80/78.114,9);await page.getByTestId('calculate').click();expect(await page.getByTestId('result-nbActual').textContent()).toBe(original);
});
test('scenario slider uses real calculations and hourly basis updates units',async({page})=>{
 await page.addInitScript(()=>localStorage.setItem('aniline-lab-language','en'));await page.goto('#/calculator/16');await page.getByRole('button',{name:'Flows per hour',exact:true}).click();await expect(page.getByTestId('result-hydrogenMass')).toContainText('kg/h');const slider=page.getByRole('slider',{name:'Scenario'});await slider.fill('0');await expect(page.locator('.scenario-value')).toContainText('0 kg/h');
});
test('copy-results writes the calculation report to the clipboard',async({page,context})=>{
 await context.grantPermissions(['clipboard-read','clipboard-write']);await page.addInitScript(()=>localStorage.setItem('aniline-lab-language','en'));await page.goto('#/calculator/1');await page.getByTestId('export-copy').click();await expect(page.getByRole('status').last()).toContainText('Results copied');expect(await page.evaluate(()=>navigator.clipboard.readText())).toContain('Benzene nitration stoichiometry');
});
test('production assets load under the repository subpath with no 404s',async({page})=>{
 const failures:string[]=[];page.on('response',r=>{if(r.status()>=400)failures.push(`${r.status()} ${r.url()}`);});await page.goto('#/');await page.evaluate(()=>document.fonts.ready);await expect(page.locator('h1')).toContainText('AnilineProduction');await page.getByRole('link',{name:t('science','ar'),exact:true}).first().click();await expect(page.locator('table tbody tr')).toHaveCount(9);expect(failures).toEqual([]);
});
