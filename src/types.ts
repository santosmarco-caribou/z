import type Joi from 'joi'
import type { OpenAPIV3 } from 'openapi-types'

import type { AnyZDef, ZDef } from './_internals'
import type { ZError } from './validation/error'
import type { AnyZIssueCode, ZIssueLocalContext } from './validation/issue-map'
import type { _ZOutput, _ZValidator, AnyZ, ZArray, ZIntersection, ZNullable, ZNullish, ZOptional, ZUnion } from './z/z'

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                        ZType                                                       */
/* ------------------------------------------------------------------------------------------------------------------ */

export enum ZType {
  Any = 'ZAny',
  Array = 'ZArray',
  BigInt = 'ZBigInt',
  Binary = 'ZBinary',
  Boolean = 'ZBoolean',
  Date = 'ZDate',
  Enum = 'ZEnum',
  False = 'ZFalse',
  Falsy = 'ZFalsy',
  Function = 'ZFunction',
  InstanceOf = 'ZInstanceOf',
  Intersection = 'ZIntersection',
  Literal = 'ZLiteral',
  Map = 'ZMap',
  NaN = 'ZNaN',
  Never = 'ZNever',
  Null = 'ZNull',
  Nullable = 'ZNullable',
  Nullish = 'ZNullish',
  Number = 'ZNumber',
  Object = 'ZObject',
  Optional = 'ZOptional',
  Record = 'ZRecord',
  Set = 'ZSet',
  String = 'ZString',
  Symbol = 'ZSymbol',
  True = 'ZTrue',
  Truthy = 'ZTruthy',
  Tuple = 'ZTuple',
  Undefined = 'ZUndefined',
  Union = 'ZUnion',
  UniqueSymbol = 'ZUniqueSymbol',
  Unknown = 'ZUnknown',
  Void = 'ZVoid',
}

/* ------------------------------------------------------------------------------------------------------------------ */

export type ZDependencies<Def extends AnyZDef> = {
  validator: Def['Validator']
}

export type ZInitFn<Def extends AnyZDef> = (dependencies: ZDependencies, def: Def) => void
