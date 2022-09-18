import Joi from 'joi'

import { type _ZInput, type _ZOutput, type AnyZ, Z, ZManifestObject, ZType } from '../_internals'

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                    ZNonNullable                                                    */
/* ------------------------------------------------------------------------------------------------------------------ */

export class ZNonNullable<T extends AnyZ> extends Z<{
  Output: Exclude<_ZOutput<T>, null | undefined>
  Input: Exclude<_ZInput<T>, null | undefined>
  Schema: Joi.AnySchema
  InnerType: T
}> {
  readonly name = ZType.NonNullable
  protected readonly _hint = this._props
    .getOne('innerType')
    .hint.replace(/^(\| null|null \|)$/, '')
    .replace(/^(\| undefined|undefined \|)$/, '')

  unwrap(): T {
    return this._props.getOne('innerType')
  }

  /* ---------------------------------------------------------------------------------------------------------------- */

  static create = <T extends AnyZ>(innerType: T): ZNonNullable<T> =>
    new ZNonNullable(
      {
        schema: innerType._schema.get().required().disallow(null),
        manifest: innerType._manifest.get() as ZManifestObject<Exclude<_ZOutput<T>, null | undefined>>,
        hooks: innerType._hooks.get(),
      },
      { innerType: innerType }
    )
}

/* ------------------------------------------------------------------------------------------------------------------ */

export type AnyZNonNullable = ZNonNullable<AnyZ>
