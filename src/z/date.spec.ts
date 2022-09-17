import { ZDate } from '../_internals'
import { generateBaseSpec } from '../test-utils'

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
    undefined: { parse: false, expectedIssue: { code: 'any.required', message: '"value" is required' } },
    null: { parse: false, expectedIssue: { code: 'date.base', message: '"value" must be a valid date' } },
    true: { parse: false, expectedIssue: { code: 'date.base', message: `"value" must be a valid date` } },
    false: { parse: false, expectedIssue: { code: 'date.base', message: `"value" must be a valid date` } },
    'BigInt(-100)': { parse: false, expectedIssue: { code: 'date.base', message: `"value" must be a valid date` } },
    'BigInt(0)': { parse: false, expectedIssue: { code: 'date.base', message: `"value" must be a valid date` } },
    'BigInt(100)': { parse: false, expectedIssue: { code: 'date.base', message: `"value" must be a valid date` } },
    NaN: { parse: false, expectedIssue: { code: 'date.base', message: `"value" must be a valid date` } },
    A: { parse: false, expectedIssue: { code: 'date.base', message: `"value" must be a valid date` } },
    B: { parse: false, expectedIssue: { code: 'date.base', message: `"value" must be a valid date` } },
    C: { parse: false, expectedIssue: { code: 'date.base', message: `"value" must be a valid date` } },
  },
})
