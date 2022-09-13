import {
  type _ZInput,
  type _ZOutput,
  type AnyZArray,
  type AnyZEnum,
  type AnyZFunction,
  type AnyZInstanceOf,
  type AnyZIntersection,
  type AnyZLiteral,
  type AnyZMap,
  type AnyZNullable,
  type AnyZNullish,
  type AnyZObject,
  type AnyZOptional,
  type AnyZRecord,
  type AnyZSet,
  type AnyZTuple,
  type AnyZUnion,
  type AnyZUniqueSymbol,
  type TypeOf,
  type ZStringDomainOptions,
  type ZStringDomainTldsOptions,
  type ZStringEmailOptions,
  type ZStringIpOptions,
  type ZStringPatternOptions,
  type ZStringUriOptions,
  type ZStringUuidOptions,
  Z,
  ZAny,
  ZArray,
  ZBigInt,
  ZBinary,
  ZBoolean,
  ZDate,
  ZEnum,
  ZFalse,
  ZFalsy,
  ZFunction,
  ZInstanceOf,
  ZLiteral,
  ZMap,
  ZNaN,
  ZNever,
  ZNull,
  ZNullable,
  ZNullish,
  ZNumber,
  ZObject,
  ZOptional,
  ZRecord,
  ZSet,
  ZString,
  ZSymbol,
  ZTrue,
  ZTruthy,
  ZTuple,
  ZUndefined,
  ZUnion,
  ZUniqueSymbol,
  ZUnknown,
  ZVoid,
} from './z'

/** @group Main methods */
const anyType = ZAny.create
/** @group Main methods */
const arrayType = ZArray.create
/** @group Main methods */
const bigIntType = ZBigInt.create
/** @group Main methods */
const binaryType = ZBinary.create
/** @group Main methods */
const booleanType = ZBoolean.create
/** @group Main methods */
const dateType = ZDate.create
/** @group Main methods */
const enumType = ZEnum.create
/** @group Main methods */
const falseType = ZFalse.create
/** @group Main methods */
const falsyType = ZFalsy.create
/** @group Main methods */
const functionType = ZFunction.create
/** @group Main methods */
const instanceofType = ZInstanceOf.create
/** @group Main methods */
const literalType = ZLiteral.create
/** @group Main methods */
const mapType = ZMap.create
/** @group Main methods */
const nanType = ZNaN.create
/** @group Main methods */
const neverType = ZNever.create
/** @group Main methods */
const nullableType = ZNullable.create
/** @group Main methods */
const nullishType = ZNullish.create
/** @group Main methods */
const nullType = ZNull.create
/** @group Main methods */
const numberType = ZNumber.create
/** @group Main methods */
const objectType = ZObject.create
/** @group Main methods */
const optionalType = ZOptional.create
/** @group Main methods */
const recordType = ZRecord.create
/** @group Main methods */
const setType = ZSet.create
/** @group Main methods */
const stringType = ZString.create
/** @group Main methods */
const symbolType = ZSymbol.create
/** @group Main methods */
const trueType = ZTrue.create
/** @group Main methods */
const truthyType = ZTruthy.create
/** @group Main methods */
const tupleType = ZTuple.create
/** @group Main methods */
const undefinedType = ZUndefined.create
/** @group Main methods */
const unionType = ZUnion.create
/** @group Main methods */
const uniqueSymbolType = ZUniqueSymbol.create
/** @group Main methods */
const unknownType = ZUnknown.create
/** @group Main methods */
const voidType = ZVoid.create

export {
  anyType as any,
  arrayType as array,
  bigIntType as bigint,
  binaryType as binary,
  booleanType as boolean,
  dateType as date,
  enumType as enum,
  falseType as false,
  falsyType as falsy,
  functionType as function,
  instanceofType as instanceof,
  literalType as literal,
  mapType as map,
  nanType as nan,
  neverType as never,
  nullType as null,
  nullableType as nullable,
  nullishType as nullish,
  numberType as number,
  objectType as object,
  optionalType as optional,
  recordType as record,
  setType as set,
  stringType as string,
  symbolType as symbol,
  trueType as true,
  truthyType as truthy,
  tupleType as tuple,
  undefinedType as undefined,
  unionType as union,
  uniqueSymbolType as uniqsymbol,
  unknownType as unknown,
  voidType as void,
}
export {
  Z,
  ZAny,
  ZArray,
  ZBigInt,
  ZBinary,
  ZBoolean,
  ZDate,
  ZEnum,
  ZFalse,
  ZFalsy,
  ZFunction,
  ZInstanceOf,
  ZLiteral,
  ZMap,
  ZNaN,
  ZNever,
  ZNull,
  ZNullable,
  ZNullish,
  ZNumber,
  ZObject,
  ZOptional,
  ZRecord,
  ZSet,
  ZString,
  ZSymbol,
  ZTrue,
  ZTruthy,
  ZTuple,
  ZUndefined,
  ZUnion,
  ZUniqueSymbol,
  ZUnknown,
  ZVoid,
}
export type {
  AnyZArray,
  AnyZEnum,
  AnyZFunction,
  AnyZInstanceOf,
  AnyZIntersection,
  AnyZLiteral,
  AnyZMap,
  AnyZNullable,
  AnyZNullish,
  AnyZObject,
  AnyZOptional,
  AnyZRecord,
  AnyZSet,
  AnyZTuple,
  AnyZUnion,
  AnyZUniqueSymbol,
}
export type {
  ZStringDomainOptions,
  ZStringDomainTldsOptions,
  ZStringEmailOptions,
  ZStringIpOptions,
  ZStringPatternOptions,
  ZStringUriOptions,
  ZStringUuidOptions,
}
export type { TypeOf as infer, _ZInput as input, _ZOutput as output }
