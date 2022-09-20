import type Joi from 'joi'

import {
  type _ZInput,
  type _ZOutput,
  type AnyZ,
  Z,
  ZJoi,
  ZType,
  ZValidator,
} from '../_internals'
import { unionizeHints } from '../utils'

/* -------------------------------------------------------------------------- */
/*                                   ZUnion                                   */
/* -------------------------------------------------------------------------- */

export class ZUnion<T extends [AnyZ, ...AnyZ[]]> extends Z<{
  Output: _ZOutput<T[number]>
  Input: _ZInput<T[number]>
  Schema: Joi.AnySchema
  Alternatives: T
}> {
  readonly name = ZType.Union
  protected readonly _hint = unionizeHints(
    ...this._props.getOne('alternatives').map(alt => alt.hint)
  )

  get alternatives(): T {
    return this._props.getOne('alternatives')
  }

  /* ------------------------------------------------------------------------ */

  static create = <T extends [AnyZ, ...AnyZ[]]>(alternatives: T): ZUnion<T> => {
    const flattenedAlternatives = alternatives.flatMap((alt): AnyZ[] =>
      alt instanceof ZUnion ? alt.alternatives : [alt]
    )

    return new ZUnion(
      {
        schema: ZValidator.custom(ZJoi.any(), (_value, { OK, FAIL }) => {
          const { value, error } = ZJoi.alternatives()
            .try(...flattenedAlternatives.map(alt => alt._schema.get()))
            .validate(_value)

          return error
            ? FAIL('union.base', {
                types: flattenedAlternatives.map(o => o.hint),
              })
            : OK(value)
        }),
        manifest: {},
        hooks: {},
      },
      { alternatives }
    )
  }
}
