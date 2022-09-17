import { ZBoolean, ZFalse, ZTrue } from '../_internals'
import { generateBaseSpec } from '../test-utils'

generateBaseSpec('ZBoolean', ZBoolean, {
  expectedTypeName: 'ZBoolean',
  expectedHints: {
    default: 'boolean',
    optional: 'boolean | undefined',
    nullable: 'boolean | null',
    nullish: 'boolean | undefined | null',
  },
  should: {
    true: { parse: true },
    false: { parse: true },
    // NOT
    undefined: { parse: false, expectedIssue: { code: 'any.required', message: '"value" is required' } },
    null: { parse: false, expectedIssue: { code: 'boolean.base', message: '"value" must be a boolean' } },
    'BigInt(-100)': { parse: false, expectedIssue: { code: 'boolean.base', message: '"value" must be a boolean' } },
    'BigInt(0)': { parse: false, expectedIssue: { code: 'boolean.base', message: '"value" must be a boolean' } },
    'BigInt(100)': { parse: false, expectedIssue: { code: 'boolean.base', message: '"value" must be a boolean' } },
  },
  additionalSpecs: [
    { title: 'should have .true() evaluate to a ZTrue instance', spec: z => expect(z.true()).toBeInstanceOf(ZTrue) },
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
    nullish: 'true | undefined | null',
  },
  should: {
    true: { parse: true },
    // NOT
    undefined: { parse: false, expectedIssue: { code: 'any.required', message: '"value" is required' } },
    null: { parse: false, expectedIssue: { code: 'any.only', message: '"value" must be [true]' } },
    false: {
      parse: false,
      expectedIssue: { code: 'any.only', message: '"value" must be [true]' },
      when: {
        nullable: { expectedIssue: { code: 'any.only', message: '"value" must be one of [true, null]' } },
        nullish: { expectedIssue: { code: 'any.only', message: '"value" must be one of [true, null]' } },
      },
    },
    'BigInt(-100)': {
      parse: false,
      expectedIssue: { code: 'any.only', message: '"value" must be [true]' },
      when: {
        nullable: { expectedIssue: { code: 'any.only', message: '"value" must be one of [true, null]' } },
        nullish: { expectedIssue: { code: 'any.only', message: '"value" must be one of [true, null]' } },
      },
    },
    'BigInt(0)': {
      parse: false,
      expectedIssue: { code: 'any.only', message: '"value" must be [true]' },
      when: {
        nullable: { expectedIssue: { code: 'any.only', message: '"value" must be one of [true, null]' } },
        nullish: { expectedIssue: { code: 'any.only', message: '"value" must be one of [true, null]' } },
      },
    },
    'BigInt(100)': {
      parse: false,
      expectedIssue: { code: 'any.only', message: '"value" must be [true]' },
      when: {
        nullable: { expectedIssue: { code: 'any.only', message: '"value" must be one of [true, null]' } },
        nullish: { expectedIssue: { code: 'any.only', message: '"value" must be one of [true, null]' } },
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
    nullish: 'false | undefined | null',
  },
  should: {
    false: { parse: true },
    // NOT
    undefined: { parse: false, expectedIssue: { code: 'any.required', message: '"value" is required' } },
    null: { parse: false, expectedIssue: { code: 'any.only', message: '"value" must be [false]' } },
    true: {
      parse: false,
      expectedIssue: { code: 'any.only', message: '"value" must be [false]' },
      when: {
        nullable: { expectedIssue: { code: 'any.only', message: '"value" must be one of [false, null]' } },
        nullish: { expectedIssue: { code: 'any.only', message: '"value" must be one of [false, null]' } },
      },
    },
    'BigInt(-100)': {
      parse: false,
      expectedIssue: { code: 'any.only', message: '"value" must be [false]' },
      when: {
        nullable: { expectedIssue: { code: 'any.only', message: '"value" must be one of [false, null]' } },
        nullish: { expectedIssue: { code: 'any.only', message: '"value" must be one of [false, null]' } },
      },
    },
    'BigInt(0)': {
      parse: false,
      expectedIssue: { code: 'any.only', message: '"value" must be [false]' },
      when: {
        nullable: { expectedIssue: { code: 'any.only', message: '"value" must be one of [false, null]' } },
        nullish: { expectedIssue: { code: 'any.only', message: '"value" must be one of [false, null]' } },
      },
    },
    'BigInt(100)': {
      parse: false,
      expectedIssue: { code: 'any.only', message: '"value" must be [false]' },
      when: {
        nullable: { expectedIssue: { code: 'any.only', message: '"value" must be one of [false, null]' } },
        nullish: { expectedIssue: { code: 'any.only', message: '"value" must be one of [false, null]' } },
      },
    },
  },
})
