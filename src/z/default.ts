import type { F } from 'ts-toolbelt'

import { AnyZ, Z, ZDef, ZOutput, ZType } from '../_internals'

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                      ZDefault                                                      */
/* ------------------------------------------------------------------------------------------------------------------ */

export class ZDefault<T extends AnyZ, D extends ZOutput<T> | (() => ZOutput<T>)> extends Z<
  ZDef<
    {
      Output: undefined extends ZOutput<T>
        ? Exclude<ZOutput<T>, undefined> | (D extends F.Function ? ReturnType<D> : D)
        : ZOutput<T>
      Validator: T['_validator']
    },
    { withDefault: T; defaultValue: D }
  >
> {
  readonly name = ZType.Default
  protected readonly _hint = '<<TODO>>'

  get value(): D extends F.Function ? ReturnType<D> : D {
    return typeof this._props.defaultValue === 'function'
      ? (this._props.defaultValue as F.Function)()
      : this._props.defaultValue
  }

  static create = <T extends AnyZ, D extends ZOutput<T>>(withDefault: T, defaultValue: D): ZDefault<T, D> =>
    new ZDefault({ validator: withDefault._validator.default(defaultValue), hooks: {} }, { withDefault, defaultValue })
}
