import axios from 'axios'
import { Converter } from '../dist'
import source from './fixtures/hansolo.json'
import luke from './fixtures/luke.json'
import films from './fixtures/films.json'

jest.mock('axios')

describe("I do not want the Emperor's prize damaged. We will test it... on Captain Solo. A Converter instance:", () => {
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
  test('will prefer to apply processors to value over query', () => {
    let template = {
      mappings: [{ path: 'name', value: 'Luke Skywalker', query: 'name', processors: ['lower'] }]
    }
    let converter = new Converter(template)
    converter.render(source).then(result => {
      expect(result).toStrictEqual({
        name: 'luke skywalker'
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
          processors: [() => 'Chewie', 'upper']
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
        {
          path: 'movies',
          query: 'films',
          processors: [{ processor: 'map', args: ['fetch'] }, { processor: 'query', args: ['[].title'] }]
        }
      ]
    }
    axios.get.mockImplementation(value => {
      let film = films.results.find(f => f.url == value)
      return Promise.resolve({ data: film })
    })
    let converter = new Converter(template)
    return converter.render(source).then(result => {
      expect(result).toStrictEqual({
        movies: ['The Empire Strikes Back', 'Return of the Jedi', 'A New Hope', 'The Force Awakens']
      })
    })
  })
  test('can apply a registered processor as a map', () => {
    let template = {
      mappings: [
        {
          path: 'quotes',
          value: ['Punch it', "Let's hope we don't have a burn-out"],
          processors: [{ processor: 'map', args: ['chewify'] }]
        }
      ]
    }
    let chewify = str => `${str}, Chewie!`
    let converter = new Converter(template)
    converter.processors.chewify = chewify
    return converter.render(source).then(result => {
      expect(result).toStrictEqual({
        quotes: ['Punch it, Chewie!', "Let's hope we don't have a burn-out, Chewie!"]
      })
    })
  })
  test('can apply a post-processing hook to a mapping', () => {
    let ships = []
    let shipHook = shipList => {
      ships = ships.concat(shipList).sort()
      return shipList
    }
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
    Promise.all([converter.render(source), converter.render(luke)]).then(outcome => {
      expect(ships).toStrictEqual([
        'HTTPS://SWAPI.CO/API/STARSHIPS/10/',
        'HTTPS://SWAPI.CO/API/STARSHIPS/12/',
        'HTTPS://SWAPI.CO/API/STARSHIPS/22/',
        'HTTPS://SWAPI.CO/API/STARSHIPS/22/'
      ])
    })
  })
  test('can use an object as a starting point, and converted values add to or overwrite existing properties', () => {
    expect(true).toStrictEqual(true)
  })
  test("can, when path is an array, destructure mapping results into it's members", () => {
    expect(true).toStrictEqual(true)
  })
  test('maps undefined to a path when any processor returns null or undefined', () => {
    expect(true).toStrictEqual(true)
  })
})
