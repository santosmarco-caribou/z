import { ZUnknown } from '../_internals'
import { generateBaseSpec } from '../spec-utils'

generateBaseSpec('ZUnknown', ZUnknown, {
  expectedTypeName: 'ZUnknown',
  expectedHints: {
    default: 'unknown',
    optional: 'unknown',
    nullable: 'unknown',
    nullish: 'unknown',
  },
  should: {
    undefined: {
      parse: false,
      expectedIssue: { code: 'any.required', message: '"value" is required' },
    },
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
    '-100.123': { parse: true },
    '-100': { parse: true },
    '-10': { parse: true },
    '-1': { parse: true },
    '0': { parse: true },
    '1': { parse: true },
    '10': { parse: true },
    '100': { parse: true },
    '100.123': { parse: true },
    yesterday: { parse: true },
    now: { parse: true },
    tomorrow: { parse: true },
    isostring: { parse: true },
  },
  baseMethodsConfig: {
    nonnullable: {
      expectedHint: 'unknown',
      expectedIssues: {
        undefined: {
          code: 'any.required',
          message: '"value" is required',
        },
        null: {
          code: 'any.invalid',
          message: '"value" contains an invalid value',
        },
      },
    },
  },
})
