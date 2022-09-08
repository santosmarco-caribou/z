import type { OpenAPIV3 } from 'openapi-types'
import type { A, F, U } from 'ts-toolbelt'
import type { Primitive } from 'type-fest'

import type { AnyZDef, ZDef } from '../def'
import { type ManifestBasicInfoWithValue, type ZManifestObject, ZManifest } from '../manifest/manifest'
import { ZOpenApi } from '../manifest/openapi'
import { ZType } from '../type'
import { ZObjectUtils, ZUtils } from '../utils'
import { type ParseOptions, type ParseResult, ZCheckOptions, ZParser } from '../validation/parser'
import {
  type AnyZSchema,
  type ZAlternativesSchema,
  type ZAnySchema,
  type ZArraySchema,
  type ZBooleanSchema,
  type ZDateSchema,
  type ZFunctionSchema,
  type ZNumberSchema,
  type ZObjectSchema,
  type ZOnlySchema,
  type ZStringOnlySchema,
  type ZStringSchema,
  type ZSymbolSchema,
  type ZUndefinedSchema,
  ZValidator,
} from '../validation/validator'

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
    return this._manifest.copyAndReturn(ZOptional.create(this))
  }

  nullable(): ZNullable<this> {
    return this._manifest.copyAndReturn(ZNullable.create(this))
  }

  nullish(): ZNullish<this> {
    return this._manifest.copyAndReturn(ZNullish.create(this))
  }

  array(): ZArray<this> {
    return this._manifest.copyAndReturn(ZArray.create(this))
  }

  or<T extends AnyZ>(alternative: T): ZUnion<[this, T]> {
    return this._manifest.copyAndReturn(ZUnion.create(this, alternative))
  }

  and<T extends AnyZ>(incoming: T): ZIntersection<[this, T]> {
    return this._manifest.copyAndReturn(ZIntersection.create(this, incoming))
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

  /**
   * Annotates the schema with a title.
   *
   * @param title - The schema's title.
   */
  title(title: string): this {
    return this._manifest.setKey('title', title)
  }

  /**
   * Annotates the schema with a brief summary.
   *
   * @remarks
   * The summary should be short and concise. For longer explanations, see {@link Z#description}.
   *
   * @param summary - The schema's summary.
   *
   * @example
   * ```ts
   * z.any().summary('A brief summary')
   * ```
   */
  summary(summary: string): this {
    return this._manifest.setKey('summary', summary)
  }

  /**
   * Annotates the schema with a description.
   *
   * @remarks
   * The description should be a longer and more descriptive explanation of the schema.
   * For shorter and more concise ones, prefer {@link Z#summary} instead.
   *
   * @param description - The schema's description.
   *
   * @example
   * ```ts
   * z.any().description('A long, detailed description of the schema')
   * ```
   */
  description(description: string): this {
    return this._manifest.setKey('description', description)
  }

  default(value: Output | ManifestBasicInfoWithValue<Output>): this {
    return this._manifest.setKey('default', ZUtils.hasProp(value, 'value') ? value : { value: value })
  }

  /**
   * Adds one or more examples to the schema's manifest.
   */
  examples(...examples: Array<Output | ManifestBasicInfoWithValue<Output>>): this {
    return this._manifest.setKey(
      'examples',
      examples.map(example => (ZUtils.hasProp(example, 'value') ? example : { value: example }))
    )
  }
  /**
   * Adds one example to the schema's manifest.
   */
  example(example: Output | ManifestBasicInfoWithValue<Output>): this {
    return this.examples(example)
  }

  /**
   * Adds one or more tags to the schema's manifest.
   */
  tags(...tags: (string | ManifestBasicInfoWithValue<string>)[]): this {
    return this._manifest.setKey(
      'tags',
      tags.map(tag => (typeof tag === 'string' ? { value: tag } : tag))
    )
  }
  /**
   * Adds one tag to the schema's manifest.
   */
  tag(tag: string | ManifestBasicInfoWithValue<string>): this {
    return this.tags(tag)
  }

  /**
   * Adds one or more notes to the schema's manifest.
   */
  notes(...notes: (string | ManifestBasicInfoWithValue<string>)[]): this {
    return this._manifest.setKey(
      'notes',
      notes.map(note => (typeof note === 'string' ? { value: note } : note))
    )
  }
  /**
   * Adds one note to the schema's manifest.
   */
  note(note: string | ManifestBasicInfoWithValue<string>): this {
    return this.notes(note)
  }

  /**
   * Annotates the schema with a unit.
   */
  unit(unit: string): this {
    return this._manifest.setKey('unit', unit)
  }

  /**
   * Marks the schema as deprecated.
   */
  deprecated(deprecated: boolean): this {
    return this._manifest.setKey('deprecated', deprecated)
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

export type ZAnyDef = ZDef<{ validator: ZAnySchema }>

export class ZAny extends Z<any, ZAnyDef> {
  readonly name = ZType.Any
  readonly hint = 'any'

  static create = (): ZAny => new ZAny({ validator: ZValidator.any() })
}

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                       ZArray                                                       */
/* ------------------------------------------------------------------------------------------------------------------ */

export type ZArrayDef<T extends AnyZ> = ZDef<{ validator: ZArraySchema }, { element: T }>

export class ZArray<T extends AnyZ, Arr extends T[] = T[]> extends Z<
  ZUtils.MapToZOutput<Arr>,
  ZArrayDef<T>,
  ZUtils.MapToZInput<Arr>
> {
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

  nonempty(): ZArray<T, [T, ...T[]]> {
    return ZArray.create<T, [T, ...T[]]>(this._def.element)
  }

  /* ---------------------------------------------------------------------------------------------------------------- */

  static create = <T extends AnyZ, Arr extends T[] = T[]>(element: T): ZArray<T, Arr> =>
    new ZArray<T, Arr>({ validator: ZValidator.array(element._validator), element })
}

export type AnyZArray = ZArray<AnyZ, AnyZ[]>

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                       ZBigInt                                                      */
/* ------------------------------------------------------------------------------------------------------------------ */

export type ZBigIntDef = ZDef<{ validator: ZAnySchema }>

export class ZBigInt extends Z<bigint, ZBigIntDef> {
  readonly name = ZType.BigInt
  readonly hint = 'bigint'

  static create = (): ZBigInt =>
    new ZBigInt({
      validator: ZValidator.custom(ZValidator.any(), (value, { OK, FAIL }) =>
        typeof value === 'bigint' ? OK(value) : FAIL('bigint.base')
      ),
    })
}

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                      ZBoolean                                                      */
/* ------------------------------------------------------------------------------------------------------------------ */

export type ZBooleanDef = ZDef<{ validator: ZBooleanSchema }>

export class ZBoolean extends Z<boolean, ZBooleanDef> {
  readonly name = ZType.Boolean
  readonly hint = 'boolean'

  /**
   * Requires the boolean to be `true`.
   */
  true(): ZTrue {
    return ZTrue.$_create(this)
  }
  /**
   * Requires the boolean to be `false`.
   */
  false(): ZFalse {
    return ZFalse.$_create(this)
  }

  /**
   * Requires the value to be truthy.
   */
  truthy(): ZTruthy {
    return ZTruthy.$_create(this)
  }
  /**
   * Requires the value to be falsy.
   */
  falsy(): ZFalsy {
    return ZFalsy.$_create(this)
  }

  static create = (): ZBoolean => new ZBoolean({ validator: ZValidator.boolean() })
}

/* ------------------------------------------------------ ZTrue ----------------------------------------------------- */

export class ZTrue extends Z<true, ZBooleanDef> {
  readonly name = ZType.True
  readonly hint = 'true'

  /**
   * @internal
   */
  static $_create = (parentZ: ZBoolean): ZTrue =>
    new ZTrue({ validator: parentZ._validator.valid(true).prefs({ abortEarly: true }) })

  static create = (): ZTrue => this.$_create(ZBoolean.create())
}

/* ----------------------------------------------------- ZFalse ----------------------------------------------------- */

export class ZFalse extends Z<false, ZBooleanDef> {
  readonly name = ZType.False
  readonly hint = 'false'

  /**
   * @internal
   */
  static $_create = (parentZ: ZBoolean): ZFalse =>
    new ZFalse({ validator: parentZ._validator.valid(false).prefs({ abortEarly: true }) })

  static create = (): ZFalse => this.$_create(ZBoolean.create())
}

/* ----------------------------------------------------- ZTruthy ---------------------------------------------------- */

export type ZTruthyDef = ZDef<{ validator: AnyZSchema }>

export class ZTruthy extends Z<true, ZTruthyDef> {
  readonly name = ZType.Truthy
  readonly hint = 'Truthy'

  /**
   * @internal
   */
  static $_create = (parentZ: AnyZ): ZTruthy =>
    new ZTruthy({
      validator: ZValidator.custom(parentZ._validator, (value, { OK, FAIL }) =>
        value ? OK(true) : FAIL('truthy.base')
      ),
    })

  static create = (): ZTruthy => this.$_create(ZAny.create())
}

/* ----------------------------------------------------- ZFalsy ----------------------------------------------------- */

export type Falsy = false | '' | 0 | null | undefined | void

export type ZFalsyDef = ZDef<{ validator: AnyZSchema }>

export class ZFalsy extends Z<Falsy, ZFalsyDef> {
  readonly name = ZType.Falsy
  readonly hint = 'Falsy'

  /**
   * @internal
   */
  static $_create = (parentZ: AnyZ): ZFalsy =>
    new ZFalsy({
      validator: ZValidator.custom(parentZ._validator.optional(), (value, { OK, FAIL }) =>
        value ? FAIL('falsy.base') : OK(value)
      ),
    })

  static create = (): ZFalsy => this.$_create(ZAny.create())
}

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                        ZDate                                                       */
/* ------------------------------------------------------------------------------------------------------------------ */

const __NOW__ = Symbol('__NOW__')

type ZDateCheckInput = Date | typeof __NOW__

export type ZDateDef = ZDef<{ validator: ZDateSchema }>

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

  static create = Object.assign((): ZDate => new ZDate({ validator: ZValidator.date() }), { now: __NOW__ } as const)
}

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                       ZEnum                                                       */
/* ------------------------------------------------------------------------------------------------------------------ */

export type ZEnumDef<T extends string> = ZDef<{ validator: ZStringOnlySchema }, { values: T[] }>

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
    return new ZEnum({ validator: ZValidator.string.only(..._values), values: _values })
  }
}

