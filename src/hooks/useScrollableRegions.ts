import {useEffect} from 'react';

/** Give overflowing scientific content a keyboard stop, while keeping export-only
 * reports out of the tab sequence. This hook changes presentation attributes only. */
export function useScrollableRegions(){
 useEffect(()=>{
  let frame=0;
  function update(){
   document.querySelectorAll<HTMLElement>('.pdf-report').forEach(el=>{el.inert=true;});
   document.querySelectorAll<HTMLElement>('.equation,.table-scroll,.process-svg-scroll').forEach(el=>{
    const scrollable=el.clientWidth>0&&el.scrollWidth>el.clientWidth+1&&!el.closest('[aria-hidden="true"]');
    if(scrollable)el.tabIndex=0;else el.removeAttribute('tabindex');
   });
  }
  function schedule(){cancelAnimationFrame(frame);frame=requestAnimationFrame(update);}
  const observer=new MutationObserver(schedule);
  observer.observe(document.querySelector('.app')??document.body,{subtree:true,childList:true});
  window.addEventListener('resize',schedule);void document.fonts.ready.then(schedule);schedule();
  return()=>{cancelAnimationFrame(frame);observer.disconnect();window.removeEventListener('resize',schedule);};
 },[]);
}
