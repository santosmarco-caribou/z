import { ZNever } from './z'

describe('ZNever', () => {
  it("should have a hint of 'never'", () => {
    const z = ZNever.create()
    expect(z.hint).toBe('never')
  })

  /* ---------------------------------------------------------------------------------------------------------------- */

  it('should not parse `undefined`', () => {
    const z = ZNever.create()
    expect(() => z.parse(undefined)).toThrowError('"value" is required')
  })

  it('should not parse `null`', () => {
    const z = ZNever.create()
    expect(() => z.parse(null)).toThrowError('"value" is not allowed')
  })

  it('should not parse a non-zero number', () => {
    const z = ZNever.create()
    expect(() => z.parse(1)).toThrowError('"value" is not allowed')
  })

  it('should not parse `0`', () => {
    const z = ZNever.create()
    expect(() => z.parse(0)).toThrowError('"value" is not allowed')
  })

  it('should not parse a string', () => {
    const z = ZNever.create()
    expect(() => z.parse('test')).toThrowError('"value" is not allowed')
  })

  it('should not parse an empty string', () => {
    const z = ZNever.create()
    expect(() => z.parse('')).toThrowError('"value" is not allowed')
  })
})
