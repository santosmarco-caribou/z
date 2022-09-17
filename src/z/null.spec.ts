import { ZNull } from '../_internals'
import { generateBaseSpec } from '../test-utils'

generateBaseSpec('ZNull', ZNull, {
  expectedTypeName: 'ZNull',
  expectedHints: {
    default: 'null',
    optional: 'null | undefined',
    nullable: 'null',
    nullish: 'null | undefined',
  },
  should: {
    null: { parse: true },
    // NOT
    undefined: { parse: false, expectedIssue: { code: 'any.required', message: '"value" is required' } },
    true: { parse: false, expectedIssue: { code: 'any.only', message: '"value" must be [null]' } },
    false: { parse: false, expectedIssue: { code: 'any.only', message: '"value" must be [null]' } },
    'BigInt(-100)': { parse: false, expectedIssue: { code: 'any.only', message: '"value" must be [null]' } },
    'BigInt(0)': { parse: false, expectedIssue: { code: 'any.only', message: '"value" must be [null]' } },
    'BigInt(100)': { parse: false, expectedIssue: { code: 'any.only', message: '"value" must be [null]' } },
  },
})
