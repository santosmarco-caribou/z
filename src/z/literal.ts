import type Joi from 'joi'
import type { F } from 'ts-toolbelt'
import type { Primitive } from 'type-fest'

import { Z, ZJoi, ZType, ZValidator } from '../_internals'

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                      ZLiteral                                                      */
/* ------------------------------------------------------------------------------------------------------------------ */

export class ZLiteral<T extends NonNullable<Primitive>> extends Z<{
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

  static create = <T extends NonNullable<Primitive>>(value: F.Narrow<T>): ZLiteral<T> =>
    new ZLiteral(
      {
        schema:
          typeof value === 'bigint'
            ? ZValidator.custom(ZJoi.any(), (_value, { schema, OK, FAIL }) =>
                typeof _value === 'bigint' && _value.valueOf() === value.valueOf()
                  ? OK(_value)
                  : FAIL('any.only', { valids: [`BigInt(${value})`, ...(schema._valids?._values ?? [])] })
              )
            : ZJoi.any().valid(value),
        manifest: {},
        hooks: {},
      },
      { value: value as T }
    )
}

/* ------------------------------------------------------------------------------------------------------------------ */

const generateHint = (value: NonNullable<Primitive>): string => {
  switch (typeof value) {
    case 'string':
      return `'${value}'`
    case 'bigint':
      return `BigInt(${value})`
    default:
      return String(value)
  }
}
