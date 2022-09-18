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
    },
    false: {
      parse: false,
      expectedIssue: { code: 'any.only', message: '"value" must be [null]' },
    },
    'BigInt(-100)': {
      parse: false,
      expectedIssue: { code: 'any.only', message: '"value" must be [null]' },
    },
    'BigInt(0)': {
      parse: false,
      expectedIssue: { code: 'any.only', message: '"value" must be [null]' },
    },
    'BigInt(100)': {
      parse: false,
      expectedIssue: { code: 'any.only', message: '"value" must be [null]' },
    },
    NaN: {
      parse: false,
      expectedIssue: { code: 'any.only', message: '"value" must be [null]' },
    },
    A: {
      parse: false,
      expectedIssue: { code: 'any.only', message: '"value" must be [null]' },
    },
    B: {
      parse: false,
      expectedIssue: { code: 'any.only', message: '"value" must be [null]' },
    },
    C: {
      parse: false,
      expectedIssue: { code: 'any.only', message: '"value" must be [null]' },
    },
    '-100.123': {
      parse: false,
      expectedIssue: { code: 'any.only', message: '"value" must be [null]' },
    },
    '-100': {
      parse: false,
      expectedIssue: { code: 'any.only', message: '"value" must be [null]' },
    },
    '-10': {
      parse: false,
      expectedIssue: { code: 'any.only', message: '"value" must be [null]' },
    },
    '-1': {
      parse: false,
      expectedIssue: { code: 'any.only', message: '"value" must be [null]' },
    },
    '0': {
      parse: false,
      expectedIssue: { code: 'any.only', message: '"value" must be [null]' },
    },
    '1': {
      parse: false,
      expectedIssue: { code: 'any.only', message: '"value" must be [null]' },
    },
    '10': {
      parse: false,
      expectedIssue: { code: 'any.only', message: '"value" must be [null]' },
    },
    '100': {
      parse: false,
      expectedIssue: { code: 'any.only', message: '"value" must be [null]' },
    },
    '100.123': {
      parse: false,
      expectedIssue: { code: 'any.only', message: '"value" must be [null]' },
    },
    yesterday: {
      parse: false,
      expectedIssue: { code: 'any.only', message: '"value" must be [null]' },
    },
    now: {
      parse: false,
      expectedIssue: { code: 'any.only', message: '"value" must be [null]' },
    },
    tomorrow: {
      parse: false,
      expectedIssue: { code: 'any.only', message: '"value" must be [null]' },
    },
    isostring: {
      parse: false,
      expectedIssue: { code: 'any.only', message: '"value" must be [null]' },
    },
  },
})
