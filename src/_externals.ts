import {
  type _ZInput,
  type _ZOutput,
  type AnyZ,
  type TypeOf,
  ZAny,
  ZArray,
  ZBigInt,
  ZBinary,
  ZBoolean,
  ZBrand,
  ZDate,
  ZEnum,
  ZFalse,
  ZFunction,
  ZInstanceOf,
  ZIntersection,
  ZLiteral,
  ZMap,
  ZNaN,
  ZNever,
  ZNull,
  ZNullable,
  ZNumber,
  ZObject,
  ZOptional,
  ZPromise,
  ZReadonly,
  ZReadonlyDeep,
  ZRecord,
  ZSet,
  ZString,
  ZSymbol,
  ZTrue,
  ZTuple,
  ZUndefined,
  ZUnion,
  ZUniqueSymbol,
  ZUnknown,
  ZVoid,
} from './_internals'

const anyType = ZAny.create
const arrayType = ZArray.create
const bigintType = ZBigInt.create
const binaryType = ZBinary.create
const booleanType = ZBoolean.create
const brandType = ZBrand.create
const dateType = ZDate.create
const enumType = ZEnum.create
const falseType = ZFalse.create
const functionType = ZFunction.create
const instanceofType = ZInstanceOf.create
const intersectionType = ZIntersection.create
const literalType = ZLiteral.create
const mapType = ZMap.create
const nanType = ZNaN.create
const neverType = ZNever.create
const nullableType = ZNullable.create
const nullType = ZNull.create
const numberType = ZNumber.create
const objectType = ZObject.create
const optionalType = ZOptional.create
const promiseType = ZPromise.create
const readonlyDeepType = ZReadonlyDeep.create
const readonlyType = ZReadonly.create
const recordType = ZRecord.create
const setType = ZSet.create
const stringType = ZString.create
const symbolType = ZSymbol.create
const trueType = ZTrue.create
const tupleType = ZTuple.create
const undefinedType = ZUndefined.create
const unionType = ZUnion.create
const uniqsymbolType = ZUniqueSymbol.create
const unknownType = ZUnknown.create
const voidType = ZVoid.create

export {
  anyType as any,
  arrayType as array,
  bigintType as bigint,
  binaryType as binary,
  booleanType as boolean,
  brandType as brand,
  dateType as date,
  enumType as enum,
  falseType as false,
  functionType as function,
  instanceofType as instanceof,
  intersectionType as intersection,
  literalType as literal,
  mapType as map,
  nanType as nan,
  neverType as never,
  nullType as null,
  nullableType as nullable,
  numberType as number,
  objectType as object,
  optionalType as optional,
  promiseType as promise,
  readonlyType as readonly,
  readonlyDeepType as readonlydeep,
  recordType as record,
  setType as set,
  stringType as string,
  symbolType as symbol,
  trueType as true,
  tupleType as tuple,
  undefinedType as undefined,
  unionType as union,
  uniqsymbolType as uniqsymbol,
  unknownType as unknown,
  voidType as void,
}

export type input<T extends AnyZ> = _ZInput<T>
export type output<T extends AnyZ> = _ZOutput<T>
export type infer<T extends AnyZ> = TypeOf<T>
