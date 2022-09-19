import type Joi from 'joi'
import type { U } from 'ts-toolbelt'

import {
  type _ZInput,
  type _ZOutput,
  type AnyZ,
  Z,
  ZJoi,
  ZType,
  ZValidator,
} from '../_internals'

/* -------------------------------------------------------------------------- */
/*                                ZIntersection                               */
/* -------------------------------------------------------------------------- */

export class ZIntersection<T extends [AnyZ, ...AnyZ[]]> extends Z<{
  Output: U.IntersectOf<_ZOutput<T[number]>>
  Input: U.IntersectOf<_ZInput<T[number]>>
  Schema: Joi.AnySchema
  Components: T
}> {
  readonly name = ZType.Intersection
  protected readonly _hint: string = this._props
    .getOne('components')
    .map(z => z.hint)
    .join(' & ')

  get components(): T {
    return this._props.getOne('components')
  }

  /* ------------------------------------------------------------------------ */

  static create = <T extends [AnyZ, ...AnyZ[]]>(
    components: T
  ): ZIntersection<T> => {
    const altZType = components.find(
      comp => comp._schema.get().type === 'alternatives'
    )

    const schema = (
      altZType
        ? (altZType._schema.get() as Joi.AlternativesSchema).concat(
            ZJoi.alternatives(
              ...components
                .filter(alt => alt._id !== altZType._id)
                .map(alt => alt._schema.get())
            )
          )
        : ZJoi.alternatives(...components.map(alt => alt._schema.get()))
    ).match('all')

    return new ZIntersection(
      {
        schema: ZValidator.custom(ZJoi.any(), (_value, { OK, FAIL }) => {
          const { value } = schema.validate(_value)
          if (value) return OK(value)
          return FAIL('intersection.base', {
            types: components.map(o => o.hint),
          })
        }),
        manifest: {},
        hooks: {},
      },
      { components }
    )
  }
}
