import axios from 'axios'
import { Converter, processors } from '../dist'
import hanSolo from './fixtures/hansolo'

function cm2ft(cm) {
  var floatFeet = (cm * 0.3937) / 12
  var feet = Math.floor(floatFeet)
  var inches = Math.round((floatFeet - feet) * 12)
  return `${feet}'${inches}"`
}

function getPeoplePage(page = 1) {
  return axios.get('https://swapi.co/api/people/', { page }).then(result => result.data)
}

const characterTemplate = {
  mappings: [
    { path: 'characterName', query: 'name' },
    { path: 'lowerName', query: 'name', processors: ['lower', 'trim'] },
    { path: 'height', query: 'height', processors: ['cm2ft'] },
    {
      path: 'ships',
      query: 'starships',
      processors: [{ processor: 'map', args: ['fetch'] }, { processor: 'query', args: ['[].name'] }]
    },
    {
      path: 'appearedIn',
      query: 'films',
      processors: [{ processor: 'map', args: ['fetch'] }, { processor: 'query', args: ['[].title'] }]
    },
    {
      path: 'homeworld',
      query: 'homeworld',
      processors: ['fetch', { processor: 'query', args: ['name'] }]
    }
  ]
}

const converter = new Converter(characterTemplate)
converter.processors.cm2ft = cm2ft

// getPeoplePage()
//   .then(result => {
//     let characters = [result].reduce((c, p) => {
//       p.then(charArray => {

//       })
//     }, Promise.resolve([]))
//   })

converter.render(hanSolo).then(result => {
  console.log(result)
})
