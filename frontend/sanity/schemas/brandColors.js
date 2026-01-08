export default {
  name: 'brandColors',
  title: 'Brand Colors',
  type: 'document',
  groups: [
    { name: 'primary', title: 'Primary Colors' },
    { name: 'secondary', title: 'Secondary Colors' },
    { name: 'neutral', title: 'Neutral Colors' },
  ],
  fields: [
    {
      name: 'title',
      title: 'Settings Name',
      type: 'string',
      initialValue: 'Brand Colors',
      readOnly: true,
    },
    // Primary Brand Colors - using simple color type
    {
      name: 'prussianBlue',
      title: 'Prussian Blue (Primary)',
      type: 'color',
      description: 'Headers, dark backgrounds',
      group: 'primary',
      options: {
        disableAlpha: true,
      },
    },
    {
      name: 'electricBlue',
      title: 'Electric Blue (Secondary)',
      type: 'color',
      description: 'Links, buttons, accents',
      group: 'primary',
      options: {
        disableAlpha: true,
      },
    },
    {
      name: 'vividRed',
      title: 'Vivid Red (Tertiary)',
      type: 'color',
      description: 'CTAs, phone numbers',
      group: 'primary',
      options: {
        disableAlpha: true,
      },
    },
    {
      name: 'limeGreen',
      title: 'Lime Green (Quaternary)',
      type: 'color',
      description: 'Success states, highlights',
      group: 'secondary',
      options: {
        disableAlpha: true,
      },
    },
    {
      name: 'goldAmber',
      title: 'Gold/Amber',
      type: 'color',
      description: 'Trust badges, promotions',
      group: 'secondary',
      options: {
        disableAlpha: true,
      },
    },
    {
      name: 'charcoal',
      title: 'Charcoal',
      type: 'color',
      description: 'Body text, secondary headings',
      group: 'neutral',
      options: {
        disableAlpha: true,
      },
    },
    {
      name: 'lightGray',
      title: 'Light Gray',
      type: 'color',
      description: 'Section backgrounds, cards',
      group: 'neutral',
      options: {
        disableAlpha: true,
      },
    },
    {
      name: 'white',
      title: 'White',
      type: 'color',
      description: 'Base background',
      group: 'neutral',
      options: {
        disableAlpha: true,
      },
    },
  ],
  preview: {
    select: {
      title: 'title',
    },
  },
}
