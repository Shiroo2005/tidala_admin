import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
const base=process.env.ADMIN_URL||'http://localhost:3000';
const reference=process.env.REFERENCE_URL||'http://127.0.0.1:5175';
const browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{}),args:['--no-sandbox']});
const pages=await Promise.all([browser.newPage(),browser.newPage()]);
const errors=[];pages.forEach(page=>page.on('pageerror',e=>errors.push(e.message)));

const routes=['tong-quan','giao-vien','hoc-vien','nguoi-dung','cap-dao-tao','bai-viet','bao-cao','cai-dat','giao-vien/moi','giao-vien/0198d1f5-1b44-7e08-0006-000000000001','giao-vien/0198d1f5-1b44-7e08-0006-000000000001/chinh-sua','bai-viet/0198d1f5-1b44-7e08-0010-000000000001'];
await mkdir('artifacts/visual/reference',{recursive:true});await mkdir('artifacts/visual/candidate',{recursive:true});
const results=[];
try{
 for(const width of (process.env.ONLY_DASHBOARD ? [1440] : [390,1440,767,768,1023,1024])){
  await Promise.all(pages.map(p=>p.setViewportSize({width,height:1000})));
  for(const route of (!process.env.ONLY_DASHBOARD && [390,1440].includes(width)?routes:['tong-quan'])){
   const file=width+'-'+route.replaceAll('/','_')+'.png';
   for (const [i,p] of pages.entries()) {
    await p.bringToFront();
    await p.goto((i?reference:base)+'/quan-tri/'+route);
    await p.waitForFunction(()=>document.body.innerText.length>100);
    await p.evaluate(()=>document.fonts.ready);
    await p.waitForTimeout(4000);
    await p.screenshot({path:`artifacts/visual/${i?'reference':'candidate'}/${file}`,animations:'disabled'});
   }
   assert.deepEqual(errors,[]);results.push({width,route,file});console.log(file);
  }
 }
 await writeFile(process.env.ONLY_DASHBOARD ? 'artifacts/visual/dashboard-recheck.json' : 'artifacts/visual/routes.json',JSON.stringify(results,null,2));
}finally{await browser.close();}
