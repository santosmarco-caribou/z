import { ZBoolean, ZFalse, ZTrue } from './boolean'

describe('ZBoolean', () => {
  it("should have a hint of 'boolean'", () => {
    const z = ZBoolean.create()
    expect(z.hint).toBe('boolean')
  })

  it('.truthy() should return an instance of ZTrue', () => {
    const z = ZBoolean.create()
    expect(z.truthy()).toBeInstanceOf(ZTrue)
  })

  it('.falsy() should return an instance of ZFalse', () => {
    const z = ZBoolean.create()
    expect(z.falsy()).toBeInstanceOf(ZFalse)
  })

  it('should parse `true`', () => {
    const z = ZBoolean.create()
    expect(z.parse(true)).toBe(true)
  })

  it('should parse `false`', () => {
    const z = ZBoolean.create()
    expect(z.parse(false)).toBe(false)
  })

  it("should not parse `'test'`", () => {
    const z = ZBoolean.create()
    expect(() => z.parse('test')).toThrowError(new Error('"value" must be a boolean'))
  })

  describe('ZTrue', () => {
    it("should have a hint of 'true'", () => {
      const z = ZTrue.create()
      expect(z.hint).toBe('true')
    })

    it('should parse `true`', () => {
      const z = ZTrue.create()
      expect(z.parse(true)).toBe(true)
    })

    it('should not parse `false`', () => {
      const z = ZTrue.create()
      expect(() => z.parse(false)).toThrowError(new Error('"value" must be [true]'))
    })
  })

  describe('ZFalse', () => {
    it("should have a hint of 'false'", () => {
      const z = ZFalse.create()
      expect(z.hint).toBe('false')
    })

    it('should parse `false`', () => {
      const z = ZFalse.create()
      expect(z.parse(false)).toBe(false)
    })

    it('should not parse `true`', () => {
      const z = ZFalse.create()
      expect(() => z.parse(true)).toThrowError(new Error('"value" must be [false]'))
    })
  })
})
