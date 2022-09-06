import Joi from 'joi'
import type { OpenAPIV3 } from 'openapi-types'
import type { F } from 'ts-toolbelt'
import type { Primitive } from 'type-fest'

import type { AnyZDef, ZDef } from '../def'
import { ManifestBasicInfoWithValue, ZManifest, ZManifestObject } from '../manifest/manifest'
import { ZOpenApi } from '../manifest/openapi'
import { ZType } from '../type'
import { ZUtils } from '../utils'
import { type ParseOptions, type ParseResult, ZParser } from '../validation/parser'
import { ZValidator } from '../validation/validator'

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                          Z                                                         */
/* ------------------------------------------------------------------------------------------------------------------ */

export abstract class Z<Output, Def extends AnyZDef, Input = Output> {
  /**
   * @internal
   */
  readonly $_output!: Output
  /**
   * @internal
   */
  readonly $_input!: Input

  /**
   * @internal
   */
  _validator: Def['validator']
  /**
   * @internal
   */
  _def: Omit<Def, 'validator'>

  /**
   * @internal
   */
  protected readonly _parser: ZParser<this>
  /**
   * @internal
   */
  protected readonly _manifest: ZManifest<this>
  /**
   * @internal
   */
  protected readonly _openApi: ZOpenApi<this>

  abstract readonly name: ZType
  abstract readonly hint: string

  protected constructor({ validator, ...def }: Def) {
    this._validator = validator
    this._def = def

    this._parser = ZParser.create(this)
    this._manifest = ZManifest.create(this)
    this._openApi = ZOpenApi.create(this)
  }

  /* ---------------------------------------------------- Parsing --------------------------------------------------- */

  safeParse(input: unknown, options?: ParseOptions): ParseResult<this> {
    return this._parser.safeParse(input, options)
  }

  parse(input: unknown, options?: ParseOptions): Output {
    return this._parser.parse(input, options)
  }

  parseAsync(input: unknown, options?: ParseOptions): Promise<Output> {
    return this._parser.parseAsync(input, options)
  }

  isValid(input: unknown, options?: ParseOptions): input is Output {
    return this._parser.isValid(input, options)
  }

  /* ---------------------------------------------------------------------------------------------------------------- */

  optional(): ZOptional<this> {
    return ZOptional.create(this)
  }

  nullable(): ZNullable<this> {
    return ZNullable.create(this)
  }

  nullish(): ZNullish<this> {
    return ZNullish.create(this)
  }

  array(): ZArray<this> {
    return ZArray.create(this)
  }

  or<T extends AnyZ>(alternative: T): ZUnion<[this, T]> {
    return ZUnion.create(this, alternative)
  }

  /* ---------------------------------------------------------------------------------------------------------------- */

  isOptional(): boolean {
    return !this.safeParse(undefined).error
  }

  isNullable(): boolean {
    return !this.safeParse(null).error
  }

  /* --------------------------------------------------- Manifest --------------------------------------------------- */

  get manifest(): ZManifestObject<Output> {
    return this._manifest.get()
  }

  title(title: string): this {
    return this._manifest.set('title', title)
  }

  summary(summary: string): this {
    return this._manifest.set('summary', summary)
  }

  description(description: string): this {
    return this._manifest.set('description', description)
  }

  default(value: ManifestBasicInfoWithValue<Output>): this {
    return this._manifest.set('default', value)
  }

  examples(...examples: ManifestBasicInfoWithValue<Output>[]): this {
    return this._manifest.set('examples', examples)
  }

  tags(...tags: (string | ManifestBasicInfoWithValue<string>)[]): this {
    return this._manifest.set(
      'tags',
      tags.map(tag => (typeof tag === 'string' ? { value: tag } : tag))
    )
  }

  notes(...notes: (string | ManifestBasicInfoWithValue<string>)[]): this {
    return this._manifest.set(
      'notes',
      notes.map(note => (typeof note === 'string' ? { value: note } : note))
    )
  }

  unit(unit: string): this {
    return this._manifest.set('unit', unit)
  }

  deprecated(deprecated: boolean): this {
    return this._manifest.set('deprecated', deprecated)
  }

