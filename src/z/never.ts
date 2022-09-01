import Joi from 'joi'

import type { ZDef } from '../def'
import { ZType } from '../type'
import { Z } from './z'

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                       ZNever                                                       */
/* ------------------------------------------------------------------------------------------------------------------ */

export type ZNeverDef = ZDef<{ type: ZType.Never; validator: Joi.Schema<never> }>

export class ZNever extends Z<never, ZNeverDef> {
  readonly name = 'never'

  static create = (): ZNever => {
    return new ZNever({
      type: ZType.Never,
      validator: Joi.forbidden().required(), // allows no values
    })
  }
}
