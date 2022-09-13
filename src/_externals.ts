import {
  type AnyZInstanceOf,
  type AnyZNullable,
  type AnyZOptional,
  type AnyZUniqueSymbol,
  AnyZ,
  TypeOf,
  ZAny,
  ZBigInt,
  ZBoolean,
  ZDate,
  ZFalse,
  ZInput,
  ZInstanceOf,
  ZNaN,
  ZNever,
  ZNull,
  ZNullable,
  ZOptional,
  ZOutput,
  ZString,
  ZSymbol,
  ZTrue,
  ZUndefined,
  ZUniqueSymbol,
  ZUnknown,
  ZVoid,
} from './_internals'

const anyType = ZAny.create
const bigintType = ZBigInt.create
const booleanType = ZBoolean.create
const dateType = ZDate.create
const falseType = ZFalse.create
const instanceofType = ZInstanceOf.create
const nanType = ZNaN.create
const neverType = ZNever.create
const nullableType = ZNullable.create
const nullType = ZNull.create
const optionalType = ZOptional.create
const stringType = ZString.create
const symbolType = ZSymbol.create
const trueType = ZTrue.create
const undefinedType = ZUndefined.create
const uniqsymbolType = ZUniqueSymbol.create
const unknownType = ZUnknown.create
const voidType = ZVoid.create

export {
  anyType as any,
  bigintType as bigint,
  booleanType as boolean,
  dateType as date,
  falseType as false,
  instanceofType as instanceof,
  nanType as nan,
  neverType as never,
  nullType as null,
  nullableType as nullable,
  optionalType as optional,
  stringType as string,
  symbolType as symbol,
  trueType as true,
  undefinedType as undefined,
  uniqsymbolType as uniqsymbol,
  unknownType as unknown,
  voidType as void,
}
export type { AnyZInstanceOf, AnyZNullable, AnyZOptional, AnyZUniqueSymbol }

export type input<T extends AnyZ> = ZInput<T>
export type output<T extends AnyZ> = ZOutput<T>
export type infer<T extends AnyZ> = TypeOf<T>
