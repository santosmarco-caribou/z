import { ZUnknown } from '../_internals'
import { generateBaseSpec } from '../test-utils'

generateBaseSpec('ZUnknown', ZUnknown, {
  expectedTypeName: 'ZUnknown',
  expectedHints: {
    default: 'unknown',
    optional: 'unknown',
    nullable: 'unknown',
    nullish: 'unknown',
  },
  should: {
    undefined: { parse: true },
    null: { parse: true },
    true: { parse: true },
    false: { parse: true },
    'BigInt(-100)': { parse: true },
    'BigInt(0)': { parse: true },
    'BigInt(100)': { parse: true },
  },
})
