import Joi from 'joi'
import type { F } from 'ts-toolbelt'

import type { ZDef } from '../def'
import { ZType } from '../type'
import type { ZUtils } from '../utils'
import { AnyZ, Z } from './z'

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                       ZTuple                                                       */
/* ------------------------------------------------------------------------------------------------------------------ */

export type ZTupleDef<T extends AnyZ[]> = ZDef<{ type: ZType.Tuple; validator: Joi.ArraySchema }, { elements: T }>

export class ZTuple<T extends AnyZ[]> extends Z<ZUtils.MapToZOutput<T>, ZTupleDef<T>, ZUtils.MapToZInput<T>> {
  readonly name = `[${this._def.elements.map(element => element.name).join(', ')}]`

  /**
   * Retrieves the schemas of the tuple's elements.
   */
  get elements(): T {
    return this._def.elements
  }

  static create = <T extends AnyZ[]>(elements: F.Narrow<T>): ZTuple<T> => {
    return new ZTuple({
      type: ZType.Tuple,
      validator: Joi.array()
        .items(...elements.map(v => v._validator))
        .required(),
      elements: elements as T,
    })
  }
}

/* ------------------------------------------------------------------------------------------------------------------ */

export type AnyZTuple = ZTuple<AnyZ[]>
