import { ZAny } from '../_internals'
import { generateBaseSpec } from '../test-utils'

generateBaseSpec(ZAny, {
  expectedTypeName: 'ZAny',
  expectedHint: 'any',
  should: {
    undefined: { parse: true },
    null: { parse: true },
    true: { parse: true },
    false: { parse: true },
  },
})
