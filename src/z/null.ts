import Joi from 'joi'

import type { ZDef } from '../def'
import { ZType } from '../type'
import { Z } from './z'

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                        ZNull                                                       */
/* ------------------------------------------------------------------------------------------------------------------ */

export type ZNullDef = ZDef<{ validator: Joi.AnySchema<null> }>

export class ZNull extends Z<null, ZNullDef> {
  readonly name = ZType.Null
  readonly hint = 'null'

  static create = (): ZNull => {
    return new ZNull({
      validator: Joi.allow(null),
    })
  }
}
