import jmespath from 'jmespath'
import axios from 'axios'

export default {
  upper: value => value.toUpperCase(),
  lower: value => value.toLowerCase(),
  trim: value => value.trim(),
  join: (value, joiner = ', ') => value.join(joiner),
  map: function (arrayValue, fn) {
    return Promise.all(
      arrayValue.map(v => {
        let processorResult = this[fn](v)
        if (processorResult instanceof Promise) return processorResult
        else return Promise.resolve(processorResult)
      })
    )
  },
  query: (value, query) => jmespath.search(value, query),
  slugify: value => {
    return value
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '')
  },
  titleCase: value => {
    return value
      .split(' ')
      .map(w => w[0].toUpperCase() + w.substr(1).toLowerCase())
      .join(' ')
  },
  toJson: value => JSON.stringify(value),
  stringFormat: (value, template) => {
    return template.replace(/{([^\}]+)}/g, (m, s) => {
      return typeof value[s] != 'undefined' ? value[s] : ''
    })
  },
  sort: (value, fn) => value.sort(fn),
  slice: (value, start, end) => value.slice(start, end),
  dateFormat: value => {
    let d = new Date(value)
    return d.toISOString()
  },
  fetch: (value, params = {}) => {
    return axios.get(value, params).then(response => response.data)
  }
}
