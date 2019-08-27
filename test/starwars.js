import axios from 'axios'
import { Converter, processors } from '../dist'
import hanSolo from './fixtures/hansolo'

function getHomeworld(url) {
  return axios.get(url).then(response => {
    return response.data.name
  })
}

function cm2ft(cm) {
  var floatFeet = (cm * 0.3937) / 12
  var feet = Math.floor(floatFeet)
  var inches = Math.round((floatFeet - feet) * 12)
  return `${feet}'${inches}"`
}

const characterTemplate = {
  mappings: [
    { path: 'characterName', query: 'name' },
    { path: 'isAwesome', value: true },
    { path: 'lowerName', query: 'name', processors: ['lower', 'trim'] },
    { path: 'height', query: 'height', processors: [cm2ft] },
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
    { path: 'bio.homeworld', query: 'homeworld', processors: [getHomeworld] }
  ]
}

const converter = new Converter(characterTemplate)

converter.render(hanSolo).then(result => {
  console.log(result)
})
