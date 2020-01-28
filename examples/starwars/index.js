import { converter } from './transform'
import people from './data/people'

Promise.all(
  people.map(item => {
    return converter.render(item)
  })
).then(result => {
  console.log(result)
})