export type AnyZEnum = ZEnum<string>

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                      ZFunction                                                     */
/* ------------------------------------------------------------------------------------------------------------------ */

export type ZFunctionDef<P extends AnyZ[], R extends AnyZ> = ZDef<
  { validator: ZFunctionSchema },
  { parameters: ZTuple<P>; returnType: R }
>

export class ZFunction<P extends AnyZ[], R extends AnyZ> extends Z<
  ZUtils.Function<ZUtils.MapToZInput<P>, _ZOutput<R>>,
  ZFunctionDef<P, R>,
  ZUtils.Function<ZUtils.MapToZOutput<P>, _ZInput<R>>
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
    return new ZFunction({ ...this._def, validator: this._validator, parameters: ZTuple.create(parameters) })
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
    return new ZFunction({ ...this._def, validator: this._validator, returnType })
  }

  implement(fn: _ZOutput<this>): (...args: ZUtils.MapToZInput<P>) => _ZOutput<R> {
    const validatedFn = this.parse(fn)
    return validatedFn
  }

  /* ---------------------------------------------------------------------------------------------------------------- */

  static create: {
    <P extends AnyZ[], R extends AnyZ>(parameters: F.Narrow<P>, returnType: R): ZFunction<P, R>
    (): ZFunction<[], ZUnknown>
  } = <P extends AnyZ[], R extends AnyZ>(
    parameters?: F.Narrow<P>,
    returnType?: R
  ): ZFunction<P, R> | ZFunction<[], ZUnknown> => {
    const validator = ZValidator.function()
    if (parameters && returnType) {
      return new ZFunction({ validator, parameters: ZTuple.create(parameters), returnType: returnType })
    }
    return new ZFunction({ validator, parameters: ZTuple.create([]), returnType: ZUnknown.create() })
  }
}

