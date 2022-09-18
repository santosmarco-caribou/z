import Joi from 'joi'

import {
  type _ZInput,
  type _ZOutput,
  type AnyZ,
  Z,
  ZManifestObject,
  ZType,
} from '../_internals'

/* -------------------------------------------------------------------------- */
/*                                  ZRequired                                 */
/* -------------------------------------------------------------------------- */

export class ZRequired<T extends AnyZ> extends Z<{
  Output: Exclude<_ZOutput<T>, undefined>
  Input: Exclude<_ZInput<T>, undefined>
  Schema: Joi.AnySchema
  InnerType: T
}> {
  readonly name = ZType.Required
  protected readonly _hint = this._props
    .getOne('innerType')
    .hint.replace(/^(\| undefined|undefined \|)$/, '')

  unwrap(): T {
    return this._props.getOne('innerType')
  }

  /* ------------------------------------------------------------------------ */

  static create = <T extends AnyZ>(innerType: T): ZRequired<T> =>
    new ZRequired(
      {
        schema: innerType._schema.get().required(),
        manifest: innerType._manifest.get() as ZManifestObject<
          Exclude<_ZOutput<T>, undefined>
        >,
        hooks: innerType._hooks.get(),
      },
      { innerType: innerType }
    )
}

/* -------------------------------------------------------------------------- */

export type AnyZRequired = ZRequired<AnyZ>
