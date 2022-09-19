import { ZNaN } from '../_internals'
import { generateBaseSpec } from '../spec-utils'

generateBaseSpec('ZNaN', ZNaN, {
  expectedTypeName: 'ZNaN',
  expectedHints: {
    default: 'NaN',
    optional: 'NaN | undefined',
    nullable: 'NaN | null',
    nullish: 'NaN | null | undefined',
  },
  should: {
    NaN: { parse: true },
    // NOT
    undefined: {
      parse: false,
      expectedIssue: { code: 'any.required', message: '"value" is required' },
    },
    null: {
      parse: false,
      expectedIssue: { code: 'nan.base', message: '"value" must be a NaN' },
    },
    true: {
      parse: false,
      expectedIssue: { code: 'nan.base', message: '"value" must be a NaN' },
    },
    false: {
      parse: false,
      expectedIssue: { code: 'nan.base', message: '"value" must be a NaN' },
    },
    'BigInt(-100)': {
      parse: false,
      expectedIssue: { code: 'nan.base', message: '"value" must be a NaN' },
    },
    'BigInt(0)': {
      parse: false,
      expectedIssue: { code: 'nan.base', message: '"value" must be a NaN' },
    },
    'BigInt(100)': {
      parse: false,
      expectedIssue: { code: 'nan.base', message: '"value" must be a NaN' },
    },
    A: {
      parse: false,
      expectedIssue: { code: 'nan.base', message: '"value" must be a NaN' },
    },
    B: {
      parse: false,
      expectedIssue: { code: 'nan.base', message: '"value" must be a NaN' },
    },
    C: {
      parse: false,
      expectedIssue: { code: 'nan.base', message: '"value" must be a NaN' },
    },
    '-100.123': {
      parse: false,
      expectedIssue: { code: 'nan.base', message: '"value" must be a NaN' },
    },
    '-100': {
      parse: false,
      expectedIssue: { code: 'nan.base', message: '"value" must be a NaN' },
    },
    '-10': {
      parse: false,
      expectedIssue: { code: 'nan.base', message: '"value" must be a NaN' },
    },
    '-1': {
      parse: false,
      expectedIssue: { code: 'nan.base', message: '"value" must be a NaN' },
    },
    '0': {
      parse: false,
      expectedIssue: { code: 'nan.base', message: '"value" must be a NaN' },
    },
    '1': {
      parse: false,
      expectedIssue: { code: 'nan.base', message: '"value" must be a NaN' },
    },
    '10': {
      parse: false,
      expectedIssue: { code: 'nan.base', message: '"value" must be a NaN' },
    },
    '100': {
      parse: false,
      expectedIssue: { code: 'nan.base', message: '"value" must be a NaN' },
    },
    '100.123': {
      parse: false,
      expectedIssue: { code: 'nan.base', message: '"value" must be a NaN' },
    },
    yesterday: {
      parse: false,
      expectedIssue: { code: 'nan.base', message: '"value" must be a NaN' },
    },
    now: {
      parse: false,
      expectedIssue: { code: 'nan.base', message: '"value" must be a NaN' },
    },
    tomorrow: {
      parse: false,
      expectedIssue: { code: 'nan.base', message: '"value" must be a NaN' },
    },
    isostring: {
      parse: false,
      expectedIssue: { code: 'nan.base', message: '"value" must be a NaN' },
    },
  },
  baseMethodsConfig: {
    nonnullable: {
      expectedHint: 'NaN',
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
