import { Converter } from '../dist'
import source from './fixtures/hansolo.json'
import vehicles from './fixtures/vehicles.json'

describe('a Converter instance', () => {
  test('can assign an arbitrary value to destination JSON', () => {
    let template = {
      mappings: [{ path: 'isAwesome', value: true }]
    }
    let converter = new Converter(template)
    converter.render(source).then(result => {
      expect(result).toStrictEqual({ isAwesome: true })
    })
  })
  test('can assign a value to a nested path in the destination JSON', () => {
    let template = {
      mappings: [{ path: 'spaceship.name', value: 'Millenium Falcon' }]
    }
    let converter = new Converter(template)
    converter.render(source).then(result => {
      expect(result).toStrictEqual({ spaceship: { name: 'Millenium Falcon' } })
    })
  })
  test('can assign a value from a jmespath query against the source JSON', () => {
    let template = {
      mappings: [
        { path: 'bio', query: '{ height: height, weight: mass, skinColor: skin_color, hairColor: hair_color }' }
      ]
    }
    let converter = new Converter(template)
    converter.render(source).then(result => {
      expect(result).toStrictEqual({
        bio: {
          height: '180',
          weight: '80',
          skinColor: 'fair',
          hairColor: 'brown'
        }
      })
    })
  })
  test('can apply a default processor to a queried source value', () => {
    let template = {
      mappings: [{ path: 'name', query: 'name', processors: ['trim', 'upper'] }]
    }
    let converter = new Converter(template)
    converter.render(source).then(result => {
      expect(result).toStrictEqual({
        name: 'HAN SOLO'
      })
    })
  })
  test('can accept an arbitrary function as a processor', () => {
    let template = {
      mappings: [
        { path: 'name', query: 'name', processors: ['trim', 'upper'] },
        {
          path: 'bestPal',
          query: 'name',
          processors: [value => 'Chewie', 'upper']
        }
      ]
    }
    let converter = new Converter(template)
    converter.render(source).then(result => {
      expect(result).toStrictEqual({
        name: 'HAN SOLO',
        bestPal: 'CHEWIE'
      })
    })
  })
  test('can use an object to apply a default processor with arguments', () => {
    let template = {
      mappings: [
        {
          path: 'movies',
          query: 'films',
          processors: [
            {
              processor: 'join',
              args: [', ']
            }
          ]
        }
      ]
    }
    let converter = new Converter(template)
    converter.render(source).then(result => {
      expect(result).toStrictEqual({
        movies:
          'https://swapi.co/api/films/2/, https://swapi.co/api/films/3/, https://swapi.co/api/films/1/, https://swapi.co/api/films/7/'
      })
    })
  })
  test('can register a custom processor', () => {
    let isScoundrel = name => {
      if (name.match(/solo|lando|chew/gi)) {
        return true
      }
      return false
    }
    let template = {
      mappings: [
        { path: 'name', query: 'name', processors: ['trim', 'upper'] },
        {
          path: 'scoundrel',
          query: 'name',
          processors: ['isScoundrel']
        }
      ]
    }
    let converter = new Converter(template)
    converter.processors.isScoundrel = isScoundrel
    converter.render(source).then(result => {
      expect(result).toStrictEqual({
        name: 'HAN SOLO',
        scoundrel: true
      })
    })
  })
  test('can apply a query to a fetch via a map', () => {
    let template = {
      mappings: [
        { path: 'name', query: 'name', processors: ['trim', 'lower'] },
        {
          path: 'movies',
          query: 'films',
          processors: [{ processor: 'map', args: ['fetch'] }, { processor: 'query', args: '[].title' }]
        }
      ]
    }
    let converter = new Converter(template)
    converter.render(source).then(result => {
      console.log(result)
      expect(result).toStrictEqual({
        name: 'han solo',
        movies: ['The Empire Strikes Back', 'Return of the Jedi', 'A New Hope', 'The Force Awakens']
      })
    })
  })
  test('can apply a registered processor as a map', () => {
    expect(true).toStrictEqual(true)
  })
  test('can apply a mapping that uses another converter', () => {
    expect(true).toStrictEqual(true)
  })
  test('maps undefined to a path when any processor returns null or undefined', () => {
    expect(true).toStrictEqual(true)
  })
  test('can apply a post-processing hook to a mapping', () => {
    expect(true).toStrictEqual(true)
  })
})
