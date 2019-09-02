import hl from 'highland'
import JSONStream from 'JSONStream'
import { extract } from './extract'
import { converter } from './transform'

extract(500)
  .map(item => {
    return item
    // return hl(converter.render(item))
  })
  .flatten()
  .through(JSONStream.stringify('[\n  ', ',\n  ', '\n]\n'))
  .pipe(process.stdout)
