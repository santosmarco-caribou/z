import { ZNull } from '../_internals'
import { generateBaseSpec } from '../spec-utils'

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
    undefined: {
      parse: false,
      expectedIssue: { code: 'any.required', message: '"value" is required' },
    },
    true: {
      parse: false,
      expectedIssue: { code: 'any.only', message: '"value" must be [null]' },
      when: {
        nonnullable: {
          expectedIssue: {
            code: 'any.unknown',
            message: '"value" is not allowed',
          },
        },
      },
    },
    false: {
      parse: false,
      expectedIssue: { code: 'any.only', message: '"value" must be [null]' },
      when: {
        nonnullable: {
          expectedIssue: {
            code: 'any.unknown',
            message: '"value" is not allowed',
          },
        },
      },
    },
    'BigInt(-100)': {
      parse: false,
      expectedIssue: { code: 'any.only', message: '"value" must be [null]' },
      when: {
        nonnullable: {
          expectedIssue: {
            code: 'any.unknown',
            message: '"value" is not allowed',
          },
        },
      },
    },
    'BigInt(0)': {
      parse: false,
      expectedIssue: { code: 'any.only', message: '"value" must be [null]' },
      when: {
        nonnullable: {
          expectedIssue: {
            code: 'any.unknown',
            message: '"value" is not allowed',
          },
        },
      },
    },
    'BigInt(100)': {
      parse: false,
      expectedIssue: { code: 'any.only', message: '"value" must be [null]' },
      when: {
        nonnullable: {
          expectedIssue: {
            code: 'any.unknown',
            message: '"value" is not allowed',
          },
        },
      },
    },
    NaN: {
      parse: false,
      expectedIssue: { code: 'any.only', message: '"value" must be [null]' },
      when: {
        nonnullable: {
          expectedIssue: {
            code: 'any.unknown',
            message: '"value" is not allowed',
          },
        },
      },
    },
    A: {
      parse: false,
      expectedIssue: { code: 'any.only', message: '"value" must be [null]' },
      when: {
        nonnullable: {
          expectedIssue: {
            code: 'any.unknown',
            message: '"value" is not allowed',
          },
        },
      },
    },
    B: {
      parse: false,
      expectedIssue: { code: 'any.only', message: '"value" must be [null]' },
      when: {
        nonnullable: {
          expectedIssue: {
            code: 'any.unknown',
            message: '"value" is not allowed',
          },
        },
      },
    },
    C: {
      parse: false,
      expectedIssue: { code: 'any.only', message: '"value" must be [null]' },
      when: {
        nonnullable: {
          expectedIssue: {
            code: 'any.unknown',
            message: '"value" is not allowed',
          },
        },
      },
    },
    '-100.123': {
      parse: false,
      expectedIssue: { code: 'any.only', message: '"value" must be [null]' },
      when: {
        nonnullable: {
          expectedIssue: {
            code: 'any.unknown',
            message: '"value" is not allowed',
          },
        },
      },
    },
    '-100': {
      parse: false,
      expectedIssue: { code: 'any.only', message: '"value" must be [null]' },
      when: {
        nonnullable: {
          expectedIssue: {
            code: 'any.unknown',
            message: '"value" is not allowed',
          },
        },
      },
    },
    '-10': {
      parse: false,
      expectedIssue: { code: 'any.only', message: '"value" must be [null]' },
      when: {
        nonnullable: {
          expectedIssue: {
            code: 'any.unknown',
            message: '"value" is not allowed',
          },
        },
      },
    },
    '-1': {
      parse: false,
      expectedIssue: { code: 'any.only', message: '"value" must be [null]' },
      when: {
        nonnullable: {
          expectedIssue: {
            code: 'any.unknown',
            message: '"value" is not allowed',
          },
        },
      },
    },
    '0': {
      parse: false,
      expectedIssue: { code: 'any.only', message: '"value" must be [null]' },
      when: {
        nonnullable: {
          expectedIssue: {
            code: 'any.unknown',
            message: '"value" is not allowed',
          },
        },
      },
    },
    '1': {
      parse: false,
      expectedIssue: { code: 'any.only', message: '"value" must be [null]' },
      when: {
        nonnullable: {
          expectedIssue: {
            code: 'any.unknown',
            message: '"value" is not allowed',
          },
        },
      },
    },
    '10': {
      parse: false,
      expectedIssue: { code: 'any.only', message: '"value" must be [null]' },
      when: {
        nonnullable: {
          expectedIssue: {
            code: 'any.unknown',
            message: '"value" is not allowed',
          },
        },
      },
    },
    '100': {
      parse: false,
      expectedIssue: { code: 'any.only', message: '"value" must be [null]' },
      when: {
        nonnullable: {
          expectedIssue: {
            code: 'any.unknown',
            message: '"value" is not allowed',
          },
        },
      },
    },
    '100.123': {
      parse: false,
      expectedIssue: { code: 'any.only', message: '"value" must be [null]' },
      when: {
        nonnullable: {
          expectedIssue: {
            code: 'any.unknown',
            message: '"value" is not allowed',
          },
        },
      },
    },
    yesterday: {
      parse: false,
      expectedIssue: { code: 'any.only', message: '"value" must be [null]' },
      when: {
        nonnullable: {
          expectedIssue: {
            code: 'any.unknown',
            message: '"value" is not allowed',
          },
        },
      },
    },
    now: {
      parse: false,
      expectedIssue: { code: 'any.only', message: '"value" must be [null]' },
      when: {
        nonnullable: {
          expectedIssue: {
            code: 'any.unknown',
            message: '"value" is not allowed',
          },
        },
      },
    },
    tomorrow: {
      parse: false,
      expectedIssue: { code: 'any.only', message: '"value" must be [null]' },
      when: {
        nonnullable: {
          expectedIssue: {
            code: 'any.unknown',
            message: '"value" is not allowed',
          },
        },
      },
    },
    isostring: {
      parse: false,
      expectedIssue: { code: 'any.only', message: '"value" must be [null]' },
      when: {
        nonnullable: {
          expectedIssue: {
            code: 'any.unknown',
            message: '"value" is not allowed',
          },
        },
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
          code: 'any.unknown',
          message: '"value" is not allowed',
        },
      },
    },
  },
})
