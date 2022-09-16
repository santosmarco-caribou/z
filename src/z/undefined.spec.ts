import { ZUndefined } from '../_internals'
import { generateBaseSpec } from '../test-utils'

generateBaseSpec(ZUndefined, {
  expectedTypeName: 'ZUndefined',
  expectedHint: 'undefined',
  should: {
    undefined: { parse: true },
    // NOT
    null: { parse: false, expectedIssue: { code: 'any.unknown', message: '"value" is not allowed' } },
    true: { parse: false, expectedIssue: { code: 'any.unknown', message: '"value" is not allowed' } },
    false: { parse: false, expectedIssue: { code: 'any.unknown', message: '"value" is not allowed' } },
  },
})
