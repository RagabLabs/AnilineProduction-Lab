import {test,expect,type Page} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {CALCULATORS,example} from '../../src/data/calculators';
import {calculate,type Lang} from '../../src/engine';
import {valueLabel} from '../../src/data/strings';

const widths=[360,390,768,1024,1440];
const representatives=[1,7,11,15,20,5,18];
async function ready(page:Page){await page.evaluate(()=>document.fonts.ready);}
async function fits(page:Page){
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2)).toBe(true);
 const clipped=await page.evaluate(()=>{
  const selectors='.hero h1,.hero h2,.hero-copy>p,.notebook-heading,.route-overview,.scheme-compound,.calculator-entry h4,.calculator-entry>p,.lab-heading h1,.lab-heading p,.field label,.quantity-input,.field>select,.metric-card,.metric-value,.export-bar button,.workspace-wayfinding button,.science-page h1';
  const issues:string[]=[];
  for(const el of document.querySelectorAll<HTMLElement>(selectors)){
   const box=el.getBoundingClientRect();if(!box.width||!box.height)continue;
   const bounds=[box];
   if(el.matches('h1,h2,h4,p,label,.metric-value')){const range=document.createRange();range.selectNodeContents(el);bounds.push(...Array.from(range.getClientRects()));}
   if(bounds.some(r=>r.left < -1.5 || r.right>innerWidth+1.5))issues.push(el.className+' '+(el.textContent??'').slice(0,65));
  }return issues;
 });
 expect(clipped,'readable text and controls must stay inside the viewport').toEqual([]);
}
for(const lang of ['en','ar'] as Lang[]){
 for(const width of widths){
  test(`${lang} · redesign at ${width}px: pathway, five disciplines, comparison charts and science`,async({page})=>{
   await page.setViewportSize({width,height:1000});
   await page.addInitScript(l=>localStorage.setItem('aniline-lab-language',l),lang);
   await page.goto('#/');await ready(page);
   await expect(page.locator('.calculator-card')).toHaveCount(20);await fits(page);
   await expect(page.locator('.research-strip .reagent-molecule').first()).toHaveCSS('direction','ltr');
   await page.getByTestId('reaction-stage-2').click();
   await expect(page.getByTestId('reaction-stage-2')).toHaveAttribute('aria-pressed','true');
   await expect(page.locator('.related-calculators a').first()).toHaveAttribute('href','#/calculator/15');
   await expect(page.locator('.scheme-visual .aniline')).toBeVisible();await fits(page);
   for(const id of representatives){
    const spec=CALCULATORS[id-1];await page.goto(`#/calculator/${id}`);
    await expect(page.locator('.lab-heading h1')).toHaveText(spec.title[lang]);await ready(page);
    await page.getByTestId('calculate').click();
    const result=calculate(id,example(spec));
    for(const metric of spec.metrics.filter(m=>m.primary))await expect(page.getByTestId('result-'+metric.key)).toContainText(valueLabel(result.values[metric.key],lang));
    await expect(page.locator('[data-testid="sensitivity-chart"] .recharts-line-curve').first()).toBeAttached();
    await expect(page.locator('.katex-error')).toHaveCount(0);
    expect(await page.locator('.quantity-input input').first().evaluate(e=>parseFloat(getComputedStyle(e).fontSize))).toBeGreaterThanOrEqual(19);
    expect(await page.locator('.metric-card.primary .metric-value').first().evaluate(e=>parseFloat(getComputedStyle(e).fontSize))).toBeGreaterThanOrEqual(34);
    await fits(page);
   }
   await page.goto('#/science');await expect(page.locator('table tbody tr')).toHaveCount(9);await ready(page);await fits(page);
  });
 }
 test(`${lang} · WCAG A/AA automated audit: home, scientific basis and seven calculator workspaces`,async({page},info)=>{
  test.setTimeout(120000);
  await page.addInitScript(l=>localStorage.setItem('aniline-lab-language',l),lang);
  for(const route of ['#/','#/science',...representatives.map(id=>`#/calculator/${id}`)]){
   await page.goto(route);await expect(page.getByRole('heading',{level:1})).toBeVisible();await ready(page);
   const results=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();
   await info.attach(`${lang}-${route.replace(/[^a-z0-9]/gi,'_')}-axe`,{body:JSON.stringify({route,violations:results.violations,incomplete:results.incomplete.map(r=>({id:r.id,description:r.description}))}),contentType:'application/json'});
   expect(results.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))})),route).toEqual([]);
  }
 });
 test(`${lang} · long equations can be scrolled from the keyboard at 360px`,async({page})=>{
  await page.setViewportSize({width:360,height:844});
  await page.addInitScript(l=>localStorage.setItem('aniline-lab-language',l),lang);
  await page.goto('#/');await ready(page);await page.getByTestId('reaction-stage-2').click();
  const equation=page.locator('.notebook-equation .equation');
  await expect(equation).toHaveAttribute('tabindex','0');await equation.focus();await page.keyboard.press('ArrowRight');
  await expect.poll(()=>equation.evaluate(el=>el.scrollLeft)).toBeGreaterThan(0);
 });
 test(`${lang} · print-width equations and complete PDF blocks fit all 20 reports`,async({page})=>{
  await page.addInitScript(l=>localStorage.setItem('aniline-lab-language',l),lang);
  for(const spec of CALCULATORS){
   await page.goto(`#/calculator/${spec.id}`);await expect(page.locator('.lab-heading h1')).toHaveText(spec.title[lang]);await ready(page);
   const issues=await page.locator('.pdf-report').evaluate(report=>Array.from(report.querySelectorAll<HTMLElement>('.equation,.pdf-block')).flatMap(el=>el.scrollWidth>el.clientWidth+2||el.classList.contains('pdf-block')&&el.getBoundingClientRect().height>1160?[{class:el.className,width:el.clientWidth,scroll:el.scrollWidth,height:el.getBoundingClientRect().height}]:[]));
   expect(issues,`calculator ${spec.id} must export complete equations and printable blocks`).toEqual([]);
  }
 });
 test(`${lang} · keyboard pathway, skip link, navigation, section jumps and invalid-input focus`,async({page},info)=>{
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.addInitScript(l=>localStorage.setItem('aniline-lab-language',l),lang);
  await page.goto('#/');await page.keyboard.press('Tab');await expect(page.locator('.skip-link')).toBeFocused();
  await page.keyboard.press('Enter');await expect(page.locator('#main-content')).toBeFocused();
  await page.getByTestId('reaction-stage-2').focus();await page.keyboard.press('Enter');
  await expect(page.getByTestId('reaction-stage-2')).toHaveAttribute('aria-pressed','true');
  await page.locator('.related-calculators a').first().focus();await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/calculator\/15$/);
  if(info.project.name==='desktop'){
   await page.locator('.sidebar-search input').fill('01');
   await page.locator('.lab-sidebar nav a').first().focus();await page.keyboard.press('Enter');
  }else await page.locator('#calculator-picker').selectOption('1');
  await expect(page).toHaveURL(/calculator\/1$/);
  await page.locator('.workspace-wayfinding button').first().focus();await page.keyboard.press('Enter');
  await expect(page.locator('#research-inputs')).toBeFocused();
  await page.getByTestId('field-benzene').fill('-1');await page.getByTestId('calculate').click();
  await expect(page.getByTestId('field-benzene')).toBeFocused();
  await expect(page.getByTestId('field-benzene')).toHaveAttribute('aria-invalid','true');
  await page.getByTestId('load-example').click();
  await page.locator('.workspace-wayfinding button').nth(1).focus();await page.keyboard.press('Enter');
  await expect(page.locator('#research-results')).toBeFocused();
  await page.locator('.workspace-wayfinding button').nth(3).focus();await page.keyboard.press('Enter');
  await expect(page.locator('#research-notes')).toBeFocused();
 });
 for(const browserWidth of [1024,1440]){
  test(`${lang} · 200% browser-zoom reflow equivalent at ${browserWidth}px`,async({page})=>{
   await page.addInitScript(l=>localStorage.setItem('aniline-lab-language',l),lang);
   const session=await page.context().newCDPSession(page);
   await session.send('Emulation.setDeviceMetricsOverride',{width:browserWidth/2,height:600,deviceScaleFactor:2,mobile:false,screenWidth:browserWidth,screenHeight:1200});
   for(const route of ['#/','#/calculator/7','#/calculator/20','#/science']){
    await page.goto(route);await expect(page.getByRole('heading',{level:1})).toBeVisible();await ready(page);
    expect(await page.evaluate(()=>innerWidth)).toBe(browserWidth/2);
    expect(await page.evaluate(()=>devicePixelRatio)).toBe(2);await fits(page);
    if(route.includes('calculator')){await page.getByTestId('calculate').click();await expect(page.getByTestId('result-grid')).toBeVisible();await fits(page);}
   }
   await session.detach();
  });
 }
}
