import axios from 'axios'
import { URL, URLSearchParams } from 'url'
import hl from 'highland'

function extractPeople(url) {
  return axios.get(url).then(result => result)
}

export class SwapiClient {
  constructor() {}

  getIdFromUrl(url) {
    const parsedUrl = new URL(url)
    return parsedUrl.pathname.split('/').slice(-1)
  }

  getPageFromUrl(url) {
    const parsedUrl = new URL(url)
    return parsedUrl.searchParams.page
  }

  retryPromise(fn, retriesLeft = 2, interval = 1000) {
    return new Promise((resolve, reject) => {
      fn()
        .then(resolve)
        .catch(error => {
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

  pageStream() {
    let consecutiveErrors = 0
    let pageGen = (push, next) => {
      let p = () => this.getPage()
      let r = this.retryPromise(p)
      return r
        .then(result => {
          push(null, hl(jp(result, jpExpr)))
          if (page <= endingPage) {
            page++
            next()
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
          }
          page++
          next()
        })
    }
    return hl(pageGen).sequence()
  }

  people() {}
}

// import fetch from 'node-fetch'
// import { URL, URLSearchParams } from 'url'
// import hl from 'highland'
// import jmespath from 'jmespath'

// const jp = jmespath.search

// export class ContentApiClient {
//   constructor(config, secrets) {
//     this.config = config
//     this.secrets = secrets
//     this.reqOpts = {
//       timeout: 0,
//       headers: {
//         'Content-Type': 'application/json'
//       }
//     }
//   }

//   search(query, jpExpr = '@', from = 0) {
//     var { apiUrl, apiOpts } = this._prepareRequest('/content/v3/search/published', query)
//     apiUrl.searchParams.set('size', 100)
//     apiUrl.searchParams.set('sort', 'last_updated_date:desc')

//     let fetchPage = (apiUrl, apiOpts, from = 0) => {
//       apiUrl.searchParams.set('from', from)
//       return fetch(apiUrl.href, apiOpts)
//         .then(response => {
//           // console.log(`status: ${response.status} ${response.statusText}`)
//           return response.json()
//         })
//         .then(result => {
//           return result
//         })
//         .catch(error => {
//           console.error(error)
//         })
//     }

//     let pageGen = (push, next) => {
//       let p = fetchPage(apiUrl, apiOpts, from)
//       p.then(page => {
//         push(null, hl(jp(page.content_elements, jpExpr)))
//         if (page.next) {
//           from = page.next
//           next()
//         } else {
//           push(null, hl.nil)
//         }
//       })
//     }
//     return hl(pageGen).sequence()
//   }

//   getBySourceId(sourceId) {
//     var { apiUrl, apiOpts } = this._prepareRequest('/content/v3/search/published', {
//       q: `source.source_id:${sourceId}`
//     })
//     return fetch(apiUrl.href, apiOpts)
//       .then(response => {
//         if (response.status != 200) {
//           console.log(`status: ${response.status} ${response.statusText}`)
//         }
//         return response.json()
//       })
//       .then(result => {
//         return result
//       })
//   }

//   _prepareRequest(path, params) {
//     var apiHost = `api.${this.config.orgName}.arcpublishing.com`
//     var apiUrl = new URL(`https://${apiHost}${path}`)
//     apiUrl.username = this.secrets.arcUsername
//     apiUrl.password = this.secrets.arcPassword

//     var apiParams = new URLSearchParams(params)
//     apiUrl.search = apiParams.toString()

//     var apiOpts = { ...this.reqOpts, method: 'GET' }
//     return { apiUrl, apiOpts }
//   }
// }

// import fetch from 'node-fetch'
// import { URL, URLSearchParams } from 'url'
// import _ from 'highland'

// export class LPAdapterClient {
//   constructor(config, secrets) {
//     this.config = config
//     this.secrets = secrets
//     this.reqOpts = {
//       timeout: 0,
//       headers: {
//         'Content-Type': 'application/json',
//         'x-api-key': secrets.apiGatewayKey
//       }
//     }
//   }

//   retryPromise(fn, retriesLeft = 2, interval = 1000) {
//     return new Promise((resolve, reject) => {
//       fn()
//         .then(resolve)
//         .catch(error => {
//           setTimeout(() => {
//             if (retriesLeft === 1) {
//               reject(error)
//               return
//             }
//             console.log('Retry adapter client')
//             this.retryPromise(fn, interval, retriesLeft - 1).then(resolve, reject)
//           }, interval)
//         })
//     })
//   }

//   ingest(sourceId, params = {}) {
//     params.id = sourceId
//     var { apiUrl, apiOpts } = this._prepareRequest('/ingest', params)
//     return fetch(apiUrl.href, apiOpts)
//       .then(response => {
//         if (response.status != 200) {
//           return response.json().then(result => {
//             console.error(result)
//           })
//         }
//         return response.json()
//       })
//       .then(result => {
//         return result
//       })
//   }

//   ingestPost(sourceId, body, params = {}) {
//     var params = { id: sourceId, ...params }
//     var { apiUrl, apiOpts } = this._prepareRequest('/ingest', params, 'POST', { body: JSON.stringify(body) })

//     return fetch(apiUrl.href, apiOpts)
//       .then(response => {
//         if (!response.ok) {
//           throw new Error({ status: response.status, statusText: response.statusText, id: sourceId })
//         }
//         return response.json()
//       })
//       .then(result => {
//         return result
//       })
//   }

//   _prepareRequest(path, params, method = 'GET', reqOpts = {}) {
//     var endpointPath = `${this.config.node_env}${path}`
//     var apiHost = 'leparisien.adapter.arcpublishing.com'
//     var apiUrl = new URL(`https://${apiHost}/${endpointPath}`)
//     apiUrl.username = this.secrets.arcUsername
//     apiUrl.password = this.secrets.arcPassword

//     var apiParams = new URLSearchParams(params)
//     apiUrl.search = apiParams.toString()

//     var apiOpts = { ...this.reqOpts, ...reqOpts, method: method }
//     return { apiUrl, apiOpts }
//   }
// }
