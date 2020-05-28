import { converter } from './transform'
import axios from 'axios'

axios
  .get('https://swapi.dev/api/people')
  .then(response => {
    return response.data.results.map(person => {
      return converter.render(person).then(converted => converted.result)
    })
  })
  .then(result => Promise.all(result))
  .then(result => console.log(result))
  .catch(error => {
    console.error(error.message)
  })
