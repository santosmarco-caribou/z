import { ZNumber, ZString, ZSymbol, ZUnion } from '../_internals'

export type ZPropertyKey = ZUnion<[ZString, ZNumber, ZSymbol]>

export const ZPropertyKey = {
  create: () => ZUnion.create([ZString.create(), ZNumber.create(), ZSymbol.create()]),
}
