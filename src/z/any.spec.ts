import { ZAny } from './z'

describe('ZAny', () => {
  it("should have a hint of 'any'", () => {
    const z = ZAny.create()
    expect(z.hint).toBe('any')
  })

  it('should parse a string', () => {
    const z = ZAny.create()
    expect(z.parse('test')).toBe('test')
  })

  it('should parse an empty string', () => {
    const z = ZAny.create()
    expect(z.parse('')).toBe('')
  })

  it('should parse a number', () => {
    const z = ZAny.create()
    expect(z.parse(1)).toBe(1)
  })

  it('should parse `NaN`', () => {
    const z = ZAny.create()
    expect(z.parse(NaN)).toBe(NaN)
  })

  it('should parse `undefined`', () => {
    const z = ZAny.create()
    expect(z.parse(undefined)).toBe(undefined)
  })

  it('should parse `null`', () => {
    const z = ZAny.create()
    expect(z.parse(null)).toBe(null)
  })
})
