import { ZEnum } from '../_internals'
import { generateBaseSpec } from '../test-utils'

const shouldNotParseDefaultConfig = (value: string) => ({
  parse: false,
  expectedIssue: { code: 'any.only', message: `"value" must be one of [${value}]` },
  when: {
    nullable: { expectedIssue: { code: 'any.only', message: `"value" must be one of [${value}, null]` } },
    nullish: { expectedIssue: { code: 'any.only', message: `"value" must be one of [${value}, null]` } },
  },
})

generateBaseSpec(
  'ZEnum',
  { create: () => ZEnum.create(['A', 'B', 'C']) },
  {
    expectedTypeName: 'ZEnum',
    expectedHints: {
      default: "'A' | 'B' | 'C'",
      optional: "'A' | 'B' | 'C' | undefined",
      nullable: "'A' | 'B' | 'C' | null",
      nullish: "'A' | 'B' | 'C' | null | undefined",
    },
    should: {
      A: { parse: true },
      B: { parse: true },
      C: { parse: true },
      // NOT
      undefined: { parse: false, expectedIssue: { code: 'any.required', message: '"value" is required' } },
      null: { parse: false, expectedIssue: { code: 'any.only', message: '"value" must be one of [A, B, C]' } },
      true: shouldNotParseDefaultConfig('A, B, C'),
      false: shouldNotParseDefaultConfig('A, B, C'),
      'BigInt(-100)': shouldNotParseDefaultConfig('A, B, C'),
      'BigInt(0)': shouldNotParseDefaultConfig('A, B, C'),
      'BigInt(100)': shouldNotParseDefaultConfig('A, B, C'),
      NaN: shouldNotParseDefaultConfig('A, B, C'),
      '-100.123': shouldNotParseDefaultConfig('A, B, C'),
      '-100': shouldNotParseDefaultConfig('A, B, C'),
      '-10': shouldNotParseDefaultConfig('A, B, C'),
      '-1': shouldNotParseDefaultConfig('A, B, C'),
      '0': shouldNotParseDefaultConfig('A, B, C'),
      '1': shouldNotParseDefaultConfig('A, B, C'),
      '10': shouldNotParseDefaultConfig('A, B, C'),
      '100': shouldNotParseDefaultConfig('A, B, C'),
      '100.123': shouldNotParseDefaultConfig('A, B, C'),
      yesterday: shouldNotParseDefaultConfig('A, B, C'),
      now: shouldNotParseDefaultConfig('A, B, C'),
      tomorrow: shouldNotParseDefaultConfig('A, B, C'),
      isostring: shouldNotParseDefaultConfig('A, B, C'),
    },
  }
)

generateBaseSpec(
  'ZEnum($uppercase)',
  { create: () => ZEnum.create(['a', 'b']).uppercase() },
  {
    expectedTypeName: 'ZEnum',
    expectedHints: {
      default: "'A' | 'B'",
      optional: "'A' | 'B' | undefined",
      nullable: "'A' | 'B' | null",
      nullish: "'A' | 'B' | null | undefined",
    },
    should: {
      A: { parse: true },
      B: { parse: true },
      // NOT
      undefined: { parse: false, expectedIssue: { code: 'any.required', message: '"value" is required' } },
      null: { parse: false, expectedIssue: { code: 'any.only', message: '"value" must be one of [A, B]' } },
      C: shouldNotParseDefaultConfig('A, B'),
      true: shouldNotParseDefaultConfig('A, B'),
      false: shouldNotParseDefaultConfig('A, B'),
      'BigInt(-100)': shouldNotParseDefaultConfig('A, B'),
      'BigInt(0)': shouldNotParseDefaultConfig('A, B'),
      'BigInt(100)': shouldNotParseDefaultConfig('A, B'),
      NaN: shouldNotParseDefaultConfig('A, B'),
      '-100.123': shouldNotParseDefaultConfig('A, B'),
      '-100': shouldNotParseDefaultConfig('A, B'),
      '-10': shouldNotParseDefaultConfig('A, B'),
      '-1': shouldNotParseDefaultConfig('A, B'),
      '0': shouldNotParseDefaultConfig('A, B'),
      '1': shouldNotParseDefaultConfig('A, B'),
      '10': shouldNotParseDefaultConfig('A, B'),
      '100': shouldNotParseDefaultConfig('A, B'),
      '100.123': shouldNotParseDefaultConfig('A, B'),
      yesterday: shouldNotParseDefaultConfig('A, B'),
      now: shouldNotParseDefaultConfig('A, B'),
      tomorrow: shouldNotParseDefaultConfig('A, B'),
      isostring: shouldNotParseDefaultConfig('A, B'),
    },
  }
)
