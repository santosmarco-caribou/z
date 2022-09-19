import Joi from 'joi'

import {
  type _ZInput,
  type _ZOutput,
  type AnyZ,
  Z,
  ZManifestObject,
  ZNever,
  ZType,
} from '../_internals'
import { generateZHint } from '../utils'

/* -------------------------------------------------------------------------- */
/*                                ZNonNullable                                */
/* -------------------------------------------------------------------------- */

export class ZNonNullable<T extends AnyZ> extends Z<{
  Output: Exclude<_ZOutput<T>, null | undefined>
  Input: Exclude<_ZInput<T>, null | undefined>
  Schema: Joi.AnySchema
  InnerType: T
}> {
  readonly name = ZType.NonNullable
  protected readonly _hint = generateZHint(
    ({ unionizeHints, isOnlyUnionHint }) => {
      const inner = this._props.getOne('innerType')

      if (inner.hint === 'null' || inner.hint === 'undefined') {
        return 'never'
      }

      if (isOnlyUnionHint(inner.name)) {
        if (
          !unionizeHints(
            ...inner.hint.replaceAll(/null|undefined/g, '').split('|')
          )
        ) {
          return 'never'
        }
      }

      return inner.hint
    }
  )

  unwrap(): T {
    return this._props.getOne('innerType')
  }

  /* ------------------------------------------------------------------------ */

  static create = <T extends AnyZ>(innerType: T): ZNonNullable<T> => {
    const innerSchema = innerType._schema.get()
    return new ZNonNullable(
      {
        schema:
          innerType.name === ZType.Never
            ? innerSchema
            : innerType.name === ZType.Null
            ? ZNever.create()._schema.get()
            : innerSchema.required().disallow(null),
        manifest: innerType._manifest.get() as ZManifestObject<
          Exclude<_ZOutput<T>, null | undefined>
        >,
        hooks: innerType._hooks.get(),
      },
      { innerType: innerType }
    )
  }
}

/* -------------------------------------------------------------------------- */

export type AnyZNonNullable = ZNonNullable<AnyZ>
