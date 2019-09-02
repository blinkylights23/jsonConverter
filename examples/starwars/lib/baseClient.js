import axios from 'axios'
import hl from 'highland'

export default class ApiClient {
  constructor(baseUrl, options) {
    let defaultOptions = {
      retries: 2,
      retryInterval: 1000,
      retryBackoff: 3,
      maxConsecutiveErrors: 5,
      startingPage: 1,
      axios: {}
    }
    this.options = { ...defaultOptions, ...options }
    this.baseUrl = baseUrl
    this.axiosInstance = axios.create({
      baseUrl: this.baseURL,
      ...this.options.axios
    })
  }

  retryPromise(fn, retriesLeft, interval) {
    retriesLeft = retriesLeft || this.options.retries
    interval = interval || this.options.retryInterval
    return new Promise((resolve, reject) => {
      fn()
        .then(resolve)
        .catch(error => {
          console.log('Retrying:', error.message)
          setTimeout(() => {
            if (retriesLeft === 0) {
              reject(error)
              return
            }
            this.retryPromise(fn, interval, retriesLeft - 1).then(resolve, reject)
          }, interval)
        })
    })
  }

  getPage(endpoint, page) {
    return this.axiosInstance(`${this.baseUrl}${endpoint}`, {
      params: { page: page }
    }).then(result => {
      // console.log(result)
      return result
    })
  }

  getNextPage(result) {
    return result.data.next
  }

  getPrevPage(result) {
    return result.data.prev
  }

  getResultIterable(result) {
    return result.data
  }

  pageStream(endpoint, startingPage = 1, endingPage = Infinity) {
    let consecutiveErrors = 0
    let page = startingPage
    let pageGen = (push, next) => {
      let p = () => this.getPage(endpoint, page)
      let r = this.retryPromise(p)
      return r
        .then(result => {
          push(null, hl(this.getResultIterable(result)))
          if (page <= endingPage) {
            let nextPage = this.getNextPage(result)
            if (nextPage) {
              page = nextPage
              next()
            } else {
              push(null, hl.nil)
            }
          } else {
            push(null, hl.nil)
          }
        })
        .then(() => {
          consecutiveErrors = 0
        })
        .catch(error => {
          console.error('Page fetch error: ', error)
          consecutiveErrors++
          if (consecutiveErrors > 5) {
            console.error('/n', 'Process halted: too many consecutive errors', '/n')
            push(null, hl.nil)
          } else {
            let nextPage = this.getNextPage(result)
            if (nextPage) {
              page = nextPage
              next()
            } else {
              push(null, hl.nil)
            }
          }
        })
    }
    return hl(pageGen).sequence()
  }
}
