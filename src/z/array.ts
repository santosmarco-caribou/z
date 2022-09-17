import type Joi from 'joi'
import type { ReadonlyTuple } from 'type-fest'

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
    this._getProp('cardinality') === 'atleastone'
      ? `[${this._getProp('element').hint}, ...${this._getProp('element').hint}[]]`
      : isComplexHint(this._getProp('element').hint)
      ? `Array<${this._getProp('element').hint}>`
      : `${this._getProp('element').hint}[]`

  get element(): T {
    return this._getProp('element')
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
  length<L extends number>(length: L, options?: ZCheckOptions<'array.length'>): ZArray<T, L> {
    this._addCheck('array.length', v => v.length(length), options)
    return new ZArray<T, L>(
      {
        schema: this.$_schema,
        manifest: this.$_manifest as ZManifestObject<_ZOutput<ZArrayDef<T, L>>>,
        hooks: this.$_hooks as ZHooksObject<ZArrayDef<T, L>>,
      },
      { element: this._getProp('element'), cardinality: length }
    )
  }

  /**
   * Requires the array to have at least one element.
   */
  nonempty(options?: ZCheckOptions<'array.min'>): ZArray<T, 'atleastone'> {
    const updated = this.min(1, options)
    return new ZArray<T, 'atleastone'>(
      {
        schema: updated.$_schema,
        manifest: updated.$_manifest as ZManifestObject<_ZOutput<ZArrayDef<T, 'atleastone'>>>,
        hooks: updated.$_hooks as ZHooksObject<ZArrayDef<T, 'atleastone'>>,
      },
      { element: updated._getProp('element'), cardinality: 'atleastone' }
    )
  }

  /* ---------------------------------------------------------------------------------------------------------------- */

  static create = <T extends AnyZ>(element: T): ZArray<T> =>
    new ZArray(
      {
        schema: ZJoi.array().items(element.$_schema),
        manifest: {
          element: element.$_manifest,
        },
        hooks: {},
      },
      { element, cardinality: 'many' }
    )
}

export type AnyZArray = ZArray<AnyZ, 'many' | 'atleastone'>
