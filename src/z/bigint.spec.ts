import { ZBigInt } from '../_internals'
import { generateBaseSpec } from '../test-utils'

generateBaseSpec('ZBigInt', ZBigInt, {
  expectedTypeName: 'ZBigInt',
  expectedHints: {
    default: 'bigint',
    optional: 'bigint | undefined',
    nullable: 'bigint | null',
    nullish: 'bigint | null | undefined',
  },
  should: {
    'BigInt(-100)': { parse: true },
    'BigInt(0)': { parse: true },
    'BigInt(100)': { parse: true },
    // NOT
    undefined: { parse: false, expectedIssue: { code: 'any.required', message: '"value" is required' } },
    null: { parse: false, expectedIssue: { code: 'bigint.base', message: '"value" must be a bigint' } },
    true: { parse: false, expectedIssue: { code: 'bigint.base', message: '"value" must be a bigint' } },
    false: { parse: false, expectedIssue: { code: 'bigint.base', message: '"value" must be a bigint' } },
    NaN: { parse: false, expectedIssue: { code: 'bigint.base', message: '"value" must be a bigint' } },
    A: { parse: false, expectedIssue: { code: 'bigint.base', message: '"value" must be a bigint' } },
    B: { parse: false, expectedIssue: { code: 'bigint.base', message: '"value" must be a bigint' } },
    C: { parse: false, expectedIssue: { code: 'bigint.base', message: '"value" must be a bigint' } },
    '-100.123': { parse: false, expectedIssue: { code: 'bigint.base', message: '"value" must be a bigint' } },
    '-100': { parse: false, expectedIssue: { code: 'bigint.base', message: '"value" must be a bigint' } },
    '-10': { parse: false, expectedIssue: { code: 'bigint.base', message: '"value" must be a bigint' } },
    '-1': { parse: false, expectedIssue: { code: 'bigint.base', message: '"value" must be a bigint' } },
    '0': { parse: false, expectedIssue: { code: 'bigint.base', message: '"value" must be a bigint' } },
    '1': { parse: false, expectedIssue: { code: 'bigint.base', message: '"value" must be a bigint' } },
    '10': { parse: false, expectedIssue: { code: 'bigint.base', message: '"value" must be a bigint' } },
    '100': { parse: false, expectedIssue: { code: 'bigint.base', message: '"value" must be a bigint' } },
    '100.123': { parse: false, expectedIssue: { code: 'bigint.base', message: '"value" must be a bigint' } },
    yesterday: { parse: false, expectedIssue: { code: 'bigint.base', message: '"value" must be a bigint' } },
    now: { parse: false, expectedIssue: { code: 'bigint.base', message: '"value" must be a bigint' } },
    tomorrow: { parse: false, expectedIssue: { code: 'bigint.base', message: '"value" must be a bigint' } },
    isostring: { parse: false, expectedIssue: { code: 'bigint.base', message: '"value" must be a bigint' } },
  },
})
