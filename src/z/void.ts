import Joi from 'joi'

import type { ZDef } from '../def'
import { ZType } from '../type'
import { Z } from './z'

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                        ZVoid                                                       */
/* ------------------------------------------------------------------------------------------------------------------ */

export type ZVoidDef = ZDef<{ type: ZType.Void; validator: Joi.Schema<void> }>

export class ZVoid extends Z<void, ZVoidDef> {
  readonly name = 'void'

  static create = (): ZVoid => {
    return new ZVoid({
      type: ZType.Void,
      validator: Joi.any(),
    })
  }
}
