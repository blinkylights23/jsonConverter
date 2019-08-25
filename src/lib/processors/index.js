import jmespath from 'jmespath'

export default {
  upper: value => value.toUpperCase(),
  lower: value => value.toLowerCase(),
  trim: value => value.trim(),
  join: (value, joiner = ', ') => value.join(joiner),
  map: function(arrayValue, fn) {
    return arrayValue.map(this[fn])
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
    return template.replace(/{([^\}]+)}/g, () => {
      return typeof args[i] != 'undefined' ? args[i++] : '';
    })
  }
  sort: (value, fn) => value.sort(fn),
  slice: (value, start, end) => value.slice(start, end),
  dateFormat: value => {
  },
  fetch: value => value,
  stripTags: value => value,
  convert: () => Promise.resolve('converter')
}
