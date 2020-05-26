import jmespath from 'jmespath'
import processors from './processors'

export default class Converter {
  constructor(template) {
    this.template = template
    this.processors = processors
    this.hooks = []
  }

  assignDotted(obj, path, val) {
    const keys = path.split('.')
    const tailKey = keys.pop()
    var tailObj = keys.reduce((obj, key) => {
      return (obj[key] = obj[key] || {})
    }, obj)
    tailObj[tailKey] = val
  }

  applyProcessor(processor, value) {
    var promisify = (result) => {
      if (result instanceof Promise) return result
      else return Promise.resolve(result)
    }

    // If processor is a string, call the property on this.processors with value
    if (typeof processor == 'string') {
      return promisify(this.processors[processor](value))
    }
    // if processor is an object with a "processor" member, call the this.processors member with value, and processor.args
    if (typeof processor == 'object') {
      let args = processor.args || []
      return promisify(this.processors[processor.processor].apply(this.processors, [value, ...args]))
    }
    // if processor is a function, call the function with value
    if (typeof processor == 'function') {
      return promisify(processor(value))
    }
  }

  render(source) {
    var asyncMapping = this.template.mappings.map((mapping) => {
      let asyncResult
      if (mapping.processors) {
        let initialValue = mapping.value || jmespath.search(source, mapping.query || '@')
        asyncResult = mapping.processors
          .reduce((prev, curr) => {
            return prev.then((result) => {
              return this.applyProcessor(curr, result)
            })
          }, Promise.resolve(initialValue))
          .then((outcome) => {
            return {
              path: mapping.path,
              result: outcome,
              hook: mapping.hook,
            }
          })
      } else if (mapping.query) {
        asyncResult = Promise.resolve({
          path: mapping.path,
          result: jmespath.search(source, mapping.query),
          hook: mapping.hook,
        })
      } else if (mapping.value) {
        asyncResult = Promise.resolve({ path: mapping.path, result: mapping.value, hook: mapping.hook })
      }
      return asyncResult
    })
    return Promise.all(asyncMapping).then((results) => {
      let processingResult = results
        .map((obj) => {
          if (obj.hook) {
            obj.result = obj.hook(obj.result)
          }
          return obj
        })
        .reduce((obj, result) => {
          this.assignDotted(obj, result.path, result.result)
          return obj
        }, {})
      return processingResult
    })
  }
}
