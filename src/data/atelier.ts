import { bi } from '../engine/types';
export const ATELIER={
 name:bi('Organic Synthesis Atelier','أتيليه التخليق العضوي'),workspace:bi('Synthesis Research Workspace','مساحة أبحاث التخليق'),
 subtitle:bi('From Benzene to Aniline — Explore Industrial Organic Synthesis','من البنزين إلى الأنيلين — استكشف التخليق العضوي الصناعي'),
 description:bi('An interactive scientific laboratory for benzene nitration, nitrobenzene recovery, catalytic hydrogenation, and industrial aniline production calculations.','مختبر علمي تفاعلي لحسابات نترتة البنزين واسترجاع النيتروبنزين والهدرجة الحفزية وإنتاج الأنيلين الصناعي.'),
 index:bi('A research index, built around the chemistry.','فهرس بحثي يبدأ من الكيمياء.'),indexIntro:bi('Twenty calculators. Five connected disciplines. Select a chapter or search for the calculation you need.','عشرون حاسبة وخمسة تخصصات مترابطة. اختر فصلًا أو ابحث عن الحساب الذي تحتاجه.'),
 notebook:bi('The reaction notebook','دفتر التفاعلات'),scheme:bi('Reaction scheme','مخطط التفاعل'),step1:bi('Benzene nitration','نترتة البنزين'),step2:bi('Nitrobenzene hydrogenation','هدرجة النيتروبنزين'),
 phase1:bi('Follow benzene into nitrobenzene. Examine feed stoichiometry, conversion and the mixed-acid composition in the material balance.','تتبّع انتقال البنزين إلى النيتروبنزين، وافحص ستوكيومترية التغذية والتحويل وتركيب الأحماض المختلطة في ميزان المادة.'),
 phase2:bi('Follow the nitro group into the amino group. Explore hydrogen consumption, aniline yield and a component-balanced hydrogen recycle.','تتبّع تحول مجموعة النيترو إلى مجموعة الأمين، واستكشف استهلاك الهيدروجين ومردود الأنيلين وتدوير الهيدروجين بموازين مكوّنات واضحة.'),
 related:bi('Continue the investigation','تابع الاستكشاف'),formulaGuide:bi('Molecular structures','التراكيب الجزيئية'),nitro:bi('Nitro group · NO₂','مجموعة النيترو · NO₂'),amino:bi('Amino group · NH₂','مجموعة الأمين · NH₂'),
 parameters:bi('Parameters','مدخلات'),chapter:bi('CHAPTER','الفصل'),
 referenceNote:bi('Equations, assumptions and sources stay with every calculation.','المعادلات والفرضيات والمصادر ترافق كل حساب.'),
 routeLabel:bi('The complete synthesis route','مسار التخليق المتكامل'),routeIntro:bi('Connect the two reactions, account for separation losses and follow every external stream.','اربط التفاعلين، واحسب فقد الفصل وتتبّع كل تيار خارجي.'),
 navSearch:bi('Find a calculator','ابحث عن حاسبة'),navEmpty:bi('No calculator matches this search.','لا توجد حاسبة تطابق هذا البحث.'),
 skip:bi('Skip to the laboratory','انتقل إلى المختبر'),overview:bi('Research overview','نظرة علمية'),equation:bi('Reaction & calculation basis','التفاعل وأساس الحساب'),
 dataEntry:bi('Define the experiment','حدّد بيانات المسألة'),reading:bi('Read the outcome','اقرأ النتائج'),analysis:bi('Explore the response','استكشف العلاقة'),notes:bi('Research notes','الملاحظات العلمية'),
 resultsIntro:bi('Your primary findings, followed by the complete numerical record.','النتائج الأساسية أولًا، يليها السجل العددي الكامل.'),
 returnToInputs:bi('Edit the inputs','تعديل المدخلات'),jumpResults:bi('View the results','عرض النتائج'),jumpInputs:bi('Input parameters','مدخلات الحساب'),jumpChart:bi('Scientific visualization','التصوير العلمي'),jumpNotes:bi('Assumptions & sources','الفرضيات والمصادر'),
 stage:bi('Synthesis stage','مرحلة التخليق'),record:bi('Calculation record','سجل الحساب'),export:bi('Keep a copy of your work','احتفظ بنسخة من حسابك'),
 reagent:bi('Reagent structure','تركيب المتفاعل'),nitric:bi('Nitric acid','حمض النيتريك'),sulfuric:bi('Sulfuric acid','حمض الكبريتيك'),hydrogen:bi('Hydrogen','الهيدروجين'),
 organic:bi('Organic phase','الطور العضوي'),acid:bi('Acid phase','الطور الحمضي'),
};
export const CHAPTER_NOTES=[
 bi('Start with the aromatic ring. Balance the feed and distinguish conversion from isolated yield.','ابدأ بالحلقة العطرية، ووازن التغذية وافصل بين التحويل ومردود العزل.'),
 bi('Resolve acid strength, feed water and the composition of the final aqueous phase.','حلّل تركيز الحمض وماء التغذية وتركيب الطور المائي النهائي.'),
 bi('Follow the product through the phase split and every stage of recovery.','تتبّع المنتج خلال فصل الأطوار وكل مرحلة استرجاع.'),
 bi('Replace the nitro group with an amino group and trace the hydrogen balance.','تتبّع تحول مجموعة النيترو إلى مجموعة أمين ووازن الهيدروجين.'),
 bi('Connect the entire route in a single, traceable external material balance.','اربط المسار كاملًا داخل ميزان مادة خارجي واحد يمكن تتبّعه.'),
];
export const CHART_PALETTES=[
 {primary:'#50663B',secondary:'#986323',fill:'#E8EDE2'},
 {primary:'#80561F',secondary:'#50663B',fill:'#F4ECDF'},
 {primary:'#526A58',secondary:'#986323',fill:'#E8EDE2'},
 {primary:'#445A37',secondary:'#986323',fill:'#E8EDE2'},
 {primary:'#28332D',secondary:'#80561F',fill:'#E8EDE2'},
];
