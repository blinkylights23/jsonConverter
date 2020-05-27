import jmespath from 'jmespath'
import processors from './processors'

export default class Converter {
  constructor(template) {
    this.template = template
    this.processors = processors
    this.hooks = {}
    this.refs = {}
  }

  promisify(result) {
    if (result instanceof Promise) return result
    return Promise.resolve(result)
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
    // If processor is a string, call the property on this.processors with value
    if (typeof processor == 'string') {
      return this.promisify(this.processors[processor](value))
    }
    // if processor is an object with a "processor" member, call the this.processors member with value, and processor.args
    if (typeof processor == 'object') {
      let args = processor.args || []
      return this.promisify(this.processors[processor.processor].apply(this.processors, [value, ...args]))
    }
    // if processor is a function, call the function with value
    if (typeof processor == 'function') {
      return this.promisify(processor(value))
    }
  }

  applyHook(hook, obj) {
    // If hook is a string, call the property on this.hooks with value
    if (typeof hook == 'string') {
      return this.promisify(this.hooks[hook](obj))
    }
    // if hook is an object with a "hook" member, call the this.hooks member with value, and hook.args
    if (typeof hook == 'object') {
      let args = hook.args || []
      return this.promisify(this.hooks[hook.hook].apply(this.hooks, [obj, ...args]))
    }
    // if hook is a function, call the function with value
    if (typeof hook == 'function') {
      return this.promisify(hook(obj))
    }
  }

  applyReference(ref, obj) {}

  render(source) {
    var asyncMapping = this.template.mappings.map(mapping => {
      let mapResult
      let sourceValue = mapping.value || jmespath.search(source, mapping.query || '@')
      let initialResult = {
        path: mapping.path,
        sourceValue: sourceValue,
        result: sourceValue
      }
      if (mapping.processors) {
        mapResult = mapping.processors
          .reduce((prev, curr) => {
            return prev.then(result => {
              return this.applyProcessor(curr, result)
            })
          }, Promise.resolve(sourceValue))
          .then(outcome => {
            return { ...initialResult, result: outcome }
          })
      } else {
        mapResult = Promise.resolve(initialResult)
      }
      if (mapping.hook) {
        mapResult = mapResult.then(resultObj => {
          return this.applyHook(mapping.hook, resultObj).then(hookResult => {
            return { ...resultObj, result: hookResult }
          })
        })
      }
      return mapResult
    })
    return Promise.all(asyncMapping).then(results => {
      let processingResult = results
        .map(obj => {
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