  /* ---------------------------------------------------- OpenAPI --------------------------------------------------- */

  toOpenApi(): OpenAPIV3.SchemaObject {
    return this._openApi.generate()
  }
}

export type AnyZ = Z<any, AnyZDef>

export type _ZOutput<Z extends AnyZ> = Z['$_output']
export type _ZInput<Z extends AnyZ> = Z['$_input']
export type _ZValidator<Z extends AnyZ> = Z['_validator']

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                        ZAny                                                        */
/* ------------------------------------------------------------------------------------------------------------------ */

export type ZAnyDef = ZDef<{ validator: Joi.AnySchema<any> }>

export class ZAny extends Z<any, ZAnyDef> {
  readonly name = ZType.Any
  readonly hint = 'any'

  static create = (): ZAny => new ZAny({ validator: Joi.any() })
}

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                       ZArray                                                       */
/* ------------------------------------------------------------------------------------------------------------------ */

export type ZArrayDef<T extends AnyZ> = ZDef<{ validator: Joi.ArraySchema }, { element: T }>

export class ZArray<T extends AnyZ> extends Z<_ZOutput<T>[], ZArrayDef<T>, _ZInput<T>[]> {
  readonly name = ZType.Array
  readonly hint = `${this._def.element.hint}[]`

  /**
   * Retrieves the schema of the array's element.
   */
  get element(): T {
    return this._def.element
  }

  /**
   * Requires the array to be in ascending order.
   */
  ascending(): this {
    return this._parser.addCheck(v => v.sort({ order: 'ascending' }))
  }
  /**
   * Requires the array to be in descending order.
   */
  descending(): this {
    return this._parser.addCheck(v => v.sort({ order: 'descending' }))
  }

  /**
   * Requires the array to have at least a certain number of elements.
   *
   * @param min - The minimum number of elements in the array.
   */
  min(min: number): this {
    return this._parser.addCheck(v => v.min(min))
  }
  /**
   * Requires the array to have at most a certain number of elements.
   *
   * @param max - The maximum number of elements in the array.
   */
  max(max: number): this {
    return this._parser.addCheck(v => v.max(max))
  }
  /**
   * Requires the array to have an exact number of elements.
   *
   * @param length - The number of elements in the array.
   */
  length(length: number): this {
    return this._parser.addCheck(v => v.length(length))
  }

  /* ---------------------------------------------------------------------------------------------------------------- */

  static create = <T extends AnyZ>(element: T): ZArray<T> =>
    new ZArray({ validator: Joi.array().items(element._validator).required(), element })
}

export type AnyZArray = ZArray<AnyZ>

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                       ZBigInt                                                      */
/* ------------------------------------------------------------------------------------------------------------------ */

export type ZBigIntDef = ZDef<{ validator: Joi.AnySchema<bigint> }>

export class ZBigInt extends Z<bigint, ZBigIntDef> {
  readonly name = ZType.BigInt
  readonly hint = 'bigint'

  static create = (): ZBigInt =>
    new ZBigInt({
      validator: ZValidator.custom(Joi.any(), (value, { OK, FAIL }) =>
        typeof value === 'bigint' ? OK() : FAIL('bigint.base')
      ).required(),
    })
}

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                      ZBoolean                                                      */
/* ------------------------------------------------------------------------------------------------------------------ */

export type ZBooleanDef = ZDef<{ validator: Joi.BooleanSchema }>

export class ZBoolean extends Z<boolean, ZBooleanDef> {
  readonly name = ZType.Boolean
  readonly hint = 'boolean'

  /**
   * Requires the boolean to be `true`.
   */
  truthy(): ZTrue {
    return ZTrue.$_create(this._validator)
  }
  /**
   * Requires the boolean to be `false`.
   */
  falsy(): ZFalse {
    return ZFalse.$_create(this._validator)
  }

  static create = (): ZBoolean => new ZBoolean({ validator: Joi.boolean().required() })
}

/* ------------------------------------------------------ ZTrue ----------------------------------------------------- */

export class ZTrue extends Z<true, ZBooleanDef> {
  readonly name = ZType.True
  readonly hint = 'true'

