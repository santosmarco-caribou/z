import type Joi from 'joi'

import { AnyZ, Z, ZDef, ZInput, ZOutput, ZSchema, ZType, ZValidator } from '../_internals'
import { unionizeHints } from '../utils'

export class ZUnion<T extends [AnyZ, ...AnyZ[]]> extends Z<
  ZDef<
    { Output: ZOutput<T[number]>; Input: ZInput<T[number]>; Validator: ZSchema<Joi.AlternativesSchema> },
    { options: T }
  >
> {
  readonly name = ZType.Union
  protected readonly _hint = unionizeHints(...this._props.options.map(option => option.hint))

  get options(): T {
    return this._props.options
  }

  static create = <T extends [AnyZ, ...AnyZ[]]>(...options: T): ZUnion<T> => {
    const optAlreadyAlt = options.find(opt => opt._validator.type === 'alternatives')

    return new ZUnion(
      {
        validator: optAlreadyAlt
          ? (optAlreadyAlt._validator as ZSchema<Joi.AlternativesSchema>).concat(
              ZValidator.alternatives(
                ...options.filter(opt => opt._id !== optAlreadyAlt._id).map(option => option['_validator'])
              )
            )
          : ZValidator.alternatives(...options.map(option => option['_validator'])),
        hooks: {},
      },
      { options }
    )
  }
}
