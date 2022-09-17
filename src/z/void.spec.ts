import { ZVoid } from '../_internals'
import { generateBaseSpec } from '../test-utils'

generateBaseSpec('ZVoid', ZVoid, {
  expectedTypeName: 'ZVoid',
  expectedHints: {
    default: 'void',
    optional: 'void | undefined',
    nullable: 'void | null',
    nullish: 'void | undefined | null',
  },
  should: {
    undefined: { parse: true },
    null: { parse: true },
    true: { parse: true },
    false: { parse: true },
    'BigInt(-100)': { parse: true },
    'BigInt(0)': { parse: true },
    'BigInt(100)': { parse: true },
    NaN: { parse: true },
    A: { parse: true },
    B: { parse: true },
    C: { parse: true },
  },
})