export type AnyZFunction = ZFunction<AnyZ[], AnyZ>

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                    ZIntersection                                                   */
/* ------------------------------------------------------------------------------------------------------------------ */

export type ZIntersectionDef<T extends AnyZ[]> = ZDef<{ validator: ZAlternativesSchema }, { components: T }>

export class ZIntersection<T extends AnyZ[]> extends Z<
  U.IntersectOf<_ZOutput<T[number]>>,
  ZIntersectionDef<T>,
  U.IntersectOf<_ZInput<T[number]>>
> {
  readonly name = ZType.Intersection
  readonly hint = this._def.components.map(z => z.hint).join(' & ')

  get components(): T {
    return this._def.components
  }

  static create = <T extends AnyZ[]>(...components: F.Narrow<T>): ZIntersection<T> => {
    return new ZIntersection({
      validator: ZValidator.alternatives(components.map(component => component._validator)).match('all'),
      components: components as T,
    })
  }
}

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                      ZLiteral                                                      */
/* ------------------------------------------------------------------------------------------------------------------ */

export type ZLiteralDef<T extends Primitive> = ZDef<{ validator: ZOnlySchema<T> }, { value: T }>

export class ZLiteral<T extends Primitive> extends Z<T, ZLiteralDef<T>> {
  readonly name = ZType.Literal
  readonly hint = typeof this._def.value === 'string' ? `'${this._def.value}'` : String(this._def.value)

