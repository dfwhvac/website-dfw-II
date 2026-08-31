import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schemaTypes } from './sanity/schemas'
import { EditIcon, StarIcon } from '@sanity/icons'

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
      S.listItem()
        .title('Google Review Archive')
        .icon(StarIcon)
        .child(
          S.list()
            .title('Google Review Archive')
            .items([
              S.listItem()
                .title('Missing from Google')
                .child(
                  S.documentList()
                    .title('Missing from Google')
                    .filter('_type == "googleReviewLedger" && status == "missing"')
                    .apiVersion('2024-01-01')
                ),
              S.listItem()
                .title('All archived reviews')
                .child(
                  S.documentList()
                    .title('All archived reviews')
                    .filter('_type == "googleReviewLedger"')
                    .apiVersion('2024-01-01')
                ),
              S.listItem()
                .title('Nightly sync logs')
                .child(
                  S.documentList()
                    .title('Nightly sync logs')
                    .filter('_type == "googleReviewSyncLog"')
                    .apiVersion('2024-01-01')
                ),
            ])
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
            'googleReviewLedger',
            'googleReviewSyncLog',
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
