import { type AnyZ, type ZDef, type ZInput, type ZOutput, Z, ZType } from '../_internals'
import { unionizeHints } from '../utils'

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                      ZOptional                                                     */
/* ------------------------------------------------------------------------------------------------------------------ */

export class ZOptional<T extends AnyZ> extends Z<
  ZDef<{ Output: ZOutput<T> | undefined; Input: ZInput<T> | undefined; Validator: T['_validator'] }, { InnerType: T }>
> {
  readonly name = ZType.Optional
  protected readonly _hint = unionizeHints(this._props.innerType.hint, 'undefined')

  unwrap(): T {
    return this._props.innerType
  }

  static create = <T extends AnyZ>(innerType: T): ZOptional<T> =>
    new ZOptional(
      {
        validator:
          innerType['_validator'].$_getFlag('presence') === 'forbidden'
            ? innerType['_validator']
            : innerType['_validator'].optional(),
        hooks: innerType['_hooks'],
      },
      { innerType: innerType }
    )
}

/* ------------------------------------------------------------------------------------------------------------------ */

export type AnyZOptional = ZOptional<AnyZ>
