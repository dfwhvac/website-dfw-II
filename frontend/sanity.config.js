import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schemaTypes } from './sanity/schemas'
import { EditIcon } from '@sanity/icons'

// Custom desk structure with Drafts view
const deskStructure = (S) =>
  S.list()
    .title('Content')
    .items([
      // Drafts section at the top
      S.listItem()
        .title('📝 Unpublished Drafts')
        .icon(EditIcon)
        .child(
          S.documentList()
            .title('Unpublished Drafts')
            .filter('_id in path("drafts.**")')
            .apiVersion('2024-01-01')
        ),
      
      S.divider(),
      
      // Single documents (one per type)
      S.listItem()
        .title('Homepage')
        .child(
          S.document()
            .schemaType('homepage')
            .documentId('homepage')
        ),
      S.listItem()
        .title('Site Settings')
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings')
        ),
      S.listItem()
        .title('Company Info')
        .child(
          S.document()
            .schemaType('companyInfo')
            .documentId('companyInfo')
        ),
      S.listItem()
        .title('Brand Colors')
        .child(
          S.document()
            .schemaType('brandColors')
            .documentId('brandColors')
        ),
      S.listItem()
        .title('FAQ Page')
        .child(
          S.document()
            .schemaType('faqPage')
            .documentId('faqPage')
        ),
      S.listItem()
        .title('Reviews Page')
        .child(
          S.document()
            .schemaType('reviewsPage')
            .documentId('reviewsPage')
        ),
      
      S.divider(),
      
      // Collection documents
      ...S.documentTypeListItems().filter(
        (listItem) =>
          ![
            'homepage',
            'siteSettings', 
            'companyInfo', 
            'brandColors',
            'faqPage',
            'reviewsPage',
          ].includes(listItem.getId())
      ),
    ])

export default defineConfig({
  name: 'dfwhvac',
  title: 'DFW HVAC CMS',
  projectId: 'iar2b790',
  dataset: 'production',
  basePath: '/studio',
  plugins: [
    structureTool({
      structure: deskStructure,
    }),
  ],
  schema: {
    types: schemaTypes,
  },
})