  /**
   * @internal
   */
  static $_create = (previousValidator: Joi.BooleanSchema): ZTrue =>
    new ZTrue({ validator: previousValidator.strict().valid(true) })

  static create = (): ZTrue => this.$_create(Joi.boolean().required())
}

/* ----------------------------------------------------- ZFalse ----------------------------------------------------- */

export class ZFalse extends Z<false, ZBooleanDef> {
  readonly name = ZType.False
  readonly hint = 'false'

  /**
   * @internal
   */
  static $_create = (previousValidator: Joi.BooleanSchema): ZFalse =>
    new ZFalse({ validator: previousValidator.strict().valid(false) })

  static create = (): ZFalse => this.$_create(Joi.boolean().required())
}

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                        ZDate                                                       */
/* ------------------------------------------------------------------------------------------------------------------ */

const __NOW__ = Symbol('__NOW__')

type ZDateCheckInput = Date | typeof __NOW__

export type ZDateDef = ZDef<{ validator: Joi.DateSchema }>

export class ZDate extends Z<Date, ZDateDef, Date | number | string> {
  readonly name = ZType.Date
  readonly hint = 'Date'

  /**
   * Requires the date to be before a certain date.
   *
   * @param date - The date to compare to.
   */
  before(date: ZDateCheckInput): ZDate {
    return this._parser.addCheck(v => v.max(this._parseCheckInput(date)))
  }
  /**
   * Requires the date to be after a certain date.
   *
   * @param date - The date to compare to.
   */
  after(date: ZDateCheckInput): ZDate {
    return this._parser.addCheck(v => v.min(this._parseCheckInput(date)))
  }
  /**
   * Requires the date to be between two dates.
   *
   * @param dateA - The `after` date to compare to.
   * @param dateB - The `before` date to compare to.
   */
  between(dateA: ZDateCheckInput, dateB: ZDateCheckInput): ZDate {
    return this.after(dateA).before(dateB)
  }

  /* ---------------------------------------------------------------------------------------------------------------- */

  private _parseCheckInput(input: ZDateCheckInput): Date {
    if (input === __NOW__) return new Date()
    else return input
  }

  /* ---------------------------------------------------------------------------------------------------------------- */

  static create = Object.assign((): ZDate => new ZDate({ validator: Joi.date().required() }), { now: __NOW__ } as const)
}

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                       ZEnum                                                       */
/* ------------------------------------------------------------------------------------------------------------------ */

export type ZEnumDef<T extends string> = ZDef<{ validator: Joi.StringSchema }, { values: T[] }>

export class ZEnum<T extends string> extends Z<T, ZEnumDef<T>> {
  readonly name = ZType.Enum
  readonly hint = this._def.values.map(value => `'${value}'`).join(' | ')

  get values(): T[] {
    return this._def.values
  }

  static create: {
    <T extends string>(values: F.Narrow<T>[]): ZEnum<T>
    <T extends string>(...values: F.Narrow<T>[]): ZEnum<T>
  } = <T extends string>(...values: T[] | [T[]]): ZEnum<T> => {
    const _values = (Array.isArray(values[0]) ? values[0] : values) as T[]
    return new ZEnum({
      validator: Joi.string()
        .strict()
        .valid(..._values)
        .required(),
      values: _values,
    })
  }
}

export type AnyZEnum = ZEnum<string>

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                      ZFunction                                                     */
/* ------------------------------------------------------------------------------------------------------------------ */

export type ZFunctionDef<P extends AnyZ[], R extends AnyZ> = ZDef<
  { validator: Joi.FunctionSchema },
  { parameters: ZTuple<P>; returnType: R }
>

export class ZFunction<P extends AnyZ[], R extends AnyZ> extends Z<
  F.Function<ZUtils.MapToZOutput<P>, _ZOutput<R>>,
  ZFunctionDef<P, R>,
  F.Function<ZUtils.MapToZInput<P>, _ZInput<R>>
