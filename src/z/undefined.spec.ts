import { ZUndefined } from '../_internals'
import { generateBaseSpec } from '../spec-utils'

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
      expectedHint: 'never',
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
