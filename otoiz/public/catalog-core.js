import {normalize} from './search.js';
export const numericFields = ['minPrice','maxPrice','minYear','maxYear','minKm','maxKm'];
export const filterFields = ['q','brand','model','fuel','gear','body','sort','favorites',...numericFields];
export function readUrl(search){const params=new URLSearchParams(search);if(!params.has('brand')&&params.has('marka'))params.set('brand',params.get('marka'));return Object.fromEntries(filterFields.map(key=>[key,numericFields.includes(key)?(params.get(key)&&Number.isFinite(Number(params.get(key)))&&Number(params.get(key))>=0?Number(params.get(key)):null):params.get(key)||'']));}
export function matches(item,f){
 for(const key of ['brand','model','fuel','gear','body'])if(f[key]&&normalize(item[key])!==normalize(f[key]))return false;
 for(const [field,min,max] of [['price','minPrice','maxPrice'],['year','minYear','maxYear'],['km','minKm','maxKm']]){
  if(f[min]!=null||f[max]!=null){if(item[field]==null||field==='price'&&!item.priceVerified)return false;if(f[min]!=null&&item[field]<f[min]||f[max]!=null&&item[field]>f[max])return false;}
 }
 const aliases={benzinli:'benzin',dizel:'dizel',elektrikli:'elektrik',otomatik:'otomatik',manuel:'manuel'};
 const haystack=normalize([item.brand,item.model,item.fuel,item.gear,item.body].filter(Boolean).join(' '));
 return normalize(f.q).split(/\s+/).filter(Boolean).every(word=>/^\d+$/.test(word)?haystack.split(/\s+/).includes(word):haystack.includes(aliases[word]||word));
}
export function order(items,sort){const fields={'price-asc':['price',1],'price-desc':['price',-1],year:['year',-1],km:['km',1]};const rule=fields[sort];return [...items].sort((a,b)=>{if(rule){const[field,direction]=rule;const av=field==='price'&&!a.priceVerified?null:a[field],bv=field==='price'&&!b.priceVerified?null:b[field];return av==null?(bv==null?0:1):bv==null?-1:(av-bv)*direction;}return (a.brand+' '+a.model).localeCompare(b.brand+' '+b.model,'tr');});}
export function toggleComparison(ids,id){if(ids.includes(id))return ids.filter(x=>x!==id);if(ids.length>=3)throw new Error('En fazla üç araç karşılaştırabilirsin.');return [...ids,id];}
