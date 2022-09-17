import { ZUndefined } from '../_internals'
import { generateBaseSpec } from '../test-utils'

generateBaseSpec('ZUndefined', ZUndefined, {
  expectedTypeName: 'ZUndefined',
  expectedHints: {
    default: 'undefined',
    optional: 'undefined',
    nullable: 'undefined | null',
    nullish: 'undefined | null',
  },
  should: {
    undefined: { parse: true },
    // NOT
    null: { parse: false, expectedIssue: { code: 'any.only', message: '"value" must be [undefined]' } },
    true: { parse: false, expectedIssue: { code: 'any.only', message: '"value" must be [undefined]' } },
    false: { parse: false, expectedIssue: { code: 'any.only', message: '"value" must be [undefined]' } },
    'BigInt(-100)': { parse: false, expectedIssue: { code: 'any.only', message: '"value" must be [undefined]' } },
    'BigInt(0)': { parse: false, expectedIssue: { code: 'any.only', message: '"value" must be [undefined]' } },
    'BigInt(100)': { parse: false, expectedIssue: { code: 'any.only', message: '"value" must be [undefined]' } },
    NaN: { parse: false, expectedIssue: { code: 'any.only', message: '"value" must be [undefined]' } },
    A: { parse: false, expectedIssue: { code: 'any.only', message: '"value" must be [undefined]' } },
    B: { parse: false, expectedIssue: { code: 'any.only', message: '"value" must be [undefined]' } },
    C: { parse: false, expectedIssue: { code: 'any.only', message: '"value" must be [undefined]' } },
  },
})
