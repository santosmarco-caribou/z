import { ZDate } from '../_internals'
import { generateBaseSpec } from '../spec-utils'

const NOW = new Date()
const YESTERDAY = new Date(Date.now() - 86_400_000)
const TOMORROW = new Date(Date.now() + 86_400_000)

generateBaseSpec('ZDate', ZDate, {
  expectedTypeName: 'ZDate',
  expectedHints: {
    default: 'Date',
    optional: 'Date | undefined',
    nullable: 'Date | null',
    nullish: 'Date | null | undefined',
  },
  should: {
    yesterday: { parse: true },
    now: { parse: true },
    tomorrow: { parse: true },
    isostring: { parse: true },
    '-100.123': { parse: true },
    '-100': { parse: true },
    '-10': { parse: true },
    '-1': { parse: true },
    '0': { parse: true },
    '1': { parse: true },
    '10': { parse: true },
    '100': { parse: true },
    '100.123': { parse: true },
    // NOT
    undefined: {
      parse: false,
      expectedIssue: { code: 'any.required', message: '"value" is required' },
    },
    null: {
      parse: false,
      expectedIssue: {
        code: 'date.base',
        message: '"value" must be a valid date',
      },
    },
    true: {
      parse: false,
      expectedIssue: {
        code: 'date.base',
        message: `"value" must be a valid date`,
      },
    },
    false: {
      parse: false,
      expectedIssue: {
        code: 'date.base',
        message: `"value" must be a valid date`,
      },
    },
    'BigInt(-100)': {
      parse: false,
      expectedIssue: {
        code: 'date.base',
        message: `"value" must be a valid date`,
      },
    },
    'BigInt(0)': {
      parse: false,
      expectedIssue: {
        code: 'date.base',
        message: `"value" must be a valid date`,
      },
    },
    'BigInt(100)': {
      parse: false,
      expectedIssue: {
        code: 'date.base',
        message: `"value" must be a valid date`,
      },
    },
    NaN: {
      parse: false,
      expectedIssue: {
        code: 'date.base',
        message: `"value" must be a valid date`,
      },
    },
    A: {
      parse: false,
      expectedIssue: {
        code: 'date.base',
        message: `"value" must be a valid date`,
      },
    },
    B: {
      parse: false,
      expectedIssue: {
        code: 'date.base',
        message: `"value" must be a valid date`,
      },
    },
    C: {
      parse: false,
      expectedIssue: {
        code: 'date.base',
        message: `"value" must be a valid date`,
      },
    },
  },
  additionalSpecs: [
    {
      title: 'should parse .before() correctly',
      spec: z => expect(z.before(TOMORROW).parse(NOW)).toStrictEqual(NOW),
    },
    {
      title: 'should parse .after() correctly',
      spec: z => expect(z.after(YESTERDAY).parse(NOW)).toStrictEqual(NOW),
    },
    {
      title: 'should parse .between() correctly',
      spec: z =>
        expect(z.between(YESTERDAY, TOMORROW).parse(NOW)).toStrictEqual(NOW),
    },
  ],
})
