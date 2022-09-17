import { ZEnum } from '../_internals'
import { generateBaseSpec } from '../test-utils'

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
      true: {
        parse: false,
        expectedIssue: { code: 'any.only', message: '"value" must be one of [A, B, C]' },
        when: {
          nullable: { expectedIssue: { code: 'any.only', message: '"value" must be one of [A, B, C, null]' } },
          nullish: { expectedIssue: { code: 'any.only', message: '"value" must be one of [A, B, C, null]' } },
        },
      },
      false: {
        parse: false,
        expectedIssue: { code: 'any.only', message: '"value" must be one of [A, B, C]' },
        when: {
          nullable: { expectedIssue: { code: 'any.only', message: '"value" must be one of [A, B, C, null]' } },
          nullish: { expectedIssue: { code: 'any.only', message: '"value" must be one of [A, B, C, null]' } },
        },
      },
      'BigInt(-100)': {
        parse: false,
        expectedIssue: { code: 'any.only', message: '"value" must be one of [A, B, C]' },
        when: {
          nullable: { expectedIssue: { code: 'any.only', message: '"value" must be one of [A, B, C, null]' } },
          nullish: { expectedIssue: { code: 'any.only', message: '"value" must be one of [A, B, C, null]' } },
        },
      },
      'BigInt(0)': {
        parse: false,
        expectedIssue: { code: 'any.only', message: '"value" must be one of [A, B, C]' },
        when: {
          nullable: { expectedIssue: { code: 'any.only', message: '"value" must be one of [A, B, C, null]' } },
          nullish: { expectedIssue: { code: 'any.only', message: '"value" must be one of [A, B, C, null]' } },
        },
      },
      'BigInt(100)': {
        parse: false,
        expectedIssue: { code: 'any.only', message: '"value" must be one of [A, B, C]' },
        when: {
          nullable: { expectedIssue: { code: 'any.only', message: '"value" must be one of [A, B, C, null]' } },
          nullish: { expectedIssue: { code: 'any.only', message: '"value" must be one of [A, B, C, null]' } },
        },
      },
      NaN: {
        parse: false,
        expectedIssue: { code: 'any.only', message: '"value" must be one of [A, B, C]' },
        when: {
          nullable: { expectedIssue: { code: 'any.only', message: '"value" must be one of [A, B, C, null]' } },
          nullish: { expectedIssue: { code: 'any.only', message: '"value" must be one of [A, B, C, null]' } },
        },
      },
      '-100.123': {
        parse: false,
        expectedIssue: { code: 'any.only', message: '"value" must be one of [A, B, C]' },
        when: {
          nullable: { expectedIssue: { code: 'any.only', message: '"value" must be one of [A, B, C, null]' } },
          nullish: { expectedIssue: { code: 'any.only', message: '"value" must be one of [A, B, C, null]' } },
        },
      },
      '-100': {
        parse: false,
        expectedIssue: { code: 'any.only', message: '"value" must be one of [A, B, C]' },
        when: {
          nullable: { expectedIssue: { code: 'any.only', message: '"value" must be one of [A, B, C, null]' } },
          nullish: { expectedIssue: { code: 'any.only', message: '"value" must be one of [A, B, C, null]' } },
        },
      },
      '-10': {
        parse: false,
        expectedIssue: { code: 'any.only', message: '"value" must be one of [A, B, C]' },
        when: {
          nullable: { expectedIssue: { code: 'any.only', message: '"value" must be one of [A, B, C, null]' } },
          nullish: { expectedIssue: { code: 'any.only', message: '"value" must be one of [A, B, C, null]' } },
        },
      },
      '-1': {
        parse: false,
        expectedIssue: { code: 'any.only', message: '"value" must be one of [A, B, C]' },
        when: {
          nullable: { expectedIssue: { code: 'any.only', message: '"value" must be one of [A, B, C, null]' } },
          nullish: { expectedIssue: { code: 'any.only', message: '"value" must be one of [A, B, C, null]' } },
        },
      },
      '0': {
        parse: false,
        expectedIssue: { code: 'any.only', message: '"value" must be one of [A, B, C]' },
        when: {
          nullable: { expectedIssue: { code: 'any.only', message: '"value" must be one of [A, B, C, null]' } },
          nullish: { expectedIssue: { code: 'any.only', message: '"value" must be one of [A, B, C, null]' } },
        },
      },
      '1': {
        parse: false,
        expectedIssue: { code: 'any.only', message: '"value" must be one of [A, B, C]' },
        when: {
          nullable: { expectedIssue: { code: 'any.only', message: '"value" must be one of [A, B, C, null]' } },
          nullish: { expectedIssue: { code: 'any.only', message: '"value" must be one of [A, B, C, null]' } },
        },
      },
      '10': {
        parse: false,
        expectedIssue: { code: 'any.only', message: '"value" must be one of [A, B, C]' },
        when: {
          nullable: { expectedIssue: { code: 'any.only', message: '"value" must be one of [A, B, C, null]' } },
          nullish: { expectedIssue: { code: 'any.only', message: '"value" must be one of [A, B, C, null]' } },
        },
      },
      '100': {
        parse: false,
        expectedIssue: { code: 'any.only', message: '"value" must be one of [A, B, C]' },
        when: {
          nullable: { expectedIssue: { code: 'any.only', message: '"value" must be one of [A, B, C, null]' } },
          nullish: { expectedIssue: { code: 'any.only', message: '"value" must be one of [A, B, C, null]' } },
        },
      },
      '100.123': {
        parse: false,
        expectedIssue: { code: 'any.only', message: '"value" must be one of [A, B, C]' },
        when: {
          nullable: { expectedIssue: { code: 'any.only', message: '"value" must be one of [A, B, C, null]' } },
          nullish: { expectedIssue: { code: 'any.only', message: '"value" must be one of [A, B, C, null]' } },
        },
      },
      yesterday: {
        parse: false,
        expectedIssue: { code: 'any.only', message: '"value" must be one of [A, B, C]' },
        when: {
          nullable: { expectedIssue: { code: 'any.only', message: '"value" must be one of [A, B, C, null]' } },
          nullish: { expectedIssue: { code: 'any.only', message: '"value" must be one of [A, B, C, null]' } },
        },
      },
      now: {
        parse: false,
        expectedIssue: { code: 'any.only', message: '"value" must be one of [A, B, C]' },
        when: {
          nullable: { expectedIssue: { code: 'any.only', message: '"value" must be one of [A, B, C, null]' } },
          nullish: { expectedIssue: { code: 'any.only', message: '"value" must be one of [A, B, C, null]' } },
        },
      },
      tomorrow: {
        parse: false,
        expectedIssue: { code: 'any.only', message: '"value" must be one of [A, B, C]' },
        when: {
          nullable: { expectedIssue: { code: 'any.only', message: '"value" must be one of [A, B, C, null]' } },
          nullish: { expectedIssue: { code: 'any.only', message: '"value" must be one of [A, B, C, null]' } },
        },
      },
      isostring: {
        parse: false,
        expectedIssue: { code: 'any.only', message: '"value" must be one of [A, B, C]' },
        when: {
          nullable: { expectedIssue: { code: 'any.only', message: '"value" must be one of [A, B, C, null]' } },
          nullish: { expectedIssue: { code: 'any.only', message: '"value" must be one of [A, B, C, null]' } },
        },
      },
    },
  }
)
