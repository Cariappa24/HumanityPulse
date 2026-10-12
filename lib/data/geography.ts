import world from '../../data/world.json';
import type {Incident} from './model';
function inRing(lon:number,lat:number,ring:number[][]):boolean{let inside=false;for(let i=0,j=ring.length-1;i<ring.length;j=i++){const [xi,yi]=ring[i],[xj,yj]=ring[j];if((yi>lat)!==(yj>lat)&&lon<(xj-xi)*(lat-yi)/(yj-yi)+xi)inside=!inside;}return inside;}
const shapes=world.features.map(f=>({name:f.properties.name,polygons:(f.geometry.type==='Polygon'?[f.geometry.coordinates]:f.geometry.coordinates) as number[][][][]}));
export function addMappedCountries(events:Incident[]):Incident[]{return events.map(e=>{if(e.country)return e;const country=shapes.find(s=>s.polygons.some(poly=>inRing(e.lon,e.lat,poly[0])&&!poly.slice(1).some(hole=>inRing(e.lon,e.lat,hole))));return country?{...e,country:country.name,countryApproximate:true}:e;});}
