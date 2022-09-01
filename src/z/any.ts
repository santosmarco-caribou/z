import Joi from 'joi'

import type { ZDef } from '../def'
import { ZType } from '../type'
import { Z } from './z'

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                        ZAny                                                        */
/* ------------------------------------------------------------------------------------------------------------------ */

export type ZAnyDef = ZDef<{ validator: Joi.AnySchema }>

export class ZAny extends Z<any, ZAnyDef> {
  readonly name = ZType.Any
  readonly hint = 'any'

  static create = (): ZAny => {
    return new ZAny({
      validator: Joi.any(),
    })
  }
}
