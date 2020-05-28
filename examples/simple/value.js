const { Converter } = require('../../dist/index')

const myTemplate = {
  mappings: [
    { path: 'isScoundrel', value: true },
    { path: 'pal', value: 'Lando' },
    { path: 'bestPal', value: 'Chewie' }
  ]
}
const sourceData = { name: 'Han Solo' }
const converter = new Converter(myTemplate)

converter.render(sourceData).then(converted => console.log({ ...sourceData, ...converted.result }))
// {
//   name: 'Han Solo',
//   isScoundrel: true,
//   pal: 'Lando',
//   bestPal: 'Chewie'
// }
