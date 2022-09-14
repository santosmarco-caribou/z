import type Joi from 'joi'

import {
  type ZDef,
  AnyZ,
  Z,
  ZCheckOptions,
  ZInput,
  ZOutput,
  ZReadonly,
  ZReadonlyDeep,
  ZSchema,
  ZType,
  ZValidator,
} from '../_internals'
import { isComplexHint } from '../utils'

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                       ZArray                                                       */
/* ------------------------------------------------------------------------------------------------------------------ */

export class ZArray<T extends AnyZ, Card extends 'many' | 'atleastone' = 'many'> extends Z<
  ZDef<
    {
      Output: Card extends 'atleastone' ? [ZOutput<T>, ...ZOutput<T>[]] : ZOutput<T>[]
      Input: Card extends 'atleastone' ? [ZInput<T>, ...ZInput<T>[]] : ZInput<T>[]
      Validator: ZSchema<Joi.ArraySchema>
    },
    { Element: T; Cardinality: Card }
  >
> {
  readonly name = ZType.Array
  protected readonly _hint =
    this._props.cardinality === 'atleastone'
      ? `[${this._props.element.hint}, ...${this._props.element.hint}[]]`
      : isComplexHint(this._props.element.hint)
      ? `Array<${this._props.element.hint}>`
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
  min(min: number, options?: ZCheckOptions<'array.min'>): this {
    this._addCheck('array.min', v => v.min(min), options)
    return this
  }
  /**
   * Requires the array to have at most a certain number of elements.
   *
   * @param max - The maximum number of elements in the array.
   */
  max(max: number, options?: ZCheckOptions<'array.max'>): this {
    this._addCheck('array.max', v => v.max(max), options)
    return this
  }
  /**
   * Requires the array to have an exact number of elements.
   *
   * @param length - The number of elements in the array.
   */
  length(length: number, options?: ZCheckOptions<'array.length'>): this {
    this._addCheck('array.length', v => v.length(length), options)
    return this
  }

  /**
   * Requires the array to have at least one element.
   */
  nonempty(options?: ZCheckOptions<'array.min'>): ZArray<T, 'atleastone'> {
    return new ZArray<T, 'atleastone'>(
      { validator: this.min(1, options)._validator, hooks: this._hooks },
      { element: this._props.element, cardinality: 'atleastone' }
    )
  }

  /**
   * Transforms the array into a readonly version after parsing.
   */
  readonly(): ZReadonly<this> {
    return ZReadonly.create(this)
  }
  /**
   * Transforms the array and its items into a readonly version after parsing.
   */
  readonlyDeep(): ZReadonlyDeep<this> {
    return ZReadonlyDeep.create(this)
  }

  static create = <T extends AnyZ>(element: T): ZArray<T> =>
    new ZArray({ validator: ZValidator.array(element._validator), hooks: {} }, { element, cardinality: 'many' })
}

export type AnyZArray = ZArray<AnyZ, 'many' | 'atleastone'>
