import { ZNaN } from '../_internals'
import { generateBaseSpec } from '../test-utils'

generateBaseSpec('ZNaN', ZNaN, {
  expectedTypeName: 'ZNaN',
  expectedHints: {
    default: 'NaN',
    optional: 'NaN | undefined',
    nullable: 'NaN | null',
    nullish: 'NaN | undefined | null',
  },
  should: {
    NaN: { parse: true },
    // NOT
    undefined: { parse: false, expectedIssue: { code: 'any.required', message: '"value" is required' } },
    null: { parse: false, expectedIssue: { code: 'nan.base', message: '"value" must be a NaN' } },
    true: { parse: false, expectedIssue: { code: 'nan.base', message: '"value" must be a NaN' } },
    false: { parse: false, expectedIssue: { code: 'nan.base', message: '"value" must be a NaN' } },
    'BigInt(-100)': { parse: false, expectedIssue: { code: 'nan.base', message: '"value" must be a NaN' } },
    'BigInt(0)': { parse: false, expectedIssue: { code: 'nan.base', message: '"value" must be a NaN' } },
    'BigInt(100)': { parse: false, expectedIssue: { code: 'nan.base', message: '"value" must be a NaN' } },
    A: { parse: false, expectedIssue: { code: 'nan.base', message: '"value" must be a NaN' } },
    B: { parse: false, expectedIssue: { code: 'nan.base', message: '"value" must be a NaN' } },
    C: { parse: false, expectedIssue: { code: 'nan.base', message: '"value" must be a NaN' } },
  },
})
