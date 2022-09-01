import Joi from 'joi'

import type { ZDef } from '../def'
import { ZType } from '../type'
import { Z } from './z'

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                        ZNull                                                       */
/* ------------------------------------------------------------------------------------------------------------------ */

export type ZNullDef = ZDef<{ type: ZType.Null; validator: Joi.AnySchema<null> }>

export class ZNull extends Z<null, ZNullDef> {
  readonly name = 'null'

  static create = (): ZNull => {
    return new ZNull({
      type: ZType.Null,
      validator: Joi.allow(null),
    })
  }
}
