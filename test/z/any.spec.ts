/* eslint-disable @typescript-eslint/no-empty-function */

import { z } from '../../src'
import { Helpers } from '../helpers'

describe('ZAny', () => {
  it('parses valid inputs', () => {
    Helpers.validate(z.any(), [
      ['', true],
      ['a', true],

      [1, true],
      [Number.NaN, true],
      [BigInt(1), true],

      [true, true],
      [false, true],

      [null, true],

      [{}, true],
      [{ a: 1 }, true],

      [[], true],
      [[1], true],

      [() => {}, true],
      [class A {}, true],

      [new Date(), true],
      [new RegExp(''), true],
      [new Promise(() => {}), true],

      [new Map(), true],
      [new Set(), true],
      [new WeakMap(), true],
      [new WeakSet(), true],
      [new ArrayBuffer(0), true],

      [new Error(), true],

      [Symbol('a'), true],
    ])
  })

  it('does not parse `undefined`', () => {
    Helpers.validate(z.any(), [
      [undefined, false, Helpers.commonIssues.required()],
    ])
  })

  describe('.optional()', () => {
    it('parses `undefined`', () => {
      Helpers.validate(z.any().optional(), [[undefined, true]])
    })
  })

  describe('.nullable()', () => {
    it('parses `null`', () => {
      Helpers.validate(z.any().nullable(), [[null, true]])
    })
    it('does not parse `undefined`', () => {
      Helpers.validate(z.any().nullable(), [
        [undefined, false, Helpers.commonIssues.required()],
      ])
    })
  })

  describe('.nullish()', () => {
    it('parses both `undefined` and `null`', () => {
      Helpers.validate(z.any().nullish(), [
        [undefined, true],
        [null, true],
      ])
    })
  })

  describe('.required()', () => {
    it('does not parse `undefined`', () => {
      Helpers.validate(z.any().required(), [
        [undefined, false, Helpers.commonIssues.required()],
      ])
    })
  })

  describe('.nonnullable()', () => {
    it('does not parse either `undefined` or `null`', () => {
      Helpers.validate(z.any().nonnullable(), [
        [undefined, false, Helpers.commonIssues.required()],
        [
          null,
          false,
          {
            code: 'any.invalid',
            message: '"value" cannot be [null]',
            path: [],
            received: null,
            context: { label: 'value', invalids: [null] },
          },
        ],
      ])
    })
  })
})
