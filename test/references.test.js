import { Converter } from '../dist'
import luke from './fixtures/luke'

describe('references', () => {
  test('basic referencing', done => {
    let homeworldReferencer = mappingObj => {
      let hwId = parseInt(mappingObj.result.replace('https://swapi.co/api/planets/', ''))
      return [
        { id: hwId, type: 'homeworld' },
        { id: hwId, value: mappingObj.result }
      ]
    }
    let template = {
      mappings: [
        { path: 'name', query: 'name', processors: ['trim'] },
        {
          path: 'homeworld',
          query: 'homeworld',
          ref: homeworldReferencer
        }
      ]
    }
    let converter = new Converter(template)
    converter
      .render(luke)
      .then(converted => {
        expect(converted.references).toEqual([
          {
            value: 'https://swapi.co/api/planets/1/',
            id: 1
          }
        ])
        expect(converted.result.homeworld).toEqual({
          id: 1,
          type: 'homeworld'
        })
        done()
      })
      .catch(error => done(error))
  })
})
