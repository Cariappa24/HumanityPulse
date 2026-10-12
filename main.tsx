import React from 'react';
import {createRoot} from 'react-dom/client';
import Explorer from '@/components/humanity/Explorer';
import InfoPage from '@/components/humanity/InfoPages';
import '@/app/globals.css';
import 'maplibre-gl/dist/maplibre-gl.css';
const path=location.pathname.split('/').filter(Boolean).map(p=>decodeURIComponent(p));
const info=['help','support','sources','about','transparency','contact','privacy','terms'];
function App(){if(path[0]==='event'&&path[1])return <Explorer initialEvent={path[1]}/>;if(path[0]==='country'&&path[1])return <Explorer initialCountry={path[1]} initialView="latest"/>;if(info.includes(path[0]))return <InfoPage slug={path[0]}/>;if(['latest','dashboard','timeline','infrastructure'].includes(path[0]))return <Explorer initialView={path[0]==='infrastructure'?'latest':path[0]} initialImpact={path[0]==='infrastructure'?'electricity':'All'}/>;if(path.length)return <main className="page-main"><h1>Page not found</h1><a href="/" className="btn">Return to the map</a></main>;return <Explorer/>;}
createRoot(document.getElementById('root')!).render(<App/>);
