import { ZAny, ZArray } from '../_internals'

describe('ZArray', () => {
  let z: ZArray<ZAny>

  beforeEach(() => {
    z = ZArray.create(ZAny.create())
  })

  test('should have a name of "ZArray"', () => {
    expect(z.name).toBe('ZArray')
  })

  test(`should have a hint of "Array<any>"`, () => {
    expect(z.hint).toBe('Array<any>')
  })

  test('should parse []', () => {
    expect(z.parse([])).toStrictEqual([])
  })

  describe('.ascending()', () => {
    test(`should parse [1, 2, 3, 4]"`, () => {
      expect(z.ascending().parse([1, 2, 3, 4])).toStrictEqual([1, 2, 3, 4])
    })

    test(`should parse and convert [2, 3, 1, 4]"`, () => {
      expect(z.ascending().parse([2, 3, 1, 4])).toStrictEqual([1, 2, 3, 4])
    })

    test(`should not parse [2, 3, 1, 4] in strict mode"`, () => {
      expect(
        z.ascending({ strict: true }).safeParse([2, 3, 1, 4]).error?.message
      ).toBe('"value" must be sorted in ascending order by value')
    })
  })

  describe('.descending()', () => {
    test(`should parse [4, 3, 2, 1]"`, () => {
      expect(z.descending().parse([4, 3, 2, 1])).toStrictEqual([4, 3, 2, 1])
    })

    test(`should parse and convert [2, 3, 1, 4]"`, () => {
      expect(z.descending().parse([2, 3, 1, 4])).toStrictEqual([4, 3, 2, 1])
    })

    test(`should not parse [2, 3, 1, 4] in strict mode"`, () => {
      expect(
        z.descending({ strict: true }).safeParse([2, 3, 1, 4]).error?.message
      ).toBe('"value" must be sorted in descending order by value')
    })
  })

  describe('.min()', () => {
    test(`should parse [1, 2, 3] with min(2)"`, () => {
      expect(z.min(2).parse([1, 2, 3])).toStrictEqual([1, 2, 3])
    })

    test(`should parse [1, 2] with min(2)"`, () => {
      expect(z.min(2).parse([1, 2])).toStrictEqual([1, 2])
    })

    test(`should not parse [1] with min(2)"`, () => {
      expect(z.min(2).safeParse([1]).error?.message).toBe(
        '"value" must contain at least 2 items'
      )
    })
  })

  describe('.max()', () => {
    test(`should parse [1] with max(2)"`, () => {
      expect(z.max(2).parse([1])).toStrictEqual([1])
    })

    test(`should parse [1, 2] with max(2)"`, () => {
      expect(z.max(2).parse([1, 2])).toStrictEqual([1, 2])
    })

    test(`should not parse [1, 2, 3] with max(2)"`, () => {
      expect(z.max(2).safeParse([1, 2, 3]).error?.message).toBe(
        '"value" must contain less than or equal to 2 items'
      )
    })
  })

  describe('.length()', () => {
    test(`should parse [1, 2] with length(2)"`, () => {
      expect(z.length(2).parse([1, 2])).toStrictEqual([1, 2])
    })

    test(`should not parse [1] with length(2)"`, () => {
      expect(z.length(2).safeParse([1]).error?.message).toBe(
        '"value" must contain 2 items'
      )
    })

    test(`should not parse [1, 2, 3] with length(2)"`, () => {
      expect(z.length(2).safeParse([1, 2, 3]).error?.message).toBe(
        '"value" must contain 2 items'
      )
    })
  })

  describe('.nonempty()', () => {
    test(`should parse [1, 2] with nonempty()"`, () => {
      expect(z.nonempty().parse([1, 2])).toStrictEqual([1, 2])
    })

    test(`should parse [1] with nonempty()"`, () => {
      expect(z.nonempty().parse([1])).toStrictEqual([1])
    })

    test(`should not parse [] with nonempty()"`, () => {
      expect(z.nonempty().safeParse([]).error?.message).toBe(
        '"value" must contain at least 1 item'
      )
    })
  })
})