> {
  readonly name = ZType.Function
  readonly hint = `(${this._def.parameters.elements.map((z, idx) => `args_${idx}: ${z.hint}`).join(', ')}) => ${
    this._def.returnType.hint
  }`

  get parameters(): ZTuple<P> {
    return this._def.parameters
  }
  get returnType(): R {
    return this._def.returnType
  }

  /**
   * Requires the function to have a certain set of parameters.
   *
   * @param parameters - parameters The schemas of the function's parameters.
   */
  arguments<T extends AnyZ[]>(parameters: F.Narrow<T>): ZFunction<T, R> {
    return ZFunction.create(parameters, this._def.returnType)
  }
  /**
   * {@inheritDoc ZFunction#arguments}
   */
  args<T extends AnyZ[]>(parameters: F.Narrow<T>): ZFunction<T, R> {
    return this.arguments(parameters)
  }

  /**
   * Requires the function to return a certain type.
   *
   * @param returnType - The schema of the function's return type.
   */
  returns<T extends AnyZ>(returnType: T): ZFunction<P, T> {
    return ZFunction.create(this._def.parameters.elements as F.Narrow<P>, returnType)
  }

  /* ---------------------------------------------------------------------------------------------------------------- */

  static create: {
    <P extends AnyZ[], R extends AnyZ>(parameters: F.Narrow<P>, returnType: R): ZFunction<P, R>
    (): ZFunction<[], ZUnknown>
  } = <P extends AnyZ[], R extends AnyZ>(
    parameters?: F.Narrow<P>,
    returnType?: R
  ): ZFunction<P, R> | ZFunction<[], ZUnknown> => {
    const validator = Joi.function().required()
    if (parameters && returnType) {
      return new ZFunction({ validator, parameters: ZTuple.create(parameters), returnType: returnType })
    }
    return new ZFunction({ validator, parameters: ZTuple.create([]), returnType: ZUnknown.create() })
  }
}

export type AnyZFunction = ZFunction<AnyZ[], AnyZ>

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                      ZLiteral                                                      */
/* ------------------------------------------------------------------------------------------------------------------ */

export type ZLiteralDef<T extends Primitive> = ZDef<{ validator: Joi.AnySchema }, { value: T }>

export class ZLiteral<T extends Primitive> extends Z<T, ZLiteralDef<T>> {
  readonly name = ZType.Literal
  readonly hint = typeof this._def.value === 'string' ? `'${this._def.value}'` : String(this._def.value)

  get value(): T {
    return this._def.value
  }

  static create = <T extends Primitive>(value: F.Narrow<T>): ZLiteral<T> =>
    new ZLiteral({ validator: Joi.valid(value).required(), value: value as T })
}

export type AnyZLiteral = ZLiteral<Primitive>

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                        ZNaN                                                        */
/* ------------------------------------------------------------------------------------------------------------------ */

export type ZNaNDef = ZDef<{ validator: Joi.AnySchema<number> }>

export class ZNaN extends Z<number, ZNaNDef> {
  readonly name = ZType.NaN
  readonly hint = 'NaN'

  static create = (): ZNaN =>
    new ZNaN({
      validator: ZValidator.custom(Joi.any(), (value, { OK, FAIL }) =>
        Number.isNaN(value) ? OK() : FAIL('nan.base')
      ).required(),
    })
}

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                       ZNever                                                       */
/* ------------------------------------------------------------------------------------------------------------------ */

export type ZNeverDef = ZDef<{ validator: Joi.Schema<never> }>

export class ZNever extends Z<never, ZNeverDef> {
  readonly name = ZType.Never
  readonly hint = 'never'

  static create = (): ZNever => new ZNever({ validator: Joi.forbidden().required() })
}

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                      ZNullable                                                     */
/* ------------------------------------------------------------------------------------------------------------------ */

export type ZNullableDef<T extends AnyZ> = ZDef<{ validator: _ZValidator<T> }, { inner: T }>

export class ZNullable<T extends AnyZ> extends Z<_ZOutput<T> | null, ZNullableDef<T>, _ZInput<T> | null> {
  readonly name = ZType.Nullable
  readonly hint = `${this._def.inner.hint} | null`

  unwrap(): T {
    return this._def.inner
  }

  static create = <T extends AnyZ>(inner: T): ZNullable<T> =>
    new ZNullable({ validator: inner._validator.allow(null), inner })
}

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                      ZNullish                                                      */
/* ------------------------------------------------------------------------------------------------------------------ */

