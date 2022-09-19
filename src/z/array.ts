import type Joi from 'joi'
import type { NonNegativeInteger, ReadonlyTuple } from 'type-fest'

import {
  type _ZInput,
  type _ZOutput,
  type AnyZ,
  type ZCheckOptions,
  type ZHooksObject,
  type ZManifestObject,
  SomeZObject,
  Z,
  ZJoi,
  ZType,
} from '../_internals'
import { generateZHint } from '../utils'

/* -------------------------------------------------------------------------- */
/*                                   ZArray                                   */
/* -------------------------------------------------------------------------- */

export type ZArraySortOptions<T extends AnyZ> = ZCheckOptions<
  'array.sort',
  {
    strict?: boolean
    by?: T extends SomeZObject ? Extract<keyof T['shape'], 'string'> : never
  }
>

/* -------------------------------------------------------------------------- */

type ZArrayDef<T extends AnyZ, Card extends 'many' | 'atleastone' | number> = {
  Output: Card extends number
    ? ReadonlyTuple<_ZOutput<T>, Card>
    : Card extends 'atleastone'
    ? [_ZOutput<T>, ..._ZOutput<T>[]]
    : _ZOutput<T>[]
  Input: Card extends number
    ? ReadonlyTuple<_ZInput<T>, Card>
    : Card extends 'atleastone'
    ? [_ZInput<T>, ..._ZInput<T>[]]
    : _ZInput<T>[]
  Schema: Joi.ArraySchema
  Element: T
  Cardinality: Card
}

export class ZArray<
  T extends AnyZ,
  Card extends 'many' | 'atleastone' | number = 'many'
> extends Z<ZArrayDef<T, Card>> {
  readonly name = ZType.Array
  protected readonly _hint = generateZHint(() => {
    const { element, cardinality } = this._props.getAll()

    if (typeof cardinality === 'number') {
      return `[${[...Array(cardinality)].fill(element.hint).join(', ')}]`
    }

    if (cardinality === 'atleastone') {
      return `[${element.hint}, ...${element.hint}[]]`
    }

    return `Array<${element.hint}>`
  })

  get element(): T {
    return this._props.getOne('element')
  }

  /**
   * Requires the input to be an array in ascending order.
   *
   * The schema will attempt to convert the input to the correct order by default.
   * You can disable this behavior by passing `{ strict: true }` as an option.
   *
   * @param {ZArraySortOptions} [options] - Options for this rule.
   */
  ascending(options?: ZArraySortOptions<T>): this {
    options?.strict && this._schema.updatePreferences({ convert: false })
    this._addCheck(
      'array.sort',
      v =>
        v.sort({
          order: 'ascending',
          by: typeof options?.by === 'string' ? options.by : undefined,
        }),
      {
        message: options?.message,
      }
    )
    return this
  }
  /**
   * Requires the input to be an array in descending order.
   *
   * The schema will attempt to convert the input to the correct order by default.
   * You can disable this behavior by passing `{ strict: true }` as an option.
   *
   * @param {ZArraySortOptions} [options] - Options for this rule.
   */
  descending(options?: ZArraySortOptions<T>): this {
    options?.strict && this._schema.updatePreferences({ convert: false })
    this._addCheck(
      'array.sort',
      v =>
        v.sort({
          order: 'descending',
          by: typeof options?.by === 'string' ? options.by : undefined,
        }),
      {
        message: options?.message,
      }
    )
    return this
  }

  /**
   * Requires the array to have at least a certain number of elements (inclusive).
   *
   * @param min - The minimum number of elements in the array.
   * @param {ZCheckOptions<'array.min'>} [options] - Options for this rule.
   */
  min<T extends number>(
    min: NonNegativeInteger<T>,
    options?: ZCheckOptions<'array.min'>
  ): this {
    this._addCheck('array.min', v => v.min(min), options)
    return this
  }
  /**
   * Requires the array to have at most a certain number of elements (inclusive).
   *
   * @param max - The maximum number of elements in the array.
   * @param {ZCheckOptions<'array.max'>} [options] - Options for this rule.
   */
  max<T extends number>(
    max: NonNegativeInteger<T>,
    options?: ZCheckOptions<'array.max'>
  ): this {
    this._addCheck('array.max', v => v.max(max), options)
    return this
  }

  /**
   * Requires the array to have an exact number of elements.
   *
   * @param length - The number of elements in the array.
   * @param {ZCheckOptions<'array.length'>} [options] - Options for this rule.
   */
  length<L extends number>(
    length: NonNegativeInteger<L>,
    options?: ZCheckOptions<'array.length'>
  ): ZArray<T, L> {
    this._addCheck('array.length', v => v.length(length), options)
    return new ZArray<T, L>(
      {
        schema: this._schema.get(),
        manifest: this._manifest.get() as ZManifestObject<
          _ZOutput<ZArrayDef<T, L>>
        >,
        hooks: this._hooks.get() as ZHooksObject<ZArrayDef<T, L>>,
      },
      { element: this._props.getOne('element'), cardinality: length }
    )
  }

  /**
   * Requires the array to have at least one element.
   *
   * @param {ZCheckOptions<'array.min'>} [options] - Options for this rule.
   */
  nonempty(options?: ZCheckOptions<'array.min'>): ZArray<T, 'atleastone'> {
    const updated = this.min(1, options)
    return new ZArray<T, 'atleastone'>(
      {
        schema: updated._schema.get(),
        manifest: updated._manifest.get() as ZManifestObject<
          _ZOutput<ZArrayDef<T, 'atleastone'>>
        >,
        hooks: updated._hooks.get() as ZHooksObject<ZArrayDef<T, 'atleastone'>>,
      },
      { element: updated._props.getOne('element'), cardinality: 'atleastone' }
    )
  }

  /* ------------------------------------------------------------------------ */

  static create = <T extends AnyZ>(element: T): ZArray<T> =>
    new ZArray(
      {
        schema: ZJoi.array().items(element._schema.get()),
        manifest: {
          element: element._manifest.get(),
        },
        hooks: {},
      },
      { element, cardinality: 'many' }
    )
}

/* -------------------------------------------------------------------------- */

export type AnyZArray = ZArray<AnyZ, 'many' | 'atleastone'>
