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
  protected readonly _hint = unionizeHints(...this._props.getOne('options').map(option => option.hint))

  get options(): T {
    return this._props.getOne('options')
  }

  /* ---------------------------------------------------------------------------------------------------------------- */

  static create = <T extends [AnyZ, ...AnyZ[]]>(options: T): ZUnion<T> => {
    const optAlreadyAlt = options.find(opt => opt._schema.get().type === 'alternatives')

    return new ZUnion(
      {
        schema: optAlreadyAlt
          ? (optAlreadyAlt._schema.get() as ReturnType<typeof ZJoi['alternatives']>).concat(
              ZJoi.alternatives(
                ...options.filter(opt => opt._id !== optAlreadyAlt._id).map(option => option._schema.get())
              )
            )
          : ZJoi.alternatives(...options.map(option => option._schema.get())),
        manifest: {},
        hooks: {},
      },
      { options }
    )
  }
}
