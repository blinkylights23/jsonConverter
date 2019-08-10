import axios from 'axios'
import { Converter } from '../dist'
import hanSolo from './fixtures/hansolo'

function getHomeworld(url) {
  return axios.get(url).then(response => {
    return response.data.name
  })
}

const characterTemplate = {
  mappings: [
    { path: 'characterName', query: 'name' },
    { path: 'isAwesome', value: true },
    { path: 'lowerName', query: 'name', processors: ['lower', 'trim'] },
    { path: 'height', query: 'height', processors: [value => value / 30.48] },
    { path: 'films', query: 'films', processors: [{ processor: 'join', args: [' :: '] }] },
    { path: 'bio.homeworld', query: 'homeworld', processors: [getHomeworld] }
  ]
}

const converter = new Converter(hanSolo, characterTemplate)

converter.render().then(result => {
  console.log(result)
})
