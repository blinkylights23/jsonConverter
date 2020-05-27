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
    if (typeof processor == 'string') {
      return this.promisify(this.processors[processor](value))
    }
    if (typeof processor == 'object') {
      let args = processor.args || []
      return this.promisify(this.processors[processor.processor].apply(this.processors, [value, ...args]))
    }
    if (typeof processor == 'function') {
      return this.promisify(processor(value))
    }
  }

  applyHook(hook, obj) {
    if (typeof hook == 'string') {
      return this.promisify(this.hooks[hook](obj))
    }
    if (typeof hook == 'object') {
      let args = hook.args || []
      return this.promisify(this.hooks[hook.hook].apply(this.hooks, [obj, ...args]))
    }
    if (typeof hook == 'function') {
      return this.promisify(hook(obj))
    }
  }

  applyReference(ref, obj) {
    if (typeof ref == 'string') {
      return this.promisify(this.refs[ref](obj))
    }
    if (typeof ref == 'object') {
      let args = ref.args || []
      return this.promisify(this.refs[ref.ref].apply(this.refs, [obj, ...args]))
    }
    if (typeof ref == 'function') {
      return this.promisify(ref(obj))
    }
  }

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
      if (mapping.ref) {
        mapResult = mapResult.then(resultObj => {
          return this.applyReference(mapping.ref, resultObj).then(refResult => {
            let [refPointer, refObj] = refResult
            return { ...resultObj, result: refPointer, referencedObj: refObj }
          })
        })
      }
      return mapResult
    })
    return Promise.all(asyncMapping).then(results => {
      let processingResult = results.reduce(
        (prev, curr) => {
          this.assignDotted(prev.result, curr.path, curr.result)
          if (curr.referencedObj) {
            prev.references.push(curr.referencedObj)
          }
          return prev
        },
        {
          result: {},
          references: [],
          errors: [],
          warnings: []
        }
      )
      return processingResult
    })
  }
}