  get value(): T {
    return this._def.value
  }

  static create = <T extends Primitive>(value: F.Narrow<T>): ZLiteral<T> =>
    new ZLiteral({ validator: ZValidator.only(value), value: value as T })
}

export type AnyZLiteral = ZLiteral<Primitive>

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                        ZNaN                                                        */
/* ------------------------------------------------------------------------------------------------------------------ */

export type ZNaNDef = ZDef<{ validator: ZAnySchema }>

export class ZNaN extends Z<number, ZNaNDef> {
  readonly name = ZType.NaN
  readonly hint = 'NaN'

  static create = (): ZNaN =>
    new ZNaN({
      validator: ZValidator.custom(ZValidator.any(), (value, { OK, FAIL }) =>
        Number.isNaN(value) ? OK(value) : FAIL('nan.base')
      ),
    })
}

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                       ZNever                                                       */
/* ------------------------------------------------------------------------------------------------------------------ */

export type ZNeverDef = ZDef<{ validator: ZAnySchema }>

export class ZNever extends Z<never, ZNeverDef> {
  readonly name = ZType.Never
  readonly hint = 'never'

  static create = (): ZNever =>
    new ZNever({ validator: ZValidator.custom(ZValidator.any(), (_, { FAIL }) => FAIL('any.unknown')) })
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

export type ZNullDef = ZDef<{ validator: ZOnlySchema<null> }>

export class ZNull extends Z<null, ZNullDef> {
  readonly name = ZType.Null
  readonly hint = 'null'

  static create = (): ZNull => new ZNull({ validator: ZValidator.only(null) })
}

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                       ZNumber                                                      */
/* ------------------------------------------------------------------------------------------------------------------ */

export type ZNumberDef = ZDef<{ validator: ZNumberSchema }>

export class ZNumber extends Z<number, ZNumberDef> {
  readonly name = ZType.Number
  readonly hint = 'number'

  /**
   * Requires the number to be an integer (no floating point).
   */
  integer(options?: ZCheckOptions<'number.integer'>): this {
    return this._parser.addCheck('number.integer', v => v.integer(), options)
  }
  /**
   * {@inheritDoc ZNumber#integer}
   */
  int(options?: ZCheckOptions<'number.integer'>): this {
    return this.integer(options)
  }

  /**
   * Requires the number to have a maximum precision, i.e., a maximum number of decimal places.
   *
   * @param precision - The maximum number of decimal places allowed.
   */
  precision(precision: number, options?: ZCheckOptions<'number.precision'>): this {
    return this._parser.addCheck('number.precision', v => v.precision(precision), options)
  }

