import { ZBigInt } from '../_internals'
import { generateBaseSpec } from '../test-utils'

generateBaseSpec('ZBigInt', ZBigInt, {
  expectedTypeName: 'ZBigInt',
  expectedHints: {
    default: 'bigint',
    optional: 'bigint | undefined',
    nullable: 'bigint | null',
    nullish: 'bigint | undefined | null',
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
  },
})
