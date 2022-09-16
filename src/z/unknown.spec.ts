import { ZUnknown } from '../_internals'
import { generateBaseSpec } from '../test-utils'

generateBaseSpec(ZUnknown, {
  expectedTypeName: 'ZUnknown',
  expectedHint: 'unknown',
  should: {
    undefined: { parse: true },
    null: { parse: true },
    true: { parse: true },
    false: { parse: true },
  },
})