  /**
   * Requires the number to be positive.
   */
  positive(options?: ZCheckOptions<'number.positive'>): this {
    return this._parser.addCheck('number.positive', v => v.positive(), options)
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
  negative(options?: ZCheckOptions<'number.negative'>): this {
    return this._parser.addCheck('number.negative', v => v.negative(), options)
  }
  /**
   * Requires the number to be greater than or equal to 0.
   */
  nonnegative(options?: ZCheckOptions<'number.min'>): this {
    return this.min(0, options)
  }

  /**
   * Requires the number to be greater than or equal to a certain value.
   *
   * @param value - The minimum value allowed.
   */
  min(value: number, options?: ZCheckOptions<'number.min'>): this {
    return this._parser.addCheck('number.min', v => v.min(value), options)
  }
  /**
   * {@inheritDoc ZNumber#min}
   */
  gte(value: number, options?: ZCheckOptions<'number.min'>): this {
    return this.min(value, options)
  }

  /**
   * Requires the number to be greater than (but not equal to) a certain value.
   *
   * @param value - The minimum value allowed (exclusive).
   */
  greater(value: number, options?: ZCheckOptions<'number.greater'>): this {
    return this._parser.addCheck('number.greater', v => v.greater(value), options)
  }
  /**
   * {@inheritDoc ZNumber#greater}
   */
  gt(value: number, options?: ZCheckOptions<'number.greater'>): this {
    return this.greater(value, options)
  }

  /**
   * Requires the number to be less than or equal to a certain value.
   *
   * @param value - The maximum value allowed.
   */
  max(value: number, options?: ZCheckOptions<'number.max'>): this {
    return this._parser.addCheck('number.max', v => v.max(value), options)
  }
  /**
   * {@inheritDoc ZNumber#max}
   */
  lte(value: number, options?: ZCheckOptions<'number.max'>): this {
    return this.max(value, options)
  }

  /**
   * Requires the number to be less than (but not equal to) a certain value.
   *
   * @param value - The maximum value allowed (exclusive).
   */
  less(value: number, options?: ZCheckOptions<'number.less'>): this {
    return this._parser.addCheck('number.less', v => v.less(value), options)
  }
  /**
   * {@inheritDoc ZNumber#less}
   */
  lt(value: number, options?: ZCheckOptions<'number.less'>): this {
    return this.less(value, options)
  }

  /**
   * Requires the number to be a multiple of a certain value.
   *
   * @param value - The value of which the number must be a multiple.
   */
  multiple(value: number, options?: ZCheckOptions<'number.multiple'>): this {
    return this._parser.addCheck('number.multiple', v => v.multiple(value), options)
  }

  /**
   * Requires the number to be a TCP port, i.e., between `0` and `65535`.
   */
  port(options?: ZCheckOptions<'number.port'>): this {
    this._parser.addCheck('number.port', v => v.port(), options)
    this._manifest.setKey('format', 'port')
    return this
  }

  /* ---------------------------------------------------------------------------------------------------------------- */

  static create = (): ZNumber => new ZNumber({ validator: ZValidator.number() })
}

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                       ZObject                                                      */
/* ------------------------------------------------------------------------------------------------------------------ */

export type AnyZObjectShape = Record<string, AnyZ>

export type ZObjectOptions = { mode: 'passthrough' | 'strip' | 'strict' }
const DEFAULT_Z_OBJECT_OPTIONS: ZObjectOptions = { mode: 'strip' }

export type ZObjectDef<Shape extends AnyZObjectShape> = ZDef<
  { validator: ZObjectSchema },
  { shape: Shape; options: ZObjectOptions; catchall: AnyZ }
>

export class ZObject<Shape extends AnyZObjectShape> extends Z<
  ZUtils.WithQuestionMarks<ZUtils.MapToZOutput<Shape>>,
  ZObjectDef<Shape>,
  ZUtils.WithQuestionMarks<ZUtils.MapToZInput<Shape>>
> {
  readonly name = ZType.Object
  readonly hint = ZUtils.generateZObjectHint(this._def.shape)

  get shape(): Shape {
    return this._def.shape
  }

  keyof(): ZEnum<Extract<keyof Shape, string>> {
    return ZEnum.create<Extract<keyof Shape, string>>(
      ...(Object.keys(this._def.shape) as F.Narrow<Extract<keyof Shape, string>>[])
    )
  }

  pick<K extends keyof Shape>(keys: K[]): ZObject<Pick<Shape, K>> {
    return this._manifest.copyAndReturn(
      ZObject.$_create(ZUtils.pick(this._def.shape, keys), this._def.options, this._def.catchall)
    )
  }

  omit<K extends keyof Shape>(keys: K[]): ZObject<Omit<Shape, K>> {
    return this._manifest.copyAndReturn(
      ZObject.$_create(ZUtils.omit(this._def.shape, keys), this._def.options, this._def.catchall)
    )
  }

  extend<S extends AnyZObjectShape>(incomingShape: S): ZObject<Shape & S> {
    return this._manifest.copyAndReturn(
      ZObject.$_create(ZUtils.merge(this._def.shape, incomingShape), this._def.options, this._def.catchall)
    )
  }

  merge<S extends AnyZObjectShape>(incomingSchema: ZObject<S>): ZObject<Shape & S> {
    return this.extend(incomingSchema.shape)
  }

  /**
   * Inspired by the built-in TypeScript utility type {@link https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype | `Partial`},
   * the `.partial()` method makes all properties optional.
   *
   * @example Starting from this object:
   * ```ts
   * const user = z.object({
   *   email: z.string()
   *   username: z.string(),
   * })
   * // { email: string; username: string }
   * ```
   *
   * We can create a partial version:
   *
   * ```ts
   * const partialUser = user.partial()
   * // { email?: string | undefined; username?: string | undefined }
   * ```
   */
  partial(): ZObject<ZObjectUtils.ToPartialZObjectShape<Shape>> {
    return this._manifest.copyAndReturn(
      ZObject.$_create(
        Object.fromEntries(
          Object.entries(this._def.shape).map(([key, z]) => [key, z.optional()])
        ) as ZObjectUtils.ToPartialZObjectShape<Shape>,
        this._def.options,
        this._def.catchall
      )
    )
  }

  /**
   * The `.partial()` method is shallow—it only applies one level deep. There is also a "deep" version:
   *
   * @example
   * ```ts
   * const user = z.object({
   *   username: z.string(),
   *   location: z.object({
   *     latitude: z.number(),
   *     longitude: z.number(),
   *   }),
   *   strings: z.array(z.object({ value: z.string() })),
   * })
   *
   * const deepPartialUser = user.deepPartial()
   * ```
   *
   * The result on type inference is:
   *
   * ```ts
   * {
   *   username?: string | undefined,
   *   location?: {
   *     latitude?: number | undefined;
   *     longitude?: number | undefined;
   *   } | undefined,
   *   strings?: { value?: string}[]
   * }
   * ```
   */
  deepPartial(): ZObject<ZObjectUtils.ToPartialZObjectShape<Shape, 'deep'>> {
    return this._manifest.copyAndReturn(
      ZObject.$_create(
        Object.fromEntries(
          Object.entries(this._def.shape).map(([key, z]) => [
            key,
            z instanceof ZObject ? z.deepPartial().optional() : z.optional(),
          ])
        ) as ZObjectUtils.ToPartialZObjectShape<Shape, 'deep'>,
        this._def.options,
        this._def.catchall
      )
    )
  }

  /**
   * By default `ZObject`s strip out unrecognized keys during parsing.
   *
   * @example
   * ```ts
   * const person = z.object({
   *   name: z.string(),
   * })
   *
   * person.parse({
   *   name: "Bob Dylan",
   *   extraKey: 61,
   * })
   * // => { name: "Bob Dylan" }
   * // `extraKey` has been stripped
   * ```
   *
   * Instead, if you want to pass through unknown keys, use `.passthrough()`.
   *
   * @example
   * ```ts
   * person.passthrough().parse({
   *   name: "Bob Dylan",
   *   extraKey: 61,
   * })
   * // => { name: "Bob Dylan", extraKey: 61 }
   * ```
   */
  passthrough(): this {
    this._def.options = { mode: 'passthrough' }
    return this
  }

  /**
   * By default `ZObject`s strip out unrecognized keys during parsing. You can _disallow_ unknown keys with `.strict()`.
   * If there are any unknown keys in the input, `Z` will throw an error.
   *
   * @example
   * ```ts
   * const person = z
   *   .object({
   *     name: z.string(),
   *   })
   *   .strict()
   *
   * person.parse({
   *   name: "Bob Dylan",
   *   extraKey: 61,
   * })
   * // => throws ZError
   * ```
   */
  strict(): this {
    this._def.options = { mode: 'strict' }
    return this
  }

  /**
   * You can use the `.strip()` method to reset an `ZObject` to the default behavior (stripping unrecognized keys).
   */
  strip(): this {
    this._def.options = { mode: 'strip' }
    return this
  }

  /**
   * You can pass a "catchall" `ZType` into a `ZObject`. All unknown keys will be validated against it.
   *
   * @example
   * ```ts
   * const person = z
   *   .object({
   *     name: z.string(),
   *   })
   *   .catchall(z.number())
   *
   * person.parse({
   *   name: "Bob Dylan",
   *   validExtraKey: 61, // works fine
   * })
   *
   * person.parse({
   *   name: "Bob Dylan",
   *   validExtraKey: false, // fails
   * })
   * // => throws ZError
   * ```
   *
   * _Note:_ Using `.catchall()` obviates `.passthrough()`, `.strip()`, and `.strict()`—All keys are now considered "known".
   */
  catchall(z: AnyZ): this {
    this._def.catchall = z
    return this
  }

  /* ---------------------------------------------------------------------------------------------------------------- */

  /**
   * @internal
   */
  static $_create = <Shape extends AnyZObjectShape>(
    shape: Shape,
    options: ZObjectOptions,
    catchall: AnyZ
  ): ZObject<Shape> => {
    if (catchall) options.mode = 'passthrough'
    const baseValidator = ZValidator.object(ZObjectUtils.zShapeToJoiSchema(shape)).preferences(
      {
        passthrough: { allowUnknown: true, stripUnknown: false },
        strict: { allowUnknown: false, stripUnknown: false },
        strip: { allowUnknown: true, stripUnknown: true },
      }[options.mode]
    )
    return new ZObject({
      validator: catchall ? baseValidator.pattern(/./, catchall._validator) : baseValidator,
      shape: shape,
      options,
      catchall,
    })
  }

  static create = <Shape extends AnyZObjectShape>(shape: Shape): ZObject<Shape> =>
    this.$_create(shape, DEFAULT_Z_OBJECT_OPTIONS, ZAny.create())
}

export type AnyZObject = ZObject<AnyZObjectShape>

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                      ZOptional                                                     */
/* ------------------------------------------------------------------------------------------------------------------ */

export type ZOptionalDef<T extends AnyZ> = ZDef<{ validator: _ZValidator<T> }, { inner: T }>

export class ZOptional<T extends AnyZ> extends Z<_ZOutput<T> | undefined, ZOptionalDef<T>, _ZInput<T> | undefined> {
  readonly name = ZType.Optional
  readonly hint = ZUtils.unionizeHints(this._def.inner.hint, 'undefined')

