const { Converter } = require('@paulsmith/jsonconverter')

const myTemplate = {
  mappings: [
    {
      path: 'bar', // Where the data will go in the target
      query: 'foo', // Where to find the data in the source
      processors: ['trim', 'upper'] // Apply transformations
    }
  ]
}
const sourceData = { foo: 'bif' }
const converter = new Converter(myTemplate)

converter.render(sourceData).then(result => console.log(result))
