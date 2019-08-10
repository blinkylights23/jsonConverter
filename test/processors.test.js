import { processors } from '../dist'

describe('default processors', () => {
  test('upper', () => {
    expect(processors.upper('foo')).toBe('FOO')
  })
  test('lower', () => {
    expect(processors.lower('FOO')).toBe('foo')
  })
  test('trim', () => {
    expect(processors.trim('  foo')).toBe('foo')
    expect(processors.trim('foo  ')).toBe('foo')
    expect(processors.trim('  foo  ')).toBe('foo')
  })
  test('join', () => {
    expect(processors.join(['foo', 'bar'])).toBe('foo, bar')
    expect(processors.join(['foo', 'bar'], '**')).toBe('foo**bar')
  })
  test('query', () => {
    expect(processors.query(['foo', 'bar'], 'length([])')).toBe(2)
    expect(processors.query(['foo', 'bar'], '[1]')).toBe('bar')
  })
  test('slugify', () => expect(true).toBe(false))
  test('stringFormat', () => expect(true).toBe(false))
  test('escape', () => expect(true).toBe(false))
  test('titleCase', () => expect(true).toBe(false))
  test('truncate', () => expect(true).toBe(false))
  test('fetch', () => expect(true).toBe(false))
  test('stripTags', () => expect(true).toBe(false))
  test('sort', () => expect(true).toBe(false))
  test('slice', () => expect(true).toBe(false))
  test('dateFormat', () => expect(true).toBe(false))
  test('convert', () => expect(true).toBe(false))
  test('map', () => expect(true).toBe(false))
})
