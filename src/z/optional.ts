import Joi from 'joi'

import { type _ZInput, type _ZOutput, type AnyZ, Z, ZType } from '../_internals'
import { unionizeHints } from '../utils'

/* -------------------------------------------------------------------------- */
/*                                  ZOptional                                 */
/* -------------------------------------------------------------------------- */

export class ZOptional<T extends AnyZ> extends Z<{
  Output: _ZOutput<T> | undefined
  Input: _ZInput<T> | undefined
  Schema: Joi.AnySchema
  InnerType: T
}> {
  readonly name = ZType.Optional
  protected readonly _hint = unionizeHints(
    this._props.getOne('innerType').hint,
    'undefined'
  )

  unwrap(): T {
    return this._props.getOne('innerType')
  }

  /* ------------------------------------------------------------------------ */

  static create = <T extends AnyZ>(innerType: T): ZOptional<T> =>
    new ZOptional(
      {
        schema:
          innerType._schema.get().$_getFlag('presence') === 'forbidden'
            ? innerType._schema.get()
            : innerType._schema.get().optional(),
        manifest: innerType._manifest.get(),
        hooks: innerType._hooks.get(),
      },
      { innerType: innerType }
    )
}

/* -------------------------------------------------------------------------- */

export type AnyZOptional = ZOptional<AnyZ>
