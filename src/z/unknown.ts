import Joi from 'joi'

import type { ZDef } from '../def'
import { ZType } from '../type'
import { Z } from './z'

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                      ZUnknown                                                      */
/* ------------------------------------------------------------------------------------------------------------------ */

export type ZUnknownDef = ZDef<{ validator: Joi.AnySchema<unknown> }>

export class ZUnknown extends Z<unknown, ZUnknownDef> {
  readonly name = ZType.Unknown
  readonly hint = 'unknown'

  static create = (): ZUnknown => {
    return new ZUnknown({
      validator: Joi.any(),
    })
  }
}
