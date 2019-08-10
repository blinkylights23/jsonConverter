import jmespath from 'jmespath'

export default {
  upper: value => value.toUppercase(),
  lower: value => value.toLowerCase(),
  trim: value => value.trim(),
  join: (value, joiner = ', ') => value.join(joiner),
  map: (arrayValue, fn) => arrayValue.map(fn),
  query: (value, query) => jmespath.search(value, query),
  convert: () => Promise.resolve('converter'),
  slugify: value => value,
  stringFormat: (value, template) => value,
  escape: value => value,
  titleCase: value => value,
  truncate: value => value,
  fetch: value => value,
  stripTags: value => value,
  sort: value => value,
  slice: value => value,
  dateFormat: value => value
}
