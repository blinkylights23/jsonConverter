import { create } from 'apisauce'
import { compose, curry } from './lib/functional'
import * as baseClient from './lib/baseClient'

const swapiAxiosOptions = {
  baseURL: 'https://swapi.co/api',
  headers: { Accept: 'application/json' }
}

const apiClient = compose(
  baseClient.addAxiosMonitor(baseClient.consoleMonitor),
  create
)

const swapi = apiClient(swapiAxiosOptions)

const getEndpoint = endpoint => {
  return options => {
    baseClient.retries(null, null, () => swapi.get(endpoint, options))
  }
}

const getPeople = getEndpoint('/people')

getPeople()

swapi
  .get('/people', null, { axiosConfig: { url: '/films', method: 'get' } })
  .then(console.log)
  .catch(console.error)

// getPeople
//   .then(response => {
//     return response.data
//   })
//   .then(result => {})
//   .catch(console.error)
