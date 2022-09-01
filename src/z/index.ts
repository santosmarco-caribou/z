import { type ZAnyDef, ZAny } from './any'
import { type ZBigIntDef, ZBigInt } from './bigint'
import { type ZBooleanDef, ZBoolean, ZFalse, ZTrue } from './boolean'
import { type ZDateDef, ZDate } from './date'
import { type AnyZEnum, type ZEnumDef, ZEnum } from './enum'
import { type AnyZFunction, type ZFunctionDef, ZFunction } from './function'
import { type AnyZLiteral, type ZLiteralDef, ZLiteral } from './literal'
import { type ZNaNDef, ZNaN } from './nan'
import { type ZNeverDef, ZNever } from './never'
import { type ZNullDef, ZNull } from './null'
import { type ZNumberDef, ZNumber } from './number'
import { type AnyZObject, type ZObjectDef, ZObject } from './object'
import {
  type ZStringDef,
  type ZStringDomainOptions,
  type ZStringDomainTldsOptions,
  type ZStringEmailOptions,
  type ZStringIpOptions,
  type ZStringPatternOptions,
  type ZStringUriOptions,
  type ZStringUuidOptions,
  ZString,
} from './string'
import { type AnyZTuple, type ZTupleDef, ZTuple } from './tuple'
import { type ZUndefinedDef, ZUndefined } from './undefined'
import { type ZUnknownDef, ZUnknown } from './unknown'
import { type ZVoidDef, ZVoid } from './void'
import {
  type TypeOf,
  type ZArrayDef,
  type ZInput,
  type ZNullableDef,
  type ZNullishDef,
  type ZOptionalDef,
  type ZOutput,
  type ZUnionDef,
  ZArray,
  ZNullable,
  ZNullish,
  ZOptional,
  ZUnion,
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
const trueType = ZTrue.create
const tupleType = ZTuple.create
const undefinedType = ZUndefined.create
const unionType = ZUnion.create
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
  trueType as true,
  tupleType as tuple,
  undefinedType as undefined,
  unionType as union,
  unknownType as unknown,
  voidType as void,
}
export {
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
  ZTrue,
  ZTuple,
  ZUndefined,
  ZUnion,
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
  ZTupleDef,
  ZUndefinedDef,
  ZUnionDef,
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
export type { TypeOf as infer, ZInput as input, ZOutput as output }
