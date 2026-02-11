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

// Fix companyPage contact meta description
const contactPages = await client.fetch('*[_type == "companyPage" && _id == "page-contact"]{ _id, metaDescription }');
for (const doc of contactPages) {
  const newDesc = doc.metaDescription
    .replace('Available 24/7 for emergencies.', 'Same-day service available Monday-Friday.')
    .replace('Available 24/7 for emergencies', 'Same-day service available Monday-Friday');
  await client.patch(doc._id).set({ metaDescription: newDesc }).commit();
  console.log('Fixed companyPage contact meta description');
}

// Fix trustSignals
const trustDocs = await client.fetch('*[_type == "trustSignals"]{ _id, emergencyServiceDescription, emergencyServiceFeatures, servicePageReasons }');
for (const doc of trustDocs) {
  const patches = {};
  
  if (doc.emergencyServiceDescription) {
    patches.emergencyServiceDescription = doc.emergencyServiceDescription
      .replace('Monday through Saturday', 'Monday through Friday')
      .replace(/For weekend issues, we prioritize Monday morning appointments\.?/g, '')
      .replace(/For weekend issues, we prioritize Mond.*$/g, '')
      .trim();
  }
  
  if (doc.emergencyServiceFeatures) {
    patches.emergencyServiceFeatures = doc.emergencyServiceFeatures.map(f => 
      f.replace('24/7 Emergency availability', 'Same-day service availability')
       .replace('24/7 emergency', 'Same-day service')
    );
  }
  
  if (doc.servicePageReasons) {
    patches.servicePageReasons = doc.servicePageReasons.map(r =>
      r.replace('24/7 emergency service available', 'Same-day service available Monday-Friday')
       .replace('24/7 emergency', 'Same-day service')
    );
  }
  
  await client.patch(doc._id).set(patches).commit();
  console.log('Fixed trustSignals document');
}

console.log('All CMS fixes applied');
