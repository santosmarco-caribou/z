import {
  type _ZInput,
  type _ZOutput,
  type AnyZEnum,
  type AnyZFunction,
  type AnyZLiteral,
  type AnyZObject,
  type AnyZTuple,
  type TypeOf,
  type ZAnyDef,
  type ZArrayDef,
  type ZBigIntDef,
  type ZBooleanDef,
  type ZDateDef,
  type ZEnumDef,
  type ZFunctionDef,
  type ZLiteralDef,
  type ZNaNDef,
  type ZNeverDef,
  type ZNullableDef,
  type ZNullDef,
  type ZNullishDef,
  type ZNumberDef,
  type ZObjectDef,
  type ZOptionalDef,
  type ZStringDef,
  type ZStringDomainOptions,
  type ZStringDomainTldsOptions,
  type ZStringEmailOptions,
  type ZStringIpOptions,
  type ZStringPatternOptions,
  type ZStringUriOptions,
  type ZStringUuidOptions,
  type ZSymbolDef,
  type ZTupleDef,
  type ZUndefinedDef,
  type ZUnionDef,
  type ZUniqueSymbolDef,
  type ZUnknownDef,
  type ZVoidDef,
  Z,
  ZAny,
  ZArray,
  ZBigInt,
  ZBoolean,
  ZDate,
  ZEnum,
  ZFalse,
  ZFunction,
  ZLiteral,
  ZNaN,
  ZNever,
  ZNull,
  ZNullable,
  ZNullish,
  ZNumber,
  ZObject,
  ZOptional,
  ZString,
  ZSymbol,
  ZTrue,
  ZTuple,
  ZUndefined,
  ZUnion,
  ZUniqueSymbol,
  ZUnknown,
  ZVoid,
} from './z'

const anyType = ZAny.create
const arrayType = ZArray.create
const bigIntType = ZBigInt.create
const booleanType = ZBoolean.create
const dateType = ZDate.create
const enumType = ZEnum.create
const falseType = ZFalse.create
const functionType = ZFunction.create
const literalType = ZLiteral.create
const nanType = ZNaN.create
const neverType = ZNever.create
const nullableType = ZNullable.create
const nullishType = ZNullish.create
const nullType = ZNull.create
const numberType = ZNumber.create
const objectType = ZObject.create
const optionalType = ZOptional.create
const stringType = ZString.create
const symbolType = ZSymbol.create
const trueType = ZTrue.create
const tupleType = ZTuple.create
const undefinedType = ZUndefined.create
const unionType = ZUnion.create
const uniqueSymbolType = ZUniqueSymbol.create
const unknownType = ZUnknown.create
const voidType = ZVoid.create

export {
  anyType as any,
  arrayType as array,
  bigIntType as bigint,
  booleanType as boolean,
  dateType as date,
  enumType as enum,
  falseType as false,
  functionType as function,
  literalType as literal,
  nanType as nan,
  neverType as never,
  nullType as null,
  nullableType as nullable,
  nullishType as nullish,
  numberType as number,
  objectType as object,
  optionalType as optional,
  stringType as string,
  symbolType as symbol,
  trueType as true,
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
  ZBoolean,
  ZDate,
  ZEnum,
  ZFalse,
  ZFunction,
  ZLiteral,
  ZNaN,
  ZNever,
  ZNull,
  ZNullable,
  ZNullish,
  ZNumber,
  ZObject,
  ZOptional,
  ZString,
  ZSymbol,
  ZTrue,
  ZTuple,
  ZUndefined,
  ZUnion,
  ZUniqueSymbol,
  ZUnknown,
  ZVoid,
}
export type {
  ZAnyDef,
  ZArrayDef,
  ZBigIntDef,
  ZBooleanDef,
  ZDateDef,
  ZEnumDef,
  ZFunctionDef,
  ZLiteralDef,
  ZNaNDef,
  ZNeverDef,
  ZNullableDef,
  ZNullDef,
  ZNullishDef,
  ZNumberDef,
  ZObjectDef,
  ZOptionalDef,
  ZStringDef,
  ZSymbolDef,
  ZTupleDef,
  ZUndefinedDef,
  ZUnionDef,
  ZUniqueSymbolDef,
  ZUnknownDef,
  ZVoidDef,
}
export type { AnyZEnum, AnyZFunction, AnyZLiteral, AnyZObject, AnyZTuple }
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
