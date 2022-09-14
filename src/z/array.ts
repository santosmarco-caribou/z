import type Joi from 'joi'

import {
  type ZDef,
  AnyZ,
  Z,
  ZCheckOptions,
  ZHookName,
  ZInput,
  ZOutput,
  ZSchema,
  ZType,
  ZValidator,
} from '../_internals'
import { isComplexHint, MaxLengthArray, MinLengthArray, MinMaxLengthArray } from '../utils'

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                       ZArray                                                       */
/* ------------------------------------------------------------------------------------------------------------------ */

export type ZArrayOptions = {
  minLength: number | null
  maxLength: number | null
}

export class ZArray<T extends AnyZ, Opts extends ZArrayOptions = { minLength: null; maxLength: null }> extends Z<
  ZDef<
    {
      Output: Opts['minLength'] extends number
        ? Opts['maxLength'] extends number
          ? MinMaxLengthArray<ZOutput<T>, Opts['minLength'], Opts['maxLength']>
          : MinLengthArray<ZOutput<T>, Opts['minLength']>
        : Opts['maxLength'] extends number
        ? MaxLengthArray<ZOutput<T>, Opts['maxLength']>
        : ZOutput<T>[]
      Input: Opts['minLength'] extends number
        ? Opts['maxLength'] extends number
          ? MinMaxLengthArray<ZInput<T>, Opts['minLength'], Opts['maxLength']>
          : MinLengthArray<ZInput<T>, Opts['minLength']>
        : Opts['maxLength'] extends number
        ? MaxLengthArray<ZInput<T>, Opts['maxLength']>
        : ZInput<T>[]
      Validator: ZSchema<Joi.ArraySchema>
    },
    { Element: T; Options: Opts }
  >
> {
  readonly name = ZType.Array
  protected readonly _hint =
    this._props.options.minLength === null && this._props.options.maxLength === null
      ? isComplexHint(this._props.element.hint)
        ? `Array<${this._props.element.hint}>`
        : `${this._props.element.hint}[]`
      : typeof this._props.options.minLength === 'number' && typeof this._props.options.maxLength === 'number'
      ? this._props.options.minLength > 20
        ? `[${new Array(10).fill(this._props.element.hint).join(', ')}, ... ${
            this._props.options.minLength - 11
          } more ..., ${this._props.element.hint}]`
        : `[${new Array(this._props.options.minLength).fill(this._props.element.hint).join(', ')}]`
      : typeof this._props.options.minLength === 'number'
      ? `[${new Array(this._props.options.minLength).fill(this._props.element.hint).join(', ')}, ...${
          this._props.element.hint
        }[]]`
      : typeof this._props.options.maxLength === 'number'
      ? `[${new Array(this._props.options.maxLength).fill(this._props.element.hint).join('?, ')}?]`
      : `${this._props.element.hint}[]`

  get element(): T {
    return this._props.element
  }

  /**
   * Requires the array to be in ascending order.
   */
  ascending(options?: ZCheckOptions<'array.sort'>): this {
    this._addCheck('array.sort', v => v.sort({ order: 'ascending' }), options)
    return this
  }
  /**
   * Requires the array to be in descending order.
   */
  descending(options?: ZCheckOptions<'array.sort'>): this {
    this._addCheck('array.sort', v => v.sort({ order: 'descending' }), options)
    return this
  }

  /**
   * Requires the array to have at least a certain number of elements.
   *
   * @param min - The minimum number of elements in the array.
   */
  min<L extends number>(
    min: L,
    options?: ZCheckOptions<'array.min'>
  ): ZArray<T, { minLength: L; maxLength: Opts['maxLength'] }> {
    return new ZArray<T, { minLength: L; maxLength: Opts['maxLength'] }>(
      { validator: this._addCheck('array.min', v => v.min(min), options)._validator, hooks: this._hooks },
      { element: this._props.element, options: { ...this._props.options, minLength: min } }
    )
  }
  /**
   * Requires the array to have at most a certain number of elements.
   *
   * @param max - The maximum number of elements in the array.
   */
  max<L extends number>(
    max: L,
    options?: ZCheckOptions<'array.max'>
  ): ZArray<T, { maxLength: L; minLength: Opts['minLength'] }> {
    return new ZArray<T, { maxLength: L; minLength: Opts['minLength'] }>(
      { validator: this._addCheck('array.max', v => v.max(max), options)._validator, hooks: this._hooks },
      { element: this._props.element, options: { ...this._props.options, maxLength: max } }
    )
  }
  /**
   * Requires the array to have an exact number of elements.
   *
   * @param length - The number of elements in the array.
   */
  length<L extends number>(
    length: L,
    options?: ZCheckOptions<'array.length'>
  ): ZArray<T, { minLength: L; maxLength: L }> {
    return new ZArray<T, { minLength: L; maxLength: L }>(
      { validator: this._addCheck('array.length', v => v.length(length), options)._validator, hooks: this._hooks },
      { element: this._props.element, options: { minLength: length, maxLength: length } }
    )
  }

  /**
   * Requires the array to have at least one element.
   */
  nonempty(options?: ZCheckOptions<'array.min'>): ZArray<T, { minLength: 1; maxLength: null }> {
    return this.min(1, options)
  }

  readonly(): ZReadonlyArray<this> {
    return ZReadonlyArray.create(this)
  }

  static create = <T extends AnyZ>(element: T): ZArray<T> =>
    new ZArray<
      T,
      {
        minLength: null
        maxLength: null
      }
    >(
      { validator: ZValidator.array(element._validator), hooks: {} },
      { element, options: { minLength: null, maxLength: null } }
    )
}

export type AnyZArray = ZArray<AnyZ>

/* ------------------------------------------------- ZReadonlyArray ------------------------------------------------- */

export class ZReadonlyArray<T extends AnyZArray> extends Z<
  ZDef<
    { Output: ReadonlyArray<ZOutput<T>>; Input: ReadonlyArray<ZInput<T>>; Validator: ZSchema<Joi.ArraySchema> },
    { InnerArray: T }
  >
> {
  readonly name = ZType.ReadonlyArray
  protected readonly _hint = this._props.innerArray.hint.startsWith('Array')
    ? `Readonly${this._props.innerArray.hint}`
    : `readonly ${this._props.innerArray.hint}`

  writable(): T {
    this._removeHook('afterParse', ZHookName.MakeArrayReadonly)
    return this._props.innerArray
  }

  static create = <T extends AnyZArray>(innerArray: T): ZReadonlyArray<T> =>
    new ZReadonlyArray(
      {
        validator: innerArray._validator,
        hooks: {
          afterParse: [{ name: ZHookName.MakeArrayReadonly, handler: Object.freeze }],
        },
      },
      { innerArray }
    )
}
