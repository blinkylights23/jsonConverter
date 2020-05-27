const { Converter } = require('../../dist/index')

const myTemplate = {
  mappings: [
    {
      path: 'hanSolo.kesselRun.parsecs',
      query: 'kesselRunParsecs',
      processors: [p => --p]
    }
  ]
}
const sourceData = { kesselRunParsecs: 13 }
const converter = new Converter(myTemplate)

converter.render(sourceData).then(converted => console.log(converted.result))
// { hanSolo: { kesselRun: { parsecs: 12 } } }
