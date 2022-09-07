import { ZUndefined } from './z'

describe('ZUndefined', () => {
  it("should have a hint of 'undefined'", () => {
    const z = ZUndefined.create()
    expect(z.hint).toBe('undefined')
  })

  /* ---------------------------------------------------------------------------------------------------------------- */

  it('should parse `undefined`', () => {
    const z = ZUndefined.create()
    expect(z.parse(undefined)).toBe(undefined)
  })

  /* ---------------------------------------------------------------------------------------------------------------- */

  it('should not parse `null`', () => {
    const z = ZUndefined.create()
    expect(() => z.parse(null)).toThrowError('"value" is not allowed')
  })

  it('should not parse a non-zero number', () => {
    const z = ZUndefined.create()
    expect(() => z.parse(1)).toThrowError('"value" is not allowed')
  })

  it('should not parse `0`', () => {
    const z = ZUndefined.create()
    expect(() => z.parse(0)).toThrowError('"value" is not allowed')
  })

  it('should not parse a string', () => {
    const z = ZUndefined.create()
    expect(() => z.parse('test')).toThrowError('"value" is not allowed')
  })

  it('should not parse an empty string', () => {
    const z = ZUndefined.create()
    expect(() => z.parse('')).toThrowError('"value" is not allowed')
  })
})
