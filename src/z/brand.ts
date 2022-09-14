import { type ZDef, AnyZ, Z, ZInput, ZOutput, ZType } from '../_internals'

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                       ZBrand                                                       */
/* ------------------------------------------------------------------------------------------------------------------ */

const ZBrandTag = Symbol('ZBrandTag')

export type ZBranded<T, Brand> = T & {
  readonly [ZBrandTag]: Brand
}

export class ZBrand<T extends AnyZ, B extends string | number | symbol> extends Z<
  ZDef<
    { Output: ZBranded<ZOutput<T>, B>; Input: ZBranded<ZInput<T>, B>; Validator: T['_validator'] },
    { Type: T; Brand: B }
  >
> {
  readonly name = ZType.Brand
  protected readonly _hint = String(this._props.brand)

  static create = <T extends AnyZ, B extends string | number | symbol>(type: T, brand: B): ZBrand<T, B> =>
    new ZBrand({ validator: type._validator, hooks: type['_hooks'] }, { type, brand })
}
