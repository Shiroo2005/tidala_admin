import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { AxiosHeaders } from 'axios';
import { handleDemoRequest } from './.compiled/adapter.mjs';
import { seedDatabase, DATABASE_KEY, SCENARIO_KEY } from './.compiled/fixtures.mjs';
import { paginate, readDatabase } from './.compiled/store.mjs';
const memory=()=>{const values=new Map();return {getItem:k=>values.get(k)??null,setItem:(k,v)=>values.set(k,v),removeItem:k=>values.delete(k)};};
const request=(storage,url,method='get',data,params)=>handleDemoRequest({url,method,data,params,headers:new AxiosHeaders()},storage);
test('metadata fixtures conform to the supplied API schemas',()=>{
 const spec=JSON.parse(readFileSync('references/openapi.json','utf8'));
 for(const [collection,schema] of [['tags','TagResponse'],['levels','TrainingLevelResponse'],['provinces','ProvinceResponse'],['districts','DistrictResponse']]){
  const properties=spec.components.schemas[schema].properties;
  for(const row of seedDatabase()[collection])for(const [key,value] of Object.entries(row)){
   assert.ok(properties[key],`${schema}.${key} exists`);
   assert.equal(typeof value,properties[key].type==='integer'?'number':properties[key].type);
   if(properties[key].enum)assert.ok(properties[key].enum.includes(value));
   if(properties[key].format==='uuid')assert.match(value,/^[a-f0-9]{8}-(?:[a-f0-9]{4}-){3}[a-f0-9]{12}$/);
  }
 }
});
test('pagination, search, sort and combined teacher filters',()=>{
 const db=seedDatabase();
 assert.equal(paginate(db.teachers,{page:1,size:10}).content.length,10);
 assert.equal(paginate(db.teachers,{page:99,size:10}).content.length,0);
 const result=paginate(db.teachers,{filter:"(user.fullName~~'*Nguyễn*' or user.email~~'*Nguyễn*') and hasCurrentStudents:true",status:['ACTIVE'],trainingLevelIds:[db.levels[0].id],provinceIds:[db.provinces[0].id]});
 assert.ok(result.content.length);assert.ok(result.content.every(t=>t.fullName.includes('Nguyễn')&&t.status==='ACTIVE'&&t.hasCurrentStudents));
 assert.equal(paginate(db.teachers,{keyword:'not a person'}).totalElements,0);
 const sorted=paginate(db.teachers,{size:100,sort:['totalViews,desc']}).content;assert.ok(sorted[0].totalViews>sorted.at(-1).totalViews);
});
test('teacher invitation and profile edit persist; duplicate invite fails',()=>{
 const storage=memory();const invite=request(storage,'/admin/teachers/invite','post',{fullName:'Giáo viên mới',email:'new@example.com'});
 assert.equal(request(storage,`/admin/teachers/${invite.userId}`).status,'DRAFT');
 assert.throws(()=>request(storage,'/admin/teachers/invite','post',{fullName:'Duplicate',email:'new@example.com'}),/Email/);
 request(storage,`/admin/teachers/${invite.userId}/profile`,'put',{bio:'Updated locally',realPhotos:['data:image/png;base64,aGVsbG8=']});
 assert.equal(readDatabase(storage).teachers.find(t=>t.id===invite.userId).bio,'Updated locally');
});
test('sanctions and revocation update users and dashboard',()=>{
 const storage=memory(),id=seedDatabase().teachers[0].id;
 const before=request(storage,'/admin/stats/users').banned;
 request(storage,`/v1/admin/accounts/${id}/sanction`,'post',{type:'BAN',reason:{detail:'Demo reason'}});
 assert.equal(request(storage,'/admin/stats/users').banned,before+1);
 request(storage,`/v1/admin/accounts/${id}/unsanction`,'post',{});
 assert.equal(request(storage,`/admin/teachers/${id}`).status,'ACTIVE');
});
test('report resolution keeps history and status after reload',()=>{
 const storage=memory(),id=seedDatabase().reports[1].id;
 request(storage,`/admin/reports/${id}/resolve`,'post',{status:'RESOLVED',action:'WARNING_SENT',reason:'Reviewed'});
 const report=request(storage,`/admin/reports/${id}`);assert.equal(report.status,'RESOLVED');assert.equal(report.history[0].reason,'Reviewed');assert.ok(report.resolvedAt);
});
test('tag and training-level CRUD adapts contract enums for the existing UI',()=>{
 const storage=memory();const [tag]=request(storage,'/v1/tags/bulk','post',[{name:'Demo tag',type:'style'}]);
 assert.equal(readDatabase(storage).tags.find(t=>t.id===tag.id).type,'STYLE');
 request(storage,`/v1/tags/${tag.id}`,'put',{name:'Edited',type:'specialty'});
 assert.equal(request(storage,'/v1/tags').find(t=>t.id===tag.id).type,'specialty');
 request(storage,`/v1/tags/${tag.id}`,'delete');assert.ok(!request(storage,'/v1/tags').some(t=>t.id===tag.id));
 const [level]=request(storage,'/v1/training-levels/bulk','post',[{name:'D',description:'Demo level'}]);
 request(storage,`/v1/training-levels/${level.id}`,'put',{name:'D1'});
 assert.ok(request(storage,'/v1/training-levels').content.some(t=>t.name==='D1'));
 request(storage,`/v1/training-levels/${level.id}`,'delete');assert.ok(!readDatabase(storage).levels.some(t=>t.id===level.id));
});
test('post pin, unpin, deletion and charts share state',()=>{
 const storage=memory(),id=seedDatabase().posts[1].id;
 request(storage,`/v1/posts/${id}/pin`,'post');assert.ok(request(storage,`/v1/posts/${id}`).pinnedAt);
 request(storage,`/v1/posts/${id}/pin`,'delete');assert.equal(request(storage,`/v1/posts/${id}`).pinnedAt,null);
 request(storage,`/v1/posts/${id}`,'delete');assert.equal(request(storage,'/admin/stats/posts').total,23);assert.throws(()=>request(storage,`/v1/posts/${id}`));
});
test('empty/error scenarios, invalid storage and unsupported requests are explicit',()=>{
 const storage=memory();storage.setItem(DATABASE_KEY,'invalid');assert.equal(readDatabase(storage).teachers.length,32);
 storage.setItem(SCENARIO_KEY,'empty');assert.equal(request(storage,'/admin/teachers').totalElements,0);
 storage.setItem(SCENARIO_KEY,'error');assert.throws(()=>request(storage,'/admin/teachers'),/Lỗi mô phỏng/);
 storage.removeItem(SCENARIO_KEY);assert.throws(()=>request(storage,'/unsupported'),/Demo chưa hỗ trợ/);
});
test('storage quota failure does not report a successful mutation',()=>{
 const storage=memory();readDatabase(storage);storage.setItem=()=>{throw new Error('Quota exceeded');};
 assert.throws(()=>request(storage,'/admin/teachers/invite','post',{fullName:'Failure',email:'quota@example.com'}),/Quota/);
});
