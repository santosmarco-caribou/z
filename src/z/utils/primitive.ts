import { ZBigInt, ZBoolean, ZNull, ZNumber, ZString, ZSymbol, ZUndefined, ZUnion } from '../../_internals'

export type ZPrimitive = ZUnion<[ZNull, ZUndefined, ZString, ZNumber, ZBoolean, ZSymbol, ZBigInt]>

export const ZPrimitive = {
  create: () =>
    ZUnion.create([
      ZNull.create(),
      ZUndefined.create(),
      ZString.create(),
      ZNumber.create(),
      ZBoolean.create(),
      ZSymbol.create(),
      ZBigInt.create(),
    ]),
}
