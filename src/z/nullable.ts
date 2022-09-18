import Joi from 'joi'

import { type _ZInput, type _ZOutput, type AnyZ, Z, ZType } from '../_internals'
import { unionizeHints } from '../utils'

/* -------------------------------------------------------------------------- */
/*                                  ZNullable                                 */
/* -------------------------------------------------------------------------- */

export class ZNullable<T extends AnyZ> extends Z<{
  Output: _ZOutput<T> | null
  Input: _ZInput<T> | null
  Schema: Joi.AnySchema
  InnerType: T
}> {
  readonly name = ZType.Nullable
  protected readonly _hint = unionizeHints(
    this._props.getOne('innerType').hint,
    'null'
  )

  unwrap(): T {
    return this._props.getOne('innerType')
  }

  /* ------------------------------------------------------------------------ */

  static create = <T extends AnyZ>(innerType: T): ZNullable<T> =>
    new ZNullable(
      {
        schema: innerType._schema.get().allow(null),
        manifest: innerType._manifest.get(),
        hooks: innerType._hooks.get(),
      },
      { innerType: innerType }
    )
}

/* -------------------------------------------------------------------------- */

export type AnyZNullable = ZNullable<AnyZ>
