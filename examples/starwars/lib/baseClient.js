import { create } from 'apisauce'
import { compose, curry } from './functional'
import hl from 'highland'

// Monitors
const addAxiosMonitor = curry((monitor, api) => {
  api.addMonitor(monitor)
  return api
})

const consoleMonitor = response => {
  let ok = response.ok ? 'OK' : 'ERROR'
  let problem = response.problem ? response.problem : ''
  console.log(
    `${ok} ${response.status} ${problem} (${response.duration}ms) ${response.config.method.toUpperCase()} ${
      response.config.url
    }`
  )
}

// Promise retries
const retries = (retryCount = 3, interval = 1000, fn) => {
  return new Promise((resolve, reject) => {
    fn()
      .then(resolve)
      .catch(error => {
        if (retryCount <= 0) {
          return reject('maximum retries exceeded')
        }
        console.warning(`Retrying in ${interval}, ${retryCount} tries remaining (${error})`)
        setTimeout(() => {
          retries(retryCount - 1, interval * 3, fn).then(resolve)
        }, interval)
      })
  })
}

// Processing response

const PageStreamer = function(options, endpoint) {
  var getNext = result => result.next
  var getPrev = result => result.prev
  var getResultIterable = result => result.data
  var getPage = page => endpoint({ page: page })

  this.getNext = options.getNext || getNext
  this.getPrev = options.getPrev || getPrev
  this.getResultIterable = options.getResultIterable || getResultIterable
  this.getPage = options.getPage || getPage

  this.pageGen = (push, next) => {
    let page
    if (!page) page = start
    let consecutiveErrors = 0
    return this.getPage(page)
      .then(result => {
        // console.log('pageGen getPage.then', this.getResultIterable(result))
        push(null, hl(this.getResultIterable(result)))
        if (page <= end) {
          let nextPage = this.getNext(result)
          if (nextPage) {
            page = nextPage
            console.log('Getting next page')
            next()
          } else {
            console.log('Quitting')
            push(null, hl.nil)
          }
        } else {
          console.log('Quitting')
          push(null, hl.nil)
        }
      })
      .then(() => (consecutiveErrors = 0))
      .catch(error => {
        console.error('Page fetch error: ', error)
        consecutiveErrors++
        if (consecutiveErrors > 5) {
          console.error('/n', 'Process halted: too many consecutive errors', '/n')
          push(null, hl.nil)
        } else {
          next()
        }
      })
  }

  return (start, end = Infinity) => {
    let consecutiveErrors = 0
    let page = start
    var pageGen = (push, next) => {
      return this.getPage(page)
        .then(result => {
          // console.log('pageGen getPage.then', this.getResultIterable(result))
          push(null, hl(this.getResultIterable(result)))
          if (page <= end) {
            let nextPage = this.getNext(result)
            if (nextPage) {
              page = nextPage
              console.log('Getting next page')
              next()
            } else {
              console.log('Quitting')
              push(null, hl.nil)
            }
          } else {
            console.log('Quitting')
            push(null, hl.nil)
          }
        })
        .then(() => (consecutiveErrors = 0))
        .catch(error => {
          console.error('Page fetch error: ', error)
          consecutiveErrors++
          if (consecutiveErrors > 5) {
            console.error('/n', 'Process halted: too many consecutive errors', '/n')
            push(null, hl.nil)
          } else {
            next()
          }
        })
    }
    return hl(pageGen).sequence()
  }
}

export { retries, addAxiosMonitor, consoleMonitor, PageStreamer }
