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
  ZCustom,
  ZDate,
  ZDefault,
  ZDiscriminatedUnion,
  ZEnum,
  ZFalse,
  ZFalsy,
  ZFunction,
  ZGlobals,
  ZInstanceOf,
  ZIntersection,
  ZLiteral,
  ZMap,
  ZNaN,
  ZNever,
  ZNonNullable,
  ZNull,
  ZNullable,
  ZNumber,
  ZObject,
  ZOptional,
  ZPreprocess,
  ZPrimitive,
  ZPromise,
  ZPropertyKey,
  ZReadonly,
  ZReadonlyDeep,
  ZRecord,
  ZSet,
  ZString,
  ZSymbol,
  ZTemplate,
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
const customType = ZCustom.create
const dateType = ZDate.create
const defaultType = ZDefault.create
const discriminatedUnionType = ZDiscriminatedUnion.create
const enumType = ZEnum.create
const falseType = ZFalse.create
const falsyType = ZFalsy.create
const functionType = ZFunction.create
const globals = ZGlobals.get
const instanceofType = ZInstanceOf.create
const intersectionType = ZIntersection.create
const literalType = ZLiteral.create
const mapType = ZMap.create
const nanType = ZNaN.create
const neverType = ZNever.create
const nonnullableType = ZNonNullable.create
const nullableType = ZNullable.create
const nullType = ZNull.create
const numberType = ZNumber.create
const objectType = ZObject.create
const optionalType = ZOptional.create
const preprocessType = ZPreprocess.create
const primitiveType = ZPrimitive.create
const promiseType = ZPromise.create
const propertyKeyType = ZPropertyKey.create
const readonlyDeepType = ZReadonlyDeep.create
const readonlyType = ZReadonly.create
const recordType = ZRecord.create
const setType = ZSet.create
const stringType = ZString.create
const symbolType = ZSymbol.create
const templateType = ZTemplate.create
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
  customType as custom,
  dateType as date,
  defaultType as default,
  discriminatedUnionType as discriminatedUnion,
  enumType as enum,
  falseType as false,
  falsyType as falsy,
  functionType as function,
  globals,
  instanceofType as instanceof,
  intersectionType as intersection,
  literalType as literal,
  mapType as map,
  nanType as nan,
  neverType as never,
  nonnullableType as nonnullable,
  nullType as null,
  nullableType as nullable,
  numberType as number,
  objectType as object,
  optionalType as optional,
  preprocessType as preprocess,
  primitiveType as primitive,
  promiseType as promise,
  propertyKeyType as propertykey,
  readonlyType as readonly,
  readonlyDeepType as readonlydeep,
  recordType as record,
  setType as set,
  stringType as string,
  symbolType as symbol,
  templateType as template,
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
