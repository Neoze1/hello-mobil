import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const source = JSON.parse(await readFile(new URL('./catalogs/modeller.json', import.meta.url), 'utf8'));
const packageData = JSON.parse(await readFile(new URL('./catalogs/otoiz_katalog.json', import.meta.url), 'utf8'));
const key = row => `${row.marka}\0${row.model}`;
const enrichment = new Map(packageData.araclar.map(row=>[key(row),row]));
if(enrichment.size!==packageData.araclar.length || source.length!==enrichment.size || source.some(row=>!enrichment.has(key(row))))throw new Error('OTOİZ paketi mevcut katalogla birebir eşleşmiyor.');
export const catalogPackage = {name:packageData.marka_adi,createdAt:packageData.olusturma_tarihi,brandCount:packageData.marka_sayisi,modelCount:packageData.model_sayisi};
const media=JSON.parse(await readFile(new URL('./catalogs/media.json',import.meta.url),'utf8'));
let prices={};try{prices=JSON.parse(await readFile(new URL('./catalogs/prices.json',import.meta.url),'utf8'));}catch(error){if(error.code!=='ENOENT')throw error;}
let reviews={};try{reviews=JSON.parse(await readFile(new URL('./catalogs/media-review.json',import.meta.url),'utf8'));}catch(error){if(error.code!=='ENOENT')throw error;}
function approvedMedia(row){const id=enrichment.get(key(row)).id,item=media[id];return reviews[id]?.approved&&reviews[id].sourceUrl===item?.sourceUrl&&/^\/araclar\/[a-z0-9-]+\.(jpg|png)$/.test(item?.file||'')&&item.photographer?item:null;}
// Catalog records describe models, never an active sale offer. Preserve historical data separately.
export const catalog = source.map(row => ({
  id:'model-'+createHash('sha256').update(`${row.marka}\0${row.model}`).digest('hex').slice(0,16),
  kind:'model', brand:row.marka, model:row.model, year:null, body:null, fuel:null,
  gear:null, engine:null, km:null, price:null, priceVerified:false, listingUrl:null,
  logo:null, image:approvedMedia(row)?.file||null, searchUrl:row.sahibinden_arama,
  media:approvedMedia(row),
  mediaResearch:approvedMedia(row)?'model_family_reviewed':media[enrichment.get(key(row)).id]?.status||'not_researched',
  imageResearchDetail:{status:media[enrichment.get(key(row)).id]?.status||'not_researched',reason:media[enrichment.get(key(row)).id]?.reason||null,reviewNote:reviews[enrichment.get(key(row)).id]?.note||null},
  priceSamples:prices[enrichment.get(key(row)).id]?.samples||[],
  priceResearch:prices[enrichment.get(key(row)).id]||null,
  source:'otomobil_markalari_modelleri (1).zip / otoiz_katalog.json', updatedAt:null,
  sourceId:enrichment.get(key(row)).id,
  catalogUrl:enrichment.get(key(row)).araclar_sayfasi,
  imageSearchUrl:enrichment.get(key(row)).gorsel.google_arama,
  imageMetadata:enrichment.get(key(row)).gorsel,
  priceMetadata:enrichment.get(key(row)).fiyat,
  logoMetadata:enrichment.get(key(row)).logo,
  originalRecord:enrichment.get(key(row)).onceki_kayit,
  packageCreatedAt:packageData.olusturma_tarihi,
  historicalPrice:row.fiyat_tl ? {amount:Number(row.fiyat_tl),date:row.ilan_tarihi||null,verified:false}:null,
  sourcePriceStatus:row.fiyat_durumu, sourceLogoPath:row.logo_dosyasi||null
}));
export const brands = [...new Set(catalog.map(item=>item.brand))].map(name=>({name,logo:null,modelCount:catalog.filter(item=>item.brand===name).length}));
