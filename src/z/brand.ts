import Joi from 'joi'

import { type _ZInput, type _ZOutput, type AnyZ, Z, ZType } from '../_internals'

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                       ZBrand                                                       */
/* ------------------------------------------------------------------------------------------------------------------ */

export const ZBrandTag = Symbol('ZBrandTag')

export type ZBranded<T, Brand> = T & {
  readonly [ZBrandTag]: Brand
}

export class ZBrand<T extends AnyZ, B extends string | number | symbol> extends Z<{
  Output: ZBranded<_ZOutput<T>, B>
  Input: ZBranded<_ZInput<T>, B>
  Schema: Joi.AnySchema
  Type: T
  Brand: B
}> {
  readonly name = ZType.Brand
  protected readonly _hint = String(this._props.getOne('brand'))

  /* ---------------------------------------------------------------------------------------------------------------- */

  static create = <T extends AnyZ, B extends string | number | symbol>(type: T, brand: B): ZBrand<T, B> =>
    new ZBrand(
      {
        schema: type._schema.get(),
        manifest: type._manifest.get(),
        hooks: type._hooks.get(),
      },
      { type, brand }
    )
}
