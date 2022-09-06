import { ZDate } from './z'

describe('ZDate', () => {
  it("should have a hint of 'Date'", () => {
    const z = ZDate.create()
    expect(z.hint).toBe('Date')
  })

  describe('.before()', () => {
    const targetValue = new Date('December 30, 2017 11:20:00')

    it('should parse a valid date', () => {
      const z = ZDate.create()
      const testValue = new Date('December 28, 2017 11:20:00')
      expect(z.before(targetValue).parse(testValue)).toMatchObject(testValue)
    })

    it('should not parse an invalid date', () => {
      const z = ZDate.create()
      const testValue = new Date('December 31, 2017 11:20:00')
      expect(() => z.before(targetValue).parse(testValue)).toThrowError(
        `"value" must be less than or equal to "${targetValue.toISOString()}"`
      )
    })
  })
})
