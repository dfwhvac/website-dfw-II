export default {
  name: 'brandColors',
  title: 'Brand Colors',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Settings Name',
      type: 'string',
      initialValue: 'Brand Colors',
      readOnly: true,
    },
    // Primary Brand Colors
    {
      name: 'prussianBlue',
      title: 'Prussian Blue (Primary)',
      type: 'object',
      fields: [
        { name: 'hex', title: 'Hex Code', type: 'string', initialValue: '#003153' },
        { name: 'usage', title: 'Usage', type: 'string', initialValue: 'Headers, dark backgrounds' },
      ],
    },
    {
      name: 'electricBlue',
      title: 'Electric Blue (Secondary)',
      type: 'object',
      fields: [
        { name: 'hex', title: 'Hex Code', type: 'string', initialValue: '#00B8FF' },
        { name: 'usage', title: 'Usage', type: 'string', initialValue: 'Links, buttons, accents' },
      ],
    },
    {
      name: 'vividRed',
      title: 'Vivid Red (Tertiary)',
      type: 'object',
      fields: [
        { name: 'hex', title: 'Hex Code', type: 'string', initialValue: '#FF0606' },
        { name: 'usage', title: 'Usage', type: 'string', initialValue: 'CTAs, phone numbers' },
      ],
    },
    {
      name: 'limeGreen',
      title: 'Lime Green (Quaternary)',
      type: 'object',
      fields: [
        { name: 'hex', title: 'Hex Code', type: 'string', initialValue: '#00FF00' },
        { name: 'usage', title: 'Usage', type: 'string', initialValue: 'Success states, highlights' },
      ],
    },
    // Additional Colors
    {
      name: 'goldAmber',
      title: 'Gold/Amber',
      type: 'object',
      fields: [
        { name: 'hex', title: 'Hex Code', type: 'string', initialValue: '#F77F00' },
        { name: 'usage', title: 'Usage', type: 'string', initialValue: 'Trust badges, promotions' },
      ],
    },
    {
      name: 'charcoal',
      title: 'Charcoal',
      type: 'object',
      fields: [
        { name: 'hex', title: 'Hex Code', type: 'string', initialValue: '#2D3748' },
        { name: 'usage', title: 'Usage', type: 'string', initialValue: 'Body text, secondary headings' },
      ],
    },
    {
      name: 'lightGray',
      title: 'Light Gray',
      type: 'object',
      fields: [
        { name: 'hex', title: 'Hex Code', type: 'string', initialValue: '#F7FAFC' },
        { name: 'usage', title: 'Usage', type: 'string', initialValue: 'Section backgrounds, cards' },
      ],
    },
    {
      name: 'white',
      title: 'White',
      type: 'object',
      fields: [
        { name: 'hex', title: 'Hex Code', type: 'string', initialValue: '#FFFFFF' },
        { name: 'usage', title: 'Usage', type: 'string', initialValue: 'Base background' },
      ],
    },
  ],
  preview: {
    select: {
      title: 'title',
    },
  },
}
