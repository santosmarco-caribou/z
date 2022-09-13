import { type AnyZ, type ZDef, type ZInput, type ZOutput, Z, ZType } from '../_internals'
import { unionizeHints } from '../utils'

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                      ZNullable                                                     */
/* ------------------------------------------------------------------------------------------------------------------ */

export class ZNullable<T extends AnyZ> extends Z<
  ZDef<{ Output: ZOutput<T> | null; Input: ZInput<T> | null; Validator: T['_validator'] }, { InnerType: T }>
> {
  readonly name = ZType.Nullable
  readonly hint = unionizeHints(this._props.innerType.hint, 'null')

  unwrap(): T {
    return this._props.innerType
  }

  static create = <T extends AnyZ>(innerType: T): ZNullable<T> =>
    new ZNullable({ validator: innerType._validator.allow(null) }, { innerType: innerType })
}

/* ------------------------------------------------------------------------------------------------------------------ */

export type AnyZNullable = ZNullable<AnyZ>
