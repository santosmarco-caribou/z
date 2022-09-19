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
    const altZType = alternatives.find(
      alt => alt._schema.get().type === 'alternatives'
    )

    const schema = altZType
      ? (altZType._schema.get() as Joi.AlternativesSchema).concat(
          ZJoi.alternatives(
            ...alternatives
              .filter(alt => alt._id !== altZType._id)
              .map(alt => alt._schema.get())
          )
        )
      : ZJoi.alternatives(...alternatives.map(alt => alt._schema.get()))

    return new ZUnion(
      {
        schema: ZValidator.custom(ZJoi.any(), (_value, { OK, FAIL }) => {
          const { value } = schema.validate(_value)
          if (value) return OK(value)
          return FAIL('union.base', { types: alternatives.map(o => o.hint) })
        }),
        manifest: {},
        hooks: {},
      },
      { alternatives }
    )
  }
}
