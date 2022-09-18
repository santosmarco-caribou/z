import type Joi from 'joi'
import type { U } from 'ts-toolbelt'

import {
  type _ZInput,
  type _ZOutput,
  type AnyZ,
  Z,
  ZJoi,
  ZType,
} from '../_internals'

/* -------------------------------------------------------------------------- */
/*                                ZIntersection                               */
/* -------------------------------------------------------------------------- */

export class ZIntersection<T extends [AnyZ, ...AnyZ[]]> extends Z<{
  Output: U.IntersectOf<_ZOutput<T[number]>>
  Input: U.IntersectOf<_ZInput<T[number]>>
  Schema: Joi.AlternativesSchema
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
    const compAlreadyAlt = components.find(
      comp => comp._schema.get().type === 'alternatives'
    )

    return new ZIntersection(
      {
        schema: (compAlreadyAlt
          ? (
              compAlreadyAlt._schema.get() as ReturnType<
                typeof ZJoi['alternatives']
              >
            ).concat(
              ZJoi.alternatives(
                ...components
                  .filter(comp => comp._id !== compAlreadyAlt._id)
                  .map(comp => comp._schema.get())
              )
            )
          : ZJoi.alternatives(...components.map(comp => comp._schema.get()))
        ).match('all'),
        manifest: {},
        hooks: {},
      },
      { components: components }
    )
  }
}
