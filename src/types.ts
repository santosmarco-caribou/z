import type { OpenAPIV3 } from 'openapi-types'

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
/*                                                          Z                                                         */
/* ------------------------------------------------------------------------------------------------------------------ */

export interface ZTransformMethods<Z extends AnyZ> {
  optional(): ZOptional<Z>
  nullable(): ZNullable<Z>
  nullish(): ZNullish<Z>
  array(): ZArray<Z>
  or<T extends AnyZ>(alternative: T): ZUnion<[Z, T]>
  and<T extends AnyZ>(incoming: T): ZIntersection<[Z, T]>
  /* ---------------------------------------------------------------------------------------------------------------- */
  isOptional(): boolean
  isNullable(): boolean
}

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                       ZParser                                                      */
/* ------------------------------------------------------------------------------------------------------------------ */

/* --------------------------------------------------- ParseResult -------------------------------------------------- */

export type ParseResultOk<Z extends AnyZ> = {
  ok: true
  value: _ZOutput<Z>
  error: null
}

export type ParseResultFail<Z extends AnyZ> = {
  ok: false
  value: null
  error: ReturnType<ZError<Z>['toPlainObject']>
}

export type ParseResult<Z extends AnyZ> = ParseResultOk<Z> | ParseResultFail<Z>

/* -------------------------------------------------- ParseOptions -------------------------------------------------- */

export type ParseOptions = {
  abortEarly?: boolean
}

/* -------------------------------------------------- CheckOptions -------------------------------------------------- */

export type ZCheckOptions<IssueCode extends AnyZIssueCode> = {
  message?:
    | string
    | (ZIssueLocalContext<IssueCode, { Extras: true }> extends Record<PropertyKey, never>
        ? never
        : (availableCtxTags: ZIssueLocalContext<IssueCode, { Extras: true }>) => string)
}

/* ------------------------------------------------------------------------------------------------------------------ */

export interface ZParsingMethods<Z extends AnyZ> {
  safeParse(input: unknown, options: ParseOptions | undefined): ParseResult<Z>
  parse(input: unknown, options: ParseOptions | undefined): _ZOutput<Z>
  parseAsync(input: unknown, options: ParseOptions | undefined): Promise<_ZOutput<Z>>
  isValid(input: unknown, options: ParseOptions | undefined): input is _ZOutput<Z>
}

export interface ZChecksAndValidationMethods<Z extends AnyZ> {
  addCheck(fn: (validator: _ZValidator<Z>) => _ZValidator<Z>): Z
  addCheck<IssueCode extends AnyZIssueCode>(
    issue: IssueCode,
    fn: (validator: _ZValidator<Z>) => _ZValidator<Z>,
    options: ZCheckOptions<IssueCode> | undefined
  ): Z
}

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                      ZManifest                                                     */
/* ------------------------------------------------------------------------------------------------------------------ */

export type ManifestBasicInfo = {
  title?: string
  summary?: string
  description?: string
}

export type ManifestBasicInfoWithValue<T> = ManifestBasicInfo & {
  value: T
}

export type ManifestFormat =
  | 'alphanumeric'
  | 'data-uri'
  | 'date-time'
  | 'email'
  | 'hexadecimal'
  | 'port'
  | 'uri'
  | 'uuid'

/* ------------------------------------------------- ZManifestObject ------------------------------------------------ */

export type ZManifestObject<T> = ManifestBasicInfo & {
  label?: string
  format?: ManifestFormat
  default?: ManifestBasicInfoWithValue<T>
  examples?: ManifestBasicInfoWithValue<T>[]
  tags?: ManifestBasicInfoWithValue<string>[]
  notes?: ManifestBasicInfoWithValue<string>[]
  unit?: string
  deprecated?: boolean
  keys?: Record<string, ZManifestObject<T>>
}

export type AnyZManifestObject = ZManifestObject<any>

/* ------------------------------------------------------------------------------------------------------------------ */

export interface ZManifestMethods<Z extends AnyZ> {
  get manifest(): ZManifestObject<_ZOutput<Z>>
  label(label: string): this
  title(title: string): this
  summary(summary: string): this
  description(description: string): this
  default(value: _ZOutput<Z> | ManifestBasicInfoWithValue<_ZOutput<Z>>): this
  examples(...examples: Array<_ZOutput<Z> | ManifestBasicInfoWithValue<_ZOutput<Z>>>): this
  example(example: _ZOutput<Z> | ManifestBasicInfoWithValue<_ZOutput<Z>>): this
  tags(...tags: (string | ManifestBasicInfoWithValue<string>)[]): this
  tag(tag: string | ManifestBasicInfoWithValue<string>): this
  notes(...notes: (string | ManifestBasicInfoWithValue<string>)[]): this
  note(note: string | ManifestBasicInfoWithValue<string>): this
  unit(unit: string): this
  deprecated(deprecated: boolean): this
}

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                      ZOpenApi                                                      */
/* ------------------------------------------------------------------------------------------------------------------ */

export type OpenApiSchemaObject = OpenAPIV3.SchemaObject

export interface ZOpenApiMethods {
  toOpenApi(): OpenApiSchemaObject
}
