/* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */

import { Entries } from 'type-fest'

import { AnyZ } from './_internals'

const BASE_SPEC_TEST_VALUE_MAP = {
  undefined: undefined,
  null: null,
  true: true,
  false: false,
} as const

type BaseSpecTestValues = typeof BASE_SPEC_TEST_VALUE_MAP
type BaseSpecTestValuesKey = keyof BaseSpecTestValues

type ShouldParseConfig = {
  parse: true
}
type ShouldNotParseConfig = {
  parse: false
  expectedIssue: {
    code: string
    message: string
  }
}

type ShouldConfig = {
  [K in BaseSpecTestValuesKey]: ShouldParseConfig | ShouldNotParseConfig
}

type BaseSpecConfig = {
  expectedTypeName: string
  expectedHint: string
  should: ShouldConfig
}

export const generateBaseSpec = (sut: { create: () => AnyZ }, config: BaseSpecConfig): void => {
  let z: AnyZ

  beforeEach(() => {
    z = sut.create()
  })

  test(`should have a name of ${JSON.stringify(config.expectedTypeName)}`, () => {
    expect(z.name).toBe(config.expectedTypeName)
  })

  test(`should have a hint of ${JSON.stringify(config.expectedHint)}`, () => {
    expect(z.hint).toBe(config.expectedHint)
  })

  const shouldParse = Object.entries(config.should).filter(([_, { parse }]) => parse) as Entries<
    Record<BaseSpecTestValuesKey, ShouldParseConfig>
  >
  const shouldNotParse = Object.entries(config.should).filter(([_, { parse }]) => !parse) as Entries<
    Record<BaseSpecTestValuesKey, ShouldNotParseConfig>
  >

  describe('should parse', () => {
    shouldParse.forEach(([key]) => {
      test(key, () => {
        expect(z.parse(BASE_SPEC_TEST_VALUE_MAP[key])).toStrictEqual(BASE_SPEC_TEST_VALUE_MAP[key])
      })
    })
  })

  describe('should not parse', () => {
    shouldNotParse.forEach(([key, val]) => {
      describe(key, () => {
        test(`with only one issue`, () => {
          expect(z.safeParse(BASE_SPEC_TEST_VALUE_MAP[key]).error?.issues).toHaveLength(1)
        })

        test(`with issue code ${JSON.stringify(val.expectedIssue.code)}`, () => {
          expect(z.safeParse(BASE_SPEC_TEST_VALUE_MAP[key]).error?.issues[0].code).toBe(val.expectedIssue.code)
        })

        test(`with message ${JSON.stringify(val.expectedIssue.message)}`, () => {
          expect(z.safeParse(BASE_SPEC_TEST_VALUE_MAP[key]).error?.issues[0].message).toBe(val.expectedIssue.message)
        })
      })
    })
  })
}
