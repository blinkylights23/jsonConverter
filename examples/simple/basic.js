const { Converter } = require('../../dist/index')

const myTemplate = {
  mappings: [
    {
      path: 'milleniumFalcon.pilot', // Where the data will go in the target
      query: 'pilot', // Where to find the data in the source
      processors: ['trim', 'upper'] // Apply transformations
    }
  ]
}
const sourceData = { pilot: ' Han Solo  ' }
const converter = new Converter(myTemplate)

converter.render(sourceData).then(result => console.log(result))
// { milleniumFalcon: { pilot: 'HAN SOLO' } }
