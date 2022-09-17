import type Joi from 'joi'

import { type _ZInput, type _ZOutput, type AnyZ, Z, ZJoi, ZType } from '../_internals'
import { unionizeHints } from '../utils'

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                       ZUnion                                                       */
/* ------------------------------------------------------------------------------------------------------------------ */

export class ZUnion<T extends [AnyZ, ...AnyZ[]]> extends Z<{
  Output: _ZOutput<T[number]>
  Input: _ZInput<T[number]>
  Schema: Joi.AlternativesSchema
  Options: T
}> {
  readonly name = ZType.Union
  protected readonly _hint = unionizeHints(...this._getProp('options').map(option => option.hint))

  get options(): T {
    return this._getProp('options')
  }

  /* ---------------------------------------------------------------------------------------------------------------- */

  static create = <T extends [AnyZ, ...AnyZ[]]>(options: T): ZUnion<T> => {
    const optAlreadyAlt = options.find(opt => opt.$_schema.type === 'alternatives')

    return new ZUnion(
      {
        schema: optAlreadyAlt
          ? (optAlreadyAlt.$_schema as Joi.AlternativesSchema).concat(
              ZJoi.alternatives(...options.filter(opt => opt._id !== optAlreadyAlt._id).map(option => option.$_schema))
            )
          : ZJoi.alternatives(...options.map(option => option.$_schema)),
        manifest: {},
        hooks: {},
      },
      { options }
    )
  }
}
