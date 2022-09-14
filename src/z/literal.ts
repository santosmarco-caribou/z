import type Joi from 'joi'
import type { F } from 'ts-toolbelt'
import type { Primitive } from 'type-fest'

import { Z, ZDef, ZSchema, ZType, ZValidator } from '../_internals'

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                      ZLiteral                                                      */
/* ------------------------------------------------------------------------------------------------------------------ */

export class ZLiteral<T extends Primitive> extends Z<
  ZDef<{ Output: T; Validator: ZSchema<Joi.AnySchema> }, { value: T }>
> {
  readonly name = ZType.Literal
  protected readonly _hint = generateHint(this._props.value)

  get value(): T {
    return this._props.value
  }

  static create = <T extends Primitive>(value: F.Narrow<T>): ZLiteral<T> =>
    new ZLiteral(
      {
        validator: value === undefined ? ZValidator.any().forbidden().optional() : ZValidator.any().valid(value),
        hooks: {},
      },
      { value: value as T }
    )
}

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
