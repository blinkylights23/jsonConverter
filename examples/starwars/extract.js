import ApiClient from './lib/baseClient'

class SwapiClient extends ApiClient {
  constructor(options) {
    super('https://swapi.co/api', options)
  }

  getIdFromUrl(url) {
    const parsedUrl = new URL(url)
    return parsedUrl.pathname.split('/').slice(-1)
  }

  getPageFromUrl(url) {
    const parsedUrl = new URL(url)
    return parseInt(parsedUrl.searchParams.get('page'))
  }

  getResultIterable(result) {
    return result.data.results
  }

  getNextPage(result) {
    if (!result.data.next) {
      return false
    }
    return this.getPageFromUrl(result.data.next)
  }

  people() {
    return this.pageStream('/people')
  }
}

function extract(ratelimit = 1000) {
  const client = new SwapiClient()
  return client.people().ratelimit(1, ratelimit)
}

export { SwapiClient, extract }
