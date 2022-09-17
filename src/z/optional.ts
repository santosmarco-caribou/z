import Joi from 'joi'

import { type _ZInput, type _ZOutput, type AnyZ, Z, ZType } from '../_internals'
import { unionizeHints } from '../utils'

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                      ZOptional                                                     */
/* ------------------------------------------------------------------------------------------------------------------ */

export class ZOptional<T extends AnyZ> extends Z<{
  Output: _ZOutput<T> | undefined
  Input: _ZInput<T> | undefined
  Schema: Joi.AnySchema
  InnerType: T
}> {
  readonly name = ZType.Optional
  protected readonly _hint = unionizeHints(this._getProp('innerType').hint, 'undefined')

  unwrap(): T {
    return this._getProp('innerType')
  }

  /* ---------------------------------------------------------------------------------------------------------------- */

  static create = <T extends AnyZ>(innerType: T): ZOptional<T> =>
    new ZOptional(
      {
        schema:
          innerType.$_schema.$_getFlag('presence') === 'forbidden' ? innerType.$_schema : innerType.$_schema.optional(),
        manifest: innerType.$_manifest,
        hooks: innerType['_getHooks'](),
      },
      { innerType: innerType }
    )
}

/* ------------------------------------------------------------------------------------------------------------------ */

export type AnyZOptional = ZOptional<AnyZ>
