export function projectPoint(lon:number,lat:number):[number,number]{return [(lon+180)/360*1000,(90-lat)/180*500];}
export function ringPath(ring:number[][]):string{return ring.map(([lon,lat],i)=>{const [x,y]=projectPoint(lon,lat);return `${i?'L':'M'}${x.toFixed(2)},${y.toFixed(2)}`;}).join(' ')+' Z';}
export function geometryPath(geometry:{type:string;coordinates:unknown}):string{const polygons=geometry.type==='Polygon'?[geometry.coordinates]:geometry.coordinates;return (polygons as number[][][][]).flatMap(p=>p.map(ringPath)).join(' ');}
export function clampView(x:number,y:number,zoom:number):[number,number,number]{const z=Math.max(1,Math.min(8,zoom)),w=1000/z,h=500/z;return [Math.max(0,Math.min(1000-w,x)),Math.max(0,Math.min(500-h,y)),z];}
