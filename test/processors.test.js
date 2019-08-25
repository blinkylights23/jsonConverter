import { processors } from '../dist'

describe('default processors', () => {
  test('upper', () => {
    expect(processors.upper('han solo')).toBe('HAN SOLO')
  })
  test('lower', () => {
    expect(processors.lower('HAN SOLO')).toBe('han solo')
  })
  test('trim', () => {
    expect(processors.trim('  Han Solo')).toBe('Han Solo')
    expect(processors.trim('Han Solo  ')).toBe('Han Solo')
    expect(processors.trim('  Han Solo  ')).toBe('Han Solo')
  })
  test('join', () => {
    expect(processors.join(['Han', 'Solo'])).toBe('Han, Solo')
    expect(processors.join(['Han', 'Solo'], '**')).toBe('Han**Solo')
  })
  test('query', () => {
    expect(processors.query(['Han', 'Solo'], 'length([])')).toBe(2)
    expect(processors.query(['Han', 'Solo'], '[1]')).toBe('Solo')
  })
  test('slugify', () => {
    expect(processors.slugify('Han Solo, han@scoundrel.com')).toBe('han-solo-hanscoundrelcom')
  })
  test('map', () => {
    expect(processors.map(['foo', 'bar'], 'upper')).toStrictEqual(['FOO', 'BAR'])
  })
  // test('stringFormat', () => {
  //   expect(processors.stringFormat({ foo: 'bar' }, 'The value of foo is {foo}', ['foo'])).toBe(false)
  // })
  test('titleCase', () => {
    expect(processors.titleCase('I have a bad feeling about this')).toBe('I Have A Bad Feeling About This')
  })
  test('toJson', () => {
    expect(processors.toJson({ quote: '"I bet you have," he said, and then shot first.' }))
      .toBe("{\"quote\":\"\\\"I bet you have,\\\" he said, and then shot first.\"}")
  })
  // test('truncate', () => expect(true).toBe(false))
  // test('fetch', () => expect(true).toBe(false))
  // test('stripTags', () => expect(true).toBe(false))
  // test('sort', () => expect(true).toBe(false))
  // test('slice', () => expect(true).toBe(false))
  // test('dateFormat', () => expect(true).toBe(false))
  // test('convert', () => expect(true).toBe(false))
})
