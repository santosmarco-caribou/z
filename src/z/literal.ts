import type Joi from 'joi'
import type { F } from 'ts-toolbelt'

import { Z, ZJoi, ZType } from '../_internals'
import { generateZHint } from '../utils'

/* -------------------------------------------------------------------------- */
/*                                  ZLiteral                                  */
/* -------------------------------------------------------------------------- */

export type AllowedLiterals = string | number | boolean

export class ZLiteral<T extends AllowedLiterals> extends Z<{
  Output: T
  Input: T
  Schema: Joi.AnySchema
  Value: T
}> {
  readonly name = ZType.Literal
  protected readonly _hint = generateZHint(() => {
    const innerValue = this._props.getOne('value')
    return typeof innerValue === 'string'
      ? `'${String(innerValue)}'`
      : String(innerValue)
  })

  get value(): T {
    return this._props.getOne('value')
  }

  /* ------------------------------------------------------------------------ */

  static create = <T extends AllowedLiterals>(
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

/* -------------------------------------------------------------------------- */

export type AnyZLiteral = ZLiteral<AllowedLiterals>
