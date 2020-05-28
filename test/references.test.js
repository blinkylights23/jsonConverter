import { Converter } from '../dist'
import vehicles from './fixtures/vehicles'

describe('references', done => {
  test('basic referencing', () => {
    let shipReferencer = mappingObj => {}
    let template = {
      mappings: [
        { path: 'name', query: 'name', processors: ['trim'] },
        {
          path: 'ships',
          query: 'starships',
          processors: [{ processor: 'map', args: ['upper'] }],
          hook: shipHook
        }
      ]
    }
    let converter = new Converter(template)
  })
})
