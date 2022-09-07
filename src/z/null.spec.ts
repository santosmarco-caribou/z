import { ZNull } from './z'

describe('ZNull', () => {
  it("should have a hint of 'null'", () => {
    const z = ZNull.create()
    expect(z.hint).toBe('null')
  })

  /* ---------------------------------------------------------------------------------------------------------------- */

  it('should parse `null`', () => {
    const z = ZNull.create()
    expect(z.parse(null)).toBe(null)
  })

  /* ---------------------------------------------------------------------------------------------------------------- */

  it('should not parse `undefined`', () => {
    const z = ZNull.create()
    expect(() => z.parse(undefined)).toThrowError('"value" is required')
  })

  it('should not parse a non-zero number', () => {
    const z = ZNull.create()
    expect(() => z.parse(1)).toThrowError('"value" must be [null]')
  })

  it('should not parse `0`', () => {
    const z = ZNull.create()
    expect(() => z.parse(0)).toThrowError('"value" must be [null]')
  })

  it('should not parse a string', () => {
    const z = ZNull.create()
    expect(() => z.parse('test')).toThrowError('"value" must be [null]')
  })

  it('should not parse an empty string', () => {
    const z = ZNull.create()
    expect(() => z.parse('')).toThrowError('"value" must be [null]')
  })
})
