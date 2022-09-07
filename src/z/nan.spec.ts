import { ZNaN } from './z'

describe('ZNaN', () => {
  it("should have a hint of 'NaN'", () => {
    const z = ZNaN.create()
    expect(z.hint).toBe('NaN')
  })

  /* ---------------------------------------------------------------------------------------------------------------- */

  it('should parse a NaN', () => {
    const z = ZNaN.create()
    expect(z.parse(NaN)).toBe(NaN)
  })

  /* ---------------------------------------------------------------------------------------------------------------- */

  it('should not parse `undefined`', () => {
    const z = ZNaN.create()
    expect(() => z.parse(undefined)).toThrowError('"value" is required')
  })

  it('should not parse `null`', () => {
    const z = ZNaN.create()
    expect(() => z.parse(null)).toThrowError('"value" must be a NaN')
  })

  it('should not parse a non-zero number', () => {
    const z = ZNaN.create()
    expect(() => z.parse(1)).toThrowError('"value" must be a NaN')
  })

  it('should not parse `0`', () => {
    const z = ZNaN.create()
    expect(() => z.parse(0)).toThrowError('"value" must be a NaN')
  })

  it('should not parse a string', () => {
    const z = ZNaN.create()
    expect(() => z.parse('test')).toThrowError('"value" must be a NaN')
  })

  it('should not parse an empty string', () => {
    const z = ZNaN.create()
    expect(() => z.parse('')).toThrowError('"value" must be a NaN')
  })
})
