import Joi from 'joi'

import type { ZDef } from '../def'
import { ZType } from '../type'
import { Z } from './z'

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                        ZVoid                                                       */
/* ------------------------------------------------------------------------------------------------------------------ */

export type ZVoidDef = ZDef<{ validator: Joi.Schema<void> }>

export class ZVoid extends Z<void, ZVoidDef> {
  readonly name = ZType.Void
  readonly hint = 'void'

  static create = (): ZVoid => {
    return new ZVoid({
      validator: Joi.any(),
    })
  }
}
