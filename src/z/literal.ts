import type Joi from 'joi'
import type { F } from 'ts-toolbelt'

import { Z, ZJoi, ZType } from '../_internals'

/* -------------------------------------------------------------------------- */
/*                                  ZLiteral                                  */
/* -------------------------------------------------------------------------- */

type AllowedLiterals = string | number | boolean | symbol

export class ZLiteral<T extends NonNullable<AllowedLiterals>> extends Z<{
  Output: T
  Input: T
  Schema: Joi.AnySchema
  Value: T
}> {
  readonly name = ZType.Literal
  protected readonly _hint =
    typeof this._props.getOne('value') === 'string'
      ? `'${String(this._props.getOne('value'))}'`
      : String(this._props.getOne('value'))

  get value(): T {
    return this._props.getOne('value')
  }

  /* ------------------------------------------------------------------------ */

  static create = <T extends NonNullable<AllowedLiterals>>(
    value: F.Narrow<T>
  ): ZLiteral<T> =>
    new ZLiteral(
      {
        schema: ZJoi.any().valid(value),
        manifest: {},
        hooks: {},
      },
      { value: value as T }
    )
}
