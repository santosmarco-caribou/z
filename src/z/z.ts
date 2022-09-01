import Joi from 'joi'
import type { F } from 'ts-toolbelt'

import type { AnyZDef, ZDef } from '../def'
import { ManifestBasicInfoWithValue, ZManifest, ZManifestObject } from '../manifest'
import { ZType } from '../type'
import type { ZUtils } from '../utils'
import { type ParseOptions, type ParseResult, ZParser } from '../validation/parser'

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                          Z                                                         */
/* ------------------------------------------------------------------------------------------------------------------ */

export abstract class Z<Output, Def extends AnyZDef, Input = Output> {
  /**
   * @hidden
   */
  readonly $_output!: Output
  /**
   * @hidden
   */
  readonly $_input!: Input

  /**
   * @hidden
   */
  _validator: Def['validator']
  /**
   * @hidden
   */
  _def: Omit<Def, 'validator'>

  /**
   * @hidden
   */
  protected readonly _parser: ZParser<this>
  /**
   * @hidden
   */
  protected readonly _manifest: ZManifest<this>

  abstract readonly name: ZType
  abstract readonly hint: string

  protected constructor({ validator, ...def }: Def) {
    this._validator = validator
    this._def = def

    this._parser = ZParser.create(this)
    this._manifest = ZManifest.create(this)
  }

  get manifest(): ZManifestObject<Output> {
    return this._manifest.get()
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

  /* --------------------------------------------------- Manifest --------------------------------------------------- */

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

  isOptional(): boolean {
    return !this.safeParse(undefined).error
  }

  isNullable(): boolean {
    return !this.safeParse(null).error
  }
}

export type AnyZ = Z<any, AnyZDef>

export type ZOutput<Z extends AnyZ> = Z['$_output']
export type ZInput<Z extends AnyZ> = Z['$_input']
export type ZValidator<Z extends AnyZ> = Z['_validator']

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                      ZOptional                                                     */
/* ------------------------------------------------------------------------------------------------------------------ */

export type ZOptionalDef<T extends AnyZ> = ZDef<{ validator: ZValidator<T> }, { inner: T }>

export class ZOptional<T extends AnyZ> extends Z<ZOutput<T> | undefined, ZOptionalDef<T>, ZInput<T> | undefined> {
  readonly name = ZType.Optional
  readonly hint = `${this._def.inner.hint} | undefined`

  unwrap(): T {
    return this._def.inner
  }

  static create = <T extends AnyZ>(inner: T): ZOptional<T> => {
    return new ZOptional({
      validator: inner._validator.optional(),
      inner,
    })
  }
}

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                      ZNullable                                                     */
/* ------------------------------------------------------------------------------------------------------------------ */

export type ZNullableDef<T extends AnyZ> = ZDef<{ validator: ZValidator<T> }, { inner: T }>

export class ZNullable<T extends AnyZ> extends Z<ZOutput<T> | null, ZNullableDef<T>, ZInput<T> | null> {
  readonly name = ZType.Nullable
  readonly hint = `${this._def.inner.hint} | null`

  unwrap(): T {
    return this._def.inner
  }

  static create = <T extends AnyZ>(inner: T): ZNullable<T> => {
    return new ZNullable({
      validator: inner._validator.allow(null),
      inner,
    })
  }
}

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                      ZNullish                                                      */
/* ------------------------------------------------------------------------------------------------------------------ */

export type ZNullishDef<T extends AnyZ> = ZDef<{ validator: ZValidator<T> }, { inner: T }>

export class ZNullish<T extends AnyZ> extends Z<
  ZOutput<T> | null | undefined,
  ZNullishDef<T>,
  ZInput<T> | null | undefined
> {
  readonly name = ZType.Nullish
  readonly hint = `${this._def.inner.hint} | null | undefined`

  unwrap(): T {
    return this._def.inner
  }

  static create = <T extends AnyZ>(inner: T): ZNullish<T> => {
    return new ZNullish({
      validator: inner._validator.optional().allow(null),
      inner,
    })
  }
}

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                       ZUnion                                                       */
/* ------------------------------------------------------------------------------------------------------------------ */

export type ZUnionDef<T extends AnyZ[]> = ZDef<{ validator: Joi.AlternativesSchema }, { options: T }>

export class ZUnion<T extends AnyZ[]> extends Z<ZOutput<T[number]>, ZUnionDef<T>, ZInput<T[number]>> {
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
/*                                                       ZArray                                                       */
/* ------------------------------------------------------------------------------------------------------------------ */

export type ZArrayDef<T extends AnyZ> = ZDef<{ validator: Joi.ArraySchema }, { element: T }>

export class ZArray<T extends AnyZ> extends Z<ZOutput<T>[], ZArrayDef<T>, ZInput<T>[]> {
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
   * @param {number} min The minimum number of elements in the array.
   */
  min(min: number): this {
    return this._parser.addCheck(v => v.min(min))
  }
  /**
   * Requires the array to have at most a certain number of elements.
   *
   * @param {number} max The maximum number of elements in the array.
   */
  max(max: number): this {
    return this._parser.addCheck(v => v.max(max))
  }
  /**
   * Requires the array to have an exact number of elements.
   *
   * @param {number} length The number of elements in the array.
   */
  length(length: number): this {
    return this._parser.addCheck(v => v.length(length))
  }

  /* ---------------------------------------------------------------------------------------------------------------- */

  static create = <T extends AnyZ>(element: T): ZArray<T> => {
    return new ZArray({
      validator: Joi.array().items(element._validator).required(),
      element,
    })
  }
}

/* ------------------------------------------------------------------------------------------------------------------ */

export type TypeOf<Z extends AnyZ> = ZUtils.Simplify<ZOutput<Z>>
