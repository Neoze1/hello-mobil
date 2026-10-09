import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {catalog,brands,catalogPackage} from './catalog.mjs';
import {matches,order,readUrl,toggleComparison} from './public/catalog-core.js';
test('Every source model is imported once; missing facts and prices stay null',async()=>{
 const raw=JSON.parse(await readFile(new URL('./catalogs/modeller.json',import.meta.url),'utf8'));
 assert.equal(catalog.length,raw.length);assert.equal(catalog.length,178);assert.equal(brands.length,37);
 assert.equal(new Set(catalog.map(x=>x.id)).size,catalog.length);
 for(const [i,item]of catalog.entries()){assert.equal(item.brand,raw[i].marka);assert.equal(item.model,raw[i].model);assert.equal(item.price,null);assert.equal(item.priceVerified,false);assert.equal(item.listingUrl,null);assert.equal(item.updatedAt,null);assert.equal(item.logo,null);const url=new URL(item.searchUrl);assert.equal(url.hostname,'www.sahibinden.com');assert.equal(url.searchParams.get('query_text'),item.brand+' '+item.model);}
});
test('Turkish smart search and dependent brand/model filters',()=>{
 const bmw=catalog.find(x=>x.brand==='BMW'&&x.model.includes('3 Serisi'));assert.ok(bmw);
 assert.ok(matches(bmw,{q:'BMW 3 Serisi'}));assert.ok(!matches(bmw,{q:'otomatik benzinli SUV'}));assert.ok(!matches(bmw,{brand:'Audi'}));
 assert.ok(!matches(catalog.find(x=>x.model==='E39 5 Serisi'),{q:'BMW 3 Serisi'}));
 const known={...bmw,fuel:'Benzin',gear:'Otomatik',body:'SUV'};assert.ok(matches(known,{q:'otomatik benzinli SUV'}));
});
test('Unknown technical data cannot satisfy numeric filters or verified price sorting',()=>{
 const missing=catalog[0];for(const key of ['minYear','maxYear','minKm','maxKm','minPrice','maxPrice'])assert.equal(matches(missing,{[key]:1000}),false);
 const verified={...missing,id:'verified',price:10000,priceVerified:true},unverified={...missing,id:'seller',price:5000,priceVerified:false};
 assert.ok(!matches(unverified,{maxPrice:20000}));assert.ok(matches(verified,{maxPrice:20000}));assert.equal(order([missing,verified,unverified],'price-desc')[0].id,'verified');
});
test('Shareable filters and three-car comparison limit',()=>{
 const filters=readUrl('?brand=BMW&model=3+Serisi&minKm=0&maxPrice=invalid&maxYear=-1&favorites=1');assert.equal(filters.brand,'BMW');assert.equal(filters.model,'3 Serisi');assert.equal(filters.minKm,0);assert.equal(filters.maxPrice,null);assert.equal(filters.maxYear,null);
 assert.deepEqual(toggleComparison(['a','b'],'c'),['a','b','c']);assert.throws(()=>toggleComparison(['a','b','c'],'d'));assert.deepEqual(toggleComparison(['a','b','c'],'b'),['a','c']);
});
test('Enriched package is lossless, retains IDs and resolves Turkish filter URLs',async()=>{
 const data=JSON.parse(await readFile(new URL('./catalogs/otoiz_katalog.json',import.meta.url),'utf8'));
 assert.equal(catalogPackage.name,'OTOİZ');assert.equal(catalogPackage.createdAt,'2026-10-09');
 assert.equal(new Set(catalog.map(x=>x.sourceId)).size,178);
 for(const row of data.araclar){const item=catalog.find(x=>x.sourceId===row.id);assert.ok(item);assert.equal(item.brand,row.marka);assert.equal(item.model,row.model);assert.deepEqual(item.imageMetadata,row.gorsel);assert.deepEqual(item.priceMetadata,row.fiyat);assert.deepEqual(item.logoMetadata,row.logo);assert.deepEqual(item.originalRecord,row.onceki_kayit);assert.equal(item.imageSearchUrl,row.gorsel.google_arama);assert.equal(new URL(item.imageSearchUrl).hostname,'www.google.com');assert.ok(matches(item,readUrl(new URL(row.araclar_sayfasi,'http://localhost').search)));}
});
test('Displayed images have reviewed provenance and actual image bytes; indexed prices remain historical',async()=>{
 const reviews=JSON.parse(await readFile(new URL('./catalogs/media-review.json',import.meta.url),'utf8'));
 for(const item of catalog){if(item.image){assert.ok(reviews[item.sourceId]?.approved);assert.equal(item.media.sourceUrl,reviews[item.sourceId].sourceUrl);assert.ok(item.media.license);assert.ok(item.media.photographer);const bytes=await readFile(new URL('./public'+item.image,import.meta.url));assert.ok(bytes[0]===255&&bytes[1]===216||bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])));}
  for(const sample of item.priceSamples){assert.equal(sample.verifiedCurrent,false);assert.ok(sample.amount>1000);assert.ok(sample.year>=1950&&sample.year<=2026);assert.ok(sample.km>=0);assert.ok(sample.listingDateText);assert.equal(new URL(sample.sourceUrl).hostname,'www.arabam.com');}assert.equal(item.price,null);assert.equal(item.priceVerified,false);
 }
});