export type ZNullishDef<T extends AnyZ> = ZDef<{ validator: _ZValidator<T> }, { inner: T }>

export class ZNullish<T extends AnyZ> extends Z<
  _ZOutput<T> | null | undefined,
  ZNullishDef<T>,
  _ZInput<T> | null | undefined
> {
  readonly name = ZType.Nullish
  readonly hint = `${this._def.inner.hint} | null | undefined`

  unwrap(): T {
    return this._def.inner
  }

  static create = <T extends AnyZ>(inner: T): ZNullish<T> =>
    new ZNullish({ validator: inner._validator.optional().allow(null), inner })
}

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                        ZNull                                                       */
/* ------------------------------------------------------------------------------------------------------------------ */

export type ZNullDef = ZDef<{ validator: Joi.AnySchema<null> }>

export class ZNull extends Z<null, ZNullDef> {
  readonly name = ZType.Null
  readonly hint = 'null'

  static create = (): ZNull => new ZNull({ validator: Joi.allow(null) })
}

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                       ZNumber                                                      */
/* ------------------------------------------------------------------------------------------------------------------ */

export type ZNumberDef = ZDef<{ validator: Joi.NumberSchema }>

export class ZNumber extends Z<number, ZNumberDef> {
  readonly name = ZType.Number
  readonly hint = 'number'

  /**
   * Requires the number to be an integer (no floating point).
   */
  integer(): this {
    return this._parser.addCheck(v => v.integer())
  }
  /**
   * {@inheritDoc ZNumber#integer}
   */
  int(): this {
    return this.integer()
  }

  /**
   * Requires the number to have a maximum precision, i.e., a maximum number of decimal places.
   *
   * @param precision - The maximum number of decimal places allowed.
   */
  precision(precision: number): this {
    return this._parser.addCheck(v => v.precision(precision))
  }

  /**
   * Requires the number to be positive.
   */
  positive(): this {
    return this._parser.addCheck(v => v.positive())
  }
  /**
   * Requires the number to be less than or equal to 0.
   */
  nonpositive(): this {
    return this.max(0)
  }

  /**
   * Requires the number to be negative.
   */
  negative(): this {
    return this._parser.addCheck(v => v.negative())
  }
  /**
   * Requires the number to be greater than or equal to 0.
   */
  nonnegative(): this {
    return this.min(0)
  }

  /**
   * Requires the number to be greater than or equal to a certain value.
   *
   * @param value - The minimum value allowed.
   */
  min(value: number): this {
    return this._parser.addCheck(v => v.min(value))
  }
  /**
   * {@inheritDoc ZNumber#min}
   */
  gte(value: number): this {
    return this.min(value)
  }

  /**
   * Requires the number to be greater than (but not equal to) a certain value.
   *
   * @param value - The minimum value allowed (exclusive).
   */
  greater(value: number): this {
    return this._parser.addCheck(v => v.greater(value))
  }
  /**
   * {@inheritDoc ZNumber#greater}
   */
  gt(value: number): this {
    return this.greater(value)
  }

  /**
   * Requires the number to be less than or equal to a certain value.
   *
   * @param value - The maximum value allowed.
   */
  max(value: number): this {
    return this._parser.addCheck(v => v.max(value))
  }
  /**
   * {@inheritDoc ZNumber#max}
   */
  lte(value: number): this {
    return this.max(value)
  }

  /**
   * Requires the number to be less than (but not equal to) a certain value.
   *
   * @param value - The maximum value allowed (exclusive).
   */
  less(value: number): this {
    return this._parser.addCheck(v => v.less(value))
  }
  /**
   * {@inheritDoc ZNumber#less}
   */
  lt(value: number): this {
    return this.less(value)
  }

  /**
   * Requires the number to be a multiple of a certain value.
   *
   * @param value - The value of which the number must be a multiple.
   */
  multiple(value: number): this {
    return this._parser.addCheck(v => v.multiple(value))
  }

  /**
   * Requires the number to be a TCP port, i.e., between `0` and `65535`.
   */
  port(): this {
    return this._parser.addCheck(v => v.port())._manifest.set('format', 'port')
  }

