import type Joi from 'joi'

import { type ZDef, Z, ZSchema, ZType, ZValidator } from '../_internals'

/* ------------------------------------------------------------------------------------------------------------------ */
/*                                                     ZUndefined                                                     */
/* ------------------------------------------------------------------------------------------------------------------ */

export class ZUndefined extends Z<ZDef<{ Output: undefined; Validator: ZSchema<Joi.AnySchema> }>> {
  readonly name = ZType.Undefined
  readonly hint = 'undefined'

  static create = (): ZUndefined => new ZUndefined({ validator: ZValidator.any().forbidden().optional() }, {})
}
