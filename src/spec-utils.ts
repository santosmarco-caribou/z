/* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */

import { Entries } from 'type-fest'

import { AnyZ, ZGlobals } from './_internals'
import { safeJsonStringify } from './utils'

ZGlobals.get().options.stripColorsOnHints = true

const BASE_SPEC_TEST_VALUE_MAP = {
  undefined: undefined,
  null: null,
  true: true,
  false: false,
  'BigInt(-100)': BigInt(-100),
  'BigInt(0)': BigInt(0),
  'BigInt(100)': BigInt(100),
  NaN: Number.NaN,
  A: 'A',
  B: 'B',
  C: 'C',
  '-100.123': -100.123,
  '-100': -100,
  '-10': -10,
  '-1': -1,
  '0': 0,
  '1': 1,
  '10': 10,
  '100': 100,
  '100.123': 100.123,
  yesterday: new Date(Date.now() - 86_400_000),
  now: new Date(),
  tomorrow: new Date(Date.now() + 86_400_000),
  isostring: '1997-10-13T00:10:20.500Z',
} as const

type BaseSpecTestValues = typeof BASE_SPEC_TEST_VALUE_MAP
type BaseSpecTestValuesKey = keyof BaseSpecTestValues

type ExpectedHintsConfig = {
  default: string
  optional: string
  nullable: string
  nullish: string
}

type ExpectedIssue = {
  code: string
  message: string
}

type ShouldParseConfig = {
  parse: true
}
type ShouldNotParseConfig = {
  parse: false
  expectedIssue: ExpectedIssue
}

type ShouldConfig = {
  [K in BaseSpecTestValuesKey]: (ShouldParseConfig | ShouldNotParseConfig) & {
    when?: {
      [K in Exclude<keyof ExpectedHintsConfig, 'default'> | 'nonnullable']?: {
        expectedIssue?: ExpectedIssue
      }
    }
  }
}

type BaseSpecBaseMethodsConfig = {
  nonnullable: {
    expectedHint: string
    expectedIssues: { undefined: ExpectedIssue; null: ExpectedIssue }
  }
}

type AdditionalSpecConfig<Z extends AnyZ> = {
  title: `should ${string}`
  spec: (z: Z) => void
}

type BaseSpecConfig<Z extends AnyZ> = {
  expectedTypeName: string
  expectedHints: ExpectedHintsConfig
  should: ShouldConfig
  baseMethodsConfig: BaseSpecBaseMethodsConfig
  additionalSpecs?: AdditionalSpecConfig<Z>[]
}