  /* ---------------------------------------------------------------------------------------------------------------- */

  static create = (): ZNumber => new ZNumber({ validator: Joi.number().required() })
}

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                       ZObject                                                      */
/* ------------------------------------------------------------------------------------------------------------------ */

export type AnyZObjectShape = Record<string, AnyZ>

export type ZObjectDef<Shape extends AnyZObjectShape> = ZDef<{ validator: Joi.ObjectSchema }, { shape: Shape }>

export class ZObject<Shape extends AnyZObjectShape> extends Z<
  ZUtils.MapToZOutput<Shape>,
  ZObjectDef<Shape>,
  ZUtils.MapToZInput<Shape>
> {
  readonly name = ZType.Object
  readonly hint = ZObjectHelpers.generateHint(this._def.shape)

  get shape(): Shape {
    return this._def.shape
  }

  keyof(): ZEnum<Extract<keyof Shape, string>> {
    return ZEnum.create<Extract<keyof Shape, string>>(
      ...(Object.keys(this._def.shape) as F.Narrow<Extract<keyof Shape, string>>[])
    )
  }

  pick<K extends keyof Shape>(keys: K[]): ZObject<Pick<Shape, K>> {
    return ZObject.create(ZUtils.pick(this._def.shape, keys))
  }

  omit<K extends keyof Shape>(keys: K[]): ZObject<Omit<Shape, K>> {
    return ZObject.create(ZUtils.omit(this._def.shape, keys))
  }

  extend<S extends AnyZObjectShape>(incomingShape: S): ZObject<Shape & S> {
    return new ZObject({
      validator: this._validator.append(ZObjectHelpers.zShapeToJoiShape(incomingShape)),
      shape: ZUtils.merge(this._def.shape, incomingShape),
    })
  }

  merge<S extends AnyZObjectShape>(incomingSchema: ZObject<S>): ZObject<Shape & S> {
    return this.extend(incomingSchema.shape)
  }

  /* ---------------------------------------------------------------------------------------------------------------- */

  static create = <Shape extends AnyZObjectShape>(shape: Shape): ZObject<Shape> =>
    new ZObject({ validator: Joi.object(ZObjectHelpers.zShapeToJoiShape(shape)).required(), shape: shape })
}

export type AnyZObject = ZObject<AnyZObjectShape>

/* ------------------------------------------------------------------------------------------------------------------ */

class ZObjectHelpers {
  static generateHint = <Shape extends AnyZObjectShape>(shape: Shape): string => {
    const _generateHint = (shape: AnyZObjectShape, indentation = 2): string =>
      '{\n' +
      Object.entries(shape)
        .map(
          ([key, z]) =>
            `${' '.repeat(indentation)}${key}${z.isOptional() ? '?' : ''}: ${
              z instanceof ZObject ? _generateHint(z.shape as AnyZObjectShape, indentation + 2) : z.hint
            },`
        )
        .join('\n') +
      `\n${' '.repeat(indentation - 2)}}`
    return _generateHint(shape)
  }

  static zShapeToJoiShape = <Shape extends AnyZObjectShape>(shape: Shape): Joi.SchemaMap =>
    Object.fromEntries(Object.entries(shape).map(([key, z]) => [key, z._validator]))
}

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                      ZOptional                                                     */
/* ------------------------------------------------------------------------------------------------------------------ */

export type ZOptionalDef<T extends AnyZ> = ZDef<{ validator: _ZValidator<T> }, { inner: T }>

export class ZOptional<T extends AnyZ> extends Z<_ZOutput<T> | undefined, ZOptionalDef<T>, _ZInput<T> | undefined> {
  readonly name = ZType.Optional
  readonly hint = `${this._def.inner.hint} | undefined`

  unwrap(): T {
    return this._def.inner
  }

  static create = <T extends AnyZ>(inner: T): ZOptional<T> =>
    new ZOptional({ validator: inner._validator.optional(), inner })
}

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                       ZString                                                      */
/* ------------------------------------------------------------------------------------------------------------------ */

export type ZStringDomainTldsOptions = {
  allow?: string[] | boolean
  deny?: string[]
}

