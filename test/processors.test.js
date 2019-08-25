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
  test('stringFormat', () => {
    expect(
      processors.stringFormat({ feeling: 'bad', about: 'this' }, 'I have a {feeling} feeling about {about}.')
    ).toBe('I have a bad feeling about this.')
  })
  test('titleCase', () => {
    expect(processors.titleCase('I have a bad feeling about this')).toBe('I Have A Bad Feeling About This')
  })
  test('toJson', () => {
    expect(processors.toJson({ quote: '"I bet you have," he said, and then shot first.' })).toBe(
      '{"quote":"\\"I bet you have,\\" he said, and then shot first."}'
    )
  })
  test('dateFormat', () => {
    expect(processors.dateFormat('May 25, 1977 13:00 EDT')).toBe('1977-05-25T17:00:00.000Z')
  })
  test('sort', () => {
    expect(processors.sort(['wookiee', 'jawa', 'ewok'])).toStrictEqual(['ewok', 'jawa', 'wookiee'])
    expect(processors.sort([1000, 900, 80], (a, b) => a - b)).toStrictEqual([80, 900, 1000])
  })
  test('slice', () => {
    expect(
      processors.slice("...or given you clairvoyance enough to find the Rebels' hidden base, Lord Vader.", 0, -18)
    ).toBe("...or given you clairvoyance enough to find the Rebels' hidden")
  })
  // test('fetch', () => expect(true).toBe(false))
  // test('convert', () => expect(true).toBe(false))
})
