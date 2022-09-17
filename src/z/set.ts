import Joi from 'joi'

import { _ZInput, _ZOutput, AnyZ, Z, ZCheckOptions, ZJoi, ZType } from '../_internals'

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                        ZSet                                                        */
/* ------------------------------------------------------------------------------------------------------------------ */

export class ZSet<T extends AnyZ> extends Z<{
  Output: Set<_ZOutput<T>>
  Input: Set<_ZInput<T>> | _ZInput<T>[]
  Schema: Joi.ArraySchema
  Element: T
}> {
  readonly name = ZType.Set
  protected readonly _hint = `Set<${this._getProp('element').hint}>`

  get element(): T {
    return this._getProp('element')
  }

  /**
   * Requires the Set to have at least a certain number of elements.
   *
   * @param min - The minimum number of elements in the Set.
   */
  min(min: number, options?: ZCheckOptions<'array.min'>): this {
    return this._addCheck('array.min', v => v.min(min), options)
  }
  /**
   * Requires the Set to have at most a certain number of elements.
   *
   * @param max - The maximum number of elements in the Set.
   */
  max(max: number, options?: ZCheckOptions<'array.max'>): this {
    return this._addCheck('array.max', v => v.max(max), options)
  }
  /**
   * Requires the Set to have a certain size.
   *
   * @param size - The exact number of elements in the Set.
   */
  size<S extends number>(size: S, options?: ZCheckOptions<'array.length'>): this {
    return this._addCheck('array.length', v => v.length(size), options)
  }

  /**
   * Requires the Set to have at least one element.
   */
  nonempty(options?: ZCheckOptions<'array.min'>): this {
    return this.min(1, options)
  }

  /* ---------------------------------------------------------------------------------------------------------------- */

  static create = <T extends AnyZ>(element: T): ZSet<T> =>
    new ZSet(
      {
        schema: ZJoi.array().items(element.$_schema).unique().cast('set').messages({
          'array.base': '{{#label}} must be either an array or a Set',
        }),
        manifest: {
          element: element.$_manifest,
        },
        hooks: {},
      },
      { element }
    )
}
