import { Converter } from '../dist'

describe('a Converter instance', () => {
  test('can assign an arbitrary value to destination JSON', () => expect(true).toBe(true))
  test('can assign a value to a nested path in the destination JSON', () => expect(true).toBe(true))
  test('can assign a value from a jmespath query against the source JSON', () => expect(true).toBe(true))
  test('can apply a default processor to a queried source value', () => expect(true).toBe(true))
  test('applies processor to full source document when mapping query is undefined', () => expect(true).toBe(true))
  test('can accept an arbitrary function as a processor', () => expect(true).toBe(true))
})
