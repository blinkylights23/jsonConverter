import { Converter } from '../../dist'
import characterTemplate from './lib/characterTemplate'
import customProcessors from './lib/customProcessors'

const converter = new Converter(characterTemplate)
converter.processors.cm2ft = customProcessors.cm2ft
converter.processors.kg2lbs = customProcessors.kg2lbs

export { converter }
