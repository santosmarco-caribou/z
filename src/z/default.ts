import Joi from 'joi'
import type { F } from 'ts-toolbelt'

import { type _ZInput, type _ZOutput, type AnyZ, Z, ZType } from '../_internals'

/* -------------------------------------------------------------------------- */
/*                                  ZDefault                                  */
/* -------------------------------------------------------------------------- */

export class ZDefault<
  T extends AnyZ,
  D extends _ZOutput<T> | (() => _ZOutput<T>)
> extends Z<{
  Output: undefined extends _ZOutput<T>
    ?
        | Exclude<_ZOutput<T>, undefined>
        | (D extends F.Function ? ReturnType<D> : D)
    : _ZOutput<T>
  Input: undefined extends _ZInput<T>
    ?
        | Exclude<_ZInput<T>, undefined>
        | (D extends F.Function ? ReturnType<D> : D)
    : _ZInput<T>
  Schema: Joi.AnySchema
  WithDefault: T
  DefaultValue: D
}> {
  readonly name = ZType.Default
  protected readonly _hint = '<<TODO>>'

  get value(): D extends F.Function ? ReturnType<D> : D {
    return typeof this._props.getOne('defaultValue') === 'function'
      ? (this._props.getOne('defaultValue') as F.Function)()
      : this._props.getOne('defaultValue')
  }

  /* ------------------------------------------------------------------------ */

  static create = <T extends AnyZ, D extends _ZOutput<T>>(
    withDefault: T,
    defaultValue: F.Narrow<D>
  ): ZDefault<T, D> =>
    new ZDefault(
      {
        schema: withDefault._schema.get().default(defaultValue),
        manifest: withDefault._manifest.get(),
        hooks: withDefault._hooks.get(),
      },
      { withDefault, defaultValue }
    )
}
