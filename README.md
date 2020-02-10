# JSON Converter

JSON converter is a tool for passing JSON data to a template and rendering out result data in a different JSON structure. It supports referencing data in the source document by JMESPath expression, there's support for both simple mapping from a source JSON field to a target field, you can apply custom logic to transformations, and JSON Converter supports chaining custom or built-in processing functions (it comes with quite a few processors already). Templates are themselves JSON documents, and there are template schema validation tools included in this repo.

## Getting Started

```
$ npm install @paulsmith/jsonconverter
```

## Usage

### Basic Usage

```javascript
import { Converter } from '@paulsmith/jsonconverter'

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
```

### Add an arbitrary value to target JSON

```javascript
const myTemplate = {
  mappings: [
    { path: 'isScoundrel', value: true },
    { path: 'pal', value: 'Lando' },
    { path: 'bestPal', value: 'Chewie' }
  ]
}
const sourceData = { name: 'Han Solo' }
const converter = new Converter(myTemplate)

converter.render(sourceData).then(result => console.log({ ...sourceData, ...result }))
// {
//  name: 'Han Solo',
//  isScoundrel: true,
//  pal: 'Lando',
//  bestPal: 'Chewie'
// }
```

### Apply a custom function as a processor

```javascript
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

converter.render(sourceData).then(result => console.log(result))
// { parsecs: 12 }
```

### Compose processors by chaining them together

```javascript
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

converter.render(sourceData).then(result => console.log({ ...sourceData, ...result }))
// { name: 'HAN SOLO', bestPal: 'CHEWIE' }
```

## Acknowledgements

### Authors

### License

### Built with

## Contributing
