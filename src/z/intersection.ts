import type Joi from 'joi'
import { U } from 'ts-toolbelt'

import { AnyZ, Z, ZDef, ZInput, ZOutput, ZSchema, ZType, ZValidator } from '../_internals'

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                    ZIntersection                                                   */
/* ------------------------------------------------------------------------------------------------------------------ */

export class ZIntersection<T extends [AnyZ, ...AnyZ[]]> extends Z<
  ZDef<
    {
      Output: U.IntersectOf<ZOutput<T[number]>>
      Input: U.IntersectOf<ZInput<T[number]>>
      Validator: ZSchema<Joi.AlternativesSchema>
    },
    { components: T }
  >
> {
  readonly name = ZType.Intersection
  protected readonly _hint = this._props.components.map(z => z.hint).join(' & ')

  get components(): T {
    return this._props.components
  }

  static create = <T extends [AnyZ, ...AnyZ[]]>(components: T): ZIntersection<T> => {
    const compAlreadyAlt = components.find(comp => comp._validator.type === 'alternatives')

    return new ZIntersection(
      {
        validator: (compAlreadyAlt
          ? (compAlreadyAlt._validator as ZSchema<Joi.AlternativesSchema>).concat(
              ZValidator.alternatives(
                ...components.filter(comp => comp._id !== compAlreadyAlt._id).map(comp => comp['_validator'])
              )
            )
          : ZValidator.alternatives(...components.map(comp => comp['_validator']))
        ).match('all'),
        hooks: {},
      },
      { components: components }
    )
  }
}
