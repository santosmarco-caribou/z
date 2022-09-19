import { ZLiteral } from '../_internals'
import { generateBaseSpec } from '../spec-utils'

const shouldNotParseDefaultConfig = (value: string) => ({
  parse: false,
  expectedIssue: { code: 'any.only', message: `"value" must be [${value}]` },
  when: {
    nullable: {
      expectedIssue: {
        code: 'any.only',
        message: `"value" must be one of [${value}, null]`,
      },
    },
    nullish: {
      expectedIssue: {
        code: 'any.only',
        message: `"value" must be one of [${value}, null]`,
      },
    },
    nonnullable: {
      expectedIssue: {
        code: 'any.only',
        message: `"value" must be [${value}]`,
      },
    },
  },
})

generateBaseSpec(
  "ZLiteral('A')",
  { create: () => ZLiteral.create('A') },
  {
    expectedTypeName: 'ZLiteral',
    expectedHints: {
      default: "'A'",
      optional: "'A' | undefined",
      nullable: "'A' | null",
      nullish: "'A' | null | undefined",
    },
    should: {
      A: { parse: true },
      // NOT
      undefined: {
        parse: false,
        expectedIssue: { code: 'any.required', message: '"value" is required' },
      },
      null: {
        parse: false,
        expectedIssue: { code: 'any.only', message: '"value" must be [A]' },
      },
      true: shouldNotParseDefaultConfig('A'),
      false: shouldNotParseDefaultConfig('A'),
      'BigInt(-100)': shouldNotParseDefaultConfig('A'),
      'BigInt(0)': shouldNotParseDefaultConfig('A'),
      'BigInt(100)': shouldNotParseDefaultConfig('A'),
      NaN: shouldNotParseDefaultConfig('A'),
      B: shouldNotParseDefaultConfig('A'),
      C: shouldNotParseDefaultConfig('A'),
      '-100.123': shouldNotParseDefaultConfig('A'),
      '-100': shouldNotParseDefaultConfig('A'),
      '-10': shouldNotParseDefaultConfig('A'),
      '-1': shouldNotParseDefaultConfig('A'),
      '0': shouldNotParseDefaultConfig('A'),
      '1': shouldNotParseDefaultConfig('A'),
      '10': shouldNotParseDefaultConfig('A'),
      '100': shouldNotParseDefaultConfig('A'),
      '100.123': shouldNotParseDefaultConfig('A'),
      yesterday: shouldNotParseDefaultConfig('A'),
      now: shouldNotParseDefaultConfig('A'),
      tomorrow: shouldNotParseDefaultConfig('A'),
      isostring: shouldNotParseDefaultConfig('A'),
    },
    baseMethodsConfig: {
      nonnullable: {
        expectedHint: "'A'",
        expectedIssues: {
          undefined: {
            code: 'any.required',
            message: '"value" is required',
          },
          null: {
            code: 'any.only',
            message: '"value" must be [A]',
          },
        },
      },
    },
  }
)

generateBaseSpec(
  'ZLiteral(true)',
  { create: () => ZLiteral.create(true) },
  {
    expectedTypeName: 'ZLiteral',
    expectedHints: {
      default: 'true',
      optional: 'true | undefined',
      nullable: 'true | null',
      nullish: 'true | null | undefined',
    },
    should: {
      true: { parse: true },
      // NOT
      undefined: {
        parse: false,
        expectedIssue: { code: 'any.required', message: '"value" is required' },
      },
      null: {
        parse: false,
        expectedIssue: { code: 'any.only', message: '"value" must be [true]' },
      },
      false: shouldNotParseDefaultConfig('true'),
      'BigInt(-100)': shouldNotParseDefaultConfig('true'),
      'BigInt(0)': shouldNotParseDefaultConfig('true'),
      'BigInt(100)': shouldNotParseDefaultConfig('true'),
      NaN: shouldNotParseDefaultConfig('true'),
      A: shouldNotParseDefaultConfig('true'),
      B: shouldNotParseDefaultConfig('true'),
      C: shouldNotParseDefaultConfig('true'),
      '-100.123': shouldNotParseDefaultConfig('true'),
      '-100': shouldNotParseDefaultConfig('true'),
      '-10': shouldNotParseDefaultConfig('true'),
      '-1': shouldNotParseDefaultConfig('true'),
      '0': shouldNotParseDefaultConfig('true'),
      '1': shouldNotParseDefaultConfig('true'),
      '10': shouldNotParseDefaultConfig('true'),
      '100': shouldNotParseDefaultConfig('true'),
      '100.123': shouldNotParseDefaultConfig('true'),
      yesterday: shouldNotParseDefaultConfig('true'),
      now: shouldNotParseDefaultConfig('true'),
      tomorrow: shouldNotParseDefaultConfig('true'),
      isostring: shouldNotParseDefaultConfig('true'),
    },
    baseMethodsConfig: {
      nonnullable: {
        expectedHint: 'true',
        expectedIssues: {
          undefined: {
            code: 'any.required',
            message: '"value" is required',
          },
          null: {
            code: 'any.only',
            message: '"value" must be [true]',
          },
        },
      },
    },
  }
)

generateBaseSpec(
  'ZLiteral(100)',
  { create: () => ZLiteral.create(100) },
  {
    expectedTypeName: 'ZLiteral',
    expectedHints: {
      default: '100',
      optional: '100 | undefined',
      nullable: '100 | null',
      nullish: '100 | null | undefined',
    },
    should: {
      '100': { parse: true },
      // NOT
      undefined: {
        parse: false,
        expectedIssue: { code: 'any.required', message: '"value" is required' },
      },
      null: {
        parse: false,
        expectedIssue: { code: 'any.only', message: '"value" must be [100]' },
      },
      true: shouldNotParseDefaultConfig('100'),
      false: shouldNotParseDefaultConfig('100'),
      'BigInt(-100)': shouldNotParseDefaultConfig('100'),
      'BigInt(0)': shouldNotParseDefaultConfig('100'),
      'BigInt(100)': shouldNotParseDefaultConfig('100'),
      NaN: shouldNotParseDefaultConfig('100'),
      A: shouldNotParseDefaultConfig('100'),
      B: shouldNotParseDefaultConfig('100'),
      C: shouldNotParseDefaultConfig('100'),
      '-100.123': shouldNotParseDefaultConfig('100'),
      '-100': shouldNotParseDefaultConfig('100'),
      '-10': shouldNotParseDefaultConfig('100'),
      '-1': shouldNotParseDefaultConfig('100'),
      '0': shouldNotParseDefaultConfig('100'),
      '1': shouldNotParseDefaultConfig('100'),
      '10': shouldNotParseDefaultConfig('100'),
      '100.123': shouldNotParseDefaultConfig('100'),
      yesterday: shouldNotParseDefaultConfig('100'),
      now: shouldNotParseDefaultConfig('100'),
      tomorrow: shouldNotParseDefaultConfig('100'),
      isostring: shouldNotParseDefaultConfig('100'),
    },
    baseMethodsConfig: {
      nonnullable: {
        expectedHint: '100',
        expectedIssues: {
          undefined: {
            code: 'any.required',
            message: '"value" is required',
          },
          null: {
            code: 'any.only',
            message: '"value" must be [100]',
          },
        },
      },
    },
  }
)