  unwrap(): T {
    return this._def.inner
  }

  static create = <T extends AnyZ>(inner: T): ZOptional<T> =>
    new ZOptional({
      validator:
        inner._validator.$_getFlag('presence') === 'forbidden' ? inner._validator : inner._validator.optional(),
      inner,
    })
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

export type ZStringDef = ZDef<{ validator: ZStringSchema }>

export class ZString extends Z<string, ZStringDef> {
  readonly name = ZType.String
  readonly hint = 'string'

  /**
   * Requires the string to only contain `a-z`, `A-Z`, and `0-9`.
   */
  alphanumeric(): this {
    this._parser.addCheck(v => v.alphanum())
    this._manifest.setKey('format', 'alphanumeric')
    return this
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
    this._parser.addCheck(v => v.hex())
    this._manifest.setKey('format', 'hexadecimal')
    return this
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
    this._parser.addCheck(v => v.uri(options))
    this._manifest.setKey('format', 'uri')
    return this
  }

  dataUri(): this {
    this._parser.addCheck(v => v.dataUri())
    this._manifest.setKey('format', 'data-uri')
    return this
  }

  email(options?: ZStringEmailOptions): this {
    this._parser.addCheck(v => v.email(options))
    this._manifest.setKey('format', 'email')
    return this
  }