export const generateBaseSpec = <Z extends AnyZ>(
  title: string,
  sut: { create: () => Z },
  config: BaseSpecConfig<Z>
): void => {
  const _generateBaseSpec = <_Z extends AnyZ>(
    sut: { create: () => _Z },
    config: Omit<
      BaseSpecConfig<_Z>,
      'expectedHints' | 'should' | 'baseMethodsConfig'
    > & {
      expectedHint: string
      shouldParse: Partial<Record<BaseSpecTestValuesKey, ShouldParseConfig>>
      shouldNotParse: Partial<
        Record<BaseSpecTestValuesKey, ShouldNotParseConfig>
      >
    }
  ): void => {
    let z: _Z

    beforeEach(() => {
      z = sut.create()
    })

    test(`should have a name of ${safeJsonStringify(
      config.expectedTypeName
    )}`, () => {
      expect(z.name).toBe(config.expectedTypeName)
    })

    test(`should have a hint of ${safeJsonStringify(
      config.expectedHint
    )}`, () => {
      expect(z.hint).toBe(config.expectedHint)
    })

    const shouldParse = Object.entries(config.shouldParse) as Entries<
      Record<BaseSpecTestValuesKey, ShouldParseConfig>
    >
    const shouldNotParse = Object.entries(config.shouldNotParse) as Entries<
      Record<BaseSpecTestValuesKey, ShouldNotParseConfig>
    >

    describe('should parse', () => {
      shouldParse.forEach(([key]) => {
        test(key, () => {
          const parsed = z.parse(BASE_SPEC_TEST_VALUE_MAP[key])
          expect(
            typeof parsed === 'bigint' ? parsed.toString() : parsed
          ).toStrictEqual(
            typeof parsed === 'bigint' ? parsed.toString() : parsed
          )
        })
      })
    })

    describe('should not parse', () => {
      shouldNotParse.forEach(([key, val]) => {
        describe(key, () => {
          test(`with only one issue`, () => {
            expect(
              z.safeParse(BASE_SPEC_TEST_VALUE_MAP[key]).error?.issues
            ).toHaveLength(1)
          })

          test(`with issue code ${safeJsonStringify(
            val.expectedIssue.code
          )}`, () => {
            expect(
              z.safeParse(BASE_SPEC_TEST_VALUE_MAP[key]).error?.issues[0]?.code
            ).toBe(val.expectedIssue.code)
          })

          test(`with message ${safeJsonStringify(
            val.expectedIssue.message
          )}`, () => {
            expect(
              z.safeParse(BASE_SPEC_TEST_VALUE_MAP[key]).error?.issues[0]
                ?.message
            ).toBe(val.expectedIssue.message)
          })
        })
      })
    })

    config.additionalSpecs?.forEach(({ title, spec }) => {
      test(title, () => spec(z))
    })
  }

  const shouldParse = Object.entries(config.should).filter(
    ([_, { parse }]) => parse
  )
  const shouldNotParse = Object.entries(config.should).filter(
    ([_, { parse }]) => !parse
  )

  describe(title, () => {
    _generateBaseSpec(sut, {
      ...config,
      expectedHint: config.expectedHints.default,
      shouldParse: Object.fromEntries(shouldParse),
      shouldNotParse: Object.fromEntries(shouldNotParse),
      additionalSpecs: config.additionalSpecs,
    })
  })

  describe('.optional()', () => {
    _generateBaseSpec(
      { create: () => sut.create().optional() },
      {
        expectedTypeName: 'ZOptional',
        expectedHint: config.expectedHints.optional,
        shouldParse: {
          ...Object.fromEntries(shouldParse),
          undefined: { parse: true },
        },
        shouldNotParse: Object.fromEntries(
          shouldNotParse
            .map(([key, val]) => [
              key,
              val.when?.optional ? { ...val, ...val.when.optional } : val,
            ])
            .filter(([key]) => key !== 'undefined')
        ),
        additionalSpecs: [
          {
            title: 'should have .isOptional() evaluate to true',
            spec: z => expect(z.isOptional()).toBe(true),
          },
        ],
      }
    )
  })

  describe('.nullable()', () => {
    _generateBaseSpec(
      { create: () => sut.create().nullable() },
      {
        expectedTypeName: 'ZNullable',
        expectedHint: config.expectedHints.nullable,
        shouldParse: {
          ...Object.fromEntries(shouldParse),
          null: { parse: true },
        },
        shouldNotParse: Object.fromEntries(
          shouldNotParse
            .map(([key, val]) => [
              key,
              val.when?.nullable ? { ...val, ...val.when.nullable } : val,
            ])
            .filter(([key]) => key !== 'null')
        ),
        additionalSpecs: [
          {
            title: 'should have .isNullable() evaluate to true',
            spec: z => expect(z.isNullable()).toBe(true),
          },
        ],
      }
    )
  })

  describe('.nullish()', () => {
    _generateBaseSpec(
      { create: () => sut.create().nullish() },
      {
        expectedTypeName: 'ZOptional',
        expectedHint: config.expectedHints.nullish,
        shouldParse: {
          ...Object.fromEntries(shouldParse),
          undefined: { parse: true },
          null: { parse: true },
        },
        shouldNotParse: Object.fromEntries(
          shouldNotParse
            .map(([key, val]) => [
              key,
              val.when?.nullish ? { ...val, ...val.when.nullish } : val,
            ])
            .filter(([key]) => key !== 'undefined' && key !== 'null')
        ),
        additionalSpecs: [
          {
            title: 'should have .isOptional() evaluate to true',
            spec: z => expect(z.isOptional()).toBe(true),
          },
          {
            title: 'should have .isNullable() evaluate to true',
            spec: z => expect(z.isNullable()).toBe(true),
          },
        ],
      }
    )
  })

  describe('.nonnullable()', () => {
    _generateBaseSpec(
      { create: () => sut.create().nonnullable() },
      {
        expectedTypeName: 'ZNonNullable',
        expectedHint: config.baseMethodsConfig.nonnullable.expectedHint,
        shouldParse: Object.fromEntries(
          shouldParse.filter(([key]) => key !== 'undefined' && key !== 'null')
        ),
        shouldNotParse: {
          ...Object.fromEntries(
            shouldNotParse.map(([key, val]) => [
              key,
              val.when?.nonnullable ? { ...val, ...val.when.nonnullable } : val,
            ])
          ),
          undefined: {
            parse: false,
            expectedIssue:
              config.baseMethodsConfig.nonnullable.expectedIssues.undefined,
          },
          null: {
            parse: false,
            expectedIssue:
              config.baseMethodsConfig.nonnullable.expectedIssues.null,
          },
        },
        additionalSpecs: [
          {
            title: 'should have .isOptional() evaluate to false',
            spec: z => expect(z.isOptional()).toBe(false),
          },
          {
            title: 'should have .isNullable() evaluate to false',
            spec: z => expect(z.isNullable()).toBe(false),
          },
        ],
      }
    )
  })

  describe('.brand()', () => {
    _generateBaseSpec(
      { create: () => sut.create().brand(title) },
      {
        expectedTypeName: 'ZBrand',
        expectedHint: title,
        shouldParse: Object.fromEntries(shouldParse),
        shouldNotParse: Object.fromEntries(shouldNotParse),
      }
    )
  })
}
