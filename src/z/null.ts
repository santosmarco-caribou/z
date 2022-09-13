import type Joi from 'joi'

import { type ZDef, Z, ZSchema, ZType, ZValidator } from '../_internals'

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                        ZNull                                                       */
/* ------------------------------------------------------------------------------------------------------------------ */

export class ZNull extends Z<ZDef<{ Output: void; Validator: ZSchema<Joi.AnySchema> }>> {
  readonly name = ZType.Null
  protected readonly _hint = 'null'

  static create = (): ZNull => new ZNull({ validator: ZValidator.any().valid(null), hooks: {} }, {})
}
