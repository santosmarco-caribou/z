import Joi from 'joi'

import type { ZDef } from '../def'
import { ZType } from '../type'
import { Z } from './z'

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                        ZAny                                                        */
/* ------------------------------------------------------------------------------------------------------------------ */

export type ZAnyDef = ZDef<{ type: ZType.Any; validator: Joi.AnySchema }>

export class ZAny extends Z<any, ZAnyDef> {
  readonly name = 'any'

  static create = (): ZAny => {
    return new ZAny({
      type: ZType.Any,
      validator: Joi.any(),
    })
  }
}
