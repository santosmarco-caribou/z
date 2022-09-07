import { ZBigInt } from './z'

describe('ZBigInt', () => {
  it("should have a hint of 'bigint'", () => {
    const z = ZBigInt.create()
    expect(z.hint).toBe('bigint')
  })

  /* ---------------------------------------------------------------------------------------------------------------- */

  it('should parse a BigInt', () => {
    const z = ZBigInt.create()
    expect(z.parse(BigInt(1))).toBe(BigInt(1))
  })

  /* ---------------------------------------------------------------------------------------------------------------- */

  it('should not parse `undefined`', () => {
    const z = ZBigInt.create()
    expect(() => z.parse(undefined)).toThrowError('"value" is required')
  })

  it('should not parse `null`', () => {
    const z = ZBigInt.create()
    expect(() => z.parse(null)).toThrowError('"value" must be a bigint')
  })

  it('should not parse a non-zero number', () => {
    const z = ZBigInt.create()
    expect(() => z.parse(1)).toThrowError('"value" must be a bigint')
  })

  it('should not parse `0`', () => {
    const z = ZBigInt.create()
    expect(() => z.parse(0)).toThrowError('"value" must be a bigint')
  })

  it('should not parse a string', () => {
    const z = ZBigInt.create()
    expect(() => z.parse('test')).toThrowError('"value" must be a bigint')
  })

  it('should not parse an empty string', () => {
    const z = ZBigInt.create()
    expect(() => z.parse('')).toThrowError('"value" must be a bigint')
  })
})