export type ZStringDomainOptions = {
  allowFullyQualified?: boolean
  allowUnicode?: boolean
  minDomainSegments?: number
  tlds?: ZStringDomainTldsOptions | false
}

export type ZStringIpOptions = {
  version?: ZUtils.MaybeArray<'ipv4' | 'ipv6' | 'ipvfuture'>
  cidr?: 'optional' | 'required' | 'forbidden'
}

export type ZStringUriOptions = {
  allowQuerySquareBrackets?: boolean
  allowRelative?: boolean
  domain?: ZStringDomainOptions
  relativeOnly?: boolean
  scheme?: ZUtils.MaybeArray<string | RegExp>
}

export type ZStringEmailOptions = ZStringDomainOptions & {
  ignoreLength?: boolean
  multiple?: boolean
  separator?: ZUtils.MaybeArray<string>
}

export type ZStringUuidOptions = {
  version?: ZUtils.MaybeArray<'uuidv1' | 'uuidv2' | 'uuidv3' | 'uuidv4' | 'uuidv5'>
  separator?: '-' | ':' | boolean
}

export type ZStringPatternOptions = {
  name?: string
  invert?: boolean
}

/* ------------------------------------------------------------------------------------------------------------------ */

export type ZStringDef = ZDef<{ validator: Joi.StringSchema }>

export class ZString extends Z<string, ZStringDef> {
  readonly name = ZType.String
  readonly hint = 'string'

  /**
   * Requires the string to only contain `a-z`, `A-Z`, and `0-9`.
   */
  alphanumeric(): this {
    return this._parser.addCheck(v => v.alphanum())._manifest.set('format', 'alphanumeric')
  }
  /**
   * {@inheritDoc ZString#alphanumeric}
   */
  alphanum(): this {
    return this.alphanumeric()
  }

  /**
   * Requires the string to be a valid `base64` string.
   */
  base64(): this {
    return this._parser.addCheck(v => v.base64())
  }

  /**
   * Requires the string to be a valid hexadecimal string.
   */
  hexadecimal(): this {
    return this._parser.addCheck(v => v.hex())._manifest.set('format', 'hexadecimal')
  }
  /**
   * {@inheritDoc ZString#hexadecimal}
   */
  hex(): this {
    return this.hexadecimal()
  }

  domain(options?: ZStringDomainOptions): this {
    return this._parser.addCheck(v => v.domain(options))
  }

  hostname(): this {
    return this._parser.addCheck(v => v.hostname())
  }

  ip(options?: ZStringIpOptions): this {
    return this._parser.addCheck(v => v.ip(options))
  }

  uri(options?: ZStringUriOptions): this {
    return this._parser.addCheck(v => v.uri(options))._manifest.set('format', 'uri')
  }

  dataUri(): this {
    return this._parser.addCheck(v => v.dataUri())._manifest.set('format', 'data-uri')
  }

  email(options?: ZStringEmailOptions): this {
    return this._parser.addCheck(v => v.email(options))
  }

  /**
   * Requires the string to be a valid UUID/GUID.
   *
   * @param options - Rule options
   */
  uuid(options?: ZStringUuidOptions): this {
    return this._parser.addCheck(v => v.uuid(options))
  }
  /**
   * {@inheritDoc ZString#uuid}
   */
  guid(options?: ZStringUuidOptions): this {
    return this.uuid(options)
  }

  isoDate(): this {
    return this._parser.addCheck(v => v.isoDate())
  }

  isoDuration(): this {
    return this._parser.addCheck(v => v.isoDuration())
  }

  creditCard(): this {
    return this._parser.addCheck(v => v.creditCard())
  }

  min(min: number): this {
    return this._parser.addCheck(v => v.min(min))
  }

  max(max: number): this {
    return this._parser.addCheck(v => v.max(max))
  }

  length(length: number): this {
    return this._parser.addCheck(v => v.length(length))
  }

