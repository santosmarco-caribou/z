import {
  ZFalse,
  ZLiteral,
  ZNaN,
  ZNull,
  ZUndefined,
  ZUnion,
} from '../../_internals'

export type ZFalsy = ZUnion<
  [ZFalse, ZLiteral<''>, ZLiteral<0>, ZNull, ZUndefined, ZNaN]
>

export const ZFalsy = {
  create: () =>
    ZUnion.create([
      ZFalse.create(),
      ZLiteral.create(''),
      ZLiteral.create(0),
      ZNull.create(),
      ZUndefined.create(),
      ZNaN.create(),
    ]),
}
