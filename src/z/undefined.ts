import Joi from 'joi'

import type { ZDef } from '../def'
import { ZType } from '../type'
import { Z } from './z'

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                     ZUndefined                                                     */
/* ------------------------------------------------------------------------------------------------------------------ */

export type ZUndefinedDef = ZDef<{ type: ZType.Undefined; validator: Joi.AnySchema<undefined> }>

export class ZUndefined extends Z<undefined, ZUndefinedDef> {
  readonly name = 'undefined'

  static create = (): ZUndefined => {
    return new ZUndefined({
      type: ZType.Undefined,
      validator: Joi.optional(),
    })
  }
}
