export default {
  name: 'aboutPage',
  title: 'About Page',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Hero Section' },
    { name: 'story', title: 'Our Story' },
    { name: 'values', title: 'Brand Values' },
    { name: 'stats', title: 'Statistics' },
    { name: 'team', title: 'Team' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    // SEO
    {
      name: 'metaTitle',
      title: 'Meta Title',
      type: 'string',
      group: 'seo',
      initialValue: 'About Us | DFW HVAC',
    },
    {
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      group: 'seo',
      validation: Rule => Rule.max(160),
      initialValue: 'Learn about DFW HVAC - a three-generation family commitment to trustworthy, high-quality HVAC service in Dallas-Fort Worth.',
    },

    // Hero Section
    {
      name: 'heroTitle',
      title: 'Hero Title',
      type: 'string',
      group: 'hero',
      initialValue: 'About DFW HVAC',
    },
    {
      name: 'heroSubtitle',
      title: 'Hero Subtitle',
      type: 'string',
      group: 'hero',
      initialValue: 'Three Generations of Trusted HVAC Service',
    },
    {
      name: 'heroDescription',
      title: 'Hero Description',
      type: 'text',
      group: 'hero',
      initialValue: 'DFW HVAC delivers expert HVAC service with integrity and care—earning trust and long-term customer satisfaction through quality workmanship.',
    },

    // Our Story Section
    {
      name: 'storyTitle',
      title: 'Story Section Title',
      type: 'string',
      group: 'story',
      initialValue: 'Our Story',
    },
    {
      name: 'storyContent',
      title: 'Story Content',
      type: 'array',
      group: 'story',
      of: [{
        type: 'block',
        styles: [
          { title: 'Normal', value: 'normal' },
          { title: 'H3', value: 'h3' },
        ],
        marks: {
          decorators: [
            { title: 'Bold', value: 'strong' },
            { title: 'Italic', value: 'em' },
          ],
        },
      }],
      description: 'The company story with rich text formatting',
    },
    {
      name: 'storyHighlight',
      title: 'Story Highlight',
      type: 'string',
      group: 'story',
      description: 'A short highlight shown with an icon (e.g., "Three-Generation Family Legacy")',
      initialValue: 'Three-Generation Family Legacy',
    },

    // Legacy Timeline
    {
      name: 'legacyTimeline',
      title: 'Legacy Timeline',
      type: 'array',
      group: 'story',
      description: 'Key milestones in company history',
      of: [{
        type: 'object',
        fields: [
          { name: 'year', title: 'Year', type: 'string' },
          { name: 'title', title: 'Title', type: 'string' },
          { name: 'description', title: 'Description', type: 'text' },
          { name: 'person', title: 'Person (if applicable)', type: 'string' },
        ],
        preview: {
          select: {
            title: 'title',
            subtitle: 'year',
          },
        },
      }],
    },

    // Brand Values (Pillars)
    {
      name: 'valuesTitle',
      title: 'Values Section Title',
      type: 'string',
      group: 'values',
      initialValue: 'Our Values',
    },
    {
      name: 'valuesSubtitle',
      title: 'Values Section Subtitle',
      type: 'string',
      group: 'values',
      initialValue: 'The pillars that guide everything we do',
    },
    {
      name: 'brandPillars',
      title: 'Brand Pillars',
      type: 'array',
      group: 'values',
      description: 'The core brand values (Trust, Excellence, Care)',
      of: [{
        type: 'object',
        fields: [
          { name: 'title', title: 'Pillar Title', type: 'string' },
          { name: 'tagline', title: 'Tagline', type: 'string', description: 'Short phrase (e.g., "Honest, Transparent, Ethical")' },
          { name: 'description', title: 'Description', type: 'text' },
          { 
            name: 'icon', 
            title: 'Icon', 
            type: 'string',
            options: {
              list: [
                { title: 'Shield (Trust)', value: 'shield' },
                { title: 'Award (Excellence)', value: 'award' },
                { title: 'Heart (Care)', value: 'heart' },
                { title: 'Users (Team)', value: 'users' },
                { title: 'Star (Quality)', value: 'star' },
                { title: 'Check Circle (Reliability)', value: 'check-circle' },
              ],
            },
          },
          {
            name: 'proofPoints',
            title: 'Proof Points',
            type: 'array',
            of: [{ type: 'string' }],
            description: 'Specific examples that demonstrate this value',
          },
        ],
        preview: {
          select: {
            title: 'title',
            subtitle: 'tagline',
          },
        },
      }],
    },

    // Statistics
    {
      name: 'statistics',
      title: 'Statistics',
      type: 'array',
      group: 'stats',
      description: 'Key numbers to display (e.g., years experience, reviews, customers)',
      of: [{
        type: 'object',
        fields: [
          { name: 'value', title: 'Value', type: 'string', description: 'e.g., "50+", "5.0", "10K+"' },
          { name: 'label', title: 'Label', type: 'string', description: 'e.g., "Years Experience", "Google Rating"' },
          { name: 'suffix', title: 'Suffix (optional)', type: 'string', description: 'e.g., "Stars", "Reviews"' },
        ],
        preview: {
          select: {
            title: 'label',
            subtitle: 'value',
          },
        },
      }],
    },

    // Team Section
    {
      name: 'showTeamSection',
      title: 'Show Team Section',
      type: 'boolean',
      group: 'team',
      initialValue: false,
    },
    {
      name: 'teamTitle',
      title: 'Team Section Title',
      type: 'string',
      group: 'team',
      initialValue: 'Meet Our Team',
    },
    {
      name: 'teamMembers',
      title: 'Team Members',
      type: 'array',
      group: 'team',
      of: [{
        type: 'object',
        fields: [
          { name: 'name', title: 'Name', type: 'string' },
          { name: 'role', title: 'Role', type: 'string' },
          { name: 'bio', title: 'Bio', type: 'text' },
          { name: 'image', title: 'Photo', type: 'image' },
        ],
        preview: {
          select: {
            title: 'name',
            subtitle: 'role',
            media: 'image',
          },
        },
      }],
    },

    // Display Options
    {
      name: 'showTestimonials',
      title: 'Show Testimonials Section',
      type: 'boolean',
      group: 'hero',
      initialValue: true,
    },
    {
      name: 'showContactForm',
      title: 'Show Contact Form',
      type: 'boolean',
      group: 'hero',
      initialValue: true,
    },
  ],
  preview: {
    prepare() {
      return {
        title: 'About Page',
        subtitle: 'Company story and values',
      }
    },
  },
}
