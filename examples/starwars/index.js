import { extract } from './extract'
import { converter } from './transform'
import loadTransformed from './load'

extract(500)
  .map(item => {
    return converter.render(item)
  })
  .each(loadTransformed)