  /**
   * Requires the string to be a valid UUID/GUID.
   *
   * @param options - Rule options
   */
  uuid(options?: ZStringUuidOptions): this {
    this._parser.addCheck(v => v.uuid(options))
    this._manifest.setKey('format', 'uuid')
    return this
  }
  /**
   * {@inheritDoc ZString#uuid}
   */
  guid(options?: ZStringUuidOptions): this {
    return this.uuid(options)
  }

  isoDate(): this {
    this._parser.addCheck(v => v.isoDate())
    this._manifest.setKey('format', 'date-time')
    return this
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

  static create = (): ZString => new ZString({ validator: ZValidator.string() })
}

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                       ZSymbol                                                      */
/* ------------------------------------------------------------------------------------------------------------------ */

export type ZSymbolDef = ZDef<{ validator: ZSymbolSchema }>

export class ZSymbol extends Z<symbol, ZSymbolDef> {
  readonly name = ZType.Symbol
  readonly hint = 'symbol'

  unique<S extends symbol>(symbol: S): ZUniqueSymbol<S> {
    return ZUniqueSymbol.$_create(this, symbol)
  }

  static create = (): ZSymbol => new ZSymbol({ validator: ZValidator.symbol() })
}

/* -------------------------------------------------- ZUniqueSymbol ------------------------------------------------- */

export type ZUniqueSymbolDef<S extends symbol> = ZDef<{ validator: ZSymbolSchema }, { symbol: S }>

export class ZUniqueSymbol<S extends symbol> extends Z<S, ZUniqueSymbolDef<S>> {
  readonly name = ZType.UniqueSymbol
  readonly hint = this._def.symbol.toString()

