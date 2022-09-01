import Joi from 'joi'

import type { ZDef } from '../def'
import { ZType } from '../type'
import { Z } from './z'

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                      ZUnknown                                                      */
/* ------------------------------------------------------------------------------------------------------------------ */

export type ZUnknownDef = ZDef<{ type: ZType.Unknown; validator: Joi.AnySchema<unknown> }>

export class ZUnknown extends Z<unknown, ZUnknownDef> {
  readonly name = 'unknown'

  static create = (): ZUnknown => {
    return new ZUnknown({
      type: ZType.Unknown,
      validator: Joi.any(),
    })
  }
}
