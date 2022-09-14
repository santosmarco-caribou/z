import type Joi from 'joi'

import { AnyZ, Z, ZDef, ZInput, ZOutput, ZSchema, ZType, ZValidator } from '../_internals'
import type { MapToZInput, MapToZOutput } from '../utils'

export class ZTuple<T extends readonly [AnyZ, ...AnyZ[]], R extends AnyZ | undefined = undefined> extends Z<
  ZDef<
    {
      Output: R extends AnyZ ? [...MapToZOutput<T>, ...ZOutput<R>[]] : MapToZOutput<T>
      Input: R extends AnyZ ? [...MapToZInput<T>, ...ZInput<R>[]] : MapToZInput<T>
      Validator: ZSchema<Joi.ArraySchema>
    },
    { elements: T; restType?: R }
  >
> {
  readonly name = ZType.Tuple
  protected readonly _hint = `[${this._props.elements.map(element => element.hint).join(', ')}${
    this._props.restType ? `, ...${this._props.restType.hint}[]` : ''
  }]`

  /**
   * Retrieves the schemas of the tuple's elements.
   */
  get elements(): T {
    return this._props.elements
  }

  rest<_R extends AnyZ>(restType: _R): ZTuple<T, _R> {
    return new ZTuple<T, _R>(
      { validator: this._validator.items(restType._validator), hooks: this._hooks },
      { elements: this._props.elements, restType }
    )
  }

  static create = <T extends readonly [AnyZ, ...AnyZ[]], R extends AnyZ | undefined = undefined>(
    elements: T,
    restType?: R
  ): ZTuple<T, R> =>
    new ZTuple<T, R>(
      {
        validator: restType
          ? ZValidator.tuple(...elements.map(v => v['_validator'])).items(restType._validator)
          : ZValidator.tuple(...elements.map(v => v['_validator'])),
        hooks: {},
      },
      { elements, restType }
    )
}
