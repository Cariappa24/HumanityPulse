import {publicConfig} from '../../lib/data/payments';
export default async function handler(){return Response.json(publicConfig(process.env));}
