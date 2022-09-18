import Joi from 'joi'
import type { S } from 'ts-toolbelt'

import { type _ZInput, type _ZOutput, type AnyZ, Z, ZJoi, ZTuple, ZType } from '../_internals'

type Literal = string | number | bigint | boolean

export class ZTemplate<T extends readonly [AnyZ<Literal>, ...AnyZ<Literal>[]]> extends Z<{
  Output: S.Join<_ZOutput<ZTuple<T>>>
  Input: S.Join<_ZInput<ZTuple<T>>>
  Schema: Joi.StringSchema
  Elements: T
}> {
  readonly name = ZType.Template
  protected readonly _hint = `\`${this._props
    .getOne('elements')
    .map(el => {
      let elHint = el.hint
      if (elHint.startsWith('BigInt')) elHint = 'bigint'
      switch (elHint) {
        case 'string':
        case 'number':
        case 'bigint':
          return `\${${elHint}}`
        case 'boolean':
          return "${'true' | 'false'}"
        default:
          return elHint.replace(/^'(.*)'$/, '$1')
      }
    })
    .join('')}\``

  /* ---------------------------------------------------------------------------------------------------------------- */

  static create = <T extends readonly [AnyZ<Literal>, ...AnyZ<Literal>[]]>(elements: T): ZTemplate<T> =>
    new ZTemplate<T>(
      {
        schema: ZJoi.string(),
        manifest: {},
        hooks: {},
      },
      { elements }
    )
}
