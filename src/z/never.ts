import Joi from 'joi'

import type { ZDef } from '../def'
import { ZType } from '../type'
import { Z } from './z'

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                       ZNever                                                       */
/* ------------------------------------------------------------------------------------------------------------------ */

export type ZNeverDef = ZDef<{ validator: Joi.Schema<never> }>

export class ZNever extends Z<never, ZNeverDef> {
  readonly name = ZType.Never
  readonly hint = 'never'

  static create = (): ZNever => {
    return new ZNever({
      validator: Joi.forbidden().required(), // allows no values
    })
  }
}
