import type Joi from 'joi'
import type { Integer, ReadonlyTuple } from 'type-fest'

import {
  type _ZInput,
  type _ZOutput,
  type AnyZ,
  type ZCheckOptions,
  type ZHooksObject,
  type ZManifestObject,
  Z,
  ZJoi,
  ZType,
} from '../_internals'
import { isComplexHint } from '../utils'

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                       ZArray                                                       */
/* ------------------------------------------------------------------------------------------------------------------ */

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

export class ZArray<T extends AnyZ, Card extends 'many' | 'atleastone' | number = 'many'> extends Z<
  ZArrayDef<T, Card>
> {
  readonly name = ZType.Array
  protected readonly _hint =
    this._props.getOne('cardinality') === 'atleastone'
      ? `[${this._props.getOne('element').hint}, ...${this._props.getOne('element').hint}[]]`
      : isComplexHint(this._props.getOne('element').hint)
      ? `Array<${this._props.getOne('element').hint}>`
      : `${this._props.getOne('element').hint}[]`

  get element(): T {
    return this._props.getOne('element')
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
  min<T extends number>(min: Integer<T>, options?: ZCheckOptions<'array.min'>): this {
    this._addCheck('array.min', v => v.min(min), options)
    return this
  }
  /**
   * Requires the array to have at most a certain number of elements.
   *
   * @param max - The maximum number of elements in the array.
   */
  max<T extends number>(max: Integer<T>, options?: ZCheckOptions<'array.max'>): this {
    this._addCheck('array.max', v => v.max(max), options)
    return this
  }
  /**
   * Requires the array to have an exact number of elements.
   *
   * @param length - The number of elements in the array.
   */
  length<L extends number>(length: Integer<L>, options?: ZCheckOptions<'array.length'>): ZArray<T, L> {
    this._addCheck('array.length', v => v.length(length), options)
    return new ZArray<T, L>(
      {
        schema: this._schema.get(),
        manifest: this._manifest.get() as ZManifestObject<_ZOutput<ZArrayDef<T, L>>>,
        hooks: this._hooks.get() as ZHooksObject<ZArrayDef<T, L>>,
      },
      { element: this._props.getOne('element'), cardinality: length }
    )
  }

  /**
   * Requires the array to have at least one element.
   */
  nonempty(options?: ZCheckOptions<'array.min'>): ZArray<T, 'atleastone'> {
    const updated = this.min(1, options)
    return new ZArray<T, 'atleastone'>(
      {
        schema: updated._schema.get(),
        manifest: updated._manifest.get() as ZManifestObject<_ZOutput<ZArrayDef<T, 'atleastone'>>>,
        hooks: updated._hooks.get() as ZHooksObject<ZArrayDef<T, 'atleastone'>>,
      },
      { element: updated._props.getOne('element'), cardinality: 'atleastone' }
    )
  }

  /* ---------------------------------------------------------------------------------------------------------------- */

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

export type AnyZArray = ZArray<AnyZ, 'many' | 'atleastone'>
