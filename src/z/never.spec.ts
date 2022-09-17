import { ZNever } from '../_internals'
import { generateBaseSpec } from '../test-utils'

generateBaseSpec('ZNever', ZNever, {
  expectedTypeName: 'ZNever',
  expectedHints: {
    default: 'never',
    optional: 'never',
    nullable: 'never',
    nullish: 'never',
  },
  should: {
    // NOT
    undefined: { parse: false, expectedIssue: { code: 'any.required', message: '"value" is required' } },
    null: { parse: false, expectedIssue: { code: 'any.unknown', message: '"value" is not allowed' } },
    true: { parse: false, expectedIssue: { code: 'any.unknown', message: '"value" is not allowed' } },
    false: { parse: false, expectedIssue: { code: 'any.unknown', message: '"value" is not allowed' } },
    'BigInt(-100)': { parse: false, expectedIssue: { code: 'any.unknown', message: '"value" is not allowed' } },
    'BigInt(0)': { parse: false, expectedIssue: { code: 'any.unknown', message: '"value" is not allowed' } },
    'BigInt(100)': { parse: false, expectedIssue: { code: 'any.unknown', message: '"value" is not allowed' } },
    NaN: { parse: false, expectedIssue: { code: 'any.unknown', message: '"value" is not allowed' } },
    A: { parse: false, expectedIssue: { code: 'any.unknown', message: '"value" is not allowed' } },
    B: { parse: false, expectedIssue: { code: 'any.unknown', message: '"value" is not allowed' } },
    C: { parse: false, expectedIssue: { code: 'any.unknown', message: '"value" is not allowed' } },
  },
})