  /**
   * Requires the string to match a certain pattern.
   *
   * @param regex - The regular expression against which to match the string.
   * @param options - Rule options
   */
  pattern(regex: RegExp, options?: ZStringPatternOptions): this {
    return this._parser.addCheck(v => v.pattern(regex, options))
  }
  /**
   * {@inheritDoc ZString#pattern}
   */
  regex(regex: RegExp, options?: ZStringPatternOptions): this {
    return this.pattern(regex, options)
  }

  /* -------------------------------------------------- Transforms -------------------------------------------------- */

  lowercase(): this {
    return this._parser.addCheck(v => v.lowercase())
  }

  uppercase(): this {
    return this._parser.addCheck(v => v.uppercase())
  }

  insensitive(): this {
    return this._parser.addCheck(v => v.insensitive())
  }

  trim(): this {
    return this._parser.addCheck(v => v.trim())
  }

  replace(pattern: string | RegExp, replacement: string): this {
    return this._parser.addCheck(v => v.replace(pattern, replacement))
  }

  /* ---------------------------------------------------------------------------------------------------------------- */

  static create = (): ZString => new ZString({ validator: Joi.string().required() })
}

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                       ZTuple                                                       */
/* ------------------------------------------------------------------------------------------------------------------ */

export type ZTupleDef<T extends AnyZ[]> = ZDef<{ validator: Joi.ArraySchema }, { elements: T }>

export class ZTuple<T extends AnyZ[]> extends Z<ZUtils.MapToZOutput<T>, ZTupleDef<T>, ZUtils.MapToZInput<T>> {
  readonly name = ZType.Tuple
  readonly hint = `[${this._def.elements.map(element => element.hint).join(', ')}]`

  /**
   * Retrieves the schemas of the tuple's elements.
   */
  get elements(): T {
    return this._def.elements
  }

  static create = <T extends AnyZ[]>(elements: F.Narrow<T>): ZTuple<T> =>
    new ZTuple({
      validator: Joi.array()
        .items(...elements.map(v => v._validator))
        .required(),
      elements: elements as T,
    })
}

export type AnyZTuple = ZTuple<AnyZ[]>

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                     ZUndefined                                                     */
/* ------------------------------------------------------------------------------------------------------------------ */

export type ZUndefinedDef = ZDef<{ validator: Joi.AnySchema<undefined> }>

export class ZUndefined extends Z<undefined, ZUndefinedDef> {
  readonly name = ZType.Undefined
  readonly hint = 'undefined'

  static create = (): ZUndefined => new ZUndefined({ validator: Joi.optional() })
}

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                       ZUnion                                                       */
/* ------------------------------------------------------------------------------------------------------------------ */

export type ZUnionDef<T extends AnyZ[]> = ZDef<{ validator: Joi.AlternativesSchema }, { options: T }>

export class ZUnion<T extends AnyZ[]> extends Z<_ZOutput<T[number]>, ZUnionDef<T>, _ZInput<T[number]>> {
  readonly name = ZType.Union
  readonly hint = this._def.options.map(option => option.hint).join(' | ')

  get options(): T {
    return this._def.options
  }

  static create = <T extends AnyZ[]>(...options: F.Narrow<T>): ZUnion<T> => {
    return new ZUnion({
      validator: Joi.alternatives(options.map(option => option._validator)).required(),
      options: options as T,
    })
  }
}

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                      ZUnknown                                                      */
/* ------------------------------------------------------------------------------------------------------------------ */

export type ZUnknownDef = ZDef<{ validator: Joi.AnySchema<unknown> }>

export class ZUnknown extends Z<unknown, ZUnknownDef> {
  readonly name = ZType.Unknown
  readonly hint = 'unknown'

  static create = (): ZUnknown => new ZUnknown({ validator: Joi.any() })
}

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                        ZVoid                                                       */
/* ------------------------------------------------------------------------------------------------------------------ */

export type ZVoidDef = ZDef<{ validator: Joi.Schema<void> }>

export class ZVoid extends Z<void, ZVoidDef> {
  readonly name = ZType.Void
  readonly hint = 'void'

  static create = (): ZVoid => new ZVoid({ validator: Joi.any() })
}

/* ------------------------------------------------------------------------------------------------------------------ */

export type TypeOf<Z extends AnyZ> = ZUtils.Simplify<_ZOutput<Z>>
