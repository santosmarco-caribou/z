import { type _ZInput, type _ZOutput, type AnyZ, _ZSchema, Z, ZType } from '../_internals'

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                       ZBrand                                                       */
/* ------------------------------------------------------------------------------------------------------------------ */

const ZBrandTag = Symbol('ZBrandTag')

export type ZBranded<T, Brand> = T & {
  readonly [ZBrandTag]: Brand
}

export class ZBrand<T extends AnyZ, B extends string | number | symbol> extends Z<{
  Output: ZBranded<_ZOutput<T>, B>
  Input: ZBranded<_ZInput<T>, B>
  Schema: _ZSchema<T>
  Type: T
  Brand: B
}> {
  readonly name = ZType.Brand
  protected readonly _hint = String(this._getProp('brand'))

  /* ---------------------------------------------------------------------------------------------------------------- */

  static create = <T extends AnyZ, B extends string | number | symbol>(type: T, brand: B): ZBrand<T, B> =>
    new ZBrand(
      {
        schema: type.$_schema as _ZSchema<T>,
        manifest: type.$_manifest,
        hooks: type['_getHooks'](),
      },
      { type, brand }
    )
}
