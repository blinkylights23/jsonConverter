const { Converter } = require('../../dist/index')

// Compose outcomes by chaining processors
const myTemplate = {
  mappings: [
    { path: 'name', query: 'name', processors: ['trim', 'upper'] },
    {
      path: 'bestPal',
      processors: [() => 'Chewie', 'upper']
    }
  ]
}
const sourceData = { name: '     Han Solo   ' }
const converter = new Converter(myTemplate)

converter.render(sourceData).then(converted => console.log({ ...sourceData, ...converted.result }))
// { name: 'HAN SOLO', bestPal: 'CHEWIE' }
