import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'birthChartContent',
  title: 'Birth Chart Page Content',
  type: 'document',
  fields: [
    defineField({ name: 'heading', title: 'Page Heading', type: 'string' }),
    defineField({ name: 'subheading', title: 'Subheading', type: 'string' }),
    defineField({ name: 'introText', title: 'Intro Text', type: 'text', rows: 4 }),
    defineField({
      name: 'houseDescriptions',
      title: 'House Descriptions',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'house', title: 'House Number (1–12)', type: 'number' }),
            defineField({ name: 'title', title: 'Title', type: 'string' }),
            defineField({ name: 'description', title: 'Description', type: 'text' }),
          ],
        },
      ],
    }),
    defineField({
      name: 'planetDescriptions',
      title: 'Planet Descriptions',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'planet', title: 'Planet Name', type: 'string' }),
            defineField({ name: 'symbol', title: 'Symbol (unicode)', type: 'string' }),
            defineField({ name: 'description', title: 'Description', type: 'text' }),
          ],
        },
      ],
    }),
  ],
})
