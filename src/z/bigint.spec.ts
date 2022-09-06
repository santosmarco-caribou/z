import { ZBigInt } from './z'

describe('ZBigInt', () => {
  it("should have a hint of 'bigint'", () => {
    const z = ZBigInt.create()
    expect(z.hint).toBe('bigint')
  })

  it('should parse a BigInt', () => {
    const z = ZBigInt.create()
    expect(z.parse(BigInt(1))).toBe(BigInt(1))
  })

  it('should not parse a number', () => {
    const z = ZBigInt.create()
    expect(() => z.parse(1)).toThrowError('"value" must be a bigint')
  })

  it('should not parse `undefined`', () => {
    const z = ZBigInt.create()
    expect(() => z.parse(undefined)).toThrowError('"value" is required')
  })
})
