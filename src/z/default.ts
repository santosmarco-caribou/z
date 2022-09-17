import type { F } from 'ts-toolbelt'

import { type _ZInput, type _ZOutput, type _ZSchema, type AnyZ, Z, ZType } from '../_internals'

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                      ZDefault                                                      */
/* ------------------------------------------------------------------------------------------------------------------ */

export class ZDefault<T extends AnyZ, D extends _ZOutput<T> | (() => _ZOutput<T>)> extends Z<{
  Output: undefined extends _ZOutput<T>
    ? Exclude<_ZOutput<T>, undefined> | (D extends F.Function ? ReturnType<D> : D)
    : _ZOutput<T>
  Input: undefined extends _ZInput<T>
    ? Exclude<_ZInput<T>, undefined> | (D extends F.Function ? ReturnType<D> : D)
    : _ZInput<T>
  Schema: _ZSchema<T>
  WithDefault: T
  DefaultValue: D
}> {
  readonly name = ZType.Default
  protected readonly _hint = '<<TODO>>'

  get value(): D extends F.Function ? ReturnType<D> : D {
    return typeof this._getProp('defaultValue') === 'function'
      ? (this._getProp('defaultValue') as F.Function)()
      : this._getProp('defaultValue')
  }

  static create = <T extends AnyZ, D extends _ZOutput<T>>(withDefault: T, defaultValue: D): ZDefault<T, D> =>
    new ZDefault(
      {
        schema: withDefault.$_schema.default(defaultValue) as _ZSchema<T>,
        manifest: withDefault.$_manifest,
        hooks: withDefault.$_hooks,
      },
      { withDefault, defaultValue }
    )
}
