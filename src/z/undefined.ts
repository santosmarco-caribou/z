import Joi from 'joi'

import type { ZDef } from '../def'
import { ZType } from '../type'
import { Z } from './z'

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                     ZUndefined                                                     */
/* ------------------------------------------------------------------------------------------------------------------ */

export type ZUndefinedDef = ZDef<{ validator: Joi.AnySchema<undefined> }>

export class ZUndefined extends Z<undefined, ZUndefinedDef> {
  readonly name = ZType.Undefined
  readonly hint = 'undefined'

  static create = (): ZUndefined => {
    return new ZUndefined({
      validator: Joi.optional(),
    })
  }
}
