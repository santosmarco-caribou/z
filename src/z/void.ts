import type Joi from 'joi'

import { type ZDef, Z, ZSchema, ZType, ZValidator } from '../_internals'

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                        ZVoid                                                       */
/* ------------------------------------------------------------------------------------------------------------------ */

export class ZVoid extends Z<ZDef<{ Output: void; Validator: ZSchema<Joi.AnySchema> }>> {
  readonly name = ZType.Void
  readonly hint = 'void'

  static create = (): ZVoid => new ZVoid({ validator: ZValidator.any() }, {})
}
