import JSONStream from 'JSONStream'
import hl from 'highland'
import { converter } from './transform'
import { create } from 'apisauce'
import { compose } from './lib/functional'
import * as baseClient from './lib/baseClient'

const swapiAxiosOptions = {
  baseURL: 'https://swapi.co/api',
  headers: { Accept: 'application/json' }
}

const apiClient = compose(baseClient.addAxiosMonitor(baseClient.consoleMonitor), create)

const swapi = apiClient(swapiAxiosOptions)

const getEndpoint = endpoint => {
  return options => {
    return baseClient.retries(null, null, () => swapi.get(endpoint, options))
  }
}

const peopleEndpoint = getEndpoint('/people')
const swapiPagination = {
  getPageFromUrl: url => {
    let parsedUrl = new URL(url)
    return parseInt(parsedUrl.searchParams.get('page'))
  },
  getNext: result => {
    if (!result.data.next) {
      return false
    }
    return swapiPagination.getPageFromUrl(result.data.next)
  },
  getPrev: result => result.prev,
  getResultIterable: result => {
    return result.data.results
  },
  getPage: page => peopleEndpoint({ page: page })
}
const peopleStreamer = new baseClient.PageStreamer(swapiPagination, peopleEndpoint)

peopleStreamer(1)
  .ratelimit(1, 500)
  .map(item => {
    return hl(converter.render(item))
  })
  .flatten()
  .through(JSONStream.stringify('[\n  ', ',\n  ', '\n]\n'))
  .pipe(process.stdout)
