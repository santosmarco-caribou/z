import type Joi from 'joi'
import type { A } from 'ts-toolbelt'

import {
  type _ZInput,
  type _ZOutput,
  type AnyZ,
  Z,
  ZJoi,
  ZType,
} from '../_internals'
import type { MapToZInput, MapToZOutput } from '../utils'

/* -------------------------------------------------------------------------- */
/*                                   ZTuple                                   */
/* -------------------------------------------------------------------------- */

export class ZTuple<
  T extends readonly [AnyZ, ...AnyZ[]] | [],
  R extends AnyZ = never
> extends Z<{
  Output: A.Equals<[R], [never]> extends 1
    ? [...MapToZOutput<T>, ..._ZOutput<R>[]]
    : MapToZOutput<T>
  Input: A.Equals<[R], [never]> extends 1
    ? [...MapToZInput<T>, ..._ZInput<R>[]]
    : MapToZInput<T>
  Schema: Joi.ArraySchema
  Elements: T
  RestType?: R
}> {
  readonly name = ZType.Tuple
  protected readonly _hint = `[${this._props
    .getOne('elements')
    .map(element => element.hint)
    .join(', ')}${
    this._props.getOne('restType')
      ? `, ...${this._props.getOne('restType')?.hint ?? ''}[]`
      : ''
  }]`

  /**
   * Retrieves the schemas of the tuple's elements.
   */
  get elements(): T {
    return this._props.getOne('elements')
  }

  rest<_R extends AnyZ>(restType: _R): ZTuple<T, _R> {
    return new ZTuple<T, _R>(
      {
        schema: this._schema.get().items(restType._schema.get()),
        manifest: {
          ...this._manifest.get(),
          rest: restType._manifest.get(),
        },
        hooks: this._hooks.get(),
      },
      { elements: this._props.getOne('elements'), restType }
    )
  }

  /* ------------------------------------------------------------------------ */

  static create = <
    T extends readonly [AnyZ, ...AnyZ[]] | [],
    R extends AnyZ = never
  >(
    elements: T,
    restType?: R
  ): ZTuple<T, R> =>
    new ZTuple<T, R>(
      {
        schema: restType
          ? ZJoi.array()
              .ordered(...elements.map(v => v._schema.get()))
              .items(restType._schema.get())
          : ZJoi.array().ordered(...elements.map(v => v._schema.get())),
        manifest: {
          elements: elements.map(el => el._manifest.get()),
          rest: restType?._manifest.get(),
        },
        hooks: {},
      },
      { elements, restType }
    )
}
