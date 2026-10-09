import {test} from 'node:test';
import assert from 'node:assert/strict';
import {parseMessage,searchAssistant,extractWithAI,validateFilters} from './assistant.mjs';
import {emptyFilters,matchesFilters} from './public/search.js';

test('Turkish ranges, shared suffixes and brand origins',()=>{
 const {filters}=parseMessage('1–3 milyon TL, 40–80 bin km, Alman otomatik');
 assert.equal(filters.minPrice,1000000);assert.equal(filters.maxPrice,3000000);
 assert.equal(filters.minKm,40000);assert.equal(filters.maxKm,80000);
 assert.equal(filters.origin,'Alman');assert.equal(filters.gear,'Otomatik');
 const japanese=parseMessage('En fazla 1,5 milyon TL, 100 bin km altında Japon otomatik').filters;
 assert.equal(japanese.minPrice,null);assert.equal(japanese.maxPrice,1500000);assert.equal(japanese.maxKm,100000);assert.equal(japanese.origin,'Japon');
});
test('Thousands separators, different units, explicit dimensions and year ranges',()=>{
 const filters=parseMessage('900 bin - 1,5 milyon TL, 50.000-100.000 km, 2020-2024 model').filters;
 assert.equal(filters.minPrice,900000);assert.equal(filters.maxPrice,1500000);assert.equal(filters.minKm,50000);assert.equal(filters.maxKm,100000);assert.equal(filters.minYear,2020);assert.equal(filters.maxYear,2024);
 const reversed=parseMessage('50–100 bin km ve 1–2 milyon TL').filters;
 assert.equal(reversed.maxPrice,2000000);assert.equal(reversed.maxKm,100000);
 const prefixed=parseMessage('Kilometre en fazla 80 bin, bütçe 1,5 milyon').filters;
 assert.equal(prefixed.maxKm,80000);assert.equal(prefixed.maxPrice,1500000);
});
test('Follow-ups retain previous intent and can remove constraints',()=>{
 const first=parseMessage('Japon otomatik 50–100 bin km, 1–2 milyon TL').filters;
 const second=parseMessage('Bütçeyi 1,8 milyona çıkar',first).filters;
 assert.equal(second.maxPrice,1800000);assert.equal(second.origin,'Japon');assert.equal(second.minKm,50000);assert.equal(second.gear,'Otomatik');
 assert.equal(parseMessage('Kilometre sınırını kaldır',second).filters.maxKm,null);
 assert.equal(parseMessage('Şehir fark etmez', {...second,city:'İstanbul'}).filters.city,null);
 assert.deepEqual(parseMessage('Yeni arama',second).filters,emptyFilters());
});
test('City, sorting, minimum bounds and contradictory bounds',()=>{
 const filters=parseMessage("İstanbul'da Alman sedan, en az 50 bin km, 100 bin km altında, en ucuz").filters;
 assert.equal(filters.city,'İstanbul');assert.equal(filters.sort,'price-asc');assert.equal(filters.body,'Sedan');assert.equal(filters.minKm,50000);assert.equal(filters.maxKm,100000);
 assert.throws(()=>parseMessage('100–50 bin km'),/Alt sınır/);
 assert.throws(()=>validateFilters({maxPrice:-1}));
 assert.throws(()=>validateFilters({maxPrice:100000001}));
});
test('Unknown preferences and ambiguous countries are clarified',()=>{
 assert.match(parseMessage('rahat bir şey arıyorum').clarification,/Bütçeni/);
 assert.equal(parseMessage('Bütçem 1,5').filters.maxPrice,null);
 assert.match(parseMessage('Alman veya Japon').clarification,/hangisini/);
 assert.match(parseMessage('hasarsız Alman').clarification,/doğrulanmadığı/);
});
test('Specific models restrict matches and changing brand clears the old model',()=>{
 const filters=parseMessage('BMW 320i otomatik, 1–3 milyon TL').filters;
 assert.equal(filters.brand,'BMW');assert.equal(filters.model,'320i');
 assert.equal(matchesFilters({brand:'BMW',model:'520i',gear:'Otomatik',price:2000000},filters),false);
 assert.equal(parseMessage('Toyota olsun',filters).filters.model,null);
 const mercedes=parseMessage('Mercedes C200 istiyorum').filters;
 assert.equal(matchesFilters({brand:'Mercedes-Benz',model:'C 200 AMG'},mercedes),true);
});
test('Results respect both kilometre bounds and origin; no invented listings',async()=>{
 const listings=[
  {id:'a',brand:'BMW',price:1500000,km:75000,gear:'Otomatik',createdAt:'2026-10-09'},
  {id:'b',brand:'Toyota',price:1500000,km:75000,gear:'Otomatik',createdAt:'2026-10-09'},
  {id:'c',brand:'BMW',price:1500000,km:30000,gear:'Otomatik',createdAt:'2026-10-09'},
  {id:'d',brand:'BMW',price:2500000,km:75000,gear:'Otomatik',createdAt:'2026-10-09'}
 ];
 const result=await searchAssistant('1–2 milyon TL, 50–100 bin km, Alman otomatik',{},listings);
 assert.deepEqual(result.ids,['a']);assert.equal(result.count,1);assert.equal(result.mode,'basic');
 assert.equal(matchesFilters(listings[2],result.filters),false);
 const noMatches=await searchAssistant('Japon, en fazla 1 milyon TL',{},listings);
 assert.equal(noMatches.count,0);assert.match(noMatches.reply,/bulunmuyor/);assert.equal(noMatches.filters.maxPrice,1000000);
});
test('OpenAI structured extraction uses server-side authentication and validated filters',async()=>{
 const expected={...emptyFilters(),origin:'Japon',maxPrice:1500000,maxKm:100000};let sent;
 const mock=async(url,options)=>{sent={url,options,body:JSON.parse(options.body)};return {ok:true,json:async()=>({status:'completed',output:[{content:[{type:'output_text',text:JSON.stringify({filters:expected,clarification:null})}]}]})};};
 const result=await extractWithAI('Japon araç istiyorum',{}, {key:'test-only',fetchImpl:mock});
 assert.deepEqual(result.filters,expected);assert.equal(sent.options.headers.Authorization,'Bearer test-only');assert.equal(sent.body.store,false);assert.equal(sent.body.text.format.strict,true);
 assert.equal(sent.body.text.format.type,'json_schema');assert.ok(!JSON.stringify(sent.body).includes('test-only'));
 const fallback=await searchAssistant('1–2 milyon TL, Alman',{},[],{key:'test-only',fetchImpl:async()=>{throw new Error('offline');}});
 assert.equal(fallback.mode,'basic');assert.match(fallback.notice,/ulaşılamıyor/);assert.equal(fallback.filters.maxPrice,2000000);
 const invalid=await searchAssistant('Alman',{},[],{key:'test-only',fetchImpl:async()=>({ok:true,json:async()=>({status:'completed',output:[{content:[{type:'output_text',text:'{"filters":{"maxKm":-1},"clarification":null}'}]}]})})});
 assert.equal(invalid.mode,'basic');assert.equal(invalid.filters.maxKm,null);
});
