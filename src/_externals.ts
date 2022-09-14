import {
  type AnyZInstanceOf,
  type AnyZNullable,
  type AnyZOptional,
  type AnyZUniqueSymbol,
  AnyZ,
  TypeOf,
  ZAny,
  ZArray,
  ZBigInt,
  ZBinary,
  ZBoolean,
  ZDate,
  ZEnum,
  ZFalse,
  ZInput,
  ZInstanceOf,
  ZLiteral,
  ZNaN,
  ZNever,
  ZNull,
  ZNullable,
  ZNumber,
  ZObject,
  ZOptional,
  ZOutput,
  ZString,
  ZSymbol,
  ZTrue,
  ZTuple,
  ZUndefined,
  ZUniqueSymbol,
  ZUnknown,
  ZVoid,
} from './_internals'

const anyType = ZAny.create
const arrayType = ZArray.create
const bigintType = ZBigInt.create
const binaryType = ZBinary.create
const booleanType = ZBoolean.create
const dateType = ZDate.create
const enumType = ZEnum.create
const falseType = ZFalse.create
const instanceofType = ZInstanceOf.create
const literalType = ZLiteral.create
const nanType = ZNaN.create
const neverType = ZNever.create
const nullableType = ZNullable.create
const nullType = ZNull.create
const numberType = ZNumber.create
const objectType = ZObject.create
const optionalType = ZOptional.create
const stringType = ZString.create
const symbolType = ZSymbol.create
const trueType = ZTrue.create
const tupleType = ZTuple.create
const undefinedType = ZUndefined.create
const uniqsymbolType = ZUniqueSymbol.create
const unknownType = ZUnknown.create
const voidType = ZVoid.create

export {
  anyType as any,
  arrayType as array,
  bigintType as bigint,
  binaryType as binary,
  booleanType as boolean,
  dateType as date,
  enumType as enum,
  falseType as false,
  instanceofType as instanceof,
  literalType as literal,
  nanType as nan,
  neverType as never,
  nullType as null,
  nullableType as nullable,
  numberType as number,
  objectType as object,
  optionalType as optional,
  stringType as string,
  symbolType as symbol,
  trueType as true,
  tupleType as tuple,
  undefinedType as undefined,
  uniqsymbolType as uniqsymbol,
  unknownType as unknown,
  voidType as void,
}
export type { AnyZInstanceOf, AnyZNullable, AnyZOptional, AnyZUniqueSymbol }

export type input<T extends AnyZ> = ZInput<T>
export type output<T extends AnyZ> = ZOutput<T>
export type infer<T extends AnyZ> = TypeOf<T>
