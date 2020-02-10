# JSON Converter

JSON converter is a tool for passing JSON data to a template and rendering out result data in a different JSON structure. It supports referencing data in the source document by JMESPath expression, there's support for both simple mapping from a source JSON field to a target field, you can apply custom logic to transformations, and JSON Converter supports chaining custom or built-in processing functions (it comes with quite a few processors already). Templates are themselves JSON documents, and there are template schema validation tools included in this repo.

## Getting Started

JSON COnverter is on `npm`, so installing is pretty easy:

```
$ npm install @paulsmith/jsonconverter
```

## Usage

```javascript
import { Converter } from '@paulsmith/jsoncoverter'

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
```

### Examples

## Acknowledgements

### Authors

### License

### Built with

## Contributing
