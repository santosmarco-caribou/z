import Joi from 'joi'
import type { F } from 'ts-toolbelt'

import { type _ZInput, _ZOutput, AnyZ, Z, ZType } from '../_internals'

/* -------------------------------------------------------------------------- */
/*                                  ZDefault                                  */
/* -------------------------------------------------------------------------- */

type _AllowedDefaults = boolean | number | string | any[] | object | null
export type AllowedDefaults = _AllowedDefaults | (() => _AllowedDefaults)

export class ZDefault<T extends AnyZ, D extends AllowedDefaults> extends Z<{
  Output:
    | Exclude<_ZOutput<T>, undefined>
    | (D extends (...args: any[]) => infer R ? R : D)
  Input:
    | Exclude<_ZInput<T>, undefined>
    | (D extends (...args: any[]) => infer R ? R : D)
  Schema: Joi.Schema
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

  static create = <T extends AnyZ, D extends AllowedDefaults>(
    withDefault: T,
    defaultValue: D
  ): ZDefault<T, D> => {
    const updatedManifest = withDefault._manifest
      .update('default', { value: defaultValue })
      .get()

    return new ZDefault(
      {
        schema: withDefault._schema.get().default(defaultValue),
        manifest: updatedManifest,
        hooks: withDefault._hooks.get(),
      },
      { withDefault, defaultValue }
    )
  }
}
