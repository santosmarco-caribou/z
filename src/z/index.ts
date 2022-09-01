import { type ZAnyDef, ZAny } from './any'
import { type ZArrayDef, ZArray } from './array'
import { type ZBooleanDef, ZBoolean } from './boolean'
import { type ZDateDef, ZDate } from './date'
import { type AnyZEnum, type ZEnumDef, ZEnum } from './enum'
import { type AnyZFunction, type ZFunctionDef, ZFunction } from './function'
import { type AnyZLiteral, type ZLiteralDef, ZLiteral } from './literal'
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
  type ZInput,
  type ZNullableDef,
  type ZNullishDef,
  type ZOptionalDef,
  type ZOutput,
  type ZUnionDef,
  ZNullable,
  ZNullish,
  ZOptional,
  ZUnion,
} from './z'

const anyType = ZAny.create
const arrayType = ZArray.create
const booleanType = ZBoolean.create
const dateType = ZDate.create
const enumType = ZEnum.create
const functionType = ZFunction.create
const literalType = ZLiteral.create
const neverType = ZNever.create
const nullType = ZNull.create
const numberType = ZNumber.create
const objectType = ZObject.create
const stringType = ZString.create
const tupleType = ZTuple.create
const undefinedType = ZUndefined.create
const unknownType = ZUnknown.create
const voidType = ZVoid.create

export {
  anyType as any,
  arrayType as array,
  booleanType as boolean,
  dateType as date,
  enumType as enum,
  functionType as function,
  literalType as literal,
  neverType as never,
  nullType as null,
  numberType as number,
  objectType as object,
  stringType as string,
  tupleType as tuple,
  undefinedType as undefined,
  unknownType as unknown,
  voidType as void,
}
export {
  ZAny,
  ZArray,
  ZBoolean,
  ZDate,
  ZEnum,
  ZFunction,
  ZLiteral,
  ZNever,
  ZNull,
  ZNullable,
  ZNullish,
  ZNumber,
  ZObject,
  ZOptional,
  ZString,
  ZTuple,
  ZUndefined,
  ZUnion,
  ZUnknown,
  ZVoid,
}
export type {
  ZAnyDef,
  ZArrayDef,
  ZBooleanDef,
  ZDateDef,
  ZEnumDef,
  ZFunctionDef,
  ZLiteralDef,
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
