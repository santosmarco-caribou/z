import Joi from 'joi'
import type { ReadonlyDeep } from 'type-fest'

import {
  AnyZ,
  Z,
  ZCheckOptions,
  ZDef,
  ZInput,
  ZOutput,
  ZReadonly,
  ZReadonlyDeep,
  ZSchema,
  ZType,
  ZValidator,
} from '../_internals'

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                        ZSet                                                        */
/* ------------------------------------------------------------------------------------------------------------------ */

export type ZSetOptions = {
  readonly: boolean
}

export class ZSet<T extends AnyZ, Opts extends ZSetOptions = { size: null; readonly: false }> extends Z<
  ZDef<
    {
      Output: Opts['readonly'] extends true ? ReadonlyDeep<Set<ZOutput<T>>> : Set<ZOutput<T>>
      Input: Set<ZInput<T>> | ZInput<T>[]
      Validator: ZSchema<Joi.ArraySchema>
    },
    { element: T; options: Opts }
  >
> {
  readonly name = ZType.Set
  protected readonly _hint = `${this._props.options.readonly ? 'Readonly' : ''}Set<${this._props.element.hint}>`

  get element(): T {
    return this._props.element
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

  readonly(): ZReadonly<this> {
    return ZReadonly.create(this)
  }
  readonlyDeep(): ZReadonlyDeep<this> {
    return ZReadonlyDeep.create(this)
  }

  static create = <T extends AnyZ>(element: T): ZSet<T> =>
    new ZSet(
      {
        validator: ZValidator.array(element['_validator']).unique().cast('set').messages({
          'array.base': '{{#label}} must be either an array or a Set',
        }),
        hooks: {},
      },
      { element, options: { size: null, readonly: false } }
    )
}
