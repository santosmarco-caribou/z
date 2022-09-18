import { ZBoolean, ZFalse, ZTrue } from '../_internals'
import { generateBaseSpec } from '../spec-utils'

generateBaseSpec('ZBoolean', ZBoolean, {
  expectedTypeName: 'ZBoolean',
  expectedHints: {
    default: 'boolean',
    optional: 'boolean | undefined',
    nullable: 'boolean | null',
    nullish: 'boolean | null | undefined',
  },
  should: {
    true: { parse: true },
    false: { parse: true },
    // NOT
    undefined: {
      parse: false,
      expectedIssue: { code: 'any.required', message: '"value" is required' },
    },
    null: {
      parse: false,
      expectedIssue: {
        code: 'boolean.base',
        message: '"value" must be a boolean',
      },
    },
    'BigInt(-100)': {
      parse: false,
      expectedIssue: {
        code: 'boolean.base',
        message: '"value" must be a boolean',
      },
    },
    'BigInt(0)': {
      parse: false,
      expectedIssue: {
        code: 'boolean.base',
        message: '"value" must be a boolean',
      },
    },
    'BigInt(100)': {
      parse: false,
      expectedIssue: {
        code: 'boolean.base',
        message: '"value" must be a boolean',
      },
    },
    NaN: {
      parse: false,
      expectedIssue: {
        code: 'boolean.base',
        message: '"value" must be a boolean',
      },
    },
    A: {
      parse: false,
      expectedIssue: {
        code: 'boolean.base',
        message: '"value" must be a boolean',
      },
    },
    B: {
      parse: false,
      expectedIssue: {
        code: 'boolean.base',
        message: '"value" must be a boolean',
      },
    },
    C: {
      parse: false,
      expectedIssue: {
        code: 'boolean.base',
        message: '"value" must be a boolean',
      },
    },
    '-100.123': {
      parse: false,
      expectedIssue: {
        code: 'boolean.base',
        message: '"value" must be a boolean',
      },
    },
    '-100': {
      parse: false,
      expectedIssue: {
        code: 'boolean.base',
        message: '"value" must be a boolean',
      },
    },
    '-10': {
      parse: false,
      expectedIssue: {
        code: 'boolean.base',
        message: '"value" must be a boolean',
      },
    },
    '-1': {
      parse: false,
      expectedIssue: {
        code: 'boolean.base',
        message: '"value" must be a boolean',
      },
    },
    '0': {
      parse: false,
      expectedIssue: {
        code: 'boolean.base',
        message: '"value" must be a boolean',
      },
    },
    '1': {
      parse: false,
      expectedIssue: {
        code: 'boolean.base',
        message: '"value" must be a boolean',
      },
    },
    '10': {
      parse: false,
      expectedIssue: {
        code: 'boolean.base',
        message: '"value" must be a boolean',
      },
    },
    '100': {
      parse: false,
      expectedIssue: {
        code: 'boolean.base',
        message: '"value" must be a boolean',
      },
    },
    '100.123': {
      parse: false,
      expectedIssue: {
        code: 'boolean.base',
        message: '"value" must be a boolean',
      },
    },
    yesterday: {
      parse: false,
      expectedIssue: {
        code: 'boolean.base',
        message: '"value" must be a boolean',
      },
    },
    now: {
      parse: false,
      expectedIssue: {
        code: 'boolean.base',
        message: '"value" must be a boolean',
      },
    },
    tomorrow: {
      parse: false,
      expectedIssue: {
        code: 'boolean.base',
        message: '"value" must be a boolean',
      },
    },
    isostring: {
      parse: false,
      expectedIssue: {
        code: 'boolean.base',
        message: '"value" must be a boolean',
      },
    },
  },
  additionalSpecs: [
    {
      title: 'should have .true() evaluate to a ZTrue instance',
      spec: z => expect(z.true()).toBeInstanceOf(ZTrue),
    },
    {
      title: 'should have .false() evaluate to a ZFalse instance',
      spec: z => expect(z.false()).toBeInstanceOf(ZFalse),
    },
  ],
})

