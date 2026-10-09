export const brandOrigins = {
  BMW:'Alman', 'Mercedes-Benz':'Alman', Audi:'Alman', Volkswagen:'Alman', Porsche:'Alman', Opel:'Alman',
  Toyota:'Japon', Honda:'Japon', Nissan:'Japon', Mazda:'Japon', Suzuki:'Japon', Subaru:'Japon', Mitsubishi:'Japon', Lexus:'Japon',
  Renault:'Fransız', Peugeot:'Fransız', Citroën:'Fransız', DS:'Fransız',
  Fiat:'İtalyan', 'Alfa Romeo':'İtalyan', Ferrari:'İtalyan', Maserati:'İtalyan',
  Hyundai:'Koreli', Kia:'Koreli', Volvo:'İsveçli', Tesla:'Amerikan', Ford:'Amerikan', Chevrolet:'Amerikan', Jeep:'Amerikan',
  Togg:'Türk', Seat:'İspanyol', Cupra:'İspanyol', Skoda:'Çek', Škoda:'Çek', BYD:'Çinli', MG:'İngiliz', Mini:'İngiliz', 'Land Rover':'İngiliz', Jaguar:'İngiliz'
};
export const origins = [...new Set(Object.values(brandOrigins))];
export const emptyFilters = () => ({origin:null, brand:null, model:null, city:null, minPrice:null, maxPrice:null, minKm:null, maxKm:null, minYear:null, maxYear:null, fuel:null, gear:null, body:null, sort:'newest'});
export const normalize = value => String(value??'').toLocaleLowerCase('tr').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ı/g,'i');
export function matchesFilters(item, filters) {
  for (const key of ['brand','city','fuel','gear','body']) {
    if (filters[key] && normalize(item[key])!==normalize(filters[key])) return false;
  }
  if (filters.origin && brandOrigins[item.brand]!==filters.origin) return false;
  if (filters.model && !normalize(`${item.brand} ${item.model}`).replace(/\s/g,'').includes(normalize(filters.model).replace(/\s/g,''))) return false;
  for (const [field, low, high] of [['price','minPrice','maxPrice'],['km','minKm','maxKm'],['year','minYear','maxYear']]) {
    if (filters[low]!=null && item[field]<filters[low]) return false;
    if (filters[high]!=null && item[field]>filters[high]) return false;
  }
  return true;
}
export function sortListings(items, sort='newest') {
  const comparators = {'price-asc':(a,b)=>a.price-b.price, 'price-desc':(a,b)=>b.price-a.price, km:(a,b)=>a.km-b.km, year:(a,b)=>b.year-a.year, newest:(a,b)=>Date.parse(b.createdAt)-Date.parse(a.createdAt)};
  return [...items].sort(comparators[sort]||comparators.newest);
}
