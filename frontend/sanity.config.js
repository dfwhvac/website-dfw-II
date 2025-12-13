import { defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'
import { visionTool } from '@sanity/vision'
import { schemas } from './sanity/schema'

export default defineConfig({
  name: 'dfwhvac-cms',
  title: 'DFW HVAC Content Management',
  
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'demo-project-id',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  
  basePath: '/admin',
  
  plugins: [
    deskTool(),
    visionTool()
  ],
  
  schema: {
    types: schemas
  },
  
  document: {
    // Remove 'Preview' action for these document types
    actions: (prev, context) => {
      if (['siteSettings', 'companyInfo'].includes(context.schemaType)) {
        return prev.filter(({ action }) => action !== 'preview')
      }
      return prev
    }
  }
})