generateBaseSpec('ZTrue', ZTrue, {
  expectedTypeName: 'ZTrue',
  expectedHints: {
    default: 'true',
    optional: 'true | undefined',
    nullable: 'true | null',
    nullish: 'true | null | undefined',
  },
  should: {
    true: { parse: true },
    // NOT
    undefined: {
      parse: false,
      expectedIssue: { code: 'any.required', message: '"value" is required' },
    },
    null: {
      parse: false,
      expectedIssue: { code: 'any.only', message: '"value" must be [true]' },
    },
    false: {
      parse: false,
      expectedIssue: { code: 'any.only', message: '"value" must be [true]' },
      when: {
        nullable: {
          expectedIssue: {
            code: 'any.only',
            message: '"value" must be one of [true, null]',
          },
        },
        nullish: {
          expectedIssue: {
            code: 'any.only',
            message: '"value" must be one of [true, null]',
          },
        },
      },
    },
    'BigInt(-100)': {
      parse: false,
      expectedIssue: { code: 'any.only', message: '"value" must be [true]' },
      when: {
        nullable: {
          expectedIssue: {
            code: 'any.only',
            message: '"value" must be one of [true, null]',
          },
        },
        nullish: {
          expectedIssue: {
            code: 'any.only',
            message: '"value" must be one of [true, null]',
          },
        },
      },
    },
    'BigInt(0)': {
      parse: false,
      expectedIssue: { code: 'any.only', message: '"value" must be [true]' },
      when: {
        nullable: {
          expectedIssue: {
            code: 'any.only',
            message: '"value" must be one of [true, null]',
          },
        },
        nullish: {
          expectedIssue: {
            code: 'any.only',
            message: '"value" must be one of [true, null]',
          },
        },
      },
    },
    'BigInt(100)': {
      parse: false,
      expectedIssue: { code: 'any.only', message: '"value" must be [true]' },
      when: {
        nullable: {
          expectedIssue: {
            code: 'any.only',
            message: '"value" must be one of [true, null]',
          },
        },
        nullish: {
          expectedIssue: {
            code: 'any.only',
            message: '"value" must be one of [true, null]',
          },
        },
      },
    },
    NaN: {
      parse: false,
      expectedIssue: { code: 'any.only', message: '"value" must be [true]' },
      when: {
        nullable: {
          expectedIssue: {
            code: 'any.only',
            message: '"value" must be one of [true, null]',
          },
        },
        nullish: {
          expectedIssue: {
            code: 'any.only',
            message: '"value" must be one of [true, null]',
          },
        },
      },
    },
    A: {
      parse: false,
      expectedIssue: { code: 'any.only', message: '"value" must be [true]' },
      when: {
        nullable: {
          expectedIssue: {
            code: 'any.only',
            message: '"value" must be one of [true, null]',
          },
        },
        nullish: {
          expectedIssue: {
            code: 'any.only',
            message: '"value" must be one of [true, null]',
          },
        },
      },
    },
    B: {
      parse: false,
      expectedIssue: { code: 'any.only', message: '"value" must be [true]' },
      when: {
        nullable: {
          expectedIssue: {
            code: 'any.only',
            message: '"value" must be one of [true, null]',
          },
        },
        nullish: {
          expectedIssue: {
            code: 'any.only',
            message: '"value" must be one of [true, null]',
          },
        },
      },
    },
    C: {
      parse: false,
      expectedIssue: { code: 'any.only', message: '"value" must be [true]' },
      when: {
        nullable: {
          expectedIssue: {
            code: 'any.only',
            message: '"value" must be one of [true, null]',
          },
        },
        nullish: {
          expectedIssue: {
            code: 'any.only',
            message: '"value" must be one of [true, null]',
          },
        },
      },
    },
    '-100.123': {
      parse: false,
      expectedIssue: { code: 'any.only', message: '"value" must be [true]' },
      when: {
        nullable: {
          expectedIssue: {
            code: 'any.only',
            message: '"value" must be one of [true, null]',
          },
        },
        nullish: {
          expectedIssue: {
            code: 'any.only',
            message: '"value" must be one of [true, null]',
          },
        },
      },
    },
    '-100': {
      parse: false,
      expectedIssue: { code: 'any.only', message: '"value" must be [true]' },
      when: {
        nullable: {
          expectedIssue: {
            code: 'any.only',
            message: '"value" must be one of [true, null]',
          },
        },
        nullish: {
          expectedIssue: {
            code: 'any.only',
            message: '"value" must be one of [true, null]',
          },
        },
      },
    },
    '-10': {
      parse: false,
      expectedIssue: { code: 'any.only', message: '"value" must be [true]' },
      when: {
        nullable: {
          expectedIssue: {
            code: 'any.only',
            message: '"value" must be one of [true, null]',
          },
        },
        nullish: {
          expectedIssue: {
            code: 'any.only',
            message: '"value" must be one of [true, null]',
          },
        },
      },
    },
    '-1': {
      parse: false,
      expectedIssue: { code: 'any.only', message: '"value" must be [true]' },
      when: {
        nullable: {
          expectedIssue: {
            code: 'any.only',
            message: '"value" must be one of [true, null]',
          },
        },
        nullish: {
          expectedIssue: {
            code: 'any.only',
            message: '"value" must be one of [true, null]',
          },
        },
      },
    },
    '0': {
      parse: false,
      expectedIssue: { code: 'any.only', message: '"value" must be [true]' },
      when: {
        nullable: {
          expectedIssue: {
            code: 'any.only',
            message: '"value" must be one of [true, null]',
          },
        },
        nullish: {
          expectedIssue: {
            code: 'any.only',
            message: '"value" must be one of [true, null]',
          },
        },
      },
    },
    '1': {
      parse: false,
      expectedIssue: { code: 'any.only', message: '"value" must be [true]' },
      when: {
        nullable: {
          expectedIssue: {
            code: 'any.only',
            message: '"value" must be one of [true, null]',
          },
        },
        nullish: {
          expectedIssue: {
            code: 'any.only',
            message: '"value" must be one of [true, null]',
          },
        },
      },
    },
    '10': {
      parse: false,
      expectedIssue: { code: 'any.only', message: '"value" must be [true]' },
      when: {
        nullable: {
          expectedIssue: {
            code: 'any.only',
            message: '"value" must be one of [true, null]',
          },
        },
        nullish: {
          expectedIssue: {
            code: 'any.only',
            message: '"value" must be one of [true, null]',
          },
        },
      },
    },
    '100': {
      parse: false,
      expectedIssue: { code: 'any.only', message: '"value" must be [true]' },
      when: {
        nullable: {
          expectedIssue: {
            code: 'any.only',
            message: '"value" must be one of [true, null]',
          },
        },
        nullish: {
          expectedIssue: {
            code: 'any.only',
            message: '"value" must be one of [true, null]',
          },
        },
      },
    },
    '100.123': {
      parse: false,
      expectedIssue: { code: 'any.only', message: '"value" must be [true]' },
      when: {
        nullable: {
          expectedIssue: {
            code: 'any.only',
            message: '"value" must be one of [true, null]',
          },
        },
        nullish: {
          expectedIssue: {
            code: 'any.only',
            message: '"value" must be one of [true, null]',
          },
        },
      },
    },
    yesterday: {
      parse: false,
      expectedIssue: { code: 'any.only', message: '"value" must be [true]' },
      when: {
        nullable: {
          expectedIssue: {
            code: 'any.only',
            message: '"value" must be one of [true, null]',
          },
        },
        nullish: {
          expectedIssue: {
            code: 'any.only',
            message: '"value" must be one of [true, null]',
          },
        },
      },
    },
    now: {
      parse: false,
      expectedIssue: { code: 'any.only', message: '"value" must be [true]' },
      when: {
        nullable: {
          expectedIssue: {
            code: 'any.only',
            message: '"value" must be one of [true, null]',
          },
        },
        nullish: {
          expectedIssue: {
            code: 'any.only',
            message: '"value" must be one of [true, null]',
          },
        },
      },
    },
    tomorrow: {
      parse: false,
      expectedIssue: { code: 'any.only', message: '"value" must be [true]' },
      when: {
        nullable: {
          expectedIssue: {
            code: 'any.only',
            message: '"value" must be one of [true, null]',
          },
        },
        nullish: {
          expectedIssue: {
            code: 'any.only',
            message: '"value" must be one of [true, null]',
          },
        },
      },
    },
    isostring: {
      parse: false,
      expectedIssue: { code: 'any.only', message: '"value" must be [true]' },
      when: {
        nullable: {
          expectedIssue: {
            code: 'any.only',
            message: '"value" must be one of [true, null]',
          },
        },
        nullish: {
          expectedIssue: {
            code: 'any.only',
            message: '"value" must be one of [true, null]',
          },
        },
      },
    },
  },
})

