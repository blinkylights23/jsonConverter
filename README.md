# JSON Converter

This is yet another tool for converting JSON data composed in one format into JSON with some other
schema. It supports:

- Querying the source document with JMESPath expressions
- JSON-serializable templates
- Custom transformation logic (processors)
- Chaining processors
- Async processors
- References

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

converter.render(sourceData).then(converted => console.log(converted.result))
// { milleniumFalcon: { pilot: 'HAN SOLO' } }
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

converter.render(sourceData).then(converted => console.log({ ...sourceData, ...converted.result }))
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

converter.render(sourceData).then(converted => console.log(converted.result))
// { hanSolo: { kesselRun: { parsecs: 12 } } }
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

converter.render(sourceData).then(converted => console.log({ ...sourceData, ...converted.result }))
// { name: 'HAN SOLO', bestPal: 'CHEWIE' }
```

## Built-in Processors

| Processor  | Input          | Produces | Arguments                                   |                                                 Description                                                 |
| :--------- | :------------- | :------- | :------------------------------------------ | :---------------------------------------------------------------------------------------------------------: |
| upper      | String         | String   |                                             |                                     Changes the input to all uppercase                                      |
| lower      | String         | String   |                                             |                                     Changes the input to all lowercase                                      |
| trim       | String         | String   |                                             |                                     Removes leading and trailing spaces                                     |
| join       | Array          | String   | `joiner` (default ', ')                     |                    Joins the Array elements into a single string, joined by the `joiner`                    |
| map        | Array          | Array    | mapping function                            |                                Applies a mapping function to the array desc                                 |
| query      | Any            | Any      | A JMESPath query                            |                              Applies the JMESPath query to the provided value                               |
| slugify    | String         | String   |                                             |                                            Slugifies the string                                             |
| titleCase  | String         | String   |                                             |                                  Returns the provide string In Title Case                                   |
| toJson     | Any            | String   |                                             |                                           Applies JSON.stringify                                            |
| sort       | Array          | Array    | Sorting function                            |                                          Sorts the provided array                                           |
| slice      | String         | String   | `start`, `end`                              |                                          Returns part of a string                                           |
| dateFormat | String         | String   |                                             |                                   Applies `toISOString` to a date string                                    |
| fetch      | String (a URL) | Any      | params object which will be passed to axios | Takes in a URL from the source, makes a request to the URL, and puts the response body into the target JSON |

## Acknowledgements

This library would have been less fun to write, and _significantly_ less fun to [test](https://github.com/blinkylights23/jsonConverter/blob/master/test/processors.test.js#L55) without the Paul Hallett's awesome [SWAPI](https://swapi.dev/about) Star Wars API. May The Force be with you.

### Built with

:heart:
