import type Joi from 'joi'

import { type ZDef, type ZSchema, Z, ZType, ZValidator } from '../_internals'

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                        ZAny                                                        */
/* ------------------------------------------------------------------------------------------------------------------ */

export class ZAny extends Z<ZDef<{ Output: any; Validator: ZSchema<Joi.AnySchema> }>> {
  readonly name = ZType.Any
  protected readonly _hint = 'any'

  static create = (): ZAny => new ZAny({ validator: ZValidator.any(), hooks: {} }, {})
}
