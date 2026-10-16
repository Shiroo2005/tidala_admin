import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
const base=process.env.ADMIN_URL||'http://localhost:3000';
const browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{}),args:['--no-sandbox']});
const context=await browser.newContext({viewport:{width:1440,height:1000}});
const page=await context.newPage();

const errors=[],external=[],results=[];
page.on('pageerror',e=>errors.push(e.message));
page.on('request',req=>{if(['fetch','xhr','websocket'].includes(req.resourceType())&&!req.url().startsWith(base))external.push(req.url());});
await mkdir('artifacts/screenshots',{recursive:true});
const teacher='0198d1f5-1b44-7e08-0006-000000000001',post='0198d1f5-1b44-7e08-0010-000000000001';
const routes=['tong-quan','giao-vien','hoc-vien','nguoi-dung','cap-dao-tao','bai-viet','bao-cao','cai-dat','giao-vien/moi',`giao-vien/${teacher}`,`giao-vien/${teacher}/chinh-sua`,`bai-viet/${post}`,'danh-gia','ca-nhan'];
async function go(route){await page.goto(base+route);await page.waitForTimeout(650);}
try {
 for(const width of (process.env.WORKFLOWS_ONLY ? [] : [390,768,1440])){
  await page.setViewportSize({width,height:1000});
  for(const route of routes){
   await go('/quan-tri/'+route);
   const body=await page.locator('body').innerText();
   assert.ok(body.length>100,route+' rendered');
   assert.ok(!body.includes('Unexpected Application Error'),route+' no route error');
   assert.ok(!body.includes('Demo chưa hỗ trợ'),route+' supported');
   assert.deepEqual(errors,[],route+' no browser exception');
   const screenshot=`${width}-${route.replaceAll('/','_')}.png`;
   await page.screenshot({path:'artifacts/screenshots/'+screenshot,animations:'disabled'});
   results.push({width,route,screenshot});
  }
 }
 for(const width of [767,1023,1024]){await page.setViewportSize({width,height:1000});await go('/quan-tri/tong-quan');await page.screenshot({path:`artifacts/screenshots/${width}-breakpoint.png`,animations:'disabled'});}
 await page.setViewportSize({width:1440,height:1000});
 await go('/quan-tri/giao-vien');
 const search=page.getByPlaceholder(/Tìm/).last();await search.fill('Nguyễn');await page.waitForTimeout(800);
 assert.match(await page.locator('body').innerText(),/Nguyễn Văn An/);
 await search.fill('no-such-teacher');await page.waitForTimeout(800);assert.ok(!(await page.locator('body').innerText()).includes('giaovien1@example.com'));
 await go('/quan-tri/giao-vien/moi');
 await page.getByPlaceholder(/họ.*tên/i).fill('Giáo viên Demo Browser');
 await page.getByPlaceholder(/email/i).fill('browser@tidala.demo');
 await page.getByRole('button',{name:'Tạo giáo viên',exact:true}).click();
 await page.getByText('Tạo tài khoản thành công!',{exact:true}).waitFor();
 await page.reload();await page.waitForTimeout(500);
 assert.ok(await page.evaluate(()=>JSON.parse(localStorage.getItem('tidala-admin-demo.database.v1')).teachers.some(t=>t.email==='browser@tidala.demo')));
 await go(`/quan-tri/giao-vien/${teacher}/chinh-sua`);
 await page.getByPlaceholder('VD: Thầy Minh – 10 năm kinh nghiệm, chuyên dạy lái xe B2').fill('Giáo viên tận tâm — cập nhật từ bản demo');
 await page.getByRole('button',{name:'Lưu thay đổi',exact:true}).first().click();await page.waitForTimeout(750);
 assert.equal(await page.evaluate(id=>JSON.parse(localStorage.getItem('tidala-admin-demo.database.v1')).teachers.find(t=>t.id===id).bio,teacher),'Giáo viên tận tâm — cập nhật từ bản demo');
 await go(`/quan-tri/giao-vien/${teacher}/chinh-sua`);
 assert.equal(await page.getByPlaceholder('VD: Thầy Minh – 10 năm kinh nghiệm, chuyên dạy lái xe B2').inputValue(),'Giáo viên tận tâm — cập nhật từ bản demo');
 await go(`/quan-tri/giao-vien/${teacher}`);
 await page.getByText('Xem tất cả 3 đánh giá',{exact:true}).click();await page.waitForTimeout(500);
 assert.equal(await page.getByText('Giáo viên hướng dẫn rõ ràng, kiên nhẫn và rất tận tâm.',{exact:true}).count(),3);
 await page.screenshot({path:'artifacts/screenshots/reviews-panel.png',animations:'disabled'});
 await go('/quan-tri/bao-cao');
 await page.getByTitle('Xem chi tiết',{exact:true}).first().click();await page.waitForTimeout(650);
 assert.ok(await page.getByRole('dialog').count());
 await page.screenshot({path:'artifacts/screenshots/report-dialog.png',animations:'disabled'});
 await go('/quan-tri/ca-nhan');await page.getByRole('button',{name:'Đăng xuất',exact:true}).last().click();
 await page.waitForURL('**/dang-nhap');
 await page.locator('input[name="email"]:visible').fill('admin@tidala.demo');
 await page.locator('input[name="password"]:visible').fill('wrong');
 await page.getByRole('button',{name:'Đăng nhập',exact:true}).click();
 await page.getByText('Email hoặc mật khẩu không đúng',{exact:true}).filter({visible:true}).waitFor();
 await page.locator('input[name="password"]:visible').fill('TidalaDemo123!');
 await page.getByRole('button',{name:'Đăng nhập',exact:true}).click();await page.waitForURL('**/quan-tri/tong-quan');
 await page.evaluate(()=>localStorage.setItem('tidala-admin-demo.scenario','empty'));await go('/quan-tri/giao-vien');
 assert.ok(!(await page.locator('body').innerText()).includes('giaovien1@example.com'));
 await page.evaluate(()=>localStorage.setItem('tidala-admin-demo.scenario','error'));await go('/quan-tri/tong-quan');await page.waitForTimeout(1600);
 await page.screenshot({path:'artifacts/screenshots/error-state.png'});
 await page.evaluate(()=>localStorage.removeItem('tidala-admin-demo.scenario'));await page.reload();await page.getByText('Tổng số Giáo viên',{exact:true}).waitFor({timeout:15000});
 assert.match(await page.locator('body').innerText(),/TỔNG SỐ GIÁO VIÊN/);
 assert.deepEqual(errors,[]);assert.deepEqual(external,[]);
 await writeFile('artifacts/browser-results.json',JSON.stringify({passed:true,screens:results,workflows:['search','invitation','teacher edit and reload','review panel','report dialog','logout','invalid login','login','empty state','error recovery'],externalRequests:external,errors},null,2));
 console.log(`PASS: ${results.length} responsive route checks; workflows; zero external API requests.`);
} catch(error){await page.screenshot({path:'artifacts/failure.png'});await writeFile('artifacts/failure.txt',String(error)+'\n'+await page.locator('body').innerText());throw error;}
finally{await browser.close();}
