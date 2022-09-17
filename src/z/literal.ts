import type Joi from 'joi'
import type { F } from 'ts-toolbelt'
import type { Primitive } from 'type-fest'

import { Z, ZJoi, ZType } from '../_internals'

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                      ZLiteral                                                      */
/* ------------------------------------------------------------------------------------------------------------------ */

export class ZLiteral<T extends Primitive> extends Z<{
  Output: T
  Input: T
  Schema: Joi.AnySchema
  Value: T
}> {
  readonly name = ZType.Literal
  protected readonly _hint = generateHint(this._getProp('value'))

  get value(): T {
    return this._getProp('value')
  }

  /* ---------------------------------------------------------------------------------------------------------------- */

  static create = <T extends Primitive>(value: F.Narrow<T>): ZLiteral<T> =>
    new ZLiteral(
      {
        schema: value === undefined ? ZJoi.any().forbidden().optional() : ZJoi.any().valid(value),
        manifest: {},
        hooks: {},
      },
      { value: value as T }
    )
}

/* ------------------------------------------------------------------------------------------------------------------ */

const generateHint = (value: Primitive): string => {
  switch (typeof value) {
    case 'string':
      return `'${value}'`
    case 'bigint':
      return `BigInt(${value})`
    default:
      return String(value)
  }
}
