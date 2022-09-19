import { ZVoid } from '../_internals'
import { generateBaseSpec } from '../spec-utils'

generateBaseSpec('ZVoid', ZVoid, {
  expectedTypeName: 'ZVoid',
  expectedHints: {
    default: 'void',
    optional: 'void | undefined',
    nullable: 'void | null',
    nullish: 'void | null | undefined',
  },
  should: {
    undefined: { parse: true },
    // NOT
    null: {
      parse: false,
      expectedIssue: {
        code: 'any.only',
        message: '"value" must be [undefined]',
      },
    },
    true: {
      parse: false,
      expectedIssue: {
        code: 'any.only',
        message: '"value" must be [undefined]',
      },
    },
    false: {
      parse: false,
      expectedIssue: {
        code: 'any.only',
        message: '"value" must be [undefined]',
      },
    },
    'BigInt(-100)': {
      parse: false,
      expectedIssue: {
        code: 'any.only',
        message: '"value" must be [undefined]',
      },
    },
    'BigInt(0)': {
      parse: false,
      expectedIssue: {
        code: 'any.only',
        message: '"value" must be [undefined]',
      },
    },
    'BigInt(100)': {
      parse: false,
      expectedIssue: {
        code: 'any.only',
        message: '"value" must be [undefined]',
      },
    },
    NaN: {
      parse: false,
      expectedIssue: {
        code: 'any.only',
        message: '"value" must be [undefined]',
      },
    },
    A: {
      parse: false,
      expectedIssue: {
        code: 'any.only',
        message: '"value" must be [undefined]',
      },
    },
    B: {
      parse: false,
      expectedIssue: {
        code: 'any.only',
        message: '"value" must be [undefined]',
      },
    },
    C: {
      parse: false,
      expectedIssue: {
        code: 'any.only',
        message: '"value" must be [undefined]',
      },
    },
    '-100.123': {
      parse: false,
      expectedIssue: {
        code: 'any.only',
        message: '"value" must be [undefined]',
      },
    },
    '-100': {
      parse: false,
      expectedIssue: {
        code: 'any.only',
        message: '"value" must be [undefined]',
      },
    },
    '-10': {
      parse: false,
      expectedIssue: {
        code: 'any.only',
        message: '"value" must be [undefined]',
      },
    },
    '-1': {
      parse: false,
      expectedIssue: {
        code: 'any.only',
        message: '"value" must be [undefined]',
      },
    },
    '0': {
      parse: false,
      expectedIssue: {
        code: 'any.only',
        message: '"value" must be [undefined]',
      },
    },
    '1': {
      parse: false,
      expectedIssue: {
        code: 'any.only',
        message: '"value" must be [undefined]',
      },
    },
    '10': {
      parse: false,
      expectedIssue: {
        code: 'any.only',
        message: '"value" must be [undefined]',
      },
    },
    '100': {
      parse: false,
      expectedIssue: {
        code: 'any.only',
        message: '"value" must be [undefined]',
      },
    },
    '100.123': {
      parse: false,
      expectedIssue: {
        code: 'any.only',
        message: '"value" must be [undefined]',
      },
    },
    yesterday: {
      parse: false,
      expectedIssue: {
        code: 'any.only',
        message: '"value" must be [undefined]',
      },
    },
    now: {
      parse: false,
      expectedIssue: {
        code: 'any.only',
        message: '"value" must be [undefined]',
      },
    },
    tomorrow: {
      parse: false,
      expectedIssue: {
        code: 'any.only',
        message: '"value" must be [undefined]',
      },
    },
    isostring: {
      parse: false,
      expectedIssue: {
        code: 'any.only',
        message: '"value" must be [undefined]',
      },
    },
  },
  baseMethodsConfig: {
    nonnullable: {
      expectedHint: 'void',
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