  get symbol(): S {
    return this._def.symbol
  }

  /**
   * @internal
   */
  static $_create = <S extends symbol>(parentZ: ZSymbol, symbol: S): ZUniqueSymbol<S> => {
    if (!symbol.description) throw new Error('The provided symbol must have a description')
    return new ZUniqueSymbol<S>({
      validator: parentZ._validator.map({ [symbol.description]: symbol }),
      symbol,
    })
  }

  static create = <S extends symbol>(symbol: S): ZUniqueSymbol<S> => this.$_create(ZSymbol.create(), symbol)
}

export type AnyZUniqueSymbol = ZUniqueSymbol<symbol>

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                       ZTuple                                                       */
/* ------------------------------------------------------------------------------------------------------------------ */

export type ZTupleDef<T extends AnyZ[]> = ZDef<{ validator: ZArraySchema }, { elements: T }>

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
    new ZTuple({ validator: ZValidator.array(...elements.map(v => v._validator)), elements: elements as T })
}

export type AnyZTuple = ZTuple<AnyZ[]>

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                     ZUndefined                                                     */
/* ------------------------------------------------------------------------------------------------------------------ */

export type ZUndefinedDef = ZDef<{ validator: ZUndefinedSchema }>

export class ZUndefined extends Z<undefined, ZUndefinedDef> {
  readonly name = ZType.Undefined
  readonly hint = 'undefined'

  static create = (): ZUndefined => new ZUndefined({ validator: ZValidator.undefined() })
}

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                       ZUnion                                                       */
/* ------------------------------------------------------------------------------------------------------------------ */

export type ZUnionDef<T extends AnyZ[]> = ZDef<{ validator: ZAlternativesSchema }, { options: T }>

export class ZUnion<T extends AnyZ[]> extends Z<_ZOutput<T[number]>, ZUnionDef<T>, _ZInput<T[number]>> {
  readonly name = ZType.Union
  readonly hint = this._def.options.map(option => option.hint).join(' | ')

  get options(): T {
    return this._def.options
  }

  static create = <T extends AnyZ[]>(...options: F.Narrow<T>): ZUnion<T> => {
    return new ZUnion({
      validator: ZValidator.alternatives(options.map(option => option._validator)),
      options: options as T,
    })
  }
}

export type AnyZUnion = ZUnion<AnyZ[]>

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                      ZUnknown                                                      */
/* ------------------------------------------------------------------------------------------------------------------ */

export type ZUnknownDef = ZDef<{ validator: ZAnySchema }>

export class ZUnknown extends Z<unknown, ZUnknownDef> {
  readonly name = ZType.Unknown
  readonly hint = 'unknown'

  static create = (): ZUnknown => new ZUnknown({ validator: ZValidator.any() })
}

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                        ZVoid                                                       */
/* ------------------------------------------------------------------------------------------------------------------ */

export type ZVoidDef = ZDef<{ validator: ZAnySchema }>

export class ZVoid extends Z<void, ZVoidDef> {
  readonly name = ZType.Void
  readonly hint = 'void'

  static create = (): ZVoid =>
    new ZVoid({ validator: ZValidator.custom(ZValidator.any(), (_, { OK }) => OK(undefined)) })
}

/* ------------------------------------------------------------------------------------------------------------------ */

export type TypeOf<Z extends AnyZ> = A.Compute<_ZOutput<Z>, 'deep'>
