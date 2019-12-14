const get = (...props) => obj => {
  return props.reduce((objNode, prop) => (objNode && objNode[prop] ? objNode[prop] : null), obj)
}

const pipe = (...fns) => (...args) => fns.reduce((res, fn) => [fn.call(null, ...res)], args)[0]

const compose = (...fns) => (...args) => fns.reduceRight((res, fn) => [fn.call(null, ...res)], args)[0]

const curry = fn => {
  const arity = fn.length
  return function $curry(...args) {
    if (args.length < arity) {
      return $curry.bind(null, ...args)
    }
    return fn.call(null, ...args)
  }
}

const chunk = (items, size) => {
  return items.reduce((curr, prev, idx) => {
    const chunkIdx = Math.floor(idx / size)
    if (!curr[chunkIdx]) {
      curr[chunkIdx] = []
    }
    curr[chunkIdx].push(prev)
    return curr
  }, [])
}

export { get, pipe, compose, curry, chunk }
