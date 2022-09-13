import type Joi from 'joi'

import { type ZDef, Z, ZSchema, ZType, ZValidator } from '../_internals'

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                        ZAny                                                        */
/* ------------------------------------------------------------------------------------------------------------------ */

export class ZAny extends Z<ZDef<{ Output: any; Validator: ZSchema<Joi.AnySchema> }>> {
  readonly name = ZType.Any
  readonly hint = 'any'

  static create = (): ZAny => new ZAny({ validator: ZValidator.any() }, {})
}