generateBaseSpec('ZFalse', ZFalse, {
  expectedTypeName: 'ZFalse',
  expectedHints: {
    default: 'false',
    optional: 'false | undefined',
    nullable: 'false | null',
    nullish: 'false | null | undefined',
  },
  should: {
    false: { parse: true },
    // NOT
    undefined: {
      parse: false,
      expectedIssue: { code: 'any.required', message: '"value" is required' },
    },
    null: {
      parse: false,
      expectedIssue: { code: 'any.only', message: '"value" must be [false]' },
    },
    true: {
      parse: false,
      expectedIssue: { code: 'any.only', message: '"value" must be [false]' },
      when: {
        nullable: {
          expectedIssue: {
            code: 'any.only',
            message: '"value" must be one of [false, null]',
          },
        },
        nullish: {
          expectedIssue: {
            code: 'any.only',
            message: '"value" must be one of [false, null]',
          },
        },
      },
    },
    'BigInt(-100)': {
      parse: false,
      expectedIssue: { code: 'any.only', message: '"value" must be [false]' },
      when: {
        nullable: {
          expectedIssue: {
            code: 'any.only',
            message: '"value" must be one of [false, null]',
          },
        },
        nullish: {
          expectedIssue: {
            code: 'any.only',
            message: '"value" must be one of [false, null]',
          },
        },
      },
    },
    'BigInt(0)': {
      parse: false,
      expectedIssue: { code: 'any.only', message: '"value" must be [false]' },
      when: {
        nullable: {
          expectedIssue: {
            code: 'any.only',
            message: '"value" must be one of [false, null]',
          },
        },
        nullish: {
          expectedIssue: {
            code: 'any.only',
            message: '"value" must be one of [false, null]',
          },
        },
      },
    },
    'BigInt(100)': {
      parse: false,
      expectedIssue: { code: 'any.only', message: '"value" must be [false]' },
      when: {
        nullable: {
          expectedIssue: {
            code: 'any.only',
            message: '"value" must be one of [false, null]',
          },
        },
        nullish: {
          expectedIssue: {
            code: 'any.only',
            message: '"value" must be one of [false, null]',
          },
        },
      },
    },
    NaN: {
      parse: false,
      expectedIssue: { code: 'any.only', message: '"value" must be [false]' },
      when: {
        nullable: {
          expectedIssue: {
            code: 'any.only',
            message: '"value" must be one of [false, null]',
          },
        },
        nullish: {
          expectedIssue: {
            code: 'any.only',
            message: '"value" must be one of [false, null]',
          },
        },
      },
    },
    A: {
      parse: false,
      expectedIssue: { code: 'any.only', message: '"value" must be [false]' },
      when: {
        nullable: {
          expectedIssue: {
            code: 'any.only',
            message: '"value" must be one of [false, null]',
          },
        },
        nullish: {
          expectedIssue: {
            code: 'any.only',
            message: '"value" must be one of [false, null]',
          },
        },
      },
    },
    B: {
      parse: false,
      expectedIssue: { code: 'any.only', message: '"value" must be [false]' },
      when: {
        nullable: {
          expectedIssue: {
            code: 'any.only',
            message: '"value" must be one of [false, null]',
          },
        },
        nullish: {
          expectedIssue: {
            code: 'any.only',
            message: '"value" must be one of [false, null]',
          },
        },
      },
    },
    C: {
      parse: false,
      expectedIssue: { code: 'any.only', message: '"value" must be [false]' },
      when: {
        nullable: {
          expectedIssue: {
            code: 'any.only',
            message: '"value" must be one of [false, null]',
          },
        },
        nullish: {
          expectedIssue: {
            code: 'any.only',
            message: '"value" must be one of [false, null]',
          },
        },
      },
    },
    '-100.123': {
      parse: false,
      expectedIssue: { code: 'any.only', message: '"value" must be [false]' },
      when: {
        nullable: {
          expectedIssue: {
            code: 'any.only',
            message: '"value" must be one of [false, null]',
          },
        },
        nullish: {
          expectedIssue: {
            code: 'any.only',
            message: '"value" must be one of [false, null]',
          },
        },
      },
    },
    '-100': {
      parse: false,
      expectedIssue: { code: 'any.only', message: '"value" must be [false]' },
      when: {
        nullable: {
          expectedIssue: {
            code: 'any.only',
            message: '"value" must be one of [false, null]',
          },
        },
        nullish: {
          expectedIssue: {
            code: 'any.only',
            message: '"value" must be one of [false, null]',
          },
        },
      },
    },
    '-10': {
      parse: false,
      expectedIssue: { code: 'any.only', message: '"value" must be [false]' },
      when: {
        nullable: {
          expectedIssue: {
            code: 'any.only',
            message: '"value" must be one of [false, null]',
          },
        },
        nullish: {
          expectedIssue: {
            code: 'any.only',
            message: '"value" must be one of [false, null]',
          },
        },
      },
    },
    '-1': {
      parse: false,
      expectedIssue: { code: 'any.only', message: '"value" must be [false]' },
      when: {
        nullable: {
          expectedIssue: {
            code: 'any.only',
            message: '"value" must be one of [false, null]',
          },
        },
        nullish: {
          expectedIssue: {
            code: 'any.only',
            message: '"value" must be one of [false, null]',
          },
        },
      },
    },
    '0': {
      parse: false,
      expectedIssue: { code: 'any.only', message: '"value" must be [false]' },
      when: {
        nullable: {
          expectedIssue: {
            code: 'any.only',
            message: '"value" must be one of [false, null]',
          },
        },
        nullish: {
          expectedIssue: {
            code: 'any.only',
            message: '"value" must be one of [false, null]',
          },
        },
      },
    },
    '1': {
      parse: false,
      expectedIssue: { code: 'any.only', message: '"value" must be [false]' },
      when: {
        nullable: {
          expectedIssue: {
            code: 'any.only',
            message: '"value" must be one of [false, null]',
          },
        },
        nullish: {
          expectedIssue: {
            code: 'any.only',
            message: '"value" must be one of [false, null]',
          },
        },
      },
    },
    '10': {
      parse: false,
      expectedIssue: { code: 'any.only', message: '"value" must be [false]' },
      when: {
        nullable: {
          expectedIssue: {
            code: 'any.only',
            message: '"value" must be one of [false, null]',
          },
        },
        nullish: {
          expectedIssue: {
            code: 'any.only',
            message: '"value" must be one of [false, null]',
          },
        },
      },
    },
    '100': {
      parse: false,
      expectedIssue: { code: 'any.only', message: '"value" must be [false]' },
      when: {
        nullable: {
          expectedIssue: {
            code: 'any.only',
            message: '"value" must be one of [false, null]',
          },
        },
        nullish: {
          expectedIssue: {
            code: 'any.only',
            message: '"value" must be one of [false, null]',
          },
        },
      },
    },
    '100.123': {
      parse: false,
      expectedIssue: { code: 'any.only', message: '"value" must be [false]' },
      when: {
        nullable: {
          expectedIssue: {
            code: 'any.only',
            message: '"value" must be one of [false, null]',
          },
        },
        nullish: {
          expectedIssue: {
            code: 'any.only',
            message: '"value" must be one of [false, null]',
          },
        },
      },
    },
    yesterday: {
      parse: false,
      expectedIssue: { code: 'any.only', message: '"value" must be [false]' },
      when: {
        nullable: {
          expectedIssue: {
            code: 'any.only',
            message: '"value" must be one of [false, null]',
          },
        },
        nullish: {
          expectedIssue: {
            code: 'any.only',
            message: '"value" must be one of [false, null]',
          },
        },
      },
    },
    now: {
      parse: false,
      expectedIssue: { code: 'any.only', message: '"value" must be [false]' },
      when: {
        nullable: {
          expectedIssue: {
            code: 'any.only',
            message: '"value" must be one of [false, null]',
          },
        },
        nullish: {
          expectedIssue: {
            code: 'any.only',
            message: '"value" must be one of [false, null]',
          },
        },
      },
    },
    tomorrow: {
      parse: false,
      expectedIssue: { code: 'any.only', message: '"value" must be [false]' },
      when: {
        nullable: {
          expectedIssue: {
            code: 'any.only',
            message: '"value" must be one of [false, null]',
          },
        },
        nullish: {
          expectedIssue: {
            code: 'any.only',
            message: '"value" must be one of [false, null]',
          },
        },
      },
    },
    isostring: {
      parse: false,
      expectedIssue: { code: 'any.only', message: '"value" must be [false]' },
      when: {
        nullable: {
          expectedIssue: {
            code: 'any.only',
            message: '"value" must be one of [false, null]',
          },
        },
        nullish: {
          expectedIssue: {
            code: 'any.only',
            message: '"value" must be one of [false, null]',
          },
        },
      },
    },
  },
})
