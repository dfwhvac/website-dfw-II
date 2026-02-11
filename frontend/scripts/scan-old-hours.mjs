import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
});

const allDocs = await client.fetch('*[!(_type in ["sanity.imageAsset", "sanity.fileAsset"])]');
const patterns = ['7:00 AM', '7:00 PM', '8:00 AM', '1:00 PM', '5:00 PM', '24/7', 'Monday-Saturday', 'Monday through Saturday', '7AM-7PM', '8AM-1PM', '7am-7pm', '8am-1pm'];

function scanObj(obj, path, docType, docId) {
  if (typeof obj === 'string') {
    for (const p of patterns) {
      if (obj.includes(p)) {
        const idx = obj.indexOf(p);
        const snippet = obj.substring(Math.max(0, idx - 40), idx + p.length + 40);
        console.log(`[${docType}] ${docId} @ ${path}:`);
        console.log(`  "...${snippet}..."`);
        return;
      }
    }
  } else if (Array.isArray(obj)) {
    obj.forEach((item, i) => scanObj(item, `${path}[${i}]`, docType, docId));
  } else if (obj && typeof obj === 'object') {
    for (const [k, v] of Object.entries(obj)) {
      if (k.startsWith('_')) continue;
      scanObj(v, `${path}.${k}`, docType, docId);
    }
  }
}

for (const doc of allDocs) {
  scanObj(doc, '', doc._type, doc._id);
}
console.log('\nFull CMS scan complete